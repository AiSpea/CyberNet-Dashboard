"use client";

import { cn } from "@utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLocale } from "@/contexts/LocaleProvider";

const publicNavigation = [
  { href: "/downloads", label: "publicNav.downloads" },
  { href: "/docs", label: "publicNav.documentation" },
  { href: "/privacy", label: "publicNav.privacy" },
  { href: "/terms", label: "publicNav.terms" },
] as const;

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function PublicPageLayout({
  eyebrow,
  title,
  description,
  children,
}: Readonly<Props>) {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-nb-gray-950 dark:text-white">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-nb-gray-850 dark:bg-nb-gray-950/90">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/downloads"
            className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-netbird/40"
          >
            <Image
              src="/cybernet-app-icon.png"
              alt="CyberNet"
              width={38}
              height={38}
              className="rounded-[28%]"
              priority
            />
            <span className="text-lg font-semibold">CyberNet</span>
          </Link>
          <LanguageSwitcher />
          <nav
            aria-label={t("publicNav.label")}
            className="order-last flex w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-nb-gray-930 sm:order-none sm:w-auto"
          >
            {publicNavigation.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href === "/docs" && pathname.startsWith("/docs/"));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-netbird/40 sm:text-sm",
                    active
                      ? "bg-white text-slate-950 shadow-sm dark:bg-nb-gray-850 dark:text-white"
                      : "text-slate-600 hover:text-slate-950 dark:text-nb-gray-300 dark:hover:text-white",
                  )}
                >
                  {t(label)}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-4xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-netbird">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-nb-gray-300 sm:text-base">
            {description}
          </p>
        </div>

        <div className="mt-10 space-y-5">{children}</div>
      </section>

      <footer className="border-t border-slate-200 dark:border-nb-gray-850">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-7 text-xs text-slate-500 dark:text-nb-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>{t("publicFooter.beta")}</span>
          <a
            href="mailto:tech@aispea.com"
            className="transition-colors hover:text-slate-950 dark:hover:text-white"
          >
            tech@aispea.com
          </a>
        </div>
      </footer>
    </main>
  );
}
