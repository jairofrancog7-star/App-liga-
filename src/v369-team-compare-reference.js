/* V369 — Comparar equipos / notificaciones de equipo.
   Capa aditiva para #/teamDetail: restaura el botón Comparar en la cabecera
   y recrea el comparador móvil de las referencias usando sólo datos oficiales. */
(function(){
'use strict';
if(window.__LJR_V369_TEAM_COMPARE__)return;
window.__LJR_V369_TEAM_COMPARE__=true;

const LOCAL='./data/official-live.json?v=20261001-v491-v35-all-pages';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261001-v491-v35-all-pages';
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
 const supplied=window.LJR_SEASON_LOGOS?.get(name);if(supplied)return supplied;
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

/* V373 — detalle del comparador según referencia de video.
   No inventa métricas: usa clasificación/resultados oficiales y marca con —
   cualquier estadística que AdminFut no publique. */
function playedTeamGames(cat,name,mode){
 return fixtures(cat).filter(function(r){
  const stage=String(r?.[1]||'');
  const knockout=KNOCKOUT.test(stage);
  if(mode==='final'?!knockout:knockout)return false;
  if(norm(r?.[2])!==norm(name)&&norm(r?.[6])!==norm(name))return false;
  return num(r?.[3])!==null&&num(r?.[5])!==null;
 });
}
function advancedStats(cat,name,mode,base){
 const games=playedTeamGames(cat,name,mode);
 let scored=0,blank=0,clean=0,conceded=0;
 games.forEach(function(r){
  const home=norm(r?.[2])===norm(name),a=num(r?.[3])||0,b=num(r?.[5])||0;
  const mine=home?a:b,other=home?b:a;
  if(mine>0)scored++;else blank++;
  if(other===0)clean++;else conceded++;
 });
 const pj=base?.pj??games.length??0,gf=base?.gf,gc=base?.gc;
 return {
  pj:pj,
  gf:gf,
  gc:gc,
  gfPer:Number.isFinite(Number(gf))&&Number(pj)>0?(Number(gf)/Number(pj)):null,
  gcPer:Number.isFinite(Number(gc))&&Number(pj)>0?(Number(gc)/Number(pj)):null,
  scoredGames:games.length?scored:null,
  blankGames:games.length?blank:null,
  cleanSheets:games.length?clean:null,
  concededGames:games.length?conceded:null
 };
}
function formatMetric(v,digits){
 if(v===null||v===undefined||v==='')return '—';
 if(typeof v==='number'&&Number.isFinite(v))return digits?String(v.toFixed(digits)):String(v);
 return String(v);
}
function detailedRow(label,av,bv,digits){
 const as=formatMetric(av,digits),bs=formatMetric(bv,digits);
 const an=Number(av),bn=Number(bv),numeric=Number.isFinite(an)&&Number.isFinite(bn);
 const max=numeric?Math.max(Math.abs(an),Math.abs(bn),1):1;
 const aw=numeric?Math.max(an===0?0:6,Math.round(Math.abs(an)/max*100)):0;
 const bw=numeric?Math.max(bn===0?0:6,Math.round(Math.abs(bn)/max*100)):0;
 return '<div class="v373-detail-row '+(!numeric?'is-unavailable':'')+'">'+
   '<div class="v373-detail-values"><b>'+esc(as)+'</b><span>'+esc(label)+'</span><b>'+esc(bs)+'</b></div>'+
   '<div class="v373-detail-bars"><i><em style="width:'+aw+'%"></em></i><i><em style="width:'+bw+'%"></em></i></div>'+
  '</div>';
}
function detailedSection(key,title,rows,note){
 return '<section class="v373-stat-section is-open" data-v373-section="'+esc(key)+'">'+
  '<button type="button" class="v373-section-head" data-v373-toggle="'+esc(key)+'" aria-expanded="true"><b>'+esc(title)+'</b><span>⌃</span></button>'+
  '<div class="v373-section-body">'+rows+(note?'<p class="v373-section-note">'+esc(note)+'</p>':'')+'</div>'+
 '</section>';
}
function detailedStats(cat,a,b){
 const aa=advancedStats(cat,compareState.teamA,compareState.modeA,a);
 const bb=advancedStats(cat,compareState.teamB,compareState.modeB,b);
 const keyRows=compareRows(a,b);

 const attack=
  detailedRow('Goles',a?.gf,b?.gf,0)+
  detailedRow('Goles por partido',aa.gfPer,bb.gfPer,1)+
  detailedRow('Partidos marcando',aa.scoredGames,bb.scoredGames,0)+
  detailedRow('Partidos sin marcar',aa.blankGames,bb.blankGames,0)+
  detailedRow('Disparos totales',null,null,0)+
  detailedRow('Disparos a puerta',null,null,0)+
  detailedRow('Saques de esquina',null,null,0);

 const distribution=
  detailedRow('Precisión de pase (%)',null,null,0)+
  detailedRow('Posesión',null,null,0)+
  detailedRow('Centros completados',null,null,0)+
  detailedRow('Centros realizados',null,null,0)+
  detailedRow('Pases a zona clave',null,null,0)+
  detailedRow('Pases al área',null,null,0);

 const defense=
  detailedRow('Goles encajados',a?.gc,b?.gc,0)+
  detailedRow('Goles encajados por partido',aa.gcPer,bb.gcPer,1)+
  detailedRow('Porterías a cero',aa.cleanSheets,bb.cleanSheets,0)+
  detailedRow('Partidos recibiendo gol',aa.concededGames,bb.concededGames,0)+
  detailedRow('Duelos',null,null,0)+
  detailedRow('Despejes',null,null,0)+
  detailedRow('Disparos concedidos',null,null,0);

 const goalkeeping=
  detailedRow('Porterías a cero',aa.cleanSheets,bb.cleanSheets,0)+
  detailedRow('Goles encajados',a?.gc,b?.gc,0)+
  detailedRow('Paradas',null,null,0)+
  detailedRow('Penaltis parados',null,null,0);

 const note='Las filas con — no están publicadas por la fuente oficial de la Liga; no se inventan valores.';
 return detailedSection('key','Datos clave',keyRows,'Datos oficiales de clasificación o fase final.')+
  detailedSection('attack','Ataque',attack,note)+
  detailedSection('distribution','Distribución',distribution,note)+
  detailedSection('defense','Defensa',defense,note)+
  detailedSection('goalkeeping','Portería',goalkeeping,note);
}
function stickyDuel(cat){
 return '<div class="v373-sticky-duel">'+
   '<span><img src="'+esc(logoUrl(compareState.teamA))+'" alt=""><b>'+esc(compareState.teamA)+'</b><small>'+esc(cat?.name||'Liga')+'</small></span>'+
   '<span><b>'+esc(compareState.teamB)+'</b><small>'+esc(cat?.name||'Liga')+'</small><img src="'+esc(logoUrl(compareState.teamB))+'" alt=""></span>'+
  '</div>';
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
 const selected=side==='a'?compareState.teamA:compareState.teamB;
 const names=teamNames(cat);
 const tile=function(name,compact){
  const disabled=norm(name)===norm(other),current=norm(name)===norm(selected);
  return '<button type="button" class="'+(current?'is-selected ':'')+(compact?'is-compact':'')+'" data-v369-team-choice="'+esc(name)+'" data-side="'+side+'" '+(disabled?'disabled':'')+' data-search="'+esc(norm(name))+'">'+
    '<span class="v373-picker-logo"><img src="'+esc(logoUrl(name))+'" alt=""></span>'+
    '<span>'+esc(name)+'</span>'+(current?'<i>✓</i>':'')+
   '</button>';
 };
 return '<div class="v369-picker-layer" data-v369-picker-backdrop>'+
  '<section class="v369-picker-sheet v373-picker-page" onclick="event.stopPropagation()">'+
   '<header class="v373-picker-top"><button type="button" data-v369-close-picker aria-label="Cerrar">×</button></header>'+
   '<label class="v369-picker-search"><span>⌕</span><input type="search" data-v369-team-search placeholder="Buscar equipos" autocomplete="off"></label>'+
   '<div class="v373-picker-average"><span>AT</span><div><b>Promedio: todos los equipos</b><small>Promedio de estadísticas por partido de todos los equipos</small></div></div>'+
   '<section class="v373-picker-group"><h2>Tus equipos</h2><div class="v373-picker-yours">'+tile(compareState.teamA,true)+tile(compareState.teamB,true)+'</div></section>'+
   '<section class="v373-picker-group"><h2>Equipos en la competición</h2><div class="v369-picker-grid">'+names.map(function(name){return tile(name,false)}).join('')+'</div></section>'+
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
   stickyDuel(cat)+
   '<section class="v369-stats-zone">'+
    '<div class="v369-compare-caption"><span>'+esc(modeLabel(compareState.modeA))+'<small>'+esc(noteA)+'</small></span><b>VS</b><span>'+esc(modeLabel(compareState.modeB))+'<small>'+esc(noteB)+'</small></span></div>'+
    detailedStats(cat,a,b)+
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
 ['goals','ball','Goles'],
 ['penalties','penalty','Tandas de penalti'],
 ['startFinal','whistle','Inicio / Final'],
 ['lineups','pitch','Alineaciones oficiales'],
 ['redCards','redcard','Tarjetas rojas'],
 ['subs','subs','Cambios'],
 ['video','video','Resumen en vídeo disponible'],
 ['news','news','Noticias']
];
function notifyIcon(kind){
 const common='viewBox="0 0 32 32" aria-hidden="true" focusable="false"';
 if(kind==='ball')return '<svg '+common+'><circle cx="16" cy="16" r="11.5"/><path d="m16 10 4 3-1.5 5h-5L12 13l4-3Zm-4 3-4.5-1.2M8 19l4.5 4M20 13l4.5-1.2M24 19l-4.5 4M13.5 18l-2 5M18.5 18l2 5"/></svg>';
 if(kind==='penalty')return '<svg '+common+'><path d="M5 20V8h22v12M8 20V11h16v9M5 12h22M10 8v4M16 8v4M22 8v4"/><circle cx="16" cy="22.5" r="4"/><path d="m16 20.5 1.5 1.1-.6 1.8h-1.8l-.6-1.8 1.5-1.1Z"/></svg>';
 if(kind==='whistle')return '<svg '+common+'><path d="M5 19h11.5a5.5 5.5 0 1 0-5.5-5.5H5v5.5Z"/><path d="m18 9 3-4M23 12l4-1M19 16l3 3M5 14H2.5"/></svg>';
 if(kind==='pitch')return '<svg '+common+'><rect x="7" y="4" width="18" height="24" rx="1"/><path d="M7 12h18M7 20h18M16 4v24"/><circle cx="16" cy="16" r="3"/><path d="M12 4v4h8V4M12 24v4h8v-4"/></svg>';
 if(kind==='redcard')return '<svg '+common+' class="solid-icon"><rect x="10" y="5" width="12" height="22" rx="1"/></svg>';
 if(kind==='subs')return '<svg '+common+' class="subs-icon"><path class="up" d="m9 22 6-10 6 10H9Z"/><path class="down" d="m17 10 6-7 6 7H17Z" transform="rotate(180 23 6.5)"/></svg>';
 if(kind==='video')return '<svg '+common+'><rect x="4" y="7" width="24" height="17" rx="1.5"/><path d="m14 12 6 3.5-6 3.5v-7ZM10 27h12"/></svg>';
 return '<svg '+common+'><path d="M9 4h11l4 4v20H9V4Z"/><path d="M20 4v5h5M13 14h8M13 19h8M13 24h5"/></svg>';
}
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
    return '<div class="v369-notify-row"><span class="v369-notify-icon">'+notifyIcon(r[1])+'</span><span class="v369-notify-label">'+esc(r[2])+'</span>'+sw(!!p[r[0]],r[0],false)+'</div>';
   }).join('')+'</div>'+
   '<p class="v369-notify-note">Preferencias guardadas para este equipo en este dispositivo.</p>'+
  '</section>'+
 '</div>';
}
function mountNotify(){
 document.getElementById('v369-team-notify')?.remove();
 document.body.classList.add('v369-notify-open');
 document.body.insertAdjacentHTML('beforeend',notifyMarkup());
}
function openNotify(){
 const team=currentName();if(!team)return;
 notifyState={team:team,prefs:readNotif(team)};
 mountNotify();
}
function closeNotify(){notifyState=null;document.getElementById('v369-team-notify')?.remove();document.body.classList.remove('v369-notify-open')}

