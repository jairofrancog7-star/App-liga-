/* Desktop ↔ mobile functionality bridge.
   Reuses official league data and shared preferences, while keeping a dedicated PC/browser UI.
   IMPORTANT: never runs in ?mode=mobile or ?mode=apk. */
(function(){
'use strict';
if(window.__LJR_DESKTOP_MOBILE_FUNCTION_BRIDGE__)return;
window.__LJR_DESKTOP_MOBILE_FUNCTION_BRIDGE__=true;

const MIN=1024;
const qs=()=>new URLSearchParams(location.search);
const isDesktop=()=>!['mobile','apk'].includes(qs().get('mode'))&&(qs().get('mode')==='desktop'||document.body.classList.contains('lj-desktop')||document.documentElement.classList.contains('preview-desktop')||innerWidth>=MIN);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const go=r=>{location.hash='#/'+r};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=v=>String(v||'').trim().toLowerCase().replace(/(^|\s|[-.])([a-záéíóúñ])/g,(_,a,b)=>a+b.toUpperCase());
const pad=n=>String(n).padStart(2,'0');
const CAT_ORDER=['3','5','4','2','1'];
const CAT_LABEL={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const ALIASES={
  'v4-calendar':'pc-calendar',
  'calendar':'pc-calendar',
  'safe-notifications':'pc-notifications',
  'notifications':'pc-notifications',
  'scorers':'pc-scorers',
  'standings':'pc-standings',
  'competition':'pc-fixtures'
};
const OWN=new Set(['pc-calendar','pc-notifications','pc-scorers','pc-standings','pc-fixtures']);
let db=null,loading=null,monthShift=0,calendarCat='3',selectedDate='';
const CAT_STORAGE_KEY='ljpc-selected-category';
function savedCat(){
  try{const value=sessionStorage.getItem(CAT_STORAGE_KEY);return CAT_ORDER.includes(value)?value:'3'}catch(_){return '3'}
}
let activeCat=savedCat();calendarCat=activeCat;
function rememberCat(id){
  if(!CAT_ORDER.includes(String(id)))return activeCat;
  activeCat=String(id);calendarCat=activeCat;
  try{sessionStorage.setItem(CAT_STORAGE_KEY,activeCat)}catch(_){}
  return activeCat;
}

function injectStyle(){
  if(document.getElementById('ljpc-function-style'))return;
  const s=document.createElement('style');
  s.id='ljpc-function-style';
  s.textContent=`
  .ljpc-function-root{display:grid;gap:18px}
  .ljpc-toolbar{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
  .ljpc-toolbar-group{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .ljpc-btn,.ljpc-select,.ljpc-chip{border:1px solid rgba(0,85,165,.2);background:#fff;color:#0a235c;border-radius:10px;min-height:38px;padding:0 13px;font:700 12px/1 system-ui;cursor:pointer}
  .ljpc-btn:hover,.ljpc-chip:hover{border-color:#1c69d4;box-shadow:0 6px 18px rgba(13,71,161,.12)}
  .ljpc-btn.primary{background:#0055a5;color:#fff;border-color:#0055a5}
  .ljpc-grid{display:grid;grid-template-columns:repeat(7,minmax(92px,1fr));gap:7px}
  .ljpc-week{font:800 10px/1 system-ui;color:#738099;text-align:center;padding:8px 0}
  .ljpc-day{min-height:92px;border:1px solid #dde5ef;background:#fff;border-radius:10px;padding:9px;text-align:left;cursor:pointer;position:relative}
  .ljpc-day:hover{border-color:#1c69d4}.ljpc-day.empty{visibility:hidden}.ljpc-day.active{outline:2px solid #1c69d4}
  .ljpc-day b{font:800 13px/1 system-ui;color:#17243b}.ljpc-day i{position:absolute;right:8px;bottom:8px;background:#0055a5;color:#fff;border-radius:999px;min-width:21px;height:21px;display:grid;place-items:center;font:800 10px/1 system-ui;font-style:normal}
  .ljpc-panel{background:#fff;border:1px solid #e0e7ef;border-radius:14px;padding:16px;box-shadow:0 10px 30px rgba(16,39,70,.06)}
  .ljpc-panel h2,.ljpc-panel h3{margin:0 0 12px;color:#0a235c}.ljpc-muted{color:#748097;font-size:12px}
  .ljpc-match{display:grid;grid-template-columns:minmax(150px,1fr) 110px minmax(150px,1fr) 180px;gap:14px;align-items:center;padding:13px 0;border-top:1px solid #edf1f5}
  .ljpc-match:first-of-type{border-top:0}.ljpc-team{display:flex;align-items:center;gap:9px;font-weight:800;color:#16243a}
  .ljpc-logo{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;overflow:hidden;background:#f1f5fa;border:1px solid #dce5ef;flex:0 0 auto}.ljpc-logo img{width:100%;height:100%;object-fit:contain}
  .ljpc-score{text-align:center}.ljpc-score b{display:block;color:#0a235c;font-size:16px}.ljpc-score small{display:block;color:#7b879b;margin-top:3px}
  .ljpc-actions{display:flex;justify-content:flex-end;gap:7px;flex-wrap:wrap}
  .ljpc-notify-grid{display:grid;grid-template-columns:repeat(2,minmax(260px,1fr));gap:12px}
  .ljpc-toggle{display:flex;justify-content:space-between;gap:16px;align-items:center;background:#fff;border:1px solid #e0e7ef;border-radius:12px;padding:14px}
  .ljpc-toggle b{display:block;color:#14233b;font-size:13px}.ljpc-toggle small{display:block;color:#7d8797;margin-top:4px}
  .ljpc-switch{appearance:none;width:44px;height:24px;border-radius:999px;background:#c9d2de;position:relative;cursor:pointer;transition:.2s;flex:0 0 auto}.ljpc-switch:before{content:"";position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;left:3px;top:3px;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}.ljpc-switch:checked{background:#0055a5}.ljpc-switch:checked:before{transform:translateX(20px)}
  .ljpc-cat-tabs{display:flex;gap:7px;flex-wrap:wrap}.ljpc-chip.active{background:#0055a5;color:#fff;border-color:#0055a5}
  .ljpc-table{width:100%;border-collapse:collapse;background:#fff}.ljpc-table th{font:800 10px/1 system-ui;color:#65738a;text-transform:uppercase;text-align:left;padding:11px;border-bottom:1px solid #dfe6ef}.ljpc-table td{padding:11px;border-bottom:1px solid #edf1f5;color:#16243a;font-size:12px}.ljpc-table tr:hover td{background:#f8fbff}.ljpc-rank{font-weight:900;color:#0055a5}
  .ljpc-home-tools{margin:18px 0 0;background:#071b3d;border:1px solid rgba(71,164,255,.25);border-radius:14px;padding:16px}.ljpc-home-tools h2{color:#fff;margin:0 0 5px}.ljpc-home-tools p{color:#a9bdd8;margin:0 0 13px;font-size:12px}.ljpc-home-tools .ljpc-btn{background:#0d2e5e;color:#fff;border-color:#214b7e}
  @media(max-width:1180px){.ljpc-grid{grid-template-columns:repeat(7,minmax(70px,1fr))}.ljpc-match{grid-template-columns:1fr 90px 1fr}.ljpc-actions{grid-column:1/-1;justify-content:flex-start}}
  `;
  document.head.appendChild(s);
}

function logoUrl(name){
  try{const x=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name);if(x)return x}catch(_){}
  const logos=db?.team_logos||{};
  const k=Object.keys(logos).find(x=>String(x).trim().toUpperCase()===String(name||'').trim().toUpperCase());
  const v=k?logos[k]:null;
  return typeof v==='string'?v:(v?.local||v?.source||v?.url||'');
}
function crest(name){
  const u=logoUrl(name);
  return '<span class="ljpc-logo">'+(u?'<img src="'+esc(u)+'" alt="'+esc(pretty(name))+'">':esc(String(name||'?').trim().slice(0,2).toUpperCase()))+'</span>';
}
async function loadDb(){
  try{const x=window.LJR_OFFICIAL_API?.getData?.()||window.V66_OFFICIAL_DIRECTORY?.data?.()||window.LJR_OFFICIAL_DATA;if(x?.categories){db=x;return db}}catch(_){}
  if(db?.categories)return db;
  if(loading)return loading;
  loading=(async()=>{
    const urls=['./data/official-live.json?v=20261006-pc-functions','https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261006-pc-functions'];
    for(const url of urls){try{const r=await fetch(url,{cache:'no-store'});if(r.ok){db=await r.json();break}}catch(_){}}
    return db||{categories:{}};
  })();
  return loading.finally(()=>{loading=null});
}
function parseDate(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return null;
  return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
}
function categoryName(id){return db?.categories?.[String(id)]?.name||CAT_LABEL[String(id)]||('Categoría '+id)}
function fixtures(catId=calendarCat){
  const cat=db?.categories?.[String(catId)]||{};
  const out=[];
  for(const group of (cat.fixtures||[]))for(const r of (group.rows||[])){
    if(!Array.isArray(r)||!r[2]||!r[6])continue;
    const d=parseDate(r[8]);if(!d)continue;
    const hs=String(r[3]??'').trim(),as=String(r[5]??'').trim(),played=/^\d+$/.test(hs)&&/^\d+$/.test(as);
    out.push({id:String(r[0]||''),round:String(r[1]||''),home:String(r[2]||'').trim(),away:String(r[6]||'').trim(),homeScore:hs,awayScore:as,played,venue:String(r[7]||'').trim(),rawDate:String(r[8]||''),date:d,cat:String(catId)});
  }
  return out.sort((a,b)=>a.date-b.date);
}
function ensureOwnHost(title,desc){
  const screen=document.querySelector('#screen');if(!screen)return null;
  let page=screen.querySelector('.ds-page');
  if(!page)return null;
  let wrap=page.querySelector('.ds-content > .ds-wrap');
  if(!wrap){
    const main=document.createElement('main');main.className='ds-content';
    wrap=document.createElement('div');wrap.className='ds-wrap';
    main.appendChild(wrap);
    const sponsors=page.querySelector('.ds-sponsors,.ds-footer');page.insertBefore(main,sponsors||null);
  }
  const head=page.querySelector('.ds-pagehead');
  if(head){const h=head.querySelector('h1');const p=head.querySelector('p');if(h)h.textContent=title;if(p)p.textContent=desc}
  return wrap;
}
function formatDate(d){return new Intl.DateTimeFormat('es-MX',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(d)}
function googleCalendarUrl(m){
  const start=new Date(m.date),end=new Date(start.getTime()+2*60*60*1000);
  const stamp=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+'00';
  const q=new URLSearchParams({action:'TEMPLATE',text:m.home+' vs '+m.away,dates:stamp(start)+'/'+stamp(end),details:'Liga Juventino Rosas · '+categoryName(m.cat)+' · Jornada '+m.round,location:m.venue||'Juventino Rosas, Guanajuato'});
  return 'https://calendar.google.com/calendar/render?'+q.toString();
}
async function shareMatch(m){
  const text=m.home+' vs '+m.away+' · '+formatDate(m.date)+' · '+(m.venue||'Sede por confirmar');
  try{if(navigator.share){await navigator.share({title:'Liga Juventino Rosas',text});return}}catch(_){}
  try{await navigator.clipboard.writeText(text);alert('Partido copiado para compartir.')}catch(_){alert(text)}
}

function renderCalendar(){
  const wrap=ensureOwnHost('Calendario','Programación oficial por categoría, fechas y sedes con funciones de escritorio.');
  if(!wrap)return;
  const now=new Date(),base=new Date(now.getFullYear(),now.getMonth()+monthShift,1),y=base.getFullYear(),m=base.getMonth();
  const list=fixtures(calendarCat);
  const first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),offset=(first.getDay()+6)%7;
  const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  if(!selectedDate||selectedDate.slice(0,7)!==(y+'-'+pad(m+1))){
    const hit=list.find(x=>x.date.getFullYear()===y&&x.date.getMonth()===m);
    selectedDate=hit?iso(hit.date):iso(new Date(y,m,1));
  }
  const cells=[];
  for(let i=0;i<offset;i++)cells.push('<div class="ljpc-day empty"></div>');
  for(let d=1;d<=days;d++){
    const date=new Date(y,m,d),key=iso(date),count=list.filter(x=>iso(x.date)===key).length;
    cells.push('<button class="ljpc-day '+(selectedDate===key?'active':'')+'" data-ljpc-date="'+key+'"><b>'+d+'</b>'+(count?'<i>'+count+'</i>':'')+'</button>');
  }
  const dayMatches=list.filter(x=>iso(x.date)===selectedDate);
  const matchHtml=dayMatches.length?dayMatches.map((x,i)=>'<div class="ljpc-match" data-ljpc-match="'+i+'"><div class="ljpc-team">'+crest(x.home)+'<span>'+esc(pretty(x.home))+'</span></div><div class="ljpc-score"><b>'+(x.played?esc(x.homeScore+' – '+x.awayScore):esc(x.rawDate.match(/\s(\d{1,2}:\d{2})/)?.[1]||'Por confirmar'))+'</b><small>J'+esc(x.round||'—')+'</small></div><div class="ljpc-team">'+crest(x.away)+'<span>'+esc(pretty(x.away))+'</span></div><div class="ljpc-actions"><button class="ljpc-btn" data-ljpc-cal="'+i+'">Google Calendar</button><button class="ljpc-btn" data-ljpc-share="'+i+'">Compartir</button></div></div>').join(''):'<p class="ljpc-muted">No hay partidos oficiales publicados para esta fecha.</p>';
  wrap.innerHTML='<div class="ljpc-function-root" data-ljpc-function-route="pc-calendar"><div class="ljpc-toolbar"><div class="ljpc-toolbar-group"><select class="ljpc-select" data-ljpc-cat>'+CAT_ORDER.map(id=>'<option value="'+id+'" '+(id===calendarCat?'selected':'')+'>'+esc(categoryName(id))+'</option>').join('')+'</select><button class="ljpc-btn" data-ljpc-prev>‹ Mes anterior</button><button class="ljpc-btn" data-ljpc-today>Hoy</button><button class="ljpc-btn" data-ljpc-next>Mes siguiente ›</button></div><button class="ljpc-btn primary" data-ljpc-back-more>Más herramientas</button></div><section class="ljpc-panel"><h2>'+esc(new Intl.DateTimeFormat('es-MX',{month:'long',year:'numeric'}).format(base))+'</h2><div class="ljpc-grid">'+['L','M','X','J','V','S','D'].map(x=>'<div class="ljpc-week">'+x+'</div>').join('')+cells.join('')+'</div></section><section class="ljpc-panel"><h3>Partidos · '+esc(selectedDate)+'</h3>'+matchHtml+'</section></div>';
  wrap.querySelector('[data-ljpc-cat]')?.addEventListener('change',e=>{rememberCat(e.target.value);selectedDate='';renderCalendar()});
  wrap.querySelector('[data-ljpc-prev]')?.addEventListener('click',()=>{monthShift--;selectedDate='';renderCalendar()});
  wrap.querySelector('[data-ljpc-next]')?.addEventListener('click',()=>{monthShift++;selectedDate='';renderCalendar()});
  wrap.querySelector('[data-ljpc-today]')?.addEventListener('click',()=>{monthShift=0;selectedDate='';renderCalendar()});
  wrap.querySelector('[data-ljpc-back-more]')?.addEventListener('click',()=>go('more'));
  wrap.querySelectorAll('[data-ljpc-date]').forEach(b=>b.addEventListener('click',()=>{selectedDate=b.dataset.ljpcDate;renderCalendar()}));
  wrap.querySelectorAll('[data-ljpc-cal]').forEach(b=>b.addEventListener('click',()=>{const x=dayMatches[+b.dataset.ljpcCal];if(x)window.open(googleCalendarUrl(x),'_blank','noopener')}));
  wrap.querySelectorAll('[data-ljpc-share]').forEach(b=>b.addEventListener('click',()=>{const x=dayMatches[+b.dataset.ljpcShare];if(x)shareMatch(x)}));
}

const NOTIF_KEY='lj-store-v61';
const notifDefaults={goals:true,kickoff:true,halftime:true,final:true,news:true,video:true,fantasy:true,predictor:true,transfers:true};
function readPrefs(){try{const s=JSON.parse(localStorage.getItem(NOTIF_KEY)||'{}');return {...s,notif:{...notifDefaults,...(s.notif||{})}}}catch(_){return {notif:{...notifDefaults}}}}
function savePrefs(s){localStorage.setItem(NOTIF_KEY,JSON.stringify(s))}
function renderNotifications(){
  const wrap=ensureOwnHost('Notificaciones','Las mismas preferencias funcionales de la app móvil, adaptadas al diseño de escritorio.');
  if(!wrap)return;
  const state=readPrefs();
  const items=[
    ['goals','Goles','Avisar cuando cambie el marcador'],['kickoff','Inicio de partido','Aviso al comenzar un encuentro'],['halftime','Medio tiempo','Aviso al descanso'],['final','Final del partido','Resultado al terminar'],
    ['news','Noticias','Comunicados y novedades'],['video','Nuevos videos','Resúmenes y contenido de Liga TV'],['fantasy','Fantasy','Movimientos y recordatorios Fantasy'],['predictor','Pronósticos','Recordatorios de quiniela'],['transfers','Fichajes','Altas, bajas y movimientos']
  ];
  wrap.innerHTML='<div class="ljpc-function-root" data-ljpc-function-route="pc-notifications"><div class="ljpc-toolbar"><div><b style="color:#0a235c">Preferencias sincronizadas con este navegador</b><div class="ljpc-muted">Se guardan con la misma clave local utilizada por la app.</div></div><div class="ljpc-toolbar-group"><button class="ljpc-btn primary" data-ljpc-permission>Activar notificaciones del navegador</button><button class="ljpc-btn" data-ljpc-test>Probar aviso</button></div></div><div class="ljpc-notify-grid">'+items.map(x=>'<label class="ljpc-toggle"><span><b>'+esc(x[1])+'</b><small>'+esc(x[2])+'</small></span><input class="ljpc-switch" type="checkbox" data-ljpc-notif="'+x[0]+'" '+(state.notif[x[0]]?'checked':'')+'></label>').join('')+'</div></div>';
  wrap.querySelectorAll('[data-ljpc-notif]').forEach(x=>x.addEventListener('change',()=>{const s=readPrefs();s.notif[x.dataset.ljpcNotif]=x.checked;savePrefs(s)}));
  wrap.querySelector('[data-ljpc-permission]')?.addEventListener('click',async()=>{if(!('Notification'in window)){alert('Este navegador no admite notificaciones web.');return}const p=await Notification.requestPermission();alert(p==='granted'?'Notificaciones del navegador activadas.':'El navegador no concedió permiso para notificaciones.')});
  wrap.querySelector('[data-ljpc-test]')?.addEventListener('click',()=>{if('Notification'in window&&Notification.permission==='granted')new Notification('Liga Juventino Rosas',{body:'Notificación de prueba del modo PC.'});else alert('Activa primero las notificaciones del navegador.')});
}

function scorerRows(catId){
  const cat=db?.categories?.[String(catId)]||{};
  const groups=cat.scorers||[];
  const rows=(groups[0]?.rows||[]).filter(r=>Array.isArray(r)&&r[1]&&r[2]&&/^\d+$/.test(String(r[3]||'')));
  return rows.map((r,i)=>({rank:Number(r[0])||i+1,name:String(r[1]).trim(),team:String(r[2]).trim(),goals:Number(r[3])||0})).sort((a,b)=>b.goals-a.goals||a.rank-b.rank);
}
function renderScorers(catId=activeCat){
  rememberCat(catId);
  const wrap=ensureOwnHost('Máximos goleadores','Tabla oficial de goleadores por categoría, presentada en el diseño PC.');
  if(!wrap)return;
  const rows=scorerRows(catId);
  wrap.innerHTML='<div class="ljpc-function-root" data-ljpc-function-route="pc-scorers"><div class="ljpc-toolbar"><div class="ljpc-cat-tabs">'+CAT_ORDER.map(id=>'<button class="ljpc-chip '+(id===catId?'active':'')+'" data-ljpc-scorer-cat="'+id+'">'+esc(categoryName(id))+'</button>').join('')+'</div><button class="ljpc-btn primary" data-ljpc-data>Datos oficiales</button></div><section class="ljpc-panel" style="padding:0;overflow:hidden">'+(rows.length?'<table class="ljpc-table"><thead><tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Goles</th></tr></thead><tbody>'+rows.map((x,i)=>'<tr><td class="ljpc-rank">'+(i+1)+'</td><td><b>'+esc(x.name)+'</b></td><td><span class="ljpc-team">'+crest(x.team)+'<span>'+esc(pretty(x.team))+'</span></span></td><td><b>'+x.goals+'</b></td></tr>').join('')+'</tbody></table>':'<div style="padding:18px" class="ljpc-muted">No hay tabla oficial de goleo publicada para esta categoría.</div>')+'</section></div>';
  wrap.querySelectorAll('[data-ljpc-scorer-cat]').forEach(b=>b.addEventListener('click',()=>renderScorers(rememberCat(b.dataset.ljpcScorerCat))));
  wrap.querySelector('[data-ljpc-data]')?.addEventListener('click',()=>go('safe-data'));
}

function standingsRows(catId){
 const c=db?.categories?.[String(catId)]||{};
 const groups=[c.standings,c.table,c.classification,c.positions].filter(Array.isArray);
 for(const g of groups){const rows=(Array.isArray(g[0]?.rows)?g[0].rows:g).filter(Array.isArray);if(rows.length)return rows}
 return [];
}
function renderStandings(catId=activeCat){
 rememberCat(catId);
 const wrap=ensureOwnHost('Clasificación','Tabla de posiciones oficiales por categoría.');
 if(!wrap)return;
 const rows=standingsRows(catId);
 const thead='<tr><th>#</th><th>Equipo</th><th>PJ</th><th>PTS</th><th>DG</th></tr>';
 const cells=rows.map((r,i)=>'<tr><td class="ljpc-rank">'+esc(r[0]||i+1)+'</td><td><span class="ljpc-team">'+crest(r[1])+'<span>'+esc(pretty(r[1]))+'</span></span></td><td>'+esc(r[2]??'—')+'</td><td><b>'+esc(r[9]??'—')+'</b></td><td>'+esc(r[8]??'—')+'</td></tr>').join('');
 wrap.innerHTML='<div class="ljpc-function-root" data-ljpc-function-route="pc-standings"><div class="ljpc-toolbar"><div class="ljpc-cat-tabs">'+CAT_ORDER.map(id=>'<button class="ljpc-chip '+(id===catId?'active':'')+'" data-ljpc-standing-cat="'+id+'">'+esc(categoryName(id))+'</button>').join('')+'</div><button class="ljpc-btn" data-ljpc-fixtures>Partidos oficiales</button></div><section class="ljpc-panel" style="padding:0;overflow:auto">'+(rows.length?'<table class="ljpc-table"><thead>'+thead+'</thead><tbody>'+cells+'</tbody></table>':'<p class="ljpc-muted" style="padding:18px">Clasificación oficial no disponible para esta categoría.</p>')+'</section></div>';
 wrap.querySelectorAll('[data-ljpc-standing-cat]').forEach(b=>b.addEventListener('click',()=>renderStandings(rememberCat(b.dataset.ljpcStandingCat))));
 wrap.querySelector('[data-ljpc-fixtures]')?.addEventListener('click',()=>go('pc-fixtures'));
}
function renderFixtures(catId=activeCat,bracket=false){
 rememberCat(catId);
 const wrap=ensureOwnHost('Partidos y resultados','Rol y marcadores oficiales de la Liga Juventino Rosas.');
 if(!wrap)return;
 const matches=fixtures(catId);
 wrap.innerHTML='<div class="ljpc-function-root" data-ljpc-function-route="pc-fixtures"><div class="ljpc-toolbar"><div class="ljpc-cat-tabs">'+CAT_ORDER.map(id=>'<button class="ljpc-chip '+(id===catId?'active':'')+'" data-ljpc-fixture-cat="'+id+'">'+esc(categoryName(id))+'</button>').join('')+'</div><div class="ljpc-toolbar-group"><button class="ljpc-btn" data-ljpc-to-calendar>Calendario</button><button class="ljpc-btn primary" data-ljpc-to-standings>Clasificación</button><button class="ljpc-btn" data-ljpc-bracket>Cuadro</button></div></div><section class="ljpc-panel">'+(matches.length?matches.slice(-100).reverse().map(x=>'<div class="ljpc-match"><div class="ljpc-team">'+crest(x.home)+'<span>'+esc(pretty(x.home))+'</span></div><div class="ljpc-score"><b>'+esc(x.played?x.homeScore+' – '+x.awayScore:x.rawDate.match(/\\s(\\d{1,2}:\\d{2})/)?.[1]||'Por confirmar')+'</b><small>'+esc(formatDate(x.date))+' · J'+esc(x.round)+'</small></div><div class="ljpc-team">'+crest(x.away)+'<span>'+esc(pretty(x.away))+'</span></div><div class="ljpc-muted">'+esc(x.venue||'Sede por confirmar')+'</div></div>').join(''):'<p class="ljpc-muted">Sin partidos oficiales publicados.</p>')+'</section></div>';
 wrap.querySelectorAll('[data-ljpc-fixture-cat]').forEach(b=>b.addEventListener('click',()=>renderFixtures(rememberCat(b.dataset.ljpcFixtureCat),bracket)));
 if(bracket&&window.LJR_KNOCKOUT){
  wrap.querySelector('.ljpc-panel').outerHTML=window.LJR_KNOCKOUT.render({category:db?.categories?.[catId],categoryId:catId,logoFor:logoUrl});
  window.LJR_KNOCKOUT.init(wrap.querySelector('.ljr-knockout'));
 }
 wrap.querySelector('[data-ljpc-bracket]')?.addEventListener('click',()=>renderFixtures(catId,!bracket));
 wrap.querySelector('[data-ljpc-to-calendar]')?.addEventListener('click',()=>go('pc-calendar'));
 wrap.querySelector('[data-ljpc-to-standings]')?.addEventListener('click',()=>go('pc-standings'));
}

function enhanceMore(){
  const page=document.querySelector('#screen .ds-page');if(!page)return;
  const wrap=page.querySelector('.ds-content > .ds-wrap');if(!wrap||wrap.querySelector('.ljpc-home-tools'))return;
  const box=document.createElement('section');box.className='ljpc-home-tools';
  box.innerHTML='<h2>Funciones de la app también en PC</h2><p>Estas herramientas usan la misma información y preferencias de la app, pero conservan una interfaz propia de escritorio.</p><div class="ljpc-toolbar-group"><button class="ljpc-btn" data-ljpc-go="pc-calendar">Calendario funcional</button><button class="ljpc-btn" data-ljpc-go="pc-scorers">Goleadores oficiales</button><button class="ljpc-btn" data-ljpc-go="pc-notifications">Notificaciones</button></div>';
  wrap.prepend(box);
  box.querySelectorAll('[data-ljpc-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.ljpcGo)));
}

async function renderOwn(){
  if(!isDesktop())return;
  injectStyle();
  const r=route();
  if(r==='more'){enhanceMore();return}
  if(!OWN.has(r))return;
  if(document.querySelector('[data-ljpc-function-route="'+r+'"]'))return;
  await loadDb();
  if(!isDesktop()||route()!==r)return;
  if(r==='pc-calendar')renderCalendar();
  if(r==='pc-notifications')renderNotifications();
  if(r==='pc-scorers')renderScorers(activeCat);
  if(r==='pc-standings')renderStandings(activeCat);
  if(r==='pc-fixtures')renderFixtures(activeCat);
}

function rerouteLegacy(){
  if(!isDesktop())return false;
  const r=route(),to=ALIASES[r];
  if(!to)return false;
  go(to);
  return true;
}

document.addEventListener('click',e=>{
  if(!isDesktop())return;
  const b=e.target.closest('[data-ds-route],[data-lj-route]');
  if(!b)return;
  const raw=b.dataset.dsRoute||b.dataset.ljRoute;
  const to=ALIASES[raw];
  if(!to)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();go(to);
},true);

let timer=0;
function sync(){clearTimeout(timer);timer=setTimeout(()=>{if(rerouteLegacy())return;renderOwn()},35)}
window.addEventListener('hashchange',sync);
window.addEventListener('resize',sync);
window.addEventListener('ljr:official-data',()=>{try{db=window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.()||db}catch(_){};document.querySelector('[data-ljpc-function-route]')?.remove();sync()});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(isDesktop()&&(OWN.has(route())||route()==='more'))sync()}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
