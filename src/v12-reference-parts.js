const V12_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
const V12_TEAM_ASSET_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const V12_TEAMS=[
  {name:'Club América Veteranos JR',logo:'assets/branding/america-veteranos-35-user.png',p:1,gd:8,pts:3,form:['w','w','w'],last:'V'},
  {name:'Lobos CDG',logo:'assets/official-logos/lobos-cdg.png',p:1,gd:5,pts:3,form:['w','w','n'],last:'V'},
  {name:'La Huerta de Cuenda',logo:'assets/official-logos/la-huerta.png',p:1,gd:4,pts:3,form:['w','w','n'],last:'V'},
  {name:'Atlético Galeana',logo:'assets/official-logos/galeana.png',p:1,gd:2,pts:3,form:['w','n','w'],last:'V'},
  {name:'Promesas FC Pozos',logo:'assets/official-logos/promesas-fc.png',p:1,gd:0,pts:1,form:['n','w','n'],last:'E'},
  {name:'San Antonio J.R.',logo:'assets/teams/san-antonio-jr.webp',p:1,gd:-2,pts:0,form:['l','l','n'],last:'D'},
  {name:'Franco FC',logo:'assets/official-logos/franco-fc.png',p:1,gd:-4,pts:0,form:['l','n','l'],last:'D'},
  {name:'Juventino Rosas',logo:null,p:1,gd:-8,pts:0,form:['l','l','l'],last:'D'}
];

