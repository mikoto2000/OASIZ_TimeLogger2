mod commands;
mod database;
mod models;
mod schema;

use std::sync::{Arc, Mutex};

use diesel::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use tauri::Manager;

use crate::commands::*;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

struct AppState {
    conn: Arc<Mutex<SqliteConnection>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {

            // DB コネクションを貼って State として管理してもらう
            let app_local_data_dir = app.path().app_local_data_dir().unwrap();
            let db_path = app_local_data_dir.join("worklog.db");
            let mut conn = database::establish_connection(db_path.to_str().unwrap().to_string());

            let _ = conn.run_pending_migrations(MIGRATIONS);

            app.manage(AppState {
                conn: Arc::new(Mutex::new(conn)),
            });


            Ok(())
        })
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
