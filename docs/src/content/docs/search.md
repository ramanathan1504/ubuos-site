---
title: Finding things
description: Search works with no AI. A model makes it better; nothing requires one.
---

Three ways to search, and **the first needs nothing installed**.

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

The first time it is needed, `oss` fetches `all-MiniLM-L6-v2` (quantized, 22 MB)
into `~/.oss-cli/models` and runs it **inside the process**. No server, no
daemon, no account, and nothing leaves your machine after that download.

This is the same model a local model server would have served. It produces
384-dimension vectors, so *"the appender swallows the error"* can find an issue
that never uses those words.

## 3. By meaning, with a model server

If you run one, it is used. Verdicts, triage and conversation need it; searching
does not.

---

## What you lose with nothing installed

Only **finding by meaning**. You keep:

- every fact from the API — `pr`, `issue`, `followup`
- keyword and term search over everything synced
- the whole archive: filing, topic maps, digests — **not one model call**
- runners: matrices, reproductions, builds

## When the model server is unreachable

Search does not fail. It says so and falls back:

```
Model server unreachable. Falling back to text search.
No embeddings found — searching 17845 item(s) by text instead.
```

That case matters more than the obvious one: embeddings from an earlier run with
no server running *now*. The query still needs embedding, so search used to fail
outright with all your data sitting right there.
