"use client";

import { buttonVariants } from "@components/Button";
import { cn } from "@utils/helpers";
import {
  Check,
  Copy,
  Download,
  KeyRound,
  LayoutDashboard,
  Network,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import PublicContentCard from "@/components/public/PublicContentCard";
import PublicPageLayout from "@/components/public/PublicPageLayout";
import { useLocale } from "@/contexts/LocaleProvider";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { getNetBirdUpCommand } from "@/utils/netbird";

const linuxInstallCommand = `curl -fsSL https://pkgs.netbird.io/install.sh | sh && ${getNetBirdUpCommand()}`;

export default function DocsPage() {
  const { t } = useLocale();
  const [, copyLinuxCommand, linuxCommandCopied] =
    useCopyToClipboard(linuxInstallCommand);

  return (
    <PublicPageLayout
      eyebrow={t("docs.eyebrow")}
      title={t("docs.title")}
      description={t("docs.introduction")}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <PublicContentCard
          icon={<KeyRound size={20} />}
          title={t("docs.signIn.title")}
        >
          <p>{t("docs.signIn.description")}</p>
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-6 text-slate-500 dark:bg-nb-gray-930 dark:text-nb-gray-400">
            {t("docs.signIn.noAddress")}
          </p>
        </PublicContentCard>

        <PublicContentCard
          icon={<Download size={20} />}
          title={t("docs.downloads.title")}
        >
          <p>{t("docs.downloads.description")}</p>
          <Link
            href="/downloads"
            className={cn(
              buttonVariants({
                variant: "primary",
                size: "sm",
                rounded: true,
                border: 1,
              }),
              "mt-4",
            )}
          >
            <Download size={15} />
            {t("docs.downloads.action")}
          </Link>
        </PublicContentCard>
      </div>

      <PublicContentCard
        icon={<Terminal size={20} />}
        title={t("docs.linux.title")}
      >
        <p>{t("docs.linux.description")}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-slate-100 dark:border-nb-gray-800">
          <div className="flex items-start gap-3 p-4">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs leading-6 sm:text-sm">
              {linuxInstallCommand}
            </code>
            <button
              type="button"
              onClick={() => copyLinuxCommand(t("docs.linux.copied"))}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-xs font-medium text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-netbird/60"
            >
              {linuxCommandCopied ? <Check size={14} /> : <Copy size={14} />}
              {linuxCommandCopied
                ? t("docs.linux.copyDone")
                : t("docs.linux.copy")}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-nb-gray-400">
          {t("docs.linux.afterInstall")}
        </p>
      </PublicContentCard>

      <PublicContentCard
        icon={<LayoutDashboard size={20} />}
        title={t("docs.admin.title")}
      >
        <p>{t("docs.admin.description")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            {
              title: t("docs.admin.devices.title"),
              description: t("docs.admin.devices.description"),
            },
            {
              title: t("docs.admin.access.title"),
              description: t("docs.admin.access.description"),
            },
            {
              title: t("docs.admin.routing.title"),
              description: t("docs.admin.routing.description"),
            },
            {
              title: t("docs.admin.operations.title"),
              description: t("docs.admin.operations.description"),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-nb-gray-850 dark:bg-nb-gray-930"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-nb-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </PublicContentCard>

      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
        <Network size={18} className="mt-0.5 shrink-0" />
        <span>{t("docs.support")}</span>
      </div>
    </PublicPageLayout>
  );
}
