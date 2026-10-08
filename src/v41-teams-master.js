/* V41 — Equipos: reconstrucción fiel de la captura maestra del usuario.
   Mantiene el layout azul y sustituye clubes profesionales por equipos locales. */
(function(){
  'use strict';
  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE_LOGO=BASE+'assets/liga-logo.webp';
  const FALLBACK_TEAMS=[
    {id:'AME',name:'América Veteranos',logo:'assets/branding/america-veteranos-35-user.png',abbr:'AME'},
    {id:'HUE',name:'La Huerta',logo:'assets/official-logos/la-huerta.png',abbr:'HUE'},
    {id:'PRO',name:'Promesas FC',logo:'assets/official-logos/promesas-fc.png',abbr:'PRO'},
    {id:'FRA',name:'Franco FC',logo:'assets/official-logos/franco-fc.png',abbr:'FRA'},
    {id:'GAL',name:'Atlético Galeana',logo:'assets/official-logos/galeana.png',abbr:'GAL'},
    {id:'LOB',name:'Lobos CDG',logo:'assets/official-logos/lobos-cdg.png',abbr:'LOB'},
    {id:'JUV',name:'Juventino',logo:'assets/liga-logo.webp',abbr:'JUV'},
    {id:'CUE',name:'Cuenda',logo:'assets/teams/tc-cuenda.webp',abbr:'CUE'},
    {id:'POZ',name:'Pozos FC',logo:'assets/teams/veteranos-pozos-fc.webp',abbr:'POZ'},
    {id:'STC',name:'Santa Cruz',logo:'assets/teams/atletico-santa-cruz.webp',abbr:'STC'},
    {id:'TAV',name:'Franco Tavera',logo:'assets/teams/franco-tavera-jr-veteranos.webp',abbr:'TAV'},
    {id:'SJO',name:'San José FC',logo:'assets/official-logos/san-jose-fc.png',abbr:'SJO'},
    {id:'SAN',name:'Atlético Santiago',logo:'assets/teams/atletico-santiago.webp',abbr:'SAN'},
    {id:'LJR',name:'Lobos JR',logo:'assets/teams/lobos-jr-cerrito-gasca.webp',abbr:'LJR'},
    {id:'HER',name:'Hermanos',logo:'assets/official-logos/hermanos.png',abbr:'HER'},
    {id:'LIN',name:'Linces',logo:'assets/official-logos/linces.png',abbr:'LIN'},
    {id:'TER',name:'Terrícolas',logo:'assets/official-logos/terricolas.png',abbr:'TER'},
    {id:'GAC',name:'Galácticos',logo:'assets/teams/galacticos-pozos.webp',abbr:'GAC'},
    {id:'ESP',name:'La Esperanza',logo:'assets/official-logos/la-esperanza.png',abbr:'ESP'},
    {id:'TVF',name:'Tavera FC',logo:'assets/official-logos/tavera-fc.png',abbr:'TVF'}
  ];
  let query='';

  function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
  function abbr(name){return String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()||'EQ'}
  function currentTeams(){
    const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
    if(!db?.categories)return FALLBACK_TEAMS;
    const out=[],seen=new Set();
    const add=(name,cat)=>{
      name=String(name||'').trim();const k=norm(name);if(!name||seen.has(k))return;
      seen.add(k);
      let logo='';try{logo=window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||''}catch(_){}
      out.push({id:k.replace(/\s+/g,'-').toUpperCase(),name,logo,abbr:abbr(name),cat:String(cat||'3')});
    };
    for(const [cid,c] of Object.entries(db.categories||{})){
      Object.keys(c?.rosters||{}).forEach(n=>add(n,cid));
      (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1],cid));
      (c?.fixtures||[]).forEach(g=>(g?.rows||[]).forEach(r=>{add(r?.[2],cid);add(r?.[6],cid)}));
    }
    return out.length?out:FALLBACK_TEAMS;
  }

  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function searchIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 5.1 5.1"/></svg>'}
  function closeIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'}
  function teamLogo(t){
    if(t.logo){
      const src=/^https?:\/\//i.test(t.logo)?t.logo:BASE+t.logo;
      return '<span class="v41-team-logo"><img src="'+src+'" alt="'+esc(t.name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v41-fallback" style="display:none">'+esc(t.abbr)+'</span></span>';
    }
    return '<span class="v41-team-logo"><span class="v41-fallback">'+esc(t.abbr)+'</span></span>';
  }
  function tile(t){
    return '<button type="button" class="v41-team-tile" data-v41-team="'+esc(t.id)+'" data-v41-name="'+esc(t.name)+'" data-v41-cat="'+esc(t.cat||'')+'">'+teamLogo(t)+'<span class="v41-team-name">'+esc(t.name)+'</span></button>';
  }
  function markup(){
    const q=query.trim().toLocaleLowerCase('es');
    const list=currentTeams().filter(t=>!q||t.name.toLocaleLowerCase('es').includes(q));
    return '<section class="v41-teams-page" data-v27-reference="teams" data-v41-reference="teams">'+
      '<header class="v41-head">'+
        '<button type="button" class="v41-close" data-v41-close aria-label="Cerrar">'+closeIcon()+'</button>'+
        '<label class="v41-search">'+searchIcon()+'<input id="v41TeamSearch" type="search" autocomplete="off" placeholder="Buscar equipos" value="'+esc(query)+'"></label>'+
      '</header>'+
      '<button type="button" class="v41-average" data-v41-average>'+
        '<span class="v41-average-badge">AT</span>'+
        '<span class="v41-average-copy"><strong>Promedio: todos los equipos</strong><small>Promedio de estadísticas por partido de todos<br class="v41-break"> los equipos</small></span>'+
      '</button>'+
      '<div class="v41-divider"></div>'+
      '<section class="v41-grid-section">'+
        '<h1>Equipos en la competición</h1>'+
        '<div class="v41-grid">'+(list.length?list.map(tile).join(''):'<div class="v41-empty">No se encontraron equipos.</div>')+'</div>'+
      '</section>'+
    '</section>';
  }
  function render(){
    const active=route()==='teams';
    document.body.classList.toggle('v41-teams-active',active);
    if(!active)return;
    const screen=document.querySelector('#screen');
    if(!screen)return;
    if(!screen.querySelector('[data-v41-reference]')) screen.innerHTML=markup();
    bind();
  }
  function bind(){
    document.querySelector('[data-v41-close]')?.addEventListener('click',()=>{location.hash='#/more'},{once:true});
    document.querySelector('[data-v41-average]')?.addEventListener('click',()=>{location.hash='#/safe-data'},{once:true});
    document.querySelectorAll('[data-v41-team]').forEach(b=>b.addEventListener('click',e=>{
      // V963: team selection is a profile action, never a comparison action.
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      const name=b.dataset.v41Name||'',cat=b.dataset.v41Cat||'';
      if(!name)return;
      localStorage.setItem('v27-selected-team',b.dataset.v41Team);
      localStorage.setItem('v62-team-name',name);
      localStorage.setItem('v42-team-tab','summary');
      localStorage.removeItem('v42-open-compare');
      if(cat){localStorage.setItem('v62-category',cat);localStorage.setItem('v12-fixture-cat',cat)}
      if(window.LJR_TEAM_DETAIL_API?.openTeam&&window.LJR_TEAM_DETAIL_API.openTeam(name,cat))return;
      location.hash='#/teamDetail?tab=summary';
    },{once:true}));
    const input=document.querySelector('#v41TeamSearch');
    if(input){
      input.oninput=()=>{
        query=input.value;
        const screen=document.querySelector('#screen');
        if(screen){screen.innerHTML=markup();bind();const n=document.querySelector('#v41TeamSearch');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}}
      };
    }
  }
  window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  window.addEventListener('ljr:official-data',()=>{if(route()==='teams'){const s=document.querySelector('#screen');if(s){s.innerHTML=markup();bind()}}});
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>{if(route()==='teams'&&!screen.querySelector('[data-v41-reference]'))requestAnimationFrame(render)}).observe(screen,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(render),{once:true});else requestAnimationFrame(render);
})();