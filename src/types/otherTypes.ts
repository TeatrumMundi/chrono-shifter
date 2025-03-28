import {FormatResponseReturn, MatchResponse, ProcessedParticipant} from "@/types/ProcessedInterfaces";

/**
 * Props for the Banner component
 */
export interface BannerProps {
    data: FormatResponseReturn;
    splashUrl?: string | null;
}

/**
 * Props for the MatchCard component
 */
export interface MatchCardProps {
    participant: ProcessedParticipant;
    match: MatchResponse;
    server: string;
}