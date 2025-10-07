use crate::get_problematic_rows;

#[tauri::command]
pub fn get_problematic_rows_list() -> Vec<usize> {
    let problematic_rows = get_problematic_rows().lock().unwrap();
    problematic_rows.clone()
}
