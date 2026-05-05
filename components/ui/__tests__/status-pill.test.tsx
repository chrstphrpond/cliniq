import { type AppointmentStatus, StatusPill } from "@/components/ui/status-pill";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const cases: { status: AppointmentStatus; label: string }[] = [
  { status: "registered", label: "Registered" },
  { status: "doing", label: "Doing" },
  { status: "finished", label: "Finished" },
  { status: "waiting_payment", label: "Waiting" },
  { status: "cancelled", label: "Cancelled" },
];

describe("StatusPill", () => {
  for (const { status, label } of cases) {
    it(`renders label for ${status}`, () => {
      render(<StatusPill status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  }

  it("communicates status with aria-label, not just color", () => {
    render(<StatusPill status="finished" />);
    expect(screen.getByLabelText("Status: Finished")).toBeInTheDocument();
  });

  it("applies a status-specific class for finished", () => {
    const { container } = render(<StatusPill status="finished" />);
    expect(container.firstChild).toHaveClass("text-[var(--color-success)]");
  });
});
