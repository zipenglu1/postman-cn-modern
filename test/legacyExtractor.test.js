import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveVisiblePairs, extractLegacyRuntimeEntries } from '../src/legacyExtractor.js';

test('deriveVisiblePairs pulls visible values out of quoted JS snippets', () => {
  assert.deepEqual(deriveVisiblePairs('"Send"', '"发送"'), [
    { source: '"Send"', target: '"发送"' },
    { source: 'Send', target: '发送' }
  ]);

  assert.ok(deriveVisiblePairs('title:"Name"', 'title:"名称"').some((entry) => (
    entry.source === 'Name' && entry.target === '名称'
  )));
});

test('extractLegacyRuntimeEntries returns filtered runtime-only literal entries', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'postman-cn-legacy-'));
  const file = join(dir, 'lang.php');
  await writeFile(file, `<?php
return [
  '"Send"' => '"发送"',
  'title:"Name"' => 'title:"名称"',
  '/\\\\bSkip\\\\b/' => '跳过',
  '______' => '______',
];
`);

  const entries = await extractLegacyRuntimeEntries([file]);

  assert.ok(entries.some((entry) => entry.source === 'Send' && entry.target === '发送'));
  assert.ok(entries.some((entry) => entry.source === 'Name' && entry.target === '名称'));
  assert.ok(entries.every((entry) => entry.runtimeOnly === true));
  assert.ok(!entries.some((entry) => entry.source.includes('Skip')));
});
