---
title: Attaching one
description: Attach a runner or a memory by path — nothing is uploaded or copied.
---

```bash
oss ext add ~/apache/log4j2-workout
oss ext list
```

```
NAME           KIND   STATE     VERBS
log4j          runner ok        list, run, matrix, coverage, repro, review, …
devon          memory ok        file, index, harvest, map, digest, doctor
```

Then use them through the core:

```bash
oss run --name log4j list --apps
oss memory doctor
```

| Command | Does |
|---|---|
| `ext add <path>` | Attach, or update an entry of the same name |
| `ext list` | What is attached, and whether it is still reachable |
| `ext refresh <name>` | Re-read that manifest after editing it |
| `ext remove <name>` | Forget the path. **Deletes nothing on disk** |

## STALE means the manifest moved

The registry stores a snapshot plus its SHA-256. Edit the manifest and the entry
shows `STALE`, and **dispatch is refused** until you refresh.

:::note
That refusal is deliberate and deliberately total. An earlier version warned and
ran unless the *stored* copy declared a write — which is the same bug in
miniature, because the stored copy is exactly what cannot be trusted. A manifest
that had begun declaring a verb an outward write still ran, on the strength of a
snapshot saying it was harmless.
:::

## Seeing it on a page

```bash
oss serve            # http://localhost:1504
```

Binds to loopback only, and never dispatches a verb: an outward write must be
confirmed at a terminal, and a browser has none.
