import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findLatestPostmanInstall } from '../src/postmanLocator.js';

test('findLatestPostmanInstall chooses the highest semver app directory', async (t) => {
  const root = t.mock.fn();
  const localAppData = await mkdtemp(join(tmpdir(), 'postman-cn-locator-'));
  const postmanRoot = join(localAppData, 'Postman');

  await mkdir(join(postmanRoot, 'app-12.6.0', 'resources'), { recursive: true });
  await mkdir(join(postmanRoot, 'app-12.7.6', 'resources'), { recursive: true });
  await mkdir(join(postmanRoot, 'packages'), { recursive: true });
  await writeFile(join(postmanRoot, 'app-12.6.0', 'resources', 'app.asar'), 'old');
  await writeFile(join(postmanRoot, 'app-12.7.6', 'resources', 'app.asar'), 'new');

  const install = await findLatestPostmanInstall({ localAppData, platform: 'win32' });

  assert.equal(install.version, '12.7.6');
  assert.equal(install.installDir, join(postmanRoot, 'app-12.7.6'));
  assert.equal(install.resourcesDir, join(postmanRoot, 'app-12.7.6', 'resources'));
  assert.equal(install.asarPath, join(postmanRoot, 'app-12.7.6', 'resources', 'app.asar'));
  assert.equal(root.mock.callCount(), 0);
});

test('findLatestPostmanInstall rejects unsupported platforms', async () => {
  await assert.rejects(
    () => findLatestPostmanInstall({ localAppData: 'unused', platform: 'darwin' }),
    /Windows is the only supported platform/
  );
});

test('findLatestPostmanInstall can locate an installed override with only app.asar backup present', async () => {
  const localAppData = await mkdtemp(join(tmpdir(), 'postman-cn-locator-'));
  const resourcesDir = join(localAppData, 'Postman', 'app-12.7.6', 'resources');

  await mkdir(resourcesDir, { recursive: true });
  await writeFile(join(resourcesDir, 'app.asar.postman-cn.bak'), 'backup');

  const install = await findLatestPostmanInstall({
    localAppData,
    platform: 'win32',
    allowAsarBackup: true
  });

  assert.equal(install.version, '12.7.6');
  assert.equal(install.asarPath, join(resourcesDir, 'app.asar'));
  assert.equal(install.asarBackupPath, join(resourcesDir, 'app.asar.postman-cn.bak'));
  assert.equal(install.hasAsar, false);
  assert.equal(install.hasAsarBackup, true);
});
