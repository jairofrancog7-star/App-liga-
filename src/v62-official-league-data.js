/* V62 — Datos oficiales públicos de Liga Juventino Rosas.
   Integra el snapshot de Liga_Futbol sin sustituir el diseño azul existente.
   Fuente deportiva pública: juventinorosasliga.com sincronizada en Liga_Futbol/data/official-live.json. */
(function(){
'use strict';

const BUILD='20260919-v62-official1';
const LOCAL_DATA='./public/data/official-live.json?v='+BUILD;
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
  'dep nopalero':'NOP','deportivo nopalero':'NOP','san julian':'SJL','juventus':'JUVS'
};

let db=null;
let categoryId=localStorage.getItem('v62-category')||'3';
let dataTab=localStorage.getItem('v62-data-tab')||'standings';
let fixtureFilter=localStorage.getItem('v62-fixture-filter')||'all';
let playerTeamFilter=localStorage.getItem('v62-player-team-filter')||'all';
let applying=false;

function route(){return location.hash.replace('#/','')||'home'}
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
  const shared=window.LJR_TEAM_LOGOS?.get?.(name);
  if(shared)return shared;
  if(!db)return '';
  const hit=Object.entries(db.team_logos||{}).find(([k])=>same(k,name));
  const v=hit?.[1];
  if(typeof v==='string')return v;
  if(v?.local)return SRC+String(v.local).replace(/^\.\//,'');
  if(v?.source)return v.source;
  return '';
}
function catLogo(id){const p=CAT_META[String(id)]?.logo;return p?SRC+p:''}
function scoreNum(v){if(v==null||v===''||v==='-')return 0;const n=Number(v);return Number.isFinite(n)?n:0}
function parseDate(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return null;
  return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
}
function isFutureFixture(r){const d=parseDate(r?.[8]);return !!d&&d.getTime()>Date.now()}
function isPlayedFixture(r){return /^\d+$/.test(String(r?.[3]??''))&&/^\d+$/.test(String(r?.[5]??''))}
function categoryTeams(c){
  if(!c)return [];
  const out=[];
  const add=n=>{n=String(n||'').trim();if(n&&!out.some(x=>same(x,n)))out.push(n)};
  Object.keys(c.rosters||{}).forEach(add);
  (c.standings?.[0]?.rows||[]).forEach(r=>add(r[1]));
  (c.fixtures?.[0]?.rows||[]).forEach(r=>{add(r[2]);add(r[6])});
  (c.scorers?.[0]?.rows||[]).forEach(r=>{if(r.length>2)add(r[2])});
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
  saveTeam(name);
  localStorage.setItem('v42-team-tab','summary');
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

/* V72 — Próximos partidos / EN VIVO calculado desde los horarios oficiales.
   No muestra marcador porque no existe un feed de goles en tiempo real.
   Reloj de referencia: 45' + 15' descanso + 45'; la ventana de partido se
   mantiene hasta 120 minutos para tolerar compensación/retrasos. */
let homeLiveTimer=null;
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
function liveClockFor(startMs,nowMs){
  const elapsed=(nowMs-startMs)/60000;
  if(!Number.isFinite(elapsed)||elapsed<0)return {kind:'upcoming',label:''};
  if(elapsed<45)return {kind:'live',label:'1T · '+Math.max(1,Math.floor(elapsed)+1)+"'"};
  if(elapsed<60)return {kind:'live',label:'DESCANSO'};
  if(elapsed<105)return {kind:'live',label:'2T · '+Math.min(90,45+Math.floor(elapsed-60)+1)+"'"};
  if(elapsed<120)return {kind:'live',label:"2T · 90+"+Math.max(1,Math.floor(elapsed-105)+1)+"'"};
  return {kind:'ended',label:''};
}
function officialFixtureEntries(id='3'){
  const c=cat(id),rs=c?.fixtures?.[0]?.rows||[];
  return rs.map((r,i)=>({id:String(id),category:c?.name||CAT_META[String(id)]?.name||'',r,index:i,start:fixtureWallClockStamp(r?.[8])}))
    .filter(x=>Number.isFinite(x.start)&&String(x.r?.[2]||'').trim()&&String(x.r?.[6]||'').trim());
}
function homeFixturePool(){
  const now=mexicoWallClockStamp();
  const primary=officialFixtureEntries('3');
  const all=CAT_ORDER.flatMap(id=>officialFixtureEntries(id));
  const usable=x=>{
    const status=liveClockFor(x.start,now);
    return status.kind==='live'||x.start>now;
  };
  let pool=primary.filter(usable);
  if(pool.length<2){
    const seen=new Set(pool.map(x=>x.id+':'+x.index));
    all.filter(usable).forEach(x=>{const k=x.id+':'+x.index;if(!seen.has(k)){seen.add(k);pool.push(x)}});
  }
  return pool.sort((a,b)=>{
    const sa=liveClockFor(a.start,now).kind==='live'?0:1;
    const sb=liveClockFor(b.start,now).kind==='live'?0:1;
    return sa-sb||a.start-b.start||a.index-b.index;
  }).slice(0,2);
}
function homeOfficialLogo(name){
  return teamLogoHtml(name,'v72-home-team-logo');
}
function homeFixtureRow(x,now){
  const r=x.r,home=String(r[2]||''),away=String(r[6]||''),status=liveClockFor(x.start,now);
  const center=status.kind==='live'
    ? '<strong class="v72-home-live-clock"><i></i>'+esc(status.label)+'</strong>'
    : '<strong class="v72-home-kickoff">'+esc(fixtureClock(r[8]))+'</strong>';
  return '<div class="v72-home-match-row '+(status.kind==='live'?'is-live':'')+'">'+
    '<button type="button" class="v72-home-club home" data-v62-team="'+esc(home)+'"><span>'+esc(home)+'</span>'+homeOfficialLogo(home)+'</button>'+
    center+
    '<button type="button" class="v72-home-club away" data-v62-team="'+esc(away)+'">'+homeOfficialLogo(away)+'<span>'+esc(away)+'</span></button>'+
  '</div>';
}
function patchHomeUpcoming(force=false){
  if(route()!=='home'||!db)return;
  const screen=document.querySelector('#screen');if(!screen)return;
  const section=[...screen.querySelectorAll('.section')].find(s=>/Próximos partidos/i.test(s.querySelector('.section-head h2,h2')?.textContent||''));
  if(!section)return;
  const pool=homeFixturePool(),now=mexicoWallClockStamp();
  if(!pool.length)return;
  const sig=pool.map(x=>x.id+':'+x.index+':'+liveClockFor(x.start,now).label).join('|');
  if(!force&&section.dataset.v72LiveSig===sig)return;
  section.dataset.v72LiveSig=sig;
  section.classList.add('v72-home-live-section');

  const first=pool[0],firstStatus=liveClockFor(first.start,now),r=first.r;
  const metaLeft=firstStatus.kind==='live'
    ? '<span class="v72-home-live-meta"><i></i>EN VIVO · Jornada '+esc(r[1]||'')+'</span>'
    : '<span class="v72-home-next-meta">PRÓXIMO · Jornada '+esc(r[1]||'')+'</span>';
  const metaRight='<span>'+esc(fixtureShortDate(r[8]))+(fixtureClock(r[8])!=='Por confirmar'?' · '+esc(fixtureClock(r[8])):'')+'</span>';
  let card=section.querySelector('.match-card');
  if(!card){card=document.createElement('div');card.className='card match-card';section.appendChild(card)}
  card.classList.add('v72-home-live-card');
  card.innerHTML='<div class="match-meta v72-home-match-meta">'+metaLeft+metaRight+'</div>'+
    '<div class="v72-home-match-list">'+pool.map(x=>homeFixtureRow(x,now)).join('')+'</div>'+
    '<div class="v72-home-live-note">Minuto estimado por horario oficial · sin marcador en vivo</div>';
}
function startHomeLiveTimer(){
  if(homeLiveTimer)return;
  homeLiveTimer=setInterval(()=>patchHomeUpcoming(true),30000);
}
function chooseNewer(a,b){
  if(!a)return b;if(!b)return a;
  return String(b.captured_at_utc||'')>String(a.captured_at_utc||'')?b:a;
}
async function fetchJson(url){
  try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));return await r.json()}catch{return null}
}
async function load(){
  const local=await fetchJson(LOCAL_DATA);
  const remote=await fetchJson(REMOTE_DATA);
  db=chooseNewer(local,remote)||local||remote;
  if(!db)return;
  window.LJR_OFFICIAL_DATA=db;
  window.LJR_OFFICIAL_API={getData:()=>db,getCategory:id=>cat(id),getTeam:teamContext,getLogo:logoFor,setCategory:setCategory,setDataTab:(id)=>{dataTab=String(id||'summary');localStorage.setItem('v62-data-tab',dataTab);if(route()==='leagueData')renderDataPage()},openTeam};
  if(!cat(categoryId))categoryId='3';
  startHomeLiveTimer();
  schedule();
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
      if(i===playerIndex)return '<td><strong>'+esc(v)+'</strong></td>';
      return '<td>'+esc(v)+'</td>';
    }).join('')+'</tr>').join('')+
  '</tbody></table></div>';
}

