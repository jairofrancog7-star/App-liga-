/* V141 — Goleadores por categoría y por equipo. Solo datos oficiales. */
(function(){
'use strict';
if(window.__LJR_V141_SCORERS__)return;window.__LJR_V141_SCORERS__=true;
const ORDER=['3','5','4','2','1'];
const META={
 '3':{name:'Primera Fuerza',logo:'./assets/branding/primera-fuerza-hd.png'},
 '5':{name:'Intermedia',logo:'./assets/categories/intermedia.webp'},
 '4':{name:'Segunda Fuerza',logo:'./assets/categories/segunda-fuerza.webp'},
 '2':{name:'Veteranos 35+',logo:'./assets/categories/veteranos-35-user.png'},
 '1':{name:'Veteranos 50+',logo:'./assets/categories/veteranos-50.webp'}
};
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function same(a,b){const x=norm(a),y=norm(b);if(x===y)return true;const p=[['atletico galeana','atl galeana'],['toros de cuenda','cuenda'],['deportivo nopalero','dep nopalero'],['deportivo zapata','dep zapata'],['celticos','celticos fc']];return p.some(z=>(x===norm(z[0])&&y===norm(z[1]))||(x===norm(z[1])&&y===norm(z[0])))}
function data(){try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}catch(_){return window.LJR_OFFICIAL_DATA||null}}
function logo(team){try{return window.LJR_OFFICIAL_API?.getLogo?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||''}catch(_){return ''}}
function mark(team,cls='v141-team-logo'){const src=logo(team);if(src)return '<span class="'+cls+'"><img src="'+esc(src)+'" alt="'+esc(team)+'" loading="lazy" decoding="async"></span>';const ab=String(team||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();return '<span class="'+cls+' v141-fallback">'+esc(ab||'⚽')+'</span>'}
function rows(id){const c=data()?.categories?.[String(id)],raw=c?.scorers?.[0]?.rows||[];return raw.filter(r=>Array.isArray(r)&&r.length>=4&&r[1]&&r[2]&&/^\d+$/.test(String(r[3]||''))).map(r=>({player:String(r[1]).trim(),team:String(r[2]).trim(),goals:Number(r[3])||0,cat:String(id),category:c?.name||META[String(id)]?.name||''})).sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player,'es',{sensitivity:'base'}))}
function all(){return ORDER.flatMap(rows)}
function prow(r,i){return '<div class="v141-player-row"><span class="v141-rank">#'+(i+1)+'</span>'+mark(r.team)+'<span class="v141-player-copy"><b>'+esc(r.player)+'</b><small>'+esc(r.team)+'</small></span><strong>'+r.goals+'</strong></div>'}
function cat(id){const m=META[id]||{name:'Categoría '+id,logo:''},rs=rows(id);return '<section class="v141-card"><div class="v141-card-head"><span class="v141-cat-logo">'+(m.logo?'<img src="'+esc(m.logo)+'" alt="'+esc(m.name)+'">':'⚽')+'</span><span><small>CATEGORÍA</small><b>'+esc(m.name)+'</b></span><em>'+rs.length+(rs.length===1?' jugador':' jugadores')+'</em></div>'+(rs.length?'<div>'+rs.map(prow).join('')+'</div>':'<div class="v141-empty">Sin tabla individual de goleadores publicada en el snapshot oficial.</div>')+'</section>'}
function groups(){const gs=[];all().forEach(r=>{let g=gs.find(x=>same(x.team,r.team)&&x.cat===r.cat);if(!g){g={team:r.team,cat:r.cat,category:r.category,players:[],total:0};gs.push(g)}g.players.push(r);g.total+=r.goals});gs.forEach(g=>g.players.sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player,'es',{sensitivity:'base'})));return gs.sort((a,b)=>b.total-a.total||a.team.localeCompare(b.team,'es',{sensitivity:'base'}))}
function team(g,i){return '<section class="v141-card"><button type="button" class="v141-team-head" data-v141-team="'+esc(g.team)+'"><span class="v141-team-order">#'+(i+1)+'</span>'+mark(g.team,'v141-team-logo large')+'<span class="v141-team-copy"><b>'+esc(g.team)+'</b><small>'+esc(g.category)+'</small></span><span class="v141-team-total"><b>'+g.total+'</b><small>goles</small></span></button><div class="v141-team-players">'+g.players.map((r,j)=>'<div><span>'+esc(j+1)+'</span><b>'+esc(r.player)+'</b><strong>'+r.goals+'</strong></div>').join('')+'</div></section>'}
function html(){const gs=groups();return '<div class="v141-scorer-groups" data-v141-scorers><section class="v141-title"><small>RANKING OFICIAL</small><h2>Goleadores por categoría</h2><p>Ordenados por goles publicados, con escudo, jugador y equipo.</p></section><div class="v141-stack">'+ORDER.map(cat).join('')+'</div><section class="v141-title second"><small>POR CLUB</small><h2>Goleadores por equipo</h2><p>Equipos ordenados por la suma de goles de sus jugadores en la tabla oficial.</p></section>'+(gs.length?'<div class="v141-stack">'+gs.map(team).join('')+'</div>':'<div class="v141-empty standalone">No hay goleadores individuales publicados todavía.</div>')+'<p class="v141-note">Solo datos oficiales sincronizados; no se inventan jugadores ni goles.</p></div>'}
function bind(root){root.querySelectorAll('[data-v141-team]').forEach(b=>b.onclick=e=>{e.preventDefault();const n=b.dataset.v141Team||'';try{if(window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(n);return}}catch(_){}localStorage.setItem('v62-team-name',n);location.hash='#/teamDetail'})}
let timer=0;function mount(){clearTimeout(timer);timer=setTimeout(()=>{if(route()!=='scorers'||!data())return;const page=document.querySelector('[data-v28-scorers]');if(!page)return;const sig=String(data()?.captured_at_utc||'')+'|'+all().map(r=>r.cat+':'+r.player+':'+r.goals).join('|');const old=page.querySelector('[data-v141-scorers]');if(old&&old.dataset.sig===sig)return;if(old)old.remove();const wrap=document.createElement('div');wrap.innerHTML=html();const node=wrap.firstElementChild;if(!node)return;node.dataset.sig=sig;const criteria=page.querySelector('.v28-criteria');if(criteria)page.insertBefore(node,criteria);else page.appendChild(node);bind(node)},90)}
window.addEventListener('hashchange',mount);window.addEventListener('ljr:official-data',mount);
const screen=document.querySelector('#screen');if(screen)new MutationObserver(()=>{if(route()==='scorers')mount()}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
setTimeout(mount,700);setTimeout(mount,1800);
})();