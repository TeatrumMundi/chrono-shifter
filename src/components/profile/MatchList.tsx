"use client";

import { FormatResponseReturn, MatchResponse, ProcessedParticipant } from "@/types/interfaces";
import { getParticipantByPuuid, queueIdToGameMode, secToHHMMSS, timeAgo } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import { getChampionIcon, getItemIcon, getRuneImageUrl } from "@/utils/leagueAssets";
import Image from "next/image";

export function MatchList({ data, puuid }: { data: FormatResponseReturn; puuid: string }) {
  const mainPlayerMatches = useMemo(
      () =>
          data.match
              .map((match: MatchResponse) => getParticipantByPuuid(match, puuid))
              .filter((participant): participant is ProcessedParticipant => participant !== null),
      [data, puuid]
  );

  if (mainPlayerMatches.length === 0) {
    return (
        <div className="col-span-12 p-6 bg-gray-800/80 rounded-xl mt-4 text-gray-300 text-center tracking-[.25em]">
          No match data found for this player.
        </div>
    );
  }

  return (
      <>
        <h3 className="mt-6 text-lg font-semibold border-b border-gray-700 pb-2 text-gray-200 tracking-[.25em]">
          Recent Matches
        </h3>
        <div className="grid grid-cols-1 gap-4 tracking-[.25em]">
          {mainPlayerMatches.map((participant, index) => (
              <MatchCard key={index} participant={participant} match={data.match[index]} />
          ))}
        </div>
      </>
  );
}

function MatchDetail({ label, value, fullWidth = false, isImage = false }: {
  label: string;
  value: string;
  fullWidth?: boolean;
  isImage?: boolean
}) {
  return (
      <p className={`font-semibold text-gray-300 ${fullWidth ? "col-span-2" : ""}`}>
        {label}: {isImage ? (
          <Image
              src={value}
              alt={label}
              width={32}
              height={32}
              className="inline-block rounded-full"
          />
      ) : (
          <span className="text-gray-400">{value}</span>
      )}
      </p>
  );
}

