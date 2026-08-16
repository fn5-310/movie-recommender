import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MovieDetail from "./MovieDetail";
import { server } from "../test/server";
import { http, HttpResponse } from "msw";
import App from "../App";
import userEvent from "@testing-library/user-event";

describe("MovieDetail", () => {
  // Test 1: loading state
  it("shows a loading message while fetching", () => {
    render(
      <MemoryRouter initialEntries={["/movie/123"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Loading movie details/i)).toBeInTheDocument();
  });

  // Test 2: poster shown
  it("shows the movie poster", async () => {
    render(
      <MemoryRouter initialEntries={["/movie/574475"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );
    const poster = await screen.findByAltText(/Final Destination Bloodlines/i);
    expect(poster).toHaveAttribute(
      "src",
      expect.stringContaining("final-destination-bloodlines"),
    );
  });

  // Test 3: movie details are shown
  it("displays the movie title, rating, release, runtime, and genres", async () => {
    render(
      <MemoryRouter initialEntries={["/movie/574475"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Final Destination Bloodlines"),
    ).toBeInTheDocument();
    expect(screen.getByText(/7.0 \/ 10/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-05-14/i)).toBeInTheDocument();
    expect(screen.getByText(/110 min/i)).toBeInTheDocument();
    expect(screen.getByText(/Horror, Mystery/i)).toBeInTheDocument();
  });

  //Test 4: Shows the overview
  it("shows the movie overview", async () => {
    render(
      <MemoryRouter initialEntries={["/movie/574475"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/Plagued by a violent recurring nightmare/i),
    ).toBeInTheDocument();
  });

  //Test 5: Shows the cast members
  it("shows all cast members with their names and characters", async () => {
    render(
      <MemoryRouter initialEntries={["/movie/574475"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText("Final Destination Bloodlines");

    expect(screen.getByText("Kaitlyn Santa Juana")).toBeInTheDocument();
    expect(screen.getByText("Stefani Reyes")).toBeInTheDocument();

    expect(screen.getByText("Teo Briones")).toBeInTheDocument();
    expect(screen.getByText("Charlie Reyes")).toBeInTheDocument();

    expect(screen.getByText("Rya Kihlstedt")).toBeInTheDocument();
    expect(screen.getByText("Darlene Campbell")).toBeInTheDocument();

    expect(screen.getByText("Richard Harmon")).toBeInTheDocument();
    expect(screen.getByText("Erik")).toBeInTheDocument();

    expect(screen.getByText("Owen Patrick Joyner")).toBeInTheDocument();
    expect(screen.getByText("Bobby")).toBeInTheDocument();
  });

  // Test 6: Movie not found error
  it("shows an error when API returns 404", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/movie/:id", () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    render(
      <MemoryRouter initialEntries={["/movie/999"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText(/Movie not found/i)).toBeInTheDocument();
  });

  // Test 7: back button goes back
  it('navigates back to the home page when "Back to Search" is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/movie/574475"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText("Final Destination Bloodlines");
    const backButton = screen.getByText(/← Back to Search/i);
    await user.click(backButton);

    expect(await screen.findByText("Find a movie")).toBeInTheDocument();
  });
});
