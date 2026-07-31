"use client";

import "react-loading-skeleton/dist/skeleton.css";
import dynamic from "next/dynamic";
import { type ThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";
import { SkeletonTheme } from "react-loading-skeleton";

const NextThemesProvider = dynamic(
  () => import("next-themes").then((mod) => mod.ThemeProvider),
  { ssr: false },
);

export function GlobalThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      storageKey="cybernet-theme"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      <SkeletonTheme
        baseColor={"rgb(var(--nb-skeleton-base))"}
        highlightColor={"rgb(var(--nb-skeleton-highlight))"}
      >
        {children}
      </SkeletonTheme>
    </NextThemesProvider>
  );
}
