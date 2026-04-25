import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadDictionary } from '../src/dictionary.js';

test('loadDictionary validates entries and compiles regex replacements', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'postman-cn-dictionary-'));
  const file = join(dir, 'dictionary.json');
  await writeFile(file, JSON.stringify({
    versionRange: '>=12.0.0 <13.0.0',
    entries: [
      { source: 'Send', target: '发送', match: 'literal', files: ['js/**/*.js'] },
      { source: '\\bRunner\\b', target: '运行器', match: 'regex' },
      { source: 'Workspace', target: '工作区', match: 'literal', runtimeOnly: true }
    ]
  }));

  const dictionary = await loadDictionary(file, '12.7.6');

  assert.equal(dictionary.versionRange, '>=12.0.0 <13.0.0');
  assert.equal(dictionary.entries.length, 3);
  assert.equal(dictionary.entries[1].regex.source, '\\bRunner\\b');
  assert.equal(dictionary.entries[2].runtimeOnly, true);
});

test('loadDictionary rejects missing source or target fields', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'postman-cn-dictionary-'));
  const file = join(dir, 'dictionary.json');
  await writeFile(file, JSON.stringify({
    versionRange: '>=12.0.0 <13.0.0',
    entries: [{ source: 'Send', match: 'literal' }]
  }));

  await assert.rejects(() => loadDictionary(file, '12.7.6'), /entries\[0\]\.target/);
});

test('loadDictionary rejects version mismatches and invalid regex', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'postman-cn-dictionary-'));
  const versionFile = join(dir, 'version.json');
  const regexFile = join(dir, 'regex.json');

  await mkdir(dir, { recursive: true });
  await writeFile(versionFile, JSON.stringify({
    versionRange: '>=13.0.0',
    entries: [{ source: 'Send', target: '发送', match: 'literal' }]
  }));
  await writeFile(regexFile, JSON.stringify({
    versionRange: '>=12.0.0 <13.0.0',
    entries: [{ source: '[', target: '坏正则', match: 'regex' }]
  }));

  await assert.rejects(() => loadDictionary(versionFile, '12.7.6'), /does not satisfy/);
  await assert.rejects(() => loadDictionary(regexFile, '12.7.6'), /invalid regex/);
});
