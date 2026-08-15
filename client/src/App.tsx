import { useCallback, useRef, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar.tsx";
import SearchResultsList from "./components/SearchResultsList.tsx";
import { searchMovies } from "./api/searchMovies.ts";
import type { Movie } from "./types/movie.ts";
import { useNavigate } from "react-router-dom";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const queryRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const runSearch = useCallback(async (query: string, page: number) => {
    abortRef.current?.abort();

    if (!query) {
      setMovies([]);
      setHasSearched(false);
      setHasMore(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    try {
      const data = await searchMovies(query, page, controller.signal);
      setMovies((prev) =>
        page === 1 ? data.results : [...prev, ...data.results],
      );
      setHasSearched(true);
      setHasMore(data.page < data.totalPages);
      setPage(data.page);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error(err);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQueryChange = (query: string) => {
    queryRef.current = query;
    void runSearch(query, 1);
  };

  const handleLoadMore = () => {
    void runSearch(queryRef.current, page + 1);
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <section id="search-page">
      <h1>Find a movie</h1>
      <SearchBar onQueryChange={handleQueryChange} isLoading={isLoading} />
      <SearchResultsList
        movies={movies}
        isLoading={isLoading}
        hasSearched={hasSearched}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onMovieClick={handleMovieClick}
      />
    </section>
  );
}

export default App;
