# Liga Juventino Rosas — Web + APK

Portal de fútbol municipal de **Liga Juventino Rosas** con versión móvil/APK y modo navegador para escritorio.

## 🌐 Ver la página

**Página publicada (GitHub Pages):**

https://jairofrancog7-star.github.io/App-liga-/

**Enlace directo con refresh/cache-buster para ver los cambios recientes:**

https://jairofrancog7-star.github.io/App-liga-/?refresh=desktop-v7-20260916

> En PC, usa una ventana de **1024 px o más** para activar el nuevo modo escritorio.

## ✅ Estado actual

La rama principal es `main`.

Cambios recientes del modo escritorio:

- Barra superior y navegación horizontal para PC.
- Carrusel de próximos partidos.
- Accesos rápidos circulares.
- Portada principal con panel **Lo más destacado**.
- Secciones de **Momentos**, **Últimas noticias** y **Resúmenes en vídeo**.
- Accesos a **Calendario**, **Datos**, **Performance Zone**, **Predictor**, **Torneo**, **Zenith**, **Fichajes** y **Notificaciones**.
- Footer completo para navegador.
- La versión móvil/APK conserva su navegación original.

Archivos principales del modo escritorio:

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

También existe el workflow de GitHub Actions:

```text
.github/workflows/android-debug.yml
```

## 💻 Desarrollo local

```bash
npm install
npm run dev
```

Build web:

```bash
npm run build
```

La salida web se genera en `dist/`.

## 🧭 Navegación incluida

El portal contiene rutas y módulos para:

- Inicio
- Partidos / Competición
- Clasificación
- Liga TV / Vídeo
- Fantasy
- Equipos
- Noticias
- Historia
- Datos y estadísticas
- Calendario
- Fichajes
- Predictor
- Notificaciones
- Perfil

## 📊 Analítica

El repositorio actualmente no contiene una integración de PostHog detectada en el código. Se puede añadir después para medir visitas, clics, rutas más usadas y errores del modo navegador sin modificar el diseño visual.

## Repositorio

https://github.com/jairofrancog7-star/App-liga-
