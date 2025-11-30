use crate::get_invalid_rows;
use crate::model::InvalidRow;

#[tauri::command]
pub fn get_invalid_rows_list() -> Vec<InvalidRow> {
    let invalid_rows = get_invalid_rows().lock().unwrap();
    invalid_rows.clone()
}
