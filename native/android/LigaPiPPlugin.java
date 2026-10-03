package mx.ligajuventino.app;

import android.app.PictureInPictureParams;
import android.os.Build;
import android.util.Rational;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LigaPiP")
public class LigaPiPPlugin extends Plugin {
    @PluginMethod
    public void arm(PluginCall call) {
        boolean enabled=call.getBoolean("enabled",false);
        getActivity().runOnUiThread(()->{
            ((MainActivity)getActivity()).ligaPiPArmed=enabled;
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.S)getActivity().setPictureInPictureParams(new PictureInPictureParams.Builder().setAspectRatio(new Rational(16,9)).setAutoEnterEnabled(enabled).build());
            call.resolve();
        });
    }
    @PluginMethod
    public void enter(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.reject("PiP requiere Android 8 o posterior");
            return;
        }
        getActivity().runOnUiThread(() -> {
            try {
                PictureInPictureParams params = new PictureInPictureParams.Builder()
                    .setAspectRatio(new Rational(16, 9)).build();
                if (getActivity().enterPictureInPictureMode(params)) call.resolve();
                else call.reject("Android no permitió abrir PiP");
            } catch (Exception error) { call.reject("No se pudo abrir PiP", error); }
        });
    }
}
