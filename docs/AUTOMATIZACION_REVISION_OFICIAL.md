# Automatización oficial con revisión y aprobación

Este cambio se ha preparado para la **Liga Municipal de Fútbol Juventino Rosas**.

## Cómo funciona

1. GitHub Actions ejecuta `Revisar datos oficiales (requiere aprobación)` a las 07:15 hora de Juventino Rosas (13:15 UTC) y también manualmente.
2. Lee las copias `data/official-live.json` y `public/data/official-live.json`, comprueba las cinco categorías y revisa los avisos pendientes. Consulta únicamente metadatos de `data/adminfut-public-audit.json`.
3. Genera un artefacto temporal JSON/Markdown y muestra el resumen en Actions. Si hay diferencias, abre o comenta **un único issue de revisión**. No inventa resultados, no altera estadísticas ni publica avisos.
4. El sincronizador de AdminFut ya existente propone sus cambios por pull request: **no fusionar sin cotejar contra cédulas oficiales**.

## Flujo de avisos del servidor

`BORRADOR → REVISIÓN → APROBADO / PROGRAMADO → PUBLICADO`

- Un editor o secretario autorizado crea un **borrador**, sin envío automático.
- Solamente la cuenta autenticada de **Presidencia** (propietario o segundo principal realmente autorizado en el servidor) dispone de `notices:approve`.
- En Administración → Avisos globales, Presidencia puede abrir el borrador y pulsar **Revisar y aprobar**, con confirmación explícita del título, texto, fecha y canales.
- El servidor guarda `approved_by`, `approved_at` y una revisión; el cron sólo considera filas `queued` con aprobación persistida.
- Editar el título, texto, fecha, cancha, categoría o canales retira la aprobación y devuelve el aviso a `draft`.
- Si otro usuario cambió el aviso, la revisión original ya no coincide: respuesta HTTP 409; es necesario actualizar y revisar.
- SMS/WhatsApp requieren proveedor configurado, datos de consentimiento, destinatarios válidos y pueden generar cargos. No se exponen teléfonos ni tokens en GitHub Pages.

## Migración necesaria para activar la garantía

La interfaz y el código no cambian por sí solos un servidor antiguo ya desplegado.

1. Revisar y fusionar el PR tras pasar pruebas y autorización humana.
2. Desplegar `server/notifications` en el hosting privado. Su `npm start` ejecuta `bootstrap.mjs`, que instala `approval-schema.sql` usando transacción/advisory lock.
3. La migración pasa **los avisos pendientes antiguos sin aprobación explícita a borrador**: Presidencia debe aprobarlos de nuevo. Esto puede retrasar avisos antes programados, intencionalmente para evitar envíos no autorizados.
4. El servidor ofrece `/health/ready` con `approvalRequired:true`. El despachador de GitHub Actions **bloquea** llamadas externas mientras esa garantía no exista.
5. Verificar en un dispositivo autorizado que crear/editar/autorizar/cancelar mantiene el control del servidor y la bitácora. Probar un canal de notificaciones real con un destinatario que consintió el envío, antes de uso general.
6. El servidor antiguo con programador interno podría seguir procesando avisos hasta ser actualizado o detenido. **No se puede afirmar que el control ya funciona en producción** sin verificar el despliegue privado.

## Avisos declarados en GitHub

