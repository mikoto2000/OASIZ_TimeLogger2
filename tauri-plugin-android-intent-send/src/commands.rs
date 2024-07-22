use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::AndroidIntentSendExt;

#[command]
pub(crate) async fn send_intent<R: Runtime>(
    app: AppHandle<R>,
    payload: SendIntentRequest,
) -> Result<SendIntentResponse> {
    app.android_intent_send().send_intent(payload)
}
