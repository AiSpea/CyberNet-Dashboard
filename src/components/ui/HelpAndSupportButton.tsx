"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@components/DropdownMenu";
import {
  ArrowUpRightIcon,
  BookText,
  CircleQuestionMark,
  Github,
  MessageSquareShare,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import Button from "@components/Button";
import { cn } from "@utils/helpers";
import loadConfig from "@utils/config";
import { useLocale } from "@/contexts/LocaleProvider";

const config = loadConfig();

export default function HelpAndSupportButton() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useLocale();

  return (
    <DropdownMenu
      modal={false}
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
    >
      <DropdownMenuTrigger asChild={true}>
        <Button
          size={"xs"}
          variant={"default-outline"}
          className={cn(
            "!rounded-full h-[38px] w-[38px] !p-0",
            dropdownOpen && "text-white",
          )}
        >
          <CircleQuestionMark size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 px-1">
            <div className="text-sm font-normal leading-none text-nb-gray-200 py-1">
              {t("help.title")}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          href={config.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          asChild
        >
          <div className={"flex gap-3 items-center"}>
            <BookText size={14} />
            {t("common.documentation")}
          </div>
          <DropdownMenuShortcut>
            <ArrowUpRightIcon size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          href={config.supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          asChild
        >
          <div className={"flex gap-3 items-center"}>
            <TriangleAlert size={14} />
            {t("common.troubleshooting")}
          </div>
          <DropdownMenuShortcut>
            <ArrowUpRightIcon size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          href={config.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          asChild
        >
          <div className={"flex gap-3 items-center"}>
            <Github size={14} />
            {t("common.sourceCode")}
          </div>
          <DropdownMenuShortcut>
            <ArrowUpRightIcon size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          href={config.supportUrl}
          target={"_blank"}
          rel="noopener noreferrer"
          asChild
        >
          <div className={"flex gap-3 items-center"}>
            <MessageSquareShare size={14} />
            {t("common.feedback")}
          </div>
          <DropdownMenuShortcut>
            <ArrowUpRightIcon size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
