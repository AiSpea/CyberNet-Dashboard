import { globalMetaTitle } from "@utils/meta";
import type { Metadata } from "next";
import AppLayout from "@/layouts/AppLayout";

export const metadata: Metadata = {
  title: `${globalMetaTitle}`,
  description:
    "CyberNet private network and access management dashboard, powered by NetBird.",
  applicationName: "CyberNet",
  icons: {
    icon: "/cybernet-app-icon.png",
    apple: "/cybernet-app-icon.png",
  },
};
export default AppLayout;
