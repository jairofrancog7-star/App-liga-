/* V141 — Match Center real de la Liga.
   Usa exclusivamente la programación, resultados, tablas y plantillas
   publicados en official-live.json. No inventa marcador, minuto, eventos
   ni alineaciones. */
(function(){
'use strict';
if(window.__LJR_V141_MATCH_CENTER__)return;
window.__LJR_V141_MATCH_CENTER__=true;

const PRIMARY_ROUTE='v4-matchcenter';
const DIRECT_ROUTES=new Set(['v4-matchcenter','matchCenter','match-center']);
const LOCAL='./public/data/official-live.json?v=20260922-v141';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20260922-v141';
const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';

let db=window.LJR_OFFICIAL_DATA||null;
let activeTab='Resumen';
let selectedKey='';
let loading=null;
let timer=null;
let renderGuard=false;

function route(){return location.hash.replace('#/','').split('?')[0]||'home'}
function isDirectRoute(){return DIRECT_ROUTES.has(route())}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(v){return String(v??'').trim().toUpperCase()}
function categories(){return db?.categories||{}}
function catById(id){return categories()?.[String(id)]||null}
function logoUrl(name){
  const global=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name);
  if(global)return global;
  const entry=Object.entries(db?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  const p=typeof entry==='string'?entry:(entry?.local||entry?.source||'');
  if(!p)return BASE+'assets/liga-logo.webp';
  return /^https?:/i.test(p)?p:BASE+p.replace(/^\.\//,'');
}
function teamLogo(name,cls=''){
  return '<span class="v92-team-logo '+cls+'"><img src="'+esc(logoUrl(name))+'" alt="'+esc(name)+'" loading="eager" decoding="async"></span>';
}
function fixtureStamp(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  return m?Date.UTC(+m[3],+m[2]-1,+m[1],+m[4],+m[5],0):NaN;
}
function mexicoStamp(now=new Date()){
  try{
    const p=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now);
    const n=t=>Number(p.find(x=>x.type===t)?.value||0);
    return Date.UTC(n('year'),n('month')-1,n('day'),n('hour'),n('minute'),n('second'));
  }catch(_){return now.getTime()}
}
function dateOnly(v){return String(v||'').match(/^(\d{1,2}\/\d{1,2}\/\d{4})/)?.[1]||''}
function clock(v){return String(v||'').match(/\s(\d{1,2}:\d{2})/)?.[1]||'Por confirmar'}
function publishedScore(r){
  const h=String(r?.[3]??''),a=String(r?.[5]??'');
  return /^\d+$/.test(h)&&/^\d+$/.test(a)?{home:h,away:a,text:h+'–'+a}:null;
}
function allMatches(){
  const out=[];
  for(const [catId,c] of Object.entries(categories())){
    const rows=c?.fixtures?.[0]?.rows||[];
    for(const r of rows){
      const start=fixtureStamp(r?.[8]);
      if(!r?.[2]||!r?.[6]||!Number.isFinite(start))continue;
      out.push({
        key:String(catId)+':'+String(r?.[0]||out.length),
        catId:String(catId),
        category:c?.name||'Categoría',
        cat:c,
        r,
        start
      });
    }
  }
  return out.sort((a,b)=>a.start-b.start);
}
function stateFor(m,now=mexicoStamp()){
  const score=publishedScore(m?.r);
  if(score)return {kind:'final',label:'RESULTADO OFICIAL',primary:score.text,secondary:'Final'};
  const start=m?.start;
  if(!Number.isFinite(start))return {kind:'unknown',label:'PROGRAMACIÓN OFICIAL',primary:'VS',secondary:'Horario por confirmar'};
  if(now<start)return {kind:'scheduled',label:'PRÓXIMO PARTIDO OFICIAL',primary:clock(m.r[8]),secondary:dateOnly(m.r[8])};
  const elapsed=(now-start)/60000;
  if(elapsed<=150)return {
    kind:'window',
    label:'HORARIO DEL PARTIDO',
    primary:'—',
    secondary:'Sin marcador oficial publicado'
  };
  return {
    kind:'pending',
    label:'RESULTADO PENDIENTE',
    primary:'—',
    secondary:'Esperando reporte oficial'
  };
}
function selectedFixture(){
  const list=allMatches();if(!list.length)return null;
  if(selectedKey){
    const chosen=list.find(m=>m.key===selectedKey);
    if(chosen)return chosen;
  }
  const now=mexicoStamp();
  const inWindow=list.filter(m=>stateFor(m,now).kind==='window').sort((a,b)=>a.start-b.start);
  if(inWindow.length)return inWindow[0];
  const future=list.filter(m=>m.start>now).sort((a,b)=>a.start-b.start);
  if(future.length)return future[0];
  const withScore=list.filter(m=>publishedScore(m.r)).sort((a,b)=>b.start-a.start);
  if(withScore.length)return withScore[0];
  return list[list.length-1];
}
function standings(m){return m?.cat?.standings?.[0]?.rows||[]}
function roster(m,name){
  const direct=m?.cat?.rosters?.[name];
  if(Array.isArray(direct))return direct;
  const hit=Object.entries(m?.cat?.rosters||{}).find(([n])=>norm(n)===norm(name));
  return Array.isArray(hit?.[1])?hit[1]:[];
}
function standing(m,name){return standings(m).find(r=>norm(r?.[1])===norm(name))||null}
function matchPicker(m){
  const now=mexicoStamp();
  const list=allMatches();
  let options=list.filter(x=>x.start>=now-1000*60*60*24*2).slice(0,30);
  if(!options.some(x=>x.key===m.key))options=[m,...options];
  const option=x=>{
    const r=x.r,s=publishedScore(r);
    const center=s?s.text:clock(r[8]);
    return '<option value="'+esc(x.key)+'" '+(x.key===m.key?'selected':'')+'>'+esc(x.category)+' · '+esc(dateOnly(r[8]))+' '+esc(center)+' · '+esc(r[2])+' vs '+esc(r[6])+'</option>';
  };
  return '<section class="v92-match-picker"><label><span>Partido oficial</span><select data-v92-match-select>'+options.map(option).join('')+'</select></label><small>Elige otro partido publicado por la Liga.</small></section>';
}
function rosterSummary(m,team){
  const names=roster(m,team);
  return '<article class="v92-player-card">'+teamLogo(team,'small')+'<span><b>'+esc(team)+'</b><small>'+names.length+' jugadores registrados · '+esc(m.category)+'</small></span></article>';
}
function summaryBody(m,state){
  const r=m.r,home=r[2],away=r[6],venue=r[7]||'Campo por confirmar',score=publishedScore(r);
  const status=score?score.text:(state.kind==='scheduled'?'Programado':state.kind==='window'?'Sin marcador oficial':'Resultado pendiente');
  return '<div class="v92-summary-grid">'+
      '<div><b>'+esc(status)+'</b><small>'+(score?'Marcador oficial':'Estado')+'</small></div>'+
      '<div><b>'+esc(clock(r[8]))+'</b><small>Hora oficial</small></div>'+
      '<div><b>'+esc(venue)+'</b><small>Sede</small></div>'+
    '</div>'+
    '<section class="v92-section"><div class="v92-section-head"><h2>Plantillas registradas</h2><small>No se presentan como alineaciones hasta que la Liga las confirme.</small></div><div class="v92-player-grid">'+
      rosterSummary(m,home)+rosterSummary(m,away)+
    '</div></section>'+
    '<section class="v92-section"><div class="v92-section-head"><h2>Acciones rápidas</h2></div><div class="v92-actions">'+
      '<button data-v92-route="competition">Jornadas</button><button data-v92-route="v4-calendar">Calendario</button><button data-v92-route="leagueData">Tabla</button><button data-v92-route="venues">Campos</button>'+
    '</div></section>';
}
function rosterColumn(m,team){
  const names=roster(m,team);
  return '<article class="v92-roster"><div class="v92-roster-title">'+teamLogo(team,'tiny')+'<span><b>'+esc(team)+'</b><small>Plantilla oficial registrada · no alineación confirmada</small></span></div>'+
    (names.length?'<ol>'+names.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ol>':'<p>No hay plantilla pública disponible.</p>')+'</article>';
}
function lineupsBody(m){
  const r=m.r;
  return '<section class="v92-section"><div class="v92-section-head"><h2>Plantillas oficiales</h2><small>Las alineaciones del partido aparecerán únicamente si la Liga las publica.</small></div><div class="v92-roster-grid">'+rosterColumn(m,r[2])+rosterColumn(m,r[6])+'</div></section>';
}
function statsBody(m){
  const r=m.r,h=standing(m,r[2]),a=standing(m,r[6]);
  const row=(label,idx)=>'<div class="v92-stat-row"><b>'+esc(h?.[idx]??'—')+'</b><span>'+label+'</span><b>'+esc(a?.[idx]??'—')+'</b></div>';
  return '<section class="v92-section"><div class="v92-section-head"><h2>Datos oficiales de temporada</h2><small>'+esc(m.category)+' · no se inventan posesión, tiros ni asistencias.</small></div>'+
    '<div class="v92-stat-head"><span>'+teamLogo(r[2],'tiny')+esc(r[2])+'</span><span>'+teamLogo(r[6],'tiny')+esc(r[6])+'</span></div>'+
    '<div class="v92-stat-table">'+row('Partidos',2)+row('Ganados',3)+row('Goles a favor',6)+row('Diferencia',8)+row('Puntos',9)+'</div></section>';
}
function timelineBody(m,state){
  const r=m.r,score=publishedScore(r);let lines='';
  if(score){
    lines='<div><b>Final</b><span>Resultado oficial publicado: '+esc(r[2])+' '+esc(score.home)+'–'+esc(score.away)+' '+esc(r[6])+'.</span></div>';
  }else if(state.kind==='scheduled'){
    lines='<div><b>'+esc(clock(r[8]))+'</b><span>Inicio programado · '+esc(dateOnly(r[8]))+' · '+esc(r[7]||'Campo por confirmar')+'</span></div>'+
      '<div><b>—</b><span>Sin eventos oficiales publicados todavía.</span></div>';
  }else if(state.kind==='window'){
    lines='<div><b>'+esc(clock(r[8]))+'</b><span>El horario programado del encuentro está en curso.</span></div>'+
      '<div><b>—</b><span>No hay marcador ni eventos oficiales publicados; no se calcula un minuto ficticio.</span></div>';
  }else{
    lines='<div><b>—</b><span>El horario ya pasó y el resultado oficial aún no está publicado.</span></div>';
  }
  return '<section class="v92-section"><div class="v92-section-head"><h2>Cronología oficial</h2><small>Solo información verificable.</small></div><div class="v92-timeline">'+lines+'</div></section>';
}
function bodyFor(tab,m,state){
  if(tab==='Alineaciones')return lineupsBody(m);
  if(tab==='Estadísticas')return statsBody(m);
  if(tab==='Cronología')return timelineBody(m,state);
  return summaryBody(m,state);
}
function emptyMarkup(){
  return '<article class="v92-matchcenter" data-v92-matchcenter><header class="v92-match-head"><div class="v92-kicker">PROGRAMACIÓN OFICIAL</div><h1>Match Center</h1><p>No hay partidos publicados en el snapshot oficial actual.</p></header></article>';
}
function render(){
  if(!isDirectRoute())return;
  const screen=document.querySelector('#screen');if(!screen||renderGuard)return;
  renderGuard=true;
  const m=selectedFixture();
  if(!m){
    screen.innerHTML=emptyMarkup();renderGuard=false;return;
  }
  const r=m.r,state=stateFor(m),home=r[2],away=r[6],venue=r[7]||'Campo por confirmar';
  const center=state.primary;
  screen.innerHTML='<article class="v92-matchcenter" data-v92-matchcenter>'+
    '<header class="v92-match-head"><div class="v92-kicker">'+esc(state.label)+'</div><h1>Match Center</h1><p>'+esc(home)+' vs '+esc(away)+' · '+esc(m.category)+' · Jornada '+esc(r[1]||'')+'</p></header>'+
    matchPicker(m)+
    '<section class="v92-score-card">'+
      '<div class="v92-side">'+teamLogo(home)+'<b>'+esc(home)+'</b></div>'+
      '<div class="v92-center"><strong>'+esc(center)+'</strong><small>'+esc(state.secondary)+'</small></div>'+
      '<div class="v92-side">'+teamLogo(away)+'<b>'+esc(away)+'</b></div>'+
    '</section>'+
    '<div class="v92-official-meta"><span>'+esc(dateOnly(r[8]))+' · '+esc(clock(r[8]))+'</span><span>'+esc(venue)+'</span></div>'+
    '<nav class="v92-tabs" aria-label="Opciones del Match Center">'+['Resumen','Alineaciones','Estadísticas','Cronología'].map(t=>'<button type="button" class="'+(activeTab===t?'active':'')+'" data-v92-tab="'+t+'">'+t+'</button>').join('')+'</nav>'+
    '<main class="v92-body">'+bodyFor(activeTab,m,state)+'</main>'+
    '<p class="v92-source">Datos deportivos públicos de la Liga · '+esc(m.category)+' · '+esc(dateOnly(r[8]))+' · '+esc(venue)+'</p>'+
  '</article>';

  document.body.classList.add('v92-match-center-official');
  document.querySelectorAll('.bottom-nav .nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='competition'));
  screen.querySelector('[data-v92-match-select]')?.addEventListener('change',e=>{selectedKey=e.target.value;activeTab='Resumen';renderGuard=false;render()});
  screen.querySelectorAll('[data-v92-tab]').forEach(b=>b.onclick=()=>{activeTab=b.dataset.v92Tab;renderGuard=false;render()});
  screen.querySelectorAll('[data-v92-route]').forEach(b=>b.onclick=()=>{location.hash='#/'+b.dataset.v92Route});
  renderGuard=false;
}
async function load(){
  if(loading)return loading;
  loading=(async()=>{
    for(const u of [LOCAL,REMOTE]){
      try{
        const res=await fetch(u,{cache:'no-store'});
        if(res.ok){db=await res.json();window.LJR_OFFICIAL_DATA=db;break}
      }catch(_){}
    }
    if(isDirectRoute())render();
    return db;
  })();
  return loading;
}
function syncRoute(){
  const r=route();
  try{
    const wanted=sessionStorage.getItem('v92-open-tab');
    if(['Resumen','Alineaciones','Estadísticas','Cronología'].includes(wanted)){
      activeTab=wanted;
      sessionStorage.removeItem('v92-open-tab');
    }
  }catch(_){}
  /* Compatibilidad con botones antiguos que aún marcaban #/match como Match Center. */
  if(r==='match'&&sessionStorage.getItem('v69-match-center-entry')==='1'){
    sessionStorage.removeItem('v69-match-center-entry');
    location.hash='#/'+PRIMARY_ROUTE;
    return;
  }
  const on=isDirectRoute();
  document.body.classList.toggle('v92-match-center-official',on);
  if(!on)return;
  render();
  load();
  if(!timer)timer=setInterval(()=>{if(isDirectRoute())render()},30000);
}
window.addEventListener('hashchange',()=>requestAnimationFrame(syncRoute));
window.addEventListener('ljr:official-data',()=>{if(isDirectRoute()){db=window.LJR_OFFICIAL_DATA||db;render()}});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(isDirectRoute()&&!screen.querySelector('[data-v92-matchcenter]'))requestAnimationFrame(render)}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncRoute,{once:true});else syncRoute();
})();