import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function copyStaticReferences() {
  return {
    name: 'copy-static-references',
    closeBundle() {
      const files = [
        ['src/v606-control-registro-tools.js', 'dist/src/v606-control-registro-tools.js'],
        ['src/v606-control-registro-tools.css', 'dist/src/v606-control-registro-tools.css'],
        // Fuentes CSS de la barra de jornada: deben sobrevivir al build demo/APK.
        ['src/v1153-matchday-fullwidth-safe-crests.css', 'dist/src/v1153-matchday-fullwidth-safe-crests.css'],
        ['src/v1167-matchday-centered-official-crests.css', 'dist/src/v1167-matchday-centered-official-crests.css'],
        ['src/v1166-meeting-officers.css', 'dist/src/v1166-meeting-officers.css'],
        ['src/vendor/QRCODE-LICENSE.txt', 'dist/src/vendor/QRCODE-LICENSE.txt'],
        ['data/account-cloud-config.json', 'dist/data/account-cloud-config.json'],
        ['assets/liga-logo-original.webp', 'dist/assets/liga-logo-original.webp'],
        ['assets/liga-logo.webp', 'dist/assets/liga-logo.webp'],
        ['assets/reference/final-trophy-drive.png', 'dist/assets/reference/final-trophy-drive.png'],
        ['assets/reference/predictor-v36/liga-crest-white.webp', 'dist/assets/reference/predictor-v36/liga-crest-white.webp'],
        ['assets/moments/moments-original-a.png', 'dist/assets/moments/moments-original-a.png'],
        ['assets/moments/moments-original-b.png', 'dist/assets/moments/moments-original-b.png'],
      ];

      for (const [fromPath, toPath] of files) {
        const from = resolve(fromPath);
        const to = resolve(toPath);
        if (existsSync(from)) {
          mkdirSync(dirname(to), { recursive: true });
          copyFileSync(from, to);
        }
      }

      // Historia usa rutas dinámicas en JS, por eso Vite no las detecta como assets importados.
      // Copiamos completa la carpeta para que las fotos reales de campeones/trofeos
      // sí existan tanto en GitHub Pages como dentro del build Android.
      // Image URLs from the reusable resource catalog are resolved dynamically.
      for(const directory of ['assets/content-studio','assets/branding']){if(existsSync(resolve(directory)))cpSync(resolve(directory),resolve('dist',directory),{recursive:true,force:true})}
      const historyFrom = resolve('assets/history');
      const historyTo = resolve('dist/assets/history');
      if (existsSync(historyFrom)) {
        mkdirSync(historyTo, { recursive: true });
        cpSync(historyFrom, historyTo, { recursive: true, force: true });
      }

      // The source index still contains a small set of classic, non-module
      // <script src="./src/..."> tags for History photo payloads/hardfixes.
      // Vite does not bundle or copy those files automatically. Missing them in
      // GitHub Pages leaves dozens of parser-blocking 404 requests and can make
      // the app look permanently blank on mobile. Copy exactly the classic
      // scripts referenced by the source index into dist/src.
      const sourceIndex = readFileSync(resolve('index.html'), 'utf8');
      const classicScriptRefs = [...sourceIndex.matchAll(/<script(?![^>]*type=["']module["'])[^>]*src=["']\.\/src\/([^"'?]+\.js)(?:\?[^"']*)?["'][^>]*><\/script>/g)]
        .map(match => match[1]);

      for (const relativeScript of new Set(classicScriptRefs)) {
        const from = resolve('src', relativeScript);
        const to = resolve('dist', 'src', relativeScript);
        if (!existsSync(from)) {
          throw new Error('Classic script referenced by index.html is missing: src/' + relativeScript);
        }
        mkdirSync(dirname(to), { recursive: true });
        copyFileSync(from, to);
      }

      // V230 — reconstruir como archivo binario real la foto de La Esperanza.
      // Los scripts clásicos de src no se copian a dist por Vite.
      const esperanzaParts = [
        'src/v214-esperanza-photo-1.js',
        'src/v214-esperanza-photo-2.js',
        'src/v214-esperanza-photo-3.js',
        'src/v214-esperanza-photo-4.js',
      ];
      if (esperanzaParts.every(p => existsSync(resolve(p)))) {
        const base64 = esperanzaParts.map(p => {
          const source = readFileSync(resolve(p), 'utf8');
          const match = source.match(/LJR_ESPERANZA_2025_PARTS\.push\('([^']+)'\)/);
          if (!match) throw new Error('No se pudo leer el chunk de La Esperanza: ' + p);
          return match[1];
        }).join('');
        const bytes = Buffer.from(base64, 'base64');
        if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
          throw new Error('La fotografía reconstruida de La Esperanza no es un WEBP válido');
        }
        const target = resolve('dist/assets/history/archive-v224/la-esperanza-campeon-copa-veteranos50-08-nov-2025.webp');
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, bytes);
      }

      // La suite de juntas y el demo necesitan una ruta CSS literal además
      // del CSS que Vite agrupa: el demo se regenera automáticamente.
      const indexBuilt = resolve('dist/index.html');
      if (existsSync(indexBuilt)) {
        let html = readFileSync(indexBuilt, 'utf8');
        if (!html.includes('v1166-meeting-officers.css')) {
          html = html.replace('</head>', '  <link rel="stylesheet" href="./src/v1166-meeting-officers.css" />\n</head>');
          writeFileSync(indexBuilt, html);
        }
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [copyStaticReferences()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
