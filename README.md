# Liga Juventino — reconstrucción Skywork

Aplicación móvil reconstruida a partir del prototipo visual generado en Skywork y de las referencias suministradas para Liga Juventino.

## Diseño

Tokens principales:

- Brand Primary: `#3E63DD`
- Primary Tint: `#182449`
- Accent: `#00A2C7`
- Accent Tint: `#082C36`
- Ink: `#EDEEF0`
- Surface: `#18191B`
- Background: `#111113`
- Background Warm: `#1A191B`

La interfaz mantiene un sistema compacto y de alta densidad para fútbol municipal, con navegación inferior de cinco secciones, tablas, cuadro eliminatorio, vídeo, Fantasy, juegos, estadísticas, historia y perfiles.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build web

```bash
npm install
npm run build
```

La salida se genera en `dist/`.

## APK Android

El proyecto usa Capacitor. GitHub Actions incluye el workflow **Build Android Debug APK**.

También se puede generar localmente:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

APK esperado:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Estado actual

Incluye:

- Inicio con stories, hero, Momentos, próximos partidos y tabla rápida.
- Competición con partidos/resultados, clasificación y bracket horizontal.
- Detalle de partido.
- Vídeo y tarjetas multimedia.
- Fantasy, equipo y ligas.
- Quiniela, Quiz Arena y Más o Menos.
- Más, Siguiendo, Equipos, goleadores, Estadísticas, Rankings, Historia y Temporada.
- Perfil y preferencias de notificación.
- Tema oscuro y claro.
- Persistencia local para tema y equipos seguidos.
- PWA/offline básico.
- Configuración para Android APK mediante Capacitor.

Los datos actuales son de demostración y están separados de una futura integración con Firebase/API oficial.
