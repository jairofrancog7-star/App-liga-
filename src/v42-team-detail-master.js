/* V42.2 — Perfil de equipo funcional basado en las referencias Champions League enviadas.
   Aislado a #/teamDetail. No modifica otras pantallas. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';

  const TEAMS={
    AME:{name:'Club América Veteranos',city:'Juventino Rosas',category:'Veteranos 35+',logo:'assets/branding/america-veteranos-35-user.png',p:5,pts:7,gd:1,form:['V','V','E','D','V']},
    HUE:{name:'La Huerta',city:'Cuenda · Juventino Rosas',category:'Intermedia',logo:'assets/official-logos/la-huerta.png',p:5,pts:9,gd:3,form:['V','V','V','E','D']},
    PRO:{name:'Promesas FC',city:'Pozos · Juventino Rosas',category:'Intermedia',logo:'assets/official-logos/promesas-fc.png',p:5,pts:8,gd:2,form:['V','E','V','D','V']},
    FRA:{name:'Franco FC',city:'Juventino Rosas',category:'Primera Fuerza',logo:'assets/official-logos/franco-fc.png',p:5,pts:8,gd:1,form:['E','V','V','D','V']},
    GAL:{name:'Atlético Galeana',city:'Galeana · Juventino Rosas',category:'Intermedia',logo:'assets/official-logos/galeana.png',p:5,pts:10,gd:4,form:['V','V','E','V','D']},
    LOB:{name:'Lobos CDG',city:'Cerrito de Gasca',category:'Primera Fuerza',logo:'assets/official-logos/lobos-cdg.png',p:5,pts:7,gd:0,form:['E','D','V','V','E']},
    JUV:{name:'Juventino',city:'Juventino Rosas',category:'Primera Fuerza',logo:'assets/liga-logo.webp',p:5,pts:13,gd:9,form:['V','V','E','V','V']},
    CUE:{name:'Cuenda',city:'Cuenda · Juventino Rosas',category:'Primera Fuerza',logo:'assets/teams/tc-cuenda.webp',p:5,pts:8,gd:1,form:['V','E','E','D','V']},
    POZ:{name:'Pozos FC',city:'Pozos · Juventino Rosas',category:'Primera Fuerza',logo:'assets/teams/pozos-fc.webp',p:5,pts:11,gd:6,form:['V','E','V','V','E']},
    RIN:{name:'Rincón de Centeno',city:'Rincón de Centeno · Juventino Rosas',category:'Primera Fuerza',logo:'assets/liga-logo.webp',p:5,pts:9,gd:3,form:['E','V','D','V','V']},
    SPD:{name:'San Pedro',city:'Juventino Rosas',category:'Veteranos 35+',logo:'assets/liga-logo.webp',p:5,pts:6,gd:-1,form:['D','V','E','E','D']},
    MOR:{name:'Morales',city:'Juventino Rosas',category:'Veteranos 35+',logo:'assets/liga-logo.webp',p:5,pts:4,gd:-4,form:['D','E','D','V','D']},
    STC:{name:'Santa Cruz',city:'Juventino Rosas',category:'Primera Fuerza',logo:'assets/teams/atletico-santa-cruz.webp',p:5,pts:6,gd:0,form:['V','D','E','V','D']},
    TAV:{name:'Franco Tavera',city:'Tavera · Juventino Rosas',category:'Veteranos 35+',logo:'assets/teams/franco-tavera-jr-veteranos.webp',p:5,pts:5,gd:-1,form:['D','V','E','D','V']},
    SJO:{name:'San José FC',city:'Juventino Rosas',category:'Primera Fuerza',logo:'assets/official-logos/san-jose-fc.png',p:5,pts:7,gd:2,form:['V','E','D','V','E']},
    SAN:{name:'Atlético Santiago',city:'Santiago de Cuenda',category:'Veteranos 35+',logo:'assets/teams/atletico-santiago.webp',p:5,pts:6,gd:0,form:['E','V','D','V','D']},
    LJR:{name:'Lobos JR',city:'Cerrito de Gasca',category:'Primera Fuerza',logo:'assets/teams/lobos-jr-cerrito-gasca.webp',p:5,pts:5,gd:-2,form:['D','E','V','V','D']},
    HER:{name:'Hermanos',city:'Juventino Rosas',category:'Primera Fuerza',logo:'assets/official-logos/hermanos.png',p:5,pts:9,gd:2,form:['V','D','V','V','E']},
    LIN:{name:'Linces',city:'Juventino Rosas',category:'Primera Fuerza',logo:'assets/official-logos/linces.png',p:5,pts:8,gd:1,form:['E','V','V','D','V']},
    TER:{name:'Terrícolas',city:'Juventino Rosas',category:'Primera Fuerza',logo:'assets/official-logos/terricolas.png',p:5,pts:5,gd:-2,form:['D','V','D','E','V']},
    GAC:{name:'Galácticos',city:'Pozos · Juventino Rosas',category:'Primera Fuerza',logo:'assets/teams/galacticos-pozos.webp',p:5,pts:7,gd:0,form:['E','V','E','D','V']},
    ESP:{name:'La Esperanza',city:'Juventino Rosas',category:'Veteranos 50+',logo:'assets/official-logos/la-esperanza.png',p:5,pts:8,gd:2,form:['V','E','V','D','V']},
    TVF:{name:'Tavera FC',city:'Tavera · Juventino Rosas',category:'Segunda Fuerza',logo:'assets/official-logos/tavera-fc.png',p:5,pts:6,gd:-1,form:['D','V','E','V','D']}
  };

  /* TEAM_LINKS_ALL_V1 — perfiles disponibles para todos los clubes mostrados en la app. */
  Object.assign(TEAMS,{
    ROS:{name:'Deportivo Rosas',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    HFC:{name:'Herreras FC',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/herreras-fc.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    BOA:{name:'Boavista',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/boavista.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    PSV:{name:'PSV',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/teams/psv.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    CGS:{name:'C. de Gasca',city:'Cerrito de Gasca',category:'Liga Municipal',logo:'assets/teams/deportivo-cg.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    SJL:{name:'San Julián',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/san-julian.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    NOP:{name:'Dep. Nopalero',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/dep-nopalero.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    JUVS:{name:'Juventus',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/juventus.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    HUR:{name:'Huracán',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    DYN:{name:'Dynamo',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/dynamo.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    BOC:{name:'Boca Jrs',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    MAN:{name:'Manchester',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/manchester.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    NAP:{name:'Napoli',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/napoli.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    ABE:{name:'Abejas',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/abejas.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    CAN:{name:'La Canchita Deportes',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/la-canchita-deportes.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    ALD:{name:'Aldama FC',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/aldama-fc.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    MAL:{name:'Malvinas',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/malvinas.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    CAP:{name:'Capibaras',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/capibaras.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    CUA:{name:'La Cuadrilla',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/la-cuadrilla.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    MAZ:{name:'Mazacotes FC',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/mazacotes-fc.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    MAR:{name:'Dep. Maravillas',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/dep-maravillas.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    OSA:{name:'Osasuna',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/osasuna.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    SAJ:{name:'San Antonio Jrs',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/san-antonio-jrs.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    POP:{name:'Populares',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/populares.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    PAC:{name:'Pachangas FC',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/pachangas-fc.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    SJU:{name:'San Juan FC',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/san-juan-fc.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    TAP:{name:'Tapatío',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/tapatio.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    LAL:{name:'Dep. La Luz',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/dep-la-luz.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    BAR:{name:'Barza',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/barza.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    SJJ:{name:'San José Jrs',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/san-jose-jrs.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    SAF:{name:'San Antonio FC',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/san-antonio-fc.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    CEL:{name:'Célticos FC',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/celticos.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    ZAP:{name:'Dep. Zapata',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/official-logos/dep-zapata.png',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    SIS:{name:'San Isidro',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    RJU:{name:'Real Juventino',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/teams/juventus.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    VAL:{name:'Valle Verde',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    LAB:{name:'La Labor',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    DUR:{name:'El Durazno',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    ARC:{name:'Los Arcos',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    PAL:{name:'Las Palomas',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']},
    EST:{name:'La Estancia',city:'Juventino Rosas',category:'Liga Municipal',logo:'assets/liga-logo.webp',p:0,pts:0,gd:0,form:['E','E','E','E','E']}
  });

  const ALIASES={
    juventino:'JUV',pozos:'POZ','pozos fc':'POZ',rincon:'RIN','rincón de centeno':'RIN',cuenda:'CUE',
    sanpedro:'SPD','san pedro':'SPD',morales:'MOR',america:'AME','club america veteranos':'AME',
    'club américa veteranos':'AME','la huerta':'HUE','promesas fc':'PRO','franco fc':'FRA',
    'atletico galeana':'GAL','atlético galeana':'GAL','lobos cdg':'LOB','franco tavera':'TAV',
    'san jose fc':'SJO','san josé fc':'SJO','atletico santiago':'SAN','atlético santiago':'SAN',
    hermanos:'HER',linces:'LIN','terricolas':'TER','terrícolas':'TER','galacticos':'GAC','galácticos':'GAC',
    'la esperanza':'ESP','tavera fc':'TVF','santa cruz':'STC'
  };

  const ROSTER=[
    {group:'Porteros',players:[['Luis Navarro','Juventino Rosas','1',0],['Mateo Reyes','Guanajuato','12',1],['Emilio Soto','México','23',2]]},
    {group:'Defensas',players:[['Óscar Medina','Juventino Rosas','2',3],['Diego Ramírez','Guanajuato','4',4],['Iván Cruz','México','5',5],['Jorge Salazar','Juventino Rosas','15',6]]},
    {group:'Mediocampistas',players:[['Sergio Luna','Juventino Rosas','6',8],['Edgar Ruiz','Guanajuato','8',9],['Marco Hernández','México','10',10],['Carlos Vega','Juventino Rosas','14',11]]},
    {group:'Delanteros',players:[['Juan Pérez','Juventino Rosas','9',13],['Miguel Torres','Guanajuato','11',14],['Fernando Reyes','México','19',15]]}
  ];

  const NOTIFY_ROWS=[
    ['goals','⚽','Goles',true],
    ['penalties','🥅','Tandas de penalti',false],
    ['startFinal','◴','Inicio / Final',true],
    ['lineups','▦','Alineaciones oficiales',true],
    ['redCards','■','Tarjetas rojas',true],
    ['subs','▲▼','Cambios',false],
    ['video','▣','Resumen en vídeo disponible',true],
    ['news','▤','Noticias',true]
  ];

  const COMPARE_EXCLUDED=new Set(['SPD','SIS']); // equipos marcados por el usuario como inexistentes

  let activeTab=localStorage.getItem('v42-team-tab')||'summary';
  let menuOpen=false,notifyOpen=false,compareOpen=false,compareTarget=null;

  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function normalizeKey(raw){
    return String(raw||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
      .replace(/&/g,' y ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
  }
  function normalizeId(raw){
    const v=String(raw||'').trim();
    if(TEAMS[v])return v;
    const key=normalizeKey(v);
    const alias=ALIASES[key]||ALIASES[String(raw||'').toLowerCase()];
    if(alias&&TEAMS[alias])return alias;
    const manual={
      'america veteranos':'AME','club america veteranos jr':'AME','atletico santa cruz':'STC',
      'deportivo rosas':'ROS','pozos':'POZ','deportivo juventino':'JUV','san antonio':'SAJ',
      'a santiago':'SAN','atletico santiago':'SAN','dep la luz':'LAL','deportivo la luz':'LAL'
    };
    if(manual[key]&&TEAMS[manual[key]])return manual[key];
    for(const [id,t] of Object.entries(TEAMS)){
      if(normalizeKey(id)===key||normalizeKey(t.name)===key)return id;
    }
    return '';
  }
  function openTeam(id){
    const resolved=normalizeId(id);
    if(!resolved||!TEAMS[resolved])return false;
    localStorage.setItem('v27-selected-team',resolved);
    activeTab='summary';
    localStorage.setItem('v42-team-tab','summary');
    menuOpen=false;notifyOpen=false;compareOpen=false;compareTarget=null;
    if(route()==='teamDetail')rerender();
    else location.hash='#/teamDetail';
    return true;
  }
  function teamIdFromClick(target){
    if(!(target instanceof Element))return '';
    const explicit=target.closest('[data-v41-team],[data-v32-open-team],[data-v27-team],[data-v28-team],[data-v33-team],[data-v40-team],[data-team]');
    if(explicit){
      const label=explicit.querySelector('strong,small')?.textContent||'';
      const labelId=normalizeId(label);
      if(labelId)return labelId;
      const explicitImg=explicit.querySelector('img');
      const altId=normalizeId(explicitImg?.getAttribute('alt')||explicitImg?.getAttribute('title')||'');
      if(altId)return altId;
      const textId=normalizeId((explicit.textContent||'').trim());
      if(textId)return textId;
      const raw=explicit.dataset.v41Team||explicit.dataset.v32OpenTeam||explicit.dataset.v27Team||
        explicit.dataset.v28Team||explicit.dataset.v33Team||explicit.dataset.v40Team||explicit.dataset.team;
      const rawId=normalizeId(raw);
      if(rawId)return rawId;
    }
    const img=target.closest('img')||(target.closest('button,a,article,li,tr,div')?.querySelector('img')||null);
    if(img){
      const altId=normalizeId(img.getAttribute('alt')||img.getAttribute('title')||'');
      if(altId)return altId;
      const src=String(img.getAttribute('src')||'').toLowerCase();
      if(src&&!src.includes('liga-logo.webp')){
        const hits=Object.entries(TEAMS).filter(([,t])=>t.logo&&src.includes(t.logo.split('/').pop().toLowerCase()));
        if(hits.length===1)return hits[0][0];
      }
    }
    let node=target;
    for(let i=0;i<4&&node;i++,node=node.parentElement){
      const txt=(node.textContent||'').trim();
      if(txt&&txt.length<=56){
        const id=normalizeId(txt);
        if(id)return id;
      }
    }
    return '';
  }
  function selectedId(){return normalizeId(localStorage.getItem('v27-selected-team')||'JUV')}
  function team(id=selectedId()){return TEAMS[id]||TEAMS.JUV}
  function logo(t){return BASE+t.logo}
  function getStore(){try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}catch(e){return {}}}
  function putStore(s){localStorage.setItem('lj-store-v3',JSON.stringify(s))}
  function followed(){const s=getStore();return Array.isArray(s.followed)&&s.followed.includes(selectedId())}
  function toggleFollow(){const s=getStore(),a=Array.isArray(s.followed)?s.followed.slice():[],id=selectedId(),i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);s.followed=a;putStore(s)}
  function notifKey(){return 'v42-notifications-'+selectedId()}
  function notifState(){
    let saved={};try{saved=JSON.parse(localStorage.getItem(notifKey())||'{}')||{}}catch(e){}
    const base=Object.fromEntries(NOTIFY_ROWS.map(r=>[r[0],r[3]]));
    return {...base,...saved};
  }
  function saveNotif(obj){localStorage.setItem(notifKey(),JSON.stringify(obj))}
  function backIcon(){return '<svg viewBox="0 0 32 32"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
  function bellIcon(){return '<svg viewBox="0 0 24 24"><path d="M6 17h12l-1.4-2.3V10a4.6 4.6 0 0 0-9.2 0v4.7L6 17Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>'}
  function shareIcon(){return '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8 11 8-5M8 13l8 5"/></svg>'}
  function checkIcon(){return '<svg viewBox="0 0 20 20"><path d="m3.5 10.2 4 4.1 9-9"/></svg>'}
  function dotsIcon(){return '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>'}

  function avatar(seed,size='normal'){
    const skin=['#b96f4a','#d59b74','#8f5539','#c47d55'][seed%4];
    const hair=['#17171d','#2b1b15','#111725','#3b2b20'][seed%4];
    const shirt=['#1c9d93','#22b5a8','#1b8f87','#36afa5'][seed%4];
    return '<span class="v42-avatar '+(size==='large'?'large':'')+'" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#f7f7fb"/><path d="M12 64c2-13 10-20 20-20s18 7 20 20H12Z" fill="'+shirt+'"/><ellipse cx="32" cy="29" rx="13" ry="15" fill="'+skin+'"/><path d="M18 28c0-12 6-18 14-18 10 0 15 8 14 18-3-6-8-8-13-9-5 4-10 6-15 5Z" fill="'+hair+'"/><circle cx="27" cy="30" r="1.4" fill="#222"/><circle cx="37" cy="30" r="1.4" fill="#222"/><path d="M27 37c3 2 7 2 10 0" fill="none" stroke="#7d3d2d" stroke-width="1.6" stroke-linecap="round"/></svg></span>';
  }

  function playerRow(p){return '<button type="button" class="v42-player-row" data-v42-player="'+esc(p[0])+'">'+avatar(p[3])+'<span class="v42-player-copy"><strong>'+esc(p[0])+'</strong><small>'+esc(p[1])+'</small></span><b class="v42-number">'+esc(p[2])+'</b></button>'}
  function rosterMarkup(){return ROSTER.map(g=>'<section class="v42-roster-card"><h2>'+esc(g.group)+'</h2><div class="v42-roster-list">'+g.players.map(playerRow).join('')+'</div></section>').join('')}
  function opponents(){return Object.keys(TEAMS).filter(id=>id!==selectedId()).slice(0,6)}
  function miniTeam(id){const t=team(id);return '<span class="v42-mini-team"><img src="'+logo(t)+'" alt="" loading="lazy" decoding="async"><b>'+esc(t.name)+'</b></span>'}
  function nextOpponent(){return opponents()[0]||'POZ'}

  function summaryMarkup(){
    const t=team(),opp=nextOpponent(),squad=ROSTER.flatMap(g=>g.players).slice(0,3);
    return '<main class="v42-summary">'+
      '<div class="v42-round-strip" aria-label="Partidos recientes">'+
        opponents().slice(0,5).map((id,i)=>'<button type="button" data-v42-tab="matches"><span>'+miniTeam(i%2?selectedId():id)+'</span><small>'+(i%2?esc(t.name).slice(0,3).toUpperCase()+' - '+esc(team(id).name).slice(0,3).toUpperCase():esc(team(id).name).slice(0,3).toUpperCase()+' - '+esc(t.name).slice(0,3).toUpperCase())+'</small></button>').join('')+
      '</div>'+
      '<section class="v42-section"><div class="v42-section-head"><h2>Próximo partido</h2><button type="button" data-v42-tab="matches">Ver todo</button></div>'+
        '<article class="v42-next-card"><h3>Sáb 19 sep - Liga Municipal - Jornada</h3><div class="v42-next-body"><div>'+miniTeam(opp)+miniTeam(selectedId())+'</div><div class="v42-next-time"><b>11:45</b><button type="button" data-v42-tab="matches">Ver detalles</button></div></div></article>'+
      '</section>'+
      '<section class="v42-section v42-squad-preview"><div class="v42-section-head"><h2>Plantilla</h2><button type="button" data-v42-tab="squad">Ver todo</button></div><div class="v42-preview-grid">'+
        squad.map((p,i)=>'<button type="button" data-v42-tab="squad">'+avatar(p[3],'large')+'<strong>'+esc(p[0])+'</strong><small>'+(['Delantero','Delantero','Centrocampista'][i]||'Jugador')+'</small></button>').join('')+
      '</div></section>'+
      '<section class="v42-form-card"><div class="v42-form-title"><h2>Estado de forma</h2><span>⌄</span></div><div class="v42-form-dots">'+(t.form||['V','V','E','D','V']).map(x=>'<b class="'+x.toLowerCase()+'">'+x+'</b>').join('')+'</div></section>'+
    '</main>';
  }

  function matchesMarkup(){
    const t=team(),o=opponents();
    return '<main class="v42-tab-page"><section class="v42-section"><h2 class="v42-page-heading">Partidos anteriores</h2>'+
      [0,1].map((n)=>'<article class="v42-match-card"><h3>Sáb '+(12+n*7)+' sep - Liga Municipal - Jornada '+(4+n)+'</h3><div class="v42-match-body"><div class="v42-score-list"><div>'+miniTeam(n?selectedId():o[n])+'<strong>'+(n?'3':'1')+'</strong></div><div>'+miniTeam(n?o[n]:selectedId())+'<strong>'+(n?'1':'2')+'</strong></div></div><button class="v42-video-thumb" type="button" data-v42-video>▶</button></div></article>').join('')+
      '<h2 class="v42-page-heading next">Próximos partidos</h2><article class="v42-match-card"><h3>Sáb 26 sep - Liga Municipal - Jornada 6</h3><div class="v42-match-body"><div class="v42-score-list"><div>'+miniTeam(selectedId())+'</div><div>'+miniTeam(o[2]||o[0])+'</div></div><div class="v42-match-time">16:00<button type="button">Ver detalles</button></div></div></article>'+
    '</section></main>';
  }

  function standingsMarkup(){
    const rows=Object.entries(TEAMS).filter(([id])=>['JUV','POZ','RIN','CUE','SPD','MOR','AME','HUE','PRO','FRA'].includes(id)).sort((a,b)=>(b[1].pts||0)-(a[1].pts||0));
    return '<main class="v42-tab-page"><section class="v42-section"><div class="v42-section-head"><h2>Clasificación</h2><span>'+esc(team().category)+'</span></div>'+
      '<div class="v42-standings"><div class="v42-table-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>'+
      rows.map(([id,t],i)=>'<button type="button" class="'+(id===selectedId()?'current':'')+'" data-v42-select-team="'+id+'"><span>'+(i+1)+'</span><span>'+miniTeam(id)+'</span><span>'+t.p+'</span><span>'+(t.gd>0?'+':'')+t.gd+'</span><strong>'+t.pts+'</strong></button>').join('')+
      '</div></section></main>';
  }

  function squadMarkup(){return '<main class="v42-squad">'+rosterMarkup()+'</main>'}

  function statsMarkup(){
    const t=team(),played=t.p||0,w=Math.max(0,Math.min(played,Math.floor((t.pts||0)/3))),d=Math.max(0,Math.min(played-w,(t.pts||0)-w*3)),l=Math.max(0,played-w-d);
    const scored=Math.max(0,(t.gd||0)+6),against=Math.max(0,scored-(t.gd||0));
    return '<main class="v42-stats">'+
      '<section class="v42-key-card"><div class="v42-key-head"><h2>Datos clave</h2><span>⌃</span></div><div class="v42-key-grid"><div class="v42-ring"><b>'+played+'</b><small>Partidos<br>disputados</small></div><div class="v42-wdl"><p><i></i>Ganados <b>'+w+'</b></p><p><i></i>Empates <b>'+d+'</b></p><p><i></i>Perdidos <b>'+l+'</b></p></div><div><b>'+scored+'</b><small>Goles<br>marcados por partido</small></div><div><b>'+against+'</b><small>Goles encajados<br>por partido</small></div><div><b>40%</b><small>Posesión (%)</small></div><div><b>83%</b><small>Precisión en el pase (%)</small></div><div><b>30</b><small>Balones recuperados</small></div><div><b>6</b><small>Entradas con éxito</small></div></div></section>'+
      statPanel('Ataques','Saques de esquina','3','Fueras de juego','12','Ataques en el tercio ofensivo','16','Ataques en zonas clave','10')+
      statPanel('Información disciplinaria','Tarjetas amarillas','2','Tarjetas rojas','0','Faltas cometidas','13','Faltas sufridas','11')+
      statPanel('Disparos','Disparos totales','8','A portería','5','Despejados fuera','1','Bloqueados','2')+
    '</main>';
  }
  function statPanel(title,a,av,b,bv,c,cv,d,dv){
    return '<section class="v42-stat-panel"><div class="v42-stat-title"><h2>'+title+'</h2><span>⌃</span></div><div class="v42-stat-lines"><p><span>'+a+'</span><b>'+av+'</b></p><p><span>'+b+'</span><b>'+bv+'</b></p><p><span>'+c+'</span><b>'+cv+'</b></p><p><span>'+d+'</span><b>'+dv+'</b></p></div></section>';
  }
  function bodyMarkup(){
    if(activeTab==='matches')return matchesMarkup();
    if(activeTab==='standings')return standingsMarkup();
    if(activeTab==='squad')return squadMarkup();
    if(activeTab==='stats')return statsMarkup();
    return summaryMarkup();
  }

  function notifySheet(){
    if(!notifyOpen)return '';
    const st=notifState(),all=NOTIFY_ROWS.every(r=>st[r[0]]);
    return '<div class="v42-overlay" data-v42-close-overlay><section class="v42-notify-sheet" role="dialog" aria-label="Notificaciones de '+esc(team().name)+'" onclick="event.stopPropagation()">'+
      '<div class="v42-sheet-head"><h2>'+esc(team().name)+'</h2><button type="button" data-v42-close-notify>Hecho</button></div>'+
      '<label class="v42-master-switch"><span>Todas las notificaciones</span>'+switchMarkup('all',all)+'</label>'+
      '<div class="v42-notify-list">'+NOTIFY_ROWS.map(r=>'<label><i>'+r[1]+'</i><span>'+r[2]+'</span>'+switchMarkup(r[0],!!st[r[0]])+'</label>').join('')+'</div>'+
    '</section></div>';
  }
  function switchMarkup(key,on){return '<span class="v42-switch '+(on?'on':'')+'"><input type="checkbox" data-v42-notify="'+key+'" '+(on?'checked':'')+'><i></i></span>'}

  function compareSheet(){
    if(!compareOpen)return '';
    const ids=Object.keys(TEAMS).filter(id=>id!==selectedId()&&!COMPARE_EXCLUDED.has(id)).sort((a,b)=>team(a).name.localeCompare(team(b).name,'es'));
    return '<div class="v42-overlay" data-v42-close-overlay><section class="v42-compare-sheet" role="dialog" aria-label="Comparar equipos" onclick="event.stopPropagation()"><div class="v42-sheet-head"><h2>Comparar</h2><button type="button" data-v42-close-compare>Hecho</button></div>'+
      (compareTarget?compareResult(compareTarget):'<p class="v42-compare-help">Selecciona otro equipo</p><div class="v42-compare-grid">'+ids.map(id=>'<button type="button" data-v42-compare-team="'+id+'"><img src="'+logo(team(id))+'" alt=""><span>'+esc(team(id).name)+'</span></button>').join('')+'</div>')+
    '</section></div>';
  }
  function compareResult(id){
    const a=team(),b=team(id);
    return '<div class="v42-compare-result"><div>'+miniTeam(selectedId())+'</div><strong>VS</strong><div>'+miniTeam(id)+'</div></div><div class="v42-compare-table"><p><span>Partidos</span><b>'+a.p+'</b><b>'+b.p+'</b></p><p><span>Puntos</span><b>'+a.pts+'</b><b>'+b.pts+'</b></p><p><span>Diferencia</span><b>'+(a.gd>0?'+':'')+a.gd+'</b><b>'+(b.gd>0?'+':'')+b.gd+'</b></p></div><button type="button" class="v42-compare-again" data-v42-compare-again>Elegir otro equipo</button>';
  }

  function overflowMenu(){
    if(!menuOpen)return '';
    return '<div class="v42-menu-pop"><button type="button" data-v42-menu-compare><span>↔</span>Comparar</button><button type="button" data-v42-menu-share><span>●‹</span>Compartir</button></div>';
  }

  function markup(){
    const t=team(),isFollowing=followed();
    return '<section class="v42-team-page" data-v42-reference="teamDetail">'+
      '<header class="v42-hero">'+
        '<div class="v42-neon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'+
        '<div class="v42-top-actions"><button type="button" class="v42-back" data-v42-back aria-label="Volver">'+backIcon()+'</button><div class="v42-top-right"><button type="button" class="v42-bell" data-v42-bell aria-label="Notificaciones">'+bellIcon()+'</button><button type="button" class="v42-more" data-v42-menu aria-label="Más opciones">'+dotsIcon()+'</button></div></div>'+
        '<img class="v42-team-crest" src="'+logo(t)+'" alt="'+esc(t.name)+'" loading="eager" decoding="async">'+
        '<div class="v42-title"><h1>'+esc(t.name)+'</h1><p>'+esc(t.city)+'</p></div>'+
        '<div class="v42-actions"><button type="button" class="v42-follow '+(isFollowing?'active':'')+'" data-v42-follow>'+checkIcon()+'<span>'+(isFollowing?'Siguiendo':'Seguir')+'</span></button><button type="button" class="v42-compare" data-v42-compare>Comparar</button><button type="button" class="v42-share" data-v42-share aria-label="Compartir">'+shareIcon()+'</button></div>'+
        '<nav class="v42-tabs" aria-label="Secciones del equipo">'+
          '<button type="button" class="'+(activeTab==='summary'?'active':'')+'" data-v42-tab="summary">Resumen</button>'+
          '<button type="button" class="'+(activeTab==='matches'?'active':'')+'" data-v42-tab="matches">Partidos</button>'+
          '<button type="button" class="'+(activeTab==='standings'?'active':'')+'" data-v42-tab="standings">Clasificación</button>'+
          '<button type="button" class="'+(activeTab==='squad'?'active':'')+'" data-v42-tab="squad">Plantilla</button>'+
          '<button type="button" class="'+(activeTab==='stats'?'active':'')+'" data-v42-tab="stats">Estadísticas</button>'+
        '</nav>'+overflowMenu()+
      '</header>'+bodyMarkup()+notifySheet()+compareSheet()+
    '</section>';
  }

  function toast(msg){
    document.querySelector('.v42-toast')?.remove();
    const n=document.createElement('div');n.className='v42-toast';n.textContent=msg;document.body.appendChild(n);
    setTimeout(()=>n.remove(),1600);
  }
  function share(){
    const p={title:team().name,text:'Liga Municipal de Fútbol Juventino Rosas · '+team().name,url:location.href};
    if(navigator.share)navigator.share(p).catch(()=>{});
    else navigator.clipboard?.writeText(location.href).then(()=>toast('Enlace copiado')).catch(()=>toast('Enlace listo para compartir'));
  }
  function rerender(){const screen=document.querySelector('#screen');if(screen){screen.innerHTML=markup();bind();fixBottomNav()}}
  function fixBottomNav(){
    /* TEAMDETAIL_NAV_FIX1 — evita COMPETICIÓN/VIDEO encimados al entrar a un equipo. */
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const labels={home:'Inicio',competition:'Competición',video:'Video',fantasy:'Fantasy',more:'Más'};
    nav.querySelectorAll('.nav-item').forEach(item=>{
      const small=item.querySelector('small');
      if(small&&labels[item.dataset.route])small.textContent=labels[item.dataset.route];
      item.classList.toggle('active',item.dataset.route==='competition');
    });
  }
  function render(){
    const active=route()==='teamDetail';
    document.body.classList.toggle('v42-team-active',active);
    if(!active)return;
    const screen=document.querySelector('#screen');if(!screen)return;
    screen.innerHTML=markup();bind();fixBottomNav();
  }

  function bind(){
    document.querySelector('[data-v42-back]')?.addEventListener('click',()=>history.length>1?history.back():location.hash='#/teams',{once:true});
    document.querySelector('[data-v42-follow]')?.addEventListener('click',()=>{toggleFollow();rerender()},{once:true});
    document.querySelector('[data-v42-bell]')?.addEventListener('click',()=>{notifyOpen=true;menuOpen=false;rerender()},{once:true});
    document.querySelector('[data-v42-menu]')?.addEventListener('click',()=>{menuOpen=!menuOpen;rerender()},{once:true});
    document.querySelector('[data-v42-share]')?.addEventListener('click',share,{once:true});
    document.querySelector('[data-v42-compare]')?.addEventListener('click',()=>{compareOpen=true;compareTarget=null;menuOpen=false;rerender()},{once:true});
    document.querySelector('[data-v42-menu-compare]')?.addEventListener('click',()=>{compareOpen=true;compareTarget=null;menuOpen=false;rerender()},{once:true});
    document.querySelector('[data-v42-menu-share]')?.addEventListener('click',share,{once:true});
    document.querySelector('[data-v42-close-notify]')?.addEventListener('click',()=>{notifyOpen=false;rerender()},{once:true});
    document.querySelector('[data-v42-close-compare]')?.addEventListener('click',()=>{compareOpen=false;compareTarget=null;rerender()},{once:true});
    document.querySelectorAll('[data-v42-close-overlay]').forEach(el=>el.addEventListener('click',()=>{notifyOpen=false;compareOpen=false;compareTarget=null;rerender()},{once:true}));
    document.querySelectorAll('[data-v42-tab]').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.v42Tab;localStorage.setItem('v42-team-tab',activeTab);menuOpen=false;rerender()},{once:true}));
    document.querySelectorAll('[data-v42-select-team]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('v27-selected-team',b.dataset.v42SelectTeam);activeTab='summary';localStorage.setItem('v42-team-tab','summary');rerender()},{once:true}));
    document.querySelectorAll('[data-v42-compare-team]').forEach(b=>b.addEventListener('click',()=>{compareTarget=b.dataset.v42CompareTeam;rerender()},{once:true}));
    document.querySelector('[data-v42-compare-again]')?.addEventListener('click',()=>{compareTarget=null;rerender()},{once:true});
    document.querySelectorAll('[data-v42-notify]').forEach(input=>input.addEventListener('change',()=>{
      const st=notifState();
      if(input.dataset.v42Notify==='all')NOTIFY_ROWS.forEach(r=>st[r[0]]=input.checked);
      else st[input.dataset.v42Notify]=input.checked;
      saveNotif(st);rerender();
    },{once:true}));
    document.querySelectorAll('[data-v42-player]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.v42Player),{once:true}));
    document.querySelectorAll('[data-v42-video]').forEach(b=>b.addEventListener('click',()=>toast('Resumen en vídeo'),{once:true}));
  }

  // TEAM_LINKS_ALL_V1 — cualquier escudo o nombre de equipo abre su ficha desde cualquier pantalla.
  document.addEventListener('click',e=>{
    if(route()==='teamDetail')return;
    if(e.target.closest('.bottom-nav,[data-v28-menu],[data-v28-follow],[data-v28-favorite],[data-v28-unfollow]'))return;
    const id=teamIdFromClick(e.target);
    if(!id)return;
    e.preventDefault();
    e.stopPropagation();
    openTeam(id);
  },true);

  window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>{if(route()==='teamDetail'&&!screen.querySelector('[data-v42-reference]'))requestAnimationFrame(render)}).observe(screen,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(render),{once:true});else requestAnimationFrame(render);
})();