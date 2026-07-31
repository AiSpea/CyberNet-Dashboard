"use client";

import { DoorOpen, Network, Route, ShieldCheck } from "lucide-react";
import Link from "next/link";
import PublicContentCard from "@/components/public/PublicContentCard";
import PublicPageLayout from "@/components/public/PublicPageLayout";
import { useLocale } from "@/contexts/LocaleProvider";

export default function NetworkDocsPage() {
  const { t } = useLocale();

  return (
    <PublicPageLayout
      eyebrow={t("docs.networks.eyebrow")}
      title={t("docs.networks.title")}
      description={t("docs.networks.introduction")}
    >
      <PublicContentCard
        icon={<Network size={20} />}
        title={t("docs.networks.resources.title")}
      >
        <p>{t("docs.networks.resources.description")}</p>
      </PublicContentCard>

      <div className="grid gap-5 md:grid-cols-2">
        <PublicContentCard
          icon={<Route size={20} />}
          title={t("docs.networks.routes.title")}
        >
          <p>{t("docs.networks.routes.description")}</p>
        </PublicContentCard>
        <PublicContentCard
          icon={<DoorOpen size={20} />}
          title={t("docs.networks.exit.title")}
        >
          <p>{t("docs.networks.exit.description")}</p>
        </PublicContentCard>
      </div>

      <PublicContentCard
        icon={<ShieldCheck size={20} />}
        title={t("docs.networks.access.title")}
      >
        <p>{t("docs.networks.access.description")}</p>
      </PublicContentCard>

      <Link
        href="/docs"
        className="inline-flex text-sm font-medium text-netbird hover:underline"
      >
        {t("docs.backToOverview")}
      </Link>
    </PublicPageLayout>
  );
}
