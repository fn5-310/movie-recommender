import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import router from "./example.routes.js";
import Example from "../models/example.model.js";

// hoist above vi.mock factory call
const { findMock } = vi.hoisted(() => ({
  findMock: vi.fn(),
}));

vi.mock("../models/example.model.js", () => ({
    default: {
        find: findMock,
        findById: vi.fn(),
        create: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
    },
}));

const app = express();
app.use(express.json());
app.use("/api/examples", router);

describe("example routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/examples returns a list", async () => {
    findMock.mockReturnValue({
      sort: vi.fn().mockResolvedValue([{ name: "demo" }]), // mock an output for sort function (in getAll)
    });

    const res = await request(app).get("/api/examples/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ name: "demo" }]);
  });

  it("GET /api/examples/:id returns 404 when not found", async () => {
    Example.findById.mockResolvedValue(null);

    const res = await request(app).get("/api/examples/123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Not found" });
  });
});