---
title: Commands
description: All 41, grouped by the question each one answers.
---

There are **41 commands**. `oss --help` shows the 19 you will use; `oss --help-all`
lists the other 22, which still work and always will — a command that stops being
printed has not been removed, and removing one would force a major version.

```bash
oss --help          # the 19 worth knowing
oss --help-all      # all 41, with the ones that have a shorter route marked
```

---

## Start with one

| Command | Answers |
|---|---|
| `ask [question]` | Anything. Reads your corpus, opens files, and — when allowed — runs the build and proposes edits. No question starts a session you keep typing into |
| `ask --issue <n> -r owner/name` | The same, about one issue, with everything already known about it in front of it |
| `search <words>` | Have I seen this before |
| `review <n>` | Is this pull request right, against what the project actually expects |
| `hub` | Is anyone waiting on me, across every project I follow |

Everything below is a specialised version of one of those.

### What `ask` may do

| Flag | Permits |
|---|---|
| `--allow-run` | this project's own build or test command. Never an arbitrary command |
| `--allow-edit` | one file changed at a time, shown as a diff and confirmed before it is written |
| `--steps <n>` | how many times it may look before it must answer |
| `--resume` | continue the last ask in this directory |
| `--model <name>` | which local model, when no engine was named |

---

## Who answers

Five names, and each works **in front of any command**:

```bash
oss review 812              # the highest rung that is connected
oss llm review 812          # the local model server. Nothing leaves the machine
oss claude review 812       # Anthropic's API
oss claude --cli review 812 # the claude CLI you are already signed in to
oss gemini ask "…"          # Google
oss codex ask "…"           # OpenAI
oss junie ask "…"           # JetBrains
```

| Command | Reaches |
|---|---|
| `llm` | a local Ollama daemon |
| `claude` | Anthropic — API key, or `--cli` for the signed-in CLI |
| `gemini` | Google |
| `codex` | OpenAI |
| `junie` | JetBrains |

Typed on their own they report what they can and cannot reach, rather than
guessing. `oss claude doctor` is refused, because it would look like it asked a
model something.

See [Where an answer comes from](/docs/conversations/) for what happens when
none of them is connected.

---

## Reading a project

| Command | Answers | Network |
|---|---|---|
| `sync --add owner/name` | Follow a project | ✔ |
| `sync --all` | Pull everything new, and index it as it goes | ✔ |
| `issue <n>` | Read an issue as it was filed | ✔ |
| `pr <n>` | Every mechanical fact about a pull request | ✔ |
| `hub` | Every project you follow, in one list | ✔ |
| `followup` | What moved on a reviewed pull request since you reviewed it | ✔ |
| `profile` | A project's language, build and conventions | |
| `onboard` | What a project expects before you contribute to it | |

---

## Finding things in what you have

| Command | Answers |
|---|---|
| `search <words>` | Have I seen this before — by meaning with a model, by shared terms without one |
| `duplicates` | Which of these are the same issue |
| `critical` | What arrived that matters most |
| `hidden-critical` | What matters that nobody has labelled |
| `backlog` | The whole backlog as one page: clusters, mergeable, one fix away |
| `pick` | What to work on next, scored against what you have already worked on |
| `prs` | Cached open pull requests: stale, unreviewed, critical |
| `inspect <n>` | Everything retrieved for an issue, and whether it will answer locally |
| `prompt <n>` | The same context, as a prompt you can paste anywhere |

---

## Your own record

| Command | Answers |
|---|---|
| `memory file <path>` | Keep this |
| `memory index` | Read what I keep into the corpus |
| `memory search <words>` | Find it again |
| `memory harvest` | Everything on GitHub you were involved in, as markdown |
| `history` | Which conversations do I have, and where did each get to |
| `chat <n>` | One issue in conversation. `ask --issue` is the shorter route |
| `guide <n>` | A resolution blueprint. `ask --issue` is the shorter route |
| `backup` | Export the whole archive, rotating the last five |
| `restore` | Put one back |

`memory` and `kb` are the same command. An attached memory extension takes the
verbs over; with none attached, the built-in one answers.

---

## Running and reporting

| Command | Answers |
|---|---|
| `run --pack <dir> …` | Does it actually run, across your versions and configurations |
| `triage <n>` | A consolidated audit of one issue |
| `analyze` | Batch severity across the open backlog. Local model only — a metered API over a whole backlog spends money nobody agreed to |
| `report` | A consolidated weekly health report |
| `trend` | The same, week over week |

`run` and `bench` are the same command.

---

## The machine itself

| Command | Answers |
|---|---|
| `doctor` | What is missing, and exactly what to type to fix it |
| `setup` | Configure models, paths and settings, interactively |
| `model --fetch` | Put the 22 MB embedder on disk. Once, ever |
| `skill` | What `ask` has been told about how to work |
| `ext` | Attach and inspect runners and memories |
| `serve` | The same corpus as a page on `localhost:1504` |
| `alias` | Give this command your own name |

---

## What still works with the network unplugged

After the first `sync`, most of the list above never reaches out again. Six
commands go and get something — `sync`, `issue`, `pr`, `hub`, `followup`, and
`doctor` when it checks what is reachable. `review` asks whether the branch
moved and answers from cache when it has not. `model --fetch` downloads once in
the life of the install. The four cloud engines call their providers, and `llm`
does not.

Everything else reads the SQLite database and the notes already on your disk,
including search by meaning — the model doing that arithmetic runs inside the
process rather than behind an API.
