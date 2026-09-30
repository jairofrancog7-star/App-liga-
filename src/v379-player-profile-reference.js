/* V379 — Perfil individual de jugador inspirado en la referencia móvil enviada por el usuario.
   Abre una ficha real al tocar un jugador y conserva el comparador como acción explícita.
   Integridad: solo muestra datos publicados/sincronizados; lo no publicado aparece como “—”. */
(function(){
'use strict';
if(window.__LJR_V379_PLAYER_PROFILE__)return;
window.__LJR_V379_PLAYER_PROFILE__=true;

const KEY='v379-player-profile';
const TAB_KEY='v379-player-profile-tab';
let api=null,loading=null,rendering=false;

function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function norm(v){try{return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}catch{return String(v??'').toLowerCase().trim()}}
function read(k,d=null){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??d}catch{return d}}
function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function initials(v){return String(v||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'JG'}
function same(a,b){return norm(a)===norm(b)}
function fallbackKit(name){
  let h=0;for(const ch of String(name||''))h=(h*31+ch.charCodeAt(0))>>>0;
  const hue=h%360;
  return ['hsl('+hue+' 78% 43%)','hsl('+((hue+34)%360)+' 72% 23%)','#ffffff'];
}
function teamPalette(name){
  const n=norm(name);
  const palettes=[
    [/franco/,['#d71920','#0a0b10','#ffffff']],
    [/pozos/,['#22dc6e','#08110d','#eaffef']],
    [/juventus/,['#f4f4f4','#121212','#c8c8c8']],
    [/manchester/,['#e31d2b','#111111','#f3d24b']],
    [/boavista/,['#111111','#e2bd22','#ffffff']],
    [/esperanza/,['#18b76d','#08261b','#ffffff']],
    [/lobos/,['#1458d7','#071c4f','#ffffff']],
    [/san julian/,['#e52d36','#ffffff','#0a2348']],
    [/tavera/,['#1c67d5','#ffffff','#0b1f4c']],
    [/america/,['#f0d326','#173a8e','#d71d2b']],
    [/herreras/,['#111111','#d91c28','#ffffff']],
    [/galacticos/,['#642bd7','#17102a','#ffffff']],
    [/promesas/,['#2468d8','#ffffff','#11224a']],
    [/cuenda/,['#0b6a42','#efd94c','#ffffff']],
    [/aldama/,['#d52231','#111111','#ffffff']],
    [/linces/,['#0c2e77','#dfb72c','#ffffff']],
    [/psv/,['#e1222c','#ffffff','#111111']],
    [/napoli/,['#1b8bd1','#ffffff','#10325a']],
    [/dynamo|dinamo/,['#2456c7','#ffffff','#0d1b48']]
  ];
  for(const [re,c] of palettes)if(re.test(n))return c;
  return fallbackKit(name);
}
function paletteStyle(name){
  const c=teamPalette(name);
  return '--v379-kit1:'+c[0]+';--v379-kit2:'+c[1]+';--v379-kit3:'+c[2]+';';
}
function dash(v){return v===undefined||v===null||String(v).trim()===''?'—':String(v)}
function attr(v){return esc(String(v??''))}
function isDataImage(v){return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(String(v||''))}
function getPhoto(p){
  const pub=window.LJR_PLAYER_PHOTOS;
  if(pub){
    try{
      if(typeof pub.get==='function'){const x=pub.get(p.name,p.team);if(x)return String(x)}
      const direct=pub[norm(p.name)+'|'+norm(p.team)]||pub[norm(p.name)]||pub[p.name];
      if(direct)return String(direct);
    }catch{}
  }
  return '';
}
async function getApi(){
  if(api?.playerList)return api;
  if(loading)return loading;
  loading=(async()=>{
    for(let i=0;i<60;i++){
      const a=window.V66_OFFICIAL_DIRECTORY;
      if(a?.load&&a?.playerList){
        try{await a.load()}catch{}
        api=a;return api;
      }
      await new Promise(r=>setTimeout(r,70));
    }
    return null;
  })();
  return loading;
}
function playerKey(p){return norm(p?.name)+'|'+norm(p?.team)+'|'+String(p?.cat||'')}
function resolve(raw,list){
  if(!raw||!list?.length)return null;
  const name=norm(raw.name||raw.player||''),team=norm(raw.team||''),cat=String(raw.cat||raw.catId||'');
  let hit=list.find(x=>norm(x.name)===name&&norm(x.team)===team&&(cat?String(x.cat)===cat:true));
  if(hit)return hit;
  hit=list.find(x=>norm(x.name)===name&&norm(x.team)===team);
  if(hit)return hit;
  const hits=list.filter(x=>norm(x.name)===name);
  if(cat){const c=hits.find(x=>String(x.cat)===cat);if(c)return c}
  return hits[0]||null;
}
function currentPlayer(list){
  const stored=read(KEY)||read('v123-compare-player');
  return resolve(stored,list)||list?.[0]||null;
}
function localRegistration(p){
  const reg=read('v124-player-registry',{seasons:{}});
  const seasons=Object.entries(reg?.seasons||{}).sort((a,b)=>String(b[0]).localeCompare(String(a[0])));
  for(const [,rows] of seasons){
    if(!Array.isArray(rows))continue;
    const hit=rows.find(r=>same(r?.name,p.name)&&(!r?.team||same(r.team,p.team)));
    if(hit)return hit;
  }
  return null;
}
function publishedGoal(p){
  const rows=api?.officialScorers?.()||[];
  const hit=rows.find(r=>same(r.player,p.name)&&same(r.team,p.team)&&(p.cat?String(r.cat)===String(p.cat):true));
  return hit&&Number.isFinite(Number(hit.goals))?Number(hit.goals):null;
}
function officialDiscipline(p){
  const raw=api?.data?.()||window.LJR_OFFICIAL_DATA||null;
  const cat=raw?.categories?.[String(p?.cat||'')];
  const rows=cat?.cards?.[0]?.rows||[];
  let yellow=0,red=0;
  for(const r of rows){
    if(!Array.isArray(r)||r.length<4)continue;
    if(!same(r[1],p.name)||!same(r[2],p.team))continue;
    const total=Number(r[3])||0,type=norm(r[0]);
    if(type.includes('amar'))yellow+=total;
    if(type.includes('roj'))red+=total;
  }
  const susp=(cat?.suspensions?.[0]?.rows||[]).find(r=>Array.isArray(r)&&r.length>=4&&same(r[0],p.name)&&same(r[1],p.team));
  return {yellow,red,suspension:susp?String(susp[2]||''):'' ,pending:susp?String(susp[3]||''):''};
}
function teamLogo(name){
  let src='';
  try{src=api?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||''}catch{}
  return src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="eager" decoding="async">':'<b>'+esc(String(name||'EQ').slice(0,3).toUpperCase())+'</b>';
}
function related(p,list){
  return list.filter(x=>same(x.team,p.team)&&playerKey(x)!==playerKey(p)).slice(0,8);
}
function fixtures(p){
  const rows=api?.fixtureRows?.()||[];
  return rows.filter(x=>same(x.home,p.team)||same(x.away,p.team)).slice(0,12);
}
function valueFrom(reg,keys){
  for(const k of keys){const v=reg?.[k];if(v!==undefined&&v!==null&&String(v).trim()!=='')return String(v)}
  return '';
}
function profileData(p){
  const reg=localRegistration(p)||{};
  return {
    position:valueFrom(reg,['position','pos','role','positionName']),
    number:valueFrom(reg,['number','dorsal','jersey','shirtNumber','jerseyNumber']),
    nationality:valueFrom(reg,['nationality','country','pais','país']),
    birth:valueFrom(reg,['birthDate','dob','dateOfBirth','fechaNacimiento','birth']),
    city:valueFrom(reg,['city','municipality','locality','community','ciudad','comunidad']),
    photo:getPhoto(p)
  };
}
function backButton(){
  return '<button type="button" class="v379-back" data-v379-back aria-label="Volver"><svg viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7"/></svg></button>';
}
function shareButton(){
  return '<button type="button" class="v379-share" data-v379-share aria-label="Compartir jugador"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8 11 8-5M8 13l8 5"/></svg></button>';
}
function tabs(active){
  return '<nav class="v379-tabs" aria-label="Secciones del jugador">'+
    ['Resumen','Estadísticas','Partidos','Noticias'].map(t=>'<button type="button" data-v379-tab="'+esc(t)+'" class="'+(active===t?'active':'')+'">'+esc(t)+'</button>').join('')+
  '</nav>';
}
function hero(p,d){
  const photo=d.photo;
  const visual=photo
    ? '<img class="v379-player-photo" src="'+esc(photo)+'" alt="'+esc(p.name)+'">'
    : '<div class="v379-player-silhouette" style="'+paletteStyle(p.team)+'" aria-hidden="true">'+
        '<span class="v379-player-body"><i class="v379-kit-logo">'+teamLogo(p.team)+'</i></span>'+
        '<span class="v379-player-neck"></span>'+
        '<span class="v379-player-head"></span>'+
        '<span class="v379-player-hair"></span>'+
      '</div>';
  return '<section class="v379-hero" style="'+paletteStyle(p.team)+'">'+backButton()+shareButton()+
    '<div class="v379-hero-pattern" aria-hidden="true"></div>'+visual+
    '<div class="v379-hero-copy"><h1>'+esc(p.name)+'</h1>'+
      '<div class="v379-teamline"><span class="v379-team-logo">'+teamLogo(p.team)+'</span><b>'+esc(p.team)+'</b></div>'+
      '<div class="v379-location"><svg viewBox="0 0 24 24"><path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg><span>Juventino Rosas</span></div>'+
    '</div>'+
  '</section>';
}
function infoGrid(p,d){
  return '<section class="v379-info-card">'+
   '<div><small>POSICIÓN</small><strong>'+esc(d.position||'—')+'</strong></div>'+
   '<div><small>DORSAL EN EL CLUB</small><strong>'+esc(d.number||'—')+'</strong></div>'+
   '<div><small>CATEGORÍA</small><strong>'+esc(p.category||'—')+'</strong></div>'+
   '<div><small>PAÍS</small><strong>'+esc(d.nationality||'—')+'</strong></div>'+
   (d.birth?'<div><small>FECHA DE NACIMIENTO</small><strong>'+esc(d.birth)+'</strong></div>':'')+
   (d.city?'<div><small>LOCALIDAD REGISTRADA</small><strong>'+esc(d.city)+'</strong></div>':'')+
  '</section>';
}
function sectionTitle(title,action,attrName){
  return '<div class="v379-section-title"><h2>'+esc(title)+'</h2>'+(action?'<button type="button" '+attrName+'>'+esc(action)+'</button>':'')+'</div>';
}
function relatedHtml(p,list){
  const rel=related(p,list);
  if(!rel.length)return '';
  return '<section class="v379-block">'+sectionTitle('Jugadores relacionados','','')+
    '<div class="v379-related">'+rel.map(x=>'<button type="button" class="v379-related-card" data-v379-related="'+attr(x.name)+'" data-v379-related-team="'+attr(x.team)+'" data-v379-related-cat="'+attr(x.cat)+'">'+
      '<span class="v379-related-avatar">'+esc(initials(x.name))+'</span>'+
      '<span class="v379-related-logo">'+teamLogo(x.team)+'</span>'+
      '<strong>'+esc(x.name)+'</strong><small>'+esc(x.category||x.team)+'</small>'+
    '</button>').join('')+'</div></section>';
}
function nextMatchCard(p){
  const list=fixtures(p);
  if(!list.length)return '<div class="v379-empty">No hay partidos sincronizados para este equipo.</div>';
  const m=list[0],home=same(m.home,p.team),opp=home?m.away:m.home;
  return '<button type="button" class="v379-match-card" data-v379-competition>'+
    '<div class="v379-match-meta"><b>'+esc(m.date||'Fecha por confirmar')+'</b><span>'+esc(m.category||p.category||'')+'</span></div>'+
    '<div class="v379-match-clubs"><span><i>'+teamLogo(p.team)+'</i><b>'+esc(p.team)+'</b></span><em>VS</em><span><i>'+teamLogo(opp)+'</i><b>'+esc(opp)+'</b></span></div>'+
    '<div class="v379-match-foot"><span>'+esc(m.field||'Sede por confirmar')+'</span><strong>Ver competición</strong></div>'+
  '</button>';
}
function newsEmpty(){
  return '<div class="v379-news-empty"><div class="v379-news-art" aria-hidden="true"></div><strong>Sin noticias oficiales del jugador</strong><p>Cuando la Liga publique una nota asociada a este jugador aparecerá aquí.</p><button type="button" data-v379-news>Ver noticias de la Liga</button></div>';
}
function summary(p,d,list){
  const goals=publishedGoal(p),matches=fixtures(p).length,discipline=officialDiscipline(p);
  return '<div class="v379-tab-panel">'+infoGrid(p,d)+
   '<section class="v379-block">'+sectionTitle('Datos oficiales','','')+
    '<div class="v379-key-grid v380-player-key-grid"><div><strong>'+(goals==null?'—':goals)+'</strong><small>Goles oficiales</small></div><div><strong>'+matches+'</strong><small>Partidos sincronizados</small></div><div><strong>'+discipline.yellow+'</strong><small>Tarjetas amarillas</small></div><div><strong>'+discipline.red+'</strong><small>Tarjetas rojas</small></div></div>'+
    (discipline.suspension?'<div class="v380-suspension"><b>Castigo oficial</b><span>'+esc(discipline.suspension)+(discipline.pending?' · '+esc(discipline.pending)+' pendiente(s)':'')+'</span></div>':'')+
   '</section>'+
   '<section class="v379-block">'+sectionTitle('Próximo partido','Ver todo','data-v379-tab-jump="Partidos"')+nextMatchCard(p)+'</section>'+
   '<section class="v379-block">'+sectionTitle('Noticias','Ver todo','data-v379-tab-jump="Noticias"')+newsEmpty()+'</section>'+
   relatedHtml(p,list)+'</div>';
}
function statRow(label,val,sub){
  return '<div class="v379-stat-row"><span><b>'+esc(label)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><strong>'+esc(val)+'</strong></div>';
}
function stats(p,list){
  const goals=publishedGoal(p),discipline=officialDiscipline(p);
  return '<div class="v379-tab-panel">'+
   '<section class="v379-stats-card"><div class="v379-stats-head"><span>ATAQUE</span><i></i></div>'+
    '<div class="v379-big-stat"><strong>'+(goals==null?'—':goals)+'</strong><span>Goles oficiales</span></div>'+
    statRow('Goles dentro del área','—','No publicado')+statRow('Goles fuera del área','—','No publicado')+statRow('Con la derecha','—','No publicado')+statRow('Con la izquierda','—','No publicado')+statRow('De cabeza','—','No publicado')+
   '</section>'+
   '<section class="v379-stats-card"><div class="v379-stats-head"><span>DISCIPLINA</span><i></i></div>'+
    statRow('Tarjetas amarillas',discipline.yellow,'Dato oficial')+statRow('Tarjetas rojas',discipline.red,'Dato oficial')+statRow('Castigo',discipline.suspension||'—',discipline.suspension?'Dato oficial':'No publicado')+statRow('Pendientes',discipline.pending||'—',discipline.pending?'Dato oficial':'No publicado')+
   '</section>'+
   '<section class="v379-stats-card"><div class="v379-stats-head"><span>DEFENSA</span><i></i></div>'+
    statRow('Duelos','—','No publicado')+statRow('Entradas con éxito','—','No publicado')+statRow('Balones recuperados','—','No publicado')+statRow('Despejes completados','—','No publicado')+
   '</section>'+
   '<section class="v379-block">'+sectionTitle('Comparar jugador','','')+
    '<button type="button" class="v379-compare-wide" data-v379-compare><span class="v379-related-avatar">'+esc(initials(p.name))+'</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+'</small></span><strong>Comparar</strong></button>'+
   '</section>'+relatedHtml(p,list)+'</div>';
}
function matchList(p){
  const rows=fixtures(p);
  if(!rows.length)return '<div class="v379-tab-panel"><div class="v379-empty large">No hay partidos sincronizados para '+esc(p.team)+'.</div></div>';
  return '<div class="v379-tab-panel"><section class="v379-block">'+sectionTitle('Partidos del equipo','','')+
   '<div class="v379-match-list">'+rows.map(m=>'<button type="button" class="v379-match-row" data-v379-competition>'+
    '<div class="v379-match-row-meta"><b>'+esc(m.date||'Fecha por confirmar')+'</b><small>'+esc((m.category||p.category||'')+(m.round?' · Jornada '+m.round:''))+'</small></div>'+
    '<div class="v379-match-row-teams"><span><i>'+teamLogo(m.home)+'</i><b>'+esc(m.home)+'</b></span><em>VS</em><span><i>'+teamLogo(m.away)+'</i><b>'+esc(m.away)+'</b></span></div>'+
    '<div class="v379-match-row-field"><span>'+esc(m.field||'Sede por confirmar')+'</span><strong>Ver detalles</strong></div>'+
   '</button>').join('')+'</div></section></div>';
}
function newsTab(p,list){
  return '<div class="v379-tab-panel"><section class="v379-block">'+sectionTitle('Noticias de '+p.name,'','')+newsEmpty()+'</section>'+relatedHtml(p,list)+'</div>';
}
function content(active,p,d,list){
  if(active==='Estadísticas')return stats(p,list);
  if(active==='Partidos')return matchList(p);
  if(active==='Noticias')return newsTab(p,list);
  return summary(p,d,list);
}
function markup(active,p,list){
  const d=profileData(p);
  return '<section class="v379-profile" data-v379-profile>'+hero(p,d)+tabs(active)+'<div class="v379-content">'+content(active,p,d,list)+'</div></section>';
}
function syncPlayerBottomNav(active){
  if(!active)return;
  document.querySelectorAll('.bottom-nav .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.route==='competition'));
}
function setTheme(active){
  document.body.classList.toggle('v379-player-profile-active',active);
  syncPlayerBottomNav(active);
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta){
    if(active){
      if(!meta.dataset.v379Previous)meta.dataset.v379Previous=meta.getAttribute('content')||'#02065F';
      meta.setAttribute('content','#031f9e');
    }else if(meta.dataset.v379Previous){
      meta.setAttribute('content',meta.dataset.v379Previous);delete meta.dataset.v379Previous;
    }
  }
}
function bind(p,list){
  document.querySelector('[data-v379-back]')?.addEventListener('click',()=>{if(history.length>1)history.back();else location.hash='#/players'},{once:true});
  document.querySelector('[data-v379-share]')?.addEventListener('click',async()=>{
    const payload={title:p.name+' · Liga Juventino Rosas',text:p.name+' · '+p.team+' · '+(p.category||'Jugador registrado'),url:location.href};
    try{if(navigator.share)await navigator.share(payload);else if(navigator.clipboard){await navigator.clipboard.writeText(location.href)}}catch{}
  },{once:true});
  document.querySelectorAll('[data-v379-tab]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem(TAB_KEY,b.dataset.v379Tab||'Resumen');render(true)},{once:true}));
  document.querySelectorAll('[data-v379-tab-jump]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem(TAB_KEY,b.dataset.v379TabJump||'Resumen');render(true)},{once:true}));
  document.querySelectorAll('[data-v379-related]').forEach(b=>b.addEventListener('click',()=>{
    const x=resolve({name:b.dataset.v379Related,team:b.dataset.v379RelatedTeam,cat:b.dataset.v379RelatedCat},list);
    if(!x)return;write(KEY,x);localStorage.setItem(TAB_KEY,'Resumen');render(true);window.scrollTo({top:0,behavior:'smooth'});
  },{once:true}));
  document.querySelectorAll('[data-v379-compare]').forEach(b=>b.addEventListener('click',()=>{
    if(window.LJR_PLAYER_COMPARE_API?.open){window.LJR_PLAYER_COMPARE_API.open(p);return}
    write('v123-compare-player',p);localStorage.removeItem('v123-compare-player-2');location.hash='#/playerCompare';
  },{once:true}));
  document.querySelectorAll('[data-v379-competition]').forEach(b=>b.addEventListener('click',()=>{location.hash='#/competition'},{once:true}));
  document.querySelectorAll('[data-v379-news]').forEach(b=>b.addEventListener('click',()=>{location.hash='#/news'},{once:true}));
}
async function render(force=false){
  if(rendering)return;
  const active=route()==='playerDetail';
  setTheme(active);
  if(!active)return;
  rendering=true;
  try{
    const a=await getApi();if(!a)return;
    const list=a.playerList?.()||[];if(!list.length)return;
    const p=currentPlayer(list);if(!p)return;
    write(KEY,p);
    const screen=document.querySelector('#screen');if(!screen)return;
    if(!force&&screen.querySelector('[data-v379-profile]')?.dataset?.playerKey===playerKey(p))return;
    const tab=localStorage.getItem(TAB_KEY)||'Resumen';
    screen.innerHTML=markup(tab,p,list);
    const root=screen.querySelector('[data-v379-profile]');if(root)root.dataset.playerKey=playerKey(p);
    bind(p,list);
    window.scrollTo(0,0);
  }finally{rendering=false}
}
function open(player){
  getApi().then(a=>{
    if(!a)return;const p=resolve(player,a.playerList?.()||[]);if(!p)return;
    write(KEY,p);localStorage.setItem(TAB_KEY,'Resumen');location.hash='#/playerDetail';
  });
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(()=>render(false)))}
window.LJR_PLAYER_PROFILE_API={open,render:()=>render(true)};
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='playerDetail'&&!screen.querySelector('[data-v379-profile]'))schedule()}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();