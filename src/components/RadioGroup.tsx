import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { cn } from "@utils/helpers";
import * as React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
};

export const RadioGroup = ({ value, onChange, children }: Props) => {
  return (
    <RadixRadioGroup.Root
      value={value}
      onValueChange={onChange}
      className={
        "flex bg-nb-surface-muted rounded-md border border-nb-border text-sm items-center justify-center p-1"
      }
    >
      {children}
    </RadixRadioGroup.Root>
  );
};
export const RadioGroupItems = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className={"flex w-full bg-nb-surface-muted"}>{children}</div>;
};

export const RadioGroupItem = ({
  value,
  children,
  variant = "default",
}: {
  value: string;
  children?: React.ReactNode;
  variant?: "default" | "red" | "green";
}) => {
  return (
    <RadixRadioGroup.Item value={value} asChild={true}>
      <div
        key={value}
        className={cn(
          variant === "default" &&
            "text-nb-content-secondary hover:text-nb-content-primary data-[state=checked]:bg-netbird data-[state=checked]:text-white",
          variant === "red" &&
            "text-nb-content-secondary hover:text-nb-content-primary data-[state=checked]:bg-red-800 data-[state=checked]:text-red-100",
          variant === "green" &&
            "text-nb-content-secondary hover:text-nb-content-primary data-[state=checked]:bg-green-800 data-[state=checked]:text-green-100",
          "cursor-pointer relative transition-all w-full py-1.5 px-5 rounded-md h-full flex items-center text-sm gap-1 text-center justify-center",
        )}
      >
        {children ? children : <div className={"h-3"}></div>}
      </div>
    </RadixRadioGroup.Item>
  );
};
