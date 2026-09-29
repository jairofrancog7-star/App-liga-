/* V369 — Comparar equipos / notificaciones de equipo.
   Capa aditiva para #/teamDetail: restaura el botón Comparar en la cabecera
   y recrea el comparador móvil de las referencias usando sólo datos oficiales. */
(function(){
'use strict';
if(window.__LJR_V369_TEAM_COMPARE__)return;
window.__LJR_V369_TEAM_COMPARE__=true;

const LOCAL='./public/data/official-live.json?v=20260929-team-compare-v369';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20260929-team-compare-v369';
const KNOCKOUT=/play.?off|octavos|cuartos|semifinal|^final\b/i;
let db=window.LJR_OFFICIAL_DATA||null;
let loading=null;
let compareState=null;
let notifyState=null;
let bridging=false;

function route(){return (location.hash.replace(/^#\/?/,'')||'home').split('?')[0]}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function esc(v){return String(v??'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function num(v){const s=String(v??'').trim();return /^-?\d+$/.test(s)?Number(s):null}
function svgShare(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.2"/><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="m8 11 8-5M8 13l8 5"/></svg>'}
function svgSwap(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l-2.5-2.5M17 17H7l2.5 2.5M17 7l-2.5 2.5M7 17l2.5-2.5"/></svg>'}
function svgBack(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>'}

async function load(){
 if(db)return db;
 if(loading)return loading;
 loading=(async function(){
  for(const u of [LOCAL,REMOTE]){
   try{
    const r=await fetch(u,{cache:'no-store'});
    if(r.ok){db=await r.json();break}
   }catch(e){}
  }
  return db;
 })();
 return loading;
}
function categories(){return db?.categories||{}}
function rows(cat){return cat?.standings?.[0]?.rows||[]}
function teamNames(cat){return rows(cat).map(function(r){return String(r?.[1]||'').trim()}).filter(Boolean)}
function categoryIdForTeam(name){
 const wanted=norm(name);
 for(const [id,cat] of Object.entries(categories())){
  if(teamNames(cat).some(function(n){return norm(n)===wanted}))return String(id);
 }
 return '';
}
function currentName(){
 return localStorage.getItem('v62-team-name')||
   document.querySelector('#screen [data-v42-reference="teamDetail"] .v42-title h1')?.textContent?.trim()||'';
}
function currentCategoryId(name){
 const saved=String(localStorage.getItem('v62-category')||'');
 if(saved&&categories()[saved]&&teamNames(categories()[saved]).some(function(n){return norm(n)===norm(name)}))return saved;
 return categoryIdForTeam(name);
}
function category(catId){return categories()[String(catId)]||null}
function rowFor(cat,name){return rows(cat).find(function(r){return norm(r?.[1])===norm(name)})||null}
function logoUrl(name){
 const hit=Object.entries(db?.team_logos||{}).find(function(entry){return norm(entry[0])===norm(name)})?.[1];
 if(hit?.local)return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(hit.local).replace(/^\.\//,'');
 if(hit?.source)return hit.source;
 const registry=window.LJR_TEAM_LOGOS?.get?.(name);
 if(registry)return registry;
 return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
}
function fixtures(cat){
 return (cat?.fixtures||[]).flatMap(function(block){return Array.isArray(block?.rows)?block.rows:[]}).filter(Array.isArray);
}
function hasKnockout(cat){return fixtures(cat).some(function(r){return KNOCKOUT.test(String(r?.[1]||''))})}
function classificationStats(cat,name){
 const r=rowFor(cat,name);
 if(!r)return null;
 return {pj:num(r[2]),g:num(r[3]),e:num(r[4]),p:num(r[5]),gf:num(r[6]),gc:num(r[7]),dg:num(r[8]),pts:num(r[9])};
}
function finalStats(cat,name){
 const games=fixtures(cat).filter(function(r){
  if(!KNOCKOUT.test(String(r?.[1]||'')))return false;
  if(norm(r?.[2])!==norm(name)&&norm(r?.[6])!==norm(name))return false;
  return num(r?.[3])!==null&&num(r?.[5])!==null;
 });
 if(!games.length)return null;
 let g=0,e=0,p=0,gf=0,gc=0;
 games.forEach(function(r){
  const home=norm(r[2])===norm(name),a=num(r[3]),b=num(r[5]);
  const mine=home?a:b,other=home?b:a;
  gf+=mine;gc+=other;
  if(mine>other)g++;else if(mine===other)e++;else p++;
 });
 return {pj:games.length,g:g,e:e,p:p,gf:gf,gc:gc,dg:gf-gc,pts:null};
}
function statsFor(cat,name,mode){return mode==='final'?finalStats(cat,name):classificationStats(cat,name)}
function modeLabel(mode){return mode==='final'?'Fase final':'Clasificación'}
function statValue(stats,key){if(!stats)return '—';const v=stats[key];return v===null||v===undefined?'—':String(v)}
function compareRows(a,b){
 const defs=[
  ['Partidos jugados','pj'],['Ganados','g'],['Empates','e'],['Perdidos','p'],
  ['Goles','gf'],['Goles encajados','gc'],['Diferencia','dg'],['Puntos','pts']
 ];
 return defs.map(function(d){
  const av=statValue(a,d[1]),bv=statValue(b,d[1]);
  const an=Number(av),bn=Number(bv),numeric=Number.isFinite(an)&&Number.isFinite(bn);
  const max=numeric?Math.max(Math.abs(an),Math.abs(bn),1):1;
  const aw=numeric?Math.max(an===0?0:7,Math.round(Math.abs(an)/max*100)):0;
  const bw=numeric?Math.max(bn===0?0:7,Math.round(Math.abs(bn)/max*100)):0;
  return '<div class="v369-stat-row">'+
   '<div class="v369-stat-values"><b>'+esc(av)+'</b><span>'+esc(d[0])+'</span><b>'+esc(bv)+'</b></div>'+
   '<div class="v369-stat-bars"><i><em style="width:'+aw+'%"></em></i><i><em style="width:'+bw+'%"></em></i></div>'+
  '</div>';
 }).join('');
}
function card(side,name,cat){
 const mode=side==='a'?compareState.modeA:compareState.modeB;
 const menu=compareState.modeMenu===side?
  '<div class="v369-mode-menu" role="menu">'+
   '<button type="button" data-v369-set-mode="'+side+'" data-mode-value="final" class="'+(mode==='final'?'active':'')+'">Fase final'+(mode==='final'?'<span>✓</span>':'')+'</button>'+
   '<button type="button" data-v369-set-mode="'+side+'" data-mode-value="classification" class="'+(mode==='classification'?'active':'')+'">Clasificación'+(mode==='classification'?'<span>✓</span>':'')+'</button>'+
  '</div>':'';
 return '<div class="v369-team-col">'+
  '<button type="button" class="v369-club-card" data-v369-pick-team="'+side+'">'+
   '<span class="v369-card-change" aria-hidden="true">'+svgSwap()+'</span>'+
   '<img src="'+esc(logoUrl(name))+'" alt="'+esc(name)+'">'+
   '<b>'+esc(name)+'</b><small>'+esc(cat?.name||'Liga Municipal')+'</small>'+
  '</button>'+
  '<div class="v369-mode-wrap">'+
   '<button type="button" class="v369-mode-button" data-v369-mode-menu="'+side+'"><span>'+esc(modeLabel(mode))+'</span><i>⌄</i></button>'+
   menu+
  '</div>'+
 '</div>';
}
function teamPicker(cat){
 if(!compareState?.picker)return '';
 const side=compareState.picker;
 const other=side==='a'?compareState.teamB:compareState.teamA;
 return '<div class="v369-picker-layer" data-v369-close-picker>'+
  '<section class="v369-picker-sheet" onclick="event.stopPropagation()">'+
   '<header><div><small>'+esc(cat?.name||'Categoría')+'</small><h2>Seleccionar equipo</h2></div><button type="button" data-v369-close-picker>Hecho</button></header>'+
   '<label class="v369-picker-search"><span>⌕</span><input type="search" data-v369-team-search placeholder="Buscar equipo" autocomplete="off"></label>'+
   '<div class="v369-picker-grid">'+teamNames(cat).map(function(name){
    const disabled=norm(name)===norm(other);
    return '<button type="button" data-v369-team-choice="'+esc(name)+'" data-side="'+side+'" '+(disabled?'disabled':'')+' data-search="'+esc(norm(name))+'">'+
      '<img src="'+esc(logoUrl(name))+'" alt=""><span>'+esc(name)+'</span>'+
    '</button>';
   }).join('')+'</div>'+
  '</section>'+
 '</div>';
}
function compareMarkup(){
 const cat=category(compareState.catId);
 const a=statsFor(cat,compareState.teamA,compareState.modeA);
 const b=statsFor(cat,compareState.teamB,compareState.modeB);
 const noteA=compareState.modeA==='final'&&!a?'Sin resultados de fase final publicados':'Datos oficiales publicados';
 const noteB=compareState.modeB==='final'&&!b?'Sin resultados de fase final publicados':'Datos oficiales publicados';
 return '<section class="v369-compare-shell" id="v369-team-compare" role="dialog" aria-modal="true" aria-label="Comparar equipos">'+
  '<header class="v369-compare-topbar">'+
   '<button type="button" data-v369-close aria-label="Volver">'+svgBack()+'</button>'+
   '<h1>Comparar equipos</h1>'+
   '<button type="button" data-v369-share aria-label="Compartir">'+svgShare()+'</button>'+
  '</header>'+
  '<main>'+
   '<section class="v369-club-zone">'+
    '<div class="v369-teams-grid">'+card('a',compareState.teamA,cat)+card('b',compareState.teamB,cat)+'</div>'+
   '</section>'+
   '<section class="v369-stats-zone">'+
    '<div class="v369-compare-caption"><span>'+esc(modeLabel(compareState.modeA))+'<small>'+esc(noteA)+'</small></span><b>VS</b><span>'+esc(modeLabel(compareState.modeB))+'<small>'+esc(noteB)+'</small></span></div>'+
    '<div class="v369-stat-list">'+compareRows(a,b)+'</div>'+
   '</section>'+
   '<section class="v369-compare-actions">'+
    '<button type="button" data-v369-go="matches"><span>Partidos</span><small>Ver calendario</small></button>'+
    '<button type="button" data-v369-go="standings"><span>Clasificación</span><small>Ver tabla</small></button>'+
    '<button type="button" data-v369-share><span>Compartir</span><small>Enviar comparación</small></button>'+
   '</section>'+
  '</main>'+
  teamPicker(cat)+
 '</section>';
}
function mountCompare(){
 document.getElementById('v369-team-compare')?.remove();
 document.body.insertAdjacentHTML('beforeend',compareMarkup());
 document.body.classList.add('v369-compare-open');
}
async function openCompare(target){
 await load();if(!db)return;
 const base=currentName();if(!base)return;
 const catId=currentCategoryId(base),cat=category(catId),names=teamNames(cat);
 if(!cat||names.length<2)return;
 const preferred=target&&names.find(function(n){return norm(n)===norm(target)});
 let rival=preferred||localStorage.getItem('v369-team-compare-rival-'+catId)||'';
 if(!names.some(function(n){return norm(n)===norm(rival)})||norm(rival)===norm(base)){
  rival=names.find(function(n){return norm(n)!==norm(base)})||names[0];
 }
 const defaultMode=hasKnockout(cat)?'final':'classification';
 compareState={catId:String(catId),teamA:base,teamB:rival,modeA:defaultMode,modeB:defaultMode,modeMenu:'',picker:''};
 mountCompare();
}
function closeCompare(){
 compareState=null;
 document.getElementById('v369-team-compare')?.remove();
 document.body.classList.remove('v369-compare-open');
}
function shareCompare(){
 if(!compareState)return;
 const cat=category(compareState.catId),a=statsFor(cat,compareState.teamA,compareState.modeA),b=statsFor(cat,compareState.teamB,compareState.modeB);
 const text='Liga Municipal de Fútbol Juventino Rosas · '+compareState.teamA+' vs '+compareState.teamB+
  ' · '+modeLabel(compareState.modeA)+' / '+modeLabel(compareState.modeB)+
  ' · PJ '+statValue(a,'pj')+'-'+statValue(b,'pj')+
  ' · G '+statValue(a,'g')+'-'+statValue(b,'g')+
  ' · GF '+statValue(a,'gf')+'-'+statValue(b,'gf');
 const payload={title:'Comparar equipos',text:text,url:location.href};
 if(navigator.share)navigator.share(payload).catch(function(){});
 else navigator.clipboard?.writeText(text+' '+location.href).then(function(){toast('Comparación copiada')}).catch(function(){});
}
function toast(msg){
 document.querySelector('.v369-toast')?.remove();
 const n=document.createElement('div');n.className='v369-toast';n.textContent=msg;document.body.appendChild(n);
 setTimeout(function(){n.remove()},1500);
}
function openTeamInProfile(tab){
 if(!compareState)return;
 const name=compareState.teamA,catId=compareState.catId;
 closeCompare();
 if(window.LJR_TEAM_DETAIL_API?.openTeam)window.LJR_TEAM_DETAIL_API.openTeam(name,catId);
 else{localStorage.setItem('v62-team-name',name);localStorage.setItem('v62-category',catId)}
 setTimeout(function(){document.querySelector('[data-v42-tab="'+tab+'"]')?.click()},80);
}

/* Preferencias visuales de notificación del equipo, como en la referencia. */
const NOTIF_ROWS=[
 ['goals','⚽','Goles'],
 ['penalties','▦','Tandas de penalti'],
 ['startFinal','◌','Inicio / Final'],
 ['lineups','▣','Alineaciones oficiales'],
 ['redCards','🟥','Tarjetas rojas'],
 ['subs','🔺','Cambios'],
 ['video','▻','Resumen en vídeo disponible'],
 ['news','▤','Noticias']
];
function notifKey(name){return 'lj-team-notifications-v369-'+norm(name).replace(/\s+/g,'-')}
function readNotif(name){
 const defaults={goals:true,penalties:false,startFinal:true,lineups:true,redCards:true,subs:false,video:true,news:true};
 try{return Object.assign(defaults,JSON.parse(localStorage.getItem(notifKey(name))||'{}')||{})}catch(e){return defaults}
}
function saveNotif(){if(!notifyState)return;localStorage.setItem(notifKey(notifyState.team),JSON.stringify(notifyState.prefs))}
function sw(on,key,master){
 return '<button type="button" class="v369-switch '+(on?'on':'')+'" '+(master?'data-v369-notify-all':'data-v369-notify-key="'+esc(key)+'"')+' role="switch" aria-checked="'+(on?'true':'false')+'"><i></i></button>';
}
function notifyMarkup(){
 const p=notifyState.prefs,all=NOTIF_ROWS.every(function(r){return !!p[r[0]]});
 return '<div class="v369-notify-layer" id="v369-team-notify" role="dialog" aria-modal="true">'+
  '<section class="v369-notify-sheet">'+
   '<header><h2>'+esc(notifyState.team)+'</h2><button type="button" data-v369-notify-close>Hecho</button></header>'+
   '<div class="v369-notify-master"><span>Todas las notificaciones</span>'+sw(all,'',true)+'</div>'+
   '<div class="v369-notify-list">'+NOTIF_ROWS.map(function(r){
    return '<div class="v369-notify-row"><span class="v369-notify-icon">'+r[1]+'</span><span>'+esc(r[2])+'</span>'+sw(!!p[r[0]],r[0],false)+'</div>';
   }).join('')+'</div>'+
   '<p class="v369-notify-note">Preferencias guardadas para este equipo en este dispositivo.</p>'+
  '</section>'+
 '</div>';
}
function mountNotify(){
 document.getElementById('v369-team-notify')?.remove();
 document.body.insertAdjacentHTML('beforeend',notifyMarkup());
}
function openNotify(){
 const team=currentName();if(!team)return;
 notifyState={team:team,prefs:readNotif(team)};
 mountNotify();
}
function closeNotify(){notifyState=null;document.getElementById('v369-team-notify')?.remove()}

function ensureTopCompare(){
 if(route()!=='teamDetail')return;
 const actions=document.querySelector('#screen [data-v42-reference="teamDetail"] .v42-actions');
 if(!actions)return;
 actions.classList.add('v369-has-compare');
 if(actions.querySelector('[data-v369-open-compare]'))return;
 const share=actions.querySelector('.v42-share,[data-v42-share]');
 const btn=document.createElement('button');
 btn.type='button';btn.className='v369-compare-top';btn.dataset.v369OpenCompare='';btn.textContent='Comparar';
 if(share)actions.insertBefore(btn,share);else actions.appendChild(btn);
}
function bridgeNative(){
 if(bridging||route()!=='teamDetail')return;
 const nativeCompare=document.querySelector('#screen .v42-overlay .v42-compare-sheet');
 if(nativeCompare&&!document.getElementById('v369-team-compare')){
  bridging=true;
  const imgs=[...nativeCompare.querySelectorAll('.v42-compare-result img')];
  const target=imgs[1]?.alt||nativeCompare.querySelector('[data-v42-compare-name]')?.dataset?.v42CompareName||'';
  nativeCompare.querySelector('[data-v42-close-compare]')?.click();
  setTimeout(async function(){bridging=false;await openCompare(target)},0);
  return;
 }
 const nativeNotify=document.querySelector('#screen .v42-overlay .v42-notify-sheet');
 if(nativeNotify&&!document.getElementById('v369-team-notify')){
  bridging=true;
  nativeNotify.querySelector('[data-v42-close-notify]')?.click();
  setTimeout(function(){bridging=false;openNotify()},0);
 }
}
function sweep(){ensureTopCompare();bridgeNative()}

document.addEventListener('click',function(e){
 if(!(e.target instanceof Element))return;
 const open=e.target.closest('[data-v369-open-compare],[data-v42-compare]');
 if(open&&route()==='teamDetail'){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openCompare('');return;
 }
 const row=e.target.closest('[data-v42-select-name]');
 if(row&&route()==='teamDetail'){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const name=row.dataset.v42SelectName||'';
  if(name&&window.LJR_TEAM_DETAIL_API?.openTeam)window.LJR_TEAM_DETAIL_API.openTeam(name,compareState?.catId||localStorage.getItem('v62-category')||'');
  return;
 }
 const bell=e.target.closest('[data-v42-bell]');
 if(bell&&route()==='teamDetail'){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openNotify();return;
 }

 if(e.target.closest('[data-v369-close]')){closeCompare();return}
 if(e.target.closest('[data-v369-share]')){shareCompare();return}
 const picker=e.target.closest('[data-v369-pick-team]');
 if(picker&&compareState){compareState.picker=picker.dataset.v369PickTeam;compareState.modeMenu='';mountCompare();return}
 if(e.target.matches('[data-v369-close-picker]')||e.target.closest('[data-v369-close-picker]')){if(compareState){compareState.picker='';mountCompare()}return}
 const choice=e.target.closest('[data-v369-team-choice]');
 if(choice&&compareState&&!choice.disabled){
  const side=choice.dataset.side,name=choice.dataset.v369TeamChoice;
  if(side==='a')compareState.teamA=name;else compareState.teamB=name;
  compareState.picker='';
  localStorage.setItem('v369-team-compare-rival-'+compareState.catId,compareState.teamB);
  mountCompare();return;
 }
 const menu=e.target.closest('[data-v369-mode-menu]');
 if(menu&&compareState){
  compareState.modeMenu=compareState.modeMenu===menu.dataset.v369ModeMenu?'':menu.dataset.v369ModeMenu;
  mountCompare();return;
 }
 const mode=e.target.closest('[data-v369-set-mode]');
 if(mode&&compareState){
  const side=mode.dataset.v369SetMode,value=mode.dataset.modeValue;
  if(side==='a')compareState.modeA=value;else compareState.modeB=value;
  compareState.modeMenu='';mountCompare();return;
 }
 const go=e.target.closest('[data-v369-go]');
 if(go&&compareState){openTeamInProfile(go.dataset.v369Go==='matches'?'matches':'standings');return}

 if(e.target.closest('[data-v369-notify-close]')){closeNotify();return}
 const all=e.target.closest('[data-v369-notify-all]');
 if(all&&notifyState){
  const next=!NOTIF_ROWS.every(function(r){return !!notifyState.prefs[r[0]]});
  NOTIF_ROWS.forEach(function(r){notifyState.prefs[r[0]]=next});saveNotif();mountNotify();return;
 }
 const nk=e.target.closest('[data-v369-notify-key]');
 if(nk&&notifyState){
  const key=nk.dataset.v369NotifyKey;notifyState.prefs[key]=!notifyState.prefs[key];saveNotif();mountNotify();return;
 }
},true);

document.addEventListener('input',function(e){
 if(!e.target.matches?.('[data-v369-team-search]'))return;
 const q=norm(e.target.value);
 document.querySelectorAll('#v369-team-compare [data-v369-team-choice]').forEach(function(btn){
  btn.hidden=!!q&&!String(btn.dataset.search||'').includes(q);
 });
});

window.addEventListener('keydown',function(e){
 if(e.key!=='Escape')return;
 if(document.getElementById('v369-team-notify'))closeNotify();
 else if(document.getElementById('v369-team-compare'))closeCompare();
});
window.addEventListener('hashchange',function(){closeCompare();closeNotify();setTimeout(sweep,0)});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(function(){requestAnimationFrame(sweep)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(sweep,0)},{once:true});else setTimeout(sweep,0);
setTimeout(sweep,500);
})();