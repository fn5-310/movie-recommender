import { useLocation } from "react-router-dom";

// test component tracking current path/url
export default function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}