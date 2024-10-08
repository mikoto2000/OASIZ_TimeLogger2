use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<AndroidIntentSend<R>> {
  Ok(AndroidIntentSend(app.clone()))
}

/// Access to the android-intent-send APIs.
pub struct AndroidIntentSend<R: Runtime>(AppHandle<R>);

impl<R: Runtime> AndroidIntentSend<R> {
  pub fn send_intent(&self, _payload: SendIntentRequest) -> crate::Result<SendIntentResponse> {
    Ok(SendIntentResponse {
      error: None,
    })
  }
}
