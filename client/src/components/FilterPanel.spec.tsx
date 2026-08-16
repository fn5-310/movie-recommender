import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FilterPanel from "./FilterPanel";

describe("FilterPanel", () => {
  it("emits updated filters when a genre is selected", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();

    render(<FilterPanel onFiltersChange={onFiltersChange} />);

    await user.selectOptions(screen.getByLabelText(/genre/i), "28");

    await waitFor(() => {
      expect(onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ genre: 28 }),
      );
    });

    expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
  });

  it("shows actor suggestions and selects one", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();

    render(<FilterPanel onFiltersChange={onFiltersChange} />);

    await user.type(screen.getByLabelText(/actor/i), "Test");

    const suggestion = await screen.findByText("Test Actor");
    await user.click(suggestion);

    await waitFor(() => {
      expect(onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ castId: 999 }),
      );
    });
  });

  it("disables the actor input and clears castId when searchActive is true", () => {
    const onFiltersChange = vi.fn();
    render(<FilterPanel onFiltersChange={onFiltersChange} searchActive />);

    expect(screen.getByLabelText(/actor/i)).toBeDisabled();
    expect(screen.getByText(/unavailable while searching/i)).toBeInTheDocument();
  });

  it("clears all filters when Clear all is clicked", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();

    render(<FilterPanel onFiltersChange={onFiltersChange} />);

    await user.selectOptions(screen.getByLabelText(/genre/i), "28");
    await user.click(await screen.findByRole("button", { name: /clear all/i }));

    await waitFor(() => {
      expect(onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ genre: undefined, castId: undefined }),
      );
    });

    expect(screen.queryByRole("button", { name: /action/i })).not.toBeInTheDocument();
  });
});