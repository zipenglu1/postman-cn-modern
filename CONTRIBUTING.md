# Contributing

Thanks for helping improve Postman CN Modern.

## Good First Contributions

- Add translations for visible untranslated Postman 12.x UI text.
- Improve Windows install and restore reliability.
- Add regression tests for dictionary, patcher, installer, or scanner behavior.
- Improve documentation for common install issues.

## Development Setup

```powershell
npm install
npm test
```

Detect your local Postman install:

```powershell
npm run cn:detect
```

Run a dry run before installing:

```powershell
npm run cn:dry-run
```

## Translation Rules

- Prefer exact visible UI strings over broad regex replacements.
- Keep product names such as Postman, API, HTTP, SSL/TLS, Git, GitHub, Chrome, VS Code, and npm when that is clearer for users.
- Do not translate user-generated content such as workspace names, collection names, profile names, dates, IDs, versions, model names, or file paths.
- Use `runtimeStrategy: "phrase"` only when the source is a stable phrase inside dynamic text.
- Avoid changing local JavaScript bundles unless an entry has a narrow `files` allowlist.

## Capture Workflow

Run Postman and capture visible untranslated text:

```powershell
npm run cn:scan-live
```

Sweep common pages:

```powershell
npm run cn:sweep-live
```

Reports are written to `reports/` and ignored by Git. Move safe translations into `src/untranslatedWorkflow.js`, then regenerate:

```powershell
npm run cn:rebuild-dictionary
npm test
```

## Pull Request Checklist

- The PR explains which Postman version was tested.
- `npm test` passes.
- New translations were verified through live capture or a clear screenshot.
- Install and restore behavior was not weakened.
- No generated `reports/`, `node_modules/`, extracted Postman app files, or local ASAR files are committed.
