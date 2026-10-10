# Junta de la Liga · Gestión v1140

Este módulo amplía **Junta de la Liga** sin quitar las herramientas de fecha, agenda, acuerdos, exportación PNG y PDF existentes.

## Uso para la directiva
1. Entrar en la app azul, abrir **Más > Herramientas de la Liga > Junta de la Liga** e iniciar sesión administrativa.
2. **Asistencia:** agregar equipo y delegado, marcar presente/tarde/ausente, o generar y escanear el QR ante la persona administradora. El QR contiene datos editables y por sí solo **no verifica identidad**.
3. **Acuerdos:** registrar tarea, responsable, fecha límite y estado. No registrar decisiones inexistentes.
4. **Votaciones:** crear propuesta y anotar un voto por equipo. El conteo es administrativo, no un voto autenticado remotamente.
5. **Acta:** conservar la minuta tradicional, escribir nombres, firmar en pantalla y confirmar conformidad. La firma manuscrita local **no es una firma electrónica certificada**; imprimir y validar oficialmente con la directiva.
6. **Historial:** consultar minutas guardadas por fecha y buscar por equipo o acuerdo. El formulario guarda automáticamente borradores, y el botón Guardar junta continúa disponible.
7. **Calendario:** abrir un evento de Google Calendar o descargar un .ics; en opciones adicionales se incluyen alarmas 24/2/1 horas antes y repetición semanal los martes.
8. **Resumen:** generar un borrador **local** que analiza asistencia, agenda, responsables, propuestas y tareas pendientes/vencidas; editar, guardar revisión y compartir el texto. No usa inteligencia artificial externa ni inventa acuerdos.
9. **Archivos:** añadir imágenes, PDF, Word, Excel o texto hasta 12 MB por archivo. Los archivos se guardan con **IndexedDB**, en el dispositivo usado para administrarlos; pueden descargarse desde la pantalla.

## Respaldo y recuperación
- Descargar regularmente el respaldo JSON. Conservarlo en un lugar privado.
- Importar un respaldo agrega fechas nuevas **sin sobrescribir** registros previos.
- El JSON guarda referencias y datos de la junta, **NO** incluye los binarios adjuntos; estos deben descargarse y respaldarse por separado.
- Si se borran los datos del navegador sin respaldo, la información local se puede perder.
- No hay sincronización entre teléfonos ni base de datos de juntas en el servidor.

## Recordatorios automáticos y permisos
- Para una invitación que avise sin que la app esté abierta, usar Google Calendar o importar el archivo `.ics` con alarmas.
- La opción «Programar aviso oficial en app» usa el endpoint existente del servidor `POST /admin/notices`, precedido por `GET /admin/me`. El servidor verifica la sesión y el permiso `notices:write`. **No** envía mensajes si el servicio HTTPS de notificaciones no está desplegado.
- El campo `data/notifications-client.json` conserva `apiBaseUrl` vacío de forma predeterminada. No añadir contraseñas, tokens o secretos al repositorio público.
- Los formularios de juntas requieren sesión administrativa en la interfaz. Al ser una app web pública con datos locales, esto no sustituye controles de permisos y almacenamiento cifrado **del servidor** si se requiere trabajo multiusuario.

## Pruebas
- `node --test tests/meeting-hub-v1130.test.mjs tests/meeting-suite-v1140.test.mjs`
- GitHub Actions: `.github/workflows/meeting-juntas.yml`
- Revisión manual necesaria en un Android real: permisos de cámara para QR, escritura de firma táctil, importación de archivos y diálogos de impresión.