function summaryView(){
  const current=cat(),counts=current?.counts||current?.dashboard?.counts||{};
  const fixtures=rows('fixtures'),scorers=rows('scorers').filter(r=>r.length>=4&&/^\d+$/.test(String(r[3]||'')));
  const goals=scorers.reduce((sum,r)=>sum+scoreNum(r[3]),0);
  return '<div class="v62-summary-grid">'+
    '<button type="button" data-v62-tab="teams"><b>'+esc(counts.Equipos??categoryTeams(current).length)+'</b><small>Equipos</small></button>'+
    '<button type="button" data-v62-tab="players"><b>'+esc(counts.Jugadores??0)+'</b><small>Jugadores</small></button>'+
    '<button type="button" data-v62-tab="fixtures"><b>'+esc(fixtures.length)+'</b><small>Partidos</small></button>'+
    '<button type="button" data-v62-tab="scorers"><b>'+esc(goals)+'</b><small>Goles registrados</small></button>'+
  '</div>'+
  '<div class="v62-summary-actions">'+
    '<button type="button" data-v62-tab="standings">Ver tabla</button>'+
    '<button type="button" data-v62-tab="cards">Tarjetas</button>'+
    '<button type="button" data-v62-tab="suspensions">Castigados</button>'+
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
  const pending=!isPlayedFixture(r);
  const home=r[2]||'',away=r[6]||'',hs=r[3]??'',as=r[5]??'';
  const place=r[7]||'Campo por confirmar',when=r[8]||'Fecha por confirmar';
  return '<article class="v62-match-card '+(pending?'pending':'played')+'">'+
    '<div class="v62-match-head"><span>Jornada '+esc(r[1]||'')+'</span><b>'+esc(pending?'PENDIENTE':'PARTIDO')+'</b></div>'+
    '<div class="v62-match-team"><button type="button" data-v62-team="'+esc(home)+'">'+teamLogoHtml(home)+'<span>'+esc(home)+'</span></button><strong>'+esc(hs)+'</strong></div>'+
    '<div class="v62-match-team"><button type="button" data-v62-team="'+esc(away)+'">'+teamLogoHtml(away)+'<span>'+esc(away)+'</span></button><strong>'+esc(as)+'</strong></div>'+
    '<div class="v62-match-meta"><span>'+esc(when)+'</span><span>'+esc(place)+'</span></div>'+
  '</article>';
}
function fixturesView(){
  const b=block('fixtures');
  if(!b||!b.rows?.length)return empty('No hay jornadas publicadas para esta categoría.');
  const all=b.rows.slice();
  const shown=fixtureFilter==='upcoming'?all.filter(r=>!isPlayedFixture(r)):fixtureFilter==='played'?all.filter(isPlayedFixture):all;
  const groups={};
  shown.forEach(r=>(groups[r[1]||'?']||(groups[r[1]||'?']=[])).push(r));
  const pending=all.filter(r=>!isPlayedFixture(r)).length;
  return '<div class="v62-fixture-toolbar">'+
      '<div class="v62-fixture-filter">'+
        '<button type="button" class="'+(fixtureFilter==='all'?'active':'')+'" data-v62-fixture-filter="all">Todos</button>'+
        '<button type="button" class="'+(fixtureFilter==='played'?'active':'')+'" data-v62-fixture-filter="played">Jugados</button>'+
        '<button type="button" class="'+(fixtureFilter==='upcoming'?'active':'')+'" data-v62-fixture-filter="upcoming">Próximos</button>'+
      '</div>'+
      '<div class="v62-fixture-actions"><button type="button" data-v62-calendar>Calendario</button><button type="button" data-v62-simulator>Simular jornada</button></div>'+
    '</div>'+
    '<div class="v62-kpis"><span><b>'+all.length+'</b><small>partidos publicados</small></span><span><b>'+pending+'</b><small>próximos con fecha</small></span></div>'+
    (shown.length?Object.entries(groups).map(([j,rs])=>'<section class="v62-round"><h2>Jornada '+esc(j)+'</h2><div class="v62-match-grid">'+rs.map(fixtureCard).join('')+'</div></section>').join(''):empty('No hay partidos para este filtro.'));
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
      '<div>'+players.map(p=>'<p><span class="v62-player-dot"></span><b>'+esc(p)+'</b></p>').join('')+'</div></section>').join('')+'</div>';
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
    '<header class="v62-data-head"><button type="button" data-v62-back aria-label="Volver">‹</button><div><small>DATOS OFICIALES</small><h1>Liga Juventino Rosas</h1><p>'+esc(sourceStamp())+'</p></div></header>'+
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
function setMoreNav(){
  const nav=document.querySelector('.bottom-nav');if(!nav)return;
  nav.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='more'));
}

