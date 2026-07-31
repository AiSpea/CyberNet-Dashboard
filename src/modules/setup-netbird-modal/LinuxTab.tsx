import Button from "@components/Button";
import Code from "@components/Code";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import { GRPC_API_ORIGIN, pkgsDownloadUrl } from "@utils/netbird";
import { DownloadIcon, TerminalSquareIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import {
  NetBirdUpCommand,
  RoutingPeerSetupKeyInfo,
} from "@/modules/setup-netbird-modal/SetupModal";
import { useLocale } from "@/contexts/LocaleProvider";

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
  const managementStep = GRPC_API_ORIGIN ? 2 : 1;
  const keyStep = GRPC_API_ORIGIN ? 3 : 2;
  const runStep = keyStep + (setupKeyContent ? 1 : 0);

  return (
    <TabsContent value={String(OperatingSystem.LINUX)}>
      <TabsContentPadding>
        <p className="flex items-center gap-3 text-base font-medium">
          <TerminalSquareIcon size={16} />
          {t("install.linux")}
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>{t("install.downloadInstaller")}</p>
            <div className="mt-1 flex gap-4">
              <Link
                href={pkgsDownloadUrl("linux")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary">
                  <DownloadIcon size={14} />
                  {t("install.downloadCyberNet")}
                </Button>
              </Link>
            </div>
          </Steps.Step>

          {GRPC_API_ORIGIN && (
            <Steps.Step step={managementStep}>
              <p>{t("install.managementUrl")}</p>
              <Code>
                <Code.Line>{GRPC_API_ORIGIN}</Code.Line>
              </Code>
            </Steps.Step>
          )}

          {setupKeyContent && (
            <Steps.Step step={keyStep}>{setupKeyContent}</Steps.Step>
          )}

          <Steps.Step step={runStep} line={false}>
            <p>
              {t("install.openTerminal")}
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
