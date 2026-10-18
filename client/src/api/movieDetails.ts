import type { TmdbMovieDetails } from "../types/tmdb";
import { tmdbGet } from "./tmdb";

export const MOVIE_NOT_FOUND = "Movie not found";

/**
 * Full details for one movie, including its cast.
 * Throws MOVIE_NOT_FOUND for a 404 (the detail page shows its 404 view for it)
 * and a general message for any other failed response.
 */
export async function fetchMovieDetails(
  movieId: string | number,
  signal?: AbortSignal,
): Promise<TmdbMovieDetails> {
  return tmdbGet<TmdbMovieDetails>(`/movie/${movieId}`, {
    params: { append_to_response: "credits" },
    signal,
    failureMessage: (status) =>
      status === 404 ? MOVIE_NOT_FOUND : "Couldn't load this movie. Please try again.",
  });
}
