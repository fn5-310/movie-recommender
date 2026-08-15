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
  const onQueryChangeRef = useRef(onQueryChange);

  useEffect(() => {
    onQueryChangeRef.current = onQueryChange;
  }, [onQueryChange]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onQueryChangeRef.current(inputValue.trim());
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, debounceMs]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
        className="search-bar__input"
      />
      {isLoading && (
        <span className="search-bar__spinner" role="status" aria-live="polite">
          Searching...
        </span>
      )}
    </div>
  );
}
