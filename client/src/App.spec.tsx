import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App search integration", () => {
  it("searches through SearchBar and renders movie result", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", { name: /search movies/i });
    await user.type(input, "Test");

    expect(await screen.findByText("TestMovie1")).toBeInTheDocument();
  });

  it("shows discover results when filters are applied without a search query", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.selectOptions(screen.getByLabelText(/genre/i), "28");

    expect(await screen.findByText("TestDiscoverMovie")).toBeInTheDocument();
  });

  it("disables the actor filter while a search query is active", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", { name: /search movies/i });
    await user.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByLabelText(/actor/i)).toBeDisabled();
    });
  });

  it("applies genre filter on top of search results", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", { name: /search movies/i });
    await user.type(input, "Test");
    await screen.findByText("TestMovie1");

    // TestMovie1 has genre_ids [1,2,3] — filtering to an unrelated genre should hide it
    await user.selectOptions(screen.getByLabelText(/genre/i), "28");

    await waitFor(() => {
      expect(screen.queryByText("TestMovie1")).not.toBeInTheDocument();
    });
  });
});