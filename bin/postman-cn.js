#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Command } from 'commander';
import { findLatestPostmanInstall } from '../src/postmanLocator.js';
import { loadDictionary } from '../src/dictionary.js';
import { scanApp } from '../src/scanner.js';
import { applyPatches } from '../src/patcher.js';
import { installPatchedApp, restoreInstall } from '../src/installer.js';
import { defaultDictionaryPath, withExtractedApp } from '../src/runtime.js';

const execFileAsync = promisify(execFile);
const program = new Command();

program
  .name('postman-cn')
  .description('Windows-first Chinese localization CLI for recent Postman desktop builds')
  .version('12.0.0')
  .option('--local-app-data <path>', 'override LOCALAPPDATA for Windows Postman detection')
  .option('--json', 'print JSON output');

program
  .command('detect')
  .description('detect the latest installed Windows Postman app')
  .action(async () => {
    const install = await detectFromProgram({ allowAsarBackup: true });
    print(install);
  });

program
  .command('scan')
  .description('scan local-core UI text candidates from Postman app.asar')
  .option('--scope <scope>', 'scan scope', 'local-core')
  .option('--dictionary <path>', 'dictionary path', defaultDictionaryPath())
  .option('--max-candidates <count>', 'maximum candidate records to print', parseInteger, 100)
  .action(async (options) => {
    const install = await detectFromProgram({ allowAsarBackup: true });
    const dictionary = await loadDictionary(options.dictionary, install.version);
    const report = await withExtractedApp(readableAsarPath(install), (appDir) =>
      scanApp({ appDir, scope: options.scope, dictionary, maxCandidates: options.maxCandidates })
    );
    print({ postman: installSummary(install), ...report });
  });

program
  .command('apply')
  .description('report replacement impact without installing by default')
  .option('--dry-run', 'do not write to the Postman installation', true)
  .option('--dictionary <path>', 'dictionary path', defaultDictionaryPath())
  .option('--max-missing <count>', 'maximum missing dictionary entries to print', parseInteger, 100)
  .action(async (options) => {
    const install = await detectFromProgram({ allowAsarBackup: true });
    const dictionary = await loadDictionary(options.dictionary, install.version);
    const report = await withExtractedApp(readableAsarPath(install), (appDir) =>
      applyPatches({ appDir, version: install.version, dictionary, dryRun: options.dryRun })
    );
    print({ postman: installSummary(install), dryRun: true, ...limitMissingEntries(report, options.maxMissing) });
  });

program
  .command('install')
  .description('install a patched resources/app directory next to app.asar')
  .option('--dictionary <path>', 'dictionary path', defaultDictionaryPath())
  .option('--force', 'replace an existing postman-cn-owned resources/app directory')
  .option('--max-missing <count>', 'maximum missing dictionary entries to print', parseInteger, 100)
  .option('--skip-running-check', 'skip Postman.exe running process check')
  .action(async (options) => {
    const install = await detectFromProgram({ allowAsarBackup: true });
    if (!options.skipRunningCheck) await ensurePostmanNotRunning();

    const dictionary = await loadDictionary(options.dictionary, install.version);
    const result = await withExtractedApp(readableAsarPath(install), async (appDir) => {
      const patchSummary = await applyPatches({ appDir, version: install.version, dictionary });
      const manifestPath = await installPatchedApp({
        resourcesDir: install.resourcesDir,
        patchedAppDir: appDir,
        version: install.version,
        patchSummary,
        force: options.force
      });
      return { postman: installSummary(install), manifestPath, ...limitMissingEntries(patchSummary, options.maxMissing) };
    });
    print(result);
  });

program
  .command('restore')
  .description('remove a postman-cn-installed resources/app override directory')
  .action(async () => {
    const install = await detectFromProgram({ allowAsarBackup: true });
    const result = await restoreInstall({ resourcesDir: install.resourcesDir });
    print({ postman: installSummary(install), ...result });
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

async function detectFromProgram(extra = {}) {
  const options = program.opts();
  return findLatestPostmanInstall({ localAppData: options.localAppData, ...extra });
}

async function ensurePostmanNotRunning() {
  if (process.platform !== 'win32') return;
  const { stdout } = await execFileAsync('tasklist.exe', ['/FI', 'IMAGENAME eq Postman.exe', '/NH']);
  if (/Postman\.exe/i.test(stdout)) {
    throw new Error('Postman.exe is running. Close Postman before installing the localization override.');
  }
}

function installSummary(install) {
  return {
    version: install.version,
    installDir: install.installDir,
    resourcesDir: install.resourcesDir,
    asarPath: install.asarPath,
    asarBackupPath: install.asarBackupPath,
    sourceAsarPath: readableAsarPath(install),
    hasAsar: install.hasAsar,
    hasAsarBackup: install.hasAsarBackup,
    appPath: install.appPath
  };
}

function readableAsarPath(install) {
  return install.hasAsar ? install.asarPath : install.asarBackupPath;
}

function print(payload) {
  if (program.opts().json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log(JSON.stringify(payload, null, 2));
}

function limitMissingEntries(report, maxMissing) {
  if (!Array.isArray(report.missingEntries)) return report;
  const missingEntriesCount = report.missingEntries.length;
  const missingEntries = maxMissing === 0
    ? report.missingEntries
    : report.missingEntries.slice(0, maxMissing);

  return {
    ...report,
    missingEntriesCount,
    missingEntries
  };
}

function parseInteger(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid integer: ${value}`);
  }
  return parsed;
}
