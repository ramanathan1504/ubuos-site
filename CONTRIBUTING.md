# Contributing

Two sites live here:

```
site/   → ubuos.com        the catalogue: what these tools are
docs/   → docs.ubuos.com   the manual
```

## Fork, then open a pull request

`main` is protected and takes no direct pushes. Both sites build in CI on every
pull request, and a broken build blocks the merge rather than reaching the site.

```bash
gh repo fork ramanathan1504/ubuos-site --clone
cd ubuos-site/site && npm install && npm run dev
```

## Adding a tool or an extension is one file

The catalogue is content-driven on purpose. Adding an entry means adding a
Markdown file to `site/src/content/tools/` or `site/src/content/extensions/` —
never editing a page.

Both collections are schema-validated, so a missing summary **fails the build**
rather than shipping a card with a blank space where the important sentence goes.

```yaml
---
name: "kafka"
kind: "runner"          # runner (executes) or memory (remembers)
summary: "One sentence a reader can act on."
attach: "oss ext add ~/my-kafka-bench"
order: 30
---
```

Quote every string. An unquoted YAML value ends at the first colon, so a summary
containing one breaks the build in a way that reads as a parser bug.

## What the demo may show

Only output the tools actually produce. The terminal on the front page is copied
from real runs, and it must stay that way — a demo showing invented output is a
promise somebody discovers is false the first time they type the command.

## Versions and the changelog

Do not edit `docs/src/content/docs/reference/changelog.md` by hand. It is
regenerated from the published releases of `oss` by the *Sync release* workflow.
Hand edits are overwritten on the next release, silently.

## Licence

Apache 2.0. By opening a pull request you agree your contribution is licensed
under the same terms.
