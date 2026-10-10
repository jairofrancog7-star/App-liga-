/* V67 / V108 / V111 aliases históricos — Registro único de escudos de equipos.
   Evita que los partidos, tablas, perfiles y comparadores usen el logo genérico
   de la Liga cuando ya existe un escudo real en Liga_Futbol. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const DYNAMIC={};
  /* V688 — equivalencias históricas confirmadas por el usuario.
     Son sólo aliases visuales del archivo; no agregan clubes a la temporada actual. */
  const USER_HISTORIC={
    'salvajes':'',
    'salvaje':'',
    'universidad':'./assets/history/team-logos/universidad-pumas.webp',
    'unam':'./assets/history/team-logos/universidad-pumas.webp',
    'pumas':'./assets/history/team-logos/universidad-pumas.webp',
    'pumas unam':'./assets/history/team-logos/universidad-pumas.webp',
    'xolos jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
    'jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
    'jaralillo fc':'./assets/history/team-logos/xolos-jaralillo.webp',
    'jaralillo f c':'./assets/history/team-logos/xolos-jaralillo.webp',
    'xolos de jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
    'xolos':'./assets/history/team-logos/xolos-jaralillo.webp',
    'xoloitzcuintles':'./assets/history/team-logos/xolos-jaralillo.webp',
    'club tijuana':'./assets/history/team-logos/xolos-jaralillo.webp',
    'tecos':'./assets/history/team-logos/tecos.webp',
    'tecos fc':'./assets/history/team-logos/tecos.webp'
  };
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
    'cuenda':'assets/teams/tc-cuenda.webp',
    'toros de cuenda':'assets/official-logos/toros-de-cuenda.png',
    'pozos':'https://jairofrancog7-star.github.io/App-liga-/assets/season-2026/pozos.webp',
    'deportivo pozos':'https://jairofrancog7-star.github.io/App-liga-/assets/season-2026/pozos.webp',
    'dep pozos':'https://jairofrancog7-star.github.io/App-liga-/assets/season-2026/pozos.webp',
    'pozos fc':'https://jairofrancog7-star.github.io/App-liga-/assets/season-2026/pozos.webp',
    'santa cruz':'assets/teams/atletico-santa-cruz.webp',
    'atletico santa cruz':'assets/teams/atletico-santa-cruz.webp',
    'franco tavera':'assets/teams/franco-tavera-jr-veteranos.webp',
    'san jose fc':'assets/official-logos/san-jose-fc.png',
    'san jose':'assets/official-logos/san-jose-fc.png',
    'atletico santiago':'assets/teams/atletico-santiago.webp',
    'lobos jr':'assets/teams/lobos-jr-cerrito-gasca.webp',
    'lobos jrs':'assets/teams/lobos-jr-cerrito-gasca.webp',
    'lobos jrs cerrito de gasca':'assets/teams/lobos-jr-cerrito-gasca.webp',
    'lobos jr cerrito de gasca':'assets/teams/lobos-jr-cerrito-gasca.webp',
    'hermanos':'assets/official-logos/hermanos.png',
    'linces':'assets/official-logos/linces.png',
    'terricolas':'assets/official-logos/terricolas.png',
    'galacticos':'assets/teams/galacticos-pozos.webp',

    'herreras fc':'assets/official-logos/herreras-fc.png',
    'boavista':'assets/official-logos/boavista.png',
    'psv':'assets/teams/psv.webp',
    'psv eindhoven':'assets/official-logos/psv.png',
    'psv-eindhoven':'assets/official-logos/psv.png',
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
    'manchester united':'assets/teams/manchester-united.webp',
    'man united':'assets/teams/manchester-united.webp',
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
    'san antonio':'assets/official-logos/san-antonio-fc.png',
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
    'chelse':'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    'dortmund':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Borussia_Dortmund_logo.svg',
    'atlas':'https://commons.wikimedia.org/wiki/Special:Redirect/file/F%C3%BAtbol_Club_Atlas.svg',
    'boca jrs':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors_2012.svg',
    'boca juniors':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors_2012.svg',
    'huracan':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Huracan_pfndn5',
    'boavista':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Boavista_wioj7b',
    'franco tavera':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc',
    'franco-tavera':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc',
    'franco tavera jr':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc',
    'franco-tavera-jr':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc',
    'f tavera':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc',
    'cuenda':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SantiagoCuenda_fvaq9e',
    'america':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/America_wbi53g',
    'america veteranos':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/America_wbi53g',
    'aguilares':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/aguilares_ifdgll',
    'juventus':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_fpshqs',
    'leyendas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LEYENDAS_jwcnlu',
    'leyendas fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LEYENDAS_jwcnlu',
    'psv':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PSV_ru3tft',
    'la trinidad':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/La_trinidad_a32pbk',
    'trinidad':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/La_trinidad_a32pbk',
    'a santiago':'assets/teams/atletico-santiago.webp',
    'f tavera':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc',
    'promesas':'assets/official-logos/promesas-fc.png'
  };

  function norm(v){
    return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
      .replace(/&/g,' y ').replace(/[().]/g,' ').replace(/[^a-z0-9+]+/g,' ').trim().replace(/\s+/g,' ');
  }
  function get(name){
    const supplied=window.LJR_SEASON_LOGOS?.get(name);
    if(supplied)return supplied;
    const key=norm(name);
    const historic=USER_HISTORIC[key];
    if(historic)return new URL(historic,document.baseURI).href;
    const cached=Object.entries(window.LJR_OFFICIAL_DATA?.team_logos||{}).find(([team])=>norm(team)===key)?.[1]?.app;
    if(cached)return cached;
    /* V485: Juventus conserva el escudo local estable esperado por los módulos históricos
       y por las pruebas de regresión; los demás equipos actuales siguen usando la fuente oficial. */
    if(key==='juventus')return BASE+'assets/official-logos/juventus.png';
    const dyn=DYNAMIC[key];
    if(dyn)return dyn;

    // V484: los datos oficiales actuales mandan sobre los logos históricos/locales.
    const data=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
    const entry=Object.entries(data?.team_logos||{}).find(([team])=>norm(team)===key)?.[1];
    if(entry?.app)return entry.app;
    let source=typeof entry==='string'?entry:(entry?.source||entry?.local||'');
    if(source)return /^https?:\/\//i.test(source)?source:BASE+String(source).replace(/^\.\//,'');

    for(const cat of Object.values(data?.categories||{})){
      const hit=(cat?.dashboard?.logo_candidates||[]).find(x=>norm(x?.near_text||'')===key);
      if(hit?.source)return hit.source;
    }

    const path=MAP[key];
    return path ? (/^https?:\/\//i.test(path)?path:BASE+path) : '';
  }
  async function loadDynamic(){
    for(const url of ['./data/official-live.json?v=20261001-v491-v35-all-pages',BASE+'data/official-live.json?v=20261001-v491-v35-all-pages']){
      try{
        const r=await fetch(url,{cache:'no-store'});
        if(!r.ok)continue;
        const d=await r.json();
        for(const [name,v] of Object.entries(d.team_logos||{})){
          let src='';
          if(typeof v==='string')src=v;
          else if(v?.app)src=v.app;
          else if(v?.local)src=BASE+String(v.local).replace(/^\.\//,'');
          else if(v?.source)src=v.source;
          if(src)DYNAMIC[norm(name)]=src;
        }
        for(const cat of Object.values(d.categories||{})){
          for(const item of (cat?.dashboard?.logo_candidates||[])){
            const name=String(item?.near_text||'').trim(),src=String(item?.source||'').trim();
            if(name&&src)DYNAMIC[norm(name)]=src;
          }
        }
        patchNode(document);
        return;
      }catch(_){}
    }
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
    // V948: this emblem is controlled by the dedicated comparator resolver.
    // Do not overwrite its working source with a different category/logo.
    if(img.closest('.v944-crest'))return;
    // Jornada explicitly calls LJR_TEAM_LOGOS.get(); never replace its images later.
    if(img.closest('.md1132-crest'))return;
    if(img.closest('[data-player-portrait],.v123-avatar,.v123-option-avatar,.v66-player-avatar,.v42-avatar,.v576-player-avatar,.v379-related-avatar,.v562-avatar,.v124-avatar')||img.matches('.v379-player-photo,.v610-generic-player,.v576-player-photo,.v576-hero-player-photo'))return;
    if(img.closest('.v27-league-badge,.v35-logo-wrap,.v31-hospitality-page'))return;
    const oldCategory={'primera-fuerza-hd.png':'3','intermedia.webp':'5','segunda-fuerza.webp':'4','veteranos-35-user.png':'2','veteranos-50.webp':'1'};
    const file=(img.getAttribute('src')||'').split(/[?#]/)[0].split('/').pop();
    const category=window.LJR_SEASON_LOGOS?.category(img.alt)||window.LJR_SEASON_LOGOS?.category(oldCategory[file]);
    if(category){if(img.src!==category){img.removeAttribute('srcset');img.src=category;}img.onerror=null;return;}
    const photo=String(img.getAttribute('src')||'');
    if(/(?:^|\s)[^\s]*(?:photo|portrait|cover|thumb)[^\s]*(?:\s|$)/i.test(img.className)||(/\/history\//.test(photo)&&!/\/team-logos\//.test(photo)))return;
    const name=teamNameFrom(img);
    if(!name)return;
    const src=get(name);
    if(!src)return;
    const current=String(img.src||'');
    if(current!==new URL(src,document.baseURI).href){img.removeAttribute('srcset');img.src=src;}
    if(window.LJR_SEASON_LOGOS?.get(name)){img.dataset.seasonTeam=window.LJR_SEASON_LOGOS.norm(name);img.onerror=null;img.style.removeProperty('display');img.hidden=false;}
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
        if(m.type==='attributes'){patchImg(m.target);continue;}
        for(const n of m.addedNodes){
          if(n.nodeType===1){
            if(n.matches?.('img'))patchImg(n);
            patchNode(n);
          }
        }
      }
    });
    if(document.body)mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','alt']});
    window.addEventListener('hashchange',()=>requestAnimationFrame(()=>patchNode(document)));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
