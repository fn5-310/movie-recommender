import { useEffect, useState } from "react";
import "./ReviewsList.css";
import ReviewCard from "./ReviewCard";

interface Review {
  id: string;
  author: string;
  content: string;
  author_details: {rating: number | null};
}

interface Props {
  movieId: number;
}

export default function ReviewsList({ movieId }: Readonly<Props>) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }`;
        const response = await fetch(url);
        const data = await response.json();
        setReviews(data.results ?? []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  if (loading) {
    return <div className="message-container">Loading reviews…</div>;
  }

  if (reviews.length === 0) {
    return <div className="message-container">No reviews available</div>;
  }

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <div className="reviews-list">
      {visibleReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {hasMore && (
        <button
          type="button"
          className="show-more"
          onClick={() => setVisibleCount(visibleCount + 5)}
        >
          Show more reviews
        </button>
      )}
    </div>
  )
}