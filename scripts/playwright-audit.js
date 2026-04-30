#!/usr/bin/env node
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { _electron as electron } from 'playwright';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const auditDir = join(repoRoot, 'reports', `playwright-audit-${Date.now()}`);
await mkdir(auditDir, { recursive: true });

const postmanExe = join(
  process.env.LOCALAPPDATA,
  'Postman', 'app-12.8.4', 'Postman.exe'
);

console.error('[audit] 启动 Postman via Playwright Electron...');
const app = await electron.launch({
  executablePath: postmanExe,
  args: ['--disable-gpu'],
  timeout: 30000
});

const page = await app.firstWindow();
await page.waitForLoadState('domcontentloaded');
console.error('[audit] Postman 已启动，等待界面加载...');
await page.waitForTimeout(5000);

const steps = [
  { label: '首页', action: null },
  { label: '集合', action: async () => clickByText(page, 'Collections') || clickByText(page, '集合') },
  { label: '环境', action: async () => clickByText(page, 'Environments') || clickByText(page, '环境') },
  { label: '历史', action: async () => clickByText(page, 'History') || clickByText(page, '历史') },
  { label: '设置', action: async () => clickByText(page, 'Settings') || clickByText(page, '设置') }
];

const results = [];

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];
  console.error(`[audit] (${i + 1}/${steps.length}) ${step.label}`);

  if (step.action) {
    const clicked = await step.action();
    if (!clicked) {
      console.error(`  -> 未找到按钮，跳过`);
      results.push({ step: i + 1, label: step.label, skipped: true });
      continue;
    }
    await page.waitForTimeout(2500);
  } else {
    await page.waitForTimeout(1500);
  }

  const screenshotFile = `${String(i + 1).padStart(2, '0')}-${step.label}.png`;
  await page.screenshot({ path: join(auditDir, screenshotFile), fullPage: false });

  const textItems = await captureVisibleText(page);
  const englishItems = textItems.filter(item => /[A-Za-z]/.test(item.text) && !isExcluded(item.text));

  results.push({
    step: i + 1,
    label: step.label,
    screenshot: screenshotFile,
    totalItems: textItems.length,
    englishItems: englishItems.length,
    englishTexts: englishItems.map(item => item.text).slice(0, 50)
  });

  console.error(`  -> ${textItems.length} 可见项, ${englishItems.length} 英文项`);
}

await app.close();

const report = {
  generatedAt: new Date().toISOString(),
  auditDir,
  steps: results,
  allEnglish: aggregateEnglish(results)
};

const reportPath = join(auditDir, 'report.json');
await writeFile(reportPath, JSON.stringify(report, null, 2));

console.error(`\n[audit] 完成！截图和报告在:\n  ${auditDir}`);
console.log(JSON.stringify(report, null, 2));

async function clickByText(page, text) {
  try {
    const el = page.getByText(text, { exact: true }).first();
    if (await el.isVisible({ timeout: 1000 })) {
      await el.click();
      return true;
    }
  } catch {}
  try {
    const el = page.locator(`text="${text}"`).first();
    if (await el.isVisible({ timeout: 1000 })) {
      await el.click();
      return true;
    }
  } catch {}
  return false;
}

async function captureVisibleText(page) {
  return page.evaluate(() => {
    const items = [];
    const normalize = (v) => String(v || '').replace(/\s+/g, ' ').trim();
    const isVisible = (el) => {
      if (!el) return false;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) continue;
      if (!isVisible(parent)) continue;
      const text = normalize(node.nodeValue);
      if (text && text.length >= 2 && text.length <= 200) {
        items.push({ text, tag: parent.tagName.toLowerCase() });
      }
    }

    for (const el of document.querySelectorAll('[placeholder], [title], [aria-label]')) {
      if (!isVisible(el)) continue;
      for (const attr of ['placeholder', 'title', 'aria-label']) {
        if (el.hasAttribute(attr)) {
          const text = normalize(el.getAttribute(attr));
          if (text && text.length >= 2 && text.length <= 200) {
            items.push({ text, kind: attr, tag: el.tagName.toLowerCase() });
          }
        }
      }
    }
    return items;
  });
}

function isExcluded(text) {
  if (!/[A-Za-z]/.test(text)) return true;
  if (/https?:\/\//i.test(text)) return true;
  if (/^\d+\.\d+\.\d+/.test(text)) return true;
  if (/^(Ctrl|Alt|Shift|Cmd|⌘|⌥|⇧|⌃)[,+\w -]*$/i.test(text)) return true;
  if (/^Claude\s+\w+/.test(text)) return true;
  if (/^\d{1,2}:\d{2}\s*(AM|PM)/.test(text)) return true;
  if (/^[A-Z]{2,8}$/.test(text)) return true;
  return false;
}

function aggregateEnglish(results) {
  const map = new Map();
  for (const result of results) {
    for (const text of result.englishTexts ?? []) {
      const existing = map.get(text) ?? { text, count: 0, pages: [] };
      existing.count += 1;
      if (!existing.pages.includes(result.label)) existing.pages.push(result.label);
      map.set(text, existing);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}
