#!/bin/sh
set -eu

required() {
  name="$1"
  eval "value=\${${name}:-}"
  if [ -z "$value" ]; then
    printf '%s\n' "${name} environment variable must be set" >&2
    exit 1
  fi
}

safe_for_nginx() {
  name="$1"
  eval "value=\${${name}:-}"
  case "$value" in
    *'
'*|*'"'*|*'|'*)
      printf '%s\n' "${name} contains characters that cannot be used safely in the generated Nginx configuration" >&2
      exit 1
      ;;
  esac
}

AUTH_AUTHORITY="${AUTH_AUTHORITY:-${AUTH0_DOMAIN:+https://${AUTH0_DOMAIN}}}"
AUTH_CLIENT_ID="${AUTH_CLIENT_ID:-${AUTH0_CLIENT_ID:-}}"
AUTH_AUDIENCE="${AUTH_AUDIENCE:-${AUTH0_AUDIENCE:-}}"
AUTH_SUPPORTED_SCOPES="${AUTH_SUPPORTED_SCOPES:-openid profile email groups}"
USE_AUTH0="${USE_AUTH0:-false}"

required AUTH_AUTHORITY
required AUTH_CLIENT_ID
required AUTH_AUDIENCE
required NETBIRD_MGMT_API_ENDPOINT

for variable in \
  AUTH_AUTHORITY \
  AUTH_AUDIENCE \
  NETBIRD_AUTH_SERVICE_URL \
  NETBIRD_CSP \
  NETBIRD_MGMT_API_ENDPOINT; do
  safe_for_nginx "$variable"
done

if [ "$AUTH_AUDIENCE" = "none" ]; then
  AUTH_AUDIENCE=""
fi

AUTH_CLIENT_SECRET="${AUTH_CLIENT_SECRET:-}"
AUTH_REDIRECT_URI="${AUTH_REDIRECT_URI:-/nb-auth}"
AUTH_SILENT_REDIRECT_URI="${AUTH_SILENT_REDIRECT_URI:-/nb-silent-auth}"
NETBIRD_MGMT_API_ENDPOINT="$(printf '%s' "$NETBIRD_MGMT_API_ENDPOINT" | sed -E 's/(:80|:443)$//')"
NETBIRD_MGMT_GRPC_API_ENDPOINT="${NETBIRD_MGMT_GRPC_API_ENDPOINT:-$NETBIRD_MGMT_API_ENDPOINT}"
NETBIRD_HOTJAR_TRACK_ID="${NETBIRD_HOTJAR_TRACK_ID:-}"
NETBIRD_GOOGLE_ANALYTICS_ID="${NETBIRD_GOOGLE_ANALYTICS_ID:-}"
NETBIRD_GOOGLE_TAG_MANAGER_ID="${NETBIRD_GOOGLE_TAG_MANAGER_ID:-}"
NETBIRD_TOKEN_SOURCE="${NETBIRD_TOKEN_SOURCE:-accessToken}"
NETBIRD_DRAG_QUERY_PARAMS="${NETBIRD_DRAG_QUERY_PARAMS:-false}"
NETBIRD_AUTH_SERVICE_URL="${NETBIRD_AUTH_SERVICE_URL:-}"
NETBIRD_WASM_PATH="${NETBIRD_WASM_PATH:-}"
NETBIRD_CSP="${NETBIRD_CSP:-}"
NETBIRD_LICENSED="${NETBIRD_LICENSED:-false}"
NETBIRD_CLOUD="${NETBIRD_CLOUD:-false}"
NETBIRD_AGENT_NETWORK_ONLY="${NETBIRD_AGENT_NETWORK_ONLY:-false}"
NETBIRD_AGENT_NETWORK_ENABLED="${NETBIRD_AGENT_NETWORK_ENABLED:-false}"
NETBIRD_HUBSPOT_PORTAL_ID="${NETBIRD_HUBSPOT_PORTAL_ID:-}"
NETBIRD_HUBSPOT_SIGNUP_FORM_ID="${NETBIRD_HUBSPOT_SIGNUP_FORM_ID:-}"
NETBIRD_HUBSPOT_ONBOARDING_FORM_ID="${NETBIRD_HUBSPOT_ONBOARDING_FORM_ID:-}"
NETBIRD_HUBSPOT_SURVEY_FORM_ID="${NETBIRD_HUBSPOT_SURVEY_FORM_ID:-}"
NETBIRD_ANALYTICS_EXCLUDED_EMAILS="${NETBIRD_ANALYTICS_EXCLUDED_EMAILS:-}"
CYBERNET_PRODUCT_NAME="${CYBERNET_PRODUCT_NAME:-CyberNet}"
CYBERNET_DEFAULT_LOCALE="${CYBERNET_DEFAULT_LOCALE:-zh-CN}"
CYBERNET_DOCS_URL="${CYBERNET_DOCS_URL:-https://github.com/AiSpea/CyberNet-Dashboard#readme}"
CYBERNET_SUPPORT_URL="${CYBERNET_SUPPORT_URL:-https://github.com/AiSpea/CyberNet-Dashboard/issues}"
CYBERNET_SOURCE_URL="${CYBERNET_SOURCE_URL:-https://github.com/AiSpea/CyberNet-Dashboard}"
CYBERNET_CLIENT_DOWNLOAD_URL_TEMPLATE="${CYBERNET_CLIENT_DOWNLOAD_URL_TEMPLATE:-https://cybernet.aisp24.com/downloads?target={target}}"
CYBERNET_ANDROID_DOWNLOAD_URL="${CYBERNET_ANDROID_DOWNLOAD_URL:-https://cybernet.aisp24.com/downloads?target=android}"
CYBERNET_IOS_DOWNLOAD_URL="${CYBERNET_IOS_DOWNLOAD_URL:-https://cybernet.aisp24.com/downloads?target=ios}"

