#!/bin/sh
# Install an unmodified NetBird release package through verified download
# accelerators. CyberNet does not rebuild or re-sign the upstream package.

set -eu

NETBIRD_VERSION="${NETBIRD_VERSION:-0.77.0}"
MANAGEMENT_URL="${CYBERNET_MANAGEMENT_URL:-https://cybernet.aisp24.com}"
OFFICIAL_RELEASE_ROOT="https://github.com/netbirdio/netbird/releases/download"
CHINA_PROXY_PRIMARY="https://ghproxy.net/"
CHINA_PROXY_SECONDARY="https://gh-proxy.com/"

log() {
  printf '[CyberNet] %s\n' "$*"
}

warn() {
  printf '[CyberNet] 警告：%s\n' "$*" >&2
}

fail() {
  printf '[CyberNet] 安装失败：%s\n' "$*" >&2
  exit 1
}

if [ "$(uname -s 2>/dev/null || true)" != "Linux" ]; then
  fail "该脚本仅支持 Linux。"
fi

case "$(uname -m 2>/dev/null || true)" in
  x86_64 | amd64) architecture="amd64" ;;
  aarch64 | arm64) architecture="arm64" ;;
  i386 | i486 | i586 | i686) architecture="386" ;;
  armv6l | armv7l) architecture="armv6" ;;
  *) fail "暂不支持此处理器架构：$(uname -m 2>/dev/null || printf unknown)" ;;
esac

if command -v dpkg >/dev/null 2>&1; then
  package_type="deb"
elif command -v rpm >/dev/null 2>&1; then
  package_type="rpm"
else
  package_type="tar.gz"
fi

case "${NETBIRD_VERSION}:${architecture}:${package_type}" in
  0.77.0:386:deb) expected_sha256="78db75ca4d515e87df3266b6b7532f5625bccf78a6a32debcb4876ab002e9382" ;;
  0.77.0:386:rpm) expected_sha256="6af976dbe2413dc9d7a3b74566fa7c0e036921aebc27ec4d23d8e4bf37420928" ;;
  0.77.0:386:tar.gz) expected_sha256="365bcff85e1d74966ce982ac4350b5b59862fb5c30c5de6caafb5c8b1bfc2887" ;;
  0.77.0:amd64:deb) expected_sha256="f5b9193e931f9e1c37298810a0222895df7bda86ae712021587048d7435c69ba" ;;
  0.77.0:amd64:rpm) expected_sha256="a8d22ad3cb36293797b19151686eb1246d14da018583d2df88b591947b613791" ;;
  0.77.0:amd64:tar.gz) expected_sha256="9a2c6eb7a086061ce51e06b86f546f6385c14eee9b30c87ee29d47c77558aade" ;;
  0.77.0:arm64:deb) expected_sha256="7c4fd76eb26f3688918c0d58b9f9341b0698c7c4b5dc89c18ff792bf980e2a42" ;;
  0.77.0:arm64:rpm) expected_sha256="e3e00dbdb6a20862ed65c29a057eeb83e978aedc1ab428a6553a4d9b33973149" ;;
  0.77.0:arm64:tar.gz) expected_sha256="ab372456cb3549ef90f8cc35f1629b8c3b7a9094d063a47bb1d73a9df26eee21" ;;
  0.77.0:armv6:deb) expected_sha256="93b346b109ac9c8d0fca97ca8a3fca62f75a0e7fe71d82ef904b712c35207a1a" ;;
  0.77.0:armv6:rpm) expected_sha256="425c4d3ed8b4a9f6a9ba1bab9a38cc3a53b0ea55b2e2fd69f570f81f55241a6f" ;;
  0.77.0:armv6:tar.gz) expected_sha256="02a65522875fdab8c8b4cf9df7a3a31b51dc49643b9dded8308f088098721461" ;;
  *) fail "没有 NetBird ${NETBIRD_VERSION} / ${architecture} / ${package_type} 的已审核校验值。" ;;
esac

if command -v curl >/dev/null 2>&1; then
  download_file() {
    curl -fL --retry 2 --retry-delay 1 --connect-timeout 12 --max-time 600 \
      --output "$2" "$1"
  }
elif command -v wget >/dev/null 2>&1; then
  download_file() {
    wget --quiet --tries=3 --timeout=20 --output-document="$2" "$1"
  }
else
  fail "需要先安装 curl 或 wget。"
fi

