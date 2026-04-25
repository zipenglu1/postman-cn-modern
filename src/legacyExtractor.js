import { readFile } from 'node:fs/promises';

const PAIR_PATTERN = /(['"])((?:\\.|(?!\1)[\s\S])*?)\1\s*=>\s*(['"])((?:\\.|(?!\3)[\s\S])*?)\3/g;

export async function extractLegacyRuntimeEntries(files) {
  const entries = new Map();

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    for (const match of content.matchAll(PAIR_PATTERN)) {
      for (const pair of deriveVisiblePairs(unescapePhpString(match[2]), unescapePhpString(match[4]))) {
        if (!isUsefulVisiblePair(pair.source, pair.target)) continue;
        if (!entries.has(pair.source)) {
          entries.set(pair.source, {
            source: pair.source,
            target: pair.target,
            match: 'literal',
            runtimeOnly: true
          });
        }
      }
    }
  }

  return [...entries.values()].sort((a, b) => a.source.localeCompare(b.source));
}

export function deriveVisiblePairs(source, target) {
  const pairs = [{ source, target }];

  const stripped = stripMatchingQuotes(source, target);
  if (stripped) pairs.push(stripped);

  const sourceInner = extractPropertyStringValue(source);
  const targetInner = extractPropertyStringValue(target);
  if (sourceInner && targetInner) {
    pairs.push({ source: sourceInner, target: targetInner });
  }

  return dedupePairs(pairs);
}

function stripMatchingQuotes(source, target) {
  const sourceQuote = source[0];
  const targetQuote = target[0];
  if (!['"', "'", '`'].includes(sourceQuote) || source.at(-1) !== sourceQuote) return null;
  if (!['"', "'", '`'].includes(targetQuote) || target.at(-1) !== targetQuote) return null;
  return {
    source: source.slice(1, -1),
    target: target.slice(1, -1)
  };
}

function extractPropertyStringValue(value) {
  const match = value.match(/^[A-Za-z_$][\w$.-]*\s*:\s*(['"])(.*?)\1$/);
  return match?.[2] ?? null;
}

function isUsefulVisiblePair(source, target) {
  if (!source || !target || source === target) return false;
  if (source.includes('______') || target.includes('______')) return false;
  if (!/[A-Za-z]/.test(source)) return false;
  if (!/[\u3400-\u9fff]/.test(target)) return false;
  if (source.length < 2 || source.length > 100 || target.length > 120) return false;
  if (/^\/.*\/[a-z]*$/.test(source)) return false;
  if (/\\[bdwWsS]|\(\?|\[[^\]]+\]|\{\d/.test(source)) return false;
  if (/^(https?:|file:|\/|\.\/|[A-Za-z]:\\)/.test(source)) return false;
  if (/^[A-Za-z_$][\w$]*\([^)]*\)$/.test(source)) return false;
  if (/^[A-Za-z_$][\w$]*\.[A-Za-z_$][\w$.]*$/.test(source)) return false;
  if (/^[a-z][a-z0-9_.-]{0,2}$/.test(source)) return false;
  return true;
}

function unescapePhpString(value) {
  return value
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
}

function dedupePairs(pairs) {
  const seen = new Set();
  return pairs.filter((pair) => {
    const key = `${pair.source}\u0000${pair.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
