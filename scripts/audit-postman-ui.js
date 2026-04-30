#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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
import {
  knownTranslationsForTexts,
  mergeManualEntries,
  summarizeUntranslatedItems
} from '../src/untranslatedWorkflow.js';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = new Set(process.argv.slice(2));
const port = Number(getArg('--port') ?? 9223);
const waitMs = Number(getArg('--wait-ms') ?? 15000);
const afterClickMs = Number(getArg('--after-click-ms') ?? 2500);
const shouldLaunch = args.has('--launch');
const shouldApplyKnown = args.has('--apply-known');
const shouldGenerateScript = args.has('--generate-script');
const clickLabels = getAllArgs('--click');

const defaultSteps = [
  { label: '首页', click: null },
  { label: '集合', click: '集合' },
  { label: '环境', click: '环境' },
  { label: '历史', click: '历史' },
  { label: 'API', click: 'API' },
  { label: '设置', click: '设置' },
  { label: '文档', click: '文档' }
];

assertWebSocketSupport();

async function main() {
  const install = await findLatestPostmanInstall({ allowAsarBackup: true });

  if (shouldLaunch) {
    console.error(`[audit] 启动 Postman (port ${port})...`);
    launchPostmanWithDebugPort(install.installDir, port);
    await sleep(waitMs);
  }

  console.error('[audit] 连接 CDP...');
  const target = await waitForPostmanTarget(port, waitMs);
  const client = await CdpClient.connect(target.webSocketDebuggerUrl);

  const auditDir = join(repoRoot, 'reports', `audit-${Date.now()}`);
  await mkdir(auditDir, { recursive: true });

  const steps = buildSteps();
  const results = [];

  try {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.error(`[audit] (${i + 1}/${steps.length}) ${step.label}`);

      if (step.click) {
        const clickResult = await clickVisibleText(client, step.click);
        if (!clickResult.clicked) {
          console.error(`  -> 未找到 "${step.click}"，跳过`);
          results.push({ ...step, skipped: true, reason: 'element not found' });
          continue;
        }
        await sleep(afterClickMs);
      } else {
        await sleep(1500);
      }

      const [screenshot, items] = await Promise.all([
        client.screenshot(),
        captureVisibleItems(client)
      ]);

      const screenshotFile = `${String(i + 1).padStart(2, '0')}-${sanitize(step.label)}.png`;
      await writeFile(join(auditDir, screenshotFile), screenshot);

      const pageInfo = await client.getPageInfo();
      const candidates = summarizeUntranslatedItems(items, []);
      const knownEntries = knownTranslationsForTexts(items.map((item) => item.text));

      let appliedKnown = [];
      if (shouldApplyKnown) {
        const manualPath = join(repoRoot, 'dictionaries', 'manual-12.7.6.zh-CN.json');
        const manualDictionary = JSON.parse(await readFile(manualPath, 'utf8'));
        appliedKnown = mergeManualEntries(manualDictionary, knownEntries);
        if (appliedKnown.length > 0) {
          await writeFile(manualPath, `${JSON.stringify(manualDictionary, null, 2)}\n`);
        }
      }

      results.push({
        step: i + 1,
        label: step.label,
        click: step.click,
        screenshot: screenshotFile,
        url: pageInfo.url,
        title: pageInfo.title,
        visibleItemCount: items.length,
        untranslatedCount: candidates.length,
        knownTranslationCount: knownEntries.length,
        appliedKnownCount: appliedKnown.length,
        candidates: candidates.slice(0, 100)
      });

      console.error(`  -> ${items.length} 可见项, ${candidates.length} 未翻译, ${knownEntries.length} 已知`);
    }
  } finally {
    client.close();
  }

  const aggregate = aggregateResults(results);

  const report = {
    generatedAt: new Date().toISOString(),
    postmanVersion: install.version,
    screenshotDir: auditDir,
    stepCount: results.length,
    steps: results.map(({ candidates, ...rest }) => rest),
    uniqueUntranslated: aggregate.length,
    untranslated: aggregate
  };

  const reportPath = join(auditDir, 'report.json');
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.error(`\n[audit] 完成！截图和报告保存在:\n  ${auditDir}`);
  console.log(JSON.stringify({
    reportPath,
    screenshotDir: auditDir,
    stepCount: results.length,
    uniqueUntranslated: aggregate.length,
    topUntranslated: aggregate.slice(0, 50)
  }, null, 2));

  if (shouldGenerateScript) {
    await generateFixScript(aggregate, auditDir);
  }
}

function buildSteps() {
  if (clickLabels.length > 0) {
    return [
      { label: '首页', click: null },
      ...clickLabels.map((label) => ({ label, click: label }))
    ];
  }
  return defaultSteps;
}

function aggregateResults(results) {
  const map = new Map();
  for (const result of results) {
    for (const candidate of result.candidates ?? []) {
      const existing = map.get(candidate.text) ?? {
        text: candidate.text,
        totalCount: 0,
        pages: [],
        knownTranslation: candidate.knownTranslation
      };
      existing.totalCount += candidate.count;
      if (!existing.pages.includes(result.label)) existing.pages.push(result.label);
      if (!existing.knownTranslation && candidate.knownTranslation) {
        existing.knownTranslation = candidate.knownTranslation;
      }
      map.set(candidate.text, existing);
    }
  }
  return [...map.values()]
    .map((item) => ({
      ...item,
      knownTranslation: item.knownTranslation?.target ?? null
    }))
    .sort((a, b) => b.totalCount - a.totalCount || a.text.localeCompare(b.text));
}

async function generateFixScript(untranslated, auditDir) {
  const autoEntries = untranslated
    .filter((item) => item.knownTranslation)
    .map((item) => ({
      source: item.text,
      target: item.knownTranslation,
      match: 'literal'
    }));

  const unknownEntries = untranslated
    .filter((item) => !item.knownTranslation)
    .slice(0, 100)
    .map((item) => ({
      source: item.text,
      pages: item.pages,
      totalCount: item.totalCount
    }));

  const scriptPath = join(auditDir, 'suggested-fixes.json');
  await writeFile(scriptPath, JSON.stringify({
    autoFixable: autoEntries,
    needsTranslation: unknownEntries
  }, null, 2));

  console.error(`[audit] 修复建议已生成: ${scriptPath}`);
  console.error(`  - ${autoEntries.length} 条可自动修复（已有翻译）`);
  console.error(`  - ${unknownEntries.length} 条需要人工翻译`);
}

function sanitize(value) {
  return value.replace(/[^\w一-鿿-]/g, '_').slice(0, 30);
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
