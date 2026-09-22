/* V103 — restauración puntual de Inicio + Calendario.
   Mantiene las funciones existentes y sólo corrige posición, tamaño y navegación. */
(function(){
'use strict';

const route=()=>location.hash.replace('#/','')||'home';
const screen=()=>document.querySelector('#screen');
const OFFICIAL='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json';
const HOME_IMAGE='https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/23f05376-ed2b-4ddb-a074-24f77221b520.png';
let db=window.LJR_OFFICIAL_DATA||null;
let loading=null;
let viewDate=new Date();
let selectedIso='';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

async function loadOfficial(){
  if(db)return db;
  if(loading)return loading;
  loading=fetch(OFFICIAL+'?v='+Date.now(),{cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(x=>{if(x){db=x;window.LJR_OFFICIAL_DATA=x}return db})
    .catch(()=>null);
  return loading;
}

function homeImageMarkup(){
  return '<section class="v103-home-image-feature" data-v103-home-image>'+
    '<img class="v103-home-image" src="'+HOME_IMAGE+'" alt="Fútbol de la Liga Juventino Rosas" loading="eager" decoding="async">'+
    '<span class="v103-home-image-shade" aria-hidden="true"></span>'+
    '<div class="v103-home-image-copy"><small>MOMENTOS DE LA LIGA</small><h2>Mira todos los goles de la Jornada 1</h2><p>La pasión del fútbol local en un solo lugar</p></div>'+
    '<button type="button" class="v103-home-image-hit" data-safe-route="video" aria-label="Abrir videos de la Liga"></button>'+
  '</section>';
}

function homeUpcomingMarkup(){
  const games=[
    {home:'Franco FC',away:'Herreras FC',time:'08:00'},
    {home:'Terricolas',away:'Galacticos',time:'08:00'}
  ];
  return '<div class="v103-upcoming-wrap" data-v103-upcoming>'+
    '<div class="v103-upcoming-head"><h2>Próximos partidos</h2><button type="button" data-safe-route="v4-calendar">Calendario</button></div>'+
    '<div class="v103-upcoming-card">'+
      '<div class="v103-upcoming-meta"><span><i></i>EN VIVO · Jornada 5</span><b>18:00</b></div>'+
      games.map((g,i)=>
        '<button type="button" class="v103-upcoming-match'+(i?' is-second':'')+'" data-route="competition" aria-label="'+esc(g.home)+' contra '+esc(g.away)+'">'+
          '<span class="v103-upcoming-team home"><b>'+esc(g.home)+'</b>'+teamMark(g.home)+'</span>'+
          '<strong>'+esc(g.time)+'</strong>'+
          '<span class="v103-upcoming-team away">'+teamMark(g.away)+'<b>'+esc(g.away)+'</b></span>'+
        '</button>'
      ).join('')+
    '</div>'+
  '</div>';
}

function patchHome(){
  if(route()!=='home')return;
  const root=screen();if(!root)return;

  /* V114 — mantener sólo la imagen principal original.
     La segunda imagen repetida se sustituye por Próximos partidos. */
  root.querySelectorAll('[data-v103-home-image]').forEach(el=>el.remove());

  /* V112 — Restaurar el Inicio anterior:
     - el cuadro PRINCIPAL vertical con imagen va inmediatamente después de Historias;
     - debajo quedan los dos cuadros de Momentos;
     - más abajo queda UNA sola sección de Próximos partidos;
     - no tocar los demás cuadros. */
  const storiesNow=root.querySelector(':scope > .stories');
  const moments=[...root.querySelectorAll(':scope > .section')].find(s=>
    /^Momentos$/i.test((s.querySelector('.section-head h2,h2')?.textContent||'').trim())
  );
  let hero=root.querySelector(':scope > .section.hero');

  if(hero){
    hero.classList.remove('v103-upcoming-host');
    hero.dataset.v15HomeFeature='3';
    if(!hero.querySelector('.v21-home-feature-photo')){
      hero.innerHTML=
        '<div class="v21-home-feature-photo" aria-hidden="true">'+
          '<img class="v21-home-feature-photo-image" src="./assets/home-players-user.jpg?v=20260919-user-photo-public-1" alt="" loading="eager" decoding="async" draggable="false">'+
          '<span class="v21-home-feature-photo-fade"></span>'+
        '</div>'+
        '<div class="v21-home-feature-copy">'+
          '<h2>Mira todos los goles de la Jornada 1</h2>'+
          '<p>La pasión del fútbol local en un solo lugar</p>'+
        '</div>'+
        '<button class="v15-home-feature-hit" type="button" aria-label="Ver todos los goles de la Jornada 1"></button>';
    }
    /* Debe quedar exactamente después de Historias, antes de Momentos. */
    if(storiesNow && storiesNow.nextElementSibling!==hero){
      storiesNow.insertAdjacentElement('afterend',hero);
    }
  }

  /* Los dos cuadros de Momentos permanecen inmediatamente debajo del principal. */
  if(hero && moments && hero.nextElementSibling!==moments){
    hero.insertAdjacentElement('afterend',moments);
  }

  /* Sustituir la SEGUNDA imagen repetida por el cuadro de Próximos partidos
     de la referencia, sin tocar la imagen principal ni los cuadros de Momentos. */
  let secondary=root.querySelector('[data-v114-upcoming-slot]');
  if(!secondary){
    secondary=document.createElement('section');
    secondary.className='v114-upcoming-slot';
    secondary.setAttribute('data-v114-upcoming-slot','');
    secondary.innerHTML=homeUpcomingMarkup();
  }
  if(moments && moments.nextElementSibling!==secondary){
    moments.insertAdjacentElement('afterend',secondary);
  }

  /* Eliminar el antiguo Próximos partidos nativo para que sólo exista el nuevo cuadro. */
  [...root.querySelectorAll(':scope > .section')].forEach(s=>{
    const title=(s.querySelector(':scope > .section-head h2')?.textContent||'').trim();
    if(/^Próximos\s+partidos$/i.test(title))s.remove();
  });

  /* Eliminar copias antiguas del cuadro, conservando sólo la del nuevo hueco. */
  root.querySelectorAll('[data-v103-upcoming]').forEach(el=>{
    if(!secondary.contains(el))el.remove();
  });

  /* Quitar el bloque grande duplicado de Datos; Datos oficiales permanece en "Más datos"
     y en el acceso compacto de Explora Liga. */
  root.querySelectorAll('.v6-league-data-home').forEach(el=>el.remove());

  /* Marcar "Más datos" para mostrar sus accesos en cuadros más pequeños. */
  root.querySelectorAll('.v6-section').forEach(s=>{
    const h=s.querySelector('.v6-section-head h2');
    if(h&&/^Más datos$/i.test(h.textContent.trim()))s.classList.add('v103-more-data');
  });
}

function logoFor(name){
  const key=Object.keys(db?.team_logos||{}).find(k=>norm(k)===norm(name));
  const v=key?db.team_logos[key]:null;
  const p=typeof v==='string'?v:(v?.local||v?.source||'');
  if(!p)return '';
  if(/^https?:/i.test(p))return p;
  return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(p).replace(/^\.\//,'');
}

function fixtureDate(value){
  const m=String(value||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return null;
  return {
    day:+m[1],month:+m[2]-1,year:+m[3],
    time:(m[4]&&m[5])?String(m[4]).padStart(2,'0')+':'+m[5]:'Por confirmar',
    iso:m[3]+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0')
  };
}

function calendarGames(){
  const rows=db?.categories?.['3']?.fixtures?.[0]?.rows||[];
  return rows.map((r,i)=>{
    const d=fixtureDate(r?.[8]);if(!d)return null;
    const hs=String(r?.[3]??'').trim(),as=String(r?.[5]??'').trim();
    const played=/^\d+$/.test(hs)||/^\d+$/.test(as);
    return {
      id:'official-'+i,iso:d.iso,year:d.year,month:d.month,day:d.day,time:d.time,
      round:String(r?.[1]||''),home:String(r?.[2]||'').trim(),away:String(r?.[6]||'').trim(),
      homeScore:/^\d+$/.test(hs)?hs:'0',awayScore:/^\d+$/.test(as)?as:'0',
      played,venue:String(r?.[7]||'Campo por confirmar').trim()||'Campo por confirmar'
    };
  }).filter(Boolean);
}

function teamMark(name){
  /* V115 — usar primero el registro global de escudos reales de Liga_Futbol.
     Así Franco, Herreras, Terrícolas y Galácticos muestran su logo y no iniciales. */
  let src='';
  try{src=window.LJR_TEAM_LOGOS?.get?.(name)||''}catch(_){}
  if(!src)src=logoFor(name);
  if(src)return '<span class="v103-cal-logo"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
  const ab=String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return '<span class="v103-cal-logo v103-cal-fallback">'+esc(ab||'EQ')+'</span>';
}

function monthName(month){
  return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][month]||'Calendario';
}

function matchList(iso){
  const games=calendarGames().filter(g=>g.iso===iso);
  if(!games.length)return '<div class="v103-cal-empty">No hay partidos oficiales publicados para esta fecha.</div>';
  return '<div class="v103-cal-match-list">'+games.map(g=>
    '<article class="v103-cal-match">'+
      '<div class="v103-cal-round">Jornada '+esc(g.round||'—')+' · '+esc(g.venue)+'</div>'+
      '<div class="v103-cal-pair">'+
        '<div>'+teamMark(g.home)+'<b>'+esc(g.home)+'</b></div>'+
        '<strong>'+(g.played?esc(g.homeScore+'–'+g.awayScore):esc(g.time))+'</strong>'+
        '<div>'+teamMark(g.away)+'<b>'+esc(g.away)+'</b></div>'+
      '</div>'+
      '<small>'+(g.played?'Resultado oficial':'Horario oficial')+'</small>'+
    '</article>'
  ).join('')+'</div>';
}

function renderCalendar(){
  if(route()!=='v4-calendar')return;
  const root=screen();if(!root)return;
  document.body.classList.add('v70-calendar-active','v103-calendar-active');

  const y=viewDate.getFullYear(),m=viewDate.getMonth();
  const first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),offset=(first.getDay()+6)%7;
  const monthGames=calendarGames().filter(g=>g.year===y&&g.month===m);
  const countByDay=new Map();
  monthGames.forEach(g=>countByDay.set(g.day,(countByDay.get(g.day)||0)+1));
  if(!selectedIso||!selectedIso.startsWith(y+'-'+String(m+1).padStart(2,'0')+'-')){
    const today=new Date();
    const preferred=(today.getFullYear()===y&&today.getMonth()===m)?today.getDate():(monthGames[0]?.day||1);
    selectedIso=y+'-'+String(m+1).padStart(2,'0')+'-'+String(preferred).padStart(2,'0');
  }

  let cells='';
  for(let i=0;i<offset;i++)cells+='<span class="v4-day empty"></span>';
  for(let d=1;d<=days;d++){
    const iso=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const n=countByDay.get(d)||0;
    cells+='<button type="button" class="v4-day '+(n?'has-match ':'')+(selectedIso===iso?'selected':'')+'" data-v103-date="'+iso+'"><b>'+d+'</b>'+(n?'<i>'+n+'</i>':'')+'</button>';
  }

  root.innerHTML=
    '<section class="v70-calendar-page v103-calendar-page" data-v103-calendar>'+
      '<div class="v103-calendar-head">'+
        '<button type="button" data-v103-month="-1" aria-label="Mes anterior">‹</button>'+
        '<div class="v70-calendar-title"><span class="v70-calendar-kicker">CALENDARIO</span><h1>'+monthName(m)+' '+y+'</h1><p>Jornadas y partidos oficiales de Primera Fuerza.</p></div>'+
        '<button type="button" data-v103-month="1" aria-label="Mes siguiente">›</button>'+
      '</div>'+
      '<div class="v4-week">'+['L','M','X','J','V','S','D'].map(x=>'<b>'+x+'</b>').join('')+'</div>'+
      '<div class="v4-calendar">'+cells+'</div>'+
      '<div class="v103-cal-selected"><h2>Partidos del '+selectedIso.split('-').reverse().join('/')+'</h2>'+matchList(selectedIso)+'</div>'+
    '</section>';

  root.querySelectorAll('[data-v103-date]').forEach(b=>b.addEventListener('click',()=>{
    selectedIso=b.dataset.v103Date||selectedIso;renderCalendar();
  }));
  root.querySelectorAll('[data-v103-month]').forEach(b=>b.addEventListener('click',()=>{
    const delta=Number(b.dataset.v103Month)||0;
    viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+delta,1);
    selectedIso='';renderCalendar();
  }));
}

function forceCalendarRoute(e){
  const hit=e.target.closest?.(
    '[data-safe-route="v4-calendar"],[data-v4-route="v4-calendar"],'+
    '.v78-home-calendar .link-button,.v6-section .link-button[data-route="competition"]'
  );
  if(!hit)return;
  const txt=(hit.textContent||'').toLowerCase();
  if(hit.matches('.v6-section .link-button[data-route="competition"]')&&!txt.includes('calendario'))return;
  e.preventDefault();
  e.stopImmediatePropagation();
  location.hash='#/v4-calendar';
  setTimeout(async()=>{await loadOfficial();renderCalendar()},30);
}

let patchQueued=false;
function queuePatch(){
  if(patchQueued)return;patchQueued=true;
  requestAnimationFrame(()=>{patchQueued=false;patchHome();if(route()==='v4-calendar')renderCalendar()});
}

document.addEventListener('click',forceCalendarRoute,true);
window.addEventListener('hashchange',async()=>{
  if(route()==='v4-calendar'){
    if(viewDate.getFullYear()<2025||viewDate.getFullYear()>2030)viewDate=new Date();
    await loadOfficial();
  }
  setTimeout(queuePatch,40);
});

const root=screen();
if(root)new MutationObserver(()=>{
  /* No volver a renderizar el calendario por nuestras propias mutaciones. */
  if(route()==='v4-calendar'&&root.querySelector('.v103-calendar-page'))return;
  queuePatch();
}).observe(root,{childList:true,subtree:false});

(async()=>{
  await loadOfficial();
  /* El calendario debe abrir en el mes actual del dispositivo; en septiembre 2026
     evita que quede guardado el antiguo demo de octubre. */
  viewDate=new Date();
  queuePatch();
})();
})();