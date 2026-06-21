import { writable, get } from 'svelte/store';
import { invoke } from '@tauri-apps/api/core';

export interface ClubLite {
    id: number;
    name: string;
    gameName: string;
}

// Incrementally-populated id -> name cache. The full clubs dataset lives in the
// Rust backend; the frontend only ever holds the names it has actually seen
// (resolved from player pages, picker searches, or explicit lookups).
export const clubNames = writable<Map<number, string>>(new Map());

/** Merge resolved id -> name pairs into the cache. */
export function rememberClubNames(entries: Record<number | string, string> | undefined | null) {
    if (!entries) return;
    const pairs = Object.entries(entries);
    if (pairs.length === 0) return;
    clubNames.update((current) => {
        const next = new Map(current);
        for (const [id, name] of pairs) next.set(+id, name);
        return next;
    });
}

/**
 * Look up a club name from a cache snapshot. Pass `$clubNames` so callers stay
 * reactive and re-render as names arrive. Falls back to the id as a string.
 */
export function clubNameFrom(
    cache: Map<number, string>,
    id: number | null | undefined,
): string | null {
    if (id === null || id === undefined) return null;
    return cache.get(id) ?? `${id}`;
}

/** Fetch names for any ids not already cached, then merge them in. */
export async function ensureClubNames(ids: (number | null | undefined)[]): Promise<void> {
    const cache = get(clubNames);
    const missing = [
        ...new Set(
            ids.filter((id): id is number => typeof id === 'number' && id > 0 && !cache.has(id)),
        ),
    ];
    if (missing.length === 0) return;
    const fetched = await invoke<Record<number, string>>('get_club_names', { ids: missing });
    rememberClubNames(fetched);
}

/** Search clubs for the picker autocomplete; caches the resulting names. */
export async function searchClubs(query: string, limit = 50): Promise<ClubLite[]> {
    const results = await invoke<ClubLite[]>('search_clubs', { query, limit });
    rememberClubNames(Object.fromEntries(results.map((c) => [c.id, c.name])));
    return results;
}
