---
title: Skills
description: The instructions oss ask works from, in files you can read and replace.
---

How `oss ask` works is four markdown files, not a prompt buried in a jar. A
prompt in source is one only somebody who can rebuild the binary may correct —
and the people who know how a review should go are not always the people holding
a compiler.

```bash
oss skill                              # what ask has been told, and where it came from
oss skill show reviewing-a-pull-request
oss skill new my-own-review-rules      # a starter, front matter filled in
```

## What ships

| Skill | When it applies |
|---|---|
| `using-what-you-already-know` | always — your own history comes before anything a model knows |
| `choosing-where-to-answer-from` | always — what each rung costs, and what it means for your data |
| `reviewing-a-pull-request` | review, pull request, pr, diff, merge, approve |
| `changing-code-safely` | edit, change, fix, refactor, rename, update, patch |

## Yours replace ours

Anything in `~/.oss-cli/skills` sits beside the built-in ones, and **a file with
the same name replaces ours entirely**. It does not merge: merging two sets of
instructions produces a third nobody wrote, and when the answer comes out wrong
there is no file to point at.

```markdown
---
name: reviewing-a-pull-request
when: review, pr
summary: shown in `oss skill`
---
Before anything else, check whether the change touches the start or stop path.
That is where this project's regressions live.
```

`when:` is a comma-separated list of words, and the matching is deliberately
dumb: the skill is included when the question mentions one of them, or on every
question when it says `always`. Something cleverer would be a second thing to
debug when an answer came out wrong, and one you cannot see inside. You can see
a list of words.

Instructions compete with your corpus for the same budget, and the corpus is the
half that cannot be regenerated — so what does not fit is **named** rather than
dropped quietly. A skill silently left out is an instruction you believe is in
force.
