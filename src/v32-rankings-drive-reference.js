/* PARTS32 — functional Rankings screen based on the two Google Drive reference images. */
(function(){
'use strict';

var BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
var LOGOS={
  LEAGUE:'assets/liga-logo.webp',
  AME:'assets/branding/america-veteranos-35-user.png',
  HUE:'assets/official-logos/la-huerta.png',
  PRO:'assets/official-logos/promesas-fc.png',
  FRA:'assets/official-logos/franco-fc.png',
  GAL:'assets/official-logos/galeana.png',
  LOB:'assets/official-logos/lobos-cdg.png',
  CUE:'assets/official-logos/toros-de-cuenda.png',
  POZ:'assets/teams/pozos-fc.webp',
  ESP:'assets/official-logos/la-esperanza.png'
};

var federationRows=[
  ['LEAGUE','Juventino Rosas','36,000 / 8','4,500'],
  ['AME','América VR','32,000 / 8','4,000'],
  ['PRO','Promesas FC','28,000 / 8','3,500'],
  ['ESP','La Esperanza','26,000 / 8','3,250'],
  ['LOB','Lobos CDG','24,000 / 8','3,000'],
  ['GAL','Atlético Galeana','20,000 / 8','2,500'],
  ['FRA','Franco FC','18,000 / 8','2,250']
];

var clubRows=[
  ['AME','América Veteranos','129,500'],
  ['HUE','La Huerta','127,000'],
  ['PRO','Promesas FC','122,500'],
  ['FRA','Franco FC','121,000'],
  ['GAL','Atlético Galeana','115,000'],
  ['LOB','Lobos CDG','106,500'],
  ['JUV','Juventino','106,250'],
  ['CUE','Cuenda','105,000'],
  ['POZ','Pozos','98,750']
];

var activeTab=localStorage.getItem('v32-rankings-tab')||'federations';
var season=localStorage.getItem('v32-rankings-season')||'2026/27';
var topOnly=false;
var expanded=-1;

function route(){
  return location.hash.replace('#/','')||'home';
}
function esc(value){
  return String(value==null?'':value).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function backIcon(){
  return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>';
}
function shareIcon(){
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.25"/><circle cx="6" cy="12" r="2.25"/><circle cx="18" cy="19" r="2.25"/><path d="m8.1 10.9 7.6-4.5M8.1 13.1l7.6 4.5"/></svg>';
}
function filterIcon(){
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M8 12h8M10.5 17h3"/></svg>';
}
function logo(code,name){
  var path=LOGOS[code];
  if(path){
    return '<span class="v32-logo"><img src="'+BASE+path+'" alt="'+esc(name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v32-logo-fallback" style="display:none">'+esc(code)+'</span></span>';
  }
  return '<span class="v32-logo"><span class="v32-logo-fallback">'+esc(code)+'</span></span>';
}
function toast(message){
  var old=document.querySelector('.v32-toast');
  if(old)old.remove();
  var node=document.createElement('div');
  node.className='v32-toast';
  node.textContent=message;
  document.body.appendChild(node);
  setTimeout(function(){node.remove();},1600);
}
function tabs(){
  return '<nav class="v32-tabs" aria-label="Tipo de ranking">'+
    '<button type="button" class="v32-tab '+(activeTab==='federations'?'active':'')+'" data-v32-tab="federations">Federaciones</button>'+
    '<button type="button" class="v32-tab '+(activeTab==='clubs'?'active':'')+'" data-v32-tab="clubs">Clubes</button>'+
  '</nav>';
}
function header(){
  if(activeTab==='federations'){
    return '<header class="v32-head v32-head-fed">'+
      '<div class="v32-head-row"><button type="button" class="v32-icon" data-v32-back aria-label="Volver">'+backIcon()+'</button><button type="button" class="v32-icon" data-v32-share aria-label="Compartir">'+shareIcon()+'</button></div>'+
      '<h1>Rankings</h1>'+
      tabs()+
    '</header>';
  }
  return '<header class="v32-head v32-head-clubs">'+
    '<div class="v32-head-row"><button type="button" class="v32-icon" data-v32-back aria-label="Volver">'+backIcon()+'</button><h1>Rankings de la Liga</h1><button type="button" class="v32-icon" data-v32-share aria-label="Compartir">'+shareIcon()+'</button></div>'+
    tabs()+
  '</header>';
}
function fedControls(){
  return '<div class="v32-controls fed">'+
    '<button type="button" class="v32-select" data-v32-info="season-type"><span>Temporada</span><i class="v32-chevron"></i></button>'+
    '<button type="button" class="v32-select" data-v32-season><span>'+esc(season)+'</span><i class="v32-chevron"></i></button>'+
  '</div>';
}
function clubsControls(){
  return '<div class="v32-controls clubs">'+
    '<button type="button" class="v32-select" data-v32-info="table"><span>Tabla general</span><i class="v32-chevron"></i></button>'+
    '<button type="button" class="v32-select" data-v32-season><span>'+esc(season)+'</span><i class="v32-chevron"></i></button>'+
    '<button type="button" class="v32-filter '+(topOnly?'active':'')+'" data-v32-filter aria-label="Filtrar ranking">'+filterIcon()+'</button>'+
  '</div>';
}
function fedRows(){
  return federationRows.map(function(row,index){
    return '<button type="button" class="v32-fed-row" data-v32-fed="'+index+'">'+
      '<span class="v32-pos">'+(index+1)+'</span>'+
      logo(row[0],row[1])+
      '<span class="v32-fed-name">'+esc(row[1])+'</span>'+
      '<span class="v32-fed-points">'+esc(row[2])+'</span>'+
      '<strong class="v32-fed-average">'+esc(row[3])+'</strong>'+
    '</button>';
  }).join('');
}
function fedView(){
  return fedControls()+
    '<section class="v32-card v32-fed-card">'+
      '<div class="v32-fed-head"><span>Federación</span><span>Puntos / Clubes</span><span>Promedio</span></div>'+
      '<div class="v32-fed-group">Liga Municipal de Fútbol Juventino Rosas</div>'+
      fedRows()+
    '</section>';
}
function clubItems(){
  var rows=topOnly?clubRows.slice(0,5):clubRows;
  return rows.map(function(row,index){
    var isOpen=expanded===index;
    return '<div class="v32-club-item">'+
      '<button type="button" class="v32-club-row '+(isOpen?'expanded':'')+'" data-v32-club="'+index+'">'+
        '<span class="v32-pos">'+(index+1)+'</span>'+
        logo(row[0],row[1])+
        '<span class="v32-club-copy"><b>'+esc(row[1])+'</b><small>Juventino Rosas</small></span>'+
        '<strong class="v32-club-points">'+esc(row[2])+'</strong>'+
        '<i class="v32-row-chevron"></i>'+
      '</button>'+
      '<div class="v32-club-detail '+(isOpen?'show':'')+'"><span>Temporada '+esc(season)+' · Ranking de clubes</span><button type="button" data-v32-open-team="'+esc(row[0])+'">Ver equipo</button></div>'+
    '</div>';
  }).join('');
}
function clubsView(){
  return clubsControls()+
    '<section class="v32-card v32-club-card">'+
      '<div class="v32-club-head"><span>Club</span><span>Puntos</span><span></span></div>'+
      clubItems()+
    '</section>';
}
function markup(){
  return '<section class="v32-rankings" data-v32-rankings data-v32-tab-state="'+esc(activeTab)+'">'+
    header()+
    (activeTab==='federations'?fedView():clubsView())+
  '</section>';
}
function closePopover(){
  var p=document.querySelector('.v32-popover');
  if(p)p.remove();
}
function seasonPopover(){
  closePopover();
  var p=document.createElement('div');
  p.className='v32-popover';
  p.innerHTML='<b>Temporada</b>'+
    ['2026/27','2025/26','2024/25'].map(function(s){
      return '<button type="button" class="'+(s===season?'active':'')+'" data-v32-season-value="'+s+'">'+s+'</button>';
    }).join('');
  document.body.appendChild(p);
  p.querySelectorAll('[data-v32-season-value]').forEach(function(button){
    button.onclick=function(){
      season=button.dataset.v32SeasonValue;
      localStorage.setItem('v32-rankings-season',season);
      closePopover();
      render();
      if(season!=='2026/27')toast('Diseño cambiado a '+season+' · datos de demostración');
    };
  });
}
function setBottomNav(){
  var nav=document.querySelector('.bottom-nav');
  if(!nav)return;
  var labels={home:'Inicio',competition:'Competición',video:'Video',fantasy:'Fantasy',more:'Más'};
  nav.querySelectorAll('.nav-item').forEach(function(item){
    item.classList.toggle('active',item.dataset.route==='more');
    var small=item.querySelector('small');
    if(small&&labels[item.dataset.route])small.textContent=labels[item.dataset.route];
  });
  var more=nav.querySelector('[data-route="more"] .nav-icon');
  if(more){
    more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.15" fill="currentColor"/><circle cx="12" cy="12" r="2.15" fill="currentColor"/><circle cx="19" cy="12" r="2.15" fill="currentColor"/></svg>';
    more.dataset.v16IconState='more:on';
  }
}
function share(){
  var payload={
    title:'Rankings de la Liga',
    text:'Rankings de la Liga Municipal de Fútbol Juventino Rosas',
    url:location.href
  };
  if(navigator.share){
    navigator.share(payload).catch(function(){});
  }else if(navigator.clipboard){
    navigator.clipboard.writeText(location.href).then(function(){toast('Enlace copiado');}).catch(function(){toast('Contenido listo para compartir');});
  }else{
    toast('Contenido listo para compartir');
  }
}
function bind(){
  document.querySelectorAll('[data-v32-tab]').forEach(function(button){
    button.onclick=function(){
      activeTab=button.dataset.v32Tab;
      localStorage.setItem('v32-rankings-tab',activeTab);
      expanded=-1;
      render();
    };
  });
  document.querySelectorAll('[data-v32-back]').forEach(function(button){
    button.onclick=function(){location.hash='#/more';};
  });
  document.querySelectorAll('[data-v32-share]').forEach(function(button){
    button.onclick=share;
  });
  document.querySelectorAll('[data-v32-season]').forEach(function(button){
    button.onclick=seasonPopover;
  });
  document.querySelectorAll('[data-v32-info]').forEach(function(button){
    button.onclick=function(){
      if(button.dataset.v32Info==='season-type')toast('Ranking por temporada');
      else toast('Tabla general de clubes');
    };
  });
  var filter=document.querySelector('[data-v32-filter]');
  if(filter){
    filter.onclick=function(){
      topOnly=!topOnly;
      expanded=-1;
      render();
      toast(topOnly?'Mostrando Top 5':'Mostrando todos los clubes');
    };
  }
  document.querySelectorAll('[data-v32-fed]').forEach(function(button){
    button.onclick=function(){
      var row=federationRows[Number(button.dataset.v32Fed)];
      if(row)toast(row[1]+' · promedio '+row[3]);
    };
  });
  document.querySelectorAll('[data-v32-club]').forEach(function(button){
    button.onclick=function(){
      var index=Number(button.dataset.v32Club);
      expanded=expanded===index?-1:index;
      render();
    };
  });
  document.querySelectorAll('[data-v32-open-team]').forEach(function(button){
    button.onclick=function(event){
      event.stopPropagation();
      localStorage.setItem('v27-selected-team',button.dataset.v32OpenTeam);
      location.hash='#/teamDetail';
    };
  });
}
function render(){
  var active=route()==='rankings';
  document.body.classList.toggle('v32-rankings-active',active);
  if(!active){
    closePopover();
    return;
  }
  var screen=document.querySelector('#screen');
  if(!screen)return;
  screen.innerHTML=markup();
  setBottomNav();
  bind();
}
function schedule(){
  requestAnimationFrame(function(){requestAnimationFrame(render);});
}
window.addEventListener('hashchange',schedule);
var target=document.querySelector('#screen');
if(target){
  new MutationObserver(function(){
    if(route()==='rankings'&&!target.querySelector('[data-v32-rankings]'))schedule();
  }).observe(target,{childList:true,subtree:false});
}
document.addEventListener('click',function(event){
  var p=document.querySelector('.v32-popover');
  if(!p)return;
  if(event.target.closest('.v32-popover')||event.target.closest('[data-v32-season]'))return;
  closePopover();
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
})();