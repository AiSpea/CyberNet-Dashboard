"use client";

import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/zh-cn";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import loadConfig from "@/utils/config";
import { fetchInstanceStatus } from "@/utils/unauthenticatedApi";

export type CyberNetLocale = "zh-CN" | "en";

const STORAGE_KEY = "cybernet-locale";
const COOKIE_NAME = "cybernet-locale";
const DEFAULT_LOCALE: CyberNetLocale = "zh-CN";

const en = {
  "language.label": "Language",
  "language.chinese": "简体中文",
  "language.english": "English",
  "common.continue": "Continue",
  "common.cancel": "Cancel",
  "common.retry": "Try again",
  "common.logout": "Log out",
  "common.learnMore": "Learn more",
  "common.download": "Download",
  "common.install": "Install",
  "common.copy": "Copy",
  "common.copiedToClipboard": "Copied to clipboard",
  "common.generate": "Generate",
  "common.documentation": "Documentation",
  "common.troubleshooting": "Troubleshooting",
  "common.feedback": "Feedback",
  "common.sourceCode": "CyberNet source code",
  "common.beta": "Beta",
  "common.backToDashboard": "Back to dashboard",
  "nav.controlCenter": "Control Center",
  "nav.peers": "Peers",
  "nav.accessControl": "Access Control",
  "nav.policies": "Policies",
  "nav.groups": "Groups",
  "nav.postureChecks": "Posture Checks",
  "nav.networkRouting": "Network Routing",
  "nav.networks": "Networks",
  "nav.routes": "Routes",
  "nav.reverseProxy": "Reverse Proxy",
  "nav.services": "Services",
  "nav.customDomains": "Custom Domains",
  "nav.clusters": "Clusters",
  "nav.accessLogs": "Access Logs",
  "nav.agentNetwork": "Agent Network",
  "nav.providers": "Providers",
  "nav.usageLogs": "Usage & Logs",
  "nav.configuration": "Configuration",
  "nav.dns": "DNS",
  "nav.nameservers": "Nameservers",
  "nav.zones": "Zones",
  "nav.dnsSettings": "DNS Settings",
  "nav.team": "Team",
  "nav.users": "Users",
  "nav.serviceUsers": "Service Users",
  "nav.activity": "Activity",
  "nav.auditEvents": "Audit Events",
  "nav.trafficEvents": "Traffic Events",
  "nav.settings": "Settings",
  "nav.integrations": "Integrations",
  "nav.documentation": "Documentation",
  "page.networks.description":
    "Access internal LAN and VPC resources without installing CyberNet on every machine.",
  "page.routes.description":
    "Reach other LAN and VPC networks through a routing peer.",
  "page.routes.recommendation":
    "Use Networks for a clearer view of resources and access.",
  "page.routes.goNetworks": "Go to Networks",
  "page.groups.description":
    "Organize peers, users, and resources into groups to manage access.",
  "page.nameservers.description":
    "Add nameservers for domain resolution inside your CyberNet network.",
  "page.dnsSettings.description": "Manage DNS behavior for this account.",
  "page.postureChecks.description":
    "Use posture checks to further restrict access in your network.",
  "page.serviceUsers.description":
    "Create service-user API tokens without tying automation to a person.",
  "page.users.description":
    "Manage users and permissions. Same-domain users are added on first sign-in.",
  "page.accessControl.title": "Access control policies",
  "page.accessControl.description":
    "Control which users and agents can reach each network resource.",
  "page.audit.description":
    "Review configuration, access-policy, peer-registration, and sign-in events.",
  // Activity and audit log
  "activity.page.title": "Audit events",
  "activity.page.description":
    "Review configuration changes, peer activity, and sign-ins across {{product}}.",
  "activity.table.title": "Audit events",
  "activity.table.code": "Code",
  "activity.search.placeholder":
    "Search by event, user, peer, or event details...",
  "activity.filter.type": "Type",
  "activity.filter.initiator": "Initiator",
  "activity.filter.typeSearch": "Search events...",
  "activity.filter.typeCount": "{{count}} types",
  "activity.empty.title": "No audit events yet",
  "activity.empty.description":
    "Changes and sign-ins across {{product}} will appear here.",
  "activity.system": "System",
  "activity.external": "External",
  "activity.timestamp": "{{date}} at {{time}}",
  "activity.value.unknown": "Unknown",
  "activity.description.from": "from",
  "activity.description.fallback": "Event: {{activity}}",
  "activity.details.code": "Activity code",
  "activity.details.meta": "Metadata",
  "activity.group.setupkey": "Setup keys",
  "activity.group.dashboard": "Dashboard",
  "activity.group.policy": "Policies",
  "activity.group.route": "Routes",
  "activity.group.user": "Users",
  "activity.group.serviceUser": "Service users",
  "activity.group.peer": "Peers",
  "activity.group.group": "Groups",
  "activity.group.account": "Account",
  "activity.group.nameserver": "Nameservers",
  "activity.group.personal": "Access tokens",
  "activity.group.integration": "Integrations",
  "activity.group.dns": "DNS",
  "activity.group.posture": "Posture checks",
  "activity.group.network": "Networks",
  "activity.group.identityprovider": "Identity providers",
  "activity.group.service": "Services",
  "activity.group.reseller": "Distributor",
  "activity.description.setupKeyCreated":
    "Setup key {{name}} ({{key}}) was created",
  "activity.description.setupKeyDeleted":
    "Setup key {{name}} ({{key}}) was deleted",
  "activity.description.setupKeyRevoked":
    "Setup key {{name}} ({{key}}) was revoked",
  "activity.description.peerAddedWithSetupKey":
    "Peer {{name}} was added with the {{product}} IP {{ip}} using setup key {{setupKey}}",
  "activity.description.dashboardLogin":
    "{{username}} signed in to the dashboard",
  "activity.description.policyCreated": "Policy {{name}} was created",
  "activity.description.policyUpdated": "Policy {{name}} was updated",
  "activity.description.policyDeleted": "Policy {{name}} was deleted",
  "activity.description.routeCreated":
    "Route {{name}} ({{target}}) was created",
  "activity.description.routeUpdated":
    "Route {{name}} ({{target}}) was updated",
  "activity.description.routeDeleted":
    "Route {{name}} ({{target}}) was deleted",
  "activity.description.peerCreated":
    "Peer {{name}} with the {{product}} IP {{ip}} was added",
  "activity.description.peerUpdated":
    "Peer {{name}} with the {{product}} IP {{ip}} was updated",
  "activity.description.peerDeleted":
    "Peer {{name}} with the {{product}} IP {{ip}} was deleted",
  "activity.description.userJoined": "User {{username}} joined {{product}}",
  "activity.description.userInvited": "{{username}} ({{email}}) was invited",
  "activity.description.userCreated":
    "{{username}} ({{email}}) was created by {{initiator}}",
  "activity.description.userDeleted":
    "User {{username}} ({{email}}) was deleted",
  "activity.description.userBlocked":
    "User {{username}} ({{email}}) was blocked",
  "activity.description.userUnblocked":
    "User {{username}} ({{email}}) was unblocked",
  "activity.description.userApproved":
    "User {{username}} ({{email}}) was approved",
  "activity.description.userRejected":
    "User {{username}} ({{email}}) was rejected",
  "activity.description.serviceUserCreated":
    "Service user {{name}} was created",
  "activity.description.serviceUserDeleted":
    "Service user {{name}} was deleted",
  "activity.description.peerLoginExpired": "Login for peer {{name}} expired",
  "activity.description.peerLoginExpiredReason":
    "Login for peer {{name}} expired: {{reason}}",
  "activity.description.peerSshEnabled":
    "The SSH server on peer {{name}} was enabled",
  "activity.description.peerSshDisabled":
    "The SSH server on peer {{name}} was disabled",
  "activity.description.peerRenamed": "Peer {{ip}} was renamed to {{name}}",
  "activity.description.peerApproved": "Peer {{ip}} was approved",
  "activity.description.peerIpUpdated":
    "Peer {{name}} IP changed from {{oldIp}} to {{ip}}",
  "activity.description.groupCreated": "Group {{name}} was created",
  "activity.description.groupUpdated":
    "Group {{oldName}} was renamed to {{newName}}",
  "activity.description.groupDeleted": "Group {{name}} was deleted",
  "activity.description.accountCreated": "{{initiator}} created an account",
  "activity.description.globalLoginExpirationUpdated":
    "Global login expiration was updated",
  "activity.description.globalLoginExpirationEnabled":
    "Global login expiration was enabled",
  "activity.description.globalLoginExpirationDisabled":
    "Global login expiration was disabled",
  "activity.description.accountNetworkRangeUpdated":
    "Account network range changed from {{oldRange}} to {{newRange}}",
  "activity.description.nameserverCreated": "Nameserver {{name}} was added",
  "activity.description.nameserverUpdated": "Nameserver {{name}} was updated",
  "activity.description.nameserverDeleted": "Nameserver {{name}} was deleted",
  "activity.description.accessTokenCreated":
    "Access token {{name}} for {{username}} was created",
  "activity.description.accessTokenDeleted":
    "Access token {{name}} for {{username}} was deleted",
  "activity.description.integrationCreated":
    "{{platform}} integration was created",
  "activity.description.integrationUpdated":
    "{{platform}} integration was updated",
  "activity.description.integrationDeleted":
    "{{platform}} integration was deleted",
  "activity.description.postureCheckCreated":
    "Posture check {{name}} was created",
  "activity.description.postureCheckUpdated":
    "Posture check {{name}} was updated",
  "activity.description.postureCheckDeleted":
    "Posture check {{name}} was deleted",
  "activity.description.networkCreated": "Network {{name}} was created",
  "activity.description.networkUpdated": "Network {{name}} was updated",
  "activity.description.networkDeleted": "Network {{name}} was deleted",
  "activity.description.networkResourceCreated":
    "Resource {{name}} was created in network {{network}}",
  "activity.description.networkResourceUpdated":
    "Resource {{name}} was updated in network {{network}}",
  "activity.description.networkResourceDeleted":
    "Resource {{name}} was deleted from network {{network}}",
  "activity.description.networkRouterCreated":
    "A routing peer was added to network {{network}}",
  "activity.description.networkRouterUpdated":
    "A routing peer in network {{network}} was updated",
  "activity.description.networkRouterDeleted":
    "A routing peer was removed from network {{network}}",
  "activity.description.identityProviderCreated":
    "Identity provider {{name}} was created",
  "activity.description.identityProviderUpdated":
    "Identity provider {{name}} was updated",
  "activity.description.identityProviderDeleted":
    "Identity provider {{name}} was deleted",
  "page.reverseProxy.description":
    "Expose services securely through CyberNet's reverse proxy.",
  "page.reverseProxy.beta":
    "CyberNet Reverse Proxy is currently in beta. Features may change before general availability.",
  "settings.authentication": "Authentication",
  "settings.setupKeys": "Setup keys",
  "settings.identityProviders": "Identity providers",
  "settings.permissions": "Permissions",
  "settings.clients": "Clients",
  "settings.metrics": "Metrics",
  "settings.dangerZone": "Danger zone",
  "danger.deleteTitle": "Delete {{product}} account",
  "danger.deleted": "{{product}} account was successfully deleted.",
  "danger.deleting": "Deleting the account...",
  "danger.confirm":
    "Are you sure you want to delete your {{product}} account? This action cannot be undone.",
  "danger.description":
    "Before deleting your {{product}} account, be aware that this action is irreversible. You will permanently lose access to all associated data, including peers, users, groups, policies, and routes.",
  "danger.deleteAccount": "Delete account",
  "clientSettings.autoUpdateDescription":
    "Configure how {{product}} clients receive update notifications. When enabled, users will be prompted to install the selected version.",
  "clientSettings.minimumVersion":
    "Requires {{product}} client {{version}} or later.",
  "clientSettings.autoUpdateWarning":
    "Enabling automatic updates will restart the {{product}} client during updates, which can temporarily disrupt active connections. Use with caution in production environments.",
  "clientSettings.peerExposeDescription":
    "Allow peers to expose local services through the {{product}} reverse proxy using the CLI.",
  "clientSettings.lazyConnectionDescription":
    "Instead of maintaining always-on connections, {{product}} activates them on demand based on activity or signaling.",
  "userInvite.localAccountDescription":
    "Create a {{product}} user account with email and password.",
  "routingPeer.installDescription":
    "Install {{product}} with a setup key on one or more machines to use them as routing peers.",
  "routingPeer.installConfirm":
    "If you continue, a one-off setup key will be created automatically so you can install {{product}}.",
  "setupKeys.learnMore": "Learn more about setup keys",
  "groups.emptyPeersDescription":
    "Install {{product}} and assign existing peers to this group to see them listed here.",
  "metrics.description":
    "Help us improve {{product}} by sharing performance metrics such as connection timing, sync duration, and login latency.",
  "metrics.learnMore": "Learn more about client metrics in our documentation.",
  "metrics.share": "Share performance metrics",
  "metrics.shareHelp":
    "When enabled, clients periodically send performance data to help identify and fix issues.",
  "metrics.enabled": "Performance metric sharing is enabled.",
  "metrics.disabled": "Performance metric sharing is disabled.",
  "metrics.updating": "Updating metric settings...",
  "ssh.enableTitle": "Enable SSH access",
  "ssh.enableDescription":
    "Allow remote SSH access from other connected network participants.",
  "ssh.cliInstruction":
    "If you use the {{product}} CLI, enable the SSH server with these commands:",
  "ssh.desktopInstruction":
    "Open {{product}} from the system tray, go to Settings, and enable Allow SSH. To permit root login, open Settings → Advanced Settings → SSH and enable SSH Root Login.",
  "ssh.policyRequirement":
    "Starting with {{product}} v0.61.0, SSH requires an explicit access-control policy for this machine.",
  "ssh.createPolicy": "Create SSH policy",
  "ssh.finishInstruction":
    "After the SSH server is allowed in the client, select Finish setup below.",
  "ssh.learnMore": "Learn more about SSH",
  "ssh.finishSetup": "Finish setup",
  "ssh.disableTitle": "Disable SSH access?",
  "ssh.disableDescription":
    "Starting with {{product}} v0.61.0, SSH access cannot be re-enabled from the dashboard after it is disabled. Create an explicit access-control policy and update the {{product}} client to restore SSH functionality.",
  "ssh.disable": "Disable",
  "ssh.oldClientWarning":
    "SSH access is configured, but this device uses an older {{product}} version. Update the client to v0.61.0 or later to allow SSH connections.",
  "ssh.policyRequiredWarning":
    "The SSH server is enabled, but {{product}} v0.61.0 and later require an explicit access-control policy. Create an SSH policy to allow connections.",
  "onboarding.complete": "You’ve completed onboarding.",
  "onboarding.congratulations": "Congratulations, {{name}}!",
  "onboarding.congratulationsGeneric": "Congratulations!",
  "onboarding.next":
    "Explore these guides to get more from {{product}}, or continue to the dashboard and documentation.",
  "onboarding.accessTitle": "Access control",
  "onboarding.accessDescription":
    "Learn how to manage access to network resources for devices and users.",
  "onboarding.identityTitle": "Provision users and groups",
  "onboarding.identityDescription":
    "Connect an identity provider to automate user and group onboarding and offboarding.",
  "onboarding.architectureTitle": "How {{product}} works",
  "onboarding.architectureDescription":
    "Learn how {{product}} securely connects users, devices, and private resources.",
  "onboarding.goDashboard": "Go to dashboard",
  "reverseProxy.privateTitle": "Private network access",
  "reverseProxy.privateDescription":
    "Reachable only by connected peers in the selected {{product}} groups.",
  "reverseProxy.privateMissingGroups":
    "Private network access is enabled, but no access groups are selected. Open Authentication and choose at least one group.",
  "reverseProxy.privateRequiresCluster":
    "Private network access requires a proxy cluster with at least one connected embedded proxy (netbird proxy).",
  "reverseProxy.privateCallout":
    "This service is accessible only through {{product}}. A default allow rule for the private network range is applied before any additional rules below.",
  "reverseProxy.targetPeerDescription":
    "Select a device or server running {{product}}.",
  "reverseProxy.targetResourceDescription":
    "Select a resource reachable through {{product}}. Resources belong to a network and are accessed through routing peers.",
  "reverseProxy.emptyResources":
    "Create resources and expose services securely through the {{product}} reverse proxy.",
  "reverseProxy.emptyServices":
    "Expose internal services securely through the {{product}} reverse proxy with automatic TLS and optional authentication.",
  "reverseProxy.customDomainsDescription":
    "Use your own domains with the {{product}} reverse proxy. Add a CNAME record pointing to a cluster, then verify ownership.",
  "reverseProxy.dnsPropagation":
    "DNS changes can take time to propagate. If {{product}} does not find the record immediately, wait up to 24 hours and try again.",
  "reverseProxy.clusterRegistered":
    "Proxy registered with {{product}} and connected.",
  "reverseProxy.clusterWaiting":
    "Waiting for the proxy to register with {{product}}...",
  "reverseProxy.clusterTokenPrivate":
    "The token stays in your browser, never reaches {{product}} servers, and can be deleted after setup.",
  "reverseProxy.clusterTokenNotStored":
    "Create a token with the required access. It is never stored by {{product}}.",
  "reverseProxy.selfHostedRoutingWarning":
    "For self-hosted deployments, configure proxy service routes on the {{product}} management server before starting the proxy.",
  "integrations.connectWith": "Connect {{product}} with {{integration}}",
  "integrations.title": "Integrations",
  "integrations.idpTitle": "Identity provider sync",
  "integrations.syncStart":
    "Start syncing users and groups from {{integration}} to {{product}}. Follow the steps below to get started.",
  "integrations.syncSummary":
    "Sync users and groups from {{integration}} to {{product}}.",
  "integrations.connected":
    "{{integration}} was successfully connected to {{product}}.",
  "integrations.deleteSync":
    "Deleting this integration stops user and group synchronization with {{product}}. Reconfigure the integration to enable synchronization again.",
  "integrations.idpDescription":
    "Connect an identity provider to synchronize users and groups with {{product}}.",
  "integrations.eventDescription":
    "Stream {{product}} audit and traffic events to an external destination.",
  "updates.tab": "Brand & client updates",
  "updates.title": "Brand and client updates",
  "updates.description":
    "Configure the public CyberNet identity and the version shown to your clients. Only the account owner can change these instance-wide values.",
  "updates.productName": "Product name",
  "updates.logoUrl": "Logo URL",
  "updates.defaultLanguage": "Default language",
  "updates.channel": "Release channel",
  "updates.channel.stable": "Stable",
  "updates.channel.beta": "Beta",
  "updates.channel.rc": "Release candidate",
  "updates.latestVersion": "Latest client version",
  "updates.releaseNotesUrl": "Release notes URL",
  "updates.downloadUrl": "Default download URL",
  "updates.versionCheckUrl": "Client version-check URL",
  "updates.platformUrls": "Platform download URLs",
  "updates.macosUrl": "macOS",
  "updates.windowsUrl": "Windows",
  "updates.linuxUrl": "Linux",
  "updates.iosUrl": "iOS",
  "updates.androidUrl": "Android",
  "updates.save": "Save changes",
  "updates.saved": "Update settings saved",
  "updates.savedDescription":
    "CyberNet clients will use the new metadata on their next version check.",
  "updates.saving": "Saving client update settings...",
  "updates.manualOnly":
    "In-app installation is disabled. Clients can still detect the version and open the verified download page.",
  "updates.automaticReady":
    "Signature-verified in-app installation is ready for supported signed platforms. Choose the rollout policy under Client settings; Windows and Linux remain manual until their production signing channels are ready.",
  "updates.automaticTitle": "Enable signed in-app updates",
  "updates.automaticDescription":
    "Advertise that this release has a published CyberNet signing chain and can be installed inside supported clients.",
  "updates.emptyVersion":
    "Leave the latest version empty when you do not want to announce an update.",
  "updates.available": "Update available",
  "updates.clientAvailableDescription":
    "{{product}} {{version}} is available. Update your client to get the latest features and fixes.",
  "updates.downloadClient": "Download client",
  "updates.releaseNotes": "Release notes",
  "updates.latest": "Latest: {{version}}",
  "updates.management": "CyberNet server",
  "updates.dashboard": "CyberNet dashboard",
  "user.profileSettings": "Profile settings",
  "user.changePassword": "Change password",
  "user.plansBilling": "Plans & billing",
  "help.title": "Help and support",
  "auth.problemTitle": "We couldn't sign you in",
  "auth.linkedTitle":
    "Your account has been linked. Sign in again to finish setup.",
  "auth.problemDescription":
    "CyberNet could not complete sign-in. Try again, and contact your administrator if the problem continues.",
  "auth.accessDeniedTitle": "Sign-in was denied",
  "auth.accessDeniedDescription":
    "Your account does not currently have permission to access CyberNet. Contact your administrator if you believe this is a mistake.",
  "auth.invalidRequestTitle": "The sign-in request is invalid",
  "auth.invalidRequestDescription":
    "The login request could not be completed. Restart sign-in from CyberNet and try again.",
  "auth.technicalDetails": "Technical details",
  "auth.errorCode": "Error code: {{code}}",
  "auth.verifiedQuestion": "Already verified your email address?",
  "auth.tryAgain": "Trouble signing in? Try again",
  "auth.errorPrefix": "Sign-in error:",
  "auth.sessionExpired": "Session expired",
  "auth.sessionExpiredDescription":
    "Your sign-in session is no longer active. Sign in again to continue using CyberNet.",
  "auth.login": "Sign in",
  "auth.signInAccount": "Sign in with your account",
  "auth.blockedTitle": "Account blocked",
  "auth.pendingTitle": "Approval pending",
  "auth.accessErrorTitle": "Access error",
  "auth.blockedDescription":
    "Your CyberNet administrator has blocked this account. Contact your administrator to restore access.",
  "auth.pendingDescription":
    "Your account is waiting for administrator approval. You can sign in after it is approved.",
  "auth.accessErrorDescription":
    "CyberNet couldn't complete this request. Try again or contact your administrator.",
  "auth.contactAdmin":
    "If you think this is a mistake, contact your administrator.",
  "install.title": "Install CyberNet",
  "install.withSetupKey": "Install CyberNet with a setup key",
  "install.welcome": "Hello {{name}}! Add your first device.",
  "install.userDescription":
    "Install CyberNet, then sign in with your account to connect this device.",
  "install.serverDescription":
    "Install CyberNet and run it with the setup key shown below.",
  "install.addDeviceTitle": "Add a device to your network",
  "install.addDeviceDescription":
    "Install CyberNet and sign in with your account. The device will then join your private network.",
  "install.installationGuide": "Installation guide",
  "install.generateSetupKey": "Generate a setup key",
  "install.setupKeyHelp":
    "A setup key is a one-time token for enrolling an unattended machine. Use it with the netbird up command and --setup-key.",
  "install.windows": "Install on Windows",
  "install.macos": "Install on macOS",
  "install.linux": "Install on Linux",
  "install.android": "Install on Android",
  "install.ios": "Install on iOS",
  "install.docker": "Install with Docker",
  "install.downloadInstaller": "Download the CyberNet installer",
  "install.downloadCyberNet": "Download CyberNet",
  "install.checkingDownload": "Checking for an available build...",
  "install.downloadUnavailable":
    "This build is coming soon. Contact your administrator if you need access now.",
  "install.desktopOpenAfterInstall": "Install the package, then open CyberNet.",
  "install.mobileOpenAfterInstall": "Install and open the CyberNet app.",
  "install.signInAndConnect":
    "Sign in with your CyberNet account. No server address, setup key, or command line is required.",
  "install.androidDownloadDescription":
    "Download the Android APK published by your administrator.",
  "install.downloadAndroid": "Download Android APK",
  "install.androidMigrationWarning":
    "If you installed the earlier 0.1.0 test APK, uninstall it once before installing 0.1.1. Future releases will upgrade normally.",
  "install.windowsUnsignedWarning":
    "This Windows x64 Beta is not yet code-signed. Windows may show a SmartScreen or unknown publisher warning during installation.",
  "install.iosDownloadDescription":
    "Install the iPhone and iPad app from your administrator's TestFlight invitation.",
  "install.openTestFlight": "Open TestFlight",
  "install.linuxScriptDescription":
    "Install the unmodified official NetBird package through verified China download accelerators:",
  "install.linuxRunAndSignIn":
    "Start CyberNet with this command, then finish account sign-in in your browser.",
  "install.linuxRunServer":
    "Start the unattended CyberNet client with the setup key:",
  "install.openTerminal": "Open a terminal and run CyberNet",
  "install.openCommandLine": "Open Command Prompt and run CyberNet",
  "install.connectTray":
    'Open CyberNet from the system tray and select "Connect".',
  "install.managementUrl":
    "In CyberNet, open Settings → Advanced settings and enter this management URL:",
  "install.mobileBuild":
    "The CyberNet mobile build is distributed by your administrator.",
  "install.dockerGuide": "Docker installation guide",
  "install.selectArchitecture": "Select architecture",
  "install.changeServer":
    'Select "Change server" and enter the following server address:',
  "install.connectButton": 'Select the "Connect" button.',
  "install.manualTerminal": "Install the command-line client manually",
  "install.packageManager": "Install with a package manager",
  "install.addRepository": "Add the CyberNet package repository",
  "install.installCli": "Install the CyberNet client",
  "install.runContainer": "Run the CyberNet container",
  "install.readDocs": "Read the documentation",
  "install.afterConnected":
    "After connecting, you can add more devices or manage existing devices in the admin panel.",
  "install.setupKeyOnce":
    "This setup key can be used once within the next 24 hours.",
  "install.generateKey": "Generate key",
  "install.setupKey": "Setup key",
  "install.setupKeyCreated": "Setup key created",
  "install.setupKeyCreatedDescription":
    "A one-time setup key was generated for this installation.",
  "install.setupKeyGenerating": "Generating setup key...",
  "install.setupKeyCopied": "Setup key copied",
  "install.copied": "Copied to clipboard.",
  "install.button": "Install CyberNet",
  "downloads.title": "Download CyberNet",
  "downloads.description":
    "Choose your platform, install CyberNet, and sign in with your account.",
  "downloads.accountReadyTitle": "Your account is all you need",
  "downloads.accountReadyDescription":
    "On macOS, Windows, Android, and iPhone/iPad, open CyberNet after installation and sign in. You do not need to enter a server address or setup key.",
  "downloads.loading": "Loading available downloads...",
  "downloads.unavailable": "Not published yet",
  "downloads.unavailableDescription":
    "Your administrator has not published a CyberNet build for this platform yet.",
  "downloads.configurationError":
    "Download information is temporarily unavailable. Try again later or contact your administrator.",
  "downloads.availableVersion": "Available version: {{version}}",
  "downloads.channel": "{{channel}} channel",
  "downloads.openDownload": "Get CyberNet",
  "downloads.releaseNotes": "Release notes",
  "downloads.platform.macos": "macOS",
  "downloads.platform.macosDescription":
    "Download the signed installer, install CyberNet, then open the app and sign in.",
  "downloads.platform.windows": "Windows",
  "downloads.platform.windowsDescription":
    "Download the Windows x64 Beta installer, complete setup, then open CyberNet and sign in.",
  "downloads.platform.linux": "Linux",
  "downloads.platform.linuxDescription":
    "Install the unmodified official NetBird package through China download accelerators, then connect it to CyberNet.",
  "downloads.platform.ios": "iPhone / iPad",
  "downloads.platform.iosDescription":
    "Join the TestFlight build, install CyberNet, then open the app and sign in.",
  "downloads.platform.android": "Android",
  "downloads.platform.androidDescription":
    "Download the Android APK, allow installation when prompted, then open CyberNet and sign in.",
  "downloads.action.macos": "Download for macOS",
  "downloads.action.windows": "Download for Windows",
  "downloads.action.ios": "Open TestFlight",
  "downloads.action.android": "Download Android APK",
  "downloads.action.androidUniversal":
    "Other Android devices: universal APK (larger file)",
  "downloads.action.linuxCopy": "Copy Linux install command",
  "downloads.action.linuxCopied": "Command copied",
  "downloads.action.linuxReview": "Review the installation script",
  "downloads.notice.windowsUnsigned":
    "Unsigned Beta: Windows may show a SmartScreen or unknown publisher warning.",
  "downloads.notice.androidMigration":
    "Installed the earlier 0.1.0 test APK? Uninstall it once before installing 0.1.1. Future versions can upgrade normally.",
  "downloads.linuxScriptTitle": "Verified official package · China accelerated",
  "downloads.linuxPackageVersion":
    "Official NetBird package: {{version}} · amd64 / arm64 / 386 / armv6",
  "downloads.linuxPasteHint":
    "The script tries two China accelerators first, verifies the official SHA256, and falls back to GitHub. It never adds the overseas NetBird APT or YUM repository.",
  "downloads.scriptCopied": "The installation command was copied.",
  "publicNav.label": "Public information",
  "publicNav.downloads": "Downloads",
  "publicNav.documentation": "Documentation",
  "publicNav.privacy": "Privacy",
  "publicNav.terms": "Terms",
  "publicFooter.beta": "CyberNet Beta · Product and policy information",
  "legal.effectiveDate": "Effective date",
  "legal.effectiveDateValue": "July 31, 2026",
  "privacy.eyebrow": "CyberNet Beta",
  "privacy.title": "Privacy Policy",
  "privacy.introduction":
    "This policy explains how the current CyberNet Beta service handles information when you use its apps and management service. It is a practical description of the beta service and may be updated as the product changes.",
  "privacy.data.title": "Information we process",
  "privacy.data.account":
    "Account identifiers needed to recognize and authenticate you, such as the identifier returned by the configured sign-in service.",
  "privacy.data.device":
    "Device, operating-system and client information needed to register and operate a peer.",
  "privacy.data.connection":
    "Network configuration and connection state, including CyberNet addresses, routing information, timestamps and online status.",
  "privacy.data.diagnostics":
    "Diagnostics that you choose to submit, such as logs, screenshots or details included in a support request.",
  "privacy.local.title": "Information kept on your device",
  "privacy.local.description":
    "When you configure automatic VPN rules, CyberNet may store selected Wi-Fi network names on your device. They are used locally to apply those rules and are not sent to the CyberNet management service unless you deliberately include them in diagnostics shared with support. Optional notifications are used for local sign-in reminders.",
  "privacy.use.title": "How we use information",
  "privacy.use.description":
    "We use this information to provide, test, secure and support CyberNet, including:",
  "privacy.use.authentication": "Authenticating accounts and sessions.",
  "privacy.use.network":
    "Registering devices and coordinating private-network connections.",
  "privacy.use.support":
    "Troubleshooting failures, responding to support requests and improving reliability.",
  "privacy.use.security":
    "Protecting accounts, detecting misuse and investigating security incidents.",
  "privacy.storage.title": "Storage and beta service providers",
  "privacy.storage.cybernet":
    "Information is stored in the CyberNet service environment used to provide your account and network.",
  "privacy.storage.processors":
    "During beta distribution and diagnostics, Apple TestFlight and, when crash reporting is enabled, Firebase Crashlytics may process relevant distribution, device, diagnostic or crash information under their own terms and privacy policies.",
  "privacy.storage.retention":
    "Retention depends on the type of information and the needs of beta operation, troubleshooting and security. You can contact us for details about information associated with your account.",
  "privacy.sale.title": "No sale of personal information",
  "privacy.sale.description":
    "CyberNet does not sell personal information. Service providers may process limited information only as needed to host, distribute, operate, diagnose or support the beta service.",
  "privacy.rights.title": "Your choices",
  "privacy.rights.description":
    "You may ask what identifiable information is associated with your account, request a correction, or request deletion. We may need to verify the request, and some information may need to be retained where necessary to protect the service or meet applicable requirements.",
  "privacy.contact.title": "Contact",
  "privacy.contact.description":
    "For privacy questions or an access or deletion request, email:",
  "privacy.changes":
    "If this policy changes, the effective date on this page will be updated. Where practical, material beta changes will also be communicated through the service.",
  "terms.eyebrow": "CyberNet Beta",
  "terms.title": "Beta Terms of Use",
  "terms.introduction":
    "These terms describe the rules for using CyberNet Beta. By using the beta service, you confirm that you understand and accept these rules. If you use it for an organization, follow that organization's authorization and policies.",
  "terms.betaNotice":
    "CyberNet is a beta service intended for evaluation and testing",
  "terms.authorization.title": "Authorized access only",
  "terms.authorization.description":
    "Use CyberNet only with accounts, devices, networks and resources that you own or are explicitly authorized to access. An organization administrator may define additional access rules.",
  "terms.account.title": "Account security",
  "terms.account.description":
    "Keep your credentials and devices secure, do not share access in a way that bypasses administrator controls, and promptly report suspected unauthorized use. You are responsible for activity performed through your account or enrolled devices to the extent under your control.",
  "terms.prohibited.title": "Prohibited use",
  "terms.prohibited.description": "You must not use CyberNet to:",
  "terms.prohibited.access":
    "Access accounts, systems, data or networks without permission.",
  "terms.prohibited.disrupt":
    "Disrupt, overload, probe or interfere with the service or another user's network.",
  "terms.prohibited.malware":
    "Distribute malware, harmful code or content intended to compromise a device.",
  "terms.prohibited.bypass":
    "Evade security controls, usage limits or administrator policies.",
  "terms.prohibited.illegal":
    "Carry out unlawful, fraudulent or abusive activity.",
  "terms.changes.title": "Beta changes and availability",
  "terms.changes.description":
    "Features, limits, compatibility and availability may change during the beta. The service may be updated, suspended or discontinued. Where practical, material planned changes will be communicated through the service.",
  "terms.termination.title": "Ending access",
  "terms.termination.description":
    "You may stop using CyberNet at any time by signing out and removing enrolled clients. The service operator or your administrator may suspend or end access when authorization ends, misuse is suspected, or action is needed to protect the service and its users.",
  "terms.asIs.title": "Beta provided as available",
  "terms.asIs.description":
    "CyberNet Beta is provided for evaluation and testing in its current state. Bugs, interruptions, compatibility problems or data loss may occur, and uninterrupted or error-free operation is not promised. Avoid relying on the beta as the only path to a critical system.",
  "terms.contact.title": "Questions",
  "terms.contact.description":
    "For questions about these terms or the beta service, email:",
  "docs.eyebrow": "CyberNet help",
  "docs.title": "Getting started",
  "docs.introduction":
    "Install CyberNet, sign in with your account, and use the management platform to control devices and network access.",
  "docs.signIn.title": "Sign in with your account",
  "docs.signIn.description":
    "After installing CyberNet on macOS, Windows, iPhone/iPad or Android, open the app and sign in with your CyberNet account.",
  "docs.signIn.noAddress":
    "No management address, setup key or command line is required on these platforms.",
  "docs.downloads.title": "Download the client",
  "docs.downloads.description":
    "The download center shows the currently published CyberNet builds and platform-specific beta notices.",
  "docs.downloads.action": "Open download center",
  "docs.linux.title": "Install on Linux",
  "docs.linux.description":
    "Install the unmodified official NetBird package through verified China download accelerators, then start the CyberNet sign-in flow:",
  "docs.linux.copy": "Copy",
  "docs.linux.copyDone": "Copied",
  "docs.linux.copied": "The Linux installation command was copied.",
  "docs.linux.afterInstall":
    "The script detects RPM/DEB and CPU architecture, verifies the SHA256 published for the official package, and then installs it. GitHub is used only as the final fallback.",
  "docs.admin.title": "Use the management platform",
  "docs.admin.description":
    "Administrators can review the network and control who can reach each resource. Available features depend on the account configuration.",
  "docs.admin.devices.title": "Devices and status",
  "docs.admin.devices.description":
    "Review registered peers, CyberNet addresses, owners, versions and recent online state.",
  "docs.admin.access.title": "Groups and access",
  "docs.admin.access.description":
    "Organize users and devices, then apply access policies to approved connections.",
  "docs.admin.routing.title": "Routes and network exit",
  "docs.admin.routing.description":
    "Publish private-network routes or, when enabled, choose an approved peer as an internet exit node.",
  "docs.admin.operations.title": "DNS and client settings",
  "docs.admin.operations.description":
    "Manage DNS behavior, local-service access options and client update information available to users.",
  "docs.support":
    "If your organization provides different instructions or permissions, follow its administrator's guidance. For CyberNet support, contact tech@aispea.com.",
  "docs.backToOverview": "Back to documentation overview",
  "docs.peers.eyebrow": "CyberNet documentation",
  "docs.peers.title": "Peers and devices",
  "docs.peers.introduction":
    "A peer is a device running CyberNet and registered to your account or organization.",
  "docs.peers.what.title": "What a peer contains",
  "docs.peers.what.description":
    "The management platform can show a peer's name, CyberNet address, owner, client and operating-system information, and recent connection state. Visibility depends on your role.",
  "docs.peers.status.title": "Understanding online status",
  "docs.peers.status.description":
    "Online status reflects the most recently reported management connection. Different clients and screens can refresh at slightly different times. Wait briefly and refresh; if the difference persists, check VPN permission, background operation and diagnostics on the device.",
  "docs.peers.connectivity.title": "Checking connectivity",
  "docs.peers.connectivity.description":
    "An online indicator does not by itself grant reachability. Access policies, routes, the destination service and the device firewall must also allow the connection.",
  "docs.peers.access.title": "SSH and local services",
  "docs.peers.access.description":
    "SSH or other local-service access must be enabled on the device and permitted by an access policy. Enable only the services required by authorized users and groups.",
  "docs.networks.eyebrow": "CyberNet documentation",
  "docs.networks.title": "Networks and routing",
  "docs.networks.introduction":
    "Routes connect authorized CyberNet peers to private networks or, when configured, an internet exit node.",
  "docs.networks.resources.title": "Private-network resources",
  "docs.networks.resources.description":
    "An administrator can describe an IP range or approved resource and select one or more routing peers that can reach it. Other users receive access only through the applicable policy.",
  "docs.networks.routes.title": "Routing peers",
  "docs.networks.routes.description":
    "A routing peer forwards traffic to a private LAN or VPC. Keep it online, confirm that forwarding and local firewalls allow the traffic, and provide redundancy where needed.",
  "docs.networks.exit.title": "Internet exit node",
  "docs.networks.exit.description":
    "When an administrator publishes and permits a default route, a user can choose that peer as an exit node so supported device traffic uses its internet connection.",
  "docs.networks.access.title": "Access remains explicit",
  "docs.networks.access.description":
    "Publishing a route does not automatically grant every user access. Use groups and access policies to limit each network, route and service to the intended users and devices.",
  "peers.title": "Peers",
  "peers.description":
    "User devices and servers connected to your private network.",
  "peers.serial": "Serial",
  "peers.getStartedTitle": "Get started with CyberNet",
  "peers.getStartedDescription":
    "It looks like you don't have any connected machines. Add one to your network to get started.",
  "peers.learnMore": "Learn more in our",
  "peers.gettingStartedGuide": "Getting started guide",
  "peers.productIp": "{{product}} IP",
  "peers.productIpv6": "{{product}} IPv6",
  "peers.publicIp": "Public IP",
  "peers.domain": "Domain",
  "peers.ipCopied": "{{label}} was copied to your clipboard.",
  "peers.accessibleDescription":
    "This peer can connect to the following peers in the {{product}} network.",
  "peers.routesDescription":
    "Access other networks without installing {{product}} on every resource.",
  "users.peersTitle": "Peers",
  "users.peersDescription": "View all peers registered by this user.",
  "users.noPeersTitle": "This user has no registered peers",
  "users.noPeersDescription":
    "Install {{product}} and sign in as this user to register peers.",
  "setup.welcome": "Welcome to CyberNet",
  "setup.description": "Create the first administrator account to get started.",
  "setup.name": "Name",
  "setup.namePlaceholder": "Your name",
  "setup.email": "Email",
  "setup.password": "Password",
  "setup.passwordPlaceholder": "Enter a strong password",
  "setup.passwordHelp": "Must be at least 8 characters",
  "setup.confirmPassword": "Confirm password",
  "setup.confirmPasswordPlaceholder": "Re-enter your password",
  "setup.create": "Create admin account",
  "setup.creating": "Creating account...",
  "setup.success": "Account created",
  "setup.redirecting": "Redirecting you to sign in in {{seconds}}s...",
  "setup.goLogin": "Go to sign in",
  "setup.oneTime": "This is a one-time setup for your CyberNet instance.",
  "setup.error.emailRequired": "Email is required",
  "setup.error.emailInvalid": "Enter a valid email address",
  "setup.error.passwordRequired": "Password is required",
  "setup.error.passwordLength": "Password must be at least 8 characters",
  "setup.error.confirmRequired": "Confirm your password",
  "setup.error.passwordMismatch": "Passwords do not match",
  "setup.error.nameRequired": "Name is required",
  "setup.error.generic": "Something went wrong. Try again.",
  "setup.error.invalid": "Invalid request. Check your input.",
  "setup.error.alreadyComplete":
    "Setup is already complete. Redirecting you to sign in...",
  "setup.error.validation": "Validation failed. Check your input.",
  "meta.setup": "Instance setup",
  "meta.invite": "Accept invitation",
  "meta.install": "Install CyberNet",
  "onboarding.title": "Getting started",
  "onboarding.skip": "Already know CyberNet? Skip setup",
  "invite.noToken": "No invitation token was provided.",
  "invite.rateLimited": "Too many attempts. Wait a moment and try again.",
  "invite.invalidError": "This invitation is invalid or has expired.",
  "invite.acceptFailed": "CyberNet couldn't create the account.",
  "invite.acceptInvalid":
    "The invitation could not be accepted. Check the password requirements and try again.",
  "invite.acceptUsed":
    "This invitation has already been used. Sign in with the account instead.",
  "invite.tooManyTitle": "Too many requests",
  "invite.invalidTitle": "Invalid invitation",
  "invite.invalidDescription":
    "This invitation is invalid or has expired. Ask your administrator for a new invitation.",
  "invite.expiredTitle": "Invitation expired",
  "invite.expiredDescription":
    "This invitation has expired. Ask your administrator for a new invitation.",
  "invite.login": "Go to sign in",
  "invite.successTitle": "Account created",
  "invite.successDescription":
    "Your CyberNet account is ready. You can now sign in with your email and password.",
  "invite.welcome": "Welcome to CyberNet",
  "invite.description":
    "{{inviter}} invited you to join the network. Choose a password to finish setting up your account.",
  "invite.password": "Password",
  "invite.confirmPassword": "Confirm password",
  "invite.passwordMismatch": "Passwords do not match",
  "invite.ruleLength": "At least 8 characters",
  "invite.ruleUppercase": "One uppercase letter",
  "invite.ruleLowercase": "One lowercase letter",
  "invite.ruleNumber": "One number",
  "invite.ruleSpecial": "One special character (!@#$%^&*)",
  "invite.creating": "Creating account...",
  "invite.create": "Create account",
  "invite.expires": "Invitation expires {{date}}",
  "common.back": "Back",
  "common.close": "Close",
  "common.save": "Save",
  "common.delete": "Delete",
  "accessTokens.title": "Access Tokens",
  "accessTokens.column.name": "Name",
  "accessTokens.column.expires": "Expires",
  "accessTokens.column.lastUsed": "Last used",
  "accessTokens.lastUsedOn": "Last used on",
  "accessTokens.emptyTitle": "No access tokens",
  "accessTokens.emptyDescription":
    "You don't have any access tokens yet. Add a token to access the {{product}} API.",
  "accessTokens.createTitle": "Create Access Token",
  "accessTokens.createDescription":
    "Use this token to access {{product}}'s public API.",
  "accessTokens.createdTitle": "Access token created successfully!",
  "accessTokens.createdDescription":
    "This token will not be shown again. Copy it now and store it in a secure location.",
  "accessTokens.copySuccess": "Access token copied to your clipboard!",
  "accessTokens.createFailed": "Access token could not be created...",
  "accessTokens.copyToClipboard": "Copy to clipboard",
  "accessTokens.creatingTitle": "Creating access token",
  "accessTokens.createdNotification": "{{name}} was created successfully.",
  "accessTokens.loading": "Creating access token...",
  "accessTokens.name": "Name",
  "accessTokens.nameHelp": "Choose an easily identifiable name for your token.",
  "accessTokens.namePlaceholder": "e.g., Infrastructure token",
  "accessTokens.expiresIn": "Expires in",
  "accessTokens.expiresHelp": "Enter a value between 1 and 365 days.",
  "accessTokens.days": "Day(s)",
  "accessTokens.learnMore": "Learn more about",
  "accessTokens.documentation": "Access Tokens",
  "accessTokens.create": "Create Token",
  "posture.createTitle": "Create Posture Check",
  "posture.updateTitle": "Update Posture Check",
  "posture.description":
    "Use posture checks to further restrict access in your network.",
  "posture.tab.checks": "Checks",
  "posture.tab.general": "Name & Description",
  "posture.nameLabel": "Name of the Posture Check",
  "posture.nameHelp":
    "Choose an easily identifiable name for your posture check.",
  "posture.namePlaceholder": "e.g., {{product}} Version > 0.25.0",
  "posture.descriptionLabel": "Description (optional)",
  "posture.descriptionHelp":
    "Write a short description to add more context to this posture check.",
  "posture.descriptionPlaceholder":
    "e.g., Check whether the {{product}} version is later than 0.25.0",
  "posture.learnMore": "Learn more about",
  "posture.documentation": "Posture Checks",
  "posture.saveChanges": "Save Changes",
  "posture.version.title": "{{product}} Client Version",
  "posture.version.description":
    "Restrict access to peers running a specific {{product}} client version.",
  "posture.version.minimum": "Minimum required version",
  "posture.version.minimumHelp":
    "Only peers running at least this {{product}} client version can access the network.",
  "posture.version.invalid":
    "Enter a valid version, e.g., 0.2, 0.2.0, or 0.2.0-alpha.1",
  "posture.version.prefix": "Version",
  "posture.version.documentation": "Client Version Check",
  "posture.process.title": "Process",
  "posture.process.description":
    "Restrict network access based on processes running on a peer.",
  "posture.process.label": "Processes",
  "posture.process.help":
    "Add an executable path for Linux, macOS, or Windows. A peer can connect only while the configured process is running.",
  "posture.process.invalidMac": "Enter a valid macOS file path",
  "posture.process.invalidLinux": "Enter a valid Unix file path",
  "posture.process.invalidWindows": "Enter a valid Windows file path",
  "posture.process.add": "Add Process",
  "posture.process.documentation": "Process Check",
  "posture.table.name": "Name",
  "posture.table.checks": "Checks",
  "posture.table.policies": "Policies",
  "posture.table.all": "All",
  "posture.table.active": "Active",
  "posture.table.inactive": "Inactive",
  "posture.table.status": "Status",
  "posture.table.feature": "Posture Checks",
  "posture.table.singular": "Posture Check",
  "posture.table.search": "Search by name and description...",
  "posture.table.add": "Add Posture Check",
  "posture.emptyTitle": "You haven't added any posture checks yet",
  "posture.emptyDescription":
    "Add posture checks to further restrict network access. For example, require a specific {{product}} client version, operating system, or location.",
  "posture.browse": "Browse Checks",
  "posture.new": "New Posture Check",
  "peerIp.editV4Title": "Edit Peer IP Address",
  "peerIp.editV6Title": "Edit Peer IPv6 Address",
  "peerIp.editV4Description":
    "Update the {{product}} IP address for this peer.",
  "peerIp.editV6Description":
    "Update the {{product}} IPv6 address for this peer.",
  "peerIp.invalidV4": "Enter a valid IP address, e.g., 100.64.0.15",
  "peerIp.invalidV6": "Enter a valid IPv6 address, e.g., fd00:1234::1",
  "peerIp.reconnectNotice": "Changes take effect when the peer reconnects.",
  "peerIssue.bypassed":
    "An administrator bypassed compliance for this peer. The bypass will be removed automatically when the device becomes compliant.",
  "peerIssue.loginExpired":
    "This peer's login has expired. Re-authenticate from the {{product}} client on the device to bring it back online.",
  "peerIssue.nonCompliant":
    "This peer is not compliant with {{integration}} and cannot connect until compliance is restored or bypassed.",
  "peerIssue.approvalRequired":
    "This peer needs administrator approval before it can connect. Approve it from the row's actions menu.",
  "peerAction.approveTitle": "Approve peer '{{name}}'?",
  "peerAction.approveDescription":
    "Are you sure you want to approve this peer?",
  "peerAction.approve": "Approve",
  "peerAction.approvedTitle": "Peer {{name}} approved",
  "peerAction.approvedDescription":
    "This peer was approved and can now connect to other peers.",
  "peerAction.approving": "Approving peer...",
  "peerAction.bypassTitle": "Bypass compliance for '{{name}}'?",
  "peerAction.bypassDescription":
    "This overrides the compliance check and allows the peer to connect. The bypass will be removed automatically when the device becomes compliant.",
  "peerAction.bypass": "Bypass Compliance",
  "peerAction.bypassedTitle": "Compliance bypassed for {{name}}",
  "peerAction.canConnect": "This peer can now connect to other peers.",
  "peerAction.bypassing": "Bypassing compliance...",
  "peerAction.revokeTitle": "Revoke compliance bypass for '{{name}}'?",
  "peerAction.revokeDescription":
    "This peer will return to normal compliance validation. If it is still non-compliant, it will lose network access.",
  "peerAction.revoke": "Revoke",
  "peerAction.revokedTitle": "Compliance bypass revoked",
  "peerAction.revokedDescription":
    "Peer {{name}} is now subject to normal compliance validation.",
  "peerAction.revoking": "Revoking compliance bypass...",
  "peerAction.sessionEnabledTitle": "Session expiration is enabled",
  "peerAction.sessionDisabledTitle": "Session expiration is disabled",
  "peerAction.sessionEnabledDescription":
    "Session expiration for peer {{name}} was enabled successfully.",
  "peerAction.sessionDisabledDescription":
    "Session expiration for peer {{name}} was disabled successfully.",
  "peerAction.sessionUpdating": "Updating session expiration...",
  "peerAction.disableSshTitle": "Disable SSH Access?",
  "peerAction.disableSshDescription":
    "Starting with {{product}} v0.61.0, SSH access cannot be re-enabled from the dashboard after it is disabled. Create an explicit access-control policy and update the {{product}} client to restore SSH functionality.",
  "peerAction.disable": "Disable",
  "peerAction.viewDetails": "View Details",
  "peerAction.bypassTooltip":
    "Bypass the {{integration}} compliance check and allow this peer to connect. The bypass is removed automatically when the device becomes compliant.",
  "peerAction.revokeBypass": "Revoke Bypass",
  "peerAction.setupKeyExpirationInfo":
    "Expiration is disabled for peers added with a setup key.",
  "peerAction.enableSessionExpiration": "Enable Session Expiration",
  "peerAction.disableSessionExpiration": "Disable Session Expiration",
  "peerAction.enableSsh": "Enable SSH Access",
  "peerAction.disableSsh": "Disable SSH Access",
} as const;

