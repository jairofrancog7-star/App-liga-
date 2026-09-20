/* V42 — Team detail con datos oficiales AdminFut.
   Mantiene la estructura visual V42 y elimina plantillas/estadísticas ficticias. */
(function(){
'use strict';
const LOCAL='./public/data/official-live.json?v=20260919-official-integrity1';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20260919-official-integrity1';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
let db=window.LJR_OFFICIAL_DATA||null,loading=null;
let activeTab=localStorage.getItem('v42-team-tab')||'summary';
let notifyOpen=false,compareOpen=false,compareTarget='';

function route(){return location.hash.replace('#/','')||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(v){return 'OFF-'+String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'')}
async function load(){if(db)return db;if(loading)return loading;loading=(async()=>{for(const u of [LOCAL,REMOTE]){try{const r=await fetch(u,{cache:'no-store'});if(r.ok){db=await r.json();break}}catch(e){}}return db})();return loading}
function allTeams(){
 const out=[];
 for(const [catId,c] of Object.entries(db?.categories||{})){
   const standingNames=(c.standings?.[0]?.rows||[]).map(r=>r[1]);
   const rosterNames=Object.keys(c.rosters||{});
   for(const name of [...standingNames,...rosterNames]){
     if(!name||out.some(x=>norm(x.name)===norm(name)))continue;
     out.push({name,catId,category:c.name});
   }
 }
 return out;
}
function selectedName(){
 const saved=localStorage.getItem('v62-team-name');if(saved)return saved;
 const legacy=localStorage.getItem('v27-selected-team')||'';
 const t=allTeams().find(x=>slug(x.name)===legacy);return t?.name||allTeams()[0]?.name||'';
}
function teamData(name=selectedName()){
 const found=allTeams().find(x=>norm(x.name)===norm(name))||allTeams()[0];
 if(!found)return null;
 const c=db.categories[found.catId],row=(c.standings?.[0]?.rows||[]).find(r=>norm(r[1])===norm(found.name));
 const roster=Object.entries(c.rosters||{}).find(([n])=>norm(n)===norm(found.name))?.[1]||[];
 const fixtures=(c.fixtures?.[0]?.rows||[]).filter(r=>norm(r[2])===norm(found.name)||norm(r[6])===norm(found.name));
 return {...found,c,row,roster:Array.isArray(roster)?roster:[],fixtures};
}

/* V93 — restaurar navegación de equipos: tocar un nombre/escudo abre la ficha
   completa V42 (Seguir, Comparar, Compartir, Partidos, Clasificación, Plantilla
   y Estadísticas). Solo resuelve equipos presentes en los datos oficiales. */
const TEAM_CLICK_SELECTOR=[
 '[data-v62-team]','[data-v27-team]','[data-v41-team]','[data-v32-open-team]',
 '[data-v28-team]','[data-v33-team]','[data-v40-team]','[data-team]',
 '.club-cell','.v6-table-row','.v65-table-row','.v27-team-tile','.v28-rank-row'
].join(',');
const LEGACY_CODE_TO_NAME={
 SJO:'SAN JOSE FC',JVS:'JUVENTUS',HER:'HERMANOS',LIN:'LINCES',NAP:'NAPOLI',
 FRA:'FRANCO FC',HFC:'HERRERAS FC',ABE:'ABEJAS',LOB:'LOBOS CDG',TER:'TERRICOLAS',GAC:'GALACTICOS',
 DYN:'DYNAMO',MAN:'MANCHESTER',ESP:'LA ESPERANZA',BOA:'BOAVISTA',TVF:'TAVERA FC',
 SJL:'SAN JULIAN',SJU:'SAN JUAN FC',SJJ:'SAN JOSE JRS',CEL:'CELTICOS',NOP:'DEP. NOPALERO',
 ZAP:'DEP. ZAPATA',BAR:'BARZA',SAF:'SAN ANTONIO FC',CUA:'LA CUADRILLA',CAP:'CAPIBARAS'
};
function officialTeamByRaw(raw){
 const value=String(raw||'').trim();if(!value)return null;
 const list=allTeams(),key=norm(value),upper=value.toUpperCase();
 let hit=list.find(x=>norm(x.name)===key||slug(x.name)===upper);
 if(hit)return hit;
 const mapped=LEGACY_CODE_TO_NAME[upper];
 if(mapped)hit=list.find(x=>norm(x.name)===norm(mapped));
 return hit||null;
}
function officialTeamFromElement(el){
 if(!(el instanceof Element))return null;
 const data=el.dataset||{};
 const raws=[
  data.v62Team,data.v27Team,data.v41Team,data.v32OpenTeam,data.v28Team,
  data.v33Team,data.v40Team,data.team,el.querySelector?.('img')?.alt
 ].filter(Boolean);
 for(const raw of raws){const hit=officialTeamByRaw(raw);if(hit)return hit}
 const text=norm(el.textContent||'');
 if(!text)return null;
 return allTeams().slice().sort((a,b)=>norm(b.name).length-norm(a.name).length)
   .find(x=>{const n=norm(x.name);return text===n||text.includes(n)})||null;
}
function openOfficialTeamProfile(name){
 const found=allTeams().find(x=>norm(x.name)===norm(name));if(!found)return false;
 localStorage.setItem('v62-team-name',found.name);
 localStorage.setItem('v62-category',String(found.catId));
 localStorage.setItem('v27-selected-team',slug(found.name));
 activeTab='summary';localStorage.setItem('v42-team-tab','summary');
 notifyOpen=false;compareOpen=false;compareTarget='';
 if(route()==='teamDetail')render();else location.hash='#/teamDetail';
 return true;
}
function logoUrl(name){
 const hit=Object.entries(db?.team_logos||{}).find(([n])=>norm(n)===norm(name))?.[1];
 if(hit?.local)return SRC+String(hit.local).replace(/^\.\//,'');
 if(hit?.source)return hit.source;
 if(norm(name)==='galacticos')return SRC+'assets/teams/galacticos-pozos.webp';
 return SRC+'assets/liga-logo.webp';
}
function backIcon(){return '<svg viewBox="0 0 32 32"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
function bellIcon(){return '<svg viewBox="0 0 24 24"><path d="M6 17h12l-1.4-2.3V10a4.6 4.6 0 0 0-9.2 0v4.7L6 17Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>'}
function shareIcon(){return '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8 11 8-5M8 13l8 5"/></svg>'}
function checkIcon(){return '<svg viewBox="0 0 20 20"><path d="m3.5 10.2 4 4.1 9-9"/></svg>'}
function dotsIcon(){return '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>'}
function store(){try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}catch(e){return {}}}
function save(st){localStorage.setItem('lj-store-v3',JSON.stringify(st))}
function followId(){return slug(selectedName())}
function followed(){return (store().followed||[]).includes(followId())}
function toggleFollow(){const st=store(),a=Array.isArray(st.followed)?st.followed.slice():[],id=followId(),i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);st.followed=a;save(st)}
function mini(name){return '<span class="v42-mini-team"><img src="'+esc(logoUrl(name))+'" alt="" loading="lazy"><b>'+esc(name)+'</b></span>'}
function dateParts(v){const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}:\d{2})/);return m?{date:m[1]+'/'+m[2]+'/'+m[3],time:m[4]}:{date:String(v||''),time:''}}
function scoreFor(r,name){
 const a=Number(r[3]),b=Number(r[5]),home=norm(r[2])===norm(name);if(!Number.isFinite(a)||!Number.isFinite(b))return '';
 return home?String(a):String(b);
}
function opponent(r,name){return norm(r[2])===norm(name)?r[6]:r[2]}
function nextFixture(t){return t.fixtures.find(r=>String(r[3])==='-'&&String(r[5])==='-')||null}
function played(t){return t.fixtures.filter(r=>/^\d+$/.test(String(r[3]))&&/^\d+$/.test(String(r[5])))}
function rosterRows(t){
 if(!t.roster.length)return '<div class="empty-mini">No hay plantilla pública disponible para este equipo.</div>';
 return t.roster.map((n,i)=>'<button type="button" class="v42-player-row" data-v42-player="'+esc(n)+'"><span class="v42-avatar" aria-hidden="true">⚽</span><span class="v42-player-copy"><strong>'+esc(n)+'</strong><small>'+esc(t.name)+' · Jugador registrado</small></span><b class="v42-number">—</b></button>').join('');
}
function summaryMarkup(t){
 const next=nextFixture(t),recent=played(t).slice(-5).reverse();
 return '<main class="v42-summary">'+
  '<div class="v42-round-strip" aria-label="Partidos recientes">'+recent.map(r=>'<button type="button" data-v42-tab="matches">'+mini(opponent(r,t.name))+'<small>'+esc(scoreFor(r,t.name))+' · final</small></button>').join('')+'</div>'+
  '<section class="v42-section"><div class="v42-section-head"><h2>Próximo partido</h2><button type="button" data-v42-tab="matches">Ver todo</button></div>'+
   (next?'<article class="v42-next-card"><h3>Jornada '+esc(next[1])+' · '+esc(t.category)+'</h3><div class="v42-next-body"><div>'+mini(t.name)+mini(opponent(next,t.name))+'</div><div class="v42-next-time"><b>'+esc(dateParts(next[8]).time||'Por confirmar')+'</b><small>'+esc(next[7]||'Campo por confirmar')+'</small></div></div></article>':'<div class="empty-mini">No hay próximo partido oficial publicado.</div>')+
  '</section>'+
  '<section class="v42-section v42-squad-preview"><div class="v42-section-head"><h2>Plantilla</h2><button type="button" data-v42-tab="squad">Ver todo</button></div><div class="v42-preview-grid">'+
   t.roster.slice(0,3).map(n=>'<button type="button" data-v42-tab="squad"><span class="v42-avatar large">⚽</span><strong>'+esc(n)+'</strong><small>Jugador registrado</small></button>').join('')+
  '</div></section></main>';
}
function matchesMarkup(t){
 const rows=t.fixtures.slice().reverse();
 return '<main class="v42-tab-page"><section class="v42-section"><h2 class="v42-page-heading">Partidos oficiales</h2>'+
  (rows.length?rows.map(r=>{const p=dateParts(r[8]),isPlayed=/^\d+$/.test(String(r[3]))&&/^\d+$/.test(String(r[5]));
    return '<article class="v42-match-card"><h3>Jornada '+esc(r[1])+' · '+esc(p.date)+'</h3><div class="v42-match-body"><div class="v42-score-list"><div>'+mini(r[2])+(isPlayed?'<strong>'+esc(r[3])+'</strong>':'')+'</div><div>'+mini(r[6])+(isPlayed?'<strong>'+esc(r[5])+'</strong>':'')+'</div></div><div class="v42-match-time">'+esc(isPlayed?'Final':p.time||'Por confirmar')+'<small>'+esc(r[7]||'Campo por confirmar')+'</small></div></div></article>'}).join(''):'<div class="empty-mini">No hay partidos publicados.</div>')+
 '</section></main>';
}
function standingsMarkup(t){
 const rows=t.c.standings?.[0]?.rows||[];
 return '<main class="v42-tab-page"><section class="v42-section"><div class="v42-section-head"><h2>Clasificación</h2><span>'+esc(t.category)+'</span></div>'+
  '<div class="v42-standings"><div class="v42-table-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>'+
  rows.map(r=>'<button type="button" class="'+(norm(r[1])===norm(t.name)?'current':'')+'" data-v42-select-name="'+esc(r[1])+'"><span>'+esc(r[0])+'</span><span>'+mini(r[1])+'</span><span>'+esc(r[2])+'</span><span>'+esc(r[8])+'</span><strong>'+esc(r[9])+'</strong></button>').join('')+
  '</div></section></main>';
}
function squadMarkup(t){return '<main class="v42-squad"><section class="v42-roster-card"><h2>Jugadores registrados</h2><div class="v42-roster-list">'+rosterRows(t)+'</div></section></main>'}
function statsMarkup(t){
 const r=t.row;
 if(!r)return '<main class="v42-stats"><div class="empty-mini">No hay estadísticas oficiales de clasificación para este equipo.</div></main>';
 return '<main class="v42-stats"><section class="v42-key-card"><div class="v42-key-head"><h2>Datos oficiales</h2><span>⌃</span></div>'+
  '<div class="v42-key-grid"><div class="v42-ring"><b>'+esc(r[2])+'</b><small>Partidos<br>disputados</small></div>'+
  '<div class="v42-wdl"><p><i></i>Ganados <b>'+esc(r[3])+'</b></p><p><i></i>Empates <b>'+esc(r[4])+'</b></p><p><i></i>Perdidos <b>'+esc(r[5])+'</b></p></div>'+
  '<div><b>'+esc(r[6])+'</b><small>Goles marcados</small></div><div><b>'+esc(r[7])+'</b><small>Goles recibidos</small></div>'+
  '<div><b>'+esc(r[8])+'</b><small>Diferencia de goles</small></div><div><b>'+esc(r[9])+'</b><small>Puntos</small></div></div>'+
  '<p class="empty-mini">No se muestran posesión, pases, disparos u otras métricas que AdminFut no publique.</p></section></main>';
}
function body(t){if(activeTab==='matches')return matchesMarkup(t);if(activeTab==='standings')return standingsMarkup(t);if(activeTab==='squad')return squadMarkup(t);if(activeTab==='stats')return statsMarkup(t);return summaryMarkup(t)}
function notifySheet(t){if(!notifyOpen)return '';return '<div class="v42-overlay" data-v42-close-overlay><section class="v42-notify-sheet"><div class="v42-sheet-head"><h2>'+esc(t.name)+'</h2><button type="button" data-v42-close-notify>Hecho</button></div><p class="empty-mini">Las notificaciones se vinculan a este equipo registrado.</p></section></div>'}
function compareSheet(t){
 if(!compareOpen)return '';
 const peers=(t.c.standings?.[0]?.rows||[]).filter(r=>norm(r[1])!==norm(t.name));
 if(compareTarget){
   const b=peers.find(r=>norm(r[1])===norm(compareTarget)),a=t.row;
   if(b&&a){
     const row=(label,idx)=>'<p><span>'+label+'</span><b>'+esc(a[idx]??'—')+'</b><b>'+esc(b[idx]??'—')+'</b></p>';
     return '<div class="v42-overlay" data-v42-close-overlay><section class="v42-compare-sheet" onclick="event.stopPropagation()">'+
       '<div class="v42-sheet-head"><h2>Comparar equipos</h2><button data-v42-close-compare>Hecho</button></div>'+
       '<p class="v42-compare-help">'+esc(t.category)+' · datos oficiales publicados</p>'+
       '<div class="v42-compare-result"><div>'+mini(t.name)+'</div><strong>VS</strong><div>'+mini(b[1])+'</div></div>'+
       '<div class="v42-compare-table">'+
         row('Partidos jugados',2)+row('Ganados',3)+row('Empates',4)+row('Perdidos',5)+
         row('Goles a favor',6)+row('Goles en contra',7)+row('Diferencia',8)+row('Puntos',9)+
       '</div>'+
       '<button type="button" class="v42-compare-again" data-v42-compare-again>Cambiar rival</button>'+
     '</section></div>';
   }
 }
 return '<div class="v42-overlay" data-v42-close-overlay><section class="v42-compare-sheet" onclick="event.stopPropagation()">'+
   '<div class="v42-sheet-head"><h2>Comparar equipos</h2><button data-v42-close-compare>Hecho</button></div>'+
   '<p class="v42-compare-help">Selecciona otro equipo de '+esc(t.category)+'.</p>'+
   '<div class="v42-compare-grid">'+peers.map(r=>'<button type="button" data-v42-compare-name="'+esc(r[1])+'"><img src="'+esc(logoUrl(r[1]))+'" alt="'+esc(r[1])+'"><span>'+esc(r[1])+'</span></button>').join('')+'</div>'+
 '</section></div>';
}
function markup(){
 const t=teamData();if(!t)return '<div class="empty-mini">Equipo no disponible.</div>';
 return '<section class="v42-team-page" data-v42-reference="teamDetail"><header class="v42-hero">'+
  '<div class="v42-neon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'+
  '<div class="v42-top-actions"><button type="button" class="v42-back" data-v42-back aria-label="Volver">'+backIcon()+'</button><div class="v42-top-right"><button type="button" class="v42-bell" data-v42-bell>'+bellIcon()+'</button><button type="button" class="v42-more" data-v42-share>'+shareIcon()+'</button></div></div>'+
  '<img class="v42-team-crest" src="'+esc(logoUrl(t.name))+'" alt="'+esc(t.name)+'"><div class="v42-title"><h1>'+esc(t.name)+'</h1><p>'+esc(t.category)+' · Juventino Rosas, Guanajuato</p></div>'+
  '<div class="v42-actions"><button type="button" class="v42-follow '+(followed()?'active':'')+'" data-v42-follow>'+checkIcon()+'<span>'+(followed()?'Siguiendo':'Seguir')+'</span></button><button type="button" class="v42-compare" data-v42-compare>Comparar</button><button type="button" class="v42-share" data-v42-share>'+shareIcon()+'</button></div>'+
  '<nav class="v42-tabs"><button class="'+(activeTab==='summary'?'active':'')+'" data-v42-tab="summary">Resumen</button><button class="'+(activeTab==='matches'?'active':'')+'" data-v42-tab="matches">Partidos</button><button class="'+(activeTab==='standings'?'active':'')+'" data-v42-tab="standings">Clasificación</button><button class="'+(activeTab==='squad'?'active':'')+'" data-v42-tab="squad">Plantilla</button><button class="'+(activeTab==='stats'?'active':'')+'" data-v42-tab="stats">Estadísticas</button></nav>'+
  '</header>'+body(t)+notifySheet(t)+compareSheet(t)+'</section>';
}
function toast(msg){document.querySelector('.v42-toast')?.remove();const n=document.createElement('div');n.className='v42-toast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),1500)}
function share(){const t=teamData();const p={title:t?.name||'Liga Juventino',text:'Liga Municipal de Fútbol Juventino Rosas · '+(t?.name||''),url:location.href};if(navigator.share)navigator.share(p).catch(()=>{});else navigator.clipboard?.writeText(location.href).then(()=>toast('Enlace copiado')).catch(()=>{})}
function nav(){const n=document.querySelector('.bottom-nav');if(n)n.querySelectorAll('.nav-item').forEach(i=>i.classList.toggle('active',i.dataset.route==='competition'))}
function bind(){
 document.querySelector('[data-v42-back]')?.addEventListener('click',()=>history.length>1?history.back():location.hash='#/teams',{once:true});
 document.querySelector('[data-v42-follow]')?.addEventListener('click',()=>{toggleFollow();render()},{once:true});
 document.querySelector('[data-v42-bell]')?.addEventListener('click',()=>{notifyOpen=true;render()},{once:true});
 document.querySelectorAll('[data-v42-share]').forEach(b=>b.addEventListener('click',share,{once:true}));
 document.querySelector('[data-v42-compare]')?.addEventListener('click',()=>{compareOpen=true;compareTarget='';render()},{once:true});
 document.querySelector('[data-v42-close-notify]')?.addEventListener('click',()=>{notifyOpen=false;render()},{once:true});
 document.querySelector('[data-v42-close-compare]')?.addEventListener('click',()=>{compareOpen=false;compareTarget='';render()},{once:true});
 document.querySelectorAll('[data-v42-close-overlay]').forEach(x=>x.addEventListener('click',()=>{notifyOpen=false;compareOpen=false;render()},{once:true}));
 document.querySelectorAll('[data-v42-tab]').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.v42Tab;localStorage.setItem('v42-team-tab',activeTab);render()},{once:true}));
 document.querySelectorAll('[data-v42-select-name]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('v62-team-name',b.dataset.v42SelectName);activeTab='summary';render()},{once:true}));
 document.querySelectorAll('[data-v42-compare-name]').forEach(b=>b.addEventListener('click',()=>{compareTarget=b.dataset.v42CompareName;render()},{once:true}));
 document.querySelector('[data-v42-compare-again]')?.addEventListener('click',()=>{compareTarget='';render()},{once:true});
 document.querySelectorAll('[data-v42-player]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.v42Player+' · jugador registrado'),{once:true}));
}
async function render(){const active=route()==='teamDetail';document.body.classList.toggle('v42-team-active',active);if(!active)return;await load();if(!db)return;const screen=document.querySelector('#screen');if(!screen)return;screen.innerHTML=markup();bind();nav()}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}

/* V93 — desde tablas, rankings, tarjetas y nombres de equipos vuelve a abrirse
   la ficha completa. No captura navegación inferior ni controles internos V42. */
document.addEventListener('click',async e=>{
 if(route()==='teamDetail')return;
 if(!(e.target instanceof Element))return;
 if(e.target.closest('.bottom-nav,[data-v42-reference],[data-v42-close-overlay]'))return;
 const el=e.target.closest(TEAM_CLICK_SELECTOR);if(!el)return;
 await load();if(!db)return;
 const found=officialTeamFromElement(el);if(!found)return;
 e.preventDefault();e.stopPropagation();
 openOfficialTeamProfile(found.name);
},true);

window.addEventListener('hashchange',schedule);
const screen=document.querySelector('#screen');if(screen)new MutationObserver(()=>{if(route()==='teamDetail'&&!screen.querySelector('[data-v42-reference]'))schedule()}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();