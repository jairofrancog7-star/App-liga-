/* Normalización de comunicados públicos y selección de destinatarios.
   Jamás se genera una notificación a partir de un borrador. */
import { createHash } from 'node:crypto';

const text=(v,max=240)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,max);
const norm=v=>text(v,120).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const CATEGORIES=new Set(['all','1','2','3','4','5']);
export const TYPES=new Set(['jornada','horario','cancha','suspension','resultados','junta','registro','clima','general','partido']);
export const pushEndpointValid=value=>{
 try{
  const u=new URL(value);
  if(u.protocol!=='https:'||u.username||u.password||u.port)return false;
  const host=u.hostname.toLowerCase();
  return host==='fcm.googleapis.com'||host==='fcm-xm.googleapis.com'||
   host==='updates.push.services.mozilla.com'||host.endsWith('.push.services.mozilla.com')||
   host==='web.push.apple.com'||host.endsWith('.push.apple.com')||
   host==='wns2-par02p.notify.windows.com'||host.endsWith('.notify.windows.com');
 }catch{return false;}
};
export function normalizePreferences(raw={}){
 const category=CATEGORIES.has(String(raw.category||'all'))?String(raw.category||'all'):'all';
 const team=text(raw.team,90);
 const field=text(raw.field,90);
 const types=Array.isArray(raw.types)?raw.types.filter(t=>TYPES.has(t)).slice(0,10):[];
 return {category,team,field,types};
}
export function officialItem(raw){
 if(!raw||raw.published!==true)return null;
 const kind=text(raw.kind,30).toLowerCase(),p=raw.payload;
 if(!p||typeof p!=='object'||Array.isArray(p)||!raw.id)return null;
 if(kind!=='news'&&kind!=='notification'&&kind!=='fixture')return null;
 // Un evento programado no debe notificarse antes de su publicación.
 const time=p.publishAt||p.scheduledAt;
 if(time&&Number.isFinite(Date.parse(time))&&Date.parse(time)>Date.now())return null;
 const type=kind==='fixture'?'partido':TYPES.has(norm(p.type))?norm(p.type):'general';
 const title=text(p.title||p.name||(kind==='fixture'?'Actualización de partido':'Aviso de la Liga'),115);
 const body=text(p.body||p.message||p.details||(
  kind==='fixture'?'Se actualizó la programación oficial. Consulta la jornada.':'Consulta el comunicado oficial.'),240);
 const category=CATEGORIES.has(String(p.category))?String(p.category):'all';
 const team=text(p.team||[p.home,p.away].filter(Boolean).join(' / ')||'',90);
 const field=text(p.field||p.venue||'',90);
 const route=kind==='fixture'?'competition':'news';
 const id=String(raw.id).slice(0,160);
 const relevant=kind!=='fixture'||['status','date','time','field','venue','home','away','category','round','jornada'].some(k=>p[k]!=null);
 if(!relevant)return null;
 const signature=kind==='fixture'?
  Object.fromEntries(['status','date','time','field','venue','home','away','category','round','jornada'].map(k=>[k,p[k]??null])):
  {title,body,type,category,team,field};
 const digest=createHash('sha256').update(JSON.stringify(signature)).digest('hex').slice(0,24);
 return {id:kind+':'+id,kind,type,title,body,category,team,field,route,digest};
}
export function matches(sub,item){
 const p=sub.preferences||{},c=String(p.category||'all');
 if(c!=='all'&&item.category!=='all'&&c!==item.category)return false;
 if(p.types?.length&&!p.types.includes(item.type))return false;
 // A team/field filter only suppresses if an official announcement names that target.
 if(p.team&&item.team&&!item.team.split(/\s*\/\s*/).some(team=>norm(team)===norm(p.team)))return false;
 if(p.field&&item.field&&!norm(item.field).includes(norm(p.field)))return false;
 return true;
}
export function extractPublicRecords(value){
 const list=Array.isArray(value?.items)?value.items:Array.isArray(value)?value:[];
 if(list.length>50000)throw Error('Feed demasiado grande');
 return list.map(officialItem).filter(Boolean);
}