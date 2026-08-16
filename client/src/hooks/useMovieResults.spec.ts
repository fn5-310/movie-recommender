import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useMovieResults } from "./useMovieResults";

describe("useMovieResults", () => {
  it("uses discover results when there is no query but filters are set", async () => {
    const { result } = renderHook(() => useMovieResults("", { genre: 28 }));

    await waitFor(() => expect(result.current.movies).toHaveLength(1));
    expect(result.current.movies[0].title).toBe("TestDiscoverMovie");
  });

  it("uses search results and applies client-side filtering when a query is set", async () => {
    const { result } = renderHook(() => useMovieResults("test", { genre: 1 }));

    await waitFor(() => expect(result.current.hasSearched).toBe(true));
    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0].title).toBe("TestMovie1");
  });

  it("filters out search results that don't match the genre filter", async () => {
    const { result } = renderHook(() => useMovieResults("test", { genre: 999 }));

    await waitFor(() => expect(result.current.hasSearched).toBe(true));
    expect(result.current.movies).toHaveLength(0);
  });

  it("returns no movies when there's no query and no filters", async () => {
    const { result } = renderHook(() => useMovieResults("", {}));

    await waitFor(() => expect(result.current.hasSearched).toBe(false));
    expect(result.current.movies).toEqual([]);
  });
});