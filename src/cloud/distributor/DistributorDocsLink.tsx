import InlineLink from "@components/InlineLink";
import loadConfig from "@utils/config";
import { ExternalLinkIcon } from "lucide-react";
import * as React from "react";

const config = loadConfig();

export const DistributorDocsLink = () => {
  return (
    <>
      Learn more about
      <InlineLink
        href={`${config.docsUrl}/manage/for-partners/distributor-portal`}
        target={"_blank"}
      >
        Customers
        <ExternalLinkIcon size={12} />
      </InlineLink>
    </>
  );
};
