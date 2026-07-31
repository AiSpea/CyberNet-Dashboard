import Image from "next/image";
import * as React from "react";
import { memo } from "react";

type Props = {
  size?: number;
  className?: string;
};
function NetBirdIcon({ size = 16, className }: Props) {
  return (
    <Image
      src="/cybernet-app-icon.png"
      alt={"CyberNet"}
      width={size}
      height={size}
      className={className}
    />
  );
}

export default memo(NetBirdIcon);
