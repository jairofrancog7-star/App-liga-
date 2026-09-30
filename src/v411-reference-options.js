/* V411 — Opciones inferiores inspiradas en un centro deportivo moderno.
   Adaptadas a Liga Juventino Rosas y a su paleta azul. No modifica cabeceras superiores. */
(function(){
'use strict';
if(window.__LJR_V411_REFERENCE_OPTIONS__)return;
window.__LJR_V411_REFERENCE_OPTIONS__=true;

const FB='https://www.facebook.com/share/19SsGuzsRi/';
const FAV_KEY='ljr-v411-favorites';
const TAB_KEY='ljr-v411-favorite-tab';
const CAT_KEY='ljr-v411-favorite-cat';
const CAT_NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const FALLBACK=[
 ['San José FC','Primera Fuerza','assets/official-logos/san-jose-fc.png'],['Juventus','Primera Fuerza','assets/official-logos/juventus.png'],
 ['Hermanos','Primera Fuerza','assets/official-logos/hermanos.png'],['Linces','Primera Fuerza','assets/official-logos/linces.png'],
 ['Napoli','Primera Fuerza','assets/official-logos/napoli.png'],['Franco FC','Primera Fuerza','assets/official-logos/franco-fc.png'],
 ['Herreras FC','Primera Fuerza','assets/official-logos/herreras-fc.png'],['Abejas','Primera Fuerza','assets/official-logos/abejas.png'],
 ['Lobos CDG','Primera Fuerza','assets/official-logos/lobos-cdg.png'],['Terricolas','Primera Fuerza','assets/official-logos/terricolas.png'],
 ['Galacticos','Primera Fuerza','assets/teams/galacticos-pozos.webp'],['Manchester','Veteranos 50+','assets/official-logos/manchester.png'],
 ['Boavista','Primera Fuerza','assets/official-logos/boavista.png'],['La Esperanza','Intermedia','assets/official-logos/la-esperanza.png'],
 ['Tavera FC','Intermedia','assets/official-logos/tavera-fc.png'],['San Julián','Segunda Fuerza','assets/official-logos/san-julian.png'],
 ['América','Veteranos 35+','assets/branding/america-veteranos-35-user.png']
];
const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const slug=v=>norm(v).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const go=r=>{location.hash='#/'+r};
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const svgSearch='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.7" cy="10.7" r="6.8"></circle><path d="m16 16 5 5"></path></svg>';

function db(){try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}}
function teamLogo(name,path){
 if(path)return /^https?:/i.test(path)?path:BASE+String(path).replace(/^\/+/,'');
 const n=slug(name);
 const hit=FALLBACK.find(x=>slug(x[0])===n);
 return hit?BASE+hit[2]:'';
}
function addTeam(map,name,category,logo){
 name=String(name||'').trim(); if(!name||name.length<2||/^(equipo|club)$/i.test(name))return;
 const key=slug(name); if(!key)return;
 const prev=map.get(key)||{};
 map.set(key,{name,category:category||prev.category||'Liga Municipal',logo:teamLogo(name,logo||prev.logo||'')});
}
function teams(){
 const map=new Map();
 FALLBACK.forEach(x=>addTeam(map,x[0],x[1],x[2]));
 const data=db();
 Object.entries(data.categories||{}).forEach(([cid,cat])=>{
   const cname=cat?.name||CAT_NAMES[cid]||'Liga Municipal';
   Object.keys(cat?.rosters||{}).forEach(n=>addTeam(map,n,cname,''));
   (cat?.standings||[]).forEach(block=>(block?.rows||[]).forEach(r=>{
     if(Array.isArray(r))addTeam(map,r[1]||r[0],cname,'');
     else addTeam(map,r?.team||r?.name,cname,r?.logo||'');
   }));
 });
 return Array.from(map.values()).sort((a,b)=>a.name.localeCompare(b.name,'es')).slice(0,90);
}
function players(){
 const out=[],seen=new Set(),data=db();
 Object.entries(data.categories||{}).forEach(([cid,cat])=>{
   const cname=cat?.name||CAT_NAMES[cid]||'Liga Municipal';
   Object.entries(cat?.rosters||{}).forEach(([teamName,raw])=>{
     const rows=Array.isArray(raw)?raw:(raw?.rows||raw?.players||[]);
     (rows||[]).forEach(r=>{
       let name='',position='';
       if(Array.isArray(r)){name=String(r[1]||r[0]||'').trim();position=String(r[2]||'Jugador').trim()}
       else{name=String(r?.name||r?.player||'').trim();position=String(r?.position||'Jugador').trim()}
       const k=norm(name);if(!name||seen.has(k)||/^(nombre|jugador|tabla|goleadores)$/i.test(name))return;
       seen.add(k);out.push({name,team:teamName,category:cname,position});
     });
   });
 });
 return out.slice(0,140);
}
function favs(){const v=read(FAV_KEY,[]);return Array.isArray(v)?v:[]}
function isFav(name){return favs().includes(slug(name))}
function toggleFav(name){
 const k=slug(name),set=new Set(favs());set.has(k)?set.delete(k):set.add(k);write(FAV_KEY,Array.from(set));
}
function openTeam(name){
 try{localStorage.setItem('v62-team-name',name);localStorage.setItem('v27-selected-team',slug(name))}catch(_){}
 go('teamDetail');
}
function logoHtml(t){
 const u=t.logo||teamLogo(t.name,'');
 if(u)return '<img src="'+esc(u)+'" alt="" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v411-initials" style="display:none">'+esc(t.name.split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase())+'</span>';
 return '<span class="v411-initials">'+esc(t.name.split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase())+'</span>';
}
function teamRow(t){
 return '<div class="v411-row"><button class="v411-open" type="button" data-v411-team="'+esc(t.name)+'">'+
   '<span>'+logoHtml(t)+'</span><span><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Liga Municipal')+' · Fútbol</small></span></button>'+
   '<span></span><button class="v411-star '+(isFav(t.name)?'on':'')+'" type="button" data-v411-star="'+esc(t.name)+'" aria-label="Favorito">'+(isFav(t.name)?'★':'☆')+'</button></div>';
}
function tabs(active){
 return '<div class="v411-tabs" role="tablist">'+
  [['matches','Partidos'],['competitions','Competiciones'],['teams','Equipos'],['players','Jugadores']].map(x=>'<button class="v411-tab '+(active===x[0]?'active':'')+'" type="button" data-v411-tab="'+x[0]+'">'+x[1]+'</button>').join('')+
 '</div>';
}
function chips(active){
 return '<div class="v411-chips">'+
  [['all','Todo'],['3','Primera'],['5','Intermedia'],['4','Segunda'],['2','Veteranos 35+'],['1','Veteranos 50+']].map(x=>'<button class="v411-chip '+(active===x[0]?'active':'')+'" type="button" data-v411-cat="'+x[0]+'">'+x[1]+'</button>').join('')+
 '</div>';
}
function catMatch(t,cat){
 if(cat==='all')return true;
 const wanted=CAT_NAMES[cat]||'';
 return norm(t.category).includes(norm(wanted).replace(' fuerza',''));
}
function favoritesMarkup(){
 const active=localStorage.getItem(TAB_KEY)||'teams',cat=localStorage.getItem(CAT_KEY)||'all';
 const all=teams(),filtered=all.filter(t=>catMatch(t,cat));
 const favNames=new Set(favs());
 const rec=filtered.slice(0,10);
 let body='';
 if(active==='teams'){
   const ordered=filtered.slice().sort((a,b)=>(favNames.has(slug(b.name))?1:0)-(favNames.has(slug(a.name))?1:0));
   body='<div class="v411-intro v411-card"><h3>No te pierdas nada de tu Liga</h3><p>Marca tus equipos favoritos para tenerlos siempre a la mano.</p></div>'+
     '<div class="v411-logo-row">'+rec.map(t=>'<button class="v411-logo-tile" type="button" data-v411-team="'+esc(t.name)+'">'+logoHtml(t)+'</button>').join('')+'</div>'+
     '<div class="v411-search">'+svgSearch+'<input type="search" data-v411-filter placeholder="Busca un equipo"></div>'+
     '<div class="v411-head"><div><small>RECOMENDACIONES</small><h2>Equipos</h2></div></div><div class="v411-list" data-v411-list>'+ordered.slice(0,18).map(teamRow).join('')+'</div>';
 }else if(active==='players'){
   const ps=players();
   body='<div class="v411-intro v411-card"><h3>Mantente al día con tus jugadores</h3><p>Busca jugadores registrados por nombre y entra a su perfil oficial.</p></div>'+
     '<div class="v411-search">'+svgSearch+'<input type="search" data-v411-player-filter placeholder="Busca un jugador"></div>'+
     '<div class="v411-list" data-v411-player-list>'+(ps.length?ps.slice(0,18).map(p=>'<button class="v411-row" type="button" data-v411-player-search="'+esc(p.name)+'"><span class="v411-mini-logo">⚽</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+'</small></span><span>›</span></button>').join(''):'<div class="v411-empty">Los jugadores se mostrarán aquí con los datos oficiales disponibles.</div>')+'</div>';
 }else if(active==='competitions'){
   body='<div class="v411-intro v411-card"><h3>Primero, mira lo que te importa</h3><p>Abre directamente resultados, clasificación y cuadro por categoría.</p></div>'+
     '<div class="v411-actions">'+[
       ['🏆','Primera Fuerza','Resultados y clasificación','3'],['⚽','Intermedia','Resultados y clasificación','5'],
       ['🥇','Segunda Fuerza','Resultados y clasificación','4'],['🛡','Veteranos 35+','Resultados y clasificación','2'],
       ['★','Veteranos 50+','Resultados y clasificación','1']
     ].map(x=>'<button class="v411-action" type="button" data-v411-comp="'+x[3]+'"><i>'+x[0]+'</i><span><b>'+x[1]+'</b><small>'+x[2]+'</small></span></button>').join('')+'</div>';
 }else{
   body='<div class="v411-intro v411-card"><h3>Todos tus partidos en un lugar</h3><p>Consulta el calendario, la jornada y el Match Center desde tus accesos favoritos.</p></div>'+
     '<div class="v411-actions"><button class="v411-action" type="button" data-route="competition"><i>⚽</i><span><b>Partidos</b><small>Resultados y próximos juegos</small></span></button><button class="v411-action" type="button" data-route="v4-calendar"><i>▣</i><span><b>Calendario</b><small>Fechas y jornadas</small></span></button><button class="v411-action" type="button" data-route="matchCenter"><i>▶</i><span><b>Match Center</b><small>En vivo y transmisiones</small></span></button><button class="v411-action" type="button" data-route="following"><i>★</i><span><b>Siguiendo</b><small>Equipos que sigues</small></span></button></div>';
 }
 return '<section class="v411-zone" data-v411-zone="favorites">'+tabs(active)+chips(cat)+body+'</section>';
}
function mountFavorites(screen){
 let z=screen.querySelector('[data-v411-zone="favorites"]');
 if(!z){z=document.createElement('div');screen.appendChild(z)}
 z.outerHTML=favoritesMarkup();
 const root=screen.querySelector('[data-v411-zone="favorites"]');
 root.querySelectorAll('[data-v411-tab]').forEach(b=>b.onclick=()=>{localStorage.setItem(TAB_KEY,b.dataset.v411Tab);mountFavorites(screen)});
 root.querySelectorAll('[data-v411-cat]').forEach(b=>b.onclick=()=>{localStorage.setItem(CAT_KEY,b.dataset.v411Cat);mountFavorites(screen)});
 root.querySelectorAll('[data-v411-team]').forEach(b=>b.onclick=()=>openTeam(b.dataset.v411Team));
 root.querySelectorAll('[data-v411-star]').forEach(b=>b.onclick=()=>{toggleFav(b.dataset.v411Star);mountFavorites(screen)});
 root.querySelectorAll('[data-v411-comp]').forEach(b=>b.onclick=()=>{try{localStorage.setItem('v62-category',b.dataset.v411Comp);localStorage.setItem('v12-fixture-cat',b.dataset.v411Comp)}catch(_){};go('competition')});
 root.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>go(b.dataset.route));
 const input=root.querySelector('[data-v411-filter]');
 if(input)input.oninput=()=>{const q=norm(input.value);root.querySelector('[data-v411-list]').innerHTML=teams().filter(t=>catMatch(t,localStorage.getItem(CAT_KEY)||'all')).filter(t=>!q||norm(t.name).includes(q)).slice(0,24).map(teamRow).join('')||'<div class="v411-empty">No se encontró ese equipo.</div>';bindRows(root)};
 const pi=root.querySelector('[data-v411-player-filter]');
 if(pi)pi.oninput=()=>{const q=norm(pi.value),ps=players().filter(p=>!q||norm(p.name+' '+p.team).includes(q)).slice(0,24);root.querySelector('[data-v411-player-list]').innerHTML=ps.map(p=>'<button class="v411-row" type="button" data-v411-player-search="'+esc(p.name)+'"><span class="v411-mini-logo">⚽</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+'</small></span><span>›</span></button>').join('')||'<div class="v411-empty">No se encontró ese jugador.</div>';bindRows(root)};
 bindRows(root);
}
function bindRows(root){
 root.querySelectorAll('[data-v411-team]').forEach(b=>b.onclick=()=>openTeam(b.dataset.v411Team));
 root.querySelectorAll('[data-v411-star]').forEach(b=>b.onclick=()=>{toggleFav(b.dataset.v411Star);mountFavorites(document.querySelector('#screen'))});
 root.querySelectorAll('[data-v411-player-search]').forEach(b=>b.onclick=()=>{try{localStorage.setItem('v66-player-query',b.dataset.v411PlayerSearch)}catch(_){};go('players')});
}

function searchMarkup(){
 const all=teams().slice(0,16);
 return '<section class="v411-zone" data-v411-zone="search"><div class="v411-head"><div><small>BUSCAR EN LA LIGA</small><h2>Equipos, categorías y jugadores</h2><p>Accesos con logos oficiales y datos de la Liga.</p></div></div>'+
 '<div class="v411-chips"><button class="v411-chip active" type="button" data-v411-search-mode="all">Todo</button><button class="v411-chip" type="button" data-v411-search-mode="teams">Equipos</button><button class="v411-chip" type="button" data-v411-search-mode="competitions">Categorías</button><button class="v411-chip" type="button" data-v411-search-mode="players">Jugadores</button></div>'+
 '<div class="v411-logo-row">'+all.slice(0,9).map(t=>'<button class="v411-logo-tile" type="button" data-v411-team="'+esc(t.name)+'">'+logoHtml(t)+'</button>').join('')+'</div>'+
 '<div class="v411-search">'+svgSearch+'<input type="search" data-v411-global-search placeholder="Busca en la Liga"></div><div class="v411-list" data-v411-global-results>'+all.slice(0,8).map(teamRow).join('')+'</div></section>';
}
function mountSearch(screen){
 if(!screen.querySelector('[data-v411-zone="search"]'))screen.insertAdjacentHTML('beforeend',searchMarkup());
 const root=screen.querySelector('[data-v411-zone="search"]'); if(!root)return;
 let mode='all';
 const render=()=>{
   const q=norm(root.querySelector('[data-v411-global-search]')?.value||'');
   let html='';
   if(mode==='competitions')html=Object.entries(CAT_NAMES).filter(x=>!q||norm(x[1]).includes(q)).map(x=>'<button class="v411-row" type="button" data-v411-comp="'+x[0]+'"><span class="v411-mini-logo">🏆</span><span><b>'+esc(x[1])+'</b><small>Competición · Liga Municipal</small></span><span>›</span></button>').join('');
   else if(mode==='players')html=players().filter(p=>!q||norm(p.name+' '+p.team).includes(q)).slice(0,20).map(p=>'<button class="v411-row" type="button" data-v411-player-search="'+esc(p.name)+'"><span class="v411-mini-logo">⚽</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+'</small></span><span>›</span></button>').join('');
   else html=teams().filter(t=>!q||norm(t.name+' '+t.category).includes(q)).slice(0,20).map(teamRow).join('');
   root.querySelector('[data-v411-global-results]').innerHTML=html||'<div class="v411-empty">No hay coincidencias con esa búsqueda.</div>';
   bindRows(root);root.querySelectorAll('[data-v411-comp]').forEach(b=>b.onclick=()=>{try{localStorage.setItem('v62-category',b.dataset.v411Comp)}catch(_){};go('competition')});
 };
 root.querySelectorAll('[data-v411-search-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.v411SearchMode;root.querySelectorAll('[data-v411-search-mode]').forEach(x=>x.classList.toggle('active',x===b));render()});
 const input=root.querySelector('[data-v411-global-search]');if(input)input.oninput=render;
 bindRows(root);
}

function scanStreams(){
 const out=[];
 try{
  for(let i=0;i<localStorage.length;i++){
   const k=localStorage.key(i)||'';
   if(!k.startsWith('ljr-stream-list-v196:'))continue;
   const arr=JSON.parse(localStorage.getItem(k)||'[]');
   if(Array.isArray(arr))arr.forEach(x=>{if(x?.url)out.push({name:x.name||provider(x.url),url:x.url,key:k.slice('ljr-stream-list-v196:'.length)})});
  }
 }catch(_){}
 return out.slice(0,8);
}
function provider(u){u=String(u||'').toLowerCase();if(u.includes('youtube'))return'YouTube';if(u.includes('facebook')||u.includes('fb.watch'))return'Facebook';if(u.includes('tiktok'))return'TikTok';return'Transmisión'}
function openUrl(u){try{window.open(u,'_blank','noopener,noreferrer')}catch(_){}}
function watchMarkup(){
 const s=scanStreams();
 return '<section class="v411-section"><div class="v411-head"><div><small>TRANSMISIÓN</small><h2>Dónde verlo</h2><p>Solo aparecen fuentes vinculadas por la Liga.</p></div><button class="v411-link" type="button" data-route="matchCenter">Match Center ›</button></div>'+
 '<div class="v411-watch-list">'+(s.length?s.map((x,i)=>'<div class="v411-watch"><i>▶</i><span><b>'+esc(x.name)+'</b><small>'+esc(provider(x.url))+' · fuente guardada</small></span><button type="button" data-v411-open-stream="'+i+'">VER</button></div>').join(''):'<div class="v411-empty">Todavía no hay una transmisión vinculada. Cuando el operador agregue YouTube, Facebook, TikTok o video directo, aparecerá aquí.</div>')+'</div></section>';
}
function mountCalendar(screen){
 if(screen.querySelector('[data-v411-zone="calendar"]'))return;
 const t=teams().slice(0,8);
 const html='<section class="v411-zone" data-v411-zone="calendar"><div class="v411-head"><div><small>CALENDARIO</small><h2>Sigue tus equipos</h2><p>Acceso rápido desde la programación.</p></div><button class="v411-link" type="button" data-route="favorites">Favoritos ›</button></div><div class="v411-logo-row">'+t.map(x=>'<button class="v411-logo-tile" type="button" data-v411-team="'+esc(x.name)+'">'+logoHtml(x)+'</button>').join('')+'</div>'+watchMarkup()+'</section>';
 screen.insertAdjacentHTML('beforeend',html);bindGeneric(screen.querySelector('[data-v411-zone="calendar"]'));
}
function mountVideo(screen){
 if(screen.querySelector('[data-v411-zone="video"]'))return;
 const html='<section class="v411-zone" data-v411-zone="video"><div class="v411-head"><div><small>LIGA TV</small><h2>Más para ver</h2><p>Transmisiones, momentos y contenido oficial.</p></div></div>'+
 '<div class="v411-tv-grid"><button class="v411-tv-card" type="button" data-v411-tv><span class="play">▶</span><b>En vivo / Modo TV</b><small>Abre el panel de datos y transmisión de la Liga.</small></button><button class="v411-tv-card" type="button" data-route="moments"><span class="play">▶</span><b>Mejores momentos</b><small>Fotos, videos y momentos de la Liga.</small></button><button class="v411-tv-card" type="button" data-route="history"><span class="play">▶</span><b>Partidos clásicos</b><small>Finales e historia disponible.</small></button><button class="v411-tv-card" type="button" data-route="news"><span class="play">▤</span><b>Noticias</b><small>Avisos, publicaciones y novedades.</small></button></div>'+watchMarkup()+'</section>';
 screen.insertAdjacentHTML('beforeend',html);bindGeneric(screen.querySelector('[data-v411-zone="video"]'));
}
function mountNews(screen){
 if(screen.querySelector('[data-v411-zone="news"]'))return;
 const html='<section class="v411-zone" data-v411-zone="news"><div class="v411-head"><div><small>MANTENTE AL DÍA</small><h2>Sigue la Liga</h2><p>Avisos, notificaciones y publicaciones oficiales.</p></div></div><div class="v411-actions"><button class="v411-action" type="button" data-route="notifications"><i>♢</i><span><b>Notificaciones</b><small>Goles, partidos, noticias y avisos</small></span></button><button class="v411-action" type="button" data-route="favorites"><i>☆</i><span><b>Favoritos</b><small>Equipos y contenido que te importa</small></span></button></div><div class="v411-social v411-card"><div class="v411-social-title">SÍGUENOS</div><div class="v411-social-row"><button class="v411-social-btn v411-fb" type="button" data-v411-facebook aria-label="Facebook">f</button></div><p class="v411-social-note">Facebook oficial de la Liga Municipal de Fútbol Juventino Rosas.</p></div></section>';
 screen.insertAdjacentHTML('beforeend',html);bindGeneric(screen.querySelector('[data-v411-zone="news"]'));
}
function mountMore(screen){
 if(screen.querySelector('[data-v411-zone="more"]'))return;
 const html='<section class="v411-zone" data-v411-zone="more"><div class="v411-social v411-card"><div class="v411-social-title">SÍGUENOS</div><div class="v411-social-row"><button class="v411-social-btn v411-fb" type="button" data-v411-facebook aria-label="Facebook">f</button></div><p class="v411-social-note">Publicaciones, fotografías, calendarios y avisos de la Liga.</p></div><div class="v411-quick-footer"><button type="button" data-route="profile"><span>◎</span>Mi cuenta</button><button type="button" data-route="notifications"><span>♢</span>Notificaciones</button><button type="button" data-route="rulebook"><span>?</span>Ayuda / reglamento</button></div></section>';
 screen.insertAdjacentHTML('beforeend',html);bindGeneric(screen.querySelector('[data-v411-zone="more"]'));
}
function bindGeneric(root){
 if(!root)return;
 root.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>go(b.dataset.route));
 root.querySelectorAll('[data-v411-team]').forEach(b=>b.onclick=()=>openTeam(b.dataset.v411Team));
 root.querySelectorAll('[data-v411-facebook]').forEach(b=>b.onclick=()=>openUrl(FB));
 root.querySelectorAll('[data-v411-open-stream]').forEach(b=>{b.onclick=()=>{const x=scanStreams()[Number(b.dataset.v411OpenStream)];if(x)openUrl(x.url)}});
 root.querySelectorAll('[data-v411-tv]').forEach(b=>b.onclick=()=>{if(window.LJR_V105?.openTv)window.LJR_V105.openTv();else go('video')});
}

function mount(){
 const r=route(),screen=document.querySelector('#screen');if(!screen)return;
 if(r==='favorites')mountFavorites(screen);
 else if(r==='search')mountSearch(screen);
 else if(r==='video')mountVideo(screen);
 else if(r==='news')mountNews(screen);
 else if(r==='more')mountMore(screen);
 else if(['v4-calendar','calendar','monthlyCalendar','calendarMonthly','matchday'].includes(r))mountCalendar(screen);
}
let timer=0;
function schedule(ms=80){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(80));
window.addEventListener('load',()=>schedule(180));
document.addEventListener('DOMContentLoaded',()=>schedule(120),{once:true});
const scr=document.querySelector('#screen');if(scr)new MutationObserver(()=>schedule(70)).observe(scr,{childList:true,subtree:true});
schedule(120);setTimeout(mount,700);setTimeout(mount,1600);
})();