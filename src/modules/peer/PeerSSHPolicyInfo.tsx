import { Callout } from "@components/Callout";
import { InlineButtonLink } from "@components/InlineLink";
import { cn } from "@utils/helpers";
import * as React from "react";
import { useState } from "react";
import { Peer } from "@/interfaces/Peer";
import { PeerSSHPolicyModal } from "@/modules/peer/PeerSSHPolicyModal";
import { usePeerSSHPolicyCheck } from "@/modules/peer/usePeerSSHPolicyCheck";
import loadConfig from "@utils/config";
import { useLocale } from "@/contexts/LocaleProvider";

const config = loadConfig();

type Props = {
  peer?: Peer;
  className?: string;
};

export const PeerSSHPolicyInfo = ({ peer, className }: Props) => {
  const { t } = useLocale();
  const { showSSHPolicyInfo } = usePeerSSHPolicyCheck(peer);
  const [policyModal, setPolicyModal] = useState(false);
  return (
    showSSHPolicyInfo && (
      <>
        <Callout className={cn("max-w-xl", className)} variant={"warning"}>
          <span>
            {t("ssh.policyRequirement", {
              product: config.productName,
            })}{" "}
            <InlineButtonLink onClick={() => setPolicyModal(true)}>
              {t("ssh.createPolicy")}
            </InlineButtonLink>
          </span>
        </Callout>
        <PeerSSHPolicyModal
          open={policyModal}
          onOpenChange={setPolicyModal}
          peer={peer}
        />
      </>
    )
  );
};
