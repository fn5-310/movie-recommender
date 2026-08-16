import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

describe("App search integration", () => {
  it("searches through SearchBar and renders movie result", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const input = screen.getByRole("textbox", { name: /search movies/i });
    await user.type(input, "Test");

    expect(await screen.findByText("TestMovie1")).toBeInTheDocument();
  });
});
