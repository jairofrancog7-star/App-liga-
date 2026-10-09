# Registro de jugadores — modo local V1011

## Privacidad
- El padrón, CURP, INE y fotografías permanecen en el navegador/dispositivo del administrador.
- No se habilitó Google Cloud Vision, Supabase, Gmail, WhatsApp automático ni otra base de datos remota.
- En la pantalla Registro se quitó la conexión de OCR manuscrito a servicios externos.
- Dexie.js 4.0.11 se entrega desde `src/vendor/` del propio sitio, sin CDN para la biblioteca.
- **Importante:** cargar el sitio y descargar componentes de OCR impreso por primera vez puede necesitar Internet. El reconocimiento de texto impreso usa Tesseract en el navegador; no se promete una aplicación plenamente desconectada mientras no se hospeden localmente todos sus modelos y archivos.
- Las fotos y documentos privados no están dentro del código fuente ni del índice de búsqueda.
- GitHub Actions usa solamente datos ficticios para las pruebas; no lee el padrón del teléfono.

## Etapa 1 (implementada): índice local y respaldo
- `src/local-registration-core.js`: normaliza nombres sin acentos, construye índice **sin CURP ni fecha de nacimiento** y reúne temporadas.
- `src/v1011-local-registry.js`: Dexie indexa de manera diferida en IndexedDB. Los cambios de registro activan actualización en segundo plano. Nunca sustituye ni borra el padrón original de localStorage.
- El buscador permite encontrar jugadores por nombre o apellido y saltar a la temporada correspondiente.
- **Respaldo cifrado:** descarga solo el padrón/temporadas con AES-256-GCM y contraseña elegida por el administrador. La contraseña no se almacena.
- **Restauración:** añade faltantes, conserva los existentes y requiere confirmación. No borra fotos o documentos.
- **Proteger almacenamiento:** solicita al navegador persistencia, si está disponible; no garantiza protección ante borrar datos del navegador.
- Para rendimiento, los lotes de indexación esperan mientras el usuario está haciendo scroll.

## Alcance exacto del respaldo
El archivo `liga-registro-cifrado-AAAA-MM-DD.json` contiene los jugadores y temporadas del padrón local. **NO contiene fotos ni documentos de identidad guardados en IndexedDB.** Por eso no debe considerarse un respaldo completo del registro. No borrar los datos del navegador ni cambiar de teléfono confiando solamente en ese archivo.

## Etapas siguientes (NO activadas)
1. Exportación cifrada y restauración de fotografías y documentos por lotes, sin agotar la memoria del móvil.
2. Empaquetar localmente todos los recursos de Tesseract (worker, WASM y modelos español) y verificar OCR sin conexión a Internet. Para manuscritos no prometer precisión sin probar un modelo local adecuado.
3. Credenciales PDF en lote con biblioteca empaquetada en el sitio, conservando PNG/PDF actuales.
4. Tras pruebas con respaldo y recuperación total, migrar gradualmente el almacenamiento principal de localStorage a Dexie. Nunca borrar o sobrescribir el origen antes de validar.
5. Reportes y tareas programadas solo en el dispositivo y con consentimiento. Un GitHub Pages estático no puede realizar tareas autónomas cuando el navegador está cerrado.

## Pruebas
```bash
node --test tests/local-registry-core.test.mjs
```
Se ejecutan con jugadores ficticios y también mediante la workflow `.github/workflows/local-registration-tests.yml`. Si un navegador bloquea IndexedDB, la app debe seguir usando el padrón original, pero se desactivará el índice.
