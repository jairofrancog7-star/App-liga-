/* PARTS28 — Siguiendo reconstruido como UI real, tomando las 3 capturas
   y el video del usuario como referencia visual/funcional.
   IMPORTANTE: no se usa ninguna captura completa como fondo de pantalla. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE=BASE+'assets/liga-logo.webp';

  const TEAMS=[
    {id:'AME',name:'América Veteranos',logo:'assets/branding/america-veteranos-35.svg',abbr:'AME'},
    {id:'HUE',name:'La Huerta',logo:'assets/teams/la-huerta-cuenda.webp',abbr:'HUE'},
    {id:'PRO',name:'Promesas FC',logo:'assets/teams/promesas-fc-pozos.webp',abbr:'PRO'},
    {id:'GAL',name:'Atlético Galeana',logo:'assets/teams/atletico-galeana.webp',abbr:'GAL'},
    {id:'LOB',name:'Lobos CDG',logo:'assets/teams/lobos-cdg.webp',abbr:'LOB'},
    {id:'CUE',name:'Cuenda',logo:'assets/teams/tc-cuenda.webp',abbr:'CUE'},
    {id:'POZ',name:'Pozos FC',logo:'assets/teams/veteranos-pozos-fc.webp',abbr:'POZ'},
    {id:'RIN',name:'Rincón de Centeno',logo:'',abbr:'RIN'},
    {id:'ROS',name:'Deportivo Rosas',logo:'',abbr:'ROS'},
    {id:'STC',name:'Santa Cruz',logo:'assets/teams/atletico-santa-cruz.webp',abbr:'STC'},
    {id:'SJO',name:'San José',logo:'assets/teams/san-jose.webp',abbr:'SJO'},
    {id:'SIS',name:'San Isidro',logo:'',abbr:'SIS'},
    {id:'RJU',name:'Real Juventino',logo:'assets/teams/juventus.webp',abbr:'RJU'},
    {id:'VAL',name:'Valle Verde',logo:'',abbr:'VAL'},
    {id:'LAB',name:'La Labor',logo:'',abbr:'LAB'},
    {id:'DUR',name:'El Durazno',logo:'',abbr:'DUR'},
    {id:'SAN',name:'San Antonio',logo:'assets/teams/san-antonio-jr.webp',abbr:'SAN'},
    {id:'ARC',name:'Los Arcos',logo:'',abbr:'ARC'},
    {id:'JUV',name:'Deportivo Juventino',logo:'assets/teams/juventus.webp',abbr:'JUV'},
    {id:'PAL',name:'Las Palomas',logo:'',abbr:'PAL'},
    {id:'FRA',name:'Franco FC',logo:'assets/teams/franco-fc.webp',abbr:'FRA'},
    {id:'EST',name:'La Estancia',logo:'',abbr:'EST'},
    {id:'CGS',name:'C. de Gasca',logo:'assets/teams/deportivo-cg.webp',abbr:'CGS'},
    {id:'J35',name:'Juventus',logo:'assets/official-logos/juventus.png',abbr:'JUV'},
    {id:'BOA',name:'Boavista',logo:'assets/official-logos/boavista.png',abbr:'BOA'},
    {id:'PSV',name:'PSV',logo:'assets/teams/psv.webp',abbr:'PSV'},
    {id:'AST',name:'A. Santiago',logo:'assets/teams/atletico-santiago.webp',abbr:'AST'},
    {id:'TAV',name:'F. Tavera',logo:'assets/teams/franco-tavera-jr-veteranos.webp',abbr:'TAV'},
    {id:'HUR',name:'Huracán',logo:'',abbr:'HUR'}
  ];

  let pickerOpen=false;
  let sheetOpen=false;
  let activeTeam='AME';
  let searchText='';

  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function store(){try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}catch(e){return {}}}
  function saveStore(s){localStorage.setItem('lj-store-v3',JSON.stringify(s))}
  function followed(){
    const a=store().followed;
    return Array.isArray(a)?a:[];
  }
  function favorites(){
    const a=store().favorites;
    return Array.isArray(a)?a:[];
  }
  function isFollowed(id){return followed().includes(id)}
  function isFavorite(id){return favorites().includes('team:'+id)}
  function team(id){return TEAMS.find(t=>t.id===id)||TEAMS[0]}

  function migrateOldState(){
    const s=store();
    const current=Array.isArray(s.followed)?s.followed:[];
    if(current.length)return;
    try{
      if(localStorage.getItem('lj-following-reference-state-v27')==='followed'){
        s.followed=['AME'];
        saveStore(s);
      }
    }catch(e){}
  }

  function setFollow(id,on){
    const s=store();
    const a=Array.isArray(s.followed)?s.followed.slice():[];
    s.followed=on?[...new Set([...a,id])]:a.filter(x=>x!==id);
    saveStore(s);
  }
  function setFavorite(id,on){
    const s=store();
    const key='team:'+id;
    const a=Array.isArray(s.favorites)?s.favorites.slice():[];
    s.favorites=on?[...new Set([...a,key])]:a.filter(x=>x!==key);
    saveStore(s);
  }

  function backIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M24 8 12 20l12 12M13 20h20"/></svg>'}
  function plusIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 8v24M8 20h24"/></svg>'}
  function searchIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="17" cy="17" r="9.5"/><path d="m24 24 8 8"/></svg>'}
  function starIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 5 4.5 9.1 10 1.5-7.2 7 1.7 10-9-4.7-9 4.7 1.7-10-7.2-7 10-1.5Z"/></svg>'}

  function logo(t,extra=''){
    const cls='v28-logo '+extra;
    if(t.logo){
      return '<span class="'+cls+'"><img src="'+BASE+t.logo+'" alt="'+esc(t.name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v28-fallback" style="display:none">'+esc(t.abbr)+'</span></span>';
    }
    return '<span class="'+cls+'"><span class="v28-fallback">'+esc(t.abbr)+'</span></span>';
  }

  function neon(){
    return '<div class="v28-neon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>';
  }

  function header(){
    return '<header class="v28-head">'+
      '<button class="v28-icon-btn back" data-v28-back aria-label="Volver">'+backIcon()+'</button>'+
      '<h1>Siguiendo</h1>'+
      '<button class="v28-icon-btn plus" data-v28-picker aria-label="Añadir equipos">'+plusIcon()+'</button>'+
    '</header>';
  }

  function emptyMarkup(){
    return '<section class="v28-follow-page v28-empty" data-v28-following>'+
      neon()+header()+
      '<main class="v28-empty-main">'+
        '<img class="v28-league-logo" src="'+LEAGUE+'" alt="Liga Municipal de Fútbol Juventino Rosas">'+
        '<h2>Sin equipos seguidos todavía</h2>'+
        '<p>¡Sigue a los equipos de la Liga Municipal<br>de Fútbol Juventino Rosas para acceder<br>rápidamente a noticias, alertas de partidos<br>y resúmenes en video!</p>'+
        '<button class="v28-add" data-v28-picker><span>＋</span>Añadir equipos</button>'+
      '</main>'+
      '<div class="v28-side-notch" aria-hidden="true"></div>'+
    '</section>';
  }

  function followedMarkup(){
    const ids=followed();
    if(!ids.length)return emptyMarkup();
    if(!ids.includes(activeTeam))activeTeam=ids[0];
    return '<section class="v28-follow-page v28-followed" data-v28-following>'+
      neon()+header()+
      '<main class="v28-follow-list">'+
        ids.map(id=>{
          const t=team(id);
          return '<div class="v28-follow-row">'+
            '<button class="v28-team-link" data-v28-team="'+id+'">'+logo(t)+'<strong>'+esc(t.name)+'</strong></button>'+
            '<button class="v28-following-pill" data-v28-menu="'+id+'">Siguiendo</button>'+
          '</div>';
        }).join('')+
      '</main>'+
      '<div class="v28-side-notch" aria-hidden="true"></div>'+
      (sheetOpen?actionSheet():'')+
    '</section>';
  }

  function actionSheet(){
    const t=team(activeTeam);
    const fav=isFavorite(t.id);
    return '<div class="v28-sheet-layer" data-v28-sheet>'+
      '<button class="v28-sheet-backdrop" data-v28-close-sheet aria-label="Cerrar"></button>'+
      '<section class="v28-sheet" role="dialog" aria-modal="true" aria-label="Opciones de '+esc(t.name)+'">'+
        '<div class="v28-sheet-team">'+logo(t,'big')+'<strong>'+esc(t.name)+'</strong></div>'+
        '<div class="v28-divider"></div>'+
        '<button class="v28-sheet-action '+(fav?'selected':'')+'" data-v28-favorite="'+t.id+'">'+starIcon()+'<span>Equipo favorito</span></button>'+
        '<button class="v28-sheet-action" data-v28-unfollow="'+t.id+'"><b>−</b><span>Dejar de seguir</span></button>'+
      '</section>'+
    '</div>';
  }

  function pickerMarkup(){
    const q=searchText.trim().toLocaleLowerCase('es');
    const list=TEAMS.filter(t=>!q||t.name.toLocaleLowerCase('es').includes(q)||t.id.toLowerCase().includes(q));
    const f=followed();
    return '<section class="v28-follow-page v28-picker" data-v28-following>'+
      '<header class="v28-picker-top">'+
        '<div class="v28-search">'+searchIcon()+'<input id="v28Search" type="search" autocomplete="off" placeholder="Buscar equipos" value="'+esc(searchText)+'"></div>'+
        '<button class="v28-close" data-v28-close-picker aria-label="Cerrar">×</button>'+
      '</header>'+
      '<h2>Equipos en la competición</h2>'+
      '<main class="v28-picker-list">'+
        list.map(t=>'<div class="v28-picker-row">'+
          logo(t)+
          '<strong>'+esc(t.name)+'</strong>'+
          '<button class="v28-picker-follow '+(f.includes(t.id)?'following':'')+'" data-v28-follow="'+t.id+'">'+(f.includes(t.id)?'Siguiendo':'Seguir')+'</button>'+
        '</div>').join('')+
      '</main>'+
      '<div class="v28-side-notch" aria-hidden="true"></div>'+
    '</section>';
  }

  function setNav(){
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const labels={home:'Inicio',competition:'Competición',video:'Video',fantasy:'Fantasy',more:'Más'};
    nav.querySelectorAll('.nav-item').forEach(n=>{
      n.classList.toggle('active',n.dataset.route==='more');
      const s=n.querySelector('small');
      if(s&&labels[n.dataset.route])s.textContent=labels[n.dataset.route];
    });
  }

  function restoreNav(){
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const labels={home:'INICIO',competition:'COMPETICIÓN',video:'VÍDEO',fantasy:'FANTASY',more:'MÁS'};
    nav.querySelectorAll('.nav-item').forEach(n=>{
      const s=n.querySelector('small');
      if(s&&labels[n.dataset.route])s.textContent=labels[n.dataset.route];
    });
  }

  function bind(){
    document.querySelectorAll('[data-v28-back]').forEach(b=>b.onclick=()=>{location.hash='#/more'});
    document.querySelectorAll('[data-v28-picker]').forEach(b=>b.onclick=()=>{
      pickerOpen=true;sheetOpen=false;searchText='';render();
    });
    const closePicker=document.querySelector('[data-v28-close-picker]');
    if(closePicker)closePicker.onclick=()=>{pickerOpen=false;searchText='';render()};

    document.querySelectorAll('[data-v28-menu]').forEach(b=>b.onclick=()=>{
      activeTeam=b.dataset.v28Menu;
      sheetOpen=true;
      render();
    });
    document.querySelectorAll('[data-v28-team]').forEach(b=>b.onclick=()=>{
      activeTeam=b.dataset.v28Team;
      sheetOpen=true;
      render();
    });
    const closeSheet=document.querySelector('[data-v28-close-sheet]');
    if(closeSheet)closeSheet.onclick=()=>{sheetOpen=false;render()};

    const search=document.querySelector('#v28Search');
    if(search){
      search.oninput=()=>{
        searchText=search.value;
        render();
        requestAnimationFrame(()=>{
          const n=document.querySelector('#v28Search');
          if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}
        });
      };
    }

    document.querySelectorAll('[data-v28-follow]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.v28Follow;
      if(isFollowed(id)){
        activeTeam=id;
        pickerOpen=false;
        sheetOpen=true;
        render();
      }else{
        setFollow(id,true);
        activeTeam=id;
        render();
      }
    });

    document.querySelectorAll('[data-v28-favorite]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.v28Favorite;
      setFavorite(id,!isFavorite(id));
      render();
    });

    document.querySelectorAll('[data-v28-unfollow]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.v28Unfollow;
      setFollow(id,false);
      sheetOpen=false;
      const left=followed();
      activeTeam=left[0]||'AME';
      render();
    });
  }

  function render(){
    if(route()!=='following')return;
    migrateOldState();
    const screen=document.querySelector('#screen');
    if(!screen)return;
    document.body.classList.toggle('v28-follow-sheet-open',sheetOpen);
    document.body.classList.toggle('v28-follow-picker-open',pickerOpen);
    screen.innerHTML=pickerOpen?pickerMarkup():(followed().length?followedMarkup():emptyMarkup());
    setNav();
    bind();
    if(!pickerOpen)screen.scrollTop=0;
  }

  function schedule(){
    if(route()!=='following'){
      pickerOpen=false;sheetOpen=false;searchText='';
      document.body.classList.remove('v28-follow-sheet-open','v28-follow-picker-open');
      restoreNav();
      return;
    }
    requestAnimationFrame(()=>requestAnimationFrame(render));
  }

  window.addEventListener('hashchange',schedule);
  const target=document.querySelector('#screen');
  if(target){
    new MutationObserver(()=>{
      if(route()==='following'&&!target.querySelector('[data-v28-following]'))schedule();
    }).observe(target,{childList:true,subtree:false});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();