"use server";

import { redirect } from "next/navigation";
import { createProfileLink } from "@/utils/createProfileLink";

export async function handleSearch(formData: FormData) {
    const server = formData.get("server") as string;
    const nickTag = formData.get("nickTag") as string;

    if (!server || !nickTag.includes("#"))
    {
        throw new Error("Invalid input: Please enter a valid region and Nickname#Tag.");
    }

    // Generate the profile link
    const profileLink = createProfileLink(server, nickTag);

    // Redirect the user to the profile page
    redirect(profileLink);
}
