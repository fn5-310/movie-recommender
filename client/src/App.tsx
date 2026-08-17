import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import SearchBar from "./components/SearchBar.tsx";
import SearchResultsList from "./components/SearchResultsList.tsx";
import FilterPanel from "./components/FilterPanel.tsx";
import { useMovieResults } from "./hooks/useMovieResults.ts";
import type { Movie } from "./types/movie.ts";
import type { DiscoverFilters } from "./api/discoverMovies";
import RandomButton from "./components/RandomButton.tsx";

function App() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DiscoverFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const { movies, isLoading, hasSearched, hasMore, loadMore } = useMovieResults(query, filters);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const hasActiveFilters =
    filters.genre !== undefined ||
    filters.ratingMin !== undefined ||
    filters.castId !== undefined ||
    (filters.yearFrom !== undefined && filters.yearFrom !== 1900) ||
    (filters.yearTo !== undefined && filters.yearTo !== new Date().getFullYear());

  return (
    <section id="search-page">
      <h1>Find a movie</h1>
      <SearchBar onQueryChange={setQuery} isLoading={isLoading} />

      <button
        className="filter-toggle"
        onClick={() => setShowFilters((v) => !v)}
        aria-expanded={showFilters}
      >
        <span
          className="filter-toggle__icon"
          style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
        Filters
        {hasActiveFilters && <span className="filter-toggle__dot" aria-label="Filters active" />}
      </button>

      <div className={`filter-panel-wrap ${showFilters ? "filter-panel-wrap--open" : ""}`}>
        <FilterPanel onFiltersChange={setFilters} searchActive={query.length > 0} />
      </div>

      <SearchResultsList
        movies={movies}
        isLoading={isLoading}
        hasSearched={hasSearched}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onMovieClick={handleMovieClick}
      />
      <RandomButton onMovieGet={(movie) => handleMovieClick(movie)}/>
    </section>
  );
}

export default App;
