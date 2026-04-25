import { extractAll, extractFile, listPackage } from '@electron/asar';

export async function listAsar(asarPath) {
  const entries = await listPackage(asarPath);
  const normalized = entries
    .map((entry) => normalizeAsarPath(entry))
    .filter(Boolean);
  return normalized.filter((entry) => !normalized.some((candidate) => candidate.startsWith(`${entry}/`)));
}

export async function extractAsar(asarPath, outputDir) {
  await extractAll(asarPath, outputDir);
  return outputDir;
}

export async function readAsarFile(asarPath, filePath) {
  return extractFile(asarPath, filePath).toString('utf8');
}

function normalizeAsarPath(entry) {
  return entry.replace(/^[/\\]+/, '').replace(/\\/g, '/');
}
