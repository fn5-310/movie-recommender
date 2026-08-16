import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useMovieResults } from "./useMovieResults";
import * as searchMoviesModule from "../api/searchMovies";

vi.mock("../api/searchMovies");

describe("useMovieResults race condition handling", () => {
  it("discards a stale response that resolves after a newer request has already completed", async () => {
    let resolveStaleRequest: (value: unknown) => void;
    const staleRequestPromise = new Promise((resolve) => {
      resolveStaleRequest = resolve;
    });

    const searchMoviesMock = vi.mocked(searchMoviesModule.searchMovies);

    searchMoviesMock.mockImplementationOnce(
      () => staleRequestPromise as ReturnType<typeof searchMoviesModule.searchMovies>,
    );

    searchMoviesMock.mockImplementationOnce(() =>
      Promise.resolve({
        results: [
          {
            id: 2,
            title: "John Wick",
            year: 2014,
            posterUrl: null,
            overview: "",
            genreIds: [28],
            voteAverage: 7.4,
          },
        ],
        page: 1,
        totalPages: 1,
        totalResults: 1,
      }),
    );

    const { result, rerender } = renderHook(
      ({ query }) => useMovieResults(query, {}),
      { initialProps: { query: "Shining" } },
    );

    // Let the debounce (300ms) fire so the first ("Shining") request actually starts.
    // Wrapped in act() so any state changes during this window are tracked correctly.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 350));
    });

    rerender({ query: "John Wick" });

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(1);
      expect(result.current.movies[0].title).toBe("John Wick");
    });

    // Resolve the stale "Shining" request late, also wrapped in act()
    await act(async () => {
      resolveStaleRequest!({
        results: [
          {
            id: 1,
            title: "The Shining",
            year: 1980,
            posterUrl: null,
            overview: "",
            genreIds: [27],
            voteAverage: 8.4,
          },
        ],
        page: 1,
        totalPages: 1,
        totalResults: 1,
      });
    });

    // Results should still reflect the newer query — the stale response was discarded
    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0].title).toBe("John Wick");
  });
});