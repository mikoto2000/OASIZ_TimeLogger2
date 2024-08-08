use crate::schema::work_log;
use crate::schema::productivity_score;

use diesel::{deserialize::Queryable, prelude::Insertable, query_builder::AsChangeset};
use serde::{Deserialize, Serialize};


#[derive(Queryable, Deserialize, Serialize, Clone, Debug)]
#[diesel(table_name = work_log)]
pub struct WorkLog {
    pub work_no: i32,
    pub work_name: String,
    pub start_date: String,
    pub end_date: Option<String>,
}

#[derive(Insertable, Serialize, Deserialize, Clone, Debug)]
#[diesel(table_name = work_log)]
pub struct NewWorkLog {
    pub work_name: String,
    pub start_date: String,
    pub end_date: Option<String>,
}

#[derive(AsChangeset, Serialize, Deserialize, Clone, Debug)]
#[diesel(table_name = work_log)]
pub struct UpdateWorkLog {
    pub work_name: Option<String>,
    pub end_date: Option<String>,
}

#[derive(Insertable, Queryable, Deserialize, Serialize, Clone, Debug)]
#[diesel(table_name = productivity_score)]
pub struct ProductivityScores {
    pub date: String,
    pub score0: i32,
    pub score1: i32,
    pub score2: i32,
    pub score3: i32,
    pub score4: i32,
    pub score5: i32,
    pub score6: i32,
    pub score7: i32,
    pub score8: i32,
    pub score9: i32,
    pub score10: i32,
    pub score11: i32,
    pub score12: i32,
    pub score13: i32,
    pub score14: i32,
    pub score15: i32,
    pub score16: i32,
    pub score17: i32,
    pub score18: i32,
    pub score19: i32,
    pub score20: i32,
    pub score21: i32,
    pub score22: i32,
    pub score23: i32,
}

#[derive(AsChangeset, Serialize, Deserialize, Clone, Debug)]
#[diesel(table_name = productivity_score)]
pub struct UpdateProductivityScores {
    pub score0: i32,
    pub score1: i32,
    pub score2: i32,
    pub score3: i32,
    pub score4: i32,
    pub score5: i32,
    pub score6: i32,
    pub score7: i32,
    pub score8: i32,
    pub score9: i32,
    pub score10: i32,
    pub score11: i32,
    pub score12: i32,
    pub score13: i32,
    pub score14: i32,
    pub score15: i32,
    pub score16: i32,
    pub score17: i32,
    pub score18: i32,
    pub score19: i32,
    pub score20: i32,
    pub score21: i32,
    pub score22: i32,
    pub score23: i32,
}
