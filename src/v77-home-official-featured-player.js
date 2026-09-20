/* V77 — Jugador destacado de Inicio con datos oficiales.
   Corrige cualquier tarjeta heredada "Juan Pérez / Juventino / 8 goles / 3 asistencias".
   Nunca inventa asistencias: si la fuente oficial no las publica, lo indica. */
(function(){
  'use strict';
  if(window.__LJR_V77_HOME_OFFICIAL_PLAYER__)return;
  window.__LJR_V77_HOME_OFFICIAL_PLAYER__=true;

  const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

  function validScorers(){
    const db=window.LJR_OFFICIAL_DATA;
    if(!db?.categories)return [];
    const out=[];
    Object.entries(db.categories).forEach(([categoryId,cat])=>{
      (cat?.scorers||[]).forEach(block=>{
        const headers=(block?.headers||[]).map(h=>norm(h));
        const idxPlayer=headers.findIndex(h=>h.includes('jugador'));
        const idxTeam=headers.findIndex(h=>h.includes('equipo'));
        const idxGoals=headers.findIndex(h=>h.includes('gol'));
        const idxAssists=headers.findIndex(h=>h.includes('asist'));
        (block?.rows||[]).forEach(row=>{
          if(!Array.isArray(row))return;
          const player=idxPlayer>=0?String(row[idxPlayer]||'').trim():String(row[1]||'').trim();
          const team=idxTeam>=0?String(row[idxTeam]||'').trim():String(row[2]||'').trim();
          const goals=Number(idxGoals>=0?row[idxGoals]:row[3]);
          if(!player||!team||!Number.isFinite(goals))return;
          const assistsRaw=idxAssists>=0?row[idxAssists]:null;
          const assists=assistsRaw!==null&&assistsRaw!==''&&Number.isFinite(Number(assistsRaw))?Number(assistsRaw):null;
          out.push({player,team,goals,assists,category:String(cat?.name||''),categoryId:String(categoryId)});
        });
      });
    });
    return out.sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player,'es'));
  }

  function featured(){
    const all=validScorers();
    if(!all.length)return null;
    /* Primera Fuerza primero solo cuando tenga goleo publicado; si no, usa el máximo oficial disponible. */
    const firstForce=all.filter(x=>x.categoryId==='3');
    return firstForce[0]||all[0];
  }

  function findLegacyCard(screen){
    const els=[...screen.querySelectorAll('*')];
    const candidates=els.filter(el=>{
      const t=norm(el.textContent);
      return (t.includes('juan perez')||t.includes('jugador de la semana')) &&
             (t.includes('ver goleadores')||t.includes('votar')||t.includes('goles'));
    });
    candidates.sort((a,b)=>(a.textContent||'').length-(b.textContent||'').length);
    return candidates[0]||null;
  }

  function replaceExact(root,test,value){
    [...root.querySelectorAll('*')].forEach(el=>{
      if(el.children.length)return;
      if(test(norm(el.textContent),el.textContent||''))el.textContent=value;
    });
  }

  function patch(){
    if(route()!=='home')return;
    const screen=document.querySelector('#screen');
    if(!screen)return;
    const s=featured();
    if(!s)return;

    const card=findLegacyCard(screen);
    if(!card)return;

    card.dataset.v77OfficialPlayer='1';

    replaceExact(card,(n)=>n==='juan perez'||n==='juan pérez',s.player);
    replaceExact(card,(n)=>n==='juventino',s.team);
    replaceExact(card,(n)=>n==='jugador de la semana','GOLEADOR OFICIAL');
    replaceExact(card,(n,raw)=>/^0?9$/.test(String(raw).trim()),String(s.goals).padStart(2,'0'));

    [...card.querySelectorAll('*')].forEach(el=>{
      if(el.children.length)return;
      const n=norm(el.textContent);
      if(n.includes('goles')&&n.includes('asistencias')){
        el.textContent=s.team+' · '+s.goals+' goles · '+(s.assists===null?'asistencias no publicadas':s.assists+' asistencias');
      }
    });

    /* Si la línea antigua quedó partida en nodos distintos, corrige también fragmentos individuales. */
    replaceExact(card,(n)=>n==='8 goles',s.goals+' goles');
    replaceExact(card,(n)=>n==='3 asistencias',s.assists===null?'Asistencias no publicadas':s.assists+' asistencias');

    const title=card.querySelector('[data-v77-player-name]');
    if(title)title.textContent=s.player;
  }

  let tries=0;
  function schedule(){
    requestAnimationFrame(()=>{
      patch();
      if(route()==='home'&&tries<20&&!document.querySelector('[data-v77-official-player]')){
        tries++;
        setTimeout(patch,250);
      }
    });
  }

  window.addEventListener('hashchange',()=>{tries=0;schedule()});
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true,characterData:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();