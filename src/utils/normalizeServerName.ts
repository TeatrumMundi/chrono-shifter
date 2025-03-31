import {serverMAP} from "@/utils/helper";


export function normalizeServerName(input: string): string {
    const lowerInput = input.toLowerCase();

    if (serverMAP[lowerInput]) return lowerInput;

    const found = Object.entries(serverMAP).find(
        ([, code]) => code.toLowerCase() === lowerInput
    );

    return found?.[0] ?? input.toLowerCase();
}
