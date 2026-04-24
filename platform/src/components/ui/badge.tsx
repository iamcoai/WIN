import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-win-charcoal/8 text-win-charcoal",
        gold: "bg-win-gold/15 text-win-gold",
        olive: "bg-win-olive/15 text-win-olive",
        success: "bg-emerald-100 text-emerald-800",
        warn: "bg-amber-100 text-amber-800",
        danger: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
