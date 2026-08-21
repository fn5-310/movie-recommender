import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieRecommendations.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";
const PLACEHOLDER_POSTER = "https://via.placeholder.com/300x450?text=No+Poster";

interface RecommendedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

interface Props {
  movieId: number;
}

export default function MovieRecommendations({ movieId }: Readonly<Props>) {
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        setRecommendations(data.results ?? []);
      } catch {
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [movieId]);

  if (loading) {
    return <div className="message-container">Loading recommendations…</div>;
  }

  if (recommendations.length === 0) {
    return <div className="message-container">No recommendations available.</div>;
  }

  return (
    <div className="recommendations-section">
      <div className="recommendations-track">
        {recommendations.map((movie) => {
          let posterUrl = PLACEHOLDER_POSTER;
          if (movie.poster_path) {
            posterUrl = `${IMAGE_BASE_URL}${movie.poster_path}`;
          }
          return (
            <button
              key={movie.id}
              type="button"
              className="recommendation-card"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img src={posterUrl} alt={movie.title} className="recommendation-poster" />
              <p className="recommendation-title">{movie.title}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}