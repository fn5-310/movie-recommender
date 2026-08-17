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
    const savedQuery = sessionStorage.getItem("movieSearchQuery");
    if (!savedQuery) {
      return "";
    }

    const safeQuery = String(savedQuery).replace(/[<>]/g, "").substring(0, 200);

    return safeQuery;
  });

  const [filters, setFilters] = useState<DiscoverFilters>(() => {
    const savedFilters = sessionStorage.getItem("movieSearchFilters");
    if (!savedFilters) {
      return {};
    }

    try {
      const parsed = JSON.parse(savedFilters);
      const safeFilters: DiscoverFilters = {};

      if (typeof parsed.genre === "number") {
        safeFilters.genre = parsed.genre;
      }
      if (typeof parsed.yearFrom === "number") {
        safeFilters.yearFrom = parsed.yearFrom;
      }
      if (typeof parsed.yearTo === "number") {
        safeFilters.yearTo = parsed.yearTo;
      }
      if (typeof parsed.ratingMin === "number") {
        safeFilters.ratingMin = parsed.ratingMin;
      }
      if (typeof parsed.castId === "number") {
        safeFilters.castId = parsed.castId;
      }

      if (["popularity", "rating", "release_date"].includes(parsed.sort)) {
        safeFilters.sort = parsed.sort;
      }

      return safeFilters;
    } catch {
      return {};
    }
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
