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
  const out=[],seen=new Set();
  Object.values(db()?.categories||{}).forEach(cat=>{
    const cname=cat?.name||'Liga Municipal';
    Object.entries(cat?.rosters||{}).forEach(([team,raw])=>{
      const rows=Array.isArray(raw)?raw:(raw?.rows||raw?.players||[]);
      rows.forEach(r=>{
        const name=String(Array.isArray(r)?(r[1]||r[0]||''):(r?.name||r?.player||'')).trim();
        if(!name||seen.has(norm(name))||/^(nombre|jugador|tabla|goleadores)$/i.test(name))return;
        seen.add(norm(name));
        out.push({name,team,category:cname});
      });
    });
  });
  return out.slice(0,180);
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
function favoriteNames(){const v=readJson('v413-favorite-teams',[]);return Array.isArray(v)?v:[]}
function isFav(name){return favoriteNames().includes(norm(name))}
function toggleFav(name){
  const n=norm(name),set=new Set(favoriteNames());
  set.has(n)?set.delete(n):set.add(n);writeJson('v413-favorite-teams',Array.from(set));
}
function favoritesMarkup(){
  const list=teamList();
  const favs=list.filter(t=>isFav(t.name));
  const show=(favs.length?favs:list).slice(0,12);
  return section('MI LIGA','Equipos y favoritos','Busca, sigue y guarda equipos reales de la Liga.',
    '<div class="v413-follow-tabs"><button class="active" type="button">Todos</button><button type="button">Favoritos ('+favs.length+')</button><button type="button">Equipos ('+list.length+')</button></div>'+
    '<div class="v413-fav-strip">'+show.slice(0,5).map(t=>'<button type="button" class="v413-fav-tile" data-v413-team="'+esc(t.name)+'">'+(isFav(t.name)?'<i>★</i>':'')+logoHtml(t)+'<b>'+esc(t.name)+'</b></button>').join('')+'</div>'+
    '<div class="v413-search"><span>⌕</span><input type="search" data-v413-team-search placeholder="Buscar equipo"></div>'+
    '<div class="v413-team-list" data-v413-team-list>'+list.slice(0,12).map(teamRow).join('')+'</div>'
  );
}
function teamRow(t){
  return '<div class="v413-team-row"><button type="button" data-v413-team="'+esc(t.name)+'">'+logoHtml(t)+'<span><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Liga Municipal')+'</small></span></button><button type="button" class="v413-star '+(isFav(t.name)?'on':'')+'" data-v413-star="'+esc(t.name)+'">'+(isFav(t.name)?'★':'☆')+'</button></div>';
}
function bindFavorites(root){
  const bindRows=()=>{
    root.querySelectorAll('[data-v413-team]').forEach(b=>b.onclick=()=>{
      try{localStorage.setItem('v62-team-name',b.dataset.v413Team)}catch(_){}
      location.hash='#/teamDetail';
    });
    root.querySelectorAll('[data-v413-star]').forEach(b=>b.onclick=()=>{toggleFav(b.dataset.v413Star);remount()});
  };
  bindRows();
  const input=root.querySelector('[data-v413-team-search]');
  if(input)input.oninput=()=>{
    const q=norm(input.value),list=teamList().filter(t=>!q||norm(t.name+' '+t.category).includes(q)).slice(0,18);
    root.querySelector('[data-v413-team-list]').innerHTML=list.map(teamRow).join('')||'<div class="v413-empty">No se encontró ese equipo.</div>';bindRows();
  };
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
function newsMarkup(){
  const items=newsItems();
  return section('ACTUALIDAD','Para ti','Noticias y comunicados acomodados como un feed deportivo, usando el contenido que ya existe en la Liga.',
    '<div class="v413-news-tabs"><button class="active" type="button">Para ti</button><button type="button">Liga</button><button type="button">Equipos</button><button type="button">Fichajes</button></div>'+
    '<div class="v413-news-feed">'+(items.length?items.map(n=>'<article class="v413-news-card"><div><small>'+esc(n.small)+'</small><h3>'+esc(n.title)+'</h3><p>'+esc(n.p)+'</p></div><span class="v413-news-thumb">LJR</span></article>').join(''):'<div class="v413-empty">Cuando haya noticias visibles en esta sección aparecerán aquí con este diseño.</div>')+'</div>'
  );
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
  let mode='teams';
  const input=root.querySelector('[data-v413-global]'),host=root.querySelector('[data-v413-search-results]');
  const render=()=>{
    const q=norm(input?.value||'');
    if(mode==='teams'){
      const list=teamList().filter(t=>!q||norm(t.name+' '+t.category).includes(q)).slice(0,14);
      host.innerHTML=list.map(t=>'<button class="v413-result" type="button" data-v413-team="'+esc(t.name)+'">'+logoHtml(t)+'<span><b>'+esc(t.name)+'</b><small>'+esc(t.category)+'</small></span><i>›</i></button>').join('')||'<div class="v413-empty">No se encontró ese equipo.</div>';
    }else{
      const list=playerList().filter(p=>!q||norm(p.name+' '+p.team).includes(q)).slice(0,18);
      host.innerHTML=list.map(p=>'<button class="v413-result" type="button" data-v413-player="'+esc(p.name)+'"><span class="v413-player-ball">⚽</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+'</small></span><i>›</i></button>').join('')||'<div class="v413-empty">No se encontró ese jugador.</div>';
    }
    host.querySelectorAll('[data-v413-team]').forEach(b=>b.onclick=()=>{try{localStorage.setItem('v62-team-name',b.dataset.v413Team)}catch(_){};go('teamDetail')});
    host.querySelectorAll('[data-v413-player]').forEach(b=>b.onclick=()=>{try{localStorage.setItem('v66-player-query',b.dataset.v413Player)}catch(_){};go('players')});
  };
  root.querySelectorAll('[data-v413-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.v413Mode;root.querySelectorAll('[data-v413-mode]').forEach(x=>x.classList.toggle('active',x===b));render()});
  root.querySelectorAll('[data-v413-team]').forEach(b=>b.onclick=()=>{try{localStorage.setItem('v62-team-name',b.dataset.v413Team)}catch(_){};go('teamDetail')});
  if(input)input.oninput=render;render();
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
  return section('COMUNIDAD','Síguenos','La red social queda únicamente al final de Perfil/Más, no dentro de otras herramientas.',
    '<button type="button" class="v413-facebook" data-v413-facebook><span>f</span><div><b>Facebook · Golazo Liga</b><small>Publicaciones, fotografías, jornadas y avisos</small></div><i>↗</i></button>'
  );
}

function contentFor(r){
  if(['v4-calendar','calendar','monthlyCalendar','calendarMonthly'].includes(r))return {html:calendarMarkup(),bind:bindCalendar};
  if(r==='following')return {html:favoritesMarkup(),bind:bindFavorites};
  if(['news','v38Weekly'].includes(r))return {html:newsMarkup(),bind:()=>{}};
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
  const placeMatchAlerts=(node)=>{
    const banner=screen.querySelector(':scope > .v73-matchcenter-bottom[data-v73-motion-banner]');
    if(banner){
      if(node.nextElementSibling!==banner)screen.insertBefore(node,banner);
    }else if(screen.lastElementChild!==node){
      screen.appendChild(node);
    }
  };

  if(old&&old.dataset.v413Route===r&&old.parentElement===screen){
    if(isMatchCenter)placeMatchAlerts(old);
    else if(screen.lastElementChild!==old)screen.appendChild(old);
    return;
  }
  old?.remove();
  const wrap=document.createElement('div');wrap.innerHTML=cfg.html;
  const node=wrap.firstElementChild;if(!node)return;
  node.dataset.v413Route=r;
  if(isMatchCenter)placeMatchAlerts(node);else screen.appendChild(node);
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