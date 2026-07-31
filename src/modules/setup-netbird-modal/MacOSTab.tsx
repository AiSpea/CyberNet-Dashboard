import Button from "@components/Button";
import Code from "@components/Code";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import { GRPC_API_ORIGIN, pkgsDownloadUrl } from "@utils/netbird";
import { DownloadIcon, PackageOpenIcon } from "lucide-react";
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
export default function MacOSTab({
  setupKey,
  setupKeyContent,
  setupKeyPlaceholder,
  showSetupKeyInfo,
  hostname,
}: Readonly<Props>) {
  const { t } = useLocale();
  // Mirrors WindowsTab: server flow (setupKeyContent present) forces
  // the CLI run branch so the netbird up command stays visible while
  // the operator generates a key.
  const useCliRun = !!setupKey || !!setupKeyContent;
  const baseMgmtStep = 2;
  const keyStep = GRPC_API_ORIGIN ? 3 : 2;
  const runStep = keyStep + (setupKeyContent ? 1 : 0);
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
              <Link
                href={pkgsDownloadUrl("macos/universal")}
                passHref
                target={"_blank"}
              >
                <Button variant={"primary"}>
                  <DownloadIcon size={14} />
                  {t("install.downloadCyberNet")}
                </Button>
              </Link>
            </div>
          </Steps.Step>

          {GRPC_API_ORIGIN && (
            <Steps.Step step={baseMgmtStep}>
              <p>{t("install.managementUrl")}</p>
              <Code>
                <Code.Line>{GRPC_API_ORIGIN}</Code.Line>
              </Code>
            </Steps.Step>
          )}

          {setupKeyContent && (
            <Steps.Step step={keyStep}>{setupKeyContent}</Steps.Step>
          )}

          {useCliRun ? (
            <Steps.Step step={runStep} line={false}>
              <p>
                {t("install.openTerminal")}{" "}
                {showSetupKeyInfo && <RoutingPeerSetupKeyInfo />}
              </p>

              <NetBirdUpCommand
                setupKey={setupKey}
                setupKeyPlaceholder={setupKeyPlaceholder}
                hostname={hostname}
              />
            </Steps.Step>
          ) : (
            <>
              <Steps.Step step={runStep}>
                <p>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  {t("install.connectTray")}
                </p>
              </Steps.Step>
              <Steps.Step step={runStep + 1} line={false}>
                <p>{t("auth.signInAccount")}</p>
              </Steps.Step>
            </>
          )}
        </Steps>
      </TabsContentPadding>
    </TabsContent>
  );
}
