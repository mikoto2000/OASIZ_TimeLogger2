use crate::schema::work_log;

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

