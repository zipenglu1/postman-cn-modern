import { readFile } from 'node:fs/promises';
import semver from 'semver';

export async function loadDictionary(dictionaryPath, postmanVersion) {
  const data = JSON.parse(await readFile(dictionaryPath, 'utf8'));
  validateDictionaryShape(data);

  if (!semver.satisfies(postmanVersion, data.versionRange, { includePrerelease: true })) {
    throw new Error(`Postman ${postmanVersion} does not satisfy dictionary range ${data.versionRange}`);
  }

  return {
    versionRange: data.versionRange,
    entries: data.entries.map((entry, index) => normalizeEntry(entry, index))
  };
}

function validateDictionaryShape(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Dictionary must be a JSON object');
  }
  if (typeof data.versionRange !== 'string' || data.versionRange.trim() === '') {
    throw new Error('Dictionary versionRange must be a non-empty string');
  }
  if (!Array.isArray(data.entries)) {
    throw new Error('Dictionary entries must be an array');
  }
}

function normalizeEntry(entry, index) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error(`entries[${index}] must be an object`);
  }
  for (const field of ['source', 'target']) {
    if (typeof entry[field] !== 'string' || entry[field] === '') {
      throw new Error(`entries[${index}].${field} must be a non-empty string`);
    }
  }

  const match = entry.match ?? 'literal';
  if (!['literal', 'regex'].includes(match)) {
    throw new Error(`entries[${index}].match must be "literal" or "regex"`);
  }
  if (entry.files !== undefined && (!Array.isArray(entry.files) || entry.files.some((item) => typeof item !== 'string'))) {
    throw new Error(`entries[${index}].files must be an array of glob strings`);
  }
  if (entry.runtimeOnly !== undefined && typeof entry.runtimeOnly !== 'boolean') {
    throw new Error(`entries[${index}].runtimeOnly must be a boolean`);
  }
  if (
    entry.runtimeStrategy !== undefined &&
    !['exact', 'phrase'].includes(entry.runtimeStrategy)
  ) {
    throw new Error(`entries[${index}].runtimeStrategy must be "exact" or "phrase"`);
  }

  const normalized = {
    source: entry.source,
    target: entry.target,
    match,
    files: entry.files ?? [],
    runtimeOnly: entry.runtimeOnly === true,
    runtimeStrategy: entry.runtimeStrategy ?? 'exact'
  };

  if (match === 'regex') {
    try {
      normalized.regex = new RegExp(entry.source, 'g');
    } catch (error) {
      throw new Error(`entries[${index}] invalid regex: ${error.message}`);
    }
  }

  return normalized;
}
