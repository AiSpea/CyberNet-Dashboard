import { getNetBirdUpCommand } from "@/utils/netbird";

export const NETBIRD_LINUX_VERSION = "0.77.0";
export const CYBERNET_LINUX_INSTALLER_URL =
  "https://cybernet.aisp24.com/install.sh";

export const getLinuxPackageInstallCommand = () =>
  `curl -fsSL ${CYBERNET_LINUX_INSTALLER_URL} | sh`;

export const getLinuxInstallAndConnectCommand = () =>
  `${getLinuxPackageInstallCommand()} && ${getNetBirdUpCommand()}`;
