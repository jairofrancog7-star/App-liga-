package mx.ligajuventino.app;

import android.content.res.Configuration;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LigaPiPPlugin.class);
        super.onCreate(savedInstanceState);
    }
    @Override
    public void onPictureInPictureModeChanged(boolean active, Configuration configuration) {
        super.onPictureInPictureModeChanged(active, configuration);
        if (getBridge() != null) getBridge().getWebView().evaluateJavascript(
            "window.dispatchEvent(new CustomEvent('liga:native-pip',{detail:{active:" + active + "}}))", null);
    }
}
