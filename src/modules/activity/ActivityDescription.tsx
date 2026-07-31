import FullTooltip from "@components/FullTooltip";
import { Label } from "@components/Label";
import { IconInfoCircle } from "@tabler/icons-react";
import loadConfig from "@utils/config";
import { cn } from "@utils/helpers";
import { isLocalDev, isProduction } from "@utils/netbird";
import { isEmpty } from "lodash";
import { GlobeIcon } from "lucide-react";
import React, { useMemo } from "react";
import RoundedFlag from "@/assets/countries/RoundedFlag";
import { useLocale } from "@/contexts/LocaleProvider";
import { useCountries } from "@/contexts/CountryProvider";
import { ActivityEvent } from "@/interfaces/ActivityEvent";

const config = loadConfig();

const commonActivityDescriptionKeys = {
  "setupkey.add": "activity.description.setupKeyCreated",
  "setupkey.delete": "activity.description.setupKeyDeleted",
  "setupkey.revoke": "activity.description.setupKeyRevoked",
  "peer.setupkey.add": "activity.description.peerAddedWithSetupKey",
  "dashboard.login": "activity.description.dashboardLogin",
  "policy.add": "activity.description.policyCreated",
  "policy.update": "activity.description.policyUpdated",
  "policy.delete": "activity.description.policyDeleted",
  "route.add": "activity.description.routeCreated",
  "route.update": "activity.description.routeUpdated",
  "route.delete": "activity.description.routeDeleted",
  "user.peer.add": "activity.description.peerCreated",
  "user.peer.update": "activity.description.peerUpdated",
  "user.peer.delete": "activity.description.peerDeleted",
  "peer.user.add": "activity.description.peerCreated",
  "user.join": "activity.description.userJoined",
  "user.invite": "activity.description.userInvited",
  "user.create": "activity.description.userCreated",
  "user.delete": "activity.description.userDeleted",
  "user.block": "activity.description.userBlocked",
  "user.unblock": "activity.description.userUnblocked",
  "user.approve": "activity.description.userApproved",
  "user.reject": "activity.description.userRejected",
  "service.user.create": "activity.description.serviceUserCreated",
  "service.user.delete": "activity.description.serviceUserDeleted",
  "peer.ssh.enable": "activity.description.peerSshEnabled",
  "peer.ssh.disable": "activity.description.peerSshDisabled",
  "peer.rename": "activity.description.peerRenamed",
  "peer.approve": "activity.description.peerApproved",
  "peer.ip.update": "activity.description.peerIpUpdated",
  "group.add": "activity.description.groupCreated",
  "group.update": "activity.description.groupUpdated",
  "group.delete": "activity.description.groupDeleted",
  "account.create": "activity.description.accountCreated",
  "account.setting.peer.login.expiration.update":
    "activity.description.globalLoginExpirationUpdated",
  "account.setting.peer.login.expiration.enable":
    "activity.description.globalLoginExpirationEnabled",
  "account.setting.peer.login.expiration.disable":
    "activity.description.globalLoginExpirationDisabled",
  "account.network.range.update":
    "activity.description.accountNetworkRangeUpdated",
  "nameserver.group.add": "activity.description.nameserverCreated",
  "nameserver.group.update": "activity.description.nameserverUpdated",
  "nameserver.group.delete": "activity.description.nameserverDeleted",
  "personal.access.token.create": "activity.description.accessTokenCreated",
  "personal.access.token.delete": "activity.description.accessTokenDeleted",
  "integration.create": "activity.description.integrationCreated",
  "integration.update": "activity.description.integrationUpdated",
  "integration.delete": "activity.description.integrationDeleted",
  "posture.check.created": "activity.description.postureCheckCreated",
  "posture.check.updated": "activity.description.postureCheckUpdated",
  "posture.check.deleted": "activity.description.postureCheckDeleted",
  "network.create": "activity.description.networkCreated",
  "network.update": "activity.description.networkUpdated",
  "network.delete": "activity.description.networkDeleted",
  "network.resource.create": "activity.description.networkResourceCreated",
  "network.resource.update": "activity.description.networkResourceUpdated",
  "network.resource.delete": "activity.description.networkResourceDeleted",
  "network.router.create": "activity.description.networkRouterCreated",
  "network.router.update": "activity.description.networkRouterUpdated",
  "network.router.delete": "activity.description.networkRouterDeleted",
  "identityprovider.create": "activity.description.identityProviderCreated",
  "identityprovider.update": "activity.description.identityProviderUpdated",
  "identityprovider.delete": "activity.description.identityProviderDeleted",
} as const;