function v12Route(){return location.hash.replace('#/','')||'home'}
function v12Logo(src,alt,cls=''){return '<img class="'+cls+'" src="'+src+'" alt="'+alt+'" loading="eager" decoding="async">'}
function v12TeamLogo(t){return v12Logo(t.logo?V12_TEAM_ASSET_BASE+t.logo:V12_LOGO,t.name,'v12-team-logo')}
function v12Form(t){return '<div class="v12-form">'+t.form.map(s=>'<i class="'+s+'"></i>').join('')+'<b class="'+t.last.toLowerCase()+'">'+t.last+'</b></div>'}
function v12Rows(mode='compact'){
  if(mode==='criteria'){
    const criteriaTeams=[
      {name:'La Huerta',logo:'assets/official-logos/la-huerta.png',stats:[3,5,6,0,1,0,0],mark:2},
      {name:'Promesas FC',logo:'assets/official-logos/promesas-fc.png',stats:[3,5,5,0,1,0,0],mark:2},
      {name:'Franco FC',logo:'assets/official-logos/franco-fc.png',stats:[3,4,5,0,1,0,0],mark:2},
      {name:'Atlético Galeana',logo:'assets/official-logos/galeana.png',stats:[3,4,4,0,1,0,0],mark:2},
      {name:'Lobos CDG',logo:'assets/official-logos/lobos-cdg.png',stats:[3,3,4,0,1,0,0],mark:1},
      {name:'Juventino',logo:null,stats:[3,2,3,0,1,0,0],mark:-1},
      {name:'Cuenda',logo:'assets/official-logos/toros-de-cuenda.png',stats:[3,2,3,0,1,0,0],mark:-1},
      {name:'Pozos',logo:'assets/teams/veteranos-pozos-fc.webp',stats:[3,2,2,2,1,1,0],mark:2}
    ];
    const head=['PTOS','+/-','GF','GA','V','VA','P'];
    const rows=criteriaTeams.map((t,i)=>{
      const logo=t.logo?V12_TEAM_ASSET_BASE+t.logo:V12_LOGO;
      return '<div class="v12-criteria-row">'+
        '<span class="v12-criteria-rank">'+(i+1)+'</span>'+
        '<span class="v12-criteria-team">'+v12Logo(logo,t.name,'v12-criteria-logo')+'<strong>'+t.name+'</strong></span>'+
        t.stats.map((n,idx)=>'<span class="v12-criteria-stat '+(idx===t.mark?'mark':'')+'">'+n+'</span>').join('')+
      '</div>';
    }).join('');
    return '<div class="v12-table-shell v12-criteria-shell">'+
      '<div class="v12-table-scroll v12-criteria-scroll">'+
        '<div class="v12-table-inner v12-criteria-table">'+
          '<div class="v12-criteria-head"><span></span><span></span>'+head.map(h=>'<b>'+h+'</b>').join('')+'</div>'+
          '<div class="v12-criteria-direct">DIRECTOS A OCTAVOS</div>'+
          '<div class="v12-criteria-line"></div>'+
          rows+
        '</div>'+
      '</div>'+
      '<span class="v12-table-edge v12-criteria-edge" aria-hidden="true"></span>'+
    '</div>';
  }
  if(mode==='complete'){
    const rows=V12_TEAMS.map((t,i)=>{
      const v=t.form.filter(x=>x==='w').length;
      const e=t.form.filter(x=>x==='n').length;
      const d=t.form.filter(x=>x==='l').length;
      return '<div class="v12-complete-row">'+
        '<span class="v12-rank">'+(i+1)+'</span>'+
        '<span class="v12-team-cell">'+v12TeamLogo(t)+'<strong>'+t.name+'</strong></span>'+
        '<span>'+t.p+'</span><span>'+v+'</span><span>'+e+'</span><span>'+d+'</span><b>'+t.pts+'</b>'+
      '</div>';
    }).join('');
    return '<div class="v12-table-shell v12-complete-shell">'+
      '<div class="v12-table-scroll">'+
        '<div class="v12-table-inner v12-table-inner-complete">'+
          '<div class="v12-complete-head"><span></span><span></span><b>P</b><b>V</b><b>E</b><b>D</b><b>+PTOS</b></div>'+
          '<div class="v12-direct-label">DIRECTOS A OCTAVOS</div>'+
          '<div class="v12-direct-line"></div>'+
          '<div class="v12-complete-list">'+rows+'</div>'+
        '</div>'+
      '</div>'+
      '<span class="v12-table-edge" aria-hidden="true"></span>'+
    '</div>';
  }
  return '<div class="v12-table-shell v12-compact-shell">'+
    '<div class="v12-table-scroll">'+
      '<div class="v12-table-inner v12-table-inner-compact">'+
        '<div class="v12-stand-head"><span></span><b>P</b><b>+/-</b><b>PTOS</b><b>FORMA</b></div>'+
        '<div class="v12-direct-label">DIRECTOS A OCTAVOS</div>'+
        '<div class="v12-direct-line"></div>'+
        '<div class="v12-stand-list">'+V12_TEAMS.map((t,i)=>'<div class="v12-stand-row"><span class="v12-rank">'+(i+1)+'</span><span class="v12-team-cell">'+v12TeamLogo(t)+'<strong>'+t.name+'</strong></span><span>'+t.p+'</span><span>'+t.gd+'</span><span>'+t.pts+'</span>'+v12Form(t)+'</div>').join('')+'</div>'+
      '</div>'+
    '</div>'+
    '<span class="v12-table-edge" aria-hidden="true"></span>'+
  '</div>';
}
function v12StandingsBody(){
  return '<section class="v12-standings-reference" data-v12-standings>'+
    '<div class="v12-segmented">'+
      '<button class="active" data-v12-mode="compact">Compacta</button>'+
      '<button data-v12-mode="complete">Completa</button>'+
      '<button data-v12-mode="criteria">Criterios de<br>desempate</button>'+
    '</div>'+
    '<div class="v12-stand-content" data-v12-stand-content>'+v12Rows('compact')+'</div>'+
  '</section>';
}
function patchStandings(){
  if(v12Route()!=='competition') return;
  const screen=document.querySelector('#screen');
  const tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs) return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Clasificaci/i.test(active.textContent||'')) return;

  const existing=screen.querySelector('[data-v12-standings]');
  if(existing){
    const contaminated=
      existing.classList.contains('v13-standings-reference') ||
      existing.hasAttribute('data-v13-standings') ||
      !!existing.querySelector('[data-v13-mode],.v13-stand-content,.v13-compact-table,.v13-complete-table,.v13-criteria-wrap');

    if(!contaminated) return;

    /* Hard takeover: restore the V12 table even if an older cached V13 script is still loaded. */
    existing.classList.remove('v13-standings-reference');
    existing.removeAttribute('data-v13-standings');
    existing.dataset.v13Ready='1';
    existing.innerHTML=
      '<div class="v12-segmented">'+
        '<button class="active" data-v12-mode="compact">Compacta</button>'+
        '<button data-v12-mode="complete">Completa</button>'+
        '<button data-v12-mode="criteria">Criterios de<br>desempate</button>'+
      '</div>'+
      '<div class="v12-stand-content" data-v12-stand-content>'+v12Rows('compact')+'</div>';
    return;
  }

  let node=tabs.nextSibling;
  while(node){const next=node.nextSibling;node.remove();node=next}
  tabs.insertAdjacentHTML('afterend',v12StandingsBody());
}

