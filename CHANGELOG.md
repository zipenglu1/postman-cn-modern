# Changelog

All notable changes to this project will be documented in this file.

## 0.1.0

- Added Windows-first Node CLI for detecting, scanning, installing, and restoring Postman localization overrides.
- Added safe ASAR extraction workflow that keeps the original `app.asar` as `app.asar.postman-cn.bak`.
- Added Postman 12.x preload DOM localizer for remote-rendered desktop UI text.
- Added `install-cn.cmd` as the single Windows entry point for install, restore, and detection.
- Added generated dictionary merge from legacy `hlmd/Postman-cn` PHP language files.
- Added hand-maintained Postman 12.7.6 UI translations for core desktop workflows.
- Added live Postman UI capture and sweep scripts through Electron DevTools Protocol.
- Added tests for locator, dictionary validation, ASAR adapter, patcher, scanner, installer, restore, and translation workflow helpers.
