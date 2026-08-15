import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TMDB_API_KEY = import.meta.env.VITE_MOVIE_API_KEY;

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: CastMember[];
  };
}

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Movie not found");
        }

        const data: MovieDetail = await response.json();
        setMovie(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  //loading section
  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading movie details…</div>;
  }

  //Error page section
  if (error || !movie) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>{error || "Movie not found"}</h1>
        <button onClick={() => navigate("/")}>Go back</button>
      </div>
    );
  }

  //Movie page section
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Movie data loaded</h1>
    </div>
  );
}
