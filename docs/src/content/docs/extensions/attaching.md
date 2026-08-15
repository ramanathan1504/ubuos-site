---
title: Attaching one
description: Attach a runner or a memory by path — nothing is uploaded or copied.
---

:::note
**You may not need one.** Both capabilities an extension can provide are already
built in and work with nothing attached:

| Capability | Works out of the box as | An extension |
|---|---|---|
| running things | the engine inside `oss`, driven by a [`pack.sh`](/docs/connect/) | replaces it with your own program |
| remembering things | the built-in store — `file`, `search`, `index` | takes over, and is asked first |

An extension never *enables* a capability. It substitutes a richer one, and when
it does not declare a verb the built-in still answers, saying which store did.

If what you have is "my project, and the versions I care about", you want a
**pack** and not an extension — it is five declarations and no manifest. See
[Connect your project](/docs/connect/).
:::

```bash
oss ext add ~/path/to/your-runner
oss ext list
```

```
NAME           KIND   STATE     VERBS
your-runner    runner ok        list, run, matrix, coverage, repro, review, …
devon          memory ok        file, index, harvest, map, digest, doctor
```

Then use them through the core:

```bash
oss run --name your-runner list --apps
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
