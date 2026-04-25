import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyPatches } from '../src/patcher.js';

test('applyPatches does not apply unscoped literal entries to local bundles', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'postman-cn-patcher-'));
  await mkdir(join(appDir, 'js'), { recursive: true });
  await writeFile(join(appDir, 'preload_desktop.js'), 'console.log("preload");');
  await writeFile(join(appDir, 'js', 'requester.js'), 'const label = "Run"; const word = "Runner";');

  await applyPatches({
    appDir,
    version: '12.7.6',
    dictionary: {
      versionRange: '>=12.0.0 <13.0.0',
      entries: [
        { source: 'Run', target: '运行', match: 'literal' }
      ]
    }
  });

  assert.equal(await readFile(join(appDir, 'js', 'requester.js'), 'utf8'), 'const label = "Run"; const word = "Runner";');
  assert.match(await readFile(join(appDir, 'preload_desktop.js'), 'utf8'), /"Run","运行"/);
});

test('applyPatches emits phrase runtime entries separately from exact entries', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'postman-cn-patcher-'));
  await writeFile(join(appDir, 'preload_desktop.js'), 'console.log("preload");');

  await applyPatches({
    appDir,
    version: '12.7.6',
    dictionary: {
      versionRange: '>=12.0.0 <13.0.0',
      entries: [
        { source: 'Run', target: '运行', match: 'literal' },
        {
          source: 'A directory of all workspaces in',
          target: '你可访问的',
          match: 'literal',
          runtimeStrategy: 'phrase'
        }
      ]
    }
  });

  const preload = await readFile(join(appDir, 'preload_desktop.js'), 'utf8');
  assert.match(preload, /const exactDictionary = new Map/);
  assert.match(preload, /const phraseDictionary =/);
  assert.match(preload, /"Run","运行"/);
  assert.match(preload, /"A directory of all workspaces in","你可访问的"/);
});
