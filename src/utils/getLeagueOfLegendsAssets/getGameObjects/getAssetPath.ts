import path from "path";

export const getAssetPath = (file: string) =>
    path.join(process.cwd(), "src", "utils", "getLeagueOfLegendsAssets", "dataJSON", file);