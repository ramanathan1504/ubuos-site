# Point ubuos.com at your site

## First: what `ubuos-site.pages.dev` is

It is **not a domain you bought**. Cloudflare gives every project a free address
automatically, so you can see the site before your own domain works.

Your site files are already uploaded to Cloudflare and working. `ubuos.com` just
does not point at them yet. That is the only thing left.

```
your files on Cloudflare
        ↑                    ↑
ubuos-site.pages.dev    ubuos.com
(Cloudflare's free      (yours — needs
 address, works now)     one DNS record)
```

---

## Step 1 — Remove the custom domain from Pages

Skip this if `ubuos.com` is not listed there.

1. https://dash.cloudflare.com
2. Left menu: **Workers & Pages**
3. Click **ubuos-site**
4. Tab: **Custom domains**
5. If `ubuos.com` or `www.ubuos.com` is listed → **⋯** → **Remove domain**

Remove both. They are stuck and blocking the DNS record.

---

## Step 2 — Add the DNS record by hand

1. Cloudflare dashboard home
2. Click the domain **ubuos.com** (not Workers & Pages)
3. Left menu: **DNS** → **Records**
4. Click **Add record**

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `@` |
| Target | `ubuos-site.pages.dev` |
| Proxy status | **Proxied** (orange cloud ON) |
| TTL | Auto |

5. **Save**

Then **Add record** again for www:

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `www` |
| Target | `ubuos-site.pages.dev` |
| Proxy status | **Proxied** (orange cloud ON) |

If it says a record already exists — delete the old one, then add this.

---

## Step 3 — Add the domain back to Pages

1. **Workers & Pages** → **ubuos-site** → **Custom domains**
2. **Set up a custom domain**
3. Type `ubuos.com` → **Continue** → **Activate domain**
4. Repeat for `www.ubuos.com`

It should say **Active** within a few minutes. If it shows an error, the error
text is the thing worth reading — nothing else has told us why this keeps failing.

---

## Step 4 — Check

Wait 2–5 minutes, then open:

- https://ubuos.com
- https://ubuos.com/osscli
- https://ubuos.com/osscli/docs

Or from a terminal:

```sh
dig +short ubuos.com CNAME       # expect: ubuos-site.pages.dev
curl -I https://ubuos.com        # expect: HTTP/2 200
```

---

## Clean up (optional)

There is an unused Pages project called **osscli** from an earlier approach.
Nothing points at it.

**Workers & Pages** → **osscli** → **Settings** → **Delete project**

---

## Also do this

The Cloudflare API token was printed in plain text during setup. Replace it:

1. https://dash.cloudflare.com/profile/api-tokens
2. Find the token → **⋯** → **Roll**
3. Copy the new value
4. Update it in both repos:

```sh
export CLOUDFLARE_API_TOKEN=<new token>
for r in oss-cli ubuos-site; do
  printf '%s' "$CLOUDFLARE_API_TOKEN" | gh secret set CLOUDFLARE_API_TOKEN --repo "ramanathan1504/$r"
done
```

---

## Editing the site later

Files live in `~/own repo/ubuos-site`:

```
index.html              ubuos.com
osscli/index.html       ubuos.com/osscli
osscli/docs/index.html  ubuos.com/osscli/docs
```

Edit, then:

```sh
cd ~/"own repo/ubuos-site"
git add -A && git commit -m "update site" && git push
```

Pushing deploys it — the GitHub Action publishes to Cloudflare automatically.
