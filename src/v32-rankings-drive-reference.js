/* PARTS32 — functional Rankings screen based on the Drive references + filter flow from the supplied video. */
(function(){
'use strict';

var BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
var LOGOS={
  "CAT3": "assets/branding/primera-fuerza-hd.png",
  "CAT5": "assets/categories/intermedia.webp",
  "CAT4": "assets/categories/segunda-fuerza.webp",
  "CAT2": "assets/categories/veteranos-35-user.png",
  "CAT1": "assets/categories/veteranos-50.webp",
  "SJO": "assets/official-logos/san-jose-fc.png",
  "JVS": "assets/official-logos/juventus.png",
  "HER": "assets/official-logos/hermanos.png",
  "LIN": "assets/official-logos/linces.png",
  "NAP": "assets/official-logos/napoli.png",
  "FRA": "assets/official-logos/franco-fc.png",
  "HFC": "assets/official-logos/herreras-fc.png",
  "ABE": "assets/official-logos/abejas.png",
  "LOB": "assets/official-logos/lobos-cdg.png",
  "TER": "assets/official-logos/terricolas.png",
  "GAC": "assets/teams/galacticos-pozos.webp"
};

var federationRows=[
  [
    "CAT3",
    "Primera Fuerza",
    "291",
    "11"
  ],
  [
    "CAT5",
    "Intermedia",
    "336",
    "13"
  ],
  [
    "CAT4",
    "Segunda Fuerza",
    "322",
    "12"
  ],
  [
    "CAT2",
    "Veteranos 35+",
    "0",
    "10"
  ],
  [
    "CAT1",
    "Veteranos 50+",
    "109",
    "6"
  ]
];

var clubRows=[
  [
    "SJO",
    "SAN JOSE FC",
    "12"
  ],
  [
    "JVS",
    "JUVENTUS",
    "9"
  ],
  [
    "HER",
    "HERMANOS",
    "7"
  ],
  [
    "LIN",
    "LINCES",
    "6"
  ],
  [
    "NAP",
    "NAPOLI",
    "6"
  ],
  [
    "FRA",
    "FRANCO FC",
    "6"
  ],
  [
    "HFC",
    "HERRERAS FC",
    "4"
  ],
  [
    "ABE",
    "ABEJAS",
    "3"
  ],
  [
    "LOB",
    "LOBOS CDG",
    "3"
  ],
  [
    "TER",
    "TERRICOLAS",
    "0"
  ],
  [
    "GAC",
    "GALACTICOS",
    "-12"
  ]
];

var activeTab=localStorage.getItem('v32-rankings-tab')||'federations';
var season='Temporada actual';
var selectedClub=localStorage.getItem('v32-rankings-club')||'';
var selectedFederation=localStorage.getItem('v32-rankings-federation')||'';

/* V80 — limpia filtros guardados de versiones anteriores.
   Antes el ranking usaba códigos como AME/HUE/PRO. Tras cambiar a la tabla
   oficial de AdminFut esos códigos quedaron obsoletos y podían dejar la tabla
   totalmente vacía aunque sí hubiera equipos. */
if(selectedClub&&!clubRows.some(function(row){return row[0]===selectedClub})){
  selectedClub='';
  localStorage.removeItem('v32-rankings-club');
}
if(selectedFederation&&!federationRows.some(function(row){return row[0]===selectedFederation})){
  selectedFederation='';
  localStorage.removeItem('v32-rankings-federation');
}
if(activeTab!=='federations'&&activeTab!=='clubs'){
  activeTab='clubs';
  localStorage.setItem('v32-rankings-tab','clubs');
}

var pendingClub=selectedClub;
var pendingFederation=selectedFederation;
var filterMode=false;
var filterQuery='';
var expanded=-1;

function route(){return location.hash.replace('#/','')||'home'}
function esc(value){
  return String(value==null?'':value).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function clubByCode(code){return clubRows.find(function(row){return row[0]===code})||null}
function backIcon(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.25"/><circle cx="6" cy="12" r="2.25"/><circle cx="18" cy="19" r="2.25"/><path d="m8.1 10.9 7.6-4.5M8.1 13.1l7.6 4.5"/></svg>'}
function filterIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M8 12h8M10.5 17h3"/></svg>'}
function searchIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 5.1 5.1"/></svg>'}
function logo(code,name,extra){
  var cls='v32-logo'+(extra?' '+extra:'');
  var path=LOGOS[code];
  if(path){
    return '<span class="'+cls+'"><img src="'+BASE+path+'" alt="'+esc(name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v32-logo-fallback" style="display:none">'+esc(code)+'</span></span>';
  }
  return '<span class="'+cls+'"><span class="v32-logo-fallback">'+esc(code)+'</span></span>';
}
function toast(message){
  var old=document.querySelector('.v32-toast');if(old)old.remove();
  var node=document.createElement('div');node.className='v32-toast';node.textContent=message;document.body.appendChild(node);
  setTimeout(function(){node.remove()},1600);
}
function tabs(){
  return '<nav class="v32-tabs" aria-label="Tipo de ranking">'+
    '<button type="button" class="v32-tab '+(activeTab==='federations'?'active':'')+'" data-v32-tab="federations">Categorías</button>'+
    '<button type="button" class="v32-tab '+(activeTab==='clubs'?'active':'')+'" data-v32-tab="clubs">Clubes</button>'+
  '</nav>';
}
function header(){
  return '<header class="v32-head v32-head-unified">'+
    '<div class="v32-head-row">'+
      '<button type="button" class="v32-icon" data-v32-back aria-label="Volver">'+backIcon()+'</button>'+
      '<h1>Rankings de la Liga</h1>'+
      '<button type="button" class="v32-icon" data-v32-share aria-label="Compartir">'+shareIcon()+'</button>'+
    '</div>'+
    tabs()+
  '</header>';
}
function fedControls(){
  return '<div class="v32-controls fed">'+
    '<button type="button" class="v32-select" data-v32-info="season-type"><span>Temporada</span><i class="v32-chevron"></i></button>'+
    '<button type="button" class="v32-select" data-v32-season><span>'+esc(season)+'</span><i class="v32-chevron"></i></button>'+
    '<button type="button" class="v32-filter '+(selectedFederation?'active':'')+'" data-v32-filter aria-label="Filtrar categorías">'+filterIcon()+'</button>'+
  '</div>';
}
function clubsControls(){
  var selected=clubByCode(selectedClub);
  return '<div class="v32-controls clubs '+(selected?'has-club-filter':'')+'">'+
    '<button type="button" class="v32-select v32-coefficient" data-v32-info="coefficient"><span>Clasificación de clubes</span><i class="v32-chevron"></i></button>'+
    '<button type="button" class="v32-select v32-season-select" data-v32-season><span>'+esc(season)+'</span><i class="v32-chevron"></i></button>'+
    (selected?'<button type="button" class="v32-selected-club" data-v32-clear-club><span>'+esc(selected[1])+'</span><i>×</i></button>':'')+
    '<button type="button" class="v32-filter '+(selected?'active':'')+'" data-v32-filter aria-label="Filtrar clubes">'+filterIcon()+'</button>'+
  '</div>';
}
function filteredFederationRows(){
  if(!selectedFederation)return federationRows;
  var rows=federationRows.filter(function(row){return row[0]===selectedFederation});
  if(!rows.length){
    selectedFederation='';
    pendingFederation='';
    localStorage.removeItem('v32-rankings-federation');
    return federationRows;
  }
  return rows;
}
function fedRows(){
  return filteredFederationRows().map(function(row){
    var originalIndex=federationRows.findIndex(function(r){return r[0]===row[0]});
    return '<button type="button" class="v32-fed-row" data-v32-fed="'+originalIndex+'">'+
      '<span class="v32-pos">'+(originalIndex+1)+'</span>'+logo(row[0],row[1])+
      '<span class="v32-fed-name">'+esc(row[1])+'</span>'+
      '<span class="v32-fed-points">'+esc(row[2])+'</span>'+
      '<strong class="v32-fed-average">'+esc(row[3])+'</strong>'+
    '</button>';
  }).join('');
}
function fedView(){
  return fedControls()+
    '<section class="v32-card v32-fed-card">'+
      '<div class="v32-fed-head"><span>Categoría</span><span>Jugadores</span><span>Equipos</span></div>'+
      '<div class="v32-fed-group">Liga Municipal de Fútbol Juventino Rosas</div>'+fedRows()+
    '</section>';
}
function filteredClubRows(){
  if(!selectedClub)return clubRows;
  var rows=clubRows.filter(function(row){return row[0]===selectedClub});
  /* Protección adicional: nunca renderizar una tabla vacía por un filtro
     antiguo o inválido. En ese caso vuelve automáticamente a todos los clubes. */
  if(!rows.length){
    selectedClub='';
    pendingClub='';
    localStorage.removeItem('v32-rankings-club');
    return clubRows;
  }
  return rows;
}
function clubItems(){
  var rows=filteredClubRows();
  return rows.map(function(row){
    var originalIndex=clubRows.findIndex(function(r){return r[0]===row[0]});
    var isOpen=expanded===originalIndex;
    return '<div class="v32-club-item">'+
      '<button type="button" class="v32-club-row '+(isOpen?'expanded':'')+'" data-v32-club="'+originalIndex+'">'+
        '<span class="v32-pos">'+(originalIndex+1)+'</span>'+logo(row[0],row[1])+
        '<span class="v32-club-copy"><b>'+esc(row[1])+'</b><small>Juventino Rosas</small></span>'+
        '<strong class="v32-club-points">'+esc(row[2])+'</strong><i class="v32-row-chevron"></i>'+
      '</button>'+
      '<div class="v32-club-detail '+(isOpen?'show':'')+'"><span>Primera Fuerza · Clasificación oficial</span><button type="button" data-v32-open-team="'+esc(row[0])+'">Ver equipo</button></div>'+
    '</div>';
  }).join('');
}
function clubsView(){
  return clubsControls()+
    '<section class="v32-card v32-club-card">'+
      '<div class="v32-club-head"><span>Club</span><span>Puntos</span><span></span></div>'+
      clubItems()+
    '</section>'+
    '<p class="v32-update">Datos deportivos sincronizados con AdminFut</p>';
}
function filterGrid(){
  var q=filterQuery.trim().toLocaleLowerCase('es');
  var isFed=activeTab==='federations';
  var source=isFed?federationRows:clubRows;
  var rows=source.filter(function(row){return !q||row[1].toLocaleLowerCase('es').includes(q)});
  return rows.map(function(row){
    var checked=isFed?pendingFederation===row[0]:pendingClub===row[0];
    var attr=isFed?'data-v32-pick-fed':'data-v32-pick-club';
    return '<button type="button" class="v32-filter-club '+(checked?'selected':'')+'" '+attr+'="'+esc(row[0])+'">'+
      '<span class="v32-filter-club-logo">'+logo(row[0],row[1],'filter')+(checked?'<i class="v32-filter-check">✓</i>':'')+'</span>'+
      '<span>'+esc(row[1])+'</span>'+
    '</button>';
  }).join('');
}
function filterScreen(){
  var label=activeTab==='federations'?'Categorías':'Clubes';
  return '<section class="v32-filter-screen" data-v32-filter-screen>'+
    '<header class="v32-filter-head"><button type="button" data-v32-filter-cancel>Cancelar</button><h1>Filtros</h1><button type="button" data-v32-filter-done>Hecho</button></header>'+
    '<label class="v32-filter-search">'+searchIcon()+'<input id="v32FilterSearch" type="search" autocomplete="off" placeholder="Buscar" value="'+esc(filterQuery)+'"></label>'+
    '<div class="v32-filter-body"><h2>'+label+'</h2><div class="v32-filter-grid">'+filterGrid()+'</div></div>'+
  '</section>';
}
function markup(){
  return '<section class="v32-rankings '+(filterMode?'v32-filter-mode':'')+'" data-v32-rankings data-v32-tab-state="'+esc(activeTab)+'">'+
    (filterMode?filterScreen():header()+(activeTab==='federations'?fedView():clubsView()))+
  '</section>';
}
function closePopover(){var p=document.querySelector('.v32-popover');if(p)p.remove()}
function seasonPopover(){
  closePopover();
  var p=document.createElement('div');p.className='v32-popover';
  p.innerHTML='<b>Temporada</b><button type="button" class="active">Temporada actual</button>';
  document.body.appendChild(p);
}
function setBottomNav(){
  var nav=document.querySelector('.bottom-nav');if(!nav)return;
  var labels={home:'Inicio',competition:'Competición',video:'Video',fantasy:'Fantasy',more:'Más'};
  nav.querySelectorAll('.nav-item').forEach(function(item){
    item.classList.toggle('active',item.dataset.route==='more');
    var small=item.querySelector('small');if(small&&labels[item.dataset.route])small.textContent=labels[item.dataset.route];
  });
  var more=nav.querySelector('[data-route="more"] .nav-icon');
  if(more){
    more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.15" fill="currentColor"/><circle cx="12" cy="12" r="2.15" fill="currentColor"/><circle cx="19" cy="12" r="2.15" fill="currentColor"/></svg>';
    more.dataset.v16IconState='more:on';
  }
}
function share(){
  var payload={title:'Rankings de la Liga',text:'Rankings de la Liga Municipal de Fútbol Juventino Rosas',url:location.href};
  if(navigator.share)navigator.share(payload).catch(function(){});
  else if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(function(){toast('Enlace copiado')}).catch(function(){toast('Contenido listo para compartir')});
  else toast('Contenido listo para compartir');
}
function renderFilterGridOnly(){
  var grid=document.querySelector('.v32-filter-grid');
  if(grid){grid.innerHTML=filterGrid();bindFilterTiles()}
}
function bindFilterTiles(){
  document.querySelectorAll('[data-v32-pick-club]').forEach(function(button){
    button.onclick=function(){
      pendingClub=pendingClub===button.dataset.v32PickClub?'':button.dataset.v32PickClub;
      renderFilterGridOnly();
    };
  });
  document.querySelectorAll('[data-v32-pick-fed]').forEach(function(button){
    button.onclick=function(){
      pendingFederation=pendingFederation===button.dataset.v32PickFed?'':button.dataset.v32PickFed;
      renderFilterGridOnly();
    };
  });
}
function bind(){
  if(filterMode){
    var cancel=document.querySelector('[data-v32-filter-cancel]');
    var done=document.querySelector('[data-v32-filter-done]');
    if(cancel)cancel.onclick=function(){
      pendingClub=selectedClub;
      pendingFederation=selectedFederation;
      filterQuery='';
      filterMode=false;
      render();
    };
    if(done)done.onclick=function(){
      if(activeTab==='federations'){
        selectedFederation=pendingFederation;
        if(selectedFederation)localStorage.setItem('v32-rankings-federation',selectedFederation);
        else localStorage.removeItem('v32-rankings-federation');
      }else{
        selectedClub=pendingClub;
        if(selectedClub)localStorage.setItem('v32-rankings-club',selectedClub);
        else localStorage.removeItem('v32-rankings-club');
      }
      filterQuery='';filterMode=false;expanded=-1;render();
    };
    var search=document.querySelector('#v32FilterSearch');
    if(search)search.oninput=function(){filterQuery=search.value;renderFilterGridOnly()};
    bindFilterTiles();
    return;
  }

  document.querySelectorAll('[data-v32-tab]').forEach(function(button){
    button.onclick=function(){
      activeTab=button.dataset.v32Tab;
      localStorage.setItem('v32-rankings-tab',activeTab);
      expanded=-1;render();
    };
  });
  document.querySelectorAll('[data-v32-back]').forEach(function(button){button.onclick=function(){location.hash='#/more'}});
  document.querySelectorAll('[data-v32-share]').forEach(function(button){button.onclick=share});
  document.querySelectorAll('[data-v32-season]').forEach(function(button){button.onclick=seasonPopover});
  document.querySelectorAll('[data-v32-info]').forEach(function(button){
    button.onclick=function(){
      if(button.dataset.v32Info==='season-type')toast('Ranking por temporada');
      else toast('Clasificación oficial de Primera Fuerza');
    };
  });
  var filter=document.querySelector('[data-v32-filter]');
  if(filter)filter.onclick=function(){
    pendingClub=selectedClub;
    pendingFederation=selectedFederation;
    filterQuery='';
    filterMode=true;
    render();
  };
  var clear=document.querySelector('[data-v32-clear-club]');
  if(clear)clear.onclick=function(){
    selectedClub='';pendingClub='';localStorage.removeItem('v32-rankings-club');expanded=-1;render();
  };
  document.querySelectorAll('[data-v32-fed]').forEach(function(button){
    button.onclick=function(){var row=federationRows[Number(button.dataset.v32Fed)];if(row)toast(row[1]+' · '+row[2]+' jugadores · '+row[3]+' equipos')};
  });
  document.querySelectorAll('[data-v32-club]').forEach(function(button){
    button.onclick=function(){var index=Number(button.dataset.v32Club);expanded=expanded===index?-1:index;render()};
  });
  document.querySelectorAll('[data-v32-open-team]').forEach(function(button){
    button.onclick=function(event){
      event.stopPropagation();
      var row=clubRows.find(function(r){return r[0]===button.dataset.v32OpenTeam});
      if(row&&window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(row[1]);return}
      if(row)localStorage.setItem('v62-team-name',row[1]);
      location.hash='#/teamDetail';
    };
  });
}
function render(){
  var active=route()==='rankings';
  document.body.classList.toggle('v32-rankings-active',active);
  if(!active){closePopover();filterMode=false;return}
  var screen=document.querySelector('#screen');if(!screen)return;
  screen.innerHTML=markup();setBottomNav();bind();
}
function schedule(){requestAnimationFrame(function(){requestAnimationFrame(render)})}
window.addEventListener('hashchange',schedule);
var target=document.querySelector('#screen');
if(target)new MutationObserver(function(){
  if(route()==='rankings'&&!target.querySelector('[data-v32-rankings]'))schedule();
}).observe(target,{childList:true,subtree:false});
document.addEventListener('click',function(event){
  var p=document.querySelector('.v32-popover');if(!p)return;
  if(event.target.closest('.v32-popover')||event.target.closest('[data-v32-season]'))return;
  closePopover();
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();