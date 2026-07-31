import { cn } from "@utils/helpers";
import Image from "next/image";
import * as React from "react";

type Props = {
  size?: "default" | "large";
  mobile?: boolean;
};

const sizes = {
  default: {
    mark: 34,
    text: "text-xl",
  },
  large: {
    mark: 42,
    text: "text-2xl",
  },
};

export const NetBirdLogo = ({ size = "default", mobile = true }: Props) => {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/cybernet-app-icon.png"
        width={sizes[size].mark}
        height={sizes[size].mark}
        alt="CyberNet"
        priority
        className="rounded-[28%]"
      />
      <span
        className={cn(
          "font-semibold tracking-tight text-slate-900 dark:text-white",
          sizes[size].text,
          mobile && "hidden md:inline",
        )}
      >
        CyberNet
      </span>
    </span>
  );
};
