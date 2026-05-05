import { cn } from "@/lib/utils";
import * as React from "react";

export type AppointmentStatus =
  | "registered"
  | "doing"
  | "finished"
  | "waiting_payment"
  | "cancelled";

const config: Record<AppointmentStatus, { label: string; classes: string }> = {
  registered: {
    label: "Registered",
    classes: "bg-[var(--color-sage-soft)] text-[var(--color-sage-deep)]",
  },
  doing: {
    label: "Doing",
    classes: "bg-[color-mix(in_srgb,var(--color-info)_18%,transparent)] text-[var(--color-info)]",
  },
  finished: {
    label: "Finished",
    classes:
      "bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]",
  },
  waiting_payment: {
    label: "Waiting",
    classes:
      "bg-[color-mix(in_srgb,var(--color-warning)_22%,transparent)] text-[var(--color-warning)]",
  },
  cancelled: {
    label: "Cancelled",
    classes:
      "bg-[color-mix(in_srgb,var(--color-danger)_18%,transparent)] text-[var(--color-danger)]",
  },
};

export function StatusPill({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  const { label, classes } = config[status];
  return (
    <span
      aria-label={`Status: ${label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-0.5 text-[var(--text-2xs)] font-medium",
        classes,
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
