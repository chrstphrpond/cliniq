import { Input } from "@/components/ui/input";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Patient name" />);
    expect(screen.getByPlaceholderText("Patient name")).toBeInTheDocument();
  });

  it("is 36px tall (h-9)", () => {
    render(<Input placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toHaveClass("h-9");
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="x" />);
    await user.type(screen.getByPlaceholderText("x"), "hello");
    expect(screen.getByPlaceholderText("x")).toHaveValue("hello");
  });
});
