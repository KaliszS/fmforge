use once_cell::sync::Lazy;
use std::collections::BTreeMap;
use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::sync::Mutex;

mod model;
use crate::model::{Player, PlayerFilters, PlayerRecord, RecordType};

static PLAYERS: Lazy<Mutex<BTreeMap<usize, Player>>> = Lazy::new(|| Mutex::new(BTreeMap::new()));
static PROBLEMATIC_ROWS: Lazy<Mutex<Vec<usize>>> = Lazy::new(|| Mutex::new(Vec::new()));

#[tauri::command]
fn load_players_from_file(path: String) -> Result<(), String> {
    let file = fs::File::open(path).unwrap();
    let reader = BufReader::new(file);
    let mut loaded_players = BTreeMap::new();
    
    // Clear previous problematic rows
    {
        let mut problematic_rows = PROBLEMATIC_ROWS.lock().unwrap();
        problematic_rows.clear();
    }

    for (idx, line) in reader.lines().enumerate() {
        let line = line.map_err(|e| e.to_string())?;
        let raw_fields: Vec<&str> = line.split('"').collect();
        let fields: Vec<&str> = raw_fields
            .iter()
            .enumerate()
            .filter_map(|(i, s)| if i % 2 == 1 { Some(*s) } else { None })
            .collect();


        if fields.len() < 19 {
            let row_number = idx + 1;
            {
                let mut problematic_rows = PROBLEMATIC_ROWS.lock().unwrap();
                problematic_rows.push(row_number);
            }
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

fn get_birth_year(birth_date: &str) -> Option<i32> {
    // Parse birth date in DD/MM/YYYY format
    let parts: Vec<&str> = birth_date.split('/').collect();
    if parts.len() == 3 {
        parts[2].parse().ok()
    } else {
        None
    }
}

fn sort_players(mut players: Vec<PlayerRecord>, sort_by: &str) -> Vec<PlayerRecord> {
    println!("Sorting players by: {}", sort_by);
    match sort_by {
        "ca_desc" => players.sort_by(|a, b| {
            let ca_a = a.player.ca.unwrap_or(0);
            let ca_b = b.player.ca.unwrap_or(0);
            ca_b.cmp(&ca_a)
        }),
        "ca_asc" => players.sort_by(|a, b| {
            let ca_a = a.player.ca.unwrap_or(0);
            let ca_b = b.player.ca.unwrap_or(0);
            ca_a.cmp(&ca_b)
        }),
        "pa_desc" => players.sort_by(|a, b| {
            let pa_a = a.player.pa.unwrap_or(0);
            let pa_b = b.player.pa.unwrap_or(0);
            pa_b.cmp(&pa_a)
        }),
        "pa_asc" => players.sort_by(|a, b| {
            let pa_a = a.player.pa.unwrap_or(0);
            let pa_b = b.player.pa.unwrap_or(0);
            pa_a.cmp(&pa_b)
        }),
        "age_desc" => players.sort_by(|a, b| {
            let year_a = get_birth_year(&a.player.birth_date).unwrap_or(0);
            let year_b = get_birth_year(&b.player.birth_date).unwrap_or(0);
            year_a.cmp(&year_b) // Older first (lower year = older)
        }),
        "age_asc" => players.sort_by(|a, b| {
            let year_a = get_birth_year(&a.player.birth_date).unwrap_or(0);
            let year_b = get_birth_year(&b.player.birth_date).unwrap_or(0);
            year_b.cmp(&year_a) // Younger first (higher year = younger)
        }),
        "name_asc" => players.sort_by(|a, b| {
            let name_a = format!("{} {}", a.player.first_name, a.player.last_name);
            let name_b = format!("{} {}", b.player.first_name, b.player.last_name);
            name_a.cmp(&name_b)
        }),
        "name_desc" => players.sort_by(|a, b| {
            let name_a = format!("{} {}", a.player.first_name, a.player.last_name);
            let name_b = format!("{} {}", b.player.first_name, b.player.last_name);
            name_b.cmp(&name_a)
        }),
        _ => {
            println!("Unknown sort option: {}", sort_by);
        }
    }
    println!("Sorted {} players", players.len());
    players
}

#[tauri::command]
fn get_players_page(
    offset: usize,
    limit: usize,
    filters: Option<PlayerFilters>,
) -> Vec<PlayerRecord> {
    println!("Getting players page - offset: {}, limit: {}", offset, limit);
    if let Some(ref f) = filters {
        println!("Filters: country={:?}, club={:?}, min_ca={:?}, max_ca={:?}, min_pa={:?}, max_pa={:?}, preferred_foot={:?}, favourite_number={:?}, birth_year_min={:?}, birth_year_max={:?}, sort_by={:?}", 
            f.country, f.club, f.min_ca, f.max_ca, f.min_pa, f.max_pa, f.preferred_foot, f.favourite_number, f.birth_year_min, f.birth_year_max, f.sort_by);
    }
    
    let players = PLAYERS.lock().unwrap();
    let mut filtered_players: Vec<PlayerRecord> = players
        .iter()
        .filter(|(_, player)| {
            if let Some(ref f) = filters {
                // Country filter
                if let Some(c) = f.country {
                    if player.nationality_id != c {
                        return false;
                    }
                }
                
                // Club filter
                if let Some(cid) = f.club {
                    if player.club_id != Some(cid) {
                        return false;
                    }
                }
                
                // CA range filter
                if let Some(min_ca) = f.min_ca {
                    if let Some(ca) = player.ca {
                        if ca < min_ca {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                if let Some(max_ca) = f.max_ca {
                    if let Some(ca) = player.ca {
                        if ca > max_ca {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                
                // PA range filter
                if let Some(min_pa) = f.min_pa {
                    if let Some(pa) = player.pa {
                        if pa < min_pa {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                if let Some(max_pa) = f.max_pa {
                    if let Some(pa) = player.pa {
                        if pa > max_pa {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                
                // Preferred foot filter
                if let Some(foot) = f.preferred_foot {
                    if player.preferred_foot != Some(foot) {
                        return false;
                    }
                }
                
                // Favourite number filter
                if let Some(fav_num) = f.favourite_number {
                    if player.favourite_number != Some(fav_num) {
                        return false;
                    }
                }
                
                // Birth year filter
                if let Some(birth_year) = f.birth_year_min {
                    if let Some(player_birth_year) = get_birth_year(&player.birth_date) {
                        if player_birth_year != birth_year {
                            return false;
                        }
                    } else {
                        println!("Failed to parse birth date: {}", player.birth_date);
                        return false;
                    }
                }
            }
            true
        })
        .map(|(id, player)| PlayerRecord {
            id: *id,
            player: player.clone(),
        })
        .collect();

    println!("Filtered to {} players", filtered_players.len());

    // Apply sorting - default to birthdate if no sort specified
    if let Some(ref f) = filters {
        if let Some(ref sort_by) = f.sort_by {
            filtered_players = sort_players(filtered_players, sort_by);
        } else {
            filtered_players = sort_players(filtered_players, "age_desc");
        }
    } else {
        filtered_players = sort_players(filtered_players, "age_desc");
    }

    // Apply pagination
    let result: Vec<PlayerRecord> = filtered_players
        .into_iter()
        .skip(offset)
        .take(limit)
        .collect();
    
    println!("Returning {} players for page", result.len());
    result
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
fn add_new_player() -> Result<usize, String> {
    // Don't add to PLAYERS immediately - just return a unique temporary ID
    // The player will be added to the backend when save_players_to_file is called
    use std::time::{SystemTime, UNIX_EPOCH};
    let temp_id = (SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as usize);
    println!("Prepared new player for later addition (temp ID: {})", temp_id);
    Ok(temp_id)
}

#[tauri::command]
fn remove_player(id: usize) -> Result<(), String> {
    let mut players = PLAYERS.lock().map_err(|e| e.to_string())?;
    players.remove(&id);
    println!("Removed player with ID: {}", id);
    Ok(())
}

#[tauri::command]
fn get_problematic_rows() -> Vec<usize> {
    let problematic_rows = PROBLEMATIC_ROWS.lock().unwrap();
    problematic_rows.clone()
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

    println!("[SAVE] Successfully saved {} players", players.len());
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
            add_new_player,
            remove_player,
            get_problematic_rows,
            save_players_to_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}