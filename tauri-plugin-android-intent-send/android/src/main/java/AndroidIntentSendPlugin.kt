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
  var subject: String = ""
  var text: String = ""
}

@TauriPlugin
class AndroidIntentSendPlugin(private val activity: Activity): Plugin(activity) {

    @Command
    fun send_intent(invoke: Invoke) {
        val args = invoke.parseArgs(PingArgs::class.java)

        val intent = Intent(Intent.ACTION_SEND, null);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_SUBJECT, args.subject);
        intent.putExtra(Intent.EXTRA_TEXT, args.text);
        activity.startActivity(Intent.createChooser(intent, "送信するアクティビティを選択"));


        val ret = JSObject()
        invoke.resolve(ret)
    }
}
