﻿import { PrismaClient } from "@prisma/client";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const prisma = new PrismaClient();
const MAX_ALLOWED = 16;

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe("MatchParticipant sanity check", () => {
    it(`should not have more than ${MAX_ALLOWED} participants per match`, async () => {
        const allMatches = await prisma.matchParticipant.groupBy({
            by: ["matchId"],
            _count: { matchId: true },
        });

        const max = Math.max(...allMatches.map(m => m._count.matchId));
        console.log(`✅ Maksymalna liczba uczestników w jednym meczu: ${max}`);

        const excessive = allMatches.filter(m => m._count.matchId > MAX_ALLOWED);

        if (excessive.length > 0) {
            console.warn("⚠️ Mecze z nadmiarem uczestników znalezione:");
            excessive.forEach((m) => {
                console.warn(`- ${m.matchId} → ${m._count.matchId} uczestników`);
            });
            console.warn(`🚨 Maksymalna liczba uczestników w jednym meczu: ${max}`);
        }

        expect(excessive.length).toBe(0);
    });
});
