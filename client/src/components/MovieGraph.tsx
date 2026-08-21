import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { fetchRecommendedMovies } from "../api/recommendedMovies";
import {
  addRelatedMovies,
  createGraph,
  nodeLabel,
  type MovieGraphData,
  type MovieGraphLink,
  type MovieGraphNode,
} from "./movieGraphData";
import "./MovieGraph.css";

const GRAPH_HEIGHT = 420;
const MAX_RELATED_PER_MOVIE = 8;
const MAX_LABEL_LENGTH = 24;

const BACKGROUND_COLOR = "#16151a";
const ROOT_COLOR = "#c8a96e";
const EXPANDED_COLOR = "#e8e4de";
const COLLAPSED_COLOR = "#5c5866";
const LINK_COLOR = "#3d3a47";
const LABEL_COLOR = "#e8e4de";

type PositionedNode = MovieGraphNode & { x?: number; y?: number };

interface Props {
  movieId: number;
  title: string;
  year: number | null;
}

function shortLabel(title: string): string {
  if (title.length <= MAX_LABEL_LENGTH) {
    return title;
  }
  return `${title.slice(0, MAX_LABEL_LENGTH - 1)}…`;
}

/**
 * The movies around this one, drawn as a graph: the movie on this page sits at the
 * centre and every link is a "these two are related" pairing. Clicking a movie
 * pulls in its own related movies, so the graph grows outwards as you explore.
 */
export default function MovieGraph({ movieId, title, year }: Readonly<Props>) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphMethods<MovieGraphNode, MovieGraphLink> | undefined>(undefined);
  // Set when new movies arrive, so the view is re-framed once the layout settles
  // rather than on every simulation restart (a drag would otherwise yank the view).
  const shouldRefitRef = useRef(true);

  const [width, setWidth] = useState(0);
  const [graph, setGraph] = useState<MovieGraphData>(() =>
    createGraph({ id: movieId, title, year }),
  );
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set<number>());
  const [loadingId, setLoadingId] = useState<number | null>(movieId);
  const [error, setError] = useState<string | null>(null);

  // The canvas needs pixel dimensions, so track the width of the surrounding box.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const measure = () => setWidth(element.clientWidth);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Start over whenever the page moves to a different movie.
  useEffect(() => {
    const controller = new AbortController();

    setGraph(createGraph({ id: movieId, title, year }));
    setExpandedIds(new Set());
    setError(null);
    setLoadingId(movieId);
    shouldRefitRef.current = true;

    fetchRecommendedMovies(movieId, controller.signal)
      .then((related) => {
        setGraph((current) =>
          addRelatedMovies(current, movieId, related, MAX_RELATED_PER_MOVIE),
        );
        setExpandedIds(new Set([movieId]));
        setLoadingId(null);
        shouldRefitRef.current = true;
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") {
          return;
        }
        setError("Could not load related movies.");
        setLoadingId(null);
      });

    return () => controller.abort();
  }, [movieId, title, year]);

  const handleNodeClick = useCallback(
    (node: MovieGraphNode) => {
      // A movie that has already been branched out from has nothing left to
      // reveal, so a second click opens it instead.
      if (expandedIds.has(node.id)) {
        if (node.id !== movieId) {
          navigate(`/movie/${node.id}`);
        }
        return;
      }

      if (loadingId !== null) {
        return;
      }

      setLoadingId(node.id);
      setError(null);

      fetchRecommendedMovies(node.id)
        .then((related) => {
          setGraph((current) =>
            addRelatedMovies(current, node.id, related, MAX_RELATED_PER_MOVIE),
          );
          setExpandedIds((current) => new Set(current).add(node.id));
          setLoadingId(null);
          shouldRefitRef.current = true;
        })
        .catch(() => {
          setError("Could not load related movies.");
          setLoadingId(null);
        });
    },
    [expandedIds, loadingId, movieId, navigate],
  );

  const nodeColor = useCallback(
    (node: MovieGraphNode) => {
      if (node.id === movieId) {
        return ROOT_COLOR;
      }
      return expandedIds.has(node.id) ? EXPANDED_COLOR : COLLAPSED_COLOR;
    },
    [expandedIds, movieId],
  );

  const nodeRadius = useCallback(
    (node: MovieGraphNode) => (node.id === movieId ? 7 : 4.5),
    [movieId],
  );

  const paintNode = useCallback(
    (node: PositionedNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const radius = nodeRadius(node);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColor(node);
      ctx.fill();

      if (node.id === loadingId) {
        ctx.strokeStyle = ROOT_COLOR;
        ctx.lineWidth = 2 / globalScale;
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Divide by the zoom level so labels keep a constant on-screen size.
      const weight = node.id === movieId ? "600" : "400";
      ctx.font = `${weight} ${11 / globalScale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = LABEL_COLOR;
      ctx.fillText(shortLabel(node.title), x, y + radius + 3 / globalScale);
    },
    [loadingId, movieId, nodeColor, nodeRadius],
  );

  // Keeps the clickable area in step with the circles drawn above.
  const paintPointerArea = useCallback(
    (node: PositionedNode, color: string, ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, nodeRadius(node) + 3, 0, 2 * Math.PI);
      ctx.fill();
    },
    [nodeRadius],
  );

  const handleEngineStop = useCallback(() => {
    if (!shouldRefitRef.current) {
      return;
    }
    shouldRefitRef.current = false;
    graphRef.current?.zoomToFit(400, 60);
  }, []);

  let status: string;
  if (loadingId !== null) {
    status = "Loading related movies…";
  } else if (error) {
    status = error;
  } else {
    const movieCount = graph.nodes.length;
    const linkCount = graph.links.length;
    status = `${movieCount} ${movieCount === 1 ? "movie" : "movies"}, ${linkCount} ${
      linkCount === 1 ? "connection" : "connections"
    }`;
  }

  return (
    <div className="movie-graph">
      <p className="movie-graph__hint">
        Click a movie to branch out from it, click it again to open its page. Drag the
        movies around to untangle them, scroll to zoom.
      </p>

      <div className="movie-graph__canvas" ref={containerRef} style={{ height: GRAPH_HEIGHT }}>
        {width > 0 && (
          <ForceGraph2D<MovieGraphNode, MovieGraphLink>
            ref={graphRef}
            graphData={graph}
            width={width}
            height={GRAPH_HEIGHT}
            backgroundColor={BACKGROUND_COLOR}
            nodeLabel={nodeLabel}
            nodeRelSize={5}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={paintPointerArea}
            linkColor={() => LINK_COLOR}
            linkWidth={1}
            onNodeClick={handleNodeClick}
            onEngineStop={handleEngineStop}
          />
        )}
      </div>

      <p className="movie-graph__status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
