// Update src/server/actions.ts
"use server";

import { redirect } from "next/navigation";

export async function handleSearch(formData: FormData) {
    const server = formData.get("server") as string;
    const nickTag = formData.get("nickTag") as string;

    const parts = nickTag.split('#');
    const name = parts[0];
    const tag = parts[1] || '';

    if (!server || !name || !tag) {
        // Redirect to an error page or home page
        redirect('/');
    }

    // Redirect to the new dynamic route
    redirect(`/${server}/${name}/${tag}`);
}