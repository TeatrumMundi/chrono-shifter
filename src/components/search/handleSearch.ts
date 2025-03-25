"use server";

import { redirect } from "next/navigation";

type FormState = {
    error: string | null;
};

/**
 * Handles form submission on the server side.
 */
export async function handleSearch(prevState: FormState, formData: FormData): Promise<FormState> {
    const server = formData.get("server") as string;
    const nickTag = formData.get("nickTag") as string;

    if (!server || !nickTag) {
        return { error: "Please enter a summoner name and server." };
    }

    const [name, tag] = nickTag.split("#");

    if (!name || !tag) {
        return { error: "Please enter a valid Riot ID in the format: gameName#TAG." };
    }

    // Optional: validate tag length or characters
    if (tag.length < 2 || tag.length > 5 || /[^a-zA-Z0-9]/.test(tag)) {
        return { error: "Tag must be 2-5 alphanumeric characters." };
    }

    // Everything is fine — redirect to profile
    redirect(`/${server}/${name}/${tag}`);
}
