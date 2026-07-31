import Code from "@components/Code";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import { GRPC_API_ORIGIN } from "@utils/netbird";
import { DownloadIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import Button from "@components/Button";
import loadConfig from "@/utils/config";
import { useLocale } from "@/contexts/LocaleProvider";

const config = loadConfig();

export default function AndroidTab() {
  const { t } = useLocale();
  return (
    <TabsContent value={String(OperatingSystem.ANDROID)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <ShoppingBagIcon size={16} />
          {t("install.android")}
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>{t("install.mobileBuild")}</p>
            <div className={"flex gap-4 mt-1"}>
              <Link href={config.androidDownloadUrl} target={"_blank"}>
                <Button variant="primary">
                  <DownloadIcon size={14} />
                  {t("install.downloadCyberNet")}
                </Button>
              </Link>
            </div>
          </Steps.Step>
          {GRPC_API_ORIGIN && (
            <Steps.Step step={2}>
              <p>{t("install.changeServer")}</p>
              <Code>
                <Code.Line>{GRPC_API_ORIGIN}</Code.Line>
              </Code>
            </Steps.Step>
          )}

          <Steps.Step step={GRPC_API_ORIGIN ? 3 : 2}>
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              {t("install.connectButton")}
            </p>
          </Steps.Step>
          <Steps.Step step={GRPC_API_ORIGIN ? 4 : 3} line={false}>
            <p>{t("auth.signInAccount")}</p>
          </Steps.Step>
        </Steps>
      </TabsContentPadding>
    </TabsContent>
  );
}