function v12ProfileIcon(type){
  const icons={
    following:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24Zm-10 6.16-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4Z" fill="currentColor"/></svg>',
    notifications:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m19.29 17.29-1.29-1.29v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29C4.08 17.92 4.52 19 5.41 19h13.17c.9 0 1.34-1.08.71-1.71ZM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6Zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2Z" fill="currentColor"/></svg>',
    language:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.6 12h16.8M12 3c2.35 2.45 3.55 5.45 3.55 9S14.35 18.55 12 21M12 3C9.65 5.45 8.45 8.45 8.45 12S9.65 18.55 12 21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    feedback:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.8 4.8h14.4v10.8H5.853L4.8 16.653V4.8ZM4.8 3C3.81 3 3.009 3.81 3.009 4.8L3 21l3.6-3.6h12.6c.99 0 1.8-.81 1.8-1.8V4.8C21 3.81 20.19 3 19.2 3H4.8Zm1.8 9h7.2v1.8H6.6V12Zm0-2.7h10.8v1.8H6.6V9.3Zm0-2.7h10.8v1.8H6.6V6.6Z" fill="currentColor"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.705 6.705a.997.997 0 0 0-1.41 0 .997.997 0 0 0-.001 1.41L13.17 12l-3.876 3.885a.997.997 0 1 0 1.411 1.41l4.588-4.588a1 1 0 0 0 0-1.414l-4.588-4.588Z" fill="currentColor"/></svg>'
  };
  return icons[type]||'';
}
function profileMenuRow(icon,label,route,action,chevron=false){
  const attr=route?'data-v12-route="'+route+'"':'data-v12-action="'+action+'"';
  return '<button class="v12-profile-row" '+attr+'>'+
    '<span class="v12-profile-row-icon">'+(icon?v12ProfileIcon(icon):'')+'</span>'+
    '<span class="v12-profile-row-label">'+label+'</span>'+
    '<span class="v12-profile-row-chevron">'+(chevron?v12ProfileIcon('chevron'):'')+'</span>'+
  '</button>';
}
function patchProfile(){
  if(v12Route()!=='profile') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  const existing=screen.querySelector('[data-v12-profile]');
  if(existing?.dataset.profileRef==='parts36') return;
  screen.innerHTML='<section class="v12-profile-page" data-v12-profile data-profile-ref="parts36">'+
    '<div class="v12-profile-card">'+
      '<div class="v12-profile-copy"><h1>Más de la Liga</h1><p>Crea tu cuenta y disfruta de un acceso inigualable a resultados, estadísticas, calendarios, equipos de la liga y mucho más.</p></div>'+
      '<div class="v12-profile-actions"><button class="outline" data-v12-action="login">Iniciar sesión</button><button class="solid" data-v12-action="create">Crear una cuenta</button></div>'+
    '</div>'+
    '<div class="v12-profile-menu">'+
      profileMenuRow('following','Siguiendo','following',null,true)+
      profileMenuRow('notifications','Notificaciones','notifications',null,true)+
      profileMenuRow('language','Tu idioma preferido',null,'language',false)+
      profileMenuRow('feedback','Ayúdanos a mejorar',null,'feedback',false)+
      profileMenuRow(null,'Ajustes de privacidad',null,'privacy',true)+
    '</div>'+
  '</section>';
}
function avatarSvg(color){
  return '<div class="v12-avatar" style="--av:'+color+'"><svg viewBox="0 0 96 96" aria-hidden="true"><path d="M30 35c0-14 8-22 18-22s18 8 18 22c0 11-4 19-9 24v8H39v-8c-5-5-9-13-9-24Z" fill="#d7d7d7"/><path d="M25 30c4-16 12-25 23-25 10 0 20 8 24 24l-7 2c-2-8-8-12-17-12-8 0-14 4-17 13Z" fill="#a9a9a9"/><path d="M38 57h20l14 9c6 4 10 10 11 18H13c1-8 5-14 11-18Z" fill="var(--av)"/></svg></div>'
}
function curveArrow(color,flip=false){
  return '<svg class="v12-curve-arrow '+(flip?'flip':'')+'" viewBox="0 0 100 150" aria-hidden="true"><path d="M25 130C55 90 60 55 45 20" fill="none" stroke="'+color+'" stroke-width="8" stroke-linecap="round"/><path d="M36 27 46 12l14 14" fill="none" stroke="'+color+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
}
function patchMoreLess(){
  if(v12Route()!=='moreLess') return;
  const screen=document.querySelector('#screen');
  if(!screen||screen.querySelector('[data-v12-moreless]')) return;
  screen.innerHTML='<section class="v12-moreless" data-v12-moreless>'+
    '<div class="v12-ml-title"><span>MÁS</span><small>O</small><span>MENOS</span></div>'+
    '<div class="v12-ml-curves"><div class="down">'+curveArrow('#ff003c',true)+'</div><div class="up">'+curveArrow('#18ef72',false)+'</div></div>'+
    '<div class="v12-ml-choice">'+
      '<button data-v12-choice="more" aria-label="Elegir más">'+avatarSvg('#c776e8')+'</button>'+
      '<div class="v12-ml-mid"><button data-v12-choice="more" class="up-arrow" aria-label="Más">▲</button><button data-v12-choice="less" class="down-arrow" aria-label="Menos">▼</button></div>'+
      '<button data-v12-choice="less" aria-label="Elegir menos">'+avatarSvg('#77f1ea')+'</button>'+
    '</div>'+
    v12Logo(V12_LOGO,'Liga Municipal de Fútbol Juventino Rosas','v12-ml-logo')+
    '<div class="v12-stadium" aria-hidden="true"><i></i><b></b></div>'+
  '</section>';
}
function v12Toast(text){
  let t=document.querySelector('.v12-toast');
  if(!t){t=document.createElement('div');t.className='v12-toast';document.body.appendChild(t)}
  t.textContent=text;t.classList.add('show');clearTimeout(v12Toast.t);v12Toast.t=setTimeout(()=>t.classList.remove('show'),1700)
}

