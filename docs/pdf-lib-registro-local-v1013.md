# pdf-lib local para Registro y credenciales (v1013)

Esta función usa **pdf-lib 1.17.1**, copiada a `src/vendor/pdf-lib-1.17.1.min.js`. La licencia MIT se encuentra en `src/vendor/PDF-LIB-LICENSE.txt`.

## Cómo usarlo
1. Abre la app azul en `#/credentialBuilder`.
2. Completa cada registro con datos válidos, CURP, fecha de nacimiento y una fotografía, en el teléfono.
3. En "Registro de jugadores", utiliza las casillas para **seleccionar** los registros que quieras imprimir. El botón de seleccionar filtrados se conserva.
4. En "Imprimir credenciales en lote", elige "Hoja A4 · 8 credenciales" (2 columnas × 4 filas) o "Una credencial INE por página".
5. Pulsa "Generar PDF de seleccionados". El proceso es local y se puede cancelar antes de descargar.
6. Si hay incompletos, el panel indicará cuántos omitió y por qué. Los registros no se alteran.

**Límite preventivo: 32 credenciales por archivo** para reducir consumo de RAM y congelamientos en Android. Se puede exportar otro grupo después.

## Integración
- La función de PDF individual existente utiliza ahora la biblioteca local, en vez de descargar jsPDF de un CDN.
- La tarjeta actual se dibuja mediante `LJR_V480.makeRecordCanvas(record,scale)`. Los logos y retratos conservan el diseño del editor original. No se sobrescriben datos del formulario para exportar otros jugadores.
- Las fotos se leen desde las bases IndexedDB `ljr-registration-media` y `ljr-player-photos-v1` (cuando existen).
- Antes de imprimir se comprueban nombre, equipo, CURP válida, fecha concordante, fotografía y mínimo de edad de las categorías Veteranos 35+/50+.
- Dimensión física de una credencial: **85.60 × 53.98 mm**.
- En A4 se imprimen 8 por hoja, con separación para facilitar el recorte.
- Todas las imágenes personales se convierten e incrustan en el PDF *dentro del navegador*.
- Solo se descarga el archivo solicitado: no hay publicación automática ni envío de INE/CURP/fotos a servidores.

## Privacidad y limitaciones
- El PDF es un archivo **sensible**: contiene CURP, nombre y foto. Debe guardarse de forma privada y no publicarse en GitHub Pages ni redes sociales.
- La biblioteca PDF está alojada localmente. Para que **todo** funcione sin Internet, también es necesario tener disponibles los demás recursos del sitio, como logos e imágenes externas; esta etapa no los ha empaquetado.
- La exportación de credenciales por lote se limita a jugadores con documentos completos y foto existente en el teléfono. No inventa datos faltantes.
- Los datos existentes de temporadas y fotografías no se migraron ni borraron.
- La biblioteca se carga bajo demanda, para no añadir trabajo extra durante el scroll.

## Pruebas
```sh
node --test tests/local-pdf-lib.test.mjs
```
Las pruebas comprueban un PDF mínimo real, dimensiones INE, posiciones no superpuestas en A4 y ausencia del CDN de jsPDF. GitHub Actions también ejecuta este archivo con datos de ejemplo. Falta verificación visual de impresión real y de memoria en Android.
