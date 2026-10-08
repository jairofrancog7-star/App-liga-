/* V970 — Funciones extra de pronostico; no altera fixtures, puntos ni pronosticos guardados. */
import {normalizeCompetition,norm} from './competition-data.js';
(function(){
'use strict';
if(window.__LJR_V970_QUINIELA_INSIGHTS__)return;
window.__LJR_V970_QUINIELA_INSIGHTS__=true;
const DATA='./data/official-live.json?quiniela=20261008-v970-insights';
const CONFIDENCE_KEY='ljr-blue:quiniela:confianza:v1';
const FILTER_KEY='ljr-blue:quiniela:game-filter:v1:';
const LABELS={baja:'Baja',media:'Media',alta:'Alta'};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let dataPromise,scheduled=0;
const currentRoute=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const safeRead=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{return {}}};
const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
const snapshot=()=>{
 if(dataPromise)return dataPromise;
 // El modulo original ya actualiza este archivo y su caché antes de pintar las tarjetas.
 const cached=(()=>{try{return JSON.parse(localStorage.getItem('ljr-blue:quiniela:fixture-snapshot:v1')||'null')}catch{return null}})();
 if(cached?.categories?.['3'])return dataPromise=Promise.resolve(cached);
 return dataPromise=fetch(DATA,{cache:'no-store'}).then(r=>{
   if(!r.ok)throw Error('No se pudo cargar el archivo local');
   return r.json();
 }).catch(error=>{dataPromise=null;throw error});
};
function matchKey(m,data){
 return [m.category,data.categories?.[String(m.category)]?.season_id||'',m.round,norm(m.home),norm(m.away)].join('|');
}
function isClosed(m){
 if(m.complete)return true;
 if(!m.iso||!m.time)return false;
 const ms=Date.parse(m.iso+'T'+m.time+':00-06:00');
 return Number.isFinite(ms)&&ms<=Date.now();
}
function savedPrediction(m,data,picks){
 const key=matchKey(m,data);
 const item=picks[key];
 return item?.fixtureKey===key&&Number.isInteger(item.home)&&Number.isInteger(item.away);
}
function formFor(team,cat,match){
 const key=norm(team);
 const games=cat.matches.filter(m=>m.complete&&m.status==='FINAL'&&m.iso&&(!match?.iso||m.iso<match.iso)&&
   (norm(m.home)===key||norm(m.away)===key))
  .sort((a,b)=>b.iso.localeCompare(a.iso)||b.time.localeCompare(a.time)).slice(0,5);
 const history=games.map(m=>{
   const home=norm(m.home)===key;
   const goals=home?m.homeScore:m.awayScore,conceded=home?m.awayScore:m.homeScore;
   return {mark:goals>conceded?'G':goals===conceded?'E':'P',gf:goals,gc:conceded,
      opponent:home?m.away:m.home,score:String(m.homeScore)+'–'+String(m.awayScore)};
 });
 return {played:history.length,wins:history.filter(x=>x.mark==='G').length,
  draws:history.filter(x=>x.mark==='E').length,losses:history.filter(x=>x.mark==='P').length,
  gf:history.reduce((s,x)=>s+x.gf,0),gc:history.reduce((s,x)=>s+x.gc,0),history};
}
function suggestScore(home,away){
 if(home.played<2||away.played<2)return null;
 const cap=n=>Math.max(0,Math.min(6,Math.round(n)));
 return {home:cap(((home.gf/home.played)+(away.gc/away.played))/2),
  away:cap(((away.gf/away.played)+(home.gc/home.played))/2)};
}
function formMarkup(team,cat,match){
 const s=formFor(team,cat,match);
 return '<div class="v970-form-team"><b>'+escapeHtml(team)+'</b>'+
  (s.played?'<div class="v970-form-summary"><strong>'+s.wins+'G · '+s.draws+'E · '+s.losses+'P</strong><span>'+s.gf+' GF · '+s.gc+' GC</span></div>'+
   '<div class="v970-form-marks" aria-label="Resultados recientes">'+s.history.map(x=>
    '<span class="v970-mark '+(x.mark==='G'?'won':x.mark==='P'?'lost':'draw')+'" title="'+escapeHtml(x.opponent+' '+x.score)+'">'+x.mark+'</span>').join('')+'</div>'
   :'<p class="v970-no-record">Aún sin marcadores completos suficientes.</p>')+
  '</div>';
}
function previewMarkup(m,cat,data){
 const key=matchKey(m,data);
 const confidence=safeRead(CONFIDENCE_KEY)[key]||'';
 const locked=isClosed(m);
 const proposed=suggestScore(formFor(m.home,cat,m),formFor(m.away,cat,m));
 return '<div class="v970-pre-match" data-v970-match="'+escapeHtml(m.id)+'">'+
   '<button type="button" class="v970-preview-toggle" aria-expanded="false">'+
     '<span class="v970-insight-icon" aria-hidden="true">◷</span>Previa y forma de los equipos<span aria-hidden="true">⌄</span></button>'+
   '<section class="v970-preview-panel" hidden>'+
     '<p class="v970-preview-disclaimer">Últimos 5 resultados completos publicados · Solo referencia estadística, no garantía de resultado.</p>'+
     '<div class="v970-form-grid">'+formMarkup(m.home,cat,m)+formMarkup(m.away,cat,m)+'</div>'+
     (!locked?'<div class="v970-shortcuts"><b>Marcador rápido <small>(solo borrador)</small></b>'+
       '<div class="v970-quick-buttons">'+
         '<button type="button" data-v970-score="home">Local 1–0</button>'+
         '<button type="button" data-v970-score="draw">Empate 1–1</button>'+
         '<button type="button" data-v970-score="away">Visita 0–1</button>'+
       '</div>'+
       '<button type="button" class="v973-suggestion" data-v973-suggest '+(proposed?'':'disabled')+'>'+
         (proposed?'Sugerir '+proposed.home+' : '+proposed.away:'Sugerencia no disponible')+'</button>'+
       '<small data-v973-suggest-note>'+(proposed?'Orientación estadística local; no se guarda automáticamente.':
         'Se requieren dos resultados previos por equipo para una sugerencia.')+'</small></div>'
       :'<p class="v970-closed-note">El partido ya inició o terminó. Pronóstico cerrado.</p>')+
     '<div class="v970-confidence"><b>Mi confianza <small>(no modifica puntos)</small></b>'+
       '<div class="v970-confidence-choices">'+Object.entries(LABELS).map(([value,label])=>
         '<button type="button" data-v970-confidence="'+value+'" aria-pressed="'+(confidence===value?'true':'false')+'"'+(locked?' disabled':'')+'>'+label+'</button>').join('')+
       '</div></div>'+
   '</section></div>';
}
function addRanking(root,cat,data){
 const host=$('.v618-q-ranking',root);
 if(!host||host.querySelector('.v970-performance'))return;
 const picks=safeRead('v561-quiniela');
 const byRound=new Map();let checked=0,hits=0;
 for(const m of cat.matches){
   if(!m.complete||!savedPrediction(m,data,picks))continue;
   const value=picks[matchKey(m,data)];
   const exact=value.home===m.homeScore&&value.away===m.awayScore;
   const correct=exact||Math.sign(value.home-value.away)===Math.sign(m.homeScore-m.awayScore);
   const pts=exact?2:correct?1:0;
   checked++;if(correct)hits++;
   const id=String(m.round||'—');
   if(!byRound.has(id))byRound.set(id,{round:id,evaluated:0,points:0,correct:0});
   const row=byRound.get(id);row.evaluated++;row.points+=pts;if(correct)row.correct++;
 }
 const rows=[...byRound.values()].sort((a,b)=>Number(b.round)-Number(a.round));
 const percent=checked?Math.round(hits/checked*100):0;
 const panel=document.createElement('section');
 panel.className='v970-performance';
 panel.innerHTML='<header><span>MI RENDIMIENTO POR JORNADA</span><strong>'+percent+'% <small>aciertos</small></strong></header>'+
   '<p>Estadísticas de tus pronósticos evaluados en este dispositivo · '+checked+' partido'+(checked===1?'':'s')+'.</p>'+
   (rows.length?'<div class="v970-performance-list">'+rows.map(r=>{
     const max=r.evaluated*2;
     return '<div class="v970-performance-row"><span>J'+escapeHtml(r.round)+'</span>'+
       '<div class="v970-performance-track" role="meter" aria-label="Puntos de jornada '+escapeHtml(r.round)+'" aria-valuemin="0" aria-valuemax="'+max+'" aria-valuenow="'+r.points+'">'+
       '<i style="width:'+Math.round(r.points/max*100)+'%"></i></div>'+
       '<b>'+r.points+'/'+max+' pts</b></div>';
   }).join('')+'</div>':'<p class="v970-performance-empty">Cuando se publiquen marcadores completos de tus partidos pronosticados aparecerá aquí tu rendimiento.</p>');
 host.append(panel);
}
function addProgress(root,cat,visibleMatches,data){
 if(!visibleMatches.length)return;
 const picks=safeRead('v561-quiniela');
 const saved=visibleMatches.filter(m=>savedPrediction(m,data,picks)).length;
 const open=visibleMatches.filter(m=>!isClosed(m));
 const missing=open.filter(m=>!savedPrediction(m,data,picks));
 const count=visibleMatches.length;
 const percent=Math.round(saved/count*100);
 const next=open.filter(m=>m.iso&&m.time).sort((a,b)=>(a.iso+a.time).localeCompare(b.iso+b.time))[0];
 const when=next?next.date:'';
 const card=document.createElement('section');
 card.className='v970-jornada-progress';
 card.setAttribute('aria-label','Avance de pronósticos de la jornada');
 card.innerHTML='<div class="v970-progress-head"><span>MI JORNADA · AVANCE</span><b>'+saved+' / '+count+' guardados</b></div>'+
   '<div class="v970-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="'+count+'" aria-valuenow="'+saved+'"><i style="width:'+percent+'%"></i></div>'+
   '<div class="v970-progress-footer"><span>'+missing.length+' pendientes para pronosticar'+(when?' · Próximo: '+escapeHtml(when):'')+'</span>'+
   '<button type="button" data-v970-first-preview>Ver análisis</button>'+
   (missing.length?'<button type="button" data-v970-jump>Pendientes →</button>':
     saved===count?'<span class="v970-progress-complete">✓ Jornada completa</span>':
     '<span class="v970-progress-complete">Partidos ya cerrados</span>')+'</div>';
 const filterKey=FILTER_KEY+cat.id;
 const symbols={
  all:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>',
  pending:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>',
  saved:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h13l2 3v13H5zM8 4v6h8V4M9 16l2 2 4-4"/></svg>'
 };
 const filterBar=document.createElement('div');
 filterBar.className='v973-game-filter-row';
 filterBar.setAttribute('role','group');
 filterBar.setAttribute('aria-label','Filtrar partidos de esta jornada');
 filterBar.innerHTML=[['all','Todos'],['pending','Pendientes'],['saved','Guardados']].map(([key,label])=>
   '<button type="button" data-v973-filter="'+key+'" aria-pressed="false">'+symbols[key]+'<span>'+label+'</span></button>').join('');
 card.append(filterBar);
 const index=new Map(visibleMatches.map(m=>[m.id,m]));
 const cards=$('[data-q-match]',root);
 const applyFilter=key=>{
  const mode=['all','pending','saved'].includes(key)?key:'all';
  const picks=safeRead('v561-quiniela');
  let count=0;
  for(const el of cards){
   const m=index.get(el.dataset.qMatch);
   if(!m)continue;
   const isSaved=savedPrediction(m,data,picks);
   const show=mode==='all'||(mode==='saved'?isSaved:!isClosed(m)&&!isSaved);
   el.hidden=!show;if(show)count++;
  }
  $('.v973-game-filter-row button',card).forEach(btn=>{
   const active=btn.dataset.v973Filter===mode;
   btn.classList.toggle('active',active);
   btn.setAttribute('aria-pressed',String(active));
  });
  let empty=$('.v973-filter-empty',root);
  if(!count&&cards.length){
   if(!empty){
    empty=document.createElement('div');empty.className='v973-filter-empty';
    $('.v618-q-matches',root)?.append(empty);
   }
   empty.textContent=mode==='saved'?'Aún no hay pronósticos guardados en esta jornada.':
    mode==='pending'?'No quedan partidos abiertos sin pronosticar.':'No hay partidos para mostrar.';
   const reset=document.createElement('button');reset.type='button';reset.textContent='Ver todos';
   reset.onclick=()=>{localStorage.setItem(filterKey,'all');applyFilter('all')};
   empty.append(reset);
  }else empty?.remove();
 };
 $('.v973-game-filter-row button',card).forEach(btn=>btn.onclick=()=>{
  const mode=btn.dataset.v973Filter;localStorage.setItem(filterKey,mode);applyFilter(mode);
 });
 const round=$('.v618-q-round',root);
 const title=$('.v618-q-section-title',root);
 if(round)round.insertAdjacentElement('afterend',card);
 else if(title)title.insertAdjacentElement('beforebegin',card);
 card.querySelector('[data-v970-first-preview]')?.addEventListener('click',()=>{
   const preview=$('.v970-preview-toggle',root);
   if(!preview)return;
   const panel=preview.parentElement?.querySelector('.v970-preview-panel');
   if(panel?.hidden)preview.click();
   preview.scrollIntoView({behavior:'smooth',block:'center'});
 });
  card.querySelector('[data-v970-jump]')?.addEventListener('click',()=>{
   localStorage.setItem(filterKey,'pending');applyFilter('pending');
   const picksNow=safeRead('v561-quiniela');
   const match=visibleMatches.find(m=>!isClosed(m)&&!savedPrediction(m,data,picksNow));
   if(!match)return;
   const row=$$('[data-q-match]',root).find(el=>el.dataset.qMatch===match.id);
   if(!row)return;
   row.scrollIntoView({behavior:'smooth',block:'center'});
   row.querySelector('[data-q-home]')?.focus({preventScroll:true});
 });
 applyFilter(localStorage.getItem(filterKey)||'all');
}
async function mount(){
 if(currentRoute()!=='quiniela')return;
 const root=$('#screen [data-v561-quiniela-mount] .v618-quiniela');
 if(!root||root.dataset.v970Enhanced==='true')return;
 const categoryId=String(localStorage.getItem('v561-category')||'3');
 const cards=$$('[data-q-match]',root);
 if(!cards.length&&!$('.v618-q-ranking',root))return;
 // Mark this precise rendered instance to avoid observer feedback.
 root.dataset.v970Enhanced='true';
 try{
   const data=await snapshot();
   if(!root.isConnected||currentRoute()!=='quiniela')return;
   const cat=normalizeCompetition(data).find(c=>c.id===categoryId);
   if(!cat)return;
   const visible=cards.map(el=>cat.matches.find(m=>m.id===el.dataset.qMatch)).filter(Boolean);
   if(cards.length)addProgress(root,cat,visible,data);
   addRanking(root,cat,data);
   for(const card of cards){
     const m=cat.matches.find(item=>item.id===card.dataset.qMatch);
     if(!m||card.querySelector('.v970-pre-match'))continue;
     const el=document.createElement('div');
     el.innerHTML=previewMarkup(m,cat,data);
     const content=el.firstElementChild;
     card.append(content);
     const toggle=$('.v970-preview-toggle',content),panel=$('.v970-preview-panel',content);
     toggle?.addEventListener('click',()=>{
       const next=panel.hidden;panel.hidden=!next;toggle.setAttribute('aria-expanded',String(next));
     });
     content.addEventListener('click',event=>{
       const draft=event.target.closest('[data-v970-score]');
       if(draft){
         if(isClosed(m))return;
         const pair={home:[1,0],draw:[1,1],away:[0,1]}[draft.dataset.v970Score];
         if(!pair)return;
         const homeInput=$('[data-q-home]',card),awayInput=$('[data-q-away]',card);
         if(!homeInput||!awayInput||homeInput.disabled||awayInput.disabled)return;
         if(homeInput.value!==''||awayInput.value!==''){
           const note=$('.v970-shortcuts>small',content);
           if(note)note.textContent='Borra ambos marcadores antes de usar otro atajo.';
           return;
         }
         homeInput.value=pair[0];awayInput.value=pair[1];
         homeInput.dispatchEvent(new Event('input',{bubbles:true}));
         awayInput.dispatchEvent(new Event('input',{bubbles:true}));
         $$('[data-v970-score]',content).forEach(b=>b.classList.toggle('selected',b===draft));
         const note=$('.v970-shortcuts>small',content);if(note)note.textContent='Borrador listo; pulsa Guardar pronóstico para confirmarlo.';
         return;
       }
       const suggest=event.target.closest('[data-v973-suggest]');
       if(suggest&&!isClosed(m)){
         const forecast=suggestScore(formFor(m.home,cat,m),formFor(m.away,cat,m));
         if(!forecast)return;
         const h=$('[data-q-home]',card),a=$('[data-q-away]',card);
         if(!h||!a||h.disabled||a.disabled)return;
         const note=$('[data-v973-suggest-note]',content);
         if(h.value!==''||a.value!==''){
           if(note)note.textContent='Ya tienes un marcador. Borra ambos campos para usar la sugerencia.';
           return;
         }
         h.value=String(forecast.home);a.value=String(forecast.away);
         h.dispatchEvent(new Event('input',{bubbles:true}));
         a.dispatchEvent(new Event('input',{bubbles:true}));
         if(note)note.textContent='Borrador aplicado. Confirma con Guardar pronóstico.';
         suggest.textContent='Aplicado · sin guardar';
         return;
       }
       const confidence=event.target.closest('[data-v970-confidence]');
       if(confidence&&!isClosed(m)){
         const value=confidence.dataset.v970Confidence;
         if(!LABELS[value])return;
         const existing=safeRead(CONFIDENCE_KEY);
         const key=matchKey(m,data);
         if(existing[key]===value)delete existing[key];
         else existing[key]=value;
         if(safeWrite(CONFIDENCE_KEY,existing)){
           $$('[data-v970-confidence]',content).forEach(b=>b.setAttribute('aria-pressed',String(existing[key]===b.dataset.v970Confidence)));
         }
       }
     });
   }
 }catch(error){
   // Fail independently; no impact on existing Quiniela controls or saved selections.
   root.dataset.v970Enhanced='error';
    // Keep the core Quiniela usable and surface an actionable local diagnostic.
    if(!root.querySelector('[data-v970-error]')){
      const status=document.createElement('p');
      status.className='v970-error';
      status.dataset.v970Error='true';
      status.textContent='Análisis temporalmente no disponible. Los pronósticos siguen funcionando.';
      ($('.v618-q-round',root)||$('.v618-q-ranking',root)||root).append(status);
    }
 }
}
function schedule(){clearTimeout(scheduled);scheduled=setTimeout(mount,95)}
function start(){
 const screen=$('#screen');
 if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
 window.addEventListener('hashchange',schedule);
 schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
else start();
})();
