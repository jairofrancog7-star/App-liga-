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
    JUV:ASSET+'liga-logo.webp',
    STC:ASSET+'teams/atletico-santa-cruz.webp',
    POZ:ASSET+'teams/pozos-fc.webp',
    RIN:ASSET+'teams/pozos-fc.webp'
  };

  /* Cada modo replica la composición de su captura maestra:
     Compacta = referencia 2, Completa = referencia 1, Criterios = referencia 3. */
  const compactTeams=[
    {name:'América Veteranos',logo:logos.AME,p:1,gd:5,pts:3,last:'V'},
    {name:'La Huerta',logo:logos.HUE,p:1,gd:5,pts:3,last:'V'},
    {name:'Promesas FC',logo:logos.PRO,p:1,gd:4,pts:3,last:'V'},
    {name:'Atlético Galeana',logo:logos.GAL,p:1,gd:4,pts:3,last:'V'},
    {name:'Lobos CDG',logo:logos.LOB,p:1,gd:3,pts:3,last:'V'},
    {name:'Cuenda',logo:logos.CUE,p:1,gd:2,pts:3,last:'V'},
    {name:'Pozos',logo:logos.POZ,p:1,gd:2,pts:3,last:'V'},
    {name:'Rincón de Centeno',logo:logos.RIN,p:1,gd:2,pts:3,last:'V'}
  ];

  const completeTeams=[
    {name:'Lobos CDG',logo:logos.LOB,p:1,w:1,d:0,l:0,gf:5,ga:5,pts:3},
    {name:'La Huerta',logo:logos.HUE,p:1,w:1,d:0,l:0,gf:5,ga:5,pts:3},
    {name:'Atlético Galeana',logo:logos.GAL,p:1,w:1,d:0,l:0,gf:4,ga:5,pts:3},
    {name:'Franco FC',logo:logos.FRA,p:1,w:1,d:0,l:0,gf:4,ga:4,pts:3},
    {name:'Promesas FC',logo:logos.PRO,p:1,w:1,d:0,l:0,gf:3,ga:3,pts:3},
    {name:'Juventino',logo:logos.JUV,p:1,w:1,d:0,l:0,gf:2,ga:3,pts:3},
    {name:'Santa Cruz',logo:logos.STC,p:1,w:1,d:0,l:0,gf:2,ga:2,pts:3},
    {name:'Pozos FC',logo:logos.POZ,p:1,w:1,d:0,l:0,gf:2,ga:2,pts:3}
  ];

  const criteriaTeams=[
    {name:'Club América Veteranos JR',logo:logos.AME,pts:3,gd:5,gf:6,ga:0,w:1,d:0,l:0},
    {name:'La Huerta',logo:logos.HUE,pts:3,gd:5,gf:5,ga:0,w:1,d:0,l:0},
    {name:'Promesas FC',logo:logos.PRO,pts:3,gd:4,gf:5,ga:0,w:1,d:0,l:0},
    {name:'Franco FC',logo:logos.FRA,pts:3,gd:4,gf:4,ga:0,w:1,d:0,l:0},
    {name:'Atlético Galeana',logo:logos.GAL,pts:3,gd:3,gf:4,ga:0,w:1,d:0,l:0},
    {name:'Lobos CDG',logo:logos.LOB,pts:3,gd:2,gf:3,ga:0,w:1,d:0,l:0},
    {name:'Juventino',logo:logos.JUV,pts:3,gd:2,gf:3,ga:0,w:1,d:0,l:0},
    {name:'Cuenda',logo:logos.CUE,pts:3,gd:2,gf:2,ga:2,w:1,d:1,l:0}
  ];
  const headerTeams={
    left:{name:'Franco FC',logo:ASSET+'official-logos/franco-fc.png'},
    right:{name:'Promesas FC',logo:ASSET+'official-logos/promesas-fc.png'}
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
  function img(src,alt,cls=''){return '<img class="'+cls+'" src="'+src+'" alt="'+alt+'" loading="eager" decoding="async">'}
  function header(){
    return '<section class="v40-match-master" data-v40-master>'+
      '<div class="v40-actions"><button type="button" data-v40-back aria-label="Volver">'+iconBack+'</button><span></span><button type="button" data-v40-mute aria-label="Silenciar">'+iconMute+'</button><button type="button" data-v40-share aria-label="Compartir">'+iconShare+'</button></div>'+
      '<div class="v40-match-copy">'+
        '<div class="v40-date">sáb 19 sept · Liga municipal</div>'+
        '<div class="v40-divider"></div>'+
        '<div class="v40-venue">Campo Municipal · Juventino Rosas</div>'+
        '<div class="v40-match-line">'+
          '<div class="v40-side left"><strong>'+headerTeams.left.name+'</strong>'+img(headerTeams.left.logo,headerTeams.left.name,'v40-match-logo')+'</div>'+
          '<time>10:45</time>'+
          '<div class="v40-side right">'+img(headerTeams.right.logo,headerTeams.right.name,'v40-match-logo')+'<strong>'+headerTeams.right.name+'</strong></div>'+
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
    return '<div class="v40-table-wrap compact">'+
      '<div class="v40-table-head"><span></span><span></span><b>P</b><b>+/-</b><b>PTOS</b><b>FORMA</b></div>'+
      '<div class="v40-direct">DIRECTOS A OCTAVOS</div><div class="v40-rule"></div>'+
      '<div class="v40-table-body">'+compactTeams.map((t,i)=>
        '<div class="v40-row"><span class="v40-rank">'+(i+1)+'</span><span class="v40-team">'+img(t.logo,t.name,'v40-team-logo')+'<strong>'+t.name+'</strong></span><span>'+t.p+'</span><span>'+t.gd+'</span><span>'+t.pts+'</span>'+form(t.last)+'</div>'
      ).join('')+'</div>'+
    '</div>';
  }
  function complete(){
    return '<div class="v40-scroll-shell"><div class="v40-wide complete">'+
      '<div class="v40-wide-head complete-head"><span></span><span></span><b>P</b><b>V</b><b>E</b><b>D</b><b></b><b></b><b class="v40-pluspts">+ PTS</b></div>'+
      '<div class="v40-direct">DIRECTOS A OCTAVOS</div><div class="v40-rule"></div>'+
      completeTeams.map((t,i)=>'<div class="v40-wide-row complete-row"><span>'+(i+1)+'</span><span class="v40-team">'+img(t.logo,t.name,'v40-team-logo')+'<strong>'+t.name+'</strong></span><span>'+t.p+'</span><span>'+t.w+'</span><span>'+t.d+'</span><span>'+t.l+'</span><span>'+t.gf+'</span><span class="v40-muted-number">'+t.ga+'</span><b>'+t.pts+'</b></div>').join('')+
    '</div></div>';
  }
  function criteria(){
    return '<div class="v40-scroll-shell"><div class="v40-wide criteria">'+
      '<div class="v40-wide-head criteria-head"><span></span><span></span><b>PTOS</b><b>+/-</b><b>GF</b><b>GA</b><b>V</b><b>VA</b><b>P</b></div>'+
      '<div class="v40-direct">DIRECTOS A OCTAVOS</div><div class="v40-rule"></div>'+
      criteriaTeams.map((t,i)=>'<div class="v40-wide-row criteria-row"><span>'+(i+1)+'</span><span class="v40-team">'+img(t.logo,t.name,'v40-team-logo')+'<strong>'+t.name+'</strong></span><span>'+t.pts+'</span><span>'+t.gd+'</span><span>'+t.gf+'</span><span>'+t.ga+'</span><span>'+t.w+'</span><span>'+t.d+'</span><span>'+t.l+'</span></div>').join('')+
    '</div></div>';
  }
  function standings(){
    return '<section class="v40-standings" data-v40-standings>'+
      '<div class="v40-segmented" role="tablist" aria-label="Vista de clasificación">'+
        '<button type="button" class="active" data-v40-mode="compact">Compacta</button>'+
        '<button type="button" data-v40-mode="complete">Completa</button>'+
        '<button type="button" data-v40-mode="criteria">Criterios de<br>desempate</button>'+
      '</div>'+
      '<div class="v40-content" data-v40-content>'+compact()+'</div>'+
    '</section>';
  }
  function renderMode(box,mode){
    box.querySelectorAll('[data-v40-mode]').forEach(b=>b.classList.toggle('active',b.dataset.v40Mode===mode));
    const c=box.querySelector('[data-v40-content]');
    c.innerHTML=mode==='complete'?complete():mode==='criteria'?criteria():compact();
  }
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
  document.addEventListener('click',e=>{
    const mode=e.target.closest('[data-v40-mode]');
    if(mode){
      const box=mode.closest('[data-v40-standings]');
      if(box) renderMode(box,mode.dataset.v40Mode);
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