function ensureTopCompare(){
 if(route()!=='teamDetail')return;
 const actions=document.querySelector('#screen [data-v42-reference="teamDetail"] .v42-actions');
 if(!actions)return;
 actions.classList.remove('v369-has-compare');
 actions.querySelectorAll('[data-v369-open-compare]').forEach(b=>b.remove());
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
 const sectionToggle=e.target.closest('[data-v373-toggle]');
 if(sectionToggle){
  const section=sectionToggle.closest('[data-v373-section]');
  if(section){
   const open=section.classList.toggle('is-open');
   sectionToggle.setAttribute('aria-expanded',String(open));
  }
  return;
 }
 const picker=e.target.closest('[data-v369-pick-team]');
 if(picker&&compareState){
  e.preventDefault();e.stopPropagation();
  compareState.picker=picker.dataset.v369PickTeam;
  compareState.modeMenu='';
  mountCompare();
  return;
 }
 const choice=e.target.closest('[data-v369-team-choice]');
 if(choice&&compareState&&!choice.disabled){
  e.preventDefault();e.stopPropagation();
  const side=choice.dataset.side,name=choice.dataset.v369TeamChoice;
  if(!name)return;
  if(side==='a')compareState.teamA=name;else compareState.teamB=name;
  compareState.picker='';
  compareState.modeMenu='';
  localStorage.setItem('v369-team-compare-rival-'+compareState.catId,compareState.teamB);
  mountCompare();
  toast('Comparación actualizada');
  return;
 }
 const closePicker=e.target.closest('[data-v369-close-picker]');
 const backdrop=e.target.matches?.('[data-v369-picker-backdrop]');
 if((closePicker||backdrop)&&compareState){
  e.preventDefault();e.stopPropagation();
  compareState.picker='';
  mountCompare();
  return;
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
