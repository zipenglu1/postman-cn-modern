import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPackage } from '@electron/asar';
import { extractAsar, listAsar } from '../src/asarAdapter.js';

test('asarAdapter lists and extracts archive contents', async () => {
  const root = await mkdtemp(join(tmpdir(), 'postman-cn-asar-'));
  const sourceDir = join(root, 'source');
  const archivePath = join(root, 'app.asar');
  const outputDir = join(root, 'output');

  await mkdir(join(sourceDir, 'html'), { recursive: true });
  await writeFile(join(sourceDir, 'main.js'), 'console.log("main")');
  await writeFile(join(sourceDir, 'html', 'loader.html'), '<span>Loading</span>');
  await createPackage(sourceDir, archivePath);

  const files = await listAsar(archivePath);
  assert.deepEqual(files.sort(), ['html/loader.html', 'main.js']);

  await extractAsar(archivePath, outputDir);
  const extracted = await listAsar(archivePath);
  assert.deepEqual(extracted.sort(), ['html/loader.html', 'main.js']);
});
