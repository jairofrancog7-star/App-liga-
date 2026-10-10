# Registro de avisos V1210

## Qué cambió

- Formulario móvil azul: tamaños más compactos, barras respetadas y scroll completo.
- Validación de nombre, correo opcional y selección de categoría/equipo. Equipos vienen del directorio oficial de la categoría.
- Estado explícito: perfil y preferencias guardados localmente ≠ Push activo.
- Filtros granulares que ya existían, más ajustes rápidos «Solo importantes», «Todos», «Ninguno». Persisten en `lj-store-v3`.
- Botón de prueba local de notificaciones, únicamente tras permiso explícito. No representa una entrega automática del servidor.
- Panel Web Push existente V1082 dentro del mismo registro: reutiliza suscribir, desuscribir y actualizar filtros, sin instalar un proveedor paralelo.
- Acceso a avisos publicados en `#/notifications`, sin enlaces externos.
- Versiones de CSS/JS actualizadas en `index.html` contra la caché de navegadores.

## Limitaciones reales

- `v160-alert-profile` y `lj-store-v3` usan almacenamiento local; no equivalen a una cuenta remota.
- Para recibir notificaciones con la página cerrada deben estar disponibles el endpoint HTTPS definido en `data/notifications-client.json`, las claves VAPID del backend, el service worker y una suscripción confirmada.
- La prueba local usa `ServiceWorkerRegistration.showNotification` y no confirma entregas remotas.
- No se integró un segundo proveedor (Firebase/OneSignal) para no duplicar suscripciones ni requerir costos o credenciales adicionales.

## Comprobaciones

- Sintaxis estática de JS comprobada (en el archivo de módulo se omiten las sentencias `import` exclusivamente para el análisis sintáctico).
- Botones, listeners y rutas comprobados por inspección; también selectores CSS para el modal y cambios de versiones en `index.html`.
- Prueba de navegador real y entrega Push extremo a extremo: pendiente desde un dispositivo y servidor operativo.

## Prueba manual recomendada

1. Abrir la página con `?refresh=v1210-notificaciones` en Android.
2. Abrir «Registrarse y recibir notificaciones»; probar validación de nombre y correo.
3. Cambiar categoría y comprobar que los equipos cambian sin mezclar categorías.
4. Guardar y volver a abrir: categoría y equipo persisten.
5. Abrir preferencias; probar los tres ajustes rápidos y la persistencia de sus controles.
6. Pulsar «Probar aviso» y aceptar el permiso de notificaciones cuando lo solicite el navegador.
7. Abrir «Notificaciones Push» y verificar el estado de suscripción. Si faltan clave/servidor, mostrar limitación real.
8. Comprobar scroll completo y botonera sin taparse en pantallas móviles de distintas alturas.

## Referencias

- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices
- Firebase: https://firebase.google.com/docs/cloud-messaging/web/get-started
- OneSignal: https://onesignal.com/guides/how-to-use-push-on-your-news-or-media-site
