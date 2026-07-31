import { useOidcUser } from "@axa-fr/react-oidc";
import Button from "@components/Button";
import loadConfig from "@utils/config";
import { ArrowRightIcon, BookOpenIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useLocale } from "@/contexts/LocaleProvider";

const config = loadConfig();

type Props = {
  onFinish?: () => void;
};

export const OnboardingEnd = ({ onFinish }: Props) => {
  const { oidcUser: user } = useOidcUser();
  const { t } = useLocale();
  const name = user?.given_name || user?.name || user?.preferred_username;

  const title = name
    ? t("onboarding.congratulations", { name })
    : t("onboarding.congratulationsGeneric");

  return (
    <div className={"relative flex flex-col h-full justify-between"}>
      <div>
        <h1 className={"text-xl text-center max-w-sm mx-auto"}>
          {title} <br />
          {t("onboarding.complete")}
        </h1>
        <div
          className={
            "text-sm text-nb-gray-300 font-light mt-2 block text-center sm:px-4"
          }
        >
          {t("onboarding.next", { product: config.productName })}
        </div>

        <div className={"mt-8 flex flex-col gap-8"}>
          <Guide
            title={t("onboarding.accessTitle")}
            description={t("onboarding.accessDescription")}
            href={config.docsUrl}
          />
          <Guide
            title={t("onboarding.identityTitle")}
            description={t("onboarding.identityDescription")}
            href={config.docsUrl}
          />
          <Guide
            title={t("onboarding.architectureTitle", {
              product: config.productName,
            })}
            description={t("onboarding.architectureDescription", {
              product: config.productName,
            })}
            href={config.docsUrl}
          />
        </div>

        <div className={"mt-10 flex items-center justify-center"}>
          <Button variant={"secondaryLighter"} onClick={onFinish}>
            {t("onboarding.goDashboard")}
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

type GuideProps = {
  title?: string;
  description?: string;
  href?: string;
};

const Guide = ({ title = "", description = "", href = "#" }: GuideProps) => {
  return (
    <Link
      className={
        "flex gap-4 items-start rounded-lg border border-nb-gray-900 bg-nb-gray-920 p-4 transition-colors hover:bg-nb-gray-900"
      }
      target={"_blank"}
      href={href}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-nb-gray-900 text-netbird">
        <BookOpenIcon size={17} />
      </span>
      <div>
        <div className={"text-md"}>{title}</div>
        <div
          className={"text-[0.8rem] text-nb-gray-300 font-light mt-1.5 block"}
        >
          {description}
        </div>
      </div>
    </Link>
  );
};
