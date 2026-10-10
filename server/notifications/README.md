## WhatsApp normal — modo activo en la interfaz (sin API ni automatización)

La Liga confirmó que el número del presidente utiliza **WhatsApp personal (normal)**, no un remitente de WhatsApp Business registrado en Twilio. **No es posible enviar mensajes automáticos con la API oficial de Twilio usando directamente esa cuenta personal.**

- **GitHub Pages:** `src/v1074-suspension-approval-workflow.js` ofrece **WhatsApp normal · compartir aviso** después de revisar y registrar la autorización. Solo prepara texto y abre WhatsApp para que una persona seleccione el chat y pulse Enviar. `src/v1081-global-admin-notices.js` ofrece el mismo modo manual desde Avisos globales sin exigir que se active Twilio.
- **Avisos por equipo:** la app prepara el texto individual; las anotaciones `Enviado`/`Recibido` son **manuales**, nunca confirmaciones de WhatsApp.
- **Railway:** el proyecto de avisos permanece **STAGED**, con `TWILIO_WHATSAPP_SENDER` vacío y `TWILIO_WHATSAPP_ACTIVATED=false`. La cuenta personal no se registró como remitente Twilio y no habrá envío por ese canal.
- **Contacto del presidente:** el centro global de archivos de la aplicación (`src/v161-whatsapp-admin.js`) ya mostraba públicamente el teléfono del presidente y permitía abrir su chat. Esto es independiente del backend; el teléfono no se debe copiar a variables públicas nuevas. Si se decide dejar de mostrarlo públicamente, habrá que cambiar ese módulo existente también.
- **Futuro:** para enviar automáticamente habría que registrar un remitente WhatsApp Business oficialmente aprobado, configurar credenciales/plantillas en privado y obtener consentimiento de destinatarios. No se deben usar bots no oficiales sobre WhatsApp normal por riesgo de bloqueos y privacidad.

## Remitente WhatsApp México — pendiente de autorización

El responsable de la Liga confirmó que desea usar un número mexicano como **remitente oficial**. Se cargó el candidato **solo como variable privada y STAGED de Railway** (nunca en GitHub Pages, este README ni los archivos públicos), con el prefijo E.164 `whatsapp:+52`.

**Estado actual:** `TWILIO_WHATSAPP_ACTIVATED=false`. Esta bandera impide activar el canal aun con credenciales Twilio y plantilla configuradas. No se comprobó la titularidad del número, su registro WhatsApp Business ni la aprobación de Meta. Ningún mensaje se ha enviado.

**Para activarlo**, el propietario autorizado deberá:

