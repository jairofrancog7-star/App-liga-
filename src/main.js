const teams = [
  { code: 'JUV', name: 'Juventino', p: 5, gd: 9, pts: 13, form: ['v','v','e','v','v'] },
  { code: 'POZ', name: 'Pozos', p: 5, gd: 6, pts: 11, form: ['v','e','v','v','e'] },
  { code: 'RIN', name: 'Rincón de Centeno', p: 5, gd: 3, pts: 9, form: ['e','v','d','v','v'] },
  { code: 'CUE', name: 'Cuenda', p: 5, gd: 1, pts: 8, form: ['v','e','e','d','v'] },
  { code: 'SPD', name: 'San Pedro', p: 5, gd: -1, pts: 6, form: ['d','v','e','e','d'] },
  { code: 'MOR', name: 'Morales', p: 5, gd: -4, pts: 4, form: ['d','e','d','v','d'] },
];

const scorers = [
  ['Juan Pérez','Juventino',8],['Carlos Ramírez','Pozos',6],['Miguel Torres','Rincón',5],['Ángel Cruz','Cuenda',5],['Diego Lara','San Pedro',4]
];

const state = {
  route: location.hash.replace('#/','') || 'home',
  history: [],
  competitionTab: 'fixtures',
  theme: localStorage.getItem('lj-theme') || 'dark',
  followed: new Set(JSON.parse(localStorage.getItem('lj-followed') || '[]')),
  favorites: new Set(JSON.parse(localStorage.getItem('lj-favorites') || '[]')),
};

const screen = document.querySelector('#screen');
const backButton = document.querySelector('#backButton');
const navItems = [...document.querySelectorAll('.nav-item')];

