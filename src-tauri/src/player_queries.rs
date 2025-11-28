use crate::model::{PlayerFilters, PlayerRecord};
use crate::{get_players};
use crate::utils::{get_birth_year, sort_players};

#[tauri::command]
pub fn get_players_chunk(filters: Option<PlayerFilters>) -> Vec<PlayerRecord> {
    println!("Getting players chunk with filters");
    if let Some(ref f) = filters {
        println!("Filters: country={:?}, club={:?}, min_ca={:?}, max_ca={:?}, min_pa={:?}, max_pa={:?}, preferred_foot={:?}, favourite_number={:?}, birth_year_min={:?}, birth_year_max={:?}, sort_by={:?}", 
            f.country, f.club, f.min_ca, f.max_ca, f.min_pa, f.max_pa, f.preferred_foot, f.favourite_number, f.birth_year_min, f.birth_year_max, f.sort_by);
    }
    
    let players = get_players().lock().unwrap();
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
            filtered_players = sort_players(filtered_players, &["age_desc".to_string()]);
        }
    } else {
        filtered_players = sort_players(filtered_players, &["age_desc".to_string()]);
    }

    println!("Returning {} players chunk", filtered_players.len());
    filtered_players
}

#[tauri::command]
pub fn get_players_page(
    offset: usize,
    limit: usize,
    filters: Option<PlayerFilters>,
) -> Vec<PlayerRecord> {
    println!("Getting players page - offset: {}, limit: {}", offset, limit);
    
    let filtered_players = get_players_chunk(filters);

    let result: Vec<PlayerRecord> = filtered_players
        .into_iter()
        .skip(offset)
        .take(limit)
        .collect();
    
    println!("Returning {} players for page", result.len());
    result
}
