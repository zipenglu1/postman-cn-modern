import { cp, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const MANIFEST_FILE = 'postman-cn-manifest.json';
export const GENERATED_BY = 'postman-cn';
export const ASAR_FILE = 'app.asar';
export const ASAR_BACKUP_FILE = 'app.asar.postman-cn.bak';

export async function installPatchedApp({ resourcesDir, patchedAppDir, version, patchSummary, force = false }) {
  const appDir = join(resourcesDir, 'app');
  const manifestPath = join(resourcesDir, MANIFEST_FILE);
  const asarPath = join(resourcesDir, ASAR_FILE);
  const backupAsarPath = join(resourcesDir, ASAR_BACKUP_FILE);
  const existingOwner = await readManifestIfExists(manifestPath);

  if (await exists(appDir)) {
    if (!force && existingOwner?.generatedBy !== GENERATED_BY) {
      throw new Error(`${appDir} already exists and was not created by postman-cn`);
    }
    await rm(appDir, { recursive: true, force: true });
  }

  if (await exists(asarPath)) {
    if (await exists(backupAsarPath)) {
      throw new Error(`${backupAsarPath} already exists; restore before installing again`);
    }
    await rename(asarPath, backupAsarPath);
  } else if (!(await exists(backupAsarPath))) {
    throw new Error(`${asarPath} was not found; cannot create a reversible install`);
  }

  await mkdir(resourcesDir, { recursive: true });
  await cp(patchedAppDir, appDir, { recursive: true });

  const manifest = {
    generatedBy: GENERATED_BY,
    version,
    installedAt: new Date().toISOString(),
    appDir,
    asarBackup: backupAsarPath,
    patchSummary
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifestPath;
}

export async function restoreInstall({ resourcesDir }) {
  const manifestPath = join(resourcesDir, MANIFEST_FILE);
  const manifest = await readManifestIfExists(manifestPath);
  if (!manifest || manifest.generatedBy !== GENERATED_BY) {
    throw new Error(`No postman-cn manifest found at ${manifestPath}`);
  }

  await rm(join(resourcesDir, 'app'), { recursive: true, force: true });
  const asarPath = join(resourcesDir, ASAR_FILE);
  const backupAsarPath = join(resourcesDir, ASAR_BACKUP_FILE);
  if (await exists(backupAsarPath)) {
    await rm(asarPath, { force: true });
    await rename(backupAsarPath, asarPath);
  }
  await rm(manifestPath, { force: true });
  return { restored: true };
}

async function readManifestIfExists(manifestPath) {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}
