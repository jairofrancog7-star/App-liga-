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
    "at": "2026-10-31T18:00:00Z"
  }
}
```
Este campo JSON **no verifica una identidad por sí mismo**. La validación humana se debe hacer en un PR revisado y fusionado por responsables autorizados. Configurar reglas de protección de `main`, revisión obligatoria y, de ser posible, CODEOWNERS. GitHub Pages sigue siendo público, por lo que nunca guardar datos personales, credenciales ni claves de servicio en los JSON.

## Verificaciones técnicas

- `node --test tests/review-official-safety.test.mjs .github/scripts/dispatch-notifications.test.mjs`
- `python3 -m unittest discover -s .github/scripts -p test_process_scheduled_notices.py`
- `node --check server/notifications/index.mjs`
- `node --check src/v1081-global-admin-notices.js`

Los reportes de Github Actions se conservan 14 días; no sustituyen la verificación de jugadores, cédulas, goles, sanciones y permisos por parte de la directiva.
