---
title: Install
description: Install oss, check it over, and attach what you want.
---

```bash
brew install ramanathan1504/oss-cli/oss
oss --version
```

That is the whole requirement: **Java 17 and a GitHub token.** Everything below is
optional, and `oss` works with none of it.

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
| Nothing at all | search still works — see [Finding things](/search/) |
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
