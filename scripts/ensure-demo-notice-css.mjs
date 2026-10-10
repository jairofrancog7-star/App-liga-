/* Mantiene demo y producción coherentes para CSS de avisos y Administración.
   Vite agrupa CSS en assets: las pruebas y la demo requieren enlaces locales.
   No altera lógica, permisos, resultados ni la configuración del servidor. */
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
const file='demo/index.html';
let html=readFileSync(file,'utf8');
if(!html.includes('</head>'))throw new Error('Falta </head> en demo/index.html');
mkdirSync('demo/src',{recursive:true});
const styles=[
 {name:'v1211-notice-recurrence.css',version:'20261010-v1212'},
 {name:'v1212-notice-series-cancel.css',version:'20261010-v1212'},
 {name:'v1310-admin-paleta-unificada.css',version:'20261010-v1310-admin-navy'}
];
for(const {name,version} of styles){
 const source='src/'+name,target='demo/src/'+name;
 copyFileSync(source,target);
 const href='./src/'+name+'?v='+version;
 if(!html.includes(href)){
  // Idempotente aun cuando Vite haya creado un enlace antiguo de este módulo.
  const escaped=name.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g,'\\$&');
  const stale=new RegExp('^[^\\n]*<link[^>]+href="[^"]*'+escaped+'[^"]*"[^>]*>\\s*\\n?','gm');
  html=html.replace(stale,'');
  html=html.replace('</head>','  <link rel="stylesheet" href="'+href+'" />\n</head>');
 }
 if(readFileSync(source,'utf8')!==readFileSync(target,'utf8'))
  throw new Error('CSS fuera de sincronía: '+name);
}
writeFileSync(file,html);
console.log('Demo: CSS de avisos y paleta V1310 sincronizados.');
