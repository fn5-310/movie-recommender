import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResultsList from "./components/SearchResultsList";
import FilterPanel from "./components/FilterPanel";
import { useMovieResults } from "./hooks/useMovieResults";
import type { Movie } from "./types/movie";
import type { DiscoverFilters } from "./api/discoverMovies";
import RandomButton from "./components/RandomButton.tsx";

function App() {
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>(() => {
    const savedQuery = sessionStorage.getItem("movieSearchQuery");
    if (!savedQuery) {
      return "";
    }

    try {
      const parsed = JSON.parse(savedQuery);

      if (typeof parsed === "string" && /^[^<>]*$/.test(parsed)) {
        return parsed;
      }
      return "";
    } catch {
      return "";
    }
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
    if (/^[^<>]*$/.test(query)) {
      sessionStorage.setItem("movieSearchQuery", JSON.stringify(query));
    }
  }, [query]);

  useEffect(() => {
    sessionStorage.setItem("movieSearchFilters", JSON.stringify(filters));
  }, [filters]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <>
      <section id="search-page">
        <h1>Find a movie</h1>
        <SearchBar onQueryChange={setQuery} isLoading={isLoading} initialValue={query}/>
        <FilterPanel onFiltersChange={setFilters} searchActive={query.length > 0} initialFilters={filters} />
        <SearchResultsList
          movies={movies}
          isLoading={isLoading}
          hasSearched={hasSearched}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onMovieClick={handleMovieClick}
        />
      </section>
      <RandomButton onMovieGet={(movie) => handleMovieClick(movie)}/>
    </>
    
  );
}

export default App;
