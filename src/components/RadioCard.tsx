import * as RadioGroup from "@radix-ui/react-radio-group";
import { ReactNode } from "react"; // or replace with clsx or similar
import { cn } from "@/utils/helpers";

type Props = {
  value: string;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
};

export const RadioCard = ({
  value,
  title,
  description,
  className,
  icon,
  disabled,
}: Props) => {
  return (
    <RadioGroup.Item
      value={value}
      disabled={disabled}
      className={cn(
        "peer relative block cursor-pointer rounded-lg border border-nb-border-subtle bg-nb-surface-raised px-5 py-3 transition-all focus:outline-none",
        "data-[state=checked]:border-netbird data-[state=checked]:bg-netbird-50 dark:data-[state=checked]:bg-netbird-950/40",
        "outline-none focus:ring-0 focus:bg-nb-surface-muted focus:border-nb-border-strong",
        "hover:bg-nb-surface-subtle",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-nb-surface-raised",
        className,
      )}
    >
      <div className="text-nb-content-primary font-normal text-sm text-left gap-2 flex items-center">
        {icon}
        {title}
      </div>
      <div className="text-nb-content-secondary text-[0.8rem] text-left">
        {description}
      </div>
    </RadioGroup.Item>
  );
};

type RadioCardGroupProps = {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
};

export const RadioCardGroup = ({
  value,
  onValueChange,
  children,
  className,
  "aria-label": ariaLabel = "Options",
}: RadioCardGroupProps) => {
  return (
    <RadioGroup.Root
      className={cn("flex flex-col gap-2", className)}
      value={value}
      onValueChange={onValueChange}
      aria-label={ariaLabel}
    >
      {children}
    </RadioGroup.Root>
  );
};
