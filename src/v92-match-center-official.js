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
  const st=standing(m,team),form=teamForm(m,team,3),pj=num(st?.[2]),gf=num(st?.[6]);
  const gpm=Number.isFinite(pj)&&pj>0&&Number.isFinite(gf)?gf/pj:null;
  return '<div class="v416-team '+side+'">'+
    (side==='home'?teamLogo(team,'preview'):'')+
    '<div class="v416-team-copy"><b>'+esc(team)+'</b><span class="v416-formline">'+formHtml(form)+'</span><small>'+(Number.isFinite(gpm)?fmt(gpm,2)+' goles/partido':'Sin promedio oficial')+'</small></div>'+
    (side==='away'?teamLogo(team,'preview'):'')+
  '</div>';
}
function previewBody(m,state){
  const r=m.r,home=r[2],away=r[6],h=standing(m,home),a=standing(m,away);
  const hpj=num(h?.[2]),apj=num(a?.[2]),hgf=num(h?.[6]),agf=num(a?.[6]),hgc=num(h?.[7]),agc=num(a?.[7]);
  const havg=Number.isFinite(hpj)&&hpj>0&&Number.isFinite(hgf)?hgf/hpj:null;
  const aavg=Number.isFinite(apj)&&apj>0&&Number.isFinite(agf)?agf/apj:null;
  const hcavg=Number.isFinite(hpj)&&hpj>0&&Number.isFinite(hgc)?hgc/hpj:null;
  const acavg=Number.isFinite(apj)&&apj>0&&Number.isFinite(agc)?agc/apj:null;
  const hpts=num(h?.[9]),apts=num(a?.[9]);
  const hperf=Number.isFinite(hpj)&&hpj>0&&Number.isFinite(hpts)?Math.max(0,Math.min(100,hpts/(hpj*3)*100)):null;
  const aperf=Number.isFinite(apj)&&apj>0&&Number.isFinite(apts)?Math.max(0,Math.min(100,apts/(apj*3)*100)):null;
  const live=state.kind==='window';
  return '<section class="v416-preview">'+
    '<div class="v416-preview-mode"><button type="button" data-v92-tab="Cronología" class="'+(live?'active':'')+'">DIRECTO</button><button type="button" class="'+(!live?'active':'')+'" aria-current="page">PRE-PARTIDO</button></div>'+
    '<section class="v416-general-card">'+
      '<header><h2>ESTADÍSTICAS GENERALES</h2></header>'+
      '<div class="v416-segment"><button type="button" class="active">'+esc(m.category)+'</button><button type="button" data-v92-tab="Estadísticas">TODO</button></div>'+
      '<div class="v416-team-form">'+previewTeam(m,home,'home')+previewTeam(m,away,'away')+'</div>'+
      previewValueRow('Rendimiento',hperf,aperf,{suffix:'%',decimals:0})+
      previewValueRow('Goles a favor / partido',havg,aavg,{decimals:2})+
      previewValueRow('Goles en contra / partido',hcavg,acavg,{decimals:2})+
      previewValueRow('Puntos',hpts,apts,{decimals:0})+
      previewValueRow('Posesión',null,null,{suffix:'%',decimals:0,unavailable:true})+
      previewValueRow('Tiros a puerta',null,null,{decimals:1,unavailable:true})+
      previewValueRow('Tiros a puerta en contra',null,null,{decimals:1,unavailable:true})+
      previewValueRow('Valor de la plantilla',null,null,{unavailable:true})+
      '<p class="v416-data-note">Los datos no publicados por la Liga se muestran con “—”; no se inventan posesión, tiros ni valor de plantilla.</p>'+
    '</section>'+
  '</section>';
}
function pitchPlayer(name,idx,side){
  const clean=String(name||'').trim(),initials=clean.split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'•';
  return '<span class="v416-pitch-player '+side+' p'+idx+'"><i>'+esc(initials)+'</i><b>'+esc(clean)+'</b></span>';
}
function lineupPitch(m){
  const r=m.r,home=r[2],away=r[6],hl=lineupFor(m,home)?.names||[],al=lineupFor(m,away)?.names||[];
  if(!hl.length&&!al.length){
    return '<section class="v416-lineup-visual empty"><div class="v416-lineup-title"><span><small>VISTA DE CANCHA</small><b>Alineaciones</b></span></div><div class="v416-pitch-empty"><b>Alineación pendiente</b><small>La cancha se llenará con jugadores reales cuando la Liga publique los titulares.</small></div></section>';
  }
  const hp=hl.slice(0,11),ap=al.slice(0,11);
  return '<section class="v416-lineup-visual">'+
    '<div class="v416-lineup-title"><span><small>VISTA DE CANCHA</small><b>Alineaciones publicadas</b></span><em>Sin inventar posiciones</em></div>'+
    '<div class="v416-pitch">'+
      '<div class="v416-pitch-team top">'+teamLogo(home,'pitch')+'<b>'+esc(home)+'</b></div>'+
      hp.map((n,i)=>pitchPlayer(n,i,'home')).join('')+
      ap.map((n,i)=>pitchPlayer(n,i,'away')).join('')+
      '<div class="v416-pitch-team bottom"><b>'+esc(away)+'</b>'+teamLogo(away,'pitch')+'</div>'+
    '</div>'+
    '<p>Distribución visual para mostrar los nombres publicados; no implica posiciones tácticas oficiales.</p>'+
  '</section>';
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
  const confirmed=lineupFor(m,team);
  const names=confirmed?.names?.length?confirmed.names:roster(m,team);
  const label=confirmed?.label||'Plantilla oficial registrada · alineación aún no publicada';
  const source=confirmed?.url?'<a class="v92-lineup-source" href="'+esc(confirmed.url)+'" target="_blank" rel="noopener noreferrer">Ver cédula oficial</a>':'';
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
  if(tab==='Previa')return previewBody(m,state);
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
    '<nav class="v92-tabs" aria-label="Opciones del Match Center">'+['Resumen','Previa','Alineaciones','Estadísticas','Cronología'].map(t=>'<button type="button" class="'+(activeTab===t?'active':'')+'" data-v92-tab="'+t+'">'+t+'</button>').join('')+'</nav>'+
    '<div class="v92-match-actions" aria-label="Acciones del partido">'+
      '<button type="button" data-v92-open-lineups>Alineaciones</button>'+
      '<button type="button" data-v92-pitch>Ver cancha</button>'+
      '<button type="button" class="mvp" data-v92-vote-mvp>⭐ Votar MVP</button>'+
    '</div>'+
    '<main class="v92-body">'+bodyFor(activeTab,m,state)+'</main>'+
    '<p class="v92-source">Datos deportivos públicos de la Liga · '+esc(m.category)+' · '+esc(dateOnly(r[8]))+' · '+esc(venue)+'</p>'+
  '</article>';

  document.body.classList.add('v92-match-center-official');
  screen.querySelector('[data-v92-match-select]')?.addEventListener('change',e=>{selectedKey=e.target.value;activeTab='Resumen';renderGuard=false;render()});
  screen.querySelectorAll('[data-v92-tab]').forEach(b=>b.onclick=()=>{activeTab=b.dataset.v92Tab;renderGuard=false;render();if(activeTab==='Alineaciones')refreshOfficialData(true)});
  screen.querySelectorAll('[data-v92-open-lineups]').forEach(b=>b.onclick=()=>{activeTab='Alineaciones';renderGuard=false;render();refreshOfficialData(true)});
  screen.querySelectorAll('[data-v92-route]').forEach(b=>b.onclick=()=>{location.hash='#/'+b.dataset.v92Route});
  screen.querySelectorAll('[data-v92-pitch]').forEach(b=>b.onclick=()=>{
    try{sessionStorage.setItem('v92-pitch-context',JSON.stringify({match:m.key,home,away,category:m.category}))}catch(_){}
    location.hash='#/tactics';
  });
  screen.querySelectorAll('[data-v92-vote-mvp]').forEach(b=>b.onclick=()=>openMvpVote(m));
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
let lastOfficialRefresh=0;
async function refreshOfficialData(force=false){
  const now=Date.now();
  if(!force&&now-lastOfficialRefresh<45000)return db;
  lastOfficialRefresh=now;
  const urls=[REMOTE.split('?')[0]+'?ts='+now,LOCAL.split('?')[0]+'?ts='+now];
  for(const u of urls){
    try{
      const res=await fetch(u,{cache:'no-store'});
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
    if(['Resumen','Previa','Alineaciones','Estadísticas','Cronología'].includes(wanted)){
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
  if(!timer)timer=setInterval(()=>{if(isDirectRoute()){render();refreshOfficialData(false)}},30000);
}
window.addEventListener('hashchange',()=>requestAnimationFrame(syncRoute));
window.LJR_MATCH_CENTER={open(key){selectedKey=String(key);db=window.CompetitionController?.raw()||window.LJR_OFFICIAL_DATA||db;location.hash='#/matchCenter';if(isDirectRoute())render()}};
window.addEventListener('ljr:official-data',()=>{if(isDirectRoute()){db=window.LJR_OFFICIAL_DATA||db;renderGuard=false;render()}});
window.addEventListener('ljr:match-live-feed',()=>{if(isDirectRoute()&&activeTab==='Alineaciones'){renderGuard=false;render()}});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(isDirectRoute()&&!screen.querySelector('[data-v92-matchcenter]'))requestAnimationFrame(render)}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncRoute,{once:true});else syncRoute();
})();