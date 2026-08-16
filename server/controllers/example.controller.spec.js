import { testFunction } from "./example.controller.js";
import { describe, it, expect } from "vitest";


describe("testFunction", () => {
    it("joins two strings together with a hyphen", async () => {
        const string1 = "this is a";
        const string2 = "comparability";
        const result = await testFunction(string1, string2);

        // use async/await only if tested function is async
        expect(result).toBe("this is a-comparability");
    });

    it("should return string1 twice on error", async () => {
        const string1 = "error";
        const result = await testFunction(string1, null)

        expect(result).toBe("error-error");
    })
})