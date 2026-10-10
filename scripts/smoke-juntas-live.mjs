// Smoke test seguro: no utiliza credenciales ni lee/escribe datos de juntas.
import assert from 'node:assert/strict';

const base='https://liga-avisos-api-production.up.railway.app';
const origin='https://jairofrancog7-star.github.io';

async function get(path,options={}){
 const timeout=AbortSignal.timeout(12000);
 const response=await fetch(base+path,{
  cache:'no-store',redirect:'error',signal:timeout,
  ...options,
  headers:{Accept:'application/json',Origin:origin,...options.headers}
 });
 return response;
}
const health=await get('/health/ready');
assert.equal(health.status,200,'La API no está lista');
const readiness=await health.json();
assert.equal(readiness.ready,true,'La API no informó ready');
assert.equal(readiness.database,'connected','PostgreSQL no informó conexión');
console.log('PASS: /health/ready confirma API y PostgreSQL');

const options=await get('/admin/meetings',{method:'OPTIONS',headers:{'Access-Control-Request-Method':'GET','Access-Control-Request-Headers':'Authorization'}});
assert.equal(options.status,204,'Preflight CORS rechazado');
assert.equal(options.headers.get('access-control-allow-origin'),origin,'Origen del sitio azul no autorizado');
assert.match(options.headers.get('access-control-allow-headers')||'',/Authorization/);
console.log('PASS: preflight CORS autoriza GitHub Pages sin exponer secretos');

for(const path of ['/admin/meetings','/admin/meetings/2026-10-13','/admin/me']){
 const res=await get(path);
 assert.equal(res.status,401,'Acceso anónimo no fue bloqueado: '+path);
 console.log('PASS: acceso anónimo bloqueado '+path);
}
console.log('SMOKE LIVE: API operativa; rutas de juntas cerradas sin autenticación.');
