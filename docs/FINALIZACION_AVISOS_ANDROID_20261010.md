# Validación final de avisos en Android (sin envíos masivos)

**Resultado automático:** GitHub Actions → [Diagnosticar aprobación privada y Web Push (sin enviar)](https://github.com/jairofrancog7-star/App-liga-/actions/workflows/official-notice-secret-readiness.yml). El diagnóstico revisa solo permisos, clave configurada (sin mostrarla), servidor HTTPS, PostgreSQL y VAPID. No puede confirmar recepción en un móvil real.

## 1. Clave HMAC de avisos programados en JSON

Abre [GitHub Actions Secrets](https://github.com/jairofrancog7-star/App-liga-/settings/secrets/actions) y crea el secreto **`LJR_OFFICIAL_NOTICE_APPROVAL_SECRET`** usando una cadena aleatoria privada de 32 caracteres o más (recomendado: 64 caracteres hexadecimales con un gestor de contraseñas u `openssl rand -hex 32`). La conexión de GitHub utilizada por ChatGPT **no dispone de ninguna acción para establecer ese secreto**. No compartas su valor en chat, pull requests, issues, capturas ni archivos públicos.

La ejecución de diagnóstico informa **solo** si está configurado con longitud suficiente. No autoriza ningún aviso ni demuestra la identidad del propietario sin el flujo manual de Presidencia.

## 2. Web Push real con Chrome Android (15 segundos)

Esta ruta **solo funciona con Chrome Android o un navegador con Web Push**, no en la APK nativa de Capacitor:

1. Abre https://jairofrancog7-star.github.io/App-liga-/#/notifications **en Chrome Android**, no dentro de la APK.
2. En «Notificaciones de la Liga», elige categoría y pulsa **Activar avisos**; acepta el permiso del navegador. Debe mostrar la suscripción activa.
3. Pulsa **Probar Push con la página cerrada · 15 s**. Solo envía una notificación privada al **propio dispositivo suscrito**; no publica avisos oficiales y no requiere crear un borrador.
4. Cierra la pestaña antes de quince segundos. Observa si llega una notificación titulada «PRUEBA PERSONAL · Liga Juventino Rosas». Ábrela y verifica que vuelve a la sección de notificaciones.
5. Si no llega, comprueba permisos de notificación de Chrome, batería y conexión de datos. Repite solo después del plazo de protección (cinco minutos).

**Criterio de aprobación:** confirmación visual de recepción y apertura en ese teléfono. El servidor devuelve un 202 para indicar que **programó la prueba**, no que Android recibió el Push. No copies aquí los tokens de suscripción ni las claves del navegador.

## 3. Avisos desde sesión de Presidencia

En la aplicación/web, abre **Más → Administración → Estado del sistema** y verifica «Aprobación obligatoria de avisos» y «Permiso de aprobación de Presidencia». Después, en **Avisos globales**, crea un borrador para una fecha futura; una cuenta sin `notices:approve` no debe mostrar «Revisar y aprobar». La cuenta propietaria sí puede autorizarlo tras revisión. **No selecciones destinatarios reales ni permitas que llegue la fecha de publicación durante esta prueba**; cancela el borrador inmediatamente al terminar.

## 4. APK Android nativa (no declararla compatible con Push remoto todavía)

`src/v1082-push-notifications.js` detecta `window.Capacitor.isNativePlatform()` y explica que **la APK todavía carece de Firebase Cloud Messaging (FCM) para Push remoto con la app cerrada**. Sus avisos locales no prueban entrega remota. Para activar esa capacidad hacen falta proyecto y credenciales Firebase/FCM, configuración Android nativa, envío del servidor a tokens FCM, consentimiento y pruebas de entrega reales. No instalar credenciales Firebase en frontend público ni confundir la prueba en Chrome con Push de la APK.

## Seguimiento

[Issue #83: Validación final de avisos](https://github.com/jairofrancog7-star/App-liga-/issues/83). Mantener abierto hasta que Presidencia confirme el secreto en GitHub, el resultado de la prueba real de Chrome y, si se requiere Push nativo, la integración FCM y su verificación en el Android autorizado.
