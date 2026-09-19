/* PARTS28 — Functional local match screen based on the uploaded master screenshot. */
(function(){
  'use strict';

  const LOCAL_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const HOME={
    name:'Franco Tavera',
    short:'Franco Tavera',
    logo:LOCAL_BASE+'assets/teams/franco-tavera-jr-veteranos.webp'
  };
  const AWAY={
    name:'Pozos FC',
    short:'Pozos FC',
    logo:LOCAL_BASE+'assets/teams/pozos-fc.webp'
  };

  function route(){return location.hash.replace('#/','')||'home'}
  function backIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>'}
  function muteIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Zm13-1 3 8M21 8l-3 8"/></svg>'}
  function soundIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Zm12 0c1.3 1.5 1.3 4.5 0 6m2.5-9c3 3.2 3 8.8 0 12"/></svg>'}
  function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/></svg>'}
  function logo(team){return '<img src="'+team.logo+'" alt="'+team.name+'" loading="eager" decoding="async">'}
  function formDots(pattern){
    return '<span class="v28-form-dots">'+pattern.map(function(x,i){
      const c=x==='V'?'w':x==='E'?'e':'d';
      return '<i class="'+c+(i===pattern.length-1?' current':'')+'">'+x+'</i>';
    }).join('')+'<i class="v28-form-arrow"></i></span>';
  }
  function teamForm(team,pattern){
    return '<div class="v28-form-line">'+
      '<div class="v28-form-team">'+logo(team)+'<span>'+team.short+'</span></div>'+
      formDots(pattern)+
    '</div>';
  }
  function toast(msg){
    const old=document.querySelector('.v28-toast');if(old)old.remove();
    const el=document.createElement('div');el.className='v28-toast';el.textContent=msg;
    document.body.appendChild(el);setTimeout(function(){el.remove()},1700);
  }

  function markup(){
    return '<article class="v28-match" data-v28-match>'+
      '<header class="v28-top">'+
        '<div class="v28-actions">'+
          '<button class="v28-icon-btn" type="button" data-v28-back aria-label="Volver">'+backIcon()+'</button>'+
          '<div class="v28-action-right">'+
            '<button class="v28-icon-btn" type="button" data-v28-mute aria-label="Silenciar">'+muteIcon()+'</button>'+
            '<button class="v28-icon-btn" type="button" data-v28-share aria-label="Compartir">'+shareIcon()+'</button>'+
          '</div>'+
        '</div>'+
        '<div class="v28-meta">sáb 19 sep&nbsp; · &nbsp;Liga Municipal</div>'+
        '<div class="v28-venue">Campo de Tavera · Juventino Rosas</div>'+
        '<div class="v28-scoreline">'+
          '<div class="v28-side left"><span>'+HOME.short+'</span>'+logo(HOME)+'</div>'+
          '<div class="v28-time">10:45</div>'+
          '<div class="v28-side right">'+logo(AWAY)+'<span>'+AWAY.short+'</span></div>'+
        '</div>'+
        '<nav class="v28-tabs" aria-label="Información del partido">'+
          '<button class="v28-tab active" type="button" data-v28-tab="news">Novedades</button>'+
          '<button class="v28-tab" type="button" data-v28-tab="standings">Clasificación</button>'+
          '<button class="v28-tab" type="button" data-v28-tab="info">Info del partido</button>'+
        '</nav>'+
      '</header>'+

      '<section class="v28-section" id="v28-info">'+
        '<h2>Información del partido</h2>'+
        '<div class="v28-stadium" role="img" aria-label="Ilustración de cancha municipal iluminada"></div>'+
        '<div class="v28-stadium-caption">Campo de Tavera<small>Juventino Rosas</small></div>'+
        '<div class="v28-divider"></div>'+
      '</section>'+

      '<section class="v28-section v28-h2h">'+
        '<h2>Enfrentamiento directo</h2>'+
        '<div class="v28-h2h-row">'+
          '<div class="v28-h2h-team">'+logo(HOME)+'<span>'+HOME.short+'</span></div>'+
          '<div class="v28-h2h-team right"><span>'+AWAY.short+'</span>'+logo(AWAY)+'</div>'+
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
        teamForm(HOME,['D','D','V','E','D'])+
        '<div class="v28-form-goals"><b>0</b><span>Goles</span><b>0</b></div>'+
      '</section>'+

      '<section class="v28-section v28-form-block">'+
        '<h2>Estado de forma</h2>'+
        teamForm(HOME,['D','D','V','E','D'])+
        '<div class="v28-form-goals"><b>0</b><span>Goles</span><b>0</b></div>'+
      '</section>'+

      '<section class="v28-section v28-form-block v28-dual">'+
        '<h2>Estado de forma</h2>'+
        teamForm(HOME,['D','D','V','E','D'])+
        teamForm(AWAY,['V','V','V','V','E'])+
      '</section>'+

      '<div class="v28-local-sponsor">PATROCINADOR LOCAL</div>'+
    '</article>';
  }

  let muted=true;

  function bind(){
    const back=document.querySelector('[data-v28-back]');
    if(back)back.onclick=function(){location.hash='#/competition'};

    const mute=document.querySelector('[data-v28-mute]');
    if(mute)mute.onclick=function(){
      muted=!muted;
      mute.innerHTML=muted?muteIcon():soundIcon();
      mute.setAttribute('aria-label',muted?'Activar sonido':'Silenciar');
      toast(muted?'Sonido desactivado':'Sonido activado');
    };

    const share=document.querySelector('[data-v28-share]');
    if(share)share.onclick=function(){
      const payload={
        title:'Franco Tavera vs Pozos FC',
        text:'Liga Municipal de Fútbol Juventino Rosas · Franco Tavera vs Pozos FC',
        url:location.href
      };
      if(navigator.share)navigator.share(payload).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(function(){toast('Enlace copiado')}).catch(function(){toast('Contenido listo para compartir')});
      else toast('Contenido listo para compartir');
    };

    document.querySelectorAll('[data-v28-tab]').forEach(function(btn){
      btn.onclick=function(){
        const key=btn.dataset.v28Tab;
        if(key==='standings'){location.hash='#/competition';return}
        document.querySelectorAll('[data-v28-tab]').forEach(function(x){x.classList.toggle('active',x===btn)});
        if(key==='info'){
          const info=document.querySelector('#v28-info');
          if(info)info.scrollIntoView({behavior:'smooth',block:'start'});
        }else{
          window.scrollTo({top:0,behavior:'smooth'});
        }
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

  function schedule(){requestAnimationFrame(function(){requestAnimationFrame(activate)})}
  window.addEventListener('hashchange',schedule);

  const target=document.querySelector('#screen');
  if(target){
    new MutationObserver(function(){
      if(route()==='match'&&!target.querySelector('[data-v28-match]'))schedule();
    }).observe(target,{childList:true,subtree:false});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();