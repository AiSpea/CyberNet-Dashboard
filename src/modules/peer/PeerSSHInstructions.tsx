import Button from "@components/Button";
import Code from "@components/Code";
import InlineLink from "@components/InlineLink";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
} from "@components/modal/Modal";
import ModalHeader from "@components/modal/ModalHeader";
import Paragraph from "@components/Paragraph";
import Separator from "@components/Separator";
import Steps from "@components/Steps";
import { SegmentedTabs } from "@components/SegmentedTabs";
import loadConfig from "@utils/config";
import { cn } from "@utils/helpers";
import {
  ExternalLinkIcon,
  MonitorSmartphoneIcon,
  PlusCircle,
  TerminalSquare,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleProvider";
import { Peer } from "@/interfaces/Peer";
import { PeerSSHPolicyModal } from "@/modules/peer/PeerSSHPolicyModal";

const config = loadConfig();

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  peer?: Peer;
};

export const PeerSSHInstructions = ({
  open,
  onOpenChange,
  onSuccess,
  peer,
}: Props) => {
  const [client, setClient] = useState("cli");
  const [policyModal, setPolicyModal] = useState(false);
  const { t } = useLocale();
  const productValues = { product: config.productName };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        maxWidthClass={cn("relative", "max-w-2xl")}
        showClose={true}
      >
        <ModalHeader
          icon={<TerminalSquare size={16} className={"text-netbird"} />}
          title={t("ssh.enableTitle")}
          description={t("ssh.enableDescription")}
          color={"netbird"}
        />

        <Separator />

        <div className={"px-8 py-3 flex flex-col gap-0 z-0 mt-1"}>
          <SegmentedTabs value={client} onChange={setClient}>
            <SegmentedTabs.List className={"rounded-lg border"}>
              <SegmentedTabs.Trigger value={"cli"}>
                <TerminalSquare size={16} />
                CLI
              </SegmentedTabs.Trigger>
              <SegmentedTabs.Trigger value={"gui"}>
                <MonitorSmartphoneIcon size={16} />
                Desktop Client
              </SegmentedTabs.Trigger>
            </SegmentedTabs.List>
          </SegmentedTabs>

          <Steps>
            {client === "cli" ? (
              <Steps.Step step={1}>
                <p className={"font-normal"}>
                  {t("ssh.cliInstruction", productValues)}
                </p>
                <Code codeToCopy={"netbird down"}>
                  <Code.Line>{`netbird down # if ${config.productName} is already running`}</Code.Line>
                </Code>
                <Code>
                  <Code.Line>{`netbird up --allow-server-ssh --enable-ssh-root`}</Code.Line>
                </Code>
              </Steps.Step>
            ) : (
              <Steps.Step step={1}>
                <p className={"font-normal"}>
                  {t("ssh.desktopInstruction", productValues)}
                </p>
              </Steps.Step>
            )}

            <Steps.Step step={2}>
              <p className={"font-normal"}>
                {t("ssh.policyRequirement", productValues)}
              </p>
              <div className={"mt-2"}>
                <Button
                  variant={"secondary"}
                  onClick={() => setPolicyModal(true)}
                >
                  <PlusCircle size={16} />
                  {t("ssh.createPolicy")}
                </Button>
              </div>
            </Steps.Step>
            <Steps.Step step={3} line={false}>
              <p className={"font-normal"}>{t("ssh.finishInstruction")}</p>
            </Steps.Step>
          </Steps>
        </div>

        <ModalFooter className={"items-center"}>
          <div className={"w-full"}>
            <Paragraph className={"text-sm mt-auto"}>
              <InlineLink href={config.docsUrl} target={"_blank"}>
                {t("ssh.learnMore")}
                <ExternalLinkIcon size={12} />
              </InlineLink>
            </Paragraph>
          </div>
          <div className={"flex gap-3 w-full justify-end"}>
            <ModalClose asChild={true}>
              <Button variant={"secondary"}>{t("common.cancel")}</Button>
            </ModalClose>

            <Button variant={"primary"} onClick={onSuccess}>
              {t("ssh.finishSetup")}
            </Button>
          </div>
        </ModalFooter>

        <PeerSSHPolicyModal
          open={policyModal}
          onOpenChange={setPolicyModal}
          peer={peer}
        />
      </ModalContent>
    </Modal>
  );
};
