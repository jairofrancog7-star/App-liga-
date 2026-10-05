/* V413 — diseños adaptados por sección.
   Cada diseño vive en la página que le corresponde y se añade al final.
   No crea un hub genérico de botones. */
(function(){
'use strict';
if(window.__LJR_V413_PAGE_DESIGNS__)return;
window.__LJR_V413_PAGE_DESIGNS__=true;

const ID='v413-page-design';
const FB='https://www.facebook.com/share/19SsGuzsRi/';
const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
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
  'manchester':'assets/official-logos/manchester.png',
  'boavista':'assets/official-logos/boavista.png',
  'la esperanza':'assets/official-logos/la-esperanza.png',
  'tavera fc':'assets/official-logos/tavera-fc.png',
  'san julian':'assets/official-logos/san-julian.png'
};
const ROUTES=new Set([
  'v4-calendar','calendar','monthlyCalendar','calendarMonthly',
  'news','v38Weekly',
  'following','search','matchCenter','match-center','v4-matchcenter',
  'profile','more'
]);

let timer=0;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slug=v=>norm(v).replace(/\s+/g,'-');
const go=r=>{if(r)location.hash='#/'+r};

function db(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}
  catch(_){return window.LJR_OFFICIAL_DATA||{}}
}
function readStore(){
  try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}
  catch(_){return {}}
}
function writeStore(next){
  try{localStorage.setItem('lj-store-v3',JSON.stringify(next))}catch(_){}
}
function readJson(key,def){
  try{const v=JSON.parse(localStorage.getItem(key)||'null');return v==null?def:v}catch(_){return def}
}
function writeJson(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch(_){}}

function teamList(){
  const out=[];
  const add=(name,cat='Liga Municipal')=>{
    name=String(name||'').trim();
    if(!name||/^(equipo|club)$/i.test(name))return;
    if(!out.some(x=>norm(x.name)===norm(name)))out.push({name,category:cat});
  };
  const data=db();
  Object.values(data?.categories||{}).forEach(cat=>{
    const cname=cat?.name||'Liga Municipal';
    Object.keys(cat?.rosters||{}).forEach(n=>add(n,cname));
    (cat?.standings||[]).forEach(block=>(block?.rows||[]).forEach(r=>add(Array.isArray(r)?(r[1]||r[0]):(r?.team||r?.name),cname)));
  });
  return out.slice(0,60);
}
function playerList(){
  /* V640 — usar primero el directorio oficial ya normalizado.
     Ese directorio combina rosters + player_profiles de todas las categorías,
     por lo que evita el falso "0 jugadores" cuando el roster es un arreglo de nombres. */
  try{
    const list=window.V66_OFFICIAL_DIRECTORY?.playerList?.();
    if(Array.isArray(list)&&list.length){
      const seen=new Set();
      return list.map(p=>({
        name:String(p?.name||'').trim(),
        team:String(p?.team||'').trim(),
        cat:String(p?.cat||''),
        category:String(p?.category||'Liga Municipal'),
        position:String(p?.position||''),
        dorsal:String(p?.dorsal||''),
        photo:String(p?.photo||'')
      })).filter(p=>{
        const key=p.cat+'|'+norm(p.team)+'|'+norm(p.name);
        if(!p.name||!p.team||seen.has(key))return false;
        seen.add(key);return true;
      });
    }
  }catch(_){}

  /* Respaldo local: soporta rosters como strings, objetos o arreglos,
     y añade también perfiles aunque el nombre no esté repetido en roster. */
  const out=[],seen=new Set();
  Object.entries(db()?.categories||{}).forEach(([cid,cat])=>{
    const cname=cat?.name||'Liga Municipal';
    const teams=new Set([...Object.keys(cat?.rosters||{}),...Object.keys(cat?.player_profiles||{})]);
    teams.forEach(team=>{
      const raw=cat?.rosters?.[team];
      const rows=Array.isArray(raw)?raw:(raw?.rows||raw?.players||[]);
      const profilesEntry=Object.entries(cat?.player_profiles||{}).find(([t])=>norm(t)===norm(team));
      const profiles=Array.isArray(profilesEntry?.[1])?profilesEntry[1]:[];
      const byName=new Map(profiles.map(p=>[norm(p?.name),p||{}]));
      const values=[...rows,...profiles.map(p=>p?.name).filter(Boolean)];
      values.forEach(r=>{
        const name=String(
          typeof r==='string'||typeof r==='number' ? r :
          Array.isArray(r) ? (r[1]||r[0]||'') :
          (r?.name||r?.player||'')
        ).trim();
        const key=String(cid)+'|'+norm(team)+'|'+norm(name);
        if(!name||seen.has(key)||/^(nombre|jugador|tabla|goleadores)$/i.test(name))return;
        seen.add(key);
        const p=byName.get(norm(name))||{};
        out.push({
          name,team,cat:String(cid),category:cname,
          position:String(p?.position||''),dorsal:String(p?.dorsal||''),
          photo:String(p?.photo||'')
        });
      });
    });
  });
  return out;
}
function logo(name){
  try{
    const x=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name);
    if(x)return x;
  }catch(_){}
  const hit=FALLBACK_LOGOS[norm(name)];
  return hit?BASE+hit:'';
}
function logoHtml(t){
  const src=logo(t.name);
  const letters=t.name.split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return src?'<img src="'+esc(src)+'" alt="'+esc(t.name)+'" loading="lazy" decoding="async"><span class="v413-fallback">'+esc(letters)+'</span>':'<span class="v413-fallback show">'+esc(letters||'EQ')+'</span>';
}
function playerPhoto(p){
  try{
    return String(
      p?.photo||
      window.LJR_PLAYER_MEDIA?.photo?.(p?.name,p?.team,p?.cat)||
      window.LJR_PLAYER_PHOTOS?.get?.(p?.name,p?.team,p?.cat)||
      ''
    ).trim();
  }catch(_){return String(p?.photo||'').trim()}
}
function playerAvatar(p){
  const src=playerPhoto(p);
  const ini=String(p?.name||'JG').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'JG';
  return src
    ?'<span class="v413-player-avatar v576-has-photo"><img src="'+esc(src)+'" alt="'+esc(p?.name||'Jugador')+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>'
    :'<span class="v413-player-avatar v413-player-avatar-fallback">'+esc(ini)+'</span>';
}
function section(kicker,title,desc,body,extra=''){
  return '<section class="v413-shell" id="'+ID+'"><header class="v413-head"><small>'+esc(kicker)+'</small><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></header>'+body+extra+'</section>';
}

