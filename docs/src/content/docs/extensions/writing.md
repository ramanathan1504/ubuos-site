---
title: Make your repo a runner
description: One JSON file turns any repository into something oss can run. Written in whatever you already use.
---

There is no SDK, no interface to implement and no library to depend on. An
extension is **a directory with one file in it**, run as a child process — so it
can be bash, Python, Go, Make, or a binary somebody handed you.

## The whole thing, in four steps

### 1. Have something that runs

Whatever you already type. It only has to accept a first argument saying what to
do:

```bash
#!/usr/bin/env bash
set -euo pipefail
case "${1:-}" in
  list) echo "topics: orders payments" ;;
  run)  shift; echo "producing to ${1:-orders}…" ;;
  *)    echo "usage: kbench {list|run <topic>}" >&2; exit 1 ;;
esac
```

```bash
chmod +x kbench
```

### 2. Declare it

`oss-ext.json`, at the root of your repository:

```json
{
  "name": "kafka",
  "kind": "runner",
  "description": "My own Kafka setup — brokers on localhost:9092",
  "exec": "./kbench",
  "verbs": { "list": "list", "run": "run" }
}
```

### 3. Attach it

```bash
oss ext add /path/to/your/repo
oss ext list
```

### 4. Use it

```bash
oss run --name kafka list
oss run --name kafka run payments
```

That is the entire contract. Nothing was uploaded, nothing was copied, and your
repository is still an ordinary repository that works exactly as it did before.

---

## The fields, and why each exists

| Field | Meaning |
|---|---|
| `name` | What you type after `--name`. A plain identifier |
| `kind` | `runner` executes something real · `memory` remembers |
| `exec` | Anything executable. Run in **your** repo's directory, never the caller's |
| `verbs` | Maps the portable name on the left to whatever your tool calls it |
| `writes` | Verbs that post somewhere public — see below |
| `writesTo` | Where those land, as a bare `owner/name` |

**`verbs` is a mapping, not a list**, so you never rename your own commands to
join in. `oss` says `run`; your tool may spell that `exec`, `go` or `bench`:

```json
"verbs": { "run": "exec", "list": "ls" }
```

**`exec` runs in your repository's directory.** A runner resolves its configs,
caches and fixtures relative to itself; inheriting the caller's directory would
make it work from one place and fail everywhere else.

---

## If a verb writes somewhere public

Declare it. Anything listed is refused unless the person names that exact
repository on the command line **and** confirms at the terminal — every time.

```json
"writes": ["publish"],
"writesTo": "acme/orders"
```

:::danger
`writesTo` must be a bare `owner/name`. It is compared for **equality** against
the approval, so a sentence there can never match — silently making the verb
unusable with nothing explaining why. That exact bug shipped once.
:::

---

## A worked example you can read

The worked example here used to be a runner extension — until it stopped being
an extension at all. It is now a **pack**: a `pack.sh` at the root, nineteen
applications, and no `oss-ext.json`, driven by the engine that ships inside
`oss`.

That is the fate of most things that start as a runner extension, and it is a
good fate. If your repository exists to be *run across versions and configs*,
you want a pack, which is less work — see
[Connect your project](/docs/connect/). An extension is for when you have a
**tool of your own** that `oss` should call.

---

## Checking yours

```bash
oss ext list
```

```
NAME           KIND    STATE   VERBS
kafka          runner  ok      list, run
```

| State | Means |
|---|---|
| `ok` | reachable, and the manifest matches what is on disk |
| `STALE` | you edited `oss-ext.json` — run `oss ext refresh <name>` |
| `MISSING` | the checkout moved; re-add it at the new path |

:::note
`STALE` **refuses dispatch entirely** rather than warning and continuing. The
stored copy is exactly what cannot be trusted when the file has changed — a
manifest that had begun declaring a verb an outward write would otherwise still
run on the strength of a snapshot saying it was harmless.
:::
