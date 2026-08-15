import { useParams } from "react-router-dom";

export default function MovieDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>You clicked on movie ID: {id}</h1>
      <p>Movie info + descriptions here</p>
    </div>
  );
}
