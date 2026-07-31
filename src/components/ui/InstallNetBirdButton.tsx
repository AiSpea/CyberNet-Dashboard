import Button from "@components/Button";
import { Modal, ModalTrigger } from "@components/modal/Modal";
import { DownloadIcon } from "lucide-react";
import React, { useState } from "react";
import SetupModal from "@/modules/setup-netbird-modal/SetupModal";
import { useLocale } from "@/contexts/LocaleProvider";

export function InstallNetBirdButton() {
  const [installModal, setInstallModal] = useState(false);
  const { t } = useLocale();

  return (
    <Modal open={installModal} onOpenChange={setInstallModal}>
      <ModalTrigger asChild>
        <Button variant={"secondary"} size={"sm"}>
          <DownloadIcon size={16} />
          {t("install.button")}
        </Button>
      </ModalTrigger>
      <SetupModal />
    </Modal>
  );
}
