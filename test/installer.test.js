import { access, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installPatchedApp, restoreInstall } from '../src/installer.js';

test('installPatchedApp refuses to overwrite a foreign resources app directory', async (t) => {
  const resourcesDir = await mkdtemp(join(tmpdir(), 'postman-cn-installer-'));
  const patchedAppDir = join(resourcesDir, 'patched');
  await mkdir(join(resourcesDir, 'app'), { recursive: true });
  await mkdir(patchedAppDir, { recursive: true });
  await writeFile(join(patchedAppDir, 'main.js'), 'patched');

  await assert.rejects(
    () => installPatchedApp({ resourcesDir, patchedAppDir, version: '12.7.6', patchSummary: {} }),
    /already exists and was not created by postman-cn/
  );
});

test('restoreInstall removes only an app directory owned by postman-cn', async (t) => {
  const resourcesDir = await mkdtemp(join(tmpdir(), 'postman-cn-installer-'));
  const patchedAppDir = join(resourcesDir, 'patched');
  await mkdir(patchedAppDir, { recursive: true });
  await writeFile(join(patchedAppDir, 'main.js'), 'patched');
  await writeFile(join(resourcesDir, 'app.asar'), 'original asar');

  const manifestPath = await installPatchedApp({
    resourcesDir,
    patchedAppDir,
    version: '12.7.6',
    patchSummary: { replacements: 1 }
  });

  assert.equal(manifestPath, join(resourcesDir, 'postman-cn-manifest.json'));
  await assert.rejects(() => access(join(resourcesDir, 'app.asar')), /ENOENT/);
  assert.equal(await readFile(join(resourcesDir, 'app.asar.postman-cn.bak'), 'utf8'), 'original asar');

  await restoreInstall({ resourcesDir });

  await assert.rejects(() => access(join(resourcesDir, 'app')), /ENOENT/);
  assert.equal(await readFile(join(resourcesDir, 'app.asar'), 'utf8'), 'original asar');
  await assert.rejects(() => access(join(resourcesDir, 'app.asar.postman-cn.bak')), /ENOENT/);
  await assert.rejects(() => restoreInstall({ resourcesDir }), /No postman-cn manifest/);
});
