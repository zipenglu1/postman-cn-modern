#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KNOWN_UI_TRANSLATIONS, mergeManualEntries } from '../src/untranslatedWorkflow.js';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const manualPath = join(repoRoot, 'dictionaries', 'manual-12.7.6.zh-CN.json');
const manualDictionary = JSON.parse(await readFile(manualPath, 'utf8'));
const added = mergeManualEntries(manualDictionary, KNOWN_UI_TRANSLATIONS);

if (added.length > 0) {
  await writeFile(manualPath, `${JSON.stringify(manualDictionary, null, 2)}\n`);
}

console.log(JSON.stringify({
  knownEntries: KNOWN_UI_TRANSLATIONS.length,
  addedEntries: added.length,
  manualEntries: manualDictionary.entries.length,
  added
}, null, 2));
