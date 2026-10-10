# Administración de la Liga · Avisos globales, Push, cargos y auditoría

La interfaz del sitio azul **está agregada a GitHub**, pero **GitHub Pages es estático y no ejecuta PostgreSQL ni este servidor**. Hasta que se despliegue el backend privado, el panel muestra que falta conexión y no finge haber enviado avisos. Los avisos locales anteriores siguen funcionando en su dispositivo.

## Funciones del backend `server/notifications`

- Login reutilizado: cada operación administrativa comprueba el token Bearer existente contra `LJR_MEDIA_AUTH_BASE/api/me`; no se admite una contraseña compartida escrita en el navegador.
- Roles: presidente (cargos, auditoría, destinatarios y avisos), secretario/editor (avisos), disciplina (lectura), lector (sin edición). Los permisos se comprueban en el servidor y **solo cubren los endpoints de este servicio**. Las rutas del CMS remoto deben implementar su autorización por sección de forma independiente.
- Programación de avisos globales: alta, listado, edición con `revision`, cancelación y publicación a la hora indicada. Los avisos con canal `app` aparecen en Noticias aunque el teléfono esté apagado, siempre que el servicio y el job estén activos.
- Web Push: una suscripción voluntaria por navegador, con categorías y filtros de tipo, cancha y equipo, utilizando el Service Worker ya existente. No se envían mensajes sin consentimiento.
- SMS y WhatsApp siguen disponibles **solo con** credenciales del proveedor, consentimiento registrado y plantilla Meta aprobada.
- Bitácora de operaciones administrativas persistida en PostgreSQL. No proporciona control de cambios sobre el CMS remoto hasta conectarlo allí.

## Pasos necesarios para activar (administración técnica una sola vez)

1. Despliega **server/notifications** como un servicio Node.js en Railway u otro hosting HTTPS, con PostgreSQL. Ejecuta `server/notifications/schema.sql` contra tu base de datos, incluida su migración de columnas adicionales, antes de arrancar.
2. Configura las variables de `.env.example` **como secretos del hosting**, especialmente `DATABASE_URL`, `LJR_MEDIA_AUTH_BASE`, `JOB_NOTIFY_TOKEN`, `PUBLIC_API_ORIGIN` y `WEB_ORIGIN`. `LJR_MEDIA_AUTH_BASE` es el origen de tu servidor de autenticación administrativa existente. No publiques tokens en GitHub.
3. Para activar Push genera un par VAPID, guarda la clave **privada** solo en el servidor y configura `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`. Para Twilio, configura sus credenciales y canal/plantilla aprobados; son opcionales si solo quieres noticias en la app.
4. En `public/data/notifications-client.json`, coloca **únicamente** el origen HTTPS público del nuevo servidor en `apiBaseUrl` (ejemplo `https://avisos.tu-dominio.mx`). Esa URL pública no es un secreto. El archivo `public/push-config.json` puede permanecer vacío porque v1082 reutiliza la misma URL.
5. En **GitHub Actions → Settings → Secrets and variables → Actions** establece `LJR_NOTIFICATIONS_API_URL` (URL HTTPS del servicio) y `LJR_NOTIFICATIONS_JOB_TOKEN` (la misma clave secreta que `JOB_NOTIFY_TOKEN` del hosting). La acción `scheduled-notices.yml` invoca `POST /jobs/dispatch` cada cinco minutos, independientemente del teléfono.
6. Prueba desde una cuenta de presidente que `GET /admin/me` funciona con su sesión, que un editor solo puede editar avisos, y que un visitante recibe 401/403 si intenta publicar. Comprueba también `GET /notices`, el consentimiento Push y la cancelación antes de publicar. No registres números sin autorización.

## Rutas principales

| Ruta | Acceso |
| --- | --- |
| `GET /health`, `GET /config`, `GET /notices` | Público (solo información publicada) |
| `GET /api/push/public-key`, `POST /api/push/subscribe`, `POST /api/push/unsubscribe` | Público opt-in, con límite básico de solicitudes |
| `GET /admin/me`, `GET /admin/notices` | Sesión válida y rol permitido |
| `POST /admin/notices`, `PUT /admin/notices/:id`, `DELETE /admin/notices/:id` | Presidente, editor o secretario |
| `GET /admin/roles`, `PUT /admin/roles/:id`, `GET /admin/audit` | Solo presidente verificado |
| `POST /admin/recipients`, `POST /admin/optout` | Solo presidente verificado |
| `POST /jobs/dispatch` | Solo el cron con `X-Job-Token` |

El backend no confía en `owner` o `role` entregados por el cliente: el rol presidente viene del servidor administrativo al validar el token. Otros roles se conceden solo mediante un endpoint de propietario. Por seguridad, cuando la base no tiene aún una asignación, los demás usuarios son `lector`.

**Limitaciones conocidas:** no existe el mismo control de roles en el backend privado que actualmente administra jornadas, jugadores, sanciones y páginas. Tampoco existe despliegue automático de este backend ni claves de terceros precargadas. Estas integraciones requieren permiso/configuración del operador del servidor. El panel informa cuando falta y conserva los editores locales ya existentes.

## Pruebas

`node --test tests/notifications-security.test.mjs` (en la raíz de App-liga-) y `npm run check` en `server/notifications`. En producción comprueba conexiones y permisos contra una base de pruebas con roles ficticios antes de usar avisos de la Liga.
