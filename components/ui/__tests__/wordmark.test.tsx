import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Wordmark } from "@/components/ui/wordmark";

describe("Wordmark", () => {
  it("renders accessible brand name", () => {
    render(<Wordmark />);
    expect(screen.getByLabelText("Cliniq")).toBeInTheDocument();
  });

  it("renders the letters c l i n i q in order in DOM", () => {
    const { container } = render(<Wordmark />);
    expect(container.textContent).toBe("cliniq");
  });

  it("uses display font", () => {
    const { container } = render(<Wordmark />);
    expect(container.firstChild).toHaveClass("font-display");
  });
});
