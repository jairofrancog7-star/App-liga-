/* V428/V440 — Liga TV directo + Televisados, adaptado al diseño azul. */
(function(){
'use strict';
if(window.__LJR_V428_TV_FEED_DIRECT__)return;
window.__LJR_V428_TV_FEED_DIRECT__=true;

const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

function db(){try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}}
function logo(name){
  try{
    const u=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||'';
    if(u)return u;
  }catch(_){}
  const d=db(),hit=Object.entries(d.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  const p=typeof hit==='string'?hit:(hit?.local||hit?.source||hit?.url||'');
  return p?( /^https?:/i.test(p)?p:ROOT+String(p).replace(/^\.?\//,'') ):'';
}
function badge(name){
  const src=logo(name),ini=String(name||'JR').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<span>'+esc(ini)+'</span>';
}
function parseDate(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  return m?new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime():NaN;
}
function fixtures(){
  const out=[];
  Object.entries(db().categories||{}).forEach(([cid,c])=>{
    (c?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,ri)=>{
      if(!r?.[2]||!r?.[6])return;
      const hs=String(r?.[3]??'').trim(),as=String(r?.[5]??'').trim(),played=/^\d+$/.test(hs)&&/^\d+$/.test(as);
      out.push({
        key:cid+':'+gi+':'+ri,cat:cid,category:c?.name||'Liga Juventino Rosas',
        home:String(r[2]),away:String(r[6]),hs:played?hs:'',as:played?as:'',played,
        date:String(r?.[8]||''),time:parseDate(r?.[8]),field:String(r?.[7]||'')
      });
    }));
  });
  return out.sort((a,b)=>(Number.isFinite(a.time)?a.time:9e15)-(Number.isFinite(b.time)?b.time:9e15));
}
const V443_FALLBACK_CLUBS=[
  {name:'Juventus',category:'Primera Fuerza'},
  {name:'Hermanos',category:'Primera Fuerza'},
  {name:'Linces',category:'Primera Fuerza'},
  {name:'Franco FC',category:'Primera Fuerza'},
  {name:'Lobos CDG',category:'Primera Fuerza'},
  {name:'Galacticos',category:'Primera Fuerza'},
  {name:'Manchester',category:'Veteranos 50+'},
  {name:'Boavista',category:'Liga Juventino Rosas'}
];
function teams(){
  try{
    const list=window.V66_OFFICIAL_DIRECTORY?.teamList?.();
    if(Array.isArray(list)&&list.length)return list.slice(0,12);
  }catch(_){}
  const seen=new Set(),out=[];
  Object.entries(db().categories||{}).forEach(([cid,c])=>{
    const add=n=>{n=String(n||'').trim();const k=norm(n);if(!n||seen.has(k))return;seen.add(k);out.push({name:n,category:c?.name||'Liga Juventino Rosas',cat:cid})};
    (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1]));
    Object.keys(c?.rosters||{}).forEach(add);
  });
  return out.length?out.slice(0,12):V443_FALLBACK_CLUBS.slice();
}
function matchCard(m,label,portrait=false){
  const score=m.played?m.hs+' - '+m.as:'VS';
  return '<button class="'+(portrait?'v428-tv-portrait':'v428-tv-card')+'" type="button" data-v428-match="'+esc(m.key)+'">'+
    '<span class="'+(portrait?'v428-tv-portrait-art':'v428-tv-art')+'">'+
      '<span class="v428-tv-logo">'+badge(m.home)+'</span><span class="v428-tv-logo">'+badge(m.away)+'</span>'+
      '<i>▶</i><strong>'+esc(score)+'</strong><em>'+esc(label)+'</em>'+
    '</span>'+
    '<span class="v428-tv-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+(m.date?' · '+esc(m.date):'')+'</small></span>'+
  '</button>';
}
function clubCard(t){
  return '<button class="v428-tv-card" type="button" data-v428-team="'+esc(t.name)+'">'+
    '<span class="v428-tv-art v428-tv-club-art"><span class="v428-tv-club-logo">'+badge(t.name)+'</span><i>▶</i><em>CLUB</em></span>'+
    '<span class="v428-tv-copy"><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Liga Juventino Rosas')+'</small></span></button>';
}
function rail(title,sub,body,more=true){
  return '<section class="v428-tv-section"><header><span><h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p></span>'+(more?'<button type="button" data-v428-more>Ver más ›</button>':'')+'</header><div class="v428-tv-row">'+body+'</div></section>';
}
function fallbackBox(icon,title,sub,routeName,tag='LIGA TV'){
  return '<button class="v443-tv-box" type="button" data-v428-route="'+esc(routeName)+'">'+
    '<span class="v443-tv-box-art"><span class="v443-tv-box-icon">'+icon+'</span><em>'+esc(tag)+'</em><i>›</i></span>'+
    '<span class="v443-tv-box-copy"><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span>'+
  '</button>';
}
function fallbackPortrait(icon,title,sub,routeName){
  return '<button class="v443-tv-portrait-box" type="button" data-v428-route="'+esc(routeName)+'">'+
    '<span class="v443-tv-portrait-art"><span>'+icon+'</span><i>▶</i><em>LIGA TV</em></span>'+
    '<span class="v443-tv-box-copy"><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span>'+
  '</button>';
}
function fallbackRail(kind){
  if(kind==='live')return [
    fallbackBox('📺','Televisados','Partidos transmitidos, hoy y próximos','televisados','EN TV'),
    fallbackBox('⚽','Match Center','Marcador, minuto y datos del partido','v4-matchcenter','PARTIDO'),
    fallbackBox('🗓','Calendario','Consulta jornadas y próximos partidos','competition','PROGRAMACIÓN')
  ].join('');
  if(kind==='league')return [
    fallbackBox('🏆','Liga Juventino Rosas','Resultados, clasificación y cuadro','competition','COMPETICIÓN'),
    fallbackBox('▶','Mejores momentos','Jugadas, finales y videos de la Liga','moments','MOMENTOS'),
    fallbackBox('📊','Datos oficiales','Tabla, goleadores y estadísticas','stats','DATOS')
  ].join('');
  if(kind==='clubs')return V443_FALLBACK_CLUBS.slice(0,7).map(clubCard).join('');
  if(kind==='vertical')return '<div class="v428-tv-portrait-row">'+[
    fallbackPortrait('🏆','Finales','Archivo audiovisual','moments'),
    fallbackPortrait('⚽','Jornada','Partidos y acciones','competition'),
    fallbackPortrait('📺','Liga TV','Contenido transmitido','televisados'),
    fallbackPortrait('📚','Historia','Campeones y temporadas','history')
  ].join('')+'</div>';
  if(kind==='popular')return [
    fallbackBox('🔥','Lo más visto','Accede a momentos destacados','moments','DESTACADO'),
    fallbackBox('👕','Equipos','Clubes y perfiles de la Liga','teams','CLUBES'),
    fallbackBox('🥅','Goleadores','Ranking oficial de anotadores','scorers','RANKING')
  ].join('');
  return [
    fallbackBox('▶','Resúmenes de partidos','Consulta acciones y resultados recientes','moments','RESUMEN'),
    fallbackBox('📺','Televisados','Partidos con cobertura de Liga TV','televisados','TV'),
    fallbackBox('🗓','Jornadas','Consulta el rol oficial publicado','competition','CALENDARIO')
  ].join('');
}

