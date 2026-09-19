/* PARTS52 — Match detail universal.
   Todos los botones [data-match] abren la misma pantalla de referencia,
   conservando el partido pulsado cuando proviene del calendario. */
(function(){
  'use strict';

  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE=BASE+'assets/liga-logo.webp';

  const LOGOS={
    'Club América Vet.':'assets/branding/america-veteranos-35-user.png',
    'Club América Veteranos JR':'assets/branding/america-veteranos-35-user.png',
    'La Huerta':'assets/official-logos/la-huerta.png',
    'La Huerta de Cuenda':'assets/official-logos/la-huerta.png',
    'Promesas FC':'assets/official-logos/promesas-fc.png',
    'Promesas FC Pozos':'assets/official-logos/promesas-fc.png',
    'Santa Cruz':'assets/teams/atletico-santa-cruz.webp',
    'Franco FC':'assets/official-logos/franco-fc.png',
    'Franco Tavera':'assets/teams/franco-tavera-jr-veteranos.webp',
    'Cuenda':'assets/official-logos/toros-de-cuenda.png',
    'Atlético Galeana':'assets/official-logos/galeana.png',
    'Lobos CDG':'assets/official-logos/lobos-cdg.png',
    'Juventino':'assets/liga-logo.webp',
    'Juventino Rosas':'assets/liga-logo.webp',
    'Pozos':'assets/teams/pozos-fc.webp',
    'Pozos FC':'assets/teams/pozos-fc.webp'
  };

  const MAIN_MATCHES={
    m1:{home:'Juventino',away:'Pozos FC',time:'18:00',date:'13 oct',venue:'Campo Municipal',category:'Liga Municipal'},
    m2:{home:'Cuenda',away:'Rincón de Centeno',time:'20:00',date:'13 oct',venue:'Campo Cuenda',category:'Liga Municipal'},
    m3:{home:'San Pedro',away:'Morales',time:'19:00',date:'14 oct',venue:'Campo San Pedro',category:'Liga Municipal'},
    m4:{home:'Rincón de Centeno',away:'Juventino',time:'18:00',date:'12 oct',venue:'Campo Rincón',category:'Liga Municipal'},
    m5:{home:'Pozos FC',away:'Cuenda',time:'20:00',date:'12 oct',venue:'Unidad Deportiva Pozos',category:'Liga Municipal'}
  };

  const TABLE=[
    {name:'Lobos CDG',logo:'assets/official-logos/lobos-cdg.png',p:1,gd:5,pts:3,last:'V'},
    {name:'La Huerta',logo:'assets/official-logos/la-huerta.png',p:1,gd:5,pts:3,last:'V'},
    {name:'Atlético Galeana',logo:'assets/official-logos/galeana.png',p:1,gd:4,pts:3,last:'V'},
    {name:'Franco FC',logo:'assets/official-logos/franco-fc.png',p:1,gd:4,pts:3,last:'V'},
    {name:'Promesas FC',logo:'assets/official-logos/promesas-fc.png',p:1,gd:3,pts:3,last:'V'},
    {name:'Club América Vet.',logo:'assets/branding/america-veteranos-35-user.png',p:1,gd:2,pts:3,last:'V'},
    {name:'Cuenda',logo:'assets/official-logos/toros-de-cuenda.png',p:1,gd:0,pts:1,last:'E'},
    {name:'Juventino',logo:'assets/liga-logo.webp',p:1,gd:-1,pts:0,last:'D'}
  ];

  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function logoPath(name){const p=LOGOS[name];return p?(p.startsWith('http')?p:BASE+p):LEAGUE}
  function teamLogo(name,cls=''){return '<img class="'+cls+'" src="'+logoPath(name)+'" alt="'+esc(name)+'" loading="eager" decoding="async">'}
  function backIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>'}
  function muteIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Zm13-1 3 8M21 8l-3 8"/></svg>'}
  function soundIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Zm12 0c1.3 1.5 1.3 4.5 0 6m2.5-9c3 3.2 3 8.8 0 12"/></svg>'}
  function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/></svg>'}

  function readSaved(){
    try{return JSON.parse(sessionStorage.getItem('lj-match-detail')||'null')}catch{return null}
  }
  function saveMatch(data){
    try{sessionStorage.setItem('lj-match-detail',JSON.stringify(data))}catch{}
  }

  /* Captura el partido ANTES de que main.js cambie a #/match.
     Así incluso los IDs m1/m2 repetidos del calendario conservan sus clubes reales. */
  document.addEventListener('click',function(e){
    const hit=e.target.closest('[data-match]');
    if(!hit)return;
    let data={id:hit.dataset.match||'m1',from:location.hash||'#/competition'};
    const schedule=hit.closest('.v12-schedule-match');
    if(schedule){
      const names=[...schedule.querySelectorAll('.v12-schedule-clubs b')].map(x=>x.textContent.trim());
      const time=schedule.querySelector('time')?.textContent.trim()||'10:45';
      const card=schedule.closest('.v12-schedule-card');
      let heading=card?.previousElementSibling;
      while(heading && !/^H[1-6]$/.test(heading.tagName))heading=heading.previousElementSibling;
      data={
        ...data,
        home:names[0]||'Franco FC',
        away:names[1]||'Promesas FC',
        time,
        date:heading?.textContent?.trim()||'sáb 19 sept',
        venue:'Campo Municipal',
        category:'Liga Municipal'
      };
    }else{
      const m=MAIN_MATCHES[data.id];
      if(m)data={...data,...m};
    }
    saveMatch(data);
  },true);

  function selected(){
    const saved=readSaved();
    if(saved?.home&&saved?.away)return saved;
    const id=saved?.id||'m1';
    return {id,from:saved?.from||'#/competition',...(MAIN_MATCHES[id]||{
      home:'Franco FC',away:'Promesas FC',time:'10:45',date:'sáb 19 sept',
      venue:'Campo Municipal',category:'Liga Municipal'
    })};
  }

  function toast(msg){
    const old=document.querySelector('.v28-toast');if(old)old.remove();
    const el=document.createElement('div');el.className='v28-toast';el.textContent=msg;
    document.body.appendChild(el);setTimeout(()=>el.remove(),1700);
  }

  function formCell(last){
    const cls=last==='V'?'w':last==='E'?'e':'d';
    return '<span class="v28-stand-form"><i></i><i></i><b class="'+cls+'">'+last+'</b></span>';
  }

  function standings(mode='compact'){
    if(mode==='criteria'){
      const head=['PTOS','+/-','GF','GA','V','E','D'];
      return '<div class="v28-table-scroll"><div class="v28-criteria-table">'+
        '<div class="v28-criteria-head"><span></span><span></span>'+head.map(x=>'<b>'+x+'</b>').join('')+'</div>'+
        '<div class="v28-direct">DIRECTOS A OCTAVOS</div><div class="v28-direct-line"></div>'+
        TABLE.map((t,i)=>'<div class="v28-criteria-row">'+
          '<span>'+(i+1)+'</span><span class="v28-team">'+teamLogo(t.name)+'<strong>'+esc(t.name)+'</strong></span>'+
          '<span>'+t.pts+'</span><span>'+t.gd+'</span><span>'+(Math.max(0,t.gd+1))+'</span><span>0</span><span>'+(t.last==='V'?1:0)+'</span><span>'+(t.last==='E'?1:0)+'</span><span>'+(t.last==='D'?1:0)+'</span>'+
        '</div>').join('')+
      '</div></div>';
    }
    if(mode==='complete'){
      return '<div class="v28-table-scroll"><div class="v28-complete-table">'+
        '<div class="v28-complete-head"><span></span><span></span><b>P</b><b>V</b><b>E</b><b>D</b><b>PTOS</b></div>'+
        '<div class="v28-direct">DIRECTOS A OCTAVOS</div><div class="v28-direct-line"></div>'+
        TABLE.map((t,i)=>'<div class="v28-complete-row">'+
          '<span>'+(i+1)+'</span><span class="v28-team">'+teamLogo(t.name)+'<strong>'+esc(t.name)+'</strong></span>'+
          '<span>'+t.p+'</span><span>'+(t.last==='V'?1:0)+'</span><span>'+(t.last==='E'?1:0)+'</span><span>'+(t.last==='D'?1:0)+'</span><b>'+t.pts+'</b>'+
        '</div>').join('')+
      '</div></div>';
    }
    return '<div class="v28-table-scroll"><div class="v28-compact-table">'+
      '<div class="v28-compact-head"><span></span><span></span><b>P</b><b>+/-</b><b>PTOS</b><b>FORMA</b></div>'+
      '<div class="v28-direct">DIRECTOS A OCTAVOS</div><div class="v28-direct-line"></div>'+
      TABLE.map((t,i)=>'<div class="v28-compact-row">'+
        '<span class="v28-rank">'+(i+1)+'</span>'+
        '<span class="v28-team">'+teamLogo(t.name)+'<strong>'+esc(t.name)+'</strong></span>'+
        '<span>'+t.p+'</span><span>'+t.gd+'</span><span>'+t.pts+'</span>'+formCell(t.last)+
      '</div>').join('')+
    '</div></div>';
  }

  function formDots(pattern){
    return '<span class="v28-form-dots">'+pattern.map(function(x,i){
      const c=x==='V'?'w':x==='E'?'e':'d';
      return '<i class="'+c+(i===pattern.length-1?' current':'')+'">'+x+'</i>';
    }).join('')+'<i class="v28-form-arrow"></i></span>';
  }

  function teamForm(name,pattern){
    return '<div class="v28-form-line">'+
      '<div class="v28-form-team">'+teamLogo(name)+'<span>'+esc(name)+'</span></div>'+
      formDots(pattern)+
    '</div>';
  }

  function newsPanel(m){
    return '<section class="v28-panel v28-news-panel active" data-v28-panel="news">'+
      '<section class="v28-section" id="v28-info">'+
        '<h2>Información del partido</h2>'+
        '<div class="v28-stadium" role="img" aria-label="Cancha municipal"></div>'+
        '<div class="v28-stadium-caption">'+esc(m.venue)+'<small>Juventino Rosas</small></div>'+
        '<div class="v28-divider"></div>'+
      '</section>'+
      '<section class="v28-section v28-h2h">'+
        '<h2>Enfrentamiento directo</h2>'+
        '<div class="v28-h2h-row">'+
          '<div class="v28-h2h-team">'+teamLogo(m.home)+'<span>'+esc(m.home)+'</span></div>'+
          '<div class="v28-h2h-team right"><span>'+esc(m.away)+'</span>'+teamLogo(m.away)+'</div>'+
        '</div>'+
        '<div class="v28-h2h-values">'+
          '<div><b>0</b><span>Victorias</span></div>'+
          '<div><b>0</b><span>Empates</span></div>'+
          '<div><b>0</b><span>Victorias</span></div>'+
        '</div>'+
        '<div class="v28-goals-row"><b>0</b><span>Goles</span><b>0</b></div>'+
      '</section>'+
      '<section class="v28-section v28-form-block">'+
        '<h2>Estado de forma</h2>'+
        teamForm(m.home,['D','D','V','E','D'])+
        '<div class="v28-form-goals"><b>0</b><span>Goles</span><b>0</b></div>'+
      '</section>'+
      '<section class="v28-section v28-form-block v28-dual">'+
        '<h2>Estado de forma</h2>'+
        teamForm(m.home,['D','D','V','E','D'])+
        teamForm(m.away,['V','V','V','V','E'])+
      '</section>'+
    '</section>';
  }
  function standingsPanel(){
    return '<section class="v28-panel v28-standings-panel" data-v28-panel="standings">'+
      '<div class="v28-segmented">'+
        '<button class="active" type="button" data-v28-mode="compact">Compacta</button>'+
        '<button type="button" data-v28-mode="complete">Completa</button>'+
        '<button type="button" data-v28-mode="criteria">Criterios de<br>desempate</button>'+
      '</div>'+
      '<div class="v28-stand-content" data-v28-stand-content>'+standings('compact')+'</div>'+
    '</section>';
  }

  function infoPanel(m){
    return '<section class="v28-panel v28-info-panel" data-v28-panel="info">'+
      '<h2>Info del partido</h2>'+
      '<div class="v28-info-card"><span>Fecha</span><b>'+esc(m.date)+'</b></div>'+
      '<div class="v28-info-card"><span>Hora</span><b>'+esc(m.time)+'</b></div>'+
      '<div class="v28-info-card"><span>Campo</span><b>'+esc(m.venue)+' · Juventino Rosas</b></div>'+
      '<div class="v28-info-card"><span>Competición</span><b>'+esc(m.category||'Liga Municipal')+'</b></div>'+
    '</section>';
  }

  function markup(){
    const m=selected();
    return '<article class="v28-match" data-v28-match>'+
      '<header class="v28-top">'+
        '<div class="v28-actions">'+
          '<button class="v28-icon-btn" type="button" data-v28-back aria-label="Volver">'+backIcon()+'</button>'+
          '<div class="v28-action-right">'+
            '<button class="v28-icon-btn" type="button" data-v28-mute aria-label="Silenciar">'+muteIcon()+'</button>'+
            '<button class="v28-icon-btn" type="button" data-v28-share aria-label="Compartir">'+shareIcon()+'</button>'+
          '</div>'+
        '</div>'+
        '<div class="v28-meta">'+esc(m.date)+' &nbsp;·&nbsp; '+esc(m.category||'Liga Municipal')+'</div>'+
        '<div class="v28-venue">'+esc(m.venue)+' &nbsp;·&nbsp; Juventino Rosas</div>'+
        '<div class="v28-scoreline">'+
          '<div class="v28-side left"><span>'+esc(m.home)+'</span>'+teamLogo(m.home,'v28-team-logo')+'</div>'+
          '<div class="v28-time">'+esc(m.time)+'</div>'+
          '<div class="v28-side right">'+teamLogo(m.away,'v28-team-logo')+'<span>'+esc(m.away)+'</span></div>'+
        '</div>'+
        '<nav class="v28-tabs" aria-label="Información del partido">'+
          '<button class="v28-tab active" type="button" data-v28-tab="news">Novedades</button>'+
          '<button class="v28-tab" type="button" data-v28-tab="standings">Clasificación</button>'+
          '<button class="v28-tab" type="button" data-v28-tab="info">Info del partido</button>'+
        '</nav>'+
      '</header>'+
      '<main class="v28-body">'+newsPanel(m)+standingsPanel()+infoPanel(m)+'</main>'+
    '</article>';
  }

  let muted=true;

  function bind(){
    const m=selected();
    const back=document.querySelector('[data-v28-back]');
    if(back)back.onclick=function(){
      const from=m.from&&m.from!=='#/match'?m.from:'#/competition';
      location.hash=from;
    };

    const mute=document.querySelector('[data-v28-mute]');
    if(mute)mute.onclick=function(){
      muted=!muted;mute.innerHTML=muted?muteIcon():soundIcon();
      mute.setAttribute('aria-label',muted?'Activar sonido':'Silenciar');
      toast(muted?'Sonido desactivado':'Sonido activado');
    };

    const share=document.querySelector('[data-v28-share]');
    if(share)share.onclick=function(){
      const payload={title:m.home+' vs '+m.away,text:(m.category||'Liga Municipal')+' · '+m.home+' vs '+m.away,url:location.href};
      if(navigator.share)navigator.share(payload).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(function(){toast('Enlace copiado')}).catch(function(){toast('Contenido listo para compartir')});
      else toast('Contenido listo para compartir');
    };

    document.querySelectorAll('[data-v28-tab]').forEach(function(btn){
      btn.onclick=function(){
        const key=btn.dataset.v28Tab;
        document.querySelectorAll('[data-v28-tab]').forEach(x=>x.classList.toggle('active',x===btn));
        document.querySelectorAll('[data-v28-panel]').forEach(x=>x.classList.toggle('active',x.dataset.v28Panel===key));
      };
    });

    document.querySelectorAll('[data-v28-mode]').forEach(function(btn){
      btn.onclick=function(){
        const mode=btn.dataset.v28Mode;
        document.querySelectorAll('[data-v28-mode]').forEach(x=>x.classList.toggle('active',x===btn));
        const out=document.querySelector('[data-v28-stand-content]');
        if(out)out.innerHTML=standings(mode);
      };
    });
  }

  function activate(){
    const isMatch=route()==='match';
    document.body.classList.toggle('v28-match-active',isMatch);
    if(!isMatch)return;
    const screen=document.querySelector('#screen');
    if(!screen)return;
    if(!screen.querySelector('[data-v28-match]')){
      screen.innerHTML=markup();
      bind();
      window.scrollTo(0,0);
    }
  }

  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(activate))}
  window.addEventListener('hashchange',schedule);
  const target=document.querySelector('#screen');
  if(target)new MutationObserver(function(){if(route()==='match'&&!target.querySelector('[data-v28-match]'))schedule()}).observe(target,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();