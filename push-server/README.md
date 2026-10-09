# Notificaciones reales de la Liga Juventino Rosas

El sitio público usa GitHub Pages. GitHub Pages **no puede almacenar suscripciones privadas ni enviar notificaciones push por sí mismo**. Este servicio Node envía Web Push al detectar novedades públicas del CMS oficial.

## Seguridad
- Ningún navegador público publica o modifica resultados. El servicio únicamente lee el endpoint público GET /api/content del CMS de la Liga, cuyo sistema original sigue verificando credenciales del administrador.
- No se notifican borradores, publicaciones futuras ni registros ajenos.
- Cada seguidor debe aceptar los permisos y puede cancelar.
- Filtros: categoría, equipo, cancha y tipo de comunicado.
- Las claves privadas VAPID son secretos del servidor, **jamás** se ponen en GitHub Pages.
- Se guarda una línea base de publicaciones sin avisar masivamente de noticias antiguas.
- Los endpoints de los suscriptores son secretos y deben permanecer en almacenamiento privado y persistente, nunca en un repositorio público.

## Desplegar el servicio en un host Node HTTPS
1. Crear servicio usando carpeta push-server/, seleccionar Dockerfile y añadir volumen persistente en /data.
2. Crear las claves VAPID en un entorno privado ejecutando: npx web-push generate-vapid-keys
3. Definir las variables secretas:
   - VAPID_PUBLIC_KEY: clave pública creada.
   - VAPID_PRIVATE_KEY: clave privada creada. NO publicar.
   - VAPID_SUBJECT: mailto:avisos@dominio-real-de-la-liga.mx (usar dirección válida).
   - LJR_CMS_API_URL: https://liga-juventino-media.ruchiz27mb0698.chatgpt.site/api/content
   - SITE_ORIGIN: https://jairofrancog7-star.github.io
   - SITE_URL: https://jairofrancog7-star.github.io/App-liga-/
   - PUSH_STATE_DIR: /data
   - PORT: 3000 (o puerto del proveedor).
4. Confirmar GET https://servidor/health -> ok: true.
5. Editar public/push-config.json poniendo el URL HTTPS del servidor en apiBase.
6. Esperar despliegue de GitHub Pages; abrir #/notifications o #/venues, seguir el equipo o campo y pulsar Activar avisos.
7. Probar con un comunicado autorizado real, observar que solo el suscriptor voluntario lo reciba.

## Cómo se envía un aviso
El administrador publica desde Centro editorial en el CMS protegido. El servicio consulta la lista pública del CMS cada 60 segundos y compara IDs y datos publicados anteriores. Si se modifica una cancha, horario, jornada, suspensión u otro aviso válido, envía Web Push a los suscriptores cuyos filtros coincidan. public/sw.js ya tiene los controladores de push y del toque para abrir la pantalla pertinente.

## Limitaciones
El servidor todavía **no queda desplegado solo por subir estos archivos**. Necesita alojamiento, configuración VAPID y almacenamiento persistente. No se garantiza entrega instantánea si el teléfono está apagado o sin conexión; navegador y sistema operativo pueden limitarla. No se envían SMS ni WhatsApp. El CMS debe seguir respondiendo en GET /api/content con items que incluyan id, kind, published y payload. La autorización de cambios oficiales siempre ocurre en el CMS, nunca en el servicio push.

## Pruebas
En push-server/: npm install && npm test.
