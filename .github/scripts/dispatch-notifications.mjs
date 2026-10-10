/* Ejecuta la cola protegida SOLO si el servidor y el secreto existen.
 * No almacena números ni secretos en GitHub Pages; evita enviar sin consentimiento.
 * GitHub Actions puede atrasarse: la cola debe conservar el estado en PostgreSQL.
 */
import {pathToFileURL} from 'node:url';

export function validTarget(raw) {
  if (!raw || typeof raw!=='string') return null;
  try {
    const u=new URL(raw.trim());
    if (u.protocol!=='https:' || u.username || u.password || u.search || u.hash ||
        u.port && u.port!=='443' || !u.hostname.includes('.') ||
        u.hostname==='github.io' || u.hostname.endsWith('.github.io') ||
        u.hostname==='localhost' || u.hostname.endsWith('.local')) return null;
    const path=u.pathname.replace(/\\/g,'/').replace(/\/+$/,'');
    if (path && path!=='') return null; // El backend publica /jobs/dispatch en la raíz.
    return u.origin;
  } catch {return null}
}

export async function dispatch(env, fetcher=fetch, log=console.log) {
  if(!env.NOTIFICATIONS_API_URL || !env.NOTIFICATIONS_JOB_TOKEN) {
    log('Avisos externos en espera: faltan NOTIFICATIONS_API_URL y/o NOTIFICATIONS_JOB_TOKEN en GitHub Secrets.');
    return {skipped:true,reason:'not_configured'};
  }
  const url=validTarget(env.NOTIFICATIONS_API_URL);
  if(!url) throw Error('NOTIFICATIONS_API_URL debe ser un origen HTTPS público sin rutas ni credenciales.');
  if(env.NOTIFICATIONS_JOB_TOKEN.trim().length<32) throw Error('NOTIFICATIONS_JOB_TOKEN es demasiado corto.');
  // No ejecutar colas en servidores desactualizados que aún no exigen
  // aprobación explícita por Presidencia (fallar cerrado).
  const health=await fetcher(url+'/health/ready',{
    method:'GET',
    headers:{Accept:'application/json'},
    signal:AbortSignal.timeout(20000),
    redirect:'error'
  });
  if(!health.ok)throw Error('No se pudo comprobar la seguridad de aprobación del servidor: HTTP '+health.status);
  const capability=await health.json();
  if(capability?.ready!==true||capability?.approvalRequired!==true)
    throw Error('El servidor todavía no garantiza aprobación administrativa; envío bloqueado hasta actualizarlo.');
  const res=await fetcher(url+'/jobs/dispatch',{
    method:'POST',
    headers:{'X-Job-Token':env.NOTIFICATIONS_JOB_TOKEN,'Accept':'application/json'},
    signal:AbortSignal.timeout(90000),
    redirect:'error'
  });
  if(!res.ok) throw Error('El servidor respondió HTTP '+res.status+'; revisar logs privados del backend.');
  const data=await res.json();
  if(data?.ok!==true) throw Error('El servidor no confirmó el procesamiento.');
  log('Procesamiento completado. Avisos: '+Number(data.notices||0)+'; intentos: '+Number(data.attempted||0)+'.');
  return {skipped:false,notices:Number(data.notices||0)};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {await dispatch(process.env)} catch(err) {
    console.error('Error del programador: '+String(err.message||err));
    process.exitCode=1;
  }
}
