"use client";

import Paragraph from "@components/Paragraph";
import SkeletonTable from "@components/skeletons/SkeletonTable";
import { RestrictedAccess } from "@components/ui/RestrictedAccess";
import { usePortalElement } from "@hooks/usePortalElement";
import { ExternalLinkIcon, FolderGit2Icon } from "lucide-react";
import React, { lazy, Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import InlineLink from "@/components/InlineLink";
import { usePermissions } from "@/contexts/PermissionsProvider";
import PageContainer from "@/layouts/PageContainer";
import { useLocale } from "@/contexts/LocaleProvider";
import loadConfig from "@/utils/config";

const config = loadConfig();

const GroupsTable = lazy(() => import("@/modules/groups/table/GroupsTable"));

export default function GroupsPage() {
  const { t } = useLocale();
  const { permission } = usePermissions();
  const { ref: headingRef, portalTarget } =
    usePortalElement<HTMLHeadingElement>();

  return (
    <PageContainer>
      <div className={"p-default py-6"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/groups"}
            label={t("nav.groups")}
            icon={<FolderGit2Icon size={14} />}
            active
          />
        </Breadcrumbs>
        <h1 ref={headingRef}>{t("nav.groups")}</h1>
        <Paragraph>
          {t("page.groups.description")}{" "}
          <InlineLink href={config.docsUrl} target={"_blank"}>
            {t("common.learnMore")}
            <ExternalLinkIcon size={12} />
          </InlineLink>
        </Paragraph>
      </div>
      <RestrictedAccess hasAccess={permission.groups.read} page={"Groups"}>
        <Suspense fallback={<SkeletonTable />}>
          <GroupsTable headingTarget={portalTarget} />
        </Suspense>
      </RestrictedAccess>
    </PageContainer>
  );
}
