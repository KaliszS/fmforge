use crate::model::PlayerRecord;
use crate::get_players;

#[tauri::command]
pub fn update_players(new_players: Vec<PlayerRecord>) -> Result<(), String> {
    let mut players = get_players().lock().map_err(|e| e.to_string())?;
    for record in new_players {
        players.insert(record.id, record.player);
    }
    Ok(())
}

#[tauri::command]
pub fn add_new_player() -> Result<usize, String> {
    // Don't add to PLAYERS immediately - just return a unique temporary ID
    // The player will be added to the backend when save_players_to_file is called
    use std::time::{SystemTime, UNIX_EPOCH};
    let temp_id = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as usize;
    println!("Prepared new player for later addition (temp ID: {})", temp_id);
    Ok(temp_id)
}

#[tauri::command]
pub fn remove_player(id: usize) -> Result<(), String> {
    let mut players = get_players().lock().map_err(|e| e.to_string())?;
    players.remove(&id);
    println!("Removed player with ID: {}", id);
    Ok(())
}