const V12_FIXTURE_LOGOS={
  'Club América Vet.':'assets/branding/america-veteranos-35-user.png',
  'La Huerta':'assets/teams/la-huerta-cuenda.webp',
  'Promesas FC':'assets/teams/promesas-fc-pozos.webp',
  'Santa Cruz':'assets/teams/atletico-santa-cruz.webp',
  'Franco FC':'assets/teams/franco-fc.webp',
  'Cuenda':'assets/official-logos/toros-de-cuenda.png',
  'Atlético Galeana':'assets/teams/atletico-galeana.webp',
  'Lobos CDG':'assets/teams/lobos-cdg.webp',
  'Juventino':null,
  'Rincón de Centeno':null,
  'Deportivo Rosas':null,
  'Pozos':'assets/teams/pozos-fc.webp'
};
function v12FixtureLogo(name){
  const p=V12_FIXTURE_LOGOS[name];
  if(p) return '<img src="'+V12_TEAM_ASSET_BASE+p+'" alt="'+name+'" class="v12-fixture-logo" loading="eager" decoding="async">';
  if(name==='Juventino') return '<img src="'+V12_LOGO+'" alt="'+name+'" class="v12-fixture-logo" loading="eager" decoding="async">';
  const ab=name.split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return '<span class="v12-fixture-fallback">'+ab+'</span>';
}
const V12_DAY_13=[
  ['Club América Vet.','La Huerta','10:45','m1'],
  ['Promesas FC','Santa Cruz','10:45','m2'],
  ['Franco FC','Cuenda','13:00','m2'],
  ['Atlético Galeana','Lobos CDG','13:00','m1'],
  ['Juventino','Rincón de Centeno','13:00','m1'],
  ['Deportivo Rosas','Pozos','13:00','m2'],
  ['La Huerta','Franco FC','13:00','m2'],
  ['Promesas FC','Club América Vet.','13:00','m1'],
  ['Lobos CDG','Cuenda','13:00','m2']
];
const V12_DAY_14=[
  ['Deportivo Rosas','Pozos','10:45','m2'],
  ['Juventino','La Huerta','13:00','m1'],
  ['Franco FC','Promesas FC','13:00','m2']
];
function v12FixtureRow(m){
  return '<div class="v12-schedule-match">'+
    '<div class="v12-schedule-clubs">'+
      '<div>'+v12FixtureLogo(m[0])+'<b>'+m[0]+'</b></div>'+
      '<div>'+v12FixtureLogo(m[1])+'<b>'+m[1]+'</b></div>'+
    '</div>'+
    '<div class="v12-schedule-meta"><time>'+m[2]+'</time><button data-match="'+m[3]+'">Ver detalles</button></div>'+
  '</div>';
}
function v12ScheduleCard(list){
  return '<section class="v12-schedule-card"><h3>Liga local - Jornada 2</h3><div>'+list.map(v12FixtureRow).join('')+'</div></section>';
}
function v12FixturesMarkup(){
  return '<section class="v12-fixtures-reference" data-v12-fixtures>'+
    '<div class="v12-date-strip">'+
      '<button data-v12-date="9">mié 9 sept</button>'+
      '<button data-v12-date="10">jue 10 sept</button>'+
      '<button class="active" data-v12-date="13">mar 13 oct</button>'+
      '<button data-v12-date="14">mié 14 oct</button>'+
    '</div>'+
    '<h2 id="v12-day-13">martes, 13 octubre 2026</h2>'+
    v12ScheduleCard(V12_DAY_13)+
    '<div class="v12-league-banner"><img src="'+V12_LOGO+'" alt="Liga Juventino"><strong>LIGA MUNICIPAL DE FÚTBOL<br>JUVENTINO ROSAS, GUANAJUATO</strong><i>⚽</i></div>'+
    '<h2 id="v12-day-14">miércoles, 14 octubre 2026</h2>'+
    v12ScheduleCard(V12_DAY_14)+
  '</section>';
}
function patchFixturesReference(){
  if(v12Route()!=='competition') return;
  const screen=document.querySelector('#screen');
  const tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs) return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Partidos/i.test(active.textContent||'')) return;
  if(screen.querySelector('[data-v12-fixtures]')) return;
  let node=tabs.nextSibling;
  while(node){const next=node.nextSibling;node.remove();node=next}
  tabs.insertAdjacentHTML('afterend',v12FixturesMarkup());
}


