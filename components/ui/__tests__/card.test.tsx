import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Card", () => {
  it("renders header and content", () => {
    render(
      <Card>
        <CardHeader>Schedule</CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("applies surface background and elevation", () => {
    const { container } = render(<Card>x</Card>);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("bg-[var(--color-surface)]");
    expect(root).toHaveClass("shadow-[var(--shadow-e2)]");
  });
});
