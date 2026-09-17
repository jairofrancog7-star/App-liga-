const V11 = {
  league:'https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/720d1f82-1d59-4a7a-af69-9e7e8da0250a.png',
  teams:[
    {id:'america',code:'AMV',name:'Club América Veteranos J. Rosas',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/branding/america-veteranos-35-user.png',pts:19,pj:8,gd:11},
    {id:'lobos',code:'LOB',name:'Lobos CDG',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/lobos-cdg.webp',pts:17,pj:8,gd:8},
    {id:'huerta',code:'HUE',name:'La Huerta de Cuenda',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/la-huerta-cuenda.webp',pts:16,pj:8,gd:5},
    {id:'galeana',code:'ATG',name:'Atlético Galeana',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/atletico-galeana.webp',pts:14,pj:8,gd:2},
    {id:'promesas',code:'PRO',name:'Promesas FC Pozos',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/promesas-fc-pozos.webp',pts:13,pj:8,gd:1},
    {id:'franco',code:'FCO',name:'Franco FC',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/franco-fc.webp',pts:11,pj:8,gd:-1},
    {id:'sanantonio',code:'SAN',name:'San Antonio',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/san-antonio-jr.webp',pts:9,pj:8,gd:-3},
    {id:'esperanza',code:'ESP',name:'La Esperanza',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/la-esperanza-fc.webp',pts:8,pj:8,gd:-4},
    {id:'juventino',code:'JUV',name:'Deportivo Juventino Rosas',logo:'https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/720d1f82-1d59-4a7a-af69-9e7e8da0250a.png',pts:7,pj:8,gd:-5},
  ],
  players:[
    {name:'Mateo Villalobos',team:'america',num:10,pos:'Mediocampista',goals:8,assists:5},
    {name:'Diego Ramírez',team:'lobos',num:9,pos:'Delantero',goals:7,assists:3},
    {name:'Carlos Mendoza',team:'huerta',num:11,pos:'Delantero',goals:6,assists:2},
    {name:'Iván López',team:'galeana',num:8,pos:'Mediocampista',goals:5,assists:7},
    {name:'Luis Beltrán',team:'promesas',num:7,pos:'Extremo',goals:4,assists:4},
  ]
};
const t=(id)=>V11.teams.find(x=>x.id===id)||V11.teams[0];
const crest=(id,cls='')=>`<img class="v11-crest ${cls}" src="${t(id).logo}" alt="${t(id).name}">`;
const avatar=(p)=>`<span class="v11-avatar"><b>${p.num}</b><small>${p.name.split(' ')[0]}</small></span>`;
const row=(team,i,val)=>`<div class="v11-rank-row"><span class="v11-rank">${i+1}</span>${crest(team.id)}<span class="v11-team-name">${team.name}</span><b>${val}</b></div>`;

function shell(title,subtitle,body,opts=''){
  return `<div class="v11-ref-pack ${opts}"><div class="v11-page-head"><div><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div><img src="${V11.league}" alt="Liga Municipal de Futbol Juventino Rosas"></div>${body}</div>`;
}

function stats(){
  const goals=V11.teams.slice(0,5);
  const poss=[V11.teams[0],V11.teams[1],V11.teams[3],V11.teams[6],V11.teams[2]];
  return shell('Estadísticas','Fase municipal',`
    <div class="v11-tabs"><button class="active">General</button><button>Estadísticas de equipo</button><button>Estadísticas de jugador</button></div>
    <section class="v11-section"><div class="v11-section-title"><h2>Estadísticas de equipo</h2><button>Ver todo</button></div>
      <div class="v11-horizontal-cards">
        <article class="v11-stat-list"><h3>Goles</h3>${goals.map((x,i)=>row(x,i,[6,5,5,4,4][i])).join('')}<a>Ver todos los equipos ›</a></article>
        <article class="v11-stat-list"><h3>Posesión</h3>${poss.map((x,i)=>row(x,i,['61%','58%','56%','53%','52%'][i])).join('')}<a>Ver todos los equipos ›</a></article>
      </div>
    </section>`,`v11-stats`);
}

function rankings(){
  return shell('Rankings','Liga Municipal de Futbol Juventino Rosas, Guanajuato',`
    <div class="v11-tabs"><button class="active">Clubes</button><button>Categorías</button></div>
    <div class="v11-filter-row"><button>Temporada⌄</button><button>2026/27⌄</button></div>
    <section class="v11-table-card"><div class="v11-table-head"><span># · EQUIPO</span><span>PUNTOS / PJ</span><span>PROMEDIO</span></div>
    <div class="v11-table-label">LIGA MUNICIPAL DE FUTBOL JUVENTINO ROSAS</div>
    ${V11.teams.slice(0,8).map((x,i)=>`<div class="v11-table-row"><span class="v11-rank">${i+1}</span>${crest(x.id)}<b>${x.name}</b><span>${String(x.pts).padStart(2,'0')},000 / ${x.pj}</span><strong>${(x.pts/x.pj).toFixed(3).replace('.',',')}</strong></div>`).join('')}</section>
  `,'v11-rankings');
}

function history(){
  const seasons=[['2025/26','league'],['2024/25','america'],['2023/24','lobos'],['2022/23','huerta'],['2021/22','galeana']];
  return shell('Historia','',`
    <div class="v11-tabs"><button class="active">Resumen</button><button>Temporadas</button><button>Campeones</button><button>Finales</button></div>
    <section class="v11-section"><div class="v11-section-title"><h2>Buscar por temporada</h2><button>Ver todo</button></div>
      <div class="v11-season-strip">${seasons.map(([y,id])=>`<button>${id==='league'?`<img src="${V11.league}" alt="Liga">`:crest(id)}<span>${y}</span></button>`).join('')}</div>
    </section>
    <article class="v11-trophy-feature"><div class="v11-trophy">🏆</div><div><small>PALMARÉS MUNICIPAL</small><h2>Campeones de la Liga Municipal Juventino Rosas</h2><p>Historia, finales y equipos que han marcado nuestro torneo.</p></div></article>
    <section class="v11-section"><h2>Ver partidos clásicos</h2><div class="v11-media-strip">
      <button><span class="v11-media-art america">▶</span><b>América Veteranos vs Franco FC</b><small>Gran Final 2025 · 03:45</small></button>
      <button><span class="v11-media-art huerta">▶</span><b>Los diez mejores goles</b><small>Temporada 2024/25 · 05:12</small></button>
      <button><span class="v11-media-art galeana">▶</span><b>Clásicos de Juventino Rosas</b><small>Archivo municipal</small></button>
    </div></section>
  `,'v11-history');
}

function profile(){
  return shell('Perfil','',`
    <article class="v11-profile-card"><div><h2>Más de tu liga</h2><p>Crea tu cuenta y disfruta de resultados, calendarios, noticias, equipos, estadísticas y mucho más del futbol de Juventino Rosas, Guanajuato.</p></div><img src="${V11.league}" alt="Liga Juventino Rosas"><div class="v11-profile-actions"><button class="outline" data-action="login-demo">Iniciar sesión</button><button class="primary" data-action="login-demo">Crear una cuenta</button></div></article>
    <div class="v11-menu-list"><button data-route="following"><span>☆</span>Siguiendo<i>›</i></button><button data-route="notifications"><span>♧</span>Notificaciones<i>›</i></button><button><span>◎</span>Tu idioma preferido<i>›</i></button><button><span>▤</span>Ayúdanos a mejorar<i>›</i></button><button data-route="privacy"><span>◉</span>Ajustes de privacidad<i>›</i></button></div>
  `,'v11-profile');
}

function more(){
  const items=[['▣','Liga M. Juventino Rosas','competition'],['⇅','Más o Menos','moreLess'],['♕','Convivencia','venues'],['◉','Rankings','rankings'],['↶','Historia','history'],['□','Tienda','home'],['ⓘ','Sobre la liga','profile']];
  return shell('Más','',`<div class="v11-more-layout"><div class="v11-menu-list">${items.map(([ic,label,route],i)=>`${i===2?'<h3>En la liga</h3>':i===3?'<h3>Explorar</h3>':''}<button data-route="${route}"><span>${ic}</span>${label}<i>›</i></button>`).join('')}</div><div class="v11-ball-art"></div></div><div class="v11-more-brand"><img src="${V11.league}" alt="Liga"><p>Liga Municipal de Futbol<br>Juventino Rosas, Guanajuato</p><small>MÁS QUE FÚTBOL · NUESTRA LIGA</small></div>`,'v11-more');
}

function predictor(){
  return shell('Pronostica','Resultados de la jornada',`<div class="v11-game-hero"><div class="v11-cup">🏆</div><h2>¿QUIÉN GANA?</h2><p>Selecciona tu marcador para los partidos de la Liga Municipal.</p></div><div class="v11-predict-list">${[[0,1],[2,3],[4,5]].map((pair,i)=>{const a=V11.teams[pair[0]],b=V11.teams[pair[1]];return `<div class="v11-predict-row">${crest(a.id)}<b>${a.name}</b><input type="number" min="0" value="0"><span>–</span><input type="number" min="0" value="0"><b>${b.name}</b>${crest(b.id)}</div>`}).join('')}</div>`,'v11-game');
}

function moreLess(){
  const a=V11.players[0],b=V11.players[1];
  return shell('Más o Menos','¿Quién tiene más goles?',`<div class="v11-versus"><button>${avatar(a)}${crest(a.team)}<b>${a.name}</b><small>${a.pos}</small></button><span>VS</span><button>${avatar(b)}${crest(b.team)}<b>${b.name}</b><small>${b.pos}</small></button></div><div class="v11-game-note">Elige al jugador que crees que tiene la cifra más alta.</div>`,'v11-game');
}

function following(){
  return shell('Siguiendo','Tus equipos favoritos',`<div class="v11-follow-grid">${V11.teams.slice(0,6).map(x=>`<button>${crest(x.id)}<b>${x.name}</b><span>Siguiendo</span></button>`).join('')}</div><button class="v11-wide-button" data-route="teams">+ Añadir equipos</button>`,'v11-following');
}

function scorers(){
  return shell('Máximo goleador','Liga Municipal Juventino Rosas',`<article class="v11-scorer-hero">${avatar(V11.players[0])}<div><small>#1 MÁXIMO GOLEADOR</small><h2>${V11.players[0].name}</h2><p>${t(V11.players[0].team).name}</p><b>${V11.players[0].goals}<em> goles</em></b></div>${crest(V11.players[0].team)}</article><section class="v11-stat-list v11-full">${V11.players.map((p,i)=>`<div class="v11-player-row"><span class="v11-rank">${i+1}</span>${avatar(p)}${crest(p.team)}<span><b>${p.name}</b><small>${p.pos}</small></span><strong>${p.goals}</strong></div>`).join('')}</section>`,'v11-scorers');
}

function moments(){
  const cards=[['Gol de la jornada','america'],['Atajada espectacular','lobos'],['Celebración de equipo','huerta'],['Tiro libre decisivo','galeana'],['La jugada de la fecha','promesas'],['Noche de futbol municipal','franco']];
  return shell('Momentos','Futbol de nuestra gente',`<div class="v11-moments-grid">${cards.map(([title,id],i)=>`<button><span class="v11-moment-art m${i}">${crest(id)}</span><b>${title}</b><small>▶ ${i+2}:2${i}</small></button>`).join('')}</div>`,'v11-moments');
}

function video(){
  return shell('Vídeo','Revive la jornada',`<article class="v11-video-hero"><span>PERFORMANCE ZONE</span><h2>EL FÚTBOL<br>NOS UNE</h2><p>Goles, atajadas, entrevistas y resúmenes con contenido de la Liga Municipal.</p><button>▶ Ver resumen</button></article><section class="v11-section"><h2>Selección de la liga</h2><div class="v11-media-strip"><button><span class="v11-media-art america">▶</span><b>Resumen Jornada 5</b><small>08:20</small></button><button><span class="v11-media-art lobos">▶</span><b>Partido de la semana</b><small>12:46</small></button></div></section>`,'v11-video');
}

function fantasy(){
  return shell('Fantasy','Tu equipo, tus puntos',`<div class="v11-game-hero fantasy"><div class="v11-cup">⚽</div><h2>FANTASY MUNICIPAL</h2><p>Arma tu equipo con jugadores ficticios de la Liga Juventino Rosas.</p><button data-route="fantasyTeam">Crear mi equipo</button></div><div class="v11-fantasy-picks">${V11.players.slice(0,4).map(p=>`<button>${avatar(p)}${crest(p.team)}<b>${p.name}</b><small>${p.pos} · ${p.goals} goles</small></button>`).join('')}</div>`,'v11-fantasy');
}

function teams(){
  return shell('Equipos','Liga Municipal Juventino Rosas',`<div class="v11-team-grid">${V11.teams.map(x=>`<button>${crest(x.id)}<b>${x.name}</b><small>${x.code}</small></button>`).join('')}</div>`,'v11-teams');
}

function playerDetail(){
  const p=V11.players[0];
  return shell('Perfil de jugador','',`<article class="v11-player-profile"><div class="v11-player-portrait">${avatar(p)}</div><div><span class="v11-status">ACTIVO</span><h2>#${p.num} ${p.name}</h2><p>${p.pos}</p><div class="v11-club-line">${crest(p.team)}<b>${t(p.team).name}</b></div><dl><div><dt>Goles</dt><dd>${p.goals}</dd></div><div><dt>Asistencias</dt><dd>${p.assists}</dd></div><div><dt>Categoría</dt><dd>Veteranos</dd></div><div><dt>Edad deportiva</dt><dd>28 años</dd></div></dl></div></article>`,'v11-player-detail');
}

function teamDetail(){
  const x=V11.teams[0];
  return shell('Perfil de equipo','',`<article class="v11-team-profile">${crest(x.id,'hero')}<div><h2>${x.name}</h2><p>Veteranos · Juventino Rosas</p><div class="v11-pill-row"><span>1.º Lugar</span><span>${x.pts} pts</span><span>${x.pj} PJ</span></div></div></article><section class="v11-section"><h2>Últimos partidos</h2><div class="v11-results-strip">${['2–0','1–1','3–0','1–0','2–1'].map((s,i)=>`<span><small>J${i+1}</small><b>${s}</b><em>${i===1?'E':'G'}</em></span>`).join('')}</div></section>`,'v11-team-detail');
}

function competition(){
  const matches=[[0,1,'4–1'],[2,3,'2–0'],[4,8,'1–1'],[5,6,'—'],[7,0,'—']];
  return shell('Competición','Liga Municipal de Futbol Juventino Rosas, Gto.',`
    <div class="v11-tabs v11-comp-tabs"><button data-v11-comp="fixtures" class="active">Partidos y resultados</button><button data-v11-comp="standings">Clasificación</button><button data-v11-comp="bracket">Cuadro</button></div>
    <div data-v11-comp-panel>${competitionPanel('fixtures',matches)}</div>
  `,'v11-competition');
}
function competitionPanel(tab,matches){
  if(tab==='standings')return `<div class="v11-filter-row"><button>Veteranos⌄</button><button>Jornada 8⌄</button></div><section class="v11-table-card"><div class="v11-table-head"><span># · EQUIPO</span><span>PJ</span><span>PTS</span></div>${V11.teams.map((x,i)=>`<div class="v11-table-row compact"><span class="v11-rank">${i+1}</span>${crest(x.id)}<b>${x.name}</b><span>${x.pj}</span><strong>${x.pts}</strong></div>`).join('')}</section>`;
  if(tab==='bracket')return `<div class="v11-bracket-head"><button class="active">Play-off</button><button>Octavos de final</button><button>Cuartos de final</button></div><div class="v11-bracket">${[[0,7],[1,6],[2,5],[3,4]].map((p,i)=>`<div class="v11-bracket-pair"><div>${crest(V11.teams[p[0]].id)}<b>${V11.teams[p[0]].code}</b></div><span>o</span><div>${crest(V11.teams[p[1]].id)}<b>${V11.teams[p[1]].code}</b></div><i></i><strong>Ganador del play-off</strong></div>`).join('')}</div>`;
  return `<div class="v11-bracket-head"><button class="active">Todos</button><button>Resultados</button><button>Próximos</button></div><section class="v11-match-list"><h2>Jornada 8 · Veteranos</h2>${matches.map(([a,b,s],i)=>`<div class="v11-match-row">${crest(V11.teams[a].id)}<b>${V11.teams[a].name}</b><strong class="${s==='—'?'next':'final'}">${s==='—'?'VS':s}</strong><b>${V11.teams[b].name}</b>${crest(V11.teams[b].id)}<button>Detalles ›</button></div>`).join('')}</section>`;
}

const views={stats,rankings,history,profile,more,predictor,moreLess,following,scorers,moments,video,fantasy,teams,playerDetail,teamDetail,competition};
const titles={stats:'Estadísticas',rankings:'Rankings',history:'Historia',profile:'Perfil',more:'Más',predictor:'Pronostica',moreLess:'Más o Menos',following:'Siguiendo',scorers:'Máximo goleador',moments:'Momentos',video:'Vídeo',fantasy:'Fantasy',teams:'Equipos',playerDetail:'Perfil de jugador',teamDetail:'Perfil de equipo',competition:'Competición'};
let applying=false;
function route(){return location.hash.replace('#/','')||'home'}
function apply(){
  if(applying)return;
  const r=route(),screen=document.querySelector('#screen'); if(!screen||!views[r]) return;
  if(screen.querySelector('.v11-ref-pack')) return;
  applying=true; screen.innerHTML=views[r](); screen.dataset.v11Applied=r;
  const topbar=document.querySelector('.topbar'); if(topbar){topbar.dataset.title=titles[r]||'';topbar.classList.toggle('has-route-title',Boolean(titles[r]));}
  applying=false;
}
function boot(){
  const screen=document.querySelector('#screen'); if(!screen)return;
  const ob=new MutationObserver(()=>requestAnimationFrame(apply)); ob.observe(screen,{childList:true});
  window.addEventListener('hashchange',()=>requestAnimationFrame(apply));
  document.addEventListener('click',e=>{
    const routeEl=e.target.closest('[data-route]');
    if(routeEl&&routeEl.closest('.v11-ref-pack')){e.preventDefault();location.hash='#/'+routeEl.dataset.route;}
    const tab=e.target.closest('[data-v11-comp]');
    if(tab){e.preventDefault();document.querySelectorAll('[data-v11-comp]').forEach(x=>x.classList.toggle('active',x===tab));const panel=document.querySelector('[data-v11-comp-panel]');if(panel)panel.innerHTML=competitionPanel(tab.dataset.v11Comp,[[0,1,'4–1'],[2,3,'2–0'],[4,8,'1–1'],[5,6,'—'],[7,0,'—']]);}
  });
  requestAnimationFrame(apply);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
