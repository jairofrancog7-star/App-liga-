/* Competition owner: existing primary tabs and shell; one state for all renderers. */
import {normalizeCompetition, statistics} from './competition-data.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const show=v=>v??'—';
const state={section:'results',category:localStorage.getItem('v12-fixture-cat')||'3',matchday:{},standingsMode:'compact',bracketStage:''};
let categories=[],db=null,loading=null,error='',revision=0;
const route=()=>location.hash.replace(/^#\//,'').split('?')[0];
const category=()=>categories.find(c=>c.id===state.category)||categories[0];
const selectedRound=()=>category()?.rounds.find(r=>r.id===state.matchday[state.category])||category()?.rounds[0];
function logo(name){
  const registered=window.LJR_TEAM_LOGOS?.get?.(name);if(registered)return registered;
  const entry=Object.entries(db?.team_logos||{}).find(([k])=>k.toLowerCase()===name.toLowerCase())?.[1];
  const p=typeof entry==='string'?entry:entry?.local||entry?.source||'';
  return p?(/^https?:/.test(p)?p:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+p.replace(/^\.\//,'')):'';
}
const img=name=>logo(name)?`<img src="${esc(logo(name))}" alt="" loading="eager">`:`<span class="competition-logo-empty" aria-hidden="true">${esc(name.slice(0,2))}</span>`;
function adopt(raw){
  if(!raw?.categories)throw Error('La fuente oficial no tiene categorías.');
  db=raw;categories=normalizeCompetition(raw);revision++;
  if(!categories.some(c=>c.id===state.category))state.category=categories[0]?.id||'';
  categories.forEach(c=>{if(!state.matchday[c.id]){
    const today=new Date().toLocaleDateString('en-CA',{timeZone:'America/Mexico_City'});
    state.matchday[c.id]=(c.rounds.find(r=>r.matches.some(m=>m.iso>=today))||c.rounds.at(-1))?.id||'';
  }});
  window.LJR_OFFICIAL_DATA=raw;
}
async function load(){
  if(db)return db;if(loading)return loading;
  loading=(async()=>{
    for(const url of ['https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json','./public/data/official-live.json']){
      try{const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)continue;adopt(await r.json());return db}catch(e){error='No se pudieron cargar los datos oficiales.'}
    }
    throw Error(error);
  })().finally(()=>loading=null);return loading;
}
function setCategory(id){
  if(!categories.some(c=>c.id===id))return;
  state.category=id;state.bracketStage='';
  for(const key of ['v12-fixture-cat','v62-category','v176-table-category'])localStorage.setItem(key,id);
  render();
}
function selectSection(value){
  state.section=value==='fixtures'?'results':value;
  document.querySelectorAll('#screen > .tabs [data-comp-tab]').forEach(b=>{const active=(b.dataset.compTab==='fixtures'?'results':b.dataset.compTab)===state.section;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});
  render();
}
const empty=text=>`<p class="competition-empty">${esc(text)}</p>`;
function standings(){
  const c=category(),full=state.standingsMode==='complete';
  const modes=`<div class="competition-modes" role="tablist" aria-label="Vista de clasificación">${[['compact','Compacta'],['complete','Completa'],['criteria','Criterios de<br>desempate']].map(([key,label])=>`<button role="tab" aria-selected="${state.standingsMode===key}" data-c-mode="${key}" class="${state.standingsMode===key?'active':''}">${label}</button>`).join('')}</div>`;
  if(state.standingsMode==='criteria')return modes+empty('Official tie-break criteria are not loaded.');
  if(!c?.standings.length)return modes+empty('No hay tabla oficial publicada para esta categoría.');
  const keys=full?['pj','g','e','p','gf','gc','dg','pts']:['pj','dg','pts'];
  const labels=full?['PJ','PG','PE','PP','GF','GC','DG','PTS']:['PJ','+/−','PTOS'];
  return modes+`<div class="competition-table-scroll"><table class="competition-table ${full?'complete':'compact'}"><thead><tr><th aria-label="Posición"></th><th aria-label="Equipo"></th>${labels.map(l=>`<th>${l}</th>`).join('')}${full?'':'<th>FORMA</th>'}</tr></thead><tbody>${c.standings.map(t=>`<tr tabindex="0" role="button" aria-label="Opciones de ${esc(t.name)}" data-c-team="${esc(t.name)}"><td>${show(t.pos)}</td><td><span class="competition-team">${img(t.name)}<strong>${esc(t.name)}</strong></span></td>${keys.map(k=>`<td>${show(t[k])}</td>`).join('')}${full?'':`<td><span class="competition-form">${t.form.length?t.form.map(f=>`<b class="form-${f}">${f}</b>`).join(''):'<span aria-label="Forma no disponible">—</span>'}</span></td>`}</tr>`).join('')}</tbody></table></div>`;
}
function dateLabel(iso){return iso?new Intl.DateTimeFormat('es-MX',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z')):'Fecha por confirmar'}
function status(m){
  const labels={FINAL:'Final',LIVE:'En vivo',POSTPONED:'Aplazado',SUSPENDED:'Suspendido','VENUE CHANGED':'Cambio de sede'};
  if(labels[m.status])return labels[m.status];
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City'}).format(new Date());
  return m.iso&&m.iso>today?'Programado':'Sin resultado confirmado';
}
function results(){
  const c=category(),round=selectedRound();if(!round)return empty('No hay partidos oficiales publicados para esta categoría.');
  return `<div class="competition-dates" aria-label="Jornadas">${c.rounds.map(r=>`<button data-c-round="${esc(r.id)}" class="${r.id===round.id?'active':''}"><span>${esc(dateLabel(r.matches[0]?.iso))}</span><small>Jornada ${esc(r.id)}</small></button>`).join('')}</div><h2 class="competition-date-title">${esc([...new Set(round.matches.map(m=>dateLabel(m.iso)))].join(' · '))}</h2><section class="competition-fixtures"><h3>Jornada ${esc(round.id)} · ${esc(c.name)}</h3>${round.matches.map(m=>`<div class="competition-match"><div class="competition-clubs"><span>${img(m.home)}<b>${esc(m.home)}</b></span><span>${img(m.away)}<b>${esc(m.away)}</b></span></div><div class="competition-match-meta"><b>${esc(m.complete?`${m.homeScore} – ${m.awayScore}`:m.time||'Por confirmar')}</b><small>${esc(m.venue||'Campo por confirmar')}</small><small>${esc(status(m))}</small><button data-c-match="${esc(m.id)}">Ver detalles</button></div></div>`).join('')}</section>`;
}
function bracket(){
  const c=category();if(!c?.stages.length)return empty('Cuadro no publicado. No hay eliminatorias oficiales disponibles para esta categoría.');
  const stage=c.stages.find(s=>s.id===state.bracketStage)||c.stages[0];state.bracketStage=stage.id;
  return `<div class="competition-dates">${c.stages.map(s=>`<button data-c-stage="${esc(s.id)}" class="${s.id===stage.id?'active':''}">${esc(s.id)}</button>`).join('')}</div><div class="competition-bracket-scroll"><div class="competition-bracket">${stage.matches.map(m=>`<article class="competition-bracket-game"><span>${img(m.home)}<b>${esc(m.home)}</b><strong>${show(m.homeScore)}</strong></span><span>${img(m.away)}<b>${esc(m.away)}</b><strong>${show(m.awayScore)}</strong></span><small>${esc(status(m))}</small></article>`).join('')}</div></div>`;
}
function render(){
  if(route()!=='competition')return;
  const screen=document.querySelector('#screen'),tabs=screen?.querySelector(':scope > .tabs');if(!tabs)return;
  let content=screen.querySelector('[data-competition-content]');
  if(!content){let node=tabs.nextSibling;while(node){const next=node.nextSibling;node.remove();node=next}content=document.createElement('div');content.dataset.competitionContent='';tabs.after(content)}
  const key=[revision,state.section,state.category,state.matchday[state.category],state.standingsMode,state.bracketStage,error].join('|');
  if(content.dataset.renderKey===key)return;
  content.dataset.renderKey=key;
  const c=category();
  content.innerHTML=categories.length?(state.section==='standings'?standings():state.section==='bracket'?bracket():results())+`<div class="competition-context"><label>Categoría<select data-c-category>${categories.map(c=>`<option value="${esc(c.id)}" ${c.id===state.category?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label><button data-c-actions aria-label="Acciones de Competición">•••</button></div><small class="competition-source">Fuente oficial · ${esc(c?.capturedAt?.slice(0,10)||'fecha no disponible')}</small>`:empty(error||'Cargando datos oficiales…');
}
let lastFocus;
function closeSheet(){document.querySelector('#competition-sheet')?.remove();lastFocus?.focus()}
function sheet(title,html){
  document.querySelector('#competition-sheet')?.remove();lastFocus=document.activeElement;
  const dialog=document.createElement('dialog');dialog.id='competition-sheet';dialog.className='competition-sheet';dialog.setAttribute('aria-label',title);
  dialog.innerHTML=`<header><h2>${esc(title)}</h2><button data-c-close aria-label="Cerrar">×</button></header>${html}<p role="status" data-c-status></p>`;
  document.body.append(dialog);dialog.showModal();dialog.addEventListener('cancel',e=>{e.preventDefault();closeSheet()});
  dialog.querySelector('[data-c-close]').onclick=closeSheet;
}
const action=(key,label)=>`<button data-c-action="${key}">${label}</button>`;
function actions(){
  const section=state.section,c=category(),round=selectedRound();
  let options=section==='standings'?action('standings','Tabla PNG')+action('csv','CSV')+action('statistics','Estadísticas')+action('compareTeams','Comparar equipos'):section==='bracket'?action('bracket','Cuadro PNG'):action('results','Jornada PNG')+action('calendar','Calendario PNG')+`<label>Resultado individual<select data-c-single><option value="">Seleccionar partido</option>${(round?.matches||[]).filter(m=>m.complete).map(m=>`<option value="${esc(m.id)}">${esc(m.home+' · '+m.away)}</option>`).join('')}</select></label>`;
  sheet('Competición · '+(c?.name||''),options+action('share','Compartir PNG')+action('whatsapp','WhatsApp Admin'));
}
function stats(teamName){
  const c=category(),t=c.standings.find(t=>t.name===teamName),values=statistics(c,teamName);
  if(t)Object.assign(values,{Posición:t.pos,PJ:t.pj,PG:t.g,PE:t.e,PP:t.p,GF:t.gf,GC:t.gc,DG:t.dg,PTS:t.pts});
  sheet(teamName||'Estadísticas · '+c.name,`<p>Los totales de partidos usan únicamente resultados completos publicados. La tabla oficial puede incluir sanciones y partidos sin marcador completo.</p><dl>${Object.entries(values).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(show(v))}</dd>`).join('')}</dl>`+action('stats','Estadísticas PNG')+action('scorers','Goleadores PNG')+`<a href="#/scorers">Goleadores</a><a href="#/players">Jugadores</a><a href="#/playerCompare">Comparar jugadores</a>`);
}
async function prepare(kind,extra,delivery='download'){
  const msg=document.querySelector('[data-c-status]');
  const buttons=[...document.querySelectorAll('#competition-sheet button')];buttons.forEach(b=>b.disabled=true);
  try{
    if(msg)msg.textContent='Generando PNG…';
    const exports=window.CompetitionExports;if(!exports)throw Error('El exportador todavía no está listo.');
    const context={category:state.category,round:selectedRound()?.id,stage:state.bracketStage,...extra};
    const blob=await exports[kind](context);const name=`Liga_${kind}_${state.category}_${context.round||''}.png`;
    const file=new File([blob],name,{type:'image/png'});
    // Sharing is a second explicit gesture, so Android retains transient activation.
    if(delivery==='download'){exports.download(blob,name);if(msg)msg.textContent='PNG descargado.'}
    else{
      sheet('PNG listo',`<p>${esc(name)}</p><p>${delivery==='whatsapp'?'Elige WhatsApp y el chat del presidente: 4121715599.':'Abre el menú para compartir el archivo.'}</p><button data-c-send>Compartir archivo</button><button data-c-save>Descargar PNG</button>`);
      document.querySelector('[data-c-save]').onclick=()=>exports.download(blob,name);
      document.querySelector('[data-c-send]').onclick=async()=>{
        try{if(delivery==='whatsapp')await window.LJR_WHATSAPP_ADMIN.shareAsset(file,'Liga Juventino Rosas · '+category().name);else if(navigator.canShare?.({files:[file]}))await navigator.share({title:'Liga Juventino Rosas',text:category().name,files:[file]});else{exports.download(blob,name);document.querySelector('[data-c-status]').textContent='Archivo descargado. Adjunta el PNG desde tu aplicación.'}}
        catch(e){if(e.name!=='AbortError')document.querySelector('[data-c-status]').textContent='No se pudo compartir. Puedes descargar el PNG.'}
      };
    }
  }catch(e){if(msg)msg.textContent=e.message||'No se pudo generar la imagen.'}finally{buttons.forEach(b=>b.disabled=false)}
}
let chosenTeam='';
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-c-actions],[data-c-mode],[data-c-round],[data-c-stage],[data-c-team],[data-c-match],[data-c-action]');if(!el)return;
  if(el.hasAttribute('data-c-actions'))return actions();
  if(el.dataset.cMode){state.standingsMode=el.dataset.cMode;return render()}
  if(el.dataset.cRound){state.matchday[state.category]=el.dataset.cRound;return render()}
  if(el.dataset.cStage){state.bracketStage=el.dataset.cStage;return render()}
  if(el.dataset.cMatch){window.LJR_MATCH_CENTER?.open(el.dataset.cMatch);return}
  if(el.dataset.cTeam){chosenTeam=el.dataset.cTeam;sheet(chosenTeam,action('teamDetail','Ver equipo')+action('compareTeam','Comparar equipo')+action('teamStats','Estadísticas')+action('team','Equipo PNG')+action('shareTeam','Compartir estadísticas del equipo'));return}
  const a=el.dataset.cAction;
  if(a==='shareTeam')return prepare('team',{team:chosenTeam},'share');
  if(a==='statistics')return stats();if(a==='teamStats')return stats(chosenTeam);
  if(a==='teamDetail'||a==='compareTeam'){closeSheet();window.LJR_TEAM_DETAIL_API?.[a==='teamDetail'?'openTeam':'openCompare'](chosenTeam,state.category);return}
  if(a==='compareTeams'){sheet('Elige equipo',category().standings.map(t=>`<button data-c-team="${esc(t.name)}">${esc(t.name)}</button>`).join(''));return}
  if(a==='csv'){window.CompetitionExports?.csv(state.category);return}
  const kind=a==='share'||a==='whatsapp'?state.section:a;
  prepare(kind,{team:chosenTeam},a==='share'||a==='whatsapp'?a:'download');
});
document.addEventListener('change',e=>{if(e.target.matches('[data-c-category]'))setCategory(e.target.value);if(e.target.matches('[data-c-single]')&&e.target.value)prepare('single',{match:e.target.value})});
document.addEventListener('keydown',e=>{if(e.target.matches('[data-c-team]')&&['Enter',' '].includes(e.key)){e.preventDefault();e.target.click()}});
document.addEventListener('click',e=>{if(e.target.closest('#competition-sheet a'))closeSheet()});
function mount(){
  if(route()!=='competition'){document.querySelector('#competition-sheet')?.remove();return}
  document.body.classList.remove('v40-standings-master');
  document.querySelector('#v4CompetitionEntry')?.remove();
  const active=document.querySelector('#screen > .tabs .active')?.dataset.compTab;if(active)state.section=active==='fixtures'?'results':active;
  render();load().then(render).catch(e=>{error=e.message;render()});
}
window.CompetitionController={state,load,categories:()=>categories,raw:()=>db,category,selectedRound,logo,selectSection,setCategory,statistics};
window.addEventListener('hashchange',()=>requestAnimationFrame(mount));
window.addEventListener('ljr:official-data',()=>{
  const incoming=window.LJR_OFFICIAL_DATA;
  if(incoming?.categories&&(!db||String(incoming.captured_at_utc)>String(db.captured_at_utc))){adopt(incoming);render()}
});
const screen=document.querySelector('#screen');if(screen)new MutationObserver(()=>requestAnimationFrame(mount)).observe(screen,{childList:true});
mount();
