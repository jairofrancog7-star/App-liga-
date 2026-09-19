/* V33 — Datos / Estadísticas reconstruido desde las referencias del usuario.
   Pantalla funcional: General, Estadísticas de equipo y Estadísticas de jugador. */
(function(){
'use strict';

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LOGOS={
  LEAGUE:'assets/liga-logo.webp',
  AME:'assets/branding/america-veteranos-35-user.png',
  HUE:'assets/official-logos/la-huerta.png',
  PRO:'assets/official-logos/promesas-fc.png',
  FRA:'assets/official-logos/franco-fc.png',
  GAL:'assets/official-logos/galeana.png',
  LOB:'assets/official-logos/lobos-cdg.png',
  CUE:'assets/official-logos/toros-de-cuenda.png',
  POZ:'assets/teams/pozos-fc.webp',
  STC:'assets/teams/atletico-santa-cruz.webp',
  JUV:'assets/liga-logo.webp'
};
const TEAM_NAMES={
  AME:'Club América Veteranos JR',HUE:'La Huerta',PRO:'Promesas FC',FRA:'Franco FC',
  GAL:'Atlético Galeana',LOB:'Lobos CDG',CUE:'Cuenda',POZ:'Pozos',STC:'Santa Cruz',
  JUV:'Juventino Rosas A.C.',ROS:'Deportivo Rosas',RIN:'Rincón de Centeno'
};

const TEAM_SECTIONS=[
  ['Datos clave',[
    ['Partidos disputados',[['AME',1],['HUE',1],['GAL',1],['JUV',1],['LOB',1]]],
    ['Ganados',[['AME',1],['ROS',1],['PRO',1],['CUE',1],['POZ',1]]]
  ]],
  ['Goles',[
    ['Goles',[['AME',6],['HUE',5],['PRO',5],['JUV',4],['ROS',4]]],
    ['Concedidos',[['STC',2],['FRA',3],['RIN',4],['POZ',5],['CUE',5]]]
  ]],
  ['Remates',[
    ['Disparos totales',[['AME',35],['HUE',26],['PRO',25],['GAL',25],['JUV',22]]],
    ['Disparos a puerta',[['AME',18],['PRO',15],['HUE',14],['ROS',12],['STC',11]]]
  ]],
  ['Ataque',[
    ['Asistencias',[['HUE',5],['AME',4],['PRO',3],['GAL',3],['JUV',3]]],
    ['Saques de esquina',[['AME',24],['HUE',15],['ROS',16],['PRO',14],['CUE',12]]]
  ]],
  ['Distribución',[
    ['Precisión en el pase (%)',[['JUV',96],['HUE',94],['AME',93],['PRO',92],['GAL',90]]],
    ['Pases por partido',[['JUV',520],['HUE',498],['AME',482],['PRO',460],['ROS',445]]]
  ]],
  ['Defensa',[
    ['Balones recuperados',[['CUE',53],['GAL',49],['HUE',48],['LOB',45],['STC',44]]],
    ['Duelos ganados (%)',[['LOB',62],['CUE',58],['STC',56],['RIN',54],['POZ',51]]]
  ]],
  ['Portería',[
    ['Goles encajados',[['HUE',0],['LOB',0],['JUV',1],['ROS',0],['STC',0]]],
    ['Porterías a cero',[['HUE',5],['LOB',4],['JUV',4],['ROS',3],['STC',3]]]
  ]],
  ['Información disciplinaria',[
    ['Tarjetas amarillas',[['RIN',8],['FRA',4],['POZ',4],['GAL',3],['AME',3]]],
    ['Tarjetas rojas',[['FRA',3],['CUE',2],['STC',2],['POZ',1],['LOB',1]]]
  ]]
];

const PLAYERS={
  CM:['Carlos Mendoza','AME','Delantero'],LG:['Luis García','HUE','Delantero'],JR:['Javier Ramírez','FRA','Delantero'],
  AL:['Antonio López','JUV','Delantero'],DT:['Diego Torres','GAL','Delantero'],MH:['Miguel Hernández','JUV','Medio'],
  JT:['José Ramírez','LOB','Medio'],AT:['Alan Torres','FRA','Medio'],DL:['Daniel López','LOB','Medio'],
  ES:['Eduardo Sánchez','PRO','Medio'],DR:['Diego Ramírez','CUE','Medio'],EM:['Ernesto Morales','AME','Medio'],
  LH:['Luis Hernández','HUE','Medio'],RD:['Ricardo Díaz','FRA','Medio'],MT:['Manuel Torres','JUV','Medio'],
  JC:['José Contreras','LOB','Defensa'],ML:['Mario López','GAL','Defensa'],AG:['Andrés García','PRO','Defensa'],
  JG:['Jorge Ramírez','RIN','Defensa'],VD:['Víctor Díaz','STC','Defensa'],EV:['Eduardo Vargas','AME','Portero'],
  MR:['Martín López','FRA','Portero'],RS:['Raúl Sánchez','HUE','Portero'],AD:['Alberto Díaz','JUV','Portero'],
  DMR:['Daniel Ramírez','AME','Portero'],OA:['Omar Aguilar','GAL','Defensa'],HM:['Héctor Morales','LOB','Defensa'],
  DLU:['Diego Luna','PRO','Medio'],RC:['Raúl Contreras','CUE','Defensa'],IR:['Iván Rojas','POZ','Medio'],
  JP:['Juan Pérez','AME','Delantero'],RB:['Roberto Díaz','GAL','Delantero']
};

const PLAYER_SECTIONS=[
  ['Datos clave',[
    ['Partidos disputados',[['CM',1],['LG',1],['JR',1],['AL',1],['DT',1]]],
    ['Minutos jugados',[['CM',90],['LG',90],['MH',88],['JT',86],['AT',84]]]
  ]],
  ['Goles',[
    ['Goles',[['CM',3],['LG',3],['JR',2],['AL',2],['DT',2]]],
    ['Contribuciones de gol',[['CM',5],['LG',5],['MH',4],['JT',4],['AT',4]]]
  ]],
  ['Remates',[
    ['Disparos totales',[['LG',10],['CM',8],['DT',7],['RB',6],['JP',6]]],
    ['Disparos al arco',[['LG',7],['CM',6],['RB',5],['DT',4],['AT',4]]]
  ]],
  ['Ataque',[
    ['Asistencias',[['MH',2],['AT',2],['JT',2],['DL',2],['ES',2]]],
    ['Pases clave',[['MH',6],['AT',5],['JT',5],['LG',4],['CM',4]]]
  ]],
  ['Distribución',[
    ['Precisión en el pase (%)',[['DR',100],['EM',100],['LH',100],['RD',100],['MT',100]]],
    ['Pases totales',[['DR',100],['EM',98],['LH',96],['RD',94],['MT',92]]]
  ]],
  ['Defensa',[
    ['Balones recuperados',[['JC',14],['ML',12],['AG',12],['JG',12],['VD',11]]],
    ['Duelos ganados',[['JC',12],['ML',11],['AG',10],['JG',10],['VD',9]]]
  ]],
  ['Portería',[
    ['Goles encajados',[['EV',1],['MR',1],['RS',1],['AD',2],['DMR',2]]],
    ['Paradas',[['EV',8],['MR',7],['RS',7],['AD',6],['DMR',6]]]
  ]],
  ['Información disciplinaria',[
    ['Tarjetas amarillas',[['OA',14],['HM',12],['DLU',11],['RC',10],['IR',9]]],
    ['Tarjetas rojas',[['HM',3],['RC',2],['DLU',2],['OA',1],['IR',1]]]
  ]]
];

let activeTab=localStorage.getItem('v33-data-tab')||'general';

function route(){return location.hash.replace('#/','')||'home'}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function backIcon(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.25"/><circle cx="6" cy="12" r="2.25"/><circle cx="18" cy="19" r="2.25"/><path d="m8.1 10.9 7.6-4.5M8.1 13.1l7.6 4.5"/></svg>'}
function teamLogo(code,name,cls){
  const path=LOGOS[code];
  if(path)return '<span class="v33-team-logo '+(cls||'')+'"><img src="'+BASE+path+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
  return '<span class="v33-team-logo v33-fallback '+(cls||'')+'">'+esc(code)+'</span>';
}
function initials(name){return name.split(/\s+/).map(x=>x[0]||'').join('').slice(0,2).toUpperCase()}
function playerAvatar(key,index){
  const p=PLAYERS[key]||[key,'JUV','Jugador'];
  const jerseys=['#f3bf31','#204dd4','#d22631','#1ab16b','#ec4d87','#814bdc','#111b4b','#f26b26'];
  const skin=['#d8a17a','#b87555','#efc19c','#c88761','#9b6249'];
  const hair=['#191919','#37251f','#0e0e12','#4c3328'];
  const j=jerseys[index%jerseys.length], s=skin[index%skin.length], h=hair[index%hair.length];
  return '<span class="v33-player-avatar" title="'+esc(p[0])+'"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#eef2ff"/><path d="M8 40c1-8 5-12 12-12s11 4 12 12" fill="'+j+'"/><ellipse cx="20" cy="18" rx="8.2" ry="9.3" fill="'+s+'"/><path d="M12 16c.3-7 4-10 8-10 5 0 8.2 3.3 8.2 10-2.3-2.8-5-4.1-8.1-4.1-3 0-5.7 1.3-8.1 4.1Z" fill="'+h+'"/><path d="M16.2 21.5c2.3 1.5 5.3 1.5 7.6 0" fill="none" stroke="#7d4635" stroke-width=".8" stroke-linecap="round"/></svg></span>';
}
function tabs(){
  return '<nav class="v33-tabs" aria-label="Tipos de estadísticas">'+
    '<button type="button" class="'+(activeTab==='general'?'active':'')+'" data-v33-tab="general">General</button>'+
    '<button type="button" class="'+(activeTab==='team'?'active':'')+'" data-v33-tab="team">Estadísticas de equipo</button>'+
    '<button type="button" class="'+(activeTab==='player'?'active':'')+'" data-v33-tab="player">Estadísticas de jugador</button>'+
  '</nav>';
}
function header(){
  return '<header class="v33-data-head" data-v33-head>'+
    '<div class="v33-head-actions"><button type="button" data-v33-back aria-label="Volver">'+backIcon()+'</button><button type="button" data-v33-share aria-label="Compartir">'+shareIcon()+'</button></div>'+
    '<div class="v33-morph-title" data-v33-morph-title><h1>Estadísticas</h1></div>'+
    tabs()+
  '</header>';
}
function teamRow(row,index){
  const code=row[0],val=row[1],name=TEAM_NAMES[code]||code;
  return '<button type="button" class="v33-stat-row" data-v33-team="'+esc(code)+'">'+
    '<span class="v33-rank">'+(index+1)+'</span>'+teamLogo(code,name)+
    '<span class="v33-row-copy"><b>'+esc(name)+'</b><small>Juventino Rosas</small></span>'+
    '<strong>'+esc(val)+'</strong>'+
  '</button>';
}
function playerRow(row,index){
  const key=row[0],val=row[1],p=PLAYERS[key]||[key,'JUV','Jugador'];
  return '<button type="button" class="v33-stat-row player" data-v33-player="'+esc(p[0])+'">'+
    '<span class="v33-rank">'+(index+1)+'</span>'+playerAvatar(key,index)+
    '<span class="v33-row-copy"><b>'+esc(p[0])+'</b><small>'+esc(TEAM_NAMES[p[1]]||p[1])+' · '+esc(p[2])+'</small></span>'+
    '<strong>'+esc(val)+'</strong>'+
  '</button>';
}
function statCard(title,rows,type){
  return '<article class="v33-stat-card"><h3>'+esc(title)+'</h3><div class="v33-stat-list">'+
    rows.map((r,i)=>type==='player'?playerRow(r,i):teamRow(r,i)).join('')+
    '</div><button type="button" class="v33-see-all" data-v33-tab="'+(type==='player'?'player':'team')+'">Ver todos los '+(type==='player'?'jugadores':'equipos')+' <span>›</span></button></article>';
}
function detailedView(sections,type){
  return '<main class="v33-data-content v33-detailed">'+sections.map(section=>
    '<section class="v33-section"><h2>'+esc(section[0])+'</h2><div class="v33-stat-grid">'+
      statCard(section[1][0][0],section[1][0][1],type)+
      statCard(section[1][1][0],section[1][1][1],type)+
    '</div></section>'
  ).join('')+'</main>';
}
function generalView(){
  const goalTeams=TEAM_SECTIONS[1][1][0][1];
  const shots=TEAM_SECTIONS[2][1][0][1];
  const passes=TEAM_SECTIONS[4][1][1][1];
  const playerGoals=PLAYER_SECTIONS[1][1][0][1];
  const assists=PLAYER_SECTIONS[3][1][0][1];
  const recoveries=PLAYER_SECTIONS[5][1][0][1];
  return '<main class="v33-data-content v33-general-content">'+
    '<section class="v33-general-section">'+
      '<div class="v33-general-title"><h2>Estadísticas de equipo</h2><button type="button" data-v33-tab="team">Ver todo</button></div>'+
      '<div class="v33-carousel">'+
        statCard('Goles',goalTeams,'team')+
        statCard('Disparos totales',shots,'team')+
        statCard('Pases por partido',passes,'team')+
      '</div>'+
    '</section>'+
    '<section class="v33-general-section">'+
      '<div class="v33-general-title"><h2>Estadísticas de jugador</h2><button type="button" data-v33-tab="player">Ver todo</button></div>'+
      '<div class="v33-carousel">'+
        statCard('Goles',playerGoals,'player')+
        statCard('Asistencias',assists,'player')+
        statCard('Balones recuperados',recoveries,'player')+
      '</div>'+
    '</section>'+
  '</main>';
}
function markup(){
  return '<section class="v33-data-page" data-v33-data data-v33-mode="'+activeTab+'">'+header()+
    (activeTab==='general'?generalView():activeTab==='team'?detailedView(TEAM_SECTIONS,'team'):detailedView(PLAYER_SECTIONS,'player'))+
  '</section>';
}
function toast(msg){
  const old=document.querySelector('.v33-toast');if(old)old.remove();
  const n=document.createElement('div');n.className='v33-toast';n.textContent=msg;document.body.appendChild(n);
  setTimeout(()=>n.remove(),1500);
}
function setBottomNav(){
  const nav=document.querySelector('.bottom-nav');if(!nav)return;
  nav.querySelectorAll('.nav-item').forEach(item=>item.classList.toggle('active',item.dataset.route==='more'));
  const more=nav.querySelector('[data-route="more"] .nav-icon');
  if(more){
    more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.15" fill="currentColor"/><circle cx="12" cy="12" r="2.15" fill="currentColor"/><circle cx="19" cy="12" r="2.15" fill="currentColor"/></svg>';
  }
}
function share(){
  const payload={title:'Estadísticas Liga Juventino',text:'Estadísticas de la Liga Municipal de Fútbol Juventino Rosas',url:location.href};
  if(navigator.share)navigator.share(payload).catch(()=>{});
  else if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(()=>toast('Enlace copiado')).catch(()=>toast('Contenido listo para compartir'));
  else toast('Contenido listo para compartir');
}
function bind(){
  document.querySelectorAll('[data-v33-tab]').forEach(b=>b.onclick=()=>{
    activeTab=b.dataset.v33Tab;
    localStorage.setItem('v33-data-tab',activeTab);
    render();
    window.scrollTo(0,0);
  });
  document.querySelectorAll('[data-v33-back]').forEach(b=>b.onclick=()=>{location.hash='#/more'});
  document.querySelectorAll('[data-v33-share]').forEach(b=>b.onclick=share);
  document.querySelectorAll('[data-v33-team]').forEach(b=>b.onclick=()=>{
    toast((TEAM_NAMES[b.dataset.v33Team]||b.dataset.v33Team)+' · estadísticas del equipo');
  });
  document.querySelectorAll('[data-v33-player]').forEach(b=>b.onclick=()=>{
    toast(b.dataset.v33Player+' · estadísticas del jugador');
  });
}

let v33ScrollTick=0;
function applyHeaderScroll(){
  if(route()!=='safe-data')return;
  const head=document.querySelector('[data-v33-head]');
  const title=head?.querySelector('[data-v33-morph-title]');
  if(!head||!title)return;

  const y=Math.max(0,window.scrollY||document.documentElement.scrollTop||0);
  const p=Math.min(1,y/165);

  /* En el video "Estadísticas" NUNCA desaparece:
     es el mismo título que sube, se hace más pequeño y queda fijo arriba.
     Las tablas continúan desplazándose por debajo de la cabecera compacta. */
  const vw=Math.min(window.innerWidth,520);
  const expandedH=Math.max(184,Math.min(258,vw*0.5012));
  const collapsedH=Math.max(104,Math.min(142,vw*0.2720));

  const expandedLeft=Math.max(20,Math.min(32,vw*0.055));
  const compactLeft=Math.max(92,Math.min(132,vw*0.255));
  const expandedTop=Math.max(98,Math.min(142,vw*0.274));
  const compactTop=Math.max(24,Math.min(36,vw*0.070));
  const expandedSize=Math.max(32,Math.min(44,vw*0.0855));
  const compactSize=Math.max(18,Math.min(25,vw*0.048));

  const lerp=(a,b,t)=>a+(b-a)*t;

  head.style.setProperty('--v33-collapse',p.toFixed(4));
  head.style.setProperty('--v33-head-h',lerp(expandedH,collapsedH,p).toFixed(1)+'px');
  head.style.setProperty('--v33-tabs-opacity','1');

  title.style.left=lerp(expandedLeft,compactLeft,p).toFixed(1)+'px';
  title.style.top=lerp(expandedTop,compactTop,p).toFixed(1)+'px';
  title.querySelector('h1').style.fontSize=lerp(expandedSize,compactSize,p).toFixed(1)+'px';

  const phase=title.querySelector('p');
  if(phase){
    phase.style.opacity=Math.max(0,1-(p*1.55)).toFixed(3);
    phase.style.transform='translateY('+(-10*p).toFixed(1)+'px)';
  }

  head.classList.toggle('is-collapsed',p>.82);
}
function requestHeaderScroll(){
  if(v33ScrollTick)return;
  v33ScrollTick=requestAnimationFrame(()=>{v33ScrollTick=0;applyHeaderScroll()});
}
window.addEventListener('scroll',requestHeaderScroll,{passive:true});

function render(){
  const active=route()==='safe-data';
  document.body.classList.toggle('v33-data-active',active);
  if(!active)return;
  const screen=document.querySelector('#screen');if(!screen)return;
  screen.innerHTML=markup();
  setBottomNav();
  bind();
  applyHeaderScroll();
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
window.addEventListener('hashchange',schedule);
const target=document.querySelector('#screen');
if(target)new MutationObserver(()=>{if(route()==='safe-data'&&!target.querySelector('[data-v33-data]'))schedule()}).observe(target,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();