use crate::model::PlayerRecord;
use std::collections::HashMap;
use once_cell::sync::Lazy;
use serde::Deserialize;

#[derive(Deserialize)]
struct CountryData {
    name: String,
}

static COUNTRY_MAP: Lazy<HashMap<i32, String>> = Lazy::new(|| {
    let json_str = include_str!("../../src/data/countries.json");
    let map: HashMap<String, CountryData> = serde_json::from_str(json_str).expect("Failed to parse countries.json");
    map.into_iter()
        .filter_map(|(k, v)| k.parse::<i32>().ok().map(|id| (id, v.name)))
        .collect()
});

#[derive(Deserialize)]
struct ClubData {
    name: String,
    #[serde(rename = "gameName", default)]
    game_name: String,
}

static CLUB_MAP: Lazy<HashMap<i32, String>> = Lazy::new(|| {
    let json_str = include_str!("../../src/data/clubs.json");
    // Try parsing as the new format first
    match serde_json::from_str::<HashMap<String, ClubData>>(json_str) {
        Ok(map) => map.into_iter()
            .filter_map(|(k, v)| k.parse::<i32>().ok().map(|id| (id, v.name)))
            .collect(),
        Err(_) => {
            // Fallback to old format if parsing fails (just in case)
            let map: HashMap<String, String> = serde_json::from_str(json_str).expect("Failed to parse clubs.json");
            map.into_iter()
                .filter_map(|(k, v)| k.parse::<i32>().ok().map(|id| (id, v)))
                .collect()
        }
    }
});

pub fn get_birth_year(birth_date: &str) -> Option<i32> {
    // Parse birth date in DD/MM/YYYY format
    let parts: Vec<&str> = birth_date.split('/').collect();
    if parts.len() == 3 {
        parts[2].parse().ok()
    } else {
        None
    }
}

pub fn get_birth_month(birth_date: &str) -> Option<u32> {
    // Parse birth date in DD/MM/YYYY format
    let parts: Vec<&str> = birth_date.split('/').collect();
    if parts.len() == 3 {
        parts[1].parse().ok()
    } else {
        None
    }
}

fn get_position_rank(position: &str) -> i32 {
    // Extract base position if it has modifiers (though current data seems to be exact strings)
    // But let's match exact strings first as per constants.ts
    match position {
        "GOALKEEPER" => 1,
        "DEFENDER_LEFT_SIDE" => 2,
        "DEFENDER_CENTRAL" => 3,
        "DEFENDER_RIGHT_SIDE" => 4,
        "MIDFIELDER_LEFT_SIDE" => 5,
        "MIDFIELDER_CENTRAL" => 6,
        "MIDFIELDER_RIGHT_SIDE" => 7,
        "ATTACKING_MIDFIELDER_LEFT_SIDE" => 8,
        "ATTACKING_MIDFIELDER_CENTRAL" => 9,
        "ATTACKING_MIDFIELDER_RIGHT_SIDE" => 10,
        "ATTACKER_CENTRAL" => 11,
        _ => 99,
    }
}

use std::cmp::Ordering;

