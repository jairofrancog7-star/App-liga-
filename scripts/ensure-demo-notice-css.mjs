/* Mantiene el demo estático y sus estilos de avisos coherentes con producción.
   Vite agrupa CSS y elimina enlaces explícitos, que estas pruebas requieren. */
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
const file='demo/index.html';
let html=readFileSync(file,'utf8');
if(!html.includes('</head>'))throw new Error('Falta </head> en demo/index.html');
mkdirSync('demo/src',{recursive:true});
for(const name of ['v1211-notice-recurrence.css','v1212-notice-series-cancel.css']){
 const source='src/'+name,target='demo/src/'+name;
 copyFileSync(source,target);
 if(!html.includes(name)){
  html=html.replace('</head>','  <link rel="stylesheet" href="./src/'+name+'?v=20261010-v1212" />\n</head>');
 }
 if(readFileSync(source,'utf8')!==readFileSync(target,'utf8'))throw new Error('CSS fuera de sincronía: '+name);
}
writeFileSync(file,html);
console.log('Demo: ambos CSS de Avisos y sus enlaces sincronizados.');
