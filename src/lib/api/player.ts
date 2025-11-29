import { invoke } from "@tauri-apps/api/core";
import type { PlayerRecord, Player } from "$lib/types";

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
  nameQuery: string | null,
  sortBy: string[] | null,
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
      name_query: nameQuery || null,
      sort_by: sortBy || null,
    },
  });
}

export async function addNewPlayer(): Promise<number> {
  return await invoke("add_new_player", { });
}

export async function removePlayer(id: number): Promise<void> {
  return await invoke("remove_player", { id });
}

export async function updatePlayers(players: PlayerRecord[]): Promise<void> {
  return await invoke("update_players", { newPlayers: players });
}

export async function getPlayerStatistics(
  countryId: number | null,
  clubId: number | null,
  minCA: number | null,
  maxCA: number | null,
  minPA: number | null,
  maxPA: number | null,
  preferredFoot: number | null,
  favouriteNumber: number | null,
  birthYear: number | null,
  nameQuery: string | null,
  sortBy: string[] | null,
): Promise<any> {
  return await invoke("get_player_statistics", {
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
      name_query: nameQuery || null,
      sort_by: sortBy || null,
    },
  });
}

export async function getTopPlayers(
  countryId: number | null,
  clubId: number | null,
  minCA: number | null,
  maxCA: number | null,
  minPA: number | null,
  maxPA: number | null,
  preferredFoot: number | null,
  favouriteNumber: number | null,
  birthYear: number | null,
  nameQuery: string | null,
  sortBy: string[] | null,
  limit: number = 10,
): Promise<any> {
  return await invoke("get_top_players", {
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
      name_query: nameQuery || null,
      sort_by: sortBy || null,
    },
    limit,
  });
}