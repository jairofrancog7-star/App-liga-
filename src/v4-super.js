// Liga Juventino V4 — advanced local feature pack.
// Works on top of the V3 Skywork UI without changing its visual identity.
(function(){
  const STORE_KEY='lj-store-v3';
  const V4_KEY='lj-store-v4';
  const screen=()=>document.querySelector('#screen');
  const backButton=()=>document.querySelector('#backButton');
  const $=(sel,root=document)=>root.querySelector(sel);
  const $$=(sel,root=document)=>[...root.querySelectorAll(sel)];
  const readJson=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const writeJson=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const base=()=>readJson(STORE_KEY,{});
  const defaults={
    route:null,matchTab:'Resumen',season:'2026',challengePicks:[],
    draft:{round:1,turn:0,picks:{A:[],B:[]},complete:false},leagues:[],joinedLeagues:[],
    quiz:{index:0,score:0,streak:0,answered:false,last:null},moreLess:{index:0,score:0,streak:0},
    notificationInbox:[
      {id:'i1',title:'Jornada 5 lista',body:'Consulta horarios y sedes de los próximos partidos.',time:'Hoy',read:false,route:'competition'},
      {id:'i2',title:'Juventino vs Pozos',body:'El partido destacado comienza a las 18:00.',time:'Hoy',read:false,route:'match'},
      {id:'i3',title:'Fantasy',body:'Revisa tu 7 Ideal antes de la próxima jornada.',time:'Ayer',read:true,route:'fantasy'}
    ],
    settings:{reducedMotion:false,largeText:false,compactMode:false,language:'es-MX'},
    comparison:{type:'player',left:'p1',right:'p2'},calendarMonth:9,calendarYear:2026
  };
  let stored=readJson(V4_KEY,{});
  let v4={...defaults,...stored,settings:{...defaults.settings,...(stored.settings||{})}};
  const save=()=>writeJson(V4_KEY,v4);
  const toast=(text)=>{const t=document.createElement('div');t.className='toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)};
  const routeName=()=>location.hash.replace('#/','');
  const isV4=()=>routeName().startsWith('v4-');
  const go=(name)=>{v4.route=name;save();location.hash='#/'+name;renderIfV4()};
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const teams=[
    {code:'JUV',name:'Juventino',pts:13,gd:9,category:'Primera Fuerza'},{code:'POZ',name:'Pozos',pts:11,gd:6,category:'Primera Fuerza'},
    {code:'RIN',name:'Rincón de Centeno',pts:9,gd:3,category:'Primera Fuerza'},{code:'CUE',name:'Cuenda',pts:8,gd:1,category:'Primera Fuerza'},
    {code:'SPD',name:'San Pedro',pts:6,gd:-1,category:'Veteranos 35+'},{code:'MOR',name:'Morales',pts:4,gd:-4,category:'Veteranos 35+'}
  ];
  const players=[
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
  const schedule=[
    {id:'m1',date:'2026-10-13',home:'JUV',away:'POZ',time:'18:00',status:'LIVE',score:'1–0'},
    {id:'m2',date:'2026-10-13',home:'CUE',away:'RIN',time:'20:00',status:'SCHEDULED'},
    {id:'m3',date:'2026-10-14',home:'SPD',away:'MOR',time:'19:00',status:'SCHEDULED'},
    {id:'m4',date:'2026-10-12',home:'RIN',away:'JUV',time:'18:00',status:'FINISHED',score:'1–3'},
    {id:'m5',date:'2026-10-12',home:'POZ',away:'CUE',time:'20:00',status:'FINISHED',score:'2–2'}
  ];
  const team=(code)=>teams.find(t=>t.code===code)||teams[0];
  const player=(id)=>players.find(p=>p.id===id)||players[0];
  const crest=(code)=>`<span class="crest">${esc(code)}</span>`;
  const calendarTeamIcon=(code)=>{
    const t=team(code);
    const src=window.LJR_TEAM_LOGOS?.get?.(t.name)||'';
    if(src)return `<span class="v70-team-icon"><img src="${esc(src)}" alt="${esc(t.name)}" loading="lazy" decoding="async"></span>`;
    return `<span class="v70-team-icon v70-team-icon-fallback" aria-label="${esc(t.name)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 18.8 6.7 17.5 15 12 20l-5.5-5L5.2 6.7 12 3Z"/><path d="m9.1 9.1 2.9-2 2.9 2-1.1 3.3h-3.6L9.1 9.1Zm-2.6 5.8 3.7-2.5m3.6 0 3.7 2.5M12 7.1V3.8"/></svg></span>`;
  };
  const header=(eyebrow,title,sub='')=>`<div class="eyebrow">${esc(eyebrow)}</div><h1 class="screen-title">${title}</h1>${sub?`<p class="muted v4-sub">${esc(sub)}</p>`:''}`;
  const section=(title,body)=>`<section class="section"><div class="section-head"><h2>${esc(title)}</h2></div>${body}</section>`;
  const stat=(value,label)=>`<div><b>${esc(value)}</b><small>${esc(label)}</small></div>`;

  function injectEntryPoints(){
    const root=screen();if(!root)return;const hash=routeName();
    if(hash==='more'&&!$('#v4HubEntry',root)){
      const group=document.createElement('div');group.className='menu-group v4-injected';group.id='v4HubEntry';
      group.innerHTML=`<h3>SUPER APP V4</h3><button class="menu-row" data-v4-route="v4-hub"><span>Centro de funciones V4<small>Challenge, Draft, calendario, disciplina y más</small></span><span>›</span></button><button class="menu-row" data-v4-route="v4-notifications"><span>Centro de notificaciones<small>${v4.notificationInbox.filter(x=>!x.read).length} sin leer</small></span><span>›</span></button><button class="menu-row" data-v4-route="v4-settings"><span>Ajustes avanzados<small>Accesibilidad y experiencia</small></span><span>›</span></button>`;root.appendChild(group)
    }
    if(hash==='fantasy'&&!$('#v4FantasyEntry',root)){
      const box=document.createElement('section');box.className='section v4-injected';box.id='v4FantasyEntry';box.innerHTML=`<div class="v4-action-grid"><button data-v4-route="v4-challenge">Challenge</button><button data-v4-route="v4-draft">Draft</button><button data-v4-route="v4-transfers">Transferencias</button><button data-v4-route="v4-leagues">Ligas privadas</button></div>`;root.appendChild(box)
    }
    if(hash==='competition'&&!$('#v4CompetitionEntry',root)){
      const box=document.createElement('section');box.className='section v4-injected';box.id='v4CompetitionEntry';box.innerHTML=`<div class="v4-action-grid"><button data-v4-route="v4-calendar">Calendario mensual</button><button data-v4-route="v4-matchcenter">Match Center</button><button data-v4-route="v4-discipline">Disciplina</button><button data-v4-route="v4-compare">Comparar</button></div>`;root.appendChild(box)
    }
  }
  function feature(title,desc,route,icon){return `<button class="v4-feature-card" data-v4-route="${route}"><span>${icon}</span><b>${esc(title)}</b><small>${esc(desc)}</small></button>`}
  function hubView(){return `${header('LIGA JUVENTINO','Super App V4','Funciones avanzadas inspiradas en experiencias profesionales de fútbol, adaptadas a la Liga Juventino.')}<div class="v4-feature-grid">${feature('Fantasy Challenge','Plantilla corta con reglas especiales.','v4-challenge','⚡')}${feature('Fantasy Draft','Selección por turnos sin jugadores duplicados.','v4-draft','🎯')}${feature('Transferencias Fantasy','Gestiona cambios manteniendo posiciones.','v4-transfers','⇄')}${feature('Ligas privadas','Crea códigos y únete a ligas locales.','v4-leagues','🏆')}${feature('Match Center','Resumen, alineaciones, estadísticas y cronología.','v4-matchcenter','◉')}${feature('Calendario','Vista mensual y jornadas por fecha.','v4-calendar','▦')}${feature('Comparador','Jugador vs jugador.','v4-compare','VS')}${feature('Disciplina','Ranking y seguimiento de tarjetas.','v4-discipline','!')}${feature('Reglamento','Reglas, desempates y elegibilidad.','v4-rules','§')}${feature('Centro de alertas','Bandeja local con leído/no leído.','v4-notifications','🔔')}${feature('Quiz avanzado','Preguntas, marcador y racha.','v4-quiz','?')}${feature('Más o Menos Pro','Rondas consecutivas y puntuación.','v4-moreless','↕')}</div>`}

  function challengeView(){const picks=v4.challengePicks.map(player),budget=35-picks.reduce((s,p)=>s+p.cost,0);return `${header('FANTASY','Challenge','Elige 5 jugadores con máximo 35.0 de presupuesto. Máximo 2 jugadores del mismo club.')}<div class="card v4-summary">${stat(`${picks.length}/5`,'Jugadores')}${stat(budget.toFixed(1),'Presupuesto')}${stat(picks.reduce((s,p)=>s+p.points,0),'Puntos')}</div><div class="v4-chipline">${picks.length?picks.map(p=>`<button class="v4-pick-chip" data-v4-remove-challenge="${p.id}">${crest(p.team)} ${esc(p.name)} ×</button>`).join(''):'<span class="muted">Todavía no has elegido jugadores.</span>'}</div>${section('Jugadores disponibles',`<div class="player-list">${players.map(p=>`<button class="player-row" data-v4-add-challenge="${p.id}" ${v4.challengePicks.includes(p.id)?'disabled':''}><span>${crest(p.team)}<b>${esc(p.name)}</b><small>${p.position} · ${p.cost.toFixed(1)} · ${p.points} pts</small></span><span>+</span></button>`).join('')}</div>`)}<button class="btn primary full" data-v4-action="save-challenge">Guardar Challenge</button>`}
  function canAddChallenge(p){if(v4.challengePicks.length>=5)return'El Challenge ya tiene 5 jugadores';const chosen=v4.challengePicks.map(player);if(chosen.reduce((s,x)=>s+x.cost,0)+p.cost>35)return'Supera el presupuesto de 35.0';if(chosen.filter(x=>x.team===p.team).length>=2)return'Máximo 2 jugadores del mismo equipo';return null}
  function miniPlayer(p){return `<div class="v4-mini-player">${crest(p.team)}<span><b>${esc(p.name)}</b><small>${p.position}</small></span></div>`}
  function draftView(){const d=v4.draft,pool=players.filter(p=>![...d.picks.A,...d.picks.B].includes(p.id)),side=d.turn%2===0?'A':'B';return `${header('FANTASY','Draft Liga Juventino',d.complete?'Draft finalizado':'Turnos locales de demostración. Cada jugador solo puede elegirse una vez.')}<div class="card v4-summary">${stat(`R${d.round}`,'Ronda')}${stat(side==='A'?'Equipo Azul':'Equipo Cyan','Turno')}${stat(pool.length,'Disponibles')}</div><div class="v4-draft-columns"><div><h3>Equipo Azul</h3>${d.picks.A.map(id=>miniPlayer(player(id))).join('')||'<small class="muted">Sin picks</small>'}</div><div><h3>Equipo Cyan</h3>${d.picks.B.map(id=>miniPlayer(player(id))).join('')||'<small class="muted">Sin picks</small>'}</div></div>${!d.complete?section('Pool del Draft',`<div class="player-list">${pool.map(p=>`<button class="player-row" data-v4-draft-pick="${p.id}"><span>${crest(p.team)}<b>${esc(p.name)}</b><small>${p.position} · ${p.points} pts</small></span><span>Elegir</span></button>`).join('')}</div>`):''}<button class="btn outline full" data-v4-action="reset-draft">Reiniciar Draft</button>`}

  function transfersView(){const data=base(),picked=data.fantasyPicks||{},current=Object.entries(picked).map(([slot,x])=>({slot,p:player(x.playerId)}));return `${header('FANTASY','Transferencias','Cambia jugadores de tu 7 Ideal manteniendo la posición del puesto.')} ${current.length?`<div class="v4-transfer-list">${current.map(({slot,p})=>`<div class="v4-transfer-row">${crest(p.team)}<span><b>${esc(p.name)}</b><small>${p.position} · Slot ${Number(slot)+1}</small></span><button class="mini-btn" data-v4-transfer-out="${slot}">Cambiar</button></div>`).join('')}</div>`:'<div class="empty-mini">Primero crea tu 7 Ideal en Fantasy.</div>'}<div id="v4TransferMarket"></div>`}
  function transferMarket(slot){const data=base(),picked=data.fantasyPicks||{},current=player(picked[slot]?.playerId);if(!current)return;const market=players.filter(p=>p.position===current.position&&p.id!==current.id&&!Object.values(picked).some(x=>x.playerId===p.id));const mount=$('#v4TransferMarket');if(!mount)return;mount.innerHTML=section(`Reemplazar ${current.name}`,`<div class="player-list">${market.map(p=>`<button class="player-row" data-v4-transfer-in="${p.id}" data-slot="${slot}"><span>${crest(p.team)}<b>${esc(p.name)}</b><small>${p.position} · ${p.cost.toFixed(1)} · ${p.points} pts</small></span><span>⇄</span></button>`).join('')}</div>`);bind()}

  function leaguesView(){return `${header('FANTASY','Ligas privadas','Crea una liga local o únete con un código. Se guarda en este dispositivo hasta conectar cuentas reales.')}<div class="button-row"><button class="btn primary" data-v4-action="create-league">Crear liga</button><button class="btn outline" data-v4-action="join-league">Unirme con código</button></div>${section('Mis ligas',v4.leagues.length||v4.joinedLeagues.length?`<div class="v4-league-list">${[...v4.leagues,...v4.joinedLeagues].map(l=>`<div class="card v4-league"><span><b>${esc(l.name)}</b><small>Código ${esc(l.code)}</small></span><b>${l.members||1} miembros</b></div>`).join('')}</div>`:'<div class="empty-mini">Aún no tienes ligas privadas.</div>')}${section('Clasificación demo',`<div class="stat-card"><div class="rank-row"><b>1</b>${crest('JUV')}<span>Aficionado Municipal</span><b>126</b></div><div class="rank-row"><b>2</b>${crest('POZ')}<span>Equipo Los Amigos</span><b>119</b></div><div class="rank-row"><b>3</b>${crest('RIN')}<span>Centeno FC</span><b>108</b></div></div>`)}`}

  function matchCenterView(){const tabs=['Resumen','Alineaciones','Estadísticas','Cronología'],tab=v4.matchTab;return `${header('PARTIDO EN VIVO','Match Center','Juventino vs Pozos · Jornada 5')}<div class="card v4-score"><div>${crest('JUV')}<b>Juventino</b></div><strong>1–0<small>63'</small></strong><div>${crest('POZ')}<b>Pozos</b></div></div><div class="tabs">${tabs.map(t=>`<button class="tab ${tab===t?'active':''}" data-v4-match-tab="${t}">${t}</button>`).join('')}</div>${matchBody(tab)}`}
  function barStat(label,a,b,suffix){return `<div class="v4-bar-stat"><b>${a}${suffix}</b><span><small>${label}</small><i><em style="width:${a/(a+b)*100}%"></em></i></span><b>${b}${suffix}</b></div>`}
  function matchBody(tab){if(tab==='Alineaciones')return section('Formaciones',`<div class="v4-lineups"><div><h3>Juventino · 4-3-3</h3>${['Jorge Medina','Luis Gómez','Edgar Ruiz','Juan Pérez','Miguel Torres'].map((n,i)=>`<div><b>${i+1}</b><span>${esc(n)}</span></div>`).join('')}</div><div><h3>Pozos · 4-4-2</h3>${['Mario Nieto','Iván Sánchez','Sergio Luna','Carlos Ramírez','Ángel Cruz'].map((n,i)=>`<div><b>${i+1}</b><span>${esc(n)}</span></div>`).join('')}</div></div>`);if(tab==='Estadísticas')return section('Estadísticas del partido',`<div class="v4-match-stats">${barStat('Posesión',54,46,'%')}${barStat('Tiros',9,7,'')}${barStat('A puerta',4,3,'')}${barStat('Corners',5,2,'')}${barStat('Faltas',8,11,'')}</div><p class="muted tiny">Datos de demostración hasta conectar el proveedor oficial de estadísticas.</p>`);if(tab==='Cronología')return section('Cronología',`<div class="v4-timeline"><div><b>63'</b><span>Partido en juego</span></div><div><b>48'</b><span>Cambio · Pozos</span></div><div><b>34'</b><span>Amarilla · Luis Gómez</span></div><div><b>12'</b><span>⚽ Gol · Juan Pérez</span></div><div><b>1'</b><span>Inicio del partido</span></div></div>`);return `<div class="card v4-summary">${stat('1–0','Marcador')}${stat('63′','Minuto')}${stat('Campo Municipal','Sede')}</div>${section('Figura del partido',miniPlayer(player('p1')))}${section('Acciones rápidas','<div class="v4-action-grid"><button data-v4-route="v4-predictor-history">Quiniela</button><button data-v4-route="v4-compare">Comparar jugadores</button><button data-v4-route="v4-notifications">Alertas</button><button data-v4-route="v4-discipline">Disciplina</button></div>')}`}

  function dateMatches(date){
    const games=schedule.filter(x=>x.date===date);
    return '<section class="section v70-calendar-matches"><div class="section-head"><h2><span class="v70-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3.5v4M17 3.5v4M3.5 9.5h17"/></svg></span>Partidos · '+esc(date)+'</h2></div>'+
      (games.length?'<div class="card match-card v70-match-card">'+games.map(m=>'<div class="v70-match-row"><span class="v70-club home">'+calendarTeamIcon(m.home)+'<b>'+esc(team(m.home).name)+'</b></span><strong class="v70-score">'+esc(m.score||m.time)+'</strong><span class="v70-club away">'+calendarTeamIcon(m.away)+'<b>'+esc(team(m.away).name)+'</b></span></div>').join('')+'</div>':'<div class="empty-mini">No hay partidos programados para esta fecha.</div>')+
    '</section>';
  }
  function calendarView(){
    const y=v4.calendarYear,m=v4.calendarMonth,first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),offset=(first.getDay()+6)%7,names=['L','M','X','J','V','S','D'];
    let cells=Array(offset).fill('<span class="v4-day empty"></span>');
    for(let d=1;d<=days;d++){
      const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,games=schedule.filter(x=>x.date===iso);
      cells.push(`<button class="v4-day ${games.length?'has-match':''}" data-v4-date="${iso}"><b>${d}</b>${games.length?`<i>${games.length}</i>`:''}</button>`);
    }
    return '<section class="v70-calendar-page">'+
      '<div class="v70-calendar-title"><span class="v70-calendar-kicker"><span class="v70-calendar-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3.5v4M17 3.5v4M3.5 9.5h17"/></svg></span>CALENDARIO</span><h1>Octubre 2026</h1><p>Consulta jornadas y partidos por fecha.</p></div>'+
      '<div class="v4-week">'+names.map(n=>'<b>'+n+'</b>').join('')+'</div>'+
      '<div class="v4-calendar">'+cells.join('')+'</div>'+
      '<div id="v4DateMatches">'+dateMatches('2026-10-13')+'</div>'+
    '</section>';
  }

  function compareMetric(label,a,b){return `<div><b class="${a>b?'winner':''}">${a}</b><span>${esc(label)}</span><b class="${b>a?'winner':''}">${b}</b></div>`}
  function compareView(){const c=v4.comparison,opts=players.map(p=>`<option value="${p.id}">${esc(p.name)} · ${p.team}</option>`).join(''),a=player(c.left),b=player(c.right);return `${header('DATOS','Comparador','Compara estadísticas de dos jugadores.')}<div class="v4-select-row"><select id="v4CompareLeft">${opts}</select><b>VS</b><select id="v4CompareRight">${opts}</select></div><div class="v4-compare-cards"><div>${crest(a.team)}<h2>${esc(a.name)}</h2></div><div>${crest(b.team)}<h2>${esc(b.name)}</h2></div></div><div class="v4-compare-table">${compareMetric('Goles',a.goals,b.goals)}${compareMetric('Asistencias',a.assists,b.assists)}${compareMetric('Minutos',a.minutes,b.minutes)}${compareMetric('Tarjetas',a.cards,b.cards)}${compareMetric('Fantasy pts',a.points,b.points)}</div>`}
  function disciplineView(){const ranked=players.slice().sort((a,b)=>b.cards-a.cards);return `${header('COMPETICIÓN','Disciplina','Seguimiento informativo de tarjetas. No aplica sanciones automáticas.')}<div class="stat-card">${ranked.map((p,i)=>`<div class="rank-row"><b>${i+1}</b>${crest(p.team)}<span><b>${esc(p.name)}</b><small>${p.position} · ${team(p.team).name}</small></span><b>${p.cards}</b></div>`).join('')}</div>${section('Estado disciplinario','<div class="card v4-note">Las sanciones oficiales deben cargarse desde la administración de Liga Juventino. Esta pantalla solo resume tarjetas registradas.</div>')}`}
  function rule(title,body){return `<details><summary>${esc(title)}</summary><p>${esc(body)}</p></details>`}
  function rulesView(){return `${header('INFORMACIÓN','Reglamento','Contenido preparado para reemplazarse por el reglamento oficial de la liga.')}<div class="v4-accordion">${rule('Competencia','Formato por jornadas, clasificación y fase final según la temporada configurada.')}${rule('Puntuación','Victoria, empate y derrota deben seguir las reglas oficiales de Liga Juventino.')}${rule('Desempates','Los criterios de desempate se mostrarán exactamente como los publique la organización.')}${rule('Disciplina','Tarjetas, suspensiones y elegibilidad se administran con datos oficiales.')}${rule('Jugadores','Altas, bajas y elegibilidad deben validarse por la administración.')}</div>`}

  function notificationsView(){const unread=v4.notificationInbox.filter(x=>!x.read).length;return `${header('CENTRO DE ALERTAS','Notificaciones',`${unread} sin leer`)}<div class="button-row"><button class="btn outline" data-v4-action="read-all">Marcar todo leído</button><button class="btn outline" data-v4-action="clear-inbox">Vaciar bandeja</button></div><div class="v4-inbox">${v4.notificationInbox.length?v4.notificationInbox.map(n=>`<button class="v4-notification ${n.read?'read':''}" data-v4-notification="${n.id}"><i></i><span><small>${esc(n.time)}</small><b>${esc(n.title)}</b><p>${esc(n.body)}</p></span></button>`).join(''):'<div class="empty-mini">No tienes notificaciones.</div>'}</div>`}

  const quizQuestions=[{q:'¿Qué equipo lidera la tabla demo?',a:['Juventino','Pozos','Cuenda','Morales'],c:0},{q:'¿Quién es el máximo goleador demo?',a:['Carlos Ramírez','Juan Pérez','Miguel Torres','Ángel Cruz'],c:1},{q:'¿Cuántos puntos tiene Juventino?',a:['9','11','13','15'],c:2},{q:'¿Qué posición juega Jorge Medina?',a:['POR','DEF','MED','DEL'],c:0}];
  function quizView(){const q=quizQuestions[v4.quiz.index%quizQuestions.length];return `${header('JUEGO','Quiz Arena Pro',`Puntos ${v4.quiz.score} · Racha ${v4.quiz.streak}`)}<div class="quiz-card"><p>${esc(q.q)}</p>${q.a.map((x,i)=>`<button class="quiz-option ${v4.quiz.answered?(i===q.c?'correct':(v4.quiz.last===i?'wrong':'')):''}" data-v4-quiz-answer="${i}" ${v4.quiz.answered?'disabled':''}>${esc(x)}</button>`).join('')}${v4.quiz.answered?'<button class="btn primary full" data-v4-action="next-quiz">Siguiente pregunta</button>':''}</div>`}
  const mlRounds=[['p1','p2','goals','¿Quién tiene más goles?'],['p3','p11','assists','¿Quién tiene más asistencias?'],['p6','p7','minutes','¿Quién tiene más minutos?'],['p5','p10','cards','¿Quién tiene más tarjetas?']];
  function moreLessView(){const r=mlRounds[v4.moreLess.index%mlRounds.length],a=player(r[0]),b=player(r[1]);return `${header('JUEGO','Más o Menos Pro',`Puntos ${v4.moreLess.score} · Racha ${v4.moreLess.streak}`)}<p class="muted">${esc(r[3])}</p><div class="compare-two"><button data-v4-moreless="${a.id}"><div class="avatar-ball">${a.number}</div><b>${esc(a.name)}</b><small>${team(a.team).name}</small></button><span>VS</span><button data-v4-moreless="${b.id}"><div class="avatar-ball">${b.number}</div><b>${esc(b.name)}</b><small>${team(b.team).name}</small></button></div>`}

  function predictorHistoryView(){const preds=base().predictions||{};let pts=0;const rows=Object.entries(preds).map(([id,p])=>{const m=schedule.find(x=>x.id===id);if(!m)return'';let earned='Pendiente';if(m.status==='FINISHED'&&m.score){const [h,a]=m.score.split('–').map(Number);if(p.home===h&&p.away===a){earned=3;pts+=3}else if(Math.sign(p.home-p.away)===Math.sign(h-a)){earned=1;pts+=1}else earned=0}return `<div class="v4-pred-row">${crest(m.home)}<span><b>${team(m.home).name} ${p.home}–${p.away} ${team(m.away).name}</b><small>Resultado real: ${m.score||'pendiente'}</small></span><b>${earned}</b></div>`}).join('');return `${header('QUINIELA','Mis pronósticos',`Puntos calculados: ${pts}`)}${rows?`<div class="card v4-pred-list">${rows}</div>`:'<div class="empty-mini">Todavía no has guardado pronósticos.</div>'}${section('Reglas','<div class="card v4-note">Demo: 3 puntos por marcador exacto, 1 por resultado correcto. Estas reglas podrán configurarse desde administración.</div>')}`}
  function settingsView(){const s=v4.settings;return `${header('AJUSTES','Experiencia y accesibilidad','Estas opciones funcionan localmente.')}<div class="settings-card"><label class="setting-row"><span><b>Reducir movimiento</b><small>Desactiva animaciones decorativas</small></span><input type="checkbox" data-v4-setting="reducedMotion" ${s.reducedMotion?'checked':''}><i></i></label><label class="setting-row"><span><b>Texto grande</b><small>Aumenta la escala de lectura</small></span><input type="checkbox" data-v4-setting="largeText" ${s.largeText?'checked':''}><i></i></label><label class="setting-row"><span><b>Modo compacto</b><small>Reduce espacios entre tarjetas</small></span><input type="checkbox" data-v4-setting="compactMode" ${s.compactMode?'checked':''}><i></i></label></div>${section('Almacenamiento','<button class="btn outline full" data-v4-action="export-data">Exportar mis datos locales</button><button class="btn outline full v4-mt" data-v4-action="reset-v4">Restablecer funciones V4</button>')}`}

  const views={'v4-hub':hubView,'v4-challenge':challengeView,'v4-draft':draftView,'v4-transfers':transfersView,'v4-leagues':leaguesView,'v4-matchcenter':matchCenterView,'v4-calendar':calendarView,'v4-compare':compareView,'v4-discipline':disciplineView,'v4-rules':rulesView,'v4-notifications':notificationsView,'v4-quiz':quizView,'v4-moreless':moreLessView,'v4-predictor-history':predictorHistoryView,'v4-settings':settingsView};
  function renderIfV4(){
    const route=routeName();
    document.body.classList.toggle('v70-calendar-active',route==='v4-calendar');
    if(!views[route]){
      setTimeout(injectEntryPoints,0);
      applySettings();
      return;
    }
    const root=screen();if(!root)return;
    root.innerHTML=views[route]();
    backButton()?.classList.remove('is-hidden');
    $$('[data-route]').forEach(n=>n.classList.remove('active'));
    bind();
    applySettings();
    if(route==='v4-calendar')requestAnimationFrame(()=>window.LJR_TEAM_LOGOS?.refresh?.());
    window.scrollTo(0,0);
  }
  function applySettings(){document.documentElement.classList.toggle('v4-reduced-motion',!!v4.settings.reducedMotion);document.documentElement.classList.toggle('v4-large-text',!!v4.settings.largeText);document.documentElement.classList.toggle('v4-compact',!!v4.settings.compactMode)}
  function bind(){
    $$('[data-v4-route]').forEach(el=>el.onclick=e=>{e.preventDefault();go(el.dataset.v4Route)});
    $$('[data-v4-add-challenge]').forEach(el=>el.onclick=()=>{const p=player(el.dataset.v4AddChallenge),err=canAddChallenge(p);if(err)return toast(err);v4.challengePicks=[...v4.challengePicks,p.id];save();renderIfV4()});
    $$('[data-v4-remove-challenge]').forEach(el=>el.onclick=()=>{v4.challengePicks=v4.challengePicks.filter(id=>id!==el.dataset.v4RemoveChallenge);save();renderIfV4()});
    $$('[data-v4-draft-pick]').forEach(el=>el.onclick=()=>{const d=v4.draft,side=d.turn%2===0?'A':'B',id=el.dataset.v4DraftPick;if([...d.picks.A,...d.picks.B].includes(id))return;d.picks[side].push(id);d.turn++;if(d.turn%2===0)d.round++;if(d.turn>=10)d.complete=true;save();renderIfV4()});
    $$('[data-v4-transfer-out]').forEach(el=>el.onclick=()=>transferMarket(el.dataset.v4TransferOut));
    $$('[data-v4-transfer-in]').forEach(el=>el.onclick=()=>{const slot=el.dataset.slot,id=el.dataset.v4TransferIn,data=base();data.fantasyPicks=data.fantasyPicks||{};data.fantasyPicks[slot]={playerId:id};writeJson(STORE_KEY,data);toast('Transferencia guardada');renderIfV4()});
    $$('[data-v4-match-tab]').forEach(el=>el.onclick=()=>{v4.matchTab=el.dataset.v4MatchTab;save();renderIfV4()});
    $$('[data-v4-date]').forEach(el=>el.onclick=()=>{const mount=$('#v4DateMatches');if(mount){mount.innerHTML=dateMatches(el.dataset.v4Date);bind()}});
    const l=$('#v4CompareLeft'),r=$('#v4CompareRight');if(l){l.value=v4.comparison.left;l.onchange=()=>{v4.comparison.left=l.value;save();renderIfV4()}}if(r){r.value=v4.comparison.right;r.onchange=()=>{v4.comparison.right=r.value;save();renderIfV4()}}
    $$('[data-v4-notification]').forEach(el=>el.onclick=()=>{const n=v4.notificationInbox.find(x=>x.id===el.dataset.v4Notification);if(n)n.read=true;save();renderIfV4()});
    $$('[data-v4-quiz-answer]').forEach(el=>el.onclick=()=>{if(v4.quiz.answered)return;const q=quizQuestions[v4.quiz.index%quizQuestions.length],ans=Number(el.dataset.v4QuizAnswer),ok=ans===q.c;v4.quiz.answered=true;v4.quiz.last=ans;v4.quiz.score+=ok?10:0;v4.quiz.streak=ok?v4.quiz.streak+1:0;save();renderIfV4()});
    $$('[data-v4-moreless]').forEach(el=>el.onclick=()=>{const round=mlRounds[v4.moreLess.index%mlRounds.length],a=player(round[0]),b=player(round[1]),metric=round[2],chosen=player(el.dataset.v4Moreless),winner=a[metric]>=b[metric]?a:b,ok=chosen.id===winner.id;v4.moreLess.score+=ok?10:0;v4.moreLess.streak=ok?v4.moreLess.streak+1:0;v4.moreLess.index++;save();toast(ok?'¡Correcto! +10':'No esta vez');renderIfV4()});
    $$('[data-v4-setting]').forEach(el=>el.onchange=()=>{v4.settings[el.dataset.v4Setting]=el.checked;save();applySettings();toast('Ajuste guardado')});
    $$('[data-v4-action]').forEach(el=>el.onclick=()=>doAction(el.dataset.v4Action));
  }
  function doAction(a){
    if(a==='save-challenge')toast(v4.challengePicks.length===5?'Challenge guardado':'Completa 5 jugadores antes de cerrar el Challenge');
    if(a==='reset-draft'){v4.draft=JSON.parse(JSON.stringify(defaults.draft));save();renderIfV4()}
    if(a==='create-league'){const code='LJ-'+Math.random().toString(36).slice(2,6).toUpperCase();v4.leagues.push({name:`Mi Liga ${v4.leagues.length+1}`,code,members:1});save();toast(`Liga creada: ${code}`);renderIfV4()}
    if(a==='join-league'){const code=prompt('Código de la liga (ej. LJ-AB12)');if(!code)return;v4.joinedLeagues.push({name:'Liga invitada',code:code.toUpperCase(),members:4});save();toast('Te uniste a la liga');renderIfV4()}
    if(a==='read-all'){v4.notificationInbox.forEach(n=>n.read=true);save();renderIfV4()}
    if(a==='clear-inbox'){v4.notificationInbox=[];save();renderIfV4()}
    if(a==='next-quiz'){v4.quiz.index=(v4.quiz.index+1)%quizQuestions.length;v4.quiz.answered=false;v4.quiz.last=null;save();renderIfV4()}
    if(a==='export-data'){const payload={v3:base(),v4};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='liga-juventino-datos.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
    if(a==='reset-v4'&&confirm('¿Restablecer solo las funciones V4?')){v4=JSON.parse(JSON.stringify(defaults));save();renderIfV4()}
  }
  document.addEventListener('click',e=>{const target=e.target.closest('[data-v4-route]');if(target){e.preventDefault();e.stopImmediatePropagation();go(target.dataset.v4Route);return}if(e.target.closest('#backButton')&&isV4()){e.preventDefault();e.stopImmediatePropagation();location.hash='#/more';setTimeout(injectEntryPoints,10)}},true);
  window.addEventListener('hashchange',()=>setTimeout(renderIfV4,0));
  const observer=new MutationObserver(()=>{if(!isV4())injectEntryPoints()});observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>{injectEntryPoints();renderIfV4();applySettings()},80);
})();
