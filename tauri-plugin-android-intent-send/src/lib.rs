use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::AndroidIntentSend;
#[cfg(mobile)]
use mobile::AndroidIntentSend;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the android-intent-send APIs.
pub trait AndroidIntentSendExt<R: Runtime> {
  fn android_intent_send(&self) -> &AndroidIntentSend<R>;
}

impl<R: Runtime, T: Manager<R>> crate::AndroidIntentSendExt<R> for T {
  fn android_intent_send(&self) -> &AndroidIntentSend<R> {
    self.state::<AndroidIntentSend<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("android-intent-send")
    .invoke_handler(tauri::generate_handler![commands::ping])
    .setup(|app, api| {
      #[cfg(mobile)]
      let android_intent_send = mobile::init(app, api)?;
      #[cfg(desktop)]
      let android_intent_send = desktop::init(app, api)?;
      app.manage(android_intent_send);
      Ok(())
    })
    .build()
}
