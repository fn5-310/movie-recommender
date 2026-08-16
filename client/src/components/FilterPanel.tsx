import { useEffect, useState } from "react";
import { MOVIE_GENRES } from "../constants/genres";
import { searchPerson, type Person } from "../api/searchPerson";
import type { DiscoverFilters } from "../api/discoverMovies";
import "./FilterPanel.css";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

const SORT_OPTIONS: {
  value: NonNullable<DiscoverFilters["sort"]>;
  label: string;
}[] = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Rating" },
  { value: "release_date", label: "Release date" },
];

interface FilterPanelProps {
  onFiltersChange: (filters: DiscoverFilters) => void;
  searchActive?: boolean;
}

export default function FilterPanel({
  onFiltersChange,
  searchActive = false,
}: Readonly<FilterPanelProps>) {
  const [genreId, setGenreId] = useState<number | undefined>(undefined);
  const [yearFrom, setYearFrom] = useState<number>(MIN_YEAR);
  const [yearTo, setYearTo] = useState<number>(CURRENT_YEAR);
  const [ratingMin, setRatingMin] = useState<number>(0);
  const [sort, setSort] = useState<DiscoverFilters["sort"]>("popularity");

  const [actorQuery, setActorQuery] = useState("");
  const [actorResults, setActorResults] = useState<Person[]>([]);
  const [selectedActor, setSelectedActor] = useState<Person | null>(null);
  const [actorSearchLoading, setActorSearchLoading] = useState(false);

  useEffect(() => {
    if (!actorQuery.trim() || selectedActor) {
      setActorResults([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setActorSearchLoading(true);
      try {
        const results = await searchPerson(actorQuery, controller.signal);
        setActorResults(results.slice(0, 5));
      } catch {
        setActorResults([]);
      } finally {
        setActorSearchLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [actorQuery, selectedActor]);

  useEffect(() => {
    onFiltersChange({
      genre: genreId,
      yearFrom,
      yearTo,
      ratingMin: ratingMin > 0 ? ratingMin : undefined,
      castId: searchActive ? undefined : selectedActor?.id,
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreId, yearFrom, yearTo, ratingMin, selectedActor, sort, searchActive]);

  function handleSelectActor(person: Person) {
    setSelectedActor(person);
    setActorQuery(person.name);
    setActorResults([]);
  }

  function clearActor() {
    setSelectedActor(null);
    setActorQuery("");
    setActorResults([]);
  }

  function clearAll() {
    setGenreId(undefined);
    setYearFrom(MIN_YEAR);
    setYearTo(CURRENT_YEAR);
    setRatingMin(0);
    setSort("popularity");
    clearActor();
  }

  const selectedGenre = MOVIE_GENRES.find((g) => g.id === genreId);
  const hasActiveFilters =
    genreId !== undefined ||
    yearFrom !== MIN_YEAR ||
    yearTo !== CURRENT_YEAR ||
    ratingMin > 0 ||
    selectedActor !== null;

  return (
    <div className="filter-panel">
      <div className="filter-panel__controls">
        <div className="filter-field">
          <label htmlFor="genre-select">Genre</label>
          <select
            id="genre-select"
            value={genreId ?? ""}
            onChange={(e) =>
              setGenreId(e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">All genres</option>
            {MOVIE_GENRES.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field filter-field--actor">
          <label htmlFor="actor-input">Actor</label>
          <input
            id="actor-input"
            type="text"
            placeholder="Search by actor name"
            value={actorQuery}
            disabled={searchActive}
            onChange={(e) => {
              setActorQuery(e.target.value);
              if (selectedActor) setSelectedActor(null);
            }}
          />
          {searchActive && (
            <span className="filter-field__hint">
              Actor filter is unavailable while searching by title.
            </span>
          )}
          {!searchActive && actorSearchLoading && (
            <span className="filter-field__hint">Searching…</span>
          )}
          {!searchActive && actorResults.length > 0 && (
            <ul className="actor-suggestions">
              {actorResults.map((person) => (
                <li key={person.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectActor(person)}
                  >
                    {person.name}
                    {person.knownFor && (
                      <span className="actor-suggestions__meta">
                        {" "}
                        · {person.knownFor}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="filter-field">
          <label htmlFor="year-from">Year range</label>
          <div className="year-range">
            <input
              id="year-from"
              type="number"
              min={MIN_YEAR}
              max={yearTo}
              value={yearFrom}
              onChange={(e) => setYearFrom(Number(e.target.value))}
            />
            <span>to</span>
            <input
              id="year-to"
              type="number"
              min={yearFrom}
              max={CURRENT_YEAR}
              value={yearTo}
              onChange={(e) => setYearTo(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="filter-field">
          <label htmlFor="rating-slider">
            Minimum rating {ratingMin > 0 ? `(${ratingMin.toFixed(1)}+)` : ""}
          </label>
          <input
            id="rating-slider"
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={ratingMin}
            onChange={(e) => setRatingMin(Number(e.target.value))}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as DiscoverFilters["sort"])}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          {selectedGenre && (
            <button
              type="button"
              className="chip"
              onClick={() => setGenreId(undefined)}
            >
              {selectedGenre.name} ✕
            </button>
          )}
          {selectedActor && (
            <button type="button" className="chip" onClick={clearActor}>
              {selectedActor.name} ✕
            </button>
          )}
          {(yearFrom !== MIN_YEAR || yearTo !== CURRENT_YEAR) && (
            <button
              type="button"
              className="chip"
              onClick={() => {
                setYearFrom(MIN_YEAR);
                setYearTo(CURRENT_YEAR);
              }}
            >
              {yearFrom}–{yearTo} ✕
            </button>
          )}
          {ratingMin > 0 && (
            <button
              type="button"
              className="chip"
              onClick={() => setRatingMin(0)}
            >
              {ratingMin.toFixed(1)}+ rating ✕
            </button>
          )}
          <button
            type="button"
            className="chip chip--clear-all"
            onClick={clearAll}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
