/* V131 — Cédula arbitral propia, logos locales y PDF A4 en una sola hoja. */
(function(){
  'use strict';

  const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  /* V1008: Imagen original PNG integrada en la hoja como data URI.
     No depende de rutas estáticas en Pages; sin filtros ni modificación de píxeles. */
  const LEAGUE_LOGO='data:image/png;base64,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';
  const LOCAL_DATA='./data/official-live.json?v=20261001-v490-vet35-all-pages';
  const CAT_LOGOS={
    'primera fuerza':ROOT+'assets/branding/primera-fuerza-hd.png',
    'intermedia':ROOT+'assets/categories/intermedia.webp',
    'segunda fuerza':ROOT+'assets/categories/segunda-fuerza.webp',
    'veteranos 35+':ROOT+'assets/categories/veteranos-35-user.png',
    'veteranos 50+':ROOT+'assets/categories/veteranos-50.webp'
  };
  /* Mismo registro visual usado por la otra app de la Liga. */
  const TEAM_LOGOS={
    'c de gasca':'assets/teams/deportivo-cg.webp','cerrito de gasca':'assets/teams/deportivo-cg.webp',
    'juventus':'assets/teams/juventus.webp','cuenda':'assets/teams/tc-cuenda.webp','toros de cuenda':'assets/teams/tc-cuenda.webp',
    'pozos fc':'assets/teams/pozos-fc.webp','pozos':'assets/teams/pozos-fc.webp','boavista':'assets/teams/boavista-fc.webp',
    'psv':'assets/teams/psv.webp','a santiago':'assets/teams/atletico-santiago.webp','atletico santiago':'assets/teams/atletico-santiago.webp',
    'f tavera':'assets/teams/franco-tavera-jr-veteranos.webp','franco tavera':'assets/teams/franco-tavera-jr-veteranos.webp',
    'america':'assets/branding/america-veteranos-35-user.png','america veteranos':'assets/branding/america-veteranos-35-user.png',
    'hermanos':'assets/teams/club-deportivo-hermanos.webp','san jose fc':'assets/teams/san-jose.webp','linces':'assets/teams/linces.webp',
    'lobos cdg':'assets/teams/lobos-cdg.webp','terricolas':'assets/teams/terricolas-fc.webp','galacticos':'assets/teams/galacticos-pozos.webp',
    'franco fc':'assets/teams/franco-fc.webp','herreras fc':'assets/teams/herrera-fc.webp','la canchita deportes':'assets/teams/la-canchita.webp',
    'galeana':'assets/teams/atletico-galeana.webp','atletico galeana':'assets/teams/atletico-galeana.webp','aldama fc':'assets/teams/aldama.webp',
    'san antonio jrs':'assets/teams/san-antonio-jr.webp','promesas':'assets/teams/promesas-fc-pozos.webp','promesas fc':'assets/teams/promesas-fc-pozos.webp',
    'la huerta':'assets/teams/la-huerta-cuenda.webp','tavera fc':'assets/teams/tavera-fc.webp','san jose jrs':'assets/teams/san-jose-jr.webp',
    'san julian':'assets/teams/san-julian-fc.webp','dep nopalero':'assets/teams/deportivo-nopalero.webp','deportivo nopalero':'assets/teams/deportivo-nopalero.webp',
    'la esperanza':'assets/teams/la-esperanza-fc.webp','manchester':'assets/teams/manchester-united.webp'
  };
  let cachedDb=null;

  function route(){
    return (document.body?.dataset?.appRoute||location.hash.replace(/^#\//,'').split('?')[0]||'home');
  }
  function norm(v){
    return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
      .replace(/&/g,' y ').replace(/[().]/g,' ').replace(/[^a-z0-9+]+/g,' ').trim().replace(/\s+/g,' ');
  }
  function esc(v){
    return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function same(a,b){
    const x=norm(a),y=norm(b);
    if(x===y)return true;
    const pairs=[
      ['boavista','boavista fc'],['boca jrs','boca juniors'],
      ['toros de cuenda','cuenda'],['atletico galeana','galeana'],
      ['atletico santa cruz','santa cruz'],['pozos fc','pozos'],
      ['club america veteranos','america veteranos'],
      ['dep maravillas','deportivo maravillas'],['dep zapata','deportivo zapata'],
      ['dep nopalero','deportivo nopalero'],['dep la luz','deportivo la luz'],
      ['celticos','celticos fc']
    ];
    return pairs.some(p=>(x===p[0]&&y===p[1])||(x===p[1]&&y===p[0]));
  }
  async function getDb(){
    try{
      const live=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
      if(live){cachedDb=live;return live}
    }catch(_){}
    if(cachedDb)return cachedDb;
    try{
      const r=await fetch(LOCAL_DATA,{cache:'no-store'});
      if(r.ok){cachedDb=await r.json();return cachedDb}
    }catch(_){}
    return null;
  }
  function categoryByName(db,name){
    const cats=Object.values(db?.categories||{});
    return cats.find(c=>same(c?.name,name))||cats.find(c=>norm(c?.name).includes(norm(name)))||null;
  }
  function rosterFor(db,catName,teamName){
    const first=categoryByName(db,catName);
    const pools=first?[first,...Object.values(db?.categories||{}).filter(c=>c!==first)]:Object.values(db?.categories||{});
    for(const c of pools){
      const hit=Object.entries(c?.rosters||{}).find(([n])=>same(n,teamName));
      if(hit){
        const arr=Array.isArray(hit[1])?hit[1]:[];
        return arr.map(x=>typeof x==='string'?x:(x?.name||x?.player||String(x||''))).filter(Boolean).slice(0,30);
      }
    }
    return [];
  }
  function logoValue(v){
    if(typeof v==='string')return v;
    if(v?.local)return ROOT+String(v.local).replace(/^\.\//,'');
    if(v?.source)return v.source;
    return '';
  }
  function logoFor(db,name){
    const direct=Object.entries(db?.team_logos||{}).find(([n])=>same(n,name));
    if(direct){
      const src=logoValue(direct[1]);
      if(src)return src;
    }
    const key=norm(name);
    for(const c of Object.values(db?.categories||{})){
      const candidates=c?.dashboard?.logo_candidates||[];
      const hit=candidates.find(x=>{
        const near=norm(x?.near_text||'');
        return near===key||near.startsWith(key+' ')||near.includes(' '+key+' ')||near.endsWith(' '+key);
      });
      if(hit?.source)return hit.source;
    }
    const local=TEAM_LOGOS[norm(name)];
    if(local)return /^https?:\/\//i.test(local)?local:ROOT+local;
    try{
      const shared=window.LJR_TEAM_LOGOS?.get?.(name)||'';
      if(shared)return shared;
    }catch(_){}
    return '';
  }
  function categoryLogo(name){
    const key=norm(name);
    return CAT_LOGOS[key]||LEAGUE_LOGO;
  }
  function fixtureFor(db,catName,home,away){
    const c=categoryByName(db,catName);
    const rows=c?.fixtures?.[0]?.rows||[];
    return rows.find(r=>(same(r?.[2],home)&&same(r?.[6],away))||(same(r?.[2],away)&&same(r?.[6],home)))||null;
  }
  function q(sel){return document.querySelector(sel)?.value||''}
  function formatDate(v){
    const s=String(v||'').trim();
    if(!s)return 'Por confirmar';
    let m=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    if(m)return m[3]+'/'+m[2]+'/'+m[1]+(m[4]?(' · '+m[4]+':'+m[5]):'');
    m=s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}:\d{2}))?/);
    if(m)return m[1].padStart(2,'0')+'/'+m[2].padStart(2,'0')+'/'+m[3]+(m[4]?(' · '+m[4]):'');
    return s;
  }
  function initials(name){
    return String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()||'EQ';
  }
  function imgOrFallback(src,name,cls){
    if(src)return '<img class="'+cls+'" src="'+esc(src)+'" alt="'+esc(name)+'" loading="eager" decoding="async">';
    return '<span class="'+cls+' v131-team-fallback">'+esc(initials(name))+'</span>';
  }
  function rosterTable(team,roster,logo){
    const count=Math.min(30,Math.max(roster.length,18));
    let rows='';
    for(let i=0;i<count;i++){
      const name=roster[i]||'';
      rows+='<tr><td>'+(i+1)+'</td><td'+(!name?' class="v131-empty-player"':'')+'>'+esc(name||'Jugador')+'</td><td></td><td></td><td></td><td></td><td></td></tr>';
    }
    return '<section class="v131-team-block">'+
      '<div class="v131-team-title">'+imgOrFallback(logo,team,'v131-team-crest')+'<b>'+esc(team)+'</b></div>'+
      '<table class="v131-roster-table" aria-label="Plantilla '+esc(team)+'">'+
        '<thead><tr><th>#</th><th>Jugador</th><th>Dorsal</th><th>Goles</th><th>TA</th><th>TR</th><th>Firma</th></tr></thead>'+
        '<tbody>'+rows+'</tbody>'+
      '</table>'+
    '</section>';
  }
  function ownToast(msg){
    const old=document.querySelector('.v131-toast');if(old)old.remove();
    const n=document.createElement('div');n.className='v131-toast';n.textContent=msg;
    Object.assign(n.style,{position:'fixed',left:'50%',bottom:'96px',transform:'translateX(-50%)',zIndex:'120000',padding:'10px 14px',borderRadius:'12px',background:'#07105f',color:'#fff',border:'1px solid rgba(35,221,234,.45)',fontSize:'12px',fontWeight:'800',boxShadow:'0 10px 28px rgba(0,0,0,.3)',maxWidth:'calc(100vw - 32px)',textAlign:'center'});
    document.body.appendChild(n);setTimeout(()=>n.remove(),1900);
  }
  async function renderCedula(scroll,silent=false){
    const host=document.querySelector('[data-v64-cedula-preview]');
    if(!host)return null;

    host.innerHTML='<div class="v131-cedula-stage"><div class="v131-stage-bar"><b>Preparando cédula arbitral…</b><span>DATOS DE LA LIGA</span></div></div>';

    const db=await getDb();
    const leaguePrintLogo=LEAGUE_LOGO;
    const cat=q('[data-v64-ced-cat]')||'Primera Fuerza';
    const home=q('[data-v64-ced-home]')||'Local';
    const away=q('[data-v64-ced-away]')||'Visitante';
    const fixture=fixtureFor(db,cat,home,away);
    const storedDate=localStorage.getItem('v66-cedula-date')||'';
    const storedField=localStorage.getItem('v66-cedula-field')||'';
    const storedRound=localStorage.getItem('v66-cedula-round')||'';
    const dateRaw=q('[data-v64-ced-date]')||storedDate||fixture?.[8]||'';
    const field=q('[data-v64-ced-field]')||storedField||fixture?.[7]||'Por confirmar';
    const referee=q('[data-v64-ced-ref]')||'Por asignar';
    const jornada=storedRound?('Jornada '+storedRound):(fixture?.[1]?('Jornada '+fixture[1]):'Por confirmar');
    const homeRoster=rosterFor(db,cat,home);
    const awayRoster=rosterFor(db,cat,away);
    const homeLogo=logoFor(db,home);
    const awayLogo=logoFor(db,away);
    const catLogo=categoryLogo(cat);
    const maxRoster=Math.max(homeRoster.length,awayRoster.length);
    const density=maxRoster>=27?' v131-ultra':(maxRoster>=23?' v131-dense':'');

    host.innerHTML=
      '<div class="v131-cedula-stage">'+
        '<div class="v131-stage-bar"><b>Vista previa · Cédula arbitral</b><span>LISTA PARA PDF</span></div>'+
        '<div class="v131-sheet-wrap">'+
          '<article class="v131-cedula-sheet'+density+'" data-v131-print-sheet>'+
            '<header class="v131-sheet-head">'+
              '<div class="v131-head-logo v1004-league-logo" role="img" aria-label="Escudo Liga Municipal de Fútbol Juventino Rosas"><img src="'+esc(leaguePrintLogo)+'" alt="" loading="eager" decoding="sync"></div>'+
              '<div class="v131-head-copy">'+
                '<small>LIGA MUNICIPAL DE FÚTBOL</small>'+
                '<h1>Juventino Rosas A.C.</h1>'+
                '<p>CÉDULA ARBITRAL · '+esc(cat)+'</p>'+
              '</div>'+
              '<div class="v131-head-logo"><img src="'+esc(catLogo)+'" alt="'+esc(cat)+'" loading="eager"></div>'+
            '</header>'+
            '<span class="v131-doc-tag">DOCUMENTO INTERNO</span>'+
            '<div class="v131-blue-rule"></div>'+
            '<div class="v131-status">PENDIENTE DE VALIDACIÓN Y FIRMA DE LA LIGA</div>'+
            '<h2 class="v131-matchup">'+esc(home)+' vs '+esc(away)+'</h2>'+
            '<div class="v131-meta">'+
              '<div><small>Jornada</small><b>'+esc(jornada)+'</b></div>'+
              '<div><small>Fecha</small><b>'+esc(formatDate(dateRaw))+'</b></div>'+
              '<div><small>Campo</small><b>'+esc(field||'Por confirmar')+'</b></div>'+
              '<div><small>Árbitro</small><b>'+esc(referee)+'</b></div>'+
            '</div>'+
            '<div class="v131-rosters">'+
              rosterTable(home,homeRoster,homeLogo)+
              rosterTable(away,awayRoster,awayLogo)+
            '</div>'+
            '<section class="v131-match-notes">'+
              '<h3>Resultado final, cambios e incidencias</h3>'+
              '<p class="v131-result-line">Hora de inicio: ____ · Hora de término: ____ · Marcador local: ____ · Visitante: ____</p>'+
              '<div class="v131-notes-box" contenteditable="true" aria-label="Observaciones e incidencias"></div>'+
              '<div class="v131-signatures"><div>Árbitro</div><div>Delegado / capitán</div><div>Validación de la Liga</div></div>'+

            '</section>'+
          '</article>'+
        '</div>'+
      '</div>';

    if(scroll)host.scrollIntoView({behavior:'smooth',block:'start'});
    if(!silent)ownToast((homeRoster.length||awayRoster.length)?'Cédula generada con plantillas registradas':'Cédula generada; no se encontraron plantillas registradas para este cruce');
    return host.querySelector('[data-v131-print-sheet]');
  }
  async function printCedula(){
    let sheet=document.querySelector('[data-v131-print-sheet]');
    if(!sheet)sheet=await renderCedula(false);
    if(!sheet)return;

    /* V143: imprime una copia aislada, fuera del layout móvil de la app.
       Así Android no hereda el ancho angosto de #screen ni crea páginas vacías. */
    document.getElementById('v143-cedula-print-root')?.remove();
    const printRoot=document.createElement('div');
    printRoot.id='v143-cedula-print-root';
    printRoot.setAttribute('aria-hidden','true');

    const clone=sheet.cloneNode(true);
    clone.removeAttribute('data-v131-print-sheet');
    clone.setAttribute('data-v143-print-sheet','');
    clone.querySelectorAll('[contenteditable]').forEach(n=>n.removeAttribute('contenteditable'));
    printRoot.appendChild(clone);
    document.body.appendChild(printRoot);

    document.body.classList.add('v131-print-cedula','v143-print-cedula');

    /* Espera logos/fotos para que el PDF salga completo. */
    const imgs=[...clone.querySelectorAll('img')];
    await Promise.all(imgs.map(img=>{
      if(img.complete)return img.decode?.().catch(()=>{})||Promise.resolve();
      return new Promise(resolve=>{
        const done=()=>resolve();
        img.addEventListener('load',done,{once:true});
        img.addEventListener('error',done,{once:true});
        setTimeout(done,1200);
      });
    }));

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        window.print();
        setTimeout(cleanup,5000);
      });
    });
  }
  function cleanup(){
    document.body.classList.remove('v131-print-cedula','v143-print-cedula');
    document.getElementById('v143-cedula-print-root')?.remove();
  }
  window.addEventListener('afterprint',cleanup);

  document.addEventListener('click',function(e){
    if(route()!=='cedulaBuilder')return;
    const gen=e.target.closest?.('[data-v64-generate-cedula]');
    if(gen){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      renderCedula(true);
      return;
    }
    const print=e.target.closest?.('[data-v64-print-cedula]');
    if(print){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      printCedula();
    }
  },true);

  /* V630 — al tocar una cédula oficial, abre el generador restaurado
     y crea de inmediato la hoja con logos de Liga, categoría y equipos. */
  function autoRenderOfficialCedula(){
    if(route()!=='cedulaBuilder')return;
    const host=document.querySelector('[data-v64-cedula-preview]');
    if(!host||host.querySelector('[data-v131-print-sheet]'))return;
    localStorage.removeItem('v66-cedula-autogenerate');
    /* V640: la vista previa oficial vuelve a mostrarse siempre,
       aunque el usuario haya entrado directo al generador y no desde una fila. */
    renderCedula(false,true);
  }
  if(!window.__LJR_V630_CEDULA_AUTO__){
    window.__LJR_V630_CEDULA_AUTO__=true;
    window.addEventListener('hashchange',()=>setTimeout(autoRenderOfficialCedula,90));
    const screen=document.querySelector('#screen');
    if(screen)new MutationObserver(()=>setTimeout(autoRenderOfficialCedula,40)).observe(screen,{childList:true,subtree:true});
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(autoRenderOfficialCedula,120),{once:true});
    else setTimeout(autoRenderOfficialCedula,120);
  }

  let previewRefreshTimer=0;
  function refreshPreview(){
    clearTimeout(previewRefreshTimer);
    previewRefreshTimer=setTimeout(()=>{
      if(route()==='cedulaBuilder')renderCedula(false,true);
    },90);
  }
  document.addEventListener('input',function(e){
    if(route()!=='cedulaBuilder')return;
    if(e.target.matches?.('[data-v64-ced-date],[data-v64-ced-field],[data-v64-ced-ref]'))refreshPreview();
  },true);
  document.addEventListener('change',function(e){
    if(route()!=='cedulaBuilder')return;
    if(e.target.matches?.('[data-v64-ced-cat],[data-v64-ced-home],[data-v64-ced-away],[data-v64-ced-date],[data-v64-ced-field],[data-v64-ced-ref]'))refreshPreview();
  },true);
})();