1. Abrir [Twilio Console](https://console.twilio.com/) y conectar o registrar ese número en **WhatsApp Senders**, siguiendo las verificaciones de Meta y comprobando que está autorizado para uso empresarial. Si ya está asociado a otra cuenta WhatsApp, respetar el procedimiento oficial de migración de Twilio.
2. Aprobar en Meta una plantilla de tipo utilidad compatible con las variables `{{1}}` (título del aviso) y `{{2}}` (cuerpo), y guardar el `Content SID` (`HX...`) en las variables privadas de Railway.
3. Configurar las credenciales de Twilio exclusivamente en Railway: `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY`, `TWILIO_API_SECRET` y `TWILIO_AUTH_TOKEN` para verificar webhooks.
4. Verificar `PUBLIC_API_ORIGIN` HTTPS para las devoluciones de estado, el consentimiento voluntario de los delegados por canal y las pruebas de mensajes a contactos de prueba que hayan aceptado recibirlos.
5. Solo después de validar todo, cambiar `TWILIO_WHATSAPP_ACTIVATED=true` **en Railway**. No modificar el código para saltarse la comprobación.
6. Aplicar el despliegue STAGED cuando se acepten los costos de infraestructura y mensajería, comprobar `GET /health/ready` y `GET /config`, y verificar un mensaje de prueba y su estado.

**Importante:** El candidato a remitente no se debe registrar como destinatario ni agregar a la tabla de consentimiento automáticamente. Son operaciones separadas. El contacto privado no se añade a `data/notifications-client.json`, `index.html` ni a ningún JavaScript público.

## Estado actualizado de las funciones pendientes (10 de octubre de 2026)

- **Código listo para activación, sin servicios desplegados todavía.** Se encontró más de un proyecto Railway preparado. Para evitar facturar contenedores duplicados, usar únicamente el proyecto que incluye `liga-avisos-api` y `Postgres`; no aceptar simultáneamente los dos despliegues.
- **Programador global incorporado al servidor:** al arrancar `server/notifications`, procesa avisos vencidos automáticamente cada minuto mediante PostgreSQL, incluso si el móvil está cerrado. La función no necesita `JOB_NOTIFY_TOKEN` ni secrets de GitHub Actions. Solo requiere que la instancia Railway permanezca encendida y la base esté conectada. Opcional: desactivar con `ENABLE_INTERNAL_DISPATCH=false`.
- **Activación por etapas:** se puede encender primero Noticias globales (con `DATABASE_URL` y `LJR_MEDIA_AUTH_BASE`) sin Twilio ni Push. Para recibir notificaciones Push es obligatorio instalar VAPID y que el usuario dé permiso. SMS/WhatsApp requieren credenciales oficiales de Twilio, aprobaciones correspondientes y consentimiento de los destinatarios.
- **Diagnóstico incorporado a Administración → Avisos y automatización → Estado del sistema:** comprueba si responde el servidor y si están listos la base de datos, el programador, los canales y los permisos. Sin servidor muestra claramente el paso pendiente y no simula envíos.
- `GET /health/ready` indica el estado de conexión PostgreSQL y canales sin mostrar secretos. La migración se actualizó a `notifications-schema-v1084` para aplicar también los cambios de contactos y categorías que aparecieron después de v1082.
- **Aún no implementado:** permisos granulares para alterar jugadores, sanciones, jornadas y resultados en la API independiente del CMS. No basta con ocultar opciones de la interfaz pública; es necesaria la misma verificación en esa API.

**Costos y consentimiento:** aplicar los cambios de Railway puede generar cargos por uso, y Twilio cobra los mensajes según el servicio. No se despliega ni se envían mensajes reales sin la aprobación correspondiente. La existencia de código, dominio o proyecto STAGED no equivale a funcionamiento de producción.

## Preparación Railway (9 de octubre de 2026)

Se creó el proyecto privado **Liga Juventino Rosas - Avisos** en Railway y se dejaron en **STAGED**, sin ejecutar ni facturar por contenedores nuevos, el servicio `liga-avisos-api` conectado a la carpeta `/server/notifications` de GitHub y una instancia PostgreSQL con volumen. El servicio tiene configurados la ruta de salud, reinicio por fallas, puerto 8080 y conexión a la base mediante referencia privada de Railway.

**El despliegue sigue detenido intencionalmente**: faltan los secretos obligatorios y la confirmación del operador sobre potenciales cargos de Railway/Twilio. No pulses Apply Changes hasta completar estos pasos:

1. Registrar o conectar Twilio y aprobar el remitente WhatsApp Business y su plantilla (Content SID `HX...`). Los destinatarios deberán aceptar mensajes específicamente por SMS o WhatsApp.
2. En Railway, establecer opcionalmente `JOB_NOTIFY_TOKEN` (aleatorio de al menos 32 caracteres, solo para disparos externos), `PUBLIC_API_ORIGIN` (dominio HTTPS real del servicio), credenciales de Twilio (`TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY`, `TWILIO_API_SECRET`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`, `TWILIO_WHATSAPP_SENDER`, `TWILIO_WHATSAPP_CONTENT_SID`). **No introducir valores reales en GitHub**.
3. Generar `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY` en entorno seguro, introducir un correo operativo real en `VAPID_SUBJECT=mailto:...`. No existe todavía un correo de contacto verificado, por eso no se ha configurado automáticamente.
4. Tras confirmar posibles cargos, aplicar los cambios de Railway. Si solo se usan avisos de la app, Twilio y VAPID pueden configurarse después. El inicio del servidor ejecuta `bootstrap.mjs` para aplicar de forma transaccional `schema.sql` antes de aceptar peticiones.
5. Verificar `GET /health`, `GET /config` y la autenticación con `GET /admin/me`. Después poner la URL HTTPS **sin tokens** en `data/notifications-client.json`, `public/data/notifications-client.json` y, para el flujo V1082, en `public/push-config.json`. GitHub Pages debe reconstruirse.
6. Añadir `LJR_NOTIFICATIONS_API_URL` y `LJR_NOTIFICATIONS_JOB_TOKEN` a los **Secrets** de GitHub Actions. La clave debe coincidir con `JOB_NOTIFY_TOKEN` del servidor. Probar un evento de ejemplo con destinatario de prueba voluntario.
7. Probar rechazo a visitantes, consentimiento por canal, STOP/BAJA, StatusCallback firmado, reintentos y cancelación antes de habilitar envíos masivos.

Se agregaron `Dockerfile`, `railway.toml`, `bootstrap.mjs` y el workflow `notifications-backend-checks.yml`. Este workflow verifica sintaxis, permisos y que no haya credenciales evidentes comprometidas.

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
2. Configura las variables de `.env.example` **como secretos del hosting**, especialmente `DATABASE_URL`, `LJR_MEDIA_AUTH_BASE`, `WEB_ORIGIN` y el dominio HTTPS; `JOB_NOTIFY_TOKEN` es opcional para el programador interno. `LJR_MEDIA_AUTH_BASE` es el origen de tu servidor de autenticación administrativa existente. No publiques tokens en GitHub.
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

## Archivo de juntas privadas · v1150

Además de los avisos se incluye `meeting-store.mjs` con tres rutas privadas: `GET /admin/meetings`, `GET /admin/meetings/:date` y `PUT /admin/meetings/:date`. Requieren el mismo token de sesión de la Liga, comprobado remotamente por `admin`, y permisos `meetings:read` / `meetings:write` del servidor. Solo presidencia y secretaría cuentan con estos permisos. Todas las escrituras actualizan una revisión atómica y dejan auditoría sin publicar datos de delegados.

La migración `notifications-schema-v1150` crea `ljr_meeting_minutes` automáticamente en PostgreSQL al desplegar la única instancia elegida. El acceso a las minutas es mediante la pestaña **Servidor** de la app y es manual, con confirmación. El botón de recuperación descarga antes una copia del registro local. Las firmas manuscritas y adjuntos no se transmiten en el JSON remoto.

**Railway sigue STAGED:** no ejecutar `accept_deploy` sin la autorización explícita del dueño para iniciar servicios y facturación. Después del despliegue, probar `/health/ready` con la base y verificar permisos con cuentas de presidente, secretario y lector. Registrar en privado la URL HTTPS real en `data/notifications-client.json` (nunca tokens ni contraseñas).
