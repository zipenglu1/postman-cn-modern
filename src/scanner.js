import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { listLocalCoreFiles } from './fileRules.js';

export async function scanApp({
  appDir,
  scope = 'local-core',
  dictionary = { entries: [] },
  maxFileBytes = 1_000_000,
  maxCandidates = 500
}) {
  if (scope !== 'local-core') {
    throw new Error(`Unsupported scan scope: ${scope}`);
  }

  const files = await listLocalCoreFiles(appDir);
  const candidates = new Map();
  const oldEntryHits = new Map();
  const skippedFiles = [];
  let scannedFiles = 0;

  for (const file of files) {
    const absolutePath = join(appDir, file);
    const fileStat = await stat(absolutePath);
    if (fileStat.size > maxFileBytes) {
      skippedFiles.push({ file, bytes: fileStat.size, reason: `larger than ${maxFileBytes} bytes` });
      continue;
    }

    const content = await readFile(absolutePath, 'utf8');
    scannedFiles += 1;
    for (const entry of dictionary.entries ?? []) {
      if (typeof entry.source === 'string' && content.includes(entry.source)) {
        oldEntryHits.set(entry.source, { source: entry.source, target: entry.target });
      }
    }
    for (const text of extractEnglishCandidates(content)) {
      const current = candidates.get(text) ?? { text, count: 0, files: [] };
      current.count += 1;
      if (!current.files.includes(file)) current.files.push(file);
      candidates.set(text, current);
    }
  }

  const sortedCandidates = [...candidates.values()].sort((a, b) => a.text.localeCompare(b.text));

  return {
    scope,
    scannedFiles,
    skippedFiles,
    candidateCount: candidates.size,
    candidates: sortedCandidates.slice(0, maxCandidates),
    truncatedCandidates: Math.max(0, sortedCandidates.length - maxCandidates),
    oldEntryHits: [...oldEntryHits.values()]
  };
}

export function extractEnglishCandidates(content) {
  const results = new Set();

  for (const text of extractStringLiterals(content)) {
    addCandidate(results, unescapeCandidate(text));
  }

  if (/<[A-Za-z][\s\S]*>/.test(content)) {
    const htmlTextPattern = />\s*([^<>{}][^<>{}]{1,120}?[A-Za-z][^<>{}]*)\s*</g;
    for (const match of content.matchAll(htmlTextPattern)) {
      addCandidate(results, match[1]);
    }
  }

  return [...results];
}

function extractStringLiterals(content) {
  const strings = [];
  let position = 0;

  while (position < content.length) {
    const quote = content[position];
    if (quote !== '"' && quote !== "'" && quote !== '`') {
      position += 1;
      continue;
    }

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
        closed = true;
        break;
      }
      value += char;
      if (value.length > 120) {
        position += 1;
        while (position < content.length) {
          const skipChar = content[position];
          if (skipChar === '\\') {
            position += 2;
            continue;
          }
          position += 1;
          if (skipChar === quote) {
            closed = false;
            break;
          }
        }
        break;
      }
      position += 1;
    }

    if (closed) strings.push(value);
  }

  return strings;
}

function addCandidate(results, text) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!/[A-Za-z]/.test(normalized)) return;
  if (normalized.length < 2 || normalized.length > 120) return;
  if (/^(https?:|file:|\/|\.\/|[A-Za-z]:\\)/.test(normalized)) return;
  if (/^[\w.-]+\.(js|css|png|svg|json|html|map|woff2?)$/i.test(normalized)) return;
  results.add(normalized);
}

function unescapeCandidate(text) {
  return text
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
}
