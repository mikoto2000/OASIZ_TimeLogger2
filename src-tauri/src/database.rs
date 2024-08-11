use chrono::{DateTime, Duration, FixedOffset, Local, TimeZone, Utc};
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;
use std::collections::HashMap;
use std::env;
use std::sync::{Arc, Mutex};

use crate::models::{
    NewWorkLog, ProductivityScores, UpdateProductivityScores, UpdateWorkLog, WorkLog,
};
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

pub fn get_work_logs(
    conn: &Arc<Mutex<SqliteConnection>>,
    from_year: i32,
    from_month: u32,
    from_day: u32,
    to_year: i32,
    to_month: u32,
    to_day: u32,
) -> Vec<WorkLog> {
    let mut conn = conn.lock().unwrap();

    use crate::schema::work_log::dsl::*;

    let datetime_start = Local
        .with_ymd_and_hms(from_year, from_month, from_day, 0, 0, 0)
        .unwrap();
    let one_day = Duration::days(1);
    let datetime_end = Local
        .with_ymd_and_hms(to_year, to_month, to_day, 0, 0, 0)
        .unwrap();
    let datetime_end = datetime_end + one_day;

    let target_datetime_start = datetime_start.naive_local();
    let target_datetime_end = datetime_end.naive_local();

    work_log
        .filter(start_date.ge(target_datetime_start))
        .filter(start_date.lt(target_datetime_end))
        .order(start_date.desc())
        .load::<WorkLog>(&mut *conn)
        .expect("Error loading work logs by date")
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

pub fn delete_work_log(conn: &Arc<Mutex<SqliteConnection>>, work_no: i32) -> usize {
    let mut conn = conn.lock().unwrap();
    diesel::delete(work_log.filter(crate::schema::work_log::dsl::work_no.eq(work_no)))
        .execute(&mut *conn)
        .expect("Error delete work log")
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

pub fn get_productivity_score_by_date(
    conn: &Arc<Mutex<SqliteConnection>>,
    year: i32,
    month: u32,
    day: u32,
) -> Vec<i32> {
    let oc = conn;
    let mut conn = conn.lock().unwrap();

    let datetime_start = Local.with_ymd_and_hms(year, month, day, 0, 0, 0).unwrap();
    let one_day = Duration::days(1);
    let datetime_end = datetime_start + one_day;

    let target_datetime_start = datetime_start.naive_local();
    let target_datetime_end = datetime_end.naive_local();

    use crate::schema::productivity_score::dsl::*;

    let productivity_scores = productivity_score
        .filter(date.ge(target_datetime_start))
        .filter(date.lt(target_datetime_end))
        .order(date.asc())
        .load::<ProductivityScores>(&mut *conn)
        .expect("Error loading work logs by date");
    drop(conn);

    if !productivity_scores.is_empty() {
        let pc = productivity_scores[0].clone();
        return [
            pc.score0, pc.score1, pc.score2, pc.score3, pc.score4, pc.score5, pc.score6, pc.score7,
            pc.score8, pc.score9, pc.score10, pc.score11, pc.score12, pc.score13, pc.score14,
            pc.score15, pc.score16, pc.score17, pc.score18, pc.score19, pc.score20, pc.score21,
            pc.score22, pc.score23,
        ]
        .to_vec();
    } else {
        return create_productivity_score_by_date(&oc, year, month, day);
    }
}

pub fn get_productivity_scores(
    conn: &Arc<Mutex<SqliteConnection>>,
    from_year: i32,
    from_month: u32,
    from_day: u32,
    to_year: i32,
    to_month: u32,
    to_day: u32,
) -> HashMap<String, Vec<i32>> {
    let mut conn = conn.lock().unwrap();

    let datetime_start = Local
        .with_ymd_and_hms(from_year, from_month, from_day, 0, 0, 0)
        .unwrap();
    let datetime_end = Local
        .with_ymd_and_hms(to_year, to_month, to_day, 0, 0, 0)
        .unwrap();
    let one_day = Duration::days(1);
    let datetime_end = datetime_end + one_day;

    let target_datetime_start = datetime_start.naive_local();
    let target_datetime_end = datetime_end.naive_local();

    use crate::schema::productivity_score::dsl::*;

    let productivity_scores = productivity_score
        .filter(date.ge(target_datetime_start))
        .filter(date.lt(target_datetime_end))
        .order(date.asc())
        .load::<ProductivityScores>(&mut *conn)
        .expect("Error loading work logs by date");
    drop(conn);

    let mut result: HashMap<String, Vec<i32>> = HashMap::new();

    for pc in productivity_scores {
        let scores = [
            pc.score0, pc.score1, pc.score2, pc.score3, pc.score4, pc.score5, pc.score6, pc.score7,
            pc.score8, pc.score9, pc.score10, pc.score11, pc.score12, pc.score13, pc.score14,
            pc.score15, pc.score16, pc.score17, pc.score18, pc.score19, pc.score20, pc.score21,
            pc.score22, pc.score23,
        ]
        .to_vec();

        let d: DateTime<FixedOffset> = DateTime::parse_from_rfc3339(&pc.date).unwrap();
        result.insert(d.with_timezone(&Utc).date_naive().to_string(), scores);
    }

    result
}

pub fn create_productivity_score_by_date(
    conn: &Arc<Mutex<SqliteConnection>>,
    year: i32,
    month: u32,
    day: u32,
) -> Vec<i32> {
    let mut conn = conn.lock().unwrap();

    let datetime = Utc.with_ymd_and_hms(year, month, day, 0, 0, 0).unwrap();

    let insert_data = ProductivityScores {
        date: datetime.to_rfc3339(),
        score0: 0,
        score1: 0,
        score2: 0,
        score3: 0,
        score4: 0,
        score5: 0,
        score6: 0,
        score7: 0,
        score8: 0,
        score9: 0,
        score10: 0,
        score11: 0,
        score12: 0,
        score13: 0,
        score14: 0,
        score15: 0,
        score16: 0,
        score17: 0,
        score18: 0,
        score19: 0,
        score20: 0,
        score21: 0,
        score22: 0,
        score23: 0,
    };

    use crate::schema::productivity_score::dsl::*;

    diesel::insert_or_ignore_into(productivity_score)
        .values(&insert_data)
        .execute(&mut *conn)
        .expect("Error saving new productivity score");
    drop(conn);

    return [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]
    .to_vec();
}

pub fn update_productivity_score_by_date(
    conn: &Arc<Mutex<SqliteConnection>>,
    year: i32,
    month: u32,
    day: u32,
    s0: i32,
    s1: i32,
    s2: i32,
    s3: i32,
    s4: i32,
    s5: i32,
    s6: i32,
    s7: i32,
    s8: i32,
    s9: i32,
    s10: i32,
    s11: i32,
    s12: i32,
    s13: i32,
    s14: i32,
    s15: i32,
    s16: i32,
    s17: i32,
    s18: i32,
    s19: i32,
    s20: i32,
    s21: i32,
    s22: i32,
    s23: i32,
) -> usize {
    let updated_productivity_scores = UpdateProductivityScores {
        score0: s0,
        score1: s1,
        score2: s2,
        score3: s3,
        score4: s4,
        score5: s5,
        score6: s6,
        score7: s7,
        score8: s8,
        score9: s9,
        score10: s10,
        score11: s11,
        score12: s12,
        score13: s13,
        score14: s14,
        score15: s15,
        score16: s16,
        score17: s17,
        score18: s18,
        score19: s19,
        score20: s20,
        score21: s21,
        score22: s22,
        score23: s23,
    };

    let mut conn = conn.lock().unwrap();

    let datetime = Utc.with_ymd_and_hms(year, month, day, 0, 0, 0).unwrap();

    use crate::schema::productivity_score::dsl::*;

    diesel::update(productivity_score.find(datetime.to_rfc3339()))
        .set(&updated_productivity_scores)
        .execute(&mut *conn)
        .expect("Error updating work log")
}
