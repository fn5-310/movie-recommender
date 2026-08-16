import { useEffect, useRef, useState } from "react";
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
    return true;
  });
}

export function useMovieResults(query: string, filters: DiscoverFilters): UseMovieResultsResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks the most recent request so stale responses can be ignored
  const requestIdRef = useRef(0);

  useEffect(() => {
    setPage(1);
  }, [query, filters]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      const isFirstPage = page === 1;
      setIsLoading(true);
      setError(null);

      try {
        let newMovies: Movie[];
        let newTotalPages: number;

        if (query) {
          const response = await searchMovies(query, page, controller.signal);
          newMovies = applyClientSideFilters(response.results, filters);
          newTotalPages = response.totalPages;
        } else if (hasAnyFilter(filters)) {
          const response = await discoverMovies({ ...filters, page }, controller.signal);
          newMovies = response.results;
          newTotalPages = response.totalPages;
        } else {
          newMovies = [];
          newTotalPages = 1;
        }

        // Ignore this result if a newer request has since started
        if (requestId !== requestIdRef.current) return;

        setMovies((prev) => (isFirstPage ? newMovies : [...prev, ...newMovies]));
        setTotalPages(newTotalPages);
        setHasSearched(true);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err.message : "Failed to load movies");
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
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