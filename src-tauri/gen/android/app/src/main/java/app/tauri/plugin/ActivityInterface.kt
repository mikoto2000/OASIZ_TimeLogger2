package app.tauri.plugin

import android.content.Intent

interface ActivityInterface {
    public fun sendIntent(intent: Intent, handler: (Intent?) -> Unit)
}

