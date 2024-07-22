import { invoke } from '@tauri-apps/api/core'

export async function sendIntent(subject: string, text: string): Promise<string | null> {
  return await invoke<{value?: string}>('plugin:android-intent-send|send_intent', {
    payload: {
      subject,
      text,
    },
  }).then((r) => (r.value ? r.value : null));
}
