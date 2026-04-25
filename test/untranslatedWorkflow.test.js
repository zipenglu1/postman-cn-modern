import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  knownTranslationsForTexts,
  mergeManualEntries,
  summarizeUntranslatedItems
} from '../src/untranslatedWorkflow.js';

test('summarizeUntranslatedItems filters known entries and reports known translations', () => {
  const candidates = summarizeUntranslatedItems(
    [
      { text: 'External workspaces', kind: 'text', tag: 'button' },
      { text: 'External workspaces', kind: 'text', tag: 'button' },
      { text: 'Collections', kind: 'text', tag: 'span' },
      { text: 'https://example.com', kind: 'text', tag: 'span' },
      { text: '200 ms', kind: 'text', tag: 'span' }
    ],
    [{ source: 'Collections', target: '集合' }]
  );

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].text, 'External workspaces');
  assert.equal(candidates[0].count, 2);
  assert.equal(candidates[0].knownTranslation.target, '外部工作区');
});

test('knownTranslationsForTexts includes phrase entries for dynamic visible text', () => {
  const entries = knownTranslationsForTexts([
    'A directory of all workspaces in 卢梓鹏 you can access.'
  ]);

  assert.ok(entries.some((entry) => entry.source === 'A directory of all workspaces in'));
  assert.ok(entries.some((entry) => entry.source === 'you can access.'));
});

test('mergeManualEntries appends only missing translations', () => {
  const manual = {
    versionRange: '>=12.0.0 <13.0.0',
    entries: [{ source: 'Back', target: '返回', match: 'literal' }]
  };

  const added = mergeManualEntries(manual, [
    { source: 'Back', target: '返回' },
    { source: 'External workspaces', target: '外部工作区' }
  ]);

  assert.equal(added.length, 1);
  assert.equal(manual.entries.length, 2);
  assert.equal(manual.entries[1].source, 'External workspaces');
});
