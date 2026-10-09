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
const LOCAL='./data/official-live.json?v=20261001-v491-v35-all-pages';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261001-v491-v35-all-pages';
const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const MATCH_MEDIA=BASE+'assets/motion/';

let db=window.LJR_OFFICIAL_DATA||null;
let activeTab='Resumen';
let selectedKey='';
let loading=null;
let timer=null;
let liveClockTimer=null;
let renderGuard=false;
let profileSide='home';
let v423Date='';
let v423Category='all';
let v423Status='all';
let v423LiveOnly=false;

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
/* V976 — Las resoluciones por DEFAULT/administrativas prevalecen
   sobre la fecha y jamás generan un 3-0 no publicado. */
function officialDecision(m){
  const decision=m?.cat?.fixture_decisions?.[String(m?.r?.[0]??'')];
  if(!decision?.winner)return null;
  const winner=norm(decision.winner);
  if(winner!==norm(m.r?.[2])&&winner!==norm(m.r?.[6]))return null;
  return decision;
}
function confirmedLivePhase(m){
  try{
    const s=window.LJR_MATCH_LIVE?.getState?.();
    if(!s||s.key!==m?.key)return '';
    const p=String(s.phase||'');
    if(!['first','halftime','second','final'].includes(p))return '';
    const hasOperatorEvent=(s.events||[]).some(e=>e?.confirmed!==false&&e?.type==='phase-'+p);
    const hasFreshFeed=!!(s.source?.connected&&Date.now()-Number(s.source.lastSync||0)<30000);
    return hasOperatorEvent||hasFreshFeed?p:'';
  }catch(_){return ''}
}
function allMatches(){
  const out=[];
  for(const [catId,c] of Object.entries(categories())){
    const rows=(c?.fixtures||[]).flatMap(b=>b.rows||[]);
    for(const r of rows){
      const start=fixtureStamp(r?.[8]);
      if(!r?.[2]||!r?.[6])continue;
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
const AUTO_FIRST_MS=45*60*1000;
const AUTO_BREAK_MS=15*60*1000;
const AUTO_SECOND_MS=45*60*1000;
const AUTO_MATCH_MS=AUTO_FIRST_MS+AUTO_BREAK_MS+AUTO_SECOND_MS;

function automaticPhase(m,now=mexicoStamp()){
  if(!Number.isFinite(m?.start))return {phase:'unknown',label:'—',elapsed:0};
  const elapsed=now-m.start;
  if(elapsed<0)return {phase:'scheduled',label:clock(m.r?.[8]),elapsed};
  if(elapsed<AUTO_FIRST_MS){
    const minute=Math.min(45,Math.floor(elapsed/60000)+1);
    return {phase:'first',label:minute+'′ · 1T',elapsed};
  }
  if(elapsed<AUTO_FIRST_MS+AUTO_BREAK_MS)return {phase:'halftime',label:'MEDIO TIEMPO',elapsed};
  if(elapsed<AUTO_MATCH_MS){
    const minute=Math.min(90,46+Math.floor((elapsed-AUTO_FIRST_MS-AUTO_BREAK_MS)/60000));
    return {phase:'second',label:minute+'′ · 2T',elapsed};
  }
  return {phase:'final',label:'FINAL',elapsed};
}
function stateFor(m,now=mexicoStamp()){
  const decision=officialDecision(m);
  const score=publishedScore(m?.r);
  if(decision){
    const loser=norm(decision.winner)===norm(m.r[2])?m.r[6]:m.r[2];
    return {kind:'awarded',label:decision.default===true?'VICTORIA POR DEFAULT':'RESOLUCIÓN OFICIAL',
      primary:score?.text||(decision.default===true?'DEFAULT':'RESOLUCIÓN'),
      secondary:'Gana '+decision.winner+(decision.default===true?' · '+loser+' −3 pts':''),
      decision};
  }
  if(score)return {kind:'final',label:'RESULTADO OFICIAL',primary:score.text,secondary:'Final'};
  const status=String(m?.r?.[10]||'').trim();
  if(/\bGANA\b/i.test(status))return {kind:'final',label:'RESOLUCIÓN OFICIAL',primary:status,secondary:'Rol oficial'};
  const start=m?.start;
  if(!Number.isFinite(start))return {kind:'unknown',label:'PROGRAMACIÓN OFICIAL',primary:'VS',secondary:'Horario por confirmar'};
  const live=confirmedLivePhase(m);
  if(live==='first'||live==='second'||live==='halftime')return {
    kind:'window',label:'PARTIDO EN DIRECTO',primary:'—',secondary:live==='halftime'?'Medio tiempo':'Cronómetro del operador',livePhase:live};
  if(live==='final')return {kind:'pending',label:'PARTIDO FINALIZADO',primary:'FINAL',secondary:'Esperando cédula oficial'};
  if(now<start)return {kind:'scheduled',label:'PRÓXIMO PARTIDO OFICIAL',primary:clock(m.r[8]),secondary:dateOnly(m.r[8])};
  const auto=automaticPhase(m,now);
  if(auto.phase==='first'||auto.phase==='halftime'||auto.phase==='second')return {
    kind:'window',label:'PARTIDO EN DIRECTO',primary:auto.label,
    secondary:auto.phase==='halftime'?'Descanso automático':'Cronómetro automático según hora oficial',
    autoPhase:auto.phase};
  return {kind:'pending',label:'PARTIDO FINALIZADO',primary:'FINAL',secondary:'Esperando resultado oficial'};
}
function selectedFixture(){
  const list=allMatches();if(!list.length)return null;
  const now=mexicoStamp();
  if(selectedKey){
    const chosen=list.find(m=>m.key===selectedKey);
    if(chosen){
      const s=stateFor(chosen,now);
      const auto=automaticPhase(chosen,now);
      if(s.kind==='scheduled'||s.kind==='window'||auto.phase!=='final')return chosen;
      // El partido seleccionado terminó: liberar la selección para saltar al siguiente horario.
      selectedKey='';
    }
  }
  const live=list.filter(m=>stateFor(m,now).kind==='window')
    .sort((a,b)=>a.start-b.start||Number(a.catId)-Number(b.catId)||a.key.localeCompare(b.key));
  if(live.length){
    // Si hay varios partidos a la misma hora, mostrar solo uno de forma estable.
    const slot=live[0].start;
    return live.filter(m=>m.start===slot)
      .sort((a,b)=>Number(a.catId)-Number(b.catId)||a.key.localeCompare(b.key))[0];
  }
  const future=list.filter(m=>Number.isFinite(m.start)&&m.start>now&&stateFor(m,now).kind==='scheduled')
    .sort((a,b)=>a.start-b.start||Number(a.catId)-Number(b.catId)||a.key.localeCompare(b.key));
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
function namesFrom(v){
  if(!v)return [];
  if(Array.isArray(v))return v.map(x=>typeof x==='string'?x:(x?.name||x?.player||x?.nombre||'')).filter(Boolean);
  if(typeof v==='object'){
    for(const k of ['starters','titulares','lineup','players','jugadores']){
      const out=namesFrom(v[k]);if(out.length)return out;
    }
  }
  return [];
}
function liveLineup(m,side){
  try{
    const s=JSON.parse(localStorage.getItem('ljr-match-live-v144:'+m.key)||'null');
    const x=s?.lineups||s?.alineaciones;
    if(!x)return null;
    const raw=side==='home'?(x.home||x.local):(x.away||x.visitante);
    const names=namesFrom(raw);
    return names.length?{names,label:'Alineación recibida en tiempo real',url:''}:null;
  }catch(_){return null}
}
function cedulaLineup(m,team){
  const r=m.r,date=dateOnly(r[8]);
  const cedulas=Array.isArray(m?.cat?.cedulas)?m.cat.cedulas:[];
  const home=norm(r[2]),away=norm(r[6]),wanted=norm(team);
  const hits=cedulas.filter(x=>{
    const xl=norm(x?.local),xa=norm(x?.away);
    const teams=(xl===home&&xa===away)||(xl===away&&xa===home);
    const sameDate=!!x?.date&&String(x.date).startsWith(date);
    return teams&&sameDate;
  }).sort((a,b)=>Number(b.id||0)-Number(a.id||0));
  for(const x of hits){
    const side=norm(x.local)===wanted?'local':norm(x.away)===wanted?'away':'';
    if(!side)continue;
    const names=namesFrom(x[side+'_lineup']);
    if(names.length)return {names,label:'Alineación oficial publicada',url:x.url||''};
  }
  return null;
}
function lineupFor(m,team){
  const side=norm(team)===norm(m.r[2])?'home':'away';
  return cedulaLineup(m,team)||liveLineup(m,side);
}
function standing(m,name){return standings(m).find(r=>norm(r?.[1])===norm(name))||null}
function num(v){const n=Number(v);return Number.isFinite(n)?n:null}
function fmt(v,d=1){return Number.isFinite(v)?v.toFixed(d).replace(/\.0$/,''):'—'}
function allCategoryFixtureRows(m){
  return (m?.cat?.fixtures||[]).flatMap(b=>Array.isArray(b?.rows)?b.rows:[]);
}
function teamForm(m,team,limit=3){
  const wanted=norm(team);
  return allCategoryFixtureRows(m).map(r=>{
    const s=publishedScore(r);if(!s)return null;
    const home=norm(r?.[2]),away=norm(r?.[6]);if(home!==wanted&&away!==wanted)return null;
    const gf=home===wanted?Number(s.home):Number(s.away);
    const ga=home===wanted?Number(s.away):Number(s.home);
    const result=gf>ga?'V':gf<ga?'D':'E';
    return {result,stamp:fixtureStamp(r?.[8])};
  }).filter(Boolean).sort((a,b)=>(a.stamp||0)-(b.stamp||0)).slice(-limit);
}
function previewValueRow(label,left,right,{suffix='',decimals=1,unavailable=false}={}){
  const l=num(left),r=num(right),has=Number.isFinite(l)||Number.isFinite(r);
  const max=Math.max(Math.abs(l||0),Math.abs(r||0),1);
  const lp=has?Math.max(5,Math.min(100,Math.abs(l||0)/max*100)):50;
  const rp=has?Math.max(5,Math.min(100,Math.abs(r||0)/max*100)):50;
  const val=v=>Number.isFinite(v)?fmt(v,decimals)+suffix:'—';
  return '<div class="v416-compare-row '+((unavailable||!has)?'is-unavailable':'')+'">'+
    '<div class="v416-compare-values"><b>'+esc(val(l))+'</b><span>'+esc(label)+'</span><b>'+esc(val(r))+'</b></div>'+
    '<div class="v416-bars"><i class="home" style="--v:'+lp+'%"></i><i class="away" style="--v:'+rp+'%"></i></div>'+
  '</div>';
}
function formHtml(items){
  if(!items.length)return '<span class="v416-form-empty">—</span>';
  return items.map(x=>'<i class="v416-form '+(x.result==='V'?'win':x.result==='E'?'draw':'loss')+'">'+x.result+'</i>').join('');
}
function previewTeam(m,team,side){
  const st=standing(m,team),form=teamForm(m,team,3);
  const wins=num(st?.[3]),draws=num(st?.[4]),losses=num(st?.[5]);
  const left=side==='home';
  const formOrder=left?[
    {k:'V',v:wins,cls:'win'},{k:'E',v:draws,cls:'draw'},{k:'D',v:losses,cls:'loss'}
  ]:[
    {k:'D',v:losses,cls:'loss'},{k:'E',v:draws,cls:'draw'},{k:'V',v:wins,cls:'win'}
  ];
  const circles=formOrder.map(x=>'<span class="v418-form-stat"><i class="'+x.cls+'">'+x.k+'</i><b>'+esc(Number.isFinite(x.v)?x.v:'—')+'</b></span>').join('');
  return '<div class="v416-team '+side+'">'+
    (left?teamLogo(team,'preview'):'')+
    '<div class="v416-team-copy"><b>'+esc(team)+'</b><span class="v418-form-stats">'+circles+'</span></div>'+
    (!left?teamLogo(team,'preview'):'')+
  '</div>';
}

function compactDate(v){
  const d=dateOnly(v);if(!d)return 'Fecha por confirmar';
  const m=d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!m)return d;
  const months=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return Number(m[1])+' '+months[Math.max(0,Math.min(11,Number(m[2])-1))]+' '+m[3];
}
function countdownText(m,state){
  if(state.kind==='awarded')return state.decision?.default===true?'DEFAULT · −3 PTS':'RESOLUCIÓN';
  if(state.kind==='window')return 'EN DIRECTO';
  if(state.kind==='final')return 'FINAL';
  if(state.kind==='pending')return 'SIN CONFIRMAR';
  if(!Number.isFinite(m?.start))return '—';
  const diff=m.start-mexicoStamp();
  if(diff<=0)return state.kind==='pending'?'PENDIENTE':'00 : 00 : 00';
  const s=Math.floor(diff/1000),h=Math.floor(s/3600),min=Math.floor((s%3600)/60),sec=s%60;
  const pad=n=>String(n).padStart(2,'0');
  return pad(h)+' : '+pad(min)+' : '+pad(sec);
}
function v526SeasonRow(label,left,right){
  return '<div class="v526-season-row"><b>'+esc(left??'—')+'</b><span>'+esc(label)+'</span><b>'+esc(right??'—')+'</b></div>';
}
function v526BalanceDots(m,team){
  const form=teamForm(m,team,5);
  return form.length
    ? '<div class="v526-balance-dots">'+form.map(x=>'<i class="'+(x.result==='V'?'win':x.result==='E'?'draw':'loss')+'"></i>').join('')+'</div>'
    : '<div class="v526-balance-dots empty"><span>Sin resultados</span></div>';
}
function v526MatchExtras(m){
  const r=m.r,home=r[2],away=r[6],h=standing(m,home),a=standing(m,away);
  const h2h=v424H2H(m),hf=v424FormCounts(m,home),af=v424FormCounts(m,away);
  return '<section class="v526-match-extras" data-v526-match-extras>'+
    '<section class="v526-extra-section">'+
      '<h3>Comparación de temporada</h3>'+
      '<div class="v526-team-pair"><span>'+teamLogo(home,'v526-extra-logo')+'<b>'+esc(home)+'</b></span><span>'+teamLogo(away,'v526-extra-logo')+'<b>'+esc(away)+'</b></span></div>'+
      v526SeasonRow('Partidos',h?.[2],a?.[2])+
      v526SeasonRow('Ganados',h?.[3],a?.[3])+
      v526SeasonRow('Empates',h?.[4],a?.[4])+
      v526SeasonRow('Puntos',h?.[9],a?.[9])+
    '</section>'+
    '<section class="v526-extra-section">'+
      '<h3>Balance de temporada</h3>'+
      '<div class="v526-balance-pair"><span>'+teamLogo(home,'v526-extra-logo')+v526BalanceDots(m,home)+'</span><span>'+teamLogo(away,'v526-extra-logo')+v526BalanceDots(m,away)+'</span></div>'+
    '</section>'+
    '<section class="v526-extra-section">'+
      '<h3>Historial directo</h3>'+
      '<div class="v526-h2h-pair"><span>'+teamLogo(home,'v526-extra-logo')+'<b>'+esc(home)+'</b></span><em>VS</em><span>'+teamLogo(away,'v526-extra-logo')+'<b>'+esc(away)+'</b></span></div>'+
      '<div class="v526-h2h-grid"><div><small>Jugados</small><b>'+esc(h2h.played)+'</b></div><div><small>Ganó '+esc(home)+'</small><b>'+esc(h2h.wins)+'</b></div><div><small>Empates</small><b>'+esc(h2h.draws)+'</b></div><div><small>Ganó '+esc(away)+'</small><b>'+esc(h2h.losses)+'</b></div></div>'+
    '</section>'+
    '<section class="v526-extra-section">'+
      '<h3>Estado de forma</h3><small class="v526-category">'+esc(m.category)+'</small>'+
      '<div class="v526-form-teams"><span>'+teamLogo(home,'v526-extra-logo')+'<b>'+esc(home)+'</b><div class="v526-form-dots">'+v424FormDots(m,home,5)+'</div></span><span>'+teamLogo(away,'v526-extra-logo')+'<b>'+esc(away)+'</b><div class="v526-form-dots">'+v424FormDots(m,away,5)+'</div></span></div>'+
      '<div class="v526-form-stats"><div><span>Ganados</span><b>'+esc(hf.wins)+'</b><b>'+esc(af.wins)+'</b></div><div><span>Empates</span><b>'+esc(hf.draws)+'</b><b>'+esc(af.draws)+'</b></div><div><span>Perdidos</span><b>'+esc(hf.losses)+'</b><b>'+esc(af.losses)+'</b></div></div>'+
    '</section>'+
    '<div class="v526-shortcuts">'+
      '<button type="button" data-v526-clock><span>◷</span><b>Cronómetro</b><small>45 + descanso + 45</small></button>'+
      '<button type="button" data-v92-tab="Alineaciones"><span>▦</span><b>Alineaciones</b><small>Plantillas y formación</small></button>'+
      '<button type="button" data-v92-tab="Estadísticas"><span>▥</span><b>Estadísticas</b><small>Datos oficiales</small></button>'+
      '<button type="button" data-v92-tab="Cronología"><span>☷</span><b>Cronología</b><small>Eventos del partido</small></button>'+
    '</div>'+
  '</section>';
}
function buildUpBody(m,state){
  const r=m.r,home=r[2],away=r[6],score=publishedScore(r);
  const center=state.kind==='awarded'?state.primary:(score?score.text:clock(r[8]));
  return '<section class="v420-build-up" data-v420-build-up>'+
    '<section class="v420-hero">'+
      '<video class="v420-hero-media" autoplay muted loop playsinline preload="metadata" src="'+esc(MATCH_MEDIA+'v38-soccer-matchday.mp4')+'"></video>'+
      '<div class="v420-hero-shade"></div>'+
      '<div class="v420-top-controls">'+
        '<button type="button" data-v420-back aria-label="Volver">‹</button>'+
        '<button type="button" data-v420-mute aria-label="Silenciar o activar audio">⌁</button>'+
      '</div>'+
      '<div class="v420-match-panel">'+
        '<h2>'+esc(m.category)+'</h2>'+
        '<p>'+esc(compactDate(r[8]))+'</p>'+
        '<div class="v420-matchup">'+
          '<div>'+teamLogo(home,'v420-team-logo')+'<b>'+esc(home)+'</b></div>'+
          '<span><strong>'+esc(center)+'</strong><small data-v420-countdown data-v420-start="'+esc(Number.isFinite(m?.start)?m.start:'')+'" title="Cronometraje local del partido">'+esc(countdownText(m,state))+'</small></span>'+
          '<div>'+teamLogo(away,'v420-team-logo')+'<b>'+esc(away)+'</b></div>'+
        '</div>'+
      '</div>'+
    '</section>'+
    '<nav class="v420-pills" aria-label="Opciones del partido">'+
      '<button type="button" class="active" aria-current="page" data-v92-tab="BuildUp">Build Up</button>'+
      '<button type="button" data-v92-tab="Predicciones">Predicciones</button>'+
      '<button type="button" data-v92-tab="Cronología">Comentarios</button>'+
      '<button type="button" data-v92-tab="Alineaciones">Alineaciones</button>'+
    '</nav>'+
    '<section class="v420-media-card">'+
      '<video autoplay muted loop playsinline preload="metadata" src="'+esc(MATCH_MEDIA+'v38-soccer-teams.mp4')+'"></video>'+
      '<div><small>PARTIDO OFICIAL</small><b>'+esc(home)+' vs '+esc(away)+'</b><span>'+esc(r[7]||'Campo por confirmar')+'</span></div>'+
    '</section>'+
    v526MatchExtras(m)+
  '</section>';
}
let autoFollowKey='';
function updateLiveClock(){
  if(!isDirectRoute())return;
  const now=mexicoStamp(),m=selectedFixture();
  if(!m)return;
  const state=stateFor(m,now);

  // Cuando termina el bloque 45 + 15 + 45, selectedFixture() cambia al siguiente horario.
  // Si cambia el partido activo, reconstruir toda la pantalla para renovar logos, estadísticas y equipos.
  if(autoFollowKey&&autoFollowKey!==m.key){
    autoFollowKey=m.key;
    activeTab='Resumen';profileSide='home';renderGuard=false;render();
    return;
  }
  autoFollowKey=m.key;

  const auto=automaticPhase(m,now);
  const liveClock=document.querySelector('[data-v92-live-clock]');
  const liveSub=document.querySelector('[data-v92-live-sub]');
  const liveState=document.querySelector('[data-v92-live-state]');
  if(state.kind==='window'){
    if(liveClock&&state.primary!=='—')liveClock.textContent=state.primary;
    if(liveSub)liveSub.textContent=state.secondary||'En directo';
    if(liveState)liveState.textContent='En directo';
  }else if(state.kind==='scheduled'){
    if(liveClock)liveClock.textContent=clock(m.r?.[8]);
    if(liveSub)liveSub.textContent=dateOnly(m.r?.[8]);
    if(liveState)liveState.textContent='Pre-partido';
  }else if(auto.phase==='final'&&state.kind==='pending'){
    if(liveClock)liveClock.textContent='FINAL';
    if(liveSub)liveSub.textContent='Esperando resultado oficial';
    if(liveState)liveState.textContent='Finalizado';
  }

  document.querySelectorAll('[data-v420-countdown]').forEach(el=>{
    if(state.kind==='awarded'||state.kind==='final'||state.kind==='pending'){
      el.textContent=countdownText(m,state);
      el.dataset.phase=state.kind;
      return;
    }
    if(state.kind==='window'){
      // Si existe operador/feed, V144 puede reemplazar esta etiqueta; si no,
      // el reloj automático usa 45 + descanso + 45 desde la hora oficial.
      if(!el.classList.contains('v144-live-label'))el.textContent=state.primary==='—'?'EN DIRECTO':state.primary;
      el.dataset.phase=state.autoPhase||state.livePhase||'live';
      return;
    }
    const raw=el.dataset.v420Start;
    if(!raw)return;
    const start=Number(raw);
    if(!Number.isFinite(start))return;
    const diff=Math.floor((start-now)/1000);
    const pad=n=>String(Math.max(0,n)).padStart(2,'0');
    if(diff>0){
      const h=Math.floor(diff/3600),m=Math.floor((diff%3600)/60),s=diff%60;
      el.textContent=pad(h)+' : '+pad(m)+' : '+pad(s);
      el.dataset.phase='countdown';
      return;
    }
    // En caso de cruzar el segundo exacto de inicio mientras el estado
    // seguía siendo programado, esperar la siguiente confirmación.
    el.textContent='INICIO SIN CONFIRMAR';
    el.dataset.phase='pending';
  });
}
function predictionsBody(m){
  const r=m.r,home=r[2],away=r[6],key='v420-prediction:'+m.key;
  let saved=null;try{saved=JSON.parse(localStorage.getItem(key)||'null')}catch(_){}
  const active=v=>saved?.pick===v?' active':'';
  return '<section class="v420-predictions">'+
    '<header><small>PRONÓSTICO DEL PARTIDO</small><h2>¿Quién gana?</h2><p>Tu selección se guarda solo en este dispositivo.</p></header>'+
    '<div class="v420-prediction-teams">'+
      '<div>'+teamLogo(home,'v420-pred-logo')+'<b>'+esc(home)+'</b></div>'+
      '<span>VS</span>'+
      '<div>'+teamLogo(away,'v420-pred-logo')+'<b>'+esc(away)+'</b></div>'+
    '</div>'+
    '<div class="v420-prediction-actions">'+
      '<button type="button" class="'+active('1')+'" data-v420-pick="1">1 · '+esc(home)+'</button>'+
      '<button type="button" class="'+active('X')+'" data-v420-pick="X">X · Empate</button>'+
      '<button type="button" class="'+active('2')+'" data-v420-pick="2">2 · '+esc(away)+'</button>'+
    '</div>'+
    '<button type="button" class="v420-back-build" data-v92-tab="Resumen">Volver al Match Center</button>'+
  '</section>';
}
function referenceMarketBar(m,state){
  const live=state.kind==='window';
  let saved=null;try{saved=JSON.parse(localStorage.getItem('v420-prediction:'+m.key)||'null')}catch(_){}
  const picked=String(saved?.pick||'');
  const cls=v=>picked===v?' active':'';
  return '<section class="v417-reference-tools">'+
    '<div class="v417-mode-row">'+
      '<button type="button" data-v92-tab="Cronología" class="'+(live?'active':'')+'">DIRECTO</button>'+
      '<button type="button" data-v92-tab="Previa" class="'+(!live?'active':'')+'">PRE-PARTIDO</button>'+
      '<span>Anuncio</span>'+
    '</div>'+
    '<div class="v417-market-row" aria-label="Pronóstico local 1 X 2">'+
      '<span class="v417-market-brand"><b>LIGA</b></span>'+
      '<button type="button" class="v417-market-btn'+cls('1')+'" data-v417-market-pick="1" aria-pressed="'+(picked==='1')+'"><small>1</small><b>—</b></button>'+
      '<button type="button" class="v417-market-btn'+cls('X')+'" data-v417-market-pick="X" aria-pressed="'+(picked==='X')+'"><small>X</small><b>—</b></button>'+
      '<button type="button" class="v417-market-btn'+cls('2')+'" data-v417-market-pick="2" aria-pressed="'+(picked==='2')+'"><small>2</small><b>—</b></button>'+
    '</div>'+
    '<small class="v417-market-note">Pronóstico guardado en este dispositivo · la Liga no publica cuotas</small>'+
  '</section>';
}
function previewBody(m,state){
  const r=m.r,home=r[2],away=r[6],h=standing(m,home),a=standing(m,away);
  const hpj=num(h?.[2]),apj=num(a?.[2]),hgf=num(h?.[6]),agf=num(a?.[6]),hgc=num(h?.[7]),agc=num(a?.[7]);
  const havg=Number.isFinite(hpj)&&hpj>0&&Number.isFinite(hgf)?hgf/hpj:null;
  const aavg=Number.isFinite(apj)&&apj>0&&Number.isFinite(agf)?agf/apj:null;
  const hcavg=Number.isFinite(hpj)&&hpj>0&&Number.isFinite(hgc)?hgc/hpj:null;
  const acavg=Number.isFinite(apj)&&apj>0&&Number.isFinite(agc)?agc/apj:null;
  return '<section class="v416-preview">'+
    '<section class="v416-general-card">'+
      '<header><h2>ESTADÍSTICAS GENERALES</h2></header>'+
      '<div class="v416-segment"><button type="button" class="active" data-v92-refresh title="Actualizar datos oficiales">'+esc(m.category)+'</button><button type="button" data-v92-tab="Estadísticas">TODO</button></div>'+
      '<div class="v416-team-form">'+previewTeam(m,home,'home')+previewTeam(m,away,'away')+'</div>'+
      previewValueRow('Posesión',null,null,{suffix:'%',decimals:0,unavailable:true})+
      previewValueRow('Goles a favor',havg,aavg,{decimals:2})+
      previewValueRow('Goles en contra',hcavg,acavg,{decimals:2})+
      previewValueRow('Tiros a puerta',null,null,{decimals:1,unavailable:true})+
      previewValueRow('Tiros a puerta en contra',null,null,{decimals:1,unavailable:true})+
      previewValueRow('Valor de la plantilla (M€)',null,null,{decimals:1,unavailable:true})+
      '<p class="v416-data-note">Cuando la Liga no publica una estadística aparece “—”. No se inventan posesión, tiros, dorsales ni valor de plantilla.</p>'+
    '</section>'+
  '</section>';
}

/* V516 — bloque inferior permanente tipo referencia.
   Se agrega debajo del contenido existente del Match Center; no reemplaza
   ninguna pestaña ni dato oficial. Reutiliza logos y estadísticas reales. */
function referenceLowerPanel(m,state,{showMode=true}={}){
  return '<section class="v516-matchcenter-lower" aria-label="Pre-partido y estadísticas generales">'+
    (showMode?referenceMarketBar(m,state):'')+
    previewBody(m,state)+
    '<nav class="v516-matchcenter-shortcuts" aria-label="Más opciones del partido">'+
      '<button type="button" data-v92-tab="BuildUp">PREVIA</button>'+
      '<button type="button" data-v92-tab="Predicciones">PREDICCIONES</button>'+
      '<button type="button" data-v92-tab="Cronología">COMENTARIOS</button>'+
      '<button type="button" data-v92-tab="Previa">PRE-PARTIDO</button>'+
      '<button type="button" data-v92-tab="Alineaciones">ALINEACIONES</button>'+
    '</nav>'+
  '</section>';
}
function playerInitials(name){
  const clean=String(name||'').trim();
  return clean.split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'•';
}
function playerImage(name,team,cls,tag='span'){
  let src='';
  try{src=window.LJR_PLAYER_MEDIA?.photo?.(name,team)||window.LJR_PLAYER_PHOTOS?.get?.(name,team)||''}catch(_){}
  const safeTag=tag==='i'?'i':'span';
  if(src)return '<'+safeTag+' class="'+cls+' v576-has-photo"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></'+safeTag+'>';
  return '<'+safeTag+' class="'+cls+'">'+esc(playerInitials(name))+'</'+safeTag+'>';
}
function pitchPlayer(name,idx,side,team){
  const clean=String(name||'').trim();
  return '<span class="v416-pitch-player '+side+' p'+idx+'">'+playerImage(clean,team,'v576-pitch-photo','i')+'<b>'+esc(clean)+'</b></span>';
}
function matchCedula(m){
  const r=m?.r||[],date=dateOnly(r[8]),home=norm(r[2]),away=norm(r[6]);
  const rows=Array.isArray(m?.cat?.cedulas)?m.cat.cedulas:[];
  return rows.filter(x=>{
    const xl=norm(x?.local||x?.home),xa=norm(x?.away||x?.visitante);
    const teams=(xl===home&&xa===away)||(xl===away&&xa===home);
    const sameDate=!date||!x?.date||String(x.date).startsWith(date);
    return teams&&sameDate;
  }).sort((a,b)=>Number(b?.id||0)-Number(a?.id||0))[0]||null;
}
function refereeData(m){
  const x=matchCedula(m)||{};
  const first=(...keys)=>{
    for(const k of keys){const v=x?.[k];if(typeof v==='string'&&v.trim())return v.trim()}
    return '';
  };
  return [
    {role:'Árbitro',name:first('referee','arbitro','árbitro','arbitro_central','central')},
    {role:'Árbitro asistente',name:first('assistant_referee','arbitro_asistente','asistente','assistant')},
    {role:'Cuarto árbitro',name:first('fourth_official','cuarto_arbitro','cuarto','fourth')}
  ];
}
function benchFor(m,team,starters){
  const all=roster(m,team),used=new Set((starters||[]).map(norm));
  const rest=all.filter(n=>!used.has(norm(n)));
  return rest.length?rest:all.slice(11);
}
function benchPlayer(name,team){
  const clean=String(name||'').trim();
  return '<span class="v417-bench-player">'+playerImage(clean,team,'v576-bench-photo','i')+'<b>'+esc(clean)+'</b></span>';
}
function changesBlock(m,homeStarters,awayStarters){
  const r=m.r,homeBench=benchFor(m,r[2],homeStarters).slice(0,10),awayBench=benchFor(m,r[6],awayStarters).slice(0,10);
  const max=Math.max(homeBench.length,awayBench.length);
  const rows=max?Array.from({length:max},(_,i)=>'<div class="v417-change-row">'+
    (homeBench[i]?benchPlayer(homeBench[i],r[2]):'<span></span>')+
    (awayBench[i]?benchPlayer(awayBench[i],r[6]):'<span></span>')+
  '</div>').join(''):'<p class="v417-empty-line">Sin suplentes publicados para este partido.</p>';
  return '<section class="v417-changes"><header><h3>CAMBIOS</h3></header>'+
    '<div class="v417-change-head"><span>'+esc(r[2])+'</span><span>'+esc(r[6])+'</span></div>'+
    rows+
  '</section>';
}
function refereesBlock(m){
  const refs=refereeData(m),has=refs.some(x=>x.name);
  return '<section class="v417-referees"><header><h3>ÁRBITROS</h3></header>'+
    refs.map(x=>'<div><b>'+(x.name?esc(x.name):'No publicado')+'</b><span>'+esc(x.role)+'</span></div>').join('')+
    (!has?'<small>La Liga todavía no ha publicado la designación arbitral para este partido.</small>':'')+
  '</section>';
}
function lineupPitch(m){
  const r=m.r,home=r[2],away=r[6],homeOfficial=lineupFor(m,home),awayOfficial=lineupFor(m,away);
  const hl=homeOfficial?.names?.length?homeOfficial.names:roster(m,home);
  const al=awayOfficial?.names?.length?awayOfficial.names:roster(m,away);
  const isOfficial=!!(homeOfficial||awayOfficial);
  if(!hl.length&&!al.length){
    return '<section class="v416-lineup-visual empty"><div class="v416-lineup-title"><span><small>VISTA DE CANCHA</small><b>Alineaciones</b></span></div><div class="v416-pitch-empty"><b>Alineación pendiente</b><small>La cancha se llenará con jugadores reales cuando la Liga publique titulares o exista una plantilla registrada.</small></div></section>';
  }
  const hp=hl.slice(0,11),ap=al.slice(0,11);
  return '<section class="v416-lineup-visual">'+
    '<div class="v416-lineup-title"><span><small>VISTA DE CANCHA</small><b>'+(isOfficial?'Alineaciones publicadas':'Plantillas registradas')+'</b></span><em>'+(isOfficial?'Sin inventar posiciones':'Vista visual · no es alineación oficial')+'</em></div>'+
    '<div class="v417-coach-row home">'+teamLogo(home,'coach')+'<span><b>No publicado</b><small>'+esc(home)+'</small></span><em>—</em></div>'+
    '<div class="v416-pitch">'+
      '<div class="v416-pitch-team top">'+teamLogo(home,'pitch')+'<b>'+esc(home)+'</b><em>—</em></div>'+
      '<span class="v418-formation top">—</span>'+
      hp.map((n,i)=>pitchPlayer(n,i,'home',home)).join('')+
      ap.map((n,i)=>pitchPlayer(n,i,'away',away)).join('')+
      '<span class="v418-formation bottom">—</span>'+
      '<div class="v416-pitch-team bottom"><em>—</em><b>'+esc(away)+'</b>'+teamLogo(away,'pitch')+'</div>'+
    '</div>'+
    '<div class="v417-coach-row away"><em>—</em><span><b>No publicado</b><small>'+esc(away)+'</small></span>'+teamLogo(away,'coach')+'</div>'+
    '<p>Distribución visual con los nombres reales disponibles. La formación, entrenador y posiciones se muestran como “—” cuando no están publicados.</p>'+
  '</section>'+changesBlock(m,hp,ap)+refereesBlock(m);
}
function matchPicker(m){
  const now=mexicoStamp();
  const list=allMatches();
  let options=list.filter(x=>x.start>=now-1000*60*60*24*2);
  if(!options.some(x=>x.key===m.key))options=[m,...options];
  const option=x=>{
    const r=x.r,s=publishedScore(r);
    const center=s?s.text:clock(r[8]);
    return '<option value="'+esc(x.key)+'" '+(x.key===m.key?'selected':'')+'>'+esc(x.category)+' · '+esc(dateOnly(r[8]))+' '+esc(center)+' · '+esc(r[2])+' vs '+esc(r[6])+'</option>';
  };
  return '<section class="v92-match-picker"><label><span>Partido oficial</span><select data-v92-match-select>'+options.map(option).join('')+'</select></label><small>Elige otro partido publicado por la Liga.</small></section>';
}

function teamFixtureRows(m,team){
  const wanted=norm(team);
  return allCategoryFixtureRows(m).filter(r=>norm(r?.[2])===wanted||norm(r?.[6])===wanted).map(r=>({
    r,
    stamp:fixtureStamp(r?.[8]),
    score:publishedScore(r)
  })).sort((a,b)=>(a.stamp||0)-(b.stamp||0));
}
function fixtureForTeam(team,item){
  const r=item.r,home=norm(r?.[2])===norm(team),opp=home?r?.[6]:r?.[2],score=item.score;
  let result='';
  if(score){
    const gf=home?Number(score.home):Number(score.away),ga=home?Number(score.away):Number(score.home);
    result=gf>ga?'V':gf<ga?'D':'E';
  }
  return {r,opp,home,score,result};
}
function profileRecent(m,team){
  return teamFixtureRows(m,team).filter(x=>x.score).slice(-5).reverse().map(x=>fixtureForTeam(team,x));
}
function profileNext(m,team){
  const now=mexicoStamp();
  return teamFixtureRows(m,team).filter(x=>!x.score&&Number.isFinite(x.stamp)&&x.stamp>=now-60*60000).slice(0,3).map(x=>fixtureForTeam(team,x));
}
function scorerRows(m,team){
  const wanted=norm(team);
  return (m?.cat?.scorers?.[0]?.rows||[]).filter(r=>Array.isArray(r)&&norm(r?.[2])===wanted&&String(r?.[1]||'').trim()).map(r=>({
    pos:Number(r?.[0])||0,
    name:String(r?.[1]||'').trim(),
    team:String(r?.[2]||'').trim(),
    goals:Number(r?.[3])||0
  })).sort((a,b)=>b.goals-a.goals||a.pos-b.pos);
}
function standingIndex(m,team){
  return standings(m).findIndex(r=>norm(r?.[1])===norm(team));
}
function standingObj(m,team){
  const r=standing(m,team);
  if(!r)return null;
  return {pos:Number(r?.[0])||standingIndex(m,team)+1,name:r?.[1]||team,pj:num(r?.[2]),g:num(r?.[3]),e:num(r?.[4]),p:num(r?.[5]),gf:num(r?.[6]),gc:num(r?.[7]),dg:num(r?.[8]),pts:num(r?.[9])};
}
function resultChip(x){
  const cls=x.result==='V'?'win':x.result==='E'?'draw':'loss';
  const score=x.score?(x.home?x.score.home+' - '+x.score.away:x.score.away+' - '+x.score.home):'—';
  return '<div class="v419-result '+cls+'"><span>'+teamLogo(x.opp,'v419-opponent')+'</span><b>'+esc(score)+'</b><small>'+esc(x.result||'—')+'</small></div>';
}
function nextCard(x){
  return '<button type="button" class="v419-next-match" data-v419-match-date="'+esc(dateOnly(x.r?.[8]))+'">'+
    teamLogo(x.opp,'v419-next-logo')+
    '<span><b>'+esc(x.opp||'Por confirmar')+'</b><small>'+esc(dateOnly(x.r?.[8]))+' · '+esc(clock(x.r?.[8]))+'</small></span>'+
    '<em>'+esc(x.r?.[7]||'Campo por confirmar')+'</em>'+
  '</button>';
}
function miniTableRows(m,team){
  const all=standings(m).filter(r=>Array.isArray(r)&&r?.[1]);
  const idx=all.findIndex(r=>norm(r?.[1])===norm(team));
  let slice=[];
  if(idx<0)slice=all.slice(0,4);
  else slice=all.slice(Math.max(0,idx-1),Math.min(all.length,idx+3));
  if(slice.length<4)slice=all.slice(Math.max(0,all.length-4));
  return slice.map(r=>'<div class="v419-table-row '+(norm(r?.[1])===norm(team)?'active':'')+'">'+
    '<b>'+esc(r?.[0]??'—')+'</b>'+
    '<span>'+teamLogo(r?.[1],'v419-table-logo')+'<strong>'+esc(r?.[1]||'')+'</strong></span>'+
    '<em>'+esc(r?.[2]??'—')+'</em><em>'+esc(r?.[8]??'—')+'</em><em>'+esc(r?.[9]??'—')+'</em>'+
  '</div>').join('');
}
function playerCard(name,goals,team,index){
  return '<article class="v419-player-card">'+
    playerImage(name,team,'v419-player-avatar')+
    '<div><small>#'+(index+1)+'</small><b>'+esc(name)+'</b><em>'+esc(team)+'</em></div>'+
    '<strong>'+(Number.isFinite(goals)?esc(goals):'—')+'<small> G</small></strong>'+
  '</article>';
}
function profilePlayers(m,team){
  const scorers=scorerRows(m,team).slice(0,4);
  if(scorers.length)return scorers.map((x,i)=>playerCard(x.name,x.goals,team,i)).join('');
  return roster(m,team).slice(0,4).map((n,i)=>playerCard(n,null,team,i)).join('')||
    '<div class="v419-empty">No hay jugadores publicados para este equipo.</div>';
}
function compareTeamBlock(m,team,opp){
  const a=standingObj(m,team),b=standingObj(m,opp);
  const cell=(label,av,bv)=>'<div><span>'+esc(av??'—')+'</span><small>'+label+'</small><span>'+esc(bv??'—')+'</span></div>';
  return '<section class="v419-card v419-compare" data-v419-profile-section="estadisticas">'+
    '<header><h3>Comparación de rendimiento</h3><small>'+esc(m.category)+'</small></header>'+
    '<div class="v419-compare-head"><span>'+teamLogo(team,'v419-compare-logo')+'<b>'+esc(team)+'</b></span><span>'+teamLogo(opp,'v419-compare-logo')+'<b>'+esc(opp)+'</b></span></div>'+
    cell('Posición',a?.pos,b?.pos)+cell('Puntos',a?.pts,b?.pts)+cell('Goles a favor',a?.gf,b?.gf)+cell('Diferencia',a?.dg,b?.dg)+
  '</section>';
}
function teamProfileDashboard(m){
  const r=m.r,team=profileSide==='away'?r[6]:r[2],opp=profileSide==='away'?r[2]:r[6];
  const st=standingObj(m,team),recent=profileRecent(m,team),next=profileNext(m,team);
  const form=recent.slice(0,5);
  const venue=r?.[7]||'Campo por confirmar';
  return '<section class="v419-profile" data-v419-profile>'+
    '<div class="v419-team-switch"><button type="button" class="'+(profileSide==='home'?'active':'')+'" data-v419-profile-side="home">LOCAL</button><button type="button" class="'+(profileSide==='away'?'active':'')+'" data-v419-profile-side="away">VISITANTE</button></div>'+
    '<section class="v419-team-hero">'+
      teamLogo(team,'v419-hero-logo')+
      '<div><small>'+esc(m.category)+'</small><h2>'+esc(team)+'</h2><p>'+(st?'Posición '+esc(st.pos)+' · '+esc(st.pts??'—')+' pts':'Sin posición publicada')+'</p></div>'+
      '<button type="button" data-v419-open-team="'+esc(team)+'">VER EQUIPO</button>'+
    '</section>'+
    '<nav class="v419-subtabs" aria-label="Secciones del equipo">'+
      '<button type="button" class="active" data-v419-profile-scroll="resumen">Resumen</button>'+
      '<button type="button" data-v419-profile-scroll="resultados">Resultados</button>'+
      '<button type="button" data-v419-profile-scroll="plantilla">Plantilla</button>'+
      '<button type="button" data-v419-profile-scroll="tabla">Tabla</button>'+
      '<button type="button" data-v419-profile-scroll="estadisticas">Estadísticas</button>'+
    '</nav>'+
    '<section class="v419-card v419-next" data-v419-profile-section="resumen"><header><h3>Próximo partido</h3><small>'+esc(next[0]?dateOnly(next[0].r?.[8]):'Por confirmar')+'</small></header>'+
      (next[0]?'<div class="v419-next-main"><span>'+teamLogo(team,'v419-main-logo')+'<b>'+esc(team)+'</b></span><strong>'+esc(clock(next[0].r?.[8]))+'</strong><span>'+teamLogo(next[0].opp,'v419-main-logo')+'<b>'+esc(next[0].opp)+'</b></span></div>':'<div class="v419-empty">No hay siguiente partido publicado.</div>')+
    '</section>'+
    '<section class="v419-card v419-form" data-v419-profile-section="resultados"><header><h3>Últimos resultados</h3><small>'+form.length+' partidos</small></header><div class="v419-form-grid">'+(form.length?form.map(resultChip).join(''):'<div class="v419-empty">Sin resultados publicados.</div>')+'</div></section>'+
    '<section class="v419-card v419-calendar"><header><h3>Próximos del calendario</h3><small>'+esc(m.category)+'</small></header><div class="v419-next-list">'+(next.length?next.map(nextCard).join(''):'<div class="v419-empty">Sin próximos partidos publicados.</div>')+'</div></section>'+
    '<section class="v419-card v419-lineup-preview" data-v419-profile-section="plantilla"><header><h3>Plantilla / alineación</h3><small>'+roster(m,team).length+' jugadores</small></header>'+
      '<div class="v419-mini-pitch">'+
        roster(m,team).slice(0,11).map((n,i)=>'<span class="p'+i+'">'+playerImage(n,team,'v576-mini-photo','i')+'<b>'+esc(n)+'</b></span>').join('')+
      '</div>'+
    '</section>'+
    '<section class="v419-card v419-league" data-v419-profile-section="tabla"><header><h3>La liga</h3><small>'+esc(m.category)+'</small></header>'+
      '<div class="v419-table-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>'+
      '<div class="v419-table-body">'+miniTableRows(m,team)+'</div>'+
    '</section>'+
    '<section class="v419-card v419-history"><header><h3>Posición actual</h3><small>Histórico cuando exista</small></header>'+
      '<div class="v419-history-track"><i></i><span class="current"><b>'+esc(st?.pos??'—')+'</b><small>ACTUAL</small></span></div>'+
      '<p>El snapshot oficial actual no incluye una serie histórica de posiciones; se muestra solamente la posición vigente.</p>'+
    '</section>'+
    compareTeamBlock(m,team,opp)+
    '<section class="v419-card v419-best"><header><h3>Mejores jugadores</h3><small>Goleadores publicados</small></header><div class="v419-player-grid">'+profilePlayers(m,team)+'</div></section>'+
    '<section class="v419-card v419-competition"><header><h3>Competiciones</h3></header>'+
      '<div class="v419-competition-row"><span>⚽</span><div><b>Liga Municipal</b><small>'+esc(m.category)+'</small></div><em>ACTIVA</em></div>'+
    '</section>'+
    '<section class="v419-card v419-fixtures"><header><h3>Partidos</h3><small>Calendario oficial</small></header>'+
      '<div class="v419-fixture-summary"><span><b>'+esc(st?.pj??'—')+'</b><small>Jugados</small></span><span><b>'+esc(st?.g??'—')+'</b><small>Ganados</small></span><span><b>'+esc(st?.e??'—')+'</b><small>Empates</small></span><span><b>'+esc(st?.p??'—')+'</b><small>Perdidos</small></span></div>'+
    '</section>'+
    '<section class="v419-card v419-trophies"><header><h3>Títulos</h3><small>Datos disponibles</small></header><div class="v419-empty">Los títulos históricos del equipo no están incluidos en el snapshot del Match Center.</div></section>'+
    '<section class="v419-card v419-stadium"><header><h3>Estadio / campo</h3></header><div class="v419-stadium-row"><span>▣</span><div><b>'+esc(venue)+'</b><small>'+esc(dateOnly(r?.[8]))+' · '+esc(clock(r?.[8]))+'</small></div><em>CAMPO</em></div></section>'+
  '</section>';
}

function v423Pad(n){return String(n).padStart(2,'0')}
function v423DateParts(key){
  const m=String(key||'').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m?{d:+m[1],mo:+m[2],y:+m[3]}:null;
}
function v423KeyFromStamp(stamp){
  const d=new Date(stamp);
  return v423Pad(d.getUTCDate())+'/'+v423Pad(d.getUTCMonth()+1)+'/'+d.getUTCFullYear();
}
function v423Shift(key,days){
  const p=v423DateParts(key);if(!p)return key;
  return v423KeyFromStamp(Date.UTC(p.y,p.mo-1,p.d+days,12,0,0));
}
function v423MonthName(key){
  const p=v423DateParts(key);if(!p)return 'Calendario';
  return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][p.mo-1]||'Calendario';
}
function v423DayLetter(key){
  const p=v423DateParts(key);if(!p)return '';
  return ['D','L','M','M','J','V','S'][new Date(Date.UTC(p.y,p.mo-1,p.d,12,0,0)).getUTCDay()];
}
function v423DefaultDate(m){
  if(v423Date)return v423Date;
  const current=v423KeyFromStamp(mexicoStamp());
  const todayHas=allMatches().some(x=>dateOnly(x.r?.[8])===current);
  v423Date=todayHas?current:(dateOnly(m?.r?.[8])||current);
  return v423Date;
}
function v423LiveCount(){
  const now=mexicoStamp();
  return allMatches().filter(x=>stateFor(x,now).kind==='window').length;
}
function v423Saved(key){
  try{return JSON.parse(localStorage.getItem('v423-match-favs')||'[]').includes(String(key))}catch(_){return false}
}
function v423StatusText(x){
  const s=stateFor(x),score=publishedScore(x.r);
  if(s.kind==='awarded')return {kind:'awarded',score:s.primary,meta:s.secondary};
  if(score)return {kind:'final',score:score.text,meta:'Final'};
  if(s.kind==='window')return {kind:'live',score:'—',meta:'En directo'};
  if(s.kind==='scheduled')return {kind:'scheduled',score:clock(x.r?.[8]),meta:'Programado'};
  return {kind:'pending',score:'—',meta:'Pendiente'};
}
function v423MatchCard(x){
  const r=x.r,s=v423StatusText(x),fav=v423Saved(x.key);
  return '<article class="v423-match-card">'+
    '<header><span><b>'+esc(x.category)+'</b><small>Jornada '+esc(r?.[1]||'—')+'</small></span><button type="button" class="'+(fav?'active':'')+'" data-v423-fav="'+esc(x.key)+'" aria-label="Favorito">☆</button></header>'+
    '<button type="button" class="v423-match-open" data-v423-match="'+esc(x.key)+'">'+
      '<p>'+esc(r?.[7]||'Campo por confirmar')+'</p>'+
      '<div class="v423-team-row"><span>'+teamLogo(r?.[2],'v423-logo')+'<b>'+esc(r?.[2]||'')+'</b></span><strong>'+esc(s.kind==='final'?String(publishedScore(r)?.home??'—'):s.kind==='live'?'•':'')+'</strong></div>'+
      '<div class="v423-team-row"><span>'+teamLogo(r?.[6],'v423-logo')+'<b>'+esc(r?.[6]||'')+'</b></span><strong>'+esc(s.kind==='final'?String(publishedScore(r)?.away??'—'):'')+'</strong></div>'+
      '<em class="'+esc(s.kind)+'">'+(s.kind==='live'?'<i></i>':'')+esc(s.meta)+'</em>'+
    '</button>'+
    '<button type="button" class="v423-standings-btn" data-v92-tab="Estadísticas">Mostrar clasificación</button>'+
  '</article>';
}
function matchCenterCalendarBlock(m){
  const selected=v423DefaultDate(m),liveCount=v423LiveCount();
  const cats=[...new Set(allMatches().map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  let list=allMatches().filter(x=>dateOnly(x.r?.[8])===selected);
  if(v423Category!=='all')list=list.filter(x=>x.category===v423Category);
  if(v423LiveOnly)list=list.filter(x=>stateFor(x).kind==='window');
  if(v423Status==='live')list=list.filter(x=>stateFor(x).kind==='window');
  if(v423Status==='scheduled')list=list.filter(x=>stateFor(x).kind==='scheduled');
  if(v423Status==='final')list=list.filter(x=>!!publishedScore(x.r));
  const days=Array.from({length:7},(_,i)=>v423Shift(selected,i-3));
  return '<section class="v423-calendar-center" data-v423-calendar>'+
    '<header class="v423-calendar-head">'+
      '<div class="v423-calendar-top">'+
        '<button type="button" class="v423-live-pill '+(v423LiveOnly?'active':'')+'" data-v423-live><i></i><span>En vivo</span><b>'+liveCount+'</b></button>'+
        '<h2>'+esc(v423MonthName(selected))+'</h2>'+
        '<div><button type="button" data-v423-search aria-label="Buscar">⌕</button><button type="button" data-v423-calendar-open aria-label="Calendario">▦</button></div>'+
      '</div>'+
      '<div class="v423-days">'+days.map(k=>'<button type="button" class="'+(k===selected?'active':'')+'" data-v423-date="'+esc(k)+'"><small>'+esc(v423DayLetter(k))+'</small><b>'+esc(v423DateParts(k)?.d??'')+'</b></button>').join('')+'</div>'+
    '</header>'+
    '<div class="v423-filters">'+
      '<label><select data-v423-category><option value="all">Todas las categorías</option>'+cats.map(cat=>'<option value="'+esc(cat)+'" '+(cat===v423Category?'selected':'')+'>'+esc(cat)+'</option>').join('')+'</select></label>'+
      '<label><select data-v423-status><option value="all">Todos los estados</option><option value="live" '+(v423Status==='live'?'selected':'')+'>En vivo</option><option value="scheduled" '+(v423Status==='scheduled'?'selected':'')+'>Próximos</option><option value="final" '+(v423Status==='final'?'selected':'')+'>Finalizados</option></select></label>'+
    '</div>'+
    '<div class="v423-cards">'+(list.length?list.map(v423MatchCard).join(''):'<div class="v423-empty"><b>Sin partidos para este día</b><span>Cambia la fecha o los filtros para ver otros partidos publicados.</span></div>')+'</div>'+
  '</section>';
}

function v424H2H(m){
  const r=m.r,home=r[2],away=r[6],h=norm(home),a=norm(away);
  const rows=allCategoryFixtureRows(m).map(x=>({r:x,score:publishedScore(x),stamp:fixtureStamp(x?.[8])}))
    .filter(x=>x.score&&((norm(x.r?.[2])===h&&norm(x.r?.[6])===a)||(norm(x.r?.[2])===a&&norm(x.r?.[6])===h)))
    .sort((x,y)=>(x.stamp||0)-(y.stamp||0));
  let wins=0,draws=0,losses=0;
  rows.forEach(x=>{
    const homeIsTarget=norm(x.r?.[2])===h;
    const gf=homeIsTarget?Number(x.score.home):Number(x.score.away);
    const ga=homeIsTarget?Number(x.score.away):Number(x.score.home);
    if(gf>ga)wins++; else if(gf<ga)losses++; else draws++;
  });
  return {played:rows.length,wins,draws,losses};
}
function v424FormDots(m,team,limit=10){
  const list=teamForm(m,team,limit);
  return list.map(x=>'<i class="'+(x.result==='V'?'win':x.result==='E'?'draw':'loss')+'" title="'+esc(x.result)+'"></i>').join('')||
    '<span class="v424-noform">Sin resultados</span>';
}
function v424FormCounts(m,team){
  const list=teamForm(m,team,10);
  return {
    wins:list.filter(x=>x.result==='V').length,
    draws:list.filter(x=>x.result==='E').length,
    losses:list.filter(x=>x.result==='D').length
  };
}
function v424LowerReference(m){
  const r=m.r,home=r[2],away=r[6],h2h=v424H2H(m),hf=v424FormCounts(m,home),af=v424FormCounts(m,away);
  return '<section class="v424-reference-lower" data-v424-reference-lower>'+
    '<section class="v424-card v424-h2h">'+
      '<header><h3>Head to Head</h3></header>'+
      '<div class="v424-h2h-teams">'+
        '<span>'+teamLogo(home,'v424-team-logo')+'<b>'+esc(home)+'</b></span>'+
        '<em>VS</em>'+
        '<span>'+teamLogo(away,'v424-team-logo')+'<b>'+esc(away)+'</b></span>'+
      '</div>'+
      '<div class="v424-h2h-grid">'+
        '<div><small>Jugados</small><b>'+esc(h2h.played)+'</b></div>'+
        '<div><small>Ganados</small><b>'+esc(h2h.wins)+'</b></div>'+
        '<div><small>Perdidos</small><b>'+esc(h2h.losses)+'</b></div>'+
        '<div><small>Empates</small><b>'+esc(h2h.draws)+'</b></div>'+
      '</div>'+
      '<p>Historial disponible en la categoría actual · cifras desde la perspectiva de '+esc(home)+'.</p>'+
    '</section>'+
    '<section class="v424-card v424-form-card">'+
      '<header><h3>Team Form</h3><small>'+esc(m.category)+'</small></header>'+
      '<div class="v424-form-teams">'+
        '<span>'+teamLogo(home,'v424-form-logo')+'<b>'+esc(home)+'</b></span>'+
        '<span>'+teamLogo(away,'v424-form-logo')+'<b>'+esc(away)+'</b></span>'+
      '</div>'+
      '<div class="v424-form-row"><span>'+v424FormDots(m,home,10)+'</span><span>'+v424FormDots(m,away,10)+'</span></div>'+
      '<div class="v424-form-stats">'+
        '<div><span><b>'+esc(hf.wins)+'</b><small>Ganados</small></span><span><small>Ganados</small><b>'+esc(af.wins)+'</b></span></div>'+
        '<div><span><b>'+esc(hf.draws)+'</b><small>Empates</small></span><span><small>Empates</small><b>'+esc(af.draws)+'</b></span></div>'+
        '<div><span><b>'+esc(hf.losses)+'</b><small>Perdidos</small></span><span><small>Perdidos</small><b>'+esc(af.losses)+'</b></span></div>'+
      '</div>'+
    '</section>'+
  '</section>';
}
function rosterSummary(m,team){
  const names=roster(m,team);
  return '<article class="v92-player-card">'+teamLogo(team,'small')+'<span><b>'+esc(team)+'</b><small>'+names.length+' jugadores registrados · '+esc(m.category)+'</small></span></article>';
}
function summaryBody(m,state){
  const r=m.r,home=r[2],away=r[6],venue=r[7]||'Campo por confirmar',score=publishedScore(r);
  const status=score?score.text:(state.kind==='scheduled'?'Programado':state.kind==='window'?'En directo':'Resultado pendiente');
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
    '</div></section>'+
    teamProfileDashboard(m)+
    buildUpBody(m,state)+
    matchCenterCalendarBlock(m);
}
function rosterColumn(m,team){
  const confirmed=lineupFor(m,team);
  const names=confirmed?.names?.length?confirmed.names:roster(m,team);
  const label=confirmed?.label||'Plantilla oficial registrada · alineación aún no publicada';
  /* V631 — juventinorosasliga.com devuelve 403 al abrir algunas cédulas por enlace directo.
     Mantener la navegación dentro de la app evita el bloqueo y permite abrir/generar la cédula
     desde el directorio sincronizado, donde también puede imprimirse o guardarse como PDF. */
  const source=confirmed?.url?'<a class="v92-lineup-source" href="#/cedulas">Abrir cédula en la app</a>':'';
  return '<article class="v92-roster '+(confirmed?'is-confirmed-lineup':'')+'"><div class="v92-roster-title">'+teamLogo(team,'tiny')+'<span><b>'+esc(team)+'</b><small>'+esc(label)+'</small>'+source+'</span></div>'+
    (names.length?'<ol>'+names.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ol>':'<p>No hay jugadores públicos disponibles.</p>')+'</article>';
}
function mvpKey(m){return 'v92-mvp-local:'+String(m?.key||'match')}
function mvpSelection(m){
  try{return JSON.parse(localStorage.getItem(mvpKey(m))||'null')}catch(_){return null}
}
function mvpPlayers(m){
  const r=m.r,home=r[2],away=r[6],out=[];
  const hn=lineupFor(m,home)?.names||roster(m,home);
  const an=lineupFor(m,away)?.names||roster(m,away);
  hn.forEach(name=>out.push({team:home,name}));
  an.forEach(name=>out.push({team:away,name}));
  return out;
}
function mvpCard(m){
  const vote=mvpSelection(m);
  return '<section class="v92-mvp-section">'+
    '<div class="v92-mvp-head"><h2>Jugador del partido</h2><button type="button" data-v92-vote-mvp>⭐ Votar MVP</button></div>'+
    '<article class="v92-mvp-card">'+
      '<span class="v92-mvp-star">★</span>'+
      '<span class="v92-mvp-copy"><b>'+(vote?.player?esc(vote.player):'MVP por elegir')+'</b><small>'+(vote?.team?esc(vote.team)+' · selección local':'Elige entre jugadores registrados del partido')+'</small></span>'+
      '<strong>'+(vote?.player?'MVP':'—')+'</strong>'+
    '</article>'+
  '</section>';
}
function openMvpVote(m){
  document.querySelector('.v92-mvp-modal')?.remove();
  const players=mvpPlayers(m);
  const r=m.r,home=r[2],away=r[6];
  const modal=document.createElement('div');
  modal.className='v92-mvp-modal';
  modal.innerHTML='<button class="v92-mvp-backdrop" type="button" data-v92-mvp-close aria-label="Cerrar"></button>'+
    '<section><header><span><small>VOTACIÓN LOCAL</small><b>Votar MVP</b></span><button type="button" data-v92-mvp-close>×</button></header>'+
    (players.length?
      '<label><span>Equipo</span><select data-v92-mvp-team><option>'+esc(home)+'</option><option>'+esc(away)+'</option></select></label>'+
      '<label><span>Jugador</span><select data-v92-mvp-player></select></label>'+
      '<button class="v92-mvp-save" type="button" data-v92-mvp-save>Guardar voto</button>'+
      '<p>Selección local del dispositivo. No modifica estadísticas ni resultados oficiales.</p>'
      :
      '<div class="v92-mvp-empty"><b>Sin jugadores registrados disponibles</b><span>La votación se habilitará cuando existan plantillas públicas para este partido.</span></div>')+
    '</section>';
  document.body.appendChild(modal);
  const close=()=>modal.remove();
  modal.querySelectorAll('[data-v92-mvp-close]').forEach(b=>b.onclick=close);
  if(!players.length)return;
  const teamSel=modal.querySelector('[data-v92-mvp-team]');
  const playerSel=modal.querySelector('[data-v92-mvp-player]');
  const fill=()=>{playerSel.innerHTML=players.filter(x=>x.team===teamSel.value).map(x=>'<option>'+esc(x.name)+'</option>').join('')};
  teamSel.onchange=fill;fill();
  modal.querySelector('[data-v92-mvp-save]').onclick=()=>{
    const player=playerSel.value,team=teamSel.value;
    if(!player)return;
    try{localStorage.setItem(mvpKey(m),JSON.stringify({player,team,at:new Date().toISOString()}))}catch(_){}
    close();renderGuard=false;render();
  };
}
function lineupsBody(m){
  const r=m.r,homeLineup=lineupFor(m,r[2]),awayLineup=lineupFor(m,r[6]);
  const hasOfficial=!!(homeLineup||awayLineup);
  return '<section class="v92-section v92-lineups-section">'+
    '<div class="v92-lineups-head"><h2>Alineaciones</h2><button type="button" data-v92-pitch>Ver cancha</button></div>'+
    '<small class="v92-lineups-note">'+(hasOfficial?'Alineaciones actualizadas con la información publicada para este partido.':'Se actualizarán automáticamente cuando la Liga publique titulares en la cédula o llegue una alineación por el feed en vivo.')+'</small>'+
    lineupPitch(m)+
    '<div class="v92-roster-grid">'+rosterColumn(m,r[2])+rosterColumn(m,r[6])+'</div>'+
    mvpCard(m)+
  '</section>';
}
function oddsBody(m){
  const r=m.r;
  let saved=null;try{saved=JSON.parse(localStorage.getItem('v420-prediction:'+m.key)||'null')}catch(_){}
  const picked=String(saved?.pick||'');
  const cls=v=>picked===v?' active':'';
  return '<section class="v417-odds-page">'+
    '<header><small>PRONÓSTICO</small><h2>1 X 2</h2><p>Selecciona local, empate o visitante. Se guarda sólo en este dispositivo; no son cuotas de apuesta.</p></header>'+
    '<div class="v417-odds-grid">'+
      '<button type="button" class="'+cls('1')+'" data-v417-market-pick="1" aria-pressed="'+(picked==='1')+'"><span>1</span><b>—</b><small>'+esc(r[2])+'</small></button>'+
      '<button type="button" class="'+cls('X')+'" data-v417-market-pick="X" aria-pressed="'+(picked==='X')+'"><span>X</span><b>—</b><small>Empate</small></button>'+
      '<button type="button" class="'+cls('2')+'" data-v417-market-pick="2" aria-pressed="'+(picked==='2')+'"><span>2</span><b>—</b><small>'+esc(r[6])+'</small></button>'+
    '</div>'+
  '</section>';
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
  if(tab==='BuildUp')return buildUpBody(m,state);
  if(tab==='Predicciones')return predictionsBody(m);
  if(tab==='Previa')return previewBody(m,state);
  if(tab==='Alineaciones')return lineupsBody(m);
  if(tab==='Estadísticas')return statsBody(m);
  if(tab==='Cronología')return timelineBody(m,state);
  if(tab==='Cuotas')return oddsBody(m);
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
  const markup='<article class="v92-matchcenter" data-v92-matchcenter>'+
    '<header class="v92-match-head"><div class="v92-kicker">'+esc(state.label)+'</div><h1>Match Center</h1><p>'+esc(home)+' vs '+esc(away)+' · '+esc(m.category)+' · Jornada '+esc(r[1]||'')+'</p></header>'+
    matchPicker(m)+
    '<section class="v518-matchcenter-unified" data-v518-unified>'+
    '<section class="v92-score-card">'+
      '<div class="v92-side">'+teamLogo(home)+'<b>'+esc(home)+'</b></div>'+
      '<div class="v92-center"><strong data-v92-live-clock>'+esc(center)+'</strong><small data-v92-live-sub>'+esc(state.kind==='window'?state.secondary:state.secondary)+'</small><em class="v418-match-state '+esc(state.kind)+'" data-v92-live-state>'+esc(state.kind==='window'?'En directo':state.kind==='final'?'Finalizado':state.kind==='scheduled'?'Pre-partido':'Pendiente')+'</em></div>'+
      '<div class="v92-side">'+teamLogo(away)+'<b>'+esc(away)+'</b></div>'+
    '</section>'+
    '<div class="v92-official-meta"><span>'+esc(dateOnly(r[8]))+' · '+esc(clock(r[8]))+'</span><span>'+esc(venue)+'</span></div>'+
    '<nav class="v92-tabs v417-reference-tabs" aria-label="Opciones del Match Center">'+[
      ['Cronología','JUGADAS'],
      ['Estadísticas','CLASIFICACIÓN'],
      ['Previa','PREVIA'],
      ['Alineaciones','ALINEACIONES'],
      ['Cuotas','CUOTAS'],
      ['Resumen','RESUMEN']
    ].map(x=>'<button type="button" class="'+(activeTab===x[0]?'active':'')+'" data-v92-tab="'+x[0]+'">'+x[1]+'</button>').join('')+'</nav>'+
    ((activeTab==='Previa'||activeTab==='Alineaciones'||activeTab==='Cuotas')?referenceMarketBar(m,state):'')+
    '<main class="v92-body">'+bodyFor(activeTab,m,state)+'</main>'+
    '<div class="v92-match-actions" aria-label="Acciones del partido">'+
      '<button type="button" data-v92-open-lineups>Alineaciones</button>'+
      '<button type="button" data-v92-pitch>Ver cancha</button>'+
      '<button type="button" class="mvp" data-v92-vote-mvp>⭐ Votar MVP</button>'+
    '</div>'+

    '<p class="v92-source">Datos deportivos públicos de la Liga · '+esc(m.category)+' · '+esc(dateOnly(r[8]))+' · '+esc(venue)+'</p>'+
    '<div class="v518-matchcenter-extras" data-v518-extras></div>'+
    '</section>'+
  '</article>';
  const existing=screen.querySelector('[data-v92-matchcenter]');
  // Keep extension panels and scroll position; unchanged refreshes do no DOM work.
  if(existing?.__markup===markup){renderGuard=false;return;}
  const scrollY=window.scrollY;
  if(existing)existing.outerHTML=markup;
  else screen.innerHTML=markup;
  screen.querySelector('[data-v92-matchcenter]').__markup=markup;
  if(existing){
    window.scrollTo(0,scrollY);
    // Live widgets remount asynchronously. Restore after their layout settles,
    // unless the reader has already started another gesture.
    let cancelled=false;
    const cancel=()=>{cancelled=true};
    window.addEventListener('pointerdown',cancel,{once:true});
    window.addEventListener('wheel',cancel,{once:true,passive:true});
    setTimeout(()=>{if(!cancelled&&isDirectRoute())window.scrollTo(0,scrollY);window.removeEventListener('pointerdown',cancel);window.removeEventListener('wheel',cancel)},240);
  }


  document.body.classList.add('v92-match-center-official');
  screen.querySelector('[data-v92-match-select]')?.addEventListener('change',e=>{selectedKey=e.target.value;activeTab='Resumen';profileSide='home';renderGuard=false;render()});
  const focusMatchSection=(selector)=>{
    const go=()=>{const target=document.querySelector(selector);if(!target)return;try{target.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){target.scrollIntoView?.()}};
    requestAnimationFrame(go);setTimeout(go,120);
  };
  const openProfileLineup=()=>{
    activeTab='Resumen';renderGuard=false;render();
    focusMatchSection('[data-v419-profile-section="plantilla"]');
  };
  screen.querySelectorAll('[data-v92-tab]').forEach(b=>b.onclick=()=>{
    const tab=b.dataset.v92Tab;
    if(tab==='Alineaciones'){
      openProfileLineup();
      refreshOfficialData(true).then(()=>focusMatchSection('[data-v419-profile-section="plantilla"]'));
      return;
    }
    activeTab=tab;renderGuard=false;render();
  });
  screen.querySelector('[data-v420-back]')?.addEventListener('click',()=>{activeTab='Resumen';renderGuard=false;render()});
  screen.querySelector('[data-v420-mute]')?.addEventListener('click',e=>{
    const b=e.currentTarget,host=screen.querySelector('[data-v420-build-up]'),videos=[...(host?.querySelectorAll('video')||[])];
    if(!videos.length)return;
    const currentlyMuted=videos.every(v=>v.muted);
    videos.forEach(v=>{v.muted=!currentlyMuted;if(currentlyMuted){try{v.play?.()}catch(_){}}});
    b.classList.toggle('active',currentlyMuted);
    b.setAttribute('aria-pressed',String(currentlyMuted));
    b.setAttribute('aria-label',currentlyMuted?'Silenciar audio':'Activar audio');
  });
  screen.querySelector('[data-v526-clock]')?.addEventListener('click',()=>{
    const target=screen.querySelector('[data-v420-countdown]');
    try{target?.scrollIntoView({behavior:'smooth',block:'center'})}catch(_){target?.scrollIntoView?.()}
  });

  screen.querySelectorAll('[data-v417-market-pick]').forEach(b=>b.onclick=()=>{
    const pick=b.dataset.v417MarketPick||'';
    try{localStorage.setItem('v420-prediction:'+m.key,JSON.stringify({pick,at:new Date().toISOString()}))}catch(_){}
    renderGuard=false;render();
  });
  screen.querySelectorAll('[data-v92-refresh]').forEach(b=>b.onclick=()=>{b.setAttribute('aria-busy','true');refreshOfficialData(true)});
  screen.querySelectorAll('[data-v419-match-date]').forEach(b=>b.onclick=()=>{
    const date=b.dataset.v419MatchDate||'';
    const team=profileSide==='away'?away:home;
    const next=allMatches().find(x=>dateOnly(x.r?.[8])===date&&(norm(x.r?.[2])===norm(team)||norm(x.r?.[6])===norm(team)));
    if(!next)return;
    selectedKey=next.key;activeTab='Resumen';profileSide='home';renderGuard=false;render();
  });
  screen.querySelectorAll('[data-v92-open-lineups]').forEach(b=>b.onclick=()=>{
    openProfileLineup();
    refreshOfficialData(true).then(()=>focusMatchSection('[data-v419-profile-section="plantilla"]'));
  });
  screen.querySelectorAll('[data-v92-route]').forEach(b=>b.onclick=()=>{location.hash='#/'+b.dataset.v92Route});
  screen.querySelectorAll('[data-v92-pitch]').forEach(b=>b.onclick=()=>{
    try{sessionStorage.setItem('v92-pitch-context',JSON.stringify({match:m.key,home,away,category:m.category,venue}))}catch(_){}
    location.hash='#/venues';
  });
  screen.querySelectorAll('[data-v92-vote-mvp]').forEach(b=>b.onclick=()=>openMvpVote(m));
  screen.querySelectorAll('[data-v419-profile-scroll]').forEach(b=>b.onclick=()=>{
    const profile=b.closest('[data-v419-profile]'),key=b.dataset.v419ProfileScroll||'resumen';
    profile?.querySelectorAll('[data-v419-profile-scroll]').forEach(x=>x.classList.toggle('active',x===b));
    const target=profile?.querySelector('[data-v419-profile-section="'+key+'"]');
    if(target){
      try{target.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){target.scrollIntoView()}
    }
  });
  screen.querySelectorAll('[data-v419-profile-side]').forEach(b=>b.onclick=()=>{profileSide=b.dataset.v419ProfileSide==='away'?'away':'home';renderGuard=false;render()});
  screen.querySelectorAll('[data-v419-open-team]').forEach(b=>b.onclick=()=>{const name=b.dataset.v419OpenTeam||'';try{localStorage.setItem('v62-team-name',name)}catch(_){};try{window.LJR_OFFICIAL_API?.openTeam?.(name)}catch(_){};if(route()===PRIMARY_ROUTE||DIRECT_ROUTES.has(route()))location.hash='#/teamDetail'});
  screen.querySelectorAll('[data-v420-pick]').forEach(b=>b.onclick=()=>{try{localStorage.setItem('v420-prediction:'+m.key,JSON.stringify({pick:b.dataset.v420Pick,at:new Date().toISOString()}))}catch(_){};renderGuard=false;render()});
  screen.querySelectorAll('[data-v423-date]').forEach(b=>b.onclick=()=>{v423Date=b.dataset.v423Date||v423Date;renderGuard=false;render()});
  screen.querySelector('[data-v423-category]')?.addEventListener('change',e=>{v423Category=e.target.value||'all';renderGuard=false;render()});
  screen.querySelector('[data-v423-status]')?.addEventListener('change',e=>{v423Status=e.target.value||'all';renderGuard=false;render()});
  screen.querySelector('[data-v423-live]')?.addEventListener('click',()=>{v423LiveOnly=!v423LiveOnly;renderGuard=false;render()});
  screen.querySelector('[data-v423-search]')?.addEventListener('click',()=>{location.hash='#/search'});
  screen.querySelector('[data-v423-calendar-open]')?.addEventListener('click',()=>{location.hash='#/v4-calendar'});
  screen.querySelectorAll('[data-v423-match]').forEach(b=>b.onclick=()=>{selectedKey=b.dataset.v423Match||selectedKey;activeTab='Resumen';renderGuard=false;render();try{document.querySelector('[data-v92-matchcenter]')?.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){}});
  screen.querySelectorAll('[data-v423-fav]').forEach(b=>b.onclick=()=>{let a=[];try{a=JSON.parse(localStorage.getItem('v423-match-favs')||'[]')}catch(_){};const k=String(b.dataset.v423Fav||'');a=a.includes(k)?a.filter(x=>x!==k):[...a,k];try{localStorage.setItem('v423-match-favs',JSON.stringify(a))}catch(_){};renderGuard=false;render()});
  updateLiveClock();
  renderGuard=false;
}
async function load(){
  if(window.LJR_OFFICIAL_DATA?.categories){db=window.LJR_OFFICIAL_DATA;if(isDirectRoute())render();return db;}
  if(loading)return loading;
  loading=(async()=>{
    for(const u of [LOCAL,REMOTE]){
      try{
        const res=await fetch(u,{cache:'no-store',signal:AbortSignal.timeout(8000)});
        if(res.ok){db=await res.json();window.LJR_OFFICIAL_DATA=db;break}
      }catch(_){}
    }
    if(isDirectRoute())render();
    return db;
  })();
  return loading;
}
let lastOfficialRefresh=0;
async function refreshOfficialData(force=false){
  const now=Date.now();
  if(!force&&now-lastOfficialRefresh<45000)return db;
  lastOfficialRefresh=now;
  // Fuente local publicada primero: evita que Liga_Futbol desactualizado
  // sustituya decisiones y jornadas recientes de App-liga-.
  const urls=[LOCAL.split('?')[0]+'?ts='+now,REMOTE.split('?')[0]+'?ts='+now];
  for(const u of urls){
    try{
      const res=await fetch(u,{cache:'no-store',signal:AbortSignal.timeout(8000)});
      if(!res.ok)continue;
      const fresh=await res.json();
      if(fresh?.categories){
        db=fresh;window.LJR_OFFICIAL_DATA=fresh;
        if(isDirectRoute()){renderGuard=false;render()}
        return db;
      }
    }catch(_){}
  }
  return db;
}
function syncRoute(){
  const r=route();
  try{
    const wanted=sessionStorage.getItem('v92-open-tab');
    if(['BuildUp','Predicciones','Resumen','Previa','Alineaciones','Estadísticas','Cronología','Cuotas'].includes(wanted)){
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
  if(!timer)timer=setInterval(()=>{if(isDirectRoute()&&!document.hidden){refreshOfficialData(false)}},30000);
  if(!liveClockTimer)liveClockTimer=setInterval(updateLiveClock,1000);
  updateLiveClock();
}
window.addEventListener('hashchange',()=>requestAnimationFrame(syncRoute));
window.LJR_MATCH_CENTER={open(key){selectedKey=String(key);db=window.CompetitionController?.raw()||window.LJR_OFFICIAL_DATA||db;location.hash='#/matchCenter';if(isDirectRoute())render()}};
window.addEventListener('ljr:official-data',()=>{if(isDirectRoute()){const next=window.LJR_OFFICIAL_DATA||db;const changed=JSON.stringify(next)!==JSON.stringify(db);db=next;if(changed||!document.querySelector('[data-v92-matchcenter]')){renderGuard=false;render()}}});
window.addEventListener('ljr:match-live-feed',()=>{if(isDirectRoute()&&activeTab==='Alineaciones'){renderGuard=false;render()}});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(isDirectRoute()&&!screen.querySelector('[data-v92-matchcenter]'))requestAnimationFrame(render)}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncRoute,{once:true});else syncRoute();
})();