type Props = {
  event: ActivityEvent;
};

export default function ActivityDescription({ event }: Props) {
  const { t } = useLocale();
  const m = event.meta;
  const meta = useMemo(() => {
    if (event.meta) {
      return Object.keys(event.meta)
        .map((key) => {
          if (!event.meta[key]) return;
          if (key == "peer_groups") return;
          if (key.includes("id")) return;
          if (key.includes("time")) return;
          return {
            key,
            value: event.meta[key],
          };
        })
        .filter((item) => item !== undefined);
    }
  }, [event.meta]);

  if (!m) {
    return (
      <div className={"inline"}>
        {t("activity.description.fallback", {
          activity: event.activity || event.activity_code,
        })}
      </div>
    );
  }

  const descriptionValues = {
    product: config.productName,
    name: m.name ?? "",
    key: m.key ?? "",
    ip: m.ip ?? m.peer_ip ?? "",
    oldIp: m.old_ip ?? "",
    setupKey: m.setup_key_name ?? "",
    username: m.username ?? "",
    email: m.email ?? "",
    initiator: event.initiator_name || config.productName,
    target: String(m.domains || m.network_range || ""),
    reason: m.reason ?? "",
    oldName: m.old_name ?? "",
    newName: m.new_name ?? "",
    oldRange: m.old_network_range ?? "",
    newRange: m.new_network_range ?? "",
    platform: m.platform || config.productName,
    network: m.network_name ?? "",
  };

  if (event.activity_code == "peer.login.expire") {
    return (
      <div className={"inline"}>
        {t(
          m.reason
            ? "activity.description.peerLoginExpiredReason"
            : "activity.description.peerLoginExpired",
          descriptionValues,
        )}
      </div>
    );
  }

  const commonDescriptionKey =
    commonActivityDescriptionKeys[
      event.activity_code as keyof typeof commonActivityDescriptionKeys
    ];
  if (commonDescriptionKey) {
    return (
      <div className={"inline"}>
        {t(commonDescriptionKey, descriptionValues)}
      </div>
    );
  }

  /**
   * Setup Key
   */

  if (event.activity_code == "setupkey.revoke")
    return (
      <div className={"inline"}>
        Setup-Key <Value> {m.name}</Value> with key <Value>{m.key}</Value> was
        revoked
      </div>
    );

  if (event.activity_code == "setupkey.delete")
    return (
      <div className={"inline"}>
        Setup-Key <Value> {m.name}</Value> with key <Value>{m.key}</Value> was
        deleted
      </div>
    );

  if (event.activity_code == "setupkey.add")
    return (
      <div className={"inline"}>
        Setup-Key <Value>{m.name}</Value> with key <Value>{m.key}</Value> was
        created
      </div>
    );

  if (event.activity_code == "peer.setupkey.add")
    return (
      <div className={"inline"}>
        Peer <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> was added
        with the {config.productName} IP <Value>{m.ip}</Value> using the setup
        key <Value>{m.setup_key_name}</Value>
      </div>
    );

  if (event.activity_code == "setupkey.group.delete")
    return (
      <div className={"inline"}>
        Group <Value>{m.group}</Value> was removed from the{" "}
        <Value>{m.setupkey}</Value> setup key
      </div>
    );

  if (event.activity_code == "setupkey.group.add")
    return (
      <div className={"inline"}>
        Group <Value>{m.group}</Value> was added to the{" "}
        <Value>{m.setupkey}</Value> setup key
      </div>
    );

  /**
   * Dashboard
   */
  if (event.activity_code == "dashboard.login")
    return (
      <div className={"inline"}>
        <Value>{m.username}</Value> logged in to the dashboard
      </div>
    );

  /**
   * Policy
   */

  if (event.activity_code == "policy.update")
    return (
      <div className={"inline"}>
        Policy <Value>{m.name}</Value> has been updated
      </div>
    );

  if (event.activity_code == "policy.delete")
    return (
      <div className={"inline"}>
        Policy <Value>{m.name}</Value> was deleted
      </div>
    );

  if (event.activity_code == "policy.add")
    return (
      <div className={"inline"}>
        Policy <Value>{m.name}</Value> was created
      </div>
    );

  /**
   * Route
   */

  if (event.activity_code == "route.delete") {
    let hasDomains = m?.domains && m?.domains.length > 0;
    return (
      <div className={"inline"}>
        Route <Value>{m.name}</Value> with the {hasDomains ? "domain(s)" : ""}{" "}
        <Value>{hasDomains ? m?.domains : m.network_range}</Value>{" "}
        {hasDomains ? "" : "range"} was deleted
      </div>
    );
  }

  if (event.activity_code == "route.update") {
    let hasDomains = m?.domains && m?.domains.length > 0;
    return (
      <div className={"inline"}>
        Route <Value>{m.name}</Value> with the {hasDomains ? "domain(s)" : ""}{" "}
        <Value>{hasDomains ? m?.domains : m.network_range}</Value>{" "}
        {hasDomains ? "" : "range"} was updated
      </div>
    );
  }

  if (event.activity_code == "route.add") {
    let hasDomains = m?.domains && m?.domains.length > 0;
    return (
      <div className={"inline"}>
        Route <Value>{m.name}</Value> with the {hasDomains ? "domain(s)" : ""}{" "}
        <Value>{hasDomains ? m?.domains : m.network_range}</Value>{" "}
        {hasDomains ? "" : "range"} was created
      </div>
    );
  }

  /**
   * User
   */

  if (event.activity_code == "user.peer.delete")
    return (
      <div className={"inline"}>
        Peer <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> with
        {config.productName} IP <Value>{m.ip}</Value> was deleted
      </div>
    );

  if (event.activity_code == "user.peer.add")
    return (
      <div className={"inline"}>
        Peer <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> was added
        with the {config.productName} IP <Value>{m.ip}</Value>
      </div>
    );

  if (event.activity_code == "user.peer.update")
    return (
      <div className={"inline"}>
        Peer <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> with
        {config.productName} IP <Value>{m.ip}</Value> was updated
      </div>
    );

  if (event.activity_code == "user.join")
    return (
      <div className={"inline"}>
        User <Value>{m.username}</Value> joined {config.productName}
      </div>
    );

  if (event.activity_code == "user.invite")
    return (
      <div className={"inline"}>
        <Value>{event.meta.username}</Value> <Value>{event.meta.email}</Value>{" "}
        was invited.
      </div>
    );

  if (event.activity_code == "user.create")
    return (
      <div className={"inline"}>
        <Value>{event.meta.username}</Value> <Value>{event.meta.email}</Value>{" "}
        was created by{" "}
        <Value>{event?.initiator_name || config.productName}</Value>
      </div>
    );

  if (event.activity_code == "user.group.add")
    return (
      <div className={"inline"}>
        Group <Value>{event.meta.group}</Value> was added to user{" "}
        <Value>{event.meta.username}</Value>
      </div>
    );

  if (event.activity_code == "user.block")
    return (
      <div className={"inline"}>
        User <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> was blocked
      </div>
    );

  if (event.activity_code == "user.unblock")
    return (
      <div className={"inline"}>
        User <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> was unblocked
      </div>
    );

  if (event.activity_code == "user.delete")
    return (
      <div className={"inline"}>
        User <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> was deleted
      </div>
    );

  if (event.activity_code == "user.group.delete")
    return (
      <div className={"inline"}>
        Group <Value>{event.meta.group}</Value> was removed from user{" "}
        <Value>{event.meta.username}</Value> <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.role.update")
    return (
      <div className={"inline"}>
        Role <Value>{event.meta.role}</Value> was updated of user{" "}
        <Value>{event.meta.username}</Value> <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.approve")
    return (
      <div className={"inline"}>
        User <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> was approved
      </div>
    );

  if (event.activity_code == "user.reject")
    return (
      <div className={"inline"}>
        User <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> was rejected
      </div>
    );

  if (event.activity_code == "user.password.change")
    return (
      <div className={"inline"}>
        Password was changed for user <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  /**
   * User Invite Link
   */

  if (event.activity_code == "user.invite.link.create")
    return (
      <div className={"inline"}>
        Invite link was created for <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.invite.link.accept")
    return (
      <div className={"inline"}>
        Invite link was accepted by <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.invite.link.regenerate")
    return (
      <div className={"inline"}>
        Invite link was regenerated for <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.invite.link.delete")
    return (
      <div className={"inline"}>
        Invite link was deleted for <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  /**
   * Service User
   */

  if (event.activity_code == "service.user.create")
    return (
      <div className={"inline"}>
        Service user <Value>{event.meta.name}</Value> was created
      </div>
    );

  if (event.activity_code == "service.user.delete")
    return (
      <div className={"inline"}>
        Service user <Value>{event.meta.name}</Value> was deleted
      </div>
    );

  /**
   * Peer
   */

  if (event.activity_code == "peer.group.delete")
    return (
      <div className={"inline"}>
        Group <Value>{m.group}</Value> was removed from the peer with the
        {config.productName} IP <Value>{m.peer_ip}</Value>
      </div>
    );

  if (event.activity_code == "peer.group.add")
    return (
      <div className={"inline"}>
        Group <Value>{m.group}</Value> was added to the peer with the{" "}
        {config.productName} IP <Value>{m.peer_ip}</Value>
      </div>
    );

  if (event.activity_code == "peer.login.expire") {
    return (
      <div className={"inline"}>
        Login of the peer <Value>{m.name}</Value> expired
        {m.reason && (
          <>
            {" "}
            due to <Value>{m.reason}</Value>
          </>
        )}
      </div>
    );
  }

  if (event.activity_code == "peer.ssh.disable")
    return (
      <div className={"inline"}>
        SSH Server of peer <Value>{m.name}</Value> was disabled
      </div>
    );

  if (event.activity_code == "peer.ssh.enable")
    return (
      <div className={"inline"}>
        SSH Server of peer <Value>{m.name}</Value> was enabled
      </div>
    );

  if (event.activity_code == "peer.login.expiration.disable")
    return (
      <div className={"inline"}>
        Login expiration of peer <Value>{m.name}</Value> was disabled
      </div>
    );

  if (event.activity_code == "peer.login.expiration.enable")
    return (
      <div className={"inline"}>
        Login expiration of peer <Value>{m.name}</Value> was enabled
      </div>
    );

  if (event.activity_code == "peer.rename")
    return (
      <div className={"inline"}>
        Peer with the {config.productName} IP <Value>{m.ip}</Value> was renamed
        to <Value>{m.name}</Value>
      </div>
    );

  if (event.activity_code == "peer.approve")
    return (
      <div className={"inline"}>
        Peer with the {config.productName} IP <Value>{m.ip}</Value> was approved
      </div>
    );

  if (event.activity_code == "peer.ip.update")
    return (
      <div className={"inline"}>
        Peer <Value>{m.name}</Value> IP address was updated from{" "}
        <Value>{m.old_ip}</Value> to <Value>{m.ip}</Value>
      </div>
    );

  if (event.activity_code == "peer.user.add")
    return (
      <div className={"inline"}>
        Peer <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> was added
        with the {config.productName} IP <Value>{m.ip}</Value>
      </div>
    );

  /**
   * Group
   */

  if (event.activity_code == "group.add")
    return (
      <div className={"inline"}>
        Group <Value>{m.name}</Value> was created
      </div>
    );

  if (event.activity_code == "group.delete")
    return (
      <div className={"inline"}>
        Group <Value>{event.meta.name}</Value> was deleted
      </div>
    );

  if (event.activity_code == "group.update")
    return (
      <div className={"inline"}>
        Group <Value>{event.meta.old_name}</Value> was renamed to{" "}
        <Value>{event.meta.new_name}</Value>
      </div>
    );

  /**
   * Account
   */

  if (event.activity_code == "account.create")
    return (
      <div className={"inline"}>
        <Value>{event.initiator_name}</Value> created an account
      </div>
    );

  if (event.activity_code == "account.setting.peer.login.expiration.update")
    return <div className={"inline"}>Global login expiration was updated</div>;

  if (event.activity_code == "account.setting.peer.login.expiration.enable")
    return <div className={"inline"}>Global login expiration was enabled</div>;

  if (event.activity_code == "account.setting.peer.login.expiration.disable")
    return <div className={"inline"}>Global login expiration was disabled</div>;

  if (event.activity_code == "account.network.range.update")
    return (
      <div className={"inline"}>
        Account network range was updated from{" "}
        <Value>{m.old_network_range}</Value> to{" "}
        <Value>{m.new_network_range}</Value>
      </div>
    );

  /**
   * Nameserver
   */

  if (event.activity_code == "nameserver.group.add")
    return (
      <div className={"inline"}>
        Nameserver <Value>{event.meta.name}</Value> was added
      </div>
    );

  if (event.activity_code == "nameserver.group.delete")
    return (
      <div className={"inline"}>
        Nameserver <Value>{event.meta.name}</Value> was deleted
      </div>
    );

  if (event.activity_code == "nameserver.group.update")
    return (
      <div className={"inline"}>
        Nameserver <Value>{event.meta.name}</Value> was updated
      </div>
    );

  /**
   * Personal Access Token
   */

  if (event.activity_code == "personal.access.token.create")
    return (
      <div className={"inline"}>
        Access token <Value>{event.meta.name}</Value> for user{" "}
        <Value>{event.meta.username}</Value> was created
      </div>
    );

  if (event.activity_code == "personal.access.token.delete")
    return (
      <div className={"inline"}>
        Access token <Value>{event.meta.name}</Value> for user{" "}
        <Value>{event.meta.username}</Value> was deleted
      </div>
    );

  /**
   * Integration
   */

  if (event.activity_code == "integration.create") {
    if (!event.meta.platform) return "Integration created";
    return (
      <div className={"inline"}>
        <Value className={"capitalize"}>{event.meta.platform}</Value>{" "}
        integration created
      </div>
    );
  }

  if (event.activity_code == "integration.delete") {
    if (!event.meta.platform) return "Integration deleted";
    return (
      <div className={"inline"}>
        <Value className={"capitalize"}>{event.meta.platform}</Value>{" "}
        integration deleted
      </div>
    );
  }

  if (event.activity_code == "integration.update") {
    if (!event.meta.platform) return "Integration updated";
    return (
      <div className={"inline"}>
        <Value className={"capitalize"}>{event.meta.platform}</Value>{" "}
        integration updated
      </div>
    );
  }

  /**
   * DNS
   */

  if (event.activity_code == "dns.setting.disabled.management.group.add")
    return (
      <div className={"inline"}>
        Group <Value>{event.meta.group}</Value> was added to disabled DNS group
        setting
      </div>
    );

  if (event.activity_code == "dns.setting.disabled.management.group.delete")
    return (
      <div className={"inline"}>
        Group <Value>{event.meta.group}</Value> was removed from disabled DNS
        group setting
      </div>
    );

  /**
   * Posture Checks
   */

  if (event.activity_code == "posture.check.updated")
    return (
      <div className={"inline"}>
        Posture check <Value> {m.name}</Value> was updated
      </div>
    );

  if (event.activity_code == "posture.check.created")
    return (
      <div className={"inline"}>
        Posture check <Value> {m.name}</Value> was created
      </div>
    );

  if (event.activity_code == "posture.check.deleted")
    return (
      <div className={"inline"}>
        Posture check <Value> {m.name}</Value> was deleted
      </div>
    );

  if (event.activity_code == "transferred.owner.role")
    return <div className={"inline"}>Owner role was transferred</div>;

  /**
   * EDR
   */
  if (event.activity_code == "integrated-validator.api.created")
    return (
      <div className={"inline"}>
        <Value>{m?.platform}</Value> integration created
      </div>
    );

  if (event.activity_code == "integrated-validator.api.updated")
    return (
      <div className={"inline"}>
        <Value>{m?.platform}</Value> integration updated
      </div>
    );

  if (event.activity_code == "integrated-validator.api.deleted")
    return (
      <div className={"inline"}>
        <Value>{m?.platform}</Value> integration deleted
      </div>
    );

  if (event.activity_code == "integrated-validator.host-check.approved")
    return (
      <div className={"inline"}>
        Peer approved by <Value>{m?.platform}</Value> integration
      </div>
    );

  if (event.activity_code == "integrated-validator.host-check.denied")
    return (
      <div className={"inline"}>
        Peer rejected by <Value>{m?.platform}</Value> integration
      </div>
    );

  if (event.activity_code == "integrated-validator.peer.compliance-bypassed")
    return (
      <div className={"inline"}>
        Peer <Value>{m?.name}</Value> with the {config.productName} IP{" "}
        <Value>{m?.ip}</Value> compliance bypassed for{" "}
        <Value>{m?.platform}</Value> integration
        {m?.original_reason && (
          <>
            {" "}
            (original non-compliant reason: <Value>{m?.original_reason}</Value>)
          </>
        )}
      </div>
    );

  if (
    event.activity_code == "integrated-validator.peer.compliance-bypass-revoked"
  )
    return (
      <div className={"inline"}>
        Peer <Value>{m?.name}</Value> with the {config.productName} IP{" "}
        <Value>{m?.ip}</Value> compliance bypass revoked for{" "}
        <Value>{m?.platform}</Value> integration
      </div>
    );

  /**
   * Resource
   */
  if (event.activity_code == "resource.group.add")
    return (
      <div className={"inline"}>
        Group <Value>{m.resource_name}</Value> added to resource{"  "}
        <Value>{m.name}</Value>
      </div>
    );

  if (event.activity_code == "resource.group.delete")
    return (
      <div className={"inline"}>
        Group <Value>{m.resource_name}</Value> removed from resource{"  "}
        <Value>{m.name}</Value>
      </div>
    );

  /**
   * Reverse Proxy
   */

  if (event.activity_code == "service.peer.expose")
    return (
      <div className={"inline"}>
        Peer <Value>{m.peer_name}</Value> exposed service{" "}
        <Value>{m.domain}</Value> with auth{" "}
        <Value>{m.auth ? "Enabled" : "Disabled"}</Value>
      </div>
    );

  if (event.activity_code == "service.peer.unexpose")
    return (
      <div className={"inline"}>
        Peer <Value>{m.peer_name}</Value> unexposed service{" "}
        <Value>{m.domain}</Value>
      </div>
    );

  if (event.activity_code == "service.peer.expose.expire")
    return (
      <div className={"inline"}>
        Service <Value>{m.domain}</Value> exposed by peer{" "}
        <Value>{m.peer_name}</Value> was removed due to renewal expiration
      </div>
    );

  /**
   * Networks
   */

  if (event.activity_code == "network.resource.create")
    return (
      <div className={"inline"}>
        Resource <Value>{m.name}</Value> created for network{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.resource.update")
    return (
      <div className={"inline"}>
        Resource <Value>{m.name}</Value> updated for network{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.resource.delete")
    return (
      <div className={"inline"}>
        Resource <Value>{m.name}</Value> deleted from network{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.router.create")
    return (
      <div className={"inline"}>
        Routing peer created for network{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.router.delete")
    return (
      <div className={"inline"}>
        Routing peer deleted from network{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.router.update")
    return (
      <div className={"inline"}>
        Routing peer updated from network{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.create")
    return (
      <div className={"inline"}>
        Network with name <Value>{m.name}</Value> created
      </div>
    );

  if (event.activity_code == "network.delete")
    return (
      <div className={"inline"}>
        Network with name <Value>{m.name}</Value> deleted
      </div>
    );

  if (event.activity_code == "network.update")
    return (
      <div className={"inline"}>
        Network with name <Value>{m.name}</Value> updated
      </div>
    );

  /**
   * Jobs
   */

  if (event.activity_code == "peer.job.create")
    return (
      <div className={"inline"}>
        Remote job <Value>{m.job_type}</Value> created for peer{" "}
        <Value>{m.for_peer_name}</Value>
      </div>
    );

  /**
   * Flow Settings
   */

  if (event.activity_code == "account.settings.extra.flow.group.remove")
    return (
      <div className={"inline"}>
        Limit traffic event group <Value>{m.group_name}</Value> removed
      </div>
    );

  if (event.activity_code == "account.settings.extra.flow.group.add")
    return (
      <div className={"inline"}>
        Limit traffic event group <Value>{m.group_name}</Value> added
      </div>
    );

  /**
   * Identity Provider
   */

  if (event.activity_code == "identityprovider.create")
    return (
      <div className={"inline"}>
        Identity provider <Value>{m.name}</Value> was created
      </div>
    );

  if (event.activity_code == "identityprovider.update")
    return (
      <div className={"inline"}>
        Identity provider <Value>{m.name}</Value> was updated
      </div>
    );

  if (event.activity_code == "identityprovider.delete")
    return (
      <div className={"inline"}>
        Identity provider <Value>{m.name}</Value> was deleted
      </div>
    );

  /**
   * Reverse Proxy
   */

  if (event.activity_code == "service.create")
    return (
      <div className={"inline"}>
        Service <Value>{m.domain}</Value> in cluster{" "}
        <Value>{m.proxy_cluster}</Value> was created with authentication{" "}
        <Value>{m.auth ? "Enabled" : "Disabled"}</Value>
      </div>
    );

  if (event.activity_code == "service.update")
    return (
      <div className={"inline"}>
        Service <Value>{m.domain}</Value> in cluster{" "}
        <Value>{m.proxy_cluster}</Value> was updated with authentication{" "}
        <Value>{m.auth ? "Enabled" : "Disabled"}</Value>
      </div>
    );

  if (event.activity_code == "service.delete")
    return (
      <div className={"inline"}>
        Service <Value>{m.domain}</Value> in cluster{" "}
        <Value>{m.proxy_cluster}</Value> was deleted
      </div>
    );

  /**
   * Distributor
   */

  if (event.activity_code == "reseller.msp.created")
    return (
      <div className={"inline"}>
        Customer <Value>{m.msp_name}</Value> with domain{" "}
        <Value>{m.msp_domain}</Value> was created
      </div>
    );

  if (event.activity_code == "reseller.activated")
    return <div className={"inline"}>Distributor account was activated</div>;

  if (event.activity_code == "reseller.msp.deleted")
    return (
      <div className={"inline"}>
        Customer <Value>{m.msp_name}</Value> with domain{" "}
        <Value>{m.msp_domain}</Value> was deleted
      </div>
    );

  if (event.activity_code == "reseller.msp.unlinked")
    return (
      <div className={"inline"}>
        Customer <Value>{m.msp_name}</Value> with domain{" "}
        <Value>{m.msp_domain}</Value> was unlinked
      </div>
    );

  if (event.activity_code == "reseller.msp.invite.requested")
    return (
      <div className={"inline"}>
        Invite requested for customer <Value>{m.msp_name}</Value> with domain{" "}
        <Value>{m.msp_domain}</Value>
      </div>
    );

  if (event.activity_code == "reseller.msp.invite.accepted")
    return (
      <div className={"inline"}>
        Invite accepted by customer <Value>{m.msp_name}</Value> with domain{" "}
        <Value>{m.msp_domain}</Value>
      </div>
    );

  if (event.activity_code == "reseller.msp.invite.declined")
    return (
      <div className={"inline"}>
        Invite declined by customer <Value>{m.msp_name}</Value> with domain{" "}
        <Value>{m.msp_domain}</Value>
      </div>
    );

  if (event.activity_code == "reseller.msp.updated")
    return (
      <div className={"inline"}>
        Customer <Value>{m.msp_name}</Value> with domain{" "}
        <Value>{m.msp_domain}</Value> was updated
      </div>
    );

  return (
    <div className={"flex gap-2.5 items-center"}>
      <span className={"mb-[1px]"}>
        {t("activity.description.fallback", {
          activity: event.activity || event.activity_code,
        })}
      </span>

      {isLocalDev() && !isProduction() && (
        <FullTooltip
          content={
            <div className={"pb-1"}>
              <Label className={"mb-3"}>{t("activity.details.code")}</Label>
              <Value>{event.activity_code}</Value>
              <Label className={"my-3"}>{t("activity.details.meta")}</Label>
              {meta &&
                meta.map((item) => (
                  <React.Fragment key={item?.key}>
                    <div className={"inline"}>
                      <Value>
                        {item?.key} = {item?.value}
                      </Value>
                    </div>
                  </React.Fragment>
                ))}
            </div>
          }
        >
          <IconInfoCircle className={"text-nb-gray-500"} size={16} />
        </FullTooltip>
      )}
    </div>
  );
}

function Value({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return children ? (
    <span
      className={cn(
        "text-nb-gray-200 inline-flex gap-1 items-center max-h-[22px] font-medium bg-nb-gray-900 py-[3px] text-[11px] px-[5px] border border-nb-gray-800 rounded-[4px]",
        className,
      )}
    >
      {children}
    </span>
  ) : null;
}

function PeerConnectionInfo({ meta }: { meta: any }) {
  const hasMeta =
    !isEmpty(meta?.location_country_code) ||
    !isEmpty(meta?.location_connection_ip);
  const { countries } = useCountries();
  const { t } = useLocale();

  const countryText = useMemo(() => {
    if (!countries) return t("activity.value.unknown");
    const country = countries.find(
      (c) => c.country_code === meta?.location_country_code,
    );
    if (!country) return t("activity.value.unknown");
    if (!meta?.location_city_name) return country.country_name;
    return `${country.country_name}, ${meta?.location_city_name}`;
  }, [countries, meta, t]);

  return hasMeta ? (
    <>
      {" "}
      {t("activity.description.from")}{" "}
      {meta?.location_connection_ip && (
        <Value>{meta?.location_connection_ip}</Value>
      )}{" "}
      {meta?.location_country_code && (
        <Value>
          {isEmpty(meta?.location_country_code) ? (
            <GlobeIcon size={9} className={"text-nb-gray-300"} />
          ) : (
            <RoundedFlag country={meta?.location_country_code} size={9} />
          )}
          {countryText}
        </Value>
      )}
    </>
  ) : null;
}
