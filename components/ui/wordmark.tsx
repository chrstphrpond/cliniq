import { cn } from "@/lib/utils";
import * as React from "react";

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm"
      ? "text-[var(--text-md)]"
      : size === "lg"
        ? "text-[var(--text-2xl)]"
        : "text-[var(--text-lg)]";
  return (
    <span
      aria-label="Cliniq"
      className={cn(
        "font-display font-medium tracking-[-0.01em] leading-[var(--leading-display)] text-[var(--color-text)] inline-flex items-baseline",
        sizeClass,
        className,
      )}
    >
      <span aria-hidden>clini</span>
      <span aria-hidden className="relative inline-block translate-y-[0.04em]">
        q
      </span>
    </span>
  );
}
