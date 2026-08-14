import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  onQueryChange: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onQueryChange,
  isLoading = false,
  placeholder = "Search for a movie...",
  debounceMs = 400,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onQueryChange(inputValue.trim());
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, debounceMs]);

  return (
    <div className="search-bar" role="search">
      <label htmlFor="movie-search-input" className="visually-hidden">
        Search movies
      </label>
      <input
        id="movie-search-input"
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        aria-describedby={isLoading ? "movie-search-status" : undefined}
        className="search-bar__input"
      />
      <span
        id="movie-search-status"
        className={isLoading ? "search-bar__spinner" : "visually-hidden"}
        role="status"
        aria-live="polite"
      >
        {isLoading ? "Searching..." : ""}
      </span>
    </div>
  );
}
