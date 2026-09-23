import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function copyStaticReferences() {
  return {
    name: 'copy-static-references',
    closeBundle() {
      const files = [
        ['assets/reference/final-trophy-drive.png', 'dist/assets/reference/final-trophy-drive.png'],
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
      const historyFrom = resolve('assets/history');
      const historyTo = resolve('dist/assets/history');
      if (existsSync(historyFrom)) {
        mkdirSync(historyTo, { recursive: true });
        cpSync(historyFrom, historyTo, { recursive: true, force: true });
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
