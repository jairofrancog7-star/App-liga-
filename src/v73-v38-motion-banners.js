/* V73 — Cinematic motion banners adapted from Liga_Futbol V38.
   Reuses the user's existing V38 football motion assets without replacing App-liga's blue UI. */
(function(){
  'use strict';
  if(window.__LJR_V73_MOTION__)return;
  window.__LJR_V73_MOTION__=true;

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/motion/';
  const ASSETS={
    hero:BASE+'v38-soccer-hero.mp4',
    matchday:BASE+'v38-soccer-matchday.mp4',
    fields:BASE+'v38-soccer-fields-rain.mp4',
    teams:BASE+'v38-soccer-teams.mp4',
    bracket:BASE+'v38-soccer-liguilla.mp4',
    stats:BASE+'v38-soccer-stats.mp4'
  };

  const CONFIG={
    home:{
      asset:'matchday',
      kicker:'JORNADAS · FÚTBOL ASOCIACIÓN',
      title:'PARTIDOS Y RESULTADOS',
      desc:'Tarjetas de jornada más claras, rápidas y pensadas para la liga municipal.',
      pills:[['Jornada','competition'],['Horarios','matchday'],['Campos','venues']]
    },
    match:{
      asset:'matchday',
      kicker:'MATCH CENTER',
      title:'EL PARTIDO, EN VIVO.',
      desc:'Marcador, eventos, alineaciones y contexto del encuentro sin perder la identidad de la Liga.',
      pills:[['LIVE','scroll'],['Jornada','competition'],['Campos','venues']]
    },
    venues:{
      asset:'fields',
      kicker:'CAMPOS · COMUNIDADES Y RANCHOS',
      title:'PRIMERO REVISA EL TERRENO.',
      desc:'El pronóstico, la inspección del campo y la decisión oficial son tres cosas diferentes.',
      pills:[['Pronóstico','weatherFields'],['Terreno','scroll'],['Decisión oficial','competition']]
    },
    weatherFields:{
      asset:'fields',
      kicker:'CLIMA Y CAMPOS',
      title:'PRONÓSTICO NO ES DECISIÓN.',
      desc:'Consulta el clima, revisa el terreno y conserva por separado el estado oficial del partido.',
      pills:[['Pronóstico','scroll'],['Campos','venues'],['Partidos','competition']]
    },
    v38Weather:{
      asset:'fields',
      kicker:'CENTRAL OPERATIVA',
      title:'CLIMA · TERRENO · DECISIÓN',
      desc:'Tres señales distintas para una jornada mejor informada.',
      pills:[['Pronóstico','weatherFields'],['Campos','venues'],['Partidos','competition']]
    },
    teams:{
      asset:'teams',
      kicker:'EQUIPOS Y JUGADORES',
      title:'LA LIGA TIENE NOMBRES PROPIOS.',
      desc:'Escudos, plantillas y perfiles con una presentación más deportiva y cinematográfica.',
      pills:[['Equipos','scroll'],['Jugadores','players'],['Datos oficiales','leagueData']]
    },
    players:{
      asset:'teams',
      kicker:'PLANTILLAS OFICIALES',
      title:'JUGADORES DE LA LIGA.',
      desc:'Consulta nombres registrados y el equipo al que pertenece cada jugador.',
      pills:[['Jugadores','scroll'],['Equipos','teams'],['Goleadores','scorers']]
    },
    teamDetail:{
      asset:'teams',
      kicker:'PERFIL DE EQUIPO',
      title:'IDENTIDAD DE CLUB.',
      desc:'Escudo, plantilla, resultados y contexto del equipo dentro de la Liga.',
      pills:[['Equipo','scroll'],['Equipos','teams'],['Partidos','competition']]
    },
    bracketBuilder:{
      asset:'bracket',
      kicker:'COPA · LIGUILLA',
      title:'CADA CRUCE CUENTA.',
      desc:'Cuartos, semifinal y final con movimiento contenido y exportación del cuadro.',
      pills:[['Cuartos','scroll'],['Semifinal','scroll'],['Final','scroll']]
    },
    stats:{
      asset:'stats',
      kicker:'TABLA Y ESTADÍSTICAS',
      title:'LA TEMPORADA, DE UN VISTAZO.',
      desc:'Posiciones, goleadores y rendimiento con jerarquía visual y movimiento contenido.',
      pills:[['Tabla','competition'],['Goleadores','scorers'],['Rendimiento','v38Stats']]
    },
    scorers:{
      asset:'stats',
      kicker:'GOLEADORES',
      title:'LOS NÚMEROS DEL GOL.',
      desc:'Ranking de anotadores conectado a los datos registrados de la Liga.',
      pills:[['Ranking','scroll'],['Tabla','competition'],['Estadísticas','stats']]
    },
    rankings:{
      asset:'stats',
      kicker:'RANKINGS',
      title:'RENDIMIENTO DE LA LIGA.',
      desc:'Una lectura visual de posiciones, tendencias y estadísticas.',
      pills:[['Ranking','scroll'],['Tabla','competition'],['Goleadores','scorers']]
    },
    v38Stats:{
      asset:'stats',
      kicker:'TABLA Y ESTADÍSTICAS',
      title:'LA TEMPORADA, DE UN VISTAZO.',
      desc:'Posiciones, goleadores y rendimiento con accesos rápidos.',
      pills:[['Tabla','competition'],['Goleadores','scorers'],['Rendimiento','scroll']]
    },
    tableExport:{
      asset:'stats',
      kicker:'EXPORTAR TABLA',
      title:'DATOS LISTOS PARA COMPARTIR.',
      desc:'Convierte la tabla en PNG o CSV sin salir de la aplicación.',
      pills:[['Tabla','competition'],['PNG','scroll'],['CSV','scroll']]
    },
    leagueData:{
      asset:'stats',
      kicker:'CENTRAL OFICIAL',
      title:'DATOS DE LA LIGA.',
      desc:'Categorías, equipos, jugadores, partidos y estadísticas en un solo lugar.',
      pills:[['Resumen','scroll'],['Equipos','teams'],['Goleadores','scorers']]
    },
    motionHub:{
      asset:'hero',
      kicker:'MOVIMIENTO V38',
      title:'FÚTBOL QUE SE SIENTE.',
      desc:'Las animaciones originales de la otra app, adaptadas al diseño actual de App-liga.',
      pills:[['Animaciones','scroll'],['Jornada','competition'],['Campos','venues']]
    }
  };

  const GALLERY=[
    ['Portada','hero'],
    ['Partidos y resultados','matchday'],
    ['Clima y campos','fields'],
    ['Equipos y jugadores','teams'],
    ['Copa y liguilla','bracket'],
    ['Tabla y estadísticas','stats']
  ];

  const reduced=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  const saveData=!!(navigator.connection&&navigator.connection.saveData);
  const STORE='ljr-v73-motion';
  let enabled=true;
  try{enabled=localStorage.getItem(STORE)!=='0'}catch(_){}
  const managed=new Set();

  function route(){return location.hash.replace('#/','')||'home'}
  function canPlay(){return enabled&&!reduced.matches&&!saveData&&!document.hidden}

  const io='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      const v=e.target;
      v.dataset.v73Visible=e.isIntersecting&&e.intersectionRatio>.08?'1':'0';
      syncVideo(v);
    });
  },{threshold:[0,.08,.25]}):null;

  function makeVideo(asset,cls=''){
    const v=document.createElement('video');
    v.className=cls;
    v.src=ASSETS[asset]||ASSETS.hero;
    v.muted=true;
    v.loop=true;
    v.playsInline=true;
    v.preload='metadata';
    v.setAttribute('muted','');
    v.setAttribute('playsinline','');
    v.setAttribute('aria-hidden','true');
    v.tabIndex=-1;
    v.dataset.v73Visible='0';
    managed.add(v);
    if(io)io.observe(v);else v.dataset.v73Visible='1';
    v.addEventListener('error',()=>{managed.delete(v);v.classList.add('v73-video-error')},{once:true});
    return v;
  }

  function syncVideo(v){
    if(!v||!document.body.contains(v)){managed.delete(v);return}
    const visible=v.dataset.v73Visible==='1';
    if(canPlay()&&visible){
      const p=v.play();
      if(p&&p.catch)p.catch(()=>{});
    }else{
      try{v.pause()}catch(_){}
    }
  }
  function syncAll(){managed.forEach(syncVideo)}

  function setEnabled(next){
    enabled=!!next;
    try{localStorage.setItem(STORE,enabled?'1':'0')}catch(_){}
    document.querySelectorAll('[data-v73-motion-toggle]').forEach(b=>{
      b.setAttribute('aria-pressed',enabled?'true':'false');
      b.textContent=enabled?'Pausar movimiento':'Reanudar movimiento';
    });
    syncAll();
  }

  function go(action){
    if(action==='scroll'){
      const banner=document.querySelector('.v73-motion-banner');
      const target=banner?.nextElementSibling;
      if(target)target.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
      return;
    }
    if(action)location.hash='#/'+action;
  }

  function buildBanner(cfg){
    const s=document.createElement('section');
    s.className='v73-motion-banner v73-reveal';
    s.dataset.v73MotionBanner='1';
    s.setAttribute('aria-label',cfg.title);
    if(!reduced.matches&&!saveData)s.appendChild(makeVideo(cfg.asset,'v73-motion-video'));

    const shade=document.createElement('div');
    shade.className='v73-motion-shade';
    s.appendChild(shade);

    const inner=document.createElement('div');
    inner.className='v73-motion-inner';
    inner.innerHTML='<div class="v73-motion-kicker">'+cfg.kicker+'</div>'+
      '<h2>'+cfg.title+'</h2>'+
      '<p>'+cfg.desc+'</p>'+
      '<div class="v73-motion-pills">'+cfg.pills.map((p,i)=>'<button type="button" data-v73-go="'+p[1]+'" data-v73-pill="'+i+'">'+p[0]+'</button>').join('')+'</div>'+
      '<button type="button" class="v73-motion-toggle" data-v73-motion-toggle aria-pressed="'+(enabled?'true':'false')+'">'+(enabled?'Pausar movimiento':'Reanudar movimiento')+'</button>';
    s.appendChild(inner);

    s.querySelectorAll('[data-v73-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.v73Go)));

    const toggle=s.querySelector('[data-v73-motion-toggle]');
    if(toggle){
      if(reduced.matches||saveData){
        toggle.disabled=true;
        toggle.textContent=reduced.matches?'Movimiento reducido':'Ahorro de datos';
      }else toggle.addEventListener('click',()=>setEnabled(!enabled));
    }

    requestAnimationFrame(()=>s.classList.add('v73-visible'));
    return s;
  }

  function buildGallery(){
    const wrap=document.createElement('section');
    wrap.className='v73-motion-gallery v73-reveal';
    wrap.dataset.v73Gallery='1';
    wrap.innerHTML='<div class="v73-gallery-head"><small>ANIMACIONES V38</small><h3>Animaciones de la Liga</h3><p>Desliza para ver las demás animaciones recuperadas de la otra app.</p></div><div class="v73-gallery-track"></div>';
    const track=wrap.querySelector('.v73-gallery-track');

    GALLERY.forEach(([name,asset])=>{
      const card=document.createElement('article');
      card.className='v73-gallery-card';
      if(!reduced.matches&&!saveData)card.appendChild(makeVideo(asset,'v73-gallery-video'));
      const copy=document.createElement('div');
      copy.innerHTML='<b>'+name+'</b><span>Movimiento V38</span>';
      card.appendChild(copy);
      track.appendChild(card);
    });
    requestAnimationFrame(()=>wrap.classList.add('v73-visible'));
    return wrap;
  }

  function mount(){
    const screen=document.querySelector('#screen');
    if(!screen)return;
    const r=route();
    const cfg=CONFIG[r];

    document.body.classList.toggle('v73-motion-active',!!cfg);

    if(!cfg){
      screen.querySelectorAll('[data-v73-motion-banner],[data-v73-gallery]').forEach(x=>x.remove());
      syncAll();
      return;
    }

    let banner=screen.querySelector('[data-v73-motion-banner]');
    if(!banner){
      if(r==='home'){
        const extra=screen.querySelector('#safeHomeExtra');
        if(!extra){
          syncAll();
          return;
        }
        banner=buildBanner(cfg);
        const sections=[...extra.querySelectorAll(':scope > .v6-section')];
        const target=sections.find(section=>{
          const title=section.querySelector('.v6-section-head h2');
          return title&&/equipo de la semana/i.test(title.textContent||'');
        })||sections[Math.max(0,Math.floor(sections.length*.72))]||null;
        if(target)extra.insertBefore(banner,target);
        else extra.appendChild(banner);
      }else{
        banner=buildBanner(cfg);
        screen.insertBefore(banner,screen.firstChild);
      }
    }

    if(r==='motionHub'&&!screen.querySelector('[data-v73-gallery]')){
      const gallery=buildGallery();
      banner.insertAdjacentElement('afterend',gallery);
    }

    syncAll();
  }

  document.addEventListener('visibilitychange',syncAll);
  window.addEventListener('hashchange',()=>requestAnimationFrame(mount));

  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>requestAnimationFrame(mount)).observe(screen,{childList:true,subtree:false});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(mount),{once:true});
  else requestAnimationFrame(mount);
})();