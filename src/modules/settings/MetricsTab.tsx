import Breadcrumbs from "@components/Breadcrumbs";
import FancyToggleSwitch from "@components/FancyToggleSwitch";
import InlineLink from "@components/InlineLink";
import { notify } from "@components/Notification";
import Paragraph from "@components/Paragraph";
import * as Tabs from "@radix-ui/react-tabs";
import { useApiCall } from "@utils/api";
import loadConfig from "@utils/config";
import { ChartNoAxesCombined, ExternalLinkIcon } from "lucide-react";
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import { useLocale } from "@/contexts/LocaleProvider";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { Account } from "@/interfaces/Account";

type Props = {
  account: Account;
};

const config = loadConfig();

export default function MetricsTab({ account }: Readonly<Props>) {
  const { permission } = usePermissions();
  const { mutate } = useSWRConfig();
  const { t } = useLocale();
  const saveRequest = useApiCall<Account>("/accounts/" + account.id, true);

  const [metricsPushEnabled, setMetricsPushEnabled] = useState(
    account.settings?.metrics_push_enabled ?? false,
  );

  const toggleMetricsPush = async (toggle: boolean) => {
    notify({
      title: t("settings.metrics"),
      description: t(toggle ? "metrics.enabled" : "metrics.disabled"),
      promise: saveRequest
        .put({
          id: account.id,
          settings: {
            ...account.settings,
            metrics_push_enabled: toggle,
          },
        })
        .then(() => {
          setMetricsPushEnabled(toggle);
          mutate("/accounts");
        }),
      loadingMessage: t("metrics.updating"),
    });
  };

  return (
    <Tabs.Content value={"metrics"}>
      <div className={"p-default py-6 max-w-2xl"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/settings"}
            label={t("nav.settings")}
            icon={<SettingsIcon size={13} />}
          />
          <Breadcrumbs.Item
            href={"/settings?tab=metrics"}
            label={t("settings.metrics")}
            icon={<ChartNoAxesCombined size={14} />}
            active
          />
        </Breadcrumbs>
        <div>
          <h1>{t("settings.metrics")}</h1>
          <Paragraph>
            {t("metrics.description", { product: config.productName })}
          </Paragraph>
          <Paragraph>
            <InlineLink href={config.docsUrl} target={"_blank"}>
              {t("metrics.learnMore")}
              <ExternalLinkIcon size={12} />
            </InlineLink>
          </Paragraph>
        </div>

        <FancyToggleSwitch
          className={"mt-6"}
          value={metricsPushEnabled}
          onChange={toggleMetricsPush}
          label={
            <>
              <ChartNoAxesCombined size={15} />
              {t("metrics.share")}
            </>
          }
          helpText={t("metrics.shareHelp")}
          disabled={!permission.settings.update}
        />
      </div>
    </Tabs.Content>
  );
}
