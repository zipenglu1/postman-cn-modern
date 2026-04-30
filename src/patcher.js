import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { entryMatchesFile, listLocalCoreFiles } from './fileRules.js';

const PRELOAD_LOCALIZER_MARKER = 'postman-cn remote UI localizer';

export async function applyPatches({ appDir, version, dictionary, dryRun = false }) {
  const files = await listLocalCoreFiles(appDir);
  const entryHits = new Map(dictionary.entries.map((entry, index) => [index, 0]));
  const changedFiles = [];
  let replacements = 0;

  for (const file of files) {
    const filePath = join(appDir, file);
    let content = await readFile(filePath, 'utf8');
    let next = content;
    let fileChanged = false;
    const applicableEntries = dictionary.entries
      .map((entry, index) => ({ entry, index }))
      .filter((item) => !item.entry.runtimeOnly)
      .filter((item) => entryMatchesFile(item.entry, file));
    const literalEntries = applicableEntries
      .filter((item) => item.entry.match === 'literal')
      .filter((item) => (item.entry.files?.length ?? 0) > 0);
    const regexEntries = applicableEntries.filter((item) => item.entry.match === 'regex');

    if (literalEntries.length > 0) {
      const result = replaceLiteralEntriesInTextContexts(next, literalEntries, file);
      if (result.count > 0) {
        next = result.content;
        fileChanged = true;
        replacements += result.count;
        for (const [index, count] of result.entryCounts) {
          entryHits.set(index, entryHits.get(index) + count);
        }
      }
    }

    for (const { entry, index } of regexEntries) {
      const result = replaceRegexEntry(next, entry);
      if (result.count === 0) continue;
      next = result.content;
      fileChanged = true;
      replacements += result.count;
      entryHits.set(index, entryHits.get(index) + result.count);
    }

    if (fileChanged) {
      changedFiles.push(file);
      if (!dryRun) await writeFile(filePath, next);
    }
  }

  const preloadResult = await injectPreloadLocalizer({ appDir, dictionary, dryRun });
  if (preloadResult.changed) {
    changedFiles.push(preloadResult.file);
    replacements += preloadResult.entries;
    for (const index of preloadResult.entryIndexes) {
      entryHits.set(index, Math.max(1, entryHits.get(index)));
    }
  }

  const missingEntries = dictionary.entries
    .map((entry, index) => ({ entry, hits: entryHits.get(index) }))
    .filter((item) => item.hits === 0)
    .map((item) => ({
      source: item.entry.source,
      target: item.entry.target,
      match: item.entry.match,
      files: item.entry.files
    }));

  return {
    version,
    scannedFiles: files.length,
    changedFiles,
    replacements,
    preloadLocalizer: preloadResult.summary,
    missingEntries
  };
}

async function injectPreloadLocalizer({ appDir, dictionary, dryRun }) {
  const file = 'preload_desktop.js';
  const preloadPath = join(appDir, file);
  let content;

  try {
    content = await readFile(preloadPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        changed: false,
        file,
        entries: 0,
        entryIndexes: [],
        summary: { injected: false, reason: `${file} not found` }
      };
    }
    throw error;
  }

  if (content.includes(PRELOAD_LOCALIZER_MARKER)) {
    return {
      changed: false,
      file,
      entries: 0,
      entryIndexes: [],
      summary: { injected: false, reason: 'already present' }
    };
  }

  const localizerEntries = dictionary.entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.match === 'literal')
    .filter(({ entry }) => isRemoteUiCandidate(entry));

  if (localizerEntries.length === 0) {
    return {
      changed: false,
      file,
      entries: 0,
      entryIndexes: [],
      summary: { injected: false, reason: 'no literal dictionary entries' }
    };
  }

  const snippet = buildPreloadLocalizerSnippet(localizerEntries.map(({ entry }) => ({
    source: entry.source,
    target: entry.target,
    runtimeStrategy: entry.runtimeStrategy ?? 'exact'
  })));
  if (!dryRun) await writeFile(preloadPath, `${content}\n${snippet}`);

  return {
    changed: true,
    file,
    entries: localizerEntries.length,
    entryIndexes: localizerEntries.map(({ index }) => index),
    summary: { injected: true, file, entries: localizerEntries.length }
  };
}

