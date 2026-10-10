# Perfil: IA local, automatización, seguridad y cuentas sincronizadas (V1300)

Estado: cambios de interfaz listos para revisión en PR #47. El servidor de cuentas está DESHABILITADO por defecto y necesita un proyecto Supabase autorizado; NO existe una sincronización remota en producción todavía. La autenticación local no se sustituye.

## Investigación
- Chrome Built-in AI: LanguageModel.availability() permite probar IA del navegador. Sólo se ejecuta si el modelo está instalado, sin descargarlo automáticamente.
- Transformers.js / WebGPU: grandes modelos pueden elevar consumo de datos y RAM. No se añaden para evitar que Perfil se trabe en Android.
- Supabase Auth: permite correo/contraseña, recuperar por correo, passkeys experimentales y revocar tokens de actualización de otras sesiones.
- MDN Push: para notificar con la app cerrada se requiere servidor Push y service worker; la solicitud de permisos debe ocurrir tras una acción del usuario.
- Se reutilizó la paleta del CMS de la Liga: #060C46, #0B1C66, #102F7D y acentos azul hielo, sin verde ni morado.

## Implementado
- Preferencias por cuenta local: tamaño de texto, reducción de animaciones, ocultación de correo en Perfil, recomendaciones automáticas.
- Revisión automática sin internet sobre biometría, correo, dispositivo recordado, notificaciones bloqueadas y visibilidad de contacto.
- Asistente opcional de lenguaje realmente local sólo cuando Chrome ya tiene el modelo instalado. No se envían nombres, fotos, correos ni contraseñas al modelo.
- Indicador local de fortaleza y contraseña aleatoria mediante crypto.getRandomValues.
- Módulo optativo de nube: crear cuenta, acceder, recuperar contraseña, cerrar sesión local y otras sesiones, passkey si Supabase la soporta y está activada.
- Sincronización optativa SOLAMENTE de camiseta, categoría, número, avatar preestablecido y preferencias; nada administrativo.

## Activación por el administrador de Liga
1. Crear o seleccionar un proyecto propio de Supabase. Durante el desarrollo no había ninguno vinculado.
2. Ejecutar docs/sql/profile-preferences-rls.sql en SQL Editor del proyecto; comprobar con 2 usuarios distintos que RLS bloquea acceso cruzado.
3. Configurar proveedor Email, confirmación de correo, URL principal y redirecciones autorizadas en Supabase Auth, y comprobar envíos de recuperación.
4. En data/account-cloud-config.json configurar enabled:true, url del proyecto HTTPS, publishableKey y opcional passkeys:true.
5. Usar SOLO clave pública publishable/anon. NUNCA publicar service_role, claves secretas, tokens o contraseñas en GitHub.
6. Para passkeys activar modo experimental de Supabase con WebAuthn relying party configurado al dominio de GitHub Pages. Probar recuperación alternativa.
7. Validar en Android, GitHub Pages y otro dispositivo real antes de fusionar.

## Límites importantes
- Las cuentas locales y de Supabase siguen independientes; el acceso a nube NO concede funciones administrativas ni importa contraseñas.
- No se sincronizan hashes, tokens, biometría, CURP, INE, teléfonos ni fotografías.
- La lista Dispositivos actual es del almacenamiento local, NO lista de sesiones remotas verificadas.
- Cerrar otras sesiones remotas revoca refresh tokens, pero un JWT emitido puede seguir vigente hasta su vencimiento.
- La IA del navegador es opcional; si el teléfono no la soporta se ejecuta el motor de recomendaciones por reglas, no un modelo generativo.
- La autenticación y permisos principales necesitan futura migración segura en servidor antes de ser realmente una sola cuenta sincronizada.

Fuentes: https://developer.chrome.com/docs/ai/get-started ; https://huggingface.co/docs/transformers.js/en/guides/webgpu ; https://developer.mozilla.org/es/docs/Web/API/Push_API ; https://supabase.com/docs/guides/auth/sessions ; https://supabase.com/docs/guides/auth/passkeys ; https://supabase.com/docs/reference/javascript/auth-signout
