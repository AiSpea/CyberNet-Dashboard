"use client";

import {
  Ban,
  CircleAlert,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import PublicContentCard from "@/components/public/PublicContentCard";
import PublicPageLayout from "@/components/public/PublicPageLayout";
import { useLocale } from "@/contexts/LocaleProvider";

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <PublicPageLayout
      eyebrow={t("terms.eyebrow")}
      title={t("terms.title")}
      description={t("terms.introduction")}
    >
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
        {t("terms.betaNotice")} · {t("legal.effectiveDate")}:{" "}
        {t("legal.effectiveDateValue")}
      </div>

      <PublicContentCard
        icon={<UserRoundCheck size={20} />}
        title={t("terms.authorization.title")}
      >
        <p>{t("terms.authorization.description")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<KeyRound size={20} />}
        title={t("terms.account.title")}
      >
        <p>{t("terms.account.description")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<Ban size={20} />}
        title={t("terms.prohibited.title")}
      >
        <p>{t("terms.prohibited.description")}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-netbird">
          <li>{t("terms.prohibited.access")}</li>
          <li>{t("terms.prohibited.disrupt")}</li>
          <li>{t("terms.prohibited.malware")}</li>
          <li>{t("terms.prohibited.bypass")}</li>
          <li>{t("terms.prohibited.illegal")}</li>
        </ul>
      </PublicContentCard>

      <PublicContentCard
        icon={<RefreshCw size={20} />}
        title={t("terms.changes.title")}
      >
        <p>{t("terms.changes.description")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<ShieldCheck size={20} />}
        title={t("terms.termination.title")}
      >
        <p>{t("terms.termination.description")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<CircleAlert size={20} />}
        title={t("terms.asIs.title")}
      >
        <p>{t("terms.asIs.description")}</p>
      </PublicContentCard>

      <PublicContentCard
        icon={<Mail size={20} />}
        title={t("terms.contact.title")}
      >
        <p>{t("terms.contact.description")}</p>
        <a
          href="mailto:tech@aispea.com"
          className="mt-3 inline-flex font-medium text-netbird hover:underline"
        >
          tech@aispea.com
        </a>
      </PublicContentCard>
    </PublicPageLayout>
  );
}
