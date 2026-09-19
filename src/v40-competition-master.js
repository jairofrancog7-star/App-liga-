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
  {
    "name": "SAN JOSE FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png",
    "p": 4,
    "gd": 10,
    "pts": 12,
    "last": "V"
  },
  {
    "name": "JUVENTUS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png",
    "p": 4,
    "gd": 14,
    "pts": 9,
    "last": "D"
  },
  {
    "name": "HERMANOS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png",
    "p": 3,
    "gd": 4,
    "pts": 7,
    "last": "V"
  },
  {
    "name": "LINCES",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png",
    "p": 3,
    "gd": 3,
    "pts": 6,
    "last": "V"
  },
  {
    "name": "NAPOLI",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/napoli.png",
    "p": 4,
    "gd": 1,
    "pts": 6,
    "last": "D"
  },
  {
    "name": "FRANCO FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png",
    "p": 3,
    "gd": 0,
    "pts": 6,
    "last": "V"
  },
  {
    "name": "HERRERAS FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/herreras-fc.png",
    "p": 4,
    "gd": -3,
    "pts": 4,
    "last": "D"
  },
  {
    "name": "ABEJAS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/abejas.png",
    "p": 4,
    "gd": 0,
    "pts": 3,
    "last": "D"
  },
  {
    "name": "LOBOS CDG",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png",
    "p": 4,
    "gd": -15,
    "pts": 3,
    "last": "D"
  },
  {
    "name": "TERRICOLAS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/terricolas.png",
    "p": 3,
    "gd": -10,
    "pts": 0,
    "last": "D"
  },
  {
    "name": "GALACTICOS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp",
    "p": 4,
    "gd": -4,
    "pts": -12,
    "last": "—"
  }
];

  const completeTeams=[
  {
    "name": "SAN JOSE FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png",
    "p": 4,
    "w": 4,
    "d": 0,
    "l": 0,
    "gf": 13,
    "ga": 3,
    "pts": 12
  },
  {
    "name": "JUVENTUS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png",
    "p": 4,
    "w": 3,
    "d": 0,
    "l": 1,
    "gf": 20,
    "ga": 6,
    "pts": 9
  },
  {
    "name": "HERMANOS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png",
    "p": 3,
    "w": 2,
    "d": 1,
    "l": 0,
    "gf": 8,
    "ga": 4,
    "pts": 7
  },
  {
    "name": "LINCES",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png",
    "p": 3,
    "w": 2,
    "d": 0,
    "l": 1,
    "gf": 10,
    "ga": 7,
    "pts": 6
  },
  {
    "name": "NAPOLI",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/napoli.png",
    "p": 4,
    "w": 2,
    "d": 0,
    "l": 2,
    "gf": 8,
    "ga": 7,
    "pts": 6
  },
  {
    "name": "FRANCO FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png",
    "p": 3,
    "w": 2,
    "d": 0,
    "l": 1,
    "gf": 3,
    "ga": 3,
    "pts": 6
  },
  {
    "name": "HERRERAS FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/herreras-fc.png",
    "p": 4,
    "w": 1,
    "d": 1,
    "l": 2,
    "gf": 9,
    "ga": 12,
    "pts": 4
  },
  {
    "name": "ABEJAS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/abejas.png",
    "p": 4,
    "w": 2,
    "d": 0,
    "l": 2,
    "gf": 7,
    "ga": 7,
    "pts": 3
  },
  {
    "name": "LOBOS CDG",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png",
    "p": 4,
    "w": 1,
    "d": 0,
    "l": 3,
    "gf": 2,
    "ga": 17,
    "pts": 3
  },
  {
    "name": "TERRICOLAS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/terricolas.png",
    "p": 3,
    "w": 0,
    "d": 0,
    "l": 3,
    "gf": 4,
    "ga": 14,
    "pts": 0
  },
  {
    "name": "GALACTICOS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp",
    "p": 4,
    "w": 0,
    "d": 0,
    "l": 4,
    "gf": 0,
    "ga": 4,
    "pts": -12
  }
];

  const criteriaTeams=[
  {
    "name": "SAN JOSE FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png",
    "pts": 12,
    "gd": 10,
    "gf": 13,
    "ga": 3,
    "w": 4,
    "d": 0,
    "l": 0
  },
  {
    "name": "JUVENTUS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png",
    "pts": 9,
    "gd": 14,
    "gf": 20,
    "ga": 6,
    "w": 3,
    "d": 0,
    "l": 1
  },
  {
    "name": "HERMANOS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png",
    "pts": 7,
    "gd": 4,
    "gf": 8,
    "ga": 4,
    "w": 2,
    "d": 1,
    "l": 0
  },
  {
    "name": "LINCES",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png",
    "pts": 6,
    "gd": 3,
    "gf": 10,
    "ga": 7,
    "w": 2,
    "d": 0,
    "l": 1
  },
  {
    "name": "NAPOLI",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/napoli.png",
    "pts": 6,
    "gd": 1,
    "gf": 8,
    "ga": 7,
    "w": 2,
    "d": 0,
    "l": 2
  },
  {
    "name": "FRANCO FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png",
    "pts": 6,
    "gd": 0,
    "gf": 3,
    "ga": 3,
    "w": 2,
    "d": 0,
    "l": 1
  },
  {
    "name": "HERRERAS FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/herreras-fc.png",
    "pts": 4,
    "gd": -3,
    "gf": 9,
    "ga": 12,
    "w": 1,
    "d": 1,
    "l": 2
  },
  {
    "name": "ABEJAS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/abejas.png",
    "pts": 3,
    "gd": 0,
    "gf": 7,
    "ga": 7,
    "w": 2,
    "d": 0,
    "l": 2
  },
  {
    "name": "LOBOS CDG",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png",
    "pts": 3,
    "gd": -15,
    "gf": 2,
    "ga": 17,
    "w": 1,
    "d": 0,
    "l": 3
  },
  {
    "name": "TERRICOLAS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/terricolas.png",
    "pts": 0,
    "gd": -10,
    "gf": 4,
    "ga": 14,
    "w": 0,
    "d": 0,
    "l": 3
  },
  {
    "name": "GALACTICOS",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp",
    "pts": -12,
    "gd": -4,
    "gf": 0,
    "ga": 4,
    "w": 0,
    "d": 0,
    "l": 4
  }
];

  const headerTeams={
  "left": {
    "name": "FRANCO FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png"
  },
  "right": {
    "name": "HERRERAS FC",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/herreras-fc.png"
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
  function header(){
    return '<section class="v40-match-master" data-v40-master>'+
      '<div class="v40-actions"><button type="button" data-v40-back aria-label="Volver">'+iconBack+'</button><span></span><button type="button" data-v40-mute aria-label="Silenciar">'+iconMute+'</button><button type="button" data-v40-share aria-label="Compartir">'+iconShare+'</button></div>'+
      '<div class="v40-match-copy">'+
        '<div class="v40-date">20 sep 2026 · Primera Fuerza</div>'+
        '<div class="v40-divider"></div>'+
        '<div class="v40-venue">Romerillo · Juventino Rosas</div>'+
        '<div class="v40-match-line">'+
          '<div class="v40-side left"><strong>'+headerTeams.left.name+'</strong>'+img(headerTeams.left.logo,headerTeams.left.name,'v40-match-logo')+'</div>'+
          '<time>08:00</time>'+
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
      '<div class="v40-direct">CLASIFICACIÓN ACTUAL</div><div class="v40-rule"></div>'+
      '<div class="v40-table-body">'+compactTeams.map((t,i)=>
        '<div class="v40-row"><span class="v40-rank">'+(i+1)+'</span><span class="v40-team">'+img(t.logo,t.name,'v40-team-logo')+'<strong>'+t.name+'</strong></span><span>'+t.p+'</span><span>'+t.gd+'</span><span>'+t.pts+'</span>'+form(t.last)+'</div>'
      ).join('')+'</div>'+
    '</div>';
  }
  function complete(){
    return '<div class="v40-scroll-shell"><div class="v40-wide complete">'+
      '<div class="v40-wide-head complete-head"><span></span><span></span><b>P</b><b>V</b><b>E</b><b>D</b><b></b><b></b><b class="v40-pluspts">+ PTS</b></div>'+
      '<div class="v40-direct">CLASIFICACIÓN ACTUAL</div><div class="v40-rule"></div>'+
      completeTeams.map((t,i)=>'<div class="v40-wide-row complete-row"><span>'+(i+1)+'</span><span class="v40-team">'+img(t.logo,t.name,'v40-team-logo')+'<strong>'+t.name+'</strong></span><span>'+t.p+'</span><span>'+t.w+'</span><span>'+t.d+'</span><span>'+t.l+'</span><span>'+t.gf+'</span><span class="v40-muted-number">'+t.ga+'</span><b>'+t.pts+'</b></div>').join('')+
    '</div></div>';
  }
  function criteria(){
    return '<div class="v40-scroll-shell"><div class="v40-wide criteria">'+
      '<div class="v40-wide-head criteria-head"><span></span><span></span><b>PTOS</b><b>+/-</b><b>GF</b><b>GA</b><b>V</b><b>E</b><b>P</b></div>'+
      '<div class="v40-direct">CLASIFICACIÓN ACTUAL</div><div class="v40-rule"></div>'+
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