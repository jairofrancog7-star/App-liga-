const teams = [
  { code:'JUV', id:'juventino', name:'Juventino', category:'Primera Fuerza', coach:'Marco Hernández', field:'Campo Municipal', p:5, gd:9, pts:13, form:['v','v','e','v','v'], founded:1988, news:'Juventino prepara la Jornada 6' },
  { code:'POZ', id:'pozos', name:'Pozos', category:'Primera Fuerza', coach:'Luis Trejo', field:'Unidad Deportiva Pozos', p:5, gd:6, pts:11, form:['v','e','v','v','e'], founded:1991, news:'Pozos mantiene su racha positiva' },
  { code:'RIN', id:'rincon', name:'Rincón de Centeno', category:'Primera Fuerza', coach:'Raúl Vega', field:'Campo Rincón', p:5, gd:3, pts:9, form:['e','v','d','v','v'], founded:1995, news:'Rincón recupera a dos titulares' },
  { code:'CUE', id:'cuenda', name:'Cuenda', category:'Primera Fuerza', coach:'Pedro López', field:'Campo Cuenda', p:5, gd:1, pts:8, form:['v','e','e','d','v'], founded:1993, news:'Cuenda apuesta por la cantera' },
  { code:'SPD', id:'sanpedro', name:'San Pedro', category:'Veteranos 35+', coach:'Óscar Martínez', field:'Campo San Pedro', p:5, gd:-1, pts:6, form:['d','v','e','e','d'], founded:1987, news:'San Pedro prepara su regreso' },
  { code:'MOR', id:'morales', name:'Morales', category:'Veteranos 35+', coach:'Jesús Molina', field:'Campo Morales', p:5, gd:-4, pts:4, form:['d','e','d','v','d'], founded:1990, news:'Morales anuncia nuevo entrenador' }
];
const HOME_OFFICIAL_STANDINGS=[
  {name:'San José FC',officialName:'SAN JOSE FC',p:4,gd:10,pts:12,logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseMonta%C3%B1a_ilen4d'},
  {name:'Juventus',officialName:'JUVENTUS',p:4,gd:14,pts:9,logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_ntqr0b'},
  {name:'Hermanos',officialName:'HERMANOS',p:3,gd:4,pts:7,logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Hermanos_kbfrmh'},
  {name:'Linces',officialName:'LINCES',p:3,gd:3,pts:6,logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c'},
  {name:'Napoli',officialName:'NAPOLI',p:4,gd:1,pts:6,logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv'},
  {name:'Franco FC',officialName:'FRANCO FC',p:3,gd:0,pts:6,logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoFC_vtd8d7'}
];
const players = [
  {id:'p1',name:'Juan Pérez',team:'JUV',position:'DEL',number:9,goals:8,assists:3,cards:1,minutes:420,cost:9.5,points:46},
  {id:'p2',name:'Carlos Ramírez',team:'POZ',position:'DEL',number:11,goals:6,assists:4,cards:0,minutes:405,cost:9.0,points:42},
  {id:'p3',name:'Miguel Torres',team:'RIN',position:'MED',number:8,goals:5,assists:5,cards:2,minutes:440,cost:8.5,points:39},
  {id:'p4',name:'Ángel Cruz',team:'CUE',position:'DEL',number:10,goals:5,assists:2,cards:1,minutes:390,cost:8.2,points:35},
  {id:'p5',name:'Diego Lara',team:'SPD',position:'MED',number:7,goals:4,assists:4,cards:3,minutes:430,cost:7.8,points:33},
  {id:'p6',name:'Luis Gómez',team:'JUV',position:'DEF',number:4,goals:1,assists:2,cards:4,minutes:450,cost:6.5,points:29},
  {id:'p7',name:'Iván Sánchez',team:'POZ',position:'DEF',number:5,goals:1,assists:1,cards:2,minutes:445,cost:6.2,points:27},
  {id:'p8',name:'Jorge Medina',team:'RIN',position:'POR',number:1,goals:0,assists:0,cards:0,minutes:450,cost:6.0,points:31},
  {id:'p9',name:'Mario Nieto',team:'CUE',position:'POR',number:1,goals:0,assists:0,cards:1,minutes:450,cost:5.8,points:28},
  {id:'p10',name:'Óscar León',team:'MOR',position:'DEF',number:3,goals:2,assists:0,cards:3,minutes:410,cost:5.9,points:25},
  {id:'p11',name:'Edgar Ruiz',team:'JUV',position:'MED',number:6,goals:3,assists:6,cards:2,minutes:430,cost:8.0,points:38},
  {id:'p12',name:'Sergio Luna',team:'POZ',position:'MED',number:8,goals:2,assists:5,cards:1,minutes:425,cost:7.7,points:34}
];
const matches = [
  {id:'m1',day:'Hoy',date:'13 oct',jornada:5,category:'Primera Fuerza',home:'JUV',away:'POZ',time:'18:00',status:'LIVE',score:'1–0',minute:63,venue:'Campo Municipal',referee:'José Ramírez'},
  {id:'m2',day:'Hoy',date:'13 oct',jornada:5,category:'Primera Fuerza',home:'CUE',away:'RIN',time:'20:00',status:'SCHEDULED',score:null,venue:'Campo Cuenda',referee:'Andrés Vega'},
  {id:'m3',day:'Mañana',date:'14 oct',jornada:5,category:'Veteranos 35+',home:'SPD',away:'MOR',time:'19:00',status:'SCHEDULED',score:null,venue:'Campo San Pedro',referee:'Luis Chávez'},
  {id:'m4',day:'Ayer',date:'12 oct',jornada:4,category:'Primera Fuerza',home:'RIN',away:'JUV',time:'18:00',status:'FINISHED',score:'1–3',venue:'Campo Rincón',referee:'Carlos León'},
  {id:'m5',day:'Ayer',date:'12 oct',jornada:4,category:'Primera Fuerza',home:'POZ',away:'CUE',time:'20:00',status:'FINISHED',score:'2–2',venue:'Unidad Deportiva Pozos',referee:'Miguel Lara'}
];
const news = [
  {id:'n1',category:'Liga',date:'Hoy',title:'Todo listo para la Jornada 5',subtitle:'Horarios, sedes y partidos que no te puedes perder.',content:'La Liga Juventino entra en una jornada clave con duelos directos en la parte alta de la clasificación.'},
  {id:'n2',category:'Equipos',date:'Ayer',title:'Juventino recupera jugadores para el duelo ante Pozos',subtitle:'El cuerpo técnico confirmó dos regresos.',content:'La plantilla trabajó completa en su última sesión previa al partido de la semana.'},
  {id:'n3',category:'Fichajes',date:'Hace 2 días',title:'Movimientos confirmados antes del cierre de registros',subtitle:'Altas y cambios de equipo en Primera Fuerza.',content:'La liga registró nuevos movimientos que estarán disponibles desde la siguiente jornada.'},
  {id:'n4',category:'Historia',date:'Hace 3 días',title:'Las finales que marcaron la Liga Juventino',subtitle:'Repasamos tres definiciones memorables.',content:'Una mirada a los partidos que se quedaron en la memoria de jugadores y aficionados.'}
];
const TRANSFER_TEAM_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const TRANSFER_TEAMS={
  LIGA:{name:'Registro Liga',logo:'assets/liga-logo.webp'},
  FRA:{name:'Franco FC',logo:'assets/official-logos/franco-fc.png'},
  HER:{name:'Hermanos',logo:'assets/official-logos/hermanos.png'},
  NAP:{name:'Napoli',logo:'assets/official-logos/napoli.png'},
  SJO:{name:'San José FC',logo:'assets/official-logos/san-jose-fc.png'},
  SJL:{name:'San Julián',logo:'assets/official-logos/san-julian.png'},
  TVF:{name:'Tavera FC',logo:'assets/official-logos/tavera-fc.png'}
};
/* Jugadores tomados de las plantillas registradas en public/data/official-live.json.
   Los estados Confirmado/Rumor/Alta conservan la función visual del módulo de mercado. */
const transfers = [
  {id:'t1',player:'Michell Ivan Rendon Rivera',position:'MED',from:'LIGA',to:'FRA',status:'Confirmado',date:'13 oct'},
  {id:'t2',player:'Luis Enrique Garcia Conejo',position:'DEF',from:'HER',to:'NAP',status:'Rumor',date:'12 oct'},
  {id:'t3',player:'Armando Conteras Pizano',position:'DEL',from:'LIGA',to:'NAP',status:'Confirmado',date:'10 oct'},
  {id:'t4',player:'Andrud Adair Avila Alfaro',position:'POR',from:'LIGA',to:'SJL',status:'Alta',date:'9 oct'}
];
function transferTeam(code){return TRANSFER_TEAMS[code]||TRANSFER_TEAMS.LIGA}
function transferCrest(code){
  const t=transferTeam(code);
  return '<span class="v71-transfer-crest"><img src="'+TRANSFER_TEAM_BASE+t.logo+'" alt="'+t.name+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'fallback\');this.parentElement.setAttribute(\'data-fallback\',\''+code+'\')"></span>';
}
const seasons = [
  {year:'2026',champion:'JUV',runner:'POZ',score:'3–1',scorer:'Juan Pérez',goals:8,mvp:'Edgar Ruiz'},
  {year:'2025',champion:'POZ',runner:'CUE',score:'2–1',scorer:'Carlos Ramírez',goals:10,mvp:'Carlos Ramírez'},
  {year:'2024',champion:'RIN',runner:'JUV',score:'1–0',scorer:'Miguel Torres',goals:9,mvp:'Miguel Torres'},
  {year:'2023',champion:'CUE',runner:'POZ',score:'2–2 (4–3 pen.)',scorer:'Ángel Cruz',goals:11,mvp:'Ángel Cruz'}
];
const defaults={theme:'dark',followed:[],favorites:[],predictions:{},fantasyPicks:{},cheers:{},notifications:{goal:true,kickoff:true,halftime:false,final:true,news:true,video:true,transfers:true,fantasy:true,predictor:true},privacy:{analytics:false,personalization:true,accepted:false},vote:null,user:null,selectedDay:'Hoy',matchCategory:'Todas',searchQuery:'',transferFilter:'Todos'};
function readStore(){let parsed={};try{parsed=JSON.parse(localStorage.getItem('lj-store-v3')||'{}')}catch{}return {...defaults,...parsed,notifications:{...defaults.notifications,...(parsed.notifications||{})},privacy:{...defaults.privacy,...(parsed.privacy||{})}}}
const store=readStore();
const state={route:location.hash.replace('#/','')||'home',history:[],competitionTab:'fixtures',selectedMatch:null,selectedTeam:null,selectedPlayer:null,selectedNews:null,historyTab:'Resumen',statsTab:'General',...store};
const screen=document.querySelector('#screen');const backButton=document.querySelector('#backButton');const navItems=[...document.querySelectorAll('.nav-item')];
const icons={back:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,user:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.6-4 4.3-6 8-6s6.4 2 8 6"/></svg>`,home:`<svg viewBox="0 0 24 24"><path d="M3 11.2 12 4l9 7.2V21h-6v-6H9v6H3z"/></svg>`,trophy:`<svg viewBox="0 0 24 24"><path d="M8 4h8v4c0 3-1.5 5-4 6-2.5-1-4-3-4-6zM8 6H4v2c0 2.2 1.3 4 3.5 4.5M16 6h4v2c0 2.2-1.3 4-3.5 4.5M12 14v4M8 21h8M9 18h6"/></svg>`,play:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></svg>`,shirt:`<svg viewBox="0 0 24 24"><path d="M8 4 4 6 2 10l4 2v8h12v-8l4-2-2-4-4-2c-.5 1.6-1.8 2.4-4 2.4S8.5 5.6 8 4z"/></svg>`,menu:`<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>`,search:`<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,star:`<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z"/></svg>`};
backButton.innerHTML=icons.back;document.querySelector('.profile-button').innerHTML=icons.user;document.querySelectorAll('[data-nav-icon]').forEach(el=>el.innerHTML=icons[el.dataset.navIcon]);
function save(){const data={theme:state.theme,followed:state.followed,favorites:state.favorites,predictions:state.predictions,fantasyPicks:state.fantasyPicks,cheers:state.cheers,notifications:state.notifications,privacy:state.privacy,vote:state.vote,user:state.user,selectedDay:state.selectedDay,matchCategory:state.matchCategory,transferFilter:state.transferFilter};localStorage.setItem('lj-store-v3',JSON.stringify(data))}
function toast(text){const t=document.createElement('div');t.className='toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
function setTheme(theme){state.theme=theme;document.documentElement.classList.toggle('lightmode',theme==='light');save()}setTheme(state.theme);
function team(code){return teams.find(t=>t.code===code)||teams[0]}function player(id){return players.find(p=>p.id===id)}function crest(code){return `<span class="crest">${code}</span>`}function formDots(list){return `<span class="form">${list.map(x=>`<b class="${x}">${x.toUpperCase()}</b>`).join('')}</span>`}function sectionHead(title,route,label='Ver todo'){return `<div class="section-head"><h2>${title}</h2>${route?`<button class="link-button" data-route="${route}">${label}</button>`:''}</div>`}function teamCell(code){const t=team(code);return `<span class="club-cell">${crest(code)}<span>${t.name}</span></span>`}function matchRow(m){const live=m.status==='LIVE'?`<span class="live">${m.minute}'</span>`:(m.score||m.time);return `<button class="match-row match-button" data-match="${m.id}"><span class="home">${team(m.home).name}</span>${crest(m.home)}<b class="score">${live}</b>${crest(m.away)}<span>${team(m.away).name}</span></button>`}function isFav(id){return state.favorites.includes(id)}function favButton(id,label='Favorito'){return `<button class="icon-action ${isFav(id)?'active':''}" data-favorite="${id}" aria-label="${label}">${icons.star}</button>`}function switchRow(key,label,sub=''){return `<label class="setting-row"><span><b>${label}</b>${sub?`<small>${sub}</small>`:''}</span><input type="checkbox" data-notification="${key}" ${state.notifications[key]?'checked':''}><i></i></label>`}function menuGroup(title,items){return `<div class="menu-group"><h3>${title}</h3>${items.map(([label,route,meta])=>`<button class="menu-row" data-route="${route}"><span>${label}${meta?`<small>${meta}</small>`:''}</span><span>›</span></button>`).join('')}</div>`}
function homeView(){
  const homeStandings=HOME_OFFICIAL_STANDINGS;
  const homeFields=(typeof V60_FIELDS!=='undefined'?V60_FIELDS:[]).slice(0,4);
  return `<div class="eyebrow">TORNEO MUNICIPAL · JORNADA 5</div>
    <h1 class="screen-title">El fútbol de<br>nuestro municipio</h1>
    <div class="stories">${[['Jornada','competition'],['Resultados','competition'],['Goleadores','scorers'],['Equipos','teams'],['Momentos','moments']].map(([n,r])=>`<button class="story" data-route="${r}"><span class="story-ring"><span class="story-inner"></span></span><small>${n}</small></button>`).join('')}</div>

    <section class="section hero">
      <span class="eyebrow" style="color:#fff">PARTIDO DE LA SEMANA</span>
      <h2>Juventino vs<br>Pozos</h2>
      <p>Una noche que se juega con la grada completa.</p>
      <div class="button-row"><button class="btn primary" data-match="m1">Ver previa</button><button class="btn outline" data-action="cheer" data-cheer="m1">Apoyar · ${state.cheers.m1||0}</button></div>
    </section>

    <section class="section">${sectionHead('Momentos','moments')}
      <div class="grid-2">
        <button class="moment" data-route="moments"><span class="badge">NUEVO</span><strong>Gol que encendió<br>la cancha</strong></button>
        <button class="moment" data-route="moments"><span class="badge">NUEVO</span><strong>La atajada<br>de la fecha</strong></button>
      </div>
    </section>

    <section class="section">${sectionHead('Próximos partidos','competition','Calendario')}
      <div class="card match-card"><div class="match-meta"><span class="live">EN VIVO · Jornada 5</span><span>18:00</span></div>${matchRow(matches[0])}${matchRow(matches[1])}</div>
    </section>

    <section class="section">${sectionHead('Noticias','news')}
      <div class="media-carousel">${news.slice(0,3).map(n=>`<button class="news-card" data-news="${n.id}"><span class="eyebrow">${n.category}</span><h3>${n.title}</h3><small>${n.date}</small></button>`).join('')}</div>
    </section>

    <section class="section v65-home-weather">
      <button type="button" class="v65-weather-main" data-route="weatherFields" aria-label="Abrir Clima y campos">
        <span class="v65-weather-icon">${v60Icon('weather')}</span>
        <span class="v65-weather-title">Clima y campos</span>
        <span class="v65-weather-arrow">›</span>
      </button>
      <div class="v65-weather-copy">
        <span>Consulta el clima, la sede y el estado informativo de los campos de la Liga.</span>
        <button type="button" data-route="weatherFields">Ver clima y campos</button>
      </div>
    </section>

    <section class="section v65-home-table">
      <div class="section-head"><h2>Tabla de posiciones</h2><button class="link-button" data-v63-comp="standings">Ver tabla</button></div>
      <div class="v65-table-card">
        <div class="v65-table-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>Pts</span></div>
        ${homeStandings.map((t,i)=>`<button type="button" class="v65-table-row" data-v62-team="${t.officialName||t.name}" aria-label="Ver ${t.name}">
          <b>${i+1}</b>
          <span class="v65-table-team"><span class="v65-table-logo"><img src="${t.logo}" alt="${t.name}" loading="lazy" decoding="async"></span><strong>${t.name}</strong></span>
          <span>${t.p}</span>
          <span>${t.gd>0?'+':''}${t.gd}</span>
          <strong>${t.pts}</strong>
        </button>`).join('')}
      </div>
    </section>

    <section class="section v65-home-fields">
      <div class="section-head"><h2>Dónde se juega</h2><button class="link-button" data-route="venues">Ver todos</button></div>
      <div class="v65-field-carousel">
        ${homeFields.map((f,i)=>`<button type="button" class="v65-field-card" data-route="venues" aria-label="Ver ${f.name}">
          <span class="v65-field-visual" aria-hidden="true"><img src="./assets/reference/predictor-v36/predictor-stadium.webp" alt=""></span>
          <span class="v65-field-info"><small>${f.community}</small><b>${f.name}</b><em>${f.weather?'Clima disponible':'Ubicación disponible'}</em></span>
          <span class="v65-field-go">›</span>
        </button>`).join('')}
      </div>
    </section>`;
}
function competitionBody(){if(state.competitionTab==='standings')return `<div class="segmented"><button class="segment active">Compacta</button><button class="segment">Completa</button><button class="segment">Criterios</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>P</th><th>+/-</th><th>Pts</th><th>Forma</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td>${teamCell(t.code)}</td><td>${t.p}</td><td>${t.gd>0?'+':''}${t.gd}</td><td><b>${t.pts}</b></td><td>${formDots(t.form)}</td></tr>`).join('')}</tbody></table></div>`;if(state.competitionTab==='bracket')return `<div class="chips"><button class="chip active">Play-off</button><button class="chip">Octavos</button><button class="chip">Cuartos</button><button class="chip">Semifinal</button><button class="chip">Final</button></div><p class="muted tiny">15–18 noviembre 2026 · Desliza para ver el cuadro</p><div class="bracket-shell"><div class="bracket"><div class="round-col"><div class="node"><div class="node-row"><span>1 Juventino</span><b>2</b></div><div class="node-row"><span>8 Morales</span><b>0</b></div></div><div class="node"><div class="node-row"><span>4 Cuenda</span><b>1</b></div><div class="node-row"><span>5 Pozos</span><b>1</b></div></div></div><div class="connector"></div><div class="round-col"><div class="node"><div class="node-row"><span>JUV</span><b>—</b></div><div class="node-row"><span>CUE</span><b>—</b></div></div></div><div class="connector"></div><div class="round-col"><div class="node"><div class="node-row"><span>Final</span><b>—</b></div><div class="node-row"><span>2026</span><b>—</b></div></div></div></div></div>`;const filtered=matches.filter(m=>(state.selectedDay==='Todos'||m.day===state.selectedDay)&&(state.matchCategory==='Todas'||m.category===state.matchCategory));return `<div class="datebar">${['Ayer','Hoy','Mañana','Todos'].map(d=>`<button class="chip ${state.selectedDay===d?'active':''}" data-day="${d}">${d}</button>`).join('')}</div><div class="chips"><button class="chip ${state.matchCategory==='Todas'?'active':''}" data-category="Todas">Todas</button><button class="chip ${state.matchCategory==='Primera Fuerza'?'active':''}" data-category="Primera Fuerza">Primera Fuerza</button><button class="chip ${state.matchCategory==='Veteranos 35+'?'active':''}" data-category="Veteranos 35+">Veteranos 35+</button></div><h2 class="compact-title">${state.selectedDay==='Todos'?'Todos los partidos':state.selectedDay}</h2><div class="card match-card">${filtered.length?filtered.map(matchRow).join(''):`<div class="empty-mini">No hay partidos con estos filtros.</div>`}</div>`}
function competitionView(){return `<div class="eyebrow">TORNEO MUNICIPAL</div><h1 class="screen-title">Competición</h1><div class="tabs"><button class="tab ${state.competitionTab==='fixtures'?'active':''}" data-comp-tab="fixtures">Partidos y resultados</button><button class="tab ${state.competitionTab==='standings'?'active':''}" data-comp-tab="standings">Clasificación</button><button class="tab ${state.competitionTab==='bracket'?'active':''}" data-comp-tab="bracket">Cuadro</button></div>${competitionBody()}`}
function matchView(){const m=matches.find(x=>x.id===state.selectedMatch)||matches[0];const pred=state.predictions[m.id];return `<div class="eyebrow">${m.category} · JORNADA ${m.jornada}</div><h1 class="screen-title">${team(m.home).name}<br>vs ${team(m.away).name}</h1><div class="card match-detail"><p class="muted tiny">${m.day.toUpperCase()} · ${m.time} · ${m.venue}</p><div class="scoreboard"><div>${crest(m.home)}<b>${team(m.home).name}</b></div><strong>${m.score||'—'}</strong><div>${crest(m.away)}<b>${team(m.away).name}</b></div></div><p class="muted tiny">Árbitro: ${m.referee}</p><div class="button-row center"><button class="btn primary" data-action="cheer" data-cheer="${m.id}">Apoyar partido · ${state.cheers[m.id]||0}</button>${favButton(`match:${m.id}`,'Guardar partido')}</div></div><section class="section">${sectionHead('Tu quiniela')}<div class="card predictor-card"><div class="prediction-teams"><b>${m.home}</b><input id="predHome" type="number" min="0" max="20" value="${pred?.home??0}"><span>–</span><input id="predAway" type="number" min="0" max="20" value="${pred?.away??0}"><b>${m.away}</b></div><button class="btn primary full" data-save-prediction="${m.id}">${pred?'Actualizar pronóstico':'Guardar pronóstico'}</button>${pred?`<small class="muted">Guardado: ${pred.home}–${pred.away}</small>`:''}</div></section><section class="section">${sectionHead('Cronología')}<div class="card match-card"><div class="match-meta"><span>12' · Gol</span><b>Juan Pérez</b></div><div class="match-meta"><span>34' · Amarilla</span><b>Luis Gómez</b></div><div class="match-meta"><span>63' · En juego</span><b>${m.status==='LIVE'?'Partido en vivo':'Información del partido'}</b></div></div></section>`}
function fantasyView(){return `<div class="game-hero"><span class="eyebrow">TORNEO MUNICIPAL</span><h1 class="game-title">FANTASY<br>LIGA<br>JUVENTINO</h1><p class="muted">Arma tu 7 Ideal, suma puntos y compite con tus amigos.</p><div class="button-row"><button class="btn primary" data-route="fantasyTeam">Mi 7 Ideal</button><button class="btn outline" data-route="fantasyLeagues">Ligas</button></div><div class="pitch"></div></div>`}
function fantasyTeamView(){const slots=[['POR',0],['DEF',1],['DEF',2],['MED',3],['MED',4],['DEL',5],['DEL',6]];const used=Object.values(state.fantasyPicks).map(x=>x.playerId);const total=Object.values(state.fantasyPicks).reduce((s,x)=>s+(player(x.playerId)?.points||0),0);return `<div class="eyebrow">FANTASY · JORNADA 5</div><h1 class="screen-title">Mi 7 Ideal</h1><div class="card fantasy-summary"><div><small>Puntos</small><b>${total}</b></div><div><small>Jugadores</small><b>${used.length}/7</b></div><div><small>Presupuesto</small><b>${(50-Object.values(state.fantasyPicks).reduce((s,x)=>s+(player(x.playerId)?.cost||0),0)).toFixed(1)}</b></div></div><div class="fantasy-field">${slots.map(([pos,slot])=>{const pick=state.fantasyPicks[slot];const p=pick&&player(pick.playerId);return `<button class="fantasy-slot ${p?'filled':''}" data-fantasy-slot="${slot}" data-position="${pos}">${p?`${crest(p.team)}<b>${p.name}</b><small>${p.points} pts</small>`:`<span>+</span><b>${pos}</b><small>Elegir jugador</small>`}</button>`}).join('')}</div><section class="section">${sectionHead('Jugadores disponibles')}<div class="player-list">${players.filter(p=>!used.includes(p.id)).map(p=>`<button class="player-row" data-add-player="${p.id}"><span>${crest(p.team)}<b>${p.name}</b><small>${p.position} · ${p.cost.toFixed(1)} · ${p.points} pts</small></span><span>+</span></button>`).join('')}</div></section><button class="btn outline full" data-action="clear-fantasy">Vaciar equipo</button>`}
function teamsView(){return `<div class="eyebrow">DIRECTORIO</div><h1 class="screen-title">Equipos</h1><div class="chips"><button class="chip active">Todos</button><button class="chip">Primera Fuerza</button><button class="chip">Veteranos 35+</button></div><div class="team-list">${teams.map(t=>`<div class="team-row"><button class="team-main" data-team="${t.code}">${crest(t.code)}<span><b>${t.name}</b><small>${t.category}</small></span></button><div class="row-actions"><button class="mini-btn ${state.followed.includes(t.code)?'active':''}" data-follow="${t.code}">${state.followed.includes(t.code)?'Siguiendo':'Seguir'}</button>${favButton(`team:${t.code}`,'Guardar equipo')}</div></div>`).join('')}</div>`}
function teamDetailView(){const t=team(state.selectedTeam||'JUV');const squad=players.filter(p=>p.team===t.code);return `<div class="team-hero">${crest(t.code)}<span><small>${t.category}</small><h1>${t.name}</h1><p>${t.field} · Fundado ${t.founded}</p></span>${favButton(`team:${t.code}`)}</div><div class="button-row"><button class="btn ${state.followed.includes(t.code)?'ghost':'primary'}" data-follow="${t.code}">${state.followed.includes(t.code)?'Dejar de seguir':'Seguir equipo'}</button></div><section class="section">${sectionHead('Información')}<div class="card info-grid"><div><small>Entrenador</small><b>${t.coach}</b></div><div><small>Puntos</small><b>${t.pts}</b></div><div><small>Diferencia</small><b>${t.gd>0?'+':''}${t.gd}</b></div><div><small>Campo</small><b>${t.field}</b></div></div></section><section class="section">${sectionHead('Plantilla','players')}<div class="player-list">${squad.map(p=>`<button class="player-row" data-player="${p.id}"><span>${crest(p.team)}<b>${p.number}. ${p.name}</b><small>${p.position} · ${p.goals} goles</small></span><span>›</span></button>`).join('')}</div></section><section class="section">${sectionHead('Noticias','news')}<div class="card news-inline"><b>${t.news}</b><small>Actualizado hoy</small></div></section>`}
function playersView(){return `<div class="eyebrow">JUGADORES</div><h1 class="screen-title">Plantillas</h1><div class="searchbox"><span>${icons.search}</span><input id="playerSearch" placeholder="Buscar jugador" value="${state.searchQuery||''}"></div><div class="player-list" id="playerResults">${filterPlayers(state.searchQuery||'').map(playerRowHtml).join('')}</div>`}function filterPlayers(q){q=(q||'').toLowerCase();return players.filter(p=>p.name.toLowerCase().includes(q)||team(p.team).name.toLowerCase().includes(q)||p.position.toLowerCase().includes(q))}function playerRowHtml(p){return `<button class="player-row" data-player="${p.id}"><span>${crest(p.team)}<b>${p.number}. ${p.name}</b><small>${team(p.team).name} · ${p.position}</small></span><span>${p.goals} G</span></button>`}function playerDetailView(){const p=player(state.selectedPlayer||'p1');return `<div class="player-hero"><div class="avatar-ball">${p.number}</div><span><small>${team(p.team).name} · ${p.position}</small><h1>${p.name}</h1></span>${favButton(`player:${p.id}`)}</div><section class="section"><div class="card stat-grid"><div><b>${p.goals}</b><small>Goles</small></div><div><b>${p.assists}</b><small>Asistencias</small></div><div><b>${p.minutes}</b><small>Minutos</small></div><div><b>${p.cards}</b><small>Tarjetas</small></div></div></section><section class="section">${sectionHead('Últimos partidos')}<div class="card match-card">${matchRow(matches[0])}${matchRow(matches[3])}</div></section>`}
function statsView(){return `<div class="eyebrow">DATOS</div><h1 class="screen-title">Estadísticas</h1><div class="tabs"><button class="tab ${state.statsTab==='General'?'active':''}" data-stats-tab="General">General</button><button class="tab ${state.statsTab==='Equipos'?'active':''}" data-stats-tab="Equipos">Equipos</button><button class="tab ${state.statsTab==='Jugadores'?'active':''}" data-stats-tab="Jugadores">Jugadores</button></div>${state.statsTab==='Jugadores'?`<section class="section">${sectionHead('Goleadores','scorers')}<div class="stat-card">${players.slice().sort((a,b)=>b.goals-a.goals).slice(0,5).map((p,i)=>`<button class="rank-row" data-player="${p.id}"><b>${i+1}</b>${crest(p.team)}<span><b>${p.name}</b><small>${team(p.team).name}</small></span><b>${p.goals}</b></button>`).join('')}</div></section><section class="section">${sectionHead('Asistencias')}<div class="stat-card">${players.slice().sort((a,b)=>b.assists-a.assists).slice(0,5).map((p,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(p.team)}<span>${p.name}</span><b>${p.assists}</b></div>`).join('')}</div></section>`:state.statsTab==='Equipos'?`<section class="section">${sectionHead('Rendimiento de equipos')}<div class="stat-card">${teams.map((t,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(t.code)}<span>${t.name}</span><b>${t.pts}</b></div>`).join('')}</div></section>`:`<section class="section"><div class="card stat-grid"><div><b>42</b><small>Goles</small></div><div><b>15</b><small>Partidos</small></div><div><b>2.8</b><small>Goles/partido</small></div><div><b>6</b><small>Equipos</small></div></div></section>${sectionHead('Líderes')}<div class="media-carousel"><div class="stat-card"><h3>Goles</h3>${players.slice().sort((a,b)=>b.goals-a.goals).slice(0,3).map((p,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(p.team)}<span>${p.name}</span><b>${p.goals}</b></div>`).join('')}</div><div class="stat-card"><h3>Asistencias</h3>${players.slice().sort((a,b)=>b.assists-a.assists).slice(0,3).map((p,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(p.team)}<span>${p.name}</span><b>${p.assists}</b></div>`).join('')}</div></div>`}`}
function newsView(){return `<div class="eyebrow">ACTUALIDAD</div><h1 class="screen-title">Noticias</h1><div class="chips"><button class="chip active">Todas</button><button class="chip">Liga</button><button class="chip">Equipos</button><button class="chip">Fichajes</button></div><div class="news-list">${news.map(n=>`<button class="news-row" data-news="${n.id}"><span class="news-thumb"></span><span><small>${n.category} · ${n.date}</small><b>${n.title}</b><p>${n.subtitle}</p></span></button>`).join('')}</div>`}function newsDetailView(){const n=news.find(x=>x.id===state.selectedNews)||news[0];return `<div class="eyebrow">${n.category} · ${n.date}</div><h1 class="screen-title">${n.title}</h1><div class="news-feature"></div><p class="article-lead">${n.subtitle}</p><p class="article-body">${n.content}</p><div class="button-row"><button class="btn outline" data-action="share">Compartir</button>${favButton(`news:${n.id}`,'Guardar noticia')}</div>`}function transfersView(){const list=transfers.filter(t=>state.transferFilter==='Todos'||t.status===state.transferFilter);return `<div class="eyebrow">MERCADO MUNICIPAL</div><h1 class="screen-title">Fichajes</h1><div class="chips">${['Todos','Confirmado','Rumor','Alta'].map(f=>`<button class="chip ${state.transferFilter===f?'active':''}" data-transfer-filter="${f}">${f}</button>`).join('')}</div><div class="transfer-list">${list.map(t=>`<div class="transfer-row"><span>${transferCrest(t.from)}<small>${transferTeam(t.from).name}</small></span><div><b>${t.player}</b><small>${t.position} · ${t.date}</small><em>${t.status}</em></div><span>${transferCrest(t.to)}<small>${transferTeam(t.to).name}</small></span></div>`).join('')}</div>`}
function favoritesView(){const ids=state.favorites;if(!ids.length)return `<div class="empty-state"><div class="empty-illustration"></div><h2>Sin favoritos todavía</h2><p>Guarda equipos, jugadores, partidos y noticias para encontrarlos aquí.</p><button class="btn outline" data-route="search">Explorar</button></div>`;return `<div class="eyebrow">TU COLECCIÓN</div><h1 class="screen-title">Favoritos</h1><div class="favorite-list">${ids.map(id=>favoriteCard(id)).join('')}</div>`}function favoriteCard(id){const [type,key]=id.split(':');if(type==='team'){const t=team(key);return `<div class="favorite-card"><button data-team="${key}">${crest(key)}<span><b>${t.name}</b><small>Equipo</small></span></button>${favButton(id)}</div>`}if(type==='player'){const p=player(key);return `<div class="favorite-card"><button data-player="${key}">${crest(p.team)}<span><b>${p.name}</b><small>Jugador</small></span></button>${favButton(id)}</div>`}if(type==='match'){const m=matches.find(x=>x.id===key);return `<div class="favorite-card"><button data-match="${key}">${crest(m.home)}<span><b>${team(m.home).name} vs ${team(m.away).name}</b><small>Partido</small></span></button>${favButton(id)}</div>`}if(type==='news'){const n=news.find(x=>x.id===key);return `<div class="favorite-card"><button data-news="${key}"><span class="mini-news"></span><span><b>${n.title}</b><small>Noticia</small></span></button>${favButton(id)}</div>`}return ''}
function normLeagueSearch(s){
  try{return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
  catch(e){return String(s||'').toLowerCase().trim()}
}
function searchView(){
  return '<div class="eyebrow">EXPLORAR</div><h1 class="screen-title">Buscar</h1>'+
    '<div class="searchbox"><span>'+icons.search+'</span><input id="globalSearch" type="search" autocomplete="off" placeholder="Equipos, jugadores, partidos, campos..." value="'+(state.searchQuery||'')+'"></div>'+
    '<div id="searchResults">'+searchResultsHtml(state.searchQuery||'')+'</div>';
}
function searchResultsHtml(q){
  const raw=String(q||''),needle=normLeagueSearch(raw);
  const tools=[
    ['Reglamento','rulebook','Reglamento oficial documentos PDF'],
    ['Match Day','matchday','jornada partidos operación'],
    ['Clima y campos','weatherFields','clima campo sede lluvia'],
    ['Dónde se juega','venues','campos sedes comunidades mapas'],
    ['Cédulas','cedulas','cedulas partidos documentos'],
    ['Credencial','credential','credencial jugador deportiva'],
    ['Publicaciones','publications','whatsapp compartir jornada'],
    ['QR de la Liga','ligaQR','qr compartir app acceso'],
    ['Rankings de la Liga','rankings','ranking clubes clasificación'],
    ['Historia','history','historia temporadas campeones finales'],
    ['Máximo goleador','scorers','goleadores jugadores goles'],
    ['Equipos','teams','clubes equipos'],
    ['Siguiendo','following','equipos seguidos favoritos']
  ];
  if(!needle){
    return '<section class="section">'+sectionHead('Accesos rápidos')+
      '<div class="quick-grid">'+
        '<button data-route="teams">Equipos</button>'+
        '<button data-route="players">Jugadores</button>'+
        '<button data-route="competition">Partidos</button>'+
        '<button data-route="venues">Campos</button>'+
        '<button data-route="news">Noticias</button>'+
        '<button data-route="ligaQR">QR de la Liga</button>'+
      '</div></section>';
  }
  const ts=teams.filter(t=>normLeagueSearch([t.name,t.category,t.field,t.news].join(' ')).includes(needle));
  const ps=players.filter(p=>normLeagueSearch([p.name,p.position,team(p.team).name].join(' ')).includes(needle));
  const ns=news.filter(n=>normLeagueSearch([n.title,n.category,n.subtitle,n.content].join(' ')).includes(needle));
  const ms=matches.filter(m=>normLeagueSearch([team(m.home).name,team(m.away).name,m.category,m.day,m.date,m.time,m.venue,m.referee].join(' ')).includes(needle));
  const fs=(typeof V60_FIELDS!=='undefined'?V60_FIELDS:[]).filter(f=>normLeagueSearch([f.name,f.community,f.address].join(' ')).includes(needle));
  const us=tools.filter(x=>normLeagueSearch(x.join(' ')).includes(needle));
  const parts=[];
  if(ts.length)parts.push(sectionHead('Equipos')+ts.map(t=>'<button class="search-result" data-team="'+t.code+'">'+crest(t.code)+'<span><b>'+t.name+'</b><small>'+t.category+'</small></span></button>').join(''));
  if(ps.length)parts.push(sectionHead('Jugadores')+ps.map(p=>'<button class="search-result" data-player="'+p.id+'">'+crest(p.team)+'<span><b>'+p.name+'</b><small>'+p.position+' · '+team(p.team).name+'</small></span></button>').join(''));
  if(ms.length)parts.push(sectionHead('Partidos')+ms.map(m=>'<button class="search-result" data-match="'+m.id+'">'+crest(m.home)+'<span><b>'+team(m.home).name+' vs '+team(m.away).name+'</b><small>'+m.day+' · '+m.time+' · '+m.venue+'</small></span></button>').join(''));
  if(fs.length)parts.push(sectionHead('Campos y sedes')+fs.map(f=>'<button class="search-result" data-route="venues"><span class="mini-news"></span><span><b>'+f.name+'</b><small>'+f.community+'</small></span></button>').join(''));
  if(ns.length)parts.push(sectionHead('Noticias')+ns.map(n=>'<button class="search-result" data-news="'+n.id+'"><span class="mini-news"></span><span><b>'+n.title+'</b><small>'+n.category+'</small></span></button>').join(''));
  if(us.length)parts.push(sectionHead('Herramientas')+us.map(x=>'<button class="search-result" data-route="'+x[1]+'"><span class="mini-news"></span><span><b>'+x[0]+'</b><small>Liga Municipal de Fútbol</small></span></button>').join(''));
  return '<section class="section">'+(parts.length?parts.join(''):'<div class="empty-mini">No encontramos resultados en la Liga.</div>')+'</section>';
}
function officialVoteCandidates(){
  const selected=String(localStorage.getItem('v62-category')||'');
  const db=window.LJR_OFFICIAL_DATA;
  const rowsFor=(id)=>{
    const cat=db?.categories?.[String(id)];
    const block=cat?.scorers?.[0];
    return (block?.rows||[]).filter(r=>r.length>=4&&/^\d+$/.test(String(r[3]||''))).map(r=>({
      id:'official:'+String(id)+':'+String(r[1]||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
      name:String(r[1]||'').trim(),
      team:String(r[2]||'').trim(),
      goals:Number(r[3]||0),
      category:String(cat?.name||'Liga Juventino Rosas')
    }));
  };
  let list=[];
  if(db&&selected){
    const own=rowsFor(selected);
    if(own.length>=4)list=own;
  }
  if(db&&list.length<4){
    list=Object.keys(db.categories||{}).flatMap(rowsFor);
  }
  if(!list.length){
    /* Respaldo verificado contra data/official-live.json del 19-09-2026.
       Evita volver a mostrar nombres o equipos ficticios mientras carga la fuente oficial. */
    list=[
      {id:'official:1:hugo-armenta-buenavista',name:'Hugo Armenta Buenavista',team:'DYNAMO',goals:5,category:'Veteranos 50+'},
      {id:'official:4:telesforo-freyre-valadez',name:'TELESFORO FREYRE VALADEZ',team:'DEP. NOPALERO',goals:4,category:'Segunda Fuerza'},
      {id:'official:1:j-carmen-subias-miranda',name:'J. Carmen Subias Miranda',team:'MANCHESTER',goals:4,category:'Veteranos 50+'},
      {id:'official:1:jose-mendoza-pescador',name:'Jose Mendoza Pescador',team:'LA ESPERANZA',goals:3,category:'Veteranos 50+'}
    ];
  }
  const seen=new Set();
  return list
    .filter(x=>x.name&&x.team&&!seen.has((x.name+'|'+x.team).toLowerCase())&&seen.add((x.name+'|'+x.team).toLowerCase()))
    .sort((a,b)=>b.goals-a.goals||a.name.localeCompare(b.name,'es'))
    .slice(0,4);
}
function officialVoteTeamLogo(name){
  const fromRegistry=window.LJR_TEAM_LOGOS?.get?.(name);
  if(fromRegistry)return fromRegistry;
  const base='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const key=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const map={
    'dynamo':'assets/official-logos/dynamo.png',
    'dep nopalero':'assets/official-logos/dep-nopalero.png',
    'deportivo nopalero':'assets/official-logos/dep-nopalero.png',
    'manchester':'assets/official-logos/manchester.png',
    'la esperanza':'assets/official-logos/la-esperanza.png',
    'atl galeana':'assets/official-logos/galeana.png',
    'atletico galeana':'assets/official-logos/galeana.png',
    'promesas fc':'assets/official-logos/promesas-fc.png',
    'aldama fc':'assets/official-logos/aldama-fc.png',
    'celticos':'assets/official-logos/celticos.png',
    'dep zapata':'assets/official-logos/dep-zapata.png'
  };
  return map[key]?base+map[key]:'';
}
function officialVoteInitials(name){
  const parts=String(name||'').trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0]||'')+(parts.length>1?parts[parts.length-1][0]:'')).toUpperCase();
}
function voteView(){
  const candidates=officialVoteCandidates();
  const validVote=candidates.some(p=>p.id===state.vote)?state.vote:null;
  if(state.vote&&!validVote){state.vote=null;save()}
  return `<div class="eyebrow">VOTACIÓN</div><h1 class="screen-title">Jugador de la Jornada</h1><p class="muted">Candidatos tomados de jugadores y equipos registrados en la Liga. Elige una sola vez; tu voto queda guardado en este dispositivo.</p><div class="vote-grid">${candidates.map(p=>{
    const logo=officialVoteTeamLogo(p.team);
    const teamMark=logo
      ?`<span class="vote-team-logo"><img src="${logo}" alt="${p.team}" loading="lazy" decoding="async"></span>`
      :`<span class="vote-team-logo fallback">${p.team.slice(0,3)}</span>`;
    return `<button class="vote-card ${state.vote===p.id?'selected':''}" data-vote="${p.id}" data-vote-name="${p.name.replace(/"/g,'&quot;')}" ${state.vote&&state.vote!==p.id?'disabled':''}><div class="avatar-ball vote-player-initials">${officialVoteInitials(p.name)}</div>${teamMark}<b>${p.name}</b><small class="vote-team-name">${p.team}</small><small>${p.goals} goles · ${p.category}</small><span>${state.vote===p.id?'VOTADO':'VOTAR'}</span></button>`;
  }).join('')}</div>`;
}
function notificationsView(){return `<div class="eyebrow">PREFERENCIAS</div><h1 class="screen-title">Notificaciones</h1>${sectionHead('Partidos')}<div class="settings-card">${switchRow('goal','Goles','Alertas cuando cambie el marcador')}${switchRow('kickoff','Inicio de partido')}${switchRow('halftime','Medio tiempo')}${switchRow('final','Final del partido')}</div>${sectionHead('Contenido')}<div class="settings-card">${switchRow('news','Noticias')}${switchRow('video','Nuevos videos')}${switchRow('transfers','Fichajes')}</div>${sectionHead('Juegos')}<div class="settings-card">${switchRow('fantasy','Fantasy')}${switchRow('predictor','Quiniela')}</div>`}function privacyView(){return `<div class="eyebrow">TU PRIVACIDAD</div><h1 class="screen-title">Privacidad</h1><div class="profile-card"><h2>Controla tus datos</h2><p>Estas preferencias se guardan localmente. Cuando conectemos Firebase, podrán sincronizarse con tu cuenta.</p></div><div class="settings-card section"><label class="setting-row"><span><b>Analítica opcional</b><small>Ayuda a mejorar la app</small></span><input type="checkbox" data-privacy="analytics" ${state.privacy.analytics?'checked':''}><i></i></label><label class="setting-row"><span><b>Personalización</b><small>Ordenar contenido según tus equipos</small></span><input type="checkbox" data-privacy="personalization" ${state.privacy.personalization?'checked':''}><i></i></label></div><button class="btn primary full section" data-action="accept-privacy">${state.privacy.accepted?'Preferencias guardadas':'Aceptar y guardar'}</button>`}
function historyView(){return `<div class="eyebrow">ARCHIVO MUNICIPAL</div><h1 class="screen-title">Historia</h1><div class="tabs">${['Resumen','Temporadas','Campeones','Finales','Récords'].map(x=>`<button class="tab ${state.historyTab===x?'active':''}" data-history-tab="${x}">${x}</button>`).join('')}</div>${historyBody()}`}
function historyBody(){if(state.historyTab==='Temporadas')return `<section class="section"><div class="season-grid">${seasons.map(s=>`<button class="season-card"><b>${s.year}</b><span>${crest(s.champion)} Campeón: ${team(s.champion).name}</span><small>Final ${s.score}</small></button>`).join('')}</div></section>`;if(state.historyTab==='Campeones')return `<section class="section"><div class="stat-card">${[['JUV',3],['POZ',2],['CUE',2],['RIN',1]].map((x,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(x[0])}<span>${team(x[0]).name}</span><b>${x[1]}</b></div>`).join('')}</div></section>`;if(state.historyTab==='Finales')return `<section class="section"><div class="news-list">${seasons.map(s=>`<div class="news-row"><span class="news-thumb"></span><span><small>Final ${s.year}</small><b>${team(s.champion).name} ${s.score} ${team(s.runner).name}</b><p>MVP: ${s.mvp}</p></span></div>`).join('')}</div></section>`;if(state.historyTab==='Récords')return `<section class="section"><div class="card stat-grid"><div><b>11</b><small>Máx. goles temporada</small></div><div><b>5</b><small>Victorias seguidas</small></div><div><b>3</b><small>Títulos Juventino</small></div><div><b>118</b><small>Goles récord</small></div></div></section>`;return `<section class="section">${sectionHead('Buscar por temporada')}<div class="media-carousel">${seasons.map(s=>`<button class="season-card"><b>${s.year}</b><span>${crest(s.champion)}</span><small>${team(s.champion).name}</small></button>`).join('')}</div></section><section class="section"><div class="history-feature"><span class="eyebrow">PALMARÉS</span><h2>La historia de Liga Juventino</h2><p>Campeones, finales y partidos que marcaron al torneo.</p></div></section>`}
function profileView(){return `<div class="eyebrow">CUENTA</div><h1 class="screen-title">Perfil</h1>${state.user?`<div class="profile-card"><div class="avatar-ball">${state.user.name.slice(0,1).toUpperCase()}</div><h2>${state.user.name}</h2><p>${state.user.email}</p><button class="btn outline" data-action="logout">Cerrar sesión</button></div>`:`<div class="profile-card"><h2>Más de Liga Juventino</h2><p>Inicia sesión para guardar tu identidad, tu Fantasy y tus preferencias.</p><div class="button-row"><button class="btn primary" data-action="login-demo">Iniciar sesión</button><button class="btn outline" data-action="login-demo">Crear cuenta</button></div></div>`}${menuGroup('Tu contenido',[['Favoritos','favorites',`${state.favorites.length} guardados`],['Siguiendo','following',`${state.followed.length} equipos`],['Mi Fantasy','fantasyTeam'],['Quiniela','predictor']])}${menuGroup('Ajustes',[['Notificaciones','notifications'],['Privacidad','privacy'],['Cambiar tema','theme']])}`}
function predictorView(){
  return `<section class="v37-predictor-reference" aria-label="Pronostica Seis">
    <img
      class="v37-predictor-reference-image"
      src="./assets/reference/predictor-master.png?v=20260919-predictor-master"
      alt="Pronostica Seis"
      draggable="false"
    >
    <button type="button" class="v37-predictor-enter" data-route="predictorSix" aria-label="Abrir Pronostica Seis"></button>
    <nav class="v37-predictor-hotnav" aria-label="Navegación">
      <button type="button" data-route="home" aria-label="Inicio"></button>
      <button type="button" data-route="competition" aria-label="Competición"></button>
      <button type="button" data-route="video" aria-label="Vídeo"></button>
      <button type="button" data-route="fantasy" aria-label="Fantasy"></button>
      <button type="button" data-route="more" aria-label="Más"></button>
    </nav>
  </section>`;
}

function predictorSixView(){
  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const games=[
    ['p6a','América Veteranos','assets/branding/america-veteranos-35-user.png','La Huerta','assets/official-logos/la-huerta.png'],
    ['p6b','Promesas FC','assets/official-logos/promesas-fc.png','Franco FC','assets/official-logos/franco-fc.png'],
    ['p6c','Atlético Galeana','assets/official-logos/galeana.png','Lobos CDG','assets/official-logos/lobos-cdg.png'],
    ['p6d','La Huerta','assets/official-logos/la-huerta.png','Promesas FC','assets/official-logos/promesas-fc.png'],
    ['p6e','Franco FC','assets/official-logos/franco-fc.png','Atlético Galeana','assets/official-logos/galeana.png'],
    ['p6f','Lobos CDG','assets/official-logos/lobos-cdg.png','América Veteranos','assets/branding/america-veteranos-35-user.png']
  ];
  const slides=[
    ['Pronostica seis resultados','Consigue puntos por el marcador, la diferencia de goles y los goles marcados por cada equipo.'],
    ['Elige tus marcadores','Toca cada partido para cambiar tu pronóstico entre 1, X y 2. Tus selecciones se guardan en este dispositivo.'],
    ['Suma puntos en cada jornada','Mientras más aciertos tengas, más puntos acumulas en Pronostica Seis de la Liga Municipal.'],
    ['Compite con tus amigos','Completa los seis partidos y compara tus resultados con otros aficionados de la Liga Juventino Rosas.']
  ];
  const slide=((state.predictorSlide||0)%slides.length+slides.length)%slides.length;
  const title=slides[slide][0], desc=slides[slide][1];
  const pickFor=id=>state.predictions['six:'+id]?.pick||'?';
  return `<section class="v53-predictor-six" aria-label="Pronostica Seis">
    <header class="v53-p6-head">
      <button type="button" class="v53-p6-back" data-route="predictor" aria-label="Volver a Pronostica Seis">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M31 8 15 24l16 16M16 24h27"/></svg>
      </button>
      <h1>Pronostica Seis</h1>
    </header>

    <div class="v53-p6-sponsor">
      <span>Patrocinado por</span>
      <span class="v53-p6-sponsor-mark"><img src="./assets/reference/predictor-v36/liga-crest-white.webp" alt="" aria-hidden="true"><b>LIGA JUVENTINO</b></span>
    </div>

    <div class="v53-p6-stage">
      <div class="v53-p6-grid">
        ${games.map(([id,a,alogo,b,blogo])=>`<button type="button" class="v53-p6-game ${pickFor(id)!=='?'?'is-picked':''}" data-v29-pick="${id}" data-v29-default="?" aria-label="${a} contra ${b}. Pronóstico ${pickFor(id)}">
          <span class="v53-p6-team"><img src="${BASE+alogo}" alt="${a}"></span>
          <span class="v53-p6-vs">VS</span>
          <span class="v53-p6-team"><img src="${BASE+blogo}" alt="${b}"></span>
          <strong class="v53-p6-pick">${pickFor(id)}</strong>
        </button>`).join('')}
      </div>
      <button type="button" class="v53-p6-next" data-v53-next aria-label="Siguiente explicación">
        <svg viewBox="0 0 32 52" aria-hidden="true"><path d="m7 5 18 21L7 47"/></svg>
      </button>
    </div>

    <div class="v53-p6-copy">
      <h2>${title}</h2>
      <p>${desc}</p>
      <div class="v53-p6-dots" aria-label="Página ${slide+1} de 4">
        ${slides.map((_,i)=>`<i class="${i===slide?'active':''}"></i>`).join('')}
      </div>
    </div>

    <div class="v53-p6-actions">
      <button type="button" class="v53-p6-primary" data-action="login-demo">${state.user?'Continuar como '+state.user.name:'Inicia sesión para jugar'}</button>
      <button type="button" class="v53-p6-secondary" data-v53-guest>Prueba como invitado</button>
    </div>
  </section>`;
}
function videoView(){return `<div class="hero video-hero"><span class="eyebrow" style="color:#fff">REVIVE LA JORNADA</span><h1>FÚTBOL QUE<br>NOS UNE</h1><p>Mira goles, atajadas, entrevistas y resúmenes completos.</p><div class="button-row"><button class="btn primary" data-video="Resumen de la Jornada">Ver ahora</button><button class="btn outline" data-match="m1">Partido de la semana</button></div></div><section class="section">${sectionHead('Selección del editor')}<div class="media-carousel"><button class="media-card" data-video="Final dramático en Cuenda"><span class="badge">12:46</span><h3>Final dramático en Cuenda</h3></button><button class="media-card" data-video="Resumen de la jornada"><span class="badge">08:20</span><h3>Resumen de la jornada</h3></button></div></section>`}
function momentsView(){return `<div class="v26-moments-original" aria-label="Momentos">
  <div class="v26-moments-sticky" aria-label="Cabecera fija de Momentos">
    <img class="v26-moments-sticky__image" src="./assets/moments/moments-original-a.png?v=20260918-moments3" alt="" aria-hidden="true" draggable="false">
    <button type="button" class="v26-moments-sticky-back" data-route="more" aria-label="Volver a Más"></button>
  </div>
  <section class="v26-moments-panel" data-v26-panel="a" aria-label="Momentos principales">
    <img class="v26-moments-original__image" src="./assets/moments/moments-original-a.png?v=20260918-moments3" alt="Momentos de la Liga Municipal de Fútbol Juventino Rosas" draggable="false">

    <button class="v26-moments-hotspot v26-back" data-route="more" aria-label="Volver a Más"></button>

    <button class="v26-moments-hotspot v26-card v26-card-1" data-video="Juventino Rosas · Momento 1" aria-label="Ver momento de Juventino Rosas"></button>
    <button class="v26-moments-hotspot v26-card v26-card-2" data-video="Juventino Rosas · Momento 2" aria-label="Ver segundo momento de Juventino Rosas"></button>
    <button class="v26-moments-hotspot v26-card v26-card-3" data-video="La Huerta" aria-label="Ver momento de La Huerta"></button>
    <button class="v26-moments-hotspot v26-card v26-card-4" data-video="Pozos" aria-label="Ver momento de Pozos"></button>
    <button class="v26-moments-hotspot v26-card v26-card-5" data-video="Rincón de Centeno" aria-label="Ver momento de Rincón de Centeno"></button>
    <button class="v26-moments-hotspot v26-card v26-card-6" data-video="Deportivo Rosas" aria-label="Ver momento de Deportivo Rosas"></button>

    <button class="v26-moments-hotspot v26-nav v26-nav-home" data-route="home" aria-label="Inicio"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-competition" data-route="competition" aria-label="Competición"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-video" data-route="video" aria-label="Vídeo"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-fantasy" data-route="fantasy" aria-label="Fantasy"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-more" data-route="more" aria-label="Más"></button>
  </section>

  <section class="v26-moments-panel" data-v26-panel="b" aria-label="Más momentos">
    <img class="v26-moments-original__image" src="./assets/moments/moments-original-b.png?v=20260918-moments3" alt="Más momentos de la Liga Municipal de Fútbol Juventino Rosas" draggable="false">

    <button class="v26-moments-hotspot v26-back" data-route="more" aria-label="Volver a Más"></button>

    <button class="v26-moments-hotspot v26-card v26-card-1" data-video="Club América Veteranos" aria-label="Ver momento de Club América Veteranos"></button>
    <button class="v26-moments-hotspot v26-card v26-card-2" data-video="Juventino Rosas" aria-label="Ver momento de Juventino Rosas"></button>
    <button class="v26-moments-hotspot v26-card v26-card-3" data-video="Atlético Galeana" aria-label="Ver momento de Atlético Galeana"></button>
    <button class="v26-moments-hotspot v26-card v26-card-4" data-video="La Huerta" aria-label="Ver momento de La Huerta"></button>
    <button class="v26-moments-hotspot v26-card v26-card-5" data-video="Santa Cruz" aria-label="Ver momento de Santa Cruz"></button>
    <button class="v26-moments-hotspot v26-card v26-card-6" data-video="Pozos" aria-label="Ver momento de Pozos"></button>

    <button class="v26-moments-hotspot v26-nav v26-nav-home" data-route="home" aria-label="Inicio"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-competition" data-route="competition" aria-label="Competición"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-video" data-route="video" aria-label="Vídeo"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-fantasy" data-route="fantasy" aria-label="Fantasy"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-more" data-route="more" aria-label="Más"></button>
  </section>
</div>`}
function scorersView(){return `<div class="eyebrow">ESTADÍSTICAS</div><h1 class="screen-title">Máximo goleador</h1><button class="scorer-feature" data-player="p1"><span class="badge">#1 MÁXIMO GOLEADOR</span><div><small>Juventino</small><h2>Juan Pérez</h2><b>8 <em>goles</em></b></div></button><section class="section">${sectionHead('Clasificación completa')}<div class="stat-card">${players.slice().sort((a,b)=>b.goals-a.goals).slice(0,8).map((p,i)=>`<button class="rank-row" data-player="${p.id}"><b>${i+1}</b>${crest(p.team)}<span>${p.name}</span><b>${p.goals}</b></button>`).join('')}</div></section>`}
function rankingsView(){return `<div class="eyebrow">TEMPORADA 2026</div><h1 class="screen-title">Rankings</h1><div class="segmented"><button class="segment active">Clubes</button><button class="segment">Jugadores</button><button class="segment">Forma</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>DG</th><th>Pts</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td>${teamCell(t.code)}</td><td>${t.p}</td><td>${t.gd}</td><td><b>${t.pts}</b></td></tr>`).join('')}</tbody></table></div>`}
function followingView(){const list=teams.filter(t=>state.followed.includes(t.code));if(!list.length)return `<div class="empty-state"><div class="empty-illustration"></div><h2>Sin equipos seguidos todavía</h2><p>Añade equipos para personalizar tu inicio, resultados y alertas.</p><button class="btn outline" data-route="teams">+ Añadir equipos</button></div>`;return `<div class="eyebrow">PERSONALIZADO</div><h1 class="screen-title">Siguiendo</h1><div class="team-list">${list.map(t=>`<div class="team-row"><button class="team-main" data-team="${t.code}">${crest(t.code)}<span><b>${t.name}</b><small>${t.news}</small></span></button><button class="mini-btn active" data-follow="${t.code}">Siguiendo</button></div>`).join('')}</div>`}

const V19_MORE_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
function v19MoreIcon(name){
  const icons={
    star:'<path d="m12 2.7 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9Z"/>',
    shield:'<path d="M12 2.8 19 5.7v5.1c0 4.7-2.9 8.8-7 10.4-4.1-1.6-7-5.7-7-10.4V5.7L12 2.8Z"/><path d="m12 7 1.2 2.3 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L12 7Z"/>',
    performance:'<path d="M4 7h4M6 5v4m10-4h4m-2-2v4M5 18l4-4 3 2 7-7"/><circle cx="5" cy="18" r="1.5"/><circle cx="9" cy="14" r="1.5"/><circle cx="12" cy="16" r="1.5"/><circle cx="19" cy="9" r="1.5"/>',
    medal:'<circle cx="12" cy="13.5" r="6.4"/><path d="M9.5 2.5 12 7l2.5-4.5M5.8 5.2 8 8.3m10.2-3.1L16 8.3M12 10.2l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3 1-2.1Z"/>',
    video:'<rect x="3.5" y="6" width="17" height="14" rx="1"/><path d="M7 3.5 9 6m3-2.5L14 6m3-2.5L19 6M9.5 10.2l5.5 3.1-5.5 3.1Z"/>',
    data:'<path d="M5 20V11m7 9V5m7 15v-7"/>',
    score:'<rect x="3.2" y="7" width="17.6" height="11" rx="1"/><path d="M8 10.2v4.6m8-4.6v4.6M10.2 12.5h3.6"/>',
    quiz:'<rect x="5" y="4" width="14" height="15" rx="1.4"/><path d="m8.5 11 2.2 2.1 4.7-5M3 7v14h13"/>',
    arrows:'<path d="M8 3v17m0-17L4.7 6.5M8 3l3.3 3.5M16 21V4m0 17-3.3-3.5M16 21l3.3-3.5"/>',
    glasses:'<path d="M6 3h4l-.6 7a2.4 2.4 0 0 1-4.8 0L4 3h2Zm0 9v7m-2 2h4M16 3h4l-.6 7a2.4 2.4 0 0 1-4.8 0L14 3h2Zm0 9v7m-2 2h4"/>',
    trophy:'<path d="M8 4h8v4.8a4 4 0 0 1-8 0V4Zm4 9v5m-4 3h8M8 6H4v1.5A4.5 4.5 0 0 0 8.5 12M16 6h4v1.5a4.5 4.5 0 0 1-4.5 4.5"/>',
    history:'<path d="M4 7V3m0 0h4M4.4 3.6A9 9 0 1 1 3 14"/><path d="M12 7v5l3.5 2"/>',
    bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    qr:'<rect x="3" y="3" width="6" height="6" rx=".5"/><rect x="15" y="3" width="6" height="6" rx=".5"/><rect x="3" y="15" width="6" height="6" rx=".5"/><path d="M12 4v3m0 3v2m3 0h3m3 0v3m-9 0h3v3h3v3m3-3v3"/>'

  };
  return '<span class="v19-more-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(icons[name]||icons.info)+'</svg></span>';
}
function v19MoreButton(icon,label,route,safe=false){
  const attr=safe?'data-safe-route="'+route+'"':'data-route="'+route+'"';
  return '<button type="button" class="v19-more-item" '+attr+'>'+v19MoreIcon(icon)+'<span>'+label+'</span></button>';
}

const V60_RULEBOOK='./docs/Reglamento_Liga_Juventino_Rosas_2026_2027.pdf';
const V60_FIELDS=[
  {id:'sur-1',name:'Campo 1 · Unidad Deportiva Sur',community:'Juventino Rosas',address:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',maps:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',lat:20.63753,lon:-100.99297,weather:true},
  {id:'sur-2',name:'Campo 2 · Unidad Deportiva Sur',community:'Juventino Rosas',address:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',maps:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',lat:20.63753,lon:-100.99297,weather:true},
  {id:'sur-3',name:'Campo 3 · Unidad Deportiva Sur',community:'Juventino Rosas',address:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',maps:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',lat:20.63753,lon:-100.99297,weather:true},
  {id:'zapata-4',name:'Campo 4 · Emiliano Zapata',community:'Juventino Rosas',address:'Prolongación Emiliano Zapata, Juventino Rosas, Guanajuato',maps:'https://maps.app.goo.gl/vTCjxxked88JuKCY6',lat:null,lon:null,weather:false},
  {id:'cerrito',name:'Campo Cerrito de Gasca',community:'Cerrito de Gasca',address:'Cerrito de Gasca, Santa Cruz de Juventino Rosas, Guanajuato',maps:'Campo de futbol Cerrito de Gasca, Guanajuato',lat:20.617778,lon:-101.0625,weather:true},
  {id:'tavera',name:'Campo de Tavera',community:'Franco Tavera',address:'Franco Tavera, Santa Cruz de Juventino Rosas, Guanajuato',maps:'https://maps.app.goo.gl/pDsYt63hKVwRTUWS9',lat:20.60839,lon:-100.93238,weather:true},
  {id:'san-juan',name:'Campo San Juan de la Cruz',community:'San Juan de la Cruz',address:'San Juan de la Cruz, Santa Cruz de Juventino Rosas, Guanajuato 38250',maps:'Campo de futbol San Juan de la Cruz, Santa Cruz de Juventino Rosas, Guanajuato',lat:20.63379,lon:-100.911569,weather:true},
  {id:'cuenda',name:'Unidad Deportiva Santiago de Cuenda',community:'Santiago de Cuenda',address:'38253 Santiago de Cuenda, Santa Cruz de Juventino Rosas, Guanajuato',maps:'Unidad Deportiva Santiago de Cuenda, Guanajuato',lat:20.59793,lon:-100.99663,weather:true},
  {id:'romerillo',name:'Campo San Antonio de Romerillo',community:'San Antonio de Romerillo',address:'San Antonio de Romerillo, Santa Cruz de Juventino Rosas, Guanajuato 38255',maps:'https://maps.app.goo.gl/K46mpaJvHMMtnUq27',lat:20.60784,lon:-100.94854,weather:true},
  {id:'fraccionamiento',name:'Campo Fraccionamiento Comontuoso',community:'Comontuoso / Santiago de Cuenda',address:'Fraccionamiento Comontuoso, Santa Cruz de Juventino Rosas, Guanajuato',maps:'https://maps.app.goo.gl/frhHxqfK9TAd3NhE8',lat:null,lon:null,weather:false},
  {id:'pozos',name:'Campo de Fútbol de Pozos',community:'Pozos',address:'Campo de Fútbol de Pozos, Santa Cruz de Juventino Rosas, Guanajuato',maps:'20.61767,-100.90033',lat:20.61767,lon:-100.90033,weather:true},
  {id:'rincon',name:'Campo Rincón de Centeno',community:'Rincón de Centeno',address:'Rincón de Centeno, Santa Cruz de Juventino Rosas, Guanajuato',maps:'Campo de futbol Rincón de Centeno, Santa Cruz de Juventino Rosas, Guanajuato',lat:20.660153,lon:-100.886766,weather:true},
  {id:'san-jose',name:'Campo San José de la Montaña',community:'San José de la Montaña',address:'San José de la Montaña, Salamanca, Guanajuato 36867',maps:'Campo de futbol San José de la Montaña, Guanajuato',lat:20.60102,lon:-101.07242,weather:true},
  {id:'san-julian',name:'Campo San Julián Tierra Blanca',community:'San Julián Tierra Blanca',address:'Los Fundadores 100, San Julián Tierra Blanca, Santa Cruz de Juventino Rosas, Guanajuato',maps:'https://maps.app.goo.gl/Rkb9PH3LF5pVu2FTA',lat:20.591403,lon:-101.040358,weather:true}
];
function v60Field(id){return V60_FIELDS.find(f=>f.id===id)||V60_FIELDS[0]}
function v60MapUrl(f){const m=f.maps||f.address||f.name;return /^https?:\/\//i.test(m)?m:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(m)}
function v60Icon(name){
  const p={
    rules:'<path d="M6 3h10a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1Z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    matchday:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16M8 14l2 2 5-5"/>',
    weather:'<path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.2-1.8A4.7 4.7 0 0 0 7 18Z"/><path d="M8 21v-1m4 1v-1m4 1v-1"/>',
    field:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14"/><circle cx="12" cy="12" r="3"/>',
    cedula:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="9" cy="9" r="2.2"/><path d="M7 15h10M13 8h4M13 11h4"/>',
    tools:'<path d="m14 6 4-4 4 4-4 4m-7 3-7 7m2-11 9 9"/><circle cx="7" cy="6" r="3"/>',
    center:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M8 9h8M8 13h5M8 17h8"/>',
    bracket:'<path d="M5 4h5v4H5zM14 8h5v4h-5zM5 12h5v4H5zM14 16h5v4h-5zM10 6h2v12h2"/>',
    card:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M12 9h6M12 12h6M6 16h12"/>',
    share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
    tactics:'<path d="M4 20V4h16v16H4Z"/><circle cx="12" cy="12" r="3"/><path d="M12 4v16M7 7h2m6 10h2"/>',
    sim:'<path d="M4 18h16M6 15l3-4 3 2 5-7"/><path d="M15 6h3v3"/>',
    admin:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    qr:'<rect x="3" y="3" width="6" height="6" rx=".5"/><rect x="15" y="3" width="6" height="6" rx=".5"/><rect x="3" y="15" width="6" height="6" rx=".5"/><path d="M12 4v3m0 3v2m3 0h3m3 0v3m-9 0h3v3h3v3m3-3v3"/>'

  };
  return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.tools)+'</svg>';
}
function v60ToolCard(icon,title,sub,route,extra=''){
  return '<button type="button" class="v60-tool-card" '+(route?'data-route="'+route+'"':'')+' '+extra+'>'+v60Icon(icon)+'<span><b>'+title+'</b><small>'+sub+'</small></span></button>';
}
function v60Header(kicker,title,desc){
  return '<div class="v60-tool-head"><span class="v60-tool-kicker">'+kicker+'</span><h1>'+title+'</h1><p>'+desc+'</p></div>';
}
function leagueToolsView(){
  return '<section class="v60-tool-page">'+v60Header('LIGA JUVENTINO','Herramientas de la Liga','Funciones operativas y públicas integradas a la app azul sin sustituir su diseño.')+
    '<div class="v60-tool-grid">'+
      v60ToolCard('search','Buscador','Equipos, jugadores, partidos, campos y noticias','search')+
      v60ToolCard('qr','QR de la Liga','Compartir acceso directo a la app','ligaQR')+
      v60ToolCard('center','Equipos registrados','Solo equipos oficiales sincronizados','teams')+
      v60ToolCard('center','Jugadores registrados','Plantillas oficiales de AdminFut','', 'data-v63-official="players"')+
      v60ToolCard('cedula','Cédulas','Consulta y plantillas de partido','cedulas')+
      v60ToolCard('cedula','Generar cédula','Cédula y plantillas del partido','cedulaBuilder')+
      v60ToolCard('card','Generar credencial','Foto, OCR y credencial del jugador','credentialBuilder')+
      v60ToolCard('matchday','Match Day','Checklist y operación de jornada','matchday')+
      v60ToolCard('rules','Reglamento','Reglamento oficial 2026–2027','rulebook')+
      v60ToolCard('field','Dónde se juega','Campos, comunidades y Maps','venues')+
      v60ToolCard('center','Match Center','Marcador, cronología y previa','match')+
      v60ToolCard('matchday','Jornadas','Calendario y resultados','', 'data-v60-comp="fixtures"')+
      v60ToolCard('bracket','Liguilla','Cuadro de eliminatorias','', 'data-v60-comp="bracket"')+
      v60ToolCard('share','Publicaciones','Compartir jornada / WhatsApp','publications')+
      v60ToolCard('tactics','Tácticas','Pizarra 2D y formaciones','tactics')+
      v60ToolCard('sim','Simulador','Simulación local de clasificación','simulator')+
      v60ToolCard('admin','JR Control','Centro operativo de la Liga','jrControl')+
      v60ToolCard('center','Tabla y estadísticas','Tabla, goleadores y rendimiento','v38Stats')+
      v60ToolCard('share','Noticias y avisos','Avisos, junta semanal y multimedia','v38Weekly')+
      v60ToolCard('weather','Clima y estado oficial','Pronóstico, terreno y decisión oficial','v38Weather')+
      v60ToolCard('matchday','Partidos y jornadas','Todos, jugados, próximos y calendario','', 'data-v63-official="fixtures"')+
      v60ToolCard('center','Notificaciones','Próxima jornada, cambios de sede y favoritos','v38Alerts')+
      v60ToolCard('admin','Central oficial','Categorías, equipos, jugadores, tarjetas y castigos','', 'data-v63-official="summary"')+
      v60ToolCard('bracket','Cuadro PNG','8 lugares y exportación para liguilla','bracketBuilder')+
      v60ToolCard('center','Exportar tabla','PNG completo, compartir y CSV','tableExport')+
      v60ToolCard('matchday','Preparar mi jornada','Agenda local, cruces y JSON','agendaBuilder')+
      v60ToolCard('tactics','Jornada animada','Balones en movimiento y accesos','motionHub')+
      v60ToolCard('share','Aviso de suspensión','Borrador y vista previa de jornada suspendida','suspensionTool')+
    '</div></section>';
}
let v60RulebookDoc=null,v60RulebookPage=1,v60RulebookRenderToken=0;
function v60LoadPdfJs(){
  if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
  if(window.__v60PdfJsPromise)return window.__v60PdfJsPromise;
  window.__v60PdfJsPromise=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload=()=>window.pdfjsLib?resolve(window.pdfjsLib):reject(new Error('PDF.js no disponible'));
    s.onerror=()=>reject(new Error('No se pudo cargar PDF.js'));
    document.head.appendChild(s);
  });
  return window.__v60PdfJsPromise;
}
async function v60RenderRulebookPage(pageNo){
  const host=document.querySelector('[data-v60-pdf-preview]');
  if(!host)return;
  const canvas=host.querySelector('[data-v60-pdf-canvas]');
  const loading=host.querySelector('[data-v60-pdf-loading]');
  const pageText=host.querySelector('[data-v60-pdf-page]');
  const prev=host.querySelector('[data-v60-pdf-prev]');
  const next=host.querySelector('[data-v60-pdf-next]');
  const token=++v60RulebookRenderToken;
  try{
    if(loading){loading.hidden=false;loading.textContent='Cargando reglamento…'}
    const pdfjs=await v60LoadPdfJs();
    pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    if(!v60RulebookDoc){
      v60RulebookDoc=await pdfjs.getDocument({url:V60_RULEBOOK}).promise;
    }
    if(token!==v60RulebookRenderToken||!document.querySelector('[data-v60-pdf-preview]'))return;
    v60RulebookPage=Math.max(1,Math.min(v60RulebookDoc.numPages,Number(pageNo)||1));
    const page=await v60RulebookDoc.getPage(v60RulebookPage);
    const base=page.getViewport({scale:1});
    const available=Math.max(280,Math.min(host.clientWidth-20,720));
    const scale=Math.min(2.2,available/base.width);
    const viewport=page.getViewport({scale});
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(viewport.width*dpr);
    canvas.height=Math.floor(viewport.height*dpr);
    canvas.style.width=Math.floor(viewport.width)+'px';
    canvas.style.height=Math.floor(viewport.height)+'px';
    const ctx=canvas.getContext('2d',{alpha:false});
    ctx.setTransform(dpr,0,0,dpr,0,0);
    await page.render({canvasContext:ctx,viewport}).promise;
    canvas.hidden=false;
    if(loading)loading.hidden=true;
    if(pageText)pageText.textContent='Página '+v60RulebookPage+' de '+v60RulebookDoc.numPages;
    if(prev)prev.disabled=v60RulebookPage<=1;
    if(next)next.disabled=v60RulebookPage>=v60RulebookDoc.numPages;
  }catch(err){
    if(loading){
      loading.hidden=false;
      loading.innerHTML='<b>No se pudo cargar la vista previa.</b><span>El PDF sigue disponible con “Abrir PDF”.</span>';
    }
    if(canvas)canvas.hidden=true;
    if(pageText)pageText.textContent='Reglamento oficial';
  }
}
function rulebookView(){
  return '<section class="v60-tool-page">'+v60Header('DOCUMENTOS','Reglamento','Consulta el Reglamento oficial de la Liga Municipal de Fútbol Juventino Rosas 2026–2027.')+
    '<div class="v60-panel"><div class="v60-actions"><a class="v60-link" href="'+V60_RULEBOOK+'" target="_blank" rel="noopener noreferrer">Abrir PDF</a><a class="v60-link outline" href="'+V60_RULEBOOK+'" download="Reglamento_Liga_Juventino_Rosas_2026_2027.pdf">Descargar</a></div><p class="v60-note">El reglamento abre desde el archivo PDF oficial guardado en GitHub para evitar el error de archivo no encontrado.</p></div>'+
    '<div class="v60-pdf-shell v60-pdf-reader" data-v60-pdf-preview>'+
      '<div class="v60-pdf-toolbar"><button type="button" data-v60-pdf-prev aria-label="Página anterior">‹</button><strong data-v60-pdf-page>Reglamento oficial</strong><button type="button" data-v60-pdf-next aria-label="Página siguiente">›</button></div>'+
      '<div class="v60-pdf-canvas-wrap"><div class="v60-pdf-loading" data-v60-pdf-loading>Cargando reglamento…</div><canvas data-v60-pdf-canvas hidden></canvas></div>'+
    '</div>'+
    '<div class="v60-actions v63-rulebook-tools"><button class="v60-btn outline" data-route="leagueTools">Todas las funciones de la Liga</button></div></section>';
}
function v60MatchdayState(){try{return JSON.parse(localStorage.getItem('v60-matchday')||'{}')||{}}catch(e){return {}}}
function matchdayView(){
  const s=v60MatchdayState();
  const checks=[
    ['calendar','Calendario revisado','Fecha, hora y categoría verificadas.'],
    ['fields','Campos confirmados','Sede revisada antes de publicar.'],
    ['refs','Árbitros / responsables','Asignación confirmada para la jornada.'],
    ['lineups','Alineaciones','Plantillas listas para Match Center.'],
    ['results','Resultados','Marcadores capturados y revisados.'],
    ['report','Reporte de jornada','Cédulas, incidencias y cierre preparados.']
  ];
  return '<section class="v60-tool-page">'+v60Header('OPERACIÓN','Match Day','Centro de jornada local. El checklist se guarda únicamente en este dispositivo.')+
    '<div class="v60-panel"><div class="v60-checklist">'+checks.map(x=>'<label class="v60-check"><input type="checkbox" data-v60-check="'+x[0]+'" '+(s[x[0]]?'checked':'')+'><span><b>'+x[1]+'</b><small>'+x[2]+'</small></span></label>').join('')+'</div>'+
    '<textarea class="v60-textarea" data-v60-matchday-note placeholder="Notas de jornada">'+(s.note||'')+'</textarea>'+
    '<div class="v60-actions"><button class="v60-btn" data-v60-comp="fixtures">Ver jornada</button><button class="v60-btn outline" data-route="venues">Campos</button><button class="v60-btn outline" data-route="cedulas">Cédulas</button></div></div>'+
    '<section class="v60-tool-section"><h2>Partidos</h2><div class="v60-panel">'+matches.slice(0,5).map(m=>'<div class="v60-row"><span class="v60-row-copy"><b>'+team(m.home).name+' vs '+team(m.away).name+'</b><small>'+m.day+' · '+m.time+' · '+m.venue+'</small></span><button class="v60-btn ghost" data-match="'+m.id+'">Abrir</button></div>').join('')+'</div></section></section>';
}
function weatherFieldsView(){
  return '<section class="v60-tool-page">'+v60Header('SEDES','Clima y campos','Consulta condiciones meteorológicas por las sedes que tienen referencia geográfica disponible.')+
    '<p class="v60-note">El clima es informativo. No marca un partido como suspendido o cancelado automáticamente.</p>'+
    '<div class="v60-field-list" style="margin-top:14px">'+V60_FIELDS.map(f=>'<article class="v60-field-card"><div class="v60-field-top"><h3>'+f.name+'</h3><span>'+f.community+'</span></div><p>'+f.address+'</p><div class="v60-actions"><button class="v60-btn '+(f.weather?'':'ghost')+'" '+(f.weather?'data-v60-weather="'+f.id+'"':'disabled')+'>'+(f.weather?'Ver clima':'Pin pendiente')+'</button><a class="v60-link outline" href="'+v60MapUrl(f)+'" target="_blank" rel="noopener">Mapa</a></div><div class="v60-weather-result" data-v60-weather-result="'+f.id+'" hidden></div></article>').join('')+'</div></section>';
}
function v60VenuesView(){
  return '<section class="v60-tool-page">'+v60Header('SEDES','Dónde se juega','Campos y comunidades de la Liga con acceso directo a su ubicación.')+
    '<div class="v60-field-list">'+V60_FIELDS.map(f=>'<article class="v60-field-card"><div class="v60-field-top"><h3>'+f.name+'</h3><span>'+f.community+'</span></div><p>'+f.address+'</p><div class="v60-actions"><a class="v60-link" href="'+v60MapUrl(f)+'" target="_blank" rel="noopener">Abrir en Maps</a>'+(f.weather?'<button class="v60-btn outline" data-route="weatherFields">Clima</button>':'')+'</div></article>').join('')+'</div></section>';
}
function cedulasView(){
  return '<section class="v60-tool-page">'+v60Header('PARTIDOS','Cédulas','Genera y consulta una cédula deportiva dentro de la aplicación.')+
    '<div class="v60-panel">'+matches.map(m=>'<div class="v60-row"><span class="v60-row-copy"><b>'+team(m.home).name+' vs '+team(m.away).name+'</b><small>'+m.category+' · Jornada '+m.jornada+' · '+m.day+' '+m.time+'</small></span><button class="v60-btn ghost" data-v60-cedula="'+m.id+'">Cédula</button></div>').join('')+'</div>'+
    '<p class="v60-note">La cédula pública muestra únicamente información deportiva; no publica CURP, INE, domicilio ni documentos privados.</p></section>';
}
function cedulaDetailView(){
  const m=matches.find(x=>x.id===state.selectedMatch)||matches[0];
  return '<section class="v60-tool-page">'+v60Header('CÉDULA OFICIAL','Partido','Vista interna preparada para imprimir o guardar como PDF.')+
    '<article class="v60-cedula"><div class="v60-cedula-head"><b>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</b><span>J'+m.jornada+'</span></div>'+
      '<div class="v60-versus"><div>'+crest(m.home)+'<strong>'+team(m.home).name+'</strong></div><span>VS</span><div>'+crest(m.away)+'<strong>'+team(m.away).name+'</strong></div></div>'+
      '<div class="v60-cedula-meta"><div><small>Categoría</small><b>'+m.category+'</b></div><div><small>Fecha</small><b>'+m.day+' · '+m.time+'</b></div><div><small>Campo</small><b>'+m.venue+'</b></div><div><small>Árbitro</small><b>'+m.referee+'</b></div></div>'+
    '</article><div class="v60-actions"><button class="v60-btn" data-v60-print>Imprimir / PDF</button><button class="v60-btn outline" data-route="cedulas">Volver a cédulas</button></div></section>';
}
function credentialView(){
  const p=player(state.selectedPlayer||players[0]?.id)||players[0],t=team(p.team);
  return '<section class="v60-tool-page">'+v60Header('IDENTIDAD DEPORTIVA','Credencial','Credencial pública del jugador dentro de la Liga.')+
    '<article class="v60-credential"><div class="v60-cred-head"><div class="v60-cred-avatar">'+p.number+'</div><div><h2>'+p.name+'</h2><p>'+t.name+' · '+p.position+'</p><span class="v60-cred-status">HABILITADO</span></div></div>'+
    '<div class="v60-cred-grid"><div><small>Equipo</small><b>'+t.name+'</b></div><div><small>Categoría</small><b>'+t.category+'</b></div><div><small>Número</small><b>'+p.number+'</b></div><div><small>Posición</small><b>'+p.position+'</b></div><div><small>Temporada</small><b>2026–2027</b></div><div><small>Liga</small><b>Juventino Rosas</b></div></div></article>'+
    '<div class="v60-actions"><button class="v60-btn" data-v60-print>Imprimir / PDF</button><button class="v60-btn outline" data-route="players">Elegir jugador</button></div></section>';
}
function publicationsView(){
  const rows=matches.slice(0,4).map(m=>team(m.home).name+' vs '+team(m.away).name+' · '+m.day+' '+m.time+' · '+m.venue).join('\\n');
  const text='Liga Municipal de Fútbol Juventino Rosas\\nPróxima jornada\\n'+rows;
  return '<section class="v60-tool-page">'+v60Header('COMUNICACIÓN','Publicaciones','Prepara el texto de jornada para compartir desde el teléfono.')+
    '<article class="v60-share-card"><h2>Próxima jornada</h2><p>Contenido generado con los partidos cargados en la app.</p><div class="v60-share-preview" data-v60-share-text>'+text+'</div><div class="v60-actions"><button class="v60-btn" data-v60-share>Compartir</button><button class="v60-btn outline" data-v60-copy>Copiar texto</button></div></article>'+
    '<p class="v60-note">En móvil se usa el panel de compartir del sistema, donde puedes elegir WhatsApp. No se publica ningún número telefónico en GitHub.</p></section>';
}
function v60Formation(){return localStorage.getItem('v60-formation')||'2-3-1'}
function v60PitchPlayers(form){
  const layouts={
    '2-3-1':[[50,90],[25,72],[75,72],[20,48],[50,48],[80,48],[50,20]],
    '3-2-1':[[50,90],[20,70],[50,70],[80,70],[34,45],[66,45],[50,20]],
    '2-2-2':[[50,90],[28,69],[72,69],[33,46],[67,46],[34,20],[66,20]]
  };
  return (layouts[form]||layouts['2-3-1']).map((p,i)=>'<span class="v60-player-dot" style="left:calc('+p[0]+'% - 21px);top:calc('+p[1]+'% - 21px)">'+(i+1)+'</span>').join('');
}
function tacticsView(){
  const form=v60Formation();
  return '<section class="v60-tool-page">'+v60Header('PIZARRA','Tácticas','Cambia la formación y prepara una estructura rápida dentro de la app.')+
    '<div class="v60-formations">'+['2-3-1','3-2-1','2-2-2'].map(x=>'<button class="'+(x===form?'active':'')+'" data-v60-formation="'+x+'">'+x+'</button>').join('')+'</div>'+
    '<div class="v60-pitch">'+v60PitchPlayers(form)+'</div><p class="v60-note">La pizarra es una herramienta de planificación; no modifica alineaciones oficiales ni resultados.</p></section>';
}
function v60SimState(){try{return JSON.parse(localStorage.getItem('v60-sim')||'{}')||{}}catch(e){return {}}}
function simulatorView(){
  const s=v60SimState(),rows=teams.map(t=>({t,pts:t.pts+(s[t.code]||0)})).sort((a,b)=>b.pts-a.pts);
  return '<section class="v60-tool-page">'+v60Header('ESCENARIOS','Simulador','Prueba escenarios de puntos sin alterar la tabla oficial.')+
    '<div class="v60-sim-table">'+rows.map((r,i)=>'<div class="v60-sim-row"><b>'+(i+1)+'</b><span class="v60-sim-team">'+crest(r.t.code)+'<b>'+r.t.name+'</b></span><b class="v60-sim-pts">'+r.pts+'</b><span class="v60-sim-actions"><button data-v60-sim="'+r.t.code+'" data-delta="-3">−3</button><button data-v60-sim="'+r.t.code+'" data-delta="3">+3</button></span></div>').join('')+'</div>'+
    '<div class="v60-actions"><button class="v60-btn outline" data-v60-sim-reset>Reiniciar simulación</button><button class="v60-btn ghost" data-v60-comp="standings">Ver tabla oficial</button></div><p class="v60-note">Los cambios se guardan localmente y son hipotéticos.</p></section>';
}
function jrControlView(){
  return '<section class="v60-tool-page">'+v60Header('OPERACIÓN','JR Control','Accesos operativos integrados sin sacar al usuario del diseño azul.')+
    '<div class="v60-tool-grid">'+
      v60ToolCard('matchday','Centro de jornada','Checklist, partidos y cierre','matchday')+
      v60ToolCard('cedula','Cédulas','Generación interna, plantillas y PDF','cedulaBuilder')+
      v60ToolCard('weather','Clima / campos','Condiciones y sedes','weatherFields')+
      v60ToolCard('share','Publicaciones','Compartir jornada','publications')+
      v60ToolCard('field','Equipos','Directorio de clubes','teams')+
      v60ToolCard('card','Jugadores','Plantillas deportivas','players')+
    '</div><p class="v60-note">Este centro público no expone documentos privados. Las tareas administrativas sensibles requieren un backend/autenticación antes de habilitarse.</p></section>';
}


function v63FeatureCard(icon,kicker,title,desc,route,extra=''){
  const attrs=route?'data-route="'+route+'"':extra;
  return '<button type="button" class="v63-feature-card" '+attrs+'>'+
    '<span class="v63-feature-icon">'+v60Icon(icon)+'</span>'+
    '<span class="v63-feature-copy"><small>'+kicker+'</small><b>'+title+'</b><em>'+desc+'</em></span>'+
    '<span class="v63-feature-arrow">›</span></button>';
}
function v38StatsView(){
  return '<section class="v60-tool-page v63-page">'+
    v60Header('TABLA Y ESTADÍSTICAS','La temporada, de un vistazo','Posiciones, goleadores y rendimiento con accesos rápidos dentro del diseño actual de la app.')+
    '<div class="v63-action-grid">'+
      '<button class="v60-btn" data-v63-comp="standings">Tabla</button>'+
      '<button class="v60-btn outline" data-route="scorers">Goleadores</button>'+
      '<button class="v60-btn outline" data-safe-route="safe-performance">Rendimiento</button>'+
    '</div>'+
    '<div class="v60-panel"><p class="v60-note">Estos accesos reutilizan las pantallas existentes; no sustituyen la navegación ni cambian el diseño principal.</p></div>'+
  '</section>';
}
function v38WeeklyView(){
  return '<section class="v60-tool-page v63-page">'+
    v60Header('LO IMPORTANTE DE LA SEMANA','Noticias y avisos','Accesos adaptados para comunicados, junta de liga y contenido multimedia.')+
    '<div class="v63-feature-list">'+
      v63FeatureCard('share','AVISO','Cambios de horario y sedes','Comunicados y novedades publicadas para equipos y afición.','news')+
      v63FeatureCard('matchday','JUNTA','Junta semanal de liga','Checklist, acuerdos y operación de jornada en un solo espacio.','matchday')+
      v63FeatureCard('center','MULTIMEDIA','Semifinales, finales y momentos','Videos y momentos destacados dentro de la app.','moments')+
    '</div>'+
  '</section>';
}
function v38WeatherView(){
  return '<section class="v60-tool-page v63-page">'+
    v60Header('CENTRAL OPERATIVA','Clima ≠ terreno ≠ decisión oficial','El pronóstico es informativo. La decisión oficial de un partido se consulta por separado.')+
    '<div class="v63-feature-list">'+
      v63FeatureCard('weather','PRONÓSTICO','Referencia meteorológica','Consulta clima por sede cuando existen coordenadas verificadas.','weatherFields')+
      v63FeatureCard('field','ESTADO DEL TERRENO','Consulta los campos','Revisa sede, comunidad, mapa y condiciones disponibles.','venues')+
      v63FeatureCard('center','DECISIÓN OFICIAL','Consulta partidos y resultados','El estado deportivo se mantiene separado del pronóstico meteorológico.','competition')+
    '</div>'+
    '<p class="v60-note">La lluvia por sí sola no marca un partido como suspendido. La Liga conserva la decisión oficial.</p>'+
  '</section>';
}
function v38AlertsView(){
  return '<section class="v60-tool-page v63-page">'+
    v60Header('CENTRO DE AVISOS','Notificaciones','Accesos para próxima jornada, cambios de sede y seguimiento de favoritos.')+
    '<div class="v63-feature-list">'+
      v63FeatureCard('matchday','PRÓXIMA JORNADA','Avisos de jornada','Configura tus preferencias de notificaciones.','notifications')+
      v63FeatureCard('field','CAMBIO DE SEDE','Campos y ubicaciones','Revisa cambios relevantes de cancha o sede.','venues')+
      v63FeatureCard('center','PARTIDO FAVORITO','Equipos y encuentros destacados','Consulta tus favoritos y equipos seguidos.','favorites')+
    '</div>'+
    '<div class="v60-actions"><button class="v60-btn outline" data-route="following">Equipos que sigues</button></div>'+
  '</section>';
}

function v64Esc(v){return String(v??'').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}

function v64TeamNames(){
  const out=[];
  const add=function(n){n=String(n||'').trim();if(n&&!out.some(function(x){return x.toLowerCase()===n.toLowerCase()}))out.push(n)};
  try{
    const db=window.LJR_OFFICIAL_DATA||{};
    Object.values(db.categories||{}).forEach(function(cat){
      Object.keys(cat.rosters||{}).forEach(add);
      ((cat.standings||[])[0]?.rows||[]).forEach(function(r){add(r[1])});
      ((cat.fixtures||[])[0]?.rows||[]).forEach(function(r){add(r[2]);add(r[6])});
    });
  }catch(e){}
  if(!out.length){
    ['TOROS DE CUENDA','MANCHESTER','BOAVISTA','DYNAMO','LA ESPERANZA','BOCA JRS',
     'FRANCO FC','HERMANOS','NAPOLI','HERRERAS FC','LINCES','ABEJAS','LOBOS CDG','JUVENTUS','SAN JOSE FC','TERRICOLAS','GALACTICOS',
     'DEP. ZAPATA','SAN JULIAN','BARZA','SAN JUAN FC','CELTICOS','SAN JOSE JRS','DEP. NOPALERO','TAPATIO','DEP. LA LUZ','PACHANGAS FC','SAN ANTONIO FC','TAVERA FC',
     'CAPIBARAS','MAZACOTES FC','LA HUERTA','LA CANCHITA DEPORTES','POPULARES','MALVINAS','PROMESAS FC','LA CUADRILLA','DEP. MARAVILLAS','GALEANA','SAN ANTONIO JRS','OSASUNA','ALDAMA FC'
    ].forEach(add);
  }
  return out;
}

function v64TeamSelect(name,attr){
  const list=v64TeamNames(),selected=String(name||'').trim().toLowerCase();
  return '<select '+attr+'><option value="">Por confirmar</option>'+list.map(function(n){return '<option '+(n.toLowerCase()===selected?'selected':'')+'>'+v64Esc(n)+'</option>'}).join('')+'</select>';
}

function v64StandingsRows(){
  try{
    const db=window.LJR_OFFICIAL_DATA||{};
    const id=localStorage.getItem('v62-category')||'3';
    const cat=(db.categories||{})[id];
    const rows=((cat?.standings||[])[0]?.rows||[]);
    if(rows.length)return rows.map(function(r,i){return {pos:r[0]||i+1,name:r[1]||'',pj:r[2]||'',dg:r[8]||'',pts:r[9]||''}});
  }catch(e){}
  return teams.slice().sort(function(a,b){return b.pts-a.pts}).map(function(t,i){return {pos:i+1,name:t.name,pj:t.p,dg:t.gd,pts:t.pts}});
}

function v64Download(blob,name){
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1200);
}

function v64CanvasTable(){
  const rows=v64StandingsRows(),w=1200,rowH=86,h=190+rows.length*rowH,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const x=canvas.getContext('2d');x.fillStyle='#07105d';x.fillRect(0,0,w,h);x.fillStyle='#19e1f2';x.font='700 28px Arial';x.fillText('LIGA JUVENTINO ROSAS',58,58);
  x.fillStyle='#fff';x.font='800 52px Arial';x.fillText('TABLA DE POSICIONES',58,120);
  x.font='700 25px Arial';x.fillStyle='#aeb4d2';x.fillText('#',58,168);x.fillText('EQUIPO',140,168);x.fillText('PJ',820,168);x.fillText('DG',930,168);x.fillText('PTS',1045,168);
  rows.forEach(function(r,i){const y=190+i*rowH;x.fillStyle=i%2?'#0b0c70':'#10117d';x.fillRect(42,y,w-84,rowH-8);x.fillStyle='#fff';x.font='700 28px Arial';x.fillText(String(r.pos),62,y+52);x.fillText(String(r.name).slice(0,34),140,y+52);x.fillText(String(r.pj),825,y+52);x.fillText(String(r.dg),935,y+52);x.fillStyle='#19e1f2';x.fillText(String(r.pts),1050,y+52)});
  return new Promise(function(resolve){canvas.toBlob(function(b){resolve(b)},'image/png',1)});
}

function v64CanvasBracket(){
  const sels=[...document.querySelectorAll('[data-v64-place]')].map(function(s){return s.value||'Por confirmar'}),w=1200,h=900,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const x=canvas.getContext('2d');x.fillStyle='#07105d';x.fillRect(0,0,w,h);x.fillStyle='#19e1f2';x.font='700 28px Arial';x.fillText('LIGA JUVENTINO ROSAS',55,58);x.fillStyle='#fff';x.font='800 50px Arial';x.fillText('CUADRO FINAL · 8 LUGARES',55,120);
  const pairs=[[0,7],[3,4],[1,6],[2,5]],ys=[210,370,530,690];
  pairs.forEach(function(p,k){const y=ys[k];x.fillStyle='#12137a';x.fillRect(70,y,420,112);x.fillStyle='#fff';x.font='700 25px Arial';x.fillText((p[0]+1)+'. '+sels[p[0]].slice(0,25),92,y+43);x.fillText((p[1]+1)+'. '+sels[p[1]].slice(0,25),92,y+86);x.strokeStyle='#19e1f2';x.lineWidth=3;x.beginPath();x.moveTo(490,y+56);x.lineTo(590,y+56);x.stroke()});
  x.fillStyle='#111274';x.fillRect(590,290,260,130);x.fillRect(590,610,260,130);x.fillStyle='#fff';x.font='700 25px Arial';x.fillText('SEMIFINAL 1',620,350);x.fillText('SEMIFINAL 2',620,670);
  x.strokeStyle='#19e1f2';x.beginPath();x.moveTo(850,355);x.lineTo(930,355);x.lineTo(930,515);x.lineTo(990,515);x.moveTo(850,675);x.lineTo(930,675);x.lineTo(930,515);x.stroke();
  x.fillStyle='#0b2c91';x.fillRect(990,455,170,120);x.fillStyle='#19e1f2';x.font='800 30px Arial';x.fillText('FINAL',1035,525);
  return new Promise(function(resolve){canvas.toBlob(function(b){resolve(b)},'image/png',1)});
}

function v64ExportTableView(){
  const rows=v64StandingsRows();
  return '<section class="v60-tool-page v64-page">'+v60Header('EXPORTAR','Tabla completa','Descarga o comparte la tabla desde la app sin cambiar su diseño.')+
    '<div class="v64-mini-table">'+rows.map(function(r){return '<div><b>'+v64Esc(r.pos)+'</b><span>'+v64Esc(r.name)+'</span><em>'+v64Esc(r.pts)+'</em></div>'}).join('')+'</div>'+
    '<div class="v64-stack-actions"><button class="v60-btn" data-v64-export-png>↓ Descargar PNG completo</button><button class="v60-btn outline" data-v64-share-png>Compartir PNG</button><button class="v60-btn outline" data-v64-export-csv>Descargar CSV</button></div></section>';
}

function v64BracketView(){
  return '<section class="v60-tool-page v64-page">'+v60Header('LIGUILLA','Generar cuadro PNG','Selecciona los ocho lugares y descarga un cuadro listo para compartir.')+
    '<div class="v64-form-grid">'+Array.from({length:8},function(_,i){return '<label><b>Lugar '+(i+1)+'</b>'+v64TeamSelect('', 'data-v64-place="'+(i+1)+'"')+'</label>'}).join('')+'</div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-bracket-png>Generar cuadro PNG</button></div></section>';
}

function v64CredentialBuilderView(){
  const v66Player=localStorage.getItem('v66-selected-player')||'',v66Team=localStorage.getItem('v66-selected-player-team')||'';
  return '<section class="v60-tool-page v64-page">'+v60Header('CREDENCIALES','Credencial de jugador','Carga una foto del documento y una foto del jugador. La lectura OCR se realiza en este dispositivo y no se guarda en GitHub.')+
    '<div class="v64-form-grid one">'+
      '<label><b>Foto de CURP o INE</b><input type="file" accept="image/*" data-v64-doc></label>'+
      '<label><b>Foto del jugador</b><input type="file" accept="image/*" data-v64-photo></label>'+
      '<div class="v60-actions"><button class="v60-btn" data-v64-ocr>Detectar texto</button><button class="v60-btn outline" data-v64-clear-ocr>Borrar documento y lectura</button></div>'+
      '<label><b>Texto detectado — revisa y corrige</b><textarea class="v60-textarea" data-v64-ocr-text></textarea></label>'+
      '<label><b>Nombre del jugador</b><input type="text" data-v64-cred-name placeholder="Nombre completo" value="'+v64Esc(v66Player)+'"></label>'+
      '<label><b>CURP (solo para captura local)</b><input type="text" maxlength="18" data-v64-cred-curp placeholder="CURP"></label>'+
      '<label><b>Equipo</b>'+v64TeamSelect(v66Team, 'data-v64-cred-team')+'</label>'+
      '<label><b>Categoría</b><select data-v64-cred-cat><option>Primera Fuerza</option><option>Intermedia</option><option>Segunda Fuerza</option><option>Veteranos 35+</option><option>Veteranos 50+</option></select></label>'+
      '<label><b>Número</b><input type="number" min="0" max="99" value="0" data-v64-cred-number></label>'+
    '</div>'+
    '<article class="v64-credential-preview"><div class="v64-cred-photo" data-v64-photo-preview><span>FOTO</span></div><div><small>LIGA JUVENTINO ROSAS</small><h2 data-v64-preview-name>Jugador</h2><p data-v64-preview-team>Equipo · Categoría</p><b data-v64-preview-number>#0</b><em data-v64-preview-curp>CURP ••••</em></div></article>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-print-credential>Imprimir / guardar PDF</button></div></section>';
}

function v64CedulaBuilderView(){
  const v66Home=localStorage.getItem('v66-cedula-home')||'',v66Away=localStorage.getItem('v66-cedula-away')||'',v66Cat=localStorage.getItem('v66-cedula-cat')||'Primera Fuerza',v66Date=localStorage.getItem('v66-cedula-date')||'',v66Field=localStorage.getItem('v66-cedula-field')||'';
  const v66DateValue=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v66Date)?v66Date.slice(0,16):'';
  return '<section class="v60-tool-page v64-page">'+v60Header('CÉDULAS','Generador interno de cédulas','Genera una cédula y plantillas dentro de Liga Juventino Rosas; no redirige a una página externa.')+
    '<div class="v64-form-grid one">'+
      '<label><b>Categoría</b><select data-v64-ced-cat><option '+(v66Cat==='Primera Fuerza'?'selected':'')+'>Primera Fuerza</option><option '+(v66Cat==='Intermedia'?'selected':'')+'>Intermedia</option><option '+(v66Cat==='Segunda Fuerza'?'selected':'')+'>Segunda Fuerza</option><option '+(v66Cat==='Veteranos 35+'?'selected':'')+'>Veteranos 35+</option><option '+(v66Cat==='Veteranos 50+'?'selected':'')+'>Veteranos 50+</option></select></label>'+
      '<label><b>Equipo local</b>'+v64TeamSelect(v66Home, 'data-v64-ced-home')+'</label>'+
      '<label><b>Visitante</b>'+v64TeamSelect(v66Away, 'data-v64-ced-away')+'</label>'+
      '<label><b>Fecha</b><input type="datetime-local" value="'+v64Esc(v66DateValue)+'" data-v64-ced-date></label>'+
      '<label><b>Campo</b><input type="text" value="'+v64Esc(v66Field)+'" placeholder="Por confirmar" data-v64-ced-field></label>'+
      '<label><b>Árbitro</b><input type="text" placeholder="Por asignar" data-v64-ced-ref></label>'+
    '</div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-generate-cedula>Generar cédula del partido</button><button class="v60-btn outline" data-v64-team-template>Generar plantillas de equipos</button><button class="v60-btn ghost" data-v64-print-cedula>Imprimir / guardar PDF</button></div>'+
    '<div data-v64-cedula-preview></div></section>';
}

function v64AgendaView(){
  return '<section class="v60-tool-page v64-page">'+v60Header('JORNADA','Preparar mi jornada','Agenda y lista de revisión guardadas en este dispositivo. Son borradores y no modifican partidos ni resultados oficiales.')+
    '<div class="v64-form-grid one">'+
      '<label><b>Equipo local</b>'+v64TeamSelect('', 'data-v64-ag-home')+'</label>'+
      '<label><b>Equipo visitante</b>'+v64TeamSelect('', 'data-v64-ag-away')+'</label>'+
      '<label><b>Campo</b><input type="text" data-v64-ag-field placeholder="Campo"></label>'+
      '<label><b>Inicio · hora de Juventino Rosas</b><input type="datetime-local" data-v64-ag-start></label>'+
      '<label><b>Duración reservada (minutos)</b><input type="number" value="120" min="30" step="15" data-v64-ag-duration></label>'+
    '</div>'+
    '<div class="v64-stack-actions"><button class="v60-btn" data-v64-ag-add>Agregar y revisar cruces</button><button class="v60-btn outline" data-v64-ag-json>Exportar agenda JSON</button><button class="v60-btn ghost" data-v64-ag-clear>Limpiar agenda local</button></div>'+
    '<div class="v64-agenda-list" data-v64-agenda-list></div></section>';
}

function v64MotionView(){
  return '<section class="v60-tool-page v64-page v64-motion-page">'+v60Header('JORNADA','Fútbol en movimiento','Animación ligera adaptada a la app. Puedes pausarla cuando quieras.')+
    '<div class="v64-motion-tabs"><button data-v63-official="fixtures">JORNADA</button><button data-route="competition">RESULTADOS</button><button data-route="venues">CAMPOS</button></div>'+
    '<div class="v64-orbit-stage" data-v64-orbit><div class="v64-orbit one"><span>⚽</span></div><div class="v64-orbit two"><span>⚽</span></div><div class="v64-orbit-core">LIGA<br>JUVENTINO</div></div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-motion-toggle>Pausar movimiento</button><button class="v60-btn outline" data-v63-official="fixtures">Ver jornada</button></div></section>';
}

function v64SuspensionView(){
  let s={};try{s=JSON.parse(localStorage.getItem('v64-suspension-draft')||'{}')}catch(e){}
  return '<section class="v60-tool-page v64-page">'+v60Header('AVISO OFICIAL','Suspensión de jornada','Prepara un aviso local antes de publicarlo. No cambia automáticamente el estado oficial de los partidos.')+
    '<div class="v64-form-grid one"><label><b>Categoría</b><select data-v64-susp-cat><option '+(s.category==='Veteranos 50+'?'selected':'')+'>Veteranos 50+</option><option '+(s.category==='Veteranos 35+'?'selected':'')+'>Veteranos 35+</option><option '+(s.category==='Primera Fuerza'?'selected':'')+'>Primera Fuerza</option><option>Intermedia</option><option>Segunda Fuerza</option></select></label>'+
    '<label><b>Jornada</b><input type="number" min="1" value="'+v64Esc(s.jornada||6)+'" data-v64-susp-round></label></div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-susp-preview>Vista previa del aviso</button><button class="v60-btn outline" data-v64-susp-save>Guardar borrador local</button></div>'+
    '<div data-v64-susp-modal></div></section>';
}

function v64RenderAgenda(){
  const host=document.querySelector('[data-v64-agenda-list]');if(!host)return;let list=[];try{list=JSON.parse(localStorage.getItem('v64-agenda')||'[]')}catch(e){}
  host.innerHTML=list.length?list.map(function(x,i){return '<article><b>'+v64Esc(x.home)+' vs '+v64Esc(x.away)+'</b><small>'+v64Esc(x.start||'Sin hora')+' · '+v64Esc(x.field||'Campo por confirmar')+' · '+v64Esc(x.duration)+' min</small><button data-v64-ag-remove="'+i+'">Quitar</button></article>'}).join(''):'<p class="v60-note">Todavía no hay cruces guardados.</p>';
  host.querySelectorAll('[data-v64-ag-remove]').forEach(function(b){b.onclick=function(){list.splice(Number(b.dataset.v64AgRemove),1);localStorage.setItem('v64-agenda',JSON.stringify(list));v64RenderAgenda()}});
}

function v64CredentialSync(){
  const name=document.querySelector('[data-v64-cred-name]')?.value||'Jugador',teamName=document.querySelector('[data-v64-cred-team]')?.value||'Equipo',cat=document.querySelector('[data-v64-cred-cat]')?.value||'Categoría',num=document.querySelector('[data-v64-cred-number]')?.value||'0',curp=document.querySelector('[data-v64-cred-curp]')?.value||'';
  const n=document.querySelector('[data-v64-preview-name]'),t=document.querySelector('[data-v64-preview-team]'),no=document.querySelector('[data-v64-preview-number]'),cu=document.querySelector('[data-v64-preview-curp]');
  if(n)n.textContent=name;if(t)t.textContent=teamName+' · '+cat;if(no)no.textContent='#'+num;if(cu)cu.textContent=curp?'CURP ••••'+curp.slice(-4):'CURP ••••';
}

function v64LoadTesseract(){
  if(window.Tesseract)return Promise.resolve(window.Tesseract);
  return new Promise(function(resolve,reject){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=function(){resolve(window.Tesseract)};s.onerror=reject;document.head.appendChild(s)});
}

const V64_APP_URL='https://jairofrancog7-star.github.io/App-liga-/?mode=apk#/home';
const V64_QR_SRC='https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data='+encodeURIComponent(V64_APP_URL);
function ligaQRView(){
  return '<section class="v60-tool-page v64-qr-page">'+
    v60Header('ACCESO A LA LIGA','QR de la Liga','Comparte la aplicación oficial de la Liga Municipal de Fútbol Juventino Rosas sin añadir contenido de entrenamientos.')+
    '<article class="v60-panel v64-qr-card">'+
      '<div class="v64-qr-frame"><img src="'+V64_QR_SRC+'" alt="Código QR para abrir la app de la Liga Municipal de Fútbol Juventino Rosas" loading="eager" decoding="async"></div>'+
      '<h2>Abre la app oficial</h2>'+
      '<p>Escanea este código con la cámara de otro teléfono. El QR abre directamente la aplicación de la Liga.</p>'+
      '<code class="v64-qr-url">'+V64_APP_URL+'</code>'+
      '<div class="v60-actions">'+
        '<a class="v60-link" href="'+V64_APP_URL+'" target="_blank" rel="noopener noreferrer">Abrir app</a>'+
        '<button class="v60-btn outline" data-v64-share>Compartir</button>'+
        '<button class="v60-btn ghost" data-v64-copy>Copiar enlace</button>'+
      '</div>'+
    '</article>'+
    '<div class="v60-panel v64-qr-how">'+
      '<div class="v60-row"><span class="v60-row-copy"><b>1 · Mostrar el QR</b><small>Abre esta pantalla desde Más → QR de la Liga.</small></span></div>'+
      '<div class="v60-row"><span class="v60-row-copy"><b>2 · Escanear</b><small>La otra persona apunta su cámara al código.</small></span></div>'+
      '<div class="v60-row"><span class="v60-row-copy"><b>3 · Abrir la Liga</b><small>El enlace lleva a la app, no a contenidos de entrenamientos.</small></span></div>'+
    '</div>'+
    '<div class="v60-actions"><button class="v60-btn outline" data-route="search">Buscar en la Liga</button><button class="v60-btn ghost" data-route="leagueTools">Todas las herramientas</button></div>'+
  '</section>';
}

function moreView(){
  return '<section class="v19-more-page" data-v19-more>'+
    '<img class="v19-more-logo" src="'+V19_MORE_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas" loading="eager" decoding="async">'+
    '<div class="v19-more-menu">'+
      v19MoreButton('star','Siguiendo','following')+
      v19MoreButton('shield','Equipos','teams')+
      v19MoreButton('performance','Performance Zone','safe-performance',true)+
      v19MoreButton('medal','Máximo goleador','scorers')+
      v19MoreButton('video','Momentos','moments')+
      v19MoreButton('data','Datos','safe-data',true)+
      v19MoreButton('qr','QR de la Liga','ligaQR')+
    '</div>'+
    '<div class="v19-more-label">Gaming</div>'+
    '<div class="v19-more-menu">'+
      v19MoreButton('score','Pronostica Seis','predictor')+
      v19MoreButton('quiz','Quiz Arena','quizArena')+
      v19MoreButton('arrows','Más O Menos','moreLess')+
    '</div>'+
    '<div class="v19-more-label event">En el evento</div>'+
    '<div class="v19-more-menu">'+v19MoreButton('glasses','Hospitalidad','hospitality')+'</div>'+
    '<div class="v19-more-menu">'+
      v19MoreButton('info','Reglamento','rulebook')+
      v19MoreButton('data','Todas las herramientas','leagueTools')+
    '</div>'+
    '<div class="v19-more-label explore">Explorar</div>'+
    '<div class="v19-more-menu">'+
      v19MoreButton('search','Buscar','search')+
      v19MoreButton('trophy','Rankings de la Liga','rankings')+
      v19MoreButton('history','Historia','history')+
      v19MoreButton('bag','Tienda','club-store')+
      v19MoreButton('info','Sobre la Liga Municipal','safe-about',true)+
    '</div>'+
    '<div class="v19-more-bottom">'+
      '<p class="v19-sponsor-title">Patrocinadores oficiales de la Liga</p>'+
      '<div class="v19-sponsors">'+
        '<div class="v19-sponsor s1"><div><span class="town-mark">♜</span><b>JUVENTINO<br>ROSAS</b></div></div>'+
        '<div class="v19-sponsor s2"><div>Pasión<br><b>Local</b></div></div>'+
        '<div class="v19-sponsor s3"><div><b>NUESTRO<br>FÚTBOL</b><span class="ball-mini">⚽</span></div></div>'+
        '<div class="v19-sponsor s4"><div><span class="people-mark">●●●</span><b>COMUNIDAD<br>EN ACCIÓN</b></div></div>'+
        '<div class="v19-sponsor s5"><div><b>DEPORTE<br>UNE</b><i></i></div></div>'+
      '</div>'+
      '<div class="v19-official">App oficial de la Liga<img src="'+V19_MORE_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas" loading="lazy" decoding="async"></div>'+
    '</div>'+
  '</section>';
}
function hospitalityView(){
  return '<div class="eyebrow">EN EL EVENTO</div><h1 class="screen-title">Hospitalidad</h1>'+
    '<section class="section"><div class="profile-card"><h2>Hospitalidad de la Liga</h2><p>Consulta sedes, accesos y servicios disponibles para los partidos de la Liga Municipal de Fútbol Juventino Rosas.</p><div class="button-row"><button class="btn primary" data-route="venues">Ver campos / sedes</button><button class="btn outline" data-route="competition">Ver partidos</button></div></div></section>'+
    '<section class="section"><div class="section-head"><h2>Accesos rápidos</h2></div><div class="menu-group">'+
      '<button class="menu-row" data-route="venues"><span>Campos y sedes<small>Ubicación y próximos partidos</small></span><span>›</span></button>'+
      '<button class="menu-row" data-route="competition"><span>Jornada y resultados<small>Partidos programados y marcadores</small></span><span>›</span></button>'+
      '<button class="menu-row" data-route="news"><span>Noticias y avisos<small>Información para equipos y afición</small></span><span>›</span></button>'+
    '</div></section>';
}
function storeView(){
  return '<div class="eyebrow">LIGA JUVENTINO</div><h1 class="screen-title">Tienda</h1>'+
    '<section class="section"><div class="profile-card"><h2>Tienda de clubes</h2><p>Selecciona un equipo para consultar su perfil y preparar su espacio de artículos oficiales de la Liga.</p></div></section>'+
    '<div class="team-list">'+teams.map(t=>'<div class="team-row"><button class="team-main" data-team="'+t.code+'">'+crest(t.code)+'<span><b>'+t.name+'</b><small>Ver club y artículos</small></span></button><button class="mini-btn" data-team="'+t.code+'">Abrir</button></div>').join('')+'</div>';
}
function quizArenaView(){
  const correct='Juventino';
  const options=[['A','Pozos'],['B','Rincón de Centeno'],['C','Juventino'],['D','Cuenda']];
  return `<section class="v48-quiz-arena-page" data-v48-arena data-v48-correct="${correct}" aria-label="Quiz Arena">

    <div class="v48-arena-landing" data-v48-landing>
      <header class="v48-arena-head">
        <button type="button" class="v48-back-real" data-route="more" aria-label="Volver a Más">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>
        </button>
        <h1>Quiz Arena</h1>
      </header>

      <section class="v48-arena-card" aria-label="Entrar a Quiz Arena">
        <div class="v48-ball-stage" aria-hidden="true"></div>
        <div class="v48-arena-actions">
          <button type="button" class="v48-primary" data-route="profile">Inicia sesión para<br>jugar</button>
          <button type="button" class="v48-secondary" data-v48-start>Prueba como<br>invitado</button>
        </div>
      </section>

      <div class="v48-arena-promo" aria-label="Liga Municipal de Fútbol Juventino Rosas">
        <span class="v48-promo-mark">JR</span>
        <span><b>LIGA JUVENTINO ROSAS</b><small>Quiz oficial · Fútbol municipal</small></span>
        <strong>JUGAR</strong>
      </div>

      <section class="v48-challenge-card">
        <div>
          <h2>¡Reta a tus amigos en el Quiz!</h2>
          <p>Demuestra cuánto sabes de nuestra liga.</p>
          <button type="button" data-v48-start>Jugar ahora</button>
        </div>
        <div class="v48-mini-ball" aria-hidden="true"><i></i></div>
      </section>

      <button type="button" class="v48-ranking-link" data-route="rankings">
        <span>Clasificaciones</span><b>›</b>
      </button>
    </div>

    <section class="v48-game" data-v48-game aria-label="Quiz de la Liga" aria-hidden="true">
      <button type="button" class="v48-game-back" data-v48-game-back aria-label="Volver a Quiz Arena">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>
      </button>

      <div class="v48-game-logo" aria-label="Quiz de la Liga">
        <span class="v48-game-quiz">QUIZ</span>
        <span class="v48-game-de">DE LA</span>
        <span class="v48-game-liga">LIGA</span>
        <i class="v48-game-check" aria-hidden="true"></i>
        <i class="v48-game-left" aria-hidden="true"></i>
        <i class="v48-game-right" aria-hidden="true"></i>
      </div>
      <div class="v48-game-subtitle"><i></i><span>LIGA MUNICIPAL DE FÚTBOL<br>JUVENTINO ROSAS</span><i></i></div>

      <div class="v48-game-card">
        <p>¿Qué equipo lidera actualmente la tabla?</p>
        ${options.map(([letter,label])=>`<button type="button" class="v48-game-option" data-v48-quiz="${label}" aria-label="${letter}. ${label}"><span class="v48-game-letter">${letter}</span><span class="v48-game-text">${label}</span><span class="v48-game-ok" aria-hidden="true">✓</span></button>`).join('')}
      </div>

      <div class="v48-game-stadium" aria-hidden="true"><i></i><i></i><span></span></div>
      <div class="v48-game-message" aria-live="polite"></div>
    </section>
  </section>`;
}
function quizView(){
  const correct='Juventino';
  const options=[['A','Pozos'],['B','Rincón de Centeno'],['C','Juventino'],['D','Cuenda']];
  return `<section class="v30-quiz-page" data-quiz-correct="${correct}">
    <div class="v30-quiz-logo" aria-label="Quiz de la Liga">
      <span class="v30-logo-quiz">QUIZ</span>
      <span class="v30-logo-de">DE LA</span>
      <span class="v30-logo-liga">LIGA</span>
      <i class="v30-check-box" aria-hidden="true"></i>
      <i class="v30-angle-left" aria-hidden="true"></i>
      <i class="v30-angle-right" aria-hidden="true"></i>
    </div>
    <div class="v30-quiz-subtitle" aria-hidden="true"><i></i><span>LIGA MUNICIPAL DE FÚTBOL<br>JUVENTINO ROSAS</span><i></i></div>
    <div class="quiz-card">
      <p>¿Qué equipo lidera actualmente la tabla?</p>
      ${options.map(([letter,label])=>`<button type="button" class="quiz-option" data-quiz="${label}" aria-label="${letter}. ${label}"><span class="v30-answer-letter">${letter}</span><span class="v30-answer-text">${label}</span><span class="v30-answer-check" aria-hidden="true">✓</span></button>`).join('')}
    </div>
    <div class="v30-quiz-stadium" aria-hidden="true"><i class="v30-light left"></i><i class="v30-light right"></i><i class="v30-stands"></i></div>
    <span class="v30-stadium-tint" aria-hidden="true"></span>
  </section>`;
}function moreLessView(){const a=players[0],b=players[1];return `<div class="game-hero"><span class="eyebrow">JUEGO</span><h1 class="game-title">MÁS<br>O MENOS</h1><p class="muted">¿Quién tiene más goles?</p><div class="compare-two"><button data-moreless="${a.id}"><div class="avatar-ball">${a.number}</div><b>${a.name}</b></button><span>VS</span><button data-moreless="${b.id}"><div class="avatar-ball">${b.number}</div><b>${b.name}</b></button></div></div>`}function venuesView(){return `<div class="eyebrow">SEDES</div><h1 class="screen-title">Campos</h1><div class="news-list">${[...new Set(teams.map(t=>t.field))].map((v,i)=>`<div class="news-row"><span class="venue-thumb"></span><span><small>Sede ${i+1}</small><b>${v}</b><p>Consulta los próximos partidos programados.</p></span></div>`).join('')}</div>`}
const views={home:homeView,competition:competitionView,match:matchView,video:videoView,fantasy:fantasyView,fantasyTeam:fantasyTeamView,fantasyLeagues:()=>`<div class="eyebrow">FANTASY</div><h1 class="screen-title">Ligas</h1><div class="profile-card"><h2>Compite con amigos</h2><p>Crea una liga privada o únete con un código.</p><div class="button-row"><button class="btn primary" data-action="create-league">Crear liga</button><button class="btn outline" data-action="join-league">Unirme</button></div></div>`,more:moreView,ligaQR:ligaQRView,hospitality:hospitalityView,'club-store':storeView,following:followingView,teams:teamsView,teamDetail:teamDetailView,players:playersView,playerDetail:playerDetailView,scorers:scorersView,moments:momentsView,stats:statsView,rankings:rankingsView,history:historyView,news:newsView,newsDetail:newsDetailView,transfers:transfersView,favorites:favoritesView,search:searchView,vote:voteView,notifications:notificationsView,privacy:privacyView,profile:profileView,predictor:predictorView,predictorSix:predictorSixView,quizArena:quizArenaView,quiz:quizArenaView,moreLess:moreLessView,moreLessHub:()=>`<div data-v52-mount></div>`,venues:v60VenuesView,leagueTools:leagueToolsView,v38Stats:v38StatsView,v38Weekly:v38WeeklyView,v38Weather:v38WeatherView,v38Alerts:v38AlertsView,tableExport:v64ExportTableView,bracketBuilder:v64BracketView,credentialBuilder:v64CredentialBuilderView,cedulaBuilder:v64CedulaBuilderView,agendaBuilder:v64AgendaView,motionHub:v64MotionView,suspensionTool:v64SuspensionView,rulebook:rulebookView,matchday:matchdayView,weatherFields:weatherFieldsView,cedulas:cedulasView,cedulaDetail:cedulaDetailView,credential:credentialView,publications:publicationsView,tactics:tacticsView,simulator:simulatorView,jrControl:jrControlView,error:()=>`<div class="empty-state"><div class="empty-illustration error"></div><h2>No pudimos cargar la información</h2><p>Comprueba tu conexión e inténtalo nuevamente.</p><button class="btn outline" data-route="home">Reintentar</button></div>`};
function render(){if(state.route==='quiz'){state.route='quizArena';if(location.hash!=='#/quizArena')history.replaceState(null,'','#/quizArena')}if(state.route==='theme'){setTheme(state.theme==='dark'?'light':'dark');state.route='more'}screen.innerHTML=views[state.route]?views[state.route]():views.home();const rootRoutes=['home','competition','video','fantasy','more'];backButton.classList.toggle('is-hidden',rootRoutes.includes(state.route));const navRoute=['predictor','predictorSix','quizArena','quiz','moreLess','moreLessHub','ligaQR','leagueTools','v38Stats','v38Weekly','v38Weather','v38Alerts','tableExport','bracketBuilder','credentialBuilder','cedulaBuilder','agendaBuilder','motionHub','suspensionTool','rulebook','matchday','weatherFields','venues','cedulas','cedulaDetail','credential','publications','tactics','simulator','jrControl','leagueData'].includes(state.route)?'more':state.route;navItems.forEach(n=>n.classList.toggle('active',n.dataset.route===navRoute));bind();window.scrollTo(0,0)}
function go(route,push=true){if(route==='quiz')route='quizArena';if(push&&state.route!==route)state.history.push(state.route);state.route=route;location.hash='#/'+route;render()}
function bind(){document.querySelectorAll('[data-route]').forEach(el=>el.onclick=()=>go(el.dataset.route));
document.querySelectorAll('[data-v48-start]').forEach(el=>el.onclick=()=>{const page=el.closest('[data-v48-arena]');if(!page)return;page.classList.add('v48-playing');page.querySelector('[data-v48-game]')?.setAttribute('aria-hidden','false');window.scrollTo({top:0,behavior:'smooth'});window.setTimeout(()=>page.querySelector('[data-v48-quiz]')?.focus({preventScroll:true}),260)});
document.querySelectorAll('[data-v48-game-back]').forEach(el=>el.onclick=()=>{const page=el.closest('[data-v48-arena]');if(!page)return;page.classList.remove('v48-playing','v48-answered');page.dataset.v48Answered='false';page.querySelector('[data-v48-game]')?.setAttribute('aria-hidden','true');page.querySelectorAll('[data-v48-quiz]').forEach(btn=>{btn.disabled=false;btn.classList.remove('is-correct','is-wrong');btn.removeAttribute('aria-pressed')});const msg=page.querySelector('.v48-game-message');if(msg)msg.textContent='';window.scrollTo({top:0,behavior:'smooth'})});
document.querySelectorAll('[data-v48-quiz]').forEach(el=>el.onclick=()=>{const page=el.closest('[data-v48-arena]');if(!page||page.dataset.v48Answered==='true')return;page.dataset.v48Answered='true';page.classList.add('v48-answered');const correct=page.dataset.v48Correct||'Juventino';page.querySelectorAll('[data-v48-quiz]').forEach(btn=>{btn.disabled=true;btn.setAttribute('aria-pressed',btn===el?'true':'false');btn.classList.toggle('is-correct',btn.dataset.v48Quiz===correct);btn.classList.toggle('is-wrong',btn.dataset.v48Quiz!==correct)});const msg=page.querySelector('.v48-game-message');if(msg)msg.textContent=el.dataset.v48Quiz===correct?'¡Correcto! +10 puntos':'Respuesta incorrecta · Correcta: '+correct});

document.querySelectorAll('[data-v60-pdf-prev]').forEach(el=>el.onclick=()=>v60RenderRulebookPage(v60RulebookPage-1));
document.querySelectorAll('[data-v60-pdf-next]').forEach(el=>el.onclick=()=>v60RenderRulebookPage(v60RulebookPage+1));
if(state.route==='rulebook')requestAnimationFrame(()=>v60RenderRulebookPage(v60RulebookPage||1));
document.querySelectorAll('[data-v60-comp]').forEach(el=>el.onclick=()=>{state.competitionTab=el.dataset.v60Comp||'fixtures';save();go('competition')});
document.querySelectorAll('[data-v63-comp]').forEach(el=>el.onclick=()=>{state.competitionTab=el.dataset.v63Comp||'standings';save();go('competition')});
document.querySelectorAll('[data-v63-official]').forEach(el=>el.onclick=()=>{const tab=el.dataset.v63Official||'summary';localStorage.setItem('v62-data-tab',tab);try{window.LJR_OFFICIAL_API?.setDataTab?.(tab)}catch(e){}go('leagueData')});
document.querySelectorAll('[data-v60-check]').forEach(el=>el.onchange=()=>{const s=v60MatchdayState();s[el.dataset.v60Check]=el.checked;localStorage.setItem('v60-matchday',JSON.stringify(s));toast('Match Day actualizado')});
document.querySelector('[data-v64-export-png]')?.addEventListener('click',async()=>{const b=await v64CanvasTable();if(b)v64Download(b,'Liga_Juventino_Tabla.png')},{once:true});
document.querySelector('[data-v64-share-png]')?.addEventListener('click',async()=>{const b=await v64CanvasTable();if(!b)return;const file=new File([b],'Liga_Juventino_Tabla.png',{type:'image/png'});try{if(navigator.canShare?.({files:[file]}))await navigator.share({title:'Tabla Liga Juventino Rosas',files:[file]});else v64Download(b,file.name)}catch(e){}},{once:true});
document.querySelector('[data-v64-export-csv]')?.addEventListener('click',()=>{const rows=v64StandingsRows(),csv='Posicion,Equipo,PJ,DG,PTS\n'+rows.map(r=>[r.pos,r.name,r.pj,r.dg,r.pts].map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');v64Download(new Blob([csv],{type:'text/csv;charset=utf-8'}),'Liga_Juventino_Tabla.csv')},{once:true});
document.querySelector('[data-v64-bracket-png]')?.addEventListener('click',async()=>{const b=await v64CanvasBracket();if(b)v64Download(b,'Liga_Juventino_Cuadro.png')},{once:true});
document.querySelector('[data-v64-photo]')?.addEventListener('change',e=>{const file=e.target.files?.[0],host=document.querySelector('[data-v64-photo-preview]');if(!file||!host)return;host.innerHTML='<img alt="Foto del jugador">';host.querySelector('img').src=URL.createObjectURL(file)},{once:true});
document.querySelectorAll('[data-v64-cred-name],[data-v64-cred-curp],[data-v64-cred-team],[data-v64-cred-cat],[data-v64-cred-number]').forEach(el=>{el.addEventListener('input',v64CredentialSync);el.addEventListener('change',v64CredentialSync)});
v64CredentialSync();
document.querySelector('[data-v64-ocr]')?.addEventListener('click',async e=>{const file=document.querySelector('[data-v64-doc]')?.files?.[0],out=document.querySelector('[data-v64-ocr-text]');if(!file||!out){toast('Selecciona una foto de CURP o INE');return}const btn=e.currentTarget;btn.disabled=true;btn.textContent='Leyendo…';try{const T=await v64LoadTesseract();const r=await T.recognize(file,'spa');const txt=r?.data?.text||'';out.value=txt;const curp=(txt.toUpperCase().match(/\b[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d\b/)||[])[0]||'';if(curp){const f=document.querySelector('[data-v64-cred-curp]');if(f)f.value=curp}v64CredentialSync();toast('Texto detectado; revisa los datos')}catch(err){toast('No se pudo leer el documento; puedes capturar los datos manualmente')}finally{btn.disabled=false;btn.textContent='Detectar texto'}},{once:true});
document.querySelector('[data-v64-clear-ocr]')?.addEventListener('click',()=>{const d=document.querySelector('[data-v64-doc]'),t=document.querySelector('[data-v64-ocr-text]'),q=document.querySelector('[data-v64-cred-curp]');if(d)d.value='';if(t)t.value='';if(q)q.value='';v64CredentialSync()},{once:true});
document.querySelector('[data-v64-print-credential]')?.addEventListener('click',()=>{document.body.classList.add('v64-print-credential');window.print();setTimeout(()=>document.body.classList.remove('v64-print-credential'),300)},{once:true});
document.querySelector('[data-v64-generate-cedula]')?.addEventListener('click',()=>{const q=s=>document.querySelector(s)?.value||'';const home=q('[data-v64-ced-home]')||'Local',away=q('[data-v64-ced-away]')||'Visitante',cat=q('[data-v64-ced-cat]'),date=q('[data-v64-ced-date]')||'Por confirmar',field=q('[data-v64-ced-field]')||'Por confirmar',ref=q('[data-v64-ced-ref]')||'Por asignar',host=document.querySelector('[data-v64-cedula-preview]');if(host)host.innerHTML='<article class="v60-cedula v64-generated-cedula"><div class="v60-cedula-head"><b>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</b><span>'+v64Esc(cat)+'</span></div><div class="v60-versus"><div><strong>'+v64Esc(home)+'</strong></div><span>VS</span><div><strong>'+v64Esc(away)+'</strong></div></div><div class="v60-cedula-meta"><div><small>Fecha</small><b>'+v64Esc(date)+'</b></div><div><small>Campo</small><b>'+v64Esc(field)+'</b></div><div><small>Árbitro</small><b>'+v64Esc(ref)+'</b></div><div><small>Estado</small><b>Por confirmar</b></div></div></article>';toast('Cédula generada')},{once:true});
document.querySelector('[data-v64-team-template]')?.addEventListener('click',()=>{const h=document.querySelector('[data-v64-ced-home]')?.value||'Local',a=document.querySelector('[data-v64-ced-away]')?.value||'Visitante',csv='Equipo,Numero,Jugador,Posicion,Firma\n'+[h,a].map(n=>'"'+n+'",,,,').join('\n');v64Download(new Blob([csv],{type:'text/csv;charset=utf-8'}),'Plantillas_Equipos.csv')},{once:true});
document.querySelector('[data-v64-print-cedula]')?.addEventListener('click',()=>window.print(),{once:true});
document.querySelector('[data-v64-ag-add]')?.addEventListener('click',()=>{let list=[];try{list=JSON.parse(localStorage.getItem('v64-agenda')||'[]')}catch(e){}const q=s=>document.querySelector(s)?.value||'';list.push({home:q('[data-v64-ag-home]')||'Local',away:q('[data-v64-ag-away]')||'Visitante',field:q('[data-v64-ag-field]'),start:q('[data-v64-ag-start]'),duration:Number(q('[data-v64-ag-duration]')||120)});localStorage.setItem('v64-agenda',JSON.stringify(list));v64RenderAgenda();toast('Cruce guardado en este dispositivo')},{once:true});
document.querySelector('[data-v64-ag-json]')?.addEventListener('click',()=>{let raw=localStorage.getItem('v64-agenda')||'[]';v64Download(new Blob([raw],{type:'application/json'}),'Agenda_Liga_Juventino.json')},{once:true});
document.querySelector('[data-v64-ag-clear]')?.addEventListener('click',()=>{localStorage.removeItem('v64-agenda');v64RenderAgenda();toast('Agenda local limpiada')},{once:true});
v64RenderAgenda();
document.querySelector('[data-v64-motion-toggle]')?.addEventListener('click',e=>{const stage=document.querySelector('[data-v64-orbit]');stage?.classList.toggle('paused');e.currentTarget.textContent=stage?.classList.contains('paused')?'Reanudar movimiento':'Pausar movimiento'},{once:true});
document.querySelector('[data-v64-susp-save]')?.addEventListener('click',()=>{const category=document.querySelector('[data-v64-susp-cat]')?.value||'',jornada=document.querySelector('[data-v64-susp-round]')?.value||'';localStorage.setItem('v64-suspension-draft',JSON.stringify({category,jornada}));toast('Borrador guardado solo en este dispositivo')},{once:true});
document.querySelector('[data-v64-susp-preview]')?.addEventListener('click',()=>{const category=document.querySelector('[data-v64-susp-cat]')?.value||'',jornada=document.querySelector('[data-v64-susp-round]')?.value||'',host=document.querySelector('[data-v64-susp-modal]');if(host)host.innerHTML='<div class="v64-susp-modal"><div><b>⚠ Jornada suspendida hoy</b><button type="button" data-v64-susp-close>×</button></div><p>Se suspende la jornada de la categoría seleccionada que tenía juego programado para hoy.</p><strong>'+v64Esc(category)+'</strong><span>Jornada: '+v64Esc(jornada)+'</span><em>Vista previa · no publicada</em><button class="v60-btn" data-v64-susp-ok>Entendido</button></div>';const close=()=>{if(host)host.innerHTML=''};host?.querySelector('[data-v64-susp-close]')?.addEventListener('click',close);host?.querySelector('[data-v64-susp-ok]')?.addEventListener('click',close)},{once:true});
const v60note=document.querySelector('[data-v60-matchday-note]');if(v60note)v60note.oninput=()=>{const s=v60MatchdayState();s.note=v60note.value;localStorage.setItem('v60-matchday',JSON.stringify(s))};
document.querySelectorAll('[data-v60-weather]').forEach(el=>el.onclick=async()=>{const f=v60Field(el.dataset.v60Weather),out=document.querySelector('[data-v60-weather-result="'+f.id+'"]');if(!out||!f.weather||!Number.isFinite(f.lat)||!Number.isFinite(f.lon))return;out.hidden=false;out.classList.remove('is-error');out.textContent='Consultando clima…';el.disabled=true;try{const u='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(f.lat)+'&longitude='+encodeURIComponent(f.lon)+'&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=America%2FMexico_City';const r=await fetch(u);if(!r.ok)throw new Error('weather');const j=await r.json(),w=j.current||{};out.innerHTML='<b>'+Math.round(w.temperature_2m??0)+' °C</b><div class="v60-weather-grid"><span><b>'+Number(w.precipitation??0).toFixed(1)+' mm</b><small>Precipitación</small></span><span><b>'+Math.round(w.wind_speed_10m??0)+' km/h</b><small>Viento</small></span><span><b>'+String(w.weather_code??'—')+'</b><small>Código clima</small></span></div><small>Actualización: '+String(w.time||'ahora')+'</small>'}catch(e){out.classList.add('is-error');out.textContent='No se pudo consultar el clima en este momento.'}finally{el.disabled=false}});
document.querySelectorAll('[data-v60-cedula]').forEach(el=>el.onclick=()=>{state.selectedMatch=el.dataset.v60Cedula;save();go('cedulaDetail')});
document.querySelectorAll('[data-v60-print]').forEach(el=>el.onclick=()=>window.print());
document.querySelectorAll('[data-v60-share]').forEach(el=>el.onclick=async()=>{const txt=document.querySelector('[data-v60-share-text]')?.textContent?.trim()||'Liga Juventino Rosas';try{if(navigator.share)await navigator.share({title:'Liga Juventino Rosas',text:txt});else{await navigator.clipboard.writeText(txt);toast('Texto copiado')}}catch(e){}});
document.querySelectorAll('[data-v60-copy]').forEach(el=>el.onclick=async()=>{const txt=document.querySelector('[data-v60-share-text]')?.textContent?.trim()||'';try{await navigator.clipboard.writeText(txt);toast('Texto copiado')}catch(e){toast('No se pudo copiar')}});
document.querySelectorAll('[data-v64-share]').forEach(el=>el.onclick=async()=>{try{if(navigator.share)await navigator.share({title:'Liga Municipal de Fútbol Juventino Rosas',text:'App oficial de la Liga Municipal de Fútbol Juventino Rosas',url:V64_APP_URL});else{await navigator.clipboard.writeText(V64_APP_URL);toast('Enlace de la Liga copiado')}}catch(e){}});
document.querySelectorAll('[data-v64-copy]').forEach(el=>el.onclick=async()=>{try{await navigator.clipboard.writeText(V64_APP_URL);toast('Enlace de la Liga copiado')}catch(e){toast('No se pudo copiar el enlace')}});
document.querySelectorAll('[data-v60-formation]').forEach(el=>el.onclick=()=>{localStorage.setItem('v60-formation',el.dataset.v60Formation);render()});
document.querySelectorAll('[data-v60-sim]').forEach(el=>el.onclick=()=>{const s=v60SimState(),k=el.dataset.v60Sim;s[k]=(s[k]||0)+Number(el.dataset.delta||0);localStorage.setItem('v60-sim',JSON.stringify(s));render()});
document.querySelectorAll('[data-v60-sim-reset]').forEach(el=>el.onclick=()=>{localStorage.removeItem('v60-sim');render()});
document.querySelectorAll('[data-v53-next]').forEach(el=>el.onclick=()=>{state.predictorSlide=((state.predictorSlide||0)+1)%4;render()});document.querySelectorAll('[data-v53-guest]').forEach(el=>el.onclick=()=>{toast('Modo invitado activado · elige tus seis pronósticos')});document.querySelectorAll('[data-comp-tab]').forEach(el=>el.onclick=()=>{state.competitionTab=el.dataset.compTab;render()});document.querySelectorAll('[data-day]').forEach(el=>el.onclick=()=>{state.selectedDay=el.dataset.day;save();render()});document.querySelectorAll('[data-category]').forEach(el=>el.onclick=()=>{state.matchCategory=el.dataset.category;save();render()});document.querySelectorAll('[data-match]').forEach(el=>el.onclick=()=>{state.selectedMatch=el.dataset.match;go('match')});document.querySelectorAll('[data-team]').forEach(el=>el.onclick=()=>{state.selectedTeam=el.dataset.team;go('teamDetail')});document.querySelectorAll('[data-player]').forEach(el=>el.onclick=()=>{state.selectedPlayer=el.dataset.player;go('playerDetail')});document.querySelectorAll('[data-news]').forEach(el=>el.onclick=()=>{state.selectedNews=el.dataset.news;go('newsDetail')});document.querySelectorAll('[data-follow]').forEach(el=>el.onclick=e=>{e.stopPropagation();const code=el.dataset.follow;state.followed=state.followed.includes(code)?state.followed.filter(x=>x!==code):[...state.followed,code];save();toast(state.followed.includes(code)?`Ahora sigues a ${team(code).name}`:`Dejaste de seguir a ${team(code).name}`);render()});document.querySelectorAll('[data-favorite]').forEach(el=>el.onclick=e=>{e.stopPropagation();const id=el.dataset.favorite;state.favorites=isFav(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();toast(isFav(id)?'Guardado en Favoritos':'Eliminado de Favoritos');render()});document.querySelectorAll('[data-cheer]').forEach(el=>el.onclick=()=>{const id=el.dataset.cheer;state.cheers[id]=(state.cheers[id]||0)+1;save();toast('¡Apoyo registrado!');render()});document.querySelectorAll('[data-save-prediction]').forEach(el=>el.onclick=()=>{const id=el.dataset.savePrediction;state.predictions[id]={home:Number(document.querySelector('#predHome').value||0),away:Number(document.querySelector('#predAway').value||0)};save();toast('Pronóstico guardado');render()});document.querySelectorAll('[data-save-prediction-row]').forEach(el=>el.onclick=()=>{const id=el.dataset.savePredictionRow;state.predictions[id]={home:Number(document.querySelector(`#h-${id}`).value||0),away:Number(document.querySelector(`#a-${id}`).value||0)};save();toast('Pronóstico guardado');render()});document.querySelectorAll('[data-v29-pick]').forEach(el=>el.onclick=()=>{const id=el.dataset.v29Pick;const key='six:'+id;const current=state.predictions[key]?.pick??el.dataset.v29Default??'?';const seq=['?','1','X','2'];const pos=seq.indexOf(current);const next=seq[(pos<0?0:pos+1)%seq.length];state.predictions[key]={pick:next};save();toast('Pronóstico '+next+' guardado');render()});document.querySelectorAll('[data-add-player]').forEach(el=>el.onclick=()=>{const p=player(el.dataset.addPlayer);const slots=['POR','DEF','DEF','MED','MED','DEL','DEL'];const valid=slots.map((pos,i)=>({pos,i})).find(s=>s.pos===p.position&&!state.fantasyPicks[s.i]);if(!valid){toast(`No hay espacio libre para ${p.position}`);return}state.fantasyPicks[valid.i]={playerId:p.id};save();toast(`${p.name} agregado`);render()});document.querySelectorAll('[data-fantasy-slot]').forEach(el=>el.onclick=()=>{const slot=el.dataset.fantasySlot;if(state.fantasyPicks[slot]){delete state.fantasyPicks[slot];save();toast('Jugador eliminado');render()}else toast(`Selecciona un jugador ${el.dataset.position} de la lista`)});document.querySelectorAll('[data-history-tab]').forEach(el=>el.onclick=()=>{state.historyTab=el.dataset.historyTab;render()});document.querySelectorAll('[data-stats-tab]').forEach(el=>el.onclick=()=>{state.statsTab=el.dataset.statsTab;render()});document.querySelectorAll('[data-transfer-filter]').forEach(el=>el.onclick=()=>{state.transferFilter=el.dataset.transferFilter;save();render()});document.querySelectorAll('[data-vote]').forEach(el=>el.onclick=()=>{if(state.vote)return;state.vote=el.dataset.vote;save();toast(`Voto registrado para ${el.dataset.voteName||'el jugador seleccionado'}`);render()});document.querySelectorAll('[data-notification]').forEach(el=>el.onchange=()=>{state.notifications[el.dataset.notification]=el.checked;save();toast('Preferencia guardada')});document.querySelectorAll('[data-privacy]').forEach(el=>el.onchange=()=>{state.privacy[el.dataset.privacy]=el.checked;save()});document.querySelectorAll('[data-video]').forEach(el=>el.onclick=()=>openVideo(el.dataset.video));document.querySelectorAll('[data-quiz]').forEach(el=>el.onclick=()=>{const quiz=el.closest('[data-quiz-correct]');if(!quiz||quiz.dataset.quizAnswered==='true')return;quiz.dataset.quizAnswered='true';quiz.classList.add('v30-answer-result');const correct=quiz.dataset.quizCorrect||'Juventino';const buttons=[...quiz.querySelectorAll('[data-quiz]')];buttons.forEach(btn=>{btn.disabled=true;btn.setAttribute('aria-pressed',btn===el?'true':'false');btn.classList.remove('is-wrong');if(btn.dataset.quiz===correct)btn.classList.add('is-correct')});toast(el.dataset.quiz===correct?'¡Correcto! +10 puntos':'Respuesta incorrecta · Correcta: '+correct)});document.querySelectorAll('[data-moreless]').forEach(el=>el.onclick=()=>toast(el.dataset.moreless==='p1'?'¡Correcto! Juan Pérez tiene más goles':'No esta vez'));document.querySelectorAll('[data-action]').forEach(el=>el.onclick=()=>action(el.dataset.action));const gs=document.querySelector('#globalSearch');if(gs)gs.oninput=()=>{state.searchQuery=gs.value;document.querySelector('#searchResults').innerHTML=searchResultsHtml(gs.value);bind()};const ps=document.querySelector('#playerSearch');if(ps)ps.oninput=()=>{state.searchQuery=ps.value;document.querySelector('#playerResults').innerHTML=filterPlayers(ps.value).map(playerRowHtml).join('');bind()}}
function action(a){if(a==='share'){navigator.share?navigator.share({title:'Liga Juventino',text:'Mira esto en Liga Juventino'}):toast('Contenido listo para compartir')}if(a==='login-demo'){state.user={name:'Aficionado Municipal',email:'aficionado@ligajuventino.mx'};save();toast('Sesión local iniciada');render()}if(a==='logout'){state.user=null;save();render()}if(a==='clear-fantasy'){state.fantasyPicks={};save();render()}if(a==='accept-privacy'){state.privacy.accepted=true;save();toast('Preferencias de privacidad guardadas');render()}if(a==='create-league')toast('Liga privada creada: LJ-2026');if(a==='join-league')toast('Introduce el código de invitación cuando conectemos cuentas')}
function openVideo(title){const modal=document.createElement('div');modal.className='modal';modal.innerHTML=`<div class="video-modal"><button class="modal-close">×</button><div class="video-stage"><button class="play-big">▶</button></div><span class="eyebrow">VIDEO</span><h2>${title}</h2><p class="muted">Reproductor preparado. Añade el archivo o URL real para reproducir contenido oficial.</p><div class="progress"><i style="width:35%"></i></div><button class="btn outline full" data-cheer="video:${title}">Apoyar · ${state.cheers['video:'+title]||0}</button></div>`;document.body.appendChild(modal);modal.querySelector('.modal-close').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};modal.querySelector('[data-cheer]').onclick=()=>{const id='video:'+title;state.cheers[id]=(state.cheers[id]||0)+1;save();toast('¡Apoyo registrado!');modal.querySelector('[data-cheer]').textContent=`Apoyar · ${state.cheers[id]}`}}
backButton.onclick=()=>{const prev=state.history.pop();if(prev)go(prev,false);else go('home',false)};window.addEventListener('hashchange',()=>{let r=location.hash.replace('#/','');if(r==='quiz')r='quizArena';if(r&&r!==state.route){state.route=r;render()}});render();