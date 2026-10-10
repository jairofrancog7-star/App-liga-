/* V1132 · Centro de Jornada interactivo. Datos oficiales de solo lectura. */
(()=>{
'use strict';
if(window.__LJR_MATCHDAY_PRO_1132__)return;
window.__LJR_MATCHDAY_PRO_1132__=true;
// V1167: demo pages are rebuilt automatically; load scoped layout styles
// if the demo generator did not retain their <link> tags.
(function ensureMatchdayStyles(){
 if(!document.head?.appendChild||!document.createElement)return;
 for(const file of ['v1153-matchday-fullwidth-safe-crests.css','v1167-matchday-centered-official-crests.css']){
  if(document.querySelector('link[href*="'+file+'"]'))continue;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='./src/'+file+'?v=20261010-v1180';
  link.dataset.md1167Style='';
  document.head.appendChild(link);
 }
})();
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const TZ='America/Mexico_City';
let all=[],category='all',current='',host=null,signature='';
const icons={
bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
map:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
cloud:'<path d="M8 18h11a4 4 0 0 0 0-8 6 6 0 0 0-11-2 5 5 0 0 0 0 10Z"/>',
news:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>'
};
function icon(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';}
function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'';}
function go(name){if(window.LJR_MAIN_ROUTE?.go)window.LJR_MAIN_ROUTE.go(name);else location.hash='#/'+name;}
function stamp(raw){
const m=/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(String(raw||''));
if(!m)return NaN;
const [day,month,year,hour,min]=m.slice(1).map(Number);
const test=new Date(Date.UTC(year,month-1,day));
if(test.getUTCFullYear()!==year||test.getUTCMonth()!==month-1||test.getUTCDate()!==day||hour>23||min>59)return NaN;
const wall=Date.UTC(year,month-1,day,hour,min);
const format=new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
let value=wall;
for(let i=0;i<3;i++){const p=Object.fromEntries(format.formatToParts(value).map(x=>[x.type,x.value]));value+=wall-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);}
return value;
}
function readGames(){
const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
const items=[],seen=new Set();
for(const [catId,cat] of Object.entries(db.categories||{})){
for(const group of cat.fixtures||[])for(const r of group.rows||[]){
const home=String(r?.[2]||'').trim(),away=String(r?.[6]||'').trim(),time=stamp(r?.[8]);
if(!home||!away||!Number.isFinite(time))continue;
const id=[catId,r?.[8],norm(home),norm(away)].join('|');
if(seen.has(id))continue;seen.add(id);
items.push({id,catId,category:String(cat.name||'Categoría'),round:String(r?.[1]||''),home,away,venue:String(r?.[7]||''),date:String(r?.[8]||''),time,status:String(r?.[10]||''),homeScore:String(r?.[3]??'').trim(),awayScore:String(r?.[5]??'').trim()});
}}
return items.sort((a,b)=>a.time-b.time||a.id.localeCompare(b.id));
}
// V1193: Jornada utiliza primero los mismos archivos del directorio visible
// de Equipos (V27), con categoría, antes de consultar los catálogos antiguos.
function logo(name,category){
 let src='';
 try{src=window.LJR_TEAMS_CURRENT_LOGO?.get?.(name,category)||'';}catch(_){}
 if(!src)try{src=window.LJR_SEASON_LOGOS?.get?.(name)||'';}catch(_){}
 if(!src)try{src=window.LJR_TEAM_LOGOS?.get?.(name)||'';}catch(_){}
 if(!src)try{src=window.LJR_OFFICIAL_API?.getLogo?.(name)||'';}catch(_){}
 if(!src)try{src=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||'';}catch(_){}
 src=String(src||'').trim();
 return /^(https?:\/\/|data:image\/|\.?\.?\/|assets\/)/i.test(src)?src:'';
}
// No recortar colores ni quitar fondos por canvas/filtros: el escudo
// transparente viene directamente de Equipos. Un archivo roto muestra siglas.
function prepareMatchdayCrests(root){
 root.querySelectorAll('.md1132-crest img').forEach(img=>{
  const broken=()=>{if(img.isConnected)img.remove();};
  img.addEventListener('error',broken,{once:true});
  if(img.complete&&!img.naturalWidth)broken();
 });
}

function crest(name,category){
 const initials=String(name).split(/\s+/).filter(Boolean).slice(0,2).map(v=>v[0]).join('').toUpperCase();
 const src=logo(name,category);
 // Missing image -> initials only; never fall back to an outdated crest.
 return '<span class="md1132-crest" data-md1132-team="'+esc(name)+'"><span class="md1132-crest-fallback">'+esc(initials||'EQ')+'</span>'+
  (src?'<img src="'+esc(src)+'" alt="Escudo de '+esc(name)+'" loading="lazy" decoding="async">':'')+'</span>';
}
function status(g){
if(!g)return {name:'Sin partidos',type:'pending'};
const state=norm(g.status),scored=/^\d+$/.test(g.homeScore)&&/^\d+$/.test(g.awayScore),passed=Date.now()>=g.time;
if(/suspend|cancel|aplaz|pospuest/.test(state))return {name:'Suspendido / aplazado',type:'pending'};
if(/en vivo|jugando|primer tiempo|segundo tiempo/.test(state))return {name:'En vivo · oficial',type:'live'};
if(scored&&passed)return {name:g.homeScore+' - '+g.awayScore+' · publicado',type:'final'};
if(!passed)return {name:'Próximo',type:'next'};
return {name:'Horario iniciado · sin confirmar',type:'pending'};
}
function match(){return all.find(g=>g.id===current)||null;}
function deepLink(g){return location.origin+location.pathname+location.search+'#/matchday?game='+encodeURIComponent(g.id);}
function pickLink(){try{return new URLSearchParams(location.hash.split('?').slice(1).join('?')).get('game')||'';}catch(_){return '';}}
function card(g){
if(!g)return '<div class="md1132-empty">Aún no hay partidos oficiales con fecha y hora disponibles.</div>';
const state=status(g);
return '<div class="md1132-cardtop"><span class="md1132-caption">PARTIDO DE LA JORNADA</span><span class="md1132-status '+state.type+'">'+esc(state.name)+'</span></div>'+
'<div class="md1132-versus"><button type="button" class="md1132-team" data-md-team="'+esc(g.home)+'" aria-label="Ver equipo '+esc(g.home)+'">'+crest(g.home,g.category)+'<b>'+esc(g.home)+'</b></button><div class="md1132-mid"><strong>VS</strong><small>'+esc(g.category)+'</small></div><button type="button" class="md1132-team" data-md-team="'+esc(g.away)+'" aria-label="Ver equipo '+esc(g.away)+'">'+crest(g.away,g.category)+'<b>'+esc(g.away)+'</b></button></div>'+
'<div class="md1132-clock" data-md-clock aria-live="off">--:--:--</div>'+
'<p class="md1132-meta">'+esc([g.round?'Jornada '+g.round:'',g.venue||'Campo por confirmar',g.date].filter(Boolean).join(' · '))+'</p>'+
'<div class="md1132-actions">'+
[['bell','Avisos','alerts'],['calendar','Agenda','calendar'],['map','Campo','map'],['share','Compartir','share']].map(x=>'<button type="button" data-md-action="'+x[2]+'">'+icon(x[0])+'<span>'+x[1]+'</span></button>').join('')+
'</div><div class="md1132-alerts" data-md-alerts hidden><p>Guarda un recordatorio en el calendario del teléfono o configura avisos de jornada. Los avisos automáticos requieren un servidor activo.</p><div><button type="button" data-md-action="ics">Descargar recordatorio</button><button type="button" data-md-action="agenda">Configurar avisos</button></div></div>'+
'<div class="md1132-more"><button type="button" data-md-action="weather">'+icon('cloud')+'Clima</button><button type="button" data-md-action="venues">'+icon('map')+'Sedes</button><button type="button" data-md-action="post">'+icon('news')+'Publicaciones</button></div>';
}
function render(){
if(!host||!host.isConnected)return;
const g=match(),hero=$('.v160-matchday-hero',host),bar=$('.v160-matchday-bar',host);
if(!hero||!bar)return;
let shell=$('[data-md1132-hero]',hero);if(!shell){shell=document.createElement('div');shell.dataset.md1132Hero='';hero.prepend(shell);}
shell.innerHTML=card(g);
const categories=[...new Map(all.map(x=>[x.catId,x.category])).entries()];
let filter=$('[data-md1132-filters]',bar);
if(!filter){filter=document.createElement('div');filter.dataset.md1132Filters='';bar.querySelector('h3')?.after(filter);}
filter.innerHTML='<div class="md1132-chips" role="group" aria-label="Categorías">'+[['all','Todas'],...categories].map(([id,label])=>'<button type="button" data-md-filter="'+esc(id)+'" aria-pressed="'+String(category===id)+'">'+esc(label)+'</button>').join('')+'</div>';
let list=$('[data-md1132-list]',bar);
if(!list){list=document.createElement('div');list.dataset.md1132List='';bar.querySelector('button[data-v100-route]')?.before(list);if(!list.parentElement)bar.append(list);}
const shown=all.filter(x=>category==='all'||x.catId===category);
const future=shown.filter(x=>x.time>Date.now()-150*60000);
const rows=(future.length?future:shown.slice(-8)).slice(0,12);
list.innerHTML=rows.length?rows.map(x=>'<button type="button" class="md1132-game '+(x.id===current?'selected':'')+'" data-md-select="'+esc(x.id)+'" aria-pressed="'+String(x.id===current)+'"><span class="md1132-game-main">'+crest(x.home,x.category)+'<span class="md1132-game-copy"><b>'+esc(x.home)+' vs '+esc(x.away)+'</b><small>'+esc(x.date+' · '+(x.venue||'Campo pendiente'))+'</small><em class="'+status(x).type+'">'+esc(status(x).name)+'</em></span>'+crest(x.away,x.category)+'</span></button>').join(''):'<p class="md1132-empty">Sin encuentros oficiales para esta categoría.</p>';
host.classList.add('md1132-ready');
prepareMatchdayCrests(host);
tick();
}
function tick(){
if(route()!=='matchday'||!host?.isConnected)return;
const clock=$('[data-md-clock]',host),g=match();if(!clock||!g)return;
const remaining=g.time-Date.now();
if(remaining>0){const sec=Math.floor(remaining/1000),days=Math.floor(sec/86400),hours=Math.floor((sec%86400)/3600),mins=Math.floor(sec%3600/60),seconds=sec%60;clock.textContent=(days?days+' d · ':'')+[hours,mins,seconds].map(n=>String(n).padStart(2,'0')).join(':');}
else clock.textContent=status(g).type==='final'?'MARCADOR PUBLICADO':'HORARIO PROGRAMADO';
}
function toast(value){let el=$('[data-md1132-toast]');if(!el){el=document.createElement('div');el.dataset.md1132Toast='';document.body.append(el);}el.textContent=value;el.hidden=false;clearTimeout(el._t);el._t=setTimeout(()=>el.hidden=true,3600);}
function ics(g){
const dt=v=>new Date(v).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const clean=v=>String(v||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const lines=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//Liga Juventino Rosas//Centro de Jornada//ES','BEGIN:VEVENT','UID:'+encodeURIComponent(g.id)+'@juventinorosasliga.com','DTSTAMP:'+dt(Date.now()),'DTSTART:'+dt(g.time),'DTEND:'+dt(g.time+7200000),'SUMMARY:'+clean(g.home+' vs '+g.away),'LOCATION:'+clean(g.venue),'DESCRIPTION:'+clean('Jornada '+g.round+' · '+g.category+' · Consulta el rol oficial antes de acudir.'),'BEGIN:VALARM','TRIGGER:-PT2H','ACTION:DISPLAY','DESCRIPTION:Recordatorio de partido','END:VALARM','END:VEVENT','END:VCALENDAR',''];
const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Liga_Juventino_Partido.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Recordatorio descargado. Importa el archivo en tu calendario.');
}
function calendar(g){
const dt=v=>new Date(v).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const qs=new URLSearchParams({action:'TEMPLATE',text:g.home+' vs '+g.away,dates:dt(g.time)+'/'+dt(g.time+7200000),ctz:TZ,stz:TZ,etz:TZ,details:g.category+' · Jornada '+g.round+' · Confirma con el rol oficial.',location:g.venue||''});
window.open('https://calendar.google.com/calendar/render?'+qs.toString(),'_blank','noopener,noreferrer');
toast('Revisa el partido y pulsa Guardar en Google Calendar.');
}
async function share(g){
const text='⚽ '+g.home+' vs '+g.away+'\n'+g.category+' · Jornada '+g.round+'\n📅 '+g.date+'\n📍 '+(g.venue||'Campo por confirmar'),url=deepLink(g);
try{if(navigator.share){await navigator.share({title:'Liga Juventino Rosas · Partido',text,url});return;}if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text+'\n'+url);toast('Partido copiado para compartir.');return;}window.open('https://wa.me/?text='+encodeURIComponent(text+'\n'+url),'_blank','noopener,noreferrer');}
catch(e){if(e?.name!=='AbortError')toast('No fue posible compartir desde este navegador.');}
}
function v1171MatchdayMaps(venue){
 const v=norm(venue);
 const exact=[
  ['san julian','https://maps.app.goo.gl/5yfZH7nGMtw2Cqqf7'],
  ['fraccionamiento','https://maps.app.goo.gl/Y1ZGLTpGJ7XmGCKT7'],
  ['comontuoso','https://maps.app.goo.gl/Y1ZGLTpGJ7XmGCKT7'],
  ['san juan de la cruz','https://maps.app.goo.gl/mcc7DpevkPW5mW4M9'],
  ['franco tavera','https://maps.app.goo.gl/yBhVkMrXzL3Npv3WA'],
  ['tavera','https://maps.app.goo.gl/yBhVkMrXzL3Npv3WA'],
  ['pozos','https://goo.gl/maps/BF9dnqf5SaBfu41PA']
 ];
 const match=exact.find(([key])=>v.includes(key));
 return match?.[1]||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((venue||'Campo')+', Juventino Rosas, Guanajuato');
}
function onClick(e){
if(route()!=='matchday'||!host?.contains(e.target))return;
const team=e.target.closest('[data-md-team]');if(team){const name=team.dataset.mdTeam;localStorage.setItem('v62-team-name',name);localStorage.setItem('v42-team-tab','summary');if(window.LJR_OFFICIAL_API?.openTeam)window.LJR_OFFICIAL_API.openTeam(name);else go('teamDetail');return;}
const filter=e.target.closest('[data-md-filter]');if(filter){category=filter.dataset.mdFilter;const a=all.filter(g=>category==='all'||g.catId===category);if(!a.some(g=>g.id===current))current=(a.find(g=>g.time>Date.now())||a[0])?.id||'';render();return;}
const select=e.target.closest('[data-md-select]');if(select){current=select.dataset.mdSelect;const g=match();if(g){history.replaceState(null,'',location.pathname+location.search+'#/matchday?game='+encodeURIComponent(g.id));}render();return;}
const action=e.target.closest('[data-md-action]');if(!action)return;
const g=match();if(!g)return;
switch(action.dataset.mdAction){
case 'alerts':{const panel=$('[data-md-alerts]',host);if(panel)panel.hidden=!panel.hidden;break;}
case 'calendar':calendar(g);break;
case 'ics':ics(g);break;
case 'agenda':go('agendaBuilder');break;
case 'map':window.open(v1171MatchdayMaps(g.venue),'_blank','noopener,noreferrer');break;
case 'share':share(g);break;
case 'weather':go('weatherFields');break;
case 'venues':go('venues');break;
case 'post':go('publications');break;
}
}
function activate(force=false){
if(route()!=='matchday')return;
const el=$('#v160-matchday-extra');
if(!el)return;
const next=readGames(),sig=next.map(x=>x.id+'|'+x.homeScore+'|'+x.awayScore+'|'+x.status).join(';');
if(host===el&&el.dataset.md1132==='1'&&!force&&sig===signature)return;
host=el;host.dataset.md1132='1';all=next;signature=sig;
const query=pickLink();if(query&&all.some(x=>x.id===query))current=query;
if(!all.some(x=>x.id===current))current=(all.find(g=>g.time>Date.now())||all[all.length-1])?.id||'';
if(category!=='all'&&!all.some(x=>x.catId===category))category='all';
render();
}
document.addEventListener('click',onClick);
window.addEventListener('hashchange',()=>setTimeout(()=>activate(true),100));
window.addEventListener('ljr:official-data',()=>activate(true));
function start(){
const screen=$('#screen');
if(screen)new MutationObserver(()=>activate()).observe(screen,{childList:true,subtree:true});
activate();setTimeout(()=>activate(true),400);setTimeout(()=>activate(true),1300);setTimeout(()=>activate(true),3000);
setInterval(tick,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();