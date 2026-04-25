# Notice

Postman CN Modern is a community-maintained localization tool for Postman Desktop.

## Relationship to Postman

This project is not affiliated with, endorsed by, or sponsored by Postman, Inc. Postman is a trademark of Postman, Inc.

The tool is intended only to localize visible desktop UI text on a user's own local installation. It does not bypass login, licensing, paid features, networking, authentication, or Postman service restrictions.

## Relationship to hlmd/Postman-cn

This project is inspired by [hlmd/Postman-cn](https://github.com/hlmd/Postman-cn), an archived project that localized older Postman releases through local file replacement.

The `php/lang/` directory contains legacy translation material from that project and is retained as migration/reference data for dictionary extraction. The original repository did not include a clear license file at the time this project was prepared, so the legacy material is kept with attribution and should be treated separately from the new MIT-licensed Node implementation.

The following parts are new implementation work in this project:

- Node CLI in `bin/`
- ASAR, installer, patcher, scanner, locator, CDP, and dictionary modules in `src/`
- automation scripts in `scripts/`
- generated and hand-maintained Postman 12 dictionary files in `dictionaries/`
- tests in `test/`
- project documentation and GitHub metadata

## User Responsibility

Use this tool at your own risk. Always keep the restore path available through `install-cn.cmd` option `2`, and reinstall after official Postman updates.