/* ---------- CALENDARIO ---------- */
function calendarMarkup(){
  const saved=readJson('v413-calendar-selection',null);
  const now=new Date();
  const y=saved?.y||now.getFullYear(),m=Number.isInteger(saved?.m)?saved.m:now.getMonth(),selected=saved?.d||now.getDate();
  const names=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const first=new Date(y,m,1),days=new Date(y,m+1,0).getDate();
  const before=(first.getDay()+6)%7;
  const cells=[];
  for(let i=0;i<before;i++)cells.push('<span class="v413-day muted"></span>');
  for(let d=1;d<=days;d++){
    const today=d===now.getDate()&&m===now.getMonth()&&y===now.getFullYear();
    const sel=d===selected;
    cells.push('<button class="v413-day '+(sel?'selected ':'')+(today?'today':'')+'" type="button" data-v413-day="'+d+'">'+d+'</button>');
  }
  return section('CALENDARIO DE LA LIGA','Partidos por fecha','Selecciona un día y consulta la jornada sin salir del diseño azul.',
    '<div class="v413-calendar">'+
      '<div class="v413-cal-top"><button type="button" data-v413-prev aria-label="Mes anterior">‹</button><b>'+names[m]+' '+y+'</b><button type="button" data-v413-next aria-label="Mes siguiente">›</button></div>'+
      '<div class="v413-week"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div>'+
      '<div class="v413-days">'+cells.join('')+'</div>'+
      '<div class="v413-cal-filters"><button type="button" data-v413-category>Todas las categorías⌄</button><button type="button" data-v413-teamfilter>Todos los equipos⌄</button></div>'+
      '<button class="v413-primary" type="button" data-v413-open-results>Ver partidos de la fecha</button>'+
    '</div>'
  );
}
function bindCalendar(root){
  const selected=()=>Number(root.querySelector('.v413-day.selected')?.dataset.v413Day||new Date().getDate());
  const current=()=>{
    const txt=root.querySelector('.v413-cal-top b')?.textContent||'';
    const parts=txt.split(/\s+/),y=Number(parts.pop());
    const names=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return {m:names.indexOf(norm(parts.join(' '))),y};
  };
  root.querySelectorAll('[data-v413-day]').forEach(b=>b.onclick=()=>{
    root.querySelectorAll('[data-v413-day]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');
    const c=current();writeJson('v413-calendar-selection',{...c,d:Number(b.dataset.v413Day)});
  });
  root.querySelector('[data-v413-prev]')?.addEventListener('click',()=>changeMonth(-1));
  root.querySelector('[data-v413-next]')?.addEventListener('click',()=>changeMonth(1));
  function changeMonth(delta){
    const c=current(),dt=new Date(c.y,c.m+delta,1);
    writeJson('v413-calendar-selection',{y:dt.getFullYear(),m:dt.getMonth(),d:1});remount();
  }
  root.querySelector('[data-v413-open-results]')?.addEventListener('click',()=>go('competition'));
  root.querySelector('[data-v413-category]')?.addEventListener('click',()=>go('competition'));
  root.querySelector('[data-v413-teamfilter]')?.addEventListener('click',()=>go('teams'));
}

