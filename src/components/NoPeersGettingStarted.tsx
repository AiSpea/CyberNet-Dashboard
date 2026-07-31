import InlineLink from "@components/InlineLink";
import SquareIcon from "@components/SquareIcon";
import AddPeerDropdown from "@components/ui/AddPeerDropdown";
import GetStartedTest from "@components/ui/GetStartedTest";
import { ExternalLinkIcon } from "lucide-react";
import * as React from "react";
import PeerIcon from "@/assets/icons/PeerIcon";
import { useLocale } from "@/contexts/LocaleProvider";
import loadConfig from "@/utils/config";

const config = loadConfig();

type Props = {
  showBackground?: boolean;
};

export const NoPeersGettingStarted = ({
  showBackground = true,
}: Readonly<Props>) => {
  const { t } = useLocale();
  return (
    <GetStartedTest
      showBackground={showBackground}
      icon={
        <SquareIcon
          icon={<PeerIcon className={"fill-nb-gray-200"} size={20} />}
          color={"gray"}
          size={"large"}
        />
      }
      title={t("peers.getStartedTitle")}
      description={t("peers.getStartedDescription")}
      button={<AddPeerDropdown />}
      learnMore={
        <>
          {t("peers.learnMore")}{" "}
          <InlineLink href={config.docsUrl} target={"_blank"}>
            {t("peers.gettingStartedGuide")}
            <ExternalLinkIcon size={12} />
          </InlineLink>
        </>
      }
    />
  );
};
