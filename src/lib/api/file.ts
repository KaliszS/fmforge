import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import type { PlayerRecord } from "$lib/types";

export async function selectFileAndLoad(): Promise<string | null> {
  const path = await open({ multiple: false });
  if (typeof path === "string") {
    await invoke("load_players_from_file", { path });
    return path;
  }
  return null;
}

export async function selectSaveFile(): Promise<string | null> {
  const path = await save({
    filters: [
      {
        name: "EDT Files",
        extensions: ["edt"]
      }
    ],
    defaultPath: "regens_modified.edt"
  });
  return path;
}

export async function savePlayersToFile(path: string) {
  await invoke("save_players_to_file", { path });
}

export async function getProblematicRows(): Promise<number[]> {
  return await invoke("get_problematic_rows");
}