`public/data/scheduled-notices.json` es una vía separada. Su procesador ahora exige:
```json
{
  "id": "aviso-de-ejemplo",
  "title": "Texto confirmado",
  "publishAt": "2026-11-01T16:00:00Z",
  "channels": {"app": true},
  "approval": {
    "status": "approved",
    "by": "cuenta-revisora",
    "at": "2026-10-31T18:00:00Z",
    "signature": "64 caracteres hexadecimales; firma creada por un responsable autorizado"
  }
}
```
Una etiqueta JSON **no verifica la identidad por sí misma**. Además del PR aprobado, cada aviso del repositorio necesita `approval.signature`: un HMAC-SHA256 sobre los campos `id,title,body,message,category,channels,publish_at,publishAt,type` (serialización JSON ordenada, compacta, UTF-8). La clave `LJR_OFFICIAL_NOTICE_APPROVAL_SECRET` (mínimo 32 caracteres) debe guardarse **únicamente en GitHub Actions Secrets**; nunca publicarla en commits o GitHub Pages. Un responsable con acceso autorizado puede firmar offline usando un entorno seguro y copiar solamente la firma al JSON después de revisarlo. Si la clave no está configurada, **el publicador de archivos JSON permanece bloqueado por seguridad**. Cambiar fecha, título, mensaje, categoría o canales invalida la firma y exige volver a revisar y firmar. Configurar reglas de protección de `main`, revisión obligatoria y, de ser posible, CODEOWNERS. GitHub Pages sigue siendo público, por lo que nunca guardar datos personales, credenciales ni claves de servicio en los JSON.

## Verificaciones técnicas

- `node --test tests/review-official-safety.test.mjs .github/scripts/dispatch-notifications.test.mjs`
- `python3 -m unittest discover -s .github/scripts -p test_process_scheduled_notices.py`
- `node --check server/notifications/index.mjs`
- `node --check src/v1081-global-admin-notices.js`

Los reportes de Github Actions se conservan 14 días; no sustituyen la verificación de jugadores, cédulas, goles, sanciones y permisos por parte de la directiva.


## Autorizar un aviso programado desde GitHub sin copiar secretos

Esta ruta es **solo para avisos almacenados en `public/data/scheduled-notices.json`**. Los avisos creados desde Administración en el móvil se aprueban en el servidor privado por Presidencia, sin este flujo de GitHub.

1. En GitHub, entra a **Settings → Secrets and variables → Actions → New repository secret**. Guarda una clave aleatoria de al menos 32 caracteres en `LJR_OFFICIAL_NOTICE_APPROVAL_SECRET`. Genera la clave de forma privada con un administrador de contraseñas o `openssl rand -hex 32`. **No escribas la clave en esta conversación, archivos JSON, commits ni capturas**.
2. Crea un borrador completo en `public/data/scheduled-notices.json`, una lista JSON válida, con ID único, título, mensaje de al menos 15 caracteres, categoría, fecha futura ISO 8601 y `channels` (por ejemplo `{"app": true}`). No incluyas una aprobación ficticia.
3. La cuenta propietaria `jairofrancog7-star` abre **Actions → Autorizar aviso oficial (Presidencia) → Run workflow** en la rama `main`. Introduce el ID, el título exacto después de revisarlo y la confirmación **AUTORIZAR AVISO OFICIAL**.
4. El flujo comprueba la cuenta propietaria, que la clave esté configurada, el ID único, el título, el cuerpo, la fecha futura y los canales. Firma el título, contenido, categoría, fecha, canales, **identidad y hora del aprobador** sin exponer la clave. Solo guarda la aprobación; **no publica ni envía mensajes durante la firma**.
5. El proceso separado de avisos se ejecuta cada cinco minutos y solo considera avisos cuya fecha haya llegado y cuya firma todavía sea válida. Cualquier cambio al texto, categoría, fecha, canales o identidad del aprobador invalida la firma. Si otro commit modificó `main` durante la aprobación, el flujo debe fallar y requerir volver a revisar, en vez de sobrescribir cambios.

La clave privada **no se puede configurar mediante el conector GitHub disponible en este chat**. Sin esa configuración, esta ruta de avisos queda bloqueada de forma segura; la administración del servidor privado continúa siendo independiente. El diseño no garantiza que alguien recibió o leyó Push/WhatsApp: comprobar esos canales requiere un dispositivo suscrito y consentimiento.

### Protección adicional

- El procesador rechaza JSON inválido o una estructura distinta de lista, en lugar de fingir que no hay avisos.
- Los archivos PNG solo se vuelven a cargar desde la carpeta generada para el propio ID del aviso. No se aceptan rutas arbitrarias.
- Las pruebas de GitHub verifican firmas, modificaciones posteriores, identidad, títulos, fechas, JSON válido y bloqueos por falta de clave.

