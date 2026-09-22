/* PARTS52 — Match detail universal.
   Todos los botones [data-match] abren la misma pantalla de referencia,
   conservando el partido pulsado cuando proviene del calendario. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE=BASE+'assets/liga-logo.webp';

  const LOGOS={
  "SAN JOSE FC": "assets/official-logos/san-jose-fc.png",
  "JUVENTUS": "assets/official-logos/juventus.png",
  "HERMANOS": "assets/official-logos/hermanos.png",
  "LINCES": "assets/official-logos/linces.png",
  "NAPOLI": "assets/official-logos/napoli.png",
  "FRANCO FC": "assets/official-logos/franco-fc.png",
  "HERRERAS FC": "assets/official-logos/herreras-fc.png",
  "ABEJAS": "assets/official-logos/abejas.png",
  "LOBOS CDG": "assets/official-logos/lobos-cdg.png",
  "TERRICOLAS": "assets/official-logos/terricolas.png",
  "GALACTICOS": "assets/teams/galacticos-pozos.webp"
};


  const MAIN_MATCHES={
  "m1": {
    "home": "FRANCO FC",
    "away": "HERRERAS FC",
    "time": "08:00",
    "date": "20/09/2026",
    "venue": "Romerillo",
    "category": "Primera Fuerza",
    "jornada": "5"
  },
  "m2": {
    "home": "TERRICOLAS",
    "away": "GALACTICOS",
    "time": "08:00",
    "date": "20/09/2026",
    "venue": "Campo por confirmar",
    "category": "Primera Fuerza",
    "jornada": "5"
  },
  "m3": {
    "home": "LINCES",
    "away": "JUVENTUS",
    "time": "08:00",
    "date": "20/09/2026",
    "venue": "Campo 3",
    "category": "Primera Fuerza",
    "jornada": "5"
  },
  "m4": {
    "home": "HERMANOS",
    "away": "SAN JOSE FC",
    "time": "10:00",
    "date": "20/09/2026",
    "venue": "Campo 3",
    "category": "Primera Fuerza",
    "jornada": "5"
  },
  "m5": {
    "home": "LOBOS CDG",
    "away": "NAPOLI",
    "time": "12:00",
    "date": "20/09/2026",
    "venue": "Cerrito de Gasca",
    "category": "Primera Fuerza",
    "jornada": "5"
  }
};


  const TABLE=[
  {
    "name": "SAN JOSE FC",
    "p": 4,
    "w": 4,
    "d": 0,
    "l": 0,
    "gf": 13,
    "ga": 3,
    "gd": 10,
    "pts": 12
  },
  {
    "name": "JUVENTUS",
    "p": 4,
    "w": 3,
    "d": 0,
    "l": 1,
    "gf": 20,
    "ga": 6,
    "gd": 14,
    "pts": 9
  },
  {
    "name": "HERMANOS",
    "p": 3,
    "w": 2,
    "d": 1,
    "l": 0,
    "gf": 8,
    "ga": 4,
    "gd": 4,
    "pts": 7
  },
  {
    "name": "LINCES",
    "p": 3,
    "w": 2,
    "d": 0,
    "l": 1,
    "gf": 10,
    "ga": 7,
    "gd": 3,
    "pts": 6
  },
  {
    "name": "NAPOLI",
    "p": 4,
    "w": 2,
    "d": 0,
    "l": 2,
    "gf": 8,
    "ga": 7,
    "gd": 1,
    "pts": 6
  },
  {
    "name": "FRANCO FC",
    "p": 3,
    "w": 2,
    "d": 0,
    "l": 1,
    "gf": 3,
    "ga": 3,
    "gd": 0,
    "pts": 6
  },
  {
    "name": "HERRERAS FC",
    "p": 4,
    "w": 1,
    "d": 1,
    "l": 2,
    "gf": 9,
    "ga": 12,
    "gd": -3,
    "pts": 4
  },
  {
    "name": "ABEJAS",
    "p": 4,
    "w": 2,
    "d": 0,
    "l": 2,
    "gf": 7,
    "ga": 7,
    "gd": 0,
    "pts": 3
  },
  {
    "name": "LOBOS CDG",
    "p": 4,
    "w": 1,
    "d": 0,
    "l": 3,
    "gf": 2,
    "ga": 17,
    "gd": -15,
    "pts": 3
  },
  {
    "name": "TERRICOLAS",
    "p": 3,
    "w": 0,
    "d": 0,
    "l": 3,
    "gf": 4,
    "ga": 14,
    "gd": -10,
    "pts": 0
  },
  {
    "name": "GALACTICOS",
    "p": 4,
    "w": 0,
    "d": 0,
    "l": 4,
    "gf": 0,
    "ga": 4,
    "gd": -4,
    "pts": -12
  }
];


  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function logoPath(name){const globalLogo=window.LJR_TEAM_LOGOS?.get?.(name);if(globalLogo)return globalLogo;const p=LOGOS[name];return p?(p.startsWith('http')?p:BASE+p):LEAGUE}
  function teamLogo(name,cls=''){return '<img class="'+cls+'" src="'+logoPath(name)+'" alt="'+esc(name)+'" loading="eager" decoding="async">'}
  function backIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>'}
  function muteIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Zm13-1 3 8M21 8l-3 8"/></svg>'}
  function soundIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Zm12 0c1.3 1.5 1.3 4.5 0 6m2.5-9c3 3.2 3 8.8 0 12"/></svg>'}
  function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/></svg>'}
  function bellIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 16.7h11l-1.2-2.1V10a4.3 4.3 0 0 0-8.6 0v4.6l-1.2 2.1Z"/><path d="M10 19a2.1 2.1 0 0 0 4 0"/></svg>'}
  function notifIcon(type){
    const icons={
      goals:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="m12 7 2.2 1.6-.8 2.6H10.6l-.8-2.6L12 7Zm-5 5 3.6-.8m6.4.8-3.6-.8m-5.2 5 2.4-2.8m5.2 2.8-2.4-2.8"/></svg>',
      penalties:'<svg viewBox="0 0 24 24"><path d="M4 7h16v10H4zM8 7v3m8-3v3M8 17v-3m8 3v-3"/><circle cx="12" cy="13" r="2.2"/></svg>',
      startFinal:'<svg viewBox="0 0 24 24"><path d="M4 14c3-5 6-5 9-2l3-5 2 1-2.2 5.3c2.3 1.2 3.7 3 4.2 5.7"/><path d="M3 18h7M6 5l2 3"/></svg>',
      lineups:'<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM9 4v4m6-4v4M8 12h8M8 16h8"/></svg>',
      redCards:'<svg viewBox="0 0 24 24"><rect x="7" y="4" width="10" height="16" rx="1"/></svg>',
      subs:'<svg viewBox="0 0 24 24"><path d="m7 5-4 5h8L7 5Zm10 14 4-5h-8l4 5Z"/></svg>',
      video:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="1"/><path d="m10 9 5 3-5 3Z"/></svg>',
      news:'<svg viewBox="0 0 24 24"><path d="M6 3h11l2 2v16H6z"/><path d="M9 9h7M9 13h7M9 17h5"/></svg>'
    };
    return icons[type]||icons.news;
  }

  const MATCH_NOTIF_ROWS=[
    ['goals','Goles',false],
    ['penalties','Tandas de penalti',false],
    ['startFinal','Inicio / Final',false],
    ['lineups','Alineaciones oficiales',false],
    ['redCards','Tarjetas rojas',false],
    ['subs','Cambios',false],
    ['video','Resumen en vídeo disponible',false],
    ['news','Noticias',true]
  ];
  function matchNotifKey(m){return 'lj-match-notifications-v68-'+String(m?.id||'match')}
  function matchNotifState(m){
    const base=Object.fromEntries(MATCH_NOTIF_ROWS.map(r=>[r[0],r[2]]));
    let saved={};try{saved=JSON.parse(localStorage.getItem(matchNotifKey(m))||'{}')||{}}catch(e){}
    return {...base,...saved};
  }
  function saveMatchNotifState(m,state){try{localStorage.setItem(matchNotifKey(m),JSON.stringify(state))}catch(e){}}
  function notifSwitch(key,on,all=false){
    return '<button type="button" class="v68-notif-switch '+(on?'on':'')+'" '+(all?'data-v68-all':'data-v68-pref="'+key+'"')+' role="switch" aria-checked="'+(on?'true':'false')+'" aria-label="'+(all?'Todas las notificaciones':key)+'"><i></i></button>';
  }
  function notificationSheet(m){
    const prefs=matchNotifState(m);
    const all=MATCH_NOTIF_ROWS.every(r=>!!prefs[r[0]]);
    return '<div class="v68-notif-layer" data-v68-notif-layer aria-hidden="true">'+
      '<button type="button" class="v68-notif-backdrop" data-v68-notif-close aria-label="Cerrar notificaciones"></button>'+
      '<section class="v68-notif-sheet" role="dialog" aria-modal="true" aria-label="Notificaciones del partido">'+
        '<div class="v68-notif-head"><h2>Notificaciones</h2><button type="button" data-v68-notif-close>Hecho</button></div>'+
        '<p class="v68-notif-sub">Elige tus alertas para este partido</p>'+
        '<div class="v68-notif-all"><strong>Todas las notificaciones</strong>'+notifSwitch('all',all,true)+'</div>'+
        '<div class="v68-notif-list">'+
          MATCH_NOTIF_ROWS.map(r=>'<div class="v68-notif-row"><span class="v68-notif-row-icon '+(r[0]==='redCards'?'red':'')+'">'+notifIcon(r[0])+'</span><span class="v68-notif-label">'+r[1]+'</span>'+notifSwitch(r[0],!!prefs[r[0]],false)+'</div>').join('')+
        '</div>'+
      '</section>'+
    '</div>';
  }

  function readSaved(){
    try{return JSON.parse(sessionStorage.getItem('lj-match-detail')||'null')}catch{return null}
  }
  function saveMatch(data){
    try{sessionStorage.setItem('lj-match-detail',JSON.stringify(data))}catch{}
  }

  /* Captura el partido ANTES de que main.js cambie a #/match.
     Así incluso los IDs m1/m2 repetidos del calendario conservan sus clubes reales. */
  document.addEventListener('click',function(e){
    const hit=e.target.closest('[data-match]');
    if(!hit)return;
    e.preventDefault();
    e.stopPropagation();
    let data={id:hit.dataset.match||'m1',from:location.hash||'#/competition'};
    const schedule=hit.closest('.v12-schedule-match');
    if(schedule){
      const names=[...schedule.querySelectorAll('.v12-schedule-clubs b')].map(x=>x.textContent.trim());
      const card=schedule.closest('.v12-schedule-card');
      let heading=card?.previousElementSibling;
      while(heading && !/^H[1-6]$/.test(heading.tagName))heading=heading.previousElementSibling;
      data={
        ...data,
        home:names[0]||'Local',
        away:names[1]||'Visitante',
        time:schedule.dataset.v12Time||schedule.querySelector('time')?.textContent.trim()||'Por confirmar',
        date:schedule.dataset.v12DateLabel||heading?.textContent?.trim()||'Fecha por confirmar',
        venue:schedule.dataset.v12Venue||schedule.querySelector('.v76-match-venue')?.textContent?.trim()||'Campo por confirmar',
        category:schedule.dataset.v12Category||'Liga Municipal',
        jornada:schedule.dataset.v12Jornada||''
      };
    }else{
      const m=MAIN_MATCHES[data.id];
      if(m)data={...data,...m};
    }
    saveMatch(data);
    if(location.hash!=='#/match') location.hash='#/match';
    else schedule();
  },true);

  function selected(){
    const saved=readSaved();
    if(saved?.home&&saved?.away)return saved;
    const id=saved?.id||'m1';
    return {id,from:saved?.from||'#/competition',...(MAIN_MATCHES[id]||{
      home:'FRANCO FC',away:'HERRERAS FC',time:'08:00',date:'20/09/2026',venue:'Romerillo',category:'Primera Fuerza',jornada:'5'
    })};
  }

  function toast(msg){
    const old=document.querySelector('.v28-toast');if(old)old.remove();
    const el=document.createElement('div');el.className='v28-toast';el.textContent=msg;
    document.body.appendChild(el);setTimeout(()=>el.remove(),1700);
  }

  function formCell(last){
    const cls=last==='V'?'w':last==='E'?'e':'d';
    return '<span class="v28-stand-form"><i></i><i></i><b class="'+cls+'">'+last+'</b></span>';
  }

  function v40Form(){return '<span class="v40-form"><b>—</b></span>';}

  function standings(mode='compact'){
    if(mode==='criteria'){
      return '<div class="v40-scroll-shell"><div class="v40-wide criteria">'+
        '<div class="v40-wide-head criteria-head"><span></span><span>Equipo</span><b>PTOS</b><b>+/-</b><b>GF</b><b>GA</b><b>V</b><b>E</b><b>P</b></div>'+
        '<div class="v40-direct">CLASIFICACIÓN ACTUAL</div><div class="v40-rule"></div>'+
        TABLE.map((t,i)=>'<div class="v40-wide-row criteria-row"><span>'+(i+1)+'</span><span class="v40-team">'+teamLogo(t.name,'v40-team-logo')+'<strong>'+esc(t.name)+'</strong></span><span>'+t.pts+'</span><span>'+t.gd+'</span><span>'+Math.max(0,t.gd+1)+'</span><span>0</span><span>'+(t.last==='V'?1:0)+'</span><span>'+(t.last==='E'?1:0)+'</span><span>'+(t.last==='D'?1:0)+'</span></div>').join('')+
      '</div></div>';
    }
    if(mode==='complete'){
      return '<div class="v40-scroll-shell"><div class="v40-wide complete">'+
        '<div class="v40-wide-head"><span></span><span>Equipo</span><b>P</b><b>V</b><b>E</b><b>D</b><b>PTOS</b></div>'+
        '<div class="v40-direct">CLASIFICACIÓN ACTUAL</div><div class="v40-rule"></div>'+
        TABLE.map((t,i)=>'<div class="v40-wide-row"><span>'+(i+1)+'</span><span class="v40-team">'+teamLogo(t.name,'v40-team-logo')+'<strong>'+esc(t.name)+'</strong></span><span>'+t.p+'</span><span>'+(t.last==='V'?1:0)+'</span><span>'+(t.last==='E'?1:0)+'</span><span>'+(t.last==='D'?1:0)+'</span><b>'+t.pts+'</b></div>').join('')+
      '</div></div>';
    }
    return '<div class="v40-table-wrap compact">'+
      '<div class="v40-table-head"><span></span><span></span><b>P</b><b>+/-</b><b>PTOS</b><b>FORMA</b></div>'+
      '<div class="v40-direct">CLASIFICACIÓN ACTUAL</div><div class="v40-rule"></div>'+
      '<div class="v40-table-body">'+TABLE.map((t,i)=>
        '<div class="v40-row"><span class="v40-rank">'+(i+1)+'</span><span class="v40-team">'+teamLogo(t.name,'v40-team-logo')+'<strong>'+esc(t.name)+'</strong></span><span>'+t.p+'</span><span>'+t.gd+'</span><span>'+t.pts+'</span>'+v40Form()+'</div>'
      ).join('')+'</div>'+
    '</div>';
  }

  function formDots(pattern){
    return '<span class="v28-form-dots">'+pattern.map(function(x,i){
      const c=x==='V'?'w':x==='E'?'e':'d';
      return '<i class="'+c+(i===pattern.length-1?' current':'')+'">'+x+'</i>';
    }).join('')+'<i class="v28-form-arrow"></i></span>';
  }

  function teamForm(name,pattern){
    return '<div class="v28-form-line">'+
      '<div class="v28-form-team">'+teamLogo(name)+'<span>'+esc(name)+'</span></div>'+
      formDots(pattern)+
    '</div>';
  }

  function matchInfoContent(m){
    const competition=(m.category||'Liga Municipal');
    const venue=(m.venue||'Campo por confirmar');
    return '<div class="v28-video-info">'+
      '<h2>Información del partido</h2>'+
      '<div class="v28-stadium-photo" role="img" aria-label="Estadio"></div>'+
      '<div class="v28-video-venue"><strong>'+esc(venue)+'</strong><small>Juventino Rosas</small></div>'+
      '<div class="v28-video-rule"></div>'+
      '<div class="v28-video-round"><strong>'+esc(competition)+', Jornada '+esc(m.jornada||'')+'</strong><small>'+esc(m.date)+' - '+esc(m.time)+'</small></div>'+
      '<div class="v28-video-rule"></div>'+
      '<div class="v28-local-time"><i aria-hidden="true"></i><span>Los horarios se muestran en tu hora local</span></div>'+
    '</div>';
  }

  function newsPanel(m){
    return '<section class="v28-panel v28-news-panel active" data-v28-panel="news">'+
      matchInfoContent(m)+
    '</section>';
  }
  function standingsPanel(){
    return '<section class="v28-panel v28-standings-panel" data-v28-panel="standings">'+
      '<div class="v40-standings v28-embedded-standings">'+
        '<div class="v40-segmented" role="tablist" aria-label="Vista de clasificación">'+
          '<button class="active" type="button" data-v28-mode="compact">Compacta</button>'+
          '<button type="button" data-v28-mode="complete">Completa</button>'+
          '<button type="button" data-v28-mode="criteria">Criterios de<br>desempate</button>'+
        '</div>'+
        '<div class="v40-content v28-stand-content" data-v28-stand-content>'+standings('compact')+'</div>'+
      '</div>'+
    '</section>';
  }

  function infoPanel(m){
    return '<section class="v28-panel v28-info-panel" data-v28-panel="info">'+
      matchInfoContent(m)+
    '</section>';
  }
  function markup(){
    const m=selected();
    return '<article class="v28-match" data-v28-match>'+
      '<header class="v28-top">'+
        '<div class="v28-actions">'+
          '<button class="v28-icon-btn" type="button" data-v28-back aria-label="Volver">'+backIcon()+'</button>'+
          '<div class="v28-action-right">'+
            '<button class="v28-icon-btn" type="button" data-v28-notifications aria-label="Notificaciones">'+bellIcon()+'</button>'+
            '<button class="v28-icon-btn" type="button" data-v28-share aria-label="Compartir">'+shareIcon()+'</button>'+
          '</div>'+
        '</div>'+
        '<div class="v28-meta">'+esc(m.date)+' &nbsp;·&nbsp; '+esc(m.category||'Liga Municipal')+'</div>'+
        '<div class="v28-venue">'+esc(m.venue)+' &nbsp;·&nbsp; Juventino Rosas</div>'+
        '<div class="v28-scoreline">'+
          '<div class="v28-side left"><span>'+esc(m.home)+'</span>'+teamLogo(m.home,'v28-team-logo')+'</div>'+
          '<div class="v28-time">'+esc(m.time)+'</div>'+
          '<div class="v28-side right">'+teamLogo(m.away,'v28-team-logo')+'<span>'+esc(m.away)+'</span></div>'+
        '</div>'+
        '<nav class="v28-tabs" aria-label="Información del partido">'+
          '<button class="v28-tab active" type="button" data-v28-tab="news">Novedades</button>'+
          '<button class="v28-tab" type="button" data-v28-tab="standings">Clasificación</button>'+
          '<button class="v28-tab" type="button" data-v28-tab="info">Info del partido</button>'+
        '</nav>'+
      '</header>'+
      '<main class="v28-body">'+newsPanel(m)+standingsPanel()+infoPanel(m)+'</main>'+
      notificationSheet(m)+
    '</article>';
  }


  function bind(){
    const m=selected();
    const back=document.querySelector('[data-v28-back]');
    if(back)back.onclick=function(){
      const from=m.from&&m.from!=='#/match'?m.from:'#/competition';
      location.hash=from;
    };

    const notifButton=document.querySelector('[data-v28-notifications]');
    const notifLayer=document.querySelector('[data-v68-notif-layer]');
    function syncNotifAll(){
      const prefs=matchNotifState(m);
      const all=MATCH_NOTIF_ROWS.every(r=>!!prefs[r[0]]);
      const allBtn=notifLayer?.querySelector('[data-v68-all]');
      if(allBtn){
        allBtn.classList.toggle('on',all);
        allBtn.setAttribute('aria-checked',all?'true':'false');
      }
    }
    function openNotifSheet(){
      if(!notifLayer)return;
      notifLayer.classList.add('open');
      notifLayer.setAttribute('aria-hidden','false');
      document.body.classList.add('v68-notif-open');
      requestAnimationFrame(()=>notifLayer.querySelector('.v68-notif-sheet')?.focus?.());
    }
    function closeNotifSheet(){
      if(!notifLayer)return;
      notifLayer.classList.remove('open');
      notifLayer.setAttribute('aria-hidden','true');
      document.body.classList.remove('v68-notif-open');
    }
    if(notifButton)notifButton.onclick=openNotifSheet;
    notifLayer?.querySelectorAll('[data-v68-notif-close]').forEach(el=>el.onclick=closeNotifSheet);
    notifLayer?.querySelectorAll('[data-v68-pref]').forEach(btn=>btn.onclick=function(){
      const key=btn.dataset.v68Pref,prefs=matchNotifState(m);
      prefs[key]=!prefs[key];
      saveMatchNotifState(m,prefs);
      btn.classList.toggle('on',!!prefs[key]);
      btn.setAttribute('aria-checked',prefs[key]?'true':'false');
      syncNotifAll();
    });
    const allBtn=notifLayer?.querySelector('[data-v68-all]');
    if(allBtn)allBtn.onclick=function(){
      const prefs=matchNotifState(m);
      const next=!MATCH_NOTIF_ROWS.every(r=>!!prefs[r[0]]);
      MATCH_NOTIF_ROWS.forEach(r=>prefs[r[0]]=next);
      saveMatchNotifState(m,prefs);
      notifLayer.querySelectorAll('[data-v68-pref]').forEach(btn=>{
        btn.classList.toggle('on',next);
        btn.setAttribute('aria-checked',next?'true':'false');
      });
      allBtn.classList.toggle('on',next);
      allBtn.setAttribute('aria-checked',next?'true':'false');
    };

    const share=document.querySelector('[data-v28-share]');
    if(share)share.onclick=function(){
      const payload={title:m.home+' vs '+m.away,text:(m.category||'Liga Municipal')+' · '+m.home+' vs '+m.away,url:location.href};
      if(navigator.share)navigator.share(payload).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(function(){toast('Enlace copiado')}).catch(function(){toast('Contenido listo para compartir')});
      else toast('Contenido listo para compartir');
    };

    document.querySelectorAll('[data-v28-tab]').forEach(function(btn){
      btn.onclick=function(){
        const key=btn.dataset.v28Tab;
        document.querySelectorAll('[data-v28-tab]').forEach(x=>x.classList.toggle('active',x===btn));
        document.querySelectorAll('[data-v28-panel]').forEach(x=>x.classList.toggle('active',x.dataset.v28Panel===key));
        const body=document.querySelector('.v28-body');
        if(body){
          body.classList.remove('v28-panel-enter');
          requestAnimationFrame(()=>body.classList.add('v28-panel-enter'));
        }
      };
    });

    document.querySelectorAll('[data-v28-mode]').forEach(function(btn){
      btn.onclick=function(){
        const mode=btn.dataset.v28Mode;
        document.querySelectorAll('[data-v28-mode]').forEach(x=>x.classList.toggle('active',x===btn));
        const out=document.querySelector('[data-v28-stand-content]');
        if(out)out.innerHTML=standings(mode);
      };
    });
  }

  function activate(){
    const isMatch=route()==='match';
    document.body.classList.toggle('v28-match-active',isMatch);
    if(!isMatch)return;
    const screen=document.querySelector('#screen');
    if(!screen)return;
    if(!screen.querySelector('[data-v28-match]')){
      screen.innerHTML=markup();
      bind();
      window.scrollTo(0,0);
    }
  }

  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(activate))}
  window.addEventListener('hashchange',schedule);
  const target=document.querySelector('#screen');
  if(target)new MutationObserver(function(){if(route()==='match'&&!target.querySelector('[data-v28-match]'))schedule()}).observe(target,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();