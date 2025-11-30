use once_cell::sync::Lazy;
use std::collections::BTreeMap;
use std::sync::Mutex;

mod model;
mod file_operations;
mod player_queries;
mod player_management;
mod player_statistics;
mod utils;
mod commands;

use crate::model::{Player, InvalidRow};

static PLAYERS: Lazy<Mutex<BTreeMap<usize, Player>>> = Lazy::new(|| Mutex::new(BTreeMap::new()));
static INVALID_ROWS: Lazy<Mutex<Vec<InvalidRow>>> = Lazy::new(|| Mutex::new(Vec::new()));

pub fn get_players() -> &'static Mutex<BTreeMap<usize, Player>> {
    &PLAYERS
}

pub fn get_invalid_rows() -> &'static Mutex<Vec<InvalidRow>> {
    &INVALID_ROWS
}

use file_operations::{
    load_players_from_file,
    save_players_to_file
};
use player_queries::{get_players_page, get_players_chunk};
use player_statistics::{get_player_statistics, get_top_players};
use player_management::{
    update_players,
    add_new_player,
    remove_player
};
use commands::get_invalid_rows_list;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_players_from_file,
            get_players_chunk,
            get_players_page,
            get_player_statistics,
            get_top_players,
            update_players,
            add_new_player,
            remove_player,
            get_invalid_rows_list,
            save_players_to_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
