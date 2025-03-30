import { describe, it, expect } from "vitest";
import { getSummonerProfile } from "@/utils/getSummonerProfile";

const server = "EUNE";
const gameName = "kast220";
const tagLine = "EUNE";

describe("getSummonerProfile()", () => {
    it("should return a valid FormatResponseReturn object", async () => {
        const result = await getSummonerProfile(server, gameName, tagLine);

        expect(result).toBeDefined();
        expect(result?.playerInfo?.gameName).toBe(gameName);
    });
});
