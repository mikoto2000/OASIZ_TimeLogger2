// @generated automatically by Diesel CLI.

diesel::table! {
    work_log (work_no) {
        work_no -> Integer,
        work_name -> Text,
        start_date -> Timestamp,
        end_date -> Nullable<Timestamp>,
    }
}
