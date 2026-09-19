/* PARTS27 — Teams / Team detail rebuilt from the two user Drive references. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE_LOGO=BASE+'assets/liga-logo.webp';

  const V27_TEAMS=[
    {id:'JUV',name:'Juventino',short:'Juventino',logo:'',abbr:'JUV'},
    {id:'PRO',name:'Promesas FC',short:'Promesas FC',logo:'assets/official-logos/promesas-fc.png'},
    {id:'HUE',name:'La Huerta',short:'La Huerta',logo:'assets/official-logos/la-huerta.png'},
    {id:'FRA',name:'Franco FC',short:'Franco FC',logo:'assets/official-logos/franco-fc.png'},
    {id:'LOB',name:'Lobos CDG',short:'Lobos CDG',logo:'assets/official-logos/lobos-cdg.png'},
    {id:'CUE',name:'Cuenda',short:'Cuenda',logo:'assets/official-logos/toros-de-cuenda.png'},
    {id:'POZ',name:'Pozos FC',short:'Pozos FC',logo:'assets/teams/pozos-fc.webp'},
    {id:'STC',name:'Atlético Santa Cruz',short:'Santa Cruz',logo:'assets/teams/atletico-santa-cruz.webp'},
    {id:'ROS',name:'Deportivo Rosas',short:'Dep. Rosas',logo:'',abbr:'ROS'},
    {id:'GAL',name:'Atlético Galeana',short:'Atl. Galeana',logo:'assets/official-logos/galeana.png'},
    {id:'RIN',name:'Rincón de Centeno',short:'Rincón C.',logo:'',abbr:'RIN'},
    {id:'AME',name:'América Veteranos',short:'América Vet.',logo:'assets/branding/america-veteranos-35-user.png'},
    {id:'TAV',name:'Franco Tavera',short:'Franco Tavera',logo:'assets/teams/franco-tavera-jr-veteranos.webp'},
    {id:'SJO',name:'San José FC',short:'San José FC',logo:'assets/official-logos/san-jose-fc.png'},
    {id:'SAN',name:'Atlético Santiago',short:'Atl. Santiago',logo:'assets/teams/atletico-santiago.webp'},
    {id:'LJR',name:'Lobos JR',short:'Lobos JR',logo:'',abbr:'LJR'},
    {id:'HER',name:'Hermanos',short:'Hermanos',logo:'assets/teams/club-deportivo-hermanos.webp'},
    {id:'LIN',name:'Linces',short:'Linces',logo:'assets/teams/linces.webp'},
    {id:'TER',name:'Terrícolas',short:'Terrícolas',logo:'assets/teams/terricolas-fc.webp'},
    {id:'GAC',name:'Galácticos',short:'Galácticos',logo:'assets/teams/galacticos-pozos.webp'},
    {id:'HFC',name:'Herreras FC',short:'Herreras FC',logo:'assets/teams/herrera-fc.webp'},
    {id:'BOA',name:'Boavista',short:'Boavista',logo:'assets/teams/boavista-fc.webp'},
    {id:'PSV',name:'PSV',short:'PSV',logo:'assets/teams/psv.webp'},
    {id:'ESP',name:'La Esperanza',short:'La Esperanza',logo:'assets/teams/la-esperanza-fc.webp'},
    {id:'CGS',name:'C. de Gasca',short:'C. de Gasca',logo:'assets/teams/deportivo-cg.webp'},
    {id:'SJL',name:'San Julián',short:'San Julián',logo:'assets/teams/san-julian-fc.webp'},
    {id:'NOP',name:'Dep. Nopalero',short:'Dep. Nopalero',logo:'assets/teams/deportivo-nopalero.webp'},
    {id:'TVF',name:'Tavera FC',short:'Tavera FC',logo:'assets/teams/tavera-fc.webp'},
    {id:'JUVS',name:'Juventus',short:'Juventus',logo:'assets/official-logos/juventus.png'},
    {id:'HUR',name:'Huracán',short:'Huracán',logo:'',abbr:'HUR'},
    {id:'DYN',name:'Dynamo',short:'Dynamo',logo:'assets/official-logos/dynamo.png'},
    {id:'BOC',name:'Boca Jrs',short:'Boca Jrs',logo:'',abbr:'BOC'},
    {id:'MAN',name:'Manchester',short:'Manchester',logo:'assets/official-logos/manchester.png'},
    {id:'NAP',name:'Napoli',short:'Napoli',logo:'assets/official-logos/napoli.png'},
    {id:'ABE',name:'Abejas',short:'Abejas',logo:'assets/official-logos/abejas.png'},
    {id:'CAN',name:'La Canchita Deportes',short:'La Canchita',logo:'assets/official-logos/la-canchita-deportes.png'},
    {id:'ALD',name:'Aldama FC',short:'Aldama FC',logo:'assets/official-logos/aldama-fc.png'},
    {id:'MAL',name:'Malvinas',short:'Malvinas',logo:'assets/official-logos/malvinas.png'},
    {id:'CAP',name:'Capibaras',short:'Capibaras',logo:'assets/official-logos/capibaras.png'},
    {id:'CUA',name:'La Cuadrilla',short:'La Cuadrilla',logo:'assets/official-logos/la-cuadrilla.png'},
    {id:'MAZ',name:'Mazacotes FC',short:'Mazacotes FC',logo:'assets/official-logos/mazacotes-fc.png'},
    {id:'MAR',name:'Dep. Maravillas',short:'Dep. Maravillas',logo:'assets/official-logos/dep-maravillas.png'},
    {id:'OSA',name:'Osasuna',short:'Osasuna',logo:'assets/official-logos/osasuna.png'},
    {id:'SAJ',name:'San Antonio Jrs',short:'San Antonio Jrs',logo:'assets/official-logos/san-antonio-jrs.png'},
    {id:'POP',name:'Populares',short:'Populares',logo:'assets/official-logos/populares.png'},
    {id:'PAC',name:'Pachangas FC',short:'Pachangas FC',logo:'assets/official-logos/pachangas-fc.png'},
    {id:'SJU',name:'San Juan FC',short:'San Juan FC',logo:'assets/official-logos/san-juan-fc.png'},
    {id:'TAP',name:'Tapatío',short:'Tapatío',logo:'assets/official-logos/tapatio.png'},
    {id:'LAL',name:'Dep. La Luz',short:'Dep. La Luz',logo:'assets/official-logos/dep-la-luz.png'},
    {id:'BAR',name:'Barza',short:'Barza',logo:'assets/official-logos/barza.png'},
    {id:'SJJ',name:'San José Jrs',short:'San José Jrs',logo:'assets/official-logos/san-jose-jrs.png'},
    {id:'SAF',name:'San Antonio FC',short:'San Antonio FC',logo:'assets/official-logos/san-antonio-fc.png'},
    {id:'CEL',name:'Célticos FC',short:'Célticos FC',logo:'assets/official-logos/celticos.png'},
    {id:'ZAP',name:'Dep. Zapata',short:'Dep. Zapata',logo:'assets/official-logos/dep-zapata.png'}
  ];

  const FIRST_GRID=V27_TEAMS.slice(0,16);
  const ELIMINATED=V27_TEAMS.slice(16);
  const playerNames=['Luis Ramírez','Carlos Tavera','Miguel Cuenda'];

  let query='';
  let detailTab='summary';

  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function team(id){return V27_TEAMS.find(function(t){return t.id===id})||V27_TEAMS.find(function(t){return t.id==='STC'})}
  function selected(){return team(localStorage.getItem('v27-selected-team')||'STC')}
  function saveSelected(id){localStorage.setItem('v27-selected-team',id)}
  function store(){
    try{return JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{}}
    catch(e){return {}}
  }
  function saveStore(s){localStorage.setItem('lj-store-v3',JSON.stringify(s))}
  function followedIds(){const a=store().followed;return Array.isArray(a)?a:[]}
  function isFollowed(id){return followedIds().indexOf(id)!==-1}
  function toggleFollow(id){
    const s=store();
    const a=Array.isArray(s.followed)?s.followed.slice():[];
    const i=a.indexOf(id);
    if(i>=0)a.splice(i,1);else a.push(id);
    s.followed=a;
    saveStore(s);
  }
  function logo(t,extra){
    const cls='v27-logo'+(extra?' '+extra:'');
    if(t.logo){
      return '<span class="'+cls+'"><img src="'+BASE+t.logo+'" alt="'+esc(t.name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v27-fallback" style="display:none">'+esc(t.abbr||t.id)+'</span></span>';
    }
    return '<span class="'+cls+'"><span class="v27-fallback">'+esc(t.abbr||t.id)+'</span></span>';
  }
  function tile(t,followedOnly){
    return '<button type="button" class="v27-team-tile'+(followedOnly?' followed-only':'')+'" data-v27-team="'+t.id+'">'+logo(t)+'<span>'+esc(t.short||t.name)+'</span></button>';
  }
  function backIcon(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
  function searchIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 5.1 5.1"/></svg>'}
  function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="m8.2 10.9 7.5-4.5M8.2 13.1l7.5 4.5"/></svg>'}
  function toast(msg){
    const old=document.querySelector('.v27-toast');if(old)old.remove();
    const n=document.createElement('div');n.className='v27-toast';n.textContent=msg;document.body.appendChild(n);
    setTimeout(function(){n.remove()},1700);
  }

  function navReferenceMode(on){
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const labels=[
      ['home','Inicio'],['competition','Competición'],['video','Video'],['fantasy','Fantasy'],['more','Más']
    ];
    labels.forEach(function(row){
      const b=nav.querySelector('[data-route="'+row[0]+'"] small');
      if(b)b.textContent=on?row[1]:row[1].toUpperCase();
    });
    nav.querySelectorAll('.nav-item').forEach(function(n){
      n.classList.toggle('active',on?n.dataset.route==='more':n.dataset.route===route());
    });
  }

  function teamsMarkup(){
    const q=query.trim().toLocaleLowerCase('es');
    const list=FIRST_GRID.filter(function(t){return !q||t.name.toLocaleLowerCase('es').includes(q)||t.short.toLocaleLowerCase('es').includes(q)});
    const followed=followedIds();
    let followedTeams=V27_TEAMS.filter(function(t){return followed.indexOf(t.id)!==-1});
    if(!followedTeams.length)followedTeams=[team('PRO')];
    return '<section class="v27-teams-page" data-v27-reference="teams">'+
      '<header class="v27-teams-head">'+
        '<button class="v27-back" type="button" data-v27-back aria-label="Volver">'+backIcon()+'</button>'+
        '<h1>Equipos</h1>'+
        '<label class="v27-search">'+searchIcon()+'<input id="v27TeamSearch" type="search" autocomplete="off" placeholder="Buscar equipos" value="'+esc(query)+'"></label>'+
      '</header>'+
      '<section class="v27-section"><h2>Siguiendo</h2><div class="v27-followed-row">'+followedTeams.slice(0,4).map(function(t){return tile(t,true)}).join('')+'</div></section>'+
      '<section class="v27-section"><h2>Equipos en la competición</h2><div class="v27-grid">'+(list.length?list.map(function(t){return tile(t,false)}).join(''):'<div class="v27-empty-grid">No se encontraron equipos.</div>')+'</div></section>'+
      '<section class="v27-section v27-eliminated"><h2>Más equipos de la Liga</h2><div class="v27-grid">'+ELIMINATED.map(function(t){return tile(t,false)}).join('')+'</div></section>'+
    '</section>';
  }

  function teamStrip(active){
    const order=[active.id,'PRO','GAL','HUE','STC','POZ','FRA','LOB'];
    const seen={};
    return order.map(function(id){const t=team(id);if(seen[t.id])return '';seen[t.id]=1;return '<button class="v27-club-chip" type="button" data-v27-team="'+t.id+'">'+logo(t)+'<small>'+esc(t.short)+'</small></button>'}).join('');
  }
  function detailMarkup(){
    const t=selected();
    const following=isFollowed(t.id);
    return '<section class="v27-team-detail" data-v27-reference="teamDetail">'+
      '<div class="v27-team-hero">'+
        '<button class="v27-back" type="button" data-v27-back aria-label="Volver">'+backIcon()+'</button>'+
        '<div class="v27-hero-logos">'+logo(t)+'<span class="v27-league-badge"><img src="'+LEAGUE_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas"></span></div>'+
        '<div class="v27-team-title"><h1>'+esc(t.name)+'</h1><p>Juventino Rosas, Guanajuato</p></div>'+
        '<div class="v27-team-actions">'+
          '<button class="v27-action primary'+(following?' active':'')+'" type="button" data-v27-follow="'+t.id+'">'+(following?'Siguiendo':'Seguir')+'</button>'+
          '<button class="v27-action" type="button" data-v27-compare>Comparar</button>'+
          '<button class="v27-action share" type="button" data-v27-share aria-label="Compartir">'+shareIcon()+'</button>'+
        '</div>'+
        '<nav class="v27-tabs" aria-label="Secciones del equipo">'+
          '<button class="v27-tab '+(detailTab==='summary'?'active':'')+'" data-v27-tab="summary">Resumen</button>'+
          '<button class="v27-tab '+(detailTab==='matches'?'active':'')+'" data-v27-tab="matches">Partidos</button>'+
          '<button class="v27-tab '+(detailTab==='standings'?'active':'')+'" data-v27-tab="standings">Clasificación</button>'+
          '<button class="v27-tab '+(detailTab==='squad'?'active':'')+'" data-v27-tab="squad">Plantilla</button>'+
        '</nav>'+
      '</div>'+
      '<div class="v27-detail-body">'+
        '<div class="v27-club-strip">'+teamStrip(t)+'</div>'+
        '<section class="v27-content-block">'+
          '<div class="v27-block-head"><h2>Próximo partido</h2><button class="v27-link" type="button" data-v27-competition>Ver todo</button></div>'+
          '<div class="v27-match-card">'+
            '<div class="v27-match-top">Jornada de Liga · Próximo encuentro</div>'+
            '<div class="v27-players">'+playerNames.map(function(n,i){return '<div class="v27-player"><div class="v27-player-avatar"></div><b>'+esc(n)+'</b><small>'+(i===0?'POR':i===1?'MED':'DEL')+'</small></div>'}).join('')+'</div>'+
          '</div>'+
        '</section>'+
        '<section class="v27-panel">'+
          '<div class="v27-panel-title"><span>Estado de forma</span><i class="v27-chevron"></i></div>'+
          '<div class="v27-form"><i class="w">V</i><i class="d">D</i><i class="d">D</i><i class="e">E</i><i class="w current">V</i></div>'+
        '</section>'+
        '<section class="v27-panel">'+
          '<div class="v27-panel-title"><span>Datos clave</span><i class="v27-chevron"></i></div>'+
          '<div class="v27-key-grid">'+
            '<div class="v27-ring"><div><b>1</b><span>partido<br>jugado</span></div></div>'+
            '<div class="v27-record"><div><i></i><span>Ganados</span><b>0</b></div><div><i></i><span>Empatados</span><b>0</b></div><div><i></i><span>Perdidos</span><b>1</b></div></div>'+
          '</div>'+
          '<div class="v27-stats">'+
            '<div class="v27-stat"><strong>1</strong><span>Goles</span><small>1.0 por partido</small></div>'+
            '<div class="v27-stat"><strong>6</strong><span>Goles encajados</span><small>6.0 por partido</small></div>'+
            '<div class="v27-stat"><strong>34%</strong><span>Posesión</span></div>'+
            '<div class="v27-stat"><strong>77%</strong><span>Precisión de pase</span></div>'+
            '<div class="v27-stat"><strong>30</strong><span>Balones recuperados</span></div>'+
            '<div class="v27-stat"><strong>2</strong><span>Paradas</span></div>'+
            '<div class="v27-stat"><strong>0</strong><span>Penaltis cometidos</span></div>'+
            '<div class="v27-stat"><strong>8</strong><span>Faltas cometidas</span></div>'+
            '<div class="v27-stat"><strong>113</strong><span>Distancia recorrida</span><small>km</small></div>'+
            '<div class="v27-stat"><strong><i class="v27-card-dot"></i>1</strong><span>Tarjetas amarillas</span></div>'+
            '<div class="v27-stat"><strong><i class="v27-card-dot red"></i>0</strong><span>Tarjetas rojas</span></div>'+
          '</div>'+
        '</section>'+
        '<section class="v27-panel">'+
          '<div class="v27-panel-title"><span>Goleador</span><i class="v27-chevron"></i></div>'+
          '<div class="v27-scorer"><span class="v27-scorer-avatar">9</span><div><b>José Pozos</b><small>Delantero</small></div><strong>1</strong></div>'+
        '</section>'+
      '</div>'+
    '</section>';
  }

  function render(){
    const r=route();
    const active=r==='teams'||r==='teamDetail';
    document.body.classList.toggle('v27-teams-active',active);
    navReferenceMode(active);
    if(!active)return;
    const screen=document.querySelector('#screen');
    if(!screen)return;
    screen.innerHTML=r==='teams'?teamsMarkup():detailMarkup();
    bind();
    window.scrollTo(0,0);
  }

  function bind(){
    document.querySelectorAll('[data-v27-back]').forEach(function(b){
      b.onclick=function(){location.hash=route()==='teamDetail'?'#/teams':'#/more'};
    });
    document.querySelectorAll('[data-v27-team]').forEach(function(b){
      b.onclick=function(){saveSelected(b.dataset.v27Team);detailTab='summary';location.hash='#/teamDetail'};
    });
    const search=document.querySelector('#v27TeamSearch');
    if(search){
      search.oninput=function(){
        query=search.value;
        const s=document.querySelector('#screen');
        if(s){s.innerHTML=teamsMarkup();bind();const n=document.querySelector('#v27TeamSearch');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}}
      };
    }
    document.querySelectorAll('[data-v27-tab]').forEach(function(b){
      b.onclick=function(){detailTab=b.dataset.v27Tab;render();toast(b.textContent+' · diseño listo')};
    });
    document.querySelectorAll('[data-v27-follow]').forEach(function(b){
      b.onclick=function(){toggleFollow(b.dataset.v27Follow);render();toast(isFollowed(b.dataset.v27Follow)?'Equipo seguido':'Dejaste de seguir al equipo')};
    });
    const compare=document.querySelector('[data-v27-compare]');
    if(compare)compare.onclick=function(){toast('Comparación preparada para '+selected().name)};
    const share=document.querySelector('[data-v27-share]');
    if(share)share.onclick=function(){
      const t=selected();
      const payload={title:t.name,text:'Liga Municipal de Fútbol Juventino Rosas · '+t.name,url:location.href};
      if(navigator.share){navigator.share(payload).catch(function(){})}
      else if(navigator.clipboard){navigator.clipboard.writeText(location.href).then(function(){toast('Enlace copiado')}).catch(function(){toast('Contenido listo para compartir')})}
      else toast('Contenido listo para compartir');
    };
    const all=document.querySelector('[data-v27-competition]');
    if(all)all.onclick=function(){location.hash='#/competition'};
  }

  function schedule(){
    requestAnimationFrame(function(){requestAnimationFrame(render)});
  }

  window.addEventListener('hashchange',schedule);
  const target=document.querySelector('#screen');
  if(target){
    new MutationObserver(function(){
      const r=route();
      if((r==='teams'||r==='teamDetail')&&!target.querySelector('[data-v27-reference]'))schedule();
    }).observe(target,{childList:true,subtree:false});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();