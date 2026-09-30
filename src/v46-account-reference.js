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
    enabled:true,
    news:true,
    predictor:true,
    sounds:true,
    vibration:true,
    dnd:true,
    goal:true,
    kickoff:true,
    halftime:true,
    final:true,
    scheduleChanges:true,
    venueChanges:true,
    transfers:true
  };


  const CATEGORY_DEFAULTS=['football','primera','intermedia','segunda','v35','v50'];
  function categoryPrefs(){
    let p={};try{p=JSON.parse(localStorage.getItem('lj-account-category-notifications-v415')||'{}')||{}}catch{}
    CATEGORY_DEFAULTS.forEach(k=>{
      p[k]=Object.assign({enabled:true,goal:true,kickoff:true,halftime:true,final:true},p[k]||{});
    });
    return p;
  }
  function saveCategoryPrefs(p){localStorage.setItem('lj-account-category-notifications-v415',JSON.stringify(p))}
  function quietPrefs(){
    try{return Object.assign({start:'00:00',end:'08:00'},JSON.parse(localStorage.getItem('lj-account-quiet-v415')||'{}')||{})}
    catch{return {start:'00:00',end:'08:00'}}
  }
  function saveQuietPrefs(p){localStorage.setItem('lj-account-quiet-v415',JSON.stringify(p))}
  function deviceNotice(){
    try{
      if(!('Notification' in window))return ['Las notificaciones del dispositivo no están disponibles en este navegador.','Revisar permisos'];
      if(Notification.permission==='granted')return ['Las notificaciones de Liga Juventino Rosas están activadas en este dispositivo.','Notificaciones activadas'];
      if(Notification.permission==='denied')return ['Las notificaciones están desactivadas. Actívalas desde los permisos del navegador o de la app.','Configuración del dispositivo'];
      return ['Activa las notificaciones del dispositivo para recibir avisos de la Liga.','Activar notificaciones'];
    }catch{return ['Revisa los permisos de notificación del dispositivo.','Configuración del dispositivo']}
  }
  function v46Switch(key,label,sub,prefs){
    return '<label class="v46-ref-setting">'+
      '<span><strong>'+esc(label)+'</strong>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span>'+
      '<input type="checkbox" data-v46-notif="'+esc(key)+'" '+(prefs[key]!==false?'checked':'')+'>'+
      '<i aria-hidden="true"></i>'+
    '</label>';
  }
  function v46CategoryRow(key,label,sub,icon,cats){
    const p=cats[key]||{};
    return '<section class="v46-ref-category" data-v46-cat-wrap="'+key+'">'+
      '<button type="button" class="v46-ref-category-head" data-v46-cat-toggle="'+key+'">'+
        '<span class="v46-ref-category-icon">'+icon+'</span>'+
        '<span><strong>'+esc(label)+'</strong><small>'+esc(sub)+'</small></span>'+
        '<span class="v46-ref-category-arrow">›</span>'+
      '</button>'+
      '<div class="v46-ref-category-panel">'+
        '<label><span>Activar categoría</span><input type="checkbox" data-v46-cat-pref="'+key+':enabled" '+(p.enabled!==false?'checked':'')+'><i></i></label>'+
        '<label><span>Goles</span><input type="checkbox" data-v46-cat-pref="'+key+':goal" '+(p.goal!==false?'checked':'')+'><i></i></label>'+
        '<label><span>Inicio</span><input type="checkbox" data-v46-cat-pref="'+key+':kickoff" '+(p.kickoff!==false?'checked':'')+'><i></i></label>'+
        '<label><span>Medio tiempo</span><input type="checkbox" data-v46-cat-pref="'+key+':halftime" '+(p.halftime!==false?'checked':'')+'><i></i></label>'+
        '<label><span>Final</span><input type="checkbox" data-v46-cat-pref="'+key+':final" '+(p.final!==false?'checked':'')+'><i></i></label>'+
      '</div>'+
    '</section>';
  }

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
    const cats=categoryPrefs();
    const quiet=quietPrefs();
    const device=deviceNotice();
    return '<section class="v46-account-page v46-notifications v46-notifications-reference-blue" data-v46-account="notifications">'+
      '<header class="v46-notif-head v46-ref-head">'+
        '<button type="button" class="v46-back" data-v46-back aria-label="Volver">'+backIcon()+'</button>'+
        '<h1>Notificaciones</h1>'+
      '</header>'+
      '<main class="v46-ref-notifications-main">'+
        '<div class="v46-ref-device">'+
          '<span class="v46-ref-device-icon">🔕</span>'+
          '<div><p data-v46-device-copy>'+esc(device[0])+'</p><button type="button" data-v46-device>'+esc(device[1])+'</button></div>'+
        '</div>'+
        '<div class="v46-ref-master">'+
          v46Switch('enabled','Permitir alertas','',p)+
        '</div>'+
        '<div class="v46-ref-settings">'+
          v46Switch('news','Noticias','Comunicados y publicaciones de la Liga',p)+
          v46Switch('predictor','Pronósticos','Quiniela y recordatorios de partidos',p)+
          v46Switch('sounds','Sonidos','Reproducir sonido al recibir un aviso',p)+
          v46Switch('vibration','Vibración','Vibrar cuando llegue una alerta',p)+
          '<div class="v46-ref-dnd">'+
            v46Switch('dnd','No molestar','Silencia los avisos durante este horario',p)+
            '<div class="v46-ref-hours">'+
              '<label>Desde<input type="time" data-v46-quiet-start value="'+esc(quiet.start)+'"></label>'+
              '<span>A</span>'+
              '<label>Hasta<input type="time" data-v46-quiet-end value="'+esc(quiet.end)+'"></label>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="v46-ref-categories">'+
          v46CategoryRow('football','Fútbol','Todos los partidos de la Liga','⚽',cats)+
          v46CategoryRow('primera','Primera Fuerza','Partidos y avisos de Primera Fuerza','PF',cats)+
          v46CategoryRow('intermedia','Intermedia','Partidos y avisos de Intermedia','IN',cats)+
          v46CategoryRow('segunda','Segunda Fuerza','Partidos y avisos de Segunda Fuerza','SF',cats)+
          v46CategoryRow('v35','Veteranos 35+','Partidos y avisos de Veteranos 35+','35',cats)+
          v46CategoryRow('v50','Veteranos 50+','Partidos y avisos de Veteranos 50+','50',cats)+
        '</div>'+
        '<div class="v46-ref-settings v46-ref-match-alerts">'+
          v46Switch('goal','Goles','Aviso cuando cambie el marcador',p)+
          v46Switch('kickoff','Inicio del partido','Aviso al comenzar un encuentro',p)+
          v46Switch('halftime','Medio tiempo','Aviso al terminar el primer tiempo',p)+
          v46Switch('final','Final del partido','Aviso al concluir el encuentro',p)+
          v46Switch('scheduleChanges','Cambios de horario','Modificaciones de jornada',p)+
          v46Switch('venueChanges','Cambios de sede','Cambio de campo o cancha',p)+
          v46Switch('transfers','Transferencias','Movimientos oficiales publicados',p)+
        '</div>'+
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
        if(inp.dataset.v46Notif==='enabled'){
          document.querySelectorAll('[data-v46-notif]').forEach(function(other){
            if(other===inp)return;
            if(['sounds','vibration','dnd'].includes(other.dataset.v46Notif))return;
            other.checked=inp.checked;
            p[other.dataset.v46Notif]=inp.checked;
          });
          saveNotifPrefs(p);
        }
        if(inp.dataset.v46Notif==='vibration'&&inp.checked){
          try{navigator.vibrate&&navigator.vibrate(70)}catch{}
        }
        if(inp.dataset.v46Notif==='sounds'&&inp.checked){
          try{
            const C=window.AudioContext||window.webkitAudioContext;
            if(C){const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=760;g.gain.value=.02;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.07)}
          }catch{}
        }
      };
    });
    const qStart=document.querySelector('[data-v46-quiet-start]');
    const qEnd=document.querySelector('[data-v46-quiet-end]');
    [qStart,qEnd].forEach(function(el){
      if(el)el.onchange=function(){saveQuietPrefs({start:qStart.value||'00:00',end:qEnd.value||'08:00'})};
    });
    const deviceBtn=document.querySelector('[data-v46-device]');
    if(deviceBtn)deviceBtn.onclick=async function(){
      const copy=document.querySelector('[data-v46-device-copy]');
      try{
        if(!('Notification' in window)){
          if(copy)copy.textContent='Este navegador no permite notificaciones web. Revisa los permisos de la app o del navegador.';
          return;
        }
        if(Notification.permission==='default'){
          const result=await Notification.requestPermission();
          if(result==='granted'){
            if(copy)copy.textContent='Las notificaciones de Liga Juventino Rosas están activadas en este dispositivo.';
            deviceBtn.textContent='Notificaciones activadas';
          }else{
            if(copy)copy.textContent='Las notificaciones quedaron bloqueadas. Actívalas desde los permisos del navegador o de la app.';
            deviceBtn.textContent='Configuración del dispositivo';
          }
        }else if(Notification.permission==='granted'){
          if(copy)copy.textContent='Las notificaciones de Liga Juventino Rosas están activadas en este dispositivo.';
          deviceBtn.textContent='Notificaciones activadas';
        }else{
          if(copy)copy.textContent='Las notificaciones están bloqueadas. Actívalas desde los permisos del navegador o de la app.';
          deviceBtn.textContent='Configuración del dispositivo';
        }
      }catch{
        if(copy)copy.textContent='Revisa los permisos de notificación del navegador o de la app.';
      }
    };
    document.querySelectorAll('[data-v46-cat-toggle]').forEach(function(btn){
      btn.onclick=function(){
        const wrap=document.querySelector('[data-v46-cat-wrap="'+btn.dataset.v46CatToggle+'"]');
        const open=wrap&&wrap.classList.contains('open');
        document.querySelectorAll('[data-v46-cat-wrap]').forEach(x=>x.classList.remove('open'));
        if(wrap&&!open)wrap.classList.add('open');
      };
    });
    document.querySelectorAll('[data-v46-cat-pref]').forEach(function(inp){
      inp.onchange=function(){
        const parts=String(inp.dataset.v46CatPref||'').split(':');
        const cat=parts[0],key=parts[1];
        const p=categoryPrefs();
        p[cat]=Object.assign({},p[cat]||{},{[key]:inp.checked});
        if(cat==='football'&&key==='enabled'){
          CATEGORY_DEFAULTS.forEach(function(k){p[k]=Object.assign({},p[k]||{},{enabled:inp.checked})});
          document.querySelectorAll('[data-v46-cat-pref$=":enabled"]').forEach(x=>x.checked=inp.checked);
        }
        saveCategoryPrefs(p);
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