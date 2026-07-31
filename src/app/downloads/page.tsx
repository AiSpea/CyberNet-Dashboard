"use client";

import { buttonVariants } from "@components/Button";
import Code from "@components/Code";
import { cn } from "@utils/helpers";
import {
  AlertTriangle,
  Apple,
  ArrowLeft,
  Clock3,
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
import { resolveClientDownloads } from "@/modules/setup-netbird-modal/useClientDownloads";
import { fetchInstanceStatus } from "@/utils/unauthenticatedApi";
import { getNetBirdUpCommand } from "@/utils/netbird";

type Platform = keyof ClientUpdateConfig["update"]["platform_download_urls"];

const platforms: {
  id: Platform;
  labelKey:
    | "downloads.platform.macos"
    | "downloads.platform.windows"
    | "downloads.platform.linux"
    | "downloads.platform.ios"
    | "downloads.platform.android";
  descriptionKey:
    | "downloads.platform.macosDescription"
    | "downloads.platform.windowsDescription"
    | "downloads.platform.linuxDescription"
    | "downloads.platform.iosDescription"
    | "downloads.platform.androidDescription";
  actionKey?:
    | "downloads.action.macos"
    | "downloads.action.windows"
    | "downloads.action.ios"
    | "downloads.action.android";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  targetPrefixes: string[];
}[] = [
  {
    id: "darwin",
    labelKey: "downloads.platform.macos",
    descriptionKey: "downloads.platform.macosDescription",
    actionKey: "downloads.action.macos",
    icon: Apple,
    targetPrefixes: ["darwin", "mac", "macos"],
  },
  {
    id: "windows",
    labelKey: "downloads.platform.windows",
    descriptionKey: "downloads.platform.windowsDescription",
    actionKey: "downloads.action.windows",
    icon: MonitorDown,
    targetPrefixes: ["windows", "win"],
  },
  {
    id: "linux",
    labelKey: "downloads.platform.linux",
    descriptionKey: "downloads.platform.linuxDescription",
    icon: Terminal,
    targetPrefixes: ["linux"],
  },
  {
    id: "ios",
    labelKey: "downloads.platform.ios",
    descriptionKey: "downloads.platform.iosDescription",
    actionKey: "downloads.action.ios",
    icon: Smartphone,
    targetPrefixes: ["ios", "iphone", "ipad"],
  },
  {
    id: "android",
    labelKey: "downloads.platform.android",
    descriptionKey: "downloads.platform.androidDescription",
    actionKey: "downloads.action.android",
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

const linuxInstallCommand = `curl -fsSL https://pkgs.netbird.io/install.sh | sh && ${getNetBirdUpCommand()}`;

function companionAndroidUrl(url?: string): string | undefined {
  if (!url?.endsWith("-Android-arm64-v8a.apk")) return undefined;
  return url.replace("-Android-arm64-v8a.apk", "-Android-universal.apk");
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
  const downloads = useMemo(() => resolveClientDownloads(config), [config]);

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
          <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
            <ShieldCheck size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{t("downloads.accountReadyTitle")}</p>
              <p className="mt-0.5 leading-5 opacity-80">
                {t("downloads.accountReadyDescription")}
              </p>
            </div>
          </div>
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
              {platforms.map(
                ({ id, labelKey, descriptionKey, actionKey, icon: Icon }) => {
                  const url = downloads[id];
                  const requested = requestedPlatform === id;
                  const showWindowsBetaWarning =
                    id === "windows" && url?.includes("unsigned-beta");
                  const showAndroidMigrationWarning =
                    id === "android" && url?.includes("/0.1.1/");
                  const androidUniversalUrl =
                    id === "android" ? companionAndroidUrl(url) : undefined;
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
                      <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600 dark:text-nb-gray-300">
                        {t(descriptionKey)}
                      </p>
                      {(showWindowsBetaWarning ||
                        showAndroidMigrationWarning) && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                          <AlertTriangle
                            size={15}
                            className="mt-0.5 shrink-0"
                          />
                          <span>
                            {showWindowsBetaWarning
                              ? t("downloads.notice.windowsUnsigned")
                              : t("downloads.notice.androidMigration")}
                          </span>
                        </div>
                      )}
                      {config?.update.latest_version && id !== "linux" && (
                        <p className="mt-3 text-xs text-slate-500 dark:text-nb-gray-400">
                          {t("downloads.availableVersion", {
                            version: config.update.latest_version,
                          })}
                        </p>
                      )}
                      <div className="mt-auto pt-5">
                        {id === "linux" ? (
                          <div>
                            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-nb-gray-400">
                              {t("downloads.linuxScriptTitle")}
                            </p>
                            <Code
                              codeToCopy={linuxInstallCommand}
                              message={t("downloads.scriptCopied")}
                              small
                            >
                              <Code.Line>{linuxInstallCommand}</Code.Line>
                            </Code>
                          </div>
                        ) : url ? (
                          <div className="space-y-3">
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
                              {actionKey
                                ? t(actionKey)
                                : t("downloads.openDownload")}
                            </a>
                            {androidUniversalUrl && (
                              <a
                                href={androidUniversalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-950 dark:text-nb-gray-300 dark:hover:text-white"
                              >
                                <ExternalLink size={13} />
                                {t("downloads.action.androidUniversal")}
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                            <Clock3 size={16} className="mt-0.5 shrink-0" />
                            <span>{t("downloads.unavailableDescription")}</span>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                },
              )}
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
