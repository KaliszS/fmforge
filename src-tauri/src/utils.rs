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

static CLUB_MAP: Lazy<HashMap<i32, String>> = Lazy::new(|| {
    let json_str = include_str!("../../src/data/clubs.json");
    let map: HashMap<String, String> = serde_json::from_str(json_str).expect("Failed to parse clubs.json");
    map.into_iter()
        .filter_map(|(k, v)| k.parse::<i32>().ok().map(|id| (id, v)))
        .collect()
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
                    pos_a.cmp(pos_b)
                },
                "position_desc" => {
                    let pos_a = a.player.position.as_deref().unwrap_or("");
                    let pos_b = b.player.position.as_deref().unwrap_or("");
                    pos_b.cmp(pos_a)
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
