/* PARTS25 — Siguiendo exacto según las tres referencias de Google Drive.
   Reemplaza visualmente la vista antigua de "Siguiendo" y conecta los tres estados:
   vacío -> selector de equipos -> equipo seguido / hoja de acciones. */
const V25_REF_EMPTY='./following-empty-ref.png?v=parts25';
const V25_REF_SHEET='./following-sheet-ref.png?v=parts25';
const V25_REF_PICKER='./following-picker-ref.png?v=parts25';
const V25_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
const V25_TEAM_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';

const V25_TEAMS=[
  {id:'AME',name:'América Veteranos',abbr:'AME',logo:'assets/branding/america-veteranos-35-user.png'},
  {id:'HUE',name:'La Huerta',abbr:'HUE',logo:'assets/teams/la-huerta-cuenda.webp'},
  {id:'PRO',name:'Promesas FC',abbr:'PRO',logo:'assets/teams/promesas-fc-pozos.webp'},
  {id:'GAL',name:'Atlético Galeana',abbr:'GAL',logo:'assets/teams/atletico-galeana.webp'},
  {id:'LOB',name:'Lobos CDG',abbr:'LOB',logo:'assets/teams/lobos-cdg.webp'},
  {id:'CUE',name:'Cuenda',abbr:'CUE',logo:'assets/teams/tc-cuenda.webp'},
  {id:'POZ',name:'Pozos',abbr:'POZ',logo:'assets/teams/pozos-fc.webp'},
  {id:'RIN',name:'Rincón de Centeno',abbr:'RIN',logo:''},
  {id:'ROS',name:'Deportivo Rosas',abbr:'ROS',logo:''},
  {id:'STC',name:'Santa Cruz',abbr:'STC',logo:'assets/teams/atletico-santa-cruz.webp'},
  {id:'SJO',name:'San José',abbr:'SJO',logo:'assets/teams/san-jose.webp'},
  {id:'SIS',name:'San Isidro',abbr:'SIS',logo:''},
  {id:'RJU',name:'Real Juventino',abbr:'RJU',logo:''},
  {id:'VAL',name:'Valle Verde',abbr:'VAL',logo:''},
  {id:'LAB',name:'La Labor',abbr:'LAB',logo:''},
  {id:'DUR',name:'El Durazno',abbr:'DUR',logo:''},
  {id:'SAN',name:'San Antonio',abbr:'SAN',logo:'assets/teams/san-antonio-jr.webp'},
  {id:'ARC',name:'Los Arcos',abbr:'ARC',logo:''},
  {id:'JUV',name:'Deportivo Juventino',abbr:'JUV',logo:''},
  {id:'PAL',name:'Las Palomas',abbr:'PAL',logo:''},
  {id:'FRA',name:'Franco FC',abbr:'FRA',logo:'assets/teams/franco-fc.webp'},
  {id:'EST',name:'La Estancia',abbr:'EST',logo:''}
];

let v25Mode='auto';
let v25ActiveTeam='AME';
let v25Search='';

function v25Route(){return location.hash.replace('#/','')||'home'}

function v25ReadStore(){
  try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}
  catch{return {}}
}
function v25WriteStore(next){
  localStorage.setItem('lj-store-v3',JSON.stringify(next));
}
function v25Followed(){
  const s=v25ReadStore();
  return Array.isArray(s.followed)?s.followed:[];
}
function v25Favorites(){
  const s=v25ReadStore();
  return Array.isArray(s.favorites)?s.favorites:[];
}
function v25Team(id){return V25_TEAMS.find(t=>t.id===id)||V25_TEAMS[0]}
function v25IsFollowed(id){return v25Followed().includes(id)}
function v25IsFavorite(id){return v25Favorites().includes('team:'+id)}

function v25SetFollow(id,on){
  const s=v25ReadStore();
  const arr=Array.isArray(s.followed)?s.followed.slice():[];
  s.followed=on?[...new Set([...arr,id])]:arr.filter(x=>x!==id);
  v25WriteStore(s);
}
function v25SetFavorite(id,on){
  const s=v25ReadStore();
  const key='team:'+id;
  const arr=Array.isArray(s.favorites)?s.favorites.slice():[];
  s.favorites=on?[...new Set([...arr,key])]:arr.filter(x=>x!==key);
  v25WriteStore(s);
}