/* === PARTS25 — CUADRO / PLAY-OFF EXACTO DE REFERENCIA === */
const V12_BRACKET_SHIELD='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg>';

const V12_BRACKET_PATHS={
  america:'assets/branding/america-veteranos-35-user.png',
  huerta:'assets/teams/la-huerta-cuenda.webp',
  promesas:'assets/teams/promesas-fc-pozos.webp',
  franco:'assets/teams/franco-fc.webp',
  cuenda:'assets/official-logos/toros-de-cuenda.png',
  pozos:'assets/teams/pozos-fc.webp',
  lobos:'assets/teams/lobos-cdg.webp',
  santa:'assets/teams/atletico-santa-cruz.webp',
  galeana:'assets/teams/atletico-galeana.webp',
  sanantonio:'assets/teams/san-antonio-jr.webp',
  sanjose:'assets/teams/san-jose.webp'
};

function v12BracketTeam(name,key,abbr,seed,score){
  return {name,key,abbr,seed,score};
}
function v12BracketLogo(t){
  const path=V12_BRACKET_PATHS[t.key];
  if(path) return '<img src="'+V12_TEAM_ASSET_BASE+path+'" alt="'+t.name+'" loading="eager" decoding="async">';
  if(t.key==='juventino'||t.key==='realjuventino') return '<img src="'+V12_LOGO+'" alt="'+t.name+'" loading="eager" decoding="async">';
  return '<span class="v12-bracket-fallback">'+t.abbr+'</span>';
}
function v12BracketTeamCard(t,mini=false){
  return '<div class="v12-bracket-team '+(mini?'mini':'')+'">'+
    '<small class="v12-bracket-seed">'+(t.seed??'')+'</small>'+
    v12BracketLogo(t)+
    '<strong>'+t.name+'</strong>'+
    (t.score!==undefined&&t.score!==null?'<b class="v12-bracket-score">'+t.score+'</b>':'')+
  '</div>';
}
function v12BracketPair(a,b){
  return '<div class="v12-bracket-pair">'+v12BracketTeamCard(a)+
    '<i class="v12-bracket-vs">o</i>'+v12BracketTeamCard(b)+'</div>';
}
function v12BracketSeedPair(a,b){
  return '<div class="v12-bracket-seeded">'+v12BracketTeamCard(a,true)+
    '<i class="v12-bracket-vs">o</i>'+v12BracketTeamCard(b,true)+'</div>';
}
function v12BracketWinnerBlock(a,b){
  return '<div class="v12-bracket-winner-block">'+
    '<div class="v12-bracket-winner"><span class="shield">'+V12_BRACKET_SHIELD+'</span><strong>Ganador del play-off</strong></div>'+
    v12BracketSeedPair(a,b)+
  '</div>';
}

