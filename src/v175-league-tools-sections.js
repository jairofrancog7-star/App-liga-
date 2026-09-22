/* V175 — Orden por secciones en Más herramientas.
   Reagrupa los botones existentes sin cambiar rutas, eventos ni funciones. */
(function(){
  'use strict';
  if(window.__LJR_V175_TOOL_SECTIONS__)return;
  window.__LJR_V175_TOOL_SECTIONS__=true;

  const GROUPS=[
    {id:'league',icon:'◫',title:'Liga y consulta',sub:'Equipos, jugadores, historia, búsqueda y reglamento'},
    {id:'match',icon:'⚽',title:'Partidos y jornada',sub:'Match Day, calendario, campos, clima y avisos'},
    {id:'competition',icon:'▥',title:'Competición y estadísticas',sub:'Tabla, liguilla, simuladores y rendimiento'},
    {id:'players',icon:'▣',title:'Jugadores y documentos',sub:'Registro, credenciales, cédulas y disciplina'},
    {id:'tactics',icon:'⌁',title:'Táctica y análisis',sub:'Pizarra, táctica 3D y mapa de tiros'},
    {id:'communication',icon:'↗',title:'Comunicación y publicaciones',sub:'Noticias, WhatsApp, boletines, TV y Fan Zone'},
    {id:'admin',icon:'⚙',title:'Administración',sub:'Control de Liga e instalación de la app'}
  ];

  function route(){
    return document.body?.dataset?.appRoute || location.hash.replace(/^#\/?/,'').split('?')[0] || '';
  }
  function norm(v){
    return String(v||'')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/\s+/g,' ').trim();
  }
  function cardKey(btn){
    return [
      btn.getAttribute('data-route')||'',
      btn.getAttribute('data-v100-route')||'',
      btn.getAttribute('data-v100-action')||'',
      btn.getAttribute('data-v60-comp')||'',
      btn.getAttribute('data-v63-official')||'',
      btn.hasAttribute('data-v161-open-whatsapp')?'whatsapp-admin':'',
      norm(btn.textContent||'')
    ].join('|');
  }
  function classify(btn){
    const k=cardKey(btn);

    if(/jr control|central oficial|instalar app/.test(k)) return 'admin';

    if(/whatsapp|publicaciones|boletin|noticias y avisos|fan zone|modo tv|registrarse y recibir avisos|avisos/.test(k))
      return 'communication';

    if(/pizarra|tacticas|tactica 3d|shot map|mapa de tiros/.test(k))
      return 'tactics';

    if(/cedula|credencial|registro de jugadores|nueva sancion|delegados|directorio/.test(k))
      return 'players';

    if(/tabla y estadisticas|exportar tabla|liguilla|cuadro png|simulador|jornada animada|rendimiento/.test(k))
      return 'competition';

    if(/match day|centro de jornada|match center|partidos y jornadas|jornadas|preparar mi jornada|programar partido|donde se juega|clima|suspension|notificaciones/.test(k))
      return 'match';

    return 'league';
  }
  function bar(g,count){
    const el=document.createElement('div');
    el.className='v175-section-bar';
    el.dataset.v175SectionBar=g.id;
    el.innerHTML=
      '<span class="v175-section-icon" aria-hidden="true">'+g.icon+'</span>'+
      '<span class="v175-section-copy"><b>'+g.title+'</b><small>'+g.sub+'</small></span>'+
      '<span class="v175-section-count">'+count+'</span>';
    return el;
  }
  function featuredBar(){
    const el=document.createElement('div');
    el.className='v175-featured-bar';
    el.dataset.v175FeaturedBar='1';
    el.innerHTML=
      '<span class="v175-section-icon" aria-hidden="true">★</span>'+
      '<span class="v175-section-copy"><b>Accesos rápidos</b><small>Las funciones que más se consultan</small></span>';
    return el;
  }

  let busy=false;
  function organize(){
    if(busy||route()!=='leagueTools')return;
    const page=document.querySelector('body[data-app-route="leagueTools"] .v60-tool-page');
    const grid=page?.querySelector('.v60-tool-grid');
    if(!page||!grid)return;

    const featured=page.querySelector('.v60-tools-featured');
    if(featured&&!page.querySelector('[data-v175-featured-bar]')){
      featured.insertAdjacentElement('beforebegin',featuredBar());
    }

    const cards=[...grid.children].filter(el=>el.matches?.('button.v60-tool-card'));
    if(!cards.length)return;

    const sig=cards.map(cardKey).sort().join('||');
    if(grid.dataset.v175Signature===sig && grid.querySelectorAll('[data-v175-section-bar]').length>=GROUPS.length-1)return;

    busy=true;
    try{
      grid.querySelectorAll('[data-v175-section-bar]').forEach(x=>x.remove());

      const buckets=new Map(GROUPS.map(g=>[g.id,[]]));
      cards.forEach(btn=>{
        const id=classify(btn);
        btn.dataset.v175Group=id;
        (buckets.get(id)||buckets.get('league')).push(btn);
      });

      const frag=document.createDocumentFragment();
      GROUPS.forEach(g=>{
        const items=buckets.get(g.id)||[];
        if(!items.length)return;
        frag.appendChild(bar(g,items.length));
        items.forEach(btn=>frag.appendChild(btn));
      });

      grid.appendChild(frag);
      grid.dataset.v175Signature=sig;
    } finally {
      busy=false;
    }
  }

  let raf=0;
  function schedule(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>setTimeout(organize,20));
  }

  window.addEventListener('hashchange',schedule);
  window.addEventListener('load',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});

  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});

  schedule();
  setTimeout(schedule,300);
  setTimeout(schedule,1000);
})();
