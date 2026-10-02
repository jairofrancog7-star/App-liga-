/* V40 — Competición / Clasificación calcada de la referencia del usuario.
   Mantiene la estructura visual azul y sustituye contenido profesional por equipos locales. */
(function(){
  const ASSET='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/';
  const logos={
    AME:ASSET+'branding/america-veteranos-35-user.png',
    HUE:ASSET+'official-logos/la-huerta.png',
    PRO:ASSET+'official-logos/promesas-fc.png',
    GAL:ASSET+'official-logos/galeana.png',
    LOB:ASSET+'official-logos/lobos-cdg.png',
    FRA:ASSET+'official-logos/franco-fc.png',
    CUE:ASSET+'official-logos/toros-de-cuenda.png',
    JUV:'',
    STC:ASSET+'teams/atletico-santa-cruz.webp',
    POZ:ASSET+'teams/pozos-fc.webp',
    RIN:ASSET+'teams/pozos-fc.webp'
  };

  /* Cada modo replica la composición de su captura maestra:
     Compacta = referencia 2, Completa = referencia 1, Criterios = referencia 3. */
  const compactTeams=[
  {name:"SAN JOSE FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png",p:5,gd:12,pts:15,last:"V"},
  {name:"JUVENTUS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png",p:5,gd:11,pts:9,last:"D"},
  {name:"LINCES",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png",p:4,gd:6,pts:9,last:"V"},
  {name:"NAPOLI",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/napoli.png",p:5,gd:3,pts:9,last:"V"},
  {name:"HERMANOS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png",p:4,gd:2,pts:7,last:"D"},
  {name:"FRANCO FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png",p:3,gd:0,pts:6,last:"—"},
  {name:"HERRERAS FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/herreras-fc.png",p:4,gd:-3,pts:4,last:"—"},
  {name:"ABEJAS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/abejas.png",p:4,gd:0,pts:3,last:"—"},
  {name:"TERRICOLAS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/terricolas.png",p:4,gd:-9,pts:3,last:"V"},
  {name:"LOBOS CDG",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png",p:5,gd:-17,pts:3,last:"D"},
  {name:"GALACTICOS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp",p:5,gd:-5,pts:-15,last:"D"}
];

  const completeTeams=[
  {name:"SAN JOSE FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png",p:5,w:5,d:0,l:0,gf:16,ga:4,pts:15},
  {name:"JUVENTUS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png",p:5,w:3,d:0,l:2,gf:22,ga:11,pts:9},
  {name:"LINCES",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png",p:4,w:3,d:0,l:1,gf:15,ga:9,pts:9},
  {name:"NAPOLI",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/napoli.png",p:5,w:3,d:0,l:2,gf:11,ga:8,pts:9},
  {name:"HERMANOS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png",p:4,w:2,d:1,l:1,gf:9,ga:7,pts:7},
  {name:"FRANCO FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png",p:3,w:2,d:0,l:1,gf:3,ga:3,pts:6},
  {name:"HERRERAS FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/herreras-fc.png",p:4,w:1,d:1,l:2,gf:9,ga:12,pts:4},
  {name:"ABEJAS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/abejas.png",p:4,w:2,d:0,l:2,gf:7,ga:7,pts:3},
  {name:"TERRICOLAS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/terricolas.png",p:4,w:1,d:0,l:3,gf:5,ga:14,pts:3},
  {name:"LOBOS CDG",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png",p:5,w:1,d:0,l:4,gf:3,ga:20,pts:3},
  {name:"GALACTICOS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp",p:5,w:0,d:0,l:5,gf:0,ga:5,pts:-15}
];

  const criteriaTeams=[
  {name:"SAN JOSE FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png",pts:15,gd:12,gf:16,ga:4,w:5,d:0,l:0},
  {name:"JUVENTUS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png",pts:9,gd:11,gf:22,ga:11,w:3,d:0,l:2},
  {name:"LINCES",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png",pts:9,gd:6,gf:15,ga:9,w:3,d:0,l:1},
  {name:"NAPOLI",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/napoli.png",pts:9,gd:3,gf:11,ga:8,w:3,d:0,l:2},
  {name:"HERMANOS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png",pts:7,gd:2,gf:9,ga:7,w:2,d:1,l:1},
  {name:"FRANCO FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png",pts:6,gd:0,gf:3,ga:3,w:2,d:0,l:1},
  {name:"HERRERAS FC",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/herreras-fc.png",pts:4,gd:-3,gf:9,ga:12,w:1,d:1,l:2},
  {name:"ABEJAS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/abejas.png",pts:3,gd:0,gf:7,ga:7,w:2,d:0,l:2},
  {name:"TERRICOLAS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/terricolas.png",pts:3,gd:-9,gf:5,ga:14,w:1,d:0,l:3},
  {name:"LOBOS CDG",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png",pts:3,gd:-17,gf:3,ga:20,w:1,d:0,l:4},
  {name:"GALACTICOS",logo:"https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp",pts:-15,gd:-5,gf:0,ga:5,w:0,d:0,l:5}
];

  const v35CompleteTeams=[
    {name:'BOAVISTA',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Boavista_wioj7b',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'FRANCO-TAVERA-JR',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'HURACAN',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Huracan_pfndn5',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'CUENDA',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SantiagoCuenda_fvaq9e',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'AMERICA',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/America_wbi53g',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'AGUILARES',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/aguilares_ifdgll',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'JUVENTUS',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_fpshqs',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'LEYENDAS FC',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LEYENDAS_jwcnlu',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'PSV',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PSV_ru3tft',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},
    {name:'LA TRINIDAD',logo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/La_trinidad_a32pbk',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}
  ];
  const v35CompactTeams=v35CompleteTeams.map(t=>({...t,gd:t.gf-t.ga,last:'—'}));
  const v35CriteriaTeams=v35CompleteTeams.map(t=>({...t,gd:t.gf-t.ga}));

  const v35HeaderTeams={
  "left": {"name":"BOAVISTA","logo":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Boavista_wioj7b"},
  "right": {"name":"FRANCO-TAVERA-JR","logo":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc"}
};

  const headerTeams={
  "left": {
    "name": "HERMANOS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png"
  },
  "right": {
    "name": "LOBOS CDG",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png"
  }
};

  const iconBack='<svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8"/></svg>';
  const iconShare='<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.2"/><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="m8 11 8-5M8 13l8 5"/></svg>';
  const iconMute='<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 4 4m0-4-4 4"/></svg>';
  function route(){return location.hash.replace('#/','')||'home'}
  function currentTabs(){return document.querySelector('#screen>.tabs')}
  function isStandings(){
    const tabs=currentTabs();
    return route()==='competition' && !!tabs?.querySelector('.tab.active') && /Clasificaci/i.test(tabs.querySelector('.tab.active').textContent||'');
  }
  function img(src,alt,cls=''){if(!src)return '';return '<img class="'+cls+'" src="'+src+'" alt="'+alt+'" loading="eager" decoding="async">'}
  function isVet35(){return String(localStorage.getItem('v12-fixture-cat')||localStorage.getItem('v62-category')||'3')==='2'}
  function header(){
    const activeHeader=isVet35()?v35HeaderTeams:headerTeams;
    const activeTime=isVet35()?'00:00':'10:00';
    return '<section class="v40-match-master" data-v40-master>'+
      '<div class="v40-actions"><button type="button" data-v40-back aria-label="Volver">'+iconBack+'</button><span></span><button type="button" data-v40-mute aria-label="Silenciar">'+iconMute+'</button><button type="button" data-v40-share aria-label="Compartir">'+iconShare+'</button></div>'+
      '<div class="v40-match-copy">'+
        '<div class="v40-date">'+(isVet35()?'10 oct 2026 · Veteranos 35+ · J1':'4 oct 2026 · Primera Fuerza · J7')+'</div>'+
        '<div class="v40-divider"></div>'+
        '<div class="v40-venue">'+(isVet35()?'Campo 1 (Empastado) · Juventino Rosas':'Campo 3 · Juventino Rosas')+'</div>'+
        '<div class="v40-match-line">'+
          '<div class="v40-side left"><strong>'+activeHeader.left.name+'</strong>'+img(activeHeader.left.logo,activeHeader.left.name,'v40-match-logo')+'</div>'+
          '<time>'+activeTime+'</time>'+
          '<div class="v40-side right">'+img(activeHeader.right.logo,activeHeader.right.name,'v40-match-logo')+'<strong>'+activeHeader.right.name+'</strong></div>'+
        '</div>'+
      '</div>'+
      '<div class="v40-subtabs" role="tablist" aria-label="Partido">'+
        '<button type="button" data-v40-nav="fixtures">Novedades</button>'+
        '<button type="button" class="active" data-v40-nav="standings">Clasificación</button>'+
        '<button type="button" data-v40-nav="info">Info del partido</button>'+
      '</div>'+
    '</section>';
  }
  function form(last){
    return '<span class="v40-form"><i></i><i></i><b class="'+(last==='V'?'win':last==='E'?'draw':'loss')+'">'+last+'</b></span>';
  }
  function compact(){
    const list=isVet35()?v35CompactTeams:compactTeams;
    return '<div class="v578-table-section">'+
      '<div class="v578-direct">CLASIFICACIÓN ACTUAL</div><div class="v578-rule"></div>'+
      '<div class="v578-scroll v579-compact-scroll" data-v578-scroll>'+
        '<table class="v578-table v579-compact-table">'+
          '<thead><tr><th class="rank"></th><th class="team"></th><th>P</th><th>+/-</th><th>PTOS</th><th>FORMA</th></tr></thead>'+
          '<tbody>'+list.map((t,i)=>'<tr>'+
            '<td class="rank">'+(i+1)+'</td>'+
            '<td class="team"><span class="v578-team">'+img(t.logo,t.name,'v578-logo')+'<strong>'+t.name+'</strong></span></td>'+
            '<td>'+t.p+'</td><td>'+t.gd+'</td><td class="pts">'+t.pts+'</td><td class="form">'+form(t.last)+'</td>'+
          '</tr>').join('')+'</tbody>'+
        '</table>'+
      '</div>'+
    '</div>';
  }
  function complete(){
    const list=isVet35()?v35CompleteTeams:completeTeams;
    const compactList=isVet35()?v35CompactTeams:compactTeams;
    const lastFor=name=>compactList.find(x=>x.name===name)?.last||'—';
    return '<div class="v578-table-section">'+
      '<div class="v578-direct">CLASIFICACIÓN ACTUAL</div><div class="v578-rule"></div>'+
      '<div class="v578-scroll" data-v578-scroll>'+
        '<table class="v578-table v578-complete-table">'+
          '<thead><tr><th class="rank"></th><th class="team"></th><th>P</th><th>V</th><th>E</th><th>D</th><th>+/-</th><th>GF</th><th>GC</th><th>FORMA</th><th>PTOS</th></tr></thead>'+
          '<tbody>'+list.map((t,i)=>'<tr>'+
            '<td class="rank">'+(i+1)+'</td>'+
            '<td class="team"><span class="v578-team">'+img(t.logo,t.name,'v578-logo')+'<strong>'+t.name+'</strong></span></td>'+
            '<td>'+t.p+'</td><td>'+t.w+'</td><td>'+t.d+'</td><td>'+t.l+'</td><td>'+(t.gf-t.ga)+'</td><td>'+t.gf+'</td><td>'+t.ga+'</td>'+
            '<td class="form">'+form(lastFor(t.name))+'</td><td class="pts">'+t.pts+'</td>'+
          '</tr>').join('')+'</tbody>'+
        '</table>'+
      '</div>'+
    '</div>';
  }
  function criteria(){
    const list=isVet35()?v35CriteriaTeams:criteriaTeams;
    return '<div class="v578-table-section">'+
      '<div class="v578-direct">CLASIFICACIÓN ACTUAL</div><div class="v578-rule"></div>'+
      '<div class="v578-scroll" data-v578-scroll>'+
        '<table class="v578-table v578-criteria-table">'+
          '<thead><tr><th class="rank"></th><th class="team"></th><th>PTOS</th><th>+/-</th><th>GF</th><th>GC</th><th>V</th><th>E</th><th>P</th></tr></thead>'+
          '<tbody>'+list.map((t,i)=>'<tr>'+
            '<td class="rank">'+(i+1)+'</td>'+
            '<td class="team"><span class="v578-team">'+img(t.logo,t.name,'v578-logo')+'<strong>'+t.name+'</strong></span></td>'+
            '<td class="pts">'+t.pts+'</td><td>'+t.gd+'</td><td>'+t.gf+'</td><td>'+t.ga+'</td><td>'+t.w+'</td><td>'+t.d+'</td><td>'+t.l+'</td>'+
          '</tr>').join('')+'</tbody>'+
        '</table>'+
      '</div>'+
    '</div>';
  }
  let activeStandingsMode='compact';
  try{activeStandingsMode=sessionStorage.getItem('v40-standings-mode')||'compact'}catch(_){}
  if(!['compact','complete','criteria'].includes(activeStandingsMode)) activeStandingsMode='compact';
  function modeContent(mode){return mode==='complete'?complete():mode==='criteria'?criteria():compact()}
  function standings(){
    const mode=activeStandingsMode;
    return '<section class="v40-standings" data-v40-standings data-v40-current-mode="'+mode+'">'+
      '<div class="v40-segmented" role="tablist" aria-label="Vista de clasificación">'+
        '<button type="button" class="'+(mode==='compact'?'active':'')+'" data-v40-mode="compact">Compacta</button>'+
        '<button type="button" class="'+(mode==='complete'?'active':'')+'" data-v40-mode="complete">Completa</button>'+
        '<button type="button" class="'+(mode==='criteria'?'active':'')+'" data-v40-mode="criteria">Criterios de<br>desempate</button>'+
      '</div>'+
      '<div class="v40-content" data-v40-content>'+modeContent(mode)+'</div>'+
    '</section>';
  }
  function renderMode(box,mode){
    if(!box)return;
    activeStandingsMode=['compact','complete','criteria'].includes(mode)?mode:'compact';
    try{sessionStorage.setItem('v40-standings-mode',activeStandingsMode)}catch(_){}
    box.dataset.v40CurrentMode=activeStandingsMode;
    box.querySelectorAll('[data-v40-mode]').forEach(b=>b.classList.toggle('active',b.dataset.v40Mode===activeStandingsMode));
    const content=box.querySelector('[data-v40-content]');
    if(content) content.innerHTML=modeContent(activeStandingsMode);
  }
  function forceMode(mode){
    const box=document.querySelector('[data-v40-standings]');
    if(box) renderMode(box,mode);
  }
  window.LJR_V575_STANDINGS_MODE=forceMode;
  function patch(){
    const screen=document.querySelector('#screen');
    if(!screen) return;
    const active=isStandings();
    document.body.classList.toggle('v40-standings-master',active);
    if(!active){
      screen.querySelector('[data-v40-master]')?.remove();
      return;
    }
    const tabs=currentTabs();
    if(!tabs) return;
    screen.querySelector('[data-v40-master]')?.remove();
    let old=screen.querySelector('[data-v12-standings]');
    if(old){
      old.className='v40-standings-host';
      old.setAttribute('data-v40-host','');
      old.innerHTML=standings();
    }else if(!screen.querySelector('[data-v40-host]')){
      tabs.insertAdjacentHTML('afterend','<div class="v40-standings-host" data-v40-host>'+standings()+'</div>');
    }
  }
  /* V575 hardfix: intercepta el toque desde window antes que cualquier parche
     legado y conserva la vista elegida aunque otro observer vuelva a ejecutar patch(). */
  const v575ModeEvent=e=>{
    const el=e.target instanceof Element?e.target.closest('[data-v40-mode]'):null;
    if(!el)return;
    const box=el.closest('[data-v40-standings]');
    if(!box)return;
    renderMode(box,el.dataset.v40Mode||'compact');
  };
  window.addEventListener('pointerup',v575ModeEvent,true);
  window.addEventListener('touchend',v575ModeEvent,{capture:true,passive:true});
  window.addEventListener('click',v575ModeEvent,true);

  document.addEventListener('click',e=>{
    const mode=e.target.closest('[data-v40-mode]');
    if(mode){
      e.preventDefault();
      const box=mode.closest('[data-v40-standings]');
      renderMode(box,mode.dataset.v40Mode||'compact');
      return;
    }
    const nav=e.target.closest('[data-v40-nav]');
    if(nav){
      const tabs=currentTabs();
      if(nav.dataset.v40Nav==='fixtures') tabs?.querySelectorAll('.tab')[0]?.click();
      if(nav.dataset.v40Nav==='standings') tabs?.querySelectorAll('.tab')[1]?.click();
      if(nav.dataset.v40Nav==='info') location.hash='#/match';
      return;
    }
    if(e.target.closest('[data-v40-back]')){
      if(history.length>1) history.back(); else location.hash='#/home';
      return;
    }
    if(e.target.closest('[data-v40-share]')){
      const payload={title:'Liga Municipal de Fútbol Juventino Rosas',text:'Clasificación de la Liga Municipal de Fútbol Juventino Rosas',url:location.href};
      if(navigator.share) navigator.share(payload).catch(()=>{});
      else navigator.clipboard?.writeText(location.href);
      return;
    }
    if(e.target.closest('[data-v40-mute]')) e.target.closest('[data-v40-mute]').classList.toggle('active');
  },true);
  window.addEventListener('hashchange',()=>requestAnimationFrame(patch));
  const observer=new MutationObserver(()=>requestAnimationFrame(patch));
  if(document.querySelector('#screen')) observer.observe(document.querySelector('#screen'),{childList:true,subtree:false});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(patch),{once:true}); else requestAnimationFrame(patch);
})();