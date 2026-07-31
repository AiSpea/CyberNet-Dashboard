"use client";

import { useOidc } from "@axa-fr/react-oidc";
import Button from "@components/Button";
import Paragraph from "@components/Paragraph";
import loadConfig from "@utils/config";
import { ArrowRightIcon, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NetBirdIcon from "@/assets/icons/NetBirdIcon";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLocale } from "@/contexts/LocaleProvider";

const config = loadConfig();

export default function ErrorPage() {
  const { t } = useLocale();
  const { logout, isAuthenticated } = useOidc();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<{
    code: number;
    message: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    // Get error details from URL params
    const code = searchParams.get("code");
    const message = searchParams.get("message");
    const type = searchParams.get("type");

    if (code && message) {
      setError({
        code: parseInt(code),
        message: decodeURIComponent(message),
        type: type || "error",
      });
    }
  }, [searchParams]);

  const handleLogout = () => {
    // Use the same logout pattern as OIDCError
    logout("/", { client_id: config.clientId });
  };

  const handleRetry = () => {
    router.push("/");
  };

  if (!isAuthenticated) {
    // If not authenticated, redirect to home
    router.push("/");
    return null;
  }

  const isBlockedUser =
    error?.code === 403 && error?.message?.toLowerCase().includes("blocked");
  const isPendingApproval =
    error?.code === 403 &&
    error?.message?.toLowerCase().includes("pending approval");

  const getTitle = () => {
    if (isBlockedUser) return t("auth.blockedTitle");
    if (isPendingApproval) return t("auth.pendingTitle");
    return t("auth.accessErrorTitle");
  };

  const getDescription = () => {
    if (isBlockedUser) {
      return t("auth.blockedDescription");
    }
    if (isPendingApproval) {
      return t("auth.pendingDescription");
    }
    return t("auth.accessErrorDescription");
  };

  return (
    <div className="flex items-center justify-center flex-col h-screen max-w-xl mx-auto">
      <div className="absolute right-5 top-5">
        <LanguageSwitcher />
      </div>
      <div className="bg-nb-gray-930 mb-3 border border-nb-gray-900 h-12 w-12 rounded-md flex items-center justify-center">
        <NetBirdIcon size={23} />
      </div>

      <h1 className="text-center mt-2">{getTitle()}</h1>

      <Paragraph className="text-center mt-2 block">
        {getDescription()}
      </Paragraph>

      {error && (
        <div className="bg-nb-gray-930 border border-nb-gray-800 rounded-md p-4 mt-4 max-w-md font-mono mb-2">
          <div className="text-center text-sm text-netbird">
            <div>response_message: {error.message}</div>
          </div>
        </div>
      )}

      <Paragraph className="text-center mt-2 text-sm">
        {t("auth.contactAdmin")}
      </Paragraph>

      <div className="mt-5 space-y-3">
        {!isBlockedUser && !isPendingApproval && (
          <Button variant="default-outline" size="sm" onClick={handleRetry}>
            <RefreshCw size={16} className="mr-2" />
            {t("common.retry")}
          </Button>
        )}

        <Button variant="primary" size="sm" onClick={handleLogout}>
          {t("common.logout")}
          <ArrowRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
