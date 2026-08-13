---
title: Writing upstream
description: Refused by default, everywhere, with no setting that changes it.
---

Reading a public repository is free to get wrong. Writing to one is not: a
comment reaches every watcher and the mailing list the instant it is sent, and
deleting it afterwards reaches neither. There is no undo, only a correction with
an audience.

**Every outward write is refused by default.** There is no stored credential, no
environment variable and nothing remembered between runs — because each of those
becomes a thing switched on once and then forgotten, after which the protection
exists only in the belief that it exists.

## Two things, both required

1. **You name the repository** — `--approve-upstream owner/name`. The name is
   *compared*, not merely counted: an approval for one repository is not an
   approval for another.
2. **You confirm that write, now, by retyping the repository name.** Every time.
   Approval is per invocation and never remembered.

```bash
oss run --approve-upstream owner/name hub --pr 4234
```

## It binds every path equally

A command, a dispatched extension, a local model, a cloud model. **A model that
has decided a comment should be posted has decided nothing** — it still comes
through the guard, and the guard still asks the person.

:::tip[The property that makes it real]
An always-on background service passes no approval flag, so **it cannot post at
all**. Posting requires starting something by hand, deliberately, with the
repository named. The thing that runs unattended is the thing that must not be
able to write.
:::

## A read-only token, as well

The credential itself can enforce this. A classic token with **no scopes ticked**
reads public data and runs every search these tools need, and **cannot write
anywhere**.

`public_repo` is commonly described as read-only and is not — it grants write to
public repositories.
