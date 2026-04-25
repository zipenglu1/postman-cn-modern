import fg from 'fast-glob';
import picomatch from 'picomatch';

export const LOCAL_CORE_INCLUDE = [
  'html/**/*.html',
  'js/**/*.js',
  '*.min.js',
  'main.js'
];

export const LOCAL_CORE_EXCLUDE = [
  '**/node_modules/**',
  '**/*.LICENSE.txt',
  '**/*.map',
  '**/*.woff',
  '**/*.woff2',
  '**/*.ttf',
  '**/*.png',
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.gif',
  '**/*.svg',
  '**/*.crt',
  '**/*.pem',
  '**/*.key'
];

export async function listLocalCoreFiles(appDir) {
  return fg(LOCAL_CORE_INCLUDE, {
    cwd: appDir,
    onlyFiles: true,
    dot: false,
    ignore: LOCAL_CORE_EXCLUDE
  });
}

export function entryMatchesFile(entry, filePath) {
  if (!entry.files || entry.files.length === 0) return true;
  return picomatch(entry.files, { dot: false })(filePath);
}
