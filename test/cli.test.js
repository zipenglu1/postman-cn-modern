import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const execFileAsync = promisify(execFile);
const cliPath = resolve('bin/postman-cn.js');

test('postman-cn detect prints JSON install details', async () => {
  const localAppData = await mkdtemp(join(tmpdir(), 'postman-cn-cli-'));
  const resourcesDir = join(localAppData, 'Postman', 'app-12.7.6', 'resources');
  await mkdir(resourcesDir, { recursive: true });
  await writeFile(join(resourcesDir, 'app.asar'), 'fixture');

  const { stdout } = await execFileAsync(process.execPath, [
    cliPath,
    'detect',
    '--json',
    '--local-app-data',
    localAppData
  ]);
  const parsed = JSON.parse(stdout);

  assert.equal(parsed.version, '12.7.6');
  assert.equal(parsed.asarPath, join(resourcesDir, 'app.asar'));
});
