import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import SearchBar from "./components/SearchBar.tsx";
import SearchResultsList from "./components/SearchResultsList.tsx";
import FilterPanel from "./components/FilterPanel";
import { useMovieResults } from "./hooks/useMovieResults";
import type { Movie } from "./types/movie.ts";
import type { DiscoverFilters } from "./api/discoverMovies";

function App() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DiscoverFilters>({});
  const navigate = useNavigate();

  const { movies, isLoading, hasSearched, hasMore, loadMore } = useMovieResults(query, filters);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <section id="search-page">
      <h1>Find a movie</h1>
      <SearchBar onQueryChange={setQuery} isLoading={isLoading} />
      <FilterPanel onFiltersChange={setFilters} searchActive={query.length > 0} />
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