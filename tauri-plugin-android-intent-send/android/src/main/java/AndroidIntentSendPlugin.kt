package com.plugin.androidintentsend

import android.app.Activity
import android.content.Intent
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.ActivityInterface

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
    val fileName = args.subject
    val content = args.text

    val intent = Intent(Intent.ACTION_CREATE_DOCUMENT, null);
    intent.addCategory(Intent.CATEGORY_OPENABLE);
    intent.setType("text/" + getExtension(fileName));
    intent.putExtra(Intent.EXTRA_TITLE, fileName);
    (activity as ActivityInterface).sendIntent(intent) { data ->
      val intent = data
      if (intent != null) {
        val uri = intent.getData()
        try {
          if(uri != null){
            activity.getContentResolver().openOutputStream(uri).use { ost ->
              if(ost != null){
                ost.write(content.toByteArray());
              }
            }
          }
        } catch(e: Exception){
          e.printStackTrace();
        }
      }
    }

    val ret = JSObject()
    invoke.resolve(ret)
  }

  private fun getExtension(fileName: String): String {
    return fileName.substringAfterLast('.', "");
  }

}
