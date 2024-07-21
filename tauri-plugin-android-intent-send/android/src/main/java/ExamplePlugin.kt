package com.plugin.androidintentsend

import android.app.Activity
import android.content.Intent
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke

@InvokeArg
class PingArgs {
  var value: String? = null
}

@TauriPlugin
class ExamplePlugin(private val activity: Activity): Plugin(activity) {

    @Command
    fun ping(invoke: Invoke) {
        val args = invoke.parseArgs(PingArgs::class.java)

        val intent = Intent(Intent.ACTION_SEND, null);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_SUBJECT, "作業記録");
        intent.putExtra(Intent.EXTRA_TEXT, args.value);
        activity.startActivity(Intent.createChooser(intent, "送信するアクティビティを選択"));


        val ret = JSObject()
        invoke.resolve(ret)
    }
}
