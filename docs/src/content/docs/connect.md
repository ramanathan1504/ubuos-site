---
title: Connect your project
description: A pack or an extension? One decides how you connect, and the difference takes ten seconds to settle.
---

There are two ways to connect your own repository, and picking the wrong one is
the commonest confusion here. It takes ten seconds to settle.

## Which one do I want?

Answer one question: **do you want `oss` to run your project, or do you want to
add a command of your own?**

| | **Pack** | **Extension** |
|---|---|---|
| You have | applications, configurations, versions | a tool that already does something |
| You want | `oss` to run them across a matrix | `oss` to call your tool |
| You write | `pack.sh` — a description | `oss-ext.json` — a manifest |
| It contains | data. No program | an `exec` that runs |
| You register it | **no — just point at it** | **yes — `oss ext add`** |
| You type | `oss run --pack <dir> …` | `oss run --name <you> …` |

**Most people want a pack.** If what you have is "my app, and the versions I care
about", that is a pack, and it is the shorter of the two.

---

## Connect a pack

A pack is a directory with a `pack.sh` in it. Nothing is registered, nothing is
copied, and your repository stays an ordinary repository.

### 1. Write `pack.sh`

At the root of your repository. **Five declarations are all the engine insists
on** — this is the whole of a pack that loads and lists:

```bash
PACK_NAME="orders"
VERSIONS=(3.6.0 3.7.0 3.8.1)
DEFAULT_VERSION=3.8.1
APPS=(consumer)

pack_module_path() {
  case "$1" in
    consumer) echo "apps/consumer" ;;
    *)        return 1 ;;
  esac
}
```

That runs `oss run list` today. Everything below is added when you want the
engine to *build and start* your applications rather than just enumerate them.

| | Setting | Without it |
|---|---|---|
| **Required** | `PACK_NAME` `VERSIONS` `DEFAULT_VERSION` `APPS` | the engine refuses to load the pack |
| **Required** | `pack_module_path()` | same — it cannot find your modules |
| Defaulted | `PACK_APPS_DIR` `PACK_CONFIGS_DIR` | `apps` and `configs` |
| Defaulted | `APPS_2X_ONLY` | empty — no application is excluded |
| Only to build | `pack_build_flags()` | needed once you run anything that compiles |
| Only to run | `pack_config_args()` `pack_main_class_for()` | needed once you start an application |
| Optional | `pack_skip_reason()` | nothing is pruned; every cell is attempted |

:::note
The engine checks the five and stops if any is missing, deliberately: a pack
that loads but declares nothing produces an empty matrix, and an empty matrix
reports `0 cells, 0 failures` — which reads exactly like a pass.
:::

A fuller one, with the build and run hooks filled in:

```bash
PACK_NAME="orders"
PACK_DESC="Our order service against every Kafka client we support"

VERSIONS=(3.6.0 3.7.0 3.8.1)
DEFAULT_VERSION=3.8.1

APPS=(consumer producer)
PACK_APPS_DIR="apps"
PACK_CONFIGS_DIR="configs"

pack_module_path() {
  case "$1" in
    consumer) echo "apps/consumer" ;;
    producer) echo "apps/producer" ;;
    *)        return 1 ;;
  esac
}

# How a version reaches your build.
pack_build_flags() { printf '%s\n' "-Dkafka.version=$1"; }

# How your application is told where its configuration is.
pack_config_args() { printf '%s\n' "-Dapp.config=$2"; }

# How to start one.
pack_main_class_for() { echo "com.acme.${1}.Main"; }
```

### 2. Run it

```bash
cd ~/my-orders-bench
oss run list --apps
oss run run consumer --config at-least-once
oss run matrix --scenario replay --version 3.7.0
```

Or from anywhere:

```bash
oss run --pack ~/my-orders-bench matrix --scenario replay
```

That is all of it. There is no `oss pack add`, because there is nothing to
register — a pack is read where it sits.

:::caution[The one that fails silently]
`pack_config_args` is the function to get right. Every other mistake gives you an
error; this one does not. If you pass the wrong property, most frameworks fall
back to a default configuration and log happily — so the run *passes*, having
tested nothing at all.

The canonical shape: a framework renames its configuration property between
major versions, so the spelling that version 2 reads is not the one version 3
reads. Pass the older spelling to the newer release and nothing errors — you get
a clean green column that exercised the default config. Check the artefact,
never the exit code.
:::

### A worked example you can copy

`runner/packs/example/pack.sh` ships with `oss` — about thirty lines, and it
runs. Copy the directory, change the five declarations, and the engine runs
against your project instead. A production pack is not much larger: a real one
covering nineteen applications across a version × configuration × application
matrix declares it all in 88 lines.

Full field list: `runner/README.md` in
[`oss`](https://github.com/ramanathan1504/oss-cli).

---

## Connect an extension

An extension is a directory with one `oss-ext.json` in it, run as a child
process — so it can be bash, Python, Go, or a binary somebody handed you.

Reach for this when you already have a tool, and you want it callable from
`oss` alongside everything else.

### 1. Have something that runs

```bash
#!/usr/bin/env bash
set -euo pipefail
case "${1:-}" in
  file)   shift; cp "$1" ~/notes/ ;;
  search) shift; grep -ril "$1" ~/notes/ ;;
  *) echo "usage: mynotes {file|search}" >&2; exit 1 ;;
esac
```

### 2. Declare it

`oss-ext.json`, at the root:

```json
{
  "name": "mynotes",
  "kind": "memory",
  "description": "Notes in a folder I already sync",
  "exec": "./mynotes",
  "verbs": { "file": "file", "search": "search" }
}
```

### 3. Register and use it

```bash
oss ext add ~/my-notes-tool
oss ext list
oss memory file today.md
```

| Field | Means |
|---|---|
| `kind` | `runner` executes something real · `memory` remembers |
| `exec` | anything executable. Runs in **your** directory, never the caller's |
| `verbs` | maps the portable name to whatever your tool calls it — you never rename your own commands |
| `writes` | verbs that post somewhere public. Refused unless the exact repository is named *and* confirmed, every time |

---

## Can I have both?

Yes, and they do not interact. A pack is data you point at; an extension is a
program you register. `oss ext list` shows extensions only — a pack never
appears there, because there is nothing to list.

If both could answer, the explicit one wins: `--pack` beats an attached runner
extension, because someone who typed `--pack` said which they meant.