export \
  AUTH_AUDIENCE \
  AUTH_AUTHORITY \
  AUTH_CLIENT_ID \
  AUTH_CLIENT_SECRET \
  AUTH_REDIRECT_URI \
  AUTH_SILENT_REDIRECT_URI \
  AUTH_SUPPORTED_SCOPES \
  CYBERNET_ANDROID_DOWNLOAD_URL \
  CYBERNET_CLIENT_DOWNLOAD_URL_TEMPLATE \
  CYBERNET_DEFAULT_LOCALE \
  CYBERNET_DOCS_URL \
  CYBERNET_IOS_DOWNLOAD_URL \
  CYBERNET_PRODUCT_NAME \
  CYBERNET_SOURCE_URL \
  CYBERNET_SUPPORT_URL \
  NETBIRD_AGENT_NETWORK_ENABLED \
  NETBIRD_AGENT_NETWORK_ONLY \
  NETBIRD_ANALYTICS_EXCLUDED_EMAILS \
  NETBIRD_AUTH_SERVICE_URL \
  NETBIRD_CLOUD \
  NETBIRD_DRAG_QUERY_PARAMS \
  NETBIRD_GOOGLE_ANALYTICS_ID \
  NETBIRD_GOOGLE_TAG_MANAGER_ID \
  NETBIRD_HOTJAR_TRACK_ID \
  NETBIRD_HUBSPOT_ONBOARDING_FORM_ID \
  NETBIRD_HUBSPOT_PORTAL_ID \
  NETBIRD_HUBSPOT_SIGNUP_FORM_ID \
  NETBIRD_HUBSPOT_SURVEY_FORM_ID \
  NETBIRD_LICENSED \
  NETBIRD_MGMT_API_ENDPOINT \
  NETBIRD_MGMT_GRPC_API_ENDPOINT \
  NETBIRD_TOKEN_SOURCE \
  NETBIRD_WASM_PATH \
  USE_AUTH0

csp_origins="$NETBIRD_CSP $AUTH_AUTHORITY $NETBIRD_MGMT_API_ENDPOINT"

case "$AUTH_AUDIENCE" in
  http://*|https://*) csp_origins="$csp_origins $AUTH_AUDIENCE" ;;
esac

if [ -n "$NETBIRD_AUTH_SERVICE_URL" ]; then
  csp_origins="$csp_origins $NETBIRD_AUTH_SERVICE_URL"
fi