/* ---------- FAVORITOS / SIGUIENDO ---------- */
function favoriteNames(){
  const own=readJson('v413-favorite-teams',[]);
  const out=new Set(Array.isArray(own)?own.map(norm):[]);
  /* V641 — también leer los favoritos de las otras pantallas para que
     "Siguiendo" y la ficha del equipo no se contradigan. */
  try{
    const legacy=readStore();
    (legacy?.favorites||[]).forEach(x=>{
      const v=String(x||'');
      if(v.startsWith('team:'))out.add(norm(v.slice(5).replace(/-/g,' ')));
    });
    const v414=readJson('ljr-v414-favorites',{teams:[]});
    (v414?.teams||[]).forEach(x=>out.add(norm(String(x||'').replace(/-/g,' '))));
  }catch(_){}
  return Array.from(out);
}
function isFav(name){return favoriteNames().includes(norm(name))}
function saveFavoriteEverywhere(name,on){
  const n=norm(name),key='team:'+slug(name);
  const own=new Set(favoriteNames());
  on?own.add(n):own.delete(n);
  writeJson('v413-favorite-teams',Array.from(own));

  try{
    const st=readStore(),arr=new Set(Array.isArray(st.favorites)?st.favorites:[]);
    on?arr.add(key):arr.delete(key);
    st.favorites=Array.from(arr);writeStore(st);
  }catch(_){}

  try{
    const v=readJson('ljr-v414-favorites',{teams:[],players:[],competitions:[],matches:[]});
    const arr=new Set(Array.isArray(v.teams)?v.teams:[]);
    const s=slug(name);on?arr.add(s):arr.delete(s);v.teams=Array.from(arr);
    writeJson('ljr-v414-favorites',v);
  }catch(_){}
}
function toggleFav(name){
  const next=!isFav(name);
  saveFavoriteEverywhere(name,next);
  return next;
}
function favoritesMarkup(){
  const list=teamList();
  const favs=list.filter(t=>isFav(t.name));
  const show=(favs.length?favs:list).slice(0,12);
  return section('MI LIGA','Equipos y favoritos','Busca, sigue y guarda equipos reales de la Liga.',
    '<div class="v413-follow-tabs"><button class="active" type="button" data-v413-follow-tab="all">Todos</button><button type="button" data-v413-follow-tab="favorites">Favoritos ('+favs.length+')</button><button type="button" data-v413-follow-tab="teams">Equipos ('+list.length+')</button></div>'+
    '<div class="v413-fav-strip" data-v413-fav-strip>'+show.slice(0,5).map(t=>'<button type="button" class="v413-fav-tile" data-v413-team="'+esc(t.name)+'">'+(isFav(t.name)?'<i>★</i>':'')+logoHtml(t)+'<b>'+esc(t.name)+'</b></button>').join('')+'</div>'+
    '<div class="v413-search"><span>⌕</span><input type="search" data-v413-team-search placeholder="Buscar equipo"></div>'+
    '<div class="v413-team-list" data-v413-team-list>'+list.slice(0,18).map(teamRow).join('')+'</div>'
  );
}
function teamRow(t){
  return '<div class="v413-team-row"><button type="button" data-v413-team="'+esc(t.name)+'">'+logoHtml(t)+'<span><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Liga Municipal')+'</small></span></button><button type="button" class="v413-star '+(isFav(t.name)?'on':'')+'" data-v413-star="'+esc(t.name)+'" aria-label="'+(isFav(t.name)?'Quitar de favoritos':'Agregar a favoritos')+'">'+(isFav(t.name)?'★':'☆')+'</button></div>';
}
function bindFavorites(root){
  if(!root)return;
  let mode=root.dataset.v413FollowMode||'all';
  const input=root.querySelector('[data-v413-team-search]');
  const host=root.querySelector('[data-v413-team-list]');
  const strip=root.querySelector('[data-v413-fav-strip]');

  const filtered=()=>{
    const q=norm(input?.value||'');
    let list=teamList();
    if(mode==='favorites')list=list.filter(t=>isFav(t.name));
    if(q)list=list.filter(t=>norm(t.name+' '+t.category).includes(q));
    return list.slice(0,30);
  };

  const updateTabs=()=>{
    const all=teamList(),favs=all.filter(t=>isFav(t.name));
    root.querySelectorAll('[data-v413-follow-tab]').forEach(b=>{
      const m=b.dataset.v413FollowTab||'all';
      b.classList.toggle('active',m===mode);
      if(m==='favorites')b.textContent='Favoritos ('+favs.length+')';
      if(m==='teams')b.textContent='Equipos ('+all.length+')';
      if(m==='all')b.textContent='Todos';
    });
  };

  const updateStrip=()=>{
    if(!strip)return;
    const all=teamList(),favs=all.filter(t=>isFav(t.name));
    const show=(favs.length?favs:all).slice(0,5);
    strip.innerHTML=show.map(t=>'<button type="button" class="v413-fav-tile" data-v413-team="'+esc(t.name)+'">'+(isFav(t.name)?'<i>★</i>':'')+logoHtml(t)+'<b>'+esc(t.name)+'</b></button>').join('');
  };

  const renderList=()=>{
    updateTabs();updateStrip();
    if(!host)return;
    const list=filtered();
    host.innerHTML=list.map(teamRow).join('')||
      '<div class="v413-empty">'+(mode==='favorites'?'Todavía no tienes equipos favoritos. Toca ☆ en un equipo para agregarlo.':'No se encontró ese equipo.')+'</div>';
    bindRows();
  };

  const openTeam=(name)=>{
    try{
      localStorage.setItem('v62-team-name',name);
      localStorage.setItem('v42-team-tab','summary');
      localStorage.removeItem('v42-open-compare');
    }catch(_){}
    location.hash='#/teamDetail';
  };

  const bindRows=()=>{
    root.querySelectorAll('[data-v413-team]').forEach(b=>b.onclick=e=>{
      e.preventDefault();e.stopPropagation();
      openTeam(String(b.dataset.v413Team||'').trim());
    });
    root.querySelectorAll('[data-v413-star]').forEach(b=>b.onclick=e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      toggleFav(b.dataset.v413Star||'');
      renderList();
    });
  };

  root.querySelectorAll('[data-v413-follow-tab]').forEach(b=>b.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    mode=b.dataset.v413FollowTab||'all';
    root.dataset.v413FollowMode=mode;
    renderList();
  });

  if(input)input.oninput=renderList;
  bindRows();
  updateTabs();
}

