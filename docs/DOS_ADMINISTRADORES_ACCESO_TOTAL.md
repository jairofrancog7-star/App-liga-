# Dos cuentas independientes con acceso total

## Decisión de la Liga
La administración requiere **dos responsables principales independientes**:
1. **Propietario/desarrollador del sitio**: cuenta que administra el repositorio GitHub `jairofrancog7-star/App-liga-` y también debe contar con acceso completo al CMS de la Liga.
2. **Presidente de la Liga**: cuenta independiente con sus propios datos de contacto, contraseña y segundo factor.

Ambos deben poder editar los módulos administrativos, incluidos publicaciones, resultados, calendarios, clubes, jugadores, sanciones, configuración, dispositivos y respaldos, siempre mediante el servidor autorizado. Ninguno debe perder su cuenta al registrar al otro. Las credenciales y sesiones nunca se comparten.

## Situación actual verificada en este repositorio
- GitHub conserva el propietario del código; tener acceso a GitHub **no concede por sí solo** una sesión de administración en el CMS.
- El formulario local `src/v569-account-auth.js` permite ingresar correo y teléfono, pero crea cuentas **locales al dispositivo**. Esos valores pueden ser escritos por cualquiera y NO verifican identidad.
- `public/media-client.js` obtiene sesiones administrativas de `/api/login`, lee el rol desde `/api/me` y consulta `/api/admins`. El rol `owner === true` llega desde el servidor, no se deriva del teléfono/correo. El panel muestra la cantidad de cuentas principales verificadas frente a las dos previstas.
- El CMS real está alojado fuera de este repositorio, en el servidor configurado mediante `window.LJR_MEDIA_BASE`. Modificar GitHub Pages por sí solo NO crea ni eleva un propietario en esa base de datos.
- `/api/admins` desde el cliente actualmente crea administradores ordinarios. El panel indica expresamente que crearlos NO activa acceso total.

## Configuración imprescindible en el servidor privado
1. Conservar la cuenta propietaria existente. Crear (o vincular) una segunda identidad única del presidente **sin reasignar ni reemplazar** la primera cuenta.
2. Verificar la titularidad de los contactos mediante pruebas reales de control: correo con enlace/código y número mediante OTP, o incorporar un proveedor de identidad de confianza. **No otorgar privilegios al comparar cadenas de texto**.
3. El administrador actual, debidamente autenticado y con verificación reforzada, autoriza la elevación. La mutación de roles debe usar un endpoint protegido y un registro de auditoría.
4. El backend debe permitir **dos cuentas de máximo privilegio** y devolver `owner: true` para cada una al iniciar sesión y en `/api/admins` (o migrar a una política explícita equivalente que también proteja TODOS los endpoints).
5. Validar las capacidades **en cada operación de escritura** en el servidor: modificar contenidos, exportar respaldo completo, administrar roles, crear/revocar accesos y realizar cambios de configuración; no limitarse a ocultar o mostrar botones.
6. Guardar contraseña con hash fuerte, aplicar límites de intentos, MFA/WebAuthn para las dos cuentas y permitir revocar sesiones/dispositivos de manera individual. No dejar tokens ni secretos en JavaScript público, GitHub Pages o el repositorio.
7. No revocar automáticamente al segundo administrador principal. Definir una recuperación independiente para cada una de las dos cuentas.

## Comprobación final pendiente en el servidor
- Sesión del propietario: `/api/me` confirma acceso total, puede editar y administrar roles.
- Sesión del presidente: `/api/me` confirma acceso total con identidad verificada y los mismos permisos.
- `/api/admins` muestra **dos** cuentas principales activas. Una cuenta normal no puede falsificar el rol al enviar un correo o teléfono distinto.
- Las dos cuentas conservan sesiones y contraseñas separadas; las operaciones quedan auditadas.

> No marcar como habilitado el segundo acceso hasta que lo confirme el backend. El formulario de registro y los cambios en la vista solamente preparan el flujo.

## V1208 (10 oct 2026): segundo principal, Avisos y Juntas
- Código aplicado: `server/notifications/principals-schema.sql`, `bootstrap.mjs`, `authorization.mjs`, `index.mjs`, `src/v1208-coadmins-ui.js` y estilos compactos.
- **El propietario original** sigue siendo quien tiene `owner=true` desde el CMS remoto.
- **Segundo principal**: cuando exista una cuenta administrativa activa e independiente en el CMS, el propietario original puede seleccionarla en Administración → Dos administradores y aprobarla. Se guarda solo el ID ya autenticado en PostgreSQL. Un registro local o la coincidencia del correo/teléfono NO otorga permisos.
- El segundo principal recibe permisos equivalentes a `presidente` **solo dentro de Avisos, Juntas y Cédulas servidos por Railway**; el propietario original mantiene su acceso.
- El segundo principal puede administrar avisos, leer la auditoría y utilizar las rutas protegidas por permisos de ese servicio. El propietario original puede revocar la segunda cuenta; el sistema audita aprobación y revocación.
- La tabla admite **máximo una segunda cuenta**, mediante restricción de base de datos y bloqueo transaccional. El segundo principal sigue necesitando sesión propia válida del CMS al realizar cada acción.
- Seguridad: `GET /admin/principals` solo para roles autorizados. `POST/DELETE /admin/principals` solo para el propietario original. La concesión valida el usuario activo contra `GET /api/admins` del CMS con el token de sesión del propietario.
- CI: `tests/dual-principals.test.mjs` verifica privilegios, requisito de aprobación, migración y controles del cliente.

### Todavía no equivale a acceso total a toda la app
El CMS remoto principal de medios / contenido / resultados aún debe admitir a ambas identidades como administradores globales. El acceso de **GitHub** y el rol de **Railway** no cambian automáticamente la base de datos ni los controles del CMS privado. Configurar ese servicio sigue pendiente y no debe presentarse como terminado.

### Cómo terminar
1. Crear la cuenta independiente del presidente en la administración **real del CMS** con contraseña propia.
2. Comprobar la titularidad del correo y teléfono fuera del navegador público.
3. Iniciar sesión como el propietario original; seleccionar la cuenta presidencial en **Administración → Dos administradores** para Avisos y Juntas.
4. En el CMS privado, habilitar también las dos cuentas para todas las operaciones y verificar `/api/me` para ambas, sin reemplazar ni revocar al dueño original.
5. Comprobar en dos navegadores/dispositivos separados que ambas sesiones operan con sus propios tokens, y que usuarios normales no tienen acceso.
