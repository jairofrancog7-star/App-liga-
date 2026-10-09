# Avisos de jornada: Google Calendar, Web Push y Twilio

Implementación V1074–V1075 para **Preparar mi jornada** (`#/agendaBuilder`).
Se limita a borradores y comunicaciones: **no modifica partidos ni resultados oficiales**.

## Qué funciona sin contratar servicios externos

- **Google Calendar**: tras seleccionar equipos, campo y hora (zona `America/Mexico_City`), el botón abre la ficha ya rellenada; el usuario debe pulsar **Guardar** en Google. No se crean eventos en otras cuentas ni se invita a terceros automáticamente.
- **Agenda .ics con alertas**: exportación con avisos 24 horas, 2 horas y 30 minutos antes de cada partido, cuando la aplicación de calendario receptora admite VALARM.
- **Avisos locales**: comprobación de cruces, horarios, campos y generación/compartición manual de mensajes; estos recordatorios se revisan mientras está abierta la aplicación.
- **WhatsApp manual**: compartir texto usando el selector de compartir ya existente, sin envío automático de Twilio.

## Qué se ha programado pero NO está activo todavía

**Push de fondo y SMS/WhatsApp automático requieren un servidor HTTPS con credenciales, base de datos, remitente aprobado y consentimiento de los destinatarios.** GitHub Pages sirve archivos estáticos y no puede guardar claves privadas ni enviar Twilio por sí solo. Por seguridad, `apiBaseUrl` aparece vacío por defecto, y la interfaz lo informa sin fingir que ha enviado mensajes.

La parte preparada en `server/notifications` incluye:
- Suscripciones Web Push (con permiso individual de cada dispositivo y posibilidad de darse de baja).
- Cola de avisos programados y ejecución periódica desde el servidor, incluso con la web cerrada.
- Mensajes SMS por **Twilio Messaging Service** a números con consentimiento registrado.
- WhatsApp Business con **Content SID de una plantilla aprobada** y consentimiento específico.
- Estados de entrega de Twilio mediante `StatusCallback`.
- Palabra BAJA / STOP recibida por webhook para registrar bajas.
- Acceso a la programación y al registro de consentimientos mediante token de administrador almacenado **exclusivamente en el servidor**. Nunca lo pongas en el repositorio ni en una URL.

## Despliegue para la persona responsable de la liga

1. Contrata/configura PostgreSQL y alojamiento Node 20+ con HTTPS (por ejemplo Railway, Render o un VPS propio). Despliega **solo la carpeta** `server/notifications`.
2. Ejecuta `schema.sql` en esa base de datos.
3. En el panel privado del hosting, configura variables de `.env.example` con valores reales. Crea **dos tokens distintos y aleatorios** para `ADMIN_NOTIFY_TOKEN` y `JOB_NOTIFY_TOKEN`. El archivo de ejemplo no debe subirse con valores reales.
4. Genera el par VAPID (por ejemplo, en una terminal segura: `npx web-push generate-vapid-keys`). `VAPID_PRIVATE_KEY` solo va en el servidor. La clave pública sí se entrega al navegador por `GET /config`.
5. En Twilio configura Account SID, API Key y Secret, Messaging Service con remitente habilitado, Auth Token para validar callbacks, y remitente WhatsApp Business con plantilla aprobada (`TWILIO_WHATSAPP_CONTENT_SID`). Cualquier tráfico SMS a Estados Unidos exige el registro que corresponda. Los destinatarios deben dar consentimiento por canal.
6. Configura `PUBLIC_API_ORIGIN` apuntando al dominio HTTPS del servidor sin `/` final, `WEB_ORIGIN=https://jairofrancog7-star.github.io`, y el programador externo/cron para llamar por **POST** `/jobs/dispatch` con encabezado `X-Job-Token` cada minuto (o al intervalo operativo necesario).
7. Configura los webhooks de Twilio en `https://tu-api/twilio/status` (estados) y `https://tu-api/twilio/inbound` (STOP/BAJA). Debe coincidir exactamente con `PUBLIC_API_ORIGIN` para validar la firma.
8. Finalmente, establece el dominio HTTPS real en `apiBaseUrl` de **los tres archivos** `data/notifications-client.json`, `demo/data/notifications-client.json` y `public/data/notifications-client.json`, por ejemplo `"apiBaseUrl": "https://avisos.tu-dominio.mx"`. **No coloques secretos allí.**
9. Comprueba en el móvil `#/agendaBuilder`: Google Calendar, calendario .ics y prueba de opt-in Web Push con permiso aceptado. La consola del backend debe registrar una suscripción. Registra al menos un teléfono que tenga consentimiento y programa un aviso de prueba **a ese destinatario autorizado**.

### Operación sin saber programar

En el detalle **SMS y WhatsApp mediante Twilio** de `Preparar mi jornada`, el panel privado de administración incluye:

- Preparar aviso tomando los datos de un partido y elegiendo cuándo recordarlo.
- Editar título, mensaje, categoría, canales y hora.
- Programar el envío al servidor con revisión y confirmación explícita.
- Registrar destinatarios autorizados y la fecha/origen de su consentimiento.

Para programar se solicita un token del servidor que nunca se guarda en localStorage. El backend valida el token aunque una persona intente falsificar la interfaz. La condición `window.LJR_MEDIA?.admin` solo oculta el formulario visual; **no concede seguridad ni acceso por sí sola**.

**Limitaciones conscientes:** no hay sincronización automática de eventos de Google Calendar sin OAuth y un consentimiento específico de cada cuenta; el botón usa un enlace Google que requiere confirmar manualmente. No se debe almacenar, publicar ni distribuir números telefónicos ni tokens en el GitHub público. La ejecución del cron, la entrega real y los cargos de Twilio empezarán **solo después** de configurar un servidor y probarlo.

## Rutas de servidor

| Acción | Método y ruta | Autorización |
| --- | --- | --- |
| Estado | `GET /health` | Público |
| Configuración pública | `GET /config` | Público, sin secretos |
| Opt-in del navegador | `POST /push/subscribe` | Permiso del navegador + validación de solicitud |
| Baja push | `POST /push/unsubscribe` | Endpoint de la propia suscripción |
| Consentimiento de número | `POST /admin/recipients` | Token de administrador, consentimiento documentado |
| Baja de número | `POST /admin/optout` | Token de administrador |
| Programar aviso | `POST /admin/notices` | Token de administrador |
| Procesar cola | `POST /jobs/dispatch` | Token secreto independiente de cron |
| Entrega Twilio | `POST /twilio/status` | Firma validada de Twilio |
| Baja por mensaje | `POST /twilio/inbound` | Firma validada de Twilio |

Recomendaciones adicionales antes de producción: autenticar a cada usuario de la app si se necesita filtrar suscripciones por equipo, limitar tráfico por IP a nivel de proxy/cloud, hacer backups de PostgreSQL, cifrar/restreñir acceso a los datos personales y monitorear errores de entrega. La cola simple incluida sirve como **base inicial**, no sustituye una plataforma distribuida de mensajería ni una auditoría de seguridad.
