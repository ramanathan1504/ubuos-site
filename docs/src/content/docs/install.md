---
title: Install
description: Install oss, check it over, and attach what you want.
---

### macOS — Homebrew

```bash
brew install ramanathan1504/oss-cli/oss
```

### Linux — Debian and Ubuntu

```bash
curl -LO https://github.com/ramanathan1504/oss-cli/releases/latest/download/oss_1.7.1_amd64.deb
sudo dpkg -i oss_*.deb
```

### Windows — Chocolatey

```powershell
choco install oss
```

### Any platform — the archive

```bash
curl -LO https://github.com/ramanathan1504/oss-cli/releases/latest/download/oss-linux-x64.tar.gz
tar -xzf oss-linux-x64.tar.gz
sudo mv oss-linux-x64 /opt/oss && sudo ln -s /opt/oss/oss /usr/local/bin/oss
```

Available as `oss-macos-arm64.tar.gz`, `oss-linux-x64.tar.gz` and
`oss-windows-x64.zip`.

```bash
oss --version
```

**No Java needed.** Every download carries its own runtime, so a GitHub token is
the only requirement. Everything below is optional, and `oss` works with none of
it.

:::note
There is no Intel macOS build. GitHub retired those runners, so there is nothing
to build one *on* — and an archive built elsewhere would carry a runtime that
looks correct and does not run. Intel Macs can still run the jar with their own
Java 17.
:::

## Check it over

```bash
oss doctor
```

:::caution
`doctor` **exits non-zero when an optional prerequisite is missing** — a stopped
local model, or a token held in the Keychain rather than `$GITHUB_TOKEN`. That is
a report, not a broken install. Read the lines, not the exit code, and do not
wire it into a script that treats non-zero as fatal.
:::

## Prefer your own name for it?

A three-letter command is exactly the length that collides with something already
installed, so pick your own:

```bash
oss alias buddy
buddy ext list
```

It refuses a name already on your `PATH` rather than shadowing it silently, and
the shim delegates to the launcher — so a `brew upgrade` moves your name with it
instead of leaving it on an old build.

## Optional layers

| Add | Gains |
|---|---|
| A runner extension | `does this actually run?` — real apps, real processes |
| Nothing at all | search still works — see [Finding things](/docs/search/) |
| A memory extension | `have I worked this out before?` |
| A local model | verdicts, and conversation |
| A cloud key | escalation only when a diff exceeds the local budget |

## Where things live

```
/opt/homebrew/bin/oss          the command
~/.oss-cli/                    YOUR DATA — never inside a clone
  ├── extensions.json          what is attached
  ├── data/…db                 issues, PRs, vectors, notes
  └── logs/
```

`~/.oss-cli` survives uninstalling and re-cloning, and is the one directory worth
backing up. `OSS_CLI_HOME` relocates all of it — always set it for a development
build, because the schema migrations are one-way.