pub fn sort_players(mut players: Vec<PlayerRecord>, sort_criteria: &[String]) -> Vec<PlayerRecord> {
    println!("Sorting players by: {:?}", sort_criteria);
    
    players.sort_by(|a, b| {
        for criterion in sort_criteria {
            let ordering = match criterion.as_str() {
                "ca_desc" => {
                    let ca_a = a.player.ca.unwrap_or(0);
                    let ca_b = b.player.ca.unwrap_or(0);
                    ca_b.cmp(&ca_a)
                },
                "ca_asc" => {
                    let ca_a = a.player.ca.unwrap_or(0);
                    let ca_b = b.player.ca.unwrap_or(0);
                    ca_a.cmp(&ca_b)
                },
                "pa_desc" => {
                    let pa_a = a.player.pa.unwrap_or(0);
                    let pa_b = b.player.pa.unwrap_or(0);
                    pa_b.cmp(&pa_a)
                },
                "pa_asc" => {
                    let pa_a = a.player.pa.unwrap_or(0);
                    let pa_b = b.player.pa.unwrap_or(0);
                    pa_a.cmp(&pa_b)
                },
                "age_desc" => {
                    let year_a = get_birth_year(&a.player.birth_date).unwrap_or(0);
                    let year_b = get_birth_year(&b.player.birth_date).unwrap_or(0);
                    year_a.cmp(&year_b) // Older first (lower year = older)
                },
                "age_asc" => {
                    let year_a = get_birth_year(&a.player.birth_date).unwrap_or(0);
                    let year_b = get_birth_year(&b.player.birth_date).unwrap_or(0);
                    year_b.cmp(&year_a) // Younger first (higher year = younger)
                },
                "name_asc" => {
                    let name_a = format!("{} {}", a.player.first_name, a.player.last_name);
                    let name_b = format!("{} {}", b.player.first_name, b.player.last_name);
                    name_a.cmp(&name_b)
                },
                "name_desc" => {
                    let name_a = format!("{} {}", a.player.first_name, a.player.last_name);
                    let name_b = format!("{} {}", b.player.first_name, b.player.last_name);
                    name_b.cmp(&name_a)
                },
                "club_asc" => {
                    let empty = String::new();
                    let club_a = a.player.club_id.and_then(|id| CLUB_MAP.get(&id)).unwrap_or(&empty);
                    let club_b = b.player.club_id.and_then(|id| CLUB_MAP.get(&id)).unwrap_or(&empty);
                    club_a.cmp(club_b)
                },
                "club_desc" => {
                    let empty = String::new();
                    let club_a = a.player.club_id.and_then(|id| CLUB_MAP.get(&id)).unwrap_or(&empty);
                    let club_b = b.player.club_id.and_then(|id| CLUB_MAP.get(&id)).unwrap_or(&empty);
                    club_b.cmp(club_a)
                },
                "nationality_asc" => {
                    let empty = String::new();
                    let nat_a = COUNTRY_MAP.get(&a.player.nationality_id).unwrap_or(&empty);
                    let nat_b = COUNTRY_MAP.get(&b.player.nationality_id).unwrap_or(&empty);
                    nat_a.cmp(nat_b)
                },
                "nationality_desc" => {
                    let empty = String::new();
                    let nat_a = COUNTRY_MAP.get(&a.player.nationality_id).unwrap_or(&empty);
                    let nat_b = COUNTRY_MAP.get(&b.player.nationality_id).unwrap_or(&empty);
                    nat_b.cmp(nat_a)
                },
                "position_asc" => {
                    let pos_a = a.player.position.as_deref().unwrap_or("");
                    let pos_b = b.player.position.as_deref().unwrap_or("");
                    let rank_a = get_position_rank(pos_a);
                    let rank_b = get_position_rank(pos_b);
                    if rank_a != rank_b {
                        rank_a.cmp(&rank_b)
                    } else {
                        pos_a.cmp(pos_b)
                    }
                },
                "position_desc" => {
                    let pos_a = a.player.position.as_deref().unwrap_or("");
                    let pos_b = b.player.position.as_deref().unwrap_or("");
                    let rank_a = get_position_rank(pos_a);
                    let rank_b = get_position_rank(pos_b);
                    if rank_a != rank_b {
                        rank_b.cmp(&rank_a)
                    } else {
                        pos_b.cmp(pos_a)
                    }
                },
                "height_asc" => {
                    a.player.height.cmp(&b.player.height)
                },
                "height_desc" => {
                    b.player.height.cmp(&a.player.height)
                },
                "weight_asc" => {
                    a.player.weight.cmp(&b.player.weight)
                },
                "weight_desc" => {
                    b.player.weight.cmp(&a.player.weight)
                },
                "foot_asc" => {
                    let foot_a = a.player.preferred_foot.unwrap_or(0);
                    let foot_b = b.player.preferred_foot.unwrap_or(0);
                    foot_a.cmp(&foot_b)
                },
                "foot_desc" => {
                    let foot_a = a.player.preferred_foot.unwrap_or(0);
                    let foot_b = b.player.preferred_foot.unwrap_or(0);
                    foot_b.cmp(&foot_a)
                },
                _ => Ordering::Equal,
            };
            
            if ordering != Ordering::Equal {
                return ordering;
            }
        }
        Ordering::Equal
    });
    
    println!("Sorted {} players", players.len());
    players
}

pub fn remove_accents(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            'á' | 'à' | 'â' | 'ä' | 'ã' | 'å' | 'ą' => 'a',
            'Á' | 'À' | 'Â' | 'Ä' | 'Ã' | 'Å' | 'Ą' => 'A',
            'ć' | 'č' | 'ç' => 'c',
            'Ć' | 'Č' | 'Ç' => 'C',
            'é' | 'è' | 'ê' | 'ë' | 'ę' => 'e',
            'É' | 'È' | 'Ê' | 'Ë' | 'Ę' => 'E',
            'í' | 'ì' | 'î' | 'ï' => 'i',
            'Í' | 'Ì' | 'Î' | 'Ï' => 'I',
            'ł' => 'l',
            'Ł' => 'L',
            'ñ' | 'ń' => 'n',
            'Ñ' | 'Ń' => 'N',
            'ó' | 'ò' | 'ô' | 'ö' | 'õ' | 'ø' => 'o',
            'Ó' | 'Ò' | 'Ô' | 'Ö' | 'Õ' | 'Ø' => 'O',
            'ś' | 'š' => 's',
            'Ś' | 'Š' => 'S',
            'ú' | 'ù' | 'û' | 'ü' => 'u',
            'Ú' | 'Ù' | 'Û' | 'Ü' => 'U',
            'ý' | 'ÿ' => 'y',
            'Ý' | 'Ÿ' => 'Y',
            'ź' | 'ż' | 'ž' => 'z',
            'Ź' | 'Ż' | 'Ž' => 'Z',
            _ => c,
        })
        .collect()
}

pub fn matches_search_query(player: &crate::model::Player, query: &str) -> bool {
    if query.is_empty() {
        return true;
    }

    let normalized_query = remove_accents(query).to_lowercase();
    let full_name = remove_accents(&format!(
        "{} {} {}",
        player.first_name,
        player.last_name,
        player.common_name.as_deref().unwrap_or("")
    ))
    .to_lowercase();

    if normalized_query.contains('*') {
        let parts: Vec<&str> = normalized_query.split('*').collect();
        let mut current_search_text = full_name.as_str();

        for part in parts {
            if part.is_empty() {
                continue;
            }
            if let Some(idx) = current_search_text.find(part) {
                current_search_text = &current_search_text[idx + part.len()..];
            } else {
                return false;
            }
        }
        true
    } else {
        full_name.contains(&normalized_query)
    }
}
