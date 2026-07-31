import { buttonVariants } from "@components/Button";
import { cn } from "@utils/helpers";
import { Clock3, DownloadIcon, LoaderCircle } from "lucide-react";
import React from "react";
import { useLocale } from "@/contexts/LocaleProvider";

type Props = {
  url?: string;
  loading?: boolean;
  label?: string;
};

export default function ClientDownloadAction({
  url,
  loading = false,
  label,
}: Readonly<Props>) {
  const { t } = useLocale();

  if (loading) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-md border border-nb-gray-200 bg-nb-gray-50 px-4 py-2.5 text-sm text-nb-gray-500 dark:border-nb-gray-800 dark:bg-nb-gray-930 dark:text-nb-gray-400"
        role="status"
      >
        <LoaderCircle size={15} className="animate-spin" />
        {t("install.checkingDownload")}
      </div>
    );
  }

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({
            variant: "primary",
            size: "md",
            rounded: true,
            border: 1,
          }),
          "w-fit",
        )}
      >
        <DownloadIcon size={14} />
        {label ?? t("install.downloadCyberNet")}
      </a>
    );
  }

  return (
    <div
      className="flex max-w-md items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
      role="status"
    >
      <Clock3 size={17} className="mt-0.5 shrink-0" />
      <span>{t("install.downloadUnavailable")}</span>
    </div>
  );
}
