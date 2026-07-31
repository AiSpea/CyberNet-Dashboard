"use client";

import Breadcrumbs from "@components/Breadcrumbs";
import InlineLink from "@components/InlineLink";
import Paragraph from "@components/Paragraph";
import SkeletonTable from "@components/skeletons/SkeletonTable";
import { RestrictedAccess } from "@components/ui/RestrictedAccess";
import { usePortalElement } from "@hooks/usePortalElement";
import useFetchApi from "@utils/api";
import { ExternalLinkIcon } from "lucide-react";
import React, { lazy, Suspense } from "react";
import AccessControlIcon from "@/assets/icons/AccessControlIcon";
import GroupsProvider from "@/contexts/GroupsProvider";
import { usePermissions } from "@/contexts/PermissionsProvider";
import PoliciesProvider from "@/contexts/PoliciesProvider";
import { Policy } from "@/interfaces/Policy";
import PageContainer from "@/layouts/PageContainer";
import { useLocale } from "@/contexts/LocaleProvider";
import loadConfig from "@/utils/config";

const config = loadConfig();

const AccessControlTable = lazy(
  () => import("@/modules/access-control/table/AccessControlTable"),
);
export default function AccessControlPage() {
  const { t } = useLocale();
  const { permission } = usePermissions();

  const { data: policies, isLoading } = useFetchApi<Policy[]>("/policies");

  const { ref: headingRef, portalTarget } =
    usePortalElement<HTMLHeadingElement>();

  return (
    <PageContainer>
      <GroupsProvider>
        <div className={"p-default py-6"}>
          <Breadcrumbs>
            <Breadcrumbs.Item
              href={"/access-control"}
              label={t("nav.accessControl")}
              icon={<AccessControlIcon size={14} />}
            />
          </Breadcrumbs>
          <h1 ref={headingRef}>{t("page.accessControl.title")}</h1>
          <Paragraph>
            {t("page.accessControl.description")}{" "}
            <InlineLink href={config.docsUrl} target={"_blank"}>
              {t("common.learnMore")}
              <ExternalLinkIcon size={12} />
            </InlineLink>
          </Paragraph>
        </div>

        <RestrictedAccess
          page={"Access Control"}
          hasAccess={permission.policies.read}
        >
          <PoliciesProvider>
            <Suspense fallback={<SkeletonTable />}>
              <AccessControlTable
                isLoading={isLoading}
                policies={policies}
                headingTarget={portalTarget}
              />
            </Suspense>
          </PoliciesProvider>
        </RestrictedAccess>
      </GroupsProvider>
    </PageContainer>
  );
}
