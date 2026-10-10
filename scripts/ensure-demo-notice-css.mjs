/* Reponer en el demo estático el CSS de cancelación de series de avisos.
   Vite lo integra en el CSS compilado y elimina su enlace individual, pero
   el demo y sus comprobaciones necesitan la misma referencia explícita. */
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
const file='demo/index.html';
let html=readFileSync(file,'utf8');
const src='src/v1212-notice-series-cancel.css';
const dst='demo/src/v1212-notice-series-cancel.css';
mkdirSync('demo/src',{recursive:true});
copyFileSync(src,dst);
if(!html.includes('v1212-notice-series-cancel.css')){
 const before='</head>';
 if(!html.includes(before))throw new Error('No existe etiqueta </head> en demo/index.html');
 html=html.replace(before,'  <link rel="stylesheet" href="./src/v1212-notice-series-cancel.css?v=20261010-v1212" />\n'+before);
 writeFileSync(file,html);
}
if(readFileSync(src,'utf8')!==readFileSync(dst,'utf8'))throw new Error('CSS de avisos sin sincronizar');
console.log('Demo: CSS de cancelación de series y enlace verificados.');
