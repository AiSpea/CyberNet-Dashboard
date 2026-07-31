import Button from "@components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/DropdownMenu";
import FullTooltip from "@components/FullTooltip";
import { notify } from "@components/Notification";
import { getOperatingSystem } from "@hooks/useOperatingSystem";
import { IconInfoCircle } from "@tabler/icons-react";
import loadConfig from "@utils/config";
import {
  CheckCircle2,
  ExternalLinkIcon,
  MonitorIcon,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
  TerminalSquare,
  TimerResetIcon,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useSWRConfig } from "swr";
import { useBypass, useBypassedPeers } from "@/cloud/edr/useBypass";
import { usePeer } from "@/contexts/PeerProvider";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { useLocale } from "@/contexts/LocaleProvider";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import { ExitNodeDropdownButton } from "@/modules/exit-node/ExitNodeDropdownButton";
import { useIntegrations } from "@/modules/integrations/edr/useIntegrations";
import { RDPButton } from "@/modules/remote-access/rdp/RDPButton";
import { SSHButton } from "@/modules/remote-access/ssh/SSHButton";
import InlineLink from "@components/InlineLink";
import { useDialog } from "@/contexts/DialogProvider";

const config = loadConfig();

export default function PeerActionCell() {
  const { t } = useLocale();
  const { peer, deletePeer, update, toggleSSH, setSSHInstructionsModal } =
    usePeer();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { permission } = usePermissions();
  const { confirm } = useDialog();

  // Approval / EDR-bypass state. We pull this directly so the action
  // menu can offer Approve / Bypass / Revoke without the inline badges
  // that used to live in PeerStatusCell.
  const { isAnyIntegrationEnabled, activeIntegrationName } = useIntegrations();
  const { bypassCompliance, revokeBypass, canBypass } = useBypass();
  const { isBypassed: checkBypassed } = useBypassedPeers();
  const isBypassed = peer.id ? checkBypassed(peer.id) : false;
  const canApprove = permission.peers.update;
  const needsApproval = peer.approval_required;

  const approvePeer = async () => {
    const choice = await confirm({
      title: t("peerAction.approveTitle", { name: peer.name }),
      description: t("peerAction.approveDescription"),
      confirmText: t("peerAction.approve"),
      cancelText: t("common.cancel"),
      type: "default",
    });
    if (!choice) return;
    notify({
      title: t("peerAction.approvedTitle", { name: peer.name }),
      description: t("peerAction.approvedDescription"),
      promise: update({
        name: peer.name,
        ssh: peer.ssh_enabled,
        loginExpiration: peer.login_expiration_enabled,
        approval_required: false,
      }).then(() => {
        mutate("/peers");
        mutate("/groups");
      }),
      loadingMessage: t("peerAction.approving"),
    });
  };

  const handleBypassCompliance = async () => {
    const choice = await confirm({
      title: t("peerAction.bypassTitle", { name: peer.name }),
      description: t("peerAction.bypassDescription"),
      confirmText: t("peerAction.bypass"),
      cancelText: t("common.cancel"),
      type: "warning",
    });
    if (!choice || !peer.id) return;
    notify({
      title: t("peerAction.bypassedTitle", { name: peer.name }),
      description: t("peerAction.canConnect"),
      promise: bypassCompliance(peer.id),
      loadingMessage: t("peerAction.bypassing"),
    });
  };

  const handleRevokeBypass = async () => {
    const choice = await confirm({
      title: t("peerAction.revokeTitle", { name: peer.name }),
      description: t("peerAction.revokeDescription"),
      confirmText: t("peerAction.revoke"),
      cancelText: t("common.cancel"),
      type: "warning",
    });
    if (!choice || !peer.id) return;
    notify({
      title: t("peerAction.revokedTitle"),
      description: t("peerAction.revokedDescription", { name: peer.name }),
      promise: revokeBypass(peer.id),
      loadingMessage: t("peerAction.revoking"),
    });
  };

  // Which approval items to show:
  //   • Approve  — pending approval AND no EDR integration is on
  //   • Bypass   — pending approval AND EDR is on AND user can bypass
  //   • Revoke   — currently bypassed AND user can revoke
  const showApprove = needsApproval && !isAnyIntegrationEnabled && canApprove;
  const showBypass =
    needsApproval && isAnyIntegrationEnabled && canBypass && !isBypassed;
  const showRevokeBypass = isBypassed && canBypass;
  const showApprovalGroup = showApprove || showBypass || showRevokeBypass;

  const showSSHButton = useMemo(() => {
    const isClientSSHEnabled = peer?.local_flags?.server_ssh_allowed;
    const isDashboardSSHEnabled = peer?.ssh_enabled;
    if (isDashboardSSHEnabled) return true;
    return !isClientSSHEnabled;
  }, [peer]);

  // The Connect column previously hosted SSH / RDP entry points. We
  // fold those into the action menu — gated on a non-mobile, online
  // peer — so the table loses a column and the connect affordance is
  // one click away inside the three-dot menu.
  const peerOs = getOperatingSystem(peer?.os);
  const isMobile =
    peerOs === OperatingSystem.ANDROID || peerOs === OperatingSystem.IOS;
  const showRemoteAccessItems = !isMobile && !!peer.connected;

  const toggleLoginExpiration = async () => {
    const disableLoginExpiration = peer.login_expiration_enabled;
    notify({
      title: t(
        disableLoginExpiration
          ? "peerAction.sessionDisabledTitle"
          : "peerAction.sessionEnabledTitle",
      ),
      description: t(
        disableLoginExpiration
          ? "peerAction.sessionDisabledDescription"
          : "peerAction.sessionEnabledDescription",
        { name: peer.name },
      ),
      promise: update({
        loginExpiration: !peer.login_expiration_enabled,
        inactivityExpiration: disableLoginExpiration
          ? false
          : peer.inactivity_expiration_enabled,
      }).then(() => {
        mutate("/peers");
        mutate("/groups");
      }),
      loadingMessage: t("peerAction.sessionUpdating"),
    });
  };

  const disableDashboardSSH = async () => {
    const choice = await confirm({
      title: t("peerAction.disableSshTitle"),
      description: (
        <div>
          {t("peerAction.disableSshDescription", {
            product: config.productName,
          })}{" "}
          <InlineLink
            href={`${config.docsUrl}/manage/peers/ssh`}
            target={"_blank"}
            onClick={(e) => e.stopPropagation()}
          >
            {t("common.learnMore")}
            <ExternalLinkIcon size={12} />
          </InlineLink>
        </div>
      ),
      confirmText: t("peerAction.disable"),
      cancelText: t("common.cancel"),
      type: "warning",
      maxWidthClass: "max-w-xl",
    });
    if (!choice) return;
    toggleSSH(false);
  };

  return (
    <div className={"flex justify-end pr-4 gap-3"}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          asChild={true}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Button variant={"secondary"} className={"!px-3"}>
            <MoreVertical size={16} className={"shrink-0"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto" align="end">
          <DropdownMenuItem
            onClick={() => router.push("/peer?id=" + peer.id)}
            disabled={!permission.peers.read}
          >
            <div className={"flex gap-3 items-center"}>
              <MonitorIcon size={14} className={"shrink-0"} />
              {t("peerAction.viewDetails")}
            </div>
          </DropdownMenuItem>

          {showApprovalGroup && (
            <>
              <DropdownMenuSeparator />
              {showApprove && (
                <DropdownMenuItem onClick={approvePeer}>
                  <div className={"flex gap-3 items-center"}>
                    <CheckCircle2 size={14} className={"shrink-0"} />
                    {t("peerAction.approve")}
                  </div>
                </DropdownMenuItem>
              )}
              {showBypass && (
                <FullTooltip
                  className={"w-full block"}
                  content={
                    <div className={"text-xs max-w-xs"}>
                      {t("peerAction.bypassTooltip", {
                        integration: activeIntegrationName ?? "",
                      })}
                    </div>
                  }
                >
                  <DropdownMenuItem onClick={handleBypassCompliance}>
                    <div className={"flex gap-3 items-center w-full"}>
                      <ShieldCheck size={14} className={"shrink-0"} />
                      {t("peerAction.bypass")}
                    </div>
                  </DropdownMenuItem>
                </FullTooltip>
              )}
              {showRevokeBypass && (
                <DropdownMenuItem onClick={handleRevokeBypass}>
                  <div className={"flex gap-3 items-center"}>
                    <ShieldOff size={14} className={"shrink-0"} />
                    {t("peerAction.revokeBypass")}
                  </div>
                </DropdownMenuItem>
              )}
            </>
          )}

          {showRemoteAccessItems && (
            <>
              <DropdownMenuSeparator />
              <SSHButton peer={peer} isDropdown={true} />
              <RDPButton peer={peer} isDropdown={true} />
            </>
          )}

          <DropdownMenuSeparator />
          <FullTooltip
            content={
              <div
                className={"flex gap-2 items-center !text-nb-gray-300 text-xs"}
              >
                <IconInfoCircle size={14} />
                <span>{t("peerAction.setupKeyExpirationInfo")}</span>
              </div>
            }
            className={"w-full block"}
            disabled={!!peer.user_id}
          >
            <DropdownMenuItem
              onClick={toggleLoginExpiration}
              disabled={!peer.user_id || !permission.peers.update}
            >
              <div className={"flex gap-3 items-center w-full"}>
                <TimerResetIcon size={14} className={"shrink-0"} />
                {t(
                  peer.login_expiration_enabled
                    ? "peerAction.disableSessionExpiration"
                    : "peerAction.enableSessionExpiration",
                )}
              </div>
            </DropdownMenuItem>
          </FullTooltip>

          {showSSHButton && (
            <DropdownMenuItem
              onClick={() =>
                peer.ssh_enabled
                  ? disableDashboardSSH()
                  : setSSHInstructionsModal(true)
              }
              disabled={!permission.peers.update}
            >
              <div className={"flex gap-3 items-center w-full"}>
                <TerminalSquare size={14} className={"shrink-0"} />
                <div className={"flex justify-between items-center w-full"}>
                  {t(
                    peer.ssh_enabled
                      ? "peerAction.disableSsh"
                      : "peerAction.enableSsh",
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          )}

          <ExitNodeDropdownButton peer={peer} />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={deletePeer}
            variant={"danger"}
            disabled={!permission.peers.delete}
          >
            <div className={"flex gap-3 items-center"}>
              <Trash2 size={14} className={"shrink-0"} />
              {t("common.delete")}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
