// @generated automatically by Diesel CLI.

diesel::table! {
    productivity_score (date) {
        date -> Text,
        score0 -> Integer,
        score1 -> Integer,
        score2 -> Integer,
        score3 -> Integer,
        score4 -> Integer,
        score5 -> Integer,
        score6 -> Integer,
        score7 -> Integer,
        score8 -> Integer,
        score9 -> Integer,
        score10 -> Integer,
        score11 -> Integer,
        score12 -> Integer,
        score13 -> Integer,
        score14 -> Integer,
        score15 -> Integer,
        score16 -> Integer,
        score17 -> Integer,
        score18 -> Integer,
        score19 -> Integer,
        score20 -> Integer,
        score21 -> Integer,
        score22 -> Integer,
        score23 -> Integer,
    }
}

diesel::table! {
    work_log (work_no) {
        work_no -> Integer,
        work_name -> Text,
        start_date -> Timestamp,
        end_date -> Nullable<Timestamp>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    productivity_score,
    work_log,
);
