/* V120 — navegación atrás coherente en toda la app móvil.
   Objetivo:
   - Volver siempre a la pantalla realmente anterior.
   - Respetar la secuencia anterior/anterior/anterior.
   - No saltar a Más, Perfil o Inicio por handlers locales.
   - Restaurar la posición de scroll al regresar.
*/
(function(){
  'use strict';
  if(window.__LJR_V120_HISTORY_FIX__) return;
  window.__LJR_V120_HISTORY_FIX__=true;

  const STACK_KEY='ljr-v120-route-stack';
  const SCROLL_KEY='ljr-v120-route-scroll';

  const normRoute=()=> {
    let r=String(location.hash||'').replace(/^#\/?/,'').trim();
    if(!r) r='home';
    if(r==='quiz') r='quizArena';
    return r;
  };

  const readJson=(key,fallback)=>{
    try{
      const v=JSON.parse(sessionStorage.getItem(key)||'null');
      return v??fallback;
    }catch{return fallback;}
  };
  const writeJson=(key,value)=>{
    try{sessionStorage.setItem(key,JSON.stringify(value));}catch{}
  };

  let current=normRoute();
  let stack=readJson(STACK_KEY,[]);
  if(!Array.isArray(stack)) stack=[];
  if(!stack.length){
    stack=[current];
  }else if(stack[stack.length-1]!==current){
    if(stack.length>1 && stack[stack.length-2]===current) stack.pop();
    else stack=[current];
  }
  writeJson(STACK_KEY,stack);

  let scrolls=readJson(SCROLL_KEY,{});
  if(!scrolls || typeof scrolls!=='object' || Array.isArray(scrolls)) scrolls={};

  let lastScrollY=Math.max(0,window.scrollY||document.documentElement.scrollTop||0);
  let restoring=false;

  const saveScroll=()=>{
    if(restoring) return;
    lastScrollY=Math.max(0,window.scrollY||document.documentElement.scrollTop||0);
    scrolls[current]=lastScrollY;
    writeJson(SCROLL_KEY,scrolls);
  };

  window.addEventListener('scroll',()=>{
    if(restoring) return;
    lastScrollY=Math.max(0,window.scrollY||document.documentElement.scrollTop||0);
    scrolls[current]=lastScrollY;
    clearTimeout(window.__ljrV120ScrollTimer);
    window.__ljrV120ScrollTimer=setTimeout(()=>writeJson(SCROLL_KEY,scrolls),80);
  },{passive:true});

  let restoreId=0,transitionId=0,pageAnimation;
  const restoreScroll=(route)=>{
    const id=++restoreId,y=Number(scrolls[route]||0);
    restoring=true;
    const apply=()=>{if(id===restoreId&&normRoute()===route)window.scrollTo(0,Math.max(0,y))};
    const cancel=()=>{if(id===restoreId){restoreId++;restoring=false}};
    window.addEventListener('pointerdown',cancel,{once:true,passive:true});
    window.addEventListener('wheel',cancel,{once:true,passive:true});
    [0,80,180,360,650].forEach(ms=>setTimeout(apply,ms));
    setTimeout(()=>{window.removeEventListener('pointerdown',cancel);window.removeEventListener('wheel',cancel);if(id===restoreId){restoring=false;lastScrollY=Math.max(0,window.scrollY||0)}},700);
  };
  function animatePage(back){
    const id=++transitionId;
    pageAnimation?.cancel();
    if(['matchCenter','match','video'].includes(normRoute().split('?')[0])||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    setTimeout(()=>requestAnimationFrame(()=>{
      if(id!==transitionId)return;
      const screen=document.querySelector('#screen');
      pageAnimation=screen?.animate([{transform:'translateX('+(back?'-20%':'100%')+')',opacity:.6},{transform:'translateX(0)',opacity:1}],{duration:220,easing:'cubic-bezier(.22,.8,.3,1)'});
    }),60);
  }

  const sameOriginReferrer=()=>{
    try{return !!document.referrer && new URL(document.referrer).origin===location.origin;}catch{return false;}
  };

  const FALLBACK_ROUTE={
    teamDetail:'teams',
    playerDetail:'players',
    match:'competition',
    newsDetail:'news',
    cedulaDetail:'cedulas',
    credential:'cedulas',
    notifications:'more',
    following:'more',
    rankings:'more',
    history:'more',
    'safe-data':'more',
    leagueData:'more',
    tableExport:'leagueTools',
    bracketBuilder:'leagueTools',
    credentialBuilder:'leagueTools',
    cedulaBuilder:'leagueTools',
    agendaBuilder:'leagueTools',
    motionHub:'leagueTools',
    suspensionTool:'leagueTools',
    rulebook:'leagueTools',
    matchday:'leagueTools',
    weatherFields:'leagueTools',
    venues:'leagueTools',
    publications:'leagueTools',
    tactics:'leagueTools',
    simulator:'leagueTools',
    jrControl:'leagueTools',
    scheduleChanges:'home'
  };

  function fallbackRoute(){
    const now=normRoute();
    const target=FALLBACK_ROUTE[now]||'home';
    if(now===target) return;
    const old=location.href;
    const base=location.pathname+location.search+'#/'+target;
    history.replaceState(history.state,'',base);
    current=target;
    stack=[target];
    writeJson(STACK_KEY,stack);
    try{
      window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL:old,newURL:location.href}));
    }catch{
      window.dispatchEvent(new Event('hashchange'));
    }
  }

  function appBack(){
    saveScroll();
    if(stack.length>1){
      const previous=stack[stack.length-2];
      const old=location.href;
      history.replaceState(history.state,'',location.pathname+location.search+'#/'+previous);
      window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL:old,newURL:location.href}));
      return;
    }
    fallbackRoute();
  }

  window.LJR_APP_BACK=appBack;

  const pageBackSelector=[
    '#backButton',
    'button[aria-label="Volver"]',
    'a[aria-label="Volver"],button[aria-label="Regresar"],button[aria-label="Atrás"]',
    '[data-v41-close],[data-v501-back],[data-v440-back]',
    '.v66-compact-back',
    '[data-v20-back],[data-v46-back],[data-v52-back],[data-v62-back],[data-v27-back],[data-v28-back],[data-v31-back],[data-v32-back],[data-v33-back],[data-v33-about-back],[data-v35-back],[data-v40-back],[data-v42-back],[data-v123-back],[data-v129-back],[data-v372-back],[data-v379-back],[data-v412-back],[data-v429-back]',
    '.v26-back,.v26-moments-sticky-back,.v27-back,.v53-p6-back,.v440-tv-backmark'
  ].join(',');

  window.addEventListener('click',function(e){
    const target=e.target.closest?.(pageBackSelector);
    if(!target) return;

    /* Estos controles son internos de overlays/juegos y no representan
       una navegación de página. */
    if(target.closest('.modal,.v105-modal,.v16-player-modal,.v28-sheet-layer')) return;
    if(target.matches('[data-v437-detail-back],[data-v369-picker-back],[data-v439-sub-back],[data-v48-game-back],[data-v28-close-sheet],[data-v28-close-picker],[data-v16-close]')) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    appBack();
  },true);

  window.addEventListener('hashchange',()=>{
    const next=normRoute();
    if(next===current) return;

    /* La posición de la pantalla que abandonamos ya se fue guardando
       durante el scroll; se fuerza un último guardado. */
    scrolls[current]=lastScrollY;
    writeJson(SCROLL_KEY,scrolls);

    const isBack=stack.length>1 && stack[stack.length-2]===next;
    if(isBack){
      stack.pop();
    }else if(stack[stack.length-1]!==next){
      stack.push(next);
      if(stack.length>80) stack=stack.slice(-80);
    }

    current=next;
    writeJson(STACK_KEY,stack);

    ++restoreId;
    animatePage(isBack);
    if(isBack) restoreScroll(next);
    else {
      restoring=false;
      lastScrollY=Math.max(0,window.scrollY||0);
    }
  });

  window.addEventListener('pageshow',()=>{
    const r=normRoute();
    current=r;
    if(stack[stack.length-1]!==r){
      if(stack.length>1 && stack[stack.length-2]===r) stack.pop();
      else stack.push(r);
      writeJson(STACK_KEY,stack);
    }
  });

  window.addEventListener('beforeunload',saveScroll);
})();
