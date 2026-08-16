import { describe, it, expect, vi } from "vitest";
import { discoverMovies } from "./discoverMovies";

describe("discoverMovies", () => {
  it("returns normalized results from the discover endpoint", async () => {
    const response = await discoverMovies({ genre: 28, sort: "popularity" });

    expect(response.results).toHaveLength(1);
    expect(response.results[0]).toMatchObject({
      id: 654321,
      title: "TestDiscoverMovie",
      year: 2015,
      voteAverage: 8.2,
      genreIds: [28],
    });
  });

  it("throws when the API key is missing", async () => {
    vi.stubEnv("VITE_MOVIE_API_KEY", "");
    await expect(discoverMovies({})).rejects.toThrow(/Missing VITE_MOVIE_API_KEY/);
    vi.stubEnv("VITE_MOVIE_API_KEY", "test-key");
  });
});