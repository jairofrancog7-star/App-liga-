/* V46 — Tu cuenta: Notificaciones + Siguiendo según referencias Drive. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const TEAM_MAP={
  "OFF-MANCHESTER": {
    "name": "MANCHESTER",
    "logo": "assets/official-logos/manchester.png"
  },
  "OFF-DYNAMO": {
    "name": "DYNAMO",
    "logo": "assets/official-logos/dynamo.png"
  },
  "OFF-LA-ESPERANZA": {
    "name": "LA ESPERANZA",
    "logo": "assets/official-logos/la-esperanza.png"
  },
  "OFF-BOAVISTA": {
    "name": "BOAVISTA",
    "logo": "assets/official-logos/boavista.png"
  },
  "OFF-TOROS-DE-CUENDA": {
    "name": "TOROS DE CUENDA",
    "logo": "assets/official-logos/toros-de-cuenda.png"
  },
  "OFF-BOCA-JRS": {
    "name": "BOCA JRS",
    "logo": "assets/liga-logo.webp"
  },
  "OFF-SAN-JOSE-FC": {
    "name": "SAN JOSE FC",
    "logo": "assets/official-logos/san-jose-fc.png"
  },
  "OFF-JUVENTUS": {
    "name": "JUVENTUS",
    "logo": "assets/official-logos/juventus.png"
  },
  "OFF-HERMANOS": {
    "name": "HERMANOS",
    "logo": "assets/official-logos/hermanos.png"
  },
  "OFF-LINCES": {
    "name": "LINCES",
    "logo": "assets/official-logos/linces.png"
  },
  "OFF-NAPOLI": {
    "name": "NAPOLI",
    "logo": "assets/official-logos/napoli.png"
  },
  "OFF-FRANCO-FC": {
    "name": "FRANCO FC",
    "logo": "assets/official-logos/franco-fc.png"
  },
  "OFF-HERRERAS-FC": {
    "name": "HERRERAS FC",
    "logo": "assets/official-logos/herreras-fc.png"
  },
  "OFF-ABEJAS": {
    "name": "ABEJAS",
    "logo": "assets/official-logos/abejas.png"
  },
  "OFF-LOBOS-CDG": {
    "name": "LOBOS CDG",
    "logo": "assets/official-logos/lobos-cdg.png"
  },
  "OFF-TERRICOLAS": {
    "name": "TERRICOLAS",
    "logo": "assets/official-logos/terricolas.png"
  },
  "OFF-GALACTICOS": {
    "name": "GALACTICOS",
    "logo": "assets/teams/galacticos-pozos.webp"
  },
  "OFF-SAN-JULIAN": {
    "name": "SAN JULIAN",
    "logo": "assets/official-logos/san-julian.png"
  },
  "OFF-SAN-JUAN-FC": {
    "name": "SAN JUAN FC",
    "logo": "assets/official-logos/san-juan-fc.png"
  },
  "OFF-SAN-JOSE-JRS": {
    "name": "SAN JOSE JRS",
    "logo": "assets/official-logos/san-jose-jrs.png"
  },
  "OFF-TAVERA-FC": {
    "name": "TAVERA FC",
    "logo": "assets/official-logos/tavera-fc.png"
  },
  "OFF-CELTICOS": {
    "name": "CELTICOS",
    "logo": "assets/official-logos/celticos.png"
  },
  "OFF-DEP-NOPALERO": {
    "name": "DEP. NOPALERO",
    "logo": "assets/official-logos/dep-nopalero.png"
  },
  "OFF-PACHANGAS-FC": {
    "name": "PACHANGAS FC",
    "logo": "assets/official-logos/pachangas-fc.png"
  },
  "OFF-DEP-ZAPATA": {
    "name": "DEP. ZAPATA",
    "logo": "assets/official-logos/dep-zapata.png"
  },
  "OFF-BARZA": {
    "name": "BARZA",
    "logo": "assets/official-logos/barza.png"
  },
  "OFF-SAN-ANTONIO-FC": {
    "name": "SAN ANTONIO FC",
    "logo": "assets/official-logos/san-antonio-fc.png"
  },
  "OFF-DEP-LA-LUZ": {
    "name": "DEP. LA LUZ",
    "logo": "assets/official-logos/dep-la-luz.png"
  },
  "OFF-TAPATIO": {
    "name": "TAPATIO",
    "logo": "assets/official-logos/tapatio.png"
  },
  "OFF-LA-CANCHITA-DEPORTES": {
    "name": "LA CANCHITA DEPORTES",
    "logo": "assets/official-logos/la-canchita-deportes.png"
  },
  "OFF-LA-CUADRILLA": {
    "name": "LA CUADRILLA",
    "logo": "assets/official-logos/la-cuadrilla.png"
  },
  "OFF-CAPIBARAS": {
    "name": "CAPIBARAS",
    "logo": "assets/official-logos/capibaras.png"
  },
  "OFF-ATL-GALEANA": {
    "name": "ATL. GALEANA",
    "logo": "assets/liga-logo.webp"
  },
  "OFF-ALDAMA-FC": {
    "name": "ALDAMA FC",
    "logo": "assets/official-logos/aldama-fc.png"
  },
  "OFF-MALVINAS": {
    "name": "MALVINAS",
    "logo": "assets/official-logos/malvinas.png"
  },
  "OFF-SAN-ANTONIO-JRS": {
    "name": "SAN ANTONIO JRS",
    "logo": "assets/official-logos/san-antonio-jrs.png"
  },
  "OFF-POPULARES": {
    "name": "POPULARES",
    "logo": "assets/official-logos/populares.png"
  },
  "OFF-PROMESAS-FC": {
    "name": "PROMESAS FC",
    "logo": "assets/official-logos/promesas-fc.png"
  },
  "OFF-LA-HUERTA": {
    "name": "LA HUERTA",
    "logo": "assets/official-logos/la-huerta.png"
  },
  "OFF-DEP-MARAVILLAS": {
    "name": "DEP. MARAVILLAS",
    "logo": "assets/official-logos/dep-maravillas.png"
  },
  "OFF-MAZACOTES-FC": {
    "name": "MAZACOTES FC",
    "logo": "assets/official-logos/mazacotes-fc.png"
  },
  "OFF-OSASUNA": {
    "name": "OSASUNA",
    "logo": "assets/official-logos/osasuna.png"
  },
  "OFF-GALEANA": {
    "name": "GALEANA",
    "logo": "assets/official-logos/galeana.png"
  }
};

  const DEFAULT_TEAM={id:'OFF-MANCHESTER',...TEAM_MAP['OFF-MANCHESTER']};
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
    return (Array.isArray(a)?a:[]).filter(id=>TEAM_MAP[id]);
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
    function icon(type){
      const icons={
        calendar:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="11" width="32" height="29" rx="6"/><path d="M15 7v8M33 7v8M8 19h32"/><path d="m17 30 5 5 10-12"/></svg>',
        venue:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="10" width="32" height="28" rx="5"/><path d="M18 10v28M30 10v28M18 24h12"/><circle cx="24" cy="24" r="4"/></svg>',
        match:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="10" width="32" height="28" rx="5"/><path d="M14 18h20M14 25h20M14 32h13"/></svg>',
        chevron:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m12 7 9 9-9 9"/></svg>'
      };
      return icons[type]||'';
    }
    function card(kicker,title,sub,type,routeName){
      return '<button type="button" class="v46-notice-card" data-route="'+routeName+'">'+
        '<span class="v46-notice-icon">'+icon(type)+'</span>'+
        '<span class="v46-notice-copy"><small>'+kicker+'</small><strong>'+title+'</strong><span>'+sub+'</span></span>'+
        '<span class="v46-notice-arrow">'+icon('chevron')+'</span>'+
      '</button>';
    }
    return '<section class="v46-account-page v46-notifications v46-notifications-blue" data-v46-account="notifications">'+
      '<header class="v46-notif-head">'+
        '<button type="button" class="v46-back" data-v46-back aria-label="Volver">'+backIcon()+'</button>'+
        '<h1>Notificaciones</h1>'+
      '</header>'+
      '<main class="v46-notif-main">'+
        '<section class="v46-notice-hub">'+
          card('PRÓXIMA JORNADA','Avisos de jornada','Configura tus preferencias de notificaciones.','calendar','scheduleChanges')+
          card('CAMBIO DE SEDE','Campos y ubicaciones','Revisa cambios relevantes de cancha o sede.','venue','venues')+
          card('PARTIDO FAVORITO','Equipos y encuentros destacados','Consulta tus favoritos y equipos seguidos.','match','following')+
          '<button type="button" class="v46-followed-cta" data-v46-open-following>Equipos que sigues</button>'+
        '</section>'+
        '<section class="v46-notif-preferences">'+
          '<div class="v46-section v46-teams-section">'+
            '<h2>Equipo seguido</h2>'+
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
        '</section>'+
      '</main>'+
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

    // IMPORTANT: #/following belongs to v25-following-reference.js.
    // V46 must never replace that legacy/reference screen.
    if(r!=='notifications'){
      document.body.classList.remove('v46-account-active','v46-notifications-active','v46-following-active');
      return;
    }

    const screen=document.querySelector('#screen');
    if(!screen)return;
    document.body.classList.add('v46-account-active');
    document.body.classList.add('v46-notifications-active');
    document.body.classList.remove('v46-following-active');

    if(screen.querySelector('[data-v46-account="notifications"]'))return;
    screen.innerHTML=notificationsMarkup();
    window.scrollTo(0,0);
    bind();
  }

  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(takeover))}
  window.addEventListener('hashchange',schedule);
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(function(){
    if(route()==='notifications'&&!screen.querySelector('[data-v46-account="notifications"]'))schedule();
  }).observe(screen,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();