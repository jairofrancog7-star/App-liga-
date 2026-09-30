/* V412 — Diseños completos basados en las 10 capturas de referencia.
   No toca las barras superiores: reconstruye las secciones inferiores correspondientes. */
(function(){
'use strict';
if(window.__LJR_V412_REFERENCE_SCREENS__)return;
window.__LJR_V412_REFERENCE_SCREENS__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LEAGUE=BASE+'assets/liga-logo.webp';
const FB='https://www.facebook.com/share/19SsGuzsRi/';
const STORE='ljr-v412-favorites';
const CAT_NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const FALLBACK=[
 ['San José FC','3','assets/official-logos/san-jose-fc.png'],['Juventus','3','assets/official-logos/juventus.png'],['Hermanos','3','assets/official-logos/hermanos.png'],
 ['Linces','3','assets/official-logos/linces.png'],['Napoli','3','assets/official-logos/napoli.png'],['Franco FC','3','assets/official-logos/franco-fc.png'],
 ['Herreras FC','3','assets/official-logos/herreras-fc.png'],['Abejas','3','assets/official-logos/abejas.png'],['Lobos CDG','3','assets/official-logos/lobos-cdg.png'],
 ['Terricolas','3','assets/official-logos/terricolas.png'],['Galacticos','3','assets/teams/galacticos-pozos.webp'],['Manchester','1','assets/official-logos/manchester.png'],
 ['Boavista','3','assets/official-logos/boavista.png'],['La Esperanza','5','assets/official-logos/la-esperanza.png'],['Tavera FC','5','assets/official-logos/tavera-fc.png'],
 ['San Julián','4','assets/official-logos/san-julian.png'],['América','2','assets/branding/america-veteranos-35-user.png']
];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const slug=v=>norm(v).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const go=r=>{location.hash='#/'+r};
const data=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const searchSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.8"></circle><path d="m15.7 15.7 5.1 5.1"></path></svg>';

function logo(name,path=''){
 try{const reg=window.LJR_TEAM_LOGOS?.get?.(name);if(reg)return reg}catch(_){}
 if(path)return /^https?:/i.test(path)?path:BASE+String(path).replace(/^\/+/,'');
 const hit=FALLBACK.find(x=>slug(x[0])===slug(name));return hit?BASE+hit[2]:LEAGUE;
}
function initials(name){return String(name||'LJR').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()}
function logoNode(name,url=''){const u=logo(name,url);return '<img src="'+esc(u)+'" alt="" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v412-initials" style="display:none">'+esc(initials(name))+'</span>'}
function teams(){
 const map=new Map();
 const add=(name,catId='3',url='')=>{name=String(name||'').trim();if(!name||name.length<2)return;const k=slug(name),old=map.get(k)||{};map.set(k,{name,catId:String(catId||old.catId||'3'),category:CAT_NAMES[String(catId)]||old.category||'Liga Municipal',logo:logo(name,url||old.logo||'')})};
 FALLBACK.forEach(x=>add(x[0],x[1],x[2]));
 Object.entries(data().categories||{}).forEach(([cid,c])=>{
   (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1],cid));
   Object.keys(c?.rosters||{}).forEach(n=>add(n,cid));
   (c?.fixtures||[]).forEach(g=>(g?.rows||[]).forEach(r=>{add(r?.[2],cid);add(r?.[6],cid)}));
 });
 return Array.from(map.values()).sort((a,b)=>a.name.localeCompare(b.name,'es'));
}
function players(){
 const out=[],seen=new Set();
 Object.entries(data().categories||{}).forEach(([cid,c])=>{
   Object.entries(c?.rosters||{}).forEach(([teamName,raw])=>{
     const rows=Array.isArray(raw)?raw:(raw?.rows||raw?.players||[]);
     (rows||[]).forEach((r,i)=>{
       let name='',pos='Jugador';
       if(typeof r==='string')name=r;
       else if(Array.isArray(r)){name=String(r[1]||r[0]||'');pos=String(r[2]||'Jugador')}
       else{name=String(r?.name||r?.player||'');pos=String(r?.position||'Jugador')}
       name=name.trim();const k=norm(name);if(!name||seen.has(k)||/^(nombre|jugador|tabla|goleadores)$/i.test(name))return;
       seen.add(k);out.push({id:cid+'-'+slug(teamName)+'-'+i,name,team:teamName,catId:cid,category:c?.name||CAT_NAMES[cid]||'Liga Municipal',position:pos});
     });
   });
 });
 return out.slice(0,240);
}
function fixtures(){
 const out=[];
 Object.entries(data().categories||{}).forEach(([cid,c])=>{
   (c?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,ri)=>{
     if(!r?.[2]||!r?.[6])return;
     const hs=String(r?.[3]??'').trim(),as=String(r?.[5]??'').trim();
     const numeric=/^\d+$/.test(hs)&&/^\d+$/.test(as);
     out.push({key:String(cid)+':'+String(r?.[0]||ri),catId:String(cid),category:c?.name||CAT_NAMES[cid]||'Categoría',round:String(r?.[1]||''),home:String(r[2]),away:String(r[6]),hs:numeric?hs:'',as:numeric?as:'',field:String(r?.[7]||'Por confirmar'),rawDate:String(r?.[8]||''),status:String(r?.[10]||r?.[9]||''),stamp:stamp(r?.[8]),index:ri,group:gi});
   }));
 });
 return out.sort((a,b)=>(a.stamp||9e15)-(b.stamp||9e15));
}
function stamp(v){const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime():NaN}
function dayKey(t){if(!Number.isFinite(t))return'';const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function dayLabel(t){if(!Number.isFinite(t))return'Fecha';const d=new Date(t),today=new Date();const k=dayKey(t),tk=dayKey(today.getTime()),tom=dayKey(new Date(today.getFullYear(),today.getMonth(),today.getDate()+1).getTime());if(k===tk)return'Hoy';if(k===tom)return'Mañana';return new Intl.DateTimeFormat('es-MX',{weekday:'short',day:'2-digit',month:'short'}).format(d).replace('.','')}
function timeLabel(t,raw=''){if(Number.isFinite(t))return new Intl.DateTimeFormat('es-MX',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(t));return (String(raw).match(/\s(\d{1,2}:\d{2})/)||[])[1]||'—'}
function favoriteStore(){const s=read(STORE,{teams:[],players:[],competitions:[],matches:[]});return {...{teams:[],players:[],competitions:[],matches:[]},...s}}
function fav(type,key){return (favoriteStore()[type]||[]).includes(String(key))}
function toggle(type,key){const s=favoriteStore(),a=new Set(s[type]||[]),k=String(key);a.has(k)?a.delete(k):a.add(k);s[type]=Array.from(a);write(STORE,s)}
function openTeam(name){try{localStorage.setItem('v62-team-name',name);localStorage.setItem('v27-selected-team',slug(name))}catch(_){};go('teamDetail')}
function openPlayer(p){try{localStorage.setItem('v66-player-query',p.name);localStorage.setItem('v104-player-query',p.name)}catch(_){};go('players')}
function openCompetition(cid){try{localStorage.setItem('v62-category',String(cid));localStorage.setItem('v12-fixture-cat',String(cid))}catch(_){};go('competition')}
function streams(){
 const out=[];
 try{
   for(let i=0;i<localStorage.length;i++){
     const k=localStorage.key(i)||'';if(!k.startsWith('ljr-stream-list-v196:'))continue;
     const key=k.slice('ljr-stream-list-v196:'.length),arr=JSON.parse(localStorage.getItem(k)||'[]');
     if(Array.isArray(arr))arr.forEach(x=>{if(x?.url)out.push({key,name:x.name||provider(x.url),url:x.url,provider:provider(x.url)})});
   }
 }catch(_){}
 return out;
}
function provider(u){u=String(u||'').toLowerCase();if(u.includes('youtube'))return'YouTube';if(u.includes('facebook')||u.includes('fb.watch'))return'Facebook';if(u.includes('tiktok'))return'TikTok';if(/\.(mp4|webm|m3u8)/.test(u))return'Video directo';return'Fuente vinculada'}
function openUrl(u){try{window.open(u,'_blank','noopener,noreferrer')}catch(_){}}

function tabs(active){return '<div class="v412-tabs">'+[['matches','Partidos'],['competitions','Competiciones'],['teams','Equipos'],['players','Jugadores']].map(x=>'<button type="button" class="v412-tab '+(active===x[0]?'is-active':'')+'" data-v412-fav-tab="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'}
function cats(active){return '<div class="v412-filterbar">'+[['all','▣ Todo'],['3','⚽ Primera'],['5','⚽ Intermedia'],['4','⚽ Segunda'],['2','◉ Veteranos 35+'],['1','◉ Veteranos 50+']].map(x=>'<button type="button" class="v412-filter '+(active===x[0]?'is-active':'')+'" data-v412-cat="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'}
function teamCard(t){return '<div class="v412-rec"><button type="button" class="v412-rec-main" data-v412-team="'+esc(t.name)+'"><span class="v412-rec-logo">'+logoNode(t.name,t.logo)+'</span><span class="v412-rec-copy"><b>'+esc(t.name)+'</b><small>'+esc(t.category)+' · Fútbol</small></span></button><button type="button" class="v412-star '+(fav('teams',slug(t.name))?'is-on':'')+'" data-v412-star-team="'+esc(t.name)+'">'+(fav('teams',slug(t.name))?'★':'☆')+'</button></div>'}
function playerCard(p){return '<div class="v412-rec"><button type="button" class="v412-rec-main" data-v412-player="'+esc(p.id)+'"><span class="v412-avatar"><img src="'+esc(logo(p.team))+'" alt=""></span><span class="v412-rec-copy"><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.position)+'</small></span></button><button type="button" class="v412-star '+(fav('players',p.id)?'is-on':'')+'" data-v412-star-player="'+esc(p.id)+'">'+(fav('players',p.id)?'★':'☆')+'</button></div>'}
function compCard(cid,name){return '<div class="v412-rec"><button type="button" class="v412-rec-main" data-v412-comp="'+esc(cid)+'"><span class="v412-rec-logo"><img src="'+LEAGUE+'" alt=""></span><span class="v412-rec-copy"><b>'+esc(name)+'</b><small>Liga Municipal · Fútbol</small></span></button><button type="button" class="v412-star '+(fav('competitions',cid)?'is-on':'')+'" data-v412-star-comp="'+esc(cid)+'">'+(fav('competitions',cid)?'★':'☆')+'</button></div>'}
function matchFavCard(m){const score=m.hs!==''?m.hs+' - '+m.as:timeLabel(m.stamp,m.rawDate);return '<div class="v412-rec"><button type="button" class="v412-rec-main" data-v412-match="'+esc(m.key)+'"><span class="v412-rec-logo"><img src="'+esc(logo(m.home))+'" alt=""></span><span class="v412-rec-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+' · '+esc(score)+'</small></span></button><button type="button" class="v412-star '+(fav('matches',m.key)?'is-on':'')+'" data-v412-star-match="'+esc(m.key)+'">'+(fav('matches',m.key)?'★':'☆')+'</button></div>'}

function favoritesMarkup(){
 const active=localStorage.getItem('v412-fav-tab')||'teams',cat=localStorage.getItem('v412-fav-cat')||'all';
 const ts=teams().filter(t=>cat==='all'||String(t.catId)===cat),ps=players().filter(p=>cat==='all'||String(p.catId)===cat),ms=fixtures().filter(m=>cat==='all'||m.catId===cat);
 let hero='',strip='',search='',rows='';
 if(active==='teams'){
   hero='<div class="v412-hero"><h2>No te pierdas ni un instante</h2><p>Marca a tus equipos como favoritos para no perderte la acción de tu Liga.</p></div>';
   strip='<div class="v412-logo-strip">'+ts.slice(0,10).map(t=>'<button class="v412-logo-card" data-v412-team="'+esc(t.name)+'">'+logoNode(t.name,t.logo)+'</button>').join('')+'</div>';
   search='<div class="v412-searchbox">'+searchSvg+'<input data-v412-fav-search type="search" placeholder="Busca un equipo"></div>';
   rows='<div class="v412-section-title">Recomendaciones</div><div class="v412-list" data-v412-fav-list>'+ts.slice(0,18).map(teamCard).join('')+'</div>';
 }else if(active==='players'){
   hero='<div class="v412-hero"><h2>Mantente al día con la grandeza</h2><p>Recibe acceso rápido a los jugadores registrados y a sus equipos.</p></div>';
   strip='<div class="v412-logo-strip">'+ps.slice(0,10).map(p=>'<button class="v412-logo-card" data-v412-player="'+esc(p.id)+'"><span class="v412-initials">'+esc(initials(p.name))+'</span><small>'+esc(initials(p.team))+'</small></button>').join('')+'</div>';
   search='<div class="v412-searchbox">'+searchSvg+'<input data-v412-fav-search type="search" placeholder="Busca un jugador"></div>';
   rows='<div class="v412-section-title">Recomendaciones</div><div class="v412-list" data-v412-fav-list>'+(ps.length?ps.slice(0,18).map(playerCard).join(''):'<div class="v412-empty">Los jugadores aparecerán aquí con los registros oficiales disponibles.</div>')+'</div>';
 }else if(active==='competitions'){
   hero='<div class="v412-hero"><h2>Primero, mira lo que te importa</h2><p>Tus categorías favoritas quedan a un toque de resultados, clasificación y cuadro.</p></div>';
   strip='<div class="v412-logo-strip">'+Object.entries(CAT_NAMES).map(([cid,n])=>'<button class="v412-logo-card" data-v412-comp="'+cid+'"><img src="'+LEAGUE+'" alt=""><small>'+esc(cid)+'</small></button>').join('')+'</div>';
   search='<div class="v412-searchbox">'+searchSvg+'<input data-v412-fav-search type="search" placeholder="Busca una competición"></div>';
   rows='<div class="v412-section-title">Recomendaciones</div><div class="v412-list" data-v412-fav-list>'+Object.entries(CAT_NAMES).map(x=>compCard(x[0],x[1])).join('')+'</div>';
 }else{
   hero='<div class="v412-hero"><h2>Comencemos</h2><p>Marca partidos y equipos favoritos para ver rápidamente su programación y resultados.</p></div>';
   strip='<div class="v412-logo-strip">'+ts.slice(0,10).map(t=>'<button class="v412-logo-card" data-v412-team="'+esc(t.name)+'">'+logoNode(t.name,t.logo)+'</button>').join('')+'</div>';
   search='<div class="v412-searchbox">'+searchSvg+'<input data-v412-fav-search type="search" placeholder="Busca un partido o equipo"></div>';
   rows='<div class="v412-section-title">Recomendaciones</div><div class="v412-list" data-v412-fav-list>'+(ms.length?ms.slice(0,18).map(matchFavCard).join(''):'<div class="v412-empty">No hay partidos oficiales disponibles en este momento.</div>')+'</div>';
 }
 return '<section class="v412-shell" data-v412-screen="favorites">'+tabs(active)+cats(cat)+hero+strip+search+rows+'</section>';
}
function bindFavorites(screen){
 const root=screen.querySelector('[data-v412-screen="favorites"]');if(!root)return;
 root.querySelectorAll('[data-v412-fav-tab]').forEach(b=>b.onclick=()=>{localStorage.setItem('v412-fav-tab',b.dataset.v412FavTab);mountFavorites(screen,true)});
 root.querySelectorAll('[data-v412-cat]').forEach(b=>b.onclick=()=>{localStorage.setItem('v412-fav-cat',b.dataset.v412Cat);mountFavorites(screen,true)});
 bindCommon(root);
 const input=root.querySelector('[data-v412-fav-search]');
 if(input)input.oninput=()=>{const q=norm(input.value),active=localStorage.getItem('v412-fav-tab')||'teams',cat=localStorage.getItem('v412-fav-cat')||'all';let html='';
   if(active==='teams')html=teams().filter(t=>(cat==='all'||t.catId===cat)&&(!q||norm(t.name).includes(q))).slice(0,30).map(teamCard).join('');
   else if(active==='players')html=players().filter(p=>(cat==='all'||p.catId===cat)&&(!q||norm(p.name+' '+p.team).includes(q))).slice(0,30).map(playerCard).join('');
   else if(active==='competitions')html=Object.entries(CAT_NAMES).filter(x=>!q||norm(x[1]).includes(q)).map(x=>compCard(x[0],x[1])).join('');
   else html=fixtures().filter(m=>(cat==='all'||m.catId===cat)&&(!q||norm(m.home+' '+m.away).includes(q))).slice(0,30).map(matchFavCard).join('');
   root.querySelector('[data-v412-fav-list]').innerHTML=html||'<div class="v412-empty">No se encontraron coincidencias.</div>';bindCommon(root);
 };
}
function mountFavorites(screen,force=false){if(!force&&screen.querySelector('[data-v412-screen="favorites"]'))return;screen.querySelectorAll('[data-v412-screen="favorites"]').forEach(x=>x.remove());screen.insertAdjacentHTML('beforeend',favoritesMarkup());bindFavorites(screen)}

/* Cuenta / Más */
function accountMarkup(){return '<section class="v412-shell v412-account" data-v412-screen="account"><div class="v412-account-hello"><h2>¡Hola!</h2><p>Bienvenido a la Liga Municipal de Fútbol Juventino Rosas</p></div><div class="v412-auth"><button class="v412-login" data-v412-go="profile">Iniciar sesión</button><button class="v412-join" data-v412-go="profile">Únete ahora</button></div><div class="v412-menu"><button data-v412-go="notifications"><span>Notificaciones</span><span>♢</span></button><button data-v412-go="more"><span>Ajustes</span><span>⚙</span></button><button data-v412-go="rulebook"><span>Ayuda e información</span><span>?</span></button></div><div class="v412-social-title">SÍGUENOS</div><div class="v412-socials"><button class="v412-social fb" data-v412-facebook aria-label="Facebook">f</button></div><button class="v412-sharefriend" data-v412-share>♧ &nbsp; Cuéntale a un amigo</button><div class="v412-account-foot">Liga Municipal de Fútbol Juventino Rosas A.C.<br>Contenido oficial y herramientas de la Liga.<br><br>Versión V412</div></section>'}
function mountAccount(screen){if(screen.querySelector('[data-v412-screen="account"]'))return;screen.insertAdjacentHTML('beforeend',accountMarkup());bindCommon(screen.querySelector('[data-v412-screen="account"]'))}

/* Search */
function searchMarkup(){
 const t=teams().slice(0,12);
 return '<section class="v412-shell" data-v412-screen="search"><div class="v412-search-top"><input data-v412-search placeholder="Buscar"></div><div class="v412-modebar">'+[['all','Todo'],['teams','Equipos'],['competitions','Competiciones'],['players','Jugadores']].map((x,i)=>'<button class="v412-mode '+(i===0?'is-active':'')+'" data-v412-mode="'+x[0]+'">'+x[1]+'</button>').join('')+'</div><div class="v412-result-heading"><span>Equipos</span><button data-v412-go="teams">Ver todos ›</button></div><div class="v412-list" data-v412-search-results>'+t.map(teamCard).join('')+'</div></section>';
}
function bindSearch(root){
 let mode='all';const input=root.querySelector('[data-v412-search]');
 const render=()=>{const q=norm(input?.value||'');let html='',title='Resultados';
  if(mode==='players'){title='Jugadores';html=players().filter(p=>!q||norm(p.name+' '+p.team).includes(q)).slice(0,24).map(playerCard).join('')}
  else if(mode==='competitions'){title='Competiciones';html=Object.entries(CAT_NAMES).filter(x=>!q||norm(x[1]).includes(q)).map(x=>compCard(x[0],x[1])).join('')}
  else {title='Equipos';html=teams().filter(t=>!q||norm(t.name+' '+t.category).includes(q)).slice(0,24).map(teamCard).join('')}
  root.querySelector('.v412-result-heading span').textContent=title;root.querySelector('[data-v412-search-results]').innerHTML=html||'<div class="v412-empty">No hay coincidencias.</div>';bindCommon(root);
 };
 root.querySelectorAll('[data-v412-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.v412Mode;root.querySelectorAll('[data-v412-mode]').forEach(x=>x.classList.toggle('is-active',x===b));render()});
 if(input)input.oninput=render;bindCommon(root);
}
function mountSearch(screen){if(screen.querySelector('[data-v412-screen="search"]'))return;screen.insertAdjacentHTML('beforeend',searchMarkup());bindSearch(screen.querySelector('[data-v412-screen="search"]'))}

/* Partidos / calendario */
function dateKeys(){
 const fs=fixtures().filter(m=>Number.isFinite(m.stamp)),seen=[],now=Date.now();
 fs.sort((a,b)=>Math.abs(a.stamp-now)-Math.abs(b.stamp-now)).forEach(m=>{const k=dayKey(m.stamp);if(k&&!seen.includes(k))seen.push(k)});
 return seen.slice(0,5);
}
function matchStatus(m){if(m.hs!=='')return {main:m.hs+' - '+m.as,sub:'Final / resultado publicado'};const now=Date.now();if(Number.isFinite(m.stamp)&&now>=m.stamp&&now<m.stamp+120*60000)return {main:'EN VIVO',sub:timeLabel(m.stamp,m.rawDate)};return {main:timeLabel(m.stamp,m.rawDate),sub:m.field}}
function matchRow(m){const st=matchStatus(m);return '<div class="v412-matchrow"><div><div class="v412-teamline"><img src="'+esc(logo(m.home))+'" alt=""><span>'+esc(m.home)+'</span></div><div class="v412-teamline"><img src="'+esc(logo(m.away))+'" alt=""><span>'+esc(m.away)+'</span></div></div><div class="v412-scorebox"><b>'+esc(st.main)+'</b><small>'+esc(st.sub)+'</small></div><button class="v412-mini-star" data-v412-star-match="'+esc(m.key)+'">'+(fav('matches',m.key)?'★':'☆')+'</button></div>'}
function competitionGroups(list){
 const groups=new Map();list.forEach(m=>{const k=m.catId+'|'+m.category;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(m)});
 return Array.from(groups.entries());
}
function fixturesMarkup(){
 const keys=dateKeys(),selected=localStorage.getItem('v412-day')||keys[0]||'all',all=fixtures(),list=selected==='all'?all.slice(0,24):all.filter(m=>dayKey(m.stamp)===selected).slice(0,24);
 return '<section class="v412-shell" data-v412-screen="fixtures"><div class="v412-match-head"><div><h2>Partidos</h2><p>Calendario, resultados y favoritos</p></div><button class="v412-star" data-v412-go="favorites">☆</button></div><div class="v412-daystrip"><button class="v412-day '+(selected==='all'?'is-active':'')+'" data-v412-day="all">Todos</button>'+keys.map(k=>{const t=new Date(k+'T12:00:00').getTime();return '<button class="v412-day '+(selected===k?'is-active':'')+'" data-v412-day="'+k+'">'+esc(dayLabel(t))+'</button>'}).join('')+'</div><div class="v412-follow-note">Tus equipos favoritos aparecen primero cuando los marcas con ☆.</div><div class="v412-section-title">Todos los partidos</div><div data-v412-fixtures-list>'+(list.length?competitionGroups(list).map(([k,rows])=>'<article class="v412-competition-card"><div class="v412-comp-title"><i>◉</i><span><b>'+esc(rows[0].category)+'</b><small>Jornada '+esc(rows[0].round||'—')+'</small></span></div>'+rows.map(matchRow).join('')+'<div class="v412-comp-foot"><button data-v412-comp="'+rows[0].catId+'">Ver jornada ›</button></div></article>').join(''):'<div class="v412-empty">No hay partidos oficiales para este filtro.</div>')+'</div><div class="v412-grid"><button class="v412-shortcut" data-v412-go="whereToWatch"><i>▣</i><span><b>Dónde verlo</b><small>Fuentes de transmisión vinculadas</small></span></button><button class="v412-shortcut" data-v412-go="matchCenter"><i>▶</i><span><b>Match Center</b><small>Partido en vivo y cronología</small></span></button></div></section>';
}
function mountFixtures(screen,force=false){if(!force&&screen.querySelector('[data-v412-screen="fixtures"]'))return;screen.querySelectorAll('[data-v412-screen="fixtures"]').forEach(x=>x.remove());screen.insertAdjacentHTML('beforeend',fixturesMarkup());const root=screen.querySelector('[data-v412-screen="fixtures"]');root.querySelectorAll('[data-v412-day]').forEach(b=>b.onclick=()=>{localStorage.setItem('v412-day',b.dataset.v412Day);mountFixtures(screen,true)});bindCommon(root)}

/* Where to watch */
function whereMarkup(){
 const keys=dateKeys(),sel=localStorage.getItem('v412-watch-day')||keys[0]||'all',all=fixtures(),list=(sel==='all'?all:all.filter(m=>dayKey(m.stamp)===sel)).slice(0,18),src=streams();
 const rows=list.map(m=>{const s=src.find(x=>x.key===m.key);return '<div class="v412-watchrow"><div class="v412-watchtime">'+esc(timeLabel(m.stamp,m.rawDate))+'</div><div class="v412-watchgame"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+' · '+esc(m.field)+'</small>'+(s?'<button class="v412-provider" data-v412-url="'+esc(s.url)+'">'+esc(s.provider)+' · VER</button>':'<span class="v412-provider">Sin transmisión vinculada</span>')+'</div></div>'}).join('');
 return '<section class="v412-shell" data-v412-screen="where"><div class="v412-watch-title"><button data-v412-back>←</button><h2>Dónde verlo</h2></div><div class="v412-daystrip"><button class="v412-day '+(sel==='all'?'is-active':'')+'" data-v412-watch-day="all">Todos</button>'+keys.map(k=>'<button class="v412-day '+(sel===k?'is-active':'')+'" data-v412-watch-day="'+k+'">'+esc(dayLabel(new Date(k+'T12:00:00').getTime()))+'</button>').join('')+'</div><div class="v412-watch-card">'+(rows||'<div class="v412-empty">No hay programación oficial para este filtro.</div>')+'</div></section>';
}
function mountWhere(screen,force=false){if(!force){screen.innerHTML=''}screen.querySelectorAll('[data-v412-screen="where"]').forEach(x=>x.remove());screen.insertAdjacentHTML('beforeend',whereMarkup());const root=screen.querySelector('[data-v412-screen="where"]');root.querySelectorAll('[data-v412-watch-day]').forEach(b=>b.onclick=()=>{localStorage.setItem('v412-watch-day',b.dataset.v412WatchDay);mountWhere(screen,true)});root.querySelector('[data-v412-back]')?.addEventListener('click',()=>history.length>1?history.back():go('v4-calendar'));bindCommon(root)}

/* TV */
function mediaCard(m,label='Partido'){
 const result=m.hs!==''?m.hs+' - '+m.as:'VS';
 return '<button class="v412-media" data-v412-go="matchCenter"><div class="v412-media-art"><img src="'+esc(logo(m.home))+'" alt=""><img src="'+esc(logo(m.away))+'" alt=""><span class="v412-play">▶</span></div><div class="v412-media-copy"><b>'+esc(m.home)+' '+esc(result)+' '+esc(m.away)+'</b><small>'+esc(label)+' · '+esc(m.category)+'</small></div></button>';
}
function tvSection(title,sub,list,label){return '<div class="v412-tv-section"><div class="v412-tv-section-head"><div><h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p></div><button data-v412-go="moments">Ver más ›</button></div><div class="v412-media-row">'+(list.length?list.map(m=>mediaCard(m,label)).join(''):'<div class="v412-empty">Contenido disponible cuando la Liga publique o vincule material.</div>')+'</div></div>'}
function tvMarkup(){
 const all=fixtures(),played=all.filter(m=>m.hs!=='').slice(-8).reverse(),upcoming=all.filter(m=>m.hs==='').slice(0,8),featured=(played.length?played:upcoming).slice(0,6);
 return '<section class="v412-shell" data-v412-screen="tv"><div class="v412-tv-actions"><button data-v412-tvpanel><i>▣</i><b>En directo</b><small>Modo TV y partido en vivo</small></button><button data-v412-go="favorites"><i>☆</i><b>Mis partidos</b><small>Favoritos y seguimiento</small></button></div>'+tvSection('Ver en vivo en la Liga','Partidos y transmisiones vinculadas',upcoming.slice(0,5),'Próximo')+tvSection('Mejores momentos','Resultados oficiales recientes',played.slice(0,6),'Resultado')+tvSection('Videos oficiales de clubes','Accesos a momentos y archivo',featured,'Liga TV')+tvSection('Lo más visto','Contenido destacado de la Liga',featured.slice().reverse(),'Destacado')+tvSection('Resúmenes más recientes','Partidos finalizados con marcador oficial',played.slice(0,5),'Resumen')+'</section>';
}
function mountTv(screen){if(screen.querySelector('[data-v412-screen="tv"]'))return;screen.insertAdjacentHTML('beforeend',tvMarkup());bindCommon(screen.querySelector('[data-v412-screen="tv"]'))}

/* Noticias: acceso de Facebook en formato referencia, sin tocar noticias existentes */
function newsMarkup(){return '<section class="v412-shell" data-v412-screen="news"><div class="v412-account-hello"><h2>Mantente al día</h2><p>Avisos, favoritos y publicaciones oficiales de la Liga.</p></div><div class="v412-menu"><button data-v412-go="notifications"><span>Notificaciones</span><span>♢</span></button><button data-v412-go="favorites"><span>Favoritos</span><span>☆</span></button><button data-v412-go="scheduleChanges"><span>Cambios de horario y sede</span><span>›</span></button></div><div class="v412-social-title">SÍGUENOS</div><div class="v412-socials"><button class="v412-social fb" data-v412-facebook>f</button></div></section>'}
function mountNews(screen){if(screen.querySelector('[data-v412-screen="news"]'))return;screen.insertAdjacentHTML('beforeend',newsMarkup());bindCommon(screen.querySelector('[data-v412-screen="news"]'))}

function bindCommon(root){
 if(!root)return;
 root.querySelectorAll('[data-v412-go]').forEach(b=>b.onclick=()=>go(b.dataset.v412Go));
 root.querySelectorAll('[data-v412-team]').forEach(b=>b.onclick=()=>openTeam(b.dataset.v412Team));
 root.querySelectorAll('[data-v412-player]').forEach(b=>b.onclick=()=>{const p=players().find(x=>x.id===b.dataset.v412Player);if(p)openPlayer(p)});
 root.querySelectorAll('[data-v412-comp]').forEach(b=>b.onclick=()=>openCompetition(b.dataset.v412Comp));
 root.querySelectorAll('[data-v412-match]').forEach(b=>b.onclick=()=>go('matchCenter'));
 root.querySelectorAll('[data-v412-star-team]').forEach(b=>b.onclick=()=>{toggle('teams',slug(b.dataset.v412StarTeam));remountCurrent()});
 root.querySelectorAll('[data-v412-star-player]').forEach(b=>b.onclick=()=>{toggle('players',b.dataset.v412StarPlayer);remountCurrent()});
 root.querySelectorAll('[data-v412-star-comp]').forEach(b=>b.onclick=()=>{toggle('competitions',b.dataset.v412StarComp);remountCurrent()});
 root.querySelectorAll('[data-v412-star-match]').forEach(b=>b.onclick=()=>{toggle('matches',b.dataset.v412StarMatch);remountCurrent()});
 root.querySelectorAll('[data-v412-facebook]').forEach(b=>b.onclick=()=>openUrl(FB));
 root.querySelectorAll('[data-v412-url]').forEach(b=>b.onclick=()=>openUrl(b.dataset.v412Url));
 root.querySelectorAll('[data-v412-tvpanel]').forEach(b=>b.onclick=()=>{if(window.LJR_V105?.openTv)window.LJR_V105.openTv();else go('matchCenter')});
 root.querySelectorAll('[data-v412-share]').forEach(b=>b.onclick=async()=>{const payload={title:'Liga Juventino Rosas',text:'Liga Municipal de Fútbol Juventino Rosas',url:location.origin+location.pathname};try{if(navigator.share)await navigator.share(payload);else await navigator.clipboard?.writeText(payload.url)}catch(_){}});
}
function remountCurrent(){const screen=document.querySelector('#screen');if(!screen)return;const r=route();if(r==='favorites')mountFavorites(screen,true);else if(['v4-calendar','calendar','monthlyCalendar','calendarMonthly','matchday','competition'].includes(r))mountFixtures(screen,true)}
function cleanOld(screen){screen.querySelectorAll('.v411-zone').forEach(x=>x.remove())}
function mount(){
 const screen=document.querySelector('#screen');if(!screen)return;cleanOld(screen);
 const r=route();
 if(r==='favorites')mountFavorites(screen);
 else if(r==='search')mountSearch(screen);
 else if(r==='more')mountAccount(screen);
 else if(r==='video')mountTv(screen);
 else if(r==='news')mountNews(screen);
 else if(r==='whereToWatch')mountWhere(screen);
 else if(['v4-calendar','calendar','monthlyCalendar','calendarMonthly','matchday','competition'].includes(r))mountFixtures(screen);
}
let timer=0;function schedule(ms=70){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(60));window.addEventListener('load',()=>schedule(180));document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
const s=document.querySelector('#screen');if(s)new MutationObserver(()=>schedule(80)).observe(s,{childList:true,subtree:true});
schedule(100);setTimeout(mount,600);setTimeout(mount,1400);
})();