"use client";

import Breadcrumbs from "@components/Breadcrumbs";
import InlineLink from "@components/InlineLink";
import Paragraph from "@components/Paragraph";
import SkeletonTable from "@components/skeletons/SkeletonTable";
import { RestrictedAccess } from "@components/ui/RestrictedAccess";
import { usePortalElement } from "@hooks/usePortalElement";
import { ExternalLinkIcon } from "lucide-react";
import React, { lazy, Suspense } from "react";
import ReverseProxyIcon from "@/assets/icons/ReverseProxyIcon";
import { usePermissions } from "@/contexts/PermissionsProvider";
import ReverseProxiesProvider from "@/contexts/ReverseProxiesProvider";
import PageContainer from "@/layouts/PageContainer";
import { Callout } from "@components/Callout";
import { isNetBirdCloud } from "@utils/netbird";
import { useLocale } from "@/contexts/LocaleProvider";
import loadConfig from "@/utils/config";

const config = loadConfig();

const ReverseProxyTable = lazy(
  () => import("@/modules/reverse-proxy/table/ReverseProxyTable"),
);

export default function ReverseProxyServicesPage() {
  const { t } = useLocale();
  const { permission } = usePermissions();

  const { ref: headingRef, portalTarget } =
    usePortalElement<HTMLHeadingElement>();

  return (
    <PageContainer>
      <div className={"p-default py-6"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/reverse-proxy/services"}
            label={t("nav.reverseProxy")}
            icon={<ReverseProxyIcon size={16} />}
          />
          <Breadcrumbs.Item
            href={"/reverse-proxy/services"}
            label={t("nav.services")}
            active={true}
          />
        </Breadcrumbs>
        <h1 ref={headingRef}>{t("nav.services")}</h1>
        <Paragraph>
          {t("page.reverseProxy.description")}{" "}
          <InlineLink href={config.docsUrl} target={"_blank"}>
            {t("common.learnMore")}
            <ExternalLinkIcon size={12} />
          </InlineLink>
        </Paragraph>

        {isNetBirdCloud() ? (
          <Callout className={"max-w-xl mt-5"} variant={"info"}>
            {t("page.reverseProxy.beta")}
          </Callout>
        ) : (
          <Callout className={"max-w-xl mt-5"} variant={"info"}>
            {t("page.reverseProxy.beta")}
          </Callout>
        )}
      </div>

      <RestrictedAccess
        page={"Services"}
        hasAccess={permission?.services?.read}
      >
        <ReverseProxiesProvider>
          <Suspense fallback={<SkeletonTable />}>
            <ReverseProxyTable headingTarget={portalTarget} />
          </Suspense>
        </ReverseProxiesProvider>
      </RestrictedAccess>
    </PageContainer>
  );
}
