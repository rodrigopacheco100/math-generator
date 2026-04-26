"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const keyVariants = cva("", {
  variants: {
    keyType: {
      number: "bg-gray-200 text-gray-700 hover:bg-gray-300",
      del: "bg-red-100 text-red-600 hover:bg-red-200",
      ok: "bg-emerald-500 text-white hover:bg-emerald-600",
    },
  },
  defaultVariants: {
    keyType: "number",
  },
});

export type KeyVariantProps = VariantProps<typeof keyVariants>;

interface KeyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    KeyVariantProps {
  children: React.ReactNode;
}

export function KeyButton({
  className,
  keyType,
  children,
  ...props
}: KeyButtonProps) {
  return (
    <Button className={cn(keyVariants({ keyType }), className)} {...props}>
      {children}
    </Button>
  );
}
