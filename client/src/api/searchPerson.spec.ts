import { describe, it, expect } from "vitest";
import { searchPerson } from "./searchPerson";

describe("searchPerson", () => {
  it("returns people sorted by popularity, normalized", async () => {
    const results = await searchPerson("Test");

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe("Test Actor"); // higher popularity (15.5) sorts first
    expect(results[0].profileUrl).toContain("/actor.jpg");
    expect(results[1].profileUrl).toBeNull(); // no profile_path provided
  });

  it("returns an empty array for a blank query without calling the API", async () => {
    const results = await searchPerson("   ");
    expect(results).toEqual([]);
  });
});