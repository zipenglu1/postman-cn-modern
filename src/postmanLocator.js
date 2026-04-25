import { access, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import semver from 'semver';

export async function findLatestPostmanInstall(options = {}) {
  const platform = options.platform ?? process.platform;
  if (platform !== 'win32') {
    throw new Error('Windows is the only supported platform in postman-cn v1');
  }

  const localAppData = options.localAppData ?? process.env.LOCALAPPDATA;
  if (!localAppData) {
    throw new Error('LOCALAPPDATA is not set; cannot locate Postman');
  }

  const postmanRoot = join(localAppData, 'Postman');
  const entries = await readdir(postmanRoot, { withFileTypes: true });
  const installs = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('app-')) continue;
    const version = entry.name.slice(4);
    if (!semver.valid(version)) continue;

    const installDir = join(postmanRoot, entry.name);
    const resourcesDir = join(installDir, 'resources');
    const asarPath = join(resourcesDir, 'app.asar');
    const asarBackupPath = join(resourcesDir, 'app.asar.postman-cn.bak');

    const hasAsar = await canAccess(asarPath);
    const hasAsarBackup = await canAccess(asarBackupPath);
    if (!hasAsar && !(options.allowAsarBackup && hasAsarBackup)) continue;

    installs.push({
      version,
      installDir,
      resourcesDir,
      asarPath,
      asarBackupPath,
      appPath: join(resourcesDir, 'app'),
      hasAsar,
      hasAsarBackup
    });
  }

  installs.sort((a, b) => semver.rcompare(a.version, b.version));
  if (installs.length === 0) {
    throw new Error(`No Postman app-* installation with resources/app.asar found under ${postmanRoot}`);
  }

  return installs[0];
}

async function canAccess(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
