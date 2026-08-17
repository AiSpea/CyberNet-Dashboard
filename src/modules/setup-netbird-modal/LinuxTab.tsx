import Code from "@components/Code";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import { TerminalSquareIcon } from "lucide-react";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import {
  NetBirdUpCommand,
  RoutingPeerSetupKeyInfo,
} from "@/modules/setup-netbird-modal/SetupModal";
import { useLocale } from "@/contexts/LocaleProvider";
import { getLinuxPackageInstallCommand } from "@/utils/linuxInstaller";

type Props = {
  setupKey?: string;
  setupKeyContent?: React.ReactNode;
  setupKeyPlaceholder?: string;
  showSetupKeyInfo?: boolean;
  hostname?: string;
};

export default function LinuxTab({
  setupKey,
  setupKeyContent,
  setupKeyPlaceholder,
  showSetupKeyInfo = false,
  hostname,
}: Readonly<Props>) {
  const { t } = useLocale();
  const keyStep = 2;
  const runStep = keyStep + (setupKeyContent ? 1 : 0);
  const installCommand = getLinuxPackageInstallCommand();

  return (
    <TabsContent value={String(OperatingSystem.LINUX)}>
      <TabsContentPadding>
        <p className="flex items-center gap-3 text-base font-medium">
          <TerminalSquareIcon size={16} />
          {t("install.linux")}
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>{t("install.linuxScriptDescription")}</p>
            <Code codeToCopy={installCommand}>
              <Code.Line>{installCommand}</Code.Line>
            </Code>
          </Steps.Step>

          {setupKeyContent && (
            <Steps.Step step={keyStep}>{setupKeyContent}</Steps.Step>
          )}

          <Steps.Step step={runStep} line={false}>
            <p>
              {setupKey || setupKeyContent
                ? t("install.linuxRunServer")
                : t("install.linuxRunAndSignIn")}
              {showSetupKeyInfo && <RoutingPeerSetupKeyInfo />}
            </p>
            <NetBirdUpCommand
              setupKey={setupKey}
              setupKeyPlaceholder={setupKeyPlaceholder}
              hostname={hostname}
            />
          </Steps.Step>
        </Steps>
      </TabsContentPadding>
    </TabsContent>
  );
}
