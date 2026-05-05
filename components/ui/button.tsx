import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] font-medium transition-colors duration-[var(--duration-micro)] ease-[var(--ease-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-[var(--color-sage-deep)] text-[var(--color-bg)] hover:bg-[var(--color-sage)]",
        outline:
          "border border-[var(--color-sage)] text-[var(--color-sage-deep)] hover:bg-[var(--color-sage-soft)]",
        ghost: "text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]",
      },
      size: {
        sm: "h-8 px-3 text-[var(--text-xs)]",
        md: "h-9 px-4 text-[var(--text-sm)]",
        lg: "h-11 px-6 text-[var(--text-base)]",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
