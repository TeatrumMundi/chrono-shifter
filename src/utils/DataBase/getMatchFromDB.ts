import { prisma } from "@/lib/prisma";

export async function getMatchFromDB(matchId: string) {
    return prisma.match.findUnique({
        where: { matchId },
        include: {
            participants: true
        }
    });
}