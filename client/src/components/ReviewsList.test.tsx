import { render, screen } from "@testing-library/react";
import ReviewsList from "./ReviewsList";
import { server } from "../test/server";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";

describe("ReviewsList", () => {
  it("fetches and displays a movie review", async () => {
    render(<ReviewsList movieId={574475} />);

    expect(await screen.findByText("ReviewerOne")).toBeInTheDocument();
  });

  it("shows an empty state when the movie has no reviews", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/movie/:id/reviews", () =>
        HttpResponse.json({ results: [], page: 1, total_pages: 1, total_results: 0 }),
      ),
    );

    render(<ReviewsList movieId={574475} />);

    expect(
      await screen.findByText(/No reviews available/i),
    ).toBeInTheDocument();
  });

  it("shows one review by default and reveals more on click", async () => {
    const user = userEvent.setup();
    render(<ReviewsList movieId={574475} />);

    expect(await screen.findByText("ReviewerOne")).toBeInTheDocument();
    expect(screen.queryByText("ReviewerTwo")).not.toBeInTheDocument();

    await user.click(screen.getByText(/Show more reviews/i));

    expect(screen.getByText("ReviewerTwo")).toBeInTheDocument();
    expect(screen.getByText("ReviewerSix")).toBeInTheDocument();
  });
});