function ParticipantList({ participants, gameMode }: { participants: ProcessedParticipant[]; gameMode: string }) {
  const teamColors = [
    'bg-blue-900/30',
    'bg-red-900/30',
    'bg-green-900/30',
    'bg-purple-900/30',
    'bg-yellow-900/30',
    'bg-cyan-900/30',
    'bg-pink-900/30',
    'bg-orange-900/30'
  ];

  if (gameMode === "Arena") {
    return (
        <div className="text-sm text-gray-400 tracking-normal">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: participants.length / 2 }, (_, i) => (
                <div
                    key={i}
                    className={`flex p-2 rounded ${teamColors[i]} transition-all duration-200 hover:opacity-80`}
                >
                  <div className="flex items-center w-[45%] justify-end gap-1">
                <span className="truncate text-sm">
                  {participants[i * 2]?.riotIdGameName}
                </span>
                    <ChampionIcon championName={participants[i * 2]?.championName} size={20} />
                  </div>
                  <span className="inline-block w-[10%] text-center font-medium text-gray-400 text-sm">&</span>
                  <div className="flex items-center w-[45%] gap-1">
                    <ChampionIcon championName={participants[i * 2 + 1]?.championName} size={20} />
                    <span className="truncate text-sm">
                  {participants[i * 2 + 1]?.riotIdGameName}
                </span>
                  </div>
                </div>
            ))}
          </div>
        </div>
    );
  }

  return (
      <div className="text-sm text-gray-400 tracking-normal">
        <div className="flex flex-col gap-2">
          {participants.slice(0, 5).map((player, i) => (
              <div key={i} className="flex">
                <div className="flex items-center w-[45%] justify-end gap-1 bg-blue-900/30 p-2 rounded">
                  <span className="truncate text-sm">{player.riotIdGameName}</span>
                  <ChampionIcon championName={player.championName} size={20} />
                </div>
                <span className="inline-block w-[10%] text-center font-medium text-gray-500">vs</span>
                <div className="flex items-center w-[45%] gap-1 bg-red-900/30 p-2 rounded">
                  <ChampionIcon championName={participants[i + 5]?.championName} size={20} />
                  <span className="truncate text-sm">{participants[i + 5]?.riotIdGameName}</span>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

function ItemDisplay({ items }: { items: number[] }) {
  return (
      <div className="flex flex-col gap-2">
        {[0, 3].map((startIdx) => (
            <div key={startIdx} className="flex gap-2">
              {items.slice(startIdx, startIdx + 3).map((itemId, idx) => (
                  itemId > 0 ? (
                      <Image
                          key={idx}
                          src={getItemIcon(itemId)}
                          alt={`Item ${itemId}`}
                          width={32}
                          height={32}
                          className="rounded-md border border-gray-600"
                      />
                  ) : (
                      <div key={idx} className="w-8 h-8 bg-gray-700 rounded-md border border-gray-600" />
                  )
              ))}
            </div>
        ))}
      </div>
  );
}

function RuneDisplay({ primaryRuneUrl, runePathUrl }: { primaryRuneUrl: string; runePathUrl: string }) {
  return (
      <div className="flex flex-col items-center bg-gray-800 rounded-full p-1 border border-gray-600">
        {primaryRuneUrl && (
            <Image
                src={primaryRuneUrl}
                alt="Primary Rune"
                width={32}
                height={32}
                className="rounded-full"
            />
        )}
        {runePathUrl && (
            <Image
                src={runePathUrl}
                alt="Rune Path"
                width={20}
                height={20}
                className="rounded-full -mt-1"
            />
        )}
      </div>
  );
}

function ChampionIcon({ championName, size }: { championName: string; size: number }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
        <div
            style={{ width: size, height: size }}
            className="bg-gray-900 rounded-full border border-gray-600 flex items-center justify-center text-gray-400"
        >
          ?
        </div>
    );
  }

  return (
      <Image
          src={getChampionIcon(championName)}
          alt={championName}
          width={size}
          height={size}
          className="rounded-full border border-gray-600"
          onError={() => setError(true)}
      />
  );
}

function MatchCard({ participant, match }: { participant: ProcessedParticipant; match: MatchResponse }) {
  const [primaryRuneUrl, setPrimaryRuneUrl] = useState('');
  const [runePathUrl, setRunePathUrl] = useState('');
  const [hasRunes, setHasRunes] = useState(false);

  useEffect(() => {
    if (!participant.runes?.length) {
      setHasRunes(false);
      setPrimaryRuneUrl('');
      setRunePathUrl('');
      return;
    }

    setHasRunes(true);
    const [firstRune] = participant.runes;
    const lastRune = participant.runes.at(-1);

        if (firstRune?.icon) {
      getRuneImageUrl(firstRune.icon)
          .then(setPrimaryRuneUrl)
          .catch(() => setPrimaryRuneUrl(''));
    }

    if (lastRune?.runePath?.icon) {
      getRuneImageUrl(lastRune.runePath.icon)
          .then(setRunePathUrl)
          .catch(() => setRunePathUrl(''));
    }
  }, [participant.runes]);

  const gameMode = queueIdToGameMode[match.queueId] || "Unknown";
  const winText = participant.win ? "Win" : "Loss";
  const winTextColor = participant.win ? "text-green-500" : "text-red-500";

  return (
      <div className="p-5 bg-gray-800/80 rounded-xl shadow-lg transition-transform transform hover:scale-105 font-sans">
          <div className="flex items-center">
              {/* Left: Match Summary */}
              <div className="w-[15%] pr-2 border-r border-gray-700 flex flex-col items-center text-center">
                  <div className="text-lg font-semibold text-gray-200">{gameMode}</div>
                  <div className="text-gray-400 text-xs mt-1">{timeAgo(match.gameEndTimestamp)}</div>
                  <div className={`mt-1 text-base font-medium ${winTextColor}`}>{winText}</div>
                  <div className="text-gray-400 text-xs mt-1">{secToHHMMSS(match.gameDuration)}</div>
              </div>

              {/* Right: Match Details */}
              <div className="flex flex-row ml-4 flex-1">
                  <div className="grid grid-cols-2 gap-2 text-gray-400 text-sm w-full"> {/* Changed gap-3 to gap-2 */}
                      {/* Champion & Items */}
                      <div className="col-span-1 flex items-center gap-2">
                          <ChampionIcon championName={participant.championName} size={64} />
                          {hasRunes && <RuneDisplay primaryRuneUrl={primaryRuneUrl} runePathUrl={runePathUrl} />}
                          <ItemDisplay items={participant.items} />
                      </div>

                      {/* Match Stats */}
                      <div className="col-span-1 flex flex-col justify-center gap-2">
                          <MatchDetail label="KDA" value={`${participant.kills}/${participant.deaths}/${participant.assists} (${participant.kda})`} />
                          {participant.teamPosition && <MatchDetail label="Role" value={participant.teamPosition} />}
                          <MatchDetail label="Damage" value={participant.damageDealt.toString()} />
                          <MatchDetail label="Gold Earned" value={participant.goldEarned.toString()} />
                          {gameMode !== "Arena" && (
                              <>
                                  <MatchDetail label="Vision Score" value={participant.visionScore.toString()} />
                                  <MatchDetail label="Minions" value={`${participant.minionsKilled} (${participant.minionsPerMinute})`} />
                              </>
                          )}
                      </div>
                  </div>

                  {/* Participants List */}
                  <div className="ml-6 border-l border-gray-700 pl-4 w-1/2">
                      <ParticipantList participants={match.participants} gameMode={gameMode} />
                  </div>
              </div>
          </div>
      </div>
  );
}