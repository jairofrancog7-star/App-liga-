/* Liga Juventino V7 — PC/browser desktop shell inspired by the supplied reference. */
(function(){
  'use strict';
  const MIN=1024;
  const root=()=>document.querySelector('#screen');
  const forcedMode=()=>new URLSearchParams(location.search).get('mode')||'';
  const isDesktop=()=>forcedMode()==='desktop'||(!['mobile','apk'].includes(forcedMode())&&window.innerWidth>=MIN);
  const goto=(r)=>{ if(!r) return; location.hash='#/'+r; };
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const route=()=>location.hash.replace('#/','')||'home';
  const fixtures=[['Hoy 18:00','Juventino','Pozos'],['Hoy 20:00','Cuenda','Rincón'],['Mañana 19:00','San Pedro','Morales'],['Sáb 17:00','Franco Tavera','América'],['Dom 16:00','Juventino','Cuenda'],['Dom 18:30','Pozos','Rincón']];
  const stories=[['⚽','Momentos','moments'],['🏆','Jornada','competition'],['📊','Clasificación','competition'],['⭐','Jugador semana','vote'],['🥅','Gol del día','scorers'],['🎥','Vídeos','video'],['👕','Equipos','teams'],['📰','Noticias','news'],['🗓️','Calendario','v4-calendar'],['↔','Fichajes','transfers'],['🎮','Fantasy','fantasy'],['＋','Más','more']];
  const momentNames=['Juan Pérez','Carlos Ramírez','Miguel Torres','Ángel Cruz','Diego Lara','Edgar Ruiz','Sergio Luna'];
  const routeBtn=(label,r)=>`<button type="button" data-desk-route="${r}">${label}</button>`;
  function homeMarkup(){
    return `<div class="desktop-liga" data-desktop-shell="1">
      <div class="desk-utility"><div class="desk-wrap"><span><span class="desk-brand-mini">LIGA</span> · Juventino Rosas</span><button class="desk-login" data-desk-route="profile">Iniciar sesión ◉</button></div></div>
      <header class="desk-nav"><div class="desk-wrap"><button class="desk-logo" data-desk-route="home"><span class="desk-logo-mark">★</span><span class="desk-logo-text">LIGA<br>JUVENTINO</span></button><nav class="desk-menu" aria-label="Navegación escritorio">${routeBtn('Partidos','competition')}${routeBtn('Clasificación','competition')}${routeBtn('Liga TV','video')}${routeBtn('Sorteos','predictor')}${routeBtn('Gaming','fantasy')}${routeBtn('Datos','safe-data')}${routeBtn('Equipos','teams')}${routeBtn('Noticias','news')}${routeBtn('Historia','history')}${routeBtn('Sobre','more')}${routeBtn('Más','more')}</nav></div></header>
      <main>
        <section class="desk-fixtures"><div class="desk-wrap"><div class="desk-fixtures-row">${fixtures.map(f=>`<button class="desk-match" data-desk-route="competition"><small>${f[0]}</small><b><i class="desk-dot"></i>${esc(f[1])}</b><b><i class="desk-dot"></i>${esc(f[2])}</b></button>`).join('')}<button class="desk-all" data-desk-route="competition">▣ Ver todos los partidos</button></div></div></section>
        <section><div class="desk-wrap"><div class="desk-stories">${stories.map(s=>`<button class="desk-story" data-desk-route="${s[2]}"><span>${s[0]}</span><small>${s[1]}</small></button>`).join('')}</div></div></section>
        <section><div class="desk-wrap"><div class="desk-hero-grid"><button class="desk-hero" data-desk-route="news"><div class="desk-hero-copy"><small>PORTADA · LIGA JUVENTINO</small><h1>Todo listo para la próxima jornada municipal</h1></div></button><aside class="desk-highlight"><h3>Lo más destacado</h3>${[['⚽','Mira todos los goles de la jornada','video'],['⭐','Jugador de la Semana','vote'],['🏆','Resultados y clasificación','competition'],['📰','Últimas noticias de la liga','news'],['📈','Performance Zone y datos','safe-performance']].map(x=>`<button data-desk-route="${x[2]}"><span class="desk-thumb">${x[0]}</span><b>${x[1]}</b></button>`).join('')}</aside></div></div></section>
        <section class="desk-section"><div class="desk-wrap"><div class="desk-section-title"><h2>Momentos</h2><button data-desk-route="moments">Ver todos los momentos ›</button></div><div class="desk-moments">${momentNames.map((n,i)=>`<button class="desk-moment" data-desk-route="${i%2?'scorers':'vote'}"><em>NEW</em><b>${n}</b></button>`).join('')}</div></div></section>
        <section class="desk-section"><div class="desk-wrap"><div class="desk-section-title"><h2>Últimas noticias</h2><button data-desk-route="news">Ver todas las noticias ›</button></div><div class="desk-news-grid"><button class="desk-news-card feature" data-desk-route="news"><div class="copy"><small>JORNADA</small><b>La precisión y el talento local toman el protagonismo</b></div></button><button class="desk-news-card" data-desk-route="vote"><div class="copy"><small>ENCUESTA</small><b>¿Quién es tu Jugador de la Semana?</b></div></button><button class="desk-news-card promo" data-desk-route="safe-performance"><div><strong>PERFORMANCE</strong><br><span>Ver datos ahora</span></div></button></div></div></section>
        <section class="desk-video-band"><div class="desk-wrap"><div class="desk-section"><div class="desk-section-title"><h2>Resúmenes en vídeo</h2><button data-desk-route="video">Ver todos ›</button></div><div class="desk-video-grid">${[['▶','Juventino - Pozos · Resumen'],['▶','Cuenda - Rincón · Goles'],['▶','Top atajadas de la jornada'],['▶','Mejores jugadas y asistencias']].map(x=>`<button class="desk-video-card" data-desk-route="video"><div class="desk-video-art">${x[0]}</div><div class="meta"><small>Vídeo</small><b>${x[1]}</b></div></button>`).join('')}</div></div><div class="desk-section"><div class="desk-section-title"><h2>Funciones de la liga</h2><button data-desk-route="more">Abrir todas ›</button></div><div class="desk-tools">${[['📅','Calendario','Fechas, resultados y sedes','v4-calendar'],['📊','Datos','Equipos, jugadores y KPIs','safe-data'],['⚡','Performance Zone','Análisis y rendimiento','safe-performance'],['🎯','Predictor','Pronósticos y jornada','predictor'],['🏆','Torneo','Funciones del portal anterior','competition'],['★','Zenith','Momentos, TV y destacados','video'],['↔','Fichajes','Altas y movimientos','transfers'],['🔔','Notificaciones','Alertas de liga','safe-notifications']].map(x=>`<button class="desk-tool" data-desk-route="${x[3]}"><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div></div></div></section>
      </main>
      <footer class="desk-footer"><div class="desk-wrap"><div class="desk-footer-top"><div><div class="desk-logo-text" style="font-size:13px">LIGA JUVENTINO ROSAS</div><p style="color:var(--desk-muted);font-size:11px;max-width:280px">Portal municipal para partidos, equipos, noticias, estadísticas, vídeos, credenciales y funciones de torneo.</p></div><div><h4>DESCUBRE</h4>${routeBtn('Partidos','competition')}${routeBtn('Clasificación','competition')}${routeBtn('Vídeos','video')}${routeBtn('Fantasy','fantasy')}</div><div><h4>INFORMACIÓN</h4>${routeBtn('Equipos','teams')}${routeBtn('Noticias','news')}${routeBtn('Historia','history')}${routeBtn('Datos','safe-data')}</div><div><h4>HERRAMIENTAS</h4>${routeBtn('Calendario','v4-calendar')}${routeBtn('Fichajes','transfers')}${routeBtn('Notificaciones','safe-notifications')}${routeBtn('Más','more')}</div></div><div class="desk-footer-bottom"><span>Modo navegador PC · diseño adaptativo</span><span>La versión móvil/APK conserva la navegación original.</span></div></div></footer>
    </div>`;
  }
  function renderDesktop(){
    const host=root(); if(!host) return;
    const r=route();
    if(isDesktop() && r==='home'){
      if(!host.querySelector('[data-desktop-shell]')) host.innerHTML=homeMarkup();
    } else if(host.querySelector('[data-desktop-shell]')){
      location.reload();
    }
  }
  function onClick(e){
    const b=e.target.closest('[data-desk-route]'); if(!b) return;
    e.preventDefault(); goto(b.dataset.deskRoute);
  }
  document.addEventListener('click',onClick);
  window.addEventListener('hashchange',()=>setTimeout(renderDesktop,0));
  let resizeTimer=0;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(isDesktop()&&route()==='home')renderDesktop();else if(!isDesktop()&&root()?.querySelector('[data-desktop-shell]'))location.reload();},160)});
  setTimeout(renderDesktop,40);
})();
