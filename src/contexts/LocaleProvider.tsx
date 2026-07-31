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
    "Privileged automatic installation remains disabled until CyberNet's artifact-signing root is published. Version checks and manual downloads are active.",
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
    "Choose your platform. Download links are published and managed by your CyberNet administrator.",
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
  "downloads.platform.windows": "Windows",
  "downloads.platform.linux": "Linux",
  "downloads.platform.ios": "iPhone / iPad",
  "downloads.platform.android": "Android",
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
    "在 CyberNet 自有制品签名根发布前，高权限自动安装保持关闭；版本检查和手动下载不受影响。",
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
    "选择你的设备平台。下载地址由 CyberNet 管理员统一发布和维护。",
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
  "downloads.platform.windows": "Windows",
  "downloads.platform.linux": "Linux",
  "downloads.platform.ios": "iPhone / iPad",
  "downloads.platform.android": "Android",
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
