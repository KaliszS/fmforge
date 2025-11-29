use std::collections::{BTreeMap, HashSet};
use std::fs;
use std::io::{BufRead, BufReader, Write};

use crate::model::{Player, RecordType, PlayerFilters};
use crate::{get_players, get_problematic_rows};
use crate::utils::{get_birth_year, matches_search_query};

#[tauri::command]
pub fn load_players_from_file(
    paths: Vec<String>,
    convert_birthdates: bool,
    game_year: i32,
    mod_start_year: i32,
) -> Result<(), String> {
    let mut loaded_players = BTreeMap::new();
    let mut unique_players = HashSet::new();
    let mut global_idx = 0;
    
    let year_offset = if convert_birthdates {
        game_year - mod_start_year - 1
    } else {
        0
    };
    
    {
        let mut problematic_rows = get_problematic_rows().lock().unwrap();
        problematic_rows.clear();
    }

    for path in paths {
        let file = fs::File::open(&path).map_err(|e| format!("Failed to open {}: {}", path, e))?;
        let reader = BufReader::new(file);

        for (line_idx, line) in reader.lines().enumerate() {
            let line = line.map_err(|e| e.to_string())?;
            let raw_fields: Vec<&str> = line.split('"').collect();
            let fields: Vec<&str> = raw_fields
                .iter()
                .enumerate()
                .filter_map(|(i, s)| if i % 2 == 1 { Some(*s) } else { None })
                .collect();


            if fields.len() < 19 {
                let row_number = line_idx + 1;
                // We only track problematic rows for the first file or we need a better way to report them
                // For now, let's just log them to console or ignore for subsequent files to avoid confusion
                // Or maybe we can store them with file index? 
                // For simplicity, let's just add them to the list, but user won't know which file.
                // Ideally we should improve this later.
                {
                    let mut problematic_rows = get_problematic_rows().lock().unwrap();
                    problematic_rows.push(row_number);
                }
                continue;
            }

            let record_type = match fields[0] {
                "DETAILED_FUTURE_REGEN" => RecordType::DetailedFutureRegen,
                "SUPPORT STAFF" => RecordType::SupportStaff,
                _ => continue,
            };

            let mut birth_date = fields[4].to_string();
            if convert_birthdates {
                let parts: Vec<&str> = birth_date.split('/').collect();
                if parts.len() == 3 {
                    if let Ok(year) = parts[2].parse::<i32>() {
                        let new_year = year + year_offset;
                        birth_date = format!("{}/{}/{}", parts[0], parts[1], new_year);
                    }
                }
            }

            let player = Player {
                record_type,
                first_name: fields[1].to_string(),
                common_name: if fields[2].is_empty() {
                    None
                } else {
                    Some(fields[2].to_string())
                },
                last_name: fields[3].to_string(),
                birth_date,
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

            if unique_players.contains(&player) {
                continue;
            }

            unique_players.insert(player.clone());
            loaded_players.insert(global_idx, player);
            global_idx += 1;
        }
    }

    let mut players = get_players().lock().unwrap();
    *players = loaded_players;
    println!("Loaded {} players...", players.len());

    Ok(())
}

#[tauri::command]
pub fn save_players_to_file(path: String, filters: Option<PlayerFilters>) -> Result<(), String> {
    let players = get_players().lock().map_err(|e| e.to_string())?;
    let mut file = fs::File::create(path).unwrap();

    for (_, player) in players.values().enumerate() {
        // Apply filters if present
        if let Some(ref f) = filters {
            // Name filter
            if let Some(ref query) = f.name_query {
                if !matches_search_query(player, query) {
                    continue;
                }
            }

            // Country filter
            if let Some(c) = f.country {
                if player.nationality_id != c {
                    continue;
                }
            }
            
            // Club filter
            if let Some(cid) = f.club {
                if player.club_id != Some(cid) {
                    continue;
                }
            }
            
            // CA range filter
            if let Some(min_ca) = f.min_ca {
                if let Some(ca) = player.ca {
                    if ca < min_ca {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            if let Some(max_ca) = f.max_ca {
                if let Some(ca) = player.ca {
                    if ca > max_ca {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            
            // PA range filter
            if let Some(min_pa) = f.min_pa {
                if let Some(pa) = player.pa {
                    if pa < min_pa {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            if let Some(max_pa) = f.max_pa {
                if let Some(pa) = player.pa {
                    if pa > max_pa {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            
            // Preferred foot filter
            if let Some(foot) = f.preferred_foot {
                if player.preferred_foot != Some(foot) {
                    continue;
                }
            }
            
            // Favourite number filter
            if let Some(fav_num) = f.favourite_number {
                if player.favourite_number != Some(fav_num) {
                    continue;
                }
            }
            
            // Birth year filter
            if let Some(birth_year) = f.birth_year_min {
                if let Some(player_birth_year) = get_birth_year(&player.birth_date) {
                    if player_birth_year != birth_year {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }

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

