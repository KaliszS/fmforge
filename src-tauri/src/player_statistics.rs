use crate::model::{PlayerFilters, PlayerRecord, PlayerStatistics, NumberStats, TopPlayers};
use crate::{get_players};
use crate::utils::get_birth_year;

#[tauri::command]
pub fn get_player_statistics(filters: Option<PlayerFilters>) -> PlayerStatistics {
    println!("Getting player statistics with filters");
    
    let players = get_players().lock().unwrap();
    let filtered_players: Vec<PlayerRecord> = players
        .iter()
        .filter(|(_, player)| {
            if let Some(ref f) = filters {
                // Apply same filtering logic as get_players_chunk
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
                if let Some(min_ca) = f.min_ca {
                    if let Some(ca) = player.ca {
                        if ca < min_ca { return false; }
                    } else { return false; }
                }
                if let Some(max_ca) = f.max_ca {
                    if let Some(ca) = player.ca {
                        if ca > max_ca { return false; }
                    } else { return false; }
                }
                if let Some(min_pa) = f.min_pa {
                    if let Some(pa) = player.pa {
                        if pa < min_pa { return false; }
                    } else { return false; }
                }
                if let Some(max_pa) = f.max_pa {
                    if let Some(pa) = player.pa {
                        if pa > max_pa { return false; }
                    } else { return false; }
                }
                if let Some(foot) = f.preferred_foot {
                    if player.preferred_foot != Some(foot) {
                        return false;
                    }
                }
                if let Some(fav_num) = f.favourite_number {
                    if player.favourite_number != Some(fav_num) {
                        return false;
                    }
                }
                if let Some(birth_year) = f.birth_year_min {
                    if let Some(player_birth_year) = get_birth_year(&player.birth_date) {
                        if player_birth_year != birth_year {
                            return false;
                        }
                    } else { return false; }
                }
            }
            true
        })
        .map(|(id, player)| PlayerRecord {
            id: *id,
            player: player.clone(),
        })
        .collect();

    let count = filtered_players.len();
    
    let ca_values: Vec<i32> = filtered_players.iter()
        .filter_map(|record| record.player.ca)
        .collect();
    let ca_stats = if !ca_values.is_empty() {
        Some(calculate_number_stats(&ca_values))
    } else {
        None
    };

    let pa_values: Vec<i32> = filtered_players.iter()
        .filter_map(|record| record.player.pa)
        .collect();
    let pa_stats = if !pa_values.is_empty() {
        Some(calculate_number_stats(&pa_values))
    } else {
        None
    };

    let height_values: Vec<i32> = filtered_players.iter()
        .map(|record| record.player.height)
        .filter(|&h| h > 0)
        .collect();
    let height_stats = if !height_values.is_empty() {
        Some(calculate_number_stats(&height_values))
    } else {
        None
    };


    let weight_values: Vec<i32> = filtered_players.iter()
        .map(|record| record.player.weight)
        .filter(|&w| w > 0)
        .collect();
    let weight_stats = if !weight_values.is_empty() {
        Some(calculate_number_stats(&weight_values))
    } else {
        None
    };

    let mut position_counts = std::collections::HashMap::new();
    for record in &filtered_players {
        if let Some(ref position) = record.player.position {
            *position_counts.entry(position.clone()).or_insert(0) += 1;
        }
    }

    let mut preferred_foot_counts = std::collections::HashMap::new();
    for record in &filtered_players {
        if let Some(foot) = record.player.preferred_foot {
            *preferred_foot_counts.entry(foot).or_insert(0) += 1;
        }
    }

    let mut nationality_counts = std::collections::HashMap::new();
    for record in &filtered_players {
        *nationality_counts.entry(record.player.nationality_id).or_insert(0) += 1;
    }

    PlayerStatistics {
        count,
        ca_stats,
        pa_stats,
        height_stats,
        weight_stats,
        position_counts,
        preferred_foot_counts,
        nationality_counts,
    }
}

