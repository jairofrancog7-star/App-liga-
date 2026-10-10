/* Mantiene el demo estático y sus estilos de avisos coherentes con producción.
   Vite agrupa CSS y elimina enlaces explícitos, que estas pruebas requieren. */
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
const file='demo/index.html';
let html=readFileSync(file,'utf8');
if(!html.includes('</head>'))throw new Error('Falta </head> en demo/index.html');
mkdirSync('demo/src',{recursive:true});
for(const name of ['v1211-notice-recurrence.css','v1212-notice-series-cancel.css','v1310-admin-paleta-unificada.css']){
 const source='src/'+name,target='demo/src/'+name;
 copyFileSync(source,target);
 if(!html.includes(name)){
  const version=name==='v1310-admin-paleta-unificada.css'?'20261010-v1310-admin-navy':'20261010-v1212';
  html=html.replace('</head>','  <link rel="stylesheet" href="./src/'+name+'?v='+version+'" />\n</head>');
 }
 if(readFileSync(source,'utf8')!==readFileSync(target,'utf8'))throw new Error('CSS fuera de sincronía: '+name);
}
writeFileSync(file,html);
console.log('Demo: CSS de Avisos y paleta administrativa V1310 sincronizados.');
