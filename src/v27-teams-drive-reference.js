/* PARTS27 — Teams / Team detail rebuilt from the two user Drive references. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE_LOGO=BASE+'assets/liga-logo.webp';

  const V27_TEAMS=[
  {
    "id": "OFF-MANCHESTER",
    "name": "MANCHESTER",
    "short": "MANCHESTER",
    "logo": "assets/official-logos/manchester.png",
    "abbr": "M"
  },
  {
    "id": "OFF-DYNAMO",
    "name": "DYNAMO",
    "short": "DYNAMO",
    "logo": "assets/official-logos/dynamo.png",
    "abbr": "D"
  },
  {
    "id": "OFF-LA-ESPERANZA",
    "name": "LA ESPERANZA",
    "short": "LA ESPERANZA",
    "logo": "assets/official-logos/la-esperanza.png",
    "abbr": "LE"
  },
  {
    "id": "OFF-BOAVISTA",
    "name": "BOAVISTA",
    "short": "BOAVISTA",
    "logo": "assets/official-logos/boavista.png",
    "abbr": "B"
  },
  {
    "id": "OFF-TOROS-DE-CUENDA",
    "name": "TOROS DE CUENDA",
    "short": "TOROS DE CUENDA",
    "logo": "assets/official-logos/toros-de-cuenda.png",
    "abbr": "TDC"
  },
  {
    "id": "OFF-BOCA-JRS",
    "name": "BOCA JRS",
    "short": "BOCA JRS",
    "logo": "",
    "abbr": "BJ"
  },
  {
    "id": "OFF-SAN-JOSE-FC",
    "name": "SAN JOSE FC",
    "short": "SAN JOSE FC",
    "logo": "assets/official-logos/san-jose-fc.png",
    "abbr": "SJF"
  },
  {
    "id": "OFF-JUVENTUS",
    "name": "JUVENTUS",
    "short": "JUVENTUS",
    "logo": "assets/official-logos/juventus.png",
    "abbr": "J"
  },
  {
    "id": "OFF-HERMANOS",
    "name": "HERMANOS",
    "short": "HERMANOS",
    "logo": "assets/official-logos/hermanos.png",
    "abbr": "H"
  },
  {
    "id": "OFF-LINCES",
    "name": "LINCES",
    "short": "LINCES",
    "logo": "assets/official-logos/linces.png",
    "abbr": "L"
  },
  {
    "id": "OFF-NAPOLI",
    "name": "NAPOLI",
    "short": "NAPOLI",
    "logo": "assets/official-logos/napoli.png",
    "abbr": "N"
  },
  {
    "id": "OFF-FRANCO-FC",
    "name": "FRANCO FC",
    "short": "FRANCO FC",
    "logo": "assets/official-logos/franco-fc.png",
    "abbr": "FF"
  },
  {
    "id": "OFF-HERRERAS-FC",
    "name": "HERRERAS FC",
    "short": "HERRERAS FC",
    "logo": "assets/official-logos/herreras-fc.png",
    "abbr": "HF"
  },
  {
    "id": "OFF-ABEJAS",
    "name": "ABEJAS",
    "short": "ABEJAS",
    "logo": "assets/official-logos/abejas.png",
    "abbr": "A"
  },
  {
    "id": "OFF-LOBOS-CDG",
    "name": "LOBOS CDG",
    "short": "LOBOS CDG",
    "logo": "assets/official-logos/lobos-cdg.png",
    "abbr": "LC"
  },
  {
    "id": "OFF-TERRICOLAS",
    "name": "TERRICOLAS",
    "short": "TERRICOLAS",
    "logo": "assets/official-logos/terricolas.png",
    "abbr": "T"
  },
  {
    "id": "OFF-GALACTICOS",
    "name": "GALACTICOS",
    "short": "GALACTICOS",
    "logo": "assets/teams/galacticos-pozos.webp",
    "abbr": "G"
  },
  {
    "id": "OFF-SAN-JULIAN",
    "name": "SAN JULIAN",
    "short": "SAN JULIAN",
    "logo": "assets/official-logos/san-julian.png",
    "abbr": "SJ"
  },
  {
    "id": "OFF-SAN-JUAN-FC",
    "name": "SAN JUAN FC",
    "short": "SAN JUAN FC",
    "logo": "assets/official-logos/san-juan-fc.png",
    "abbr": "SJF"
  },
  {
    "id": "OFF-SAN-JOSE-JRS",
    "name": "SAN JOSE JRS",
    "short": "SAN JOSE JRS",
    "logo": "assets/official-logos/san-jose-jrs.png",
    "abbr": "SJJ"
  },
  {
    "id": "OFF-TAVERA-FC",
    "name": "TAVERA FC",
    "short": "TAVERA FC",
    "logo": "assets/official-logos/tavera-fc.png",
    "abbr": "TF"
  },
  {
    "id": "OFF-CELTICOS",
    "name": "CELTICOS",
    "short": "CELTICOS",
    "logo": "assets/official-logos/celticos.png",
    "abbr": "C"
  },
  {
    "id": "OFF-DEP-NOPALERO",
    "name": "DEP. NOPALERO",
    "short": "DEP. NOPALERO",
    "logo": "assets/official-logos/dep-nopalero.png",
    "abbr": "DN"
  },
  {
    "id": "OFF-PACHANGAS-FC",
    "name": "PACHANGAS FC",
    "short": "PACHANGAS FC",
    "logo": "assets/official-logos/pachangas-fc.png",
    "abbr": "PF"
  },
  {
    "id": "OFF-DEP-ZAPATA",
    "name": "DEP. ZAPATA",
    "short": "DEP. ZAPATA",
    "logo": "assets/official-logos/dep-zapata.png",
    "abbr": "DZ"
  },
  {
    "id": "OFF-BARZA",
    "name": "BARZA",
    "short": "BARZA",
    "logo": "assets/official-logos/barza.png",
    "abbr": "B"
  },
  {
    "id": "OFF-SAN-ANTONIO-FC",
    "name": "SAN ANTONIO FC",
    "short": "SAN ANTONIO FC",
    "logo": "assets/official-logos/san-antonio-fc.png",
    "abbr": "SAF"
  },
  {
    "id": "OFF-DEP-LA-LUZ",
    "name": "DEP. LA LUZ",
    "short": "DEP. LA LUZ",
    "logo": "assets/official-logos/dep-la-luz.png",
    "abbr": "DLL"
  },
  {
    "id": "OFF-TAPATIO",
    "name": "TAPATIO",
    "short": "TAPATIO",
    "logo": "assets/official-logos/tapatio.png",
    "abbr": "T"
  },
  {
    "id": "OFF-LA-CANCHITA-DEPORTES",
    "name": "LA CANCHITA DEPORTES",
    "short": "LA CANCHITA DEPORTES",
    "logo": "assets/official-logos/la-canchita-deportes.png",
    "abbr": "LCD"
  },
  {
    "id": "OFF-LA-CUADRILLA",
    "name": "LA CUADRILLA",
    "short": "LA CUADRILLA",
    "logo": "assets/official-logos/la-cuadrilla.png",
    "abbr": "LC"
  },
  {
    "id": "OFF-CAPIBARAS",
    "name": "CAPIBARAS",
    "short": "CAPIBARAS",
    "logo": "assets/official-logos/capibaras.png",
    "abbr": "C"
  },
  {
    "id": "OFF-ATL-GALEANA",
    "name": "ATL. GALEANA",
    "short": "ATL. GALEANA",
    "logo": "",
    "abbr": "AG"
  },
  {
    "id": "OFF-ALDAMA-FC",
    "name": "ALDAMA FC",
    "short": "ALDAMA FC",
    "logo": "assets/official-logos/aldama-fc.png",
    "abbr": "AF"
  },
  {
    "id": "OFF-MALVINAS",
    "name": "MALVINAS",
    "short": "MALVINAS",
    "logo": "assets/official-logos/malvinas.png",
    "abbr": "M"
  },
  {
    "id": "OFF-SAN-ANTONIO-JRS",
    "name": "SAN ANTONIO JRS",
    "short": "SAN ANTONIO JRS",
    "logo": "assets/official-logos/san-antonio-jrs.png",
    "abbr": "SAJ"
  },
  {
    "id": "OFF-POPULARES",
    "name": "POPULARES",
    "short": "POPULARES",
    "logo": "assets/official-logos/populares.png",
    "abbr": "P"
  },
  {
    "id": "OFF-PROMESAS-FC",
    "name": "PROMESAS FC",
    "short": "PROMESAS FC",
    "logo": "assets/official-logos/promesas-fc.png",
    "abbr": "PF"
  },
  {
    "id": "OFF-LA-HUERTA",
    "name": "LA HUERTA",
    "short": "LA HUERTA",
    "logo": "assets/official-logos/la-huerta.png",
    "abbr": "LH"
  },
  {
    "id": "OFF-DEP-MARAVILLAS",
    "name": "DEP. MARAVILLAS",
    "short": "DEP. MARAVILLAS",
    "logo": "assets/official-logos/dep-maravillas.png",
    "abbr": "DM"
  },
  {
    "id": "OFF-MAZACOTES-FC",
    "name": "MAZACOTES FC",
    "short": "MAZACOTES FC",
    "logo": "assets/official-logos/mazacotes-fc.png",
    "abbr": "MF"
  },
  {
    "id": "OFF-OSASUNA",
    "name": "OSASUNA",
    "short": "OSASUNA",
    "logo": "assets/official-logos/osasuna.png",
    "abbr": "O"
  },
  {
    "id": "OFF-GALEANA",
    "name": "GALEANA",
    "short": "GALEANA",
    "logo": "assets/official-logos/galeana.png",
    "abbr": "G"
  }
];


  const FIRST_GRID=V27_TEAMS.slice(0,16);
  const ELIMINATED=V27_TEAMS.slice(16);
  const playerNames=[];

  let query='';
  let detailTab='summary';

  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function team(id){return V27_TEAMS.find(function(t){return t.id===id})||V27_TEAMS[0]}
  function selected(){return team(localStorage.getItem('v27-selected-team')||V27_TEAMS[0]?.id)}
  function saveSelected(id){localStorage.setItem('v27-selected-team',id)}
  function store(){
    try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}
    catch(e){return {}}
  }
  function saveStore(s){localStorage.setItem('lj-store-v3',JSON.stringify(s))}
  function followedIds(){const a=store().followed;return Array.isArray(a)?a:[]}
  function isFollowed(id){return followedIds().indexOf(id)!==-1}
  function toggleFollow(id){
    const s=store();
    const a=Array.isArray(s.followed)?s.followed.slice():[];
    const i=a.indexOf(id);
    if(i>=0)a.splice(i,1);else a.push(id);
    s.followed=a;
    saveStore(s);
  }
  function logo(t,extra){
    const cls='v27-logo'+(extra?' '+extra:'');
    const globalLogo=window.LJR_TEAM_LOGOS?.get?.(t.name);
    const src=globalLogo||(t.logo?BASE+t.logo:'');
    if(src){
      return '<span class="'+cls+'"><img src="'+src+'" alt="'+esc(t.name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v27-fallback" style="display:none">'+esc(t.abbr||t.id)+'</span></span>';
    }
    return '<span class="'+cls+'"><span class="v27-fallback">'+esc(t.abbr||t.id)+'</span></span>';
  }
  function tile(t,followedOnly){
    return '<button type="button" class="v27-team-tile'+(followedOnly?' followed-only':'')+'" data-v27-team="'+t.id+'">'+logo(t)+'<span>'+esc(t.short||t.name)+'</span></button>';
  }
  function backIcon(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
  function searchIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 5.1 5.1"/></svg>'}
  function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="m8.2 10.9 7.5-4.5M8.2 13.1l7.5 4.5"/></svg>'}
  function toast(msg){
    const old=document.querySelector('.v27-toast');if(old)old.remove();
    const n=document.createElement('div');n.className='v27-toast';n.textContent=msg;document.body.appendChild(n);
    setTimeout(function(){n.remove()},1700);
  }

  function navReferenceMode(on){
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const labels=[
      ['home','Inicio'],['competition','Competición'],['video','Video'],['fantasy','Fantasy'],['more','Más']
    ];
    labels.forEach(function(row){
      const b=nav.querySelector('[data-route="'+row[0]+'"] small');
      if(b)b.textContent=on?row[1]:row[1].toUpperCase();
    });
    nav.querySelectorAll('.nav-item').forEach(function(n){
      n.classList.toggle('active',on?n.dataset.route==='more':n.dataset.route===route());
    });
  }

  function teamsMarkup(){
    const q=query.trim().toLocaleLowerCase('es');
    const list=FIRST_GRID.filter(function(t){return !q||t.name.toLocaleLowerCase('es').includes(q)||t.short.toLocaleLowerCase('es').includes(q)});
    const followed=followedIds();
    let followedTeams=V27_TEAMS.filter(function(t){return followed.indexOf(t.id)!==-1});
    if(!followedTeams.length)followedTeams=[team('PRO')];
    return '<section class="v27-teams-page" data-v27-reference="teams">'+
      '<header class="v27-teams-head">'+
        '<button class="v27-back" type="button" data-v27-back aria-label="Volver">'+backIcon()+'</button>'+
        '<h1>Equipos</h1>'+
        '<label class="v27-search">'+searchIcon()+'<input id="v27TeamSearch" type="search" autocomplete="off" placeholder="Buscar equipos" value="'+esc(query)+'"></label>'+
      '</header>'+
      '<section class="v27-section"><h2>Siguiendo</h2><div class="v27-followed-row">'+followedTeams.slice(0,4).map(function(t){return tile(t,true)}).join('')+'</div></section>'+
      '<section class="v27-section"><h2>Equipos en la competición</h2><div class="v27-grid">'+(list.length?list.map(function(t){return tile(t,false)}).join(''):'<div class="v27-empty-grid">No se encontraron equipos.</div>')+'</div></section>'+
      '<section class="v27-section v27-eliminated"><h2>Más equipos de la Liga</h2><div class="v27-grid">'+ELIMINATED.map(function(t){return tile(t,false)}).join('')+'</div></section>'+
    '</section>';
  }

  function teamStrip(active){
    const order=[active.id,'PRO','GAL','HUE','STC','POZ','FRA','LOB'];
    const seen={};
    return order.map(function(id){const t=team(id);if(seen[t.id])return '';seen[t.id]=1;return '<button class="v27-club-chip" type="button" data-v27-team="'+t.id+'">'+logo(t)+'<small>'+esc(t.short)+'</small></button>'}).join('');
  }
  function detailMarkup(){
    const t=selected();
    const following=isFollowed(t.id);
    return '<section class="v27-team-detail" data-v27-reference="teamDetail">'+
      '<div class="v27-team-hero">'+
        '<button class="v27-back" type="button" data-v27-back aria-label="Volver">'+backIcon()+'</button>'+
        '<div class="v27-hero-logos">'+logo(t)+'<span class="v27-league-badge"><img src="'+LEAGUE_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas"></span></div>'+
        '<div class="v27-team-title"><h1>'+esc(t.name)+'</h1><p>Juventino Rosas, Guanajuato</p></div>'+
        '<div class="v27-team-actions">'+
          '<button class="v27-action primary'+(following?' active':'')+'" type="button" data-v27-follow="'+t.id+'">'+(following?'Siguiendo':'Seguir')+'</button>'+
          '<button class="v27-action" type="button" data-v27-compare>Comparar</button>'+
          '<button class="v27-action share" type="button" data-v27-share aria-label="Compartir">'+shareIcon()+'</button>'+
        '</div>'+
        '<nav class="v27-tabs" aria-label="Secciones del equipo">'+
          '<button class="v27-tab '+(detailTab==='summary'?'active':'')+'" data-v27-tab="summary">Resumen</button>'+
          '<button class="v27-tab '+(detailTab==='matches'?'active':'')+'" data-v27-tab="matches">Partidos</button>'+
          '<button class="v27-tab '+(detailTab==='standings'?'active':'')+'" data-v27-tab="standings">Clasificación</button>'+
          '<button class="v27-tab '+(detailTab==='squad'?'active':'')+'" data-v27-tab="squad">Plantilla</button>'+
        '</nav>'+
      '</div>'+
      '<div class="v27-detail-body">'+
        '<div class="v27-club-strip">'+teamStrip(t)+'</div>'+
        '<section class="v27-content-block">'+
          '<div class="v27-block-head"><h2>Próximo partido</h2><button class="v27-link" type="button" data-v27-competition>Ver todo</button></div>'+
          '<div class="v27-match-card">'+
            '<div class="v27-match-top">Jornada de Liga · Próximo encuentro</div>'+
            '<div class="v27-players">'+playerNames.map(function(n,i){return '<div class="v27-player"><div class="v27-player-avatar"></div><b>'+esc(n)+'</b><small>'+(i===0?'POR':i===1?'MED':'DEL')+'</small></div>'}).join('')+'</div>'+
          '</div>'+
        '</section>'+
        '<section class="v27-panel">'+
          '<div class="v27-panel-title"><span>Estado de forma</span><i class="v27-chevron"></i></div>'+
          '<div class="v27-form"><i class="w">V</i><i class="d">D</i><i class="d">D</i><i class="e">E</i><i class="w current">V</i></div>'+
        '</section>'+
        '<section class="v27-panel">'+
          '<div class="v27-panel-title"><span>Datos clave</span><i class="v27-chevron"></i></div>'+
          '<div class="v27-key-grid">'+
            '<div class="v27-ring"><div><b>1</b><span>partido<br>jugado</span></div></div>'+
            '<div class="v27-record"><div><i></i><span>Ganados</span><b>0</b></div><div><i></i><span>Empatados</span><b>0</b></div><div><i></i><span>Perdidos</span><b>1</b></div></div>'+
          '</div>'+
          '<div class="v27-stats">'+
            '<div class="v27-stat"><strong>1</strong><span>Goles</span><small>1.0 por partido</small></div>'+
            '<div class="v27-stat"><strong>6</strong><span>Goles encajados</span><small>6.0 por partido</small></div>'+
            '<div class="v27-stat"><strong>34%</strong><span>Posesión</span></div>'+
            '<div class="v27-stat"><strong>77%</strong><span>Precisión de pase</span></div>'+
            '<div class="v27-stat"><strong>30</strong><span>Balones recuperados</span></div>'+
            '<div class="v27-stat"><strong>2</strong><span>Paradas</span></div>'+
            '<div class="v27-stat"><strong>0</strong><span>Penaltis cometidos</span></div>'+
            '<div class="v27-stat"><strong>8</strong><span>Faltas cometidas</span></div>'+
            '<div class="v27-stat"><strong>113</strong><span>Distancia recorrida</span><small>km</small></div>'+
            '<div class="v27-stat"><strong><i class="v27-card-dot"></i>1</strong><span>Tarjetas amarillas</span></div>'+
            '<div class="v27-stat"><strong><i class="v27-card-dot red"></i>0</strong><span>Tarjetas rojas</span></div>'+
          '</div>'+
        '</section>'+
        '<section class="v27-panel">'+
          '<div class="v27-panel-title"><span>Goleador</span><i class="v27-chevron"></i></div>'+
          '<div class="v27-scorer"><span class="v27-scorer-avatar">9</span><div><b>José Pozos</b><small>Delantero</small></div><strong>1</strong></div>'+
        '</section>'+
      '</div>'+
    '</section>';
  }

  function render(){
    /* TEAMDETAIL_OWNER_FIX1 — V27 solo controla la lista Equipos; V42 controla la ficha del equipo. */
    const r=route();
    const active=r==='teams';
    document.body.classList.toggle('v27-teams-active',active);
    navReferenceMode(active);
    if(!active)return;
    const screen=document.querySelector('#screen');
    if(!screen)return;
    screen.innerHTML=r==='teams'?teamsMarkup():detailMarkup();
    bind();
    window.scrollTo(0,0);
  }

  function bind(){
    document.querySelectorAll('[data-v27-back]').forEach(function(b){
      b.onclick=function(){location.hash=route()==='teamDetail'?'#/teams':'#/more'};
    });
    document.querySelectorAll('[data-v27-team]').forEach(function(b){
      b.onclick=function(){
        const t=team(b.dataset.v27Team);if(!t)return;
        saveSelected(t.id);localStorage.setItem('v62-team-name',t.name);detailTab='summary';
        if(window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(t.name)}else location.hash='#/teamDetail';
      };
    });
    const search=document.querySelector('#v27TeamSearch');
    if(search){
      search.oninput=function(){
        query=search.value;
        const s=document.querySelector('#screen');
        if(s){s.innerHTML=teamsMarkup();bind();const n=document.querySelector('#v27TeamSearch');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}}
      };
    }
    document.querySelectorAll('[data-v27-tab]').forEach(function(b){
      b.onclick=function(){detailTab=b.dataset.v27Tab;render();toast(b.textContent+' · diseño listo')};
    });
    document.querySelectorAll('[data-v27-follow]').forEach(function(b){
      b.onclick=function(){toggleFollow(b.dataset.v27Follow);render();toast(isFollowed(b.dataset.v27Follow)?'Equipo seguido':'Dejaste de seguir al equipo')};
    });
    const compare=document.querySelector('[data-v27-compare]');
    if(compare)compare.onclick=function(){toast('Comparación preparada para '+selected().name)};
    const share=document.querySelector('[data-v27-share]');
    if(share)share.onclick=function(){
      const t=selected();
      const payload={title:t.name,text:'Liga Municipal de Fútbol Juventino Rosas · '+t.name,url:location.href};
      if(navigator.share){navigator.share(payload).catch(function(){})}
      else if(navigator.clipboard){navigator.clipboard.writeText(location.href).then(function(){toast('Enlace copiado')}).catch(function(){toast('Contenido listo para compartir')})}
      else toast('Contenido listo para compartir');
    };
    const all=document.querySelector('[data-v27-competition]');
    if(all)all.onclick=function(){location.hash='#/competition'};
  }

  /* TEAMS_RESTORE_GUARD4 — V27 vuelve a ser el dueño visible de #/teams.
     Si cualquier módulo dibuja la lista genérica (tarjetas largas con Seguir/estrella),
     se reemplaza inmediatamente por el diseño anterior: cabecera propia, buscador,
     Siguiendo horizontal y cuadrícula de escudos. */
  let rendering=false;
  function forceRender(){
    if(rendering||route()!=='teams')return;
    const target=document.querySelector('#screen');
    if(!target)return;
    const ok=!!target.querySelector('.v27-teams-page[data-v27-reference="teams"]');
    const generic=!!target.querySelector('.team-list,.team-row,.chips');
    if(ok&&!generic)return;
    rendering=true;
    try{render()}finally{rendering=false}
  }
  function schedule(){
    queueMicrotask(forceRender);
    requestAnimationFrame(forceRender);
  }

  window.addEventListener('hashchange',schedule);
  const target=document.querySelector('#screen');
  if(target){
    new MutationObserver(function(){
      if(route()==='teams')schedule();
    }).observe(target,{childList:true,subtree:false});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();