import { invoke } from "@tauri-apps/api/core";
import type { PlayerRecord } from "$lib/types";

export async function loadPlayersPage(
  offset: number,
  limit: number,
  countryId: number | null,
  clubId: number | null,
  minCA: number | null,
  maxCA: number | null,
  minPA: number | null,
  maxPA: number | null,
  preferredFoot: number | null,
  favouriteNumber: number | null,
  birthYear: number | null,
  sortBy: string | null,
): Promise<PlayerRecord[]> {
  return await invoke("get_players_page", {
    offset,
    limit,
    filters: {
      country: countryId || null,
      club: clubId ? clubId : null,
      min_ca: minCA || null,
      max_ca: maxCA || null,
      min_pa: minPA || null,
      max_pa: maxPA || null,
      preferred_foot: preferredFoot,
      favourite_number: favouriteNumber || null,
      birth_year_min: birthYear || null,
      birth_year_max: birthYear || null,
      sort_by: sortBy || null,
    },
  });
}