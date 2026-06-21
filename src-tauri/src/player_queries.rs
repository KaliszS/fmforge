use crate::model::{PlayerFilters, PlayerRecord};
use crate::{get_players};
use crate::utils::{get_birth_year, sort_players, matches_search_query, is_birth_date_in_range, club_names_for, search_club_map, ClubLite};
use serde::Serialize;
use std::collections::HashMap;

#[derive(Serialize)]
pub struct PlayersPage {
    pub players: Vec<PlayerRecord>,
    pub total: usize,
    pub club_names: HashMap<i32, String>,
}

#[tauri::command]
pub fn get_players_chunk(filters: Option<PlayerFilters>) -> Vec<PlayerRecord> {
    let players = get_players().lock().unwrap();
    let mut filtered_players: Vec<PlayerRecord> = players
        .iter()
        .filter(|(id, player)| {
            if let Some(ref f) = filters {
                // Player IDs filter
                if let Some(ref ids) = f.player_ids {
                    if !ids.contains(id) {
                        return false;
                    }
                }

                // Name filter
                if let Some(ref query) = f.name_query {
                    if !matches_search_query(player, query) {
                        return false;
                    }
                }

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

                // Position filter
                if let Some(ref pos) = f.position {
                    if player.position.as_ref() != Some(pos) {
                        return false;
                    }
                }

                // Favourite club filter
                if let Some(fav_club) = f.favourite_club {
                    if player.favourite_team_id != Some(fav_club) {
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
                        return false;
                    }
                }
                
                // Birth date range filter (day/month within a year)
                if f.birth_day_from.is_some() || f.birth_month_from.is_some() || 
                   f.birth_day_to.is_some() || f.birth_month_to.is_some() {
                    if !is_birth_date_in_range(
                        &player.birth_date,
                        f.birth_day_from,
                        f.birth_month_from,
                        f.birth_day_to,
                        f.birth_month_to,
                    ) {
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

    filtered_players
}

#[tauri::command]
pub fn get_players_page(
    offset: usize,
    limit: usize,
    filters: Option<PlayerFilters>,
) -> PlayersPage {
    let filtered_players = get_players_chunk(filters);
    let total = filtered_players.len();

    let players: Vec<PlayerRecord> = filtered_players
        .into_iter()
        .skip(offset)
        .take(limit)
        .collect();

    let club_names = club_names_for(
        players
            .iter()
            .flat_map(|r| [r.player.club_id, r.player.favourite_team_id].into_iter().flatten()),
    );

    PlayersPage { players, total, club_names }
}

#[tauri::command]
pub fn get_club_names(ids: Vec<i32>) -> HashMap<i32, String> {
    club_names_for(ids)
}

#[tauri::command]
pub fn search_clubs(query: String, limit: usize) -> Vec<ClubLite> {
    search_club_map(&query, limit)
}

#[tauri::command]
pub fn get_filtered_player_ids(filters: Option<PlayerFilters>) -> Vec<usize> {
    let filtered_players = get_players_chunk(filters);
    
    filtered_players
        .into_iter()
        .map(|record| record.id)
        .collect()
}
