/* PARTS26 — Siguiendo reconstruido como interfaz real.
   Las tres capturas de Drive son la referencia visual; no se usan como
   fondo estirado, así que no se duplican barras/textos ni se comprime. */
const V26_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
const V26_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';

const V26_TEAMS=[
  {id:'AME',name:'América Veteranos',logo:'assets/branding/america-veteranos-35-user.png'},
  {id:'HUE',name:'La Huerta',logo:'assets/official-logos/la-huerta.png'},
  {id:'PRO',name:'Promesas FC',logo:'assets/official-logos/promesas-fc.png'},
  {id:'GAL',name:'Atlético Galeana',logo:'assets/official-logos/galeana.png'},
  {id:'LOB',name:'Lobos CDG',logo:'assets/official-logos/lobos-cdg.png'},
  {id:'CUE',name:'Cuenda',logo:'assets/official-logos/toros-de-cuenda.png'},
  {id:'POZ',name:'Pozos',logo:'assets/teams/pozos-fc.webp'},
  {id:'RIN',name:'Rincón de Centeno',logo:'',abbr:'RIN'},
  {id:'ROS',name:'Deportivo Rosas',logo:'',abbr:'ROS'},
  {id:'STC',name:'Santa Cruz',logo:'assets/teams/atletico-santa-cruz.webp'},
  {id:'SJO',name:'San José',logo:'assets/official-logos/san-jose-fc.png'},
  {id:'SIS',name:'San Isidro',logo:'',abbr:'SIS'},
  {id:'RJU',name:'Real Juventino',logo:'',abbr:'RJU'},
  {id:'VAL',name:'Valle Verde',logo:'',abbr:'VAL'},
  {id:'LAB',name:'La Labor',logo:'',abbr:'LAB'},
  {id:'DUR',name:'El Durazno',logo:'',abbr:'DUR'},
  {id:'SAN',name:'San Antonio',logo:'assets/official-logos/san-antonio-fc.png'},
  {id:'ARC',name:'Los Arcos',logo:'',abbr:'ARC'},
  {id:'JUV',name:'Deportivo Juventino',logo:'',abbr:'JUV'},
  {id:'PAL',name:'Las Palomas',logo:'',abbr:'PAL'},
  {id:'FRA',name:'Franco FC',logo:'assets/official-logos/franco-fc.png'},
  {id:'EST',name:'La Estancia',logo:'',abbr:'EST'}
];

let v26Mode='auto';
let v26Active='AME';
let v26Query='';

function v26Route(){return location.hash.replace('#/','')||'home'}
function v26Store(){try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}catch{return {}}}
function v26Save(s){localStorage.setItem('lj-store-v3',JSON.stringify(s))}
function v26Followed(){const a=v26Store().followed;return Array.isArray(a)?a:[]}
function v26Favorites(){const a=v26Store().favorites;return Array.isArray(a)?a:[]}
function v26Team(id){return V26_TEAMS.find(t=>t.id===id)||V26_TEAMS[0]}
function v26Follow(id,on){const s=v26Store();const a=Array.isArray(s.followed)?s.followed:[];s.followed=on?[...new Set([...a,id])]:a.filter(x=>x!==id);v26Save(s)}
function v26Fav(id,on){const s=v26Store();const key='team:'+id;const a=Array.isArray(s.favorites)?s.favorites:[];s.favorites=on?[...new Set([...a,key])]:a.filter(x=>x!==key);v26Save(s)}
function v26IsFav(id){return v26Favorites().includes('team:'+id)}

