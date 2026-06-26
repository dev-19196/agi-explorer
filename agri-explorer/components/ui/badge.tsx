import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-pine-soft text-pine-dark",
        honey: "bg-honey-soft text-honey-dark",
        outline: "border border-line text-ink-soft",
        biome: "text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Khi variant="biome", truyền màu nền qua đây (var(--biome-xxx)) */
  dotColor?: string;
}

function Badge({ className, variant, dotColor, style, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, className }))}
      style={variant === "biome" ? { backgroundColor: dotColor, ...style } : style}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
