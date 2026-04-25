# Postman CN Modern

[![CI](https://github.com/zipenglu1/postman-cn-modern/actions/workflows/ci.yml/badge.svg)](https://github.com/zipenglu1/postman-cn-modern/actions/workflows/ci.yml)
[![Postman](https://img.shields.io/badge/Postman-12.x-orange)](https://www.postman.com/)
[![Windows](https://img.shields.io/badge/Windows-first-blue)](#requirements)
[![Node](https://img.shields.io/badge/Node.js-20%2B-339933)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

一个面向新版 Postman Desktop 的 Windows 优先汉化工具。它延续 `hlmd/Postman-cn` 的本地覆盖思路，但把旧的 PHP 静态替换流程升级为可维护的 Node CLI、运行时 DOM 本地化器和自动化补词工作流。

当前主要适配：Postman Desktop `12.x`，已在 `12.7.6` 上验证。

> Disclaimer: This project is community-maintained and is not affiliated with, endorsed by, or sponsored by Postman, Inc. Postman is a trademark of Postman, Inc.

## Highlights

- One-file Windows entry: double-click `install-cn.cmd`.
- Safe by default: does not modify Postman's original `app.asar` in place.
- Reversible install: restore English UI from the same menu.
- Postman 12 ready: handles the remote-rendered desktop UI through `preload_desktop.js`.
- Automation friendly: capture untranslated visible text from a live Postman window and grow the dictionary iteratively.
- Version aware: detects the latest `%LOCALAPPDATA%\Postman\app-*` installation.
- Tested core: locator, dictionary validation, ASAR extraction, patching, install/restore, and scanner behavior are covered by Node tests.

## How It Works

Postman is an Electron app. Recent builds still ship `resources/app.asar`, but most normal UI text is loaded from `desktop.postman.com`. Replacing only local bundle files is no longer enough.

This tool uses a two-layer approach:

1. Extract Postman's `resources/app.asar` to a temporary directory.
2. Inject a small localizer into `preload_desktop.js`.
3. Install the patched unpacked app as `resources/app`.
4. Rename the original `app.asar` to `app.asar.postman-cn.bak`.
5. Electron loads `resources/app`, and the preload localizer translates visible text, placeholders, titles, and aria labels after React renders.

The original ASAR is kept as the restore source. `restore` removes only the override created by this tool and moves the backup back to `app.asar`.

## Requirements

- Windows 10/11
- Node.js 20 or newer
- Postman Desktop installed under `%LOCALAPPDATA%\Postman\app-*`

## Quick Start

1. Download or clone this repository.
2. Close Postman completely.
3. Double-click:

```text
install-cn.cmd
```

4. Choose:

```text
1. Install Chinese UI
```

Start Postman normally after the script finishes.

To restore English later, run `install-cn.cmd` again and choose:

```text
2. Restore English UI
```

The same menu also provides:

```text
3. Detect Postman only
```

Advanced users can also run the same file from a terminal:

```powershell
.\install-cn.cmd install
.\install-cn.cmd restore
.\install-cn.cmd detect
```

## CLI Usage

Install dependencies:

```powershell
npm install
```

Detect Postman:

```powershell
npm run cn:detect
```

Preview the patch without writing to Postman's installation directory:

```powershell
npm run cn:dry-run
```

Install the Chinese override:

```powershell
npm run cn:install
```

Restore the original English app:

```powershell
npm run cn:restore
```

Run tests:

```powershell
npm test
```

## Translation Workflow

Postman 12 UI changes frequently, so the dictionary is designed to be expanded from real screens.

Capture the current live Postman window:

```powershell
npm run cn:scan-live
```

Sweep common navigation entries:

```powershell
npm run cn:sweep-live
```

Regenerate the merged dictionary after adding known translations:

```powershell
npm run cn:rebuild-dictionary
```

Generated reports are written to `reports/untranslated-*.json` and are ignored by Git.

See [docs/TRANSLATION_WORKFLOW.md](docs/TRANSLATION_WORKFLOW.md) for the full workflow.

## Project Layout

```text
bin/postman-cn.js                 CLI entry
src/postmanLocator.js             Windows Postman discovery
src/asarAdapter.js                ASAR list/extract adapter
src/dictionary.js                 Dictionary loading and validation
src/patcher.js                    Text replacement and preload injection
src/installer.js                  Install and restore logic
src/postmanCdp.js                 Live UI capture helpers
src/untranslatedWorkflow.js       Known-safe UI translations and report filtering
dictionaries/manual-12.7.6.zh-CN.json
dictionaries/local-core.zh-CN.json
scripts/capture-postman-untranslated.js
scripts/sweep-postman-ui.js
php/lang/                         Legacy translation source from hlmd/Postman-cn
```

## Safety Model

- The tool does not patch Postman's `app.asar` in place.
- Existing `resources/app` directories not created by this tool are refused by default.
- `restore` requires the manifest generated during install.
- Postman must be closed before install or restore.
- Official Postman updates are not blocked. After an update, run `install-cn.cmd` again.
- Text rendered inside images, canvas, closed shadow DOM, or remote account content may remain outside scope.

## Troubleshooting

### Node.js was not found

Install Node.js 20 or newer from <https://nodejs.org/>, then run `install-cn.cmd` again.

### Postman is still English

Close every Postman process, run `install-cn.cmd`, choose option `1`, then start Postman again. If Postman auto-updated, reinstall the override for the new version.

### Install failed because Postman is running

Exit Postman from the tray or kill remaining `Postman.exe` processes in Task Manager, then retry.

### Postman shows a blank loading screen

Run `install-cn.cmd` and choose option `2` to restore English. Then open an issue with your Postman version and the install output.

## Roadmap

- Broader Postman 12.x screen coverage.
- More automated UI traversal for translation discovery.
- macOS and Linux locator/install support.
- Release packaging so users can download a zip instead of cloning.
- Optional dictionary packs by Postman major version.

## Credits

This project is inspired by and uses legacy translation material from [hlmd/Postman-cn](https://github.com/hlmd/Postman-cn). The modern Node CLI, Postman 12 runtime localizer, installer, automation scripts, tests, and current dictionary expansion are maintained here.

See [NOTICE.md](NOTICE.md) for attribution and licensing notes.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting larger changes.

## License

The new Node-based implementation in this repository is released under the MIT License. Legacy material from `hlmd/Postman-cn` is retained with attribution; see [NOTICE.md](NOTICE.md).