function v25NavHotspots(){
  return '<div class="v25-nav-hotspots" aria-label="Navegación principal">'+
    '<button data-v25-route="home" aria-label="Inicio"></button>'+
    '<button data-v25-route="competition" aria-label="Competición"></button>'+
    '<button data-v25-route="video" aria-label="Vídeo"></button>'+
    '<button data-v25-route="fantasy" aria-label="Fantasy"></button>'+
    '<button data-v25-route="more" aria-label="Más"></button>'+
  '</div>';
}

function v25TeamVisual(t,cls=''){
  if(t.logo) return '<img class="v25-team-logo '+cls+'" src="'+V25_TEAM_BASE+t.logo+'" alt="'+t.name+'">';
  return '<span class="v25-team-fallback '+cls+'">'+t.abbr+'</span>';
}

function v25EmptyMarkup(){
  return '<section class="v25-following v25-empty" data-v25-following>'+
    '<img class="v25-ref v25-ref-empty" src="'+V25_REF_EMPTY+'" alt="" aria-hidden="true">'+
    '<button class="v25-hit v25-back" data-v25-route="more" aria-label="Volver"></button>'+
    '<button class="v25-hit v25-plus" data-v25-open-picker aria-label="Añadir equipos"></button>'+
    '<button class="v25-hit v25-add" data-v25-open-picker aria-label="Añadir equipos"></button>'+
    v25NavHotspots()+
  '</section>';
}