type TranslationKey = keyof typeof en;

const zhCN: Record<TranslationKey, string> = {
  "language.label": "语言",
  "language.chinese": "简体中文",
  "language.english": "English",
  "common.continue": "继续",
  "common.cancel": "取消",
  "common.retry": "重试",
  "common.logout": "退出登录",
  "common.learnMore": "了解更多",
  "common.download": "下载",
  "common.install": "安装",
  "common.copy": "复制",
  "common.copiedToClipboard": "已复制到剪贴板",
  "common.generate": "生成",
  "common.documentation": "使用文档",
  "common.troubleshooting": "故障排查",
  "common.feedback": "意见反馈",
  "common.sourceCode": "CyberNet 源代码",
  "common.beta": "测试版",
  "common.backToDashboard": "返回管理平台",
  "nav.controlCenter": "控制中心",
  "nav.peers": "对等节点",
  "nav.accessControl": "访问控制",
  "nav.policies": "策略",
  "nav.groups": "群组",
  "nav.postureChecks": "设备状态检查",
  "nav.networkRouting": "网络路由",
  "nav.networks": "网络",
  "nav.routes": "路由",
  "nav.reverseProxy": "反向代理",
  "nav.services": "服务",
  "nav.customDomains": "自定义域名",
  "nav.clusters": "集群",
  "nav.accessLogs": "访问日志",
  "nav.agentNetwork": "智能体网络",
  "nav.providers": "服务商",
  "nav.usageLogs": "用量与日志",
  "nav.configuration": "配置",
  "nav.dns": "DNS",
  "nav.nameservers": "名称服务器",
  "nav.zones": "区域",
  "nav.dnsSettings": "DNS 设置",
  "nav.team": "团队",
  "nav.users": "用户",
  "nav.serviceUsers": "服务用户",
  "nav.activity": "活动记录",
  "nav.auditEvents": "审计事件",
  "nav.trafficEvents": "流量事件",
  "nav.settings": "设置",
  "nav.integrations": "集成",
  "nav.documentation": "使用文档",
  "page.networks.description":
    "无需在每台机器上安装 CyberNet，即可访问局域网和 VPC 内部资源。",
  "page.routes.description": "通过路由节点访问其他局域网和 VPC 网络。",
  "page.routes.recommendation": "建议使用“网络”统一查看资源并管理访问关系。",
  "page.routes.goNetworks": "前往网络",
  "page.groups.description": "将节点、用户和资源组织成群组，统一管理访问权限。",
  "page.nameservers.description": "为 CyberNet 专属网络添加域名解析服务器。",
  "page.dnsSettings.description": "管理当前账号的 DNS 行为。",
  "page.postureChecks.description": "通过设备状态检查进一步限制网络访问。",
  "page.serviceUsers.description":
    "使用服务用户创建 API 令牌，避免自动化任务依赖个人账号。",
  "page.users.description": "管理用户及其权限；同域用户首次登录时会自动加入。",
  "page.accessControl.title": "访问控制策略",
  "page.accessControl.description": "控制用户和智能体可以访问哪些网络资源。",
  "page.audit.description": "查看配置、访问策略、节点注册和登录等审计事件。",
  // 活动与审计日志
  "activity.page.title": "审计事件",
  "activity.page.description":
    "查看 {{product}} 中的配置变更、节点活动和登录记录。",
  "activity.table.title": "审计事件",
  "activity.table.code": "事件代码",
  "activity.search.placeholder": "搜索事件、用户、节点或事件详情…",
  "activity.filter.type": "类型",
  "activity.filter.initiator": "发起人",
  "activity.filter.typeSearch": "搜索事件…",
  "activity.filter.typeCount": "{{count}} 种类型",
  "activity.empty.title": "暂无审计事件",
  "activity.empty.description":
    "{{product}} 中的配置变更和登录记录会显示在这里。",
  "activity.system": "系统",
  "activity.external": "外部",
  "activity.timestamp": "{{date}} {{time}}",
  "activity.value.unknown": "未知",
  "activity.description.from": "来自",
  "activity.description.fallback": "事件：{{activity}}",
  "activity.details.code": "事件代码",
  "activity.details.meta": "元数据",
  "activity.group.setupkey": "安装密钥",
  "activity.group.dashboard": "管理平台",
  "activity.group.policy": "策略",
  "activity.group.route": "路由",
  "activity.group.user": "用户",
  "activity.group.serviceUser": "服务用户",
  "activity.group.peer": "节点",
  "activity.group.group": "群组",
  "activity.group.account": "账号",
  "activity.group.nameserver": "名称服务器",
  "activity.group.personal": "访问令牌",
  "activity.group.integration": "集成",
  "activity.group.dns": "DNS",
  "activity.group.posture": "设备状态检查",
  "activity.group.network": "网络",
  "activity.group.identityprovider": "身份提供商",
  "activity.group.service": "服务",
  "activity.group.reseller": "分销商",
  "activity.description.setupKeyCreated": "安装密钥 {{name}}（{{key}}）已创建",
  "activity.description.setupKeyDeleted": "安装密钥 {{name}}（{{key}}）已删除",
  "activity.description.setupKeyRevoked": "安装密钥 {{name}}（{{key}}）已撤销",
  "activity.description.peerAddedWithSetupKey":
    "节点 {{name}} 已通过安装密钥 {{setupKey}} 加入，{{product}} IP 为 {{ip}}",
  "activity.description.dashboardLogin": "{{username}} 已登录管理平台",
  "activity.description.policyCreated": "策略 {{name}} 已创建",
  "activity.description.policyUpdated": "策略 {{name}} 已更新",
  "activity.description.policyDeleted": "策略 {{name}} 已删除",
  "activity.description.routeCreated": "路由 {{name}}（{{target}}）已创建",
  "activity.description.routeUpdated": "路由 {{name}}（{{target}}）已更新",
  "activity.description.routeDeleted": "路由 {{name}}（{{target}}）已删除",
  "activity.description.peerCreated":
    "节点 {{name}} 已添加，{{product}} IP 为 {{ip}}",
  "activity.description.peerUpdated":
    "节点 {{name}}（{{product}} IP：{{ip}}）已更新",
  "activity.description.peerDeleted":
    "节点 {{name}}（{{product}} IP：{{ip}}）已删除",
  "activity.description.userJoined": "用户 {{username}} 已加入 {{product}}",
  "activity.description.userInvited": "已邀请 {{username}}（{{email}}）",
  "activity.description.userCreated":
    "{{initiator}} 已创建用户 {{username}}（{{email}}）",
  "activity.description.userDeleted": "用户 {{username}}（{{email}}）已删除",
  "activity.description.userBlocked": "用户 {{username}}（{{email}}）已停用",
  "activity.description.userUnblocked": "用户 {{username}}（{{email}}）已恢复",
  "activity.description.userApproved": "用户 {{username}}（{{email}}）已批准",
  "activity.description.userRejected": "用户 {{username}}（{{email}}）已拒绝",
  "activity.description.serviceUserCreated": "服务用户 {{name}} 已创建",
  "activity.description.serviceUserDeleted": "服务用户 {{name}} 已删除",
  "activity.description.peerLoginExpired": "节点 {{name}} 的登录已过期",
  "activity.description.peerLoginExpiredReason":
    "节点 {{name}} 的登录已过期：{{reason}}",
  "activity.description.peerSshEnabled": "节点 {{name}} 的 SSH 服务已开启",
  "activity.description.peerSshDisabled": "节点 {{name}} 的 SSH 服务已关闭",
  "activity.description.peerRenamed": "节点 {{ip}} 已重命名为 {{name}}",
  "activity.description.peerApproved": "节点 {{ip}} 已批准",
  "activity.description.peerIpUpdated":
    "节点 {{name}} 的 IP 已从 {{oldIp}} 更新为 {{ip}}",
  "activity.description.groupCreated": "群组 {{name}} 已创建",
  "activity.description.groupUpdated":
    "群组 {{oldName}} 已重命名为 {{newName}}",
  "activity.description.groupDeleted": "群组 {{name}} 已删除",
  "activity.description.accountCreated": "{{initiator}} 已创建账号",
  "activity.description.globalLoginExpirationUpdated": "全局登录有效期已更新",
  "activity.description.globalLoginExpirationEnabled": "全局登录有效期已启用",
  "activity.description.globalLoginExpirationDisabled": "全局登录有效期已停用",
  "activity.description.accountNetworkRangeUpdated":
    "账号网段已从 {{oldRange}} 更新为 {{newRange}}",
  "activity.description.nameserverCreated": "名称服务器 {{name}} 已添加",
  "activity.description.nameserverUpdated": "名称服务器 {{name}} 已更新",
  "activity.description.nameserverDeleted": "名称服务器 {{name}} 已删除",
  "activity.description.accessTokenCreated":
    "用户 {{username}} 的访问令牌 {{name}} 已创建",
  "activity.description.accessTokenDeleted":
    "用户 {{username}} 的访问令牌 {{name}} 已删除",
  "activity.description.integrationCreated": "{{platform}} 集成已创建",
  "activity.description.integrationUpdated": "{{platform}} 集成已更新",
  "activity.description.integrationDeleted": "{{platform}} 集成已删除",
  "activity.description.postureCheckCreated": "设备状态检查 {{name}} 已创建",
  "activity.description.postureCheckUpdated": "设备状态检查 {{name}} 已更新",
  "activity.description.postureCheckDeleted": "设备状态检查 {{name}} 已删除",
  "activity.description.networkCreated": "网络 {{name}} 已创建",
  "activity.description.networkUpdated": "网络 {{name}} 已更新",
  "activity.description.networkDeleted": "网络 {{name}} 已删除",
  "activity.description.networkResourceCreated":
    "资源 {{name}} 已在网络 {{network}} 中创建",
  "activity.description.networkResourceUpdated":
    "网络 {{network}} 中的资源 {{name}} 已更新",
  "activity.description.networkResourceDeleted":
    "资源 {{name}} 已从网络 {{network}} 中删除",
  "activity.description.networkRouterCreated":
    "网络 {{network}} 已添加路由节点",
  "activity.description.networkRouterUpdated":
    "网络 {{network}} 的路由节点已更新",
  "activity.description.networkRouterDeleted":
    "网络 {{network}} 的路由节点已移除",
  "activity.description.identityProviderCreated": "身份提供商 {{name}} 已创建",
  "activity.description.identityProviderUpdated": "身份提供商 {{name}} 已更新",
  "activity.description.identityProviderDeleted": "身份提供商 {{name}} 已删除",
  "page.reverseProxy.description": "通过 CyberNet 反向代理安全发布服务。",
  "page.reverseProxy.beta":
    "CyberNet 反向代理目前处于测试阶段，正式发布前功能可能调整。",
  "settings.authentication": "身份认证",
  "settings.setupKeys": "设置密钥",
  "settings.identityProviders": "身份提供商",
  "settings.permissions": "权限",
  "settings.clients": "客户端",
  "settings.metrics": "指标",
  "settings.dangerZone": "危险操作",
  "danger.deleteTitle": "删除 {{product}} 账号",
  "danger.deleted": "{{product}} 账号已成功删除。",
  "danger.deleting": "正在删除账号…",
  "danger.confirm": "确定要删除你的 {{product}} 账号吗？此操作无法撤销。",
  "danger.description":
    "删除 {{product}} 账号后无法恢复。你将永久失去所有相关数据，包括对等节点、用户、群组、策略和路由。",
  "danger.deleteAccount": "删除账号",
  "clientSettings.autoUpdateDescription":
    "配置 {{product}} 客户端接收更新通知的方式。启用后，系统会提示用户安装所选版本。",
  "clientSettings.minimumVersion":
    "需要 {{product}} 客户端 {{version}} 或更高版本。",
  "clientSettings.autoUpdateWarning":
    "自动更新会在安装过程中重启 {{product}} 客户端，可能暂时中断当前连接，请在生产环境中谨慎使用。",
  "clientSettings.peerExposeDescription":
    "允许对等节点通过命令行使用 {{product}} 反向代理发布本地服务。",
  "clientSettings.lazyConnectionDescription":
    "{{product}} 不再持续保持所有连接，而是根据活动或信令按需建立连接。",
  "userInvite.localAccountDescription":
    "使用邮箱和密码创建 {{product}} 用户账号。",
  "routingPeer.installDescription":
    "在一台或多台机器上使用设置密钥安装 {{product}}，并将其用作路由节点。",
  "routingPeer.installConfirm":
    "继续后，系统会自动创建一次性设置密钥，供你安装 {{product}}。",
  "setupKeys.learnMore": "了解设置密钥",
  "groups.emptyPeersDescription":
    "安装 {{product}}，并将现有对等节点分配到此群组后，即可在这里查看。",
  "metrics.description":
    "共享连接耗时、同步耗时和登录延迟等性能指标，帮助我们改进 {{product}}。",
  "metrics.learnMore": "在使用文档中了解客户端指标。",
  "metrics.share": "共享性能指标",
  "metrics.shareHelp":
    "启用后，客户端会定期发送性能数据，以帮助发现和修复问题。",
  "metrics.enabled": "已开启性能指标共享。",
  "metrics.disabled": "已关闭性能指标共享。",
  "metrics.updating": "正在更新指标设置…",
  "ssh.enableTitle": "开启 SSH 访问",
  "ssh.enableDescription": "允许专属网络中的其他成员通过 SSH 远程访问。",
  "ssh.cliInstruction":
    "如果使用 {{product}} 命令行客户端，请运行以下命令开启 SSH 服务：",
  "ssh.desktopInstruction":
    "从系统托盘打开 {{product}}，进入“设置”并开启“允许 SSH”。如需允许 root 登录，请前往“设置 → 高级设置 → SSH”并开启 SSH Root Login。",
  "ssh.policyRequirement":
    "从 {{product}} v0.61.0 开始，SSH 需要为此设备配置明确的访问控制策略。",
  "ssh.createPolicy": "创建 SSH 策略",
  "ssh.finishInstruction": "客户端允许 SSH 服务后，点击下方“完成设置”。",
  "ssh.learnMore": "了解 SSH",
  "ssh.finishSetup": "完成设置",
  "ssh.disableTitle": "关闭 SSH 访问？",
  "ssh.disableDescription":
    "从 {{product}} v0.61.0 开始，关闭 SSH 后无法再从管理平台直接开启。请创建明确的访问控制策略，并更新 {{product}} 客户端以恢复 SSH 功能。",
  "ssh.disable": "关闭",
  "ssh.oldClientWarning":
    "已配置 SSH 访问，但此设备使用较旧的 {{product}} 版本。请更新到 v0.61.0 或更高版本。",
  "ssh.policyRequiredWarning":
    "SSH 服务已开启，但 {{product}} v0.61.0 及更高版本需要明确的访问控制策略。请创建 SSH 策略以允许连接。",
  "onboarding.complete": "你已完成初始引导。",
  "onboarding.congratulations": "恭喜，{{name}}！",
  "onboarding.congratulationsGeneric": "恭喜！",
  "onboarding.next":
    "查看以下指南以进一步了解 {{product}}，也可以直接进入管理平台或使用文档。",
  "onboarding.accessTitle": "访问控制",
  "onboarding.accessDescription": "了解如何管理设备和用户对网络资源的访问。",
  "onboarding.identityTitle": "同步用户与群组",
  "onboarding.identityDescription":
    "连接身份提供商，自动完成用户和群组的加入与移除。",
  "onboarding.architectureTitle": "{{product}} 工作原理",
  "onboarding.architectureDescription":
    "了解 {{product}} 如何安全连接用户、设备和私有资源。",
  "onboarding.goDashboard": "进入管理平台",
  "reverseProxy.privateTitle": "专属网络访问",
  "reverseProxy.privateDescription":
    "仅所选 {{product}} 群组中的已连接对等节点可以访问。",
  "reverseProxy.privateMissingGroups":
    "已开启专属网络访问，但尚未选择访问群组。请在“身份认证”中至少选择一个群组。",
  "reverseProxy.privateRequiresCluster":
    "专属网络访问需要代理集群中至少有一个已连接的内嵌代理（netbird proxy）。",
  "reverseProxy.privateCallout":
    "此服务只能通过 {{product}} 访问。系统会先应用专属网络范围的默认允许规则，再叠加下方的其他规则。",
  "reverseProxy.targetPeerDescription":
    "选择一台运行 {{product}} 的设备或服务器。",
  "reverseProxy.targetResourceDescription":
    "选择可通过 {{product}} 访问的资源。资源属于网络，并通过路由节点访问。",
  "reverseProxy.emptyResources":
    "创建资源，并通过 {{product}} 反向代理安全发布服务。",
  "reverseProxy.emptyServices":
    "通过 {{product}} 反向代理、自动 TLS 和可选身份认证安全发布内部服务。",
  "reverseProxy.customDomainsDescription":
    "为 {{product}} 反向代理使用自有域名。请添加指向代理集群的 CNAME 记录并验证所有权。",
  "reverseProxy.dnsPropagation":
    "DNS 变更可能需要一段时间才能生效。如果 {{product}} 未立即找到记录，请等待最多 24 小时后重试。",
  "reverseProxy.clusterRegistered": "代理已在 {{product}} 注册并连接。",
  "reverseProxy.clusterWaiting": "正在等待代理注册到 {{product}}…",
  "reverseProxy.clusterTokenPrivate":
    "令牌仅保留在浏览器中，不会发送到 {{product}} 服务器，完成设置后即可删除。",
  "reverseProxy.clusterTokenNotStored":
    "创建具有所需权限的令牌。{{product}} 不会存储此令牌。",
  "reverseProxy.selfHostedRoutingWarning":
    "自托管部署需要先在 {{product}} 管理服务器上配置代理服务路由，再启动代理。",
  "integrations.connectWith": "连接 {{product}} 与 {{integration}}",
  "integrations.title": "集成",
  "integrations.idpTitle": "身份提供商同步",
  "integrations.syncStart":
    "开始将 {{integration}} 的用户和群组同步到 {{product}}。请按以下步骤完成配置。",
  "integrations.syncSummary":
    "将 {{integration}} 的用户和群组同步到 {{product}}。",
  "integrations.connected": "{{integration}} 已成功连接到 {{product}}。",
  "integrations.deleteSync":
    "删除此集成后，将停止与 {{product}} 的用户和群组同步。如需恢复同步，请重新配置集成。",
  "integrations.idpDescription":
    "连接身份提供商，将用户和群组同步到 {{product}}。",
  "integrations.eventDescription":
    "将 {{product}} 的审计事件和流量事件发送到外部目标。",
  "updates.tab": "品牌与客户端更新",
  "updates.title": "品牌与客户端更新",
  "updates.description":
    "配置 CyberNet 的公开品牌信息和客户端看到的最新版本。只有账号所有者可以修改这些实例级设置。",
  "updates.productName": "产品名称",
  "updates.logoUrl": "Logo 地址",
  "updates.defaultLanguage": "默认语言",
  "updates.channel": "发布通道",
  "updates.channel.stable": "稳定版",
  "updates.channel.beta": "测试版",
  "updates.channel.rc": "候选版",
  "updates.latestVersion": "最新客户端版本",
  "updates.releaseNotesUrl": "更新说明地址",
  "updates.downloadUrl": "默认下载地址",
  "updates.versionCheckUrl": "客户端版本检查地址",
  "updates.platformUrls": "各平台下载地址",
  "updates.macosUrl": "macOS",
  "updates.windowsUrl": "Windows",
  "updates.linuxUrl": "Linux",
  "updates.iosUrl": "iOS",
  "updates.androidUrl": "Android",
  "updates.save": "保存修改",
  "updates.saved": "更新设置已保存",
  "updates.savedDescription": "CyberNet 客户端下次检查版本时会使用新配置。",
  "updates.saving": "正在保存客户端更新设置…",
  "updates.manualOnly":
    "软件内安装当前已关闭；客户端仍可检查版本并打开经过验证的下载页面。",
  "updates.automaticReady":
    "已为支持的平台启用签名校验后的软件内安装。请在“客户端”设置中选择推送策略；Windows 和 Linux 在正式签名渠道就绪前仍采用手动更新。",
  "updates.automaticTitle": "启用签名验证的软件内更新",
  "updates.automaticDescription":
    "表示此版本已经发布 CyberNet 自有签名链，支持的客户端可以直接在软件内完成安装。",
  "updates.emptyVersion": "不希望发布更新时，请将最新版本留空。",
  "updates.available": "发现新版本",
  "updates.clientAvailableDescription":
    "{{product}} {{version}} 已发布。请更新客户端以获取最新功能与问题修复。",
  "updates.downloadClient": "下载客户端",
  "updates.releaseNotes": "更新说明",
  "updates.latest": "最新版本：{{version}}",
  "updates.management": "CyberNet 服务端",
  "updates.dashboard": "CyberNet 管理平台",
  "user.profileSettings": "个人设置",
  "user.changePassword": "修改密码",
  "user.plansBilling": "套餐与账单",
  "help.title": "帮助与支持",
  "auth.problemTitle": "登录失败",
  "auth.linkedTitle": "账号已关联，请重新登录以完成设置。",
  "auth.problemDescription":
    "CyberNet 暂时无法完成登录，请重试；如果问题持续存在，请联系管理员。",
  "auth.accessDeniedTitle": "当前账号无法登录",
  "auth.accessDeniedDescription":
    "此账号目前没有访问 CyberNet 的权限。如果你认为这是误操作，请联系管理员。",
  "auth.invalidRequestTitle": "登录请求无效",
  "auth.invalidRequestDescription":
    "本次登录请求无法完成，请从 CyberNet 重新发起登录后再试。",
  "auth.technicalDetails": "技术详情",
  "auth.errorCode": "错误代码：{{code}}",
  "auth.verifiedQuestion": "已经完成邮箱验证？",
  "auth.tryAgain": "仍然无法登录？重新尝试",
  "auth.errorPrefix": "登录错误：",
  "auth.sessionExpired": "登录已过期",
  "auth.sessionExpiredDescription":
    "当前登录会话已失效，请重新登录后继续使用 CyberNet。",
  "auth.login": "登录",
  "auth.signInAccount": "使用你的账号登录",
  "auth.blockedTitle": "账号已被停用",
  "auth.pendingTitle": "等待管理员审核",
  "auth.accessErrorTitle": "访问失败",
  "auth.blockedDescription":
    "CyberNet 管理员已停用此账号，请联系管理员恢复访问。",
  "auth.pendingDescription": "你的账号正在等待管理员审核，审核通过后即可登录。",
  "auth.accessErrorDescription":
    "CyberNet 暂时无法完成该请求，请重试或联系管理员。",
  "auth.contactAdmin": "如果你认为这是误操作，请联系管理员。",
  "install.title": "安装 CyberNet",
  "install.withSetupKey": "使用设置密钥安装 CyberNet",
  "install.welcome": "你好，{{name}}！现在添加你的第一台设备。",
  "install.userDescription":
    "安装 CyberNet，然后使用你的账号登录，即可连接这台设备。",
  "install.serverDescription": "安装 CyberNet，并使用下方设置密钥运行客户端。",
  "install.addDeviceTitle": "添加设备到你的网络",
  "install.addDeviceDescription":
    "安装 CyberNet 并使用你的账号登录，设备随后会加入你的专属网络。",
  "install.installationGuide": "安装指南",
  "install.generateSetupKey": "生成设置密钥",
  "install.setupKeyHelp":
    "设置密钥是用于接入无人值守设备的一次性令牌，请在 netbird up 命令中配合 --setup-key 使用。",
  "install.windows": "在 Windows 上安装",
  "install.macos": "在 macOS 上安装",
  "install.linux": "在 Linux 上安装",
  "install.android": "在 Android 上安装",
  "install.ios": "在 iOS 上安装",
  "install.docker": "使用 Docker 安装",
  "install.downloadInstaller": "下载 CyberNet 安装程序",
  "install.downloadCyberNet": "下载 CyberNet",
  "install.checkingDownload": "正在检查可用安装包…",
  "install.downloadUnavailable":
    "该平台安装包即将提供；如需立即使用，请联系管理员。",
  "install.desktopOpenAfterInstall": "完成安装后，打开 CyberNet 客户端。",
  "install.mobileOpenAfterInstall": "完成安装后，打开 CyberNet App。",
  "install.signInAndConnect":
    "使用 CyberNet 账号登录即可连接，无需填写服务器地址、设置密钥，也无需使用命令行。",
  "install.androidDownloadDescription": "下载管理员发布的 Android APK 安装包。",
  "install.downloadAndroid": "下载 Android APK",
  "install.androidMigrationWarning":
    "如果安装过早期 0.1.0 测试 APK，请先卸载一次再安装 0.1.1；后续版本即可正常覆盖升级。",
  "install.windowsUnsignedWarning":
    "当前 Windows x64 Beta 暂未进行代码签名，安装时 Windows 可能显示 SmartScreen 或“未知发布者”提醒。",
  "install.iosDownloadDescription":
    "通过管理员提供的 TestFlight 邀请安装 iPhone 和 iPad 客户端。",
  "install.openTestFlight": "打开 TestFlight",
  "install.linuxScriptDescription":
    "通过国内加速源下载安装未经修改的 NetBird 官方原版软件包：",
  "install.linuxRunAndSignIn":
    "运行以下命令启动 CyberNet，然后在浏览器中完成账号登录。",
  "install.linuxRunServer": "使用设置密钥启动无人值守的 CyberNet 客户端：",
  "install.openTerminal": "打开终端并运行 CyberNet",
  "install.openCommandLine": "打开命令提示符并运行 CyberNet",
  "install.connectTray": "从系统托盘打开 CyberNet，然后选择“连接”。",
  "install.managementUrl":
    "在 CyberNet 中打开“设置 → 高级设置”，并填写以下管理地址：",
  "install.mobileBuild": "CyberNet 手机客户端由你的管理员提供。",
  "install.dockerGuide": "Docker 安装指南",
  "install.selectArchitecture": "选择架构",
  "install.changeServer": "选择“更换服务器”，并填写以下服务器地址：",
  "install.connectButton": "点击“连接”按钮。",
  "install.manualTerminal": "手动安装命令行客户端",
  "install.packageManager": "使用包管理器安装",
  "install.addRepository": "添加 CyberNet 软件源",
  "install.installCli": "安装 CyberNet 客户端",
  "install.runContainer": "运行 CyberNet 容器",
  "install.readDocs": "查看使用文档",
  "install.afterConnected":
    "连接成功后，你可以继续添加设备，或在管理平台维护现有设备。",
  "install.setupKeyOnce": "此设置密钥仅可使用一次，并将在 24 小时后过期。",
  "install.generateKey": "生成密钥",
  "install.setupKey": "设置密钥",
  "install.setupKeyCreated": "设置密钥已创建",
  "install.setupKeyCreatedDescription": "已为本次安装生成一次性设置密钥。",
  "install.setupKeyGenerating": "正在生成设置密钥…",
  "install.setupKeyCopied": "设置密钥已复制",
  "install.copied": "已复制到剪贴板。",
  "install.button": "安装 CyberNet",
  "downloads.title": "下载 CyberNet",
  "downloads.description":
    "选择设备平台，安装 CyberNet，然后使用你的账号登录。",
  "downloads.accountReadyTitle": "只需 CyberNet 账号即可使用",
  "downloads.accountReadyDescription":
    "macOS、Windows、Android 和 iPhone/iPad 安装后直接打开 CyberNet 并登录，无需填写服务器地址或设置密钥。",
  "downloads.loading": "正在获取可用安装包…",
  "downloads.unavailable": "暂未发布",
  "downloads.unavailableDescription":
    "管理员尚未发布该平台的 CyberNet 安装包。",
  "downloads.configurationError":
    "暂时无法获取下载配置，请稍后重试或联系管理员。",
  "downloads.availableVersion": "可用版本：{{version}}",
  "downloads.channel": "{{channel}} 通道",
  "downloads.openDownload": "获取 CyberNet",
  "downloads.releaseNotes": "查看更新说明",
  "downloads.platform.macos": "macOS",
  "downloads.platform.macosDescription":
    "下载已签名的安装程序，完成安装后打开 CyberNet 并登录。",
  "downloads.platform.windows": "Windows",
  "downloads.platform.windowsDescription":
    "下载 Windows x64 Beta 安装程序，完成安装后打开 CyberNet 并登录。",
  "downloads.platform.linux": "Linux",
  "downloads.platform.linuxDescription":
    "通过国内加速源安装未经修改的 NetBird 官方原版软件包，然后连接到 CyberNet。",
  "downloads.platform.ios": "iPhone / iPad",
  "downloads.platform.iosDescription":
    "通过 TestFlight 安装 CyberNet，打开 App 后使用账号登录。",
  "downloads.platform.android": "Android",
  "downloads.platform.androidDescription":
    "下载 Android APK，按系统提示允许安装，然后打开 CyberNet 并登录。",
  "downloads.action.macos": "下载 macOS 版",
  "downloads.action.windows": "下载 Windows 版",
  "downloads.action.ios": "打开 TestFlight",
  "downloads.action.android": "下载 Android APK",
  "downloads.action.androidUniversal": "其他安卓设备：通用 APK（文件较大）",
  "downloads.action.linuxCopy": "复制 Linux 安装命令",
  "downloads.action.linuxCopied": "命令已复制",
  "downloads.action.linuxReview": "查看并审阅安装脚本",
  "downloads.notice.windowsUnsigned":
    "未签名 Beta：安装时 Windows 可能显示 SmartScreen 或“未知发布者”提醒。",
  "downloads.notice.androidMigration":
    "安装过早期 0.1.0 测试 APK？请先卸载一次再安装 0.1.1；后续版本可正常覆盖升级。",
  "downloads.linuxScriptTitle": "官方原版软件包 · 国内加速下载",
  "downloads.linuxPackageVersion":
    "NetBird 官方包：{{version}} · 支持 amd64 / arm64 / 386 / armv6",
  "downloads.linuxPasteHint":
    "脚本优先尝试两个国内加速入口，强制校验官方 SHA256，最后才回退 GitHub；不会添加境外 NetBird APT/YUM 软件源。",
  "downloads.scriptCopied": "安装命令已复制。",
  "publicNav.label": "公开信息",
  "publicNav.downloads": "下载",
  "publicNav.documentation": "使用文档",
  "publicNav.privacy": "隐私",
  "publicNav.terms": "条款",
  "publicFooter.beta": "CyberNet 测试版 · 产品与政策信息",
  "legal.effectiveDate": "生效日期",
  "legal.effectiveDateValue": "2026 年 7 月 31 日",
  "privacy.eyebrow": "CyberNet 测试版",
  "privacy.title": "隐私政策",
  "privacy.introduction":
    "本政策说明当前 CyberNet 测试版 App 与管理服务在用户使用过程中如何处理信息。内容以谨慎、实用地描述现阶段测试服务为目的，并可能随产品变化而更新。",
  "privacy.data.title": "我们处理的信息",
  "privacy.data.account":
    "用于识别和认证用户的账号标识，例如由当前登录服务返回的用户标识。",
  "privacy.data.device": "注册和运行节点所需的设备、操作系统与客户端信息。",
  "privacy.data.connection":
    "网络配置与连接状态，包括 CyberNet 地址、路由信息、时间记录和在线状态。",
  "privacy.data.diagnostics":
    "用户主动提交的诊断资料，例如日志、截图或支持请求中提供的故障信息。",
  "privacy.local.title": "仅保存在设备上的信息",
  "privacy.local.description":
    "当你配置 VPN 自动连接规则时，CyberNet 可能在设备上保存所选 Wi-Fi 网络名称，仅用于在本机匹配并执行这些规则；除非你主动将其包含在提交给技术支持的诊断资料中，否则不会发送到 CyberNet 管理服务。可选通知仅用于本地的重新登录提醒。",
  "privacy.use.title": "信息用途",
  "privacy.use.description":
    "我们使用这些信息来提供、测试、保护和支持 CyberNet，包括：",
  "privacy.use.authentication": "认证账号与登录会话。",
  "privacy.use.network": "注册设备并协调专属网络连接。",
  "privacy.use.support": "排查故障、响应支持请求并改进可靠性。",
  "privacy.use.security": "保护账号、识别滥用并调查安全事件。",
  "privacy.storage.title": "存储与测试服务提供方",
  "privacy.storage.cybernet":
    "信息存储在为你的账号和网络提供服务的 CyberNet 服务环境中。",
  "privacy.storage.processors":
    "在测试分发和诊断期间，Apple TestFlight 以及在启用崩溃报告时的 Firebase Crashlytics，可能按照各自的条款与隐私政策处理相关的分发、设备、诊断或崩溃信息。",
  "privacy.storage.retention":
    "保存时间取决于信息类型以及测试运营、故障排查与安全工作的需要。你可以联系我们，查询与账号相关信息的具体情况。",
  "privacy.sale.title": "不出售个人信息",
  "privacy.sale.description":
    "CyberNet 不出售个人信息。服务提供方仅可在托管、分发、运行、诊断或支持测试服务所必要的范围内处理有限信息。",
  "privacy.rights.title": "你的选择",
  "privacy.rights.description":
    "你可以查询账号关联的可识别信息、请求更正或请求删除。我们可能需要验证请求；为保护服务或满足适用要求，部分信息可能仍需保留。",
  "privacy.contact.title": "联系我们",
  "privacy.contact.description":
    "如需咨询隐私问题，或提出查询、删除请求，请发送邮件至：",
  "privacy.changes":
    "本政策更新时，页面上的生效日期会同步调整。在可行情况下，测试期间的重要变更也会通过服务进行说明。",
  "terms.eyebrow": "CyberNet 测试版",
  "terms.title": "测试版使用条款",
  "terms.introduction":
    "本条款说明使用 CyberNet 测试版时需要遵守的规则。使用测试服务即表示你理解并接受这些规则；代表组织使用时，还应遵守该组织的授权和管理要求。",
  "terms.betaNotice": "CyberNet 是用于评估和测试的 Beta 服务",
  "terms.authorization.title": "仅限获得授权的访问",
  "terms.authorization.description":
    "仅可使用你拥有或已获明确授权的账号、设备、网络和资源。组织管理员可能设置额外的访问规则。",
  "terms.account.title": "账号安全",
  "terms.account.description":
    "请妥善保护登录凭据与设备，不要通过共享访问绕过管理员控制，并及时报告疑似未授权使用。对于你能够控制的账号或已注册设备活动，应承担相应管理责任。",
  "terms.prohibited.title": "禁止行为",
  "terms.prohibited.description": "不得使用 CyberNet 从事以下行为：",
  "terms.prohibited.access": "未经许可访问账号、系统、数据或网络。",
  "terms.prohibited.disrupt": "干扰、过载、探测服务或影响其他用户的网络。",
  "terms.prohibited.malware": "传播恶意软件、有害代码或用于入侵设备的内容。",
  "terms.prohibited.bypass": "规避安全控制、使用限制或管理员策略。",
  "terms.prohibited.illegal": "从事违法、欺诈或滥用活动。",
  "terms.changes.title": "测试期间的变化与可用性",
  "terms.changes.description":
    "测试期间，功能、限制、兼容性与可用性可能发生变化；服务也可能更新、暂停或停止。在可行情况下，计划中的重要变化会通过服务进行说明。",
  "terms.termination.title": "终止访问",
  "terms.termination.description":
    "你可以随时退出账号并移除已注册客户端以停止使用。授权结束、疑似存在滥用，或需要保护服务与用户时，服务运营方或组织管理员可以暂停或终止访问。",
  "terms.asIs.title": "按当前可用状态提供",
  "terms.asIs.description":
    "CyberNet 测试版按当前状态用于评估与测试，可能出现缺陷、中断、兼容性问题或数据丢失，也不承诺始终连续、无错误运行。请勿将测试版作为访问关键系统的唯一通道。",
  "terms.contact.title": "问题咨询",
  "terms.contact.description": "如对本条款或测试服务有疑问，请发送邮件至：",
  "docs.eyebrow": "CyberNet 帮助",
  "docs.title": "快速开始",
  "docs.introduction":
    "安装 CyberNet，使用账号登录，然后通过管理平台维护设备和网络访问关系。",
  "docs.signIn.title": "使用账号登录",
  "docs.signIn.description":
    "在 macOS、Windows、iPhone/iPad 或 Android 安装 CyberNet 后，打开 App 并使用 CyberNet 账号登录。",
  "docs.signIn.noAddress":
    "这些平台无需填写管理地址、设置密钥，也不需要运行命令行。",
  "docs.downloads.title": "下载客户端",
  "docs.downloads.description":
    "下载中心会展示当前已发布的 CyberNet 安装包，以及各平台需要注意的测试版说明。",
  "docs.downloads.action": "打开下载中心",
  "docs.linux.title": "在 Linux 上安装",
  "docs.linux.description":
    "通过国内加速源下载安装未经修改的 NetBird 官方原版软件包，然后启动 CyberNet 登录流程：",
  "docs.linux.copy": "复制",
  "docs.linux.copyDone": "已复制",
  "docs.linux.copied": "Linux 安装命令已复制。",
  "docs.linux.afterInstall":
    "脚本会自动识别 RPM/DEB 与处理器架构，校验官方软件包 SHA256 后再安装；仅在国内加速源均失败时回退 GitHub。",
  "docs.admin.title": "使用管理平台",
  "docs.admin.description":
    "管理员可以查看专属网络状态，并控制不同用户可以访问的资源。具体功能取决于账号配置。",
  "docs.admin.devices.title": "设备与状态",
  "docs.admin.devices.description":
    "查看已注册节点、CyberNet 地址、所属用户、客户端版本与最近在线状态。",
  "docs.admin.access.title": "群组与访问控制",
  "docs.admin.access.description":
    "组织用户和设备，并通过访问策略仅允许经过批准的连接。",
  "docs.admin.routing.title": "路由与网络出口",
  "docs.admin.routing.description":
    "发布私有网络路由；功能开启后，还可选择已批准的节点作为互联网出口。",
  "docs.admin.operations.title": "DNS 与客户端设置",
  "docs.admin.operations.description":
    "管理 DNS、本地服务访问选项，以及面向用户的客户端更新信息。",
  "docs.support":
    "如果组织提供了不同的操作说明或权限要求，请以管理员的指引为准。CyberNet 技术支持：tech@aispea.com。",
  "docs.backToOverview": "返回文档首页",
  "docs.peers.eyebrow": "CyberNet 使用文档",
  "docs.peers.title": "对等节点与设备",
  "docs.peers.introduction":
    "对等节点是安装 CyberNet 并注册到你的账号或组织中的设备。",
  "docs.peers.what.title": "节点信息",
  "docs.peers.what.description":
    "管理平台可展示节点名称、CyberNet 地址、所属用户、客户端与操作系统信息，以及最近连接状态；实际可见内容取决于你的权限。",
  "docs.peers.status.title": "理解在线状态",
  "docs.peers.status.description":
    "在线状态反映最近一次上报的管理连接。不同客户端与页面的刷新时间可能略有差异，可稍等片刻后刷新；如果差异持续存在，请检查设备上的 VPN 权限、后台运行状态和诊断信息。",
  "docs.peers.connectivity.title": "检查连通性",
  "docs.peers.connectivity.description":
    "显示在线并不代表一定允许互访；还需要访问策略、路由、目标服务和设备防火墙同时允许连接。",
  "docs.peers.access.title": "SSH 与本地服务",
  "docs.peers.access.description":
    "SSH 或其他本地服务需要在设备端明确开启，并由访问策略放行。请仅向获得授权的用户和群组开放实际需要的服务。",
  "docs.networks.eyebrow": "CyberNet 使用文档",
  "docs.networks.title": "网络与路由",
  "docs.networks.introduction":
    "通过路由，获得授权的 CyberNet 节点可以访问私有网络，或在配置后使用指定的互联网出口节点。",
  "docs.networks.resources.title": "私有网络资源",
  "docs.networks.resources.description":
    "管理员可以定义 IP 网段或获准访问的资源，并选择能够连接这些资源的一个或多个路由节点；其他用户仅通过相应策略获得访问权限。",
  "docs.networks.routes.title": "路由节点",
  "docs.networks.routes.description":
    "路由节点负责将流量转发到局域网或 VPC。请保持节点在线，确认转发与本机防火墙允许流量，并在需要时配置冗余。",
  "docs.networks.exit.title": "互联网出口节点",
  "docs.networks.exit.description":
    "管理员发布并授权默认路由后，用户可以选择该节点作为网络出口，让受支持设备的流量使用该节点的互联网连接。",
  "docs.networks.access.title": "权限始终需要明确配置",
  "docs.networks.access.description":
    "发布路由不会自动向所有用户开放访问。请通过群组和访问策略，将每个网络、路由与服务限定给预期的用户和设备。",
  "peers.title": "对等节点",
  "peers.description": "已连接到专属网络的用户设备与服务器。",
  "peers.serial": "序列号",
  "peers.getStartedTitle": "开始使用 CyberNet",
  "peers.getStartedDescription":
    "当前还没有已连接的设备，请先添加一台设备到你的网络。",
  "peers.learnMore": "更多信息请查看",
  "peers.gettingStartedGuide": "入门指南",
  "peers.productIp": "{{product}} IP",
  "peers.productIpv6": "{{product}} IPv6",
  "peers.publicIp": "公网 IP",
  "peers.domain": "域名",
  "peers.ipCopied": "{{label}} 已复制到剪贴板。",
  "peers.accessibleDescription":
    "此节点可以连接到 {{product}} 专属网络中的以下节点。",
  "peers.routesDescription":
    "无需在每个资源上安装 {{product}}，即可访问其他网络。",
  "users.peersTitle": "对等节点",
  "users.peersDescription": "查看此用户注册的所有对等节点。",
  "users.noPeersTitle": "此用户还没有注册对等节点",
  "users.noPeersDescription":
    "安装 {{product}} 并使用此用户登录，即可注册对等节点。",
  "setup.welcome": "欢迎使用 CyberNet",
  "setup.description": "创建首个管理员账号以开始使用。",
  "setup.name": "姓名",
  "setup.namePlaceholder": "请输入姓名",
  "setup.email": "邮箱",
  "setup.password": "密码",
  "setup.passwordPlaceholder": "请输入高强度密码",
  "setup.passwordHelp": "至少需要 8 个字符",
  "setup.confirmPassword": "确认密码",
  "setup.confirmPasswordPlaceholder": "请再次输入密码",
  "setup.create": "创建管理员账号",
  "setup.creating": "正在创建账号…",
  "setup.success": "账号已创建",
  "setup.redirecting": "将在 {{seconds}} 秒后跳转到登录页面…",
  "setup.goLogin": "前往登录",
  "setup.oneTime": "此页面仅用于完成 CyberNet 实例的首次初始化。",
  "setup.error.emailRequired": "请输入邮箱",
  "setup.error.emailInvalid": "请输入有效的邮箱地址",
  "setup.error.passwordRequired": "请输入密码",
  "setup.error.passwordLength": "密码至少需要 8 个字符",
  "setup.error.confirmRequired": "请确认密码",
  "setup.error.passwordMismatch": "两次输入的密码不一致",
  "setup.error.nameRequired": "请输入姓名",
  "setup.error.generic": "操作失败，请重试。",
  "setup.error.invalid": "请求无效，请检查输入内容。",
  "setup.error.alreadyComplete": "初始化已经完成，正在跳转到登录页面…",
  "setup.error.validation": "输入内容校验失败，请检查后重试。",
  "meta.setup": "实例初始化",
  "meta.invite": "接受邀请",
  "meta.install": "安装 CyberNet",
  "onboarding.title": "开始使用",
  "onboarding.skip": "已经熟悉 CyberNet？跳过引导",
  "invite.noToken": "缺少邀请令牌。",
  "invite.rateLimited": "尝试次数过多，请稍后再试。",
  "invite.invalidError": "邀请无效或已经过期。",
  "invite.acceptFailed": "CyberNet 暂时无法创建账号。",
  "invite.acceptInvalid": "无法接受邀请，请检查密码是否符合要求后重试。",
  "invite.acceptUsed": "该邀请已被使用，请直接使用对应账号登录。",
  "invite.tooManyTitle": "请求过于频繁",
  "invite.invalidTitle": "邀请无效",
  "invite.invalidDescription":
    "该邀请无效或已经过期，请联系管理员重新发送邀请。",
  "invite.expiredTitle": "邀请已过期",
  "invite.expiredDescription": "该邀请已过期，请联系管理员重新发送邀请。",
  "invite.login": "前往登录",
  "invite.successTitle": "账号已创建",
  "invite.successDescription":
    "你的 CyberNet 账号已经创建完成，现在可以使用邮箱和密码登录。",
  "invite.welcome": "欢迎使用 CyberNet",
  "invite.description":
    "{{inviter}} 邀请你加入网络。请设置密码以完成账号初始化。",
  "invite.password": "密码",
  "invite.confirmPassword": "确认密码",
  "invite.passwordMismatch": "两次输入的密码不一致",
  "invite.ruleLength": "至少 8 个字符",
  "invite.ruleUppercase": "至少 1 个大写字母",
  "invite.ruleLowercase": "至少 1 个小写字母",
  "invite.ruleNumber": "至少 1 个数字",
  "invite.ruleSpecial": "至少 1 个特殊字符 (!@#$%^&*)",
  "invite.creating": "正在创建账号…",
  "invite.create": "创建账号",
  "invite.expires": "邀请将在 {{date}} 过期",
  "common.back": "返回",
  "common.close": "关闭",
  "common.save": "保存",
  "common.delete": "删除",
  "accessTokens.title": "访问令牌",
  "accessTokens.column.name": "名称",
  "accessTokens.column.expires": "过期时间",
  "accessTokens.column.lastUsed": "最近使用",
  "accessTokens.lastUsedOn": "最近使用时间",
  "accessTokens.emptyTitle": "暂无访问令牌",
  "accessTokens.emptyDescription":
    "你还没有访问令牌。添加令牌后即可访问 {{product}} API。",
  "accessTokens.createTitle": "创建访问令牌",
  "accessTokens.createDescription": "使用此令牌访问 {{product}} 公共 API。",
  "accessTokens.createdTitle": "访问令牌创建成功！",
  "accessTokens.createdDescription":
    "该令牌不会再次显示，请立即复制并妥善保存在安全位置。",
  "accessTokens.copySuccess": "访问令牌已复制到剪贴板！",
  "accessTokens.createFailed": "无法创建访问令牌…",
  "accessTokens.copyToClipboard": "复制到剪贴板",
  "accessTokens.creatingTitle": "正在创建访问令牌",
  "accessTokens.createdNotification": "{{name}} 已创建成功。",
  "accessTokens.loading": "正在创建访问令牌…",
  "accessTokens.name": "名称",
  "accessTokens.nameHelp": "为令牌设置一个容易识别的名称。",
  "accessTokens.namePlaceholder": "例如：基础设施令牌",
  "accessTokens.expiresIn": "有效期",
  "accessTokens.expiresHelp": "请输入 1 至 365 天。",
  "accessTokens.days": "天",
  "accessTokens.learnMore": "了解更多",
  "accessTokens.documentation": "访问令牌",
  "accessTokens.create": "创建令牌",
  "posture.createTitle": "创建终端检查",
  "posture.updateTitle": "更新终端检查",
  "posture.description": "使用终端检查进一步限制网络访问。",
  "posture.tab.checks": "检查项",
  "posture.tab.general": "名称与说明",
  "posture.nameLabel": "终端检查名称",
  "posture.nameHelp": "为终端检查设置一个容易识别的名称。",
  "posture.namePlaceholder": "例如：{{product}} 版本 > 0.25.0",
  "posture.descriptionLabel": "说明（可选）",
  "posture.descriptionHelp": "添加简短说明，补充此终端检查的用途。",
  "posture.descriptionPlaceholder":
    "例如：检查 {{product}} 版本是否高于 0.25.0",
  "posture.learnMore": "了解更多",
  "posture.documentation": "终端检查",
  "posture.saveChanges": "保存更改",
  "posture.version.title": "{{product}} 客户端版本",
  "posture.version.description":
    "仅允许运行指定 {{product}} 客户端版本的对等节点访问。",
  "posture.version.minimum": "最低版本要求",
  "posture.version.minimumHelp":
    "仅运行不低于此 {{product}} 客户端版本的对等节点可以访问网络。",
  "posture.version.invalid": "请输入有效版本，例如 0.2、0.2.0 或 0.2.0-alpha.1",
  "posture.version.prefix": "版本",
  "posture.version.documentation": "客户端版本检查",
  "posture.process.title": "进程",
  "posture.process.description": "根据对等节点上运行的进程限制网络访问。",
  "posture.process.label": "进程",
  "posture.process.help":
    "添加 Linux、macOS 或 Windows 的可执行文件路径。仅当配置的进程正在运行时，对等节点才可以连接。",
  "posture.process.invalidMac": "请输入有效的 macOS 文件路径",
  "posture.process.invalidLinux": "请输入有效的 Unix 文件路径",
  "posture.process.invalidWindows": "请输入有效的 Windows 文件路径",
  "posture.process.add": "添加进程",
  "posture.process.documentation": "进程检查",
  "posture.table.name": "名称",
  "posture.table.checks": "检查项",
  "posture.table.policies": "策略",
  "posture.table.all": "全部",
  "posture.table.active": "已启用",
  "posture.table.inactive": "未启用",
  "posture.table.status": "状态",
  "posture.table.feature": "终端检查",
  "posture.table.singular": "终端检查",
  "posture.table.search": "按名称和说明搜索…",
  "posture.table.add": "添加终端检查",
  "posture.emptyTitle": "尚未添加终端检查",
  "posture.emptyDescription":
    "添加终端检查可进一步限制网络访问，例如要求指定的 {{product}} 客户端版本、操作系统或位置。",
  "posture.browse": "浏览检查项",
  "posture.new": "新建终端检查",
  "peerIp.editV4Title": "编辑对等节点 IP 地址",
  "peerIp.editV6Title": "编辑对等节点 IPv6 地址",
  "peerIp.editV4Description": "更新此对等节点的 {{product}} IP 地址。",
  "peerIp.editV6Description": "更新此对等节点的 {{product}} IPv6 地址。",
  "peerIp.invalidV4": "请输入有效的 IP 地址，例如 100.64.0.15",
  "peerIp.invalidV6": "请输入有效的 IPv6 地址，例如 fd00:1234::1",
  "peerIp.reconnectNotice": "更改将在对等节点重新连接后生效。",
  "peerIssue.bypassed":
    "管理员已绕过此对等节点的合规检查。设备恢复合规后，绕过状态会自动移除。",
  "peerIssue.loginExpired":
    "此对等节点的登录已过期。请在设备上的 {{product}} 客户端中重新认证，使其恢复在线。",
  "peerIssue.nonCompliant":
    "此对等节点不符合 {{integration}} 的合规要求，恢复合规或绕过检查前无法连接。",
  "peerIssue.approvalRequired":
    "此对等节点需要管理员批准后才能连接，请在该行的操作菜单中批准。",
  "peerAction.approveTitle": "批准对等节点“{{name}}”？",
  "peerAction.approveDescription": "确定要批准此对等节点吗？",
  "peerAction.approve": "批准",
  "peerAction.approvedTitle": "已批准对等节点 {{name}}",
  "peerAction.approvedDescription": "此对等节点现在可以连接其他对等节点。",
  "peerAction.approving": "正在批准对等节点…",
  "peerAction.bypassTitle": "绕过“{{name}}”的合规检查？",
  "peerAction.bypassDescription":
    "此操作将覆盖合规检查并允许该对等节点连接。设备恢复合规后，绕过状态会自动移除。",
  "peerAction.bypass": "绕过合规检查",
  "peerAction.bypassedTitle": "已为 {{name}} 绕过合规检查",
  "peerAction.canConnect": "此对等节点现在可以连接其他对等节点。",
  "peerAction.bypassing": "正在绕过合规检查…",
  "peerAction.revokeTitle": "撤销“{{name}}”的合规绕过？",
  "peerAction.revokeDescription":
    "此对等节点将恢复正常合规校验。如果仍不合规，它将失去网络访问权限。",
  "peerAction.revoke": "撤销",
  "peerAction.revokedTitle": "已撤销合规绕过",
  "peerAction.revokedDescription": "对等节点 {{name}} 已恢复正常合规校验。",
  "peerAction.revoking": "正在撤销合规绕过…",
  "peerAction.sessionEnabledTitle": "会话过期已启用",
  "peerAction.sessionDisabledTitle": "会话过期已停用",
  "peerAction.sessionEnabledDescription":
    "已成功为对等节点 {{name}} 启用会话过期。",
  "peerAction.sessionDisabledDescription":
    "已成功为对等节点 {{name}} 停用会话过期。",
  "peerAction.sessionUpdating": "正在更新会话过期设置…",
  "peerAction.disableSshTitle": "停用 SSH 访问？",
  "peerAction.disableSshDescription":
    "从 {{product}} v0.61.0 开始，停用 SSH 访问后无法再从管理平台重新启用。请创建明确的访问控制策略并更新 {{product}} 客户端，以恢复 SSH 功能。",
  "peerAction.disable": "停用",
  "peerAction.viewDetails": "查看详情",
  "peerAction.bypassTooltip":
    "绕过 {{integration}} 合规检查并允许此对等节点连接。设备恢复合规后，绕过状态会自动移除。",
  "peerAction.revokeBypass": "撤销绕过",
  "peerAction.setupKeyExpirationInfo":
    "通过设置密钥添加的对等节点不会启用过期设置。",
  "peerAction.enableSessionExpiration": "启用会话过期",
  "peerAction.disableSessionExpiration": "停用会话过期",
  "peerAction.enableSsh": "启用 SSH 访问",
  "peerAction.disableSsh": "停用 SSH 访问",
};