#[tauri::command]
pub fn get_top_players(filters: Option<PlayerFilters>, limit: usize) -> TopPlayers {
    println!("Getting top players with limit: {}", limit);
    
    let players = get_players().lock().unwrap();
    let filtered_players: Vec<PlayerRecord> = players
        .iter()
        .filter(|(_, player)| {
            if let Some(ref f) = filters {
                // Apply same filtering logic
                if let Some(c) = f.country {
                    if player.nationality_id != c { return false; }
                }
                if let Some(cid) = f.club {
                    if player.club_id != Some(cid) { return false; }
                }
                if let Some(min_ca) = f.min_ca {
                    if let Some(ca) = player.ca {
                        if ca < min_ca { return false; }
                    } else { return false; }
                }
                if let Some(max_ca) = f.max_ca {
                    if let Some(ca) = player.ca {
                        if ca > max_ca { return false; }
                    } else { return false; }
                }
                if let Some(min_pa) = f.min_pa {
                    if let Some(pa) = player.pa {
                        if pa < min_pa { return false; }
                    } else { return false; }
                }
                if let Some(max_pa) = f.max_pa {
                    if let Some(pa) = player.pa {
                        if pa > max_pa { return false; }
                    } else { return false; }
                }
                if let Some(foot) = f.preferred_foot {
                    if player.preferred_foot != Some(foot) { return false; }
                }
                if let Some(fav_num) = f.favourite_number {
                    if player.favourite_number != Some(fav_num) { return false; }
                }
                if let Some(birth_year) = f.birth_year_min {
                    if let Some(player_birth_year) = get_birth_year(&player.birth_date) {
                        if player_birth_year != birth_year { return false; }
                    } else { return false; }
                }
            }
            true
        })
        .map(|(id, player)| PlayerRecord {
            id: *id,
            player: player.clone(),
        })
        .collect();

    let mut ca_players: Vec<PlayerRecord> = filtered_players.iter()
        .filter(|record| record.player.ca.is_some())
        .cloned()
        .collect();
    ca_players.sort_by(|a, b| b.player.ca.unwrap().cmp(&a.player.ca.unwrap()));
    
    let mut pa_players: Vec<PlayerRecord> = filtered_players.iter()
        .filter(|record| record.player.pa.is_some())
        .cloned()
        .collect();
    pa_players.sort_by(|a, b| b.player.pa.unwrap().cmp(&a.player.pa.unwrap()));
    
    let mut height_players: Vec<PlayerRecord> = filtered_players.iter()
        .filter(|record| record.player.height > 0)
        .cloned()
        .collect();
    height_players.sort_by(|a, b| b.player.height.cmp(&a.player.height));
    
    let mut weight_players: Vec<PlayerRecord> = filtered_players.iter()
        .filter(|record| record.player.weight > 0)
        .cloned()
        .collect();
    weight_players.sort_by(|a, b| b.player.weight.cmp(&a.player.weight));

    TopPlayers {
        top_ca: ca_players.iter().take(limit).cloned().collect(),
        top_pa: pa_players.iter().take(limit).cloned().collect(),
        top_height: height_players.iter().take(limit).cloned().collect(),
        top_weight: weight_players.iter().take(limit).cloned().collect(),
    }
}

fn calculate_number_stats(values: &[i32]) -> NumberStats {
    let mut sorted_values: Vec<f64> = values.iter().map(|&v| v as f64).collect();
    sorted_values.sort_by(|a, b| a.partial_cmp(b).unwrap());
    
    let len = sorted_values.len();
    let mean = sorted_values.iter().sum::<f64>() / len as f64;
    
    let median = if len % 2 == 0 {
        (sorted_values[len / 2 - 1] + sorted_values[len / 2]) / 2.0
    } else {
        sorted_values[len / 2]
    };
    
    let q25_idx = (len as f64 * 0.25) as usize;
    let q75_idx = (len as f64 * 0.75) as usize;
    let q25 = sorted_values[q25_idx];
    let q75 = sorted_values[q75_idx];
    
    let variance = sorted_values.iter()
        .map(|&x| (x - mean).powi(2))
        .sum::<f64>() / len as f64;
    let std_dev = variance.sqrt();
    
    NumberStats {
        min: sorted_values[0],
        max: sorted_values[len - 1],
        mean,
        median,
        q25,
        q75,
        std_dev,
    }
}
