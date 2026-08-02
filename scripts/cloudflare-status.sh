#!/usr/bin/env bash
#
# cloudflare-status.sh — print everything needed to diagnose a Pages setup.
#
#     export CLOUDFLARE_API_TOKEN=...
#     ./scripts/cloudflare-status.sh
#
# Read-only. Changes nothing, so it is safe to run at any point.

API="https://api.cloudflare.com/client/v4"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "✖ CLOUDFLARE_API_TOKEN is not set in this shell."
  echo
  echo "  It is lost whenever you open a new terminal tab. Set it again:"
  echo "    export CLOUDFLARE_API_TOKEN=<your token>"
  exit 1
fi
echo "✔ token is set in this shell"

cf() { curl -sS "$API$1" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"; }

echo
echo "── token ──────────────────────────────────────────────"
cf /user/tokens/verify | python3 -c '
import json,sys
d=json.load(sys.stdin)
print("valid" if d.get("success") else "REJECTED: " + "; ".join(e.get("message","") for e in d.get("errors",[])))
'

echo
echo "── zone ───────────────────────────────────────────────"
ZONE_JSON=$(cf "/zones?name=ubuos.com")
echo "$ZONE_JSON" | python3 -c '
import json,sys
d=json.load(sys.stdin)
if not d.get("success"):
    print("CANNOT READ ZONES:", "; ".join(e.get("message","") for e in d.get("errors",[]))); raise SystemExit
z=d.get("result") or []
if not z:
    print("ubuos.com NOT VISIBLE to this token"); raise SystemExit
print("zone id    :", z[0]["id"])
print("account id :", z[0]["account"]["id"])
print("status     :", z[0].get("status"))
'

ACCOUNT_ID=$(echo "$ZONE_JSON" | python3 -c '
import json,sys
z=(json.load(sys.stdin).get("result") or [])
print(z[0]["account"]["id"] if z else "")
')
[ -z "$ACCOUNT_ID" ] && { echo; echo "Cannot continue without an account id."; exit 1; }

echo
echo "── pages projects ─────────────────────────────────────"
cf "/accounts/$ACCOUNT_ID/pages/projects" | python3 -c '
import json,sys
d=json.load(sys.stdin)
if not d.get("success"):
    print("CANNOT LIST PROJECTS:", "; ".join(e.get("message","") for e in d.get("errors",[]))); raise SystemExit
r=d.get("result") or []
if not r:
    print("NO PROJECTS EXIST"); raise SystemExit
for p in r:
    ld = p.get("latest_deployment") or {}
    print("project    :", p.get("name"))
    print("  subdomain:", p.get("subdomain") or "(none)")
    print("  deployed :", ld.get("url") or "NEVER DEPLOYED")
    print("  when     :", ld.get("created_on") or "-")
    print("  domains  :", ", ".join(p.get("domains") or []) or "(none attached)")
    print()
'

echo "── dns records on ubuos.com ───────────────────────────"
ZONE_ID=$(echo "$ZONE_JSON" | python3 -c '
import json,sys
z=(json.load(sys.stdin).get("result") or [])
print(z[0]["id"] if z else "")
')
cf "/zones/$ZONE_ID/dns_records" | python3 -c '
import json,sys
d=json.load(sys.stdin)
if not d.get("success"):
    print("CANNOT READ DNS:", "; ".join(e.get("message","") for e in d.get("errors",[]))); raise SystemExit
r=d.get("result") or []
if not r:
    print("(no records)")
for x in r:
    print(f'"'"'{x["type"]:6} {x["name"]:28} -> {x.get("content","")[:48]:50} proxied={x.get("proxied")}'"'"')
'
echo
echo "───────────────────────────────────────────────────────"
echo "Paste everything above."
