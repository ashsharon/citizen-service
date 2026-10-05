import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders a human-readable label and accessible status text", () => {
    render(<StatusBadge status="in_progress" />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("In progress");
    expect(badge).toHaveAccessibleName("Status: In progress");
  });

  it("renders resolved status correctly", () => {
    render(<StatusBadge status="resolved" />);
    expect(screen.getByRole("status")).toHaveTextContent("Resolved");
  });
});