function v26Arrow(){return '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M29 10 15 24l14 14M16 24h24"/></svg>'}
function v26Plus(){return '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10v28M10 24h28"/></svg>'}
function v26SearchIcon(){return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="20" cy="20" r="11"/><path d="m28 28 10 10"/></svg>'}
function v26Star(){return '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 5.8 11.7 12.9 1.9-9.3 9 2.2 12.8L24 34.3l-11.6 6.1 2.2-12.8-9.3-9 12.9-1.9Z"/></svg>'}

function v26Logo(t,large=false){
  if(t.logo) return '<img class="v26-team-logo '+(large?'large':'')+'" src="'+V26_BASE+t.logo+'" alt="'+t.name+'">';
  return '<span class="v26-team-fallback '+(large?'large':'')+'">'+(t.abbr||t.id)+'</span>';
}

function v26Header(title,close=false){
  return '<header class="v26-follow-head">'+
    '<button class="v26-head-btn" data-v26-back aria-label="'+(close?'Cerrar':'Volver')+'">'+(close?'×':v26Arrow())+'</button>'+
    '<h1>'+title+'</h1>'+
    (!close?'<button class="v26-head-btn plus" data-v26-picker aria-label="Añadir equipos">'+v26Plus()+'</button>':'<span class="v26-head-spacer"></span>')+
  '</header>';
}

function v26Empty(){
  return '<section class="v26-follow-page v26-empty" data-v26-follow>'+
    '<div class="v26-neon-top" aria-hidden="true"><i></i><i></i><i></i></div>'+
    v26Header('Siguiendo')+
    '<main class="v26-empty-main">'+
      '<img class="v26-league-logo" src="'+V26_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas">'+
      '<h2>Sin equipos seguidos todavía</h2>'+
      '<p>¡Sigue a los equipos de la Liga Municipal<br>de Fútbol Juventino Rosas para acceder<br>rápidamente a noticias, alertas de partidos<br>y resúmenes en vídeo!</p>'+
      '<button class="v26-add-btn" data-v26-picker><span>＋</span>Añadir equipos</button>'+
    '</main>'+
  '</section>';
}

function v26Following(){
  const followed=v26Followed();
  if(!followed.length) return v26Empty();
  if(!followed.includes(v26Active)) v26Active=followed[0];
  const active=v26Team(v26Active);
  return '<section class="v26-follow-page v26-followed" data-v26-follow>'+
    '<div class="v26-neon-top" aria-hidden="true"><i></i><i></i><i></i></div>'+
    v26Header('Siguiendo')+
    '<main class="v26-follow-list">'+
      followed.map(id=>{const t=v26Team(id);return '<button class="v26-follow-row '+(id===v26Active?'active':'')+'" data-v26-team="'+id+'">'+v26Logo(t)+'<strong>'+t.name+'</strong><span>Siguiendo</span></button>'}).join('')+
    '</main>'+
    '<section class="v26-sheet">'+
      '<div class="v26-sheet-team">'+v26Logo(active,true)+'<strong>'+active.name+'</strong></div>'+
      '<div class="v26-sheet-line"></div>'+
      '<button class="v26-sheet-action" data-v26-favorite="'+active.id+'">'+v26Star()+'<span>Equipo favorito</span></button>'+
      '<button class="v26-sheet-action" data-v26-unfollow="'+active.id+'"><b>−</b><span>Dejar de seguir</span></button>'+
    '</section>'+
  '</section>';
}

function v26Picker(){
  const followed=v26Followed();
  const q=v26Query.trim().toLocaleLowerCase('es');
  const list=V26_TEAMS.filter(t=>!q||t.name.toLocaleLowerCase('es').includes(q)||t.id.toLowerCase().includes(q));
  return '<section class="v26-follow-page v26-picker" data-v26-follow>'+
    '<header class="v26-picker-head">'+
      '<div class="v26-search">'+v26SearchIcon()+'<input id="v26Search" type="search" placeholder="Buscar equipos" value="'+v26Query.replace(/"/g,'&quot;')+'" autocomplete="off"></div>'+
      '<button class="v26-close" data-v26-back aria-label="Cerrar">×</button>'+
    '</header>'+
    '<h2>Equipos en la competición</h2>'+
    '<main class="v26-team-list">'+
      list.map(t=>'<div class="v26-pick-row">'+v26Logo(t)+'<strong>'+t.name+'</strong><button class="'+(followed.includes(t.id)?'following':'')+'" data-v26-follow="'+t.id+'">'+(followed.includes(t.id)?'Siguiendo':'Seguir')+'</button></div>').join('')+
    '</main>'+
  '</section>';
}

function v26Bind(){
  document.querySelectorAll('[data-v26-picker]').forEach(b=>b.onclick=()=>{v26Mode='picker';v26Query='';v26Render()});
  document.querySelectorAll('[data-v26-back]').forEach(b=>b.onclick=()=>{
    if(v26Mode==='picker'){v26Mode=v26Followed().length?'following':'empty';v26Render()}
    else location.hash='#/more';
  });
  document.querySelectorAll('[data-v26-team]').forEach(b=>b.onclick=()=>{v26Active=b.dataset.v26Team;v26Render()});
  document.querySelectorAll('[data-v26-follow]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.v26Follow;
    const on=!v26Followed().includes(id);
    v26Follow(id,on);
    if(on) v26Active=id;
    v26Render();
  });
  document.querySelectorAll('[data-v26-unfollow]').forEach(b=>b.onclick=()=>{
    v26Follow(b.dataset.v26Unfollow,false);
    const left=v26Followed();
    v26Active=left[0]||'AME';
    v26Mode=left.length?'following':'empty';
    v26Render();
  });
  document.querySelectorAll('[data-v26-favorite]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.v26Favorite;
    v26Fav(id,!v26IsFav(id));
    b.classList.toggle('selected',v26IsFav(id));
  });
  const s=document.querySelector('#v26Search');
  if(s)s.oninput=()=>{v26Query=s.value;v26Render();requestAnimationFrame(()=>{const n=document.querySelector('#v26Search');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}})};
}

function v26Render(){
  if(v26Route()!=='following') return;
  const screen=document.querySelector('#screen');
  if(!screen)return;
  const followed=v26Followed();
  if(v26Mode==='auto')v26Mode=followed.length?'following':'empty';
  if(v26Mode==='following'&&!followed.length)v26Mode='empty';
  screen.innerHTML=v26Mode==='picker'?v26Picker():(v26Mode==='following'?v26Following():v26Empty());
  document.querySelectorAll('.bottom-nav .nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='more'));
  v26Bind();
}

function v26Schedule(){
  if(v26Route()!=='following'){v26Mode='auto';return}
  requestAnimationFrame(()=>requestAnimationFrame(v26Render));
}
window.addEventListener('hashchange',v26Schedule);
const v26Target=document.querySelector('#screen');
if(v26Target)new MutationObserver(()=>{if(v26Route()==='following'&&!v26Target.querySelector('[data-v26-follow]'))v26Schedule()}).observe(v26Target,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v26Schedule,{once:true});else v26Schedule();
