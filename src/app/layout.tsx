import { globalMetaTitle } from "@utils/meta";
import type { Metadata } from "next";
import AppLayout from "@/layouts/AppLayout";

export const metadata: Metadata = {
  title: `${globalMetaTitle}`,
  description: "CyberNet 专属网络与访问管理平台",
  applicationName: "CyberNet",
  icons: {
    icon: "/cybernet-app-icon.png",
    apple: "/cybernet-app-icon.png",
  },
};
export default AppLayout;
