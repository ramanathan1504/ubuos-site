#!/usr/bin/env bash
#
# cloudflare-setup.sh — create the Pages projects and attach the domains.
#
#     export CLOUDFLARE_API_TOKEN=...
#     ./scripts/cloudflare-setup.sh
#
# Idempotent: every step checks before it creates, so running it twice is a
# no-op and running it after a partial failure resumes rather than duplicating.
#
# Deliberately does NOT use Pages' Git integration. Connecting a repository goes
# through a dashboard OAuth flow that has no API, so a Git-connected project
# cannot be reproduced from code. Direct-upload projects can, and deploying them
# from CI puts the whole path -- build, test, publish -- in one place that is
# reviewed like everything else.

set -euo pipefail

API="https://api.cloudflare.com/client/v4"

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN first. See README for the permissions it needs.}"

cf() {
  local method=$1 path=$2 body=${3:-}
  if [ -n "$body" ]; then
    curl -sS -X "$method" "$API$path" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data "$body"
  else
    curl -sS -X "$method" "$API$path" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
  fi
}

ok() { python3 -c 'import json,sys; print("yes" if json.load(sys.stdin).get("success") else "no")'; }
err() { python3 -c 'import json,sys; d=json.load(sys.stdin); print("; ".join(e.get("message","") for e in d.get("errors",[])) or "unknown error")'; }

# ── who are we ───────────────────────────────────────────────────────────────
echo "→ Verifying the token..."
TOKEN_CHECK=$(cf GET /user/tokens/verify)
if [ "$(echo "$TOKEN_CHECK" | ok)" != "yes" ]; then
  echo "✖ Token rejected: $(echo "$TOKEN_CHECK" | err)"
  exit 1
fi

ACCOUNT_ID=$(cf GET /accounts | python3 -c 'import json,sys; a=json.load(sys.stdin)["result"]; print(a[0]["id"] if a else "")')
[ -n "$ACCOUNT_ID" ] || { echo "✖ No account visible to this token. It needs Account → Cloudflare Pages → Edit."; exit 1; }
echo "  account $ACCOUNT_ID"

ZONE_ID=$(cf "GET" "/zones?name=ubuos.com" | python3 -c 'import json,sys; z=json.load(sys.stdin)["result"]; print(z[0]["id"] if z else "")')
[ -n "$ZONE_ID" ] || { echo "✖ Zone ubuos.com not visible. The token needs Zone → Zone → Read on ubuos.com."; exit 1; }
echo "  zone    $ZONE_ID"

# ── projects ─────────────────────────────────────────────────────────────────
create_project() {
  local name=$1
  local existing
  existing=$(cf GET "/accounts/$ACCOUNT_ID/pages/projects/$name" | ok)
  if [ "$existing" = "yes" ]; then
    echo "  ✔ project '$name' already exists"
    return
  fi
  echo "  → creating project '$name'..."
  local res
  res=$(cf POST "/accounts/$ACCOUNT_ID/pages/projects" \
    "{\"name\":\"$name\",\"production_branch\":\"main\"}")
  if [ "$(echo "$res" | ok)" = "yes" ]; then
    echo "  ✔ created '$name'"
  else
    echo "  ✖ could not create '$name': $(echo "$res" | err)"
    exit 1
  fi
}

echo "→ Pages projects..."
create_project "ubuos-site"
create_project "osscli"

# ── a conflicting record stops a custom domain activating ────────────────────
# Pages creates its own record for a hostname it owns. An A record left from an
# earlier setup keeps the name, so activation silently stays pending and the
# site answers with an SSL error rather than anything that names the cause.
clear_conflicting_record() {
  local host=$1
  local ids
  ids=$(cf GET "/zones/$ZONE_ID/dns_records?name=$host" | python3 -c '
import json,sys
for r in json.load(sys.stdin).get("result", []):
    if r["type"] in ("A", "AAAA", "CNAME"):
        print(r["id"], r["type"], r.get("content",""))
')
  [ -z "$ids" ] && return
  while read -r id type content; do
    [ -z "$id" ] && continue
    echo "  → removing conflicting $type record on $host ($content)"
    cf DELETE "/zones/$ZONE_ID/dns_records/$id" > /dev/null
  done <<< "$ids"
}

attach_domain() {
  local project=$1 host=$2
  local existing
  existing=$(cf GET "/accounts/$ACCOUNT_ID/pages/projects/$project/domains" | python3 -c "
import json,sys
print('yes' if any(d.get('name')=='$host' for d in json.load(sys.stdin).get('result',[])) else 'no')
")
  if [ "$existing" = "yes" ]; then
    echo "  ✔ $host already attached to '$project'"
    return
  fi

  clear_conflicting_record "$host"

  echo "  → attaching $host to '$project'..."
  local res
  res=$(cf POST "/accounts/$ACCOUNT_ID/pages/projects/$project/domains" "{\"name\":\"$host\"}")
  if [ "$(echo "$res" | ok)" = "yes" ]; then
    echo "  ✔ attached $host"
  else
    echo "  ✖ could not attach $host: $(echo "$res" | err)"
  fi
}

echo "→ Custom domains..."
attach_domain "ubuos-site" "ubuos.com"
attach_domain "ubuos-site" "www.ubuos.com"
attach_domain "osscli"     "osscli.ubuos.com"

cat <<EOF

────────────────────────────────────────────────────────
Done. Certificates take a few minutes to issue.

Add these two as GitHub Actions secrets on BOTH repos so
CI can deploy:

  CLOUDFLARE_API_TOKEN   the token you used here
  CLOUDFLARE_ACCOUNT_ID  $ACCOUNT_ID

Then any push to main deploys the matching site.
────────────────────────────────────────────────────────
EOF