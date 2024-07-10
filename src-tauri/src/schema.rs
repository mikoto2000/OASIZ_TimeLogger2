// @generated automatically by Diesel CLI.

diesel::table! {
    work_log (work_no) {
        work_no -> Nullable<Integer>,
        work_name -> Text,
        start_date -> Text,
        end_date -> Nullable<Text>,
    }
}
