use chrono::{NaiveDate, NaiveDateTime};
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;
use std::env;
use std::sync::{Arc, Mutex};

use crate::models::{NewWorkLog, UpdateWorkLog, WorkLog};
use crate::schema::work_log::dsl::work_log;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn create_work_log(
    conn: &Arc<Mutex<SqliteConnection>>,
    work_name: String,
    start_date: NaiveDateTime,
) -> i32 {
    let new_work_log = NewWorkLog {
        work_name,
        start_date,
        end_date: None,
    };

    let mut conn = conn.lock().unwrap();

    diesel::insert_into(work_log)
        .values(&new_work_log)
        .execute(&mut *conn)
        .expect("Error saving new work log");

    // 最後に挿入したレコードの ID を取得する
    diesel::select(diesel::dsl::sql::<diesel::sql_types::Integer>(
        "last_insert_rowid()",
    ))
    .first(&mut *conn)
    .expect("Error getting last inserted row id")
}

pub fn get_all_work_logs(conn: &Arc<Mutex<SqliteConnection>>) -> Vec<WorkLog> {
    let mut conn = conn.lock().unwrap();

    work_log
        .load::<WorkLog>(&mut *conn)
        .expect("Error loading work logs")
}

pub fn update_work_name(
    conn: &Arc<Mutex<SqliteConnection>>,
    work_no: i32,
    work_name: String,
) -> usize {
    let updated_work_log = UpdateWorkLog {
        work_name: Some(work_name),
        end_date: None,
    };

    let mut conn = conn.lock().unwrap();
    diesel::update(work_log.find(work_no))
        .set(&updated_work_log)
        .execute(&mut *conn)
        .expect("Error updating work log")
}

pub fn update_end_date(
    conn: &Arc<Mutex<SqliteConnection>>,
    work_no: i32,
    end_date: NaiveDateTime,
) -> usize {
    let updated_work_log = UpdateWorkLog {
        work_name: None,
        end_date: Some(end_date),
    };

    let mut conn = conn.lock().unwrap();
    diesel::update(work_log.find(work_no))
        .set(&updated_work_log)
        .execute(&mut *conn)
        .expect("Error updating work log")
}

pub fn get_work_logs_by_date(
    conn: &Arc<Mutex<SqliteConnection>>,
    year: i32,
    month: u32,
    day: u32,
) -> Vec<WorkLog> {
    let mut conn = conn.lock().unwrap();
    let target_date_start = NaiveDate::from_ymd_opt(year, month, day).unwrap();
    let target_date_end = NaiveDate::from_ymd_opt(year, month, day + 1).unwrap();

    let target_datetime_start = NaiveDateTime::from(target_date_start);
    let target_datetime_end = NaiveDateTime::from(target_date_end);

    use crate::schema::work_log::dsl::*;

    work_log
        .filter(start_date.ge(target_datetime_start))
        .filter(start_date.lt(target_datetime_end))
        .load::<WorkLog>(&mut *conn)
        .expect("Error loading work logs by date")
}
