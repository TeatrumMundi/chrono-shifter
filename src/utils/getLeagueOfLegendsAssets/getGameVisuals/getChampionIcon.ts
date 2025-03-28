import {Champion} from "@/types/ProcessedInterfaces";

export function getChampionIconUrl(champion: Champion): string {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.id}.png`;
}
