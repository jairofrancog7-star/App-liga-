import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function copyFinalTrophy() {
  return {
    name: 'copy-final-trophy',
    closeBundle() {
      const from = resolve('assets/reference/final-trophy-drive.png');
      const to = resolve('dist/assets/reference/final-trophy-drive.png');
      if (existsSync(from)) {
        mkdirSync(dirname(to), { recursive: true });
        copyFileSync(from, to);
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [copyFinalTrophy()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
