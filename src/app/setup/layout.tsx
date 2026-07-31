import { globalMetaTitle } from "@utils/meta";
import type { Metadata } from "next";
import BlankLayout from "@/layouts/BlankLayout";

export const metadata: Metadata = {
  title: `初始化 CyberNet - ${globalMetaTitle}`,
};
export default BlankLayout;
