"use client";

import Breadcrumbs from "@components/Breadcrumbs";
import InlineLink from "@components/InlineLink";
import Paragraph from "@components/Paragraph";
import SkeletonTable from "@components/skeletons/SkeletonTable";
import { RestrictedAccess } from "@components/ui/RestrictedAccess";
import { usePortalElement } from "@hooks/usePortalElement";
import { IconSettings2 } from "@tabler/icons-react";
import useFetchApi from "@utils/api";
import { ExternalLinkIcon } from "lucide-react";
import React, { lazy, Suspense } from "react";
import TeamIcon from "@/assets/icons/TeamIcon";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { User } from "@/interfaces/User";
import PageContainer from "@/layouts/PageContainer";
import { useLocale } from "@/contexts/LocaleProvider";
import loadConfig from "@/utils/config";

const config = loadConfig();

const ServiceUsersTable = lazy(
  () => import("@/modules/users/ServiceUsersTable"),
);

export default function ServiceUsers() {
  const { t } = useLocale();
  const { permission } = usePermissions();
  const { data: users, isLoading } = useFetchApi<User[]>(
    "/users?service_user=true",
  );

  const { ref: headingRef, portalTarget } =
    usePortalElement<HTMLHeadingElement>();

  return (
    <PageContainer>
      <div className={"p-default py-6"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/team"}
            label={t("nav.team")}
            icon={<TeamIcon size={13} />}
          />
          <Breadcrumbs.Item
            href={"/team/service-users"}
            label={t("nav.serviceUsers")}
            active
            icon={<IconSettings2 size={17} />}
          />
        </Breadcrumbs>
        <h1 ref={headingRef}>{t("nav.serviceUsers")}</h1>
        <Paragraph>
          {t("page.serviceUsers.description")}{" "}
          <InlineLink href={config.docsUrl} target={"_blank"}>
            {t("common.learnMore")}
            <ExternalLinkIcon size={12} />
          </InlineLink>
        </Paragraph>
      </div>
      <RestrictedAccess
        page={"Service Users"}
        hasAccess={permission.users.read}
      >
        <Suspense fallback={<SkeletonTable />}>
          <ServiceUsersTable
            users={users}
            isLoading={isLoading}
            headingTarget={portalTarget}
          />
        </Suspense>
      </RestrictedAccess>
    </PageContainer>
  );
}
