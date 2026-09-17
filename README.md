# Liga Juventino Rosas — Web + APK

Portal de fútbol municipal de **Liga Juventino Rosas** con versión móvil/APK y modo navegador para escritorio.

## 🌐 Publicación web en GitHub Pages

El repositorio ya incluye un workflow de despliegue web:

```text
.github/workflows/pages.yml
```

Ese workflow:

1. instala las dependencias;
2. compila la app con Vite;
3. usa la base correcta `/App-liga-/`;
4. prepara el artefacto `dist/`;
5. publica en GitHub Pages.

### Activación única necesaria

GitHub Pages todavía debe habilitarse una sola vez desde el repositorio:

1. Abre **Settings** del repositorio.
2. En el menú lateral entra a **Pages**.
3. En **Build and deployment > Source** selecciona **GitHub Actions**.
4. Guarda el cambio si GitHub lo solicita.
5. Después abre **Actions > Deploy Web to GitHub Pages** y ejecuta **Run workflow**, o realiza cualquier cambio en `main` para volver a dispararlo.

GitHub confirmó que el build web sí termina correctamente; el despliegue se detiene únicamente porque Pages todavía no está habilitado para este repositorio.

## 🔗 Enlaces

**Página GitHub Pages** — funcionará en cuanto Pages esté habilitado:

https://jairofrancog7-star.github.io/App-liga-/

**Enlace directo con refresh/cache-buster:**

https://jairofrancog7-star.github.io/App-liga-/?refresh=pages-fix-20260916

**Repositorio:**

https://github.com/jairofrancog7-star/App-liga-

**Configuración de GitHub Pages:**

https://github.com/jairofrancog7-star/App-liga-/settings/pages

**Workflow de publicación:**

https://github.com/jairofrancog7-star/App-liga-/actions/workflows/pages.yml

> En PC, usa una ventana de **1024 px o más** para activar el modo escritorio.

## ✅ Estado del build

La compilación web fue probada en GitHub Actions con:

```bash
npm install
npm run build -- --base=/App-liga-/
```

Vite generó correctamente la carpeta `dist/` y los archivos optimizados de HTML, CSS y JavaScript.

## 🖥️ Modo escritorio

Cambios incluidos:

- Barra superior y navegación horizontal para PC.
- Carrusel de próximos partidos.
- Accesos rápidos circulares.
- Portada principal con panel **Lo más destacado**.
- Secciones de **Momentos**, **Últimas noticias** y **Resúmenes en vídeo**.
- Accesos a **Calendario**, **Datos**, **Performance Zone**, **Predictor**, **Torneo**, **Zenith**, **Fichajes** y **Notificaciones**.
- Footer completo para navegador.
- La versión móvil/APK conserva su navegación original.

Archivos principales:

- `src/desktop-shell.css`
- `src/desktop-shell.js`
- `index.html`

## 📱 Móvil / APK

El proyecto usa **Capacitor** para Android.

```bash
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

APK esperado:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Workflow Android:

```text
.github/workflows/android-debug.yml
```

## 💻 Desarrollo local

```bash
npm install
npm run dev
```

Build web normal:

```bash
npm run build
```

La salida web se genera en `dist/`.

## 📊 PostHog

La publicación de GitHub Pages y PostHog son independientes. Primero debe quedar activo el sitio público. Después se puede conectar PostHog para medir visitas, clics, rutas más usadas y errores sin cambiar el diseño visual.
