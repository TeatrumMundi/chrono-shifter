import {Augment, AugmentData} from "@/types/interfaces";

export async function fetchAugmentById(id: number): Promise<Augment | undefined> {
    try {
        const response = await fetch("https://raw.communitydragon.org/latest/cdragon/arena/en_us.json");
        if (!response.ok) {
            console.error("Failed to fetch augment data");
            return undefined;
        }
        const data: AugmentData = await response.json();
        return data.augments.find((augment : Augment) => augment.id === id);
    } catch (error) {
        console.error("Error fetching augment data:", error);
        return undefined;
    }
}

// Example usage
fetchAugmentById(93).then(augment => console.log(augment));
