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
let raf=0,targetSlot=0,query='';

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
function money(n){return'
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
 const [a,b,accent]=empty?['#177487','#0f6678','#7fc7cf']:kitPalette(p?.team||p?.name||'');
 const id='v590kit'+Math.abs((norm((p?.team||'')+(p?.name||'')).split('').reduce((n,ch)=>(n*31+ch.charCodeAt(0))>>>0,7))).toString(36);
 const mode=(norm(p?.team||'').length+String(p?.name||'').length)%3;
 const motif=empty?'':(mode===0
   ?'<path d="M52 20h16v92H52z" fill="'+accent+'" opacity=".22"/>'
   :mode===1
    ?'<path d="M27 73 88 26l11 17-61 47z" fill="'+accent+'" opacity=".18"/>'
    :'<path d="M28 48h64M25 69h70" stroke="'+accent+'" stroke-width="8" opacity=".15"/>');
 return '<svg class="v590-kit-svg" viewBox="0 0 120 126" aria-hidden="true">'+
  '<defs><linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient>'+
  '<filter id="'+id+'s" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#003746" flood-opacity=".24"/></filter></defs>'+
  '<g filter="url(#'+id+'s)">'+
   '<path d="M34 15 47 8c4 5 8 7 13 7s9-2 13-7l13 7 25 14-12 27-15-7v65H36V49l-15 7L9 29l25-14Z" fill="url(#'+id+'g)"/>'+
   motif+
   '<path d="M47 8c2 8 7 12 13 12s11-4 13-12" fill="none" stroke="'+accent+'" stroke-opacity=".72" stroke-width="3.5" stroke-linecap="round"/>'+
   '<path d="M36 49 27 43M84 49l9-6" stroke="'+accent+'" stroke-opacity=".45" stroke-width="2"/>'+
   '<path d="M38 109h44" stroke="#fff" stroke-opacity=".22" stroke-width="1.4"/>'+
  '</g>'+
  (logo?'<image href="'+esc(logo)+'" x="51" y="38" width="18" height="18" preserveAspectRatio="xMidYMid meet"/>':'')+
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
 layer('<section class="v576-menu-sheet"><button type="button" data-v576-reset>Reiniciar equipo</button><button type="button" data-v576-matches>Partidos</button><button type="button" data-v576-help="points">Cómo conseguir puntos</button><button type="button" data-v576-help="rules">Reglas</button></section>','menu');
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
 if(el.closest('[data-v576-matches]')){e.preventDefault();closeLayer();location.hash='#/competition';return}
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
})();+Number(n||0).toFixed(1).replace('.0','')+' M'}
function total(){return readSquad().reduce((n,x)=>n+Number(x.cost||0),0)}
function art(p){
 if(p.photo)return'<img class="v576-player-photo" src="'+esc(p.photo)+'" alt="" loading="lazy">';
 return'<img class="v576-player-crest" src="'+esc(teamLogo(p.team))+'" alt="" loading="lazy">';
}
function slotHtml(s,p){
 if(!p)return'<button type="button" class="v576-slot empty" data-v576-slot="'+s.id+'"><span class="v576-shirt"><i>+</i></span><b>'+s.pos+'</b></button>';
 return'<button type="button" class="v576-slot filled" data-v576-slot="'+s.id+'"><span class="v576-shirt chosen">'+art(p)+'<i class="remove" data-v576-remove="'+s.id+'">×</i></span><b>'+esc(p.name)+'</b><small>'+money(p.cost)+'</small></button>';
}
function fieldRow(position,map){
 return'<div class="v576-field-row '+position.toLowerCase()+'">'+SLOTS.filter(s=>s.pos===position).map(s=>slotHtml(s,map.get(s.id))).join('')+'</div>';
}
function builderMarkup(){
 const squad=readSquad(),map=new Map(squad.map(x=>[Number(x.slot),x])),count=map.size,left=Math.max(0,BUDGET-total());
 return'<section class="v576-builder v587-builder" data-v576-builder>'+
 '<header class="v576-builder-head"><button type="button" data-v576-back aria-label="Volver">‹</button><h1>Elige tu equipo</h1><button type="button" data-v576-menu aria-label="Menú">⋮</button></header>'+
 '<div class="v576-builder-summary"><div><small>Jugadores</small><b>'+count+'/15</b></div><div><small>Restante <i>?</i></small><b>'+money(left)+'</b></div><button type="button" data-v576-auto><span>✣</span> Autocompletar</button></div>'+

 '<div class="v576-field">'+
   '<div class="v587-pitch-lines" aria-hidden="true"><i class="v587-half"></i><i class="v587-center"></i><i class="v587-box v587-box-top"></i><i class="v587-box v587-box-bottom"></i></div>'+
   fieldRow('DEL',map)+fieldRow('CEN',map)+fieldRow('DEF',map)+fieldRow('POR',map)+
   (count===0?'<div class="v576-first-hint">Elige tu primer jugador</div>':'')+
   '<button type="button" class="v587-filter-pill" data-v576-search aria-label="Buscar y filtrar jugadores"><span>☰</span><i></i><b>€</b></button>'+
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

 '<div class="v576-access-copy"><h2>Elige tu equipo</h2><p>Arma tu plantilla con 15 jugadores registrados de la Liga Juventino Rosas. Tienes €100m de presupuesto Fantasy.</p></div>'+
 '<div class="v576-feature-grid"><article><b>15</b><span>Jugadores</span></article><article><b>€100m</b><span>Presupuesto</span></article><article><b>4</b><span>Posiciones</span></article></div>'+
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
   '<ol><li><b>1</b><span>Elige jugadores registrados</span></li><li><b>2</b><span>Respeta los €100m de presupuesto</span></li><li><b>3</b><span>Guarda y ajusta tu equipo</span></li></ol>'+
 '</section>'+
 '</section>';
}
function closeLayer(){document.querySelectorAll('[data-v576-layer]').forEach(x=>x.remove())}
function layer(html,cls=''){closeLayer();const d=document.createElement('div');d.className='v576-layer '+cls;d.dataset.v576Layer='';d.innerHTML='<button type="button" class="v576-backdrop" data-v576-close aria-label="Cerrar"></button>'+html;document.body.appendChild(d)}
function guest(){
 layer('<section class="v576-login-sheet"><button class="v576-x" type="button" data-v576-close>×</button><h2>¿Sigues sin iniciar sesión?</h2><p>Una vez que crees tu equipo, iniciar sesión te permite:</p><ul><li>⚽ <span>Actualizar tu equipo desde cualquier dispositivo</span></li><li>⚽ <span>Volver a unirte a tus ligas favoritas</span></li><li>⚽ <span>Recibir notificaciones personalizadas</span></li></ul><button class="primary" type="button" data-v576-login>Inicia sesión para jugar</button><button class="later" type="button" data-v576-later>Entraré luego</button></section>','login');
}
function menu(){
 layer('<section class="v576-menu-sheet"><button type="button" data-v576-reset>Reiniciar equipo</button><button type="button" data-v576-matches>Partidos</button><button type="button" data-v576-help="points">Cómo conseguir puntos</button><button type="button" data-v576-help="rules">Reglas</button></section>','menu');
}
function help(kind){
 const points=kind==='points';
 layer('<section class="v576-info-sheet"><header><h2>'+(points?'Cómo conseguir puntos':'Reglas Fantasy')+'</h2><button type="button" data-v576-close>×</button></header>'+
 (points?'<p>Los puntos se apoyan en estadísticas publicadas por la Liga; lo que no esté publicado no se inventa.</p><div><b>Goles y participación</b><span>Se aplicarán cuando estén disponibles en los datos oficiales.</span></div><div><b>Tarjetas</b><span>Las amarillas y rojas publicadas pueden afectar la puntuación.</span></div>':'<p>Arma una plantilla de 15 jugadores con un presupuesto Fantasy de 100 m.</p><div><b>Plantilla</b><span>3 delanteros, 5 mediocampistas, 5 defensas y 2 porteros.</span></div><div><b>Jugadores</b><span>Solo aparecen registros disponibles de la Liga Juventino Rosas.</span></div>')+
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
 layer('<section class="v576-info-sheet summary"><header><h2>Tu equipo Fantasy</h2><button type="button" data-v576-close>×</button></header><p><b>'+rows.length+'/15 jugadores</b> · '+money(total())+' usados de €100m.</p><div class="v576-summary-list">'+rows.map(p=>'<span><b>'+esc(SLOTS.find(s=>s.id===Number(p.slot))?.pos||'')+'</b>'+esc(p.name)+'<small>'+esc(p.team)+'</small></span>').join('')+'</div><button class="primary" type="button" data-v576-close>Guardar equipo</button></section>','info');
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
 if(el.closest('[data-v576-matches]')){e.preventDefault();closeLayer();location.hash='#/competition';return}
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