#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use chrono::DateTime;
use serde::{Deserialize, Serialize};
use tauri::State;

use crate::{
    database::{
        create_work_log, get_all_work_logs, get_recent_work_logs, get_work_logs_by_date, update_end_date, update_work_name
    },
    models::WorkLog,
    AppState,
};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateLog {
    work_name: String,
    start_date: String,
    end_date: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateLog {
    work_no: i32,
    end_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateWorkLog {
    work_no: i32,
    work_name: String,
    end_date: Option<String>,
}

#[tauri::command]
pub fn create_work_log_command(
    state: State<'_, AppState>,
    work_name: String,
    start_date: String,
) -> Result<i32, String> {
    println!("create_work_log_command");
    let state = state.clone();
    let conn = state.conn.clone();

    let sd = DateTime::parse_from_rfc3339(&start_date).unwrap().naive_local();

    Ok(create_work_log(&conn, work_name, sd))
}

#[tauri::command]
pub fn get_recent_work_logs_command(state: State<'_, AppState>, num: i64) -> Result<Vec<WorkLog>, String> {
    let state = state.clone();
    let conn = state.conn.clone();

    Ok(get_recent_work_logs(&conn, num))
}

#[tauri::command]
pub fn get_all_work_logs_command(state: State<'_, AppState>) -> Result<Vec<WorkLog>, String> {
    let state = state.clone();
    let conn = state.conn.clone();

    Ok(get_all_work_logs(&conn))
}

#[tauri::command]
pub fn update_work_name_command(
    state: State<'_, AppState>,
    work_no: i32,
    work_name: String,
) -> Result<(), String> {
    println!("update_work_name_command");
    let state = state.clone();
    let conn = state.conn.clone();

    update_work_name(&conn, work_no, work_name);

    Ok(())
}

#[tauri::command]
pub fn update_end_date_command(
    state: State<'_, AppState>,
    work_no: i32,
    end_date: String,
) -> Result<(), String> {
    let state = state.clone();
    let conn = state.conn.clone();

    let ed = DateTime::parse_from_rfc3339(&end_date).unwrap().naive_local();

    update_end_date(&conn, work_no, ed);

    Ok(())
}

#[tauri::command]
pub fn get_work_logs_by_date_command(
    state: State<'_, AppState>,
    year: i32,
    month: u32,
    day: u32,
) -> Result<Vec<WorkLog>, String> {
    let state = state.clone();
    let conn = state.conn.clone();

    let results = get_work_logs_by_date(&conn, year, month, day);

    Ok(results)
}