const resources: Record<CyberNetLocale, Record<TranslationKey, string>> = {
  en,
  "zh-CN": zhCN,
};

type LocaleContextValue = {
  locale: CyberNetLocale;
  setLocale: (locale: CyberNetLocale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function normalizeLocale(value?: string | null): CyberNetLocale | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "zh" ||
    normalized === "zh-cn" ||
    normalized === "zh_hans"
  ) {
    return "zh-CN";
  }
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  return undefined;
}

function readLocaleCookie(): CyberNetLocale | undefined {
  if (typeof document === "undefined") return undefined;
  const prefix = `${COOKIE_NAME}=`;
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
  return normalizeLocale(value ? decodeURIComponent(value) : undefined);
}

function readPersistedLocale(): CyberNetLocale | undefined {
  if (typeof window !== "undefined") {
    try {
      const stored = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
      if (stored) return stored;
    } catch {}
  }
  return readLocaleCookie();
}

export function getPersistedLocale(): CyberNetLocale {
  return readPersistedLocale() ?? DEFAULT_LOCALE;
}

export function LocaleProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const configuredDefault =
    normalizeLocale(loadConfig().defaultLocale) ?? DEFAULT_LOCALE;
  const [locale, setLocaleState] = useState<CyberNetLocale>(configuredDefault);
  const manuallySelected = useRef(false);

  const applyLocale = useCallback((nextLocale: CyberNetLocale) => {
    setLocaleState(nextLocale);
    dayjs.locale(nextLocale === "zh-CN" ? "zh-cn" : "en");
    if (typeof document !== "undefined") {
      document.documentElement.lang = nextLocale;
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        nextLocale,
      )}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, nextLocale);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const persisted = readPersistedLocale();
    if (persisted) {
      applyLocale(persisted);
      return;
    }

    let cancelled = false;
    fetchInstanceStatus()
      .then((status) => {
        const instanceDefault = normalizeLocale(
          status.client_update?.localization.default_locale,
        );
        if (!cancelled && !manuallySelected.current) {
          applyLocale(instanceDefault ?? configuredDefault);
        }
      })
      .catch(() => {
        if (!cancelled && !manuallySelected.current) {
          applyLocale(configuredDefault);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applyLocale, configuredDefault]);

  const selectLocale = useCallback(
    (nextLocale: CyberNetLocale) => {
      manuallySelected.current = true;
      applyLocale(nextLocale);
    },
    [applyLocale],
  );

  const t = useCallback(
    (key: TranslationKey, values?: Record<string, string | number>) => {
      let value = resources[locale][key] ?? resources.en[key] ?? key;
      if (values) {
        for (const [name, replacement] of Object.entries(values)) {
          value = value.replaceAll(`{{${name}}}`, String(replacement));
        }
      }
      return value;
    },
    [locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: selectLocale,
      toggleLocale: () => selectLocale(locale === "zh-CN" ? "en" : "zh-CN"),
      t,
    }),
    [locale, selectLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
