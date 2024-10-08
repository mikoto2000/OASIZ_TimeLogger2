use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "android")]
const PLUGIN_IDENTIFIER: &str = "com.plugin.androidintentsend";

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_android-intent-send);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<AndroidIntentSend<R>> {
  #[cfg(target_os = "android")]
  let handle = api.register_android_plugin(PLUGIN_IDENTIFIER, "AndroidIntentSendPlugin")?;
  #[cfg(target_os = "ios")]
  let handle = api.register_ios_plugin(init_plugin_android-intent-send)?;
  Ok(AndroidIntentSend(handle))
}

/// Access to the android-intent-send APIs.
pub struct AndroidIntentSend<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> AndroidIntentSend<R> {
  pub fn send_intent(&self, payload: SendIntentRequest) -> crate::Result<SendIntentResponse> {
    self
      .0
      .run_mobile_plugin("send_intent", payload)
      .map_err(Into::into)
  }
}
