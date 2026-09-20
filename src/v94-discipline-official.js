/* V94 — Disciplina con datos oficiales actuales.
   Elimina filas ficticias/inexistentes y usa únicamente jugadores/equipos
   que aparecen en official-live.json y en las plantillas vigentes. */
(function(){
  'use strict';
  if(window.__LJR_V94_DISCIPLINE__)return;
  window.__LJR_V94_DISCIPLINE__=true;

  const DATA_URL='./public/data/official-live.json';

  function route(){
    return (location.hash.replace(/^#\/?/,'')||'home').split('?')[0];
  }
  function isDiscipline(){
    const r=route();
    if(/discip/i.test(r))return true;
    const s=document.querySelector('#screen');
    const txt=(s?.innerText||'').replace(/\s+/g,' ').trim();
    return /^COMPETICIÓN\s+Disciplina\b/i.test(txt)||/Seguimiento informativo de tarjetas/i.test(txt);
  }
  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase().replace(/\s+/g,' ');
  }
  function esc(v){
    return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function teamLogo(data,team){
    const logos=data.team_logos||{};
    const key=Object.keys(logos).find(k=>norm(k)===norm(team));
    const rec=key?logos[key]:null;
    const local=rec?.local||'';
    const rawLocal=local
      ? 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+local.replace(/^\.\//,'')
      : '';
    const src=rec?.source||rawLocal;
    if(src){
      const fallback=rawLocal&&rawLocal!==src?rawLocal:'';
      return '<img class="v94-discipline-logo" src="'+esc(src)+'"'+
        (fallback?' data-v94-logo-fallback="'+esc(fallback)+'"':'')+
        ' alt="'+esc(team)+'" loading="eager" decoding="async">';
    }
    return '<span class="v94-discipline-logo-fallback">⚽</span>';
  }
  function rosterHas(cat,team,player){
    const rosters=cat.rosters||{};
    const key=Object.keys(rosters).find(k=>norm(k)===norm(team));
    if(!key)return false;
    return (rosters[key]||[]).some(n=>norm(n)===norm(player));
  }
  function validTeams(cat){
    const rows=cat.standings?.[0]?.rows||[];
    return new Set(rows.map(r=>norm(r?.[1])).filter(Boolean));
  }
  function extract(data){
    const map=new Map();

    for(const [catId,cat] of Object.entries(data.categories||{})){
      const teams=validTeams(cat);

      for(const block of (cat.cards||[])){
        const headers=(block.headers||[]).map(norm);
        const rows=block.rows||[];
        const iType=headers.indexOf('TIPO');
        const iPlayer=headers.indexOf('JUGADOR');
        const iTeam=headers.indexOf('EQUIPO');
        const iTotal=headers.indexOf('TOTAL');
        if(iPlayer<0||iTeam<0)continue;

        for(const row of rows){
          const player=row[iPlayer]||'';
          const team=row[iTeam]||'';
          if(!player||!team||!teams.has(norm(team))||!rosterHas(cat,team,player))continue;
          const key=catId+'|'+norm(team)+'|'+norm(player);
          const cur=map.get(key)||{
            catId,category:cat.name||('Categoría '+catId),player,team,
            cards:[],suspension:null
          };
          cur.cards.push({
            type:iType>=0?(row[iType]||'Tarjeta'):'Tarjeta',
            total:iTotal>=0?(row[iTotal]||''):''
          });
          map.set(key,cur);
        }
      }

      for(const block of (cat.suspensions||[])){
        const headers=(block.headers||[]).map(norm);
        const rows=block.rows||[];
        const iPlayer=headers.indexOf('JUGADOR');
        const iTeam=headers.indexOf('EQUIPO');
        const iPun=headers.indexOf('CASTIGO');
        const iPend=headers.indexOf('PENDIENTES');
        if(iPlayer<0||iTeam<0)continue;

        for(const row of rows){
          const player=row[iPlayer]||'';
          const team=row[iTeam]||'';
          if(!player||!team||!teams.has(norm(team))||!rosterHas(cat,team,player))continue;
          const key=catId+'|'+norm(team)+'|'+norm(player);
          const cur=map.get(key)||{
            catId,category:cat.name||('Categoría '+catId),player,team,
            cards:[],suspension:null
          };
          cur.suspension={
            punishment:iPun>=0?(row[iPun]||''):'',
            pending:iPend>=0?(row[iPend]||''):''
          };
          map.set(key,cur);
        }
      }
    }

    return [...map.values()].sort((a,b)=>{
      const ap=Number(a.suspension?.pending||0),bp=Number(b.suspension?.pending||0);
      const ac=a.cards.reduce((n,x)=>n+(Number(x.total)||0),0);
      const bc=b.cards.reduce((n,x)=>n+(Number(x.total)||0),0);
      return bp-ap||bc-ac||a.player.localeCompare(b.player,'es');
    });
  }
  function rowHtml(data,item,index){
    const reds=item.cards.filter(x=>/ROJ/i.test(norm(x.type))).reduce((n,x)=>n+(Number(x.total)||0),0);
    const yellows=item.cards.filter(x=>/AMAR/i.test(norm(x.type))).reduce((n,x)=>n+(Number(x.total)||0),0);
    const total=reds+yellows;
    const tags=[];
    if(yellows)tags.push('<span class="v94-card-tag v94-yellow">Amarillas '+yellows+'</span>');
    if(reds)tags.push('<span class="v94-card-tag v94-red">Rojas '+reds+'</span>');
    if(item.suspension?.punishment)tags.push('<span class="v94-card-tag v94-sanction">'+esc(item.suspension.punishment)+'</span>');

    return '<article class="v94-discipline-row">'+
      '<span class="v94-rank">'+(index+1)+'</span>'+
      '<span class="v94-logo-wrap">'+teamLogo(data,item.team)+'</span>'+
      '<span class="v94-person"><b>'+esc(item.player)+'</b><small>'+esc(item.team)+' · '+esc(item.category)+'</small><span class="v94-tags">'+tags.join('')+'</span></span>'+
      '<span class="v94-total">'+
        (item.suspension?.pending?'<b>'+esc(item.suspension.pending)+'</b><small>pend.</small>':'<b>'+esc(total||'—')+'</b><small>tarj.</small>')+
      '</span>'+
    '</article>';
  }
  function render(data){
    if(!isDiscipline())return;
    const screen=document.querySelector('#screen');
    if(!screen)return;

    const items=extract(data);
    const sig=(data.captured_at_utc||'')+'|'+items.map(x=>[x.player,x.team,x.category].join('~')).join('|');
    if(screen.dataset.v94DisciplineSig===sig&&screen.querySelector('.v94-discipline-page'))return;
    screen.dataset.v94DisciplineSig=sig;

    const currentTeams=new Set();
    Object.values(data.categories||{}).forEach(cat=>{
      (cat.standings?.[0]?.rows||[]).forEach(r=>{if(r?.[1])currentTeams.add(norm(r[1]))});
    });

    screen.innerHTML=
      '<section class="v94-discipline-page">'+
        '<div class="v94-kicker">COMPETICIÓN</div>'+
        '<h1>Disciplina</h1>'+
        '<p class="v94-lead">Tarjetas y castigos publicados oficialmente. Solo aparecen jugadores registrados en equipos vigentes.</p>'+
        '<div class="v94-source"><span>Datos oficiales</span><small>Actualizado '+esc((data.captured_at_utc||'').replace('T',' ').replace('Z',' UTC'))+'</small></div>'+
        (items.length
          ? '<div class="v94-discipline-list">'+items.map((x,i)=>rowHtml(data,x,i)).join('')+'</div>'
          : '<div class="v94-empty"><b>Sin tarjetas o castigos oficiales publicados</b><span>No se muestran nombres, equipos ni cifras ficticias.</span></div>')+
      '</section>';

    document.body.classList.add('v94-discipline-official');
    screen.querySelectorAll('img[data-v94-logo-fallback]').forEach(img=>{
      img.addEventListener('error',()=>{
        const fallback=img.dataset.v94LogoFallback||'';
        if(fallback&&img.src!==fallback){
          img.removeAttribute('data-v94-logo-fallback');
          img.src=fallback;
        }
      },{once:true});
    });
  }

  let dataPromise=null;
  function load(){
    if(!isDiscipline()){
      document.body.classList.remove('v94-discipline-official');
      return;
    }
    if(!dataPromise)dataPromise=fetch(DATA_URL+'?v=20260920-discipline94',{cache:'no-store'}).then(r=>{
      if(!r.ok)throw new Error('official-live '+r.status);
      return r.json();
    });
    dataPromise.then(render).catch(()=>{});
  }

  window.addEventListener('hashchange',()=>setTimeout(load,20));
  document.addEventListener('click',()=>setTimeout(load,60),true);
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>{
    if(!isDiscipline())return;
    if(!screen.querySelector('.v94-discipline-page')){
      screen.dataset.v94DisciplineSig='';
      setTimeout(load,20);
    }
  }).observe(screen,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});
  else load();
})();