import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import { LogInIcon, PlayCircleIcon, ShoppingBagIcon } from "lucide-react";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import { useLocale } from "@/contexts/LocaleProvider";
import ClientDownloadAction from "@/modules/setup-netbird-modal/ClientDownloadAction";

type Props = {
  downloadUrl?: string;
  downloadLoading?: boolean;
};

export default function IOSTab({
  downloadUrl,
  downloadLoading,
}: Readonly<Props>) {
  const { t } = useLocale();
  return (
    <TabsContent value={String(OperatingSystem.IOS)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <ShoppingBagIcon size={16} />
          {t("install.ios")}
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>{t("install.iosDownloadDescription")}</p>
            <div className={"flex gap-4 mt-1 flex-wrap"}>
              <ClientDownloadAction
                url={downloadUrl}
                loading={downloadLoading}
                label={t("install.openTestFlight")}
              />
            </div>
          </Steps.Step>
          <Steps.Step step={2}>
            <p className="flex items-center gap-2">
              <PlayCircleIcon size={16} className="text-netbird" />
              {t("install.mobileOpenAfterInstall")}
            </p>
          </Steps.Step>
          <Steps.Step step={3} line={false}>
            <p className="flex items-center gap-2">
              <LogInIcon size={16} className="text-netbird" />
              {t("install.signInAndConnect")}
            </p>
          </Steps.Step>
        </Steps>
      </TabsContentPadding>
    </TabsContent>
  );
}
