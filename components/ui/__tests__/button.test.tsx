import { Button } from "@/components/ui/button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies solid variant by default", () => {
    render(<Button>x</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-[var(--color-sage-deep)]");
  });

  it("applies outline variant when requested", () => {
    render(<Button variant="outline">x</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-[var(--color-sage)]");
  });

  it("respects size prop", () => {
    render(<Button size="sm">x</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    let clicks = 0;
    render(
      <Button
        onClick={() => {
          clicks++;
        }}
      >
        x
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(clicks).toBe(1);
  });

  it("disables pointer events when disabled", () => {
    render(<Button disabled>x</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
