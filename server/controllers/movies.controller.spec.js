import { testFunction } from "./example.controller.js";
import { getRandomMovie } from "./movies.controller.js";
import {randomInt} from "node:crypto";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { request } from "supertest";

// mock randomInt function to override
vi.mock("node:crypto", () => ({
    randomInt: vi.fn()
}));

describe("getRandomMovie", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("gets and returns json data", async () => {
        // if fetches, mocks json response with result
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                results: [{ name: "this" }, { name: "that" }],
            }),
            }
        );

        const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
        };

        await getRandomMovie({}, res);

        expect(res.json).toHaveBeenCalled();
    });

    it("returns correct indexed data", async () => {
        vi.mocked(randomInt).mockReturnValue(0);

        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(
            JSON.stringify({
                results: [{ name: "this" }, { name: "that" }]
            }),
            )
        );

        const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
        };

        await getRandomMovie({}, res);

        expect(res.json).toHaveBeenCalledWith({name:"this"});
    });

    it("exits gracefully when fetch error", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            Response.json({ error: "Service Unavailable" }, { status: 503 })
        );

        const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
        };

        await getRandomMovie({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"TMDB request failed with status code: 503"});
    })
})