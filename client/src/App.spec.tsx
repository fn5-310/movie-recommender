import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "./App";
import MovieDetail from "./pages/MovieDetail";

function renderApp() {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
}

describe("App search integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("searches through SearchBar and renders movie result", async () => {
    const user = userEvent.setup();

    renderApp();

    const input = screen.getByRole("textbox", { name: /search movies/i });
    await user.type(input, "Test");

    expect(await screen.findByText("TestMovie1")).toBeInTheDocument();
  });

  it("shows discover results when filters are applied without a search query", async () => {
    const user = userEvent.setup();

    renderApp();

    await user.selectOptions(screen.getByLabelText(/genre/i), "28");

    expect(await screen.findByText("TestDiscoverMovie")).toBeInTheDocument();
  });

  it("disables the actor filter while a search query is active", async () => {
    const user = userEvent.setup();

    renderApp();

    const input = screen.getByRole("textbox", { name: /search movies/i });
    await user.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByLabelText(/actor/i)).toBeDisabled();
    });
  });

  it("applies genre filter on top of search results", async () => {
    const user = userEvent.setup();

    renderApp();

    const input = screen.getByRole("textbox", { name: /search movies/i });
    await user.type(input, "Test");
    await screen.findByText("TestMovie1");

    await user.selectOptions(screen.getByLabelText(/genre/i), "28");

    await waitFor(() => {
      expect(screen.queryByText("TestMovie1")).not.toBeInTheDocument();
    });
  });

  it("persists search query when navigating back from movie detail", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    const initialInput = screen.getByRole("textbox", {
      name: /search movies/i,
    });
    await user.type(initialInput, "Test");

    expect(await screen.findByText("TestMovie1")).toBeInTheDocument();

    const movieTitle = screen.getByText("TestMovie1");
    await user.click(movieTitle);

    expect(
      await screen.findByText("Final Destination Bloodlines"),
    ).toBeInTheDocument();

    const backButton = screen.getByText(/← Back to Search/i);
    await user.click(backButton);

    expect(await screen.findByText("Find a movie")).toBeInTheDocument();

    const restoredInput = screen.getByRole("textbox", {
      name: /search movies/i,
    });
    expect(restoredInput).toHaveValue("Test");

    expect(await screen.findByText("TestMovie1")).toBeInTheDocument();
  });
});
