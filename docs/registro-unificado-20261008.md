# Registro unificado de jugadores

El flujo existente de `credentialBuilder` ahora une la lista del delegado,
CURP/INE, foto individual, padrón por temporada y credencial. Las listas se
revisan antes de aplicarse. Los documentos y fotos se guardan en IndexedDB
en el dispositivo del administrador, fuera del repositorio público.

## Uso

1. Selecciona el equipo y una o varias imágenes de la lista. PDF, DOCX, TXT
   y CSV siguen disponibles como formatos opcionales.
2. Detecta, corrige y aprueba los nombres. El padrón puede sugerir una
   coincidencia, pero no agrega apellidos faltantes ni reemplaza una lectura.
3. Aplica los aprobados como borradores. Las bajas siguen siendo explícitas.
4. Usa “Completar siguiente jugador” para cargar cada registro. Selecciona
   su documento y foto, detecta datos y revisa la CURP contra la hoja.
5. “Guardar y continuar” exige nombre, equipo, CURP con fecha y dígito
   coherentes y una foto. El guardado habitual permite borradores.
6. La exportación de credencial requiere los datos y foto completos, además
   de la validación de edad de la categoría ya existente.

Las fotos se recuperan al volver a cargar un jugador. Para adjuntar varias,
selecciona imágenes y confirma un jugador por archivo. Se sugieren sólo
coincidencias exactas por nombre completo o CURP del nombre del archivo;
los homónimos y coincidencias parciales nunca se asignan automáticamente.
Los datos permanecen en el navegador; borrar sus datos también los elimina.
Este registro local no inscribe automáticamente jugadores en AdminFut.

## Escritura a mano

Tesseract.js se conserva para texto impreso local. Su documentación indica
que no está diseñado para manuscritos. La opción Pluma/lápiz usa el endpoint
autenticado `api/registration-ocr.js` y Google Vision `DOCUMENT_TEXT_DETECTION`.
No se presenta como conectado hasta que el servidor responde correctamente.

GitHub Pages sólo aloja la aplicación estática. Para habilitar manuscritos,
despliega el endpoint en un servidor compatible con Vercel Functions y
configura allí, mediante variables de entorno:

- `GOOGLE_VISION_API_KEY`: clave de Vision habilitada y restringida al servicio.
- `REGISTRATION_ADMIN_TOKEN`: secreto fuerte para el administrador.
- `REGISTRATION_ALLOWED_ORIGIN`: `https://jairofrancog7-star.github.io`.

En el panel, introduce el enlace HTTPS del endpoint y su acceso, pulsa
Comprobar conexión y elige Pluma/lápiz. El acceso dura sólo la sesión del
navegador. La imagen se envía al endpoint y a Google únicamente al solicitar
esa lectura. El endpoint no guarda imágenes ni registra información personal
en logs. Vision debe estar habilitado y puede generar costes de uso.
Sin conexión, usa lectura impresa o pega/corrige los nombres; no se simula
reconocimiento manuscrito. Ningún OCR garantiza todos los nombres de una
hoja ilegible. Verifica el número de jugadores contra la lista original.

## WhatsApp

El acceso directo abre el chat `+52 412 171 5599`. No lee mensajes ni
descarga adjuntos de una cuenta de WhatsApp por conocer su número.
Actualmente se importan imágenes guardadas desde WhatsApp, imágenes copiadas
desde el portapapeles compatible o enlaces HTTPS directos con CORS habilitado.
Los enlaces privados de chat requieren guardar el archivo primero.

La recepción automática sigue pendiente de una cuenta de WhatsApp Business
autorizada y un backend con webhook verificado y almacenamiento privado.
No se migró ni alteró la cuenta personal del administrador. Google Contacts
no proporciona acceso a los mensajes o archivos de WhatsApp.

## Fuentes de implementación

- https://github.com/naptha/tesseract.js/blob/master/docs/faq.md
- https://docs.cloud.google.com/vision/docs/handwriting
- https://www.twilio.com/docs/whatsapp/api
- https://www.twilio.com/docs/whatsapp/tutorial/send-and-receive-media-messages-whatsapp-nodejs
- https://vercel.com/docs/functions

## Verificación

Pruebas de CURP, orden del nombre en INE, homónimos, requisitos para
credencial y endpoint OCR (autenticación, falta de configuración, petición
documental y respuesta sin caché). Prueba de navegador con el módulo real
de registro: persistencia de fotos tras recarga, separación de jugadores,
lista de varios nombres y vinculación de fotos. Las pruebas usan datos
inventados. No se ensayó con documentos personales reales ni un proveedor
manuscrito configurado en producción.
