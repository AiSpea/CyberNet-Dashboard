import { useOidc, useOidcUser } from "@axa-fr/react-oidc";
import Button from "@components/Button";
import Paragraph from "@components/Paragraph";
import loadConfig from "@utils/config";
import { ArrowRightIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
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
  const errorDescription = params.get("error_description")?.trim() ?? "";
  const normalizedDescription = errorDescription.toLowerCase();
  const accountLinked = normalizedDescription === "account linked successfully";
  const blocked =
    normalizedDescription.includes("blocked") ||
    normalizedDescription.includes("disabled");
  const pending = normalizedDescription.includes("pending approval");
  const { logout } = useOidc();

  const title = accountLinked
    ? t("auth.linkedTitle")
    : blocked
    ? t("auth.blockedTitle")
    : pending
    ? t("auth.pendingTitle")
    : accessDenied
    ? t("auth.accessDeniedTitle")
    : invalidRequest
    ? t("auth.invalidRequestTitle")
    : t("auth.problemTitle");

  const description = accountLinked
    ? t("auth.verifiedQuestion")
    : blocked
    ? t("auth.blockedDescription")
    : pending
    ? t("auth.pendingDescription")
    : accessDenied
    ? t("auth.accessDeniedDescription")
    : invalidRequest
    ? t("auth.invalidRequestDescription")
    : t("auth.problemDescription");

  const technicalDetails =
    errorDescription || String(oidcUserLoadingState || "").trim();

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

      <Paragraph className={"text-center mt-2 block"}>{description}</Paragraph>

      {technicalDetails && !accountLinked && (
        <details className="mt-4 max-w-md rounded-md border border-nb-gray-800 bg-nb-gray-930 px-4 py-3 text-sm text-nb-gray-300">
          <summary className="cursor-pointer select-none text-center">
            {t("auth.technicalDetails")}
          </summary>
          <code className="mt-2 block break-words text-xs">
            {technicalDetails}
          </code>
        </details>
      )}

      <Button
        variant={"primary"}
        size={"sm"}
        className={"mt-5"}
        onClick={() => logout("/", { client_id: config.clientId })}
      >
        {accountLinked ? t("common.continue") : t("auth.tryAgain")}
        <ArrowRightIcon size={16} />
      </Button>

      {!accountLinked && (
        <Button
          variant={"default-outline"}
          size={"sm"}
          className={"mt-3"}
          onClick={() => logout("/", { client_id: config.clientId })}
        >
          {t("common.logout")}
        </Button>
      )}
    </div>
  );
};
