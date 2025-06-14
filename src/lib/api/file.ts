import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { PlayerRecord } from "$lib/types";

export async function selectFileAndLoad(): Promise<string | null> {
  const path = await open({ multiple: false });
  if (typeof path === "string") {
    await invoke("load_players_from_file", { path });
    return path;
  }
  return null;
}

export async function savePlayersToFile(players: PlayerRecord[], path: string) {
  await invoke("update_players", { newPlayers: players });
  await invoke("save_players_to_file", { path });
}
