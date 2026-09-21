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
    v38Stats:{
      asset:'stats',
      kicker:'TABLA Y ESTADÍSTICAS',
      title:'LA TEMPORADA, DE UN VISTAZO.',
      desc:'Posiciones, goleadores y rendimiento con accesos rápidos.',
      pills:[['Tabla','competition'],['Goleadores','scorers'],['Rendimiento','scroll']]
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

  /* V75 — En Inicio las animaciones van SEPARADAS e intercaladas entre contenido.
     Nunca se agrupan todas en una sola sección ni se montan dentro de una barra. */
  const HOME_SEQUENCE=[
    {
      slot:'matchday',
      asset:'matchday',
      kicker:'JORNADAS · FÚTBOL ASOCIACIÓN',
      title:'PARTIDOS Y RESULTADOS',
      desc:'La jornada de la Liga con movimiento, colocada entre bloques de Inicio.',
      pills:[['Jornada','competition'],['Horarios','matchday'],['Campos','venues']]
    },
    {
      slot:'teams',
      asset:'teams',
      kicker:'EQUIPOS DE LA LIGA',
      title:'NOMBRES PROPIOS.',
      desc:'Escudos y equipos locales presentados como un bloque independiente.',
      pills:[['Equipos','teams'],['Jugadores','players'],['Siguiendo','following']]
    },
    {
      slot:'stats',
      asset:'stats',
      kicker:'TABLA Y ESTADÍSTICAS',
      title:'LA TEMPORADA DE UN VISTAZO.',
      desc:'Datos y rendimiento en otra parte de Inicio, separado de las demás animaciones.',
      pills:[['Tabla','competition'],['Goleadores','scorers'],['Datos','leagueData']]
    },
    {
      slot:'rankings',
      asset:'stats',
      kicker:'RANKINGS',
      title:'RENDIMIENTO DE LA LIGA.',
      desc:'Una lectura visual de posiciones, tendencias y estadísticas.',
      pills:[['Ranking','rankings'],['Tabla','competition'],['Goleadores','scorers']]
    }
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

  function mountHomeInterleaved(screen){
    const extra=screen.querySelector('#safeHomeExtra');
    if(!extra)return false;

    /* Elimina cualquier banner antiguo de Inicio para evitar duplicados o un bloque arriba. */
    screen.querySelectorAll('[data-v73-motion-banner]:not([data-v73-home-slot])').forEach(x=>x.remove());

    const baseSections=[...extra.querySelectorAll(':scope > .v6-section')];
    if(!baseSections.length)return false;

    const targets=[
      baseSections[Math.min(baseSections.length-1,Math.max(1,Math.floor(baseSections.length*.28)))],
      baseSections[Math.min(baseSections.length-1,Math.max(2,Math.floor(baseSections.length*.56)))],
      baseSections[Math.min(baseSections.length-1,Math.max(3,Math.floor(baseSections.length*.82)))]
    ];

    HOME_SEQUENCE.forEach((cfg,index)=>{
      let banner=extra.querySelector('[data-v73-home-slot="'+cfg.slot+'"]');
      if(!banner){
        banner=buildBanner(cfg);
        banner.dataset.v73HomeSlot=cfg.slot;
        banner.classList.add('v73-home-interleaved');
      }

      /* Rendimiento de la Liga va SIEMPRE como la última sección de Inicio.
         No se inserta arriba de ninguna cabecera/barra ni dentro de Rankings. */
      if(cfg.slot==='rankings'){
        extra.appendChild(banner);
        banner.classList.add('v73-home-bottom-performance');
        return;
      }

      const target=targets[index];
      if(target){
        target.insertAdjacentElement('afterend',banner);
      }else{
        extra.appendChild(banner);
      }
    });

    syncAll();
    return true;
  }

  function mountBelowNative(screen,r,cfg){
    /* El contenido original de estas pantallas debe ir primero.
       La animación se coloca al FINAL de la sección, nunca arriba de filtros,
       buscador, tabla, lista ni cabecera. */
    const nativePage=r==='teams'
      ?screen.querySelector('[data-v27-reference="teams"]')
      :r==='scorers'
        ?screen.querySelector('[data-v28-scorers]')
        :r==='players'
          ?screen.querySelector('[data-v66-directory="players"]')
          :null;

    if(!nativePage){
      screen.querySelectorAll(':scope > [data-v73-motion-banner]').forEach(x=>x.remove());
      return false;
    }

    let banner=nativePage.querySelector(':scope > [data-v73-motion-banner]');
    if(!banner){
      /* Quita cualquier copia antigua que haya quedado arriba de la sección. */
      screen.querySelectorAll(':scope > [data-v73-motion-banner]').forEach(x=>x.remove());
      banner=buildBanner(cfg);
      banner.classList.add('v73-below-native');
      banner.dataset.v73BelowNative=r;
      nativePage.appendChild(banner);
    }else if(nativePage.lastElementChild!==banner){
      nativePage.appendChild(banner);
    }

    /* En Jugadores, fuerza que quede después de toda la lista registrada. */
    if(r==='players'){
      const list=nativePage.querySelector('.v66-player-list');
      if(list&&banner.previousElementSibling!==list){
        list.insertAdjacentElement('afterend',banner);
      }
    }

    syncAll();
    return true;
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

    if(r==='home'){
      if(!mountHomeInterleaved(screen)){
        syncAll();
      }
      return;
    }
    /* V119 — DATOS / ESTADÍSTICAS:
       En estas pantallas NO se agrega un banner cinematográfico de 400px.
       Ese bloque era el espacio azul grande que aparecía al seguir deslizando. */
    if(r==='stats'||r==='leagueData'||r==='safe-data'){
      screen.querySelectorAll(':scope > [data-v73-motion-banner], [data-v73-motion-banner]').forEach(x=>x.remove());
      syncAll();
      return;
    }


    if(r==='teams'||r==='scorers'||r==='players'){
      mountBelowNative(screen,r,cfg);
      return;
    }

    /* V106 — PERFIL DE EQUIPO:
       La animación "IDENTIDAD DE CLUB" nunca va arriba ni en medio.
       Primero se muestra la ficha V42 completa (escudo, acciones, tabs, datos);
       después, al final de la pantalla, se agrega el banner animado. */
    if(r==='teamDetail'){
      const nativeTeam=screen.querySelector('[data-v42-reference="teamDetail"]');
      if(!nativeTeam){
        screen.querySelectorAll(':scope > [data-v73-motion-banner]').forEach(x=>x.remove());
        syncAll();
        return;
      }
      let banner=screen.querySelector(':scope > [data-v73-motion-banner]');
      if(!banner){
        banner=buildBanner(cfg);
        banner.classList.add('v73-below-native','v73-team-detail-bottom');
        banner.dataset.v73BelowNative='team-detail';
      }

      /* V123 — PERFIL / COMPARAR EQUIPOS:
         V73 y V105 antes intentaban ser ambos el último hijo de #screen.
         Sus MutationObserver se alternaban moviendo los bloques y el navegador
         regresaba el scroll al llegar al final. El orden ahora es estable:
         ficha V42 -> banner V73 -> herramientas V105. */
      const greenTools=screen.querySelector(':scope > #v105-bottom[data-v105-route="teamDetail"]');
      if(greenTools){
        if(banner.nextElementSibling!==greenTools)screen.insertBefore(banner,greenTools);
      }else if(screen.lastElementChild!==banner){
        screen.appendChild(banner);
      }

      syncAll();
      return;
    }

    /* V120 — CLIMA Y CAMPOS:
       Primero se muestran las canchas y sus controles reales.
       El cuadro animado "PRONÓSTICO NO ES DECISIÓN" va hasta abajo de esta pantalla. */
    if(r==='weatherFields'){
      const nativeWeather=screen.querySelector('.v60-tool-page');
      if(!nativeWeather){
        screen.querySelectorAll(':scope > [data-v73-motion-banner]').forEach(x=>x.remove());
        syncAll();
        return;
      }

      let banner=screen.querySelector(':scope > [data-v73-motion-banner]');
      if(!banner){
        banner=buildBanner(cfg);
        banner.classList.add('v73-below-native','v73-weatherfields-bottom');
        banner.dataset.v73BelowNative='weather-fields';
      }

      if(screen.lastElementChild!==banner)screen.appendChild(banner);
      syncAll();
      return;
    }

    /* V118 — CANCHAS / SEDES:
       El cuadro animado "PRIMERO REVISA EL TERRENO" debe ir hasta abajo,
       después de toda la lista real de campos. No se cambia el contenido,
       sólo su posición. */
    if(r==='venues'){
      const nativeVenues=screen.querySelector('.v60-tool-page');
      if(!nativeVenues){
        screen.querySelectorAll(':scope > [data-v73-motion-banner]').forEach(x=>x.remove());
        syncAll();
        return;
      }

      let banner=screen.querySelector(':scope > [data-v73-motion-banner]');
      if(!banner){
        banner=buildBanner(cfg);
        banner.classList.add('v73-below-native','v73-venues-bottom');
        banner.dataset.v73BelowNative='venues';
      }

      if(screen.lastElementChild!==banner)screen.appendChild(banner);
      syncAll();
      return;
    }

    /* V92 — En Estadísticas primero va el contenido nativo DATOS / Estadísticas.
       El cuadro animado "Tabla y estadísticas" se baja al final de la página. */
    if(r==='stats'){
      let banner=screen.querySelector(':scope > [data-v73-motion-banner]');
      if(!banner){
        banner=buildBanner(cfg);
        banner.classList.add('v73-below-native','v73-stats-below-native');
        banner.dataset.v73BelowNative='stats';
      }
      if(screen.lastElementChild!==banner)screen.appendChild(banner);
      syncAll();
      return;
    }

    /* V93 — VER DETALLES:
       La animación MATCH CENTER / EL PARTIDO, EN VIVO no va arriba.
       En la ficha real del partido se coloca después de TODO el contenido
       nativo (marcador, tabs, novedades, clasificación e info del partido).
       Match Center conserva su comportamiento independiente. */
    if(r==='match' && sessionStorage.getItem('v69-match-center-entry')!=='1'){
      const nativeMatch=screen.querySelector('[data-v28-match]');
      if(!nativeMatch){
        /* Evita que aparezca un instante arriba mientras V28 termina de
           construir la pantalla de Ver detalles. */
        screen.querySelectorAll(':scope > [data-v73-motion-banner]').forEach(x=>x.remove());
        syncAll();
        return;
      }

      let banner=screen.querySelector(':scope > [data-v73-motion-banner]');
      if(!banner){
        banner=buildBanner(cfg);
        banner.classList.add('v73-below-native','v73-match-detail-bottom');
        banner.dataset.v73BelowNative='match-detail';
      }

      /* V117 — evita que V73 y V105 se peleen por ser el último hijo de #screen.
         La animación queda después del detalle nativo y ANTES de las herramientas V105.
         Así el DOM deja de moverse durante el scroll y se puede llegar hasta el final. */
      const greenTools=screen.querySelector(':scope > #v105-bottom[data-v105-route="match"]');
      if(greenTools){
        if(banner.nextElementSibling!==greenTools)screen.insertBefore(banner,greenTools);
      }else if(screen.lastElementChild!==banner){
        screen.appendChild(banner);
      }
      syncAll();
      return;
    }

    let banner=screen.querySelector('[data-v73-motion-banner]');
    if(!banner){
      banner=buildBanner(cfg);
      screen.insertBefore(banner,screen.firstChild);
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