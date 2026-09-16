const teams = [
  { code:'JUV', name:'Juventino', p:5, gd:9, pts:13, form:['v','v','e','v','v'] },
  { code:'POZ', name:'Pozos', p:5, gd:6, pts:11, form:['v','e','v','v','e'] },
  { code:'RIN', name:'Rincón de Centeno', p:5, gd:3, pts:9, form:['e','v','d','v','v'] },
  { code:'CUE', name:'Cuenda', p:5, gd:1, pts:8, form:['v','e','e','d','v'] },
  { code:'SPD', name:'San Pedro', p:5, gd:-1, pts:6, form:['d','v','e','e','d'] },
  { code:'MOR', name:'Morales', p:5, gd:-4, pts:4, form:['d','e','d','v','d'] }
];
const scorers = [
  ['Juan Pérez','Juventino',8,'JUV'],['Carlos Ramírez','Pozos',6,'POZ'],['Miguel Torres','Rincón',5,'RIN'],['Ángel Cruz','Cuenda',5,'CUE'],['Diego Lara','San Pedro',4,'SPD']
];
const state = {
  route: location.hash.replace('#/','') || 'home',
  history: [],
  competitionTab: 'fixtures',
  theme: localStorage.getItem('lj-theme') || 'dark',
  followed: new Set(JSON.parse(localStorage.getItem('lj-followed') || '[]'))
};
const screen = document.querySelector('#screen');
const backButton = document.querySelector('#backButton');
const navItems = [...document.querySelectorAll('.nav-item')];

