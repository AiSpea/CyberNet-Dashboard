"use client";

import { buttonVariants } from "@components/Button";
import { cn } from "@utils/helpers";
import {
  Apple,
  ArrowLeft,
  Download,
  ExternalLink,
  LoaderCircle,
  MonitorDown,
  ShieldCheck,
  Smartphone,
  Terminal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLocale } from "@/contexts/LocaleProvider";
import type { ClientUpdateConfig } from "@/interfaces/Instance";
import { fetchInstanceStatus } from "@/utils/unauthenticatedApi";

type Platform = keyof ClientUpdateConfig["update"]["platform_download_urls"];

const platforms: {
  id: Platform;
  labelKey:
    | "downloads.platform.macos"
    | "downloads.platform.windows"
    | "downloads.platform.linux"
    | "downloads.platform.ios"
    | "downloads.platform.android";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  targetPrefixes: string[];
}[] = [
  {
    id: "darwin",
    labelKey: "downloads.platform.macos",
    icon: Apple,
    targetPrefixes: ["darwin", "mac", "macos"],
  },
  {
    id: "windows",
    labelKey: "downloads.platform.windows",
    icon: MonitorDown,
    targetPrefixes: ["windows", "win"],
  },
  {
    id: "linux",
    labelKey: "downloads.platform.linux",
    icon: Terminal,
    targetPrefixes: ["linux"],
  },
  {
    id: "ios",
    labelKey: "downloads.platform.ios",
    icon: Smartphone,
    targetPrefixes: ["ios", "iphone", "ipad"],
  },
  {
    id: "android",
    labelKey: "downloads.platform.android",
    icon: Smartphone,
    targetPrefixes: ["android"],
  },
];

function isDownloadHub(url: string): boolean {
  if (!url || typeof window === "undefined") return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return (
      parsed.origin === window.location.origin &&
      parsed.pathname.replace(/\/+$/, "") === "/downloads"
    );
  } catch {
    return false;
  }
}

function directDownloadUrl(
  config: ClientUpdateConfig | undefined,
  platform: Platform,
): string | undefined {
  const platformUrl = config?.update.platform_download_urls[platform]?.trim();
  if (platformUrl && !isDownloadHub(platformUrl)) return platformUrl;

  const fallbackUrl = config?.update.download_url?.trim();
  if (fallbackUrl && !isDownloadHub(fallbackUrl)) return fallbackUrl;

  return undefined;
}

export default function DownloadsPage() {
  const { t } = useLocale();
  const [config, setConfig] = useState<ClientUpdateConfig>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [requestedTarget, setRequestedTarget] = useState("");

  useEffect(() => {
    setRequestedTarget(
      new URLSearchParams(window.location.search)
        .get("target")
        ?.toLowerCase() ?? "",
    );
    fetchInstanceStatus()
      .then((status) => setConfig(status.client_update))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const requestedPlatform = useMemo(
    () =>
      platforms.find(({ targetPrefixes }) =>
        targetPrefixes.some(
          (prefix) =>
            requestedTarget === prefix ||
            requestedTarget.startsWith(`${prefix}/`),
        ),
      )?.id,
    [requestedTarget],
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-nb-gray-950 dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-netbird/40"
        >
          <Image
            src="/cybernet-app-icon.png"
            alt="CyberNet"
            width={38}
            height={38}
            className="rounded-[28%]"
            priority
          />
          <span className="text-lg font-semibold">CyberNet</span>
        </Link>
        <LanguageSwitcher />
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28%] bg-white shadow-sm ring-1 ring-slate-200 dark:bg-nb-gray-930 dark:ring-nb-gray-850">
            <Image
              src="/cybernet-app-icon.png"
              alt=""
              width={58}
              height={58}
              className="rounded-[25%]"
              priority
            />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("downloads.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-nb-gray-300 sm:text-base">
            {t("downloads.description")}
          </p>
          {config?.update.latest_version && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-nb-gray-400">
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200 dark:bg-nb-gray-930 dark:ring-nb-gray-850">
                {t("downloads.availableVersion", {
                  version: config.update.latest_version,
                })}
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200 dark:bg-nb-gray-930 dark:ring-nb-gray-850">
                {t("downloads.channel", { channel: config.update.channel })}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-14 flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-nb-gray-400">
            <LoaderCircle className="animate-spin" size={18} />
            {t("downloads.loading")}
          </div>
        ) : (
          <>
            {failed && (
              <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                {t("downloads.configurationError")}
              </div>
            )}

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platforms.map(({ id, labelKey, icon: Icon }) => {
                const url = directDownloadUrl(config, id);
                const requested = requestedPlatform === id;
                return (
                  <article
                    key={id}
                    className={cn(
                      "flex min-h-52 flex-col rounded-2xl border bg-white p-6 shadow-sm transition-colors dark:bg-nb-gray-940",
                      requested
                        ? "border-netbird ring-2 ring-netbird/15 dark:border-netbird"
                        : "border-slate-200 dark:border-nb-gray-850",
                    )}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-netbird dark:bg-netbird/10">
                      <Icon size={22} />
                    </div>
                    <h2 className="mt-5 text-base font-semibold">
                      {t(labelKey)}
                    </h2>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-nb-gray-400">
                      {url
                        ? config?.update.latest_version
                          ? t("downloads.availableVersion", {
                              version: config.update.latest_version,
                            })
                          : t("downloads.openDownload")
                        : t("downloads.unavailableDescription")}
                    </p>
                    <div className="mt-auto pt-5">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({
                              variant: "primary",
                              size: "sm",
                              rounded: true,
                              border: 1,
                            }),
                            "w-full",
                          )}
                        >
                          <Download size={15} />
                          {t("downloads.openDownload")}
                        </a>
                      ) : (
                        <span className="inline-flex w-full items-center justify-center rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-500 dark:bg-nb-gray-900 dark:text-nb-gray-400">
                          {t("downloads.unavailable")}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-950 dark:text-nb-gray-300 dark:hover:text-white"
              >
                <ArrowLeft size={15} />
                {t("common.backToDashboard")}
              </Link>
              {config?.update.release_notes_url &&
                !isDownloadHub(config.update.release_notes_url) && (
                  <a
                    href={config.update.release_notes_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-950 dark:text-nb-gray-300 dark:hover:text-white"
                  >
                    <ExternalLink size={15} />
                    {t("downloads.releaseNotes")}
                  </a>
                )}
              <span className="inline-flex items-center gap-2 text-slate-500 dark:text-nb-gray-400">
                <ShieldCheck size={15} />
                CyberNet
              </span>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
