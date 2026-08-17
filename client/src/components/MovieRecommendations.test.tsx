import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieRecommendations from "./MovieRecommendations";
import { server } from "../test/server";
import { http, HttpResponse } from "msw";

describe("MovieRecommendations", () => {
  it("shows a loading message initially", () => {
    render(
      <MemoryRouter>
        <MovieRecommendations movieId={574475} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Loading recommendations/i)).toBeInTheDocument();
  });

  it("renders recommended movies once loaded", async () => {
    render(
      <MemoryRouter>
        <MovieRecommendations movieId={574475} />
      </MemoryRouter>,
    );
    expect(
      await screen.findByText("TestRecommendedMovie"),
    ).toBeInTheDocument();
  });

  it("shows an empty state when there are no recommendations", async () => {
    server.use(
      http.get(
        "https://api.themoviedb.org/3/movie/:id/recommendations",
        () => HttpResponse.json({ results: [], page: 1, total_pages: 1, total_results: 0 }),
      ),
    );
    render(
      <MemoryRouter>
        <MovieRecommendations movieId={574475} />
      </MemoryRouter>,
    );
    expect(
      await screen.findByText(/No recommendations available/i),
    ).toBeInTheDocument();
  });
});