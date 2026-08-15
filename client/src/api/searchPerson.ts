const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_MOVIE_API_KEY;

// Raw shape returned by TMDB's person search, kept separate from our normalized type
interface RawPersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string | null;
  popularity: number;
}

interface RawPersonSearchResponse {
  page: number;
  results: RawPersonResult[];
  total_pages: number;
  total_results: number;
}

export interface Person {
  id: number;
  name: string;
  profileUrl: string | null;
  knownFor: string | null;
}

const PROFILE_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185";

function normalizePerson(raw: RawPersonResult): Person {
  return {
    id: raw.id,
    name: raw.name,
    profileUrl: raw.profile_path ? `${PROFILE_IMAGE_BASE_URL}${raw.profile_path}` : null,
    knownFor: raw.known_for_department,
  };
}

/**
 * Search for a person (actor/actress) by name.
 * Used to resolve a free-text actor input into a TMDB person ID
 * before passing it as `with_cast` to discoverMovies().
 */
export async function searchPerson(
  query: string,
  signal?: AbortSignal,
): Promise<Person[]> {
  if (!API_KEY) {
    throw new Error(
      "Missing VITE_MOVIE_API_KEY (set it in client/.env as VITE_MOVIE_API_KEY=... and restart Vite).",
    );
  }

  if (!query.trim()) return [];

  const url = new URL(`${API_BASE_URL}/search/person`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`Person search failed with status ${response.status}`);
  }

  const data: RawPersonSearchResponse = await response.json();

  const sortedByPopularity = [...data.results].sort(
    (a, b) => b.popularity - a.popularity,
  );

  return sortedByPopularity.map(normalizePerson);
}