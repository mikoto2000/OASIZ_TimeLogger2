package dev.mikoto2000.oasiztimelogger2

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

import app.tauri.plugin.ActivityInterface

class MainActivity : TauriActivity(), ActivityInterface {
  private lateinit var resultLauncher: ActivityResultLauncher<Intent>

  private var resultHandler: ((Intent?) -> Unit)? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // ActivityResultLauncherを登録
    resultLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
      if (result.resultCode == Activity.RESULT_OK) {
        val data: Intent? = result.data
        resultHandler?.invoke(data)
      }
    }
  }

  override public fun sendIntent(intent: Intent, handler: (Intent?) -> Unit) {
    resultHandler = handler
    resultLauncher.launch(intent)
  }
}