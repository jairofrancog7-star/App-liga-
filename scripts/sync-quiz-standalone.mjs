/* Standalone Quiz Arena bundle for GitHub Pages. Maintains ONE canonical source:
   src/v531-quiz-moreless-drive-reference.js. Vite will copy this file from
   public/ as a classic defer script; failures in other bundled modules cannot
   suppress this route. */
import { mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
mkdirSync(resolve(root,'public'),{recursive:true});
copyFileSync(resolve(root,'src/v531-quiz-moreless-drive-reference.js'),
             resolve(root,'public/quiz-arena-independent.js'));
console.log('Quiz Arena runtime synced separately from the main app bundle.');
