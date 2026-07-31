import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import { LogInIcon, PackageOpenIcon, PlayCircleIcon } from "lucide-react";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import { useLocale } from "@/contexts/LocaleProvider";
import ClientDownloadAction from "@/modules/setup-netbird-modal/ClientDownloadAction";

type Props = {
  downloadUrl?: string;
  downloadLoading?: boolean;
};
export default function MacOSTab({
  downloadUrl,
  downloadLoading,
}: Readonly<Props>) {
  const { t } = useLocale();
  return (
    <TabsContent value={String(OperatingSystem.APPLE)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <PackageOpenIcon size={16} />
          {t("install.macos")}
        </p>
        <Steps>
          <Steps.Step step={1}>
            <div className={"flex items-center gap-1 text-sm font-light"}>
              {t("install.downloadInstaller")}
            </div>
            <div className={"flex gap-4 mt-1 flex-wrap"}>
              <ClientDownloadAction
                url={downloadUrl}
                loading={downloadLoading}
              />
            </div>
          </Steps.Step>

          <Steps.Step step={2}>
            <p className="flex items-center gap-2">
              <PlayCircleIcon size={16} className="text-netbird" />
              {t("install.desktopOpenAfterInstall")}
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