const V12_BRACKET_ROUTE_LEFT={
  label:'RUTA PLATEADA',
  pairs:[
    [
      v12BracketTeam('América Veteranos','america','AME','1','8'),
      v12BracketTeam('La Huerta','huerta','HUE','8','')
    ],
    [
      v12BracketTeam('Promesas FC','promesas','PRO','4','5'),
      v12BracketTeam('Franco FC','franco','FRA','5','')
    ],
    [
      v12BracketTeam('Cuenda','cuenda','CUE','3','6'),
      v12BracketTeam('Pozos','pozos','POZ','6','')
    ],
    [
      v12BracketTeam('Rincón de Centeno','rincon','RCN','7','0'),
      v12BracketTeam('Deportivo Rosas','depRosas','ROS','2','')
    ]
  ],
  winners:[
    [
      v12BracketTeam('Juventino','juventino','JUV','',''),
      v12BracketTeam('Lobos CDG','lobos','LOB','','')
    ],
    [
      v12BracketTeam('Santa Cruz','santa','STC','',''),
      v12BracketTeam('Atlético Galeana','galeana','GAL','','')
    ]
  ]
};

const V12_BRACKET_ROUTE_RIGHT={
  label:'RUTA AZUL',
  pairs:[
    [
      v12BracketTeam('San Isidro','sanisidro','SIS','2','6'),
      v12BracketTeam('El Naranjeño','naranjeno','NAR','16','')
    ],
    [
      v12BracketTeam('Real Juventino','realjuventino','RJU','12','5'),
      v12BracketTeam('Valle Verde','valleverde','VAL','13','')
    ],
    [
      v12BracketTeam('La Labor','labor','LAB','11','6'),
      v12BracketTeam('San Antonio','sanantonio','SAN','14','')
    ],
    [
      v12BracketTeam('El Durazno','durazno','DUR','10','5'),
      v12BracketTeam('Los Arcos','arcos','ARC','15','')
    ]
  ],
  winners:[
    [
      v12BracketTeam('Las Palomas','palomas','PAL','',''),
      v12BracketTeam('Deportivo Juventino','depjuv','DJU','','')
    ],
    [
      v12BracketTeam('San José','sanjose','SJO','',''),
      v12BracketTeam('La Estancia','estancia','EST','','')
    ]
  ]
};

