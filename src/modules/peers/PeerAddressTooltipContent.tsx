import CopyToClipboardText from "@components/CopyToClipboardText";
import { ListItem } from "@components/ListItem";
import { FlagIcon, GlobeIcon, MapPin, NetworkIcon } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { useCountries } from "@/contexts/CountryProvider";
import { useLocale } from "@/contexts/LocaleProvider";
import { Peer } from "@/interfaces/Peer";
import loadConfig from "@utils/config";

const config = loadConfig();

type Props = {
  peer: Peer;
};
export const PeerAddressTooltipContent = ({ peer }: Props) => {
  const { isLoading, getRegionByPeer } = useCountries();
  const { t } = useLocale();
  const productIp = t("peers.productIp", { product: config.productName });
  const productIpv6 = t("peers.productIpv6", {
    product: config.productName,
  });

  const countryText = useMemo(() => {
    return getRegionByPeer(peer);
  }, [getRegionByPeer, peer]);

  return (
    <div
      className={"text-xs flex flex-col"}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <ListItem
        icon={<MapPin size={14} />}
        label={productIp}
        value={
          <CopyToClipboardText
            iconAlignment={"right"}
            message={t("peers.ipCopied", { label: productIp })}
            alwaysShowIcon={true}
          >
            {peer.ip}
          </CopyToClipboardText>
        }
      />
      {peer.ipv6 && (
        <ListItem
          icon={<MapPin size={14} />}
          label={productIpv6}
          value={
            <CopyToClipboardText
              iconAlignment={"right"}
              message={t("peers.ipCopied", { label: productIpv6 })}
              alwaysShowIcon={true}
            >
              {peer.ipv6}
            </CopyToClipboardText>
          }
        />
      )}
      <ListItem
        icon={<NetworkIcon size={14} />}
        label={t("peers.publicIp")}
        value={
          <CopyToClipboardText
            iconAlignment={"right"}
            message={t("peers.ipCopied", { label: t("peers.publicIp") })}
            alwaysShowIcon={true}
          >
            {peer.connection_ip}
          </CopyToClipboardText>
        }
      />
      <ListItem
        icon={<GlobeIcon size={14} />}
        label={t("peers.domain")}
        className={
          peer?.extra_dns_labels && peer.extra_dns_labels.length > 0
            ? "items-start"
            : ""
        }
        value={
          <div className={"text-right flex flex-col gap-[6px]"}>
            <CopyToClipboardText
              iconAlignment={"right"}
              message={"DNS label has been copied to your clipboard"}
              className={"text-right justify-end"}
              alwaysShowIcon={true}
            >
              {peer.dns_label}
            </CopyToClipboardText>

            {peer?.extra_dns_labels?.map((label) => (
              <CopyToClipboardText
                key={label}
                className={"text-right justify-end"}
                iconAlignment={"right"}
                message={"DNS label has been copied to your clipboard"}
                alwaysShowIcon={true}
              >
                {label}
              </CopyToClipboardText>
            ))}
          </div>
        }
      />
      <ListItem
        icon={<FlagIcon size={14} />}
        label={"Region"}
        value={
          isLoading && !countryText ? (
            <Skeleton width={100} />
          ) : (
            <CopyToClipboardText
              iconAlignment={"right"}
              message={"Region has been copied to your clipboard"}
              alwaysShowIcon={true}
            >
              {countryText}
            </CopyToClipboardText>
          )
        }
      />
    </div>
  );
};
