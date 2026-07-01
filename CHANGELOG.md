# Changelog

All notable changes to this project will be documented in this file.

## 0.2.0

- **Translation coverage**: expanded from 266 to ~350 known UI translations, covering run results, Vault panel, proxy panel, cookie management, command palette, notifications, Git integration, and error states.
- **Electron native menu**: added ~70 menu translations (File, Edit, View, Window, Help, GPU, Region) with `files: ['main.js']` scoping for static patching of the main process JSON template.
- **Patcher safety**: added word-boundary matching in `replaceOneLiteral` for single-word sources to prevent camelCase identifier corruption (e.g., `Interface` no longer replaces inside `getAllInterfaces`). Added source-length descending sort in `replaceAllLiteralEntries` so longer strings are replaced before their substrings.
- **Regex entries**: added JSON key-value regex entries for short menu words (`Edit`, `File`, `Cut`, `Copy`, etc.) to avoid substring collisions in the main process JSON string.
- **Sweep bilingual navigation**: `sweep-postman-ui.js` now uses bilingual label pairs (Chinese first, English fallback), working regardless of whether localization is installed.
- **Filter improvements**: `isCandidateText` now excludes `{{...}}` template variables, URL path segments, English month-date formats, and `[object Object]` artifacts. `normalizeVisibleText` strips trailing emoji. `isMostlyLocalizedMixedText` uses case-insensitive matching with an expanded allowed word list.
- **Dictionary pipeline**: `mergeManualEntries` now preserves the `files` property from source entries. Manual dictionary grew from 477 to 618 entries; merged dictionary from 18,745 to 18,813.
- Verified on Postman Desktop `12.17.2` with deep sweep across 12+ screens: zero untranslated UI text remaining.

## 0.1.0

- Added Windows-first Node CLI for detecting, scanning, installing, and restoring Postman localization overrides.
- Added safe ASAR extraction workflow that keeps the original `app.asar` as `app.asar.postman-cn.bak`.
- Added Postman 12.x preload DOM localizer for remote-rendered desktop UI text.
- Added `install-cn.cmd` as the single Windows entry point for install, restore, and detection.
- Added generated dictionary merge from legacy `hlmd/Postman-cn` PHP language files.
- Added hand-maintained Postman 12.7.6 UI translations for core desktop workflows.
- Added live Postman UI capture and sweep scripts through Electron DevTools Protocol.
- Added tests for locator, dictionary validation, ASAR adapter, patcher, scanner, installer, restore, and translation workflow helpers.
