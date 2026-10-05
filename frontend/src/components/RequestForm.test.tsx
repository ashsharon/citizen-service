import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RequestForm from "./RequestForm";

describe("RequestForm", () => {
  it("shows a validation error when title is too short", async () => {
    const onSubmit = vi.fn();
    render(<RequestForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "ab" } });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "a long enough description" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 3 characters/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows a validation error when description is too short", async () => {
    const onSubmit = vi.fn();
    render(<RequestForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Pothole report" } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 10 characters/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the form payload when valid", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RequestForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Pothole on Hauptstraße" } });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Large pothole near house number 12" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      title: "Pothole on Hauptstraße",
      description: "Large pothole near house number 12",
      category: "road_damage",
    });
  });
});
