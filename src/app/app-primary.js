function homeView(){
  return `<div class="home-page page-with-header">
    <header class="home-brand app-art-header">
      <div class="brand-lockup">${leagueLogo()}<div><b>LIGA MUNICIPAL DE FÚTBOL</b><strong>JUVENTINO ROSAS</strong><span>GUANAJUATO</span></div></div>
      <button class="circle-action" data-route="notifications" aria-label="Notificaciones">${icon('notification')}</button>
    </header>
    <div class="story-strip">
      ${['america','huerta','promesas','galeana','lobos','franco'].map(id=>`<button class="story-item" data-route="teams">${crest(id)}<span>${byId(id).short}</span></button>`).join('')}
    </div>
    <main class="home-content">
      <button class="home-score-card" data-action="toast" data-message="Detalles del partido">
        <div class="stadium-field"><i></i><i></i><i></i><i></i></div>
        <div class="score-bug">${crest('america')}<b>AMÉRICA</b><strong>2 - 1</strong><b>LA HUERTA</b>${crest('huerta')}<small>FINAL</small></div>
      </button>
      <button class="home-feature-card" data-route="video"><div class="feature-arcs"></div>${crest('promesas','feature-logo')}<span class="play-ring">▶</span><h2>Delantero de Promesas<br>brilla en la Jornada 6</h2></button>
      <div class="league-banner"><div><b>Nuestra liga, nuestra gente</b><span>Juventino Rosas, Guanajuato</span></div>${leagueLogo()}</div>
      <button class="home-wide-news" data-route="article"><span class="eyebrow">LIGA MUNICIPAL</span><h2>Una jornada que ya es parte de nuestra historia</h2><span class="play-ring small">▶</span></button>
      ${sectionTitle('Momentos','moments')}
      <div class="moments-mini">
        ${[['america','Gol de la jornada'],['promesas','La atajada del partido'],['huerta','Celebración local'],['galeana','Jugada destacada']].map(([id,t],i)=>`<button data-route="moments"><span class="mini-time">0:${45+i*7}</span>${crest(id)}<b>${t}</b></button>`).join('')}
      </div>
      <h2 class="home-subhead">Únete a los juegos</h2>
      <div class="game-promo-grid">
        <button data-route="predict-six" class="game-promo predictor"><span>${actionIcon('predictor')}</span><b>Pronostica Seis</b><small>Acierta resultados</small></button>
        <button data-route="fantasy" class="game-promo fantasy"><span>${actionIcon('fantasy')}</span><b>Fantasy</b><small>Arma tu equipo</small></button>
      </div>
      <button class="player-week" data-route="scorers"><div><span>JUGADOR DE LA SEMANA</span><h2>Diego Zamora</h2><p>Promesas FC · 4 goles</p></div>${crest('promesas')}</button>
      ${sectionTitle('Noticias','article')}
      <div class="news-three">${['El fútbol que nos une','Resultados de la jornada','Próxima fecha'].map((t,i)=>`<button data-route="article"><div class="news-thumb n${i+1}">${crest(['america','huerta','galeana'][i])}</div><b>${t}</b></button>`).join('')}</div>
    </main>
  </div>`
}

