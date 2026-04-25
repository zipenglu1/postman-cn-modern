#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findLatestPostmanInstall } from '../src/postmanLocator.js';
import {
  assertWebSocketSupport,
  captureVisibleItems,
  CdpClient,
  launchPostmanWithDebugPort,
  waitForPostmanTarget
} from '../src/postmanCdp.js';
import {
  knownTranslationsForTexts,
  mergeManualEntries,
  summarizeUntranslatedItems
} from '../src/untranslatedWorkflow.js';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = new Set(process.argv.slice(2));
const port = Number(getArg('--port') ?? 9223);
const shouldLaunch = args.has('--launch');
const shouldApplyKnown = args.has('--apply-known');
const waitMs = Number(getArg('--wait-ms') ?? 12000);

assertWebSocketSupport();

async function main() {
  const install = await findLatestPostmanInstall({ allowAsarBackup: true });
  if (shouldLaunch) {
    launchPostmanWithDebugPort(install.installDir, port);
    await new Promise((resolveSleep) => setTimeout(resolveSleep, waitMs));
  }

  const target = await waitForPostmanTarget(port, waitMs);
  const client = await CdpClient.connect(target.webSocketDebuggerUrl);
  try {
    const items = await captureVisibleItems(client);
    const report = await buildAndWriteReport({ install, target, items, shouldApplyKnown });
    console.log(JSON.stringify({ ...report, candidates: report.candidates.slice(0, 20) }, null, 2));
  } finally {
    client.close();
  }
}

export async function buildAndWriteReport({ install, target, items, shouldApplyKnown = false, label = null }) {
  const manualPath = join(repoRoot, 'dictionaries', 'manual-12.7.6.zh-CN.json');
  const localPath = join(repoRoot, 'dictionaries', 'local-core.zh-CN.json');
  const manualDictionary = JSON.parse(await readFile(manualPath, 'utf8'));
  const localDictionary = JSON.parse(await readFile(localPath, 'utf8'));
  const candidates = summarizeUntranslatedItems(items, localDictionary.entries);
  const visibleTexts = items.map((item) => item.text);
  const knownEntries = knownTranslationsForTexts(visibleTexts);
  const added = shouldApplyKnown ? mergeManualEntries(manualDictionary, knownEntries) : [];

  if (shouldApplyKnown && added.length > 0) {
    await writeFile(manualPath, `${JSON.stringify(manualDictionary, null, 2)}\n`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    label,
    postmanVersion: install.version,
    target: {
      title: target.title,
      url: target.url
    },
    visibleItemCount: items.length,
    untranslatedCandidateCount: candidates.length,
    knownTranslationCount: knownEntries.length,
    appliedKnownCount: added.length,
    appliedKnown: added,
    candidates: candidates.slice(0, 300)
  };

  const reportsDir = join(repoRoot, 'reports');
  await mkdir(reportsDir, { recursive: true });
  const reportPath = join(reportsDir, `untranslated-${Date.now()}.json`);
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return { reportPath, ...report };
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
