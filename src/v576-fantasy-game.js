/* V576 — Fantasy Football: acceso + constructor de 15 jugadores.
   Adaptado a Liga Juventino Rosas usando jugadores/equipos disponibles en los datos oficiales. */
(function(){
'use strict';
if(window.__LJR_V576_FANTASY_GAME__)return;
window.__LJR_V576_FANTASY_GAME__=true;

const KEY='v576-fantasy-squad',BUDGET=100;
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
const teamLogo=name=>{try{return window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||'./assets/liga-logo.webp'}catch(_){return './assets/liga-logo.webp'}};

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
function money(n){return'€'+Number(n||0).toFixed(1).replace('.0','')+'m'}
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
 return'<section class="v576-builder" data-v576-builder>'+
 '<header class="v576-builder-head"><button type="button" data-v576-back aria-label="Volver">‹</button><h1>Elige tu equipo</h1><button type="button" data-v576-menu aria-label="Menú">⋮</button></header>'+
 '<div class="v576-builder-summary"><div><small>Jugadores</small><b>'+count+'/15</b></div><div><small>Restante <i>?</i></small><b>'+money(left)+'</b></div><button type="button" data-v576-auto>✣ Autocompletar</button></div>'+
 '<div class="v576-sponsor-strip"><span>FANTASY</span><img src="./assets/liga-logo.webp" alt=""><b>LIGA JUVENTINO ROSAS</b></div>'+
 '<div class="v576-field">'+fieldRow('DEL',map)+fieldRow('CEN',map)+fieldRow('DEF',map)+fieldRow('POR',map)+'</div>'+
 '<div class="v576-builder-actions"><button type="button" data-v576-search class="'+(count===15?'ready':'')+'">'+(count===15?'Continuar':'Buscar jugadores')+'</button></div>'+
 '<footer>CONSEJO: Autocompleta tu plantilla y afínala antes del primer partido</footer></section>';
}
function accessTeams(){
 const a=[];Object.values(db()?.categories||{}).some(c=>{Object.keys(c?.rosters||{}).forEach(n=>{if(a.length<3&&!a.includes(n))a.push(n)});return a.length>=3});
 while(a.length<3)a.push('Liga Juventino Rosas');return a;
}
function accessMarkup(){
 const teams=accessTeams();
 const shirts=(n,pos)=>'<div class="v581-preview-row '+pos.toLowerCase()+'>'+Array.from({length:n},()=>'<button type="button" class="v581-preview-shirt" data-v576-open-team aria-label="Elegir '+pos+'"><span>+</span><b>'+pos+'</b></button>').join('')+'</div>';
 return'<section class="v576-access-more" data-v576-access-more>'+
 '<div class="v576-more-kicker">JUEGA FANTASY</div>'+
 '<div class="v576-fantasy-cards">'+teams.map((t,i)=>'<article class="'+(i===1?'main':'')+'"><div><img src="'+esc(teamLogo(t))+'" alt=""></div><b>'+esc(t)+'</b><small>'+(i===1?'12 pts':'9 pts')+'</small></article>').join('')+'</div>'+
 '<div class="v576-access-copy"><h2>Elige tu equipo</h2><p>Arma tu plantilla con 15 jugadores registrados de la Liga Juventino Rosas. Tienes €100m de presupuesto Fantasy.</p></div>'+
 '<div class="v576-feature-grid"><article><b>15</b><span>Jugadores</span></article><article><b>€100m</b><span>Presupuesto</span></article><article><b>4</b><span>Posiciones</span></article></div>'+
 '<div class="v576-access-actions"><button type="button" data-v576-guest>Prueba como invitado</button><button type="button" data-v576-open-team>Elige tu equipo</button></div>'+
 '<section class="v581-squad-preview" aria-label="Vista previa de plantilla Fantasy">'+
   '<div class="v581-preview-head"><div><span>TU PLANTILLA</span><h3>Arma tu 15</h3></div><button type="button" data-v576-open-team>Empezar</button></div>'+
   '<p>Toca cualquier playera para abrir el constructor y elegir jugadores de la Liga.</p>'+
   '<div class="v581-mini-pitch">'+shirts(3,'DEL')+shirts(5,'CEN')+shirts(5,'DEF')+shirts(2,'POR')+'</div>'+
 '</section>'+
 '<section class="v581-fantasy-tools" aria-label="Herramientas Fantasy">'+
   '<h3>Más Fantasy</h3>'+
   '<div class="v581-tool-grid">'+
     '<button type="button" data-v576-open-team><i>♟</i><span><b>Mi equipo</b><small>Edita tus 15 jugadores</small></span><strong>›</strong></button>'+
     '<button type="button" data-v576-matches><i>▣</i><span><b>Partidos</b><small>Consulta la competición</small></span><strong>›</strong></button>'+
     '<button type="button" data-v576-help="points"><i>★</i><span><b>Cómo conseguir puntos</b><small>Goles, tarjetas y rendimiento</small></span><strong>›</strong></button>'+
     '<button type="button" data-v576-help="rules"><i>ⓘ</i><span><b>Reglas</b><small>Presupuesto y posiciones</small></span><strong>›</strong></button>'+
   '</div>'+
 '</section>'+
 '</section>';
}
function closeLayer(){document.querySelectorAll('[data-v576-layer]').forEach(x=>x.remove())}
function layer(html,cls=''){closeLayer();const d=document.createElement('div');d.className='v576-layer '+cls;d.dataset.v576Layer='';d.innerHTML='<button type="button" class="v576-backdrop" data-v576-close aria-label="Cerrar"></button>'+html;document.body.appendChild(d)}
function guest(){
 layer('<section class="v576-login-sheet"><button class="v576-x" type="button" data-v576-close>×</button><h2>¿Sigues sin iniciar sesión?</h2><p>Una vez que crees tu equipo, iniciar sesión te permite:</p><ul><li>⚽ <span>Actualizar tu equipo desde cualquier dispositivo</span></li><li>⚽ <span>Volver a unirte a tus ligas favoritas</span></li><li>⚽ <span>Recibir notificaciones personalizadas</span></li></ul><button class="primary" type="button" data-v576-login>Inicia sesión para jugar</button><button class="later" type="button" data-v576-later>Entraré luego</button></section>','login');
}
function menu(){
 layer('<section class="v576-menu-sheet"><header><b>Fantasy</b><button type="button" data-v576-close>×</button></header><button type="button" data-v576-reset>Reiniciar equipo</button><button type="button" data-v576-matches>Partidos</button><button type="button" data-v576-help="points">Cómo conseguir puntos</button><button type="button" data-v576-help="rules">Reglas</button></section>','menu');
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
 if(r==='fantasyAccess'){
   const base=screen.querySelector('[data-v23-access]');
   if(base&&!screen.querySelector('[data-v576-access-more]')) screen.insertAdjacentHTML('beforeend',accessMarkup());
 }
 if(r==='fantasyTeam')screen.innerHTML=builderMarkup();
}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(render))}

document.addEventListener('click',e=>{
 const el=e.target instanceof Element?e.target:null;if(!el)return;
 if(el.closest('[data-v576-close]')){e.preventDefault();closeLayer();return}
 if(el.closest('[data-v576-login]')){e.preventDefault();closeLayer();location.hash='#/profile';return}
 if(el.closest('[data-v576-guest]')){e.preventDefault();guest();return}
 if(el.closest('[data-v576-open-team]')){e.preventDefault();location.hash='#/fantasyTeam';return}
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

window.addEventListener('hashchange',()=>{closeLayer();schedule()});
window.addEventListener('ljr:official-data',schedule);
const screen=document.querySelector('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();