function v12BracketRoute(route){
  return '<section class="v12-bracket-route">'+
    '<div class="v12-bracket-side-label"><span>'+route.label+'</span></div>'+
    '<div class="v12-bracket-pairs">'+route.pairs.map(p=>v12BracketPair(p[0],p[1])).join('')+'</div>'+
    '<div class="v12-bracket-connectors" aria-hidden="true">'+
      '<span class="c c1"></span><span class="c c2"></span><span class="c c3"></span><span class="c c4"></span>'+
    '</div>'+
    '<div class="v12-bracket-winners">'+route.winners.map(w=>v12BracketWinnerBlock(w[0],w[1])).join('')+'</div>'+
  '</section>';
}

function v12FinalTrophy(){
  return '<div class="v12-final-trophy-new" aria-label="Trofeo de la final">'+
    '<img src="./final-trophy-drive.png?v=parts35" alt="" aria-hidden="true">'+
  '</div>';
}
function v12FinalCard(){
  return '<section class="v12-final-reference" data-v12-final>'+
    '<div class="v12-final-top-date"><span></span><b>5 jun</b></div>'+
    '<div class="v12-final-side-mark" aria-hidden="true"></div>'+
    '<div class="v12-final-match-card">'+
      '<time>5 jun</time>'+
      '<div class="v12-final-opponent"><span class="v12-final-shield">'+V12_BRACKET_SHIELD+'</span><b>¿?</b></div>'+
      '<div class="v12-final-opponent"><span class="v12-final-shield">'+V12_BRACKET_SHIELD+'</span><b>¿?</b></div>'+
    '</div>'+
    '<div class="v12-final-trophy-wrap">'+v12FinalTrophy()+'</div>'+
  '</section>';
}
function v12BracketMarkup(){
  return '<section class="v12-bracket-reference stage-playoff" data-v12-bracket>'+
    '<div class="v12-bracket-stage-tabs" role="tablist" aria-label="Etapas del cuadro">'+
      '<button class="active" data-v12-bracket-stage="playoff">Play-off</button>'+
      '<button data-v12-bracket-stage="octavos">Octavos de final</button>'+
      '<button data-v12-bracket-stage="cuartos">Cuartos de final</button>'+
      '<button data-v12-bracket-stage="semifinal">Semifinales</button>'+
      '<button data-v12-bracket-stage="final">Final</button>'+
    '</div>'+
    '<div class="v12-bracket-dates"><span>16-19 &amp; 23-26 feb</span><span>9-12 &amp; 17-18 mar</span></div>'+
    '<div class="v12-bracket-board">'+
      v12BracketRoute(V12_BRACKET_ROUTE_LEFT)+
      v12BracketRoute(V12_BRACKET_ROUTE_RIGHT)+
    '</div>'+
    v12FinalCard()+
  '</section>';
}

function patchBracketReference(){
  if(v12Route()!=='competition') return;
  const screen=document.querySelector('#screen');
  const tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs) return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Cuadro/i.test(active.textContent||'')) return;
  if(screen.querySelector('[data-v12-bracket]')) return;
  let node=tabs.nextSibling;
  while(node){const next=node.nextSibling;node.remove();node=next}
  tabs.insertAdjacentHTML('afterend',v12BracketMarkup());
}