function scorerRows(){
  const rs=rows('scorers');
  return rs.filter(r=>r.length>=4&&/^\d+$/.test(String(r[3]||'')));
}
function scorerFeature(r,idx){
  return '<article class="v28-feature">'+
    '<div class="v28-feature-photo '+(idx===0?'one':'two')+'"><button type="button" class="v28-feature-play" data-v62-team="'+esc(r[2])+'" aria-label="Ver equipo '+esc(r[2])+'"></button></div>'+
    '<div class="v28-feature-info"><div class="v28-feature-person"><span class="v28-ball">⚽</span><span><b>'+esc(r[2])+'</b><small>'+esc(r[1])+'</small></span></div><div class="v28-feature-goals"><b>'+esc(r[3])+'</b><small>goles</small></div></div>'+
  '</article>';
}
function scorerRow(r,i){
  return '<button type="button" class="v28-rank-row" data-v62-team="'+esc(r[2])+'">'+
    '<span class="v28-rank-number">#'+esc(r[0]||i+1)+'</span>'+teamLogoHtml(r[2],'v28-team-logo')+
    '<span class="v28-rank-copy"><b>'+esc(r[2])+'</b><small>'+esc(r[1])+'</small></span><strong class="v28-rank-goals">'+esc(r[3])+'</strong></button>';
}
function patchScorers(force=false){
  if(route()!=='scorers'||!db)return;
  const page=document.querySelector('[data-v28-scorers]');if(!page)return;
  const sig=categoryId+':'+String(db.captured_at_utc||'');
  if(!force&&page.dataset.v62Sig===sig)return;
  const rs=scorerRows();
  page.dataset.v62Sig=sig;
  page.innerHTML='<div class="v62-inline-rail">'+categoryRail()+'</div>'+
    (rs.length?rs.slice(0,2).map(scorerFeature).join('')+'<div class="v28-ranking">'+rs.slice(2).map(scorerRow).join('')+'</div>':
      empty(rows('scorers')?.[0]?.[0]||'No hay goles registrados en esta temporada.'))+
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
  const games=teamFixtures(ctx).map(r=>({r,d:parseDate(r[8])})).filter(x=>x.d&&x.d.getTime()<=Date.now()).sort((a,b)=>a.d-b.d);
  return games.slice(-5).map(({r})=>{
    const home=same(r[2],ctx.name),a=scoreNum(r[3]),b=scoreNum(r[5]);
    if(a===b)return 'E';
    return (home?a>b:b>a)?'V':'D';
  });
}
function teamScorers(ctx){
  return (ctx?.c?.scorers?.[0]?.rows||[]).filter(r=>r.length>=4&&same(r[2],ctx.name)&&/^\d+$/.test(String(r[3]||'')));
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
    /* FIX: "Datos" vuelve a abrir #/safe-data con el diseño/tablas V33 originales.
       Los datos oficiales V62 siguen disponibles únicamente en #/leagueData y
       no sustituyen la pantalla existente de Datos. */
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
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(applying)return;applying=true;
    try{
      const r=route();
      document.body.classList.toggle('v62-data-active',r==='leagueData');
      if(r==='leagueData')renderDataPage();
      else{
        patchHomeUpcoming();
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