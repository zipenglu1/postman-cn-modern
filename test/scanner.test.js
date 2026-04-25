import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanApp } from '../src/scanner.js';

test('scanApp extracts English UI candidates from local-core files and ignores excluded paths', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'postman-cn-scanner-'));
  await mkdir(join(appDir, 'js', 'node_modules'), { recursive: true });
  await mkdir(join(appDir, 'html'), { recursive: true });
  await writeFile(join(appDir, 'js', 'requester.js'), 'button.textContent = "Send"; const label = "Runner";');
  await writeFile(join(appDir, 'html', 'loader.html'), '<span>Loading workspace</span>');
  await writeFile(join(appDir, 'js', 'requester.js.LICENSE.txt'), '"License Notice"');
  await writeFile(join(appDir, 'js', 'node_modules', 'dep.js'), '"Ignored Dependency"');

  const report = await scanApp({ appDir, scope: 'local-core', dictionary: { entries: [{ source: 'Send' }] } });

  assert.equal(report.scannedFiles, 2);
  assert.ok(report.candidates.some((item) => item.text === 'Send'));
  assert.ok(report.candidates.some((item) => item.text === 'Loading workspace'));
  assert.equal(report.oldEntryHits.length, 1);
  assert.equal(report.oldEntryHits[0].source, 'Send');
});

test('scanApp reports and skips files larger than the configured scan limit', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'postman-cn-scanner-'));
  await mkdir(join(appDir, 'js'), { recursive: true });
  await writeFile(join(appDir, 'js', 'large.js'), `"${'Large Candidate '.repeat(100)}"`);

  const report = await scanApp({ appDir, scope: 'local-core', maxFileBytes: 50 });

  assert.equal(report.scannedFiles, 0);
  assert.equal(report.skippedFiles.length, 1);
  assert.equal(report.skippedFiles[0].file, 'js/large.js');
});
