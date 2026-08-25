---
title: How it fits together
description: One rule decides what lives in oss and what lives in an extension. Everything else follows from it.
---

There is one rule, and the rest of this page is it applied.

> **`oss` ships every capability. An extension supplies only what `oss` cannot
> know: the tools on your machine, and how your project runs.**

## What that means when you install it

A fresh install has no extensions attached, no model and no key, and everything
below already works:

```bash
oss ask "how does this project handle retries?"   # your own data first
oss search "connection pool exhausted"            # no model needed at all
oss issue 4143 --repo owner/name
oss pr 4240 --repo owner/name
oss review 4240
oss followup                                      # what moved on what you reviewed
oss hub                                           # is anyone waiting on you
oss memory file notes.md                          # remember something
oss memory search "keyspace"         # find it again
```

**Nothing is required.** No account, no model server, no second repository, no
Java. Attaching an extension makes things richer; not attaching one never takes
a capability away.

## What an extension is

A directory with one file in it.

```json
{
  "name": "kafka",
  "kind": "runner",
  "exec": "./kbench",
  "verbs": { "list": "list", "run": "run" }
}
```

```bash
oss ext add ~/my-kafka-bench
oss run --name kafka run payments
```

That is the entire contract. **A repository only matters if you want to share
it** — an extension is a folder, and a folder does not need a remote, a licence
or a CI pipeline to work on your own machine.

There are two kinds, because there are exactly two questions the GitHub API
cannot answer. **Both have a built-in floor** — an extension raises the ceiling,
it is never the price of entry:

| Kind | Answers | Built in | An extension adds |
|---|---|---|---|
| `runner` | *Does this actually run?* | `oss run detect / init / build / test / doctor` — reads the file your project already declares its build in and runs the project's own commands | a repository that drives itself, and the version × config × app matrix a pack describes |
| `memory` | *Where should this be kept?* | `oss memory` — markdown in a folder, indexed and searchable | the archive you already use, classified and linked |

The line is not "can `oss` do this" but "can `oss` do this **for every project**".
Reading a `pom.xml` or a `package.json` is the same work everywhere, so it lives
in the core. Knowing that your service needs three containers and a seeded
database is not, and no amount of detection invents it — that is what a pack, or
a runner extension, is for.

## Where the line falls, with real examples

| | Lives in `oss` | Lives in an extension |
|---|---|---|
| Reading a pull request, an issue, follow-up, the hub | ✅ one API read, works anywhere | |
| Search over your own backlog | ✅ term index built in, embeddings when a model is present | |
| Filing and searching notes | ✅ markdown in a folder | Putting them in DEVONthink instead |
| Building and testing the project in front of you | ✅ `oss run build`, `oss run test` — its own commands, printed before they run | |
| Writing the pack that describes your matrix | ✅ `oss run init`, filled in from what is already in the directory | |
| Running a dozen applications across a version × config matrix | | ✅ tens of megabytes of real apps — that is a repository, not a command |

Follow-up is the clearest case, because it used to be on the wrong side. It
lived inside a runner, where it worked against any repository but could only be
reached by attaching that runner — a general capability held hostage by a
specific one. It needs one API read and a record; it forks no JVM. So it moved.

## A pack, worked through

A real runner puts one project through its applications, on real processes,
across a version × configuration × application matrix. **You never need one to
use `oss`** — the engine ships here, and a runner only supplies what to run.

The part worth stealing is how it separates the engine from what it tests. The
engine forks JVMs and walks a matrix; none of that knows what it is testing.
What *is* specific lives in one file:

```bash
BENCH_PACK=example oss run list      # packs/example/ exists to be copied
```

Point the same machinery at your own service by writing the
axes for it — the versions, the applications, the module map — and leaving the
engine alone.

## Upstream is read-only

`oss` reads other people's projects. It has no command that posts, comments or
opens anything in a repository you do not own, and that is a design decision
rather than a missing feature.

Deciding to say something in someone else's project is a decision a person makes
in their own words. A tool that could do it on your behalf is a tool that
eventually does — and a GitHub delete does not reach the mailing-list archive or
an email that has already gone out.

See [Writing upstream](/docs/reference/upstream/) for the one narrow exception:
an *extension you attached yourself* may declare a verb that writes, and even
then it is refused unless you name the exact repository on the command line and
confirm at the terminal, every single time.