const icons = {
  back:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
  user:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.6-4 4.3-6 8-6s6.4 2 8 6"/></svg>`,
  home:`<svg viewBox="0 0 24 24"><path d="M3 11.2 12 4l9 7.2V21h-6v-6H9v6H3z"/></svg>`,
  trophy:`<svg viewBox="0 0 24 24"><path d="M8 4h8v4c0 3-1.5 5-4 6-2.5-1-4-3-4-6zM8 6H4v2c0 2.2 1.3 4 3.5 4.5M16 6h4v2c0 2.2-1.3 4-3.5 4.5M12 14v4M8 21h8M9 18h6"/></svg>`,
  play:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></svg>`,
  shirt:`<svg viewBox="0 0 24 24"><path d="M8 4 4 6 2 10l4 2v8h12v-8l4-2-2-4-4-2c-.5 1.6-1.8 2.4-4 2.4S8.5 5.6 8 4z"/></svg>`,
  menu:`<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>`
};
backButton.innerHTML = icons.back;
document.querySelector('.profile-button').innerHTML = icons.user;
document.querySelectorAll('[data-nav-icon]').forEach(el => el.innerHTML = icons[el.dataset.navIcon]);

function crest(code){return `<span class="crest">${code}</span>`}
function formDots(list){return `<span class="form">${list.map(x=>`<b class="${x}">${x.toUpperCase()}</b>`).join('')}</span>`}
function sectionHead(title,route,label='Ver todo'){return `<div class="section-head"><h2>${title}</h2>${route?`<button class="link-button" data-route="${route}">${label}</button>`:''}</div>`}
function matchRow(home,hc,score,ac,away){return `<div class="match-row"><span class="home">${home}</span>${crest(hc)}<b class="score">${score}</b>${crest(ac)}<span>${away}</span></div>`}
function save(){localStorage.setItem('lj-followed',JSON.stringify([...state.followed]))}
function toast(text){const t=document.createElement('div');t.className='toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),1600)}
function setTheme(theme){state.theme=theme;localStorage.setItem('lj-theme',theme);document.documentElement.classList.toggle('lightmode',theme==='light')}
setTheme(state.theme);

function homeView(){return `
  <div class="eyebrow">TORNEO MUNICIPAL · JORNADA 2</div>
  <h1 class="screen-title">El fútbol de<br>nuestro municipio</h1>
  <div class="stories" aria-label="Historias">
    ${[['Jornada','competition'],['Resultados','competition'],['Goleadores','scorers'],['Equipos','teams'],['Momentos','moments']].map(([n,r])=>`<button class="story" data-route="${r}"><span class="story-ring"><span class="story-inner"></span></span><small>${n}</small></button>`).join('')}
  </div>
  <section class="section hero">
    <span class="eyebrow" style="color:#fff">PARTIDO DE LA SEMANA</span>
    <h2>Juventino vs<br>Pozos</h2>
    <p>Una noche que se juega con la grada completa.</p>
    <div class="button-row"><button class="btn primary" data-route="match">Ver previa</button></div>
  </section>
  <section class="section">${sectionHead('Momentos','moments')}
    <div class="grid-2">
      <button class="moment" data-route="moments"><span class="badge">NUEVO</span><strong>Gol que encendió<br>la cancha</strong></button>
      <button class="moment" data-route="moments"><span class="badge">NUEVO</span><strong>La atajada<br>de la fecha</strong></button>
    </div>
  </section>
  <section class="section">${sectionHead('Próximos partidos','competition','Calendario')}
    <div class="card match-card"><div class="match-meta"><span class="live">EN VIVO · Jornada 2</span><span>18:00</span></div>
      ${matchRow('Juventino','JUV','1–0','POZ','Pozos')}
      ${matchRow('Cuenda','CUE','20:00','RIN','Rincón')}
    </div>
  </section>`}

function competitionBody(){
  if(state.competitionTab==='standings') return `
    <div class="segmented"><button class="segment active">Compacta</button><button class="segment">Completa</button><button class="segment">Criterios</button></div>
    <div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>P</th><th>+/-</th><th>Pts</th><th>Forma</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td><span class="club-cell">${crest(t.code)}${t.name}</span></td><td>${t.p}</td><td>${t.gd>0?'+':''}${t.gd}</td><td><b>${t.pts}</b></td><td>${formDots(t.form)}</td></tr>`).join('')}</tbody></table></div>`;
  if(state.competitionTab==='bracket') return `
    <div class="chips"><button class="chip active">Play-off</button><button class="chip">Octavos</button><button class="chip">Cuartos</button><button class="chip">Semifinal</button><button class="chip">Final</button></div>
    <p class="muted" style="font-size:10px;margin-bottom:10px">15–18 noviembre 2026 · Desliza para ver el cuadro</p>
    <div class="bracket-shell"><div class="bracket">
      <div class="round-col"><div class="node"><div class="node-row"><span>1 Juventino</span><b>2</b></div><div class="node-row"><span>8 Morales</span><b>0</b></div></div><div class="node"><div class="node-row"><span>4 Cuenda</span><b>1</b></div><div class="node-row"><span>5 Pozos</span><b>1</b></div></div></div>
      <div class="connector"></div><div class="round-col"><div class="node"><div class="node-row"><span>JUV</span><b>—</b></div><div class="node-row"><span>CUE</span><b>—</b></div></div></div>
      <div class="connector"></div><div class="round-col"><div class="node"><div class="node-row"><span>Final</span><b>—</b></div><div class="node-row"><span>2026</span><b>—</b></div></div></div>
    </div></div>`;
  return `
    <div class="datebar"><button class="chip">mié 9 oct</button><button class="chip">jue 10 oct</button><button class="chip active">mar 13 oct</button><button class="chip">mié 14 oct</button></div>
    <h2 style="font-size:19px;line-height:1;margin:3px 0 13px">martes, 13 octubre 2026</h2>
    <div class="card match-card"><div class="match-meta"><span>Fase liga · Jornada 2</span><button class="link-button" data-route="match">Ver detalles</button></div>
      ${matchRow('Juventino','JUV','18:00','POZ','Pozos')}
      ${matchRow('Rincón de Centeno','RIN','20:00','CUE','Cuenda')}
      ${matchRow('San Pedro','SPD','20:00','MOR','Morales')}
    </div>`;
}

function competitionView(){return `<div class="eyebrow">TORNEO MUNICIPAL</div><h1 class="screen-title" style="margin-bottom:14px">Competición</h1><div class="tabs"><button class="tab ${state.competitionTab==='fixtures'?'active':''}" data-comp-tab="fixtures">Partidos y resultados</button><button class="tab ${state.competitionTab==='standings'?'active':''}" data-comp-tab="standings">Clasificación</button><button class="tab ${state.competitionTab==='bracket'?'active':''}" data-comp-tab="bracket">Cuadro</button></div>${competitionBody()}`}

