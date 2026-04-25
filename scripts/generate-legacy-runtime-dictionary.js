#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractLegacyRuntimeEntries } from '../src/legacyExtractor.js';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const legacyLangDir = join(repoRoot, 'php', 'lang');
const manualDictionaryPath = join(repoRoot, 'dictionaries', 'manual-12.7.6.zh-CN.json');
const dictionaryPath = join(repoRoot, 'dictionaries', 'local-core.zh-CN.json');

const legacyFiles = await collectPhpFiles(legacyLangDir);
const legacyEntries = await extractLegacyRuntimeEntries(legacyFiles);
const manualDictionary = JSON.parse(await readFile(manualDictionaryPath, 'utf8'));
const manualEntries = dedupeBySource(manualDictionary.entries);
const existingSources = new Set(manualEntries.map((entry) => entry.source));
const addedEntries = legacyEntries.filter((entry) => !existingSources.has(entry.source));

const dictionary = {
  versionRange: manualDictionary.versionRange,
  entries: [...manualEntries, ...addedEntries]
};

await writeFile(dictionaryPath, `${JSON.stringify(dictionary, null, 2)}\n`);

console.log(JSON.stringify({
  legacyFiles: legacyFiles.length,
  manualEntries: manualEntries.length,
  extractedEntries: legacyEntries.length,
  addedEntries: addedEntries.length,
  dictionaryEntries: dictionary.entries.length
}, null, 2));

async function collectPhpFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectPhpFiles(path));
    } else if (entry.isFile() && entry.name.endsWith('.php')) {
      files.push(path);
    }
  }

  return files;
}

function dedupeBySource(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.source)) return false;
    seen.add(entry.source);
    return true;
  });
}