function v25PickerMarkup(){
  const followed=v25Followed();
  return '<section class="v25-following v25-picker" data-v25-following>'+
    '<img class="v25-ref v25-ref-picker" src="'+V25_REF_PICKER+'" alt="" aria-hidden="true">'+
    '<input class="v25-picker-search" type="search" inputmode="search" autocomplete="off" value="'+v25Search.replace(/"/g,'&quot;')+'" placeholder="Buscar equipos" aria-label="Buscar equipos">'+
    '<button class="v25-hit v25-picker-close" data-v25-close-picker aria-label="Cerrar"></button>'+
    '<div class="v25-picker-hits">'+
      V25_TEAMS.map((t,i)=>'<button class="v25-picker-hit '+(followed.includes(t.id)?'is-followed':'')+'" style="--i:'+i+'" data-v25-follow="'+t.id+'" aria-label="'+(followed.includes(t.id)?'Dejar de seguir a ':'Seguir a ')+t.name+'">'+(followed.includes(t.id)?'<span>Siguiendo</span>':'')+'</button>').join('')+
    '</div>'+
    '<div class="v25-search-results" data-v25-search-results></div>'+
    v25NavHotspots()+
  '</section>';
}

function v25SheetMarkup(){
  const list=v25Followed();
  if(!list.length) return v25EmptyMarkup();
  if(!list.includes(v25ActiveTeam)) v25ActiveTeam=list[0];
  const t=v25Team(v25ActiveTeam);
  const fav=v25IsFavorite(t.id);
  const dynamic=t.id!=='AME'
    ?'<div class="v25-dyn-top-team">'+v25TeamVisual(t)+'<strong>'+t.name+'</strong><span>Siguiendo</span></div>'+
     '<div class="v25-dyn-sheet-team">'+v25TeamVisual(t)+'<strong>'+t.name+'</strong></div>'
    :'';
  return '<section class="v25-following v25-sheet" data-v25-following>'+
    '<img class="v25-ref v25-ref-sheet" src="'+V25_REF_SHEET+'" alt="" aria-hidden="true">'+
    dynamic+
    '<button class="v25-hit v25-back" data-v25-route="more" aria-label="Volver"></button>'+
    '<button class="v25-hit v25-plus" data-v25-open-picker aria-label="Añadir equipos"></button>'+
    '<button class="v25-hit v25-sheet-row" data-v25-sheet-team aria-label="'+t.name+'"></button>'+
    '<button class="v25-hit v25-favorite '+(fav?'is-favorite':'')+'" data-v25-favorite="'+t.id+'" aria-label="Equipo favorito">'+(fav?'<span>★</span>':'')+'</button>'+
    '<button class="v25-hit v25-unfollow" data-v25-unfollow="'+t.id+'" aria-label="Dejar de seguir"></button>'+
    v25NavHotspots()+
  '</section>';
}

function v25ResultsMarkup(q){
  const query=(q||'').trim().toLocaleLowerCase('es');
  if(!query) return '';
  const hits=V25_TEAMS.filter(t=>t.name.toLocaleLowerCase('es').includes(query)||t.abbr.toLowerCase().includes(query));
  return '<div class="v25-results-card">'+
    (hits.length?hits.map(t=>'<div class="v25-result-row">'+v25TeamVisual(t)+
      '<strong>'+t.name+'</strong>'+
      '<button data-v25-follow="'+t.id+'" class="'+(v25IsFollowed(t.id)?'is-followed':'')+'">'+(v25IsFollowed(t.id)?'Siguiendo':'Seguir')+'</button>'+
    '</div>').join(''):'<div class="v25-no-results">No se encontraron equipos</div>')+
  '</div>';
}

function v25Bind(){
  document.querySelectorAll('[data-v25-route]').forEach(btn=>{
    btn.onclick=()=>{location.hash='#/'+btn.dataset.v25Route};
  });
  document.querySelectorAll('[data-v25-open-picker]').forEach(btn=>{
    btn.onclick=()=>{v25Mode='picker';v25Search='';v25Render()};
  });
  const close=document.querySelector('[data-v25-close-picker]');
  if(close) close.onclick=()=>{v25Mode=v25Followed().length?'sheet':'empty';v25Render()};

  document.querySelectorAll('[data-v25-follow]').forEach(btn=>{
    btn.onclick=(e)=>{
      e.preventDefault();e.stopPropagation();
      const id=btn.dataset.v25Follow;
      const on=!v25IsFollowed(id);
      v25SetFollow(id,on);
      if(on){
        v25ActiveTeam=id;
        v25Mode='sheet';
      }else{
        const left=v25Followed();
        v25ActiveTeam=left[0]||'AME';
        v25Mode=left.length?'sheet':'empty';
      }
      v25Render();
    };
  });

  const search=document.querySelector('.v25-picker-search');
  if(search){
    search.oninput=()=>{
      v25Search=search.value;
      const target=document.querySelector('[data-v25-search-results]');
      if(target){
        target.innerHTML=v25ResultsMarkup(v25Search);
        target.classList.toggle('show',Boolean(v25Search.trim()));
        target.querySelectorAll('[data-v25-follow]').forEach(btn=>{
          btn.onclick=(e)=>{
            e.preventDefault();e.stopPropagation();
            const id=btn.dataset.v25Follow;
            const on=!v25IsFollowed(id);
            v25SetFollow(id,on);
            if(on){v25ActiveTeam=id;v25Mode='sheet';v25Render()}
            else {target.innerHTML=v25ResultsMarkup(v25Search)}
          };
        });
      }
    };
  }

  document.querySelectorAll('[data-v25-favorite]').forEach(btn=>{
    btn.onclick=(e)=>{
      e.preventDefault();e.stopPropagation();
      const id=btn.dataset.v25Favorite;
      v25SetFavorite(id,!v25IsFavorite(id));
      v25Render();
    };
  });
  document.querySelectorAll('[data-v25-unfollow]').forEach(btn=>{
    btn.onclick=(e)=>{
      e.preventDefault();e.stopPropagation();
      const id=btn.dataset.v25Unfollow;
      v25SetFollow(id,false);
      const left=v25Followed();
      v25ActiveTeam=left[0]||'AME';
      v25Mode=left.length?'sheet':'empty';
      v25Render();
    };
  });
}

function v25Render(){
  if(v25Route()!=='following') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  const followed=v25Followed();
  if(v25Mode==='auto') v25Mode=followed.length?'sheet':'empty';
  if(v25Mode==='sheet'&&!followed.length) v25Mode='empty';

  if(v25Mode==='picker') screen.innerHTML=v25PickerMarkup();
  else if(v25Mode==='sheet') screen.innerHTML=v25SheetMarkup();
  else screen.innerHTML=v25EmptyMarkup();

  document.querySelectorAll('.bottom-nav .nav-item').forEach(n=>n.classList.remove('active'));
  const more=document.querySelector('.bottom-nav .nav-item[data-route="more"]');
  if(more) more.classList.add('active');
  v25Bind();
}

function v25Schedule(){
  if(v25Route()!=='following'){v25Mode='auto';return}
  requestAnimationFrame(()=>requestAnimationFrame(v25Render));
}

window.addEventListener('hashchange',v25Schedule);
const v25Screen=document.querySelector('#screen');
if(v25Screen){
  new MutationObserver(()=>{
    if(v25Route()==='following'&&!v25Screen.querySelector('[data-v25-following]')) v25Schedule();
  }).observe(v25Screen,{childList:true,subtree:false});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',v25Schedule,{once:true});
else v25Schedule();
