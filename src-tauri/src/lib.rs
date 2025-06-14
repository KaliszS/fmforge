use once_cell::sync::Lazy;
use std::collections::BTreeMap;
use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::sync::Mutex;

mod model;
use crate::model::{Player, PlayerFilters, PlayerRecord, RecordType};

static PLAYERS: Lazy<Mutex<BTreeMap<usize, Player>>> = Lazy::new(|| Mutex::new(BTreeMap::new()));

#[tauri::command]
fn load_players_from_file(path: String) -> Result<(), String> {
    let file = fs::File::open(path).unwrap();
    let reader = BufReader::new(file);
    let mut loaded_players = BTreeMap::new();

    for (idx, line) in reader.lines().enumerate() {
        let line = line.map_err(|e| e.to_string())?;
        let raw_fields: Vec<&str> = line.split('"').collect();
        let fields: Vec<&str> = raw_fields
            .iter()
            .enumerate()
            .filter_map(|(i, s)| if i % 2 == 1 { Some(*s) } else { None })
            .collect();

        if fields.len() < 13 {
            continue;
        }

        let record_type = match fields[0] {
            "DETAILED_FUTURE_REGEN" => RecordType::DetailedFutureRegen,
            "SUPPORT STAFF" => RecordType::SupportStaff,
            _ => continue,
        };

        let player = Player {
            record_type,
            first_name: fields[1].to_string(),
            common_name: if fields[2].is_empty() {
                None
            } else {
                Some(fields[2].to_string())
            },
            last_name: fields[3].to_string(),
            birth_date: fields[4].to_string(),
            nationality_id: fields[5].parse().unwrap_or(-1),
            favourite_team_id: fields[6].parse().ok(),
            ethnicity: fields[7].parse().unwrap_or(-1),
            skin_tone: fields[8].parse().unwrap_or(-1),
            hair_color: fields[9].parse().unwrap_or(-1),
            height: fields[10].parse().unwrap_or(0),
            weight: fields[11].parse().unwrap_or(0),
            preferred_foot: fields.get(12).and_then(|s| s.parse().ok()),
            position: fields.get(13).map(|s| s.to_string()),
            favourite_number: fields.get(14).and_then(|s| s.parse().ok()),
            birth_city: if fields[15].is_empty() {
                None
            } else {
                Some(fields[15].to_string())
            },
            ca: fields.get(16).and_then(|s| s.parse().ok()),
            pa: fields.get(17).and_then(|s| s.parse().ok()),
            club_id: fields.get(18).and_then(|s| s.parse().ok()),
        };

        loaded_players.insert(idx, player);
    }

    let mut players = PLAYERS.lock().unwrap();
    *players = loaded_players;
    println!("Loaded {} players...", players.len());

    Ok(())
}

#[tauri::command]
fn get_players_page(
    offset: usize,
    limit: usize,
    filters: Option<PlayerFilters>,
) -> Vec<PlayerRecord> {
    let players = PLAYERS.lock().unwrap();
    players
        .iter()
        .filter(|(_, player)| {
            if let Some(ref f) = filters {
                if let Some(c) = f.country {
                    if player.nationality_id != c {
                        return false;
                    }
                }
                if let Some(cid) = f.club {
                    if player.club_id != Some(cid) {
                        return false;
                    }
                }
            }
            true
        })
        .skip(offset)
        .take(limit)
        .map(|(id, player)| PlayerRecord {
            id: *id,
            player: player.clone(),
        })
        .collect()
}

#[tauri::command]
fn update_players(new_players: Vec<PlayerRecord>) -> Result<(), String> {
    let mut players = PLAYERS.lock().map_err(|e| e.to_string())?;
    for record in new_players {
        players.insert(record.id, record.player);
    }
    Ok(())
}

#[tauri::command]
fn save_players_to_file(path: String) -> Result<(), String> {
    let players = PLAYERS.lock().map_err(|e| e.to_string())?;
    let mut file = fs::File::create(path).unwrap();

    for (_, player) in players.values().enumerate() {
        let line = format!(
            "\"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\" \"{}\"\n",
            player.record_type,
            player.first_name,
            player.common_name.clone().unwrap_or_default(),
            player.last_name,
            player.birth_date,
            player.nationality_id,
            player.favourite_team_id.map_or(String::new(), |v| v.to_string()),
            player.ethnicity,
            player.skin_tone,
            player.hair_color,
            player.height,
            player.weight,
            player.preferred_foot.map_or(String::new(), |v| v.to_string()),
            player.position.clone().unwrap_or_default(),
            player.favourite_number.map_or(String::new(), |v| v.to_string()),
            player.birth_city.clone().unwrap_or_default(),
            player.ca.map_or(String::new(), |v| v.to_string()),
            player.pa.map_or(String::new(), |v| v.to_string()),
            player.club_id.map_or(String::new(), |v| v.to_string()),
        );

        file.write_all(line.as_bytes()).unwrap();
    }

    println!("[SAVE] Successfully saved {}", players.len(),);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_players_from_file,
            get_players_page,
            update_players,
            save_players_to_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
