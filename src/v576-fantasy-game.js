/* V576 — Fantasy Football: acceso + constructor de 15 jugadores.
   Adaptado a Liga Juventino Rosas usando jugadores/equipos disponibles en los datos oficiales. */
(function(){
'use strict';
if(window.__LJR_V576_FANTASY_GAME__)return;
window.__LJR_V576_FANTASY_GAME__=true;

const KEY='v576-fantasy-squad',BUDGET=100,AUTH_RETURN_KEY='ljr-auth-return-v569';
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LEAGUE_LOGO=RAW+'assets/liga-logo.webp';
const SLOTS=[
{id:0,pos:'DEL'},{id:1,pos:'DEL'},{id:2,pos:'DEL'},
{id:3,pos:'CEN'},{id:4,pos:'CEN'},{id:5,pos:'CEN'},{id:6,pos:'CEN'},{id:7,pos:'CEN'},
{id:8,pos:'DEF'},{id:9,pos:'DEF'},{id:10,pos:'DEF'},{id:11,pos:'DEF'},{id:12,pos:'DEF'},
{id:13,pos:'POR'},{id:14,pos:'POR'}];
let raf=0,targetSlot=0,query='',matchesRound='';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const db=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};
const teamLogo=name=>{try{const v=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||LEAGUE_LOGO;return /^https?:/i.test(String(v))?String(v):RAW+String(v).replace(/^\.\//,'')}catch(_){return LEAGUE_LOGO}};
const fantasyLoggedIn=()=>{try{const s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');if(s?.user)return true;const a=JSON.parse(localStorage.getItem('ljr-auth-v569')||'{}');return !!a?.currentId}catch(_){return false}};
const goFantasyLogin=()=>{try{localStorage.setItem(AUTH_RETURN_KEY,'fantasyTeam')}catch(_){};location.hash='#/accountLogin'};

function readSquad(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.filter(Boolean).slice(0,15):[]}catch(_){return []}}
function writeSquad(x){localStorage.setItem(KEY,JSON.stringify((x||[]).filter(Boolean).slice(0,15)))}
function key(p){return [p.cat,p.team,norm(p.name)].join('|')}
function pos(v){
 const n=norm(v);
 if(/portero|arquero|guardameta|goalkeeper/.test(n))return'POR';
 if(/defensa|defensor|lateral|central/.test(n))return'DEF';
 if(/medio|mediocamp|volante|centro/.test(n))return'CEN';
 if(/delantero|atacante|extremo|punta/.test(n))return'DEL';
 return'ANY';
}
function photo(o){
 for(const k of ['photo','photo_url','image','image_url','foto','foto_url']){const v=o?.[k];if(typeof v==='string'&&v.trim())return v.trim()}
 return'';
}
function cost(p){let h=0,s=key(p);for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return +(4+(h%9)*.5).toFixed(1)}
function allPlayers(){
 const out=[],seen=new Set();
 Object.entries(db()?.categories||{}).forEach(([cid,c])=>{
  Object.entries(c?.player_profiles||{}).forEach(([team,rows])=>{
   (Array.isArray(rows)?rows:[]).forEach(raw=>{
    const o=typeof raw==='string'?{name:raw}:raw||{},name=String(o.name||o.player||o.jugador||'').trim();if(!name)return;
    const p={cat:String(cid),category:c?.name||'',team:String(team),name,position:String(o.position||o.posicion||''),photo:photo(o)};
    p.group=pos(p.position);p.cost=cost(p);const k=key(p);if(!seen.has(k)){seen.add(k);out.push(p)}
   });
  });
  Object.entries(c?.rosters||{}).forEach(([team,raw])=>{
   const rows=Array.isArray(raw)?raw:(raw?.rows||raw?.players||[]);
   (Array.isArray(rows)?rows:[]).forEach(x=>{
    const o=typeof x==='string'?{name:x}:x||{},name=String(o.name||o.player||o.jugador||'').trim();if(!name)return;
    const p={cat:String(cid),category:c?.name||'',team:String(team),name,position:String(o.position||o.posicion||''),photo:photo(o)};
    p.group=pos(p.position);p.cost=cost(p);const k=key(p);if(!seen.has(k)){seen.add(k);out.push(p)}
   });
  });
 });
 return out.sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
}
function money(n){const v=Number(n||0).toFixed(1).replace('.0','');return '$'+v+' M'}
function total(){return readSquad().reduce((n,x)=>n+Number(x.cost||0),0)}
function art(p){
 if(p.photo)return'<img class="v576-player-photo" src="'+esc(p.photo)+'" alt="" loading="lazy">';
 return'<img class="v576-player-crest" src="'+esc(teamLogo(p.team))+'" alt="" loading="lazy">';
}
function kitPalette(name){
 const palettes=[
  ['#c71f2d','#8d111e','#ffffff'],
  ['#123bb8','#071d7a','#ef3340'],
  ['#f1c232','#d39b00','#121212'],
  ['#f5f6f8','#cfd5df','#173b8f'],
  ['#0f9c6c','#08694b','#ffffff'],
  ['#6b1f7a','#3a0d48','#f2c14e'],
  ['#171717','#060606','#2d6cdf']
 ];
 let h=0;const s=norm(name||'liga');
 for(let i=0;i<s.length;i++)h=(h*33+s.charCodeAt(i))>>>0;
 return palettes[h%palettes.length];
}
function kitSvg(p,empty=false){
 const logo=empty?'':teamLogo(p?.team||'');
 const [a,b,accent]=empty?['#2b8fa2','#0e6578','#9ad6df']:kitPalette(p?.team||p?.name||'');
 const id='v594kit'+Math.abs((norm((p?.team||'')+(p?.name||'')).split('').reduce((n,ch)=>(n*31+ch.charCodeAt(0))>>>0,7))).toString(36);
 const op=empty?'.58':'1';
 return '<svg class="v590-kit-svg v594-jersey-3d" viewBox="0 0 220 260" aria-hidden="true">'+
  '<defs>'+
   '<linearGradient id="'+id+'body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset=".45" stop-color="'+b+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient>'+
   '<linearGradient id="'+id+'left" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></linearGradient>'+
   '<linearGradient id="'+id+'right" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".33"/></linearGradient>'+
   '<pattern id="'+id+'mesh" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0h1v1H0zM4 3h1v1H4z" fill="#fff" opacity="'+(empty?'.03':'.085')+'"/></pattern>'+
   '<filter id="'+id+'shadow" x="-45%" y="-35%" width="190%" height="210%"><feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#022b39" flood-opacity="'+(empty?'.18':'.45')+'"/></filter>'+
   '<filter id="'+id+'floor" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>'+
  '</defs>'+
  '<ellipse cx="112" cy="242" rx="58" ry="10" fill="#063d4b" opacity="'+(empty?'.10':'.30')+'" filter="url(#'+id+'floor)"/>'+
  '<g class="v594-back" opacity="'+(empty?'.24':'.68')+'" transform="translate(7 7)">'+
   '<path d="M66 29 90 16c8 9 15 13 24 13s16-4 24-13l24 13 41 20-19 49-28-13v158H72V85L44 98 25 49l41-20Z" fill="'+b+'"/>'+
  '</g>'+
  '<g filter="url(#'+id+'shadow)" opacity="'+op+'">'+
   '<path d="M62 25 86 12c8 9 15 13 24 13s16-4 24-13l24 13 41 20-19 49-28-13v158H68V81L40 94 21 45l41-20Z" fill="url(#'+id+'body)"/>'+
   '<path d="M62 25 86 12c8 9 15 13 24 13s16-4 24-13l24 13 41 20-19 49-28-13v158H68V81L40 94 21 45l41-20Z" fill="url(#'+id+'mesh)"/>'+
   '<path d="M62 25 86 12v221H68V81L40 94 21 45l41-20Z" fill="url(#'+id+'left)"/>'+
   '<path d="M134 12 158 25l41 20-19 49-28-13v152h-42V12c1.5.2 2.8.2 4 0Z" fill="url(#'+id+'right)"/>'+
   '<path d="M87 12c3 16 12 24 23 24s20-8 23-24" fill="none" stroke="'+accent+'" stroke-width="6.5" stroke-linecap="round"/>'+
   '<path d="M88 12c4 10 12 16 22 16s18-6 22-16" fill="none" stroke="#fff" stroke-opacity="'+(empty?'.18':'.68')+'" stroke-width="2.2"/>'+
   '<path d="M68 81 55 70M152 81l13-11" stroke="'+accent+'" stroke-width="3.2" stroke-opacity="'+(empty?'.32':'.82')+'"/>'+
   '<path d="M70 231h80" stroke="#fff" stroke-width="2" stroke-opacity="'+(empty?'.10':'.30')+'"/>'+
   '<path d="M75 60c17 7 53 7 70 0" stroke="#fff" stroke-width="18" stroke-linecap="round" stroke-opacity="'+(empty?'.02':'.08')+'"/>'+
   '<path d="M78 86c12 13 17 29 19 49M142 86c-12 13-17 29-19 49M89 169c7 7 35 7 42 0M84 201c10 7 42 7 52 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-opacity="'+(empty?'.025':'.13')+'"/>'+
  '</g>'+
  (logo?'<image href="'+esc(logo)+'" x="96" y="72" width="28" height="28" preserveAspectRatio="xMidYMid meet"/>':'')+
 '</svg>';
}
function slotHtml(s,p){
 if(!p)return'<button type="button" class="v576-slot empty" data-v576-slot="'+s.id+'"><span class="v576-shirt v590-kit-wrap empty-kit">'+kitSvg(null,true)+'<i>+</i></span><b>'+s.pos+'</b></button>';
 return'<button type="button" class="v576-slot filled" data-v576-slot="'+s.id+'"><span class="v576-shirt chosen v590-kit-wrap">'+kitSvg(p,false)+'<i class="remove" data-v576-remove="'+s.id+'">×</i></span><b>'+esc(p.name)+'</b><small>'+money(p.cost)+'</small></button>';
}
function fieldRow(position,map){
 return'<div class="v576-field-row '+position.toLowerCase()+'">'+SLOTS.filter(s=>s.pos===position).map(s=>slotHtml(s,map.get(s.id))).join('')+'</div>';
}
function builderMarkup(){
 const squad=readSquad(),map=new Map(squad.map(x=>[Number(x.slot),x])),count=map.size,left=Math.max(0,BUDGET-total());
 return'<section class="v576-builder v587-builder" data-v576-builder data-v590-count="'+count+'" style="--v590-progress:'+Math.round((count/15)*100)+'%">'+
 '<header class="v576-builder-head"><button type="button" data-v576-back aria-label="Volver">←</button><h1>Elige tu equipo</h1><button type="button" data-v576-menu aria-label="Menú">⋮</button></header>'+
 '<div class="v576-builder-summary"><div><small>Jugadores</small><b>'+count+'/15</b></div><div><small>Restante <i>?</i></small><b>'+money(left)+'</b></div><button type="button" data-v576-auto><span class="v590-wand" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20 14.7 9.3M13.8 4.4l.8-2.2.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2ZM18.2 10.7l.6-1.6.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z"/></svg></span> Autocompletar</button></div>'+

 '<div class="v576-field">'+
   '<div class="v587-pitch-lines" aria-hidden="true"><i class="v587-half"></i><i class="v587-center"></i><i class="v587-box v587-box-top"></i><i class="v587-box v587-box-bottom"></i></div>'+
   fieldRow('DEL',map)+fieldRow('CEN',map)+fieldRow('DEF',map)+fieldRow('POR',map)+
   (count===0?'<div class="v576-first-hint">Elige tu primer jugador</div>':'')+
   '<button type="button" class="v587-filter-pill" data-v576-search aria-label="Buscar y filtrar jugadores"><span class="v590-filter-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 6h14M8 12h8M10 18h4"/></svg></span><i></i><b>$</b></button>'+
   '<div class="v576-builder-actions"><button type="button" data-v576-search class="'+(count===15?'ready':'')+'">'+(count===15?'Continuar':'Buscar jugadores')+'</button></div>'+
 '</div>'+
 '<footer>CONSEJO: Autocompleta tu plantilla y afínala antes del primer partido</footer></section>';
}
function accessTeams(){
 const a=[];Object.values(db()?.categories||{}).some(c=>{Object.keys(c?.rosters||{}).forEach(n=>{if(a.length<3&&!a.includes(n))a.push(n)});return a.length>=3});
 while(a.length<3)a.push('Liga Juventino Rosas');return a;
}
function accessMarkup(){
 return'<section class="v576-access-more" data-v576-access-more>'+
 '<div class="v576-more-kicker">JUEGA FANTASY</div>'+

 '<div class="v576-access-copy"><h2>Elige tu equipo</h2><p>Arma tu plantilla con 15 jugadores registrados de la Liga Juventino Rosas. Tienes $100 M MXN de presupuesto Fantasy.</p></div>'+
 '<div class="v576-feature-grid"><article><b>15</b><span>Jugadores</span></article><article><b>$100 M</b><span>Presupuesto</span></article><article><b>4</b><span>Posiciones</span></article></div>'+
 '<div class="v576-access-actions"><button type="button" data-v576-guest>Prueba como invitado</button><button type="button" data-v576-open-team>Elige tu equipo</button></div>'+
 '<section class="v581-fantasy-tools" aria-label="Herramientas Fantasy">'+
   '<h3>Más Fantasy</h3>'+
   '<div class="v581-tool-grid">'+
     '<button type="button" data-v576-open-team><i>♟</i><span><b>Mi equipo</b><small>Edita tus 15 jugadores</small></span><strong>›</strong></button>'+
     '<button type="button" data-v576-matches><i>▣</i><span><b>Partidos</b><small>Consulta la competición</small></span><strong>›</strong></button>'+
     '<button type="button" data-v576-help="points"><i>★</i><span><b>Cómo conseguir puntos</b><small>Goles, tarjetas y rendimiento</small></span><strong>›</strong></button>'+
     '<button type="button" data-v576-help="rules"><i>ⓘ</i><span><b>Reglas</b><small>Presupuesto y posiciones</small></span><strong>›</strong></button>'+
   '</div>'+
 '</section>'+
 '<section class="v583-quick-build" aria-label="Acciones rápidas Fantasy">'+
   '<div><span>PLANTILLA RÁPIDA</span><h3>Empieza a jugar</h3><p>Puedes autocompletar los 15 lugares o buscar jugador por jugador.</p></div>'+
   '<div class="v583-quick-actions"><button type="button" data-v576-auto>✣ Autocompletar</button><button type="button" data-v576-search>Buscar jugadores</button></div>'+
   '<ol><li><b>1</b><span>Elige jugadores registrados</span></li><li><b>2</b><span>Respeta los $100 M MXN de presupuesto</span></li><li><b>3</b><span>Guarda y ajusta tu equipo</span></li></ol>'+
 '</section>'+
 '</section>';
}
function closeLayer(){document.querySelectorAll('[data-v576-layer]').forEach(x=>x.remove())}
function layer(html,cls=''){closeLayer();const d=document.createElement('div');d.className='v576-layer '+cls;d.dataset.v576Layer='';d.innerHTML='<button type="button" class="v576-backdrop" data-v576-close aria-label="Cerrar"></button>'+html;document.body.appendChild(d)}
function guest(){
 layer('<section class="v576-login-sheet"><button class="v576-x" type="button" data-v576-close>×</button><h2>¿Sigues sin iniciar sesión?</h2><p>Una vez que crees tu equipo, iniciar sesión te permite:</p><ul><li>⚽ <span>Actualizar tu equipo desde cualquier dispositivo</span></li><li>⚽ <span>Volver a unirte a tus ligas favoritas</span></li><li>⚽ <span>Recibir notificaciones personalizadas</span></li></ul><button class="primary" type="button" data-v576-login>Inicia sesión para jugar</button><button class="later" type="button" data-v576-later>Entraré luego</button></section>','login');
}
function menu(){
 layer('<section class="v576-menu-sheet"><button type="button" data-v576-reset>Reiniciar equipo</button><button type="button" data-v576-help="points">Cómo conseguir puntos</button><button type="button" data-v576-help="rules">Reglas</button><button type="button" data-v576-matches>Partidos</button></section>','menu');
}

function fantasyCategory(){
 const d=db(),wanted=String(localStorage.getItem('v62-category')||'3');
 if(d?.categories?.[wanted])return [wanted,d.categories[wanted]];
 const hit=Object.entries(d?.categories||{}).find(([,cat])=>(cat?.fixtures||[]).some(b=>(b?.rows||[]).some(r=>Array.isArray(r)&&r[2]&&r[6])));
 return hit||['',null];
}
function fantasyFixtures(){
 const [cid,cat]=fantasyCategory(),out=[];
 (cat?.fixtures||[]).forEach((block,bi)=>(block?.rows||[]).forEach((r,ri)=>{
  if(!Array.isArray(r)||!r[2]||!r[6])return;
  out.push({cid,category:String(cat?.name||''),round:String(r[1]||bi+1),home:String(r[2]||''),away:String(r[6]||''),date:String(r[8]||''),field:String(r[7]||''),scoreHome:String(r[3]??''),scoreAway:String(r[5]??'')});
 }));
 return out;
}
function fantasyDateParts(raw){
 const s=String(raw||'').trim();
 const tm=s.match(/(?:^|\s)(\d{1,2}:\d{2})(?:\s|$)/);
 const time=tm?.[1]||'Por confirmar';
 let date=s.replace(tm?.[0]||'',' ').replace(/\s+/g,' ').trim();
 if(!date)date='Fecha por confirmar';
 const dm=s.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
 if(dm){
  const months=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  date=Number(dm[1])+' '+months[Math.max(0,Math.min(11,Number(dm[2])-1))];
 }
 return {date,time};
}
function matchesMarkup(){
 const rows=fantasyFixtures(),rounds=[...new Set(rows.map(x=>x.round).filter(Boolean))];
 if(!matchesRound||!rounds.includes(matchesRound))matchesRound=rounds[0]||'1';
 const active=rows.filter(x=>x.round===matchesRound),first=active[0],dp=fantasyDateParts(first?.date||'');
 const deadline=first?('Fichajes ilimitados hasta '+dp.date+(dp.time!=='Por confirmar'?', '+dp.time:'')):'Fichajes ilimitados hasta el primer partido';
 return '<section class="v592-matches-sheet">'+
   '<button type="button" class="v592-close" data-v576-close aria-label="Cerrar">×</button>'+
   '<h2>Partidos</h2>'+
   '<div class="v592-round-tabs">'+rounds.map(r=>'<button type="button" class="'+(r===matchesRound?'active':'')+'" data-v592-round="'+esc(r)+'">Jornada '+esc(r)+'</button>').join('')+'</div>'+
   '<div class="v592-deadline"><b>↔</b><span>'+esc(deadline)+'</span></div>'+
   '<div class="v592-date">'+esc(dp.date)+'</div>'+
   '<div class="v592-match-list">'+
     (active.length?active.map(m=>{
       const p=fantasyDateParts(m.date),played=/^\d+$/.test(m.scoreHome)&&/^\d+$/.test(m.scoreAway);
       const center=played?esc(m.scoreHome+' - '+m.scoreAway):esc(p.time);
       return '<article class="v592-match-row">'+
         '<span class="v592-team home"><b>'+esc(m.home)+'</b><img src="'+esc(teamLogo(m.home))+'" alt="" loading="lazy"></span>'+
         '<strong>'+center+'</strong>'+
         '<span class="v592-team away"><img src="'+esc(teamLogo(m.away))+'" alt="" loading="lazy"><b>'+esc(m.away)+'</b></span>'+
       '</article>';
     }).join(''):'<div class="v592-empty">No hay partidos publicados para esta jornada.</div>')+
   '</div>'+
 '</section>';
}
function matches(){
 layer(matchesMarkup(),'matches');
}
function help(kind){
 const points=kind==='points';
 layer('<section class="v576-info-sheet"><header><h2>'+(points?'Cómo conseguir puntos':'Reglas Fantasy')+'</h2><button type="button" data-v576-close>×</button></header>'+
 (points?'<p>Los puntos se apoyan en estadísticas publicadas por la Liga; lo que no esté publicado no se inventa.</p><div><b>Goles y participación</b><span>Se aplicarán cuando estén disponibles en los datos oficiales.</span></div><div><b>Tarjetas</b><span>Las amarillas y rojas publicadas pueden afectar la puntuación.</span></div>':'<p>Arma una plantilla de 15 jugadores con un presupuesto Fantasy de $100 M MXN.</p><div><b>Plantilla</b><span>3 delanteros, 5 mediocampistas, 5 defensas y 2 porteros.</span></div><div><b>Jugadores</b><span>Solo aparecen registros disponibles de la Liga Juventino Rosas.</span></div>')+
 '</section>','info');
}
function picker(slotId){
 targetSlot=Number(slotId)||0;
 const slot=SLOTS.find(s=>s.id===targetSlot)||SLOTS[0];
 layer('<section class="v576-picker"><header><button type="button" data-v576-close>‹</button><span><small>ELIGE JUGADOR</small><b>'+slot.pos+'</b></span></header><label><span>⌕</span><input type="search" data-v576-query placeholder="Buscar jugador o equipo" value="'+esc(query)+'"></label><div class="v576-picker-list" data-v576-picker-list></div></section>','picker');
 renderPicker();
}
function renderPicker(){
 const host=document.querySelector('[data-v576-picker-list]');if(!host)return;
 const slot=SLOTS.find(s=>s.id===targetSlot)||SLOTS[0],used=new Set(readSquad().map(key)),needle=norm(query);
 const rows=allPlayers().filter(p=>(p.group==='ANY'||p.group===slot.pos)&&!used.has(key(p))&&(!needle||norm(p.name+' '+p.team+' '+p.position).includes(needle))).slice(0,90);
 host.innerHTML=rows.length?rows.map(p=>'<button type="button" class="v576-player-row" data-v576-pick="'+esc(encodeURIComponent(JSON.stringify(p)))+'"><span class="v576-pick-art">'+art(p)+'</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+(p.position?' · '+esc(p.position):'')+'</small></span><strong>'+money(p.cost)+'</strong></button>').join(''):'<div class="v576-empty">No hay jugadores disponibles con este filtro.</div>';
}
function add(p){
 const rows=readSquad().filter(x=>Number(x.slot)!==targetSlot&&key(x)!==key(p));
 if(rows.reduce((n,x)=>n+Number(x.cost||0),0)+p.cost>BUDGET){toast('Ese jugador supera el presupuesto disponible');return}
 rows.push({...p,slot:targetSlot});writeSquad(rows);closeLayer();render();
}
function auto(){
 const rows=readSquad(),filled=new Map(rows.map(x=>[Number(x.slot),x])),used=new Set(rows.map(key)),pool=allPlayers();let spent=rows.reduce((n,x)=>n+Number(x.cost||0),0);
 for(const s of SLOTS){if(filled.has(s.id))continue;const p=pool.filter(x=>!used.has(key(x))&&(x.group==='ANY'||x.group===s.pos)&&spent+x.cost<=BUDGET).sort((a,b)=>a.cost-b.cost)[0];if(!p)continue;rows.push({...p,slot:s.id});used.add(key(p));spent+=p.cost}
 writeSquad(rows);render();toast(rows.length===15?'Plantilla completada':'Se agregaron los jugadores disponibles');
}
function summary(){
 const rows=readSquad().sort((a,b)=>Number(a.slot)-Number(b.slot));
 layer('<section class="v576-info-sheet summary"><header><h2>Tu equipo Fantasy</h2><button type="button" data-v576-close>×</button></header><p><b>'+rows.length+'/15 jugadores</b> · '+money(total())+' usados de $100 M MXN.</p><div class="v576-summary-list">'+rows.map(p=>'<span><b>'+esc(SLOTS.find(s=>s.id===Number(p.slot))?.pos||'')+'</b>'+esc(p.name)+'<small>'+esc(p.team)+'</small></span>').join('')+'</div><button class="primary" type="button" data-v576-close>Guardar equipo</button></section>','info');
}
function toast(msg){document.querySelector('.v576-toast')?.remove();const d=document.createElement('div');d.className='v576-toast';d.textContent=msg;document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('show'));setTimeout(()=>d.remove(),2200)}
function render(){
 const r=route(),screen=document.querySelector('#screen');if(!screen)return;
 const teamOpen=r==='fantasyTeam';
 document.body.classList.toggle('v587-fantasy-team-open',teamOpen);
 const nav=document.querySelector('.bottom-nav');
 if(nav){
   if(teamOpen)nav.style.setProperty('display','none','important');
   else nav.style.removeProperty('display');
 }
 if(r==='fantasyAccess'){
   screen.querySelectorAll('[data-v576-access-more]').forEach(x=>x.remove());
 }
 if(teamOpen)screen.innerHTML=builderMarkup();
}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(render))}

document.addEventListener('click',e=>{
 const el=e.target instanceof Element?e.target:null;if(!el)return;
 if(el.closest('[data-v576-close]')){e.preventDefault();closeLayer();return}
 if(el.closest('[data-v576-login]')){e.preventDefault();closeLayer();if(fantasyLoggedIn())location.hash='#/fantasyTeam';else goFantasyLogin();return}
 if(el.closest('[data-v576-guest]')){e.preventDefault();guest();return}
 if(el.closest('[data-v576-open-team]')){e.preventDefault();if(fantasyLoggedIn())location.hash='#/fantasyTeam';else guest();return}
 if(el.closest('[data-v576-later]')){e.preventDefault();closeLayer();location.hash='#/fantasyTeam';return}
 if(el.closest('[data-v576-back]')){e.preventDefault();location.hash='#/fantasyAccess';return}
 if(el.closest('[data-v576-menu]')){e.preventDefault();menu();return}
 if(el.closest('[data-v576-reset]')){e.preventDefault();writeSquad([]);closeLayer();render();toast('Equipo reiniciado');return}
 if(el.closest('[data-v576-matches]')){e.preventDefault();matches();return}
 const rd=el.closest('[data-v592-round]');if(rd){e.preventDefault();matchesRound=rd.dataset.v592Round||matchesRound;const sheet=document.querySelector('.v592-matches-sheet');if(sheet)sheet.outerHTML=matchesMarkup();return}
 const h=el.closest('[data-v576-help]');if(h){e.preventDefault();help(h.dataset.v576Help);return}
 const rm=el.closest('[data-v576-remove]');if(rm){e.preventDefault();e.stopPropagation();writeSquad(readSquad().filter(x=>Number(x.slot)!==Number(rm.dataset.v576Remove)));render();return}
 const sl=el.closest('[data-v576-slot]');if(sl){e.preventDefault();picker(sl.dataset.v576Slot);return}
 if(el.closest('[data-v576-auto]')){e.preventDefault();auto();return}
 if(el.closest('[data-v576-search]')){e.preventDefault();const x=readSquad();if(x.length===15){summary();return}const s=SLOTS.find(z=>!x.some(p=>Number(p.slot)===z.id));picker(s?.id??0);return}
 const pick=el.closest('[data-v576-pick]');if(pick){e.preventDefault();try{add(JSON.parse(decodeURIComponent(pick.dataset.v576Pick)))}catch(_){toast('No se pudo agregar el jugador')}return}
},true);
document.addEventListener('input',e=>{if(e.target?.matches?.('[data-v576-query]')){query=e.target.value||'';renderPicker()}},true);

window.LJR_V576_FANTASY={guest,openGuest:guest,openTeam:()=>{location.hash='#/fantasyTeam'},readSquad,teamLogo,samplePlayers:()=>{const a=allPlayers();return [...a.filter(p=>p.photo),...a.filter(p=>!p.photo)].slice(0,3)}};
window.addEventListener('ljr:fantasy-guest',guest);
window.addEventListener('hashchange',()=>{closeLayer();schedule()});
window.addEventListener('ljr:official-data',schedule);
const screen=document.querySelector('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
