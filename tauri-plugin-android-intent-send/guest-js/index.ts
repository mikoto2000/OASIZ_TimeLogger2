import { invoke } from '@tauri-apps/api/core'

export async function sendIntent(value: string): Promise<string | null> {
  return await invoke<{value?: string}>('plugin:android-intent-send|send_intent', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}
