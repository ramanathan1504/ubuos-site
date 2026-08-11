---
title: Changelog
description: What changed, and why.
---

Full history: [CHANGELOG.md](https://github.com/ramanathan1504/oss-cli/blob/main/CHANGELOG.md).

## 1.6.1

- **One name.** The command is `oss`. It used to introduce itself as `oss-cli` in
  usage text, the version line and every error — naming a command that is no
  longer installed. The leftover `sa` alias is gone too.
- Releases no longer bump the Homebrew tap. That step used a token which expired,
  and the failure took the worst shape available: the release and jar published
  correctly and only the formula bump failed, so `brew upgrade` reported "already
  installed" while a newer version existed. The tap now updates itself with no
  cross-repo credential.

## 1.6.0

- **`runner` and `memory`** replace `bench` and `kb`, which read as jargon to
  anyone who did not invent them. Both old spellings keep working permanently.
- **`oss alias <name>`** — call it `buddy`, `hey`, anything. Refuses a name
  already on your `PATH` instead of shadowing it silently.
- **Drift detection.** An edited manifest shows `STALE` and dispatch is refused,
  rather than acting on a snapshot that no longer matches disk.

## 1.5.0

- **Extensions.** Any repository declares an `oss-ext.json` and is attached by
  path; it is run as a child process, so it can be written in anything.
- **`oss serve`** on `localhost:1504` — see what is attached, attach more.
- **The upstream write guard**, in the form described in
  [Writing upstream](/reference/upstream/).
