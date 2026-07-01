# Translation Workflow

Postman 12.x renders most of its desktop UI from remote assets. This means translation coverage should be grown from real visible screens instead of only scanning local bundles. The Electron native menu (File/Edit/View/Window/Help) lives in `main.js` as a JSON string and requires a separate approach.

## Capture the Current Screen

Close extra Postman windows if possible, then run:

```powershell
npm run cn:scan-live
```

The script launches or connects to Postman with a remote debugging port, captures visible text nodes plus `placeholder`, `title`, and `aria-label` attributes, and writes a report to:

```text
reports/untranslated-*.json
```

## Sweep Common Screens

Run:

```powershell
npm run cn:sweep-live
```

The sweep script uses bilingual label pairs (Chinese first, English fallback) to navigate sidebar panels. It works regardless of whether Postman is currently localized or not. Each screen is captured after navigation for untranslated text analysis.

## Deep Scan Sub-Panels

The basic sweep covers top-level navigation. For thorough coverage of secondary and tertiary panels (request editor tabs, settings sub-pages, cookie panel, runner results, context menus, command palette, profile menu, notifications), write a custom CDP script that:

1. Discovers all visible interactive elements via `document.querySelectorAll('button, a, [role="button"], [role="tab"], ...')`.
2. Clicks each element and captures the resulting screen.
3. Aggregates untranslated candidates across all screens.

Key considerations for deep scanning:

- Use bilingual labels when clicking — already-translated Chinese labels may not match English fallbacks.
- Allow 2+ seconds after each click for remote-rendered content to load.
- Right-click context menus require dispatching a `contextmenu` MouseEvent with `button: 2`.
- The command palette can be opened via CDP `Input.dispatchKeyEvent` with Ctrl+K.
- Postman ignores `--remote-debugging-port=9223`; the actual CDP port is random and must be extracted from the process stdout line `DevTools listening on ws://127.0.0.1:{port}/...`.

## Electron Native Menu

The native application menu (File, Edit, View, Window, Help) is defined as a JSON string inside `main.js`. The preload DOM localizer cannot reach it because it runs in the renderer process. To translate menu items:

1. Add literal entries with `files: ['main.js']` for multi-word menu labels (e.g., `"Toggle Left Sidebar"`, `"Clear Cache and Reload"`). The `files` restriction ensures the static patcher applies them to `main.js`.

2. Add regex entries for short single-word labels that could collide with substrings in other code (e.g., `"Edit"`, `"File"`, `"Cut"`). Use JSON key-value patterns:

```json
{
  "source": "\"edit_label\":\"Edit\"",
  "target": "\"edit_label\":\"编辑\"",
  "match": "regex",
  "regex": "\"edit_label\":\"Edit\"",
  "files": ["main.js"]
}
```

This matches the exact JSON pair rather than the bare word, avoiding substring corruption.

## Patcher Safety

The static patcher includes two safety mechanisms to prevent identifier corruption:

**Word-boundary matching**: For single-word literal sources (e.g., `"Interface"`, `"Settings"`), the patcher uses `(?<![A-Za-z0-9])source(?![A-Za-z0-9])` to ensure the match is not part of a larger identifier like `getAllInterfaces` or `appSettings`.

**Length-descending sort**: Literal entries are sorted by source length in descending order before replacement. This ensures `"Toggle Left Sidebar"` is replaced before `"Toggle Sidebar"`, preventing the shorter string from corrupting the longer one.

When adding new translations, be aware of these rules:

- Single-word entries are safe — they only match at word boundaries.
- Multi-word entries use substring matching — ensure no entry is a substring of another unless intended.
- For the `main.js` JSON string, prefer regex entries with `"key":"value"` patterns for short words.

## Decide What to Translate

Translate stable UI text:

- buttons;
- tabs;
- menus;
- empty states;
- settings labels;
- tooltips and accessible labels;
- request and response workflow text.

Do not translate user data:

- workspace names;
- collection names;
- request names;
- profile names;
- dates and timestamps;
- IDs, hashes, URLs, paths;
- model names;
- version strings;
- generated response content.

## Add Known Translations

Safe hand translations live in:

```text
src/untranslatedWorkflow.js
```

Most entries should be exact matches:

```js
{ source: 'Open search', target: '打开搜索' }
```

Use `runtimeStrategy: 'phrase'` only for stable phrases embedded in dynamic text:

```js
{ source: "'s Workspace", target: '的工作区', runtimeStrategy: 'phrase' }
```

Use `files` to restrict entries to specific files (required for `main.js` menu translations):

```js
{ source: 'Toggle Full Screen', target: '切换全屏', files: ['main.js'] }
```

Then regenerate the merged dictionary:

```powershell
npm run cn:rebuild-dictionary
```

## Filter Tuning

The candidate filter in `untranslatedWorkflow.js` excludes common false positives:

- `{{...}}` Postman variable syntax (e.g., `{{base_url}}/users`).
- URL path segments starting with `/`.
- English month-date formats (e.g., `April 30`, `May 1`).
- `[object Object]` rendering artifacts.
- Trailing emoji (stripped by `normalizeVisibleText`).
- Mixed Chinese-English text where all English words are recognized product/brand names (case-insensitive matching via `isMostlyLocalizedMixedText`).

When new false positives appear, extend the filter or the allowed word list rather than adding ignore-list entries.

## Verify

Run:

```powershell
npm test
npm run cn:dry-run
```

Install and capture again:

```powershell
npm run cn:install
npm run cn:sweep-live
```

A good report has `untranslatedCandidateCount` close to zero for the screens you covered. Some English product names and technical terms should remain, such as Postman, API, HTTP, GitHub, npm, Chrome, and VS Code.

After a deep sweep, the remaining candidates should be exclusively user data (collection names, URLs, test result text) or already-translated Chinese text mixed with user data.
