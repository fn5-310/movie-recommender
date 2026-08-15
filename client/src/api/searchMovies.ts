import type { Movie, SearchMoviesResponse } from "../types/movie";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";
const API_KEY = import.meta.env.VITE_MOVIE_API_KEY;

// Raw shape returned by the movie API — kept separate from our normalized Movie type
interface RawMovieResult {
  id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
  overview: string | null;
  genre_ids: number[] | null;
  vote_average: number | null;
}

interface RawSearchResponse {
  page: number;
  results: RawMovieResult[];
  total_pages: number;
  total_results: number;
}

function normalizeMovie(raw: RawMovieResult): Movie {
  return {
    id: raw.id,
    title: raw.title,
    year: raw.release_date ? Number(raw.release_date.slice(0, 4)) : null,
    posterUrl: raw.poster_path ? `${IMAGE_BASE_URL}${raw.poster_path}` : null,
    overview: raw.overview ?? "",
    genreIds: raw.genre_ids ?? [],
    voteAverage: raw.vote_average ?? null,
  };
}

/**
 * Search movies by title (query-by-title endpoint).
 * Throws on network/HTTP errors — callers should catch and surface a friendly message.
 */
export async function searchMovies(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<SearchMoviesResponse> {
  if (!API_KEY) {
    throw new Error(
      "Missing VITE_MOVIE_API_KEY (set it in client/.env as VITE_MOVIE_API_KEY=... and restart Vite).",
    );
  }

  const url = new URL(`${API_BASE_URL}/search/movie`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("include_adult", "false");

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`Search failed with status ${response.status}`);
  }

  const data: RawSearchResponse = await response.json();

  return {
    results: data.results.map(normalizeMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}
