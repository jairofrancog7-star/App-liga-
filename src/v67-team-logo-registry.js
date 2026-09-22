/* V67 / V108 / V111 aliases históricos — Registro único de escudos de equipos.
   Evita que los partidos, tablas, perfiles y comparadores usen el logo genérico
   de la Liga cuando ya existe un escudo real en Liga_Futbol. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const DYNAMIC={};
  const MAP={
    'america':'assets/branding/america-veteranos-35-user.png',
    'america veteranos':'assets/branding/america-veteranos-35-user.png',
    'club america veteranos':'assets/branding/america-veteranos-35-user.png',
    'club america veteranos jr':'assets/branding/america-veteranos-35-user.png',
    'club america vet':'assets/branding/america-veteranos-35-user.png',

    'la huerta':'assets/official-logos/la-huerta.png',
    'la huerta de cuenda':'assets/official-logos/la-huerta.png',
    'promesas fc':'assets/official-logos/promesas-fc.png',
    'promesas fc pozos':'assets/official-logos/promesas-fc.png',
    'franco fc':'assets/official-logos/franco-fc.png',
    'atletico galeana':'assets/official-logos/galeana.png',
    'atl galeana':'assets/official-logos/galeana.png',
    'galeana':'assets/official-logos/galeana.png',
    'lobos cdg':'assets/official-logos/lobos-cdg.png',
    'cuenda':'assets/official-logos/toros-de-cuenda.png',
    'toros de cuenda':'assets/official-logos/toros-de-cuenda.png',
    'pozos':'assets/teams/pozos-fc.webp',
    'pozos fc':'assets/teams/pozos-fc.webp',
    'santa cruz':'assets/teams/atletico-santa-cruz.webp',
    'atletico santa cruz':'assets/teams/atletico-santa-cruz.webp',
    'franco tavera':'assets/teams/franco-tavera-jr-veteranos.webp',
    'san jose fc':'assets/official-logos/san-jose-fc.png',
    'san jose':'assets/official-logos/san-jose-fc.png',
    'atletico santiago':'assets/teams/atletico-santiago.webp',
    'lobos jr':'assets/teams/lobos-jr-cerrito-gasca.webp',
    'hermanos':'assets/official-logos/hermanos.png',
    'linces':'assets/official-logos/linces.png',
    'terricolas':'assets/official-logos/terricolas.png',
    'galacticos':'assets/teams/galacticos-pozos.webp',

    'herreras fc':'assets/official-logos/herreras-fc.png',
    'boavista':'assets/official-logos/boavista.png',
    'psv':'assets/teams/psv.webp',
    'la esperanza':'assets/official-logos/la-esperanza.png',
    'c de gasca':'assets/teams/deportivo-cg.webp',
    'cerrito de gasca':'assets/teams/deportivo-cg.webp',
    'san julian':'assets/official-logos/san-julian.png',
    'dep nopalero':'assets/official-logos/dep-nopalero.png',
    'deportivo nopalero':'assets/official-logos/dep-nopalero.png',
    'tavera fc':'assets/official-logos/tavera-fc.png',
    'juventus':'assets/official-logos/juventus.png',
    'real juventino':'assets/teams/juventus.webp',
    'dynamo':'assets/official-logos/dynamo.png',
    'manchester':'assets/official-logos/manchester.png',
    'napoli':'assets/official-logos/napoli.png',
    'abejas':'assets/official-logos/abejas.png',
    'la canchita deportes':'assets/official-logos/la-canchita-deportes.png',
    'la canchita':'assets/official-logos/la-canchita-deportes.png',
    'aldama fc':'assets/official-logos/aldama-fc.png',
    'malvinas':'assets/official-logos/malvinas.png',
    'capibaras':'assets/official-logos/capibaras.png',
    'la cuadrilla':'assets/official-logos/la-cuadrilla.png',
    'mazacotes fc':'assets/official-logos/mazacotes-fc.png',
    'dep maravillas':'assets/official-logos/dep-maravillas.png',
    'deportivo maravillas':'assets/official-logos/dep-maravillas.png',
    'osasuna':'assets/official-logos/osasuna.png',
    'san antonio jrs':'assets/official-logos/san-antonio-jrs.png',
    'san antonio jr':'assets/official-logos/san-antonio-jrs.png',
    'populares':'assets/official-logos/populares.png',
    'pachangas fc':'assets/official-logos/pachangas-fc.png',
    'san juan fc':'assets/official-logos/san-juan-fc.png',
    'tapatio':'assets/official-logos/tapatio.png',
    'dep la luz':'assets/official-logos/dep-la-luz.png',
    'deportivo la luz':'assets/official-logos/dep-la-luz.png',
    'barza':'assets/official-logos/barza.png',
    'san jose jrs':'assets/official-logos/san-jose-jrs.png',
    'san antonio fc':'assets/official-logos/san-antonio-fc.png',
    'celticos':'assets/official-logos/celticos.png',
    'celticos fc':'assets/official-logos/celticos.png',
    'dep zapata':'assets/official-logos/dep-zapata.png',
    'deportivo zapata':'assets/official-logos/dep-zapata.png',

    // V108 aliases históricos — solo resuelven escudos; no agregan estos equipos a la temporada actual.
    'oklahoma':'assets/teams/oklahoma-city-fc.webp',
    'oklahoma fc':'assets/teams/oklahoma-city-fc.webp',
    'oklahoma city':'assets/teams/oklahoma-city-fc.webp',
    'mineros':'assets/teams/mineros-fc.webp',
    'mineros fc':'assets/teams/mineros-fc.webp',
    'san jose de la montana':'assets/teams/san-jose-montana.webp',
    'san jose montana':'assets/teams/san-jose-montana.webp',
    'sn jose de la m':'assets/teams/san-jose-montana.webp',
    'real cerrito de gasca':'assets/teams/deportivo-cg.webp',
    'real cerrito':'assets/teams/deportivo-cg.webp',
    'deportivo aldama':'assets/official-logos/aldama-fc.png',
    'aldama':'assets/official-logos/aldama-fc.png',
    'dinamo':'assets/official-logos/dynamo.png',
    'la esperanza fc':'assets/official-logos/la-esperanza.png',
    'san antonio jr':'assets/official-logos/san-antonio-jrs.png',
    'san antonio jrs':'assets/official-logos/san-antonio-jrs.png',
    'mazacotes':'assets/official-logos/mazacotes-fc.png',
    'terricolas fc':'assets/official-logos/terricolas.png',

    // V111 logos de referencia solicitados para equipos históricos/homónimos.
    'unam':'https://www.clipartmax.com/png/middle/278-2789076_pumas-de-la-unam-mexican-football-teams-badges.png',
    'guadalajara':'https://www.clipartmax.com/png/middle/114-1145991_cd-guadalajara-imagenes-de-las-chivas-2018.png',
    'arsenal':'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
    'chelsea':'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    'dortmund':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Borussia_Dortmund_logo.svg',
    'atlas':'https://commons.wikimedia.org/wiki/Special:Redirect/file/F%C3%BAtbol_Club_Atlas.svg',
    'boca jrs':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors_2012.svg',
    'boca juniors':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors_2012.svg',
    'huracan':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg',
    'a santiago':'assets/teams/atletico-santiago.webp',
    'f tavera':'assets/teams/franco-tavera-jr-veteranos.webp',
    'promesas':'assets/official-logos/promesas-fc.png'
  };

  function norm(v){
    return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
      .replace(/&/g,' y ').replace(/[().]/g,' ').replace(/[^a-z0-9+]+/g,' ').trim().replace(/\s+/g,' ');
  }
  function get(name){
    const key=norm(name);
    const dyn=DYNAMIC[key];
    if(dyn)return dyn;
    const path=MAP[key];
    if(path)return /^https?:\/\//i.test(path)?path:BASE+path;
    const official=window.LJR_OFFICIAL_API?.getLogo?.(name);
    return official||'';
  }
  async function loadDynamic(){
    try{
      const r=await fetch(BASE+'data/official-live.json?v=20260920-logo-all',{cache:'no-store'});
      if(!r.ok)return;
      const d=await r.json();
      for(const [name,v] of Object.entries(d.team_logos||{})){
        let src='';
        if(typeof v==='string')src=v;
        else if(v?.local)src=BASE+String(v.local).replace(/^\.\//,'');
        else if(v?.source)src=v.source;
        if(src)DYNAMIC[norm(name)]=src;
      }
      patchNode(document);
    }catch(_){}
  }
  function teamNameFrom(el){
    if(!(el instanceof Element))return '';
    const explicit=el.getAttribute('alt')||el.getAttribute('title')||'';
    if(get(explicit))return explicit;
    let node=el;
    for(let i=0;i<3&&node;i++,node=node.parentElement){
      const candidates=[
        node.dataset?.team,node.dataset?.v62Team,node.dataset?.v42CompareTeam,node.dataset?.v27Team,
        node.querySelector?.('strong')?.textContent,
        node.querySelector?.('b')?.textContent,
        node.querySelector?.('.v28-side span')?.textContent,
        node.querySelector?.('.v40-team strong')?.textContent,
        node.querySelector?.('.v42-mini-team b')?.textContent,
        node.querySelector?.('.v27-team-name')?.textContent,
        node.querySelector?.('.v46-team-copy strong')?.textContent
      ].filter(Boolean);
      for(const c of candidates)if(get(c))return String(c).trim();
      const txt=String(node.textContent||'').trim();
      if(txt.length&&txt.length<46&&get(txt))return txt;
    }
    return '';
  }
  function patchImg(img){
    if(!(img instanceof HTMLImageElement))return;
    if(img.closest('.v27-league-badge,.v35-logo-wrap,.v31-hospitality-page'))return;
    const name=teamNameFrom(img);
    if(!name)return;
    const src=get(name);
    if(!src)return;
    const current=String(img.src||'');
    if(current!==src)img.src=src;
    img.style.objectFit='contain';
    img.style.objectPosition='center';
  }
  function patchNode(root=document){
    root.querySelectorAll?.(
      'img[alt],.v28-team-logo,.v40-team-logo,.v42-team-crest,.v42-mini-team img,'+
      '.v27-logo img,.v46-team-logo,.v62-team-logo img,.v62-inline-logo img,'+
      '.v62-match-team img,.v62-team-card img'
    ).forEach(patchImg);
  }
  function start(){
    window.LJR_TEAM_LOGOS={get,map:{...MAP},dynamic:DYNAMIC,base:BASE,refresh:()=>patchNode(document)};
    patchNode(document);
    loadDynamic();
    const mo=new MutationObserver(muts=>{
      for(const m of muts){
        for(const n of m.addedNodes){
          if(n.nodeType===1){
            if(n.matches?.('img'))patchImg(n);
            patchNode(n);
          }
        }
      }
    });
    if(document.body)mo.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(()=>patchNode(document)));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();