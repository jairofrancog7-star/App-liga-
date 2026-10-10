/* V414 — Favoritos lower reference.
   Mantiene intacto el contenido existente y sustituye SOLO la parte inferior genérica. */
(function(){
'use strict';
if(window.__LJR_V414_FAVORITES_REFERENCE__)return;
window.__LJR_V414_FAVORITES_REFERENCE__=true;

const ID='v414-favorites-reference';
const KEY='ljr-v414-favorites';
const TAB='ljr-v414-favorites-tab';
const CAT='ljr-v414-favorites-cat';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const FALLBACK_LOGOS={
 'san jose fc':'assets/official-logos/san-jose-fc.png',
 'juventus':'assets/official-logos/juventus.png',
 'hermanos':'assets/official-logos/hermanos.png',
 'linces':'assets/official-logos/linces.png',
 'napoli':'assets/official-logos/napoli.png',
 'franco fc':'assets/official-logos/franco-fc.png',
 'herreras fc':'assets/official-logos/herreras-fc.png',
 'abejas':'assets/official-logos/abejas.png',
 'lobos cdg':'assets/official-logos/lobos-cdg.png',
 'terricolas':'assets/official-logos/terricolas.png',
 'boavista':'assets/official-logos/boavista.png',
 'tavera fc':'assets/official-logos/tavera-fc.png',
 'san julian':'assets/official-logos/san-julian.png',
 'galacticos':'assets/teams/galacticos-pozos.webp',
 'galacticos de pozos':'assets/teams/galacticos-pozos.webp',
 'america':'assets/branding/america-veteranos-35-user.png'
};
let timer=0;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const slug=v=>norm(v).replace(/\s+/g,'-');
const searchSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.8"></circle><path d="m15.7 15.7 5.1 5.1"></path></svg>';

function read(k,d){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(_){return d}}
function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
function api(){return window.V66_OFFICIAL_DIRECTORY||null}
async function ensureData(){try{await api()?.load?.()}catch(_){}}
function db(){try{return api()?.data?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}}
function fallbackLogo(name){
 const p=FALLBACK_LOGOS[norm(name)];
 return p?SRC+p:'';
}
function logoFor(name){
 const supplied=window.LJR_SEASON_LOGOS?.get(name);if(supplied)return supplied;
 try{const x=api()?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||'';if(x)return x}catch(_){}
 return fallbackLogo(name);
}
function categoryLogo(id){
 const path=({
  '3':'assets/branding/primera-fuerza-hd.png',
  '5':'assets/categories/intermedia.webp',
  '4':'assets/categories/segunda-fuerza.webp',
  '2':'assets/categories/veteranos-35-user.png',
  '1':'assets/categories/veteranos-50.webp'
 })[String(id)];
 return path?SRC+path:SRC+'assets/liga-logo.webp';
}
function fallback(name){return String(name||'EQ').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()}
function logoHtml(name){
 const src=logoFor(name);
 return src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v414-fallback" style="display:none">'+esc(fallback(name))+'</span>':'<span class="v414-fallback">'+esc(fallback(name))+'</span>';
}
function playerAvatar(p,cls='v414-avatar'){
 let src='';
 try{src=String(p?.photo||window.LJR_PLAYER_MEDIA?.photo?.(p?.name,p?.team,p?.cat)||window.LJR_PLAYER_PHOTOS?.get?.(p?.name,p?.team,p?.cat)||'')}catch(_){}
 const ini=fallback(p?.name).slice(0,2);
 return src?'<span class="'+cls+' v576-has-photo"><img src="'+esc(src)+'" alt="'+esc(p?.name||'Jugador')+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>':'<span class="'+cls+' v576-photo-fallback">'+esc(ini)+'</span>';
}
function teamRows(){
 try{
   const list=api()?.teamList?.()||[];
   if(list.length)return list.map(t=>({name:t.name,cat:String(t.cat||''),category:t.category||'Liga Municipal'}));
 }catch(_){}
 const out=[],seen=new Set();
 Object.entries(db().categories||{}).forEach(([cid,c])=>{
   const add=n=>{n=String(n||'').trim();const k=norm(n);if(!n||seen.has(k))return;seen.add(k);out.push({name:n,cat:String(cid),category:c?.name||'Liga Municipal'})};
   Object.keys(c?.rosters||{}).forEach(add);
   (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1]));
   (c?.fixtures?.[0]?.rows||[]).forEach(r=>{add(r?.[2]);add(r?.[6])});
 });
 return out;
}
function playerRows(){
 try{
   const list=api()?.playerList?.()||[];
   if(list.length)return list.map((p,i)=>({id:String(p.cat)+'|'+p.team+'|'+p.name+'|'+i,name:p.name,team:p.team,cat:String(p.cat||''),category:p.category||'Liga Municipal',position:String(p.position||''),dorsal:String(p.dorsal||''),photo:String(p.photo||'')}));
 }catch(_){}
 return [];
}
function fixtureRows(){
 try{
   const list=api()?.fixtureRows?.()||[];
   if(list.length)return list.map((m,i)=>({id:String(m.cat||m.category||'')+'|'+String(m.round||'')+'|'+m.home+'|'+m.away+'|'+i,cat:String(m.cat||''),category:m.category||'Liga Municipal',home:m.home,away:m.away,date:m.date||'',field:m.field||''}));
 }catch(_){}
 const out=[];
 Object.entries(db().categories||{}).forEach(([cid,c])=>(c?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,i)=>{
   if(r?.[2]&&r?.[6])out.push({id:cid+'|'+gi+'|'+i,cat:String(cid),category:c?.name||'Liga Municipal',home:String(r[2]),away:String(r[6]),date:String(r?.[8]||''),field:String(r?.[7]||'')});
 })));
 return out;
}
function catOptions(){
 const d=db(),order=['3','5','4','2','1'],out=[['all','Todo']];
 order.forEach(id=>{if(d?.categories?.[id])out.push([id,d.categories[id].name||id])});
 return out;
}
function store(){const s=read(KEY,{teams:[],players:[],competitions:[],matches:[]});return Object.assign({teams:[],players:[],competitions:[],matches:[]},s)}
function isFav(type,key){return (store()[type]||[]).includes(String(key))}
function toggle(type,key){const s=store(),a=new Set(s[type]||[]),k=String(key);a.has(k)?a.delete(k):a.add(k);s[type]=Array.from(a);write(KEY,s)}
/* V950 — Elegir un favorito abre su FICHA, no el comparador.
   Comparar sigue disponible únicamente en el botón explícito de la ficha. */
