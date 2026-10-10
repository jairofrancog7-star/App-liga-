# IA local y automatización de notificaciones · V1221

## Objetivo
Mejorar exclusivamente **Registrarse y recibir notificaciones** de App-liga sin cambiar otras pantallas, sin introducir proveedores externos de IA y respetando la paleta que ya existe en la aplicación.

## Implementación
- **Clasificación local por aprendizaje automático clásico:** Multinomial Naive Bayes entrenado con ejemplos generales en español de avisos deportivos. El cálculo y el aprendizaje al marcar «Me interesa / No me interesa» se hacen exclusivamente en JavaScript dentro del dispositivo.
- **Personalización:** toma la categoría y el equipo elegidos, excluye anuncios de categorías distintas y calcula una prioridad orientativa. No modifica los comunicados ni afirma que una alerta sea oficial por clasificación automática.
- **Fuente de información:** solamente el JSON público `./data/active-notices.json` usado por el módulo de Noticias. Si está vacío, se muestra que no hay avisos; **no se inventan noticias ni partidos**.
- **Recomendación de preferencias:** botón «Aplicar avisos recomendados» que activa en `lj-store-v3.notifications` los avisos relevantes (goles, comienzo, final, cambios de horario, cambios de sede y noticias). No cambia nada sin pulsación de la persona.
- **Automatización voluntaria:** al activar el interruptor, consulta el archivo de avisos al abrir y cada 5/15/30 minutos mientras la app esté visible, incluso fuera del formulario. No solicita permisos Push de manera automática. La opción de mostrar notificaciones locales solo se ejecuta si el permiso ya estaba concedido y se reconoce un aviso nuevo relevante tras establecer línea base.
- **Push real:** se conserva el servicio Web Push ya implementado en `src/v1082-push-notifications.js`; aplicar preferencias locales **no sincroniza por sí solo una suscripción remota**. La persona debe abrir el panel Web Push y guardar filtros. La app cerrada depende de ese servidor y de permisos del navegador.

## Diseño: mismos colores de la app
Paleta tomada de `src/v46-account-reference.css`:
- Fondo `var(--v46-bg, #05045f)`
- Paneles `var(--v46-bg2, #090879)`
- Encabezado `#0a096f`
- Separador `#03034f`
- Acciones `#1c69d4` / `#0d47a1`

Se elimina el degradado diferente del registro mediante `src/v1221-notification-ai-local.css`, cargado al final para prevalecer sin afectar las demás rutas.

## Investigación técnica y límites
1. [Transformers.js](https://huggingface.co/docs/transformers.js/en/index): modelos neuronales locales, pero su descarga y memoria son mayores. No se añadió por defecto para que el registro móvil sea ligero.
2. [Multinomial Naive Bayes — scikit-learn](https://scikit-learn.org/stable/modules/naive_bayes.html): método clásico de clasificación textual reproducido en JavaScript del cliente.
3. [MDN — operación offline y en segundo plano](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation): el trabajo programado en segundo plano está limitado por permisos y navegador; no se promete ejecución continua con app cerrada.
4. [MDN — Periodic Background Sync](https://developer.mozilla.org/en-US/docs/Web/API/Web_Periodic_Background_Synchronization_API): compatibilidad limitada; no se depende de esta API.

## Archivos
- `src/v1221-notification-ai-local.js`
- `src/v1221-notification-ai-local.css`
- `index.html`
- `tests/notifications-ai-v1221.test.mjs`

## Pruebas
```sh
node --test tests/notifications-ai-v1221.test.mjs
```

Prueba manual Android:
1. Abrir `?refresh=v1221-ia-azul` y entrar a «Registrarse y recibir notificaciones».
2. Verificar que el fondo y los controles son los mismos azules que el resto de la página; ningún botón queda tapado.
3. Seleccionar categoría y equipo y pulsar «Aplicar avisos recomendados»; abrir Preferencias para comprobar los cambios.
4. Probar «Analizar avisos oficiales». Si el JSON oficial está vacío, se indica claramente.
5. Activar automatización; dejar la página visible y observar comprobaciones según intervalo.
6. Para avisos con la página cerrada, activar **Notificaciones Push** por separado, aceptar permisos y verificar la suscripción en backend.

> Los resultados de clasificación son sugerencias locales, no comunicación ni decisión oficial de la Liga.


## Continuación V1222 (10 octubre 2026)
- Mejor reconocimiento de categorías oficiales, incluso si el feed contiene IDs numéricos, «Primera Fuerza» o «Segunda Fuerza».
- Se excluyen avisos en borrador, sin publicar o programados para el futuro.
- IDs locales estables de comunicados sin ID: cambiar el orden de las publicaciones ya no las considera nuevas.
- Al cambiar categoría o equipo dentro del formulario, se actualiza también **la selección visible** en el panel Web Push; la suscripción remota NO cambia hasta que el usuario pulse «Guardar filtros».
- Corrección de texto: la revisión periódica puede funcionar mientras la aplicación está abierta y visible, aun si se cerró el formulario.
- Nuevo botón «Borrar aprendizaje local» que limpia solamente los ejemplos de entrenamiento; conserva otras preferencias, perfil y Push.
- Botones del panel IA adaptados al mismo azul oscuro, dimensiones compactas y versión de recursos V1222 en `index.html`.

### Verificación técnica V1222
- Sintaxis del JavaScript en los tres módulos modificados validada.
- Prueba simulada de automatización con feed oficial: al iniciar no envía avisos; al recibir un comunicado oficial nuevo relevante genera **una** notificación; al consultar nuevamente no la duplica.
- Filtros por categoría, IDs estables, borradores y avisos futuros verificados mediante pruebas aisladas.
- Prueba real en navegador Android, entrega Push desde el servidor y despliegue GitHub Pages: deben comprobarse aparte. La mera presencia del código en GitHub no confirma estos puntos.

