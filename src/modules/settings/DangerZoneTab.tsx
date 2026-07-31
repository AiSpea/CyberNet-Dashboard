import Breadcrumbs from "@components/Breadcrumbs";
import Button from "@components/Button";
import Card from "@components/Card";
import { notify } from "@components/Notification";
import * as Tabs from "@radix-ui/react-tabs";
import { useApiCall } from "@utils/api";
import loadConfig from "@utils/config";
import { AlertOctagonIcon } from "lucide-react";
import React from "react";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import { useAuthService } from "@/cloud/cloud-hooks/useAuthService";
import { useDialog } from "@/contexts/DialogProvider";
import { useLocale } from "@/contexts/LocaleProvider";
import { useLoggedInUser } from "@/contexts/UsersProvider";
import { Account } from "@/interfaces/Account";

type Props = {
  account: Account;
};

const config = loadConfig();

export default function DangerZoneTab({ account }: Props) {
  const { deleteAccount: deleteAuthServiceData } = useAuthService();
  const { confirm } = useDialog();
  const { t } = useLocale();
  const deleteRequest = useApiCall<Account>("/accounts/" + account.id);
  const { logout } = useLoggedInUser();
  const productValues = { product: config.productName };

  const deleteAccount = async () => {
    const deletePromise = new Promise<void>((resolve, reject) => {
      deleteAuthServiceData().finally(async () => {
        return deleteRequest
          .del()
          .catch((error) => reject(error))
          .then(() => {
            // Clear browser storage after account deletion
            if (typeof window !== "undefined") {
              localStorage.clear();
              sessionStorage.clear();
              // Optionally, clear cookies if needed
              // document.cookie = ... (set cookies to expire)
            }
            logout().then();
            resolve();
          });
      });
    });

    notify({
      title: t("danger.deleteTitle", productValues),
      description: t("danger.deleted", productValues),
      promise: deletePromise,
      loadingMessage: t("danger.deleting"),
    });
  };

  const handleConfirm = async () => {
    const choice = await confirm({
      title: t("danger.deleteTitle", productValues),
      description: t("danger.confirm", productValues),
      confirmText: t("danger.deleteAccount"),
      cancelText: t("common.cancel"),
      type: "danger",
    });
    if (!choice) return;
    deleteAccount().then();
  };

  return (
    <Tabs.Content value={"danger-zone"}>
      <div className={"p-default py-6"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/settings"}
            label={t("nav.settings")}
            icon={<SettingsIcon size={13} />}
          />
          <Breadcrumbs.Item
            href={"/settings"}
            label={t("settings.dangerZone")}
            icon={<AlertOctagonIcon size={14} />}
            active
          />
        </Breadcrumbs>
        <h1>{t("settings.dangerZone")}</h1>
        <div className={"gap-6 mt-6 max-w-lg"}>
          <Card
            className={
              "w-full flex flex-col gap-2 border-red-600 bg-red-950/50"
            }
          >
            <div className={"px-8 py-6"}>
              <p className={"text-xl font-medium mb-2 !text-red-50"}>
                {t("danger.deleteTitle", productValues)}
              </p>
              <p className={"!text-red-50/80"}>
                {t("danger.description", productValues)}
              </p>
              <div className={"mt-6"}>
                <Button variant={"danger"} onClick={handleConfirm} size={"xs"}>
                  {t("danger.deleteAccount")}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Tabs.Content>
  );
}
