// Liga Juventino V6.1 — safe runtime. No MutationObserver and no global prototype patches.
(function(){
  'use strict';
  const screen=()=>document.querySelector('#screen');
  const back=()=>document.querySelector('#backButton');
  const route=()=>location.hash.replace('#/','')||'home';
  const KEY='lj-store-v61';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
  const state=Object.assign({dataTab:'General',performanceFilter:'Todos',language:'Español',feedback:[],notif:{goals:true,kickoff:true,final:true,news:true,video:true,fantasy:true,predictor:true,transfers:true},inbox:[{id:'a',title:'Jornada 5 lista',body:'Consulta horarios y sedes.',read:false,go:'competition'},{id:'b',title:'Nuevo resumen',body:'Ya está disponible el video de la jornada.',read:false,go:'video'},{id:'c',title:'Fantasy',body:'Revisa tu 7 Ideal antes del cierre.',read:true,go:'fantasy'}]},read());
  const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const svg=(name)=>{const p={bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',news:'<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>',play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',star:'<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z"/>',bolt:'<path d="m13 2-9 12h7l-1 8 9-12h-7z"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/>',calendar:'<path d="M5 4v3M19 4v3M4 8h16v12H4zM8 12h2M14 12h2M8 16h2M14 16h2"/>',trophy:'<path d="M8 4h8v4c0 3-1.5 5-4 6-2.5-1-4-3-4-6zM8 6H4v2c0 2.2 1.3 4 3.5 4.5M16 6h4v2c0 2.2-1.3 4-3.5 4.5M12 14v4M8 21h8"/>',team:'<path d="M7 5 3 7l2 4 2-1v9h10v-9l2 1 2-4-4-2c-.7 1.4-2.3 2-5 2s-4.3-.6-5-2z"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',shield:'<path d="M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6z"/>',msg:'<path d="M4 4h16v12H8l-4 4z"/>',doc:'<path d="M6 3h9l3 3v15H6zM9 10h6M9 14h6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',history:'<path d="M4 12a8 8 0 1 0 3-6M4 4v6h6M12 8v5l3 2"/>'};return `<svg class="safe-svg" viewBox="0 0 24 24" aria-hidden="true">${p[name]||p.info}</svg>`};
  const crest=c=>v6Crest(c);
  /* V91 — Inicio ya no usa equipos/jugadores demo.
     Fallback inicial = datos oficiales vigentes; después se refresca desde
     Liga_Futbol/data/official-live.json sin inventar nombres, puntos o goles. */
  const V6_OFFICIAL_URL='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json';
  const V6_LOGO_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const V6_CAT_LABEL={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
  const V6_CODE_BY_NAME={
    'SAN JOSE FC':'SJO','JUVENTUS':'JVS','HERMANOS':'HER','LINCES':'LIN','NAPOLI':'NAP','FRANCO FC':'FRA',
    'HERRERAS FC':'HFC','ABEJAS':'ABE','LOBOS CDG':'LOB','TERRICOLAS':'TER','GALACTICOS':'GAC',
    'DYNAMO':'DYN','MANCHESTER':'MAN','LA ESPERANZA':'ESP','DEP. NOPALERO':'NOP','DEP. ZAPATA':'ZAP',
    'CELTICOS':'CEL','ATL. GALEANA':'GAL','PROMESAS FC':'PRO','TOROS DE CUENDA':'TCU','BOAVISTA':'BOA'
  };
  const V6_PRETTY_TEAM={
    'SAN JOSE FC':'San José FC','JUVENTUS':'Juventus','HERMANOS':'Hermanos','LINCES':'Linces','NAPOLI':'Napoli',
    'FRANCO FC':'Franco FC','HERRERAS FC':'Herreras FC','ABEJAS':'Abejas','LOBOS CDG':'Lobos CDG',
    'TERRICOLAS':'Terrícolas','GALACTICOS':'Galácticos','DYNAMO':'Dynamo','MANCHESTER':'Manchester',
    'LA ESPERANZA':'La Esperanza','DEP. NOPALERO':'Dep. Nopalero','DEP. ZAPATA':'Dep. Zapata',
    'CELTICOS':'Célticos','ATL. GALEANA':'Atlético Galeana','PROMESAS FC':'Promesas FC',
    'TOROS DE CUENDA':'Toros de Cuenda','BOAVISTA':'Boavista'
  };

  /* [código, nombre visible, puntos, PJ, DG, nombre oficial, GF] */
  const teams=[
    ['SJO','San José FC',12,4,10,'SAN JOSE FC',13],
    ['JVS','Juventus',9,4,14,'JUVENTUS',20],
    ['HER','Hermanos',7,3,4,'HERMANOS',8],
    ['LIN','Linces',6,3,3,'LINCES',10],
    ['NAP','Napoli',6,4,1,'NAPOLI',8],
    ['FRA','Franco FC',6,3,0,'FRANCO FC',3]
  ];

  /* [jugador, código, goles, asistencias(no publicadas), equipo oficial, categoría] */
  const scorers=[
    ['Hugo Armenta Buenavista','DYN',5,0,'DYNAMO','Veteranos 50+'],
    ['J. Carmen Subias Miranda','MAN',4,0,'MANCHESTER','Veteranos 50+'],
    ['TELESFORO FREYRE VALADEZ','NOP',4,0,'DEP. NOPALERO','Segunda Fuerza'],
    ['Jose Mendoza Pescador','ESP',3,0,'LA ESPERANZA','Veteranos 50+']
  ];

  const V6_LOGOS={
    SJO:V6_LOGO_BASE+'assets/official-logos/san-jose-fc.png',
    JVS:V6_LOGO_BASE+'assets/official-logos/juventus.png',
    HER:V6_LOGO_BASE+'assets/official-logos/hermanos.png',
    LIN:V6_LOGO_BASE+'assets/official-logos/linces.png',
    NAP:V6_LOGO_BASE+'assets/official-logos/napoli.png',
    FRA:V6_LOGO_BASE+'assets/official-logos/franco-fc.png',
    HFC:V6_LOGO_BASE+'assets/official-logos/herreras-fc.png',
    ABE:V6_LOGO_BASE+'assets/official-logos/abejas.png',
    LOB:V6_LOGO_BASE+'assets/official-logos/lobos-cdg.png',
    TER:V6_LOGO_BASE+'assets/official-logos/terricolas.png',
    DYN:V6_LOGO_BASE+'assets/official-logos/dynamo.png',
    MAN:V6_LOGO_BASE+'assets/official-logos/manchester.png',
    ESP:V6_LOGO_BASE+'assets/official-logos/la-esperanza.png',
    NOP:V6_LOGO_BASE+'assets/official-logos/dep-nopalero.png'
  };
  let v6OfficialDb=null;

  const v6PrettyTeam=name=>V6_PRETTY_TEAM[String(name||'').trim().toUpperCase()]||String(name||'').trim();
  const v6CodeFor=name=>{
    const key=String(name||'').trim().toUpperCase();
    return V6_CODE_BY_NAME[key]||key.split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3)||'EQ';
  };
  const v6TeamName=code=>{
    const t=teams.find(t=>t[0]===code);
    if(t)return t[1];
    const s=scorers.find(s=>s[1]===code);
    return s?.[4]?v6PrettyTeam(s[4]):code;
  };
  function v6Crest(code){
    const name=v6TeamName(code),src=V6_LOGOS[code]||'';
    return src
      ?`<span class="v6-crest v6-crest-image"><img src="${src}" alt="${esc(name)}" loading="lazy" decoding="async"></span>`
      :`<span class="v6-crest">${esc(code)}</span>`;
  }
  const scorerTeamMark=(code,officialName='')=>{
    const name=officialName?v6PrettyTeam(officialName):v6TeamName(code);
    const src=V6_LOGOS[code]||'';
    return src
      ?`<span class="v6-scorer-logo"><img src="${src}" alt="${esc(name)}" loading="lazy" decoding="async"></span>`
      :`<span class="v6-scorer-logo v6-scorer-logo-fallback">${esc(code)}</span>`;
  };
  function v6LogoPathFromDb(data,name){
    const key=Object.keys(data?.team_logos||{}).find(k=>String(k).trim().toUpperCase()===String(name||'').trim().toUpperCase());
    const v=key?data.team_logos[key]:null;
    const p=typeof v==='string'?v:(v?.local||'');
    if(!p)return '';
    return /^https?:/i.test(p)?p:V6_LOGO_BASE+p.replace(/^\.\//,'');
  }
  function v6ValidScorers(data,id){
    const c=data?.categories?.[String(id)],rs=c?.scorers?.[0]?.rows||[];
    return rs.filter(r=>Array.isArray(r)&&r.length>=4&&/^\d+$/.test(String(r[3]||''))&&r[1]&&r[2])
      .map(r=>({rank:Number(r[0])||999,player:String(r[1]).trim(),team:String(r[2]).trim(),goals:Number(r[3])||0,cat:String(id),category:c?.name||V6_CAT_LABEL[String(id)]||''}));
  }
  function v6RefreshArrays(data){
    const standings=data?.categories?.['3']?.standings?.[0]?.rows||[];
    const realTeams=standings.filter(r=>Array.isArray(r)&&r[1]).slice(0,6).map(r=>{
      const official=String(r[1]).trim(),code=v6CodeFor(official),logo=v6LogoPathFromDb(data,official);
      if(logo)V6_LOGOS[code]=logo;
      return [code,v6PrettyTeam(official),Number(r[9])||0,Number(r[2])||0,Number(String(r[8]||'0').replace('+',''))||0,official,Number(r[6])||0];
    });
    if(realTeams.length)teams.splice(0,teams.length,...realTeams);

    let realScorers=v6ValidScorers(data,'3');
    if(!realScorers.length){
      realScorers=['1','5','4','2'].flatMap(id=>v6ValidScorers(data,id))
        .sort((a,b)=>b.goals-a.goals||a.rank-b.rank||a.player.localeCompare(b.player,'es')).slice(0,4);
    }else realScorers=realScorers.sort((a,b)=>b.goals-a.goals||a.rank-b.rank).slice(0,4);

    if(realScorers.length){
      scorers.splice(0,scorers.length,...realScorers.map(s=>{
        const code=v6CodeFor(s.team),logo=v6LogoPathFromDb(data,s.team);
        if(logo)V6_LOGOS[code]=logo;
        return [s.player,code,s.goals,0,s.team,s.category];
      }));
    }
  }
  async function v6LoadOfficial(){
    try{
      const res=await fetch(V6_OFFICIAL_URL+'?v='+Date.now(),{cache:'no-store'});
      if(!res.ok)return;
      const data=await res.json();
      v6OfficialDb=data;
      v6RefreshArrays(data);
      if(route()==='home'){
        const old=document.querySelector('#safeHomeExtra');
        if(old)old.outerHTML=homeExtra();
      }
    }catch(_){}
  }
  const actionCard=(ico,title,sub,to)=>`<button class="v6-action-card" data-safe-route="${to}"><span class="v6-action-icon">${svg(ico)}</span><span><b>${title}</b><small>${sub}</small></span><span class="v6-arrow">›</span></button>`;
  function v6FeaturedScorer(){
    const s=scorers[0];
    if(!s)return '<div class="v6-week-player"><span class="v6-kicker">GOLEADORES</span><div class="v6-week-row"><div><h3>Sin goles oficiales publicados</h3><p>La Liga todavía no ha publicado una tabla de goleo.</p></div></div></div>';
    return '<div class="v6-week-player"><span class="v6-kicker">GOLEADOR OFICIAL DESTACADO</span><div class="v6-week-row">'+scorerTeamMark(s[1],s[4])+'<div><h3>'+esc(s[0])+'</h3><p>'+esc(v6PrettyTeam(s[4]))+' · '+esc(s[2])+' goles · '+esc(s[5]||'')+'</p></div></div><div class="v6-week-actions"><button class="btn outline" data-safe-route="scorers">Ver goleadores</button></div></div>';
  }
  function v6OfficialStatsCards(){
    const rows=v6OfficialDb?.categories?.['3']?.standings?.[0]?.rows||[];
    const src=rows.length?rows:teams.map(t=>['',t[5],t[3],'','','',t[6],'',t[4],t[2]]);
    if(!src.length)return '';
    const topGF=[...src].sort((a,b)=>(Number(b[6])||0)-(Number(a[6])||0))[0];
    const topDG=[...src].sort((a,b)=>(Number(String(b[8]||0).replace('+',''))||0)-(Number(String(a[8]||0).replace('+',''))||0))[0];
    const topPTS=[...src].sort((a,b)=>(Number(b[9])||0)-(Number(a[9])||0))[0];
    const card=(label,row,idx)=>'<div class="v6-stat-card"><small>'+label+'</small><b class="v6-big">'+esc(row?.[idx]??0)+'</b><p>'+esc(v6PrettyTeam(row?.[1]||''))+'</p><div class="v6-mini-bar"><i style="width:82%"></i></div></div>';
    return card('GOLES',topGF,6)+card('MEJOR DIFERENCIA',topDG,8)+card('PUNTOS',topPTS,9);
  }
  function v6PublishedScore(r){
    const a=String(r?.[3]??'').trim(),b=String(r?.[5]??'').trim();
    const valid=v=>/^\d+$/.test(v)||v==='-';
    return valid(a)&&valid(b)&&(/^\d+$/.test(a)||/^\d+$/.test(b));
  }
  function v6ScoreCell(v){
    const x=String(v??'').trim();
    return x==='-'?'0':(/^\d+$/.test(x)?x:'—');
  }
  function v6FixtureStamp(v){
    const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
    return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime():NaN;
  }
  function v6LeagueDataHomeCard(){
    const list=teams.slice(0,6);
    const logos=list.map(t=>'<button type="button" class="v6-league-team" data-safe-route="leagueData" aria-label="Abrir datos oficiales"><span>'+crest(t[0])+'</span><small>'+esc(t[1])+'</small></button>').join('');
    return '<section class="v6-section v6-league-data-home">'+
      '<div class="v6-section-head"><div><span class="eyebrow">FUENTE OFICIAL</span><h2>Datos de la Liga</h2></div><button class="link-button" data-safe-route="leagueData">Ver todo</button></div>'+
      '<button type="button" class="v6-league-data-card" data-safe-route="leagueData">'+
        '<span class="v6-league-data-icon">'+svg('chart')+'</span>'+
        '<span class="v6-league-data-copy"><small>DATOS OFICIALES</small><b>Equipos, tabla, jornadas y jugadores</b><p>Consulta únicamente la información publicada por la Liga.</p></span>'+
        '<span class="v6-league-data-arrow">›</span>'+
      '</button>'+
      '<div class="v6-league-team-strip">'+logos+'</div>'+
    '</section>';
  }
  function v6CalendarHtml(){
    const rs=v6OfficialDb?.categories?.['3']?.fixtures?.[0]?.rows||[];
    const now=Date.now();
    const entries=rs.filter(r=>Array.isArray(r)&&r[2]&&r[6]&&String(r[8]||'').trim())
      .map(r=>({r,ts:v6FixtureStamp(r[8])})).filter(x=>Number.isFinite(x.ts));
    const results=entries.filter(x=>v6PublishedScore(x.r)&&x.ts<=now).sort((a,b)=>b.ts-a.ts);
    const upcoming=entries.filter(x=>!v6PublishedScore(x.r)&&x.ts>=now-2*60*60*1000).sort((a,b)=>a.ts-b.ts);
    const chosen=[];
    if(results.length)chosen.push(results[0]);
    upcoming.slice(0,Math.max(0,3-chosen.length)).forEach(x=>chosen.push(x));
    if(chosen.length<3)results.slice(1).forEach(x=>{if(chosen.length<3)chosen.push(x)});

    const fallback=[
      {r:['','5','FRANCO FC','-','vs','-','HERRERAS FC','Romerillo','20/09/2026 08:00'],ts:v6FixtureStamp('20/09/2026 08:00')},
      {r:['','5','TERRICOLAS','-','vs','-','GALACTICOS','','20/09/2026 08:00'],ts:v6FixtureStamp('20/09/2026 08:00')},
      {r:['','5','LINCES','-','vs','-','JUVENTUS','Campo 3','20/09/2026 08:00'],ts:v6FixtureStamp('20/09/2026 08:00')}
    ];
    const rows=(chosen.length?chosen:fallback).slice(0,3);
    return rows.map((x,i)=>{
      const r=x.r;
      const m=String(r[8]||'').match(/(\d{1,2})\/(\d{1,2})\/\d{4}\s+(\d{1,2}:\d{2})/);
      const day=m?String(+m[1]):'—',month=m?['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'][Number(m[2])-1]:'',time=m?m[3]:'';
      const home=String(r[2]||'').trim(),away=String(r[6]||'').trim();
      const hc=v6CodeFor(home),ac=v6CodeFor(away);
      const hl=v6LogoPathFromDb(v6OfficialDb,home),al=v6LogoPathFromDb(v6OfficialDb,away);
      if(hl)V6_LOGOS[hc]=hl;if(al)V6_LOGOS[ac]=al;
      const played=v6PublishedScore(r),center=played?v6ScoreCell(r[3])+'–'+v6ScoreCell(r[5]):time;
      return '<div class="'+(i===0?'active ':'')+'v6-calendar-match '+(played?'is-result':'is-upcoming')+'">'+
        '<span class="v6-calendar-day">'+esc(day)+'</span><small class="v6-calendar-month">'+esc(month)+'</small>'+
        '<div class="v6-calendar-pair">'+
          '<span class="v6-calendar-team">'+v6Crest(hc)+'<em>'+esc(v6PrettyTeam(home))+'</em></span>'+
          '<strong class="v6-calendar-score">'+esc(center)+'</strong>'+
          '<span class="v6-calendar-team">'+v6Crest(ac)+'<em>'+esc(v6PrettyTeam(away))+'</em></span>'+
        '</div>'+
        '<b class="v6-calendar-status">'+(played?'RESULTADO OFICIAL':'HORARIO OFICIAL')+' · J'+esc(r[1]||'')+'</b>'+
      '</div>';
    }).join('');
  }
  function v6OfficialSummary(){
    const c=v6OfficialDb?.categories?.['3']||null;
    const standings=c?.standings?.[0]?.rows||[];
    const counts=c?.counts||c?.dashboard?.counts||{};
    const gf=standings.reduce((sum,r)=>sum+(Number(r?.[6])||0),0);
    return {
      teams:Number(counts.Equipos)||standings.length||0,
      played:Number(counts['Partidos Jugados'])||0,
      players:Number(counts.Jugadores)||0,
      gf,
      standings
    };
  }
  function v6OfficialPlayers(){
    const c=v6OfficialDb?.categories?.['3']||null;
    const out=[];
    for(const [team,names] of Object.entries(c?.rosters||{})){
      for(const name of (Array.isArray(names)?names:[])){
        if(name)out.push({name:String(name),team:String(team)});
      }
    }
    return out;
  }
  function ensureBell(){const top=document.querySelector('.topbar');if(!top)return;let b=document.querySelector('#safeBell');if(!b){b=document.createElement('button');b.id='safeBell';b.className='icon-button v5-bell';b.setAttribute('aria-label','Notificaciones');b.dataset.safeRoute='safe-notifications';const profile=top.querySelector('.profile-button');profile?top.insertBefore(b,profile):top.appendChild(b)}const unread=state.inbox.filter(x=>!x.read).length;const html=`${svg('bell')}${unread?`<span class="v5-badge">${unread}</span>`:''}`;if(b.innerHTML!==html)b.innerHTML=html}
  function homeExtra(){return `<div id="safeHomeExtra" class="v6-home-super">
    <section class="v6-section v6-quick"><div class="v6-section-head"><div><span class="eyebrow">TODO EN INICIO</span><h2>Explora Liga Juventino</h2></div><button class="v6-icon-btn" data-safe-route="safe-notifications" aria-label="Notificaciones">${svg('bell')}</button></div><div class="v6-action-grid">${actionCard('bolt','Performance Zone','Análisis y rendimiento','safe-performance')}${actionCard('chart','Datos','Datos oficiales de la Liga','leagueData')}${actionCard('calendar','Calendario','Fechas y resultados','v4-calendar')}${actionCard('star','Jugador de la Jornada','Vota y consulta candidatos','vote')}</div></section>
    <section class="v6-section"><div class="v6-section-head"><h2>Vídeos destacados</h2><button class="link-button" data-safe-route="video">Ver todo</button></div><div class="v6-video-list"><button class="v6-video-card" data-safe-route="video"><span class="v6-play">${svg('play')}</span><small>Técnica · 00:21</small><b>Precisión a balón parado</b></button><button class="v6-video-card" data-safe-route="video"><span class="v6-play">${svg('play')}</span><small>Ataque · 00:18</small><b>Definición rápida</b></button><button class="v6-video-card" data-safe-route="safe-performance"><span class="v6-play">${svg('play')}</span><small>Rendimiento · 00:26</small><b>Transición y presión</b></button></div></section>
    <section class="v6-section">${v6FeaturedScorer()}</section>
    <section class="v6-section"><div class="v6-section-head"><h2>Clasificación · Primera Fuerza</h2><button class="link-button" data-safe-route="competition">Ver completa</button></div><div class="v6-table-card"><div class="v6-table-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>${teams.map((t,i)=>`<button class="v6-table-row" data-safe-route="competition"><span>${i+1}</span><span>${crest(t[0])}<b>${t[1]}</b></span><span>${t[3]}</span><span>${t[4]>0?'+':''}${t[4]}</span><strong>${t[2]}</strong></button>`).join('')}</div></section>
    <section class="v6-section"><button class="v6-performance-card" data-safe-route="safe-performance"><span class="v6-performance-icon">${svg('bolt')}</span><span><small>ANÁLISIS DE LA JORNADA</small><b>Performance Zone</b><p>Rendimiento, tendencias y clips tácticos.</p></span><span>›</span></button></section>
    <section class="v6-section"><div class="v6-section-head"><h2>Estadísticas de equipo</h2><button class="link-button" data-safe-route="stats">Ver todo</button></div><div class="v6-stat-carousel">${v6OfficialStatsCards()}</div><div class="v6-demo-note">Datos oficiales de Primera Fuerza.</div></section>
    <section class="v6-section"><div class="v6-section-head"><h2>Máximos goleadores</h2><button class="link-button" data-safe-route="scorers">Ver ranking</button></div><div class="v6-scorers">${scorers.map((s,i)=>`<button data-safe-route="scorers"><span class="v6-rank">${i+1}</span>${scorerTeamMark(s[1],s[4])}<span class="v6-scorer-copy"><b>${s[0]}</b><small>${v6PrettyTeam(s[4])}${s[5]?' · '+s[5]:''}</small></span><strong>${s[2]}</strong></button>`).join('')}</div><div class="v6-demo-note">Solo goles oficialmente publicados. Primera Fuerza se mostrará aquí cuando tenga tabla de goleo publicada.</div></section>
    ${v6LeagueDataHomeCard()}
    <section class="v6-section"><div class="v6-section-head"><h2>Equipo de la Semana</h2><button class="link-button" data-safe-route="stats">Ver datos</button></div><button class="v6-teamweek" data-safe-route="stats"><span>${svg('team')}</span><div><b>XI oficial pendiente</b><p>Se mostrará cuando la Liga publique una selección oficial.</p></div><span>›</span></button></section>
    <section class="v6-section"><div class="v6-section-head"><h2>Calendario y resultados</h2><button class="link-button" data-safe-route="v4-calendar">Abrir calendario</button></div><div class="v6-calendar-card">${v6CalendarHtml()}</div></section>
    <section class="v6-section"><div class="v6-section-head"><h2>Más datos</h2></div><div class="v6-action-grid">${actionCard('chart','Estadísticas','General, equipos y jugadores','stats')}${actionCard('trophy','Rankings','Clasificación y líderes','rankings')}${actionCard('history','Historia','Temporadas y campeones','history')}${actionCard('chart','Datos oficiales','Equipos, jugadores y jornadas','leagueData')}</div></section>
  </div>`}
  function v20TransparentizeLeagueLogo(img){
    if(!img||img.dataset.v20PngReady==='1')return;
    img.dataset.v20PngReady='1';

    const original=img.getAttribute('src')||'';
    const run=()=>{
      try{
        const w=img.naturalWidth||0,h=img.naturalHeight||0;
        if(!w||!h)throw new Error('logo-size');
        const canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        const ctx=canvas.getContext('2d',{willReadFrequently:true});
        if(!ctx)throw new Error('canvas');
        ctx.drawImage(img,0,0,w,h);
        const data=ctx.getImageData(0,0,w,h),p=data.data;
        const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
        let head=0,tail=0;
        const isDarkBg=(idx)=>{
          const o=idx*4,r=p[o],g=p[o+1],b=p[o+2],a=p[o+3];
          if(a<8)return true;
          const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
          return mx<92&&(mx-mn)<55;
        };
        const push=(idx)=>{
          if(idx<0||idx>=w*h||seen[idx]||!isDarkBg(idx))return;
          seen[idx]=1;queue[tail++]=idx;
        };
        for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
        for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
        while(head<tail){
          const idx=queue[head++],x=idx%w,y=(idx/w)|0,o=idx*4;
          p[o+3]=0;
          if(x>0)push(idx-1);
          if(x<w-1)push(idx+1);
          if(y>0)push(idx-w);
          if(y<h-1)push(idx+w);
        }
        ctx.putImageData(data,0,0);
        img.removeAttribute('crossorigin');
        img.src=canvas.toDataURL('image/png');
        img.classList.add('v20-league-logo-png');
      }catch(_){
        img.classList.add('v20-league-logo-blend-fallback');
      }
    };

    if(!original.includes('liga-logo.webp'))return;
    img.crossOrigin='anonymous';
    if(img.complete&&img.naturalWidth){
      const reload=original+(original.includes('?')?'&':'?')+'transparent=1';
      img.addEventListener('load',run,{once:true});
      img.src=reload;
    }else{
      img.addEventListener('load',run,{once:true});
    }
  }

  function v20MakePerformanceLogosTransparent(root){
    if(!root)return;
    root.querySelectorAll('.v20-performance-brand>img,.v20-story-ring img,.v20-card-logo').forEach(v20TransparentizeLeagueLogo);
  }

  function performanceView(){
    const base='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
    const leagueLogo=base+'assets/liga-logo.webp';
    const hero='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485172215463936/2100485172215463937.png';
    const show='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485077397905408/2100485077397905409.png';
    const stories=[
      {label:'Partidos',logo:leagueLogo,route:'competition'},
      {label:'Datos oficiales',logo:leagueLogo,route:'leagueData'},
      {label:'Equipos',logo:leagueLogo,route:'teams'},
      {label:'Clasificación',logo:leagueLogo,route:'competition'},
      {label:'Goleadores',logo:leagueLogo,route:'scorers'}
    ];
    const storyHtml=stories.map(s=>`<button class="v20-story" type="button" data-safe-route="${s.route}"><span class="v20-story-ring"><img src="${s.logo}" crossorigin="anonymous" alt="" loading="lazy"></span><small>${s.label}</small></button>`).join('');
    return `<section class="v20-performance" aria-label="Performance Liga Municipal de Fútbol Juventino Rosas">
      <div class="v20-performance-hero">
        <img class="v20-performance-heroimg" src="${hero}" alt="Partido de la Liga Municipal de Fútbol Juventino Rosas" loading="eager" decoding="async">
        <div class="v20-performance-heroshade"></div>
        <div class="v20-performance-brand">
          <img src="${leagueLogo}" crossorigin="anonymous" alt="Liga Municipal de Fútbol Juventino Rosas">
          <h1>Liga Municipal de Fútbol<br>Juventino Rosas</h1>
          <p>GUANAJUATO</p>
        </div>
      </div>

      <div class="v20-stories" aria-label="Accesos de Performance">${storyHtml}</div>

      <div class="v20-performance-feed">
        <button class="v20-performance-card v20-card-america" type="button" data-safe-route="competition">
          <img src="${show}" alt="" loading="lazy">
          <span class="v20-card-shade"></span>
          <img class="v20-card-logo" src="${leagueLogo}" crossorigin="anonymous" alt="">
          <strong>Clasificación oficial<br>de Primera Fuerza</strong>
        </button>

        <button class="v20-performance-card" type="button" data-safe-route="competition">
          <img src="${hero}" alt="" loading="lazy">
          <span class="v20-card-shade"></span>
          <span class="v20-card-time">00:51</span>
          <span class="v20-card-play" aria-hidden="true">▶</span>
          <strong>Partidos y resultados<br>publicados por la Liga</strong>
        </button>

        <button class="v20-performance-card" type="button" data-safe-route="teams">
          <img src="./home-feature-reference.webp?v=20260918" alt="" loading="lazy">
          <span class="v20-card-shade"></span>
          <strong>Equipos y plantillas<br>registradas</strong>
        </button>

        <button class="v20-performance-card" type="button" data-safe-route="scorers">
          <img src="${show}" alt="" loading="lazy">
          <span class="v20-card-shade"></span>
          <span class="v20-card-time">00:50</span>
          <span class="v20-card-play" aria-hidden="true">▶</span>
          <strong>Goleadores<br>oficialmente publicados</strong>
        </button>

        <button class="v20-performance-card v20-card-more" type="button" data-safe-route="leagueData">
          <img src="./video-hero-reference.webp?v=20260918" alt="" loading="lazy">
          <span class="v20-card-shade"></span>
          <strong>Más datos oficiales de la Liga</strong>
        </button>
      </div>
    </section>`
  }
  function dataView(){
    const tab=state.dataTab;
    const summary=v6OfficialSummary();
    const standings=summary.standings;
    const playersNow=v6OfficialPlayers();
    const teamRows=standings.map((r,i)=>{
      const official=String(r?.[1]||'').trim(),code=v6CodeFor(official),logo=v6LogoPathFromDb(v6OfficialDb,official);
      if(logo)V6_LOGOS[code]=logo;
      return '<div class="safe-rank"><b>'+(i+1)+'</b>'+crest(code)+'<span>'+esc(v6PrettyTeam(official))+'</span><strong>'+esc(r?.[9]??0)+' pts</strong></div>';
    }).join('');
    const playerRows=playersNow.slice(0,40).map((p,i)=>{
      const code=v6CodeFor(p.team),logo=v6LogoPathFromDb(v6OfficialDb,p.team);
      if(logo)V6_LOGOS[code]=logo;
      return '<div class="safe-rank"><b>'+(i+1)+'</b>'+crest(code)+'<span>'+esc(p.name)+'</span><strong>'+esc(v6PrettyTeam(p.team))+'</strong></div>';
    }).join('');
    return '<div class="safe-brand"><span class="eyebrow">LIGA JUVENTINO</span><h1>Datos</h1><p>Datos públicos sincronizados con la fuente oficial.</p></div>'+
      '<div class="safe-tabs">'+['General','Equipos','Jugadores'].map(x=>'<button class="'+(tab===x?'active':'')+'" data-safe-data-tab="'+x+'">'+x+'</button>').join('')+'</div>'+
      (tab==='General'
        ?'<div class="safe-kpis"><div><b>'+esc(summary.gf)+'</b><small>GF registrados</small></div><div><b>'+esc(summary.played)+'</b><small>Partidos jugados</small></div><div><b>'+esc(summary.teams)+'</b><small>Equipos</small></div><div><b>'+esc(summary.players)+'</b><small>Jugadores registrados</small></div></div>'
        :'')+
      (tab==='Equipos'
        ?'<div class="v6-table-card">'+(teamRows||'<div class="safe-note">Sin tabla oficial publicada.</div>')+'</div>'
        :'')+
      (tab==='Jugadores'
        ?'<div class="v6-table-card">'+(playerRows||'<div class="safe-note">Sin plantillas públicas registradas.</div>')+'</div>'
        :'')+
      '<div class="safe-note">Primera Fuerza · sin estadísticas inventadas. Los goles de jugadores sólo se muestran cuando la Liga publica tabla de goleo.</div>';
  }
  function notificationsView(){return `<div class="safe-brand"><span class="eyebrow">ALERTAS</span><h1>Notificaciones</h1><p>Configura qué quieres recibir.</p></div><div class="safe-inbox">${state.inbox.map(n=>`<button class="${n.read?'read':''}" data-safe-inbox="${n.id}"><span>${svg('bell')}</span><div><b>${esc(n.title)}</b><small>${esc(n.body)}</small></div></button>`).join('')}</div><section class="section"><div class="section-head"><h2>Preferencias</h2></div>${[['goals','Goles'],['kickoff','Inicio del partido'],['final','Final del partido'],['news','Noticias'],['video','Nuevo vídeo'],['fantasy','Fantasy'],['predictor','Quiniela'],['transfers','Fichajes']].map(([k,l])=>`<label class="safe-toggle"><span>${l}</span><input type="checkbox" data-safe-notif="${k}" ${state.notif[k]?'checked':''}></label>`).join('')}</section>`}
  function simpleView(title,iconName,body){return `<div class="safe-brand"><span>${svg(iconName)}</span><h1>${title}</h1><p>${body}</p></div><button class="btn outline full" data-safe-route="profile">Volver a Perfil</button>`}
  const customViews={'safe-performance':performanceView,'safe-data':dataView,'safe-notifications':notificationsView,'safe-language':()=>simpleView('Idioma','globe',`Idioma preferido: ${state.language}. La app está preparada para español y futuras traducciones.`),'safe-feedback':()=>simpleView('Ayúdanos a mejorar','msg','Puedes reportar errores, sugerencias o datos incorrectos desde esta sección.'),'safe-privacy':()=>simpleView('Privacidad','shield','Las preferencias y datos demo se guardan localmente en este dispositivo hasta conectar el backend oficial.'),'safe-terms':()=>simpleView('Términos y condiciones','doc','Consulta aquí las reglas de uso de Liga Juventino.'),'safe-about':()=>simpleView('Sobre la competición','info','Torneo Municipal Liga Juventino: partidos, clasificación, estadísticas, Fantasy, juegos y contenido.')};
  function injectMore(){const root=screen();if(!root||route()!=='more'||root.querySelector('#safeMore'))return;const box=document.createElement('div');box.id='safeMore';box.className='menu-group';box.innerHTML=`<h3>EXPERIENCIA Y DATOS</h3><button class="menu-row" data-safe-route="safe-performance"><span>Performance Zone<small>Análisis y rendimiento</small></span><span>›</span></button><button class="menu-row" data-safe-route="leagueData"><span>Datos de la Liga<small>Equipos, tabla y jugadores oficiales</small></span><span>›</span></button><button class="menu-row" data-safe-route="safe-notifications"><span>Notificaciones<small>Partidos, juegos y noticias</small></span><span>›</span></button><button class="menu-row" data-safe-route="safe-about"><span>Sobre la competición</span><span>›</span></button>`;root.appendChild(box)}
  function injectProfile(){const root=screen();if(!root||route()!=='profile'||root.querySelector('#safeProfile'))return;const box=document.createElement('div');box.id='safeProfile';box.className='menu-group';box.innerHTML=`<h3>CONFIGURACIÓN</h3><button class="menu-row" data-safe-route="safe-language"><span>Idioma preferido<small>${state.language}</small></span><span>›</span></button><button class="menu-row" data-safe-route="safe-feedback"><span>Ayúdanos a mejorar</span><span>›</span></button><button class="menu-row" data-safe-route="safe-privacy"><span>Privacidad</span><span>›</span></button><button class="menu-row" data-safe-route="safe-terms"><span>Términos y condiciones</span><span>›</span></button>`;root.appendChild(box)}
  function renderCustom(){const r=route();if(!customViews[r])return false;const root=screen();if(!root)return false;root.innerHTML=customViews[r]();if(r==='safe-performance')v20MakePerformanceLogosTransparent(root);back()?.classList.remove('is-hidden');document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='more'));window.scrollTo(0,0);return true}
  function enhance(){try{ensureBell();if(renderCustom())return;const root=screen();if(!root)return;if(route()==='home'&&!root.querySelector('#safeHomeExtra'))root.insertAdjacentHTML('beforeend',homeExtra());if(route()==='more')injectMore();if(route()==='profile')injectProfile()}catch(err){console.error('Liga Juventino safe enhancement error',err)}}
  function openWeek(){const modal=document.createElement('div');modal.className='modal';modal.innerHTML=`<div class="video-modal"><button class="modal-close">×</button><span class="eyebrow">EQUIPO DE LA SEMANA</span><h2>XI oficial pendiente</h2><p class="muted">La Liga todavía no ha publicado una selección oficial de la jornada. No se mostrarán jugadores inventados.</p><button class="btn outline full" data-safe-close>Cerrar</button></div>`;document.body.appendChild(modal);modal.querySelector('.modal-close').onclick=()=>modal.remove();modal.querySelector('[data-safe-close]').onclick=()=>modal.remove()}
  document.addEventListener('click',e=>{const sr=e.target.closest('[data-safe-route]');if(sr){e.preventDefault();location.hash='#/'+sr.dataset.safeRoute;setTimeout(enhance,0);return}const base=e.target.closest('[data-route]');if(base)setTimeout(enhance,0);const act=e.target.closest('[data-safe-action]');if(act?.dataset.safeAction==='week-team'){e.preventDefault();openWeek()}const f=e.target.closest('[data-safe-filter]');if(f){state.performanceFilter=f.dataset.safeFilter;save();renderCustom()}const dt=e.target.closest('[data-safe-data-tab]');if(dt){state.dataTab=dt.dataset.safeDataTab;save();renderCustom()}const inbox=e.target.closest('[data-safe-inbox]');if(inbox){const n=state.inbox.find(x=>x.id===inbox.dataset.safeInbox);if(n){n.read=true;save();ensureBell();location.hash='#/'+n.go}}},true);
  document.addEventListener('change',e=>{if(e.target.matches('[data-safe-notif]')){state.notif[e.target.dataset.safeNotif]=e.target.checked;save()}},true);
  window.addEventListener('hashchange',()=>setTimeout(enhance,0));
  // Limited startup retries handle module timing without observing DOM mutations forever.
  let tries=0;const timer=setInterval(()=>{tries++;enhance();if(screen()?.children.length||tries>=12)clearInterval(timer)},100);
  setTimeout(enhance,0);
  v6LoadOfficial();
  setInterval(v6LoadOfficial,60000);
})();