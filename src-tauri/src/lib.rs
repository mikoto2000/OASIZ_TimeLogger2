mod commands;
mod database;
mod models;
mod schema;

use std::sync::{Arc, Mutex};

use diesel::SqliteConnection;

use crate::commands::*;

struct AppState {
    conn: Arc<Mutex<SqliteConnection>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = database::establish_connection();

    tauri::Builder::default()
        .manage(AppState { conn: Arc::new(Mutex::new(conn)) })
        .invoke_handler(tauri::generate_handler![
            get_all_work_logs_command,
            get_work_logs_by_date_command,
            create_work_log_command,
            update_work_name_command,
            update_end_date_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
