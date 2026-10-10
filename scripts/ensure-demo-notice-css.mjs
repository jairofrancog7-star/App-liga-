/* Sincroniza los estilos de demo con los reales de producción.
   El cache-buster viene de index.html, no de una versión antigua hardcodeada.
   No modifica funciones, permisos ni avisos oficiales. */
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
const demoFile='demo/index.html';
let demo=readFileSync(demoFile,'utf8');
const prod=readFileSync('index.html','utf8');
if(!demo.includes('</head>')||!prod.includes('</head>'))
 throw new Error('Falta el encabezado de HTML.');
mkdirSync('demo/src',{recursive:true});
const styles=[
 'v1211-notice-recurrence.css',
 'v1212-notice-series-cancel.css',
 'v1310-admin-paleta-unificada.css'
];
for(const name of styles){
 const source='src/'+name;
 const target='demo/src/'+name;
 const prodLine=prod.split(/\r?\n/).find(line=>
  line.includes('<link')&&line.includes('rel="stylesheet"')&&
  line.includes('href="./src/'+name+'?v='));
 const href=prodLine?.match(/href="([^"]+)"/)?.[1];
 if(!href||!href.startsWith('./src/'+name+'?v='))
  throw new Error('No se encuentra la versión oficial de '+name+' en index.html');
 copyFileSync(source,target);
 // Elimina únicamente los enlaces antiguos de este estilo. Al reconstruir
 // con Vite, la demo conserva una sola versión, idéntica a producción.
 demo=demo.split('\n').filter(line=>!(
  line.includes('<link')&&line.includes('rel="stylesheet"')&&
  line.includes('/src/'+name+'?')
 )).join('\n');
 demo=demo.replace('</head>','  <link rel="stylesheet" href="'+href+'" />\n</head>');
 if(readFileSync(source,'utf8')!==readFileSync(target,'utf8'))
  throw new Error('CSS fuera de sincronía: '+name);
}
writeFileSync(demoFile,demo);
console.log('Demo: colores y versiones de CSS idénticos a la producción.');
