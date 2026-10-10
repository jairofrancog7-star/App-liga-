/* Revisión programada SOLO de lectura: no cambia resultados, fichas ni avisos.
 * Publica resumen sin nombres personales y requiere aprobación humana para corregir.
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const ROOT=new URL('../../',import.meta.url);
const read=(path)=>JSON.parse(readFileSync(new URL(path,ROOT),'utf8'));
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const CATS=['1','2','3','4','5'];
function approved(notice){
 const a=notice?.approval;
 return !!(a&&a.status==='approved'&&typeof a.by==='string'&&a.by.trim().length>0&&
 typeof a.at==='string'&&Number.isFinite(Date.parse(a.at)));
}
export function audit(files,now=new Date()){
 const warnings=[],review=[],checks=[];
 const raw=files.official,publicCopy=files.publicOfficial;
 if(!raw||!publicCopy||typeof raw!=='object'){
  warnings.push('No se pudieron leer ambas copias de los datos oficiales.');
 }else{
  const cats=raw.categories||{};
  const missing=CATS.filter(k=>!cats[k]||!publicCopy.categories?.[k]);
  if(missing.length)warnings.push('Categorías oficiales incompletas: '+missing.join(', ')+'.');
  else checks.push('Se encontraron las cinco categorías oficiales.');
  if(sha(raw)!==sha(publicCopy))warnings.push('Las copias local y pública de datos oficiales no son idénticas.');
  else checks.push('Ambas copias oficiales coinciden.');
 }
 const notices=Array.isArray(files.scheduled)?files.scheduled:[];
 if(!Array.isArray(files.scheduled))warnings.push('El listado de avisos programados no es válido.');
 const seen=new Set();let waiting=0,eligible=0;
 for(const item of notices){
  const id=String(item?.id||'');
  if(!/^[A-Za-z0-9_-]{1,90}$/.test(id)){warnings.push('Hay un identificador de aviso inválido.');continue}
  if(seen.has(id))warnings.push('Hay identificadores duplicados en avisos programados.');
  seen.add(id);
  const when=Date.parse(item.publish_at||item.publishAt||'');
  if(!Number.isFinite(when)){warnings.push('Hay una fecha de aviso programado inválida.');continue}
  if(item.published_at||item.app_published)continue;
  if(!approved(item))waiting++;
  else eligible++;
 }
 if(waiting)review.push(waiting+' aviso(s) pendientes de aprobación explícita. No deben publicarse.');
 checks.push(eligible+' aviso(s) elegibles con aprobación en el archivo de programación.');
 const differences=Array.isArray(files.adminfut?.cedulaScoreDifferences)?files.adminfut.cedulaScoreDifferences.length:0;
 if(differences)review.push(differences+' diferencias de marcador entre fichas públicas y cédulas para comprobación humana (no aplicar automáticamente).');
 return {generatedAt:now.toISOString(),status:warnings.length?'needs_attention':review.length?'review':'ok',
  warnings:[...new Set(warnings)],review,checks,
  counts:{categories:CATS.length,scheduledNotices:notices.length,unapprovedNotices:waiting,cedulaScoreDifferences:differences},
  safeguards:'Sin publicar, modificar datos oficiales ni enviar notificaciones.'};
}
function safe(path,fallback,errors){
 try{return read(path)}catch{errors.push('No se pudo leer '+path);return fallback}
}
export function markdown(data){
 const lines=['# Revisión automática de la Liga','',
  'Estado: **'+data.status+'** · Fecha UTC: '+data.generatedAt,'',
  '**No se publicaron cambios oficiales ni avisos.**','',
  '## Comprobaciones',...(data.checks.length?data.checks.map(x=>'- '+x):['- Sin comprobaciones completas.']),
  '','## Atención necesaria',...(data.warnings.length?data.warnings.map(x=>'- '+x):['- Sin errores críticos.']),
  '','## Para revisión administrativa',...(data.review.length?data.review.map(x=>'- '+x):['- Sin pendientes detectados.']),
  '','Las diferencias detectadas son indicios para cotejar con actas y fuentes oficiales; no son cambios confirmados.'];
 return lines.join('\n')+'\n';
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const errors=[];
 const files={
  official:safe('data/official-live.json',null,errors),
  publicOfficial:safe('public/data/official-live.json',null,errors),
  scheduled:safe('public/data/scheduled-notices.json',[],errors),
  adminfut:safe('data/adminfut-public-audit.json',{},errors)
 };
 const report=audit(files);report.warnings.unshift(...errors);
 if(report.warnings.length)report.status='needs_attention';
 const jsonPath=process.argv[2]||'/tmp/liga-official-review.json';
 const mdPath=process.argv[3]||'/tmp/liga-official-review.md';
 for(const p of [jsonPath,mdPath])mkdirSync(dirname(p),{recursive:true});
 writeFileSync(jsonPath,JSON.stringify(report,null,2)+'\n');
 writeFileSync(mdPath,markdown(report));
 process.stdout.write('Revisión '+report.status+': '+report.warnings.length+' alertas, '+report.review.length+' pendientes.\n');
}
