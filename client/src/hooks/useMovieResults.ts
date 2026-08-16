import { useEffect, useState } from "react";
import { searchMovies } from "../api/searchMovies";
import { discoverMovies, type DiscoverFilters } from "../api/discoverMovies";
import type { Movie } from "../types/movie";

interface UseMovieResultsResult {
  movies: Movie[];
  isLoading: boolean;
  hasSearched: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
}

function hasAnyFilter(filters: DiscoverFilters): boolean {
  return Boolean(
    filters.genre || filters.yearFrom || filters.yearTo || filters.ratingMin || filters.castId,
  );
}

function applyClientSideFilters(movies: Movie[], filters: DiscoverFilters): Movie[] {
  return movies.filter((movie) => {
    if (filters.genre && !movie.genreIds.includes(filters.genre)) return false;
    if (filters.yearFrom && movie.year !== null && movie.year < filters.yearFrom) return false;
    if (filters.yearTo && movie.year !== null && movie.year > filters.yearTo) return false;
    if (filters.ratingMin && (movie.voteAverage ?? 0) < filters.ratingMin) return false;
    // castId intentionally skipped — search results carry no cast data
    return true;
  });
}

/**
 * Combines free-text search with filters.
 * TMDB has no endpoint supporting both at once, so when `query` is set,
 * results come from search and are filtered client-side (genre/year/rating
 * only — actor filtering doesn't apply during text search). With no query,
 * results come straight from discover with all filters applied server-side.
 */
export function useMovieResults(query: string, filters: DiscoverFilters): UseMovieResultsResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset to page 1 whenever the query or filters change
  useEffect(() => {
    setPage(1);
  }, [query, filters]);

  useEffect(() => {
  const controller = new AbortController();

  const timeoutId = setTimeout(async () => {
    const isFirstPage = page === 1;
    setIsLoading(true);
    setError(null);

    try {
      if (query) {
        const response = await searchMovies(query, page, controller.signal);
        const filtered = applyClientSideFilters(response.results, filters);
        setMovies((prev) => (isFirstPage ? filtered : [...prev, ...filtered]));
        setTotalPages(response.totalPages);
      } else if (hasAnyFilter(filters)) {
        const response = await discoverMovies({ ...filters, page }, controller.signal);
        setMovies((prev) => (isFirstPage ? response.results : [...prev, ...response.results]));
        setTotalPages(response.totalPages);
      } else {
        setMovies([]);
        setTotalPages(1);
      }
      setHasSearched(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  }, 300);

  return () => {
    clearTimeout(timeoutId);
    controller.abort();
  };
}, [query, filters, page]);

  return {
    movies,
    isLoading,
    hasSearched,
    hasMore: page < totalPages,
    error,
    loadMore: () => setPage((p) => p + 1),
  };
}