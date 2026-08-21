import type { Movie } from "../types/movie";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

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

interface RawRecommendationsResponse {
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
 * Movies the API considers related to `movieId` — the edges of the movie graph.
 * Throws on network/HTTP errors — callers should catch and surface a friendly message.
 */
export async function fetchRecommendedMovies(
  movieId: number,
  signal?: AbortSignal,
): Promise<Movie[]> {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  if (!API_KEY) {
    throw new Error(
      "Missing VITE_TMDB_API_KEY (set it in .env as VITE_TMDB_API_KEY=... and restart Vite).",
    );
  }

  const url = new URL(`${API_BASE_URL}/movie/${movieId}/recommendations`);
  url.searchParams.set("api_key", API_KEY);

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`Recommendations failed with status ${response.status}`);
  }

  const data: RawRecommendationsResponse = await response.json();

  return (data.results ?? []).map(normalizeMovie);
}
