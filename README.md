# Postman CN Modern

[![CI](https://github.com/zipenglu1/postman-cn-modern/actions/workflows/ci.yml/badge.svg)](https://github.com/zipenglu1/postman-cn-modern/actions/workflows/ci.yml)
[![Postman](https://img.shields.io/badge/Postman-12.x%20recommended-orange)](https://www.postman.com/)
[![Windows](https://img.shields.io/badge/Windows-first-blue)](#requirements--系统要求)
[![Node](https://img.shields.io/badge/Node.js-20%2B-339933)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> English README is included below.
> <p align="center">
  <a href="#中文">中文</a> · <a href="#english">English</a>
</p>
> 本文档包含中文和英文两版说明。

## 中文说明

Postman CN Modern 是一个面向新版 Postman Desktop 的 Windows 优先汉化工具。它延续 [hlmd/Postman-cn](https://github.com/hlmd/Postman-cn) 的本地覆盖思路，但将旧的 PHP 静态替换流程升级为可维护的 Node CLI、ASAR 安装器、运行时 DOM 本地化器和自动化补词工作流。

**强烈建议用于 Postman Desktop 12.x。当前已在 Postman `12.7.6` 上重点验证。**

Postman 11.x、9.x 或更老版本的文件结构和加载方式差异较大，不建议直接使用当前版本。未来 Postman 13.x 也需要确认兼容后再放开版本范围。

> 免责声明：本项目是社区维护项目，与 Postman, Inc. 没有关联、授权、赞助或背书关系。Postman 是 Postman, Inc. 的商标。

### 特性

- 一个 Windows 入口：双击 `install-cn.cmd`。
- 安全安装：不直接修改原始 `resources/app.asar`。
- 可恢复：同一个菜单可恢复英文界面。
- 适配 Postman 12：通过 `preload_desktop.js` 处理远程渲染的桌面 UI。
- 自动补词：可从正在运行的 Postman 窗口捕获未汉化可见文本。
- 自动检测版本：扫描 `%LOCALAPPDATA%\Postman\app-*` 并选择最新 semver 版本。
- 有测试覆盖：检测、字典校验、ASAR 解包、安装/恢复、patcher、scanner 等核心逻辑均有测试。

### 版本支持

| Postman 版本 | 状态 | 说明 |
| --- | --- | --- |
| 12.7.6 | 已重点验证 | 当前主要目标版本 |
| 12.x | 推荐尝试 | 字典范围为 `>=12.0.0 <13.0.0`，新版小版本建议先 dry-run |
| 13.x | 暂不支持 | 需要重新验证 UI 与 preload 结构 |
| 11.x 及更早 | 不建议 | 文件结构和旧仓库时代差异较大 |

如果你使用的不是 `12.7.6`，建议先运行：

```powershell
npm run cn:detect
npm run cn:dry-run
```

确认 dry-run 能正常注入 `preload_desktop.js` 后再安装。

### 工作原理

Postman 是 Electron 应用。新版 Postman 仍然包含 `resources/app.asar`，但很多主界面文案会从 `desktop.postman.com` 远程加载，仅替换本地 bundle 已经无法覆盖主要界面。

本工具采用两层方案：

1. 解包 Postman 的 `resources/app.asar` 到临时目录。
2. 在 `preload_desktop.js` 注入一个轻量 DOM 本地化器。
3. 将 patch 后的目录安装为 `resources/app`。
4. 将原始 `app.asar` 重命名为 `app.asar.postman-cn.bak`。
5. Electron 启动时加载 `resources/app`，preload 本地化器在 React 渲染后翻译可见文本、placeholder、title 和 aria-label。

恢复时会删除本工具创建的 `resources/app`，并把备份的 `app.asar.postman-cn.bak` 还原为 `app.asar`。

### 系统要求

- Windows 10/11
- Node.js 20 或更高版本
- Postman Desktop 安装在 `%LOCALAPPDATA%\Postman\app-*`
- 推荐 Postman Desktop 12.x

### 快速开始

1. 下载或克隆本仓库。
2. 完全关闭 Postman。
3. 双击：

```text
install-cn.cmd
```

4. 选择：

```text
1. Install Chinese UI
```

脚本完成后，正常启动 Postman 即可。

如需恢复英文界面，再次运行 `install-cn.cmd` 并选择：

```text
2. Restore English UI
```

菜单还提供：

```text
3. Detect Postman only
```

高级用户也可以从终端运行：

```powershell
.\install-cn.cmd install
.\install-cn.cmd restore
.\install-cn.cmd detect
```

### CLI 用法

安装依赖：

```powershell
npm install
```

检测 Postman：

```powershell
npm run cn:detect
```

预览安装影响，不写入 Postman 安装目录：

```powershell
npm run cn:dry-run
```

安装汉化：

```powershell
npm run cn:install
```

恢复英文：

```powershell
npm run cn:restore
```

运行测试：

```powershell
npm test
```

### 翻译补全工作流

捕获当前 Postman 窗口的未汉化文本：

```powershell
npm run cn:scan-live
```

自动扫常见导航入口：

```powershell
npm run cn:sweep-live
```

编辑已知安全词条后，重新生成合并字典：

```powershell
npm run cn:rebuild-dictionary
```

报告会生成到 `reports/untranslated-*.json`，该目录不会提交到 Git。

完整流程见 [docs/TRANSLATION_WORKFLOW.md](docs/TRANSLATION_WORKFLOW.md)。

### 项目结构

```text
bin/postman-cn.js                 CLI 入口
src/postmanLocator.js             Windows Postman 检测
src/asarAdapter.js                ASAR 列表和解包
src/dictionary.js                 字典读取和校验
src/patcher.js                    文本替换和 preload 注入
src/installer.js                  安装和恢复
src/postmanCdp.js                 live UI 捕获辅助
src/untranslatedWorkflow.js       已知安全词条和报告过滤
dictionaries/manual-12.7.6.zh-CN.json
dictionaries/local-core.zh-CN.json
scripts/capture-postman-untranslated.js
scripts/sweep-postman-ui.js
php/lang/                         来自 hlmd/Postman-cn 的旧词库迁移来源
```

### 安全模型

- 不直接修改 Postman 原始 `app.asar`。
- 已存在且不是本工具创建的 `resources/app` 默认拒绝覆盖。
- `restore` 需要本工具生成的 manifest。
- 安装或恢复前必须关闭 Postman。
- 不阻止 Postman 官方更新。更新后请重新运行 `install-cn.cmd`。
- 图片、canvas、闭合 shadow DOM、账号/云端动态内容可能不在 v1 覆盖范围内。

### 常见问题

#### Node.js was not found

请安装 Node.js 20 或更高版本：<https://nodejs.org/>，然后重新运行 `install-cn.cmd`。

#### Postman 仍然是英文

完全关闭 Postman，运行 `install-cn.cmd`，选择 `1`，再重新启动 Postman。如果 Postman 已自动更新，请对新版本重新安装汉化。

#### 提示 Postman 正在运行

从托盘退出 Postman，或在任务管理器中结束所有 `Postman.exe`，然后重试。

#### Postman 白屏或卡加载

运行 `install-cn.cmd`，选择 `2` 恢复英文界面。随后请带上 Postman 版本和安装输出提交 issue。

### 路线图

- 扩大 Postman 12.x 界面覆盖范围。
- 增强自动化 UI 遍历和补词能力。
- 增加 macOS/Linux locator 和安装支持。
- 发布 zip 包，降低用户下载和运行门槛。
- 按 Postman 大版本拆分字典包。

### 致谢

本项目受 [hlmd/Postman-cn](https://github.com/hlmd/Postman-cn) 启发，并使用其旧版翻译资料作为迁移来源。现代 Node CLI、Postman 12 运行时本地化器、安装器、自动化脚本、测试和当前 12.x 词条维护在本仓库中完成。

授权与来源说明见 [NOTICE.md](NOTICE.md)。

### 参与贡献

欢迎提交 issue 和 pull request。较大的改动请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 许可证

本仓库中的新 Node 实现使用 MIT License。来自 `hlmd/Postman-cn` 的旧资料保留来源说明，详见 [NOTICE.md](NOTICE.md)。

---

## English

Postman CN Modern is a Windows-first Chinese localization tool for recent Postman Desktop builds. It follows the local override idea from [hlmd/Postman-cn](https://github.com/hlmd/Postman-cn), but replaces the old PHP static replacement flow with a maintainable Node CLI, ASAR installer, runtime DOM localizer, and automated translation workflow.

**This project is best used with Postman Desktop 12.x. It has been primarily verified on Postman `12.7.6`.**

Postman 11.x, 9.x, and older releases have significantly different file layouts and loading behavior. They are not recommended for this tool. Future Postman 13.x releases should be verified before the version range is expanded.

> Disclaimer: This project is community-maintained and is not affiliated with, endorsed by, or sponsored by Postman, Inc. Postman is a trademark of Postman, Inc.

### Features

- One Windows entry: double-click `install-cn.cmd`.
- Safe install: does not patch Postman's original `resources/app.asar` in place.
- Reversible: restore the English UI from the same menu.
- Postman 12 ready: handles remote-rendered desktop UI through `preload_desktop.js`.
- Automation friendly: captures untranslated visible text from a live Postman window.
- Version aware: scans `%LOCALAPPDATA%\Postman\app-*` and selects the latest semver version.
- Tested core: locator, dictionary validation, ASAR extraction, installer/restore, patcher, and scanner behavior are covered by tests.

### Version Support

| Postman version | Status | Notes |
| --- | --- | --- |
| 12.7.6 | Verified | Primary target version |
| 12.x | Recommended | Dictionary range is `>=12.0.0 <13.0.0`; dry-run first for newer minor versions |
| 13.x | Not supported yet | Needs UI and preload verification |
| 11.x and older | Not recommended | File layout differs too much from the current target |

If you are not on `12.7.6`, run this first:

```powershell
npm run cn:detect
npm run cn:dry-run
```

Install only after the dry-run confirms that `preload_desktop.js` can be injected.

### How It Works

Postman is an Electron app. Recent builds still include `resources/app.asar`, but much of the main desktop UI is loaded from `desktop.postman.com`. Replacing only local bundle files no longer covers the main UI.

This tool uses a two-layer strategy:

1. Extract Postman's `resources/app.asar` to a temporary directory.
2. Inject a small localizer into `preload_desktop.js`.
3. Install the patched unpacked directory as `resources/app`.
4. Rename the original `app.asar` to `app.asar.postman-cn.bak`.
5. Electron loads `resources/app`, and the preload localizer translates visible text, placeholders, titles, and aria labels after React renders.

Restore removes only the override created by this tool and moves `app.asar.postman-cn.bak` back to `app.asar`.

### Requirements

- Windows 10/11
- Node.js 20 or newer
- Postman Desktop installed under `%LOCALAPPDATA%\Postman\app-*`
- Postman Desktop 12.x recommended

### Quick Start

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

Advanced users can run:

```powershell
.\install-cn.cmd install
.\install-cn.cmd restore
.\install-cn.cmd detect
```

### CLI Usage

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

### Translation Workflow

Capture untranslated text from the current live Postman window:

```powershell
npm run cn:scan-live
```

Sweep common navigation entries:

```powershell
npm run cn:sweep-live
```

Regenerate the merged dictionary after editing known translations:

```powershell
npm run cn:rebuild-dictionary
```

Reports are written to `reports/untranslated-*.json` and ignored by Git.

See [docs/TRANSLATION_WORKFLOW.md](docs/TRANSLATION_WORKFLOW.md) for details.

### Project Layout

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

### Safety Model

- The tool does not patch Postman's original `app.asar` in place.
- Existing `resources/app` directories not created by this tool are refused by default.
- `restore` requires the manifest generated during install.
- Postman must be closed before install or restore.
- Official Postman updates are not blocked. Re-run `install-cn.cmd` after an update.
- Text rendered inside images, canvas, closed shadow DOM, or account/cloud content may remain outside scope.

### Troubleshooting

#### Node.js was not found

Install Node.js 20 or newer from <https://nodejs.org/>, then run `install-cn.cmd` again.

#### Postman is still English

Close every Postman process, run `install-cn.cmd`, choose option `1`, then start Postman again. If Postman auto-updated, reinstall for the new version.

#### Install failed because Postman is running

Exit Postman from the tray or kill all `Postman.exe` processes in Task Manager, then retry.

#### Postman shows a blank loading screen

Run `install-cn.cmd`, choose option `2`, and restore the English UI. Then open an issue with your Postman version and install output.

### Roadmap

- Broader Postman 12.x screen coverage.
- Better automated UI traversal for translation discovery.
- macOS and Linux locator/install support.
- Release zip packages for easier downloads.
- Optional dictionary packs by Postman major version.

### Credits

This project is inspired by and uses legacy translation material from [hlmd/Postman-cn](https://github.com/hlmd/Postman-cn). The modern Node CLI, Postman 12 runtime localizer, installer, automation scripts, tests, and current 12.x dictionary work are maintained here.

See [NOTICE.md](NOTICE.md) for attribution and licensing notes.

### Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before larger changes.

### License

The new Node-based implementation in this repository is released under the MIT License. Legacy material from `hlmd/Postman-cn` is retained with attribution; see [NOTICE.md](NOTICE.md).
