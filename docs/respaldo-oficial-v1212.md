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
