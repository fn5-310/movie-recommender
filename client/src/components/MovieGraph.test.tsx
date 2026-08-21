import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { server } from "../test/server";
import MovieGraph from "./MovieGraph";
import type { MovieGraphData, MovieGraphNode } from "./movieGraphData";

// The real graph draws to a canvas, which jsdom has no renderer for. Standing in
// for it with buttons keeps the data and the click handling under test.
vi.mock("react-force-graph-2d", () => ({
  default: ({
    graphData,
    onNodeClick,
  }: Readonly<{
    graphData: MovieGraphData;
    onNodeClick: (node: MovieGraphNode) => void;
  }>) => (
    <div data-testid="graph">
      {graphData.nodes.map((node) => (
        <button key={node.id} type="button" onClick={() => onNodeClick(node)}>
          {node.title}
        </button>
      ))}
    </div>
  ),
}));

function rawMovie(id: number, title: string) {
  return {
    id,
    title,
    release_date: "2001-01-01",
    poster_path: null,
    overview: null,
    genre_ids: null,
    vote_average: null,
  };
}

/** Recommendations that differ per movie, so expanding a node adds something new. */
function useBranchingRecommendations() {
  server.use(
    http.get("https://api.themoviedb.org/3/movie/:id/recommendations", ({ params }) => {
      const results =
        Number(params.id) === 1
          ? [rawMovie(100, "First Neighbour")]
          : [rawMovie(200, "Second Neighbour")];

      return HttpResponse.json({
        results,
        page: 1,
        total_pages: 1,
        total_results: results.length,
      });
    }),
  );
}

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderGraph() {
  return render(
    <MemoryRouter>
      <MovieGraph movieId={1} title="Root Movie" year={1999} />
      <LocationDisplay />
    </MemoryRouter>,
  );
}

describe("MovieGraph", () => {
  beforeAll(() => {
    // jsdom reports every element as zero-width; the canvas needs a real width.
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 800,
    });
  });

  it("shows the movie itself while its connections load", () => {
    renderGraph();

    expect(screen.getByRole("button", { name: "Root Movie" })).toBeInTheDocument();
    expect(screen.getByText(/Loading related movies/i)).toBeInTheDocument();
  });

  it("adds the related movies once they load", async () => {
    useBranchingRecommendations();
    renderGraph();

    expect(await screen.findByRole("button", { name: "First Neighbour" })).toBeInTheDocument();
    expect(screen.getByText("2 movies, 1 connection")).toBeInTheDocument();
  });

  it("branches out from a movie when it is clicked", async () => {
    useBranchingRecommendations();
    renderGraph();

    await userEvent.click(await screen.findByRole("button", { name: "First Neighbour" }));

    expect(await screen.findByRole("button", { name: "Second Neighbour" })).toBeInTheDocument();
    expect(screen.getByText("3 movies, 2 connections")).toBeInTheDocument();
  });

  it("opens the movie page when an already-branched movie is clicked again", async () => {
    useBranchingRecommendations();
    renderGraph();

    const neighbour = await screen.findByRole("button", { name: "First Neighbour" });
    await userEvent.click(neighbour);
    await screen.findByRole("button", { name: "Second Neighbour" });

    await userEvent.click(screen.getByRole("button", { name: "First Neighbour" }));

    expect(screen.getByTestId("location")).toHaveTextContent("/movie/100");
  });

  it("stays put when the movie at the centre is clicked", async () => {
    useBranchingRecommendations();
    renderGraph();

    await screen.findByRole("button", { name: "First Neighbour" });
    await userEvent.click(screen.getByRole("button", { name: "Root Movie" }));

    expect(screen.getByTestId("location").textContent).toBe("/");
  });

  it("reports a failure to load related movies", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/movie/:id/recommendations", () =>
        HttpResponse.json({ status_message: "nope" }, { status: 500 }),
      ),
    );
    renderGraph();

    expect(await screen.findByText(/Could not load related movies/i)).toBeInTheDocument();
  });
});
