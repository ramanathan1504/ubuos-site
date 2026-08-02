# ubuos.com

The catalogue at the top of the tree. It lists the tools and links to each one's
own subdomain; it is not a product page itself.

```
ubuos.com                 this repo          the catalogue
osscli.ubuos.com          oss-cli repo       OSS-CLI landing + /docs
<next>.ubuos.com          its own repo       one per tool
```

Each tool is a separate Cloudflare Pages project reading a separate repository,
so releasing one never touches the others.

## The page

One file. `index.html` carries its own CSS and JavaScript and loads nothing from
any other host, so there is no build step and nothing to keep up to date.

## Adding a tool

Edit the grid in `index.html`. Copy the OSS-CLI block and change the four things
that differ:

```html
<a class="product" href="https://<tool>.ubuos.com">
  <div class="product-top">
    <h3>NAME</h3>
    <span class="chip chip-live">Live · v1.0.0</span>
  </div>
  <p>One or two sentences saying what it does for the reader.</p>
  <div class="meta">
    <span>Language</span><span>Licence</span>
    <span class="go">Docs &rarr;</span>
  </div>
</a>
```

Use `chip-soon` instead of `chip-live` for something announced but not released.
Delete the `placeholder` card once there are enough real entries to fill the row.

**Only list what is public.** A private repository named here tells everyone what
is being built and gives them a link that 404s.

## Deploying

Cloudflare Pages, connected to this repository:

| Field | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `/` |
| Production branch | `main` |

Then **Custom domains** → add `ubuos.com`, and `www.ubuos.com` if you want it to
resolve too.

Every push to `main` redeploys. There is no release process here — the catalogue
is not versioned, and changing a word on it should not require one.
