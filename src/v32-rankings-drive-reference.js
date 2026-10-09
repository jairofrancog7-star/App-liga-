/* PARTS32 — functional Rankings screen based on the Drive references + filter flow from the supplied video. */
/* V732_RANKINGS_FILTER_VIDEO */
/* V733_FILTER_RETURN_SAME_PLACE */
/* V734_CATEGORY_FILTER_GLOBAL_SYNC */
/* V735_FILTER_FULL_TABLE */
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
var selectedClubCategory=localStorage.getItem('v32-rankings-club-category')||'';

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
if(selectedClubCategory&&!federationRows.some(function(row){return row[0]===selectedClubCategory})){
  selectedClubCategory='';
  localStorage.removeItem('v32-rankings-club-category');
}
if(activeTab!=='federations'&&activeTab!=='clubs'){
  activeTab='clubs';
  localStorage.setItem('v32-rankings-tab','clubs');
}

var pendingClub=selectedClub;
var pendingFederation=selectedFederation;
var pendingClubCategory=selectedClubCategory;
var filterMode=false;
var filterQuery='';
var expanded=-1;
var filterReturnScroll=0;
var clubOrder=localStorage.getItem('v32-rankings-club-order')==='az'?'az':'points';

function route(){return location.hash.replace('#/','')||'home'}
function esc(value){
  return String(value==null?'':value).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function clubByCode(code){return clubRows.find(function(row){return row[0]===code})||null}
function categoryByCode(code){return federationRows.find(function(row){return row[0]===code})||null}
function clubCategoryId(code){return ({CAT1:'1',CAT2:'2',CAT3:'3',CAT4:'4',CAT5:'5'})[code]||'3'}
function syncCategoryContext(code){
  var id=clubCategoryId(code);
  try{
    localStorage.setItem('v62-category',id);
    localStorage.setItem('v12-fixture-cat',id);
    localStorage.setItem('v176-table-category',id);
    localStorage.setItem('v422-results-category',id);
  }catch(_){}
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      try{
        if(window.LJR_V449&&typeof window.LJR_V449.setCategory==='function')window.LJR_V449.setCategory(id);
        else if(window.LJR_V449&&typeof window.LJR_V449.ensure==='function')window.LJR_V449.ensure();
      }catch(_){}
      try{window.dispatchEvent(new CustomEvent('ljr:category-change',{detail:{category:id,source:'rankings-filter'}}))}catch(_){}
    });
  });
  return id;
}
function norm(value){
  try{return String(value==null?'':value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
  catch(_){return String(value==null?'':value).toLowerCase().trim()}
}
function officialDb(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}
  catch(_){return window.LJR_OFFICIAL_DATA||null}
}
function teamCode(name){
  var hit=clubRows.find(function(row){return norm(row[1])===norm(name)});
  if(hit)return hit[0];
  return 'TEAM-'+String(name||'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,28);
}
function rankingClubRows(){
  var code=selectedClubCategory||'CAT3',catId=clubCategoryId(code),db=officialDb();
  var rows=db?.categories?.[catId]?.standings?.[0]?.rows||[];
  if(Array.isArray(rows)&&rows.some(function(row){return Array.isArray(row)&&row[1]})){
    return rows.filter(function(row){return Array.isArray(row)&&String(row[1]||'').trim()}).map(function(row,index){
      return [teamCode(row[1]),String(row[1]).trim(),String(row[9]??'—'),code,String(row[0]??(index+1))];
    });
  }
  if(code==='CAT3')return clubRows.map(function(row,index){return [row[0],row[1],row[2],code,String(index+1)]});
  return [];
}
function backIcon(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.25"/><circle cx="6" cy="12" r="2.25"/><circle cx="18" cy="19" r="2.25"/><path d="m8.1 10.9 7.6-4.5M8.1 13.1l7.6 4.5"/></svg>'}
function filterIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M8 12h8M10.5 17h3"/></svg>'}
function searchIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 5.1 5.1"/></svg>'}
function logo(code,name,extra){
  var cls='v32-logo'+(extra?' '+extra:''),src='';
  var path=LOGOS[code];
  if(path)src=BASE+path;
  if(!src){
    var db=officialDb(),entry=Object.entries(db?.team_logos||{}).find(function(pair){return norm(pair[0])===norm(name)});
    var meta=entry&&entry[1];
    if(meta?.local)src=BASE+String(meta.local).replace(/^\.\//,'');
    else if(meta?.source)src=String(meta.source);
  }
  if(src){
    return '<span class="'+cls+'"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><span class="v32-logo-fallback" style="display:none">'+esc(code)+'</span></span>';
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
  var selected=categoryByCode(selectedClubCategory);
  return '<div class="v32-controls clubs '+(selected?'has-club-filter':'')+'">'+
    '<button type="button" class="v32-select v32-coefficient" data-v32-info="club-coefficient"><span>Coeficientes de clubes</span><i class="v32-chevron"></i></button>'+
    '<button type="button" class="v32-select v32-season-select" data-v32-season><span>'+esc(season)+'</span><i class="v32-chevron"></i></button>'+
    (selected?'<button type="button" class="v32-selected-club" data-v32-clear-club><span>'+esc(selected[1])+'</span><i>×</i></button>':'')+
    '<button type="button" class="v32-filter '+(selected?'active':'')+'" data-v32-filter aria-label="Filtrar por categoría">'+filterIcon()+'</button>'+
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
function filteredCategoryStandingRows(){
  if(!selectedFederation)return [];
  var id=clubCategoryId(selectedFederation),db=officialDb();
  var rows=db?.categories?.[id]?.standings?.[0]?.rows||[];
  return rows.filter(function(r){return Array.isArray(r)&&String(r[1]||'').trim()});
}
function filteredCategoryTable(){
  var selected=categoryByCode(selectedFederation);
  var rows=filteredCategoryStandingRows();
  var label=selected?selected[1]:'Categoría';
  return '<section class="v32-card v32-filtered-standings-card">'+
    '<div class="v32-filtered-title"><div><small>CLASIFICACIÓN COMPLETA</small><strong>'+esc(label)+'</strong></div><span>'+esc(rows.length)+' equipos</span></div>'+
    '<div class="v32-full-table-scroll">'+
      '<div class="v32-full-table">'+
        '<div class="v32-full-head"><span>POS</span><span>CLUB</span><span>PJ</span><span>PG</span><span>PE</span><span>PP</span><span>GF</span><span>GC</span><span>DG</span><span>PTS</span></div>'+
        (rows.length?rows.map(function(r,i){
          var name=String(r[1]||'').trim();
          return '<button type="button" class="v32-full-row" data-v32-open-team="'+esc(name)+'">'+
            '<span>'+(r[0]??(i+1))+'</span>'+
            '<span class="v32-full-team">'+logo(teamCode(name),name)+'<b>'+esc(name)+'</b></span>'+
            '<span>'+esc(r[2]??'—')+'</span><span>'+esc(r[3]??'—')+'</span><span>'+esc(r[4]??'—')+'</span><span>'+esc(r[5]??'—')+'</span>'+
            '<span>'+esc(r[6]??'—')+'</span><span>'+esc(r[7]??'—')+'</span><span>'+esc(r[8]??'—')+'</span><strong>'+esc(r[9]??'—')+'</strong>'+
          '</button>';
        }).join(''):'<div class="v32-full-empty">No hay clasificación publicada para '+esc(label)+'.</div>')+
      '</div>'+
    '</div>'+
  '</section>';
}
function fedView(){
  if(selectedFederation){
    return fedControls()+filteredCategoryTable();
  }
  return fedControls()+
    '<section class="v32-card v32-fed-card">'+
      '<div class="v32-fed-head"><span>Categoría</span><span>Jugadores</span><span>Equipos</span></div>'+
      '<div class="v32-fed-group">Liga Municipal de Fútbol Juventino Rosas</div>'+fedRows()+
    '</section>';
}
function filteredClubRows(){
  var rows=rankingClubRows().slice();
  if(clubOrder==='az')rows.sort(function(a,b){return String(a[1]||'').localeCompare(String(b[1]||''),'es')});
  return rows;
}
function clubItems(){
  var rows=filteredClubRows(),selectedCategory=categoryByCode(selectedClubCategory||'CAT3');
  if(!rows.length){
    return '<div class="v32-empty-state">No hay clasificación disponible para '+esc(selectedCategory?selectedCategory[1]:'esta categoría')+'.</div>';
  }
  return rows.map(function(row,index){
    var originalIndex=index,isOpen=expanded===originalIndex;
    return '<div class="v32-club-item v190-club-item">'+
      '<button type="button" class="v32-fed-row v32-club-row v190-club-row '+(isOpen?'expanded':'')+'" data-v32-club="'+originalIndex+'">'+
        '<span class="v32-pos">'+esc(row[4]||String(index+1))+'</span>'+logo(row[0],row[1])+
        '<span class="v32-fed-name v32-club-copy"><b>'+esc(row[1])+'</b><small>'+esc(selectedCategory?selectedCategory[1]:'Liga Juventino Rosas')+'</small></span>'+
        '<strong class="v32-fed-points v32-club-points">'+esc(row[2])+'</strong><i class="v32-row-chevron"></i>'+
      '</button>'+
      '<div class="v32-club-detail '+(isOpen?'show':'')+'"><span>Juventino Rosas · '+esc(selectedCategory?selectedCategory[1]:'Categoría')+' · Clasificación oficial</span><button type="button" data-v32-open-team="'+esc(row[1])+'">Ver equipo</button></div>'+
    '</div>';
  }).join('');
}
function clubsView(){
  return clubsControls()+
    '<section class="v32-card v32-fed-card v32-club-card v190-club-card">'+
      '<div class="v32-fed-head v32-club-head v190-club-head"><span>Club</span><span>Puntos</span><span></span></div>'+
      '<div class="v32-fed-group v190-club-group">Liga Municipal de Fútbol Juventino Rosas</div>'+
      clubItems()+
    '</section>';
}
function filterGrid(){
  var q=filterQuery.trim().toLocaleLowerCase('es');
  var isFed=activeTab==='federations';
  var source=federationRows;
  var rows=source.filter(function(row){return !q||row[1].toLocaleLowerCase('es').includes(q)});
  return rows.map(function(row){
    var checked=isFed?pendingFederation===row[0]:pendingClubCategory===row[0];
    var attr=isFed?'data-v32-pick-fed':'data-v32-pick-club-category';
    return '<button type="button" class="v32-filter-club '+(checked?'selected':'')+'" '+attr+'="'+esc(row[0])+'">'+
      '<span class="v32-filter-club-logo">'+logo(row[0],row[1],'filter')+(checked?'<i class="v32-filter-check">✓</i>':'')+'</span>'+
      '<span>'+esc(row[1])+'</span>'+
    '</button>';
  }).join('');
}
function filterScreen(){
  var label='Categorías';
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
var openRankingMenuAnchor=null;
function closePopover(){
  var p=document.querySelector('.v32-popover');if(p)p.remove();
  if(openRankingMenuAnchor){
    openRankingMenuAnchor.classList.remove('v993-dropdown-open');
    openRankingMenuAnchor.setAttribute('aria-expanded','false');
    openRankingMenuAnchor.removeAttribute('aria-controls');
    openRankingMenuAnchor=null;
  }
}
function menuAt(anchor,title,items){
  if(!anchor)return;
  /* The same arrow closes the dropdown on its second tap. */
  if(openRankingMenuAnchor===anchor&&document.querySelector('.v993-rankings-menu')){closePopover();return}
  closePopover();
  var p=document.createElement('div');
  p.className='v32-popover v992-rankings-menu v993-rankings-menu';
  p.id='v993-rankings-dropdown';
  p.setAttribute('role','listbox');
  p.setAttribute('aria-label',title);
  p.innerHTML=items.map(function(item,i){
    var selected=!!item.active;
    return '<button type="button" role="option" aria-selected="'+selected+'" data-v992-choice="'+i+'" class="v993-menu-option'+(selected?' active':'')+'">'+
      '<span class="v993-menu-label">'+esc(item.label)+'</span>'+
      (selected?'<svg class="v993-menu-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg>':'')+
    '</button>';
  }).join('');
  document.body.appendChild(p);
  openRankingMenuAnchor=anchor;
  anchor.classList.add('v993-dropdown-open');
  anchor.setAttribute('aria-expanded','true');
  anchor.setAttribute('aria-haspopup','listbox');
  anchor.setAttribute('aria-controls',p.id);
  var bounds=anchor.getBoundingClientRect();
  var width=Math.min(440,window.innerWidth-26,Math.round(window.innerWidth*.83));
  var left=Math.max(13,Math.min(window.innerWidth-width-13,bounds.left+8));
  var top=bounds.bottom+6;
  if(top+p.offsetHeight>window.innerHeight-12){
    top=Math.max(12,bounds.top-p.offsetHeight-6);
  }
  p.style.setProperty('width',width+'px','important');
  p.style.setProperty('left',left+'px','important');
  p.style.setProperty('top',top+'px','important');
  p.style.setProperty('bottom','auto','important');
  p.style.setProperty('transform','none','important');
  p.querySelectorAll('[data-v992-choice]').forEach(function(b){
    b.onclick=function(){
      var item=items[Number(b.dataset.v992Choice)];
      closePopover();
      if(item&&item.action)item.action();
    };
  });
}
function seasonPopover(anchor){
  menuAt(anchor,'Temporada',[
    {label:'Temporada actual',active:true,action:function(){season='Temporada actual';toast('Mostrando temporada actual')}},
    {label:'Ver clasificación por categorías',active:false,action:function(){
      activeTab='federations';localStorage.setItem('v32-rankings-tab',activeTab);expanded=-1;render();
      var sc=document.querySelector('#screen');if(sc)sc.scrollTop=0;
    }}
  ]);
}
function beginFilter(){
  pendingClub=selectedClub;
  pendingFederation=selectedFederation;
  pendingClubCategory=selectedClubCategory;
  var screen=document.querySelector('#screen');
  filterReturnScroll=screen?screen.scrollTop||0:window.scrollY||0;
  filterQuery='';
  filterMode=true;
  closePopover();
  render();
  if(screen)screen.scrollTo({top:0,left:0,behavior:'auto'});
}
function rankingOptions(button){
  if(activeTab==='clubs'){
    menuAt(button,'Coeficientes de clubes',[
      {label:'Coeficientes de clubes',active:clubOrder==='points',action:function(){clubOrder='points';localStorage.setItem('v32-rankings-club-order',clubOrder);expanded=-1;render()}},
      {label:'Ordenar clubes por nombre (A-Z)',active:clubOrder==='az',action:function(){clubOrder='az';localStorage.setItem('v32-rankings-club-order',clubOrder);expanded=-1;render()}},
      {label:'Filtrar por categoría',active:false,action:beginFilter}
    ]);
  }else{
    menuAt(button,'Clasificación por categorías',[
      {label:'Todas las categorías',active:!selectedFederation,action:function(){selectedFederation='';pendingFederation='';localStorage.removeItem('v32-rankings-federation');render()}},
      {label:'Seleccionar una categoría',active:!!selectedFederation,action:beginFilter}
    ]);
  }
}
function setBottomNav(){/* Global nav state/labels/icons are owned by V34. */}
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
function restoreFilterReturn(){
  var y=Math.max(0,Number(filterReturnScroll)||0);
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      var screen=document.querySelector('#screen');
      if(screen)screen.scrollTo({top:y,left:0,behavior:'auto'});
      else window.scrollTo({top:y,left:0,behavior:'auto'});
    });
  });
}
function closeFilterToRanking(){
  filterQuery='';
  filterMode=false;
  expanded=-1;
  render();
  restoreFilterReturn();
}
function bindFilterTiles(){
  document.querySelectorAll('[data-v32-pick-club-category]').forEach(function(button){
    button.onclick=function(){
      var code=String(button.dataset.v32PickClubCategory||'');
      if(!code)return;
      pendingClubCategory=code;
      selectedClubCategory=code;
      activeTab='clubs';
      localStorage.setItem('v32-rankings-tab','clubs');
      localStorage.setItem('v32-rankings-club-category',code);
      syncCategoryContext(code);
      closeFilterToRanking();
    };
  });
  document.querySelectorAll('[data-v32-pick-fed]').forEach(function(button){
    button.onclick=function(){
      var code=String(button.dataset.v32PickFed||'');
      if(!code)return;
      pendingFederation=code;
      selectedFederation=code;
      activeTab='federations';
      localStorage.setItem('v32-rankings-tab','federations');
      localStorage.setItem('v32-rankings-federation',code);
      syncCategoryContext(code);
      closeFilterToRanking();
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
      pendingClubCategory=selectedClubCategory;
      closeFilterToRanking();
    };
    if(done)done.onclick=function(){
      if(activeTab==='federations'){
        selectedFederation=pendingFederation;
        if(selectedFederation){
          localStorage.setItem('v32-rankings-federation',selectedFederation);
          syncCategoryContext(selectedFederation);
        }else localStorage.removeItem('v32-rankings-federation');
      }else{
        selectedClubCategory=pendingClubCategory;
        if(selectedClubCategory){
          localStorage.setItem('v32-rankings-club-category',selectedClubCategory);
          syncCategoryContext(selectedClubCategory);
        }else{
          localStorage.removeItem('v32-rankings-club-category');
        }
      }
      closeFilterToRanking();
    };
    var search=document.querySelector('#v32FilterSearch');
    if(search)search.oninput=function(){filterQuery=search.value;renderFilterGridOnly()};
    bindFilterTiles();
    return;
  }

  document.querySelectorAll('[data-v32-tab]').forEach(function(button){
    button.onclick=function(){
      if(activeTab===button.dataset.v32Tab)return;
      activeTab=button.dataset.v32Tab;
      closePopover();
      localStorage.setItem('v32-rankings-tab',activeTab);
      expanded=-1;render();
      var scroll=document.querySelector('#screen');if(scroll)scroll.scrollTop=0;
    };
  });
  document.querySelectorAll('[data-v32-back]').forEach(function(button){button.onclick=function(){location.hash='#/more'}});
  document.querySelectorAll('[data-v32-share]').forEach(function(button){button.onclick=share});
  document.querySelectorAll('[data-v32-season]').forEach(function(button){button.onclick=function(){seasonPopover(button)}});
  document.querySelectorAll('[data-v32-info]').forEach(function(button){button.onclick=function(){rankingOptions(button)}});
  var filter=document.querySelector('[data-v32-filter]');
  if(filter)filter.onclick=beginFilter;
  var clear=document.querySelector('[data-v32-clear-club]');
  if(clear)clear.onclick=function(){
    selectedClubCategory='';pendingClubCategory='';localStorage.removeItem('v32-rankings-club-category');expanded=-1;render();
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
      var name=String(button.dataset.v32OpenTeam||'').trim();
      if(name&&window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(name);return}
      if(name)localStorage.setItem('v62-team-name',name);
      location.hash='#/teamDetail';
    };
  });
}
function positionClubControls(){
  var controls=document.querySelector('.v32-controls.clubs.has-club-filter');
  if(!controls)return;
  requestAnimationFrame(function(){
    if(window.getComputedStyle(controls).display==='flex')controls.scrollLeft=Math.max(0,controls.scrollWidth-controls.clientWidth);
    else controls.scrollLeft=0;
  });
}
function render(){
  var active=route()==='rankings';
  document.body.classList.toggle('v32-rankings-active',active);
  if(!active){closePopover();filterMode=false;return}
  var screen=document.querySelector('#screen');if(!screen)return;
  screen.innerHTML=markup();setBottomNav();bind();positionClubControls();
}
function schedule(){requestAnimationFrame(function(){requestAnimationFrame(render)})}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
var target=document.querySelector('#screen');
if(target)new MutationObserver(function(){
  if(route()==='rankings'&&!target.querySelector('[data-v32-rankings]'))schedule();
}).observe(target,{childList:true,subtree:false});
document.addEventListener('click',function(event){
  var p=document.querySelector('.v32-popover');if(!p)return;
  if(event.target.closest('.v32-popover')||event.target.closest('[data-v32-season]')||event.target.closest('[data-v32-info]'))return;
  closePopover();
});
document.addEventListener('keydown',function(event){
  if(event.key==='Escape'&&document.querySelector('.v32-popover')){
    var anchor=openRankingMenuAnchor;closePopover();if(anchor&&anchor.isConnected)anchor.focus();
  }
});
var rankingsScroll=document.querySelector('#screen');
if(rankingsScroll)rankingsScroll.addEventListener('scroll',function(){
  if(document.querySelector('.v993-rankings-menu'))closePopover();
},{passive:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();