function menuGroup(title,items){return `<div class="menu-group"><h3>${title}</h3>${items.map(([label,route])=>`<button class="menu-row" data-route="${route}"><span>${label}</span><span>›</span></button>`).join('')}</div>`}
function rankRows(){return scorers.map((p,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(p[3])}<span><strong>${p[0]}</strong><br><small class="muted">${p[1]}</small></span><b>${p[2]}</b></div>`).join('')}

const views = {
  home: homeView,
  story:()=>`<div class="hero" style="min-height:270px;margin:4px -17px 0;border-radius:0;background:linear-gradient(180deg,#0D34AC 0%,#08B3D5 72%,#05D8E6 100%)"><span class="eyebrow" style="color:#70EDFF">HISTORIA 1 DE 6</span><h1 style="font-size:30px">LOS MEJORES<br>MOMENTOS</h1><p>La jornada se vive desde la cancha.</p><button class="btn primary" data-route="video">Ver ahora</button></div>`,
  competition:competitionView,
  match:()=>`<div class="eyebrow">FASE LIGA · JORNADA 2</div><h1 class="screen-title">Juventino<br>vs Pozos</h1><div class="card" style="padding:18px;text-align:center"><p class="muted" style="font-size:10px">HOY · 18:00 · Campo Municipal</p><div style="display:flex;align-items:center;justify-content:space-around;margin:20px 0"><div>${crest('JUV')}<b style="display:block;margin-top:7px">Juventino</b></div><span class="display">—</span><div>${crest('POZ')}<b style="display:block;margin-top:7px">Pozos</b></div></div><div class="button-row" style="justify-content:center"><button class="btn primary" data-action="follow-match">Seguir partido</button><button class="btn outline" data-action="share">Compartir</button></div></div><section class="section">${sectionHead('Cronología')}<div class="card match-card"><div class="match-meta"><span>12' · Gol</span><b>Juan Pérez</b></div><div class="match-meta"><span>34' · Amarilla</span><b>Luis Gómez</b></div><div class="match-meta"><span>76' · Gol</span><b>Carlos Ramírez</b></div></div></section>`,
  video:()=>`<div class="hero" style="min-height:320px;margin:0 -17px;border-radius:0 0 24px 24px"><span class="eyebrow" style="color:#fff">REVIVE LA JORNADA</span><h1 style="font-size:34px">FÚTBOL QUE<br>NOS UNE</h1><p>Mira las jugadas que marcaron el fin de semana.</p><div class="button-row"><button class="btn primary" data-action="play-video">Ver ahora</button><button class="btn outline" data-route="match">Partido de la semana</button></div></div><section class="section">${sectionHead('Selección del editor')}<div class="media-carousel"><button class="media-card" data-action="play-video"><span class="badge">12:46</span><h3>Final dramático en Cuenda</h3></button><button class="media-card" data-action="play-video"><span class="badge">08:20</span><h3>Resumen de la jornada</h3></button></div></section>`,
  fantasy:()=>`<div class="game-hero"><span class="eyebrow">TORNEO MUNICIPAL</span><h1 class="game-title">FANTASY<br>LIGA<br>JUVENTINO</h1><p class="muted" style="max-width:230px;margin-top:14px">Arma tu once, suma puntos y compite con tus amigos.</p><div class="button-row" style="margin-top:16px"><button class="btn primary" data-route="fantasyTeam">Crear mi equipo</button><button class="btn outline" data-route="fantasyLeagues">Ligas</button></div><div class="pitch"></div></div>`,
  fantasyTeam:()=>`<div class="eyebrow">FANTASY · JORNADA 2</div><h1 class="screen-title">Mi equipo</h1><div class="card match-card"><div class="match-meta"><span>Presupuesto</span><b>$100.0</b></div><div class="match-meta"><span>Puntos de jornada</span><b>47</b></div><div class="match-meta"><span>Transferencias</span><b>2</b></div></div><div class="pitch" style="height:360px"><div style="position:absolute;inset:20px;display:grid;grid-template-columns:repeat(3,1fr);align-content:space-around;gap:12px;text-align:center">${['POR','DEF','DEF','MED','MED','MED','DEL','DEL','CAP'].map((x,i)=>`<button class="btn ghost" data-action="player-slot">${x}<br><small>${i%2?'Juventino':'Pozos'}</small></button>`).join('')}</div></div><div class="button-row" style="margin-top:16px"><button class="btn primary" data-action="save-fantasy">Guardar equipo</button><button class="btn outline" data-action="transfer">Transferencias</button></div>`,
  fantasyLeagues:()=>`<div class="eyebrow">FANTASY</div><h1 class="screen-title">Ligas</h1><div class="profile-card"><h2>Compite con tus amigos</h2><p>Crea una liga privada o únete con un código.</p><div class="button-row"><button class="btn primary" data-action="create-league">Crear liga</button><button class="btn outline" data-action="join-league">Unirme</button></div></div><section class="section">${sectionHead('Clasificación')}<div class="stat-card"><div class="rank-row"><b>1</b>${crest('LJ')}<span>Jairo FC</span><b>92</b></div><div class="rank-row"><b>2</b>${crest('JUV')}<span>Juventino XI</span><b>88</b></div><div class="rank-row"><b>3</b>${crest('POZ')}<span>Pozos Fantasy</span><b>81</b></div></div></section>`,
  more:()=>`<h1 class="screen-title" style="margin-top:9px">Más</h1>${menuGroup('Principal',[['Siguiendo','following'],['Equipos','teams'],['Zona de Rendimiento','stats'],['Máximo goleador','scorers'],['Momentos','moments'],['Datos','stats']])}${menuGroup('Gaming',[['Pronostica / Quiniela','predictor'],['Quiz Arena','quiz'],['Más o Menos','moreLess']])}${menuGroup('En el evento',[['Campos / Sedes','venues'],['Información de jornada','competition']])}${menuGroup('Explorar',[['Rankings','rankings'],['Historia','history'],['Tienda','season'],['Sobre la competición','profile']])}${menuGroup('Cuenta',[['Tema claro','theme'],['Estados de carga','loading'],['Estado de error','error']])}`,
  following:()=>{const f=teams.filter(t=>state.followed.has(t.code));return f.length?`<div class="eyebrow">PERSONALIZADO</div><h1 class="screen-title">Siguiendo</h1><div class="card match-card">${f.map(t=>`<div class="match-meta"><span class="club-cell">${crest(t.code)}<b>${t.name}</b></span><button class="link-button" data-follow="${t.code}">Dejar de seguir</button></div>`).join('')}</div>`:`<div class="empty-state"><div class="empty-illustration"></div><h2>Sin equipos seguidos todavía</h2><p>Agrega tus equipos para recibir próximos partidos, resultados y noticias.</p><button class="btn outline" data-route="teams">+ Añadir equipos</button></div>`},
  teams:()=>`<div class="eyebrow">DIRECTORIO</div><h1 class="screen-title">Equipos</h1><div class="chips"><button class="chip active">Todos</button><button class="chip">Primera Fuerza</button><button class="chip">Veteranos 35+</button></div><div class="card match-card">${teams.map(t=>`<div class="match-meta" style="padding:10px 0;border-bottom:1px solid var(--line)"><span class="club-cell">${crest(t.code)}<span><b>${t.name}</b><br><small class="muted">Primera Fuerza</small></span></span><button class="btn ${state.followed.has(t.code)?'ghost':'outline'}" data-follow="${t.code}">${state.followed.has(t.code)?'Siguiendo':'Seguir'}</button></div>`).join('')}</div>`,
  scorers:()=>`<div class="eyebrow">ESTADÍSTICAS</div><h1 class="screen-title">Máximo goleador</h1><button class="media-card" style="width:100%;min-height:250px" data-action="play-video"><span class="badge">#1 MÁXIMO GOLEADOR</span><div><small>Juventino</small><h3 style="font-size:28px">Juan Pérez</h3><div class="big-number">8 <small style="font-size:11px;color:#D5DCF6">goles</small></div></div></button><section class="section">${sectionHead('Clasificación')}<div class="stat-card">${rankRows()}</div></section>`,
  moments:()=>`<div class="eyebrow">MEDIA</div><h1 class="screen-title">Momentos</h1><div class="grid-2">${['Gol que encendió la cancha','La atajada de la fecha','Doblete de Juventino','La reacción de Pozos','Gol desde fuera del área','El cierre del partido'].map(x=>`<button class="moment" data-action="play-video"><span class="badge">NUEVO</span><strong>${x}</strong></button>`).join('')}</div>`,
  stats:()=>`<div class="eyebrow">FASE FINAL</div><h1 class="screen-title">Estadísticas</h1><div class="tabs"><button class="tab active">General</button><button class="tab">Estadísticas de equipo</button><button class="tab">Estadísticas de jugador</button></div><section class="section">${sectionHead('Estadísticas de equipo')}${['Goles','Posesión'].map((title,j)=>`<div class="stat-card" style="margin-bottom:10px"><h3 style="margin-bottom:8px">${title}</h3>${teams.slice(0,5).map((t,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(t.code)}<span>${t.name}</span><b>${j?`${54-i}%`:6-i}</b></div>`).join('')}<button class="link-button" style="margin-top:8px">Ver todos los equipos ›</button></div>`).join('')}</section>`,
  rankings:()=>`<div class="eyebrow">TEMPORADA 2026</div><h1 class="screen-title">Rankings</h1><div class="segmented"><button class="segment active">Categorías</button><button class="segment">Clubes</button><button class="segment">Jugadores</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>Puntos</th><th>Partidos</th><th>Prom.</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td><span class="club-cell">${crest(t.code)}${t.name}</span></td><td><b>${t.pts}</b></td><td>${t.p}</td><td>${(t.pts/t.p).toFixed(1)}</td></tr>`).join('')}</tbody></table></div>`,
  history:()=>`<div class="eyebrow">LIGA JUVENTINO</div><h1 class="screen-title">Historia</h1><div class="tabs"><button class="tab active">Resumen</button><button class="tab">Temporadas</button><button class="tab">Campeones</button><button class="tab">Finales</button></div><section class="section">${sectionHead('Buscar por temporada')}<div class="chips"><button class="chip active">2026</button><button class="chip">2025</button><button class="chip">2024</button><button class="chip">2023</button></div></section><section class="section"><div class="hero" style="min-height:190px"><span class="eyebrow" style="color:#fff">HISTORIA</span><h2>Palmarés de Liga Juventino</h2><p>Campeones, finales y partidos que marcaron época.</p></div></section>`,
  season:()=>`<div style="margin:0 -17px;padding:27px 17px 22px;border-radius:0 0 30px 0;background:linear-gradient(120deg,#2E46A5,#3E63DD 50%,#00A2C7)"><h1 style="font-size:35px;line-height:.9">Temporada</h1><p style="margin-top:8px">2026/27</p></div><div class="tabs"><button class="tab">Partidos</button><button class="tab active">Tabla</button><button class="tab">Estadísticas</button></div><div class="chips"><button class="chip active">Todas las fechas</button><button class="chip">Todos los equipos</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>DG</th><th>PTS</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td><span class="club-cell">${crest(t.code)}${t.name}</span></td><td>${t.p}</td><td>${t.gd>0?'+':''}${t.gd}</td><td><b>${t.pts}</b></td></tr>`).join('')}</tbody></table></div>`,
  profile:()=>`<div class="eyebrow">CUENTA</div><h1 class="screen-title">Perfil</h1><div class="profile-card"><h2>Más de Liga Juventino</h2><p>Guarda tus equipos, participa en Fantasy y personaliza tus alertas.</p><div class="button-row"><button class="btn outline">Iniciar sesión</button><button class="btn primary">Crear una cuenta</button></div></div>${menuGroup('Ajustes',[['Siguiendo','following'],['Notificaciones','notifications'],['Tu idioma preferido','profile'],['Ayúdanos a mejorar','profile'],['Ajustes de privacidad','profile']])}`,
  notifications:()=>`<div class="eyebrow">CUENTA</div><h1 class="screen-title">Notificaciones</h1><div class="card match-card">${['Inicio de partido','Gol','Medio tiempo','Final','Cambio de horario','Noticias del equipo','Nuevo vídeo','Fantasy deadline','Quiniela deadline'].map((x,i)=>`<div class="match-meta" style="padding:12px 0;border-bottom:1px solid var(--line)"><span>${x}</span><input type="checkbox" ${i<4?'checked':''} aria-label="${x}"></div>`).join('')}</div>`,
  predictor:()=>`<div class="game-hero"><span class="eyebrow">JUEGA CADA JORNADA</span><h1 class="game-title">QUINIELA<br>LIGA<br>JUVENTINO</h1><p class="muted" style="margin-top:12px">Pronostica los marcadores y suma puntos.</p><div class="pitch"></div><button class="btn primary" style="align-self:flex-start;margin-top:15px" data-action="predict">Comenzar</button></div>`,
  quiz:()=>`<div class="game-hero"><span class="eyebrow">JUEGO</span><h1 class="game-title">QUIZ<br>ARENA</h1><p class="muted" style="margin-top:12px">¿Cuánto sabes de Liga Juventino?</p><div class="pitch"></div><button class="btn primary" style="align-self:flex-start;margin-top:15px" data-action="quiz">Jugar ahora</button></div>`,
  moreLess:()=>`<div class="game-hero"><span class="eyebrow">DUELO DE ESTADÍSTICAS</span><h1 class="game-title">MÁS<br>O<br>MENOS</h1><p class="muted" style="margin-top:12px">Decide quién supera la marca.</p><div class="pitch"></div><button class="btn primary" style="align-self:flex-start;margin-top:15px" data-action="more-less">Comenzar</button></div>`,
  venues:()=>`<div class="eyebrow">EN EL EVENTO</div><h1 class="screen-title">Campos / Sedes</h1><div class="card match-card"><div class="match-meta"><b>Campo Municipal</b><span>Jornada 2</span></div><p class="muted" style="font-size:11px">Ubicación e información oficial se mostrará cuando esté disponible.</p></div>`,
  loading:()=>`<div class="eyebrow">LIGA JUVENTINO</div><h1 class="screen-title">Cargando</h1><div class="skeleton-card large"></div><div class="skeleton-card"></div><div class="skeleton-card"></div>`,
  error:()=>`<div class="empty-state"><div class="empty-illustration"></div><h2>No pudimos cargar la información</h2><p>Comprueba tu conexión e inténtalo nuevamente.</p><button class="btn outline" data-route="home">Reintentar</button></div>`
};

function activeMainRoute(route){
  if(['home','competition','video','fantasy','more'].includes(route)) return route;
  if(route.startsWith('fantasy')) return 'fantasy';
  return 'more';
}
function render(){
  const view = views[state.route] || views.home;
  screen.innerHTML = view();
  const main = activeMainRoute(state.route);
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.route===main));
  bind();
  window.scrollTo({top:0,behavior:'instant'});
}
function go(route,push=true){
  if(route==='theme'){
    setTheme(state.theme==='dark'?'light':'dark');
    toast(state.theme==='light'?'Tema claro activado':'Tema oscuro activado');
    render();
    return;
  }
  if(push && state.route!==route) state.history.push(state.route);
  state.route=route;
  location.hash=`#/${route}`;
  render();
}
function bind(){
  screen.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.route)));
  screen.querySelectorAll('[data-comp-tab]').forEach(el=>el.addEventListener('click',()=>{state.competitionTab=el.dataset.compTab;render()}));
  screen.querySelectorAll('[data-follow]').forEach(el=>el.addEventListener('click',()=>{const c=el.dataset.follow;state.followed.has(c)?state.followed.delete(c):state.followed.add(c);save();toast(state.followed.has(c)?'Equipo añadido a Siguiendo':'Equipo eliminado');render()}));
  screen.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>{
    const a=el.dataset.action;
    const messages={
      'follow-match':'Partido añadido a tus alertas','share':'Compartir abierto','play-video':'Reproducción preparada','player-slot':'Selector de jugador','save-fantasy':'Equipo guardado','transfer':'Transferencias abiertas','create-league':'Liga privada creada','join-league':'Introduce tu código de liga','predict':'Quiniela iniciada','quiz':'Quiz iniciado','more-less':'Juego iniciado'
    };
    toast(messages[a]||'Acción realizada');
  }));
}

document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.route)));
backButton.addEventListener('click',()=>{
  if(state.history.length){state.route=state.history.pop();location.hash=`#/${state.route}`;render();}
  else if(state.route!=='home') go('home',false);
  else toast('Ya estás en Inicio');
});
window.addEventListener('hashchange',()=>{const route=location.hash.replace('#/','')||'home';if(route!==state.route){state.route=route;render()}});
render();