if command -v sha256sum >/dev/null 2>&1; then
  file_sha256() {
    sha256sum "$1" | cut -d ' ' -f 1
  }
elif command -v shasum >/dev/null 2>&1; then
  file_sha256() {
    shasum -a 256 "$1" | cut -d ' ' -f 1
  }
elif command -v openssl >/dev/null 2>&1; then
  file_sha256() {
    openssl dgst -sha256 "$1" | sed 's/^.*= //'
  }
else
  fail "系统缺少 SHA256 校验工具，已拒绝安装。"
fi

if [ "$(id -u)" -eq 0 ]; then
  run_as_root() {
    "$@"
  }
elif command -v sudo >/dev/null 2>&1; then
  run_as_root() {
    sudo "$@"
  }
else
  fail "请使用 root 运行，或先安装 sudo。"
fi

temporary_dir="$(mktemp -d /tmp/cybernet-install.XXXXXX 2>/dev/null || true)"
case "$temporary_dir" in
  /tmp/cybernet-install.*) ;;
  *) fail "无法创建安全的临时目录。" ;;
esac
cleanup() {
  rm -rf "$temporary_dir"
}
trap cleanup EXIT HUP INT TERM

package_name="netbird_${NETBIRD_VERSION}_linux_${architecture}.${package_type}"
package_path="${temporary_dir}/${package_name}"
official_url="${OFFICIAL_RELEASE_ROOT}/v${NETBIRD_VERSION}/${package_name}"

download_and_verify() {
  source_name="$1"
  source_url="$2"
  log "正在尝试 ${source_name}：${package_name}"
  if ! download_file "$source_url" "$package_path"; then
    warn "${source_name} 下载失败，将尝试下一下载源。"
    return 1
  fi

  actual_sha256="$(file_sha256 "$package_path" 2>/dev/null || true)"
  if [ "$actual_sha256" != "$expected_sha256" ]; then
    warn "${source_name} 返回的文件未通过官方 SHA256 校验，将尝试下一下载源。"
    return 1
  fi

  log "下载完成，官方 SHA256 校验通过。"
  return 0
}

downloaded="false"
if [ -n "${CYBERNET_NETBIRD_DOWNLOAD_PREFIX:-}" ]; then
  if download_and_verify "指定下载源" "${CYBERNET_NETBIRD_DOWNLOAD_PREFIX}${official_url}"; then
    downloaded="true"
  fi
fi
if [ "$downloaded" = "false" ] && download_and_verify "国内加速源一" "${CHINA_PROXY_PRIMARY}${official_url}"; then
  downloaded="true"
fi
if [ "$downloaded" = "false" ] && download_and_verify "国内加速源二" "${CHINA_PROXY_SECONDARY}${official_url}"; then
  downloaded="true"
fi
if [ "$downloaded" = "false" ] && download_and_verify "NetBird 官方 GitHub Release" "$official_url"; then
  downloaded="true"
fi
[ "$downloaded" = "true" ] || fail "所有下载源均不可用，请检查网络后重试。"

log "正在安装 NetBird 官方原版 ${NETBIRD_VERSION}（${architecture} / ${package_type}）…"
case "$package_type" in
  deb)
    run_as_root dpkg -i "$package_path"
    installed_binary="$(command -v netbird 2>/dev/null || printf /usr/bin/netbird)"
    ;;
  rpm)
    run_as_root rpm -Uvh --replacepkgs "$package_path"
    installed_binary="$(command -v netbird 2>/dev/null || printf /usr/bin/netbird)"
    ;;
  tar.gz)
    tar -xzf "$package_path" -C "$temporary_dir"
    [ -f "${temporary_dir}/netbird" ] || fail "官方压缩包中缺少 netbird 可执行文件。"
    run_as_root install -m 0755 "${temporary_dir}/netbird" /usr/local/bin/netbird
    installed_binary="/usr/local/bin/netbird"
    run_as_root "$installed_binary" service install
    run_as_root "$installed_binary" service start
    ;;
esac

[ -x "$installed_binary" ] || fail "安装完成，但没有找到 netbird 可执行文件。"
installed_version="$($installed_binary version 2>/dev/null || true)"
log "安装成功：${installed_version:-NetBird ${NETBIRD_VERSION}}"
printf '\n下一步，请连接 CyberNet：\n  netbird up --management-url %s\n\n' "$MANAGEMENT_URL"
