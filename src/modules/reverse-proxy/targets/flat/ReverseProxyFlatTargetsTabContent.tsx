import InlineLink from "@components/InlineLink";
import Paragraph from "@components/Paragraph";
import SkeletonTable, {
  SkeletonTableHeader,
} from "@components/skeletons/SkeletonTable";
import { ExternalLinkIcon } from "lucide-react";
import * as React from "react";
import { Suspense } from "react";
import loadConfig from "@utils/config";
import { useLocale } from "@/contexts/LocaleProvider";
import { ReverseProxyFlatTarget } from "@/interfaces/ReverseProxy";
import { ReverseProxyFlatTargetsTable } from "@/modules/reverse-proxy/targets/flat/ReverseProxyFlatTargetsTable";

const config = loadConfig();

type Props = {
  targets: ReverseProxyFlatTarget[];
  isLoading?: boolean;
  hideResourceColumn?: boolean;
  emptyTableTitle?: string;
  emptyTableDescription?: string;
};

export const ReverseProxyFlatTargetsTabContent = ({
  targets,
  isLoading,
  hideResourceColumn,
  emptyTableTitle = "This network has no services",
  emptyTableDescription,
}: Props) => {
  const { t } = useLocale();
  const description =
    emptyTableDescription ??
    t("reverseProxy.emptyResources", { product: config.productName });

  return (
    <div className={"pb-10 px-8"}>
      <div className={"flex justify-between items-center mb-5"}>
        <div>
          <Paragraph>
            {t("page.reverseProxy.description")}{" "}
            <InlineLink href={config.docsUrl} target={"_blank"}>
              {t("common.learnMore")}
              <ExternalLinkIcon size={12} />
            </InlineLink>
          </Paragraph>
        </div>
      </div>
      <Suspense
        fallback={
          <div>
            <SkeletonTableHeader className={"!p-0"} />
            <div className={"mt-8 w-full"}>
              <SkeletonTable withHeader={false} />
            </div>
          </div>
        }
      >
        <ReverseProxyFlatTargetsTable
          targets={targets}
          isLoading={isLoading}
          hideResourceColumn={hideResourceColumn}
          emptyTableTitle={emptyTableTitle}
          emptyTableDescription={description}
        />
      </Suspense>
    </div>
  );
};
