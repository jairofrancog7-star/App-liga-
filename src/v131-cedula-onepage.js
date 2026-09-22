/* V131 — Cédula arbitral propia, logos locales y PDF A4 en una sola hoja. */
(function(){
  'use strict';

  const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE_LOGO=ROOT+'assets/liga-logo.webp';
  const LOCAL_DATA='./public/data/official-live.json?v=20260921-cedula-onepage-v131';
  const CAT_LOGOS={
    'primera fuerza':ROOT+'assets/branding/primera-fuerza-hd.png',
    'intermedia':ROOT+'assets/categories/intermedia.webp',
    'segunda fuerza':ROOT+'assets/categories/segunda-fuerza.webp',
    'veteranos 35+':ROOT+'assets/categories/veteranos-35-user.png',
    'veteranos 50+':ROOT+'assets/categories/veteranos-50.webp'
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
    try{
      const shared=window.LJR_TEAM_LOGOS?.get?.(name)||'';
      if(/raw\.githubusercontent\.com\/jairofrancog7-star\/Liga_Futbol|res\.cloudinary\.com\/rdk7ndhb/i.test(shared))return shared;
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
  async function renderCedula(scroll){
    const host=document.querySelector('[data-v64-cedula-preview]');
    if(!host)return null;

    host.innerHTML='<div class="v131-cedula-stage"><div class="v131-stage-bar"><b>Preparando cédula arbitral…</b><span>DATOS DE LA LIGA</span></div></div>';

    const db=await getDb();
    const cat=q('[data-v64-ced-cat]')||'Primera Fuerza';
    const home=q('[data-v64-ced-home]')||'Local';
    const away=q('[data-v64-ced-away]')||'Visitante';
    const fixture=fixtureFor(db,cat,home,away);
    const dateRaw=q('[data-v64-ced-date]')||fixture?.[8]||'';
    const field=q('[data-v64-ced-field]')||fixture?.[7]||'Por confirmar';
    const referee=q('[data-v64-ced-ref]')||'Por asignar';
    const jornada=fixture?.[1]?('Jornada '+fixture[1]):'Por confirmar';
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
              '<div class="v131-head-logo"><img src="'+LEAGUE_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas" loading="eager"></div>'+
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
              '<div class="v131-scoreline"><span>'+esc(home)+'</span><span class="v131-score-box"></span><b>–</b><span class="v131-score-box"></span><span>'+esc(away)+'</span></div>'+
              '<div class="v131-observations">Observaciones / incidencias<i></i><i></i></div>'+
              '<div class="v131-signatures"><div>Delegado local</div><div>Delegado visitante</div><div>Árbitro</div><div>Firma / sello de la Liga</div></div>'+
              '<p class="v131-sheet-note">Liga Municipal de Fútbol Juventino Rosas A.C. · Cédula generada dentro de la aplicación. La validación oficial corresponde a la Liga.</p>'+
            '</section>'+
          '</article>'+
        '</div>'+
      '</div>';

    if(scroll)host.scrollIntoView({behavior:'smooth',block:'start'});
    ownToast((homeRoster.length||awayRoster.length)?'Cédula generada con plantillas registradas':'Cédula generada; no se encontraron plantillas registradas para este cruce');
    return host.querySelector('[data-v131-print-sheet]');
  }
  async function printCedula(){
    let sheet=document.querySelector('[data-v131-print-sheet]');
    if(!sheet)sheet=await renderCedula(false);
    if(!sheet)return;
    document.body.classList.add('v131-print-cedula');
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        window.print();
        setTimeout(()=>document.body.classList.remove('v131-print-cedula'),5000);
      });
    });
  }
  function cleanup(){document.body.classList.remove('v131-print-cedula')}
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

  document.addEventListener('change',function(e){
    if(route()!=='cedulaBuilder'||!document.querySelector('[data-v131-print-sheet]'))return;
    if(e.target.matches?.('[data-v64-ced-cat],[data-v64-ced-home],[data-v64-ced-away],[data-v64-ced-date],[data-v64-ced-field],[data-v64-ced-ref]')){
      setTimeout(()=>renderCedula(false),60);
    }
  },true);
})();