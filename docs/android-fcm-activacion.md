# Activación de Push remoto para APK Android — Liga Juventino Rosas

**Estado:** pendiente de asociar Firebase y completar envío FCM. La compilación exitosa de la APK **no significa** que reciba Push con la app cerrada.

## 1. Registrar el proyecto Android en Firebase

1. Abrir la [consola de Firebase](https://console.firebase.google.com/).
2. Crear un proyecto o usar uno de la Liga con permisos de administrador.
3. Registrar **Android** con el identificador exacto `mx.ligajuventino.app` (de `capacitor.config.json`). No confundir con el nombre visible de la app.
4. Descargar **`google-services.json`** de esta app Android. No usar el archivo de otra aplicación ni una cuenta de servicio como si fuera este archivo.

## 2. Validar la configuración sin publicarla

El proyecto usa la variable protegida de **GitHub Actions** `FIREBASE_ANDROID_CONFIG_B64`, que contiene la representación Base64 completa de `google-services.json`.

En un equipo autorizado, convertir `google-services.json` a Base64 (ejemplo Python):

```bash
python -c "import base64,pathlib; print(base64.b64encode(pathlib.Path('google-services.json').read_bytes()).decode())"
```

Copiar el resultado **solo** a GitHub → repositorio `App-liga-` → Settings → Secrets and variables → Actions → New repository secret. No añadir el archivo al repositorio, a los mensajes de GitHub ni a este chat.

Ejecutar manualmente **[Verificar preparación Firebase Android (FCM)](../.github/workflows/android-fcm-readiness.yml)** desde Actions. El script `scripts/android-fcm-preflight.mjs` valida que el JSON corresponda exactamente a `mx.ligajuventino.app`; no imprime valores del JSON.

## 3. Integración técnica que aún falta

La comprobación de configuración no equivale a activar FCM. El seguimiento se mantiene en [incidencia #82](https://github.com/jairofrancog7-star/App-liga-/issues/82):

- Incorporar el SDK de Firebase Messaging Android, plugin de Gradle, servicio receptor nativo y registro de token **con consentimiento**.
- Conectar las suscripciones con el servidor de Railway usando identidad/autorización; no publicar tokens de dispositivo ni claves de cuenta de servicio.
- Crear envío FCM HTTP v1 desde el servidor con credenciales de cuenta de servicio **solo en Railway** y envío de avisos oficiales aprobados. El `google-services.json` Android **no sirve para autorizar** el envío desde servidor.
- Validar un envío privado en un único Android real, con la APK cerrada normalmente, apertura de notificación y desactivación.

## 4. Diferenciar pruebas

- **Chrome Android:** Web Push con service worker, VAPID y servidor Railway; prueba privada desde **Notificaciones Push**. Seguimiento [#56](https://github.com/jairofrancog7-star/App-liga-/issues/56).
- **APK actual:** notificaciones **locales** mientras la aplicación está en uso. El botón «Probar aviso» no certifica envío remoto.
- **APK futura con FCM:** solo se certificará tras registrar el dispositivo y confirmar una notificación real visible cuando la APK esté cerrada. Android puede bloquear entregas si el usuario fuerza la detención de la app.

No activar avisos masivos ni atribuir entregas a usuarios sin confirmación.
