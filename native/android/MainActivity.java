package mx.ligajuventino.app;

import android.content.res.Configuration;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public boolean ligaPiPArmed=false;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LigaPiPPlugin.class);
        registerPlugin(LigaSpeechPlugin.class);
        registerPlugin(LigaBiometricPlugin.class);
        registerPlugin(LigaNotificationsPlugin.class);
        super.onCreate(savedInstanceState);
    }
    @Override
    protected void onUserLeaveHint() {
        super.onUserLeaveHint();
        if(ligaPiPArmed && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O && android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.S && !isInPictureInPictureMode()) {
            if(getBridge()!=null)getBridge().getWebView().evaluateJavascript("window.dispatchEvent(new Event('liga:prepare-pip'))", null);
            getWindow().getDecorView().postDelayed(()->{if(ligaPiPArmed && !isInPictureInPictureMode())enterPictureInPictureMode(new android.app.PictureInPictureParams.Builder().setAspectRatio(new android.util.Rational(16,9)).build());},120);
        }
    }
    @Override
    public void onPictureInPictureModeChanged(boolean active, Configuration configuration) {
        super.onPictureInPictureModeChanged(active, configuration);
        if (getBridge() != null) getBridge().getWebView().evaluateJavascript(
            (active?"window.dispatchEvent(new Event('liga:prepare-pip'));":"")+"window.dispatchEvent(new CustomEvent('liga:native-pip',{detail:{active:" + active + "}}))", null);
    }
}
