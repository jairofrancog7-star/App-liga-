const A='./assets';
const ICONS=`${A}/ui/icons.svg`;
const LOGO=`${A}/league/liga-logo.webp`;
const TROPHY=`${A}/decor/neon-trophy.webp`;
const VIDEO_HERO='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485172215463936/2100485172215463937.png';
const HOME_MATCH=`${A}/media/home-match.webp`;
const HOME_PROMESAS=`${A}/media/home-feature-promesas.webp`;
const HOME_MOMENTS=`${A}/media/home-moments.webp`;

const teams=[
  {id:'america',code:'AME',name:'Club América Veteranos',short:'América',crest:`${A}/teams/america-veteranos.png`,place:'Juventino Rosas'},
  {id:'huerta',code:'HUE',name:'La Huerta',short:'La Huerta',crest:`${A}/teams/la-huerta.webp`,place:'Cuenda'},
  {id:'promesas',code:'PRO',name:'Promesas FC',short:'Promesas',crest:`${A}/teams/promesas-fc.webp`,place:'Pozos'},
  {id:'franco',code:'FRA',name:'Franco FC',short:'Franco FC',crest:`${A}/teams/franco-fc.webp`,place:'Juventino Rosas'},
  {id:'galeana',code:'GAL',name:'Atlético Galeana',short:'Atl. Galeana',crest:`${A}/teams/atletico-galeana.webp`,place:'Galeana'},
  {id:'lobos',code:'LOB',name:'Lobos CDG',short:'Lobos CDG',crest:`${A}/teams/lobos-cdg.webp`,place:'Juventino Rosas'},
  {id:'pozos',code:'POZ',name:'Pozos FC',short:'Pozos',crest:`${A}/teams/pozos-fc.webp`,place:'Pozos'},
  {id:'esperanza',code:'ESP',name:'La Esperanza',short:'La Esperanza',crest:`${A}/teams/la-esperanza.webp`,place:'Juventino Rosas'},
  {id:'depcg',code:'DCG',name:'Deportivo CG',short:'Deportivo CG',crest:`${A}/teams/deportivo-cg.webp`,place:'Juventino Rosas'},
  {id:'sanjose',code:'SJO',name:'San José',short:'San José',crest:`${A}/teams/san-jose.webp`,place:'Juventino Rosas'},
  {id:'santacruz',code:'SCR',name:'Santa Cruz',short:'Santa Cruz',crest:`${A}/teams/santa-cruz.webp`,place:'Juventino Rosas'},
  {id:'juventino',code:'JUV',name:'Juventino',short:'Juventino',crest:LOGO,place:'Juventino Rosas'},
  {id:'cuenda',code:'CUE',name:'Cuenda',short:'Cuenda',crest:LOGO,place:'Cuenda'},
  {id:'rincon',code:'RIN',name:'Rincón de Centeno',short:'Rincón',crest:LOGO,place:'Rincón de Centeno'},
  {id:'rosas',code:'ROS',name:'Deportivo Rosas',short:'Dep. Rosas',crest:LOGO,place:'Juventino Rosas'}
];
const byId=id=>teams.find(t=>t.id===id)||teams[0];
const byCode=code=>teams.find(t=>t.code===code)||teams[0];

const fixtures={
  '12 sep':[
    ['america','lobos','4','1','Final'],['huerta','galeana','2','0','Final'],['promesas','franco','3','0','Final']
  ],
  '19 sep':[
    ['pozos','juventino','18:00','',''],['cuenda','rincon','20:00','',''],['depcg','sanjose','21:00','','']
  ],
  '26 sep':[
    ['promesas','huerta','17:30','',''],['lobos','franco','19:15','',''],['galeana','santacruz','21:00','','']
  ],
  '3 oct':[
    ['juventino','america','18:00','',''],['rincon','pozos','20:00','',''],['rosas','esperanza','21:30','','']
  ],
  '10 oct':[
    ['america','huerta','18:30','',''],['promesas','galeana','20:00','',''],['franco','lobos','21:15','','']
  ]
};
const fixtureDates=Object.keys(fixtures);

const standings=[
  ['america',1,5,3,['n','n','w']],['huerta',1,5,3,['n','n','w']],['promesas',1,4,3,['n','n','w']],['franco',1,4,3,['n','n','w']],['galeana',1,3,3,['n','n','w']],['lobos',1,2,3,['n','n','w']],['pozos',1,2,3,['n','d','w']],['juventino',1,1,3,['n','d','w']],['cuenda',1,0,1,['n','d','d']],['rincon',1,0,1,['n','d','d']],['depcg',1,-1,0,['n','n','l']],['sanjose',1,-2,0,['n','n','l']],['santacruz',1,-3,0,['n','n','l']],['rosas',1,-4,0,['n','n','l']],['esperanza',1,-5,0,['n','n','l']]
];

const scorerData=[
 ['Diego Zamora','promesas',12],['Luis Hernández','america',10],['Marco Tovar','huerta',9],['Ángel Ponce','galeana',8],['Carlos Ríos','lobos',7],['José Medina','franco',7],['Edgar Lara','pozos',6],['Iván Torres','juventino',6]
];

