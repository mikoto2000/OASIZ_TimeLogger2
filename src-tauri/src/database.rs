use chrono::{DateTime, Duration, Local, TimeZone};
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;
use std::env;
use std::sync::{Arc, Mutex};

use crate::models::{NewWorkLog, UpdateWorkLog, WorkLog};
use crate::schema::work_log::dsl::work_log;

pub fn establish_connection(default_database_url: String) -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("OTL_DATABASE_URL").unwrap_or(default_database_url);
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn create_work_log(
    conn: &Arc<Mutex<SqliteConnection>>,
    work_name: String,
    start_date: DateTime<Local>,
) -> i32 {
    let new_work_log = NewWorkLog {
        work_name,
        start_date: start_date.to_rfc3339(),
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

pub fn get_recent_work_logs(conn: &Arc<Mutex<SqliteConnection>>, num: i64) -> Vec<WorkLog> {
    let mut conn = conn.lock().unwrap();

    use crate::schema::work_log::dsl::*;

    work_log
        .order(start_date.desc())
        .limit(num)
        .load::<WorkLog>(&mut *conn)
        .expect("Error loading work logs")
}

pub fn get_all_work_logs(conn: &Arc<Mutex<SqliteConnection>>) -> Vec<WorkLog> {
    let mut conn = conn.lock().unwrap();

    use crate::schema::work_log::dsl::*;

    work_log
        .order(start_date.desc())
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
    end_date: DateTime<Local>,
) -> usize {
    let updated_work_log = UpdateWorkLog {
        work_name: None,
        end_date: Some(end_date.to_rfc3339()),
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

    let datetime_start = Local.with_ymd_and_hms(year, month, day, 0, 0, 0).unwrap();
    let one_day = Duration::days(1);
    let datetime_end = datetime_start + one_day;

    let target_datetime_start = datetime_start.naive_local();
    let target_datetime_end = datetime_end.naive_local();

    use crate::schema::work_log::dsl::*;

    work_log
        .filter(start_date.ge(target_datetime_start))
        .filter(start_date.lt(target_datetime_end))
        .order(start_date.desc())
        .load::<WorkLog>(&mut *conn)
        .expect("Error loading work logs by date")
}
