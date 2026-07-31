import { useOidc, useOidcUser } from "@axa-fr/react-oidc";
import Button from "@components/Button";
import Paragraph from "@components/Paragraph";
import loadConfig from "@utils/config";
import { ArrowRightIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import NetBirdIcon from "@/assets/icons/NetBirdIcon";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLocale } from "@/contexts/LocaleProvider";

const config = loadConfig();

export const OIDCError = () => {
  const { t } = useLocale();
  const { oidcUserLoadingState } = useOidcUser();
  const params = useSearchParams();
  const errorParam = params.get("error");
  const accessDenied = errorParam === "access_denied";
  const invalidRequest = errorParam === "invalid_request";
  const [title, setTitle] = useState(params.get("error_description"));
  const errorDescription = params.get("error_description");
  const { logout } = useOidc();

  useEffect(() => {
    if (accessDenied) {
      if (title === "account linked successfully") {
        setTitle(t("auth.linkedTitle"));
      }
    } else {
      setTitle(t("auth.problemTitle"));
    }
  }, [accessDenied, t, title]);

  return (
    <div
      className={
        "flex items-center justify-center flex-col h-screen max-w-lg mx-auto"
      }
    >
      <div className="absolute right-5 top-5">
        <LanguageSwitcher />
      </div>
      <div
        className={
          "bg-nb-gray-930 mb-3 border border-nb-gray-900 h-12 w-12 rounded-md flex items-center justify-center "
        }
      >
        <NetBirdIcon size={23} />
      </div>
      <h1 className={"text-center mt-2"}>{title}</h1>

      {accessDenied ? (
        <>
          <Paragraph className={"text-center mt-2"}>
            {t("auth.verifiedQuestion")}
          </Paragraph>

          <Button
            variant={"primary"}
            size={"sm"}
            className={"mt-5"}
            onClick={() => logout("/", { client_id: config.clientId })}
          >
            {t("common.continue")}
            <ArrowRightIcon size={16} />
          </Button>

          <Button
            variant={"default-outline"}
            size={"sm"}
            className={"mt-5"}
            onClick={() => logout("/", { client_id: config.clientId })}
          >
            {t("auth.tryAgain")}
          </Button>
        </>
      ) : (
        <>
          <Paragraph className={"text-center mt-2 block"}>
            {t("auth.errorPrefix")}{" "}
            <span className={"inline capitalize"}>
              {invalidRequest && errorDescription
                ? errorDescription
                : oidcUserLoadingState}
            </span>
          </Paragraph>
          <Button
            variant={"primary"}
            size={"sm"}
            className={"mt-5"}
            onClick={() => logout("/", { client_id: config.clientId })}
          >
            {t("common.logout")}
          </Button>
        </>
      )}
    </div>
  );
};
