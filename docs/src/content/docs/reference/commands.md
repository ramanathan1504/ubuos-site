---
title: Commands
description: What each command is for.
---

`oss --help` lists everything; this is what each is *for*.

## Reading

| Command | Answers |
|---|---|
| `review <n>` | Is this pull request right, against what the project actually expects |
| `search <words>` | Have I seen this before |
| `inspect <n>` | What context sits behind one result |
| `critical` | What arrived that matters most |
| `duplicates` | Is this the same as something already open |
| `report` | What changed, and what is waiting on me |

## Extensions

| Command | Does |
|---|---|
| `ext add <path>` | Attach a runner or a memory |
| `ext list` | What is attached, and is it still reachable |
| `ext refresh <name>` | Re-read a manifest after editing it |
| `run <verb> …` | Dispatch to a runner |
| `memory <verb> …` | Dispatch to a memory |

## Setup

| Command | Does |
|---|---|
| `setup` | Models, tokens, note folders — every prompt skippable |
| `doctor` | Every prerequisite at once, with the fix for each |
| `alias <name>` | Give the command your own name |
| `serve` | The local page on `:1504` |
| `backup` / `restore` | Your database and palette |

:::note
`doctor` exits non-zero when an **optional** prerequisite is missing. It is a
report, not a failure.
:::
