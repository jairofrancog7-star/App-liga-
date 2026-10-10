# Respaldo oficial seguro (V1212)

Ámbito: **Mi app de la Liga → Registro y administración → Respaldo oficial**. Se sustituye la descarga JSON administrativa sin cifrar por un panel de herramientas privadas. No se modifican tablas, resultados, cuentas, sedes ni datos publicados.

## Funcionamiento

1. El acceso verifica sesión mediante el endpoint administrativo existente `me` y exige `response.admin.owner === true`. El servidor **debe volver a comprobar los permisos** al ejecutar `content?admin=1`; ocultar un botón no es seguridad.
2. «Analizar registros privados» consulta registros administrativos con la sesión verificada y los examina **en el navegador**: cantidad, IDs repetidos, campos de nombre/título vacíos, estructuras inesperadas y caídas de conteo superiores al 25 % frente al último análisis local. No se envían los registros a modelos de IA ni se cambian datos oficiales.
3. «Descargar respaldo cifrado» solicita una contraseña de mínimo 12 caracteres, genera salt aleatorio (16 bytes), IV aleatorio (12 bytes), deriva una clave con PBKDF2/SHA-256 (310 000 iteraciones) y cifra con AES-256-GCM usando Web Crypto API. Comprueba descifrado y estructura antes de solicitar la descarga.
4. «Verificar integridad» permite cargar el archivo cifrado V2, introducir la contraseña, autenticarlo y comprobar la estructura **sin restaurar ni publicar datos**. No es un importador.
5. Guarda **solo** fecha de descarga solicitada, recuentos y frecuencia de recordatorio en el almacenamiento local del navegador, sin contraseñas ni registros. Los recordatorios se muestran al abrir el panel; no hay ejecución en segundo plano.

## Importante

- No subir los respaldos a un repositorio público, ni enviar secretos de cifrado a GitHub Pages.
- Una descarga solicitada no demuestra que el usuario conservó el archivo: verificarlo desde el dispositivo.
- La versión antigua `ljr-admin-backup-v1` en JSON plano **no** está protegida y no se admite como archivo cifrado V2.
- Esta exportación contempla el contenido devuelto por `content?admin=1`. No promete incluir fotografías, PDFs, documentos IndexedDB ni todos los datos guardados en otros módulos/dispositivos.
- El detector implementado es **estadístico y por reglas**, totalmente local; no es un modelo de IA generativa. Una futura IA local con Transformers.js podría trabajar con estadísticas no sensibles, previa evaluación de rendimiento y privacidad.
- Para respaldos programados realmente autónomos, multiversión, restauración transaccional y retención segura se requiere un servidor/almacenamiento privado con autenticación, cifrado, monitoreo y trabajos programados. GitHub Pages no puede ofrecer todo eso por sí solo.
- La cuenta principal secundaria necesitará el permiso real de exportación en el **servidor CMS**; autorizarla solo en un módulo de interfaz no le concede automáticamente acceso al backup.

## Comprobación manual recomendada

- Cuenta visitante o administrador sin owner: acceso denegado antes de consultar contenido.
- Cuenta principal: análisis local, contraseña corta/incorrecta/repetición diferente, descarga cifrada, verificación de archivo válido.
- Archivo alterado o contraseña errónea: no debe superar autenticación AES-GCM.
- Copia mayor de 32 MiB: error informativo, sin descargar JSON en claro.
- Recordatorio 7/15/30 días o desactivado: persiste en el mismo navegador sin crear una tarea en segundo plano.
- Android: comprobar que los modales se muestran completos y no quedan tapados por navegación inferior.


## Complemento v1213 — IA estadística local y azul de la Liga

- **Paleta oficial** tomada de `src/v1174-cms-interior-blue.css`: fondo `#08144f`, tarjeta `#102b75`, borde `#547fcf` y azul de acción `#2464c9`. El modal y su encabezado siguen el mismo gradiente del CMS; la tarjeta «Respaldo oficial» utiliza los mismos estilos que las demás opciones.
- **Detector local adaptativo de anomalías:** compara solamente cantidades agregadas de registros guardadas en este navegador. A partir de cuatro días distintos, calcula una mediana y una desviación absoluta mediana (MAD) como línea base; detecta variaciones de conteo atípicas. No utiliza modelos externos, no es IA generativa, y no envía datos personales a terceros. Durante los primeros días se indican las muestras pendientes.
- **Revisión automática voluntaria:** se activa/desactiva con un checkbox. Solo consulta los registros cuando un usuario principal abre esta sección, no más de una vez cada 24 horas, y solo si la sesión está autorizada. Reutiliza las comprobaciones del servidor; no publica, no modifica y no descarga ningún respaldo.
- **Almacenamiento prudente:** mantiene como máximo 14 entradas con fechas y conteos, no registros personales. Las consultas repetidas el mismo día no se cuentan como días adicionales de aprendizaje.
- **Ligereza:** JavaScript y CSS propios sin nuevas dependencias de modelos. Los modelos de lenguaje descargados con Transformers.js se estudiaron, pero no se introducen para evitar consumo alto de datos, batería y memoria móvil.
- **Automatización de fondo no garantizada:** Periodic Background Sync es experimental y su compatibilidad es limitada (MDN). Para copias automáticas remotas de verdad, hace falta un backend privado con autorización, almacenamiento cifrado y trabajos programados.

Fuentes de referencia: https://huggingface.co/docs/transformers.js/en/guides/webgpu · https://developer.mozilla.org/en-US/docs/Web/API/Web_Periodic_Background_Synchronization_API · https://dexie.org/docs/ExportImport/dexie-export-import · https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey

### Nueva comprobación de v1213

1. Activar «Análisis automático al abrir», cerrar y reabrir el centro; verificar que no se repite en el mismo día.
2. Desactivar la opción y confirmar que no hay consultas automáticas posteriores.
3. Diagnóstico con menos de cuatro días distintos: debe indicar progreso del aprendizaje sin fingir que hay un modelo entrenado.
4. Comparar varios días y comprobar aviso por desviación respecto a la mediana.
5. Revisar en móvil que el checkbox conserva tamaño normal y ninguna tarjeta, texto, selector o botón se sale del cuadro.
6. Abrir con sesión no principal: debe denegar la consulta de datos privados.
