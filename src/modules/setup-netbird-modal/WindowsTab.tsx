import { Callout } from "@components/Callout";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import {
  AlertTriangleIcon,
  LogInIcon,
  PackageOpenIcon,
  PlayCircleIcon,
} from "lucide-react";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import { useLocale } from "@/contexts/LocaleProvider";
import ClientDownloadAction from "@/modules/setup-netbird-modal/ClientDownloadAction";

type Props = {
  downloadUrl?: string;
  downloadLoading?: boolean;
};

export default function WindowsTab({
  downloadUrl,
  downloadLoading,
}: Readonly<Props>) {
  const { t } = useLocale();
  return (
    <TabsContent value={String(OperatingSystem.WINDOWS)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <PackageOpenIcon size={16} />
          {t("install.windows")}
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>{t("install.downloadInstaller")}</p>
            <div className={"flex gap-4 mt-1 flex-wrap"}>
              <ClientDownloadAction
                url={downloadUrl}
                loading={downloadLoading}
              />
            </div>
            {downloadUrl?.includes("unsigned-beta") && (
              <Callout
                variant="warning"
                icon={
                  <AlertTriangleIcon size={15} className="mt-0.5 shrink-0" />
                }
                className="mt-3 max-w-xl"
              >
                {t("install.windowsUnsignedWarning")}
              </Callout>
            )}
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
