import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";

export async function selectFileAndLoad(convertBirthdates: boolean = false, gameYear: number = 0, modStartYear: number = 0): Promise<string | null> {
  const paths = await open({ multiple: true });
  if (paths) {
    const pathList = Array.isArray(paths) ? paths : [paths];
    await invoke("load_players_from_file", { 
      paths: pathList,
      convertBirthdates,
      gameYear,
      modStartYear
    });
    return pathList.length > 1 ? "Multiple files loaded" : pathList[0];
  }
  return null;
}

export async function selectSaveFile(): Promise<string | null> {
  const path = await open({
    multiple: false,
    directory: false,
  });
  
  if (Array.isArray(path)) return path[0];
  return path;
}

export async function savePlayersToFile(path: string, filters?: any) {
  await invoke("save_players_to_file", { path, filters });
}

export interface InvalidRow {
    row_number: number;
    content: string;
    file_path: string;
}

export async function getInvalidRows(): Promise<InvalidRow[]> {
  return await invoke("get_invalid_rows_list");
}

export async function appendPlayersFromFile(
  sourceGameYear: number,
  sourceModYear: number,
  targetGameYear: number,
  targetModYear: number
): Promise<number | null> {
  const path = await open({ multiple: false });
  if (path) {
    const filePath = Array.isArray(path) ? path[0] : path;
    const count = await invoke<number>("append_players_from_file", {
      path: filePath,
      sourceGameYear,
      sourceModYear,
      targetGameYear,
      targetModYear
    });
    return count;
  }
  return null;
}