function openTeam(name,cat){
 if(!name)return;
 try{
  localStorage.setItem('v62-team-name',name);
  if(cat)localStorage.setItem('v62-category',String(cat));
  localStorage.setItem('v42-team-tab','summary');
  localStorage.removeItem('v42-open-compare');
 }catch(_){}
 if(window.LJR_TEAM_DETAIL_API?.openTeam&&window.LJR_TEAM_DETAIL_API.openTeam(name,cat))return;
 location.hash='#/teamDetail?tab=summary';
}
function openPlayer(p){
 if(!p?.name)return;
 const player={name:p.name,team:p.team,cat:String(p.cat||''),category:p.category||''};
 try{
  localStorage.setItem('v379-player-profile',JSON.stringify(player));
  localStorage.setItem('v379-player-profile-tab','Resumen');
  localStorage.removeItem('v123-compare-player-2');
 }catch(_){}
 if(window.LJR_PLAYER_PROFILE_API?.open){window.LJR_PLAYER_PROFILE_API.open(player);return}
 location.hash='#/playerDetail';
}
function openCompetition(cat){try{localStorage.setItem('v62-category',String(cat));localStorage.setItem('v12-fixture-cat',String(cat))}catch(_){};location.hash='#/competition'}
function openMatch(){location.hash='#/matchCenter'}