auth_origin="$(printf '%s' "$AUTH_AUTHORITY" | sed -E 's|^(https?://[^/]+).*|\1|')"
mgmt_origin="$(printf '%s' "$NETBIRD_MGMT_API_ENDPOINT" | sed -E 's|^(https?://[^/]+).*|\1|')"
csp_origins="$csp_origins $auth_origin $mgmt_origin"

mgmt_host="$(printf '%s' "$NETBIRD_MGMT_API_ENDPOINT" | sed -E 's|^https?://([^/:]+).*$|\1|')"
case "$NETBIRD_MGMT_API_ENDPOINT" in
  https://*) websocket_origin="wss://${mgmt_host}" ;;
  http://*) websocket_origin="ws://${mgmt_host}" ;;
  *) websocket_origin="" ;;
esac

unique_words() {
  printf '%s\n' "$*" | tr ' ' '\n' | sed '/^$/d' | sort -u | tr '\n' ' ' | sed 's/ $//'
}

connect_sources="$(unique_words \
  "$csp_origins" \
  "$websocket_origin" \
  "https://api.hetzner.cloud" \
  "https://api.digitalocean.com")"
frame_sources="$(unique_words "$csp_origins")"

upgrade=" upgrade-insecure-requests;"
case "$NETBIRD_MGMT_API_ENDPOINT $AUTH_AUTHORITY" in
  *http://*) upgrade="" ;;
esac

csp_policy="default-src 'none'; connect-src 'self' ${connect_sources}; frame-src 'self' ${frame_sources}; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; font-src 'self'; img-src 'self' data: blob: https:; manifest-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'self'; base-uri 'self'; form-action 'self';${upgrade}"

sed -i "s|__CYBERNET_CSP__|${csp_policy}|g" /etc/nginx/conf.d/default.conf

env_variables='$$USE_AUTH0 $$AUTH_AUDIENCE $$AUTH_AUTHORITY $$AUTH_CLIENT_ID $$AUTH_CLIENT_SECRET $$AUTH_SUPPORTED_SCOPES $$NETBIRD_MGMT_API_ENDPOINT $$NETBIRD_MGMT_GRPC_API_ENDPOINT $$NETBIRD_HOTJAR_TRACK_ID $$NETBIRD_GOOGLE_ANALYTICS_ID $$NETBIRD_GOOGLE_TAG_MANAGER_ID $$AUTH_REDIRECT_URI $$AUTH_SILENT_REDIRECT_URI $$NETBIRD_TOKEN_SOURCE $$NETBIRD_DRAG_QUERY_PARAMS $$NETBIRD_AUTH_SERVICE_URL $$NETBIRD_WASM_PATH $$NETBIRD_LICENSED $$NETBIRD_CLOUD $$NETBIRD_AGENT_NETWORK_ONLY $$NETBIRD_AGENT_NETWORK_ENABLED $$NETBIRD_HUBSPOT_PORTAL_ID $$NETBIRD_HUBSPOT_SIGNUP_FORM_ID $$NETBIRD_HUBSPOT_ONBOARDING_FORM_ID $$NETBIRD_HUBSPOT_SURVEY_FORM_ID $$NETBIRD_ANALYTICS_EXCLUDED_EMAILS $$CYBERNET_PRODUCT_NAME $$CYBERNET_DEFAULT_LOCALE $$CYBERNET_DOCS_URL $$CYBERNET_SUPPORT_URL $$CYBERNET_SOURCE_URL $$CYBERNET_CLIENT_DOWNLOAD_URL_TEMPLATE $$CYBERNET_ANDROID_DOWNLOAD_URL $$CYBERNET_IOS_DOWNLOAD_URL'

trusted_template="/usr/share/nginx/html/OidcTrustedDomains.js.tmpl"
if [ -f "$trusted_template" ]; then
  envsubst "$env_variables" < "$trusted_template" \
    > /usr/share/nginx/html/OidcTrustedDomains.js
fi

find /usr/share/nginx/html -type f \
  \( -name '*.html' -o -name '*.js' -o -name '*.json' \) \
  -exec grep -l 'AUTH_SUPPORTED_SCOPES' {} + 2>/dev/null |
while IFS= read -r file; do
  temporary="${file}.cybernet"
  envsubst "$env_variables" < "$file" > "$temporary"
  mv "$temporary" "$file"
done

nginx -t
