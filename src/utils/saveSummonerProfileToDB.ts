import { FormatResponseReturn, MatchResponse } from "@/types/ProcessedInterfaces";
import _ from "lodash";
import { prisma } from "@/lib/prisma";

export async function saveSummonerProfileToDB(profile: FormatResponseReturn) {
    const { playerInfo, soloRanked, flexRanked, match, championMasteries, entries } = profile;

    // Step 1: Upsert RankedInfo records
    let solo, flex;

    try {
        solo = await prisma.rankedInfo.upsert({
            where: { id: `${playerInfo.puuid}-solo` },
            update: soloRanked,
            create: {
                id: `${playerInfo.puuid}-solo`,
                ...soloRanked,
            },
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Failed to upsert Solo RankedInfo for ${playerInfo.puuid}`);
        console.error(`🟡 Data:`, JSON.stringify(soloRanked, null, 2));
        console.error(`🔴 Reason: ${errorMessage}`);
        throw new Error("Solo Ranked upsert failed");
    }

    try {
        flex = await prisma.rankedInfo.upsert({
            where: { id: `${playerInfo.puuid}-flex` },
            update: flexRanked,
            create: {
                id: `${playerInfo.puuid}-flex`,
                ...flexRanked,
            },
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Failed to upsert Flex RankedInfo for ${playerInfo.puuid}`);
        console.error(`🟡 Data:`, JSON.stringify(flexRanked, null, 2));
        console.error(`🔴 Reason: ${errorMessage}`);
        throw new Error("Flex Ranked upsert failed");
    }

    // Step 2: Upsert PlayerInfo
    await prisma.playerInfo.upsert({
        where: { puuid: playerInfo.puuid },
        update: {
            gameName: playerInfo.gameName,
            tagLine: playerInfo.tagLine.toUpperCase(),
            server: playerInfo.server,
            profileIconId: playerInfo.profileIconId,
            summonerLevel: playerInfo.summonerLevel,
            soloRankedId: solo.id,
            flexRankedId: flex.id,
        },
        create: {
            ...playerInfo,
            tagLine: playerInfo.tagLine.toUpperCase(),
            soloRankedId: solo.id,
            flexRankedId: flex.id,
        },
    });

    const playerId = (await prisma.playerInfo.findUnique({
        where: { puuid: playerInfo.puuid },
        select: { id: true },
    }))?.id;

    if (!playerId) throw new Error("❌ Failed to locate player ID after upsert.");

    // Step 3: Cleanup old related data
    await Promise.all([
        prisma.matchParticipant.deleteMany({
            where: {
                matchId: {
                    in: match.map(m => m.matchId),
                },
            },
        }),
        prisma.rawChampionMastery.deleteMany({ where: { playerInfoId: playerId } }),
        prisma.rawRankedEntry.deleteMany({ where: { playerInfoId: playerId } }),
    ]);

    // Step 4: Insert matches
    const uniqueMatches = _.uniqBy(match, (m) => m.matchId);
    await prisma.match.createMany({
        data: uniqueMatches.map((m: MatchResponse) => ({
            matchId: m.matchId,
            gameMode: m.gameMode,
            queueId: m.queueId,
            gameDuration: m.gameDuration,
            gameEndTimestamp: BigInt(m.gameEndTimestamp),
        })),
        skipDuplicates: true,
    });

    // Step 5: Insert participants (no foreign key to PlayerInfo)
    await prisma.matchParticipant.createMany({
        data: uniqueMatches.flatMap((m) =>
            m.participants.map((p) => ({
                matchId: m.matchId,
                puuid: p.puuid,
                riotIdGameName: p.riotIdGameName,
                riotIdTagline: p.riotIdTagline,
                server: p.server,
                teamPosition: p.teamPosition,
                champLevel: p.champLevel,
                kills: p.kills,
                deaths: p.deaths,
                assists: p.assists,
                kda: p.kda,
                visionScore: p.visionScore,
                visionPerMinute: p.visionPerMinute,
                damageDealt: p.damageDealt,
                goldEarned: p.goldEarned,
                wardsPlaced: p.wardsPlaced,
                totalHealsOnTeammates: p.totalHealsOnTeammates,
                totalDamageShieldedOnTeammates: p.totalDamageShieldedOnTeammates,
                minionsKilled: p.minionsKilled,
                minionsPerMinute: p.minionsPerMinute,
                win: p.win,
                teamId: p.teamId,
                champion: JSON.parse(JSON.stringify(p.champion)),
                runes: JSON.parse(JSON.stringify(p.runes)),
                items: JSON.parse(JSON.stringify(p.items)),
                arenaData: p.arenaData ? JSON.parse(JSON.stringify(p.arenaData)) : null
            }))
        ),
        skipDuplicates: true
    });

    // Step 6: Champion masteries
    await prisma.rawChampionMastery.createMany({
        data: championMasteries.map((m) => ({
            championId: m.championId,
            championLevel: m.championLevel,
            championPoints: m.championPoints,
            playerInfoId: playerId,
        })),
    });

    // Step 7: Ranked entries
    await prisma.rawRankedEntry.createMany({
        data: entries.map((e) => ({
            queueType: e.queueType,
            tier: e.tier,
            rank: e.rank,
            leaguePoints: e.leaguePoints,
            wins: e.wins,
            losses: e.losses,
            playerInfoId: playerId,
        })),
    });
}