function startOfDay(ts){const d=new Date(ts);return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()}
function sameDay(a,b){return Number.isFinite(a)&&startOfDay(a)===startOfDay(b)}
function isLive(m,now=Date.now()){return Number.isFinite(m.time)&&now>=m.time&&now<m.time+120*60000}
function clock(ts){if(!Number.isFinite(ts))return 'POR CONFIRMAR';return new Date(ts).toLocaleTimeString('es-MX',{hour:'numeric',minute:'2-digit',hour12:true}).replace(/\s/g,'').toUpperCase()}
function shortDay(ts){return new Date(ts).toLocaleDateString('es-MX',{day:'2-digit',month:'short'}).replace('.','').toUpperCase()}
function tabDay(ts){return new Date(ts).toLocaleDateString('es-MX',{day:'2-digit',month:'short'}).replace('.','').toUpperCase()}

function telecastRow(m){
  const live=isLive(m),center=live&&m.played?(m.hs+' - '+m.as):(m.played?(m.hs+' - '+m.as):clock(m.time));
  const state=live?'EN VIVO':(m.played?'FINAL':'TRANSMISIÓN');
  return '<button class="v440-tv-match'+(live?' is-live':'')+'" type="button" data-v440-match="'+esc(m.key)+'" data-v440-home="'+esc(m.home)+'" data-v440-away="'+esc(m.away)+'" data-v440-date="'+esc(m.date)+'">'+
    '<span class="v440-tv-icon" aria-hidden="true"><b>TV</b></span>'+
    '<span class="v440-tv-team v440-tv-home"><span class="v440-tv-name">'+esc(m.home)+'</span><span class="v440-tv-badge">'+badge(m.home)+'</span></span>'+
    '<span class="v440-tv-center"><strong>'+esc(center)+'</strong><small>'+esc(state)+'</small></span>'+
    '<span class="v440-tv-team v440-tv-away"><span class="v440-tv-badge">'+badge(m.away)+'</span><span class="v440-tv-name">'+esc(m.away)+'</span></span>'+
    (live?'<span class="v440-tv-live-pill">EN VIVO</span>':'')+
  '</button>';
}
function telecastGroups(list){
  if(!list.length)return '<div class="v440-tv-empty"><b>Sin transmisiones para este filtro</b><span>Cuando haya partidos oficiales programados aparecerán aquí.</span></div>';
  const groups=new Map();
  list.forEach(m=>{const k=m.category||'Liga Juventino Rosas';if(!groups.has(k))groups.set(k,[]);groups.get(k).push(m)});
  return Array.from(groups.entries()).map(([cat,items])=>
    '<section class="v440-tv-league"><header><span class="v440-tv-cup">◆</span><strong>'+esc(cat)+'</strong></header>'+
    '<div class="v440-tv-league-body">'+items.map(telecastRow).join('')+'</div></section>'
  ).join('');
}
function telecastSelection(all,filter){
  const now=Date.now(),today=startOfDay(now),yesterday=today-86400000,tomorrow=today+86400000,older=today-2*86400000;
  if(filter==='live')return all.filter(m=>isLive(m,now));
  if(filter==='today')return all.filter(m=>sameDay(m.time,today));
  if(filter==='yesterday')return all.filter(m=>sameDay(m.time,yesterday));
  if(filter==='tomorrow')return all.filter(m=>sameDay(m.time,tomorrow));
  if(filter==='older')return all.filter(m=>sameDay(m.time,older));
  return all.filter(m=>Number.isFinite(m.time)&&m.time>=now-2*60*60000).slice(0,24);
}
function defaultTelecastFilter(all){
  const now=Date.now(),today=startOfDay(now),tomorrow=today+86400000;
  if(all.some(m=>isLive(m,now)))return 'live';
  if(all.some(m=>sameDay(m.time,today)))return 'today';
  if(all.some(m=>sameDay(m.time,tomorrow)))return 'tomorrow';
  return 'upcoming';
}
function telecastMarkup(all){
  const now=Date.now(),today=startOfDay(now),older=today-2*86400000,liveCount=all.filter(m=>isLive(m,now)).length,selected=defaultTelecastFilter(all);
  const tabs=[
    ['older',tabDay(older)],['yesterday','AYER'],['today','HOY'],['live','DIRECTO ('+liveCount+')'],['tomorrow','MAÑANA'],['upcoming','PRÓXIMOS']
  ];
  return '<section class="v440-telecast" data-v440-telecast data-v440-filter="'+selected+'">'+
    '<div class="v440-tv-pagehead"><button class="v440-tv-backmark" type="button" data-v440-back aria-label="Regresar">‹</button><div><h2>Televisados</h2><p>Partidos transmitidos y cobertura de Liga TV</p></div></div>'+
    '<div class="v440-tv-tabs" role="tablist">'+tabs.map(t=>'<button type="button" role="tab" data-v440-filter-btn="'+t[0]+'" class="'+(t[0]===selected?'is-active':'')+'">'+esc(t[1])+'</button>').join('')+'</div>'+
    '<div class="v440-tv-groups" data-v440-groups>'+telecastGroups(telecastSelection(all,selected))+'</div>'+
  '</section>';
}
function renderTelecast(root,filter){
  const all=fixtures(),groups=root.querySelector('[data-v440-groups]');
  if(!groups)return;
  root.dataset.v440Filter=filter;
  root.querySelectorAll('[data-v440-filter-btn]').forEach(b=>b.classList.toggle('is-active',b.dataset.v440FilterBtn===filter));
  groups.innerHTML=telecastGroups(telecastSelection(all,filter));
  bindTelecastRows(root);
}
function bindTelecastRows(root){
  root.querySelectorAll('[data-v440-match]').forEach(b=>b.onclick=()=>{
    try{
      sessionStorage.setItem('v440-tv-match',JSON.stringify({key:b.dataset.v440Match,home:b.dataset.v440Home,away:b.dataset.v440Away,date:b.dataset.v440Date}));
    }catch(_){}
    location.hash='#/v4-matchcenter';
  });
}
function bindTelecast(root){
  root.querySelectorAll('[data-v440-filter-btn]').forEach(b=>b.onclick=()=>renderTelecast(root,b.dataset.v440FilterBtn||'today'));
  root.querySelectorAll('[data-v440-back]').forEach(b=>b.onclick=()=>{if(route()!=='video')location.hash='#/video'});
  bindTelecastRows(root);
}

