import { load } from "cheerio";

export async function getLatestPatchNotes() {
    const url = "https://www.leagueoflegends.com/en-us/news/game-updates/patch-14-7-notes/";
    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
        },
        next: { revalidate: 3600 }, // cache na 1h
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch patch notes: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    const patchVersion = $("h1").first().text().trim() || "Latest Patch";

    const changes: { champion: string; changes: string[] }[] = [];

    $("h3, h2").each((_, el) => {
        const title = $(el).text().trim();

        const isChampionSection =
            $(el).is("h3") &&
            /^[A-Z][a-z]+\s?$/.test(title) &&
            $(el).next().is("ul");

        if (isChampionSection) {
            const champion = title;
            const ul = $(el).next("ul");
            const changeItems: string[] = [];

            ul.find("li").each((_, li) => {
                const text = $(li).text().trim();
                if (text) changeItems.push(text);
            });

            if (changeItems.length > 0) {
                changes.push({ champion, changes: changeItems });
            }
        }
    });

    return {
        patchVersion,
        changes,
    };
}