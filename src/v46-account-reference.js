/* V46 — Tu cuenta: Notificaciones + Siguiendo según referencias Drive. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const TEAM_MAP={
    AME:{name:'América Veteranos',logo:'assets/branding/america-veteranos-35-user.png'},
    HUE:{name:'La Huerta',logo:'assets/teams/la-huerta-cuenda.webp'},
    PRO:{name:'Promesas FC',logo:'assets/teams/promesas-fc-pozos.webp'},
    GAL:{name:'Atlético Galeana',logo:'assets/teams/atletico-galeana.webp'},
    LOB:{name:'Lobos CDG',logo:'assets/teams/lobos-cdg.webp'},
    CUE:{name:'Cuenda',logo:'assets/official-logos/toros-de-cuenda.png'},
    POZ:{name:'Pozos FC',logo:'assets/teams/veteranos-pozos-fc.webp'},
    FRA:{name:'Franco FC',logo:'assets/teams/franco-fc.webp'},
    STC:{name:'Santa Cruz',logo:'assets/teams/atletico-santa-cruz.webp'}
  };
  const DEFAULT_TEAM={id:'AME',...TEAM_MAP.AME};
  const NOTIF_DEFAULTS={
    fantasy:false,predictor:false,quiz:false,moreless:false,
    news:true,tickets:true,hospitality:false
  };

  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function store(){try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}catch{return {}}}
  function saveStore(s){localStorage.setItem('lj-store-v3',JSON.stringify(s))}
  function notifPrefs(){
    let p={};try{p=JSON.parse(localStorage.getItem('lj-account-notifications-v46')||'{}')||{}}catch{}
    return {...NOTIF_DEFAULTS,...p};
  }
  function saveNotifPrefs(p){localStorage.setItem('lj-account-notifications-v46',JSON.stringify(p))}
  function followedIds(){
    const a=store().followed;
    return Array.isArray(a)?a:[];
  }
  function setFollow(id,on){
    const s=store();
    const a=Array.isArray(s.followed)?s.followed.slice():[];
    s.followed=on?[...new Set([...a,id])]:a.filter(x=>x!==id);
    saveStore(s);
  }
  function teamFromId(id){
    const t=TEAM_MAP[id]||DEFAULT_TEAM;
    return {id,...t};
  }
  function visibleTeams(){
    const ids=followedIds().filter(id=>TEAM_MAP[id]);
    return ids.length?ids.map(teamFromId):[DEFAULT_TEAM];
  }
  function backIcon(){return '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M29 10 15 24l14 14M16 24h23"/></svg>'}
  function plusIcon(){return '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10v28M10 24h28"/></svg>'}
  function chevron(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m12 7 9 9-9 9"/></svg>'}
  function logo(t,cls=''){return '<img class="'+cls+'" src="'+BASE+t.logo+'" alt="'+esc(t.name)+'" loading="eager" decoding="async">'}

  function originFor(routeName){
    try{
      const raw=sessionStorage.getItem('lj-account-origin-v46');
      if(raw){
        const o=JSON.parse(raw);
        if(o.route===routeName&&o.from)return o.from;
      }
    }catch{}
    return routeName==='notifications'?'profile':'more';
  }

  document.addEventListener('click',function(e){
    const profile=e.target.closest('[data-v12-profile]');
    const child=e.target.closest('[data-v12-route="following"],[data-v12-route="notifications"]');
    if(profile&&child){
      try{sessionStorage.setItem('lj-account-origin-v46',JSON.stringify({route:child.dataset.v12Route,from:'profile'}))}catch{}
      return;
    }
    const more=e.target.closest('[data-route="following"],[data-safe-route="notifications"]');
    if(more){
      const r=more.dataset.route||'notifications';
      try{sessionStorage.setItem('lj-account-origin-v46',JSON.stringify({route:r,from:'more'}))}catch{}
    }
  },true);

  function notificationsMarkup(){
    const p=notifPrefs();
    const team=visibleTeams()[0]||DEFAULT_TEAM;
    const enabled=[p.news,p.tickets,p.hospitality,p.fantasy,p.predictor,p.quiz,p.moreless].filter(Boolean).length;
    function sw(key,label){
      return '<label class="v46-switch-row"><span>'+label+'</span>'+
        '<input type="checkbox" data-v46-notif="'+key+'" '+(p[key]?'checked':'')+'>'+
        '<i aria-hidden="true"></i></label>';
    }
    return '<section class="v46-account-page v46-notifications" data-v46-account="notifications">'+
      '<header class="v46-notif-head">'+
        '<button type="button" class="v46-back" data-v46-back aria-label="Volver">'+backIcon()+'</button>'+
        '<h1>Notificaciones</h1>'+
      '</header>'+
      '<p class="v46-notif-intro">Elige las notificaciones que te gustaría recibir.</p>'+
      '<div class="v46-section v46-teams-section">'+
        '<h2>Equipos</h2>'+
        '<button class="v46-team-notif" type="button" data-v46-open-following>'+
          logo(team,'v46-team-logo')+
          '<span class="v46-team-copy"><strong>'+esc(team.name)+'</strong><small>'+enabled+'/7 notificaciones elegidas</small></span>'+
          '<span class="v46-team-chevron">'+chevron()+'</span>'+
        '</button>'+
      '</div>'+
      '<div class="v46-section v46-games-section">'+
        '<h2>Juegos</h2>'+
        sw('fantasy','Fantasy Football')+
        sw('predictor','Quiniela')+
        sw('quiz','Quiz')+
        sw('moreless','Más o Menos')+
      '</div>'+
      '<div class="v46-section v46-general-section">'+
        '<h2>General</h2>'+
        sw('news','Noticias')+
        sw('tickets','Ofertas de entradas y patrocinadores')+
        sw('hospitality','Hospitalidad')+
      '</div>'+
    '</section>';
  }

  function followingMarkup(){
    const teams=visibleTeams();
    const followed=new Set(followedIds());
    return '<section class="v46-account-page v46-following" data-v46-account="following" data-v28-following>'+
      '<header class="v46-follow-head">'+
        '<button type="button" class="v46-back" data-v46-back aria-label="Volver">'+backIcon()+'</button>'+
        '<h1>Siguiendo</h1>'+
        '<button type="button" class="v46-plus" data-v46-add aria-label="Añadir equipo">'+plusIcon()+'</button>'+
      '</header>'+
      '<main class="v46-follow-list">'+
        teams.map(function(t){
          const on=followed.has(t.id)||(!followed.size&&t.id==='AME');
          return '<div class="v46-follow-row">'+
            '<div class="v46-follow-team">'+logo(t,'v46-follow-logo')+'<strong>'+esc(t.name)+'</strong></div>'+
            '<button type="button" class="v46-follow-pill '+(on?'active':'')+'" data-v46-follow="'+t.id+'">'+(on?'Siguiendo':'Seguir')+'</button>'+
          '</div>';
        }).join('')+
      '</main>'+
      '<div class="v46-side-notch" aria-hidden="true"></div>'+
    '</section>';
  }

  function bind(){
    document.querySelectorAll('[data-v46-back]').forEach(function(b){
      b.onclick=function(){
        const r=route();
        location.hash='#/'+originFor(r);
      };
    });
    const openFollowing=document.querySelector('[data-v46-open-following]');
    if(openFollowing)openFollowing.onclick=function(){
      try{sessionStorage.setItem('lj-account-origin-v46',JSON.stringify({route:'following',from:'notifications'}))}catch{}
      location.hash='#/following';
    };
    const add=document.querySelector('[data-v46-add]');
    if(add)add.onclick=function(){
      try{sessionStorage.setItem('lj-account-origin-v46',JSON.stringify({route:'teams',from:'following'}))}catch{}
      location.hash='#/teams';
    };
    document.querySelectorAll('[data-v46-notif]').forEach(function(inp){
      inp.onchange=function(){
        const p=notifPrefs();
        p[inp.dataset.v46Notif]=inp.checked;
        saveNotifPrefs(p);
        const small=document.querySelector('.v46-team-copy small');
        if(small){
          const n=[p.news,p.tickets,p.hospitality,p.fantasy,p.predictor,p.quiz,p.moreless].filter(Boolean).length;
          small.textContent=n+'/7 notificaciones elegidas';
        }
      };
    });
    document.querySelectorAll('[data-v46-follow]').forEach(function(btn){
      btn.onclick=function(){
        const id=btn.dataset.v46Follow;
        const on=btn.classList.contains('active');
        setFollow(id,!on);
        btn.classList.toggle('active',!on);
        btn.textContent=!on?'Siguiendo':'Seguir';
      };
    });
  }

  function takeover(){
    const r=route();
    if(r!=='notifications'&&r!=='following'){
      document.body.classList.remove('v46-account-active','v46-notifications-active','v46-following-active');
      return;
    }
    const screen=document.querySelector('#screen');
    if(!screen)return;
    document.body.classList.add('v46-account-active');
    document.body.classList.toggle('v46-notifications-active',r==='notifications');
    document.body.classList.toggle('v46-following-active',r==='following');
    const expected=r;
    if(screen.querySelector('[data-v46-account="'+expected+'"]'))return;
    screen.innerHTML=r==='notifications'?notificationsMarkup():followingMarkup();
    window.scrollTo(0,0);
    bind();
  }

  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(takeover))}
  window.addEventListener('hashchange',schedule);
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(function(){
    const r=route();
    if((r==='notifications'||r==='following')&&!screen.querySelector('[data-v46-account="'+r+'"]'))schedule();
  }).observe(screen,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();