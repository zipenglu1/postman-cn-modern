import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyPatches } from '../src/patcher.js';

test('applyPatches replaces literal and regex entries and reports misses', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'postman-cn-patcher-'));
  await mkdir(join(appDir, 'js'), { recursive: true });
  await mkdir(join(appDir, 'html'), { recursive: true });
  await writeFile(join(appDir, 'js', 'requester.js'), 'const a = "Send"; const b = "Runner";');
  await writeFile(join(appDir, 'html', 'loader.html'), '<span>Loading...</span>');

  const result = await applyPatches({
    appDir,
    version: '12.7.6',
    dictionary: {
      versionRange: '>=12.0.0 <13.0.0',
      entries: [
        { source: 'Send', target: '发送', match: 'literal', files: ['js/**/*.js'] },
        { source: '\\bLoading\\.\\.\\.', target: '加载中...', match: 'regex', regex: /\bLoading\.\.\./g },
        { source: 'Never Appears', target: '不会出现', match: 'literal' }
      ]
    }
  });

  assert.equal(result.scannedFiles, 2);
  assert.equal(result.changedFiles.length, 2);
  assert.equal(result.replacements, 2);
  assert.equal(result.missingEntries.length, 1);
  assert.equal(await readFile(join(appDir, 'js', 'requester.js'), 'utf8'), 'const a = "发送"; const b = "Runner";');
  assert.equal(await readFile(join(appDir, 'html', 'loader.html'), 'utf8'), '<span>加载中...</span>');
});

test('applyPatches does not replace plain literal entries in JavaScript identifiers', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'postman-cn-patcher-'));
  await mkdir(join(appDir, 'js'), { recursive: true });
  await writeFile(join(appDir, 'js', 'requester.js'), 'const Send = api.Send; const label = "Send";');

  await applyPatches({
    appDir,
    version: '12.7.6',
    dictionary: {
      versionRange: '>=12.0.0 <13.0.0',
      entries: [
        { source: 'Send', target: '发送', match: 'literal', files: ['js/**/*.js'] }
      ]
    }
  });

  assert.equal(await readFile(join(appDir, 'js', 'requester.js'), 'utf8'), 'const Send = api.Send; const label = "发送";');
});

test('applyPatches injects a preload desktop DOM localizer for remote Postman UI', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'postman-cn-patcher-'));
  await writeFile(join(appDir, 'preload_desktop.js'), 'console.log("preload");');

  const result = await applyPatches({
    appDir,
    version: '12.7.6',
    dictionary: {
      versionRange: '>=12.0.0 <13.0.0',
      entries: [
        { source: 'Send', target: '发送', match: 'literal' },
        { source: 'Collections', target: '集合', match: 'literal' },
        { source: '\\bSkip\\b', target: '跳过', match: 'regex' }
      ]
    }
  });

  const preload = await readFile(join(appDir, 'preload_desktop.js'), 'utf8');
  assert.match(preload, /postman-cn remote UI localizer/);
  assert.match(preload, /"Send","发送"/);
  assert.match(preload, /"Collections","集合"/);
  assert.doesNotMatch(preload, /Skip/);
  assert.ok(result.changedFiles.includes('preload_desktop.js'));
});

test('applyPatches uses runtimeOnly entries only in the preload localizer', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'postman-cn-patcher-'));
  await mkdir(join(appDir, 'js'), { recursive: true });
  await writeFile(join(appDir, 'preload_desktop.js'), 'console.log("preload");');
  await writeFile(join(appDir, 'js', 'requester.js'), 'const label = "Runtime Only";');

  await applyPatches({
    appDir,
    version: '12.7.6',
    dictionary: {
      versionRange: '>=12.0.0 <13.0.0',
      entries: [
        { source: 'Runtime Only', target: '仅运行时', match: 'literal', runtimeOnly: true }
      ]
    }
  });

  assert.equal(await readFile(join(appDir, 'js', 'requester.js'), 'utf8'), 'const label = "Runtime Only";');
  assert.match(await readFile(join(appDir, 'preload_desktop.js'), 'utf8'), /"Runtime Only","仅运行时"/);
});