function crest(code){ return `<span class="crest">${code}</span>`; }
function formDots(list){ return `<span class="form">${list.map(x=>`<b class="${x}">${x.toUpperCase()}</b>`).join('')}</span>`; }
function sectionHead(title, route, label='Ver todo'){return `<div class="section-head"><h2>${title}</h2>${route?`<button class="link-button" data-route="${route}">${label}</button>`:''}</div>`;}
function matchRow(home,hc,score,ac,away){return `<div class="match-row"><span class="home">${home}</span>${crest(hc)}<b class="score">${score}</b>${crest(ac)}<span>${away}</span></div>`;}
function rankRows(){return scorers.map((p,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(['JUV','POZ','RIN','CUE','SPD'][i])}<span><strong>${p[0]}</strong><br><small class="muted">${p[1]}</small></span><b>${p[2]}</b></div>`).join('');}
function save(){localStorage.setItem('lj-followed',JSON.stringify([...state.followed]));localStorage.setItem('lj-favorites',JSON.stringify([...state.favorites]));}
function toast(text){const t=document.createElement('div');t.className='toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),1800);}
function setTheme(theme){state.theme=theme;localStorage.setItem('lj-theme',theme);document.documentElement.classList.toggle('light',theme==='light');}
setTheme(state.theme);

const views = {
  home: () => `
    <div class="eyebrow">Torneo municipal · temporada 2026</div>
    <h1 class="screen-title">El fútbol de<br>nuestro municipio</h1>
    <div class="stories">
      ${[['J2','Jornada','competition'],['RES','Resultados','competition'],['GOL','Goleadores','scorers'],['EQ','Equipos','teams'],['MOM','Momentos','moments'],['HIS','Historia','history']].map(([c,n,r])=>`<button class="story" data-route="${r}"><span class="story-ring"><span class="story-inner">${c}</span></span><small>${n}</small></button>`).join('')}
    </div>
    <section class="section hero">
      <span class="eyebrow">Partido de la semana</span>
      <h2>Juventino vs Pozos</h2>
      <p>La jornada principal llega al Campo Municipal. Sigue la previa, el marcador y los momentos.</p>
      <div class="button-row"><button class="btn primary" data-route="match">Ver previa</button><button class="btn outline" data-action="follow-match">Seguir partido</button></div>
    </section>
    <section class="section">${sectionHead('Momentos','moments')}
      <div class="grid-2">
        <button class="moment" data-route="moments"><span class="badge">NUEVO</span><strong>Gol que encendió la cancha</strong></button>
        <button class="moment" data-route="moments"><span class="badge">NUEVO</span><strong>La atajada de la fecha</strong></button>
      </div>
    </section>
    <section class="section">${sectionHead('Próximos partidos','competition','Calendario')}
      <div class="card match-card"><div class="match-meta"><span class="live">EN VIVO · Jornada 2</span><span>Campo Municipal</span></div>
      ${matchRow('Juventino','JUV','1—0','POZ','Pozos')}${matchRow('Cuenda','CUE','20:00','RIN','Rincón')}</div>
    </section>
    <section class="section">${sectionHead('Tabla rápida','competition','Clasificación')}
      <div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>DG</th><th>PTS</th><th>Forma</th></tr></thead><tbody>${teams.slice(0,4).map((t,i)=>`<tr><td>${i+1}</td><td><span class="club-cell">${crest(t.code)}${t.name}</span></td><td>${t.p}</td><td>${t.gd>0?'+':''}${t.gd}</td><td><b>${t.pts}</b></td><td>${formDots(t.form)}</td></tr>`).join('')}</tbody></table></div>
    </section>`,

  competition: () => `
    <div class="eyebrow">Torneo Municipal</div><h1 class="screen-title">Competición</h1>
    <div class="tabs"><button class="tab ${state.competitionTab==='fixtures'?'active':''}" data-comp-tab="fixtures">Partidos y resultados</button><button class="tab ${state.competitionTab==='standings'?'active':''}" data-comp-tab="standings">Clasificación</button><button class="tab ${state.competitionTab==='bracket'?'active':''}" data-comp-tab="bracket">Cuadro</button></div>
    ${competitionBody()}`,

  match: () => `
    <div class="eyebrow">Fase liga · Jornada 2</div><h1 class="screen-title">Juventino<br>vs Pozos</h1>
    <div class="card" style="padding:20px;text-align:center"><p class="muted">HOY · 18:00 · Campo Municipal</p><div style="display:flex;justify-content:space-around;align-items:center;margin:22px 0"><div>${crest('JUV')}<strong style="display:block;margin-top:8px">Juventino</strong></div><span class="display">—</span><div>${crest('POZ')}<strong style="display:block;margin-top:8px">Pozos</strong></div></div><div class="button-row" style="justify-content:center"><button class="btn primary" data-action="follow-match">Seguir partido</button><button class="btn ghost" data-action="share">Compartir</button></div></div>
    <section class="section">${sectionHead('Últimos resultados')}<div class="card match-card">${matchRow('Juventino','JUV','3—1','RIN','Rincón')}${matchRow('Pozos','POZ','2—2','CUE','Cuenda')}</div></section>
    <section class="section">${sectionHead('Cronología')}<div class="card match-card"><div class="match-meta"><span>12' · Gol</span><strong>Juan Pérez</strong></div><div class="match-meta"><span>34' · Amarilla</span><strong>Luis Gómez</strong></div><div class="match-meta"><span>76' · Gol</span><strong>Carlos Ramírez</strong></div></div></section>`,

  video: () => `
    <div class="hero" style="min-height:315px;margin:0 -16px;border-radius:0 0 28px 28px"><span class="eyebrow">Revive la jornada</span><h1>FÚTBOL QUE NOS UNE</h1><p>Mira goles, atajadas, entrevistas y resúmenes completos.</p><div class="button-row"><button class="btn primary" data-action="play-video">Ver ahora</button><button class="btn outline" data-route="match">Partido de la semana</button></div></div>
    <section class="section">${sectionHead('Selección del editor')}<div class="media-carousel"><button class="media-card" data-action="play-video"><span class="badge">12:46</span><h3>Final dramático en Cuenda</h3></button><button class="media-card" data-action="play-video"><span class="badge">08:20</span><h3>Resumen de la jornada</h3></button></div></section>
    <section class="section">${sectionHead('Resúmenes completos')}<div class="grid-2"><button class="moment" data-action="play-video"><span class="badge">09:31</span><strong>Juventino 3—1 Rincón</strong></button><button class="moment" data-action="play-video"><span class="badge">07:12</span><strong>Pozos 2—2 Cuenda</strong></button></div></section>`,

  fantasy: () => `
    <div class="game-hero"><span class="eyebrow">Torneo municipal</span><h1 class="game-title">FANTASY<br>LIGA<br>JUVENTINO</h1><p class="muted" style="max-width:260px">Arma tu once, administra presupuesto y compite en ligas privadas.</p><div class="button-row" style="margin-top:16px"><button class="btn primary" data-route="fantasyTeam">Crear mi equipo</button><button class="btn outline" data-route="fantasyLeagues">Ligas</button></div><div class="pitch"></div></div>`,

  fantasyTeam: () => `
    <div class="eyebrow">Fantasy · Jornada 2</div><h1 class="screen-title">Mi equipo</h1><div class="card" style="padding:16px"><div class="match-meta"><span>Presupuesto</span><strong>$100.0</strong></div><div class="match-meta"><span>Puntos de jornada</span><strong>47</strong></div><div class="match-meta"><span>Transferencias</span><strong>2</strong></div></div>
    <div class="pitch" style="height:390px;margin-top:18px"><div style="position:absolute;inset:18px;display:grid;grid-template-columns:repeat(3,1fr);align-content:space-around;gap:16px;text-align:center">${['POR','DEF','DEF','MED','MED','MED','DEL','DEL','CAP'].map((x,i)=>`<button class="btn ghost" data-action="player-slot">${x}<br><small>${i%2?'Juventino':'Pozos'}</small></button>`).join('')}</div></div>
    <div class="button-row" style="margin-top:18px"><button class="btn primary" data-action="save-fantasy">Guardar equipo</button><button class="btn outline" data-action="transfer">Transferencias</button></div>`,

  fantasyLeagues: () => `<div class="eyebrow">Fantasy</div><h1 class="screen-title">Ligas</h1><div class="profile-card"><h2>Compite con tus amigos</h2><p>Crea una liga privada o únete con un código.</p><div class="button-row"><button class="btn primary" data-action="create-league">Crear liga</button><button class="btn outline" data-action="join-league">Unirme</button></div></div><section class="section">${sectionHead('Clasificación')}<div class="stat-card">${[['1','Jairo FC','92'],['2','Juventino XI','88'],['3','Pozos Fantasy','81']].map(x=>`<div class="rank-row"><b>${x[0]}</b>${crest('LJ')}<span>${x[1]}</span><b>${x[2]}</b></div>`).join('')}</div></section>`,

  more: () => `
    <div class="eyebrow">Liga Juventino</div><h1 class="screen-title">Más</h1><div class="hero" style="min-height:150px"><span class="eyebrow">Todo en un lugar</span><h2>Vive cada jornada</h2><p>Datos, juegos, historia y tu cuenta.</p></div>
    ${menuGroup('Principal',[['Siguiendo','following'],['Equipos','teams'],['Máximo goleador','scorers'],['Momentos','moments'],['Estadísticas','stats']])}
    ${menuGroup('Gaming',[['Quiniela','predictor'],['Quiz Arena','quiz'],['Más o Menos','moreLess']])}
    ${menuGroup('Explorar',[['Rankings','rankings'],['Historia','history'],['Temporada','season'],['Campos / sedes','venues']])}
    ${menuGroup('Cuenta',[['Perfil','profile'],['Notificaciones','notifications'],['Cambiar tema','theme']])}`,

  following: () => {
    const followed = teams.filter(t=>state.followed.has(t.code));
    if(!followed.length) return `<div class="empty-state"><div class="empty-illustration"></div><h2>Sin equipos seguidos todavía</h2><p>Agrega tus equipos para recibir próximos partidos, resultados y noticias destacadas.</p><button class="btn outline" data-route="teams">+ Añadir equipos</button></div>`;
    return `<div class="eyebrow">Personalizado</div><h1 class="screen-title">Siguiendo</h1><div class="card match-card">${followed.map(t=>`<div class="match-meta"><span class="club-cell">${crest(t.code)}<strong>${t.name}</strong></span><button class="link-button" data-follow="${t.code}">Dejar de seguir</button></div>`).join('')}</div>`;
  },

  teams: () => `<div class="eyebrow">Directorio</div><h1 class="screen-title">Equipos</h1><div class="chips"><button class="chip active">Todos</button><button class="chip">Primera Fuerza</button><button class="chip">Veteranos 35+</button></div><div class="card match-card">${teams.map(t=>`<div class="match-meta" style="align-items:center;padding:10px 2px;border-bottom:1px solid var(--line)"><span class="club-cell">${crest(t.code)}<span><strong>${t.name}</strong><br><small class="muted">Primera Fuerza</small></span></span><button class="btn ${state.followed.has(t.code)?'ghost':'outline'}" data-follow="${t.code}">${state.followed.has(t.code)?'Siguiendo':'Seguir'}</button></div>`).join('')}</div>`,

  scorers: () => `<div class="eyebrow">Estadísticas</div><h1 class="screen-title">Máximo goleador</h1><div class="media-card" style="min-height:260px;width:100%"><span class="badge">#1 MÁXIMO GOLEADOR</span><div><span class="muted">Juventino</span><h3 style="font-size:30px">Juan Pérez</h3><div class="big-number">8 <small style="font-size:12px;color:#AEB1BA">goles</small></div></div></div><section class="section">${sectionHead('Ranking completo')}<div class="stat-card" style="min-width:0">${rankRows()}</div></section>`,

  moments: () => `<div class="eyebrow">Contenido</div><h1 class="screen-title">Momentos</h1><div class="grid-2">${['Gol de la jornada','Atajada imposible','La grada celebra','Último minuto','Figura del partido','Mejor asistencia'].map((x,i)=>`<button class="moment" data-action="play-video"><span class="badge">${i<2?'NUEVO':'VIDEO'}</span><strong>${x}</strong></button>`).join('')}</div>`,

  stats: () => `<div class="eyebrow">Fase liga</div><h1 class="screen-title">Estadísticas</h1><div class="tabs"><button class="tab active">General</button><button class="tab">Equipos</button><button class="tab">Jugadores</button></div><section class="section">${sectionHead('Estadísticas de equipo')}<div class="media-carousel"><div class="stat-card"><h3>Goles</h3>${teams.slice(0,5).map((t,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(t.code)}<span>${t.name}</span><b>${12-i}</b></div>`).join('')}</div><div class="stat-card"><h3>Porterías a cero</h3>${teams.slice(0,5).map((t,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(t.code)}<span>${t.name}</span><b>${5-i}</b></div>`).join('')}</div></div></section><section class="section">${sectionHead('Jugadores','scorers')}<div class="stat-card" style="min-width:0">${rankRows()}</div></section>`,

  rankings: () => `<div class="eyebrow">Temporada 2026</div><h1 class="screen-title">Rankings</h1><div class="segmented"><button class="segment active">Categorías</button><button class="segment">Clubes</button><button class="segment">Jugadores</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>Puntos</th><th>PJ</th><th>Prom.</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td><span class="club-cell">${crest(t.code)}${t.name}</span></td><td>${t.pts}</td><td>${t.p}</td><td>${(t.pts/t.p).toFixed(2)}</td></tr>`).join('')}</tbody></table></div>`,

  history: () => `<div class="eyebrow">Archivo</div><h1 class="screen-title">Historia</h1><div class="tabs"><button class="tab active">Resumen</button><button class="tab">Temporadas</button><button class="tab">Campeones</button><button class="tab">Finales</button></div><section class="section">${sectionHead('Buscar por temporada')}<div class="media-carousel">${[2026,2025,2024,2023].map(y=>`<button class="stat-card" style="min-width:125px;text-align:left" data-route="season"><span class="eyebrow">Temporada</span><h2>${y}</h2>${crest('LJ')}</button>`).join('')}</div></section><section class="section"><div class="hero"><span class="eyebrow">Palmarés</span><h2>Campeones históricos de Liga Juventino</h2><button class="btn outline" data-action="share">Compartir</button></div></section><section class="section">${sectionHead('Partidos clásicos','video')}<div class="media-carousel"><button class="media-card" data-action="play-video"><span class="badge">CLÁSICO</span><h3>Final 2025 · 3—2</h3></button><button class="media-card" data-action="play-video"><span class="badge">ARCHIVO</span><h3>Semifinal 2024</h3></button></div></section>`,

  season: () => `<div class="season-header"><span class="eyebrow" style="color:white">Liga Juventino</span><h1>Temporada</h1><p style="margin:8px 0 0">2026/27 ▾</p></div><div class="tabs" style="margin-top:10px"><button class="tab active">Partidos</button><button class="tab">Tabla</button><button class="tab">Estadísticas</button></div><div class="chips"><button class="chip active">Todas las fechas</button><button class="chip">Local y visitante</button><button class="chip">Todos los equipos</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>DG</th><th>PTS</th><th>Forma</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td><span class="club-cell">${crest(t.code)}${t.name}</span></td><td>${t.p}</td><td>${t.gd}</td><td><b>${t.pts}</b></td><td>${formDots(t.form)}</td></tr>`).join('')}</tbody></table></div>`,

  predictor: () => `<div class="game-hero"><span class="eyebrow">Jornada 2</span><h1 class="game-title">QUINIELA<br>LIGA<br>JUVENTINO</h1><p class="muted">Pronostica el marcador antes del cierre de la jornada.</p><div class="pitch"></div><button class="btn primary" data-action="save-prediction" style="margin-top:18px">Guardar pronóstico</button></div>`,

  quiz: () => `<div class="game-hero"><span class="eyebrow">Juego</span><h1 class="game-title">QUIZ<br>ARENA</h1><p class="muted">Historia, equipos, jugadores y récords de Liga Juventino.</p><div class="profile-card" style="margin-top:34px"><h2>¿Quién fue campeón en 2025?</h2><div class="button-row" style="margin-top:16px"><button class="btn ghost" data-action="quiz-answer">Juventino</button><button class="btn ghost" data-action="quiz-answer">Pozos</button><button class="btn ghost" data-action="quiz-answer">Cuenda</button></div></div></div>`,

  moreLess: () => `<div class="game-hero"><span class="eyebrow">Juego de estadísticas</span><h1 class="game-title">MÁS<br>O<br>MENOS</h1><p class="muted">¿Quién tiene más goles esta temporada?</p><div class="grid-2" style="margin-top:36px"><button class="profile-card" data-action="compare-answer"><h2>Juan Pérez</h2><p>Juventino</p></button><button class="profile-card" data-action="compare-answer"><h2>Carlos Ramírez</h2><p>Pozos</p></button></div></div>`,

  venues: () => `<div class="eyebrow">En el evento</div><h1 class="screen-title">Campos / sedes</h1><div class="card match-card"><div class="match-meta"><span><strong>Campo Municipal</strong><br><small class="muted">Sede principal</small></span><button class="btn outline" data-action="directions">Indicaciones</button></div><div class="match-meta"><span><strong>Unidad Deportiva</strong><br><small class="muted">Sede alterna</small></span><button class="btn outline" data-action="directions">Indicaciones</button></div></div>`,

  notifications: () => `<div class="eyebrow">Cuenta</div><h1 class="screen-title">Notificaciones</h1>${['Inicio del partido','Gol','Medio tiempo','Final','Cambio de horario','Noticias del equipo','Nuevo video','Fantasy deadline','Quiniela deadline'].map((x,i)=>`<div class="menu-row"><span>${x}</span><input type="checkbox" ${i<5?'checked':''} aria-label="${x}"></div>`).join('')}`,

  profile: () => `<div class="eyebrow">Cuenta</div><h1 class="screen-title">Perfil</h1><div class="profile-card"><h2>Más de Liga Juventino</h2><p>Inicia sesión para guardar equipos, jugar Fantasy, participar en la Quiniela y personalizar alertas.</p><div class="button-row"><button class="btn outline" data-action="login">Iniciar sesión</button><button class="btn primary" data-action="register">Crear una cuenta</button></div></div>${menuGroup('Preferencias',[['Siguiendo','following'],['Notificaciones','notifications'],['Cambiar tema','theme']])}`,

  search: () => `<div class="eyebrow">Liga Juventino</div><h1 class="screen-title">Buscar</h1><input id="globalSearch" placeholder="Equipos, jugadores, partidos…" style="width:100%;padding:13px 14px;border-radius:14px;border:1px solid var(--line);background:#1B1C20;color:var(--ink);outline:none"><div id="searchResults" class="section"></div>`,

  error: () => `<div class="empty-state"><div class="empty-illustration"></div><h2>No pudimos cargar la información</h2><p>Comprueba tu conexión e inténtalo nuevamente.</p><button class="btn outline" data-route="home">Reintentar</button></div>`,
};