const statsSections=[
  ['Datos clave',[['Goles','america',23],['Partidos sin recibir gol','huerta',6],['Posesión media','promesas','61%']]],
  ['Goles',[['Goles','america',23],['Goles por partido','promesas','2.4'],['Conversión','huerta','18%']]],
  ['Remates',[['Remates a puerta','promesas',58],['Remates','galeana',104],['Al poste','lobos',7]]],
  ['Ataque',[['Ocasiones claras','america',31],['Regates completados','franco',74],['Centros completados','huerta',42]]],
  ['Distribución',[['Pases completados','promesas',2140],['Precisión de pase','america','88%'],['Pases largos','pozos',171]]],
  ['Defensa',[['Entradas ganadas','lobos',94],['Intercepciones','galeana',61],['Despejes','sanjose',127]]],
  ['Portería',[['Paradas','huerta',44],['Penales atajados','america',2],['Arcos en cero','promesas',5]]],
  ['Información disciplinaria',[['Tarjetas amarillas','franco',18],['Tarjetas rojas','pozos',2],['Faltas','lobos',81]]]
];

const state=loadState();
function loadState(){
  const base={competitionTab:'fixtures',selectedDate:'19 sep',standingsMode:'compact',bracketPhase:'playoff',statsTab:'general',rankingsTab:'clubs',historyTab:'summary',followed:[],favorite:null,notifications:{goals:true,results:true,news:true,moments:false,fantasy:true,predictor:true},language:'es',privacy:{essential:true,analytics:false,personalization:false},fantasyView:'landing',predictIntro:0,quizIndex:0,quizSelected:null};
  try{return {...base,...JSON.parse(localStorage.getItem('lj-v20')||'{}')}}catch{return base}
}
function persist(){localStorage.setItem('lj-v20',JSON.stringify(state));}

const screen=document.querySelector('#screen');
const nav=document.querySelector('.bottom-nav');
const routeFromHash=()=>location.hash.replace(/^#\//,'').split('?')[0]||'home';
const primaryForRoute=r=>r==='competition'?'competition':r==='video'?'video':r==='fantasy'?'fantasy':r==='more'?'more':r==='home'?'home':'more';
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function icon(id,cls=''){return `<svg class="ui-icon ${cls}" aria-hidden="true"><use href="${ICONS}#${id}"></use></svg>`}
function crest(teamOrId,cls=''){const t=typeof teamOrId==='string'?byId(teamOrId):teamOrId;return `<img class="crest-img ${cls}" src="${t.crest}" alt="${esc(t.name)}" loading="lazy">`}
function leagueLogo(cls=''){return `<img class="league-logo ${cls}" src="${LOGO}" alt="Liga Municipal de Fútbol Juventino Rosas">`}
function profileButton(){return `<button class="profile-action" data-route="profile" aria-label="Perfil">${icon('profile')}</button>`}
function backHeader(title,extra=''){return `<header class="sub-header"><button class="sub-back" data-action="back" aria-label="Volver">${icon('back')}</button><h1>${title}</h1><div class="sub-actions">${extra}</div></header>`}
function shareButton(title='Liga Juventino'){return `<button class="sub-share" data-action="share" data-share-title="${esc(title)}" aria-label="Compartir">${icon('share')}</button>`}
function sectionTitle(title,action='',label='Ver todo'){return `<div class="section-title"><h2>${title}</h2>${action?`<button data-route="${action}">${label}</button>`:''}</div>`}
function actionIcon(id){return icon(id,'menu-svg')}

function render(){
  const route=routeFromHash();
  document.body.dataset.route=route;
  const renderers={home:homeView,competition:competitionView,video:videoView,fantasy:fantasyView,more:moreView,following:followingView,teams:teamsView,scorers:scorersView,moments:momentsView,statistics:statisticsView,performance:performanceView,'predict-six':predictView,quiz:quizView,'more-or-less':moreOrLessView,invite:inviteView,rankings:rankingsView,history:historyView,article:articleView,profile:profileView,notifications:notificationsView,privacy:privacyView,terms:termsView,hospitality:hospitalityView,about:aboutView};
  screen.innerHTML=(renderers[route]||homeView)();
  setActiveNav(primaryForRoute(route));
  requestAnimationFrame(()=>{if(route==='competition'&&state.competitionTab==='bracket') drawBracketLinks();});
}
function setActiveNav(which){
  document.querySelectorAll('.nav-item').forEach(btn=>{
    const active=btn.dataset.route===which;
    btn.classList.toggle('active',active);
    const id=btn.dataset.icon;
    const use=btn.querySelector('use');
    if(use) use.setAttribute('href',`${ICONS}#${id}${active&&['home','competition','video','fantasy','more'].includes(id)?'-active':''}`);
  });
}
function navigate(route,opts={}){
  if(location.hash===`#/${route}`){window.scrollTo({top:0,behavior:'smooth'});return}
  location.hash=`#/${route}`;
  if(!opts.keepScroll) window.scrollTo(0,0);
}
