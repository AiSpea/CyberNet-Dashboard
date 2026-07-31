"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClientUpdateConfig } from "@/interfaces/Instance";
import { fetchInstanceStatus } from "@/utils/unauthenticatedApi";
import loadConfig from "@/utils/config";
import { pkgsDownloadUrl } from "@/utils/netbird";

export type ClientPlatform =
  keyof ClientUpdateConfig["update"]["platform_download_urls"];

export type ClientDownloads = Record<ClientPlatform, string | undefined>;

const dashboardConfig = loadConfig();

const dashboardDownloads: Record<ClientPlatform, string> = {
  darwin: pkgsDownloadUrl("macos/universal"),
  windows: pkgsDownloadUrl("windows/x64"),
  linux: pkgsDownloadUrl("linux"),
  ios: dashboardConfig.iosDownloadUrl,
  android: dashboardConfig.androidDownloadUrl,
};

/**
 * The default Dashboard links point back to the download centre so it can
 * explain that a build is not available. They are useful navigation links,
 * but they are not installer URLs and must not render as a download button.
 */
function directInstallerUrl(url?: string): string | undefined {
  const candidate = url?.trim();
  if (!candidate) return undefined;

  try {
    const parsed = new URL(candidate, "https://dashboard.cybernet.invalid");
    if (parsed.pathname.replace(/\/+$/, "") === "/downloads") {
      return undefined;
    }
  } catch {
    return undefined;
  }

  return candidate;
}

function resolveInstallerUrl(
  instanceUrl: string | undefined,
  dashboardUrl: string,
): string | undefined {
  return directInstallerUrl(instanceUrl) ?? directInstallerUrl(dashboardUrl);
}

export function resolveClientDownloads(
  clientUpdate?: ClientUpdateConfig,
): ClientDownloads {
  return {
    darwin: resolveInstallerUrl(
      clientUpdate?.update.platform_download_urls.darwin,
      dashboardDownloads.darwin,
    ),
    windows: resolveInstallerUrl(
      clientUpdate?.update.platform_download_urls.windows,
      dashboardDownloads.windows,
    ),
    linux: resolveInstallerUrl(
      clientUpdate?.update.platform_download_urls.linux,
      dashboardDownloads.linux,
    ),
    ios: resolveInstallerUrl(
      clientUpdate?.update.platform_download_urls.ios,
      dashboardDownloads.ios,
    ),
    android: resolveInstallerUrl(
      clientUpdate?.update.platform_download_urls.android,
      dashboardDownloads.android,
    ),
  };
}

export default function useClientDownloads() {
  const fallback = useMemo(() => resolveClientDownloads(), []);
  const [downloads, setDownloads] = useState<ClientDownloads>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchInstanceStatus()
      .then((status) => {
        if (active) {
          setDownloads(resolveClientDownloads(status.client_update));
        }
      })
      .catch(() => {
        // Dashboard-configured URLs remain available when instance metadata
        // cannot be reached. Empty URLs render an explicit unavailable state.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { downloads, loading };
}
