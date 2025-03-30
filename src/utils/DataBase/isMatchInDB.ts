import { prisma } from "@/lib/prisma";

export async function isMatchInDB(matchId: string): Promise<boolean> {
    const existing = await prisma.match.findUnique({
        where: { matchId },
        select: { id: true }
    });
    return !!existing;
}
