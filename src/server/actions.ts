"use server";

import { redirect } from "next/navigation";

export async function handleSearch(formData: FormData) {
    const server = formData.get("server") as string;
    const nickTag = formData.get("nickTag") as string;

    const parts = nickTag.split('#');
    const profileLink = `/profile/?server=${server}&name=${parts[0]}&tag=${parts[1]}`;

    // Redirect the user to the profile page
    redirect(profileLink);
}
