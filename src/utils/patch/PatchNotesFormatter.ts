export interface ChampionChange {
    name: string;
    changes: string[];
}

export interface SectionContent {
    subtitle: string;
    changes: ChampionChange[];
}
/**
 * Transforms flat string[] patch note content into structured content grouped by subtitle and champions/items.
 * Deduplicates changes by (subtitle + name and change).
 */
export function transformSectionContent(rawContent: string[]): SectionContent[] {
    const sections: SectionContent[] = [];
    let currentSubtitle: string | null = null;
    let currentChampion: ChampionChange | null = null;
    let currentChanges: ChampionChange[] = [];

    const pushCurrentChampion = () => {
        if (currentChampion) {
            const existing = currentChanges.find(c => c.name === currentChampion!.name);
            if (existing) {
                const merged = new Set([...existing.changes, ...currentChampion.changes]);
                existing.changes = Array.from(merged);
            } else {
                currentChanges.push(currentChampion);
            }
            currentChampion = null;
        }
    };

    const pushCurrentSection = () => {
        if (currentSubtitle) {
            pushCurrentChampion();
            const existing = sections.find(s => s.subtitle === currentSubtitle);
            if (existing) {
                for (const change of currentChanges) {
                    const existingEntity = existing.changes.find(c => c.name === change.name);
                    if (existingEntity) {
                        const merged = new Set([...existingEntity.changes, ...change.changes]);
                        existingEntity.changes = Array.from(merged);
                    } else {
                        existing.changes.push(change);
                    }
                }
            } else {
                sections.push({
                    subtitle: currentSubtitle,
                    changes: [...currentChanges],
                });
            }
            currentChanges = [];
        }
    };

    for (const raw of rawContent) {
        const lines = raw.split("\n").map(line => line.trim()).filter(Boolean);

        for (const line of lines) {
            if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(line)) {
                pushCurrentSection();
                currentSubtitle = line;
            } else if (/^[A-Z][a-zA-Z' -]+(?: [IVX]+)?$/.test(line)) {
                pushCurrentChampion();
                currentChampion = { name: line, changes: [] };
            } else {
                if (!currentSubtitle) currentSubtitle = "General";
                if (!currentChampion) {
                    currentChampion = { name: "General", changes: [] };
                }
                currentChampion.changes.push(line);
            }
        }
    }

    pushCurrentSection();
    return sections;
}