function isAndroidChromeV531(){
  const ua=navigator.userAgent||'';
  return /Android/i.test(ua)&&/(Chrome|CriOS)\//i.test(ua)&&!/EdgA\//i.test(ua)&&!/OPR\//i.test(ua);
}
function openAndroidCastSettings(sheet){
  try{
    const a=document.createElement('a');
    a.href='intent:#Intent;action=android.settings.CAST_SETTINGS;end';
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>a.remove(),500);
    castToast(sheet,'Selecciona tu TV en Enviar / Transmitir pantalla.');
    return true;
  }catch(_){
    castToast(sheet,'Abre “Enviar” o “Transmitir pantalla” desde los ajustes rápidos de Android.');
    return false;
  }
}
function closeCastSheet(){
  const sheet=document.querySelector('.v439-cast-sheet');
  if(sheet){sheet.classList.remove('is-open');setTimeout(()=>sheet.remove(),210)}
  document.body.classList.remove('v439-cast-open');
}
function castToast(sheet,msg){
  let t=sheet.querySelector('.v439-cast-toast');
  if(!t){t=document.createElement('div');t.className='v439-cast-toast';sheet.querySelector('.v439-cast-panel')?.appendChild(t)}
  t.textContent=msg;
  setTimeout(()=>t?.remove(),2600);
}
async function startCast(sheet,urlOverride=''){
  const target=urlOverride||location.href;
  const media=document.querySelector('video,audio');

  /* V531: Chrome Android no abre un selector Cast estándar para páginas web
     como sí lo hacen apps nativas. Para Facebook/TikTok/enlaces de página,
     abrimos directamente los ajustes de Enviar/Transmitir pantalla del sistema. */
  if(isAndroidChromeV531()){
    try{
      if(media&&media.remote&&typeof media.remote.prompt==='function'){
        await media.remote.prompt();
        return;
      }
    }catch(_){}
    openAndroidCastSettings(sheet);
    return;
  }

  try{
    if(media&&media.remote&&typeof media.remote.prompt==='function'){
      await media.remote.prompt();
      return;
    }
  }catch(_){}
  try{
    if(typeof window.PresentationRequest==='function'){
      const request=new window.PresentationRequest([target]);
      await request.start();
      return;
    }
  }catch(_){}
  try{
    if(navigator.share){
      await navigator.share({
        title:'Liga Juventino Rosas · Liga TV',
        text:'Abrir Liga TV en otra pantalla o dispositivo',
        url:target
      });
      return;
    }
  }catch(_){}
  try{
    await navigator.clipboard.writeText(target);
    castToast(sheet,'Enlace copiado. Ábrelo en tu TV u otro dispositivo.');
  }catch(_){
    castToast(sheet,'Tu navegador no permite abrir el selector de TV directamente.');
  }
}
function openCastSheet(urlOverride=''){
  closeCastSheet();
  const sheet=document.createElement('div');
  sheet.className='v439-cast-sheet';
  sheet.setAttribute('data-v439-cast-sheet','');
  sheet.innerHTML='<button class="v439-cast-backdrop" type="button" aria-label="Cerrar"></button>'+
    '<section class="v439-cast-panel" role="dialog" aria-modal="true" aria-label="Conectar o transmitir">'+
      '<span class="v439-cast-handle"></span>'+
      '<header class="v439-cast-head"><h2>Conectar o transmitir</h2><button type="button" data-v439-close aria-label="Cerrar">×</button></header>'+
      '<div class="v439-cast-body">'+
        '<h3>Ver con Liga TV</h3>'+
        '<article class="v439-streamcenter-card"><span><b>Ingresa para usar<br>Liga TV</b><small>Abre el modo TV de la Liga y conserva los controles de reproducción.</small></span><button type="button" data-v439-enter>Entrar</button></article>'+
        '<h3 class="v439-device-title">Transmitir a otro dispositivo</h3>'+
        '<button class="v439-cast-row" type="button" data-v439-transmit><span class="v439-row-icon">▣</span><b>Transmitir</b><i>›</i></button>'+
        '<button class="v439-cast-row" type="button" data-v439-learn><span class="v439-row-icon">ⓘ</span><b>Aprende más</b><i>›</i></button>'+
        '<div class="v439-cast-help" data-v439-help hidden><b>Cómo funciona</b><p>En Chrome Android, Transmitir abre Enviar / Transmitir pantalla del sistema para elegir la TV. En navegadores con reproducción remota se usa el selector compatible.</p></div>'+
        '<p class="v439-cast-foot">La disponibilidad depende del navegador, la TV y las funciones de transmisión del dispositivo.</p>'+
      '</div>'+
    '</section>';
  document.body.appendChild(sheet);
  document.body.classList.add('v439-cast-open');
  requestAnimationFrame(()=>sheet.classList.add('is-open'));
  sheet.querySelector('.v439-cast-backdrop').onclick=closeCastSheet;
  sheet.querySelector('[data-v439-close]').onclick=closeCastSheet;
  sheet.querySelector('[data-v439-enter]').onclick=()=>{
    closeCastSheet();
    setTimeout(()=>{if(window.LJR_V105&&typeof window.LJR_V105.openTv==='function')window.LJR_V105.openTv();else location.hash='#/video'},100);
  };
  sheet.querySelector('[data-v439-transmit]').onclick=()=>startCast(sheet,urlOverride);
  sheet.querySelector('[data-v439-learn]').onclick=()=>{
    const help=sheet.querySelector('[data-v439-help]');
    if(!help)return;
    help.hidden=!help.hidden;
    if(!help.hidden)help.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
}

function dedicatedTelevisadosMarkup(){
  return '<section class="v440-page-route" data-v440-page-route>'+telecastMarkup(fixtures())+
    '<div class="v440-page-note"><b>LIGA JUVENTINO TV</b><span>Los partidos se toman del rol oficial cargado en la app. Al tocar un encuentro se abre Match Center.</span></div>'+
  '</section>';
}
function bindDedicatedTelevisados(root){
  const telecast=root.querySelector('[data-v440-telecast]');
  if(telecast)bindTelecast(telecast);
}
function markup(){
  const all=fixtures(),now=Date.now(),played=all.filter(x=>x.played).slice(-12).reverse(),upcoming=all.filter(x=>!x.played&&(!Number.isFinite(x.time)||x.time>=now-7200000)).slice(0,12),featured=(played.length?played:all).slice(0,10),clubList=teams();
  return '<section class="v428-tv-feed" data-v428-tv-feed>'+
    '<div class="v428-tv-title"><div><small>LIGA TV</small><h2>Ver en TV</h2><p>Contenido oficial de la Liga Juventino Rosas.</p></div><button class="v439-connect-trigger" type="button" data-v439-connect>Conectar o transmitir</button></div>'+
    telecastMarkup(all)+
    rail('Ver en vivo en Liga Juventino','Partidos próximos y transmisiones de la Liga',upcoming.length?upcoming.slice(0,7).map(m=>matchCard(m,'PRÓXIMO')).join(''):fallbackRail('live'))+
    rail('Liga Juventino Rosas','Partidos, resultados y mejores momentos',featured.length?featured.slice(0,7).map(m=>matchCard(m,m.played?'MEJORES MOMENTOS':'PARTIDO')).join(''):fallbackRail('league'))+
    rail('Videos oficiales de clubes','Contenido por equipo registrado',clubList.length?clubList.slice(0,9).map(clubCard).join(''):fallbackRail('clubs'))+
    rail('Liga TV Videos','Videos verticales y momentos destacados',featured.length?'<div class="v428-tv-portrait-row">'+featured.slice(0,7).map(m=>matchCard(m,'LIGA TV',true)).join('')+'</div>':fallbackRail('vertical'),false)+
    rail('Lo más visto','Selección destacada de Liga TV',featured.length?featured.slice().reverse().slice(0,7).map(m=>matchCard(m,'DESTACADO')).join(''):fallbackRail('popular'))+
    rail('Resúmenes más recientes','Últimos partidos con marcador oficial',played.length?played.slice(0,7).map(m=>matchCard(m,'RESUMEN')).join(''):fallbackRail('recent'))+
  '</section>';
}
function bind(root){
  root.querySelectorAll('[data-v439-connect]').forEach(b=>b.onclick=openCastSheet);
  root.querySelectorAll('[data-v428-route]').forEach(b=>b.onclick=()=>{location.hash='#/'+(b.dataset.v428Route||'video')});
  const telecast=root.querySelector('[data-v440-telecast]');if(telecast)bindTelecast(telecast);
  root.querySelectorAll('[data-v428-match]').forEach(b=>b.onclick=()=>{location.hash='#/v4-matchcenter'});
  root.querySelectorAll('[data-v428-team]').forEach(b=>b.onclick=()=>{
    const name=b.dataset.v428Team||'';
    try{localStorage.setItem('v62-team-name',name);localStorage.setItem('v27-selected-team',norm(name).replace(/\s+/g,'-'))}catch(_){}
    location.hash='#/teamDetail';
  });
  root.querySelectorAll('[data-v428-more]').forEach(b=>b.onclick=()=>{location.hash='#/moments'});
}
function insert(host,where='beforeend'){
  if(!host||host.querySelector(':scope > [data-v428-tv-feed]'))return;
  host.insertAdjacentHTML(where,markup());
  const root=host.querySelector(':scope > [data-v428-tv-feed]');
  if(root)bind(root);
}
function mount(){
  const r=route();
  document.body.classList.toggle('v440-televisados-open',r==='televisados');

  if(r==='televisados'){
    const screen=document.querySelector('#screen');
    if(screen&&!screen.querySelector('[data-v440-page-route]')){
      screen.innerHTML=dedicatedTelevisadosMarkup();
      const page=screen.querySelector('[data-v440-page-route]');
      if(page)bindDedicatedTelevisados(page);
    }
    return;
  }

  if(r==='video'){
    const content=document.querySelector('#screen .v17-tv .v17-tv-content');
    insert(content,'afterbegin');
  }
  const board=document.querySelector('body > .v160-tv-layer .v160-tv-board');
  insert(board,'beforeend');
}
let t=0;
function schedule(ms=30){clearTimeout(t);t=setTimeout(mount,ms)}
new MutationObserver(()=>schedule(20)).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{
  const target=e.target instanceof Element?e.target.closest('[data-v412-tv-mode="cast"],[data-v439-connect]'):null;
  if(!target)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  target.setAttribute('data-v439-hard-click','1');
  openCastSheet();
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCastSheet()});
window.addEventListener('hashchange',()=>{closeCastSheet();schedule(40)});
window.addEventListener('load',()=>schedule(120));
document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
window.LJR_V440_TELEVISADOS={open:()=>{location.hash='#/televisados'},mount,openCast:(url='')=>openCastSheet(url)};
schedule(20);setTimeout(mount,500);setTimeout(mount,1500);
})();