function competitionHeader(){
  return `<header class="competition-header app-art-header"><div class="competition-title-row"><h1>Competición</h1>${profileButton()}</div>
    <nav class="competition-tabs" aria-label="Competición">
      ${[['fixtures','Partidos y resultados'],['standings','Clasificación'],['bracket','Cuadro']].map(([id,l])=>`<button data-action="competition-tab" data-value="${id}" class="${state.competitionTab===id?'active':''}">${l}</button>`).join('')}
    </nav></header>`
}
function competitionView(){
  const body=state.competitionTab==='fixtures'?fixturesView():state.competitionTab==='standings'?standingsView():bracketView();
  return `<div class="competition-page page-with-header">${competitionHeader()}<main class="competition-body">${body}</main></div>`
}
function fixturesView(){
  const rows=fixtures[state.selectedDate]||fixtures[fixtureDates[0]];
  const cards=rows.map((r,i)=>{const [h,a,x,y,status]=r;const score=y?`${x} - ${y}`:x;return `<div class="fixture-row"><div class="fixture-clubs"><div>${crest(h)}<span>${byId(h).name}</span></div><div>${crest(a)}<span>${byId(a).name}</span></div></div><div class="fixture-result"><strong>${score}</strong>${status?`<small>${status}</small>`:''}<button data-action="toast" data-message="Detalles del partido">Ver detalles</button></div></div>`}).join('');
  return `<div class="date-strip">${fixtureDates.map((d,i)=>`<button data-action="select-date" data-value="${d}" class="${state.selectedDate===d?'active':''}"><b>${12+i*7}</b><span>${i<3?'SEP':'OCT'}</span></button>`).join('')}</div>
    <h2 class="date-heading">${state.selectedDate==='19 sep'?'19 de septiembre':state.selectedDate}</h2>
    <section class="fixture-card"><div class="fixture-title"><b>Liga Municipal de Fútbol</b><span>Jornada ${fixtureDates.indexOf(state.selectedDate)+4}</span></div>${cards}</section>
    <div class="local-sponsor-strip">${leagueLogo()}<div><b>LIGA MUNICIPAL DE FÚTBOL</b><span>JUVENTINO ROSAS · GUANAJUATO</span></div></div>
    <h2 class="date-heading next">Próxima jornada</h2>
    <section class="fixture-card compact">${fixtures['26 sep'].slice(0,2).map(r=>{const [h,a,x]=r;return `<div class="fixture-row"><div class="fixture-clubs"><div>${crest(h)}<span>${byId(h).name}</span></div><div>${crest(a)}<span>${byId(a).name}</span></div></div><div class="fixture-result"><strong>${x}</strong><button data-action="toast" data-message="Detalles del partido">Ver detalles</button></div></div>`}).join('')}</section>`
}
function standingsView(){
  return `<div class="standings-controls">${[['compact','Compacta'],['full','Completa'],['criteria','Criterios de desempate']].map(([id,l])=>`<button data-action="standings-mode" data-value="${id}" class="${state.standingsMode===id?'active':''}">${l}</button>`).join('')}</div>
  ${state.standingsMode==='criteria'?criteriaView():standingsTable(state.standingsMode==='full')}`
}
function standingsTable(full){
  return `<div class="standings-table ${full?'full':''}"><div class="standing-head"><span></span><span></span>${full?'<span>PJ</span><span>G</span><span>E</span><span>P</span>':'<span>P</span><span>+/-</span><span>PTOS</span><span>FORMA</span>'}</div><h3>DIRECTOS A OCTAVOS</h3>${standings.map((r,i)=>{const [id,p,gd,pts,form]=r;const t=byId(id);return `<div class="standing-row"><span class="rank">${i+1}</span><span class="standing-team">${crest(t)}<b>${t.short}</b></span>${full?`<span>${p}</span><span>${pts?1:0}</span><span>${pts===1?1:0}</span><span>${pts?0:1}</span>`:`<span>${p}</span><span>${gd>0?'+':''}${gd}</span><strong>${pts}</strong><span class="form-dots">${form.map(f=>`<i class="${f}">${f==='w'?'V':f==='d'?'E':f==='l'?'D':''}</i>`).join('')}</span>`}</div>`}).join('')}</div>`
}
function criteriaView(){return `<section class="criteria-card"><h2>Criterios de desempate</h2><p>Si dos o más equipos terminan igualados a puntos, la clasificación se determina por los criterios oficiales de la Liga Municipal.</p><ol><li>Diferencia de goles.</li><li>Mayor número de goles anotados.</li><li>Resultado entre los equipos empatados.</li><li>Menor número de sanciones disciplinarias.</li></ol><div class="criteria-legend"><span><i class="win"></i>Victoria</span><span><i class="draw"></i>Empate</span><span><i class="loss"></i>Derrota</span></div></section>`}

