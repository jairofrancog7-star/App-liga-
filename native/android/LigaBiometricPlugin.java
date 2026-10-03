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
import android.content.SharedPreferences;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.nio.charset.StandardCharsets;

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
    private static final String SESSION_KEY = "liga_admin_session_v612";
    private SharedPreferences vault() { return getContext().getSharedPreferences("liga_admin_vault", 0); }
    private SecretKey sessionKey() throws Exception {
        KeyStore store = KeyStore.getInstance("AndroidKeyStore"); store.load(null);
        if (!store.containsAlias(SESSION_KEY)) {
            KeyGenerator generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
            KeyGenParameterSpec.Builder spec = new KeyGenParameterSpec.Builder(SESSION_KEY,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setUserAuthenticationRequired(true);
            if (Build.VERSION.SDK_INT >= 30) spec.setUserAuthenticationParameters(0, KeyProperties.AUTH_BIOMETRIC_STRONG);
            else spec.setUserAuthenticationValidityDurationSeconds(-1);
            generator.init(spec.build()); generator.generateKey();
        }
        return (SecretKey) store.getKey(SESSION_KEY, null);
    }
    @PluginMethod public void hasSession(PluginCall call) {
        JSObject out = new JSObject();
        out.put("saved", vault().contains("ciphertext") && BiometricManager.from(getContext()).canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_STRONG) == BiometricManager.BIOMETRIC_SUCCESS);
        call.resolve(out);
    }
    @PluginMethod public void clearSession(PluginCall call) { vault().edit().clear().apply(); call.resolve(); }
    @PluginMethod public void storeSession(PluginCall call) { sessionPrompt(call, true); }
    @PluginMethod public void unlockSession(PluginCall call) { sessionPrompt(call, false); }
    private void sessionPrompt(PluginCall call, boolean saving) {
        getActivity().runOnUiThread(() -> {
            try {
                String value = call.getString("token", "");
                if (saving && !value.matches("[a-f0-9]{64}")) { call.reject("Sesión inválida"); return; }
                Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
                if (saving) cipher.init(Cipher.ENCRYPT_MODE, sessionKey());
                else cipher.init(Cipher.DECRYPT_MODE, sessionKey(), new GCMParameterSpec(128,
                    Base64.decode(vault().getString("iv", ""), Base64.NO_WRAP)));
                BiometricPrompt prompt = new BiometricPrompt((FragmentActivity) getActivity(),
                    ContextCompat.getMainExecutor(getActivity()), new BiometricPrompt.AuthenticationCallback() {
                    @Override public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
                        try {
                            Cipher authenticated = result.getCryptoObject().getCipher();
                            JSObject out = new JSObject();
                            if (saving) {
                                byte[] bytes = authenticated.doFinal(value.getBytes(StandardCharsets.UTF_8));
                                vault().edit().putString("ciphertext", Base64.encodeToString(bytes, Base64.NO_WRAP))
                                    .putString("iv", Base64.encodeToString(authenticated.getIV(), Base64.NO_WRAP)).apply();
                                out.put("saved", true);
                            } else {
                                byte[] bytes = authenticated.doFinal(Base64.decode(vault().getString("ciphertext", ""), Base64.NO_WRAP));
                                out.put("token", new String(bytes, StandardCharsets.UTF_8));
                            }
                            call.resolve(out);
                        } catch (Exception error) { call.reject("Vuelve a entrar con tu contraseña", error); }
                    }
                    @Override public void onAuthenticationError(int code, CharSequence error) { call.reject(error.toString()); }
                });
                prompt.authenticate(new BiometricPrompt.PromptInfo.Builder().setTitle("Administración de la Liga")
                    .setSubtitle(saving ? "Activa el acceso con huella en este dispositivo" : "Confirma tu identidad")
                    .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
                    .setNegativeButtonText("Cancelar").build(), new BiometricPrompt.CryptoObject(cipher));
            } catch (Exception error) { call.reject("Vuelve a entrar con tu contraseña para activar la huella", error); }
        });
    }

}