function tabs(active){
 return '<div class="v414-tabs">'+[
  ['matches','Partidos'],['competitions','Competiciones'],['teams','Equipos'],['players','Jugadores']
 ].map(x=>'<button type="button" class="v414-tab '+(active===x[0]?'active':'')+'" data-v414-tab="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
}
function filters(active){
 return '<div class="v414-filters">'+catOptions().map(x=>'<button type="button" class="v414-filter '+(active===x[0]?'active':'')+'" data-v414-cat="'+esc(x[0])+'">'+esc(x[1])+'</button>').join('')+'</div>';
}
function teamRow(t){
 return '<div class="v414-row"><button type="button" class="v414-row-main" data-v414-team="'+esc(t.name)+'" data-v414-team-cat="'+esc(t.cat)+'"><span class="v414-row-logo">'+logoHtml(t.name)+'</span><span class="v414-row-copy"><b>'+esc(t.name)+'</b><small>'+esc(t.category)+' · Fútbol</small></span></button><button type="button" class="v414-star '+(isFav('teams',slug(t.name))?'on':'')+'" data-v414-star-team="'+esc(t.name)+'">'+(isFav('teams',slug(t.name))?'★':'☆')+'</button></div>';
}
function playerRow(p){
 return '<div class="v414-row"><button type="button" class="v414-row-main" data-v414-player="'+esc(p.id)+'">'+playerAvatar(p)+'<span class="v414-row-copy"><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.position||p.category)+'</small></span></button><button type="button" class="v414-star '+(isFav('players',p.id)?'on':'')+'" data-v414-star-player="'+esc(p.id)+'">'+(isFav('players',p.id)?'★':'☆')+'</button></div>';
}
function competitionRow(id,name){
 return '<div class="v414-row"><button type="button" class="v414-row-main" data-v414-comp="'+esc(id)+'"><span class="v414-comp-icon"><img src="'+esc(categoryLogo(id))+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span><span class="v414-row-copy"><b>'+esc(name)+'</b><small>Liga Juventino Rosas · Fútbol</small></span></button><button type="button" class="v414-star '+(isFav('competitions',id)?'on':'')+'" data-v414-star-comp="'+esc(id)+'">'+(isFav('competitions',id)?'★':'☆')+'</button></div>';
}
function matchRow(m){
 return '<div class="v414-row"><button type="button" class="v414-row-main" data-v414-match="'+esc(m.id)+'"><span class="v414-match-logo-pair"><img src="'+esc(logoFor(m.home))+'" alt=""><img src="'+esc(logoFor(m.away))+'" alt=""></span><span class="v414-row-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+(m.date?' · '+esc(m.date):'')+'</small></span></button><button type="button" class="v414-star '+(isFav('matches',m.id)?'on':'')+'" data-v414-star-match="'+esc(m.id)+'">'+(isFav('matches',m.id)?'★':'☆')+'</button></div>';
}
function logoRail(items,type){
 if(type==='competitions')return '<div class="v414-logo-rail">'+items.map(x=>'<button type="button" class="v414-logo-tile" data-v414-comp="'+esc(x[0])+'"><img src="'+esc(categoryLogo(x[0]))+'" alt="'+esc(x[1])+'" loading="lazy" decoding="async"><small>'+esc(x[0])+'</small></button>').join('')+'</div>';
 if(type==='players')return '<div class="v414-logo-rail">'+items.map(p=>'<button type="button" class="v414-logo-tile" data-v414-player="'+esc(p.id)+'">'+playerAvatar(p,'v576-player-avatar')+'<small>'+esc(fallback(p.team))+'</small></button>').join('')+'</div>';
 return '<div class="v414-logo-rail">'+items.map(t=>'<button type="button" class="v414-logo-tile" data-v414-team="'+esc(t.name)+'" data-v414-team-cat="'+esc(t.cat||'')+'">'+logoHtml(t.name)+'</button>').join('')+'</div>';
}
function copyFor(active){
 if(active==='competitions')return ['Primero, mira lo que te importa','Tus categorías favoritas se muestran primero y abren resultados, clasificación y cuadro.','Busca una competición'];
 if(active==='players')return ['Mantente al día con la grandeza','Encuentra jugadores registrados y entra a su información dentro de la Liga.','Busca un jugador'];
 if(active==='matches')return ['Comencemos','Marca tus equipos y partidos favoritos para ver rápidamente sus juegos y resultados.','Busca un equipo o partido'];
 return ['No te pierdas ni un instante','Marca a tus equipos como favoritos para no perderte la acción.','Busca un equipo'];
}
function refIcon(kind){
 const original=window.LJR_ICONS?.svg(kind==='bell'?'notification':'user');if(original)return original;
 if(kind==='bell')return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>';
 return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4.5 21c.8-4.2 3.2-6.2 7.5-6.2s6.7 2 7.5 6.2"></path></svg>';
}
function markup(){
 const active=localStorage.getItem(TAB)||'teams',cat=localStorage.getItem(CAT)||'all',copy=copyFor(active);
 const allTeams=teamRows().filter(t=>cat==='all'||t.cat===cat);
 const allPlayers=playerRows().filter(p=>cat==='all'||p.cat===cat);
 const allMatches=fixtureRows().filter(m=>cat==='all'||m.cat===cat);
 let rail='',rows='';
 if(active==='competitions'){
   const comps=catOptions().filter(x=>x[0]!=='all'&&(cat==='all'||x[0]===cat));
   rail=logoRail(comps,'competitions');
   rows=comps.map(x=>competitionRow(x[0],x[1])).join('');
 }else if(active==='players'){
   rail=logoRail(allPlayers.slice(0,10),'players');
   rows=allPlayers.slice(0,18).map(playerRow).join('');
 }else if(active==='matches'){
   const railTeams=[];allMatches.forEach(m=>{[m.home,m.away].forEach(n=>{if(!railTeams.some(t=>norm(t.name)===norm(n))){const t=teamRows().find(x=>norm(x.name)===norm(n))||{name:n,cat:m.cat,category:m.category};railTeams.push(t)}})});
   rail=logoRail(railTeams.slice(0,10),'teams');
   rows=allMatches.slice(0,18).map(matchRow).join('');
 }else{
   rail=logoRail(allTeams.slice(0,10),'teams');
   rows=allTeams.slice(0,18).map(teamRow).join('');
 }
 if(!rows)rows='<div class="v414-empty">No hay registros oficiales para este filtro.</div>';
 return '<section class="v414-favorites" id="'+ID+'" data-v414-active="'+esc(active)+'"><header class="v414-ref-head"><h1>Favoritos</h1><div><button type="button" data-v414-route="notifications" aria-label="Notificaciones">'+refIcon('bell')+'</button><button type="button" data-v414-route="profile" aria-label="Perfil">'+refIcon('profile')+'</button></div></header>'+tabs(active)+filters(cat)+'<div class="v414-hero"><h2>'+esc(copy[0])+'</h2><p>'+esc(copy[1])+'</p></div>'+rail+'<div class="v414-search">'+searchSvg+'<input type="search" data-v414-search placeholder="'+esc(copy[2])+'"></div><div class="v414-section-title">Recomendaciones</div><div class="v414-list" data-v414-list>'+rows+'</div></section>';
}
function bind(root){
 root.querySelectorAll('[data-v414-tab]').forEach(b=>b.onclick=()=>{localStorage.setItem(TAB,b.dataset.v414Tab);render(true)});
 root.querySelectorAll('[data-v414-cat]').forEach(b=>b.onclick=()=>{localStorage.setItem(CAT,b.dataset.v414Cat);render(true)});
 root.querySelectorAll('[data-v414-route]').forEach(b=>b.onclick=()=>{location.hash='#/'+b.dataset.v414Route});
 bindRows(root);
 const input=root.querySelector('[data-v414-search]');
 if(input)input.addEventListener('input',()=>filterList(root,input.value));
 requestAnimationFrame(()=>{const bar=root.querySelector('.v414-tabs'),active=root.querySelector('.v414-tab.active');if(bar&&active){const x=Math.max(0,active.offsetLeft-(bar.clientWidth-active.offsetWidth)/2);bar.scrollTo({left:x,behavior:'auto'})}});
}
function bindRows(root){
 root.querySelectorAll('[data-v414-team]').forEach(b=>b.onclick=()=>openTeam(b.dataset.v414Team,b.dataset.v414TeamCat));
 root.querySelectorAll('[data-v414-player]').forEach(b=>b.onclick=()=>{const p=playerRows().find(x=>x.id===b.dataset.v414Player);if(p)openPlayer(p)});
 root.querySelectorAll('[data-v414-comp]').forEach(b=>b.onclick=()=>openCompetition(b.dataset.v414Comp));
 root.querySelectorAll('[data-v414-match]').forEach(b=>b.onclick=openMatch);
 root.querySelectorAll('[data-v414-star-team]').forEach(b=>b.onclick=e=>{e.stopPropagation();toggle('teams',slug(b.dataset.v414StarTeam));render(true)});
 root.querySelectorAll('[data-v414-star-player]').forEach(b=>b.onclick=e=>{e.stopPropagation();toggle('players',b.dataset.v414StarPlayer);render(true)});
 root.querySelectorAll('[data-v414-star-comp]').forEach(b=>b.onclick=e=>{e.stopPropagation();toggle('competitions',b.dataset.v414StarComp);render(true)});
 root.querySelectorAll('[data-v414-star-match]').forEach(b=>b.onclick=e=>{e.stopPropagation();toggle('matches',b.dataset.v414StarMatch);render(true)});
}
function filterList(root,q){
 q=norm(q);const active=localStorage.getItem(TAB)||'teams',cat=localStorage.getItem(CAT)||'all';let html='';
 if(active==='players')html=playerRows().filter(p=>(cat==='all'||p.cat===cat)&&(!q||norm(p.name+' '+p.team).includes(q))).slice(0,24).map(playerRow).join('');
 else if(active==='competitions')html=catOptions().filter(x=>x[0]!=='all'&&(cat==='all'||x[0]===cat)&&(!q||norm(x[1]).includes(q))).map(x=>competitionRow(x[0],x[1])).join('');
 else if(active==='matches')html=fixtureRows().filter(m=>(cat==='all'||m.cat===cat)&&(!q||norm(m.home+' '+m.away+' '+m.category).includes(q))).slice(0,24).map(matchRow).join('');
 else html=teamRows().filter(t=>(cat==='all'||t.cat===cat)&&(!q||norm(t.name+' '+t.category).includes(q))).slice(0,24).map(teamRow).join('');
 root.querySelector('[data-v414-list]').innerHTML=html||'<div class="v414-empty">No se encontraron coincidencias.</div>';bindRows(root);
}
async function render(force=false){
 const screen=document.querySelector('#screen');if(!screen)return;
 const active=route()==='favorites';
 document.body.classList.toggle('v414-favorites-active',active);
 if(!active){screen.querySelector('#'+ID)?.remove();return}
 if(!force&&screen.querySelector('#'+ID))return;
 await ensureData();
 if(route()!=='favorites')return;
 screen.querySelector('#'+ID)?.remove();
 screen.insertAdjacentHTML('afterbegin',markup());
 bind(screen.querySelector('#'+ID));
}
function schedule(ms=70){clearTimeout(timer);timer=setTimeout(()=>render(false),ms)}
window.addEventListener('hashchange',()=>schedule(60));
window.addEventListener('load',()=>schedule(180));
document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule(90)).observe(screen,{childList:true,subtree:false});
schedule(100);setTimeout(()=>schedule(0),600);setTimeout(()=>schedule(0),1600);setTimeout(()=>schedule(0),3200);
})();