const bracketLinks=[['a1','b1'],['a2','b1'],['a3','b2'],['a4','b2'],['b1','c1'],['b2','c1']];
function bracketView(){
  const phases=[['playoff','Play-off'],['round16','Octavos de final'],['quarter','Cuartos de final'],['semi','Semifinales'],['final','Final']];
  if(state.bracketPhase==='final') return `<div class="phase-strip">${phases.map(([id,l])=>`<button data-action="bracket-phase" data-value="${id}" class="${state.bracketPhase===id?'active':''}">${l}</button>`).join('')}</div><div class="final-stage"><div class="final-match"><small>FINAL MUNICIPAL</small><div>${crest('america')}<b>América Vet.</b><strong>VS</strong><b>Promesas FC</b>${crest('promesas')}</div><span>Domingo · Campo Municipal</span></div><img src="${TROPHY}" alt="Trofeo de la Liga Municipal" class="final-trophy"></div>`;
  return `<div class="phase-strip">${phases.map(([id,l])=>`<button data-action="bracket-phase" data-value="${id}" class="${state.bracketPhase===id?'active':''}">${l}</button>`).join('')}</div><div class="bracket-scroll"><div class="bracket-board" id="bracketBoard"><svg class="bracket-svg" id="bracketSvg" aria-hidden="true"></svg><div class="bracket-col"><h4>16-19 & 24-25 feb</h4>${bracketMatch('a1','america','lobos')}${bracketMatch('a2','huerta','promesas')}${bracketMatch('a3','franco','galeana')}${bracketMatch('a4','pozos','juventino')}</div><div class="bracket-col second"><h4>9-12 & 17-18 mar</h4>${winnerCard('b1')}${winnerCard('b2')}</div><div class="bracket-col third"><h4>Siguiente ronda</h4>${winnerCard('c1')}</div></div></div>`
}
function bracketMatch(id,a,b){return `<div class="bracket-match" data-node="${id}"><div>${crest(a)}<b>${byId(a).code}</b><span>${Math.floor(Math.random()*3)}</span></div><div>${crest(b)}<b>${byId(b).code}</b><span>${Math.floor(Math.random()*3)}</span></div></div>`}
function winnerCard(id){return `<div class="bracket-match winner" data-node="${id}"><span class="shield">◆</span><b>Ganador del play-off</b></div>`}
function drawBracketLinks(){
  const board=document.getElementById('bracketBoard'),svg=document.getElementById('bracketSvg');if(!board||!svg)return;const br=board.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${board.scrollWidth} ${board.scrollHeight}`);svg.innerHTML='';for(const [from,to] of bracketLinks){const a=board.querySelector(`[data-node="${from}"]`),b=board.querySelector(`[data-node="${to}"]`);if(!a||!b)continue;const ar=a.getBoundingClientRect(),rr=b.getBoundingClientRect();const x1=ar.right-br.left+board.scrollLeft,y1=ar.top+ar.height/2-br.top+board.scrollTop,x2=rr.left-br.left+board.scrollLeft,y2=rr.top+rr.height/2-br.top+board.scrollTop,m=x1+(x2-x1)*.5;svg.insertAdjacentHTML('beforeend',`<path d="M${x1} ${y1}H${m}V${y2}H${x2}"/>`)}
}

function videoView(){
  const sections=[['Selección del editor',['EL SHOW DE LA LIGA','La historia detrás del gol']],['Resumen extendido',['Jornada 6: todos los goles','Juventino vs Pozos · resumen']],['Momentos',['La atajada de la fecha','Golazo desde media distancia']],['Repeticiones',['REPETICIÓN DEL PARTIDO','Partido de la semana']],['Conferencias',['Después del partido','La voz de los técnicos']],['Entrevistas',['Jugador de la jornada','Capitán local']],['Lo mejor de la temporada',['Los 10 mejores goles','Atajadas inolvidables']]];
  return `<div class="video-page"><section class="video-hero"><img src="${VIDEO_HERO}" alt="Futbolista ficticio de la Liga Juventino"><div class="video-brand">${leagueLogo()}<i></i><b>LIGA<br>JUVENTINO <em>TV</em></b></div>${profileButton()}<div class="video-copy"><h1>REPETICIÓN<br>DEL PARTIDO</h1><p>Revive los 90 minutos de la Liga Municipal de Fútbol de Juventino Rosas, Guanajuato.</p></div><div class="video-actions"><button class="video-primary" data-action="toast" data-message="Reproduciendo video">▶ &nbsp;Ver ahora</button><button data-action="toast" data-message="Partido de la semana">Partido de la semana</button></div><div class="hero-dots"><i></i><i class="active"></i><i></i><i></i><i></i></div></section><main class="video-feed">${sections.map((s,si)=>videoSection(s[0],s[1],si)).join('')}<section class="final-video-feature"><div>${leagueLogo()}<span>FINAL LOCAL</span><h2>El partido que define<br>al campeón municipal</h2><button data-action="toast" data-message="Final local">Ver final</button></div><img src="${TROPHY}" alt="Trofeo municipal"></section></main></div>`
}
function videoSection(title,cards,si){return `<section class="video-section">${sectionTitle(title)}<div class="media-scroll">${cards.map((c,i)=>`<button class="media-card ${si%3===0?'large':''}" data-action="toast" data-message="${esc(c)}"><div class="media-art media-${(si+i)%5}">${crest(['america','promesas','huerta','galeana','lobos'][(si+i)%5])}<span class="media-play">▶</span></div><b>${c}</b>${si===0||si===3?'<span class="login-chip">🔒 Iniciar sesión para ver</span>':''}</button>`).join('')}</div></section>`}

function fantasyView(){return state.fantasyView==='login'?fantasyLoginView():fantasyLandingView()}
function fantasyLandingView(){return `<div class="fantasy-page fantasy-landing"><div class="fantasy-lines l1"></div><div class="fantasy-lines l2"></div><header>${profileButton()}</header><div class="fantasy-wordmark">FANTASY</div><div class="fantasy-sub"><b>LIGA MUNICIPAL DE FÚTBOL</b><strong>JUVENTINO ROSAS</strong><span>G U A N A J U A T O</span></div><div class="sponsor-block"><span>Patrocinado por</span>${leagueLogo()}</div><div class="shirt-stage"><div class="shirt-card"><span class="shirt">✚</span></div><div class="shirt-card center"><span class="shirt">✚</span></div><div class="shirt-card"><span class="shirt">✚</span></div></div><div class="neon-pitch"></div><div class="stadium-glow"></div><button class="fantasy-start" data-action="fantasy-login" aria-label="Empezar Fantasy"></button></div>`}
function fantasyLoginView(){return `<div class="fantasy-login"><header class="fantasy-login-head"><h1>Fantasy Football</h1></header><div class="fantasy-sponsor"><span>Patrocinado por</span>${leagueLogo()}</div><div class="fantasy-player-frame"><img src="${VIDEO_HERO}" alt="Futbolistas ficticios celebrando"><div class="fantasy-player-overlay"></div></div><h2>Inicia sesión para jugar al<br>Fantasy</h2><p>Inicia sesión para guardar tu equipo, unirte a ligas y recibir alertas importantes sobre plazos.</p><button class="big-cyan" data-route="profile">Inicia sesión para jugar</button><button class="text-cyan" data-action="fantasy-guest">Iniciaré sesión después</button></div>`}

function moreView(){
 const groups=[['',[['following','Siguiendo','following'],['teams','Equipos','teams'],['performance','Performance Zone','performance'],['scorers','Máximo goleador','scorer'],['moments','Momentos','moments'],['statistics','Datos','statistics']]],['Gaming',[['predict-six','Pronostica Seis','predictor'],['quiz','Quiz Arena','quiz'],['more-or-less','Más O Menos','history']]],['En el evento',[['hospitality','Hospitalidad','hospitality']]],['Explorar',[['rankings','Rankings de la Liga','rankings'],['history','Historia','history'],['about','Sobre la Liga Municipal','teams']]]];
 return `<div class="more-page"><header class="more-header app-art-header"><h1>Más</h1>${profileButton()}${leagueLogo('more-logo')}<div class="more-ball"></div></header><main class="more-menu">${groups.map(([g,items])=>`<section>${g?`<h3>${g}</h3>`:''}${items.map(([route,label,ic])=>`<button data-route="${route}" class="more-row">${actionIcon(ic)}<span>${label}</span></button>`).join('')}</section>`).join('')}</main></div>`
}
