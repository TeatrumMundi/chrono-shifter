export function createProfileLink(server: string, NickTag: string) : string
{
    const parts = NickTag.split('#');
    if (parts.length !== 2)
    {
        throw new Error("Input string must contain exactly one '#' character.");
    }
    else
    {
        return `/profile/?server=${server}&name=${parts[0]}&tag=${parts[1]}`;
    }
}