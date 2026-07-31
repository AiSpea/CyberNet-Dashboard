"use client";

import {
  Activity,
  CircleDollarSign,
  Database,
  Mail,
  ShieldCheck,
  UserRoundCheck,
  Wifi,
} from "lucide-react";
import PublicContentCard from "@/components/public/PublicContentCard";
import PublicPageLayout from "@/components/public/PublicPageLayout";
import { useLocale } from "@/contexts/LocaleProvider";

export default function PrivacyPage() {
  const { t } = useLocale();

  return (
    <PublicPageLayout
      eyebrow={t("privacy.eyebrow")}
      title={t("privacy.title")}
      description={t("privacy.introduction")}
    >
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100">
        {t("legal.effectiveDate")}: {t("legal.effectiveDateValue")}
      </div>

      <PublicContentCard
        icon={<Database size={20} />}
        title={t("privacy.data.title")}
      >
        <ul className="list-disc space-y-2 pl-5 marker:text-netbird">
          <li>{t("privacy.data.account")}</li>
          <li>{t("privacy.data.device")}</li>
          <li>{t("privacy.data.connection")}</li>
          <li>{t("privacy.data.diagnostics")}</li>
        </ul>
      </PublicContentCard>

      <PublicContentCard
        icon={<Wifi size={20} />}
        title={t("privacy.local.title")}
      >
        <p>{t("privacy.local.description")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<Activity size={20} />}
        title={t("privacy.use.title")}
      >
        <p>{t("privacy.use.description")}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-netbird">
          <li>{t("privacy.use.authentication")}</li>
          <li>{t("privacy.use.network")}</li>
          <li>{t("privacy.use.support")}</li>
          <li>{t("privacy.use.security")}</li>
        </ul>
      </PublicContentCard>

      <PublicContentCard
        icon={<ShieldCheck size={20} />}
        title={t("privacy.storage.title")}
      >
        <p>{t("privacy.storage.cybernet")}</p>
        <p className="mt-3">{t("privacy.storage.processors")}</p>
        <p className="mt-3">{t("privacy.storage.retention")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<CircleDollarSign size={20} />}
        title={t("privacy.sale.title")}
      >
        <p>{t("privacy.sale.description")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<UserRoundCheck size={20} />}
        title={t("privacy.rights.title")}
      >
        <p>{t("privacy.rights.description")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<Mail size={20} />}
        title={t("privacy.contact.title")}
      >
        <p>{t("privacy.contact.description")}</p>
        <a
          href="mailto:tech@aispea.com"
          className="mt-3 inline-flex font-medium text-netbird hover:underline"
        >
          tech@aispea.com
        </a>
        <p className="mt-4 text-xs leading-6 text-slate-500 dark:text-nb-gray-400">
          {t("privacy.changes")}
        </p>
      </PublicContentCard>
    </PublicPageLayout>
  );
}
