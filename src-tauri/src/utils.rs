use crate::model::PlayerRecord;

pub fn get_birth_year(birth_date: &str) -> Option<i32> {
    // Parse birth date in DD/MM/YYYY format
    let parts: Vec<&str> = birth_date.split('/').collect();
    if parts.len() == 3 {
        parts[2].parse().ok()
    } else {
        None
    }
}

pub fn sort_players(mut players: Vec<PlayerRecord>, sort_by: &str) -> Vec<PlayerRecord> {
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
