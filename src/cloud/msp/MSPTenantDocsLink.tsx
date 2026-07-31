import InlineLink from "@components/InlineLink";
import loadConfig from "@utils/config";
import { ExternalLinkIcon } from "lucide-react";
import * as React from "react";

const config = loadConfig();

export const MSPTenantDocsLink = () => {
  return (
    <>
      Learn more about
      <InlineLink
        href={`${config.docsUrl}/how-to/msp-portal`}
        target={"_blank"}
      >
        MSP Portal
        <ExternalLinkIcon size={12} />
      </InlineLink>
    </>
  );
};
