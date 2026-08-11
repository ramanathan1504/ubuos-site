---
title: Writing your own
description: One JSON file at the root of your repository. Any language.
---

There is no SDK and no interface to implement.

```json
{
  "name": "kafka",
  "kind": "runner",
  "description": "My own Kafka setup — brokers on localhost:9092",
  "exec": "./kbench",
  "verbs": { "list": "list", "run": "run" }
}
```

```bash
chmod +x kbench
oss ext add /path/to/your/repo
oss run --name kafka list
```

## The fields

| Field | Meaning |
|---|---|
| `kind` | `runner` (executes) or `memory` (remembers) |
| `exec` | Anything executable. Run in **your** repo's directory, not the caller's |
| `verbs` | Maps the portable name on the left to whatever your tool calls it on the right |
| `writes` | Verbs that post somewhere public — see below |
| `writesTo` | Where those land, as bare `owner/name` |

`verbs` is a mapping so you never have to rename your own commands to join in.

## If a verb writes outward

```json
"writes": ["publish"],
"writesTo": "acme/orders"
```

Anything listed is refused unless the person names that exact repository with
`--approve-upstream` **and** confirms at the terminal.

:::danger
`writesTo` must be a bare `owner/name`. It is compared for **equality** against
the approval, so a sentence there can never match — silently making the verb
unusable with nothing explaining why. This exact bug shipped once.
:::
