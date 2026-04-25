import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractAsar } from './asarAdapter.js';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

export function defaultDictionaryPath() {
  return join(repoRoot, 'dictionaries', 'local-core.zh-CN.json');
}

export async function withExtractedApp(asarPath, callback) {
  const tempRoot = await mkdtemp(join(tmpdir(), 'postman-cn-app-'));
  const appDir = join(tempRoot, 'app');

  try {
    await extractAsar(asarPath, appDir);
    return await callback(appDir);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}
