import {defaultDefeatedTeam} from './competition-data.js';
/* V62 — Datos oficiales públicos de Liga Juventino Rosas.
   Integra el snapshot de Liga_Futbol sin sustituir el diseño azul existente.
   Fuente deportiva pública: juventinorosasliga.com sincronizada en Liga_Futbol/data/official-live.json. */
(function(){
'use strict';

const BUILD='20261010-v1114-official-weekly-safe';
const LOCAL_DATA='./data/official-live.json?v='+BUILD;
const REMOTE_DATA='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v='+BUILD;
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const RULEBOOK='https://github.com/jairofrancog7-star/Liga_Futbol/blob/main/docs/Reglamento_Liga_Juventino_Rosas_2026_2027.pdf';
const CAT_ORDER=['3','5','4','2','1'];
const CAT_META={
  '3':{name:'Primera Fuerza',logo:'assets/branding/primera-fuerza-hd.png'},
  '5':{name:'Intermedia',logo:'assets/categories/intermedia.webp'},
  '4':{name:'Segunda Fuerza',logo:'assets/categories/segunda-fuerza.webp'},
  '2':{name:'Veteranos 35+',logo:'assets/categories/veteranos-35-user.png'},
  '1':{name:'Veteranos 50+',logo:'assets/categories/veteranos-50.webp'}
};
const CODE_BY_NAME={
  'club america veteranos':'AME','club america veteranos jr':'AME','america veteranos':'AME',
  'la huerta':'HUE','promesas fc':'PRO','franco fc':'FRA','atletico galeana':'GAL','atl galeana':'GAL',
  'lobos cdg':'LOB','cuenda':'CUE','toros de cuenda':'CUE','pozos':'POZ','pozos fc':'POZ',
  'rincon de centeno':'RIN','deportivo rosas':'ROS','atletico santa cruz':'STC','santa cruz':'STC',
  'san jose fc':'SJO','hermanos':'HER','linces':'LIN','terricolas':'TER','galacticos':'GAC',
  'la esperanza':'ESP','tavera fc':'TVF','herreras fc':'HFC','boavista':'BOA','dynamo':'DYN',
  'boca jrs':'BOC','manchester':'MAN','napoli':'NAP','abejas':'ABE','la canchita deportes':'CAN',
  'aldama fc':'ALD','malvinas':'MAL','capibaras':'CAP','la cuadrilla':'CUA','mazacotes fc':'MAZ',
  'dep maravillas':'MAR','deportivo maravillas':'MAR','osasuna':'OSA','san antonio jrs':'SAJ',
  'populares':'POP','pachangas fc':'PAC','san juan fc':'SJU','tapatio':'TAP','dep la luz':'LAL',
  'deportivo la luz':'LAL','barza':'BAR','san jose jrs':'SJJ','san antonio fc':'SAF',
  'celticos':'CEL','celticos fc':'CEL','dep zapata':'ZAP','deportivo zapata':'ZAP',
  'dep nopalero':'NOP','deportivo nopalero':'NOP','san julian':'SJL','juventus':'JUVS',
  'c de gasca':'CDG','cerrito de gasca':'CDG','psv':'PSV','a santiago':'ASG','atletico santiago':'ASG',
  'f tavera':'FTV','franco tavera':'FTV','franco tavera jr':'FTV','franco-tavera-jr':'FTV','america':'AME','huracan':'HUR','aguilares':'AGU','leyendas':'LEY','leyendas fc':'LEY','la trinidad':'TRI','trinidad':'TRI'
};

let db=null;
let categoryId=localStorage.getItem('v62-category')||'3';
let dataTab=localStorage.getItem('v62-data-tab')||'standings';
let fixtureFilter=localStorage.getItem('v62-fixture-filter')||'all';
let playerTeamFilter=localStorage.getItem('v62-player-team-filter')||'all';
let applying=false;

function route(){return location.hash.replace(/^#\//,'').split('?')[0]||'home'}
function registrationActive(){
 const r=route();
 return !!window.__LJR_REGISTRATION_TEAM_PICKER__||
   r==='credentialBuilder'||r.startsWith('credentialBuilder')||
   !!document.querySelector('#screen [data-v64-cred-team],#v124-player-registry,[data-v132-layer].open,.v126-team-panel');
}
function norm(v){
  return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/\bfc\b/g,'fc').replace(/[^a-z0-9+]+/g,' ').trim().replace(/\s+/g,' ');
}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function same(a,b){
  const x=norm(a),y=norm(b);
  if(x===y)return true;
  const pairs=[
    ['atletico galeana','atl galeana'],['cuenda','toros de cuenda'],
    ['club america veteranos','club america veteranos jr'],['club america veteranos','america veteranos'],
    ['pozos','pozos fc'],['atletico santa cruz','santa cruz'],
    ['san antonio jrs','san antonio jr'],['dep maravillas','deportivo maravillas'],
    ['dep nopalero','deportivo nopalero'],['dep la luz','deportivo la luz'],
    ['dep zapata','deportivo zapata'],['celticos','celticos fc']
  ];
  return pairs.some(p=>(x===p[0]&&y===p[1])||(x===p[1]&&y===p[0]));
}
function cat(id=categoryId){return db?.categories?.[String(id)]||null}
function block(kind,id=categoryId){return cat(id)?.[kind]?.[0]||null}
function rows(kind,id=categoryId){return block(kind,id)?.rows||[]}
function logoFor(name){
  const supplied=window.LJR_SEASON_LOGOS?.get(name);if(supplied)return supplied;
  if(db){
    const entries=Object.entries(db.team_logos||{});
    const exact=entries.find(([k])=>norm(k)===norm(name));
    const hit=exact||entries.find(([k])=>same(k,name));
    const v=hit?.[1];
    if(typeof v==='string')return v;
    if(v?.app)return v.app;
    if(v?.local)return SRC+String(v.local).replace(/^\.\//,'');
    if(v?.source)return v.source;
  }
  const shared=window.LJR_TEAM_LOGOS?.get?.(name);
  return shared||'';
}
function catLogo(id){const supplied=window.LJR_SEASON_LOGOS?.category(id);if(supplied)return supplied;const p=CAT_META[String(id)]?.logo;return p?SRC+p:''}
function scoreNum(v){if(v==null||v===''||v==='-')return 0;const n=Number(v);return Number.isFinite(n)?n:0}
function parseDate(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return null;
  return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
}
function isFutureFixture(r){const d=parseDate(r?.[8]);return !!d&&d.getTime()>Date.now()}
function hasPublishedScore(r){
  const a=String(r?.[3]??'').trim(),b=String(r?.[5]??'').trim();
  const cell=v=>/^\d+$/.test(v)||v==='-';
  return cell(a)&&cell(b)&&(/^\d+$/.test(a)||/^\d+$/.test(b));
}
function officialScoreCell(v){
  const x=String(v??'').trim();
  return x==='-'?'0':(/^\d+$/.test(x)?x:'—');
}
function isPlayedFixture(r){return hasPublishedScore(r)}
// Un triunfo por decisión del rol no equivale a goles ni marcador definitivo.
function fixtureDecision(r,id=categoryId){return cat(id)?.fixture_decisions?.[String(r?.[0]??'')]||null}
function isDecidedFixture(r,id=categoryId){return isPlayedFixture(r)||!!fixtureDecision(r,id)}
function categoryTeams(c){
  if(!c)return [];
  const out=[];

  /* V497 — Equipos reales solamente.
     El snapshot actual trae en scorers filas resumen como:
       ["1","JUVENTUS","22 goles en temporada","22"]
     La tercera celda NO es un equipo. Antes se agregaba como si lo fuera y
     por eso aparecían tarjetas "22 goles en temporada", "16 goles...", etc.
     La lista de equipos se obtiene únicamente de fuentes estructurales:
     plantillas, clasificación y partidos. */
  const validTeamName=n=>{
    n=String(n||'').trim();
    if(!n)return false;
    if(/^\d+\s*(?:ge|goles?)$/i.test(n))return false;
    if(/^\d+\s+goles?\s+en\s+temporada$/i.test(n))return false;
    if(/goles?\s+en\s+temporada/i.test(n))return false;
    return true;
  };
  const add=n=>{
    n=String(n||'').trim();
    if(validTeamName(n)&&!out.some(x=>same(x,n)))out.push(n);
  };

  Object.keys(c.rosters||{}).forEach(add);
  (c.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1]));
  (c.fixtures?.[0]?.rows||[]).forEach(r=>{add(r?.[2]);add(r?.[6])});

  /* No derivar equipos desde scorers: ese bloque puede ser una tabla de
     goleadores, un resumen por club o estadísticas agregadas según la fuente. */
  return out;
}
function teamContext(name){
  for(const id of CAT_ORDER){
    const c=cat(id);if(!c)continue;
    const n=categoryTeams(c).find(t=>same(t,name));
    if(n)return {id,c,name:n};
  }
  return null;
}
function selectedOfficialTeam(){
  const stored=localStorage.getItem('v62-team-name');
  if(stored&&teamContext(stored))return teamContext(stored);
  const title=document.querySelector('.v42-title h1')?.textContent||'';
  return teamContext(title);
}
function codeFor(name){return CODE_BY_NAME[norm(name)]||''}
function saveTeam(name){
  const ctx=teamContext(name);if(!ctx)return;
  localStorage.setItem('v62-team-name',ctx.name);
  localStorage.setItem('v62-category',ctx.id);
  categoryId=ctx.id;
  const code=codeFor(ctx.name);
  if(code)localStorage.setItem('v27-selected-team',code);
}
function openTeam(name){
  if(registrationActive())return false;
  saveTeam(name);
  localStorage.setItem('v42-team-tab','summary');
  localStorage.removeItem('v42-open-compare');
  location.hash='#/teamDetail';
}
function teamLogoHtml(name,cls='v62-team-logo'){
  const src=logoFor(name);
  if(src)return '<span class="'+cls+'"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
  const ab=String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return '<span class="'+cls+' v62-fallback">'+esc(ab||'⚽')+'</span>';
}
function sourceStamp(){
  const d=db?.captured_at_utc;
  if(!d)return 'Snapshot oficial';
  try{return 'Actualizado '+new Date(d).toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'})}
  catch{return 'Actualizado '+d}
}

/* V78 — Calendario y resultados de Inicio: solo datos oficiales.
   No inventa equipos, marcadores, minutos ni goleadores. El marcador se muestra
   únicamente cuando la fuente oficial publica al menos uno de los dos goles.
   Los dos guiones de un partido futuro siguen significando "sin resultado". */
let officialRefreshTimer=null;
function mexicoWallClockStamp(now=new Date()){
  try{
    const parts=new Intl.DateTimeFormat('en-CA',{
      timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
    }).formatToParts(now);
    const get=t=>Number(parts.find(p=>p.type===t)?.value||0);
    return Date.UTC(get('year'),get('month')-1,get('day'),get('hour'),get('minute'),get('second'));
  }catch(e){return now.getTime()}
}
function fixtureWallClockStamp(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return NaN;
  return Date.UTC(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0),0);
}
function fixtureClock(v){
  const m=String(v||'').match(/\s(\d{1,2}:\d{2})/);
  return m?.[1]||'Por confirmar';
}
function fixtureShortDate(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if(!m)return '';
  const d=new Date(Date.UTC(+m[3],+m[2]-1,+m[1]));
  try{return new Intl.DateTimeFormat('es-MX',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).format(d).replace('.','')}
  catch{return m[1]+'/'+m[2]}
}
function fixtureDateParts(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if(!m)return {day:'—',month:'',year:''};
  const d=new Date(Date.UTC(+m[3],+m[2]-1,+m[1]));
  let month='';
  try{month=new Intl.DateTimeFormat('es-MX',{month:'short',timeZone:'UTC'}).format(d).replace('.','').toUpperCase()}
  catch{month=m[2]}
  return {day:String(+m[1]),month,year:m[3]};
}
function officialFixtureEntries(id='3'){
  const c=cat(id),rs=c?.fixtures?.[0]?.rows||[];
  return rs.map((r,i)=>({id:String(id),category:c?.name||CAT_META[String(id)]?.name||'',r,index:i,start:fixtureWallClockStamp(r?.[8])}))
    .filter(x=>Number.isFinite(x.start)&&String(x.r?.[2]||'').trim()&&String(x.r?.[6]||'').trim());
}
function officialHomeCalendarItems(){
  const now=mexicoWallClockStamp();
  const primary=officialFixtureEntries('3');
  const results=primary.filter(x=>isDecidedFixture(x.r,'3')&&x.start<=now).sort((a,b)=>b.start-a.start);
  const upcoming=primary.filter(x=>!isDecidedFixture(x.r,'3')&&x.start>=now-2*60*60*1000).sort((a,b)=>a.start-b.start);
  const chosen=[];
  if(results.length)chosen.push(results[0]);
  upcoming.slice(0,Math.max(0,3-chosen.length)).forEach(x=>chosen.push(x));
  if(chosen.length<3){
    results.slice(1).forEach(x=>{if(chosen.length<3)chosen.push(x)});
  }
  return chosen.slice(0,3);
}
function homeOfficialLogo(name,cls='v78-calendar-logo'){
  return teamLogoHtml(name,cls);
}
function homeCalendarCard(x){
  const r=x.r,home=String(r[2]||'').trim(),away=String(r[6]||'').trim();
  const d=fixtureDateParts(r[8]),decision=fixtureDecision(r,'3'),played=isDecidedFixture(r,'3');
  const score=decision?decision.label:(played?officialScoreCell(r[3])+'–'+officialScoreCell(r[5]):fixtureClock(r[8]));
  const status=decision?'DECISIÓN DEL ROL':(played?'RESULTADO OFICIAL':'HORARIO OFICIAL');
  const venue=String(r[7]||'Campo por confirmar').trim()||'Campo por confirmar';
  return '<article class="v78-calendar-card '+(played?'is-result':'is-upcoming')+'">'+
    '<div class="v78-calendar-date"><b>'+esc(d.day)+'</b><span>'+esc(d.month)+'</span></div>'+
    '<div class="v78-calendar-teams'+(decision?' v78-has-decision':'')+'">'+
      '<button type="button" data-v62-team="'+esc(home)+'">'+homeOfficialLogo(home)+'<span>'+esc(home)+'</span></button>'+
      '<strong class="v78-calendar-score'+(decision?' v78-score-decision':'')+'">'+esc(score)+'</strong>'+
      '<button type="button" data-v62-team="'+esc(away)+'">'+homeOfficialLogo(away)+'<span>'+esc(away)+'</span></button>'+
    '</div>'+
    '<div class="v78-calendar-meta"><b>'+status+'</b><span>Jornada '+esc(r[1]||'')+' · '+esc(venue)+'</span></div>'+
  '</article>';
}
function patchHomeCalendarResults(force=false){
  if(route()!=='home'||!db)return;
  const screen=document.querySelector('#screen');if(!screen)return;
  const sections=[...screen.querySelectorAll('.section')];
  let section=sections.find(el=>/Calendario\s+y\s+resultados/i.test(el.querySelector('.section-head h2,h2')?.textContent||''));
  if(!section)section=sections.find(el=>/Próximos\s+partidos/i.test(el.querySelector('.section-head h2,h2')?.textContent||''));
  if(!section)return;

  const items=officialHomeCalendarItems();
  const sig=String(db.captured_at_utc||'')+'|'+items.map(x=>x.id+':'+x.index+':'+[x.r[3],x.r[5],x.r[8]].join(':')).join('|');
  if(!force&&section.dataset.v78CalendarSig===sig)return;
  section.dataset.v78CalendarSig=sig;
  section.classList.add('v78-home-calendar');

  let head=section.querySelector('.section-head');
  if(!head){
    head=document.createElement('div');head.className='section-head';section.prepend(head);
  }
  head.innerHTML='<h2>Calendario y resultados</h2><button type="button" class="link-button" data-safe-route="v4-calendar">Abrir calendario</button>';
  [...section.children].forEach(el=>{if(el!==head)el.remove()});

  const wrap=document.createElement('div');
  wrap.className='v78-calendar-track';
  wrap.innerHTML=items.length?items.map(homeCalendarCard).join(''):
    '<div class="v78-calendar-empty">No hay partidos oficiales publicados para mostrar.</div>';
  section.appendChild(wrap);

  const stamp=document.createElement('p');
  stamp.className='v78-calendar-source';
  stamp.textContent='Fuente deportiva oficial · '+sourceStamp()+' · los marcadores aparecen solo cuando la Liga los publica.';
  section.appendChild(stamp);

  section.querySelectorAll('[data-v62-team]').forEach(b=>{
    b.addEventListener('click',e=>{e.preventDefault();openTeam(b.dataset.v62Team)},{once:true});
  });
}
async function refreshOfficialData(){
  const fresh=await fetchJson(REMOTE_DATA+'&ts='+Date.now());
  if(!fresh)return;
  const selected=chooseNewer(db,fresh);
  // Evita refrescos de pantalla cada minuto cuando el espejo sigue atrasado.
  if(selected===db)return;
  const changed=!db||dataFingerprint(selected)!==dataFingerprint(db);
  if(changed){
    publishData(preserveBlueRegistrations(selected));
    patchHomeCalendarResults(true);
    patchHomeStandings(true);
    patchHomeScorers(true);
    patchScorers(true);
    patchTeamDetail();
    patchTeams();
  }
}
function startOfficialRefreshTimer(){
  if(officialRefreshTimer)return;
  officialRefreshTimer=setInterval(refreshOfficialData,60000);
}

/* V73 — Clasificación de Inicio tomada únicamente de Primera Fuerza oficial.
   Sustituye cualquier tabla heredada con equipos antiguos/ficticios. */
function patchHomeStandings(force=false){
  if(route()!=='home'||!db)return;
  const section=document.querySelector('#screen .v65-home-table');
  if(!section)return;

  const block=db?.categories?.['3']?.standings?.[0];
  const rs=(block?.rows||[]).filter(r=>Array.isArray(r)&&r[1]).slice(0,6);
  if(!rs.length)return;

  const sig=String(db.captured_at_utc||'')+'|'+rs.map(r=>[r[1],r[2],r[8],r[9]].join(':')).join('|');
  if(!force&&section.dataset.v73StandingsSig===sig)return;
  section.dataset.v73StandingsSig=sig;

  const heading=section.querySelector('.section-head h2');
  if(heading)heading.textContent='Clasificación';
  const link=section.querySelector('.section-head .link-button');
  if(link){
    link.textContent='Ver completa';
    link.dataset.v63Comp='standings';
  }

  let card=section.querySelector('.v65-table-card');
  if(!card){
    card=document.createElement('div');
    card.className='v65-table-card';
    section.appendChild(card);
  }

  const rowHtml=(r,i)=>{
    const name=String(r[1]||'').trim();
    const src=logoFor(name);
    const display=name.toLowerCase().replace(/(^|\s)\S/g,m=>m.toUpperCase())
      .replace(/\bFc\b/g,'FC').replace(/\bCdg\b/g,'CDG');
    const logo=src
      ? '<span class="v65-table-logo"><img src="'+esc(src)+'" alt="'+esc(display)+'" loading="lazy" decoding="async"></span>'
      : '<span class="v65-table-logo v65-table-logo-fallback">'+esc(name.split(/\s+/).map(x=>x[0]).join('').slice(0,3))+'</span>';

    return '<button type="button" class="v65-table-row" data-v62-team="'+esc(name)+'" aria-label="Ver '+esc(display)+'">'+
      '<b>'+(i+1)+'</b>'+
      '<span class="v65-table-team">'+logo+'<strong>'+esc(display)+'</strong></span>'+
      '<span>'+esc(r[2]??'')+'</span>'+
      '<span>'+esc(r[8]??'')+'</span>'+
      '<strong>'+esc(r[9]??'')+'</strong>'+
    '</button>';
  };

  card.innerHTML=
    '<div class="v65-table-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>Pts</span></div>'+
    rs.map(rowHtml).join('');

  card.querySelectorAll('[data-v62-team]').forEach(b=>{
    b.addEventListener('click',e=>{e.preventDefault();openTeam(b.dataset.v62Team)},{once:true});
  });
}

/* V74 — Máximos goleadores de Inicio con nombres/equipos reales.
   Primera Fuerza se usa primero. Si todavía no publica goleo, se muestran
   únicamente goleadores oficiales de las demás categorías con datos,
   nunca jugadores ni goles inventados. */
function validScorerRows(id){
  const c=cat(id),rs=c?.scorers?.[0]?.rows||[];
  return rs.filter(r=>Array.isArray(r)&&r.length>=4&&/^\d+$/.test(String(r[3]||''))&&String(r[1]||'').trim()&&String(r[2]||'').trim()&&!/goles?\s+en\s+temporada/i.test(String(r[2]||'')))
    .map(r=>({rank:Number(r[0])||999,player:String(r[1]).trim(),team:String(r[2]).trim(),goals:Number(r[3])||0,category:c?.name||CAT_META[String(id)]?.name||'',categoryId:String(id)}));
}
function officialHomeScorers(){
  const primary=validScorerRows('3');
  if(primary.length)return primary.sort((a,b)=>b.goals-a.goals||a.rank-b.rank).slice(0,4);
  return CAT_ORDER.flatMap(id=>validScorerRows(id))
    .sort((a,b)=>b.goals-a.goals||a.rank-b.rank||a.player.localeCompare(b.player,'es'))
    .slice(0,4);
}
function homeScorerRow(s,i){
  const src=logoFor(s.team);
  const logo=src
    ? '<span class="v74-scorer-logo"><img src="'+esc(src)+'" alt="'+esc(s.team)+'" loading="lazy" decoding="async"></span>'
    : '<span class="v74-scorer-logo v74-scorer-fallback">'+esc(s.team.split(/\s+/).map(x=>x[0]).join('').slice(0,3))+'</span>';
  return '<button type="button" class="v74-scorer-row" data-v62-team="'+esc(s.team)+'">'+
    '<span class="v74-scorer-rank">'+(i+1)+'</span>'+logo+
    '<span class="v74-scorer-copy"><strong>'+esc(s.player)+'</strong><small>'+esc(s.team)+(s.categoryId!=='3'?' · '+esc(s.category):'')+'</small></span>'+
    '<b class="v74-scorer-goals">'+esc(s.goals)+'</b>'+
  '</button>';
}
function patchHomeScorers(force=false){
  if(route()!=='home'||!db)return;
  const screen=document.querySelector('#screen');if(!screen)return;
  const sections=[...screen.querySelectorAll('.section')];
  let section=sections.find(s=>/máximos?\s+goleadores?|maximos?\s+goleadores?/i.test(s.querySelector('.section-head h2,h2')?.textContent||''));
  if(!section)return;

  const scorers=officialHomeScorers();
  const sig=String(db.captured_at_utc||'')+'|'+scorers.map(s=>[s.player,s.team,s.goals,s.categoryId].join(':')).join('|');
  if(!force&&section.dataset.v74ScorerSig===sig)return;
  section.dataset.v74ScorerSig=sig;
  section.classList.add('v74-home-scorers');

  const head=section.querySelector('.section-head');
  if(head){
    const h=head.querySelector('h2');if(h)h.textContent='Máximos goleadores';
    const link=head.querySelector('.link-button,button');
    if(link){
      link.textContent='Ver ranking';
      link.setAttribute('data-route','scorers');
      link.removeAttribute('data-v63-comp');
    }
  }

  [...section.children].forEach(el=>{if(el!==head)el.remove()});
  const card=document.createElement('div');
  card.className='v74-scorer-card';
  if(scorers.length){
    card.innerHTML=scorers.map(homeScorerRow).join('')+
      '<p class="v74-scorer-note">'+
      (validScorerRows('3').length?'Primera Fuerza · datos oficiales':'Goleadores oficiales publicados · Primera Fuerza aún sin tabla de goleo')+
      '</p>';
  }else{
    card.innerHTML='<div class="v74-scorer-empty"><b>Sin goleadores publicados</b><span>Liga Juventino Rosas todavía no registra goles oficiales para mostrar.</span></div>';
  }
  section.appendChild(card);
  card.querySelectorAll('[data-v62-team]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openTeam(b.dataset.v62Team)},{once:true}));
}
function dataFingerprint(x){
  if(!x?.categories)return '';
  const checksum=source=>{const str=JSON.stringify(source||[]);let h=2166136261;for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);return (h>>>0).toString(16)};
  const parts=[String(x.captured_at_utc||'')];
  for(const id of CAT_ORDER){
    const c=x.categories?.[id]||{};
    const count=k=>(c[k]||[]).reduce((n,b)=>n+(Array.isArray(b?.rows)?b.rows.length:0),0);
    const players=Object.values(c.rosters||{}).reduce((n,v)=>n+(Array.isArray(v)?v.length:(v?.players?.length||v?.rows?.length||0)),0);
    parts.push([id,count('standings'),count('fixtures'),count('scorers'),count('cards'),count('suspensions'),Object.keys(c.rosters||{}).length,players,checksum(c.fixtures),checksum(c.standings),checksum(c.scorers),checksum(c.cards),checksum(c.suspensions)].join(':'));
  }
  return parts.join('|');
}
function dataRichness(x){
  if(!x?.categories)return 0;
  let total=0;
  for(const id of CAT_ORDER){
    const c=x.categories?.[id]||{};
    for(const k of ['standings','fixtures','scorers','cards','suspensions']){
      total+=(c[k]||[]).reduce((n,b)=>n+(Array.isArray(b?.rows)?b.rows.length:0),0);
    }
    total+=Object.values(c.rosters||{}).reduce((n,v)=>n+(Array.isArray(v)?v.length:(v?.players?.length||v?.rows?.length||0)),0);
  }
  return total;
}
function chooseNewer(a,b){
  if(!a)return b;if(!b)return a;
  // El rol manual es más reciente que el último espejo verde: no dejar que un
  // snapshot antiguo revierta sedes, horas o decisiones administrativas.
  // Preservar marcadores finales confirmados por el usuario frente a un espejo anterior.
  const verifiedStamp=String(a.latest_user_verified_results?.applied_at_utc||'');
  if(verifiedStamp&&String(b.captured_at_utc||'')<verifiedStamp)return a;
  const manualStamp=String(a.manual_fixture_update?.applied_at_utc||'');
  if(manualStamp&&String(b.captured_at_utc||'')<manualStamp)return a;
  const ta=String(a.captured_at_utc||''),tb=String(b.captured_at_utc||'');
  if(tb>ta)return b;
  if(ta>tb)return a;
  if(dataFingerprint(a)===dataFingerprint(b))return a;
  return dataRichness(b)>=dataRichness(a)?b:a;
}
/* Mantiene los registros y retratos oficiales sincronizados en la app azul,
   incluso si Liga_Futbol publica un snapshot deportivo mas reciente. */
let localRegistrationSnapshot=null;
function preserveBlueRegistrations(base){
  const local=localRegistrationSnapshot;
  if(!base?.categories||!local?.categories||base===local)return base;
  const categories={...base.categories};
  for(const id of CAT_ORDER){
    const own=local.categories[id],older=base.categories[id];
    if(!own||!older)continue;
    const rosters={...(older.rosters||{})},profiles={...(older.player_profiles||{})};
    for(const [team,entries] of Object.entries(own.rosters||{})){
      const key=Object.keys(rosters).find(t=>same(t,team))||team;
      const list=Array.isArray(rosters[key])?[...rosters[key]]:[];
      const known=new Set(list.map(norm));
      for(const name of Array.isArray(entries)?entries:[]){
        if(!known.has(norm(name))){list.push(name);known.add(norm(name))}
      }
      rosters[key]=list;
    }
    for(const [team,entries] of Object.entries(own.player_profiles||{})){
      const key=Object.keys(profiles).find(t=>same(t,team))||team;
      const list=Array.isArray(profiles[key])?profiles[key].map(x=>({...x})):[];
      const known=new Map(list.map((p,i)=>[norm(p.name),i]));
      for(const p of Array.isArray(entries)?entries:[]){
        if(!p?.name)continue;
        const n=norm(p.name),index=known.get(n);
        if(index===undefined){list.push({...p});known.set(n,list.length-1)}
        else{
          const current=list[index];
          current.name=p.name;
          for(const field of ['photo','position','dorsal'])if(p[field])current[field]=p[field];
        }
      }
      profiles[key]=list;
    }
    // Los IDs de AdminFut cambian cuando reordena los juegos de una jornada.
    // Aplicar resoluciones conservadas por partido/fecha, nunca por ID ajeno.
    const localRows=(own.fixtures||[]).flatMap(g=>Array.isArray(g.rows)?g.rows:[]);
    const remoteRows=(older.fixtures||[]).flatMap(g=>Array.isArray(g.rows)?g.rows:[]);
    const fixtureKey=r=>[
      String(r[1]||''),norm(r[2]),norm(r[6]),
      String(r[8]||'').trim().split(' ')[0]
    ].join('|');
    const remoteByKey=new Map(remoteRows.map(r=>[fixtureKey(r),r]));
    const localById=new Map(localRows.map(r=>[String(r[0]),r]));
    const fixtureDecisions={...(older.fixture_decisions||{})};
    for(const [localId,decision] of Object.entries(own.fixture_decisions||{})){
      if(!decision?.winner||!decision.default)continue;
      const localFixture=localById.get(localId);
      if(!localFixture)continue;
      const remoteFixture=remoteByKey.get(fixtureKey(localFixture));
      if(!remoteFixture)continue;
      const remoteId=String(remoteFixture[0]);
      // Si la fuente posterior publicó un resultado numérico, respetarlo.
      const hasNewScore=/^\d+$/.test(String(remoteFixture[3]))&&/^\d+$/.test(String(remoteFixture[5]));
      if(!hasNewScore&&!fixtureDecisions[remoteId])fixtureDecisions[remoteId]={...decision};
    }
    // Proteger exclusivamente resultados verificados por el usuario; no
    // reemplazar resultados completos posteriores ni inferir goles.
    const verifiedOverlay=new Map();
    const verified=(local.latest_user_verified_results?.category_id===id
      ?local.latest_user_verified_results.fixtures:[])||[];
    for(const receipt of verified){
      const localFixture=localRows.find(r=>String(r[1])===String(receipt.round)&&
        same(r[2],receipt.home)&&same(r[6],receipt.away)&&
        String(r[8]||'').startsWith(String(receipt.date||'')));
      if(!localFixture)continue;
      const target=remoteByKey.get(fixtureKey(localFixture));
      if(!target)continue;
      const complete=/^\d+$/.test(String(target[3]))&&/^\d+$/.test(String(target[5]));
      if(complete)continue;
      // Registrar una superposición inmutable sin alterar el espejo compartido.
      verifiedOverlay.set(fixtureKey(target),[String(receipt.home_goals),String(receipt.away_goals)]);
    }
    const fixtures=verifiedOverlay.size?(older.fixtures||[]).map(g=>({
      ...g,rows:(g.rows||[]).map(r=>{
        const score=verifiedOverlay.get(fixtureKey(r));
        return score?[...r.slice(0,3),score[0],r[4],score[1],...r.slice(6)]:r;
      })
    })):older.fixtures;
    categories[id]={...older,rosters,player_profiles:profiles,fixture_decisions:fixtureDecisions,fixtures};
  }
  return {...base,categories};
}
async function fetchJson(url){
  try{const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)throw new Error(String(r.status));return await r.json()}catch{return null}
}
let contentBase=null;
function publishData(next){
  if(!next||next===db)return;
  contentBase=next;db=window.LJR_CMS?.applyOfficialData?.(next)||next;
  window.LJR_OFFICIAL_DATA=db;
  window.LJR_OFFICIAL_API={getData:()=>db,applyContent:()=>{if(db){db=window.LJR_CMS?.applyOfficialData?.(contentBase||db)||db;schedule();window.dispatchEvent(new CustomEvent('ljr:official-data'))}},getCategory:id=>cat(id),getTeam:teamContext,getLogo:logoFor,setCategory:setCategory,setDataTab:(id)=>{dataTab=String(id||'summary');localStorage.setItem('v62-data-tab',dataTab);if(route()==='leagueData')renderDataPage()},openTeam};
  if(!cat(categoryId))categoryId='3';
  schedule();
  window.dispatchEvent(new CustomEvent('ljr:official-data'));
}
async function load(){
  // Use the bundled snapshot immediately, then reconcile with the live mirror.
  const local=await fetchJson(LOCAL_DATA);
  localRegistrationSnapshot=local;
  publishData(local);
  startOfficialRefreshTimer();
  const remote=await fetchJson(REMOTE_DATA+'&ts='+Date.now());
  publishData(preserveBlueRegistrations(chooseNewer(db,remote)));
}

function categoryRail(){
  return '<div class="v62-category-rail" role="tablist" aria-label="Categorías de la Liga">'+
    CAT_ORDER.map(id=>{
      const c=cat(id),m=CAT_META[id],on=id===categoryId;
      return '<button type="button" class="'+(on?'active':'')+'" data-v62-cat="'+id+'">'+
        '<span class="v62-cat-logo"><img src="'+esc(catLogo(id))+'" alt="" loading="lazy" decoding="async"></span>'+
        '<span><b>'+esc(c?.name||m.name)+'</b><small>'+esc(c?.counts?.Equipos??c?.dashboard?.counts?.Equipos??0)+' equipos</small></span>'+
      '</button>';
    }).join('')+
  '</div>';
}
function dataTabs(){
  const tabs=[
    ['summary','Resumen'],['standings','Tabla'],['scorers','Goleo'],['cards','Tarjetas'],['suspensions','Castigados'],
    ['fixtures','Jornadas'],['teams','Equipos'],['players','Jugadores'],['rules','Reglamento']
  ];
  return '<div class="v62-data-tabs">'+tabs.map(([id,label])=>'<button type="button" class="'+(dataTab===id?'active':'')+'" data-v62-tab="'+id+'">'+label+'</button>').join('')+'</div>';
}
function v576Profile(name,team){
  const current=cat();
  const entry=Object.entries(current?.player_profiles||{}).find(([t])=>same(t,team));
  const rows=Array.isArray(entry?.[1])?entry[1]:[];
  return rows.find(x=>same(x?.name,name))||null;
}
function v576TablePlayer(name,team){
  const clean=String(name||'').trim();
  if(!clean)return '<strong></strong>';
  let src='';
  try{src=window.LJR_PLAYER_MEDIA?.photo?.(clean,team,categoryId)||window.LJR_PLAYER_PHOTOS?.get?.(clean,team,categoryId)||''}catch(_){}
  if(!src){
    src=String(v576Profile(clean,team)?.photo||'');
  }
  const ini=clean.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
  return '<span class="v576-table-player">'+
    (src?'<span class="v576-table-photo v576-has-photo"><img src="'+esc(src)+'" alt="'+esc(clean)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>':'<span class="v576-table-photo v576-photo-fallback">'+esc(ini)+'</span>')+
    '<strong>'+esc(clean)+'</strong></span>';
}
function genericTable(kind){
  const b=block(kind);
  if(!b||!b.rows?.length)return empty('No hay datos públicos actuales para '+(cat()?.name||'esta categoría')+'.');
  const teamIndex={standings:1,scorers:2,cards:2,suspensions:1}[kind];
  const playerIndex={scorers:1,cards:1,suspensions:0}[kind];
  return '<div class="v62-table-shell"><table class="v62-table"><thead><tr>'+b.headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+
    b.rows.map(r=>'<tr>'+r.map((v,i)=>{
      if(i===teamIndex&&v&&!/expulsado de la liga/i.test(String(v))){
        return '<td><button type="button" class="v62-inline-team" data-v62-team="'+esc(v)+'">'+teamLogoHtml(v,'v62-inline-logo')+'<span>'+esc(v)+'</span></button></td>';
      }
      if(i===playerIndex){
        const team=Number.isInteger(teamIndex)?String(r?.[teamIndex]||''):'';
        const text=String(v||'');
        if(!team||/^(no hay|sin jugadores|sin tarjetas|sin castigos|estado)/i.test(text.trim()))return '<td><strong>'+esc(v)+'</strong></td>';
        return '<td>'+v576TablePlayer(v,team)+'</td>';
      }
      return '<td>'+esc(v)+'</td>';
    }).join('')+'</tr>').join('')+
  '</tbody></table></div>';
}

function summaryTeamsView(current){
  const list=categoryTeams(current).slice(0,8);
  if(!list.length)return '';
  return '<section class="v62-summary-teams-block">'+
    '<div class="v62-summary-teams-head"><span><small>EQUIPOS REGISTRADOS</small><b>'+esc(current?.name||'Categoría')+'</b></span><button type="button" data-v62-tab="teams">Ver todos</button></div>'+
    '<div class="v62-summary-teams">'+list.map(name=>
      '<button type="button" class="v62-summary-team" data-v62-team="'+esc(name)+'">'+
        teamLogoHtml(name,'v62-summary-team-logo')+
        '<span>'+esc(name)+'</span>'+
      '</button>').join('')+'</div>'+
  '</section>';
}
function summaryView(){
  const current=cat(),counts=current?.counts||current?.dashboard?.counts||{};
  const fixtures=rows('fixtures'),scorers=rows('scorers').filter(r=>r.length>=4&&/^\d+$/.test(String(r[3]||'')));
  const goals=scorers.length?scorers.reduce((sum,r)=>sum+scoreNum(r[3]),0):'—';
  return summaryTeamsView(current)+
  '<div class="v62-summary-grid">'+
    '<button type="button" data-v62-tab="teams"><b>'+esc(counts.Equipos??categoryTeams(current).length)+'</b><small>Equipos</small></button>'+
    '<button type="button" data-v62-tab="players"><b>'+esc(counts.Jugadores??0)+'</b><small>Jugadores</small></button>'+
    '<button type="button" data-v62-tab="fixtures"><b>'+esc(fixtures.length)+'</b><small>Partidos</small></button>'+
    '<button type="button" data-v62-tab="scorers"><b>'+esc(goals)+'</b><small>Goleo oficial publicado</small></button>'+
  '</div>'+
  '<div class="v62-summary-actions">'+
    '<button type="button" data-v62-tab="standings">Ver tabla</button>'+
    '<button type="button" data-v62-tab="fixtures">Jornadas</button>'+
    '<button type="button" data-v62-tab="players">Jugadores</button>'+
  '</div>';
}
function v62CalendarDownload(){
  const rs=(block('fixtures')?.rows||[]).filter(r=>parseDate(r[8]));
  if(!rs.length)return;
  const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const clean=s=>String(s??'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const events=rs.map((r,i)=>{
    const start=parseDate(r[8]),end=new Date(start.getTime()+2*60*60*1000);
    return ['BEGIN:VEVENT','UID:ljr-'+categoryId+'-'+i+'-'+start.getTime()+'@liga-juventino','DTSTAMP:'+stamp(new Date()),
      'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+clean((r[2]||'Equipo')+' vs '+(r[6]||'Equipo')),
      'LOCATION:'+clean(r[7]||'Campo por confirmar'),'DESCRIPTION:'+clean((cat()?.name||'Liga Juventino Rosas')+' · Jornada '+(r[1]||'')),'END:VEVENT'].join('\r\n');
  }).join('\r\n');
  const body='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Liga Juventino Rosas//Jornadas//ES\r\n'+events+'\r\nEND:VCALENDAR\r\n';
  const blob=new Blob([body],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='Liga_Juventino_'+String(cat()?.name||'Jornadas').replace(/[^a-z0-9]+/gi,'_')+'.ics';
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function applyPlayerFilters(){
  const input=document.querySelector('[data-v62-player-search]'),q=norm(input?.value||'');
  document.querySelectorAll('[data-v62-search]').forEach(el=>{
    const okText=!q||String(el.dataset.v62Search||'').includes(q);
    const okTeam=playerTeamFilter==='all'||same(el.dataset.v62TeamName||'',playerTeamFilter);
    el.hidden=!(okText&&okTeam);
  });
}

function fixtureCard(r){
  const decision=fixtureDecision(r),pending=!isDecidedFixture(r);
  const defaultLoser=decision?defaultDefeatedTeam(decision,r[2],r[6]):null;
  const home=r[2]||'',away=r[6]||'',hs=r[3]??'',as=r[5]??'';
  const place=r[7]||'Campo por confirmar',when=r[8]||'Fecha por confirmar';
  const friendly=/amistoso/i.test(String(r[1]||''));
  return '<article class="v62-match-card '+(pending?'pending':'played')+'">'+
    '<div class="v62-match-head"><span>'+esc(friendly?'Amistoso':'Jornada '+(r[1]||''))+'</span><b>'+esc(decision?decision.label:(pending?'PENDIENTE':'PARTIDO'))+'</b></div>'+
    '<div class="v62-match-team"><button type="button" data-v62-team="'+esc(home)+'">'+teamLogoHtml(home)+'<span>'+esc(home)+'</span></button><strong>'+esc(decision?'—':hs)+'</strong></div>'+
    '<div class="v62-match-team"><button type="button" data-v62-team="'+esc(away)+'">'+teamLogoHtml(away)+'<span>'+esc(away)+'</span></button><strong>'+esc(decision?'—':as)+'</strong></div>'+
    '<div class="v62-match-meta"><span>'+esc(when)+'</span><span>'+esc(decision?(defaultLoser?'DEFAULT · −3 pts a '+defaultLoser+' · sin marcador confirmado':'Resultado administrativo · sin marcador confirmado'):place)+'</span></div>'+
  '</article>';
}
function fixturesView(){
  const b=block('fixtures');
  if(!b||!b.rows?.length)return empty('No hay jornadas publicadas para esta categoría.');
  const all=b.rows.slice();
  const shown=fixtureFilter==='upcoming'?all.filter(r=>!isDecidedFixture(r)):fixtureFilter==='played'?all.filter(isDecidedFixture):all;
  const groups={};
  shown.forEach(r=>(groups[r[1]||'?']||(groups[r[1]||'?']=[])).push(r));
  const pending=all.filter(r=>!isDecidedFixture(r)&&!!parseDate(r[8])).length;
  return '<div class="v62-fixture-toolbar">'+
      '<div class="v62-fixture-filter">'+
        '<button type="button" class="'+(fixtureFilter==='all'?'active':'')+'" data-v62-fixture-filter="all">Todos</button>'+
        '<button type="button" class="'+(fixtureFilter==='played'?'active':'')+'" data-v62-fixture-filter="played">Jugados</button>'+
        '<button type="button" class="'+(fixtureFilter==='upcoming'?'active':'')+'" data-v62-fixture-filter="upcoming">Próximos</button>'+
      '</div>'+
      '<div class="v62-fixture-actions"><button type="button" data-v62-calendar>Calendario</button><button type="button" data-v62-simulator>Simular jornada</button></div>'+
    '</div>'+
    '<div class="v62-kpis"><span><b>'+all.length+'</b><small>partidos publicados</small></span><span><b>'+pending+'</b><small>próximos con fecha</small></span></div>'+
    (shown.length?Object.entries(groups).map(([j,rs])=>'<section class="v62-round"><h2>'+esc(/amistoso/i.test(j)?'Amistoso':'Jornada '+j)+'</h2><div class="v62-match-grid">'+rs.map(fixtureCard).join('')+'</div></section>').join(''):empty('No hay partidos para este filtro.'));
}
function teamsView(){
  const list=categoryTeams(cat());
  if(!list.length)return empty('No hay equipos públicos actuales en esta categoría.');
  return '<div class="v62-team-grid">'+list.map(n=>'<button type="button" class="v62-team-card" data-v62-team="'+esc(n)+'">'+teamLogoHtml(n)+'<b>'+esc(n)+'</b><small>Ver equipo</small></button>').join('')+'</div>';
}
function playersView(){
  const c=cat(),rosters=c?.rosters||{};
  const entries=Object.entries(rosters);
  if(!entries.length)return empty('La fuente pública no expone jugadores actuales para esta categoría.');
  if(playerTeamFilter!=='all'&&!entries.some(([t])=>same(t,playerTeamFilter)))playerTeamFilter='all';
  return '<div class="v62-player-tools"><select data-v62-team-filter aria-label="Filtrar por equipo">'+
      '<option value="all">Todos los equipos</option>'+
      entries.map(([team])=>'<option value="'+esc(team)+'" '+(same(team,playerTeamFilter)?'selected':'')+'>'+esc(team)+'</option>').join('')+
    '</select><div class="v62-player-search"><input type="search" data-v62-player-search placeholder="Buscar jugador o equipo" autocomplete="off"></div></div>'+
    '<div data-v62-player-list>'+entries.map(([team,players])=>'<section class="v62-roster-group" data-v62-team-name="'+esc(team)+'" data-v62-search="'+esc(norm(team+' '+players.join(' ')))+'"><button type="button" class="v62-roster-title" data-v62-team="'+esc(team)+'">'+teamLogoHtml(team,'v62-inline-logo')+'<b>'+esc(team)+'</b><span>'+players.length+' jugadores</span></button>'+
      '<div>'+players.map(name=>{const p=v576Profile(name,team)||{};return '<p class="v576-roster-player">'+v576TablePlayer(name,team)+'<small>'+esc(p.position||'Posición no publicada')+(p.dorsal?' · #'+esc(p.dorsal):'')+'</small></p>'}).join('')+'</div></section>').join('')+'</div>';
}
function rulesView(){
  return '<article class="v62-rules-card"><div class="v62-rules-icon">▤</div><div><small>REGLAMENTO OFICIAL</small><h2>Liga Municipal de Fútbol Juventino Rosas A. C.</h2><p>Reglamento 2026–2027 disponible desde el repositorio oficial de la Liga.</p></div>'+
    '<a href="'+RULEBOOK+'" target="_blank" rel="noopener">Abrir reglamento PDF</a></article>';
}
function empty(msg){return '<div class="v62-empty"><span>⚽</span><p>'+esc(msg)+'</p></div>'}
function dataBody(){
  if(dataTab==='summary')return summaryView();
  if(dataTab==='fixtures')return fixturesView();
  if(dataTab==='teams')return teamsView();
  if(dataTab==='players')return playersView();
  if(dataTab==='rules')return rulesView();
  return genericTable(dataTab);
}
function renderDataPage(){
  const screen=document.querySelector('#screen');if(!screen||!db)return;
  document.body.classList.add('v62-data-active');
  screen.innerHTML='<section class="v62-data-page" data-v62-page>'+
    '<header class="v62-data-head"><button type="button" data-v62-back aria-label="Volver">‹</button><span class="v62-data-head-logo"><img src="'+esc(catLogo(categoryId))+'" alt="" loading="eager" decoding="async"></span><div><small>DATOS OFICIALES DE LA LIGA</small><h1>Datos de la Liga</h1><p>'+esc(cat()?.name||'Categoría')+' · '+esc(sourceStamp())+'</p></div></header>'+
    categoryRail()+dataTabs()+
    '<main class="v62-data-body" data-v62-body><div class="v62-source-line"><b>'+esc(cat()?.name||'Categoría')+'</b><span>'+esc((cat()?.counts||cat()?.dashboard?.counts||{}).Jugadores??0)+' jugadores · '+esc((cat()?.counts||cat()?.dashboard?.counts||{}).Equipos??0)+' equipos</span></div>'+dataBody()+'</main>'+
  '</section>';
  setMoreNav();
  bindData();
}
function bindData(){
  document.querySelector('[data-v62-back]')?.addEventListener('click',()=>{location.hash='#/more'},{once:true});
  document.querySelectorAll('[data-v62-cat]').forEach(b=>b.addEventListener('click',()=>{setCategory(b.dataset.v62Cat);renderDataPage()},{once:true}));
  document.querySelectorAll('[data-v62-tab]').forEach(b=>b.addEventListener('click',()=>{dataTab=b.dataset.v62Tab;localStorage.setItem('v62-data-tab',dataTab);renderDataPage()},{once:true}));
  document.querySelectorAll('[data-v62-team]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openTeam(b.dataset.v62Team)},{once:true}));
  document.querySelectorAll('[data-v62-fixture-filter]').forEach(b=>b.addEventListener('click',()=>{fixtureFilter=b.dataset.v62FixtureFilter||'all';localStorage.setItem('v62-fixture-filter',fixtureFilter);renderDataPage()},{once:true}));
  document.querySelector('[data-v62-calendar]')?.addEventListener('click',v62CalendarDownload,{once:true});
  document.querySelector('[data-v62-simulator]')?.addEventListener('click',()=>{location.hash='#/simulator'},{once:true});
  const teamFilter=document.querySelector('[data-v62-team-filter]');
  if(teamFilter)teamFilter.addEventListener('change',()=>{playerTeamFilter=teamFilter.value||'all';localStorage.setItem('v62-player-team-filter',playerTeamFilter);applyPlayerFilters()});
  const input=document.querySelector('[data-v62-player-search]');
  if(input)input.addEventListener('input',applyPlayerFilters);
  applyPlayerFilters();
}
function setCategory(id){
  id=String(id);
  if(!cat(id))return;
  categoryId=id;localStorage.setItem('v62-category',id);
  if(route()==='scorers')patchScorers(true);
  if(route()==='leagueData')renderDataPage();
}
function setMoreNav(){/* Global nav active state is owned by V34. */}

function scorerRows(){
  const rs=rows('scorers');
  return rs.filter(r=>r.length>=4&&/^\d+$/.test(String(r[3]||''))&&!/goles?\s+en\s+temporada/i.test(String(r[2]||'')));
}
function scorerFeature(r,idx){
  const p=v576Profile(r[1],r[2])||{},photo=String(p.photo||window.LJR_PLAYER_MEDIA?.photo?.(r[1],r[2],categoryId)||'');
  return '<article class="v28-feature">'+
    '<div class="v28-feature-photo '+(idx===0?'one':'two')+'">'+(photo?'<img class="v576-v28-feature-photo" src="'+esc(photo)+'" alt="'+esc(r[1])+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">':'')+'<button type="button" class="v28-feature-play" data-v62-team="'+esc(r[2])+'" aria-label="Ver equipo '+esc(r[2])+'"></button></div>'+
    '<div class="v28-feature-info"><div class="v28-feature-person">'+v576TablePlayer(r[1],r[2])+'<span><b>'+teamLogoHtml(r[2],'v62-inline-logo')+esc(r[2])+'</b><small>'+esc(r[1])+'</small></span></div><div class="v28-feature-goals"><b>'+esc(r[3])+'</b><small>goles</small></div></div>'+
  '</article>';
}
function scorerRow(r,i){
  return '<button type="button" class="v28-rank-row v576-v28-player" data-v62-team="'+esc(r[2])+'">'+
    '<span class="v28-rank-number">#'+esc(r[0]||i+1)+'</span>'+v576TablePlayer(r[1],r[2])+
    '<span class="v28-rank-copy"><b>'+teamLogoHtml(r[2],'v62-inline-logo')+esc(r[2])+'</b><small>'+esc(r[1])+'</small></span><strong class="v28-rank-goals">'+esc(r[3])+'</strong></button>';
}
function teamGoalRows(){
  const rs=rows('standings');
  return rs.filter(r=>Array.isArray(r)&&r.length>=7&&String(r[1]||'').trim()&&/^\d+$/.test(String(r[6]||'')))
    .map(r=>({team:String(r[1]).trim(),played:Number(r[2])||0,goals:Number(r[6])||0}))
    .sort((a,b)=>b.goals-a.goals||b.played-a.played||a.team.localeCompare(b.team,'es'));
}
function scorerFallback(){
  const teams=teamGoalRows();
  const played=(rows('fixtures')||[]).filter(isPlayedFixture).length;
  const total=teams.reduce((sum,t)=>sum+t.goals,0);
  if(!played&&!total){
    return empty('La fuente oficial todavía no publica datos de goleo para '+(cat()?.name||'esta categoría')+'.');
  }
  return '<section class="v81-scorer-fallback">'+
    '<div class="v81-scorer-state"><span>⚽</span><div><b>Los resultados oficiales sí están registrados</b>'+
      '<p>'+esc(cat()?.name||'')+' tiene '+esc(played)+' partidos con marcador y '+esc(total)+' goles a favor acumulados en la tabla.</p>'+
      '<small>El snapshot actual no trae todavía el desglose individual de goleadores de esta categoría. No se inventan nombres ni goles.</small></div></div>'+
    '<div class="v81-team-goals-title"><b>Goles por equipo</b><span>GF oficiales</span></div>'+
    '<div class="v81-team-goals">'+teams.map((t,i)=>
      '<button type="button" data-v62-team="'+esc(t.team)+'">'+
        '<span class="v81-team-rank">#'+(i+1)+'</span>'+teamLogoHtml(t.team,'v81-team-logo')+
        '<span><b>'+esc(t.team)+'</b><small>'+esc(t.played)+' PJ</small></span><strong>'+esc(t.goals)+'</strong>'+
      '</button>').join('')+'</div>'+
    '<button type="button" class="v81-refresh-scorers" data-v62-refresh-scorers>Actualizar goleadores</button>'+
  '</section>';
}
function scorerCategoryTable(id=categoryId){
  const current=cat(id),name=current?.name||CAT_META[String(id)]?.name||'Categoría';
  const rs=rows('scorers',id).filter(r=>Array.isArray(r)&&r.length>=4&&String(r[1]||'').trim()&&String(r[2]||'').trim()&&/^\d+$/.test(String(r[3]||''))&&!/goles?\s+en\s+temporada/i.test(String(r[2]||'')));
  if(rs.length){
    return '<section class="v193-scorer-table" data-v193-scorer-table data-v193-cat="'+esc(id)+'">'+
      '<div class="v193-scorer-head"><span class="v193-cat-logo"><img src="'+esc(catLogo(id))+'" alt=""></span><span><small>GOLEADORES POR CATEGORÍA</small><h2>'+esc(name)+'</h2></span></div>'+
      '<div class="v193-scorer-columns"><span>#</span><span>Jugador / equipo</span><span>Goles</span></div>'+
      '<div class="v193-scorer-rows">'+rs.map((r,i)=>
        '<button type="button" class="v193-scorer-row" data-v62-team="'+esc(r[2])+'">'+
          '<span class="v193-rank">#'+esc(r[0]||i+1)+'</span>'+
          teamLogoHtml(r[2],'v193-team-logo')+
          '<span class="v193-player"><b>'+esc(r[1])+'</b><small>'+esc(r[2])+'</small></span>'+
          '<strong>'+esc(r[3])+'</strong>'+
        '</button>').join('')+'</div>'+
    '</section>';
  }
  const teams=rows('standings',id)
    .filter(r=>Array.isArray(r)&&r.length>=7&&String(r[1]||'').trim()&&/^\d+$/.test(String(r[6]||'')))
    .map(r=>({team:String(r[1]).trim(),played:Number(r[2])||0,goals:Number(r[6])||0}))
    .sort((a,b)=>b.goals-a.goals||b.played-a.played||a.team.localeCompare(b.team,'es'));
  return '<section class="v193-scorer-table" data-v193-scorer-table data-v193-cat="'+esc(id)+'">'+
    '<div class="v193-scorer-head"><span class="v193-cat-logo"><img src="'+esc(catLogo(id))+'" alt=""></span><span><small>GOLES POR EQUIPO · CATEGORÍA</small><h2>'+esc(name)+'</h2><p>La fuente oficial aún no publica goleadores individuales; se muestran los GF oficiales de la tabla.</p></span></div>'+
    '<div class="v193-scorer-columns team"><span>#</span><span>Equipo</span><span>GF</span></div>'+
    '<div class="v193-scorer-rows">'+(teams.length?teams.map((t,i)=>
      '<button type="button" class="v193-scorer-row" data-v62-team="'+esc(t.team)+'">'+
        '<span class="v193-rank">#'+(i+1)+'</span>'+
        teamLogoHtml(t.team,'v193-team-logo')+
        '<span class="v193-player"><b>'+esc(t.team)+'</b><small>'+esc(t.played)+' PJ · '+esc(name)+'</small></span>'+
        '<strong>'+esc(t.goals)+'</strong>'+
      '</button>').join(''):'<div class="v193-empty">Todavía no hay datos de goleo publicados para esta categoría.</div>')+'</div>'+
  '</section>';
}
function scorerBottomCategorySwitch(){
  return '<section class="v193-category-switch"><div><small>CAMBIAR TABLA</small><h3>Categoría</h3></div><div class="v193-category-buttons">'+
    CAT_ORDER.map(id=>{
      const current=cat(id),active=String(id)===String(categoryId);
      return '<button type="button" class="'+(active?'active':'')+'" data-v62-cat="'+esc(id)+'">'+esc(current?.name||CAT_META[id]?.name||id)+'</button>';
    }).join('')+
  '</div></section>';
}
function patchScorers(force=false){
  /* V394: V194 owns the scorers route. Never overwrite its reference UI. */
  if(window.__LJR_SCORERS_UI_OWNER__==='v194-reference'||window.__LJR_V194_SCORERS__)return;
  if(route()!=='scorers'||!db)return;
  const page=document.querySelector('[data-v28-scorers]');if(!page)return;
  const sig='v193:'+categoryId+':'+String(db.captured_at_utc||'');
  if(!force&&page.dataset.v62Sig===sig)return;
  page.dataset.v62Sig=sig;
  page.innerHTML=
    '<div class="v193-scorer-title"><small>MÁXIMO GOLEADOR</small><h1>Goleo oficial</h1><p>Clasificado por categoría con el escudo oficial de cada equipo.</p></div>'+
    scorerCategoryTable(categoryId)+
    scorerBottomCategorySwitch()+
    '<p class="v28-criteria">Datos deportivos públicos · '+esc(cat()?.name||'')+' · '+esc(sourceStamp())+'</p>';
  page.querySelectorAll('[data-v62-cat]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.v62Cat),{once:true}));
  page.querySelectorAll('[data-v62-team]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openTeam(b.dataset.v62Team)},{once:true}));
}

function teamStanding(ctx){
  return ctx?.c?.standings?.[0]?.rows?.find(r=>same(r[1],ctx.name))||null;
}
function teamFixtures(ctx){
  return (ctx?.c?.fixtures?.[0]?.rows||[]).filter(r=>same(r[2],ctx.name)||same(r[6],ctx.name));
}
function teamForm(ctx){
  const games=teamFixtures(ctx).map(r=>({r,d:parseDate(r[8])})).filter(x=>x.d&&x.d.getTime()<=Date.now()&&isPlayedFixture(x.r)).sort((a,b)=>a.d-b.d);
  return games.slice(-5).map(({r})=>{
    const home=same(r[2],ctx.name),a=scoreNum(r[3]),b=scoreNum(r[5]);
    if(a===b)return 'E';
    return (home?a>b:b>a)?'V':'D';
  });
}
function teamScorers(ctx){
  return (ctx?.c?.scorers?.[0]?.rows||[]).filter(r=>r.length>=4&&same(r[2],ctx.name)&&/^\d+$/.test(String(r[3]||''))&&!/goles?\s+en\s+temporada/i.test(String(r[2]||'')));
}
function teamCards(ctx){
  return (ctx?.c?.cards?.[0]?.rows||[]).filter(r=>r.length>=4&&same(r[2],ctx.name));
}
function teamSuspensions(ctx){
  return (ctx?.c?.suspensions?.[0]?.rows||[]).filter(r=>r.length>=2&&same(r[1],ctx.name));
}
function miniOfficial(name){
  return '<span class="v42-mini-team">'+teamLogoHtml(name,'v62-v42-logo')+'<b>'+esc(name)+'</b></span>';
}
function officialRoster(ctx){
  const pair=Object.entries(ctx?.c?.rosters||{}).find(([k])=>same(k,ctx.name));
  return pair?.[1]||[];
}
function patchTeamDetail(){
  if(route()!=='teamDetail'||!db)return;
  const page=document.querySelector('[data-v42-reference="teamDetail"]');if(!page)return;
  let ctx=selectedOfficialTeam();
  if(!ctx){
    const h=page.querySelector('.v42-title h1')?.textContent||'';
    ctx=teamContext(h);
  }
  if(!ctx)return;
  saveTeam(ctx.name);
  const active=(page.querySelector('.v42-tabs .active')?.textContent||'Resumen').trim();
  const sig=ctx.id+':'+norm(ctx.name)+':'+active+':'+String(db.captured_at_utc||'');
  if(page.dataset.v62Sig===sig)return;
  page.dataset.v62Sig=sig;

  const crest=page.querySelector('.v42-team-crest'),src=logoFor(ctx.name);
  if(crest&&src){crest.src=src;crest.alt=ctx.name}
  const h1=page.querySelector('.v42-title h1');if(h1)h1.textContent=ctx.name;
  const sub=page.querySelector('.v42-title p');if(sub)sub.textContent=ctx.c.name+' · Juventino Rosas, Guanajuato';

  if(/Plantilla/i.test(active))patchTeamRoster(page,ctx);
  else if(/Clasificaci/i.test(active))patchTeamStandings(page,ctx);
  else if(/Partidos/i.test(active))patchTeamMatches(page,ctx);
  else if(/Estad/i.test(active))patchTeamStats(page,ctx);
  else patchTeamSummary(page,ctx);

  page.querySelectorAll('[data-v62-team]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openTeam(b.dataset.v62Team)},{once:true}));
}
function patchTeamRoster(page,ctx){
  const host=page.querySelector('.v42-squad');if(!host)return;
  const ps=officialRoster(ctx);
  host.innerHTML='<section class="v42-roster-card"><h2>Jugadores registrados · '+esc(ctx.c.name)+'</h2><div class="v42-roster-list">'+
    (ps.length?ps.map((p,i)=>'<button type="button" class="v42-player-row"><span class="v42-avatar v62-player-initial">'+esc(String(p).split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase())+'</span><span class="v42-player-copy"><strong>'+esc(p)+'</strong><small>'+esc(ctx.name)+'</small></span><b class="v42-number">—</b></button>').join(''):
      '<div class="v62-empty-inline">No hay nombres públicos actuales.</div>')+
    '</div></section>';
}
function patchTeamStandings(page,ctx){
  const host=page.querySelector('.v42-standings');if(!host)return;
  const rs=ctx.c.standings?.[0]?.rows||[];
  host.innerHTML='<div class="v42-table-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>'+
    rs.map(r=>'<button type="button" class="'+(same(r[1],ctx.name)?'current':'')+'" data-v62-team="'+esc(r[1])+'"><span>'+esc(r[0])+'</span><span>'+miniOfficial(r[1])+'</span><span>'+esc(r[2])+'</span><span>'+esc(r[8])+'</span><strong>'+esc(r[9])+'</strong></button>').join('');
  const label=page.querySelector('.v42-section-head span');if(label)label.textContent=ctx.c.name;
}
function patchTeamMatches(page,ctx){
  const section=page.querySelector('.v42-tab-page .v42-section');if(!section)return;
  const games=teamFixtures(ctx).slice().sort((a,b)=>(parseDate(a[8])?.getTime()||0)-(parseDate(b[8])?.getTime()||0));
  const past=games.filter(r=>!isFutureFixture(r)),future=games.filter(isFutureFixture);
  const card=r=>'<article class="v42-match-card"><h3>'+esc(r[8]||'Fecha por confirmar')+' · '+esc(ctx.c.name)+' · Jornada '+esc(r[1])+'</h3><div class="v42-match-body"><div class="v42-score-list"><div>'+miniOfficial(r[2])+'<strong>'+esc(r[3])+'</strong></div><div>'+miniOfficial(r[6])+'<strong>'+esc(r[5])+'</strong></div></div><div class="v42-match-time">'+esc(r[7]||'Campo por confirmar')+'</div></div></article>';
  section.innerHTML='<h2 class="v42-page-heading">Partidos anteriores</h2>'+ (past.length?past.map(card).join(''):'<div class="v62-empty-inline">Sin partidos anteriores publicados.</div>')+
    '<h2 class="v42-page-heading next">Próximos partidos</h2>'+ (future.length?future.map(card).join(''):'<div class="v62-empty-inline">Sin próximos partidos publicados.</div>');
}
function patchTeamStats(page,ctx){
  if(window.__LJR_V374_TEAM_STATS_REFERENCE__)return;
  const host=page.querySelector('.v42-stats');if(!host)return;
  const st=teamStanding(ctx),cards=teamCards(ctx),susp=teamSuspensions(ctx),goals=teamScorers(ctx).reduce((a,r)=>a+scoreNum(r[3]),0);
  const vals=st||['','',0,0,0,0,0,0,0,0];
  const yell=cards.filter(r=>/^amar/i.test(r[0])).reduce((a,r)=>a+scoreNum(r[3]),0);
  const red=cards.filter(r=>/^roja/i.test(r[0])).reduce((a,r)=>a+scoreNum(r[3]),0);
  host.innerHTML='<section class="v42-key-card"><div class="v42-key-head"><h2>Datos oficiales</h2><span>⌃</span></div><div class="v42-key-grid">'+
    '<div class="v42-ring"><b>'+esc(vals[2])+'</b><small>Partidos<br>disputados</small></div>'+
    '<div class="v42-wdl"><p><i></i>Ganados <b>'+esc(vals[3])+'</b></p><p><i></i>Empates <b>'+esc(vals[4])+'</b></p><p><i></i>Perdidos <b>'+esc(vals[5])+'</b></p></div>'+
    '<div><b>'+esc(vals[6])+'</b><small>Goles a favor</small></div><div><b>'+esc(vals[7])+'</b><small>Goles en contra</small></div>'+
    '<div><b>'+esc(vals[8])+'</b><small>Diferencia</small></div><div><b>'+esc(vals[9])+'</b><small>Puntos</small></div>'+
    '<div><b>'+esc(goals)+'</b><small>Goles registrados en tabla de goleo</small></div><div><b>'+esc(susp.length)+'</b><small>Castigos publicados</small></div>'+
    '</div></section>'+
    '<section class="v42-stat-panel"><div class="v42-stat-title"><h2>Información disciplinaria</h2><span>⌃</span></div><div class="v42-stat-lines"><p><span>Tarjetas amarillas</span><b>'+yell+'</b></p><p><span>Tarjetas rojas</span><b>'+red+'</b></p><p><span>Jugadores castigados</span><b>'+susp.length+'</b></p><p><span>Fuente</span><b>Oficial</b></p></div></section>';
}
function patchTeamSummary(page,ctx){
  const roster=officialRoster(ctx);
  const preview=page.querySelector('.v42-preview-grid');
  if(preview){
    preview.innerHTML=(roster.slice(0,3).map(p=>'<button type="button" data-v42-tab="squad"><span class="v42-avatar large v62-player-initial">'+esc(String(p).split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase())+'</span><strong>'+esc(p)+'</strong><small>Jugador registrado</small></button>').join('')||'<div class="v62-empty-inline">Sin nombres públicos actuales.</div>');
  }
  const form=teamForm(ctx),formHost=page.querySelector('.v42-form-dots');
  if(formHost&&form.length)formHost.innerHTML=form.map(x=>'<b class="'+x.toLowerCase()+'">'+x+'</b>').join('');
  const next=teamFixtures(ctx).filter(isFutureFixture).sort((a,b)=>(parseDate(a[8])?.getTime()||0)-(parseDate(b[8])?.getTime()||0))[0];
  const nextCard=page.querySelector('.v42-next-card');
  if(nextCard){
    if(next){
      nextCard.innerHTML='<h3>'+esc(next[8])+' · '+esc(ctx.c.name)+' · Jornada '+esc(next[1])+'</h3><div class="v42-next-body"><div>'+miniOfficial(next[2])+miniOfficial(next[6])+'</div><div class="v42-next-time"><b>'+esc((next[8]||'').split(' ')[1]||'')+'</b><button type="button" data-v42-tab="matches">Ver detalles</button></div></div>';
    }else nextCard.innerHTML='<h3>'+esc(ctx.c.name)+'</h3><div class="v62-empty-inline">Sin próximo partido con fecha futura publicado.</div>';
  }
}

function patchTeams(){
  if(route()!=='teams'||!db)return;
  const page=document.querySelector('[data-v27-reference="teams"]');if(!page)return;
  // V27 owns the 53 category entries, their groups, search and category-aware links.
  // Do not flatten repeated clubs or remove the Libre section after data refresh.
  if(page.dataset.teamDirectoryOwner==='v27-categories')return;

  /* TEAMS_CURRENT_ONLY1
     La pantalla Equipos se reconstruye desde el snapshot oficial actual.
     Evita que el MutationObserver vuelva a anexar los mismos clubes una y otra vez
     y elimina entradas heredadas que ya no existen en ninguna categoría. */
  const all=[];
  CAT_ORDER.forEach(id=>categoryTeams(cat(id)).forEach(n=>{
    if(n&&!all.some(x=>same(x,n)))all.push(n);
  }));

  const q=(page.querySelector('#v27TeamSearch')?.value||'').trim();
  const nq=norm(q);
  const visible=q?all.filter(n=>norm(n).includes(nq)):all.slice();
  const sig=String(db.captured_at_utc||'')+'|'+visible.map(norm).join('|')+'|'+nq;
  if(page.dataset.v62TeamsSig===sig)return;
  page.dataset.v62TeamsSig=sig;

  /* Siguiendo pertenece al diseño V27 y conserva exactamente los equipos
     elegidos por el usuario. No se limpia ni se reemplaza desde el directorio oficial. */

  const makeTile=n=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='v27-team-tile';
    b.dataset.v62Team=n;
    b.innerHTML=teamLogoHtml(n,'v27-logo')+'<span>'+esc(n)+'</span>';
    b.addEventListener('click',e=>{e.preventDefault();openTeam(n)},{once:true});
    return b;
  };

  /* No tocar .v27-followed-row: V27 conserva sus escudos, orden horizontal
     y clase followed-only, que evita que un solo equipo ocupe todo el ancho. */

  /* Una sola cuadrícula oficial. No se deja la antigua lista estática ni
     la sección secundaria que provocaba repeticiones al desplazarse. */
  const sections=[...page.querySelectorAll('.v27-section')];
  const competitionSection=sections.find(s=>/Equipos en la competición/i.test(s.querySelector('h2')?.textContent||''))||sections[1];
  const grid=competitionSection?.querySelector('.v27-grid');
  if(grid){
    grid.innerHTML='';
    if(visible.length)visible.forEach(n=>grid.appendChild(makeTile(n)));
    else grid.innerHTML='<div class="v27-empty-grid">No se encontraron equipos.</div>';
  }

  page.querySelectorAll('.v27-eliminated').forEach(s=>s.remove());
}
function intercept(){
  document.addEventListener('click',e=>{
    /* V898 — nada dentro de Pronostica Seis navega a ficha/comparación. */
    if(route()==='predictorSix')return;
    /* V681 — Permisos tiene selectores locales de equipo/jugador.
       V62 no debe interpretar ningún toque de esta pantalla como navegación
       a ficha, comparar equipos o cambio de equipo global. */
    if(e.target.closest?.('.ljr-icon-picker,.ljr-picker-options,select,[data-v194-player],[data-v28-player]')||route()==='permissionBuilder'||e.target.closest?.('[data-v635-page],[data-v635-team-sheet],[data-v635-player-sheet]'))return;

    /* V145 — El selector de equipo de Registro/Credencial es local al formulario.
       Nunca debe convertirse en navegación a ficha/comparación de equipos. */
    if(registrationActive()||
       e.target.closest?.('[data-v132-layer],[data-v132-open],[data-v64-cred-team],.v132-team-picker,.v132-team-row,[data-v126-team-open],[data-v126-team-choice],.v126-team-custom,.v126-team-panel,.v126-team-choice')){
      return;
    }

    /* FIX: "Datos" dentro de Más debe abrir la pantalla V33 original de
       Estadísticas, no la página V62 de Datos de la Liga. Se intercepta en
       captura antes del router principal para restaurar exactamente ese flujo. */
    const moreData=e.target.closest?.('[data-route="leagueData"],[data-safe-route="leagueData"]');
    if(route()==='more'&&moreData&&/Datos/i.test(moreData.textContent||'')){
      e.preventDefault();
      e.stopImmediatePropagation();
      location.hash='#/safe-data';
      return;
    }
    /* Los datos oficiales V62 siguen disponibles en #/leagueData cuando se
       abren desde otras herramientas o enlaces específicos. */
    const own=e.target.closest?.('[data-v62-team]');
    if(own&&route()!=='leagueData'&&route()!=='scorers'&&route()!=='teamDetail'){
      e.preventDefault();e.stopPropagation();openTeam(own.dataset.v62Team);return;
    }
    const generic=e.target.closest?.('[data-v27-team],[data-v41-team],[data-v32-open-team],[data-v40-team],[data-team]');
    if(generic){
      const name=generic.querySelector('strong,small')?.textContent||generic.querySelector('img')?.alt||generic.textContent||'';
      const ctx=teamContext(name);if(ctx)saveTeam(ctx.name);
    }
    const select=e.target.closest?.('[data-v42-select-team]');
    if(select){
      const name=select.querySelector('.v42-mini-team b')?.textContent||select.textContent||'';
      const ctx=teamContext(name);if(ctx)saveTeam(ctx.name);
    }
  },true);
}
function schedule(){
  if(applying)return;
  /* CredentialBuilder handles its own roster/category data. Avoid global
     home/standings/team DOM patches on every registration DOM mutation. */
  if(route()==='credentialBuilder')return;
  /* V194 is the sole owner of #/scorers. Do not schedule V62's global
     DOM patch cycle for mutations created by the scorer renderer. */
  if(route()==='scorers'&&(window.__LJR_SCORERS_UI_OWNER__==='v194-reference'||window.__LJR_V194_SCORERS__))return;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(applying)return;applying=true;
    try{
      const r=route();
      document.body.classList.remove('v62-data-active');
      if(r!=='leagueData'){
        patchHomeCalendarResults();
        patchHomeStandings();
        patchHomeScorers();
        patchScorers();
        patchTeamDetail();
        patchTeams();
      }
    }finally{applying=false}
  }));
}

intercept();
window.addEventListener('hashchange',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();

})();