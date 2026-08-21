// currently requires RandomButton to be within <App/> to work properly, as the
// linking navigate function is contained in the <App/> tsx.

import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import App from "../App";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { delay, http, HttpResponse } from "msw";
import { server } from "../test/server";

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe("RandomButton", () => {
    beforeAll(() => {
        vi.stubEnv("VITE_TMDB_API_KEY", "test-key");
    })

    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route
                path="/"
                element={
                    <>
                    <App />
                    <LocationProbe />
                    </>
                }
                />
                <Route path="/movie/:id" element={<LocationProbe />} />
            </Routes>
            </MemoryRouter>,
        );
    })

    afterEach(() => {
        cleanup()
    })

    afterAll(() => {
        vi.unstubAllEnvs();
    })

    it("has valid initial text", async () => {
        expect(screen.getByText(/Go to Random Movie/i)).toBeInTheDocument();
    });

    it("changes text based on button state", async () => {

        server.use( // replace msw handler with 503 error
            http.get("http://localhost:5000/api/movies/random", async () => {
                await delay(200); // trivially long to complete mid-state assertion
                return HttpResponse.json({ message: "Successful entry" }, { status: 200 });
            })
        );

        const button = screen.getByText(/Go to Random Movie/i);
        fireEvent.click(button);

        // Intermediate state while fetch promise is unresolved
        expect(button).toHaveTextContent("Generating...");


        await waitFor(() => {
            expect(button).toHaveTextContent("Generated!");
        });
    });

    // MSW handler in place to always go to id 123
    it("successfully navigates to movie page", async () => {
        const button = screen.getByText(/Go to Random Movie/i);
        fireEvent.click(button);

        // Initially still in landing page
        expect(screen.getByTestId("location")).toHaveTextContent("/");

        // After completion, App should navigate
        await waitFor(() => {
            expect(button).toHaveTextContent("Generated!");
        });
        await waitFor(() => {
            expect(screen.getByTestId("location")).toHaveTextContent("/movie/123");
        });
    });

    it("gracefully error triggers and recovers", async () => {
        server.use( // replace msw handler with 503 error
            http.get("http://localhost:5000/api/movies/random", async () => {
                await delay(200); // trivially long to complete mid-state assertion
                return HttpResponse.json({ message: "Service down" }, { status: 503 });
            })
        );

        const button = screen.getByText(/Go to Random Movie/i);
        fireEvent.click(button);

        // mid state call, still loading
        expect(button).toHaveTextContent("Generating...");
        expect(screen.getByTestId("location")).toHaveTextContent("/");

        // No navigation occurs (i.e. error page)
        await waitFor(() => {
            expect(button).not.toHaveTextContent("Generated!");
        });
        await waitFor(() => {
            expect(screen.getByTestId("location")).toHaveTextContent("/");
        });
    });
});