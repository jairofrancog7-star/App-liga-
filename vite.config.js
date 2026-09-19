import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
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
