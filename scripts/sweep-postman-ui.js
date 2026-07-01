#!/usr/bin/env node
import { findLatestPostmanInstall } from '../src/postmanLocator.js';
import {
  assertWebSocketSupport,
  captureVisibleItems,
  CdpClient,
  clickVisibleText,
  launchPostmanWithDebugPort,
  sleep,
  waitForPostmanTarget
} from '../src/postmanCdp.js';
import { buildAndWriteReport } from './capture-postman-untranslated.js';

const args = new Set(process.argv.slice(2));
const port = Number(getArg('--port') ?? 9223);
const waitMs = Number(getArg('--wait-ms') ?? 12000);
const afterClickMs = Number(getArg('--after-click-ms') ?? 1800);
const shouldLaunch = args.has('--launch');
const shouldApplyKnown = args.has('--apply-known');
const clickLabels = getAllArgs('--click');
const defaultLabelPairs = [
  ['集合', 'Collections'],
  ['环境', 'Environments'],
  ['工作区', 'Workspaces'],
  ['API', 'APIs'],
  ['监视器', 'Monitors'],
  ['模拟服务器', 'Mock servers'],
  ['历史', 'History'],
  ['设置', 'Settings'],
  ['应用', 'Apps'],
  ['文档', 'Documentation'],
  ['更新', 'Updates'],
  ['保险库', 'Vault'],
  ['工具', 'Tools'],
  ['流程', 'Flows']
];

assertWebSocketSupport();

async function main() {
  const install = await findLatestPostmanInstall({ allowAsarBackup: true });
  if (shouldLaunch) {
    launchPostmanWithDebugPort(install.installDir, port);
    await sleep(waitMs);
  }

  const target = await waitForPostmanTarget(port, waitMs);
  const client = await CdpClient.connect(target.webSocketDebuggerUrl);
  const reports = [];
  const clicks = [];

  try {
    reports.push(await captureStep({ client, install, target, label: 'initial' }));
    if (clickLabels.length > 0) {
      for (const label of clickLabels) {
        const click = await clickVisibleText(client, label);
        clicks.push(click);
        if (!click.clicked) continue;
        await sleep(afterClickMs);
        reports.push(await captureStep({ client, install, target, label }));
      }
    } else {
      for (const [zh, en] of defaultLabelPairs) {
        let click = await clickVisibleText(client, zh);
        if (!click.clicked) {
          click = await clickVisibleText(client, en);
        }
        const label = click.clicked ? (click.label || zh) : `${zh}/${en}`;
        clicks.push(click);
        if (!click.clicked) continue;
        await sleep(afterClickMs);
        reports.push(await captureStep({ client, install, target, label }));
      }
    }
  } finally {
    client.close();
  }

  const aggregate = aggregateReports(reports);
  console.log(JSON.stringify({
    postmanVersion: install.version,
    clicks,
    reportPaths: reports.map((report) => report.reportPath),
    uniqueCandidateCount: aggregate.length,
    topCandidates: aggregate.slice(0, 80)
  }, null, 2));
}

async function captureStep({ client, install, target, label }) {
  const items = await captureVisibleItems(client);
  return buildAndWriteReport({ install, target, items, shouldApplyKnown, label });
}

function aggregateReports(reports) {
  const candidates = new Map();
  for (const report of reports) {
    for (const candidate of report.candidates) {
      const existing = candidates.get(candidate.text) ?? {
        text: candidate.text,
        count: 0,
        labels: new Set(),
        knownTranslation: candidate.knownTranslation
      };
      existing.count += candidate.count;
      existing.labels.add(report.label ?? 'unknown');
      if (!existing.knownTranslation && candidate.knownTranslation) {
        existing.knownTranslation = candidate.knownTranslation;
      }
      candidates.set(candidate.text, existing);
    }
  }
  return [...candidates.values()]
    .map((candidate) => ({
      ...candidate,
      labels: [...candidate.labels],
      knownTranslation: candidate.knownTranslation?.target ?? null
    }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function getAllArgs(name) {
  const values = [];
  for (let index = 0; index < process.argv.length; index += 1) {
    if (process.argv[index] === name && process.argv[index + 1]) {
      values.push(process.argv[index + 1]);
    }
  }
  return values;
}

await main();
