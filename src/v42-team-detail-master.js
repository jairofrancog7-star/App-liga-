/* V42 — Team detail / Plantilla master.
   Reconstructs the supplied mobile team screen with local league identity only. */
(function(){
  'use strict';
  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE_LOGO=BASE+'assets/liga-logo.webp';

  const TEAMS={
    AME:{name:'Club América Veteranos',city:'Juventino Rosas',logo:'assets/branding/america-veteranos-35-user.png'},
    HUE:{name:'La Huerta',city:'Juventino Rosas',logo:'assets/official-logos/la-huerta.png'},
    PRO:{name:'Promesas FC',city:'Pozos · Juventino Rosas',logo:'assets/official-logos/promesas-fc.png'},
    FRA:{name:'Franco FC',city:'Juventino Rosas',logo:'assets/official-logos/franco-fc.png'},
    GAL:{name:'Atlético Galeana',city:'Juventino Rosas',logo:'assets/official-logos/galeana.png'},
    LOB:{name:'Lobos CDG',city:'Cerrito de Gasca',logo:'assets/official-logos/lobos-cdg.png'},
    JUV:{name:'Juventino',city:'Juventino Rosas',logo:'assets/liga-logo.webp'},
    CUE:{name:'Cuenda',city:'Cuenda · Juventino Rosas',logo:'assets/teams/tc-cuenda.webp'},
    POZ:{name:'Pozos FC',city:'Pozos · Juventino Rosas',logo:'assets/teams/veteranos-pozos-fc.webp'},
    STC:{name:'Santa Cruz',city:'Juventino Rosas',logo:'assets/teams/atletico-santa-cruz.webp'},
    TAV:{name:'Franco Tavera',city:'Tavera · Juventino Rosas',logo:'assets/teams/franco-tavera-jr-veteranos.webp'},
    SJO:{name:'San José FC',city:'Juventino Rosas',logo:'assets/official-logos/san-jose-fc.png'},
    SAN:{name:'Atlético Santiago',city:'Juventino Rosas',logo:'assets/teams/atletico-santiago.webp'},
    LJR:{name:'Lobos JR',city:'Cerrito de Gasca',logo:'assets/teams/lobos-jr-cerrito-gasca.webp'},
    HER:{name:'Hermanos',city:'Juventino Rosas',logo:'assets/official-logos/hermanos.png'},
    LIN:{name:'Linces',city:'Juventino Rosas',logo:'assets/official-logos/linces.png'},
    TER:{name:'Terrícolas',city:'Juventino Rosas',logo:'assets/official-logos/terricolas.png'},
    GAC:{name:'Galácticos',city:'Pozos · Juventino Rosas',logo:'assets/teams/galacticos-pozos.webp'},
    ESP:{name:'La Esperanza',city:'Juventino Rosas',logo:'assets/official-logos/la-esperanza.png'},
    TVF:{name:'Tavera FC',city:'Tavera · Juventino Rosas',logo:'assets/official-logos/tavera-fc.png'}
  };

  const ROSTER=[
    {group:'Porteros',players:[
      ['Luis Navarro','Juventino Rosas','1',0],
      ['Mateo Reyes','Guanajuato','12',1],
      ['Emilio Soto','México','23',2]
    ]},
    {group:'Defensas',players:[
      ['Óscar Medina','Juventino Rosas','2',3],
      ['Diego Ramírez','Guanajuato','4',4],
      ['Iván Cruz','México','5',5],
      ['Jorge Salazar','Juventino Rosas','15',6],
      ['Alan Torres','Guanajuato','18',7]
    ]},
    {group:'Mediocampistas',players:[
      ['Sergio Luna','Juventino Rosas','6',8],
      ['Edgar Ruiz','Guanajuato','8',9],
      ['Marco Hernández','México','10',10],
      ['Carlos Vega','Juventino Rosas','14',11],
      ['Ángel Pérez','Guanajuato','17',12]
    ]},
    {group:'Delanteros',players:[
      ['Juan Pérez','Juventino Rosas','9',13],
      ['Miguel Torres','Guanajuato','11',14],
      ['Fernando Reyes','México','19',15],
      ['Raúl Sánchez','Juventino Rosas','21',16]
    ]}
  ];

  function route(){return location.hash.replace('#/','')||'home'}
  function selectedId(){return localStorage.getItem('v27-selected-team')||'AME'}
  function team(){return TEAMS[selectedId()]||TEAMS.AME}
  function followed(){
    try{
      const s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');
      return Array.isArray(s.followed)&&s.followed.includes(selectedId());
    }catch(e){return false}
  }
  function toggleFollow(){
    let s={};try{s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}catch(e){}
    const a=Array.isArray(s.followed)?s.followed.slice():[];
    const id=selectedId(),i=a.indexOf(id);
    if(i>=0)a.splice(i,1);else a.push(id);
    s.followed=a;localStorage.setItem('lj-store-v3',JSON.stringify(s));
  }
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function backIcon(){return '<svg viewBox="0 0 32 32"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
  function bellIcon(){return '<svg viewBox="0 0 24 24"><path d="M6 17h12l-1.4-2.3V10a4.6 4.6 0 0 0-9.2 0v4.7L6 17Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>'}
  function shareIcon(){return '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8 11 8-5M8 13l8 5"/></svg>'}
  function checkIcon(){return '<svg viewBox="0 0 20 20"><path d="m3.5 10.2 4 4.1 9-9"/></svg>'}

  function avatar(seed){
    const skin=['#b96f4a','#d59b74','#8f5539','#c47d55'][seed%4];
    const hair=['#17171d','#2b1b15','#111725','#3b2b20'][seed%4];
    const shirt=['#15a5a0','#22b5a8','#1b9f95','#38b7ac'][seed%4];
    const bg=['#f7f7fb','#f6f5f8','#fafafa','#f1f1f4'][seed%4];
    return '<span class="v42-avatar" aria-hidden="true"><svg viewBox="0 0 64 64">'+
      '<circle cx="32" cy="32" r="32" fill="'+bg+'"/>'+
      '<path d="M12 64c2-13 10-20 20-20s18 7 20 20H12Z" fill="'+shirt+'"/>'+
      '<ellipse cx="32" cy="29" rx="13" ry="15" fill="'+skin+'"/>'+
      '<path d="M18 28c0-12 6-18 14-18 10 0 15 8 14 18-3-6-8-8-13-9-5 4-10 6-15 5Z" fill="'+hair+'"/>'+
      '<circle cx="27" cy="30" r="1.4" fill="#222"/><circle cx="37" cy="30" r="1.4" fill="#222"/>'+
      '<path d="M27 37c3 2 7 2 10 0" fill="none" stroke="#7d3d2d" stroke-width="1.6" stroke-linecap="round"/>'+
      '</svg></span>';
  }

  function playerRow(p){
    return '<div class="v42-player-row">'+avatar(p[3])+
      '<div class="v42-player-copy"><strong>'+esc(p[0])+'</strong><small>'+esc(p[1])+'</small></div>'+
      '<b class="v42-number">'+esc(p[2])+'</b>'+
    '</div>';
  }

  function rosterMarkup(){
    return ROSTER.map(g=>'<section class="v42-roster-card"><h2>'+esc(g.group)+'</h2>'+
      '<div class="v42-roster-list">'+g.players.map(playerRow).join('')+'</div></section>').join('');
  }

  function markup(){
    const t=team(),isFollowing=followed();
    return '<section class="v42-team-page" data-v27-reference="teamDetail" data-v42-reference="teamDetail">'+
      '<header class="v42-hero">'+
        '<div class="v42-neon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'+
        '<div class="v42-top-actions"><button type="button" class="v42-back" data-v42-back aria-label="Volver">'+backIcon()+'</button>'+
          '<button type="button" class="v42-bell" data-v42-bell aria-label="Notificaciones">'+bellIcon()+'</button></div>'+
        '<img class="v42-team-crest" src="'+BASE+t.logo+'" alt="'+esc(t.name)+'" loading="eager" decoding="async">'+
        '<div class="v42-title"><h1>'+esc(t.name)+'</h1><p>'+esc(t.city)+'</p></div>'+
        '<div class="v42-actions">'+
          '<button type="button" class="v42-follow '+(isFollowing?'active':'')+'" data-v42-follow>'+checkIcon()+'<span>'+(isFollowing?'Siguiendo':'Seguir')+'</span></button>'+
          '<button type="button" class="v42-compare" data-v42-compare>Comparar</button>'+
          '<button type="button" class="v42-share" data-v42-share aria-label="Compartir">'+shareIcon()+'</button>'+
        '</div>'+
        '<nav class="v42-tabs" aria-label="Secciones del equipo">'+
          '<button type="button" data-v42-tab="summary">Resumen</button>'+
          '<button type="button" data-v42-tab="matches">Partidos</button>'+
          '<button type="button" data-v42-tab="standings">Clasificación</button>'+
          '<button type="button" class="active" data-v42-tab="squad">Plantilla</button>'+
          '<button type="button" data-v42-tab="stats">Estadísticas</button>'+
        '</nav>'+
      '</header>'+
      '<main class="v42-squad">'+rosterMarkup()+'</main>'+
    '</section>';
  }

  function toast(msg){
    document.querySelector('.v42-toast')?.remove();
    const n=document.createElement('div');n.className='v42-toast';n.textContent=msg;document.body.appendChild(n);
    setTimeout(()=>n.remove(),1600);
  }

  function render(){
    const active=route()==='teamDetail';
    document.body.classList.toggle('v42-team-active',active);
    if(!active)return;
    const screen=document.querySelector('#screen');if(!screen)return;
    if(!screen.querySelector('[data-v42-reference]'))screen.innerHTML=markup();
    bind();
  }

  function bind(){
    document.querySelector('[data-v42-back]')?.addEventListener('click',()=>{location.hash='#/teams'},{once:true});
    document.querySelector('[data-v42-follow]')?.addEventListener('click',()=>{toggleFollow();document.querySelector('#screen').innerHTML=markup();bind()},{once:true});
    document.querySelector('[data-v42-bell]')?.addEventListener('click',e=>{e.currentTarget.classList.toggle('active');toast(e.currentTarget.classList.contains('active')?'Alertas activadas':'Alertas desactivadas')},{once:true});
    document.querySelector('[data-v42-compare]')?.addEventListener('click',()=>toast('Comparación preparada para '+team().name),{once:true});
    document.querySelector('[data-v42-share]')?.addEventListener('click',()=>{
      const p={title:team().name,text:'Liga Municipal de Fútbol Juventino Rosas · '+team().name,url:location.href};
      if(navigator.share)navigator.share(p).catch(()=>{});
      else navigator.clipboard?.writeText(location.href).then(()=>toast('Enlace copiado'));
    },{once:true});
    document.querySelectorAll('[data-v42-tab]').forEach(b=>b.addEventListener('click',()=>{
      const tab=b.dataset.v42Tab;
      if(tab==='squad')return;
      if(tab==='standings'){location.hash='#/competition';return;}
      toast(b.textContent.trim()+' · sección disponible');
    },{once:true}));
  }

  window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>{if(route()==='teamDetail'&&!screen.querySelector('[data-v42-reference]'))requestAnimationFrame(render)}).observe(screen,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(render),{once:true});else requestAnimationFrame(render);
})();