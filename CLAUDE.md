# Working on ubuos-site

Notes for anyone — human or model — changing this repository.

## What this is

The ubuos.com catalogue. It lists the tools and **links out** to each one's own
site. It is an Astro build in `site/`, plus a Starlight manual in `docs/` that is
copied into `site/dist/docs` at deploy time.

## The thing to know before editing anything

**`osscli/` in this repository is served by nothing.**

`ubuos.com/osscli/` is not a page. Every unknown path returns the 404 fallback,
which is why that URL appears to work and shows stale content. The real oss-cli
site is a separate Cloudflare Pages project published from the **oss-cli**
repository's `site/` directory.

Editing `osscli/index.html` here changes nothing anybody can see. It cost hours
once: a full redesign landed in it, the deploy went green, and the live page
never changed. If you are updating the oss-cli site, edit it in the oss-cli
repository.

## Adding or changing a tool

One file in `site/src/content/tools/`. The collection is **schema-validated** in
`site/src/content.config.ts`, so an undeclared field fails the build rather than
silently dropping — keep it that way, and add the field to the schema first.

`site` is the tool's own page and renders as `Try it →` before `Source →`.
A catalogue that offers only source sends every visitor to a README.

## Deploying

Push to `main`. The Deploy workflow builds `site/`, copies the docs into
`site/dist/docs`, and publishes `site/dist`. The changelog page is regenerated
from oss-cli's published releases by the Sync release workflow, which opens a
pull request — hand edits to it are overwritten.

## House rules

- Everything self-contained: no external fonts, CDNs, or images.
- `prefers-reduced-motion` disables every animation.
- Contrast is computed, not eyeballed.
- Examples use `owner/name`, never a real third-party repository.
- The command is `oss`. The tap is `ramanathan1504/oss-cli`; the formula inside
  it is `oss`, so the install line is
  `brew install ramanathan1504/oss-cli/oss`.

## Verify before pushing

```bash
cd site && npm run build
```

Then check the built `dist/`, not the source, for whatever you changed. A green
deploy proves the workflow ran, not that the page changed.