function v12NavBrand(){
  const labels={home:'Inicio',competition:'Competición',video:'Video',fantasy:'Fantasy',more:'Más'};
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item=>{
    const small=item.querySelector('small');
    if(small&&labels[item.dataset.route]) small.textContent=labels[item.dataset.route];
  });
  const comp=document.querySelector('.bottom-nav .nav-item[data-route="competition"] .nav-icon');
  if(comp) comp.innerHTML='<svg class="v12-competition-field-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M5.25 3.5h13.5A1.75 1.75 0 0 1 20.5 5.25v13.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V5.25A1.75 1.75 0 0 1 5.25 3.5Zm0 1.5a.25.25 0 0 0-.25.25v6h4.56a2.75 2.75 0 0 1 4.88 0H19v-6a.25.25 0 0 0-.25-.25H15v2.25A.75.75 0 0 1 14.25 8h-4.5A.75.75 0 0 1 9 7.25V5H5.25ZM10.5 5v1.5h3V5h-3ZM5 12.75v6c0 .138.112.25.25.25H9v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75V19h3.75a.25.25 0 0 0 .25-.25v-6h-4.56a2.75 2.75 0 0 1-4.88 0H5Zm5.5 6.25h3v-1.5h-3V19ZM12 10.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>';
  const profile=document.querySelector('.topbar .profile-button');
  if(profile) profile.innerHTML='<svg class="v12-profile-master-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12,13C13.933,13 15.5,11.433 15.5,9.5C15.5,7.567 13.933,6 12,6C10.067,6 8.5,7.567 8.5,9.5C8.5,11.433 10.067,13 12,13ZM23,12C23,18.0751 18.0751,23 12,23C5.9249,23 1,18.0751 1,12C1,5.9249 5.9249,1 12,1C18.0751,1 23,5.9249 23,12ZM18.9089,17.7681C17.7577,15.8144 15.0622,14.5 12,14.5C8.9417,14.5 6.2438,15.8117 5.0911,17.7682C3.7857,16.2062 3,14.1949 3,12C3,7.0294 7.0294,3 12,3C16.9706,3 21,7.0294 21,12C21,14.1948 20.2144,16.2061 18.9089,17.7681Z" fill="currentColor"/></svg>';
}
function patch(){
  v12NavBrand();
  patchStandings();
  patchFixturesReference();
  patchBracketReference();
  patchProfile();
  patchMoreLess();
}
document.addEventListener('click',e=>{
  const bracketStage=e.target.closest('[data-v12-bracket-stage]');
  if(bracketStage){
    const box=bracketStage.closest('[data-v12-bracket]');
    if(box){
      box.querySelectorAll('[data-v12-bracket-stage]').forEach(b=>b.classList.toggle('active',b===bracketStage));
      box.classList.remove('stage-playoff','stage-octavos','stage-cuartos','stage-semifinal','stage-final');
      box.classList.add('stage-'+bracketStage.dataset.v12BracketStage); setTimeout(()=>bracketStage.scrollIntoView({behavior:'smooth',inline:bracketStage.dataset.v12BracketStage==='final'?'end':'center',block:'nearest'}),40);
    }
    return;
  }
  const dateBtn=e.target.closest('[data-v12-date]');
  if(dateBtn){
    document.querySelectorAll('[data-v12-date]').forEach(b=>b.classList.toggle('active',b===dateBtn));
    const id=dateBtn.dataset.v12Date==='14'?'v12-day-14':'v12-day-13';
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  const route=e.target.closest('[data-v12-route]');
  if(route){e.preventDefault();location.hash='#/'+route.dataset.v12Route;return}
  const mode=e.target.closest('[data-v12-mode]');
  if(mode){
    const box=mode.closest('.v12-standings-reference');
    box.querySelectorAll('[data-v12-mode]').forEach(b=>b.classList.toggle('active',b===mode));
    box.querySelector('[data-v12-stand-content]').innerHTML=v12Rows(mode.dataset.v12Mode);
    return;
  }
  const action=e.target.closest('[data-v12-action]');
  if(action){
    const a=action.dataset.v12Action;
    if(a==='login') v12Toast('Inicio de sesión listo para conectar');
    if(a==='create') v12Toast('Registro de cuenta listo para conectar');
    if(a==='language') v12Toast('Idioma: Español (México)');
    if(a==='feedback') v12Toast('Gracias. Aquí se conectará el formulario de comentarios.');
    return;
  }
  const choice=e.target.closest('[data-v12-choice]');
  if(choice){
    document.querySelectorAll('[data-v12-choice]').forEach(x=>x.classList.remove('selected'));
    choice.classList.add('selected');
    v12Toast(choice.dataset.v12Choice==='more'?'Elegiste MÁS':'Elegiste MENOS');
  }
},true);
window.addEventListener('hashchange',()=>requestAnimationFrame(patch));
const obs=new MutationObserver(()=>requestAnimationFrame(patch));
const target=document.querySelector('#screen');
if(target) obs.observe(target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(patch),{once:true}); else requestAnimationFrame(patch);