/* ---------- NOTIFICACIONES V414 / referencia 365 adaptada ---------- */
const NOTIFS=[
 ['goal','Goles','Aviso cuando se registre un gol'],
 ['kickoff','Inicio del partido','Aviso al comenzar'],
 ['halftime','Medio tiempo','Aviso al terminar el primer tiempo'],
 ['final','Final del partido','Aviso al finalizar'],
 ['news','Noticias','Publicaciones y comunicados'],
 ['scheduleChanges','Cambios de horario','Modificaciones de jornada'],
 ['venueChanges','Cambios de sede','Cambio de campo o cancha'],
 ['transfers','Transferencias','Movimientos oficiales publicados']
];
const V414_CATEGORIES=[
 ['football','Fútbol','Todos los partidos de la Liga','⚽'],
 ['primera','Primera Fuerza','Partidos y avisos de Primera Fuerza','◉'],
 ['intermedia','Intermedia','Partidos y avisos de Intermedia','◉'],
 ['segunda','Segunda Fuerza','Partidos y avisos de Segunda Fuerza','◉'],
 ['v35','Veteranos 35+','Partidos y avisos de Veteranos 35+','◉'],
 ['v50','Veteranos 50+','Partidos y avisos de Veteranos 50+','◉']
];
function v414Prefs(){
  const s=readStore(),n=Object.assign({
    enabled:true,news:true,predictor:true,sounds:true,vibration:true,doNotDisturb:true,
    goal:true,kickoff:true,halftime:true,final:true,scheduleChanges:true,venueChanges:true,transfers:true
  },s.notifications||{});
  return {store:s,n};
}
function v414DeviceCopy(){
  try{
    if(!('Notification' in window))return ['Las notificaciones del dispositivo no están disponibles en este navegador.','Revisar permisos'];
    if(Notification.permission==='granted')return ['Las notificaciones del dispositivo están activadas para Liga Juventino Rosas.','Notificaciones activadas'];
    if(Notification.permission==='denied')return ['Las notificaciones del dispositivo están bloqueadas. Actívalas desde los permisos del navegador o de la app.','Configuración del dispositivo'];
    return ['Activa las notificaciones del dispositivo para recibir avisos aunque no estés viendo esta pantalla.','Activar notificaciones'];
  }catch(_){return ['Configura los permisos de notificación del dispositivo para recibir avisos.','Configuración del dispositivo']}
}
function v414CategoryPrefs(){
  const def={};
  V414_CATEGORIES.forEach(([k])=>def[k]={enabled:true,goal:true,kickoff:true,halftime:true,final:true});
  const got=readJson('v414-category-notifications',{});
  V414_CATEGORIES.forEach(([k])=>got[k]=Object.assign({},def[k],got[k]||{}));
  return got;
}
function notificationsMarkup(){
  const {n}=v414Prefs(),device=v414DeviceCopy(),quiet=readJson('v413-quiet-hours',{start:'00:00',end:'08:00'});
  const categoryPrefs=v414CategoryPrefs();
  return '<section class="v414-notifications" id="'+ID+'">'+
    '<header class="v414-title"><small>CENTRO DE AVISOS</small><h2>Notificaciones</h2><p>Mismo funcionamiento de la referencia, adaptado al diseño azul de la Liga.</p></header>'+
    '<div class="v414-device-card">'+
      '<span class="v414-bell-off">🔕</span>'+
      '<div><p data-v414-device-copy>'+esc(device[0])+'</p><button type="button" data-v414-device>'+esc(device[1])+'</button></div>'+
    '</div>'+
    '<label class="v414-setting v414-master">'+
      '<span><b>Permitir alertas</b></span>'+
      '<input type="checkbox" data-v414-master '+(n.enabled!==false?'checked':'')+'><i></i>'+
    '</label>'+
    '<div class="v414-settings">'+
      '<label class="v414-setting"><span><b>Noticias</b><small>Comunicados y publicaciones de la Liga</small></span><input type="checkbox" data-v414-pref="news" '+(n.news!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Pronósticos</b><small>Quiniela y recordatorios de partidos</small></span><input type="checkbox" data-v414-pref="predictor" '+(n.predictor!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Sonidos</b><small>Reproducir sonido al recibir un aviso</small></span><input type="checkbox" data-v414-pref="sounds" '+(n.sounds!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Vibración</b><small>Vibrar cuando llegue una alerta</small></span><input type="checkbox" data-v414-pref="vibration" '+(n.vibration!==false?'checked':'')+'><i></i></label>'+
      '<div class="v414-setting v414-dnd">'+
        '<span><b>No molestar</b><small>Silencia avisos durante este horario</small></span>'+
        '<label class="v414-switch-only"><input type="checkbox" data-v414-pref="doNotDisturb" '+(n.doNotDisturb!==false?'checked':'')+'><i></i></label>'+
        '<div class="v414-hours"><label>Desde <input type="time" data-v414-quiet-start value="'+esc(quiet.start||'00:00')+'"></label><span>a</span><label>Hasta <input type="time" data-v414-quiet-end value="'+esc(quiet.end||'08:00')+'"></label></div>'+
      '</div>'+
    '</div>'+
    '<div class="v414-category-list">'+
      V414_CATEGORIES.map(([k,title,desc,ico])=>{
        const p=categoryPrefs[k]||{};
        return '<div class="v414-category-wrap" data-v414-category-wrap="'+k+'">'+
          '<button class="v414-category-row" type="button" data-v414-category="'+k+'">'+
            '<span class="v414-sport-icon">'+ico+'</span><span><b>'+esc(title)+'</b><small>'+esc(desc)+'</small></span><i>›</i>'+
          '</button>'+
          '<div class="v414-category-panel" data-v414-category-panel="'+k+'">'+
            '<label><span>Activar categoría</span><input type="checkbox" data-v414-cat-pref="'+k+':enabled" '+(p.enabled!==false?'checked':'')+'><i></i></label>'+
            '<label><span>Goles</span><input type="checkbox" data-v414-cat-pref="'+k+':goal" '+(p.goal!==false?'checked':'')+'><i></i></label>'+
            '<label><span>Inicio</span><input type="checkbox" data-v414-cat-pref="'+k+':kickoff" '+(p.kickoff!==false?'checked':'')+'><i></i></label>'+
            '<label><span>Medio tiempo</span><input type="checkbox" data-v414-cat-pref="'+k+':halftime" '+(p.halftime!==false?'checked':'')+'><i></i></label>'+
            '<label><span>Final</span><input type="checkbox" data-v414-cat-pref="'+k+':final" '+(p.final!==false?'checked':'')+'><i></i></label>'+
          '</div>'+
        '</div>';
      }).join('')+
    '</div>'+
    '<div class="v414-match-types">'+
      '<label class="v414-setting"><span><b>Goles</b><small>Avisos globales de gol</small></span><input type="checkbox" data-v414-pref="goal" '+(n.goal!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Inicio del partido</b><small>Cuando arranque un encuentro</small></span><input type="checkbox" data-v414-pref="kickoff" '+(n.kickoff!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Medio tiempo</b><small>Al terminar el primer tiempo</small></span><input type="checkbox" data-v414-pref="halftime" '+(n.halftime!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Final del partido</b><small>Al concluir el encuentro</small></span><input type="checkbox" data-v414-pref="final" '+(n.final!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Cambios de horario</b><small>Modificaciones de jornada</small></span><input type="checkbox" data-v414-pref="scheduleChanges" '+(n.scheduleChanges!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Cambios de sede</b><small>Cambios de campo o cancha</small></span><input type="checkbox" data-v414-pref="venueChanges" '+(n.venueChanges!==false?'checked':'')+'><i></i></label>'+
      '<label class="v414-setting"><span><b>Transferencias</b><small>Movimientos oficiales publicados</small></span><input type="checkbox" data-v414-pref="transfers" '+(n.transfers!==false?'checked':'')+'><i></i></label>'+
    '</div>'+
  '</section>';
}
function bindNotifications(root){
  const savePref=(key,value)=>{
    const s=readStore();s.notifications=Object.assign({},s.notifications||{},{[key]:value});writeStore(s);
  };
  root.querySelectorAll('[data-v414-pref]').forEach(i=>i.onchange=()=>{
    savePref(i.dataset.v414Pref,i.checked);
    if(i.dataset.v414Pref==='vibration'&&i.checked){try{navigator.vibrate?.(70)}catch(_){}}
    if(i.dataset.v414Pref==='sounds'&&i.checked){
      try{
        const C=window.AudioContext||window.webkitAudioContext;if(C){const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=760;g.gain.value=.025;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.07)}
      }catch(_){}
    }
  });
  root.querySelector('[data-v414-master]')?.addEventListener('change',e=>{
    const on=e.target.checked;savePref('enabled',on);
    root.querySelectorAll('[data-v414-pref]').forEach(i=>{if(['sounds','vibration','doNotDisturb'].includes(i.dataset.v414Pref))return;i.checked=on;savePref(i.dataset.v414Pref,on)});
  });
  const qStart=root.querySelector('[data-v414-quiet-start]'),qEnd=root.querySelector('[data-v414-quiet-end]');
  [qStart,qEnd].forEach(i=>i&&(i.onchange=()=>writeJson('v413-quiet-hours',{start:qStart.value||'00:00',end:qEnd.value||'08:00'})));
  root.querySelector('[data-v414-device]')?.addEventListener('click',async e=>{
    const btn=e.currentTarget,copy=root.querySelector('[data-v414-device-copy]');
    try{
      if(!('Notification' in window)){copy.textContent='Este navegador no permite notificaciones web. Revisa los permisos de la app o del navegador.';return}
      if(Notification.permission==='default'){
        const result=await Notification.requestPermission();
        if(result==='granted'){copy.textContent='Las notificaciones del dispositivo están activadas para Liga Juventino Rosas.';btn.textContent='Notificaciones activadas';savePref('devicePermission',true)}
        else if(result==='denied'){copy.textContent='Las notificaciones quedaron bloqueadas. Actívalas desde los permisos del navegador o de la app.';btn.textContent='Configuración del dispositivo'}
      }else if(Notification.permission==='granted'){
        copy.textContent='Las notificaciones del dispositivo están activadas para Liga Juventino Rosas.';btn.textContent='Notificaciones activadas';
      }else{
        copy.textContent='Las notificaciones están bloqueadas. Abre los permisos del sitio o de la app desde Android para activarlas.';
        btn.textContent='Permiso bloqueado';
      }
    }catch(_){copy.textContent='No se pudo abrir el permiso automáticamente. Revisa los permisos del sitio o de la app en Android.'}
  });
  root.querySelectorAll('[data-v414-category]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.v414Category,wrap=root.querySelector('[data-v414-category-wrap="'+k+'"]');
    const open=wrap?.classList.contains('open');
    root.querySelectorAll('[data-v414-category-wrap]').forEach(x=>x.classList.remove('open'));
    if(wrap&&!open)wrap.classList.add('open');
  });
  root.querySelectorAll('[data-v414-cat-pref]').forEach(i=>i.onchange=()=>{
    const [cat,key]=String(i.dataset.v414CatPref||'').split(':');
    const prefs=v414CategoryPrefs();prefs[cat]=Object.assign({},prefs[cat]||{},{[key]:i.checked});writeJson('v414-category-notifications',prefs);
    if(cat==='football'&&key==='enabled'){
      const on=i.checked;
      V414_CATEGORIES.forEach(([k])=>{prefs[k]=Object.assign({},prefs[k]||{},{enabled:on})});
      writeJson('v414-category-notifications',prefs);
      root.querySelectorAll('[data-v414-cat-pref$=":enabled"]').forEach(x=>x.checked=on);
    }
  });
}

/* ---------- FICHAJES ---------- */
function transferRows(){
  const out=[];
  $$('.transfer-row',document.querySelector('#screen')||document).forEach(el=>{
    const txt=(el.innerText||'').replace(/\s+/g,' ').trim();
    if(txt&&!out.includes(txt))out.push(txt);
  });
  return out.slice(0,8);
}
function transfersMarkup(){
  const rows=transferRows();
  return section('MERCADO MUNICIPAL','Centro de fichajes','Movimientos de jugadores adaptados al diseño de la Liga. Solo se muestran datos publicados.',
    '<div class="v413-transfer-tools"><button class="active" type="button" data-v413-transfer-filter="all">Todos</button><button type="button" data-v413-transfer-filter="official">Confirmados</button><button type="button" data-v413-transfer-filter="renewal">Renovaciones</button></div>'+
    '<div class="v413-transfer-list">'+(rows.length?rows.map((x,i)=>'<article class="v413-transfer-card"><small>MOVIMIENTO PUBLICADO</small><div class="v413-transfer-avatar">⚽</div><b>'+esc(x)+'</b><span>Información tomada de la sección oficial visible en la app.</span></article>').join(''):'<div class="v413-transfer-empty"><div>⇄</div><h3>Sin movimientos oficiales publicados</h3><p>La sección queda lista para mostrar altas, bajas o renovaciones cuando la Liga publique información oficial.</p></div>')+'</div>'
  );
}
function bindTransfers(root){
  root.querySelectorAll('[data-v413-transfer-filter]').forEach(b=>b.onclick=()=>{
    root.querySelectorAll('[data-v413-transfer-filter]').forEach(x=>x.classList.toggle('active',x===b));
  });
}

/* ---------- NOTICIAS ---------- */
function newsItems(){
  const out=[];
  $$('.news-row',document.querySelector('#screen')||document).forEach((el,i)=>{
    const small=el.querySelector('small')?.textContent?.trim()||'Liga Juventino';
    const title=el.querySelector('b')?.textContent?.trim()||'Noticia';
    const p=el.querySelector('p')?.textContent?.trim()||'';
    out.push({i,small,title,p});
  });
  return out.slice(0,6);
}
function newsKind(n){
  const meta=norm(n?.small||'');
  const txt=norm((n?.small||'')+' '+(n?.title||'')+' '+(n?.p||''));
  if(/fichaj|transfer|alta|baja|renovacion|refuerzo|movimiento/.test(txt))return 'fichajes';
  if(/^(liga|jornada|torneo|copa)\b/.test(meta))return 'liga';
  if(/^(clasificacion|datos|equipos?|plantillas?)\b/.test(meta))return 'equipos';
  if(/clasificacion|plantilla|equipo|club|san jose|juventus|linces|boavista|manchester|dynamo|esperanza/.test(txt))return 'equipos';
  if(/liga|jornada|torneo|copa|comunicado|aviso|calendario|partido/.test(txt))return 'liga';
  return 'para';
}
function newsMarkup(){
  const items=newsItems();
  return section('ACTUALIDAD','Para ti','Noticias y comunicados acomodados como un feed deportivo, usando el contenido que ya existe en la Liga.',
    '<div class="v413-news-tabs" role="tablist" aria-label="Filtros de noticias">'+
      '<button class="active" type="button" role="tab" aria-selected="true" data-v413-news-filter="all">Para ti</button>'+
      '<button type="button" role="tab" aria-selected="false" data-v413-news-filter="liga">Liga</button>'+
      '<button type="button" role="tab" aria-selected="false" data-v413-news-filter="equipos">Equipos</button>'+
      '<button type="button" role="tab" aria-selected="false" data-v413-news-filter="fichajes">Fichajes</button>'+
    '</div>'+
    '<div class="v413-news-feed" data-v413-news-feed>'+(items.length?items.map(n=>'<article class="v413-news-card" data-v413-news-kind="'+newsKind(n)+'"><div><small>'+esc(n.small)+'</small><h3>'+esc(n.title)+'</h3><p>'+esc(n.p)+'</p></div><span class="v413-news-thumb">LJR</span></article>').join(''):'<div class="v413-empty">Cuando haya noticias visibles en esta sección aparecerán aquí con este diseño.</div>')+'</div>'
  );
}
function bindNews(root){
  if(!root)return;
  let mode=root.dataset.v413NewsMode||'all';
  const labels={all:'Para ti',liga:'Liga',equipos:'Equipos',fichajes:'Fichajes'};
  const title=root.querySelector('.v413-head h2');
  const feed=root.querySelector('[data-v413-news-feed]');
  const render=()=>{
    if(!feed)return;
    feed.querySelector('.v413-news-empty')?.remove();
    let shown=0;
    feed.querySelectorAll('.v413-news-card').forEach(card=>{
      const kind=card.dataset.v413NewsKind||'para';
      const visible=mode==='all'||kind===mode;
      card.hidden=!visible;
      if(visible)shown++;
    });
    root.querySelectorAll('[data-v413-news-filter]').forEach(b=>{
      const active=(b.dataset.v413NewsFilter||'all')===mode;
      b.classList.toggle('active',active);
      b.setAttribute('aria-selected',active?'true':'false');
    });
    if(title)title.textContent=labels[mode]||'Para ti';
    if(!shown){
      const empty=document.createElement('div');
      empty.className='v413-empty v413-news-empty';
      empty.innerHTML=mode==='fichajes'
        ?'<b>Sin fichajes publicados</b><span>Cuando la Liga publique altas, bajas o movimientos aparecerán aquí.</span><button type="button" data-v413-open-transfers>Abrir centro de fichajes</button>'
        :'<b>Sin noticias en esta sección</b><span>Las nuevas publicaciones aparecerán aquí automáticamente.</span>';
      feed.appendChild(empty);
      empty.querySelector('[data-v413-open-transfers]')?.addEventListener('click',()=>go('transfers'));
    }
  };
  root.querySelectorAll('[data-v413-news-filter]').forEach(b=>{
    b.onclick=e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      mode=b.dataset.v413NewsFilter||'all';
      root.dataset.v413NewsMode=mode;
      render();
    };
  });
  render();
}

/* ---------- BUSCAR ---------- */
function searchMarkup(){
  const t=teamList().slice(0,10);
  return section('BUSCAR EN LA LIGA','Equipos y jugadores','Encuentra clubes y jugadores registrados con una vista más visual.',
    '<div class="v413-search-tabs"><button class="active" type="button" data-v413-mode="teams">Equipos</button><button type="button" data-v413-mode="players">Jugadores</button></div>'+
    '<div class="v413-fav-strip">'+t.slice(0,5).map(x=>'<button type="button" class="v413-fav-tile" data-v413-team="'+esc(x.name)+'">'+logoHtml(x)+'<b>'+esc(x.name)+'</b></button>').join('')+'</div>'+
    '<div class="v413-search"><span>⌕</span><input type="search" data-v413-global placeholder="Buscar en la Liga"></div>'+
    '<div class="v413-search-results" data-v413-search-results></div>'
  );
}
function bindSearch(root){
  let mode='teams',selectedTeam='';
  const input=root.querySelector('[data-v413-global]'),host=root.querySelector('[data-v413-search-results]');
  const openPlayerDetail=(name,team,cat='')=>{
    const p={name:String(name||''),team:String(team||''),cat:String(cat||'')};
    try{
      localStorage.setItem('v379-player-profile',JSON.stringify(p));
      localStorage.setItem('v379-player-profile-tab','Resumen');
      localStorage.removeItem('v123-compare-player');
      localStorage.removeItem('v123-compare-player-2');
    }catch(_){}
    if(window.LJR_PLAYER_PROFILE_API?.open){window.LJR_PLAYER_PROFILE_API.open(p);return}
    location.hash='#/playerDetail';
  };
  const bindTeamButtons=()=>{
    root.querySelectorAll('[data-v413-team]').forEach(b=>b.onclick=e=>{
      e.preventDefault();e.stopPropagation();
      const team=String(b.dataset.v413Team||'').trim();
      if(mode==='players'){
        selectedTeam=team;
        root.querySelectorAll('.v413-fav-tile[data-v413-team]').forEach(x=>x.classList.toggle('is-selected',norm(x.dataset.v413Team)===norm(selectedTeam)));
        if(input)input.value='';
        render();
        host?.scrollIntoView({behavior:'smooth',block:'nearest'});
        return;
      }
      try{localStorage.setItem('v62-team-name',team)}catch(_){}
      go('teamDetail');
    });
  };
  const render=()=>{
    const q=norm(input?.value||'');
    if(input)input.placeholder=mode==='players'?(selectedTeam?'Buscar jugador en '+selectedTeam:'Selecciona un equipo o busca jugador'):'Buscar equipo en la Liga';
    if(mode==='teams'){
      selectedTeam='';
      root.querySelectorAll('.v413-fav-tile[data-v413-team]').forEach(x=>x.classList.remove('is-selected'));
      const list=teamList().filter(t=>!q||norm(t.name+' '+t.category).includes(q)).slice(0,14);
      host.innerHTML=list.map(t=>'<button class="v413-result" type="button" data-v413-team="'+esc(t.name)+'">'+logoHtml(t)+'<span><b>'+esc(t.name)+'</b><small>'+esc(t.category)+'</small></span><i>›</i></button>').join('')||'<div class="v413-empty">No se encontró ese equipo.</div>';
    }else{
      let list=playerList();
      if(selectedTeam)list=list.filter(p=>norm(p.team)===norm(selectedTeam));
      if(q)list=list.filter(p=>norm(p.name+' '+p.team+' '+p.category).includes(q));
      list.sort((a,b)=>a.name.localeCompare(b.name,'es'));
      const head=selectedTeam?'<div class="v413-player-team-head"><b>'+esc(selectedTeam)+'</b><span>'+list.length+' jugadores</span><button type="button" data-v413-clear-team>Ver todos</button></div>':'<div class="v413-player-team-head"><b>Todos los jugadores</b><span>'+list.length+' registrados</span></div>';
      host.innerHTML=head+(list.map(p=>'<button class="v413-result v413-player-result" type="button" data-v413-player="'+esc(p.name)+'" data-v413-player-team="'+esc(p.team)+'" data-v413-player-cat="'+esc(p.cat||'')+'">'+playerAvatar(p)+'<span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+(p.position?' · '+esc(p.position):'')+'</small></span><i>›</i></button>').join('')||'<div class="v413-empty">No se encontraron jugadores para este equipo.</div>');
      host.querySelector('[data-v413-clear-team]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();selectedTeam='';root.querySelectorAll('.v413-fav-tile[data-v413-team]').forEach(x=>x.classList.remove('is-selected'));render()});
    }
    bindTeamButtons();
    host.querySelectorAll('[data-v413-player]').forEach(b=>b.onclick=e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      openPlayerDetail(b.dataset.v413Player,b.dataset.v413PlayerTeam||selectedTeam,b.dataset.v413PlayerCat||'');
    });
  };
  root.querySelectorAll('[data-v413-mode]').forEach(b=>b.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    mode=b.dataset.v413Mode;
    root.querySelectorAll('[data-v413-mode]').forEach(x=>x.classList.toggle('active',x===b));
    if(mode==='players'&&input)input.value='';
    render();
  });
  bindTeamButtons();

  /* V636 hardfix: while this card is in Jugadores mode, a team tap is ONLY
     a roster filter. Capture phase prevents any older/global handler from
     redirecting the same tap to Comparar jugadores. */
  root.addEventListener('click',e=>{
    if(route()!=='search')return;
    const modeBtn=e.target.closest('[data-v413-mode]');
    if(modeBtn){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      mode=modeBtn.dataset.v413Mode||'teams';
      root.querySelectorAll('[data-v413-mode]').forEach(x=>x.classList.toggle('active',x===modeBtn));
      if(mode==='players'&&input)input.value='';
      render();
      return;
    }
    const teamBtn=e.target.closest('[data-v413-team]');
    if(teamBtn&&mode==='players'){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      selectedTeam=String(teamBtn.dataset.v413Team||'').trim();
      try{
        localStorage.removeItem('v123-compare-player');
        localStorage.removeItem('v123-compare-player-2');
      }catch(_){}
      root.querySelectorAll('.v413-fav-tile[data-v413-team]').forEach(x=>x.classList.toggle('is-selected',norm(x.dataset.v413Team)===norm(selectedTeam)));
      if(input)input.value='';
      render();
      requestAnimationFrame(()=>host?.scrollIntoView({behavior:'smooth',block:'nearest'}));
      return;
    }
    const playerBtn=e.target.closest('[data-v413-player]');
    if(playerBtn&&mode==='players'){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      openPlayerDetail(playerBtn.dataset.v413Player,playerBtn.dataset.v413PlayerTeam||selectedTeam,playerBtn.dataset.v413PlayerCat||'');
    }
  },true);

  if(input)input.oninput=render;
  render();
}

/* ---------- MATCH CENTER ---------- */
function matchAlertsMarkup(){
  const p=readJson('v413-match-alerts',{goal:true,half:true,final:true});
  return section('PARTIDO EN VIVO','Avisos del partido','Controles propios del Match Center para no mezclar estas opciones con Favoritos o Noticias.',
    '<div class="v413-match-alerts"><label class="v413-match-alert"><span>⚽</span><b>Gol</b><input type="checkbox" data-v413-match-alert="goal" '+(p.goal?'checked':'')+'><i></i></label><label class="v413-match-alert"><span>⏱</span><b>Medio tiempo</b><input type="checkbox" data-v413-match-alert="half" '+(p.half?'checked':'')+'><i></i></label><label class="v413-match-alert"><span>🏁</span><b>Final del partido</b><input type="checkbox" data-v413-match-alert="final" '+(p.final?'checked':'')+'><i></i></label></div>'
  );
}
function bindMatchAlerts(root){
  root.querySelectorAll('[data-v413-match-alert]').forEach(i=>i.onchange=()=>{
    const p=readJson('v413-match-alerts',{goal:true,half:true,final:true});p[i.dataset.v413MatchAlert]=i.checked;writeJson('v413-match-alerts',p);
  });
}

/* ---------- SOCIAL SOLO EN PERFIL/MÁS ---------- */
function socialMarkup(){
  return section('COMUNIDAD','Síguenos','Conecta con la Liga Juventino y consulta publicaciones, jornadas, fotografías y avisos oficiales.',
    '<button type="button" class="v413-facebook v523-social-card" data-v413-facebook><span class="v523-social-icon">f</span><div class="v523-social-copy"><small>FACEBOOK OFICIAL</small><b>Liga Juventino</b><em>Publicaciones · Jornadas · Fotografías · Avisos</em></div><i>↗</i></button>'
  ).replace('class="v413-shell"','class="v413-shell v556-social-transparent"');
}

function contentFor(r){
  if(['v4-calendar','calendar','monthlyCalendar','calendarMonthly'].includes(r))return {html:calendarMarkup(),bind:bindCalendar};
  if(r==='following')return {html:favoritesMarkup(),bind:bindFavorites};
  if(['news','v38Weekly'].includes(r))return {html:newsMarkup(),bind:bindNews};
  if(r==='search')return {html:searchMarkup(),bind:bindSearch};
  if(['matchCenter','match-center','v4-matchcenter'].includes(r))return {html:matchAlertsMarkup(),bind:bindMatchAlerts};
  if(['profile','more'].includes(r))return {html:socialMarkup(),bind:root=>root.querySelector('[data-v413-facebook]')?.addEventListener('click',()=>window.open(FB,'_blank','noopener,noreferrer'))};
  return null;
}
function mount(){
  const screen=$('#screen');if(!screen)return;
  const r=route(),old=$('#'+ID,screen);
  if(!ROUTES.has(r)){old?.remove();return}
  const cfg=contentFor(r);if(!cfg){old?.remove();return}

  const isMatchCenter=['matchCenter','match-center','v4-matchcenter'].includes(r);
  const isWeekly=['news','v38Weekly'].includes(r);
  const isMore=r==='more';

  const placeMatchAlerts=(node)=>{
    const target=screen.querySelector('[data-v518-extras]')||screen;
    const banner=target.querySelector(':scope > .v73-matchcenter-bottom[data-v73-motion-banner]')||
                 screen.querySelector(':scope > .v73-matchcenter-bottom[data-v73-motion-banner]');
    if(banner){
      if(banner.parentElement!==target)target.appendChild(banner);
      if(node.parentElement!==target||node.nextElementSibling!==banner)target.insertBefore(node,banner);
    }else if(node.parentElement!==target||target.lastElementChild!==node){
      target.appendChild(node);
    }
  };

  /* V517 — bloqueo de posición para Noticias / Lo importante de la semana.
     En estas rutas el bloque NO se vuelve a mover cada vez que otro módulo
     modifica #screen. Así se elimina el ping-pong V413 ↔ V105 que provocaba
     que Android saltara de "Para ti" a "Noticias, avisos y juntas". */
  const placeWeeklyOnce=(node)=>{
    const v105=screen.querySelector(':scope > #v105-bottom');
    if(v105){
      screen.insertBefore(node,v105);
      return;
    }
    const native=screen.querySelector(':scope > .v60-tool-page.v63-page.v188-weekly-page')||
                 screen.querySelector(':scope > .v60-tool-page');
    if(native&&native.parentElement===screen){
      native.insertAdjacentElement('afterend',node);
    }else{
      screen.appendChild(node);
    }
  };

  const placeMoreSocial=(node)=>{
    const page=screen.querySelector(':scope > .v19-more-page');
    if(page){
      if(node.parentElement!==page||page.lastElementChild!==node)page.appendChild(node);
      return;
    }
    if(screen.lastElementChild!==node)screen.appendChild(node);
  };

  const placeStandard=(node)=>{
    const v105=screen.querySelector(':scope > #v105-bottom');
    if(v105){
      if(node.nextElementSibling!==v105)screen.insertBefore(node,v105);
    }else if(screen.lastElementChild!==node){
      screen.appendChild(node);
    }
  };

  if(old&&old.dataset.v413Route===r){
    if(isWeekly){cfg.bind(old);return} // posición congelada; filtros siempre re-enlazados
    if(isMatchCenter)placeMatchAlerts(old);
    else if(isMore)placeMoreSocial(old);
    else placeStandard(old);
    /* V641 — Following puede ser reinsertado/reconstruido por otros módulos.
       Reasignar onclick/oninput es idempotente y evita que tabs, estrella y buscador
       queden visuales pero sin eventos. */
    if(r==='following'||isWeekly)cfg.bind(old);
    return;
  }

  old?.remove();
  const wrap=document.createElement('div');wrap.innerHTML=cfg.html;
  const node=wrap.firstElementChild;if(!node)return;
  node.dataset.v413Route=r;

  if(isWeekly)placeWeeklyOnce(node);
  else if(isMatchCenter)placeMatchAlerts(node);
  else if(isMore)placeMoreSocial(node);
  else placeStandard(node);

  cfg.bind(node);
}
function remount(){const screen=$('#screen');screen?.querySelector('#'+ID)?.remove();mount()}
function schedule(ms=90){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(100));
window.addEventListener('load',()=>schedule(220));
document.addEventListener('DOMContentLoaded',()=>schedule(140),{once:true});
const screen=$('#screen');
if(screen)new MutationObserver(()=>schedule(100)).observe(screen,{childList:true,subtree:false});
schedule(160);setTimeout(()=>schedule(0),900);setTimeout(()=>schedule(0),2200);
})();