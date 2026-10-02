package mx.ligajuventino.app;

import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.concurrent.Executor;

@CapacitorPlugin(name = "LigaBiometric")
public class LigaBiometricPlugin extends Plugin {
    private static final int AUTHENTICATORS =
        BiometricManager.Authenticators.BIOMETRIC_STRONG |
        BiometricManager.Authenticators.BIOMETRIC_WEAK;

    @PluginMethod
    public void isAvailable(PluginCall call) {
        BiometricManager manager = BiometricManager.from(getContext());
        int code = manager.canAuthenticate(AUTHENTICATORS);
        JSObject out = new JSObject();
        out.put("available", code == BiometricManager.BIOMETRIC_SUCCESS);
        out.put("code", code);
        call.resolve(out);
    }

    @PluginMethod
    public void verify(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                FragmentActivity activity = (FragmentActivity) getActivity();
                Executor executor = ContextCompat.getMainExecutor(activity);

                BiometricPrompt prompt = new BiometricPrompt(activity, executor,
                    new BiometricPrompt.AuthenticationCallback() {
                        @Override
                        public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
                            super.onAuthenticationSucceeded(result);
                            JSObject out = new JSObject();
                            out.put("verified", true);
                            call.resolve(out);
                        }

                        @Override
                        public void onAuthenticationError(int errorCode, CharSequence errString) {
                            super.onAuthenticationError(errorCode, errString);
                            call.reject(errString != null ? errString.toString() : "Verificación biométrica cancelada");
                        }
                    });

                String title = call.getString("title", "Liga Juventino");
                String subtitle = call.getString("subtitle", "Confirma tu identidad");
                String description = call.getString("description", "Usa la biometría del dispositivo.");

                BiometricPrompt.PromptInfo info = new BiometricPrompt.PromptInfo.Builder()
                    .setTitle(title)
                    .setSubtitle(subtitle)
                    .setDescription(description)
                    .setNegativeButtonText("Cancelar")
                    .setAllowedAuthenticators(AUTHENTICATORS)
                    .build();

                prompt.authenticate(info);
            } catch (Exception error) {
                call.reject("No se pudo abrir la verificación biométrica", error);
            }
        });
    }
}
