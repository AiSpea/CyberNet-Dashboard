"use client";

import { Activity, Laptop, LockKeyhole, Wifi } from "lucide-react";
import Link from "next/link";
import PublicContentCard from "@/components/public/PublicContentCard";
import PublicPageLayout from "@/components/public/PublicPageLayout";
import { useLocale } from "@/contexts/LocaleProvider";

export default function PeerDocsPage() {
  const { t } = useLocale();

  return (
    <PublicPageLayout
      eyebrow={t("docs.peers.eyebrow")}
      title={t("docs.peers.title")}
      description={t("docs.peers.introduction")}
    >
      <PublicContentCard
        icon={<Laptop size={20} />}
        title={t("docs.peers.what.title")}
      >
        <p>{t("docs.peers.what.description")}</p>
      </PublicContentCard>

      <div className="grid gap-5 md:grid-cols-2">
        <PublicContentCard
          icon={<Activity size={20} />}
          title={t("docs.peers.status.title")}
        >
          <p>{t("docs.peers.status.description")}</p>
        </PublicContentCard>
        <PublicContentCard
          icon={<Wifi size={20} />}
          title={t("docs.peers.connectivity.title")}
        >
          <p>{t("docs.peers.connectivity.description")}</p>
        </PublicContentCard>
      </div>

      <PublicContentCard
        icon={<LockKeyhole size={20} />}
        title={t("docs.peers.access.title")}
      >
        <p>{t("docs.peers.access.description")}</p>
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
