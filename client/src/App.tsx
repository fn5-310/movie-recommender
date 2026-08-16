import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import SearchBar from "./components/SearchBar.tsx";
import SearchResultsList from "./components/SearchResultsList.tsx";
import FilterPanel from "./components/FilterPanel";
import { useMovieResults } from "./hooks/useMovieResults";
import type { Movie } from "./types/movie.ts";
import type { DiscoverFilters } from "./api/discoverMovies";

function App() {
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>(() => {
    return sessionStorage.getItem("movieSearchQuery") || "";
  });

  const [filters, setFilters] = useState<DiscoverFilters>(() => {
    const savedFilters = sessionStorage.getItem("movieSearchFilters");
    return savedFilters ? JSON.parse(savedFilters) : {};
  });

  const { movies, isLoading, hasSearched, hasMore, loadMore } = useMovieResults(
    query,
    filters,
  );

  useEffect(() => {
    sessionStorage.setItem("movieSearchQuery", query);
  }, [query]);

  useEffect(() => {
    sessionStorage.setItem("movieSearchFilters", JSON.stringify(filters));
  }, [filters]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <section id="search-page">
      <h1>Find a movie</h1>
      <SearchBar
        onQueryChange={setQuery}
        isLoading={isLoading}
        initialValue={query}
      />
      <FilterPanel
        onFiltersChange={setFilters}
        searchActive={query.length > 0}
      />
      <SearchResultsList
        movies={movies}
        isLoading={isLoading}
        hasSearched={hasSearched}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onMovieClick={handleMovieClick}
      />
    </section>
  );
}

export default App;
