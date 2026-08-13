---
title: Finding things
description: Search works with no AI. A model makes it better; nothing requires one.
---

Two ways to search, and **the first needs nothing installed**.

## 1. By shared terms — always available

```bash
oss search "rollover compression" --global
```

No model, no server, no download. It builds a TF-IDF index from what is already
in your database and ranks by *which* words a query and a document share,
weighted by how rare those words are.

That is enough to find **related** work rather than only literal matches.
Identifiers are indexed split *and* whole, so `database manager` reaches
`AbstractDatabaseManager` while searching the exact class name still works.

:::note
The index is rebuilt from your database on every search, so anything `sync` pulls
is searchable immediately. There is no index to rebuild and none to go stale.
:::

## 2. By meaning, offline — one 22 MB download

```bash
oss model --fetch
```

That puts `all-MiniLM-L6-v2` (quantized, 22 MB, Apache-2.0) into
`~/.oss-cli/models` and runs it **inside the process**. No server, no daemon, no
account, and nothing leaves your machine after that download.

It is a command you type rather than something that happens to you: **nothing is
ever downloaded on its own**, and until you ask, search ranks by shared terms.

This is the same model a local model server would have served. It produces
384-dimension vectors, so *"the appender swallows the error"* can find an issue
that never uses those words.

:::note
`sync` builds the vector index as it pulls, so fetch the model first, or sync
once more afterwards — indexing is incremental and only fills what is missing.
:::

## A model server is not part of this

Ollama is used for **verdicts, triage, `guide` and `chat`** — generating text.
It embeds nothing. `search`, `duplicates`, `pick` and `memory search` never call
it, and no model server needs to be running for any of them.

---

## What you lose with nothing installed

Only **finding by meaning**. You keep:

- every fact from the API — `pr`, `issue`, `followup`
- keyword and term search over everything synced
- the whole archive: filing, topic maps, digests — **not one model call**
- runners: matrices, reproductions, builds

## When the model is not there

Search does not fail. It says so and falls back:

```
No embeddings found — searching 17845 item(s) by text instead.
(A local model would add search by meaning; this finds by shared terms.)
```

The other case matters more: vectors from an earlier run, with the weights gone
*now*. The query still needs embedding, so search used to fail outright with all
your data sitting right there. It says what is missing and ranks anyway:

```
No local model — searching 17845 item(s) by shared terms instead.
oss model --fetch  adds search by meaning (about 22 MB, once)
```
