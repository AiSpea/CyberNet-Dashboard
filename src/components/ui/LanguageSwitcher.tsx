"use client";

import Button from "@components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/DropdownMenu";
import { Check, Languages } from "lucide-react";
import { useLocale } from "@/contexts/LocaleProvider";

type Props = {
  compact?: boolean;
  className?: string;
};

export default function LanguageSwitcher({
  compact = false,
  className,
}: Readonly<Props>) {
  const { locale, setLocale, t } = useLocale();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={t("language.label")}
          variant="default-outline"
          size="xs"
          className={className}
        >
          <Languages size={15} />
          {!compact && (locale === "zh-CN" ? "简体中文" : "English")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          onClick={() => setLocale("zh-CN")}
          className="flex items-center justify-between gap-4"
        >
          {t("language.chinese")}
          {locale === "zh-CN" && <Check size={14} />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className="flex items-center justify-between gap-4"
        >
          {t("language.english")}
          {locale === "en" && <Check size={14} />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
