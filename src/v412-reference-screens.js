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

/* Search — referencia exacta adaptada a la Liga, conservando el azul */
function playerStats(p){
 const c=data()?.categories?.[String(p.catId)]||{};
 const scorer=((c.scorers||[])[0]?.rows||[]).find(r=>norm(r?.[1])===norm(p.name)&&norm(r?.[2])===norm(p.team));
 const standing=((c.standings||[])[0]?.rows||[]).find(r=>norm(r?.[1])===norm(p.team));
 return {
   goals:Number(scorer?.[3]||0)||0,
   played:Number(standing?.[2]||0)||0,
   points:Number(standing?.[9]||0)||0
 };
}
function categoryCode(catId){
 return ({'3':'1ª','5':'INT','4':'2ª','2':'V35','1':'V50'})[String(catId)]||'LJR';
}
function positionCode(p){
 const raw=String(p.position||'Jugador').trim().toUpperCase();
 if(!raw||raw==='JUGADOR')return 'JUG';
 if(/PORT|ARQ|GK/.test(raw))return 'POR';
 if(/DEF/.test(raw))return 'DEF';
 if(/MED|MC|MD|MI|MCD|MCO/.test(raw))return 'MED';
 if(/DEL|DC|EXT|EI|ED/.test(raw))return 'DEL';
 return raw.slice(0,3);
}
function searchPlayerRow(p){
 const s=playerStats(p),teamLogo=logo(p.team),cat=categoryCode(p.catId),pos=positionCode(p);
 const pc=/^DEL/.test(pos)?'is-del':/^DEF/.test(pos)?'is-def':/^(MED|CEN|MC|MD|MI|MCD|MCO)/.test(pos)?'is-mid':'is-jug';
 return '<button type="button" class="v414-player-row" data-v412-player="'+esc(p.id)+'" aria-label="'+esc(p.name)+', '+esc(p.team)+', '+s.goals+' goles, '+s.played+' partidos, '+s.points+' puntos">'+
   '<span class="v414-player-photo"><img src="'+esc(teamLogo)+'" alt="'+esc(p.team)+'"><i>'+esc(initials(p.name))+'</i></span>'+
   '<span class="v414-player-main">'+
     '<b>'+esc(p.name)+'</b>'+
     '<span class="v414-player-meta"><span class="v414-mx-flag" title="México"><i></i></span><strong class="'+pc+'">'+esc(pos)+'</strong><em>'+esc(p.team)+'</em></span>'+
   '</span>'+
   '<span class="v414-num" title="Goles"><b>'+s.goals+'</b></span>'+
   '<span class="v414-num v414-pj" title="Partidos jugados"><b>'+s.played+'</b></span>'+
   '<span class="v414-num v414-pts" title="Puntos"><i>▲</i><b>'+s.points+'</b></span>'+
   '<span class="v414-badges"><span class="v414-league-badge"><img src="'+LEAGUE+'" alt="Liga"><small>'+esc(cat)+'</small></span><span class="v414-team-badge"><img src="'+esc(teamLogo)+'" alt="'+esc(p.team)+'"></span></span>'+
 '</button>';
}
function searchTeamRow(t){
 const on=fav('teams',slug(t.name));
 return '<div class="v416-team-row">'+
   '<button type="button" class="v416-team-main" data-v412-team="'+esc(t.name)+'">'+
     '<span class="v416-team-logo">'+logoNode(t.name,t.logo)+'</span>'+
     '<span class="v416-team-copy"><b>'+esc(t.name)+'</b><small>'+esc(t.category)+' <i></i> Fútbol</small></span>'+
   '</button>'+
   '<button type="button" class="v416-team-star '+(on?'is-on':'')+'" data-v412-star-team="'+esc(t.name)+'" aria-label="'+(on?'Quitar de favoritos':'Agregar a favoritos')+'">'+(on?'★':'☆')+'</button>'+
 '</div>';
}
function searchMatchRow(m){
 const st=matchStatus(m);
 return '<button type="button" class="v412-search-match-row" data-v412-match="'+esc(m.key)+'"><span><img src="'+esc(logo(m.home))+'" alt=""><b>'+esc(m.home)+'</b></span><strong>'+esc(st.main)+'</strong><span><img src="'+esc(logo(m.away))+'" alt=""><b>'+esc(m.away)+'</b></span></button>';
}
function searchMarkup(){
 const mode=localStorage.getItem('v412-search-mode')||'players';
 return '<section class="v412-shell v412-search-reference v414-search-reference v415-single-search" data-v412-screen="search">'+
   '<div class="v414-search-join">'+
     '<div class="v412-modebar">'+[['players','Jugadores'],['teams','Equipos'],['competitions','Competiciones'],['matches','Partidos']].map(x=>'<button class="v412-mode '+(mode===x[0]?'is-active':'')+'" data-v412-mode="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'+
   '</div>'+
   '<div class="v414-player-cover" data-v414-player-cover><span>PORTADA</span><div><small></small><small>GOL</small><small>PJ</small><small>PTS</small><small></small></div></div>'+
   '<div class="v412-result-heading v414-result-heading"><span></span><button data-v412-go="players">Ver todos ›</button></div>'+
   '<div class="v414-results" data-v412-search-results></div>'+
   '<div class="v412-search-tools"><button data-v412-go="teams">Equipos</button><button data-v412-go="following">Favoritos</button><button data-v412-go="v4-calendar">Calendario</button><button data-v412-go="news">Noticias</button></div>'+
 '</section>';
}
function bindSearch(root){
 let mode=localStorage.getItem('v412-search-mode')||'players';
 const input=document.querySelector('#globalSearch');
 const nativeResults=document.querySelector('#searchResults');
 const render=()=>{
   const q=norm(input?.value||'');let html='',title='',allLabel='Ver todos ›',allRoute='players';
   if(nativeResults)nativeResults.style.display=q?'none':'';
   const cover=root.querySelector('[data-v414-player-cover]');
   root.classList.toggle('is-player-mode',mode==='players');
   root.classList.toggle('is-team-mode',mode==='teams');
   if(cover)cover.style.display=mode==='players'?'flex':'none';
   if(mode==='players'){
     title='Jugadores registrados';allRoute='players';
     html=players().filter(p=>!q||norm(p.name+' '+p.team+' '+p.category).includes(q))
       .sort((a,b)=>{const A=playerStats(a),B=playerStats(b);return B.goals-A.goals||B.points-A.points||a.name.localeCompare(b.name,'es')})
       .slice(0,36).map(searchPlayerRow).join('');
   }else if(mode==='teams'){
     title='Equipos';allRoute='teams';allLabel='›';
     html=teams().filter(t=>!q||norm(t.name+' '+t.category+' futbol').includes(q)).slice(0,30).map(searchTeamRow).join('');
   }else if(mode==='competitions'){
     title='Competiciones';allRoute='competition';
     html=Object.entries(CAT_NAMES).filter(x=>!q||norm(x[1]).includes(q)).map(x=>compCard(x[0],x[1])).join('');
   }else{
     title='Partidos';allRoute='competition';
     html=fixtures().filter(m=>!q||norm(m.home+' '+m.away+' '+m.category).includes(q)).slice(0,24).map(searchMatchRow).join('');
   }
   root.querySelector('.v412-result-heading span').textContent=title;
   const all=root.querySelector('.v412-result-heading button');if(all){all.dataset.v412Go=allRoute;all.textContent=allLabel}
   root.querySelector('[data-v412-search-results]').innerHTML=html||'<div class="v412-empty">No hay coincidencias.</div>';
   bindCommon(root);
 };
 root.querySelectorAll('[data-v412-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.v412Mode;localStorage.setItem('v412-search-mode',mode);root.querySelectorAll('[data-v412-mode]').forEach(x=>x.classList.toggle('is-active',x===b));render()});
 if(input){
   if(input.__v415SearchHandler)input.removeEventListener('input',input.__v415SearchHandler);
   input.__v415SearchHandler=()=>requestAnimationFrame(render);
   input.addEventListener('input',input.__v415SearchHandler);
 }
 render();bindCommon(root);
}
function mountSearch(screen){if(screen.querySelector('[data-v412-screen="search"]'))return;screen.insertAdjacentHTML('beforeend',searchMarkup());bindSearch(screen.querySelector('[data-v412-screen="search"]'))}

/* Fichajes — referencias Últimos / Competiciones */
function transferCompetitions(){
 const by={};
 teams().forEach(t=>{(by[t.catId]||(by[t.catId]=[])).push(t)});
 return Object.entries(CAT_NAMES).map(([cid,name])=>{
   const list=(by[cid]||[]).slice(0,3);
   return '<article class="v412-transfer-league"><header><span><img src="'+LEAGUE+'" alt=""><b>'+esc(name)+'</b><small>Liga Juventino Rosas</small></span><button data-v412-comp="'+cid+'">Ver más</button></header>'+
     '<div class="v412-transfer-clubs">'+(list.length?list.map(t=>'<button data-v412-team="'+esc(t.name)+'"><span>'+logoNode(t.name,t.logo)+'</span><b>'+esc(t.name)+'</b><small>Equipo registrado</small></button>').join(''):'<div class="v412-empty">Sin equipos publicados en esta categoría.</div>')+'</div></article>';
 }).join('');
}
function transferPlayerCards(filter='all',order='goals'){
 let list=players().slice();
 if(filter!=='all')list=list.filter(p=>String(p.catId)===String(filter));
 list.sort((a,b)=>{
   const A=playerStats(a),B=playerStats(b);
   if(order==='name')return a.name.localeCompare(b.name,'es');
   if(order==='team')return a.team.localeCompare(b.team,'es')||a.name.localeCompare(b.name,'es');
   return B.goals-A.goals||B.points-A.points||a.name.localeCompare(b.name,'es');
 });
 return list.slice(0,10).map(p=>{
   const s=playerStats(p),teamLogo=logo(p.team),pos=positionCode(p),pc=/^DEL/.test(pos)?'is-del':/^DEF/.test(pos)?'is-def':/^(MED|CEN|MC|MD|MI|MCD|MCO)/.test(pos)?'is-mid':'is-jug';
   return '<article class="v418-transfer-player-card">'+
     '<button type="button" class="v418-transfer-player-open" data-v412-player="'+esc(p.id)+'">'+
       '<span class="v418-transfer-photo"><img src="'+esc(teamLogo)+'" alt="'+esc(p.team)+'"><i class="'+pc+'">'+esc(pos)+'</i></span>'+
       '<span class="v418-transfer-age">Registro oficial</span>'+
       '<b class="v418-transfer-name">'+esc(p.name)+'</b>'+
       '<span class="v418-current-club"><img src="'+esc(teamLogo)+'" alt=""><strong>'+esc(p.team)+'</strong></span>'+
       '<span class="v418-transfer-status">Sin movimiento oficial publicado</span>'+
       '<span class="v418-transfer-meta"><b>'+esc(p.category)+'</b><b>'+s.goals+' goles · '+s.played+' PJ</b></span>'+
     '</button>'+
   '</article>';
 }).join('')||'<div class="v412-empty">No hay jugadores registrados en este filtro.</div>';
}
function transferPlayersSection(){
 const filter=localStorage.getItem('v418-transfer-player-filter')||'all';
 const order=localStorage.getItem('v418-transfer-player-order')||'goals';
 const filterLabel=filter==='all'?'Todos':(CAT_NAMES[filter]||'Categoría');
 const orderLabel=order==='goals'?'Goles':order==='team'?'Equipo':'Nombre';
 return '<section class="v418-transfer-players">'+
   '<div class="v418-transfer-player-title"><small>TRANSFERENCIAS</small><h3>Jugadores</h3><p>Diseño de centro de fichajes adaptado al azul. Sólo muestra datos registrados; no inventa movimientos.</p></div>'+
   '<div class="v418-transfer-player-toolbar">'+
     '<button type="button" class="v418-transfer-all">Todos los jugadores</button>'+
     '<button type="button" data-v418-transfer-filter>Filtro · '+esc(filterLabel)+'⌄</button>'+
     '<button type="button" data-v418-transfer-order>Ordenar · '+esc(orderLabel)+'⌄</button>'+
   '</div>'+
   '<div class="v418-transfer-player-list" data-v418-transfer-player-list>'+transferPlayerCards(filter,order)+'</div>'+
 '</section>';
}
function transfersMarkup(){
 const mode=localStorage.getItem('v412-transfer-mode')||'latest';
 return '<section class="v412-shell v412-transfers-reference" data-v412-screen="transfers">'+
   '<div class="v412-transfer-brand"><span>☰</span><b>Fichajes</b></div>'+
   '<div class="v412-transfer-tabs"><button class="'+(mode==='latest'?'is-active':'')+'" data-v412-transfer-mode="latest">ÚLTIMOS</button><button class="'+(mode==='competitions'?'is-active':'')+'" data-v412-transfer-mode="competitions">COMPETICIONES</button></div>'+
   '<div class="v412-transfer-filters"><button>Mis categorías⌄</button><button>Filtros⌄</button></div>'+
   '<div class="v412-transfer-switch"><button class="is-active">OFICIAL</button><button disabled>RUMOR</button></div>'+
   '<div data-v412-transfer-body></div>'+
   transferPlayersSection()+
 '</section>';
}
function bindTransferPlayerTools(root){
 const rerender=()=>{
   const box=root.querySelector('[data-v418-transfer-player-list]');if(!box)return;
   const filter=localStorage.getItem('v418-transfer-player-filter')||'all';
   const order=localStorage.getItem('v418-transfer-player-order')||'goals';
   box.innerHTML=transferPlayerCards(filter,order);
   const fb=root.querySelector('[data-v418-transfer-filter]');
   const ob=root.querySelector('[data-v418-transfer-order]');
   if(fb)fb.textContent='Filtro · '+(filter==='all'?'Todos':(CAT_NAMES[filter]||'Categoría'))+'⌄';
   if(ob)ob.textContent='Ordenar · '+(order==='goals'?'Goles':order==='team'?'Equipo':'Nombre')+'⌄';
   bindCommon(box);
 };
 root.querySelector('[data-v418-transfer-filter]')?.addEventListener('click',()=>{
   const seq=['all','3','5','4','2','1'];
   const cur=localStorage.getItem('v418-transfer-player-filter')||'all';
   localStorage.setItem('v418-transfer-player-filter',seq[(seq.indexOf(cur)+1)%seq.length]);
   rerender();
 });
 root.querySelector('[data-v418-transfer-order]')?.addEventListener('click',()=>{
   const seq=['goals','name','team'];
   const cur=localStorage.getItem('v418-transfer-player-order')||'goals';
   localStorage.setItem('v418-transfer-player-order',seq[(seq.indexOf(cur)+1)%seq.length]);
   rerender();
 });
}
function bindTransfers(root){
 const render=()=>{
   const mode=localStorage.getItem('v412-transfer-mode')||'latest';
   root.querySelectorAll('[data-v412-transfer-mode]').forEach(x=>x.classList.toggle('is-active',x.dataset.v412TransferMode===mode));
   root.querySelector('[data-v412-transfer-body]').innerHTML=mode==='competitions'?transferCompetitions():
     '<div class="v412-transfer-empty-ref"><span>↔</span><b>Sin movimientos oficiales publicados</b><p>No mostramos rumores, altas ni cambios de equipo hasta que exista una publicación oficial de la Liga.</p><button data-v412-go="news">Ver noticias oficiales</button></div>';
   bindCommon(root);
 };
 root.querySelectorAll('[data-v412-transfer-mode]').forEach(b=>b.onclick=()=>{localStorage.setItem('v412-transfer-mode',b.dataset.v412TransferMode);render()});
 render();bindTransferPlayerTools(root);bindCommon(root);
}
function mountTransfers(screen){if(screen.querySelector('[data-v412-screen="transfers"]'))return;screen.insertAdjacentHTML('beforeend',transfersMarkup());bindTransfers(screen.querySelector('[data-v412-screen="transfers"]'))}

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

/* TV — Liga TV / Televisados / Conectar o transmitir
   V421: referencia tipo feed TV, montada únicamente en la parte inferior y adaptada al azul de la Liga. */
function tvCardAction(m,s){
 return s?' data-v412-url="'+esc(s.url)+'"':' data-v412-match="'+esc(m.key)+'"';
}
function tvWideCard(m,label='Partido',s=null,i=0){
 const result=m.hs!==''?m.hs+' - '+m.as:'VS';
 const meta=s?(s.provider+' · transmisión vinculada'):(m.hs!==''?'Resumen · '+m.category:timeLabel(m.stamp,m.rawDate)+' · '+m.category);
 return '<button class="v421-tv-card" type="button"'+tvCardAction(m,s)+'>'+
   '<span class="v421-tv-art v421-tv-tone-'+(i%4)+'">'+
     '<span class="v421-tv-team v421-tv-team-a"><img src="'+esc(logo(m.home))+'" alt=""><i>'+esc(initials(m.home))+'</i></span>'+
     '<span class="v421-tv-team v421-tv-team-b"><img src="'+esc(logo(m.away))+'" alt=""><i>'+esc(initials(m.away))+'</i></span>'+
     '<strong>'+esc(result)+'</strong><em>'+esc(label)+'</em><span class="v421-tv-play">▶</span>'+
   '</span>'+
   '<span class="v421-tv-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(meta)+'</small></span>'+
 '</button>';
}
function tvClubCard(t,i=0){
 return '<button class="v421-tv-card v421-tv-club-card" type="button" data-v412-team="'+esc(t.name)+'">'+
   '<span class="v421-tv-art v421-tv-club-art v421-tv-tone-'+(i%4)+'"><span class="v421-tv-club-logo">'+logoNode(t.name,t.logo)+'</span><span class="v421-tv-play">▶</span><em>CLUB</em></span>'+
   '<span class="v421-tv-copy"><b>'+esc(t.name)+'</b><small>'+esc(t.category)+' · equipo registrado</small></span>'+
 '</button>';
}
function tvPortraitCard(m,label='Liga TV',i=0){
 const result=m.hs!==''?m.hs+' - '+m.as:'VS';
 return '<button class="v421-tv-portrait" type="button" data-v412-match="'+esc(m.key)+'">'+
   '<span class="v421-tv-portrait-art v421-tv-tone-'+(i%4)+'">'+
     '<span class="v421-tv-portrait-logos"><img src="'+esc(logo(m.home))+'" alt=""><img src="'+esc(logo(m.away))+'" alt=""></span>'+
     '<strong>'+esc(result)+'</strong><span class="v421-tv-play">▶</span><em>'+esc(label)+'</em>'+
   '</span>'+
   '<span class="v421-tv-portrait-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+'</small></span>'+
 '</button>';
}
function tvRail(title,sub,html,action=''){
 return '<section class="v421-tv-rail"><header><span><h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p></span>'+(action||'')+'</header><div class="v421-tv-scroll">'+html+'</div></section>';
}
function tvHomeMarkup(){
 const all=fixtures();
 const played=all.filter(m=>m.hs!=='').slice(-10).reverse();
 const upcoming=all.filter(m=>m.hs==='').slice(0,10);
 const src=streams();
 const liveBase=(upcoming.length?upcoming:all.slice(0,8)).slice(0,8);
 const clubs=teams().slice(0,10);
 const highlights=(played.length?played:all.slice(0,8)).slice(0,8);
 const portraits=(played.length?played:all.slice(0,8)).slice(0,8);
 const latest=(played.length?played:all.slice(-8).reverse()).slice(0,8);

 const top='<div class="v421-tv-top-actions">'+
   '<button type="button" data-v412-tv-mode="watch"><span>◉</span><b>En directo y próximos</b><small>Partidos y fuentes</small></button>'+
   '<button type="button" data-v412-tv-mode="cast"><span>▣</span><b>Ver en TV</b><small>Conectar o transmitir</small></button>'+
 '</div>';

 const liveCards=liveBase.map((m,i)=>tvWideCard(m,src.find(x=>x.key===m.key)?'EN TV':'PRÓXIMO',src.find(x=>x.key===m.key)||null,i)).join('');
 const leagueCards=highlights.map((m,i)=>tvWideCard(m,m.hs!==''?'MEJORES MOMENTOS':'PARTIDO',null,i+1)).join('');
 const clubCards=clubs.map((t,i)=>tvClubCard(t,i)).join('');
 const portraitCards=portraits.map((m,i)=>tvPortraitCard(m,'LIGA TV',i)).join('');
 const popularCards=highlights.slice().reverse().map((m,i)=>tvWideCard(m,'DESTACADO',null,i+2)).join('');
 const latestCards=latest.map((m,i)=>tvWideCard(m,'RESUMEN',null,i+3)).join('');
 const more='<button type="button" data-v412-tv-mode="watch">Ver más ›</button>';

 return top+
   tvRail('Ver en TV','Partidos y transmisiones vinculadas',liveCards||'<div class="v412-empty">No hay programación disponible.</div>',more)+
   tvRail('Liga Juventino Rosas','Partidos, resultados y mejores momentos',leagueCards||'<div class="v412-empty">Los partidos aparecerán aquí.</div>',more)+
   tvRail('Videos oficiales de clubes','Equipos registrados de la Liga',clubCards||'<div class="v412-empty">No hay equipos disponibles.</div>','<button type="button" data-v412-go="teams">Ver más ›</button>')+
   tvRail('Liga TV Videos','Contenido vertical y momentos destacados','<div class="v421-tv-portrait-row">'+portraitCards+'</div>')+
   tvRail('Lo más visto','Selección destacada de Liga TV',popularCards||'<div class="v412-empty">El contenido destacado aparecerá aquí.</div>')+
   tvRail('Resúmenes más recientes','Últimos partidos con resultado oficial',latestCards||'<div class="v412-empty">Aún no hay resúmenes disponibles.</div>',more);
}
function tvWatchMarkup(){
 const src=streams(),list=fixtures().slice(0,20);
 return '<div class="v412-tv-subhead"><button data-v412-tv-mode="home">←</button><span><b>Televisados</b><small>Fuentes vinculadas por partido</small></span></div>'+
   '<div class="v412-watch-tabs"><button>HOY</button><button class="is-active">PARTIDOS</button><button>PRÓXIMOS</button></div>'+
   '<div class="v412-televised-list">'+(list.length?list.map(m=>{const s=src.find(x=>x.key===m.key);return '<article class="v412-televised-card"><header><span>'+esc(m.category)+'</span><em>'+esc(timeLabel(m.stamp,m.rawDate))+'</em></header><div><span><img src="'+esc(logo(m.home))+'" alt=""><b>'+esc(m.home)+'</b></span><strong>'+esc(m.hs!==''?m.hs+' - '+m.as:'VS')+'</strong><span><img src="'+esc(logo(m.away))+'" alt=""><b>'+esc(m.away)+'</b></span></div>'+(s?'<button class="v412-provider-btn" data-v412-url="'+esc(s.url)+'">TV · '+esc(s.provider)+' · VER</button>':'<small>Sin transmisión vinculada</small>')+'</article>'}).join(''):'<div class="v412-empty">No hay partidos oficiales disponibles.</div>')+'</div>';
}
function tvCastMarkup(){
 const src=streams();
 return '<div class="v412-tv-subhead"><button data-v412-tv-mode="home">←</button><span><b>Conectar o transmitir</b><small>Herramienta externa a Match Center</small></span></div>'+
   '<section class="v412-cast-panel"><h3>Conectar o transmitir</h3><div class="v412-cast-login"><span><b>Ver con Liga TV</b><small>Abre una vista para pantalla o TV.</small></span><button data-v412-tvpanel>Entrar</button></div>'+
   '<div class="v412-cast-row"><span>▣</span><span><b>Transmitir a otro dispositivo</b><small>Comparte esta app o usa las opciones disponibles de tu navegador/TV.</small></span><button data-v412-share>›</button></div>'+
   '<div class="v412-cast-row"><span>i</span><span><b>Transmisiones vinculadas</b><small>'+src.length+' fuente'+(src.length===1?'':'s')+' guardada'+(src.length===1?'':'s')+'.</small></span><button data-v412-tv-mode="watch">›</button></div></section>';
}
function tvMarkup(){
 const mode=localStorage.getItem('v412-tv-mode')||'home';
 return '<section class="v412-shell v412-tv-reference" data-v412-screen="tv" data-mode="'+esc(mode)+'">'+(mode==='watch'?tvWatchMarkup():mode==='cast'?tvCastMarkup():tvHomeMarkup())+'</section>';
}
function bindTv(root){
 root.querySelectorAll('[data-v412-tv-mode]').forEach(b=>b.onclick=()=>{localStorage.setItem('v412-tv-mode',b.dataset.v412TvMode);const screen=document.querySelector('#screen');root.remove();mountTv(screen)});
 bindCommon(root);
}
function mountTv(screen){if(screen.querySelector('[data-v412-screen="tv"]'))return;screen.insertAdjacentHTML('beforeend',tvMarkup());bindTv(screen.querySelector('[data-v412-screen="tv"]'))}

/* Match Center — sólo información del partido */
function currentMatch(){
 const root=document.querySelector('[data-v92-matchcenter]');if(!root)return null;
 const sides=[...root.querySelectorAll('.v92-score-card .v92-side')];if(sides.length<2)return null;
 const side=s=>({name:s.querySelector('b')?.textContent?.trim()||'Equipo',logo:s.querySelector('img')?.src||''});
 return {root,home:side(sides[0]),away:side(sides[1]),status:root.querySelector('.v92-center strong')?.textContent?.trim()||'VS',sub:root.querySelector('.v92-center small')?.textContent?.trim()||'',meta:[...root.querySelectorAll('.v92-official-meta span')].map(x=>x.textContent.trim()),category:(root.querySelector('.v92-match-head p')?.textContent||'').split('·')[1]?.trim()||''};
}
function standingFor(name,category){
 const cats=Object.values(data().categories||{});let cat=cats.find(x=>category&&norm(x?.name)===norm(category));
 if(!cat)cat=cats.find(x=>(x?.standings?.[0]?.rows||[]).some(r=>norm(r?.[1])===norm(name)));
 return (cat?.standings?.[0]?.rows||[]).find(r=>norm(r?.[1])===norm(name))||null;
}
function mcLogo(t){const u=t.logo||logo(t.name);return '<span class="v412-mc-logo"><img src="'+esc(u)+'" alt=""><i>'+esc(initials(t.name))+'</i></span>'}
function mcMetric(label,h,a){return '<div class="v412-mc-metric"><b>'+esc(h??'—')+'</b><span>'+esc(label)+'</span><b>'+esc(a??'—')+'</b></div>'}
function mcForm(r){if(!r)return '<div class="v412-mc-formdots"><i></i><i></i><i></i><i></i><i></i></div>';const pj=+r[2]||0,w=+r[3]||0,d=+r[4]||0,l=Number.isFinite(+r[5])?+r[5]:Math.max(0,pj-w-d);let a=[...Array(Math.min(w,5)).fill('w'),...Array(Math.min(d,5)).fill('d'),...Array(Math.min(l,5)).fill('l')].slice(0,5);while(a.length<5)a.push('');return '<div class="v412-mc-formdots">'+a.map(x=>'<i class="'+x+'"></i>').join('')+'</div>'}
function matchCenterMarkup(){
 const m=currentMatch();if(!m)return '';
 const h=standingFor(m.home.name,m.category),a=standingFor(m.away.name,m.category);
 return '<section class="v412-shell v412-matchcenter-reference" data-v412-screen="matchcenter">'+
   '<div class="v412-mc-hero"><div class="v412-mc-top"><small>'+esc(m.category||'Liga Juventino Rosas')+'</small><b>'+esc(m.meta[0]||'Partido oficial')+'</b></div><div class="v412-mc-score"><span>'+mcLogo(m.home)+'<b>'+esc(m.home.name)+'</b></span><strong>'+esc(m.status)+'</strong><span>'+mcLogo(m.away)+'<b>'+esc(m.away.name)+'</b></span></div><em>'+esc(m.sub||m.meta[1]||'')+'</em></div>'+
   '<div class="v412-mc-tabs"><button class="is-active" data-v412-native-tab="Resumen">Build Up</button><button data-v412-go="predictor">Predicciones</button><button data-v412-commentary>Comentarios</button><button data-v412-native-tab="Alineaciones">Alineaciones</button><button data-v412-native-tab="Estadísticas">Estadísticas</button><button data-v412-native-tab="Cronología">Cronología</button></div>'+
   '<section class="v412-mc-card"><h3>Comparación de temporada</h3><div class="v412-mc-pair"><span>'+mcLogo(m.home)+'<b>'+esc(m.home.name)+'</b></span><span>'+mcLogo(m.away)+'<b>'+esc(m.away.name)+'</b></span></div>'+mcMetric('Partidos',h?.[2],a?.[2])+mcMetric('Ganados',h?.[3],a?.[3])+mcMetric('Empates',h?.[4],a?.[4])+mcMetric('Puntos',h?.[9],a?.[9])+'</section>'+
   '<section class="v412-mc-card"><h3>Balance de temporada</h3><div class="v412-mc-formpair"><div>'+mcLogo(m.home)+mcForm(h)+'</div><div>'+mcLogo(m.away)+mcForm(a)+'</div></div></section>'+
   '<div class="v412-mc-actions"><button data-v412-go="matchday"><span>◷</span><b>Cronómetro</b><small>45 + descanso + 45</small></button><button data-v412-native-tab="Alineaciones"><span>▦</span><b>Alineaciones</b><small>Plantillas y formación</small></button><button data-v412-native-tab="Estadísticas"><span>▥</span><b>Estadísticas</b><small>Datos oficiales</small></button><button data-v412-native-tab="Cronología"><span>☷</span><b>Cronología</b><small>Eventos del partido</small></button></div>'+
 '</section>';
}
function openCommentary(){
 document.querySelector('.v412-comment-modal')?.remove();let note='';try{note=localStorage.getItem('v412-match-commentary')||''}catch(_){}
 const m=document.createElement('div');m.className='v412-comment-modal';m.innerHTML='<section><button data-v412-close>×</button><h3>Comentarios del partido</h3><p>Notas locales. No cambian resultados ni datos oficiales.</p><textarea placeholder="Escribe una nota...">'+esc(note)+'</textarea><button data-v412-save>Guardar</button></section>';document.body.appendChild(m);
 m.querySelector('[data-v412-close]').onclick=()=>m.remove();m.querySelector('[data-v412-save]').onclick=()=>{try{localStorage.setItem('v412-match-commentary',m.querySelector('textarea').value||'')}catch(_){};m.remove()};
}
function bindMatchCenter(root){
 root.querySelectorAll('[data-v412-native-tab]').forEach(b=>b.onclick=()=>{const label=b.dataset.v412NativeTab;const native=[...document.querySelectorAll('[data-v92-tab]')].find(x=>norm(x.dataset.v92Tab||x.textContent)===norm(label));if(native){native.click();setTimeout(()=>native.scrollIntoView({behavior:'smooth',block:'center'}),80)}});
 root.querySelector('[data-v412-commentary]')?.addEventListener('click',openCommentary);bindCommon(root);
}
function mountMatchCenter(screen){if(screen.querySelector('[data-v412-screen="matchcenter"]'))return;const html=matchCenterMarkup();if(!html)return;screen.insertAdjacentHTML('beforeend',html);bindMatchCenter(screen.querySelector('[data-v412-screen="matchcenter"]'))}

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
 root.querySelectorAll('[data-v412-tvpanel]').forEach(b=>b.onclick=()=>{if(window.LJR_V105?.openTv)window.LJR_V105.openTv();else go('video')});
 root.querySelectorAll('[data-v412-share]').forEach(b=>b.onclick=async()=>{const payload={title:'Liga Juventino Rosas',text:'Liga Municipal de Fútbol Juventino Rosas',url:location.origin+location.pathname};try{if(navigator.share)await navigator.share(payload);else await navigator.clipboard?.writeText(payload.url)}catch(_){}});
}
function remountCurrent(){const screen=document.querySelector('#screen');if(!screen)return;const r=route();if(r==='favorites'){screen.querySelector('[data-v412-screen="favorites"]')?.remove();return}else if(r==='search'){screen.querySelector('[data-v412-screen="search"]')?.remove();mountSearch(screen)}else if(r==='transfers'){screen.querySelector('[data-v412-screen="transfers"]')?.remove();mountTransfers(screen)}else if(r==='video'){screen.querySelector('[data-v412-screen="tv"]')?.remove();mountTv(screen)}else if(['v4-calendar','calendar','monthlyCalendar','calendarMonthly','matchday','competition'].includes(r))mountFixtures(screen,true)}
function cleanOld(screen){screen.querySelectorAll('.v411-zone').forEach(x=>x.remove())}
function mount(){
 const screen=document.querySelector('#screen');if(!screen)return;cleanOld(screen);
 const r=route();
 if(r==='favorites'){screen.querySelectorAll('[data-v412-screen="favorites"]').forEach(x=>x.remove());return}
 else if(r==='search')mountSearch(screen);
 else if(r==='transfers')mountTransfers(screen);
 else if(r==='more')mountAccount(screen);
 else if(r==='video')mountTv(screen);
 else if(r==='news')mountNews(screen);
 else if(r==='whereToWatch'){screen.querySelectorAll('[data-v412-screen="where"]').forEach(x=>x.remove());return}
 else if(['v4-matchcenter','matchCenter','match-center','match'].includes(r))mountMatchCenter(screen);
 else if(['v4-calendar','calendar','monthlyCalendar','calendarMonthly','matchday','competition'].includes(r))mountFixtures(screen);
}
let timer=0;function schedule(ms=70){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(60));window.addEventListener('load',()=>schedule(180));document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
const s=document.querySelector('#screen');if(s)new MutationObserver(()=>schedule(80)).observe(s,{childList:true,subtree:true});
schedule(100);setTimeout(mount,600);setTimeout(mount,1400);
})();