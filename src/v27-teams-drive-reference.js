/* PARTS27 — Teams / Team detail rebuilt from the two user Drive references. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE_LOGO=BASE+'assets/liga-logo.webp';

  const V27_TEAMS=[
  {
    "id": "OFF-LA-ESPERANZA",
    "name": "La Esperanza",
    "short": "La Esperanza",
    "logo": "./assets/season-2026/la-esperanza.webp",
    "abbr": "LE",
    "category": "Veteranos 50+",
    "catId": "1"
  },
  {
    "id": "OFF-DYNAMO",
    "name": "Dynamo",
    "short": "Dynamo",
    "logo": "./assets/season-2026/dynamo.webp",
    "abbr": "D",
    "category": "Veteranos 50+",
    "catId": "1"
  },
  {
    "id": "OFF-BOCA-JRS",
    "name": "Boca Jrs",
    "short": "Boca Jrs",
    "logo": "./assets/season-2026/boca-juniors.webp",
    "abbr": "BJ",
    "category": "Veteranos 50+",
    "catId": "1"
  },
  {
    "id": "OFF-TOROS-DE-CUENDA",
    "name": "Toros de Cuenda",
    "short": "Toros de Cuenda",
    "logo": "./assets/season-2026/santiago-cuenda.webp",
    "abbr": "TDC",
    "category": "Veteranos 50+",
    "catId": "1"
  },
  {
    "id": "OFF-BOAVISTA",
    "name": "Boavista",
    "short": "Boavista",
    "logo": "./assets/season-2026/boavista-v774.webp",
    "abbr": "B",
    "category": "Veteranos 50+",
    "catId": "1"
  },
  {
    "id": "OFF-MANCHESTER",
    "name": "Manchester",
    "short": "Manchester",
    "logo": "./assets/season-2026/manchester.webp",
    "abbr": "M",
    "category": "Veteranos 50+",
    "catId": "1"
  },
  {
    "id": "OFF-BOAVISTA-V35",
    "name": "BOAVISTA",
    "short": "BOAVISTA",
    "logo": "./assets/season-2026/boavista-v774.webp",
    "abbr": "BOA",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-FRANCO-TAVERA-JR-V35",
    "name": "FRANCO-TAVERA-JR",
    "short": "FRANCO-TAVERA-JR",
    "logo": "./assets/season-2026/franco-tavera.webp",
    "abbr": "FTJ",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-HURACAN-V35",
    "name": "HURACAN",
    "short": "HURACAN",
    "logo": "./assets/season-2026/huracan.webp",
    "abbr": "HUR",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-CUENDA-V35",
    "name": "CUENDA",
    "short": "CUENDA",
    "logo": "./assets/season-2026/santiago-cuenda.webp",
    "abbr": "CUE",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-AMERICA-V35",
    "name": "AMERICA",
    "short": "AMERICA",
    "logo": "./assets/season-2026/america.webp",
    "abbr": "AME",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-AGUILARES-V35",
    "name": "AGUILARES",
    "short": "AGUILARES",
    "logo": "./assets/season-2026/aguilares.webp",
    "abbr": "AGU",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-JUVENTUS-V35",
    "name": "JUVENTUS",
    "short": "JUVENTUS",
    "logo": "./assets/season-2026/juventus.webp",
    "abbr": "JUV",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-LEYENDAS-FC-V35",
    "name": "LEYENDAS FC",
    "short": "LEYENDAS FC",
    "logo": "./assets/season-2026/leyendas.webp",
    "abbr": "LEY",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-PSV-V35",
    "name": "PSV",
    "short": "PSV",
    "logo": "./assets/season-2026/psv.webp",
    "abbr": "PSV",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-LA-TRINIDAD-V35",
    "name": "LA TRINIDAD",
    "short": "LA TRINIDAD",
    "logo": "./assets/season-2026/la-trinidad.webp",
    "abbr": "TRI",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-CAT2-POZOSFC",
    "name": "POZOS FC",
    "short": "POZOS FC",
    "logo": "./assets/season-2026/pozos.webp",
    "abbr": "POZ",
    "category": "Veteranos 35+",
    "catId": "2"
  },
  {
    "id": "OFF-SAN-JOSE-FC",
    "name": "San José FC",
    "short": "San José FC",
    "logo": "./assets/season-2026/san-jose.webp",
    "abbr": "SJF",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-JUVENTUS",
    "name": "Juventus",
    "short": "Juventus",
    "logo": "./assets/season-2026/juventus.webp",
    "abbr": "J",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-LINCES",
    "name": "Linces",
    "short": "Linces",
    "logo": "./assets/season-2026/linces.webp",
    "abbr": "L",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-NAPOLI",
    "name": "Napoli",
    "short": "Napoli",
    "logo": "./assets/season-2026/napoli.webp",
    "abbr": "N",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-HERMANOS",
    "name": "Hermanos",
    "short": "Hermanos",
    "logo": "./assets/season-2026/hermanos.webp",
    "abbr": "H",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-FRANCO-FC",
    "name": "Franco FC",
    "short": "Franco FC",
    "logo": "./assets/season-2026/franco.webp",
    "abbr": "FF",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-HERRERAS-FC",
    "name": "Herreras FC",
    "short": "Herreras FC",
    "logo": "./assets/season-2026/herrera.webp",
    "abbr": "HF",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-ABEJAS",
    "name": "Abejas",
    "short": "Abejas",
    "logo": "./assets/season-2026/abejas.webp",
    "abbr": "A",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-TERRICOLAS",
    "name": "Terrícolas",
    "short": "Terrícolas",
    "logo": "./assets/season-2026/terricolas.webp",
    "abbr": "T",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-LOBOS-CDG",
    "name": "Lobos CDG",
    "short": "Lobos CDG",
    "logo": "./assets/season-2026/lobos-cdg.webp",
    "abbr": "LC",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-GALACTICOS",
    "name": "Galácticos",
    "short": "Galácticos",
    "logo": "./assets/season-2026/galacticos.webp",
    "abbr": "G",
    "category": "Primera Fuerza",
    "catId": "3"
  },
  {
    "id": "OFF-TAVERA-FC",
    "name": "Tavera FC",
    "short": "Tavera FC",
    "logo": "./assets/season-2026/tavera.webp",
    "abbr": "TF",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-PACHANGAS-FC",
    "name": "Pachangas FC",
    "short": "Pachangas FC",
    "logo": "./assets/season-2026/pachangas.webp",
    "abbr": "PF",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-SAN-JUAN-FC",
    "name": "San Juan FC",
    "short": "San Juan FC",
    "logo": "./assets/season-2026/san-juan.webp",
    "abbr": "SJF",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-TAPATIO",
    "name": "Tapatío",
    "short": "Tapatío",
    "logo": "./assets/season-2026/tapatio.webp",
    "abbr": "T",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-DEP-LA-LUZ",
    "name": "Dep. La Luz",
    "short": "Dep. La Luz",
    "logo": "./assets/season-2026/la-luz.webp",
    "abbr": "DLL",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-SAN-JULIAN",
    "name": "San Julián",
    "short": "San Julián",
    "logo": "./assets/season-2026/san-julian.webp",
    "abbr": "SJ",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-BARZA",
    "name": "Barza",
    "short": "Barza",
    "logo": "./assets/season-2026/barza.webp",
    "abbr": "B",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-SAN-JOSE-JRS",
    "name": "San José Jrs",
    "short": "San José Jrs",
    "logo": "./assets/season-2026/san-jose-jr.webp",
    "abbr": "SJJ",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-SAN-ANTONIO-FC",
    "name": "San Antonio FC",
    "short": "San Antonio FC",
    "logo": "./assets/season-2026/san-antonio.webp",
    "abbr": "SAF",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-CELTICOS",
    "name": "Célticos FC",
    "short": "Célticos FC",
    "logo": "./assets/season-2026/celticos.webp",
    "abbr": "C",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-DEP-NOPALERO",
    "name": "Dep. Nopalero",
    "short": "Dep. Nopalero",
    "logo": "./assets/season-2026/nopalero.webp",
    "abbr": "DN",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-DEP-ZAPATA",
    "name": "Dep. Zapata",
    "short": "Dep. Zapata",
    "logo": "./assets/season-2026/zapata.webp",
    "abbr": "DZ",
    "category": "Segunda Fuerza",
    "catId": "4"
  },
  {
    "id": "OFF-LA-CANCHITA-DEPORTES",
    "name": "La Canchita Deportes",
    "short": "La Canchita Deportes",
    "logo": "./assets/season-2026/la-canchita.webp",
    "abbr": "LCD",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-ATL-GALEANA",
    "name": "Galeana",
    "short": "Galeana",
    "logo": "./assets/season-2026/galeana.webp",
    "abbr": "AG",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-ALDAMA-FC",
    "name": "Aldama FC",
    "short": "Aldama FC",
    "logo": "./assets/season-2026/aldama.webp",
    "abbr": "AF",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-MALVINAS",
    "name": "Malvinas",
    "short": "Malvinas",
    "logo": "./assets/season-2026/malvinas.webp",
    "abbr": "M",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-CAPIBARAS",
    "name": "Capibaras",
    "short": "Capibaras",
    "logo": "./assets/season-2026/capibaras.webp",
    "abbr": "C",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-LA-CUADRILLA",
    "name": "La Cuadrilla",
    "short": "La Cuadrilla",
    "logo": "./assets/season-2026/la-cuadrilla.webp",
    "abbr": "LC",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-MAZACOTES-FC",
    "name": "Mazacotes FC",
    "short": "Mazacotes FC",
    "logo": "./assets/season-2026/mazacotes.webp",
    "abbr": "MF",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-DEP-MARAVILLAS",
    "name": "Dep. Maravillas",
    "short": "Dep. Maravillas",
    "logo": "./assets/season-2026/maravillas.webp",
    "abbr": "DM",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-OSASUNA",
    "name": "Osasuna",
    "short": "Osasuna",
    "logo": "./assets/season-2026/osasuna.webp",
    "abbr": "O",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-SAN-ANTONIO-JRS",
    "name": "San Antonio Jrs",
    "short": "San Antonio Jrs",
    "logo": "./assets/season-2026/san-antonio-jrs.webp",
    "abbr": "SAJ",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-POPULARES",
    "name": "Populares",
    "short": "Populares",
    "logo": "./assets/season-2026/populares.webp",
    "abbr": "P",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-PROMESAS-FC",
    "name": "Promesas FC",
    "short": "Promesas FC",
    "logo": "./assets/season-2026/promesas.webp",
    "abbr": "PF",
    "category": "Intermedia",
    "catId": "5"
  },
  {
    "id": "OFF-LA-HUERTA",
    "name": "La Huerta",
    "short": "La Huerta",
    "logo": "./assets/season-2026/la-huerta.webp",
    "abbr": "LH",
    "category": "Intermedia",
    "catId": "5"
  }
];



  /* V1191: compartir exactamente los archivos de la sección Equipos. */
  function currentKey(value){
    return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
  }
  window.LJR_TEAMS_CURRENT_LOGO={
    get(name,category){
      const key=currentKey(name),cat=currentKey(category);
      if(!key)return '';
      const aliases=[key,key.replace(/^(dep|deportivo) /,''),key.replace(/ (fc|f c)$/,'')];
      const matches=V27_TEAMS.filter(t=>aliases.includes(currentKey(t.name))||aliases.includes(currentKey(t.short)));
      const chosen=matches.find(t=>cat&&currentKey(t.category)===cat)||matches[0];
      return chosen?.logo ? new URL(chosen.logo,document.baseURI).href : '';
    }
  };

  const FIRST_GRID=V27_TEAMS.slice(0,17);
  const LIBRE_TEAMS=V27_TEAMS.slice(17);
  const playerNames=[];

  let query='';
  let detailTab='summary';

  function route(){return location.hash.replace('#/','').split('?')[0]||'home'}
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
    const src=globalLogo||(t.logo?(/^(https?:|data:)/i.test(t.logo)?t.logo:(t.logo.startsWith('./')?t.logo:BASE+t.logo)):'');
    if(src){
      return '<span class="'+cls+'"><img src="'+src+'" alt="'+esc(t.name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v27-fallback" style="display:none">'+esc(t.abbr||t.id)+'</span></span>';
    }
    return '<span class="'+cls+'"><span class="v27-fallback">'+esc(t.abbr||t.id)+'</span></span>';
  }
  function tile(t,followedOnly){
    return '<button type="button" class="v27-team-tile'+(followedOnly?' followed-only':'')+'" data-v27-team="'+t.id+'" title="'+esc(t.name+' · '+t.category)+'">'+logo(t)+'<span>'+esc(t.short||t.name)+'</span></button>';
  }
  function backIcon(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
  function searchIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 5.1 5.1"/></svg>'}
  function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="m8.2 10.9 7.5-4.5M8.2 13.1l7.5 4.5"/></svg>'}
  function toast(msg){
    const old=document.querySelector('.v27-toast');if(old)old.remove();
    const n=document.createElement('div');n.className='v27-toast';n.textContent=msg;document.body.appendChild(n);
    setTimeout(function(){n.remove()},1700);
  }

  function navReferenceMode(){/* Global nav state/labels are owned by V34. */}
  function teamsMarkup(){
    const q=query.trim().toLocaleLowerCase('es');
    const matches=function(t){return !q||t.name.toLocaleLowerCase('es').includes(q)||t.short.toLocaleLowerCase('es').includes(q)};
    const list=FIRST_GRID.filter(matches);
    const libre=LIBRE_TEAMS.filter(matches);
    const followed=followedIds();
    let followedTeams=V27_TEAMS.filter(function(t){return followed.indexOf(t.id)!==-1});
    if(!followedTeams.length)followedTeams=[team('PRO')];
    return '<section class="v27-teams-page" data-v27-reference="teams" data-team-directory-owner="v27-categories">'+
      '<header class="v27-teams-head">'+
        '<button class="v27-back" type="button" data-v27-back aria-label="Volver">'+backIcon()+'</button>'+
        '<h1>Equipos</h1>'+
        '<label class="v27-search">'+searchIcon()+'<input id="v27TeamSearch" type="search" autocomplete="off" placeholder="Buscar equipos" value="'+esc(query)+'"></label>'+
      '</header>'+
      '<section class="v27-section"><h2>Siguiendo</h2><div class="v27-followed-row">'+followedTeams.slice(0,4).map(function(t){return tile(t,true)}).join('')+'</div></section>'+
      '<section class="v27-section"><h2>Veteranos 35+ y 50+ <img src="./assets/season-2026/veteranos-35.webp" alt="Veteranos 35+" width="17" height="17" style="object-fit:contain;vertical-align:middle"> <img src="./assets/season-2026/veteranos-50.webp" alt="Veteranos 50+" width="17" height="17" style="object-fit:contain;vertical-align:middle"></h2><div class="v27-grid">'+(list.length?list.map(function(t){return tile(t,false)}).join(''):'<div class="v27-empty-grid">No se encontraron equipos.</div>')+'</div></section>'+
      '<section class="v27-section v27-libre"><h2>Primera, Segunda e Intermedia <img src="./assets/season-2026/primera.webp" alt="Primera" width="17" height="17" style="object-fit:contain;vertical-align:middle"> <img src="./assets/season-2026/segunda.webp" alt="Segunda" width="17" height="17" style="object-fit:contain;vertical-align:middle"> <img src="./assets/season-2026/intermedia.webp" alt="Intermedia" width="17" height="17" style="object-fit:contain;vertical-align:middle"></h2><div class="v27-grid">'+(libre.length?libre.map(function(t){return tile(t,false)}).join(''):'<div class="v27-empty-grid">No se encontraron equipos.</div>')+'</div></section>'+
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
      b.onclick=function(e){
        // V975 — This card owns its click. Do not trigger global
        // player/team comparators through a delegated duplicate handler.
        e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();
        const t=team(b.dataset.v27Team);if(!t)return;
        saveSelected(t.id);localStorage.setItem('v62-team-name',t.name);if(t.catId)localStorage.setItem('v62-category',String(t.catId));detailTab='summary';
        localStorage.setItem('v42-team-tab','summary');localStorage.removeItem('v42-open-compare');
        if(window.LJR_TEAM_DETAIL_API?.openTeam?.(t.name,t.catId))return;
        location.hash='#/teamDetail?tab=summary';
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