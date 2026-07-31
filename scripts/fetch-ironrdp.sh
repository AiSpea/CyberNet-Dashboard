#!/bin/sh
set -eu

IRONRDP_VERSION="${IRONRDP_VERSION:-v0.0.2}"
DESTINATION="${1:-public/ironrdp-pkg}"
BASE_URL="https://github.com/netbirdio/IronRDP/releases/download/${IRONRDP_VERSION}"

checksum() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

fetch() {
  file="$1"
  expected="$2"
  target="${DESTINATION}/${file}"

  if [ -f "$target" ] && [ "$(checksum "$target")" = "$expected" ]; then
    printf '%s\n' "IronRDP asset already verified: ${file}"
    return
  fi

  temporary="${target}.download"
  rm -f "$temporary"
  curl --fail --location --silent --show-error \
    --retry 3 \
    --output "$temporary" \
    "${BASE_URL}/${file}"

  actual="$(checksum "$temporary")"
  if [ "$actual" != "$expected" ]; then
    rm -f "$temporary"
    printf '%s\n' "Checksum mismatch for ${file}: expected ${expected}, got ${actual}" >&2
    exit 1
  fi

  mv "$temporary" "$target"
  printf '%s\n' "Downloaded and verified IronRDP asset: ${file}"
}

mkdir -p "$DESTINATION"

fetch "ironrdp_web.d.ts" \
  "a7818512bb18bd5cc3f237d616e6a203742c7152a60aaffca336b8f12dc67678"
fetch "ironrdp_web.js" \
  "d325a35d6c86d7a83f0ca48079898323ec03d96c6f93ba2f824317476bcda207"
fetch "ironrdp_web_bg.wasm" \
  "7f83df3fdd07985e90e74f932aa9a0ad4fa3debb07d36b3430004f1b2c20ae33"
fetch "ironrdp_web_bg.wasm.d.ts" \
  "df61fad9d7c70c9b4f850be687efb699f10676da3b6dd989e384985c8d387fa1"
