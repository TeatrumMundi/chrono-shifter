import { getSummonerProfile } from "@/utils/getSummonerProfile";
import { NextResponse } from "next/server";
import {reversedServerMAP} from "@/utils/helper";

export async function POST(req: Request) {
    try {
        const { server, name: gameName, tag: tagLine } = await req.json();

        const region = reversedServerMAP[server];

        const updated = await getSummonerProfile(region, gameName, tagLine, 25, true);

        if (!updated) {
            return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
        }

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}