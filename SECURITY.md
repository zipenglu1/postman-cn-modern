# Security Policy

## Supported Versions

This project tracks recent Postman Desktop 12.x builds on Windows.

| Project version | Supported |
| --- | --- |
| 0.x | Yes |

## Reporting a Vulnerability

Please open a private security advisory on GitHub if available, or create an issue with minimal public detail and ask for a maintainer contact path.

Do not include secrets, account tokens, private workspace data, or exported Postman data in public issues.

## Security Scope

This tool:

- modifies only a local Postman installation owned by the current user;
- keeps the original `app.asar` as `app.asar.postman-cn.bak`;
- installs an unpacked `resources/app` override;
- injects a DOM localizer into Postman's local preload file.

This tool does not attempt to bypass Postman authentication, subscriptions, workspace permissions, network access controls, or server-side behavior.

## Safe Usage

- Close Postman before install or restore.
- Prefer `install-cn.cmd` for normal use.
- Use option `2` in `install-cn.cmd` to restore the original English UI.
- Reinstall after official Postman updates.
