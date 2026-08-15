import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TMDB_API_KEY = import.meta.env.VITE_MOVIE_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const MAX_CAST_TO_SHOW = 5;

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

  const {
    title,
    poster_path: posterPath,
    vote_average: voteAverage,
    release_date: releaseDate,
    runtime,
    genres,
    overview,
    credits,
  } = movie;

  let formattedRuntime = "Unknown";
  if (runtime) {
    formattedRuntime = `${runtime} min`;
  }

  // Format the release date
  let formattedReleaseDate = "Unknown";
  if (releaseDate) {
    formattedReleaseDate = releaseDate;
  }

  // Format the genres
  let genreNames = "N/A";
  if (genres && genres.length > 0) {
    genreNames = genres.map((genre) => genre.name).join(", ");
  }

  let posterUrl = "https://via.placeholder.com/300x450?text=No+Poster";
  if (posterPath) {
    posterUrl = `${IMAGE_BASE_URL}${posterPath}`;
  }

  let topCast: CastMember[] = [];
  if (credits && credits.cast) {
    topCast = credits.cast.slice(0, MAX_CAST_TO_SHOW);
  }

  //Movie page section
  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "1rem" }}>
        ← Back to Search
      </button>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <img
          src={posterUrl}
          alt={title}
          style={{
            width: "300px",
            height: "auto",
            borderRadius: "8px",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflowWrap: "break-word",
            lineHeight: "1.6",
          }}
        >
          <h1
            style={{
              margin: "0 0 0.5rem 0",
              lineHeight: 1.2,
              wordWrap: "break-word",
            }}
          >
            {title}
          </h1>
          <p>
            <strong>Rating:</strong>{" "}
            {voteAverage ? `${voteAverage.toFixed(1)} / 10` : "N/A"}
          </p>
          <p>
            <strong>Release:</strong> {formattedReleaseDate}
          </p>
          <p>
            <strong>Runtime:</strong> {formattedRuntime}
          </p>
          <p>
            <strong>Genres:</strong> {genreNames}
          </p>
          <h3>Overview</h3>
          <p>{overview || "No overview available."}</p>

          <h3>Cast</h3>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {topCast.map((actor) => {
              // Build the avatar URL
              let avatarUrl =
                "https://via.placeholder.com/80x120?text=No+Image";
              if (actor.profile_path) {
                avatarUrl = `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
              }

              return (
                <div
                  key={actor.id}
                  style={{ textAlign: "center", width: "80px" }}
                >
                  <img
                    src={avatarUrl}
                    alt={actor.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {actor.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      margin: "0",
                    }}
                  >
                    {actor.character}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
