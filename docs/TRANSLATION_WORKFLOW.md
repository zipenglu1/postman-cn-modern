# Translation Workflow

Postman 12.x renders most of its desktop UI from remote assets. This means translation coverage should be grown from real visible screens instead of only scanning local bundles.

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

The sweep script clicks common visible navigation entries and captures each screen. It is intentionally conservative and avoids destructive actions.

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

Then regenerate the merged dictionary:

```powershell
npm run cn:rebuild-dictionary
```

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
