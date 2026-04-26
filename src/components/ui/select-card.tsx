"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const selectCardVariants = cva("", {
  variants: {
    variant: {
      default: "bg-white hover:bg-gray-50",
      selected: "bg-violet-100 hover:bg-violet-200",
      easy: "bg-emerald-100 hover:bg-emerald-200",
      medium: "bg-amber-100 hover:bg-amber-200",
      hard: "bg-red-100 hover:bg-red-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type SelectCardVariantProps = VariantProps<typeof selectCardVariants>;

interface SelectCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    SelectCardVariantProps {
  children: React.ReactNode;
  selected?: boolean;
}

export function SelectCard({
  className,
  variant,
  children,
  selected,
  ...props
}: SelectCardProps) {
  const variantValue = selected
    ? variant === "default"
      ? "selected"
      : variant
    : "default";

  return (
    <Button
      variant="ghost"
      className={cn(selectCardVariants({ variant: variantValue }), className)}
      {...props}
    >
      {children}
    </Button>
  );
}
