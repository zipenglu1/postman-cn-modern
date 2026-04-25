import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('manual Postman 12.7.6 dictionary covers primary UI workflows', async () => {
  const dictionary = JSON.parse(await readFile('dictionaries/manual-12.7.6.zh-CN.json', 'utf8'));
  const entries = new Map(dictionary.entries.map((entry) => [entry.source, entry]));

  for (const source of [
    'Collections',
    'Environments',
    'History',
    'Params',
    'Authorization',
    'Headers',
    'Body',
    'Scripts',
    'Response',
    'Settings',
    'New Collection',
    'New Request',
    'Add a request',
    'Save request',
    'View more actions',
    'No environment',
    'Manage environments',
    'Proxy',
    'Certificates',
    'General',
    'Shortcuts',
    'Import collection',
    'Run collection',
    'Send and Download',
    'Pretty',
    'Raw',
    'Preview'
  ]) {
    assert.ok(entries.has(source), `missing manual translation for ${source}`);
    assert.equal(entries.get(source).match, 'literal');
    assert.equal(entries.get(source).runtimeOnly, undefined);
  }

  assert.ok(dictionary.entries.length >= 180);
});
