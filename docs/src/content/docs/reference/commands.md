---
title: Commands
description: Fifteen worth knowing, grouped by what you are trying to do, and twenty-seven more that still work.
---

There are **42 commands**. You need fifteen.

`oss --help` shows those fifteen, grouped by the question each one answers, and
that grouping is the same one below — the terminal and this page teach one shape
on purpose, because a manual arranged differently from the tool is a second
thing to learn.

```bash
oss --help          # the fifteen, grouped
oss --help-all      # all 42, marking which the short help does not show
```

The other twenty-seven are not deprecated and are not going anywhere. A command
that stops being *printed* has not been removed — removing one would force a
major version, and would break somebody's script to tidy a screen they were not
looking at.

## The fifteen

| | Commands | The question |
|---|---|---|
| **start with this** | `setup` `sync` | Get it configured, and get the data down |
| **what is waiting on me** | `hub` | Is anyone blocked on me, across every project I follow |
| **one pull request** | `review` `pr` `triage` | Is this right, and what is already known about it |
| **find something** | `search` `ask` | Have I seen this before; answer this for me |
| **run it for real** | `run` `serve` | Actually execute it; see it on a page |
| **remember it** | `memory` | File, index and search my own notes |
| **teach it** | `skill` `ext` | Give it a routine, or a capability it does not have |
| **when something is wrong** | `doctor` `bug` | What is broken here; report a fault in oss |

Any of them can be answered by a particular model by putting its name in front —
`oss claude review 12` is still `review`. Those prefixes are `llm`, `claude`,
`gemini`, `codex` and `junie`, and they are a choice about *who answers*, not
commands of their own.

---

## The one to reach for first

`ask` is the general case: it reads your corpus, opens files, and — when you allow it — runs the build and proposes edits. Everything else on this page is a specialised version of something `ask` would do more slowly.

```bash
oss ask "why does the rollover skip a file"
oss ask --issue 4226 -r owner/name
```

### What `ask` may do

| Flag | Permits |
|---|---|
| `--allow-run` | this project's own build or test command. Never an arbitrary command |
| `--allow-edit` | one file changed at a time, shown as a diff and confirmed before it is written |
| `--steps <n>` | how many times it may look before it must answer |
| `--resume` | continue the last ask in this directory |
| `--model <name>` | which local model, when no engine was named |

---

## Who answers, in full

Each of the five works **in front of any command**:

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

---

# Everything, in detail

The sections below include the twenty-seven commands `oss --help` does not
print. They are listed because they work, not because you need them: each one is
a shorter route to something in the fifteen above, kept because scripts and
muscle memory use it.

If you are learning this tool, stop at the table above.

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
| `memory sessions` | The CLI transcripts already on your disk, filed under what each was about |
| `memory contributions <checkout>` | One note per change of yours that merged, with its whole review |
| `memory curriculum` | What a subject documents, against what you have covered |
| `history` | Which conversations do I have, and where did each get to |
| `chat <n>` | One issue in conversation. `ask --issue` is the shorter route |
| `guide <n>` | A resolution blueprint. `ask --issue` is the shorter route |
| `backup` | Export the whole archive, rotating the last five |
| `restore` | Put one back |

`memory` and `kb` are the same command. An attached memory extension takes the
verbs over; with none attached, the built-in one answers.

`memory sessions` reads the transcripts Claude Code, codex and gemini already
keep, and files each under its subject rather than under the program that wrote
it — the tool is a field on the note, never a folder. A session that names a pull
request or an issue appends a dated section to that subject's note instead of
starting a new one, so four days on one issue is one note and not five files.
`kb.json` can name more folders to read and projects to leave out.

`memory contributions` takes a checkout and writes one note per change of yours
that reached a release branch: the commit, the branch, the diffstat, the files,
the description, the timeline, and every remark anybody made — including the ones
pinned to lines of the diff, which is where review actually happens. Read-only:
every git command is a read and every GitHub call a GET.

`memory curriculum` places every area a subject's own manual documents into one
of three states. **gap** — the archive says nothing about it. **backlog** — you
have met it, in a note or a change that merged, and never sat down with it; the
note lists where. **covered** — you read it and said so. Nothing ever assigns
that last one: you move the file, and re-running never moves it back.

Filing needs no model. `--enrich` adds a paragraph saying what a session settled,
from whichever CLI or local model is on the machine, and the note records which
wrote it. `memory schedule --install --hourly` files transcripts as you work and
prints the hook for doing it the moment a session ends.

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
| `bug` | File a fault in oss itself, from the terminal |

### Filing a fault in oss itself

```bash
oss bug "the board page is blank — only the extensions dropdown shows"
oss bug --last      # report the last unexpected error, instead of describing one
oss bug --print     # build the report and stop; post nothing
```

No browser, no account setup, no template. It exists because the distance
between hitting a fault and a maintainer hearing about it was a browser, an
account and about four minutes, and almost nobody pays that.

**Nothing is posted that you have not read.** The whole issue body is printed
first — not a summary of it — and only then are you asked. Answering no leaves
nothing on the network.

**What is taken out before you are shown it:** your home directory and the
account name inside it; API keys in every shape GitHub, Google, OpenAI and
Anthropic issue, including whatever an `Authorization` header carried; email
addresses; and **the name of every repository you follow** — a stack trace from
`oss hub` would otherwise publish the list of projects you work on, none of
which is the bug. Each becomes `owner/name`.

**No model is required.** If one is reachable it writes the title and a short
summary; the stack, the build and the command are copied verbatim either way,
because those are the parts a maintainer acts on. The confirmation says which of
the two you got. **No token is required either** — without one the report is
printed along with the address to paste it at.

When a command dies of something unexpected, oss writes the crash down and
offers this once. A pulled cable, a timeout and a rejected key are not offered:
those are oss working correctly against a world that is not, and asking about
them would teach you to say no to the question that mattered.

---

## What still works with the network unplugged

After the first `sync`, most of the list above never reaches out again. Six
commands go and get something — `sync`, `issue`, `pr`, `hub`, `followup`, and
`doctor` when it checks what is reachable. `review` asks whether the branch
moved and answers from cache when it has not. `model --fetch` downloads once in
the life of the install. The four cloud engines call their providers, and `llm`
does not. `bug` is the only one that *sends* anything, and only at the last
step: without a network, or without a token, it prints the report and the
address to paste it at instead.

Everything else reads the SQLite database and the notes already on your disk,
including search by meaning — the model doing that arithmetic runs inside the
process rather than behind an API.
