// Truncate longer texts as you much you want :)
export function trunctateText(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
}