function isRemoteUiCandidate(entry) {
  const maxSourceLength = entry.runtimeStrategy === 'phrase' ? 180 : 220;
  const maxTargetLength = entry.runtimeStrategy === 'phrase' ? 220 : 280;
  if (entry.source.length < 2 || entry.source.length > maxSourceLength || entry.target.length > maxTargetLength) return false;
  if (!/[A-Za-z]/.test(entry.source)) return false;
  if (/[\r\n\t]/.test(entry.source) || /[\r\n\t]/.test(entry.target)) return false;
  if (/^\s*['"`].*['"`]\s*$/.test(entry.source)) return false;
  if (/[{}]|=>|<[^>]+>|\$\{/.test(entry.source)) return false;
  return true;
}

function buildPreloadLocalizerSnippet(entries) {
  const exactEntries = [];
  const phraseEntries = [];
  const seen = new Set();

  for (const entry of entries) {
    const key = `${entry.runtimeStrategy}\u0000${entry.source}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const pair = [entry.source, entry.target];
    if (entry.runtimeStrategy === 'phrase') {
      phraseEntries.push(pair);
    } else {
      exactEntries.push(pair);
    }
  }
  phraseEntries.sort((a, b) => b[0].length - a[0].length);

  return `
;(() => {
  // ${PRELOAD_LOCALIZER_MARKER}
  const exactDictionary = new Map(${JSON.stringify(exactEntries)});
  const phraseDictionary = ${JSON.stringify(phraseEntries)};
  const attributes = ['aria-label', 'title', 'placeholder'];
  const skipTags = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'KBD', 'SAMP']);
  const editorSelector = '.monaco-editor, .CodeMirror, .cm-editor, .ace_editor';
  const isInsideEditor = (node) => {
    let el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    while (el) {
      if (el.getAttribute && (el.getAttribute('contenteditable') === 'true' || el.getAttribute('contenteditable') === '')) return true;
      if (el.matches && el.matches(editorSelector)) return true;
      el = el.parentElement;
    }
    return false;
  };
  const replaceText = (value) => {
    if (!value || typeof value !== 'string') return value;
    const direct = exactDictionary.get(value);
    if (direct) return direct;
    const trimmed = value.trim();
    if (trimmed && trimmed !== value) {
      const translated = exactDictionary.get(trimmed);
      if (translated) {
        const prefix = value.match(/^\\s*/)[0];
        const suffix = value.match(/\\s*$/)[0];
        return prefix + translated + suffix;
      }
    }
    let next = value;
    for (const [source, target] of phraseDictionary) {
      if (next.includes(source)) next = next.split(source).join(target);
    }
    return next;
  };
  const localizeNode = (node) => {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      if (isInsideEditor(node)) return;
      const next = replaceText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (skipTags.has(node.tagName)) return;
    if (isInsideEditor(node)) return;
    for (const attribute of attributes) {
      const value = node.getAttribute(attribute);
      const next = replaceText(value);
      if (next !== value) node.setAttribute(attribute, next);
    }
    for (const child of node.childNodes) enqueue(child);
  };
  const queue = [];
  let scheduled = false;
  const schedule = (callback) => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(callback, { timeout: 500 });
    } else {
      window.setTimeout(() => callback({ timeRemaining: () => 8 }), 16);
    }
  };
  const enqueue = (node) => {
    if (!node) return;
    queue.push(node);
    if (!scheduled) {
      scheduled = true;
      schedule(processQueue);
    }
  };
  const processQueue = (deadline) => {
    const started = Date.now();
    while (queue.length > 0) {
      localizeNode(queue.shift());
      if (deadline.timeRemaining() <= 2 || Date.now() - started > 12) break;
    }
    if (queue.length > 0) {
      schedule(processQueue);
    } else {
      scheduled = false;
    }
  };
  const start = () => {
    if (document.body) enqueue(document.body);
  };
  const setupObserver = () => {
    if (!document.body) return;
    start();
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.target;
        if (isInsideEditor(target)) continue;
        for (const node of mutation.addedNodes) {
          if (!isInsideEditor(node)) enqueue(node);
        }
        if (mutation.type === 'characterData') enqueue(target);
        if (mutation.type === 'attributes') enqueue(target);
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: attributes
    });
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', setupObserver);
  } else {
    setupObserver();
  }
})();
`;
}

function replaceRegexEntry(content, entry) {
  const matches = content.match(entry.regex);
  return {
    count: matches?.length ?? 0,
    content: content.replace(entry.regex, entry.target)
  };
}

function replaceLiteralEntriesInTextContexts(content, entries, file) {
  let count = 0;
  const entryCounts = new Map();
  let next = replaceStringLiterals(content, (value, quote) => {
    const replaced = replaceAllLiteralEntries(value, entries);
    count += replaced.count;
    mergeCounts(entryCounts, replaced.entryCounts);
    return `${quote}${replaced.content}${quote}`;
  });

  if (file.endsWith('.html')) {
    next = next.replace(/>([^<]*)</g, (match, value) => {
      const replaced = replaceAllLiteralEntries(value, entries);
      count += replaced.count;
      mergeCounts(entryCounts, replaced.entryCounts);
      return `>${replaced.content}<`;
    });
  }

  return { count, content: next, entryCounts };
}

function replaceStringLiterals(content, replacer) {
  let output = '';
  let position = 0;

  while (position < content.length) {
    const quote = content[position];
    if (quote !== '"' && quote !== "'" && quote !== '`') {
      output += quote;
      position += 1;
      continue;
    }

    const start = position;
    position += 1;
    let value = '';
    let closed = false;

    while (position < content.length) {
      const char = content[position];
      if (char === '\\') {
        value += content.slice(position, position + 2);
        position += 2;
        continue;
      }
      if (char === quote) {
        position += 1;
        output += replacer(value, quote);
        closed = true;
        break;
      }
      value += char;
      position += 1;
    }

    if (!closed) {
      output += content.slice(start);
      break;
    }
  }

  return output;
}

function replaceAllLiteralEntries(content, entries) {
  let count = 0;
  const entryCounts = new Map();
  let output = content;

  for (const { entry, index } of entries) {
    const replaced = replaceOneLiteral(output, entry.source, entry.target);
    if (replaced.count === 0) continue;
    output = replaced.content;
    count += replaced.count;
    entryCounts.set(index, (entryCounts.get(index) ?? 0) + replaced.count);
  }

  return { count, content: output, entryCounts };
}

function replaceOneLiteral(content, source, target) {
  const parts = content.split(source);
  const count = parts.length - 1;
  return { count, content: count === 0 ? content : parts.join(target) };
}

function mergeCounts(target, source) {
  for (const [index, count] of source) {
    target.set(index, (target.get(index) ?? 0) + count);
  }
}