function menuGroup(title,items){return `<div class="menu-group"><h3>${title}</h3>${items.map(([label,route])=>`<button class="menu-row" ${route==='theme'?'data-action="theme"':`data-route="${route}"`}><span>${label}</span><span>›</span></button>`).join('')}</div>`;}

function competitionBody(){
  if(state.competitionTab==='standings') return `<div class="segmented"><button class="segment active">Compacta</button><button class="segment">Completa</button><button class="segment">Criterios</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>DG</th><th>PTS</th><th>Forma</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td><span class="club-cell">${crest(t.code)}${t.name}</span></td><td>${t.p}</td><td>${t.gd>0?'+':''}${t.gd}</td><td><b>${t.pts}</b></td><td>${formDots(t.form)}</td></tr>`).join('')}</tbody></table></div>`;
  if(state.competitionTab==='bracket') return `<div class="chips"><button class="chip active">Play-off</button><button class="chip">Octavos</button><button class="chip">Cuartos</button><button class="chip">Semifinal</button><button class="chip">Final</button></div><p class="muted" style="font-size:11px">Desliza horizontalmente para recorrer el cuadro.</p><div class="bracket-shell"><div class="bracket"><div class="round-col"><div class="node"><div class="node-row"><span>1 Juventino</span><b>2</b></div><div class="node-row"><span>8 Morales</span><b>0</b></div></div><div class="node"><div class="node-row"><span>4 Cuenda</span><b>1</b></div><div class="node-row"><span>5 Pozos</span><b>1</b></div></div></div><div class="connector"></div><div class="round-col"><div class="node"><div class="node-row"><span>JUV</span><b>—</b></div><div class="node-row"><span>CUE</span><b>—</b></div></div></div><div class="connector"></div><div class="round-col"><div class="node"><div class="node-row"><span>Final</span><b>—</b></div><div class="node-row"><span>2026</span><b>—</b></div></div></div></div></div>`;
  return `<div class="chips"><button class="chip">mié 9 oct</button><button class="chip">jue 10 oct</button><button class="chip active">mar 13 oct</button><button class="chip">mié 14 oct</button></div><h2 style="font-size:20px">martes, 13 octubre 2026</h2><div class="card match-card"><div class="match-meta"><span>Fase liga · Jornada 2</span><button class="link-button" data-route="match">Ver detalles</button></div>${matchRow('Juventino','JUV','18:00','POZ','Pozos')}${matchRow('Rincón de Centeno','RIN','20:00','CUE','Cuenda')}${matchRow('San Pedro','SPD','20:00','MOR','Morales')}</div>`;
}

function navigate(route, push=true){
  if(!views[route]) route='home';
  if(push && state.route!==route) state.history.push(state.route);
  state.route=route;
  location.hash=`/${route}`;
  render();
}

function render(){
  screen.innerHTML=(views[state.route]||views.home)();
  const mainRoutes=['home','competition','video','fantasy','more'];
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.route===state.route || (state.route.startsWith('fantasy')&&n.dataset.route==='fantasy')));
  backButton.classList.toggle('is-hidden',mainRoutes.includes(state.route));
  bindSearch();
  window.scrollTo({top:0,behavior:'instant'});
}

function bindSearch(){
  const input=document.querySelector('#globalSearch');
  if(!input) return;
  const results=document.querySelector('#searchResults');
  const update=()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){results.innerHTML='<p class="muted">Escribe para buscar equipos y jugadores.</p>';return;}
    const teamMatches=teams.filter(t=>t.name.toLowerCase().includes(q));
    const playerMatches=scorers.filter(p=>p[0].toLowerCase().includes(q));
    results.innerHTML=`<div class="card match-card">${teamMatches.map(t=>`<div class="match-meta"><span class="club-cell">${crest(t.code)}<strong>${t.name}</strong></span><button class="link-button" data-route="teams">Ver</button></div>`).join('')}${playerMatches.map(p=>`<div class="match-meta"><span><strong>${p[0]}</strong><br><small class="muted">${p[1]}</small></span><button class="link-button" data-route="scorers">Ver</button></div>`).join('')}${!teamMatches.length&&!playerMatches.length?'<p class="muted">Sin resultados.</p>':''}</div>`;
  };
  input.addEventListener('input',update);update();
}

function handleAction(action){
  const messages={
    'follow-match':'Partido añadido a tus alertas','share':'Enlace preparado para compartir','play-video':'Reproductor preparado para la versión multimedia','player-slot':'Selector de jugador abierto','save-fantasy':'Equipo Fantasy guardado','transfer':'Transferencias Fantasy abiertas','create-league':'Liga privada creada en modo demo','join-league':'Introduce el código de invitación en la versión conectada','save-prediction':'Pronóstico guardado','quiz-answer':'Respuesta registrada','compare-answer':'Comparación revelada','directions':'Las indicaciones usarán la ubicación real configurada','login':'Inicio de sesión preparado para Firebase','register':'Registro preparado para Firebase'};
  if(action==='theme'){setTheme(state.theme==='dark'?'light':'dark');toast(`Tema ${state.theme==='dark'?'oscuro':'claro'} activado`);render();return;}
  toast(messages[action]||'Acción preparada');
}

document.addEventListener('click',e=>{
  const route=e.target.closest('[data-route]')?.dataset.route;
  if(route){navigate(route);return;}
  const comp=e.target.closest('[data-comp-tab]')?.dataset.compTab;
  if(comp){state.competitionTab=comp;render();return;}
  const follow=e.target.closest('[data-follow]')?.dataset.follow;
  if(follow){state.followed.has(follow)?state.followed.delete(follow):state.followed.add(follow);save();toast(state.followed.has(follow)?'Equipo añadido a Siguiendo':'Equipo eliminado de Siguiendo');render();return;}
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action) handleAction(action);
});

backButton.addEventListener('click',()=>{
  const previous=state.history.pop();
  navigate(previous||'home',false);
});

document.querySelector('#searchButton').addEventListener('click',()=>navigate('search'));
window.addEventListener('hashchange',()=>{const r=location.hash.replace('#/','');if(r&&r!==state.route){state.route=r;render();}});

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
render();
