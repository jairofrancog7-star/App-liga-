/* V131 — Cédula arbitral propia, logos locales y PDF A4 en una sola hoja. */
(function(){
  'use strict';

  const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  /* V1004 — Escudo oficial sin rectángulo negro al imprimir. */
  const LEAGUE_LOGO='./assets/liga-logo.webp';
  const PRINT_LOGO_FALLBACK="data:image/png;base64,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";
  let printLogoPromise=null;
  function printableLeagueLogo(){
    if(printLogoPromise)return printLogoPromise;
    printLogoPromise=new Promise(resolve=>{
      let done=false;
      const finish=logo=>{if(done)return;done=true;resolve(logo||PRINT_LOGO_FALLBACK)};
      const img=new Image();
      img.crossOrigin='anonymous';
      img.onload=()=>{
        try{
          const w=img.naturalWidth,h=img.naturalHeight;
          if(!w||!h)throw new Error('No logo pixels');
          const canvas=document.createElement('canvas');
          canvas.width=w;canvas.height=h;
          const ctx=canvas.getContext('2d',{willReadFrequently:true});
          if(!ctx)throw new Error('Canvas unavailable');
          ctx.drawImage(img,0,0,w,h);
          const data=ctx.getImageData(0,0,w,h),p=data.data;
          const size=w*h,seen=new Uint8Array(size),queue=new Int32Array(size);
          let head=0,tail=0;
          const isBackdrop=i=>{
            const k=i*4,r=p[k],g=p[k+1],b=p[k+2],a=p[k+3];
            return a<8||(Math.max(r,g,b)<92&&(Math.max(r,g,b)-Math.min(r,g,b))<55);
          };
          const add=i=>{if(i<0||i>=size||seen[i]||!isBackdrop(i))return;seen[i]=1;queue[tail++]=i};
          for(let x=0;x<w;x++){add(x);add((h-1)*w+x)}
          for(let y=0;y<h;y++){add(y*w);add(y*w+w-1)}
          while(head<tail){
            const i=queue[head++],x=i%w,y=(i/w)|0;
            p[i*4+3]=0;
            if(x>0)add(i-1);
            if(x<w-1)add(i+1);
            if(y>0)add(i-w);
            if(y<h-1)add(i+w);
          }
          if(tail===0)throw new Error('No background detected');
          ctx.putImageData(data,0,0);
          finish(canvas.toDataURL('image/png'));
        }catch(_){finish(PRINT_LOGO_FALLBACK)}
      };
      img.onerror=()=>finish(PRINT_LOGO_FALLBACK);
      img.src=LEAGUE_LOGO+'?v=20261009-v1004-transparent-print';
      setTimeout(()=>finish(PRINT_LOGO_FALLBACK),3500);
    });
    return printLogoPromise;
  }
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

    const [db,leaguePrintLogo]=await Promise.all([getDb(),printableLeagueLogo()]);
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
              '<div class="v131-head-logo v1004-league-logo"><img src="'+esc(leaguePrintLogo)+'" alt="Escudo Liga Municipal de Fútbol Juventino Rosas sin fondo" loading="eager" decoding="sync"></div>'+
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