import { cn } from "@utils/helpers";
import React from "react";

type Props = {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function PublicContentCard({
  icon,
  title,
  children,
  className,
}: Readonly<Props>) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-nb-gray-850 dark:bg-nb-gray-940 sm:p-7",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-netbird dark:bg-netbird/10">
            {icon}
          </span>
        )}
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-7 text-slate-600 dark:text-nb-gray-300">
        {children}
      </div>
    </section>
  );
}
