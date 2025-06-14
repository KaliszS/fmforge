import { invoke } from "@tauri-apps/api/core";
import type { PlayerRecord } from "$lib/types";

export async function loadPlayersPage(
  offset: number,
  limit: number,
  countryId: number | null,
  clubId: number | null,
): Promise<PlayerRecord[]> {
  return await invoke("get_players_page", {
    offset,
    limit,
    filters: {
      country: countryId || null,
      club: clubId ? clubId : null,
    },
  });
}
