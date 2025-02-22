export function GET(req: Request): Response {
    const url = new URL(req.url);
    const name = url.searchParams.get("name") || "Guest";

    return new Response(`Hello, ${name}!`, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
    });
}
