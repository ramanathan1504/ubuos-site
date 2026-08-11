---
title: What it is
description: One core that knows, and two things it cannot do alone.
---

`oss` reads any repository through the GitHub API — no clone, any language, any
forge. That boundary is deliberate and it is why the tool generalises.

The cost is two questions it cannot answer alone:

- **Does this actually run?** Reading a diff cannot settle it.
- **Have I worked this out before?** Nothing keeps that for you.

Those are **extensions**. A **runner** executes something real; a **memory**
remembers. Each is a directory containing one JSON file, run as a child process —
so it can be bash, Python, Go, or a binary somebody handed you.

## Nothing is required

| With | You get |
|---|---|
| Just `oss` | Facts from the API: diffs, commits, CI, review threads, conventions |
| + a runner | Execution against real applications |
| + a memory | Markdown filed by topic, and keyword search over it |
| + a local model | Verdicts, and search by meaning |
| + a cloud key | Escalation past the local budget |

The storing half needs **no AI whatsoever** — filing, the topic map and the
digests are deterministic. Only *finding by meaning* needs a model.

## The rule that does not bend

Reading a public repository is free to get wrong. Writing to one is not: a
comment reaches every watcher and the mailing list the instant it is sent, and
deleting it afterwards reaches neither.

So **every outward write is refused by default, everywhere, and there is no
setting that changes it.** See [Writing upstream](/reference/upstream/).
