/* V1212 — Auditoría local mejorada de Liga Juventino Rosas.
 * Mejora únicamente la presentación/consulta del registro V105.
 * No eleva permisos, no publica información ni finge un backend.
 */
(function () {
  'use strict';
  var KEY='v105-activity';
  var TITLES={
    'sponsors':'Patrocinadores','meeting':'Juntas y acuerdos','delegates':'Delegados',
    'officials':'Árbitros y oficiales','incidents':'Incidencias del partido',
    'calendar-generator':'Calendarios oficiales','csv-import':'Importar CSV',
    'backup-export':'Respaldo local','audit':'Auditoría','poll':'Encuestas',
    'register-alerts':'Registro de avisos','schedule-match':'Programar partido',
    'new-sanction':'Nueva sanción','motm':'Jugador del partido',
    'whatsapp-ocr':'WhatsApp','tv-panel':'Panel de transmisión'
  };
  var formatter=new Intl.DateTimeFormat('es-MX',{dateStyle:'medium',timeStyle:'short'});
  var dayFormatter=new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric'});

  function html(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function normalize(value){
    return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  }
  function read(){
    try{
      var parsed=JSON.parse(localStorage.getItem(KEY)||'[]');
      if(!Array.isArray(parsed))return [];
      return parsed.filter(function(item){return item&&typeof item==='object';})
        .map(function(item,index){
          var at=typeof item.at==='string'?item.at:'';
          var time=Date.parse(at);
          var original=String(item.action||'Actividad sin descripción').slice(0,300);
          return {id:index,at:at,time:Number.isFinite(time)?time:0,original:original};
        }).sort(function(a,b){return b.time-a.time;});
    }catch(_){return [];}
  }
  function label(original){
    var value=original.replace(/^Herramienta de Liga Control:\s*/i,'')
      .replace(/^Herramienta\s+/i,'');
    if(TITLES[value])return /^Herramienta/i.test(original)?'Abrir · '+TITLES[value]:TITLES[value];
    return original.replace(/register-alerts/gi,'Registro de avisos')
      .replace(/\bbackup-export\b/gi,'Respaldo local')
      .replace(/\bcsv-import\b/gi,'Importar CSV');
  }
  function type(item){
    var match=item.original.match(/^Herramienta(?: de Liga Control:|\s+)\s*(.+)$/i);
    if(match)return TITLES[match[1]]||match[1];
    var txt=normalize(item.original);
    if(/respaldo|backup/.test(txt))return 'Respaldos';
    if(/csv|importar/.test(txt))return 'Importaciones';
    if(/audit|auditor/.test(txt))return 'Auditoría';
    if(/aviso|alert/.test(txt))return 'Avisos';
    if(/sancion|expuls/.test(txt))return 'Sanciones';
    return 'Otras acciones';
  }
  function dateKey(ms){
    var d=new Date(ms);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function formatDate(item){
    return item.time?formatter.format(new Date(item.time)):'Fecha no disponible';
  }
  function sectionName(item){
    if(!item.time)return 'Sin fecha';
    var today=dateKey(Date.now());
    var yesterday=dateKey(Date.now()-86400000);
    var date=dateKey(item.time);
    if(date===today)return 'Hoy';
    if(date===yesterday)return 'Ayer';
    return dayFormatter.format(new Date(item.time));
  }
  function icon(kind){
    var p={
      backup:'<path d="M4 17v3h16v-3M12 3v13m-5-5 5 5 5-5"/>',
      file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8"/>',
      tool:'<path d="M14 7a5 5 0 0 0-6.6 6.6L3 18l3 3 4.4-4.4A5 5 0 0 0 17 10l-3 3-3-3z"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
    };
    return '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">'+(p[kind]||p.clock)+'</svg>';
  }
  function kind(item){
    var t=normalize(type(item));
    return /respaldo/.test(t)?'backup':/import|csv/.test(t)?'file':/auditor/.test(t)?'clock':'tool';
  }
  function download(name,mime,source){
    try{
      var url=URL.createObjectURL(new Blob([source],{type:mime}));
      var a=document.createElement('a');
      a.href=url;a.download=name;document.body.appendChild(a);a.click();
      setTimeout(function(){URL.revokeObjectURL(url);a.remove();},1500);
      return true;
    }catch(_){return false;}
  }
  function csvCell(value){
    var s=String(value==null?'':value);
    if(/^[\s]*[=+\-@]/.test(s))s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  function clipboard(value){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(value);
    return new Promise(function(resolve,reject){
      var box=document.createElement('textarea');
      box.value=value;box.style.position='fixed';box.style.opacity='0';document.body.appendChild(box);
      box.select();
      try{if(document.execCommand('copy'))resolve();else reject(new Error('No se pudo copiar'));}
      catch(err){reject(err);}finally{box.remove();}
    });
  }
  function enhance(modal){
    if(!modal||modal.classList.contains('v1212-audit-modal'))return;
    var dialog=modal.querySelector('.v105-dialog');
    var heading=dialog&&dialog.querySelector(':scope > h3');
    var oldList=dialog&&dialog.querySelector(':scope > .v105-list');
    if(!heading||!oldList||!/^Auditoría de herramientas\s*$/.test((heading.textContent||'').trim()))return;
    modal.classList.add('v1212-audit-modal');
    var description=dialog.querySelector(':scope > p');
    if(description)description.textContent='Consulta y exporta acciones guardadas en este navegador. No es un registro administrativo del servidor.';
    var root=document.createElement('section');
    root.className='v1212-audit';root.setAttribute('aria-label','Historial local de herramientas');
    root.innerHTML=
      '<div class="v1212-header"><span class="v1212-pill">● REGISTRO LOCAL</span><span class="v1212-limit">Historial del navegador · máximo 50 entradas</span></div>'+
      '<div class="v1212-metrics" aria-label="Resumen de actividad">'+
      '<div><b data-a-total>0</b><span>Movimientos</span></div>'+
      '<div><b data-a-today>0</b><span>Hoy</span></div>'+
      '<div><b data-a-match>0</b><span>Resultados</span></div></div>'+
      '<div class="v1212-filters">'+
      '<label class="v1212-search-label"><span>Buscar actividad</span><input type="search" data-a-search placeholder="Ej. Respaldo, avisos, CSV…" autocomplete="off"></label>'+
      '<label><span>Herramienta</span><select data-a-type><option value="">Todas las herramientas</option></select></label>'+
      '<div class="v1212-dates">'+
      '<label><span>Desde</span><input type="date" data-a-from></label>'+
      '<label><span>Hasta</span><input type="date" data-a-to></label></div>'+
      '<div class="v1212-presets" role="group" aria-label="Periodo">'+
      '<button type="button" data-a-preset="all" aria-pressed="true">Todas</button>'+
      '<button type="button" data-a-preset="today" aria-pressed="false">Hoy</button>'+
      '<button type="button" data-a-preset="week" aria-pressed="false">7 días</button>'+
      '<button type="button" data-a-reset>Limpiar filtros</button></div></div>'+
      '<div class="v1212-results-head"><strong>Movimientos registrados</strong><span data-a-caption aria-live="polite"></span></div>'+
      '<div class="v1212-timeline" data-a-rows></div>'+
      '<button class="v1212-more" type="button" data-a-more hidden>Mostrar más actividades</button>'+
      '<div class="v1212-export"><button type="button" data-a-csv>↓ Descargar CSV</button>'+
      '<button type="button" data-a-json>↓ Descargar JSON</button></div>'+
      '<p class="v1212-disclaimer">Los datos se almacenan únicamente en este navegador y pueden perderse al borrar sus datos. No se identifica al usuario responsable ni se garantiza que el historial no haya sido modificado. Descarga un respaldo periódicamente.</p>'+
      '<div class="v1212-feedback" data-a-feedback role="status" aria-live="polite"></div>';
    oldList.replaceWith(root);
    var search=root.querySelector('[data-a-search]');
    var select=root.querySelector('[data-a-type]');
    var from=root.querySelector('[data-a-from]');
    var to=root.querySelector('[data-a-to]');
    var rows=root.querySelector('[data-a-rows]');
    var state={preset:'all',shown:12,filtered:[],items:[]};

    function reload(){
      state.items=read();
      var options=Array.from(new Set(state.items.map(type))).sort(function(a,b){return a.localeCompare(b,'es');});
      var previous=select.value;
      select.innerHTML='<option value="">Todas las herramientas</option>'+options.map(function(x){return '<option value="'+html(x)+'">'+html(x)+'</option>';}).join('');
      select.value=options.includes(previous)?previous:'';
      render();
    }
    function render(){
      var term=normalize(search.value.trim());
      var first=from.value,last=to.value;
      var now=Date.now(),today=dateKey(now),firstDay=new Date(now);firstDay.setHours(0,0,0,0);firstDay.setDate(firstDay.getDate()-6);var since=firstDay.getTime();
      state.filtered=state.items.filter(function(item){
        var d=item.time?dateKey(item.time):'';
        var matchesTerm=!term||normalize(label(item.original)+' '+item.original+' '+type(item)+' '+formatDate(item)).includes(term);
        if(!matchesTerm||(select.value&&type(item)!==select.value))return false;
        if(first&&(!d||d<first))return false;
        if(last&&(!d||d>last))return false;
        if(state.preset==='today'&&d!==today)return false;
        if(state.preset==='week'&&(!item.time||item.time<since))return false;
        return true;
      });
      root.querySelector('[data-a-total]').textContent=String(state.items.length);
      root.querySelector('[data-a-today]').textContent=String(state.items.filter(function(item){return item.time&&dateKey(item.time)===today;}).length);
      root.querySelector('[data-a-match]').textContent=String(state.filtered.length);
      root.querySelector('[data-a-caption]').textContent=state.filtered.length+' de '+state.items.length;
      root.querySelectorAll('[data-a-preset]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.aPreset===state.preset));});
      var displayed=state.filtered.slice(0,state.shown);
      var lastSection='';
      rows.innerHTML=displayed.map(function(item,i){
        var section=sectionName(item);
        var heading=section===lastSection?'':'<div class="v1212-day">'+html(section)+'</div>';
        lastSection=section;
        return heading+'<article class="v1212-item">'+
          '<div class="v1212-item-main"><span class="v1212-item-icon">'+icon(kind(item))+'</span>'+
          '<div class="v1212-item-text"><b>'+html(label(item.original))+'</b>'+
          '<small>'+html(formatDate(item))+' · '+html(type(item))+'</small></div></div>'+
          '<details><summary>Ver detalles</summary><div class="v1212-details">'+
          '<div><span>Acción original</span><strong>'+html(item.original)+'</strong></div>'+
          '<div><span>Fecha ISO</span><strong>'+html(item.at||'No disponible')+'</strong></div>'+
          '<div><span>Fuente</span><strong>Registro local V105</strong></div>'+
          '<button type="button" data-a-copy="'+i+'">Copiar actividad</button></div></details></article>';
      }).join('')||(state.items.length?
        '<div class="v1212-empty">No hay movimientos con esos filtros. Prueba otro periodo o búsqueda.</div>':
        '<div class="v1212-empty">Todavía no hay actividades registradas en este navegador.</div>');
      var more=root.querySelector('[data-a-more]');
      more.hidden=displayed.length>=state.filtered.length;
      more.textContent='Mostrar más ('+(state.filtered.length-displayed.length)+' restantes)';
      var disabled=state.filtered.length===0;
      root.querySelector('[data-a-csv]').disabled=disabled;
      root.querySelector('[data-a-json]').disabled=disabled;
    }
    function feedback(msg){root.querySelector('[data-a-feedback]').textContent=msg;}
    function change(){state.shown=12;render();feedback('Filtros aplicados: '+state.filtered.length+' movimientos visibles.');}
    search.addEventListener('input',change);
    select.addEventListener('change',change);
    from.addEventListener('change',function(){state.preset='all';change();});
    to.addEventListener('change',function(){state.preset='all';change();});
    root.addEventListener('click',function(e){
      var target=e.target instanceof Element?e.target.closest('button'):null;
      if(!target||!root.contains(target))return;
      if(target.hasAttribute('data-a-preset')){
        state.preset=target.dataset.aPreset;from.value='';to.value='';state.shown=12;
        // Un periodo predefinido sustituye el rango manual, manteniendo la búsqueda y herramienta.
        render();
        feedback((state.preset==='today'?'Hoy':state.preset==='week'?'Últimos 7 días':'Todas las fechas')+': '+state.filtered.length+' movimientos.');
        return;
      }
      if(target.hasAttribute('data-a-reset')){
        search.value='';select.value='';from.value='';to.value='';state.preset='all';state.shown=12;reload();feedback('Todos los filtros eliminados. Se muestran '+state.filtered.length+' movimientos.');return;
      }
      if(target.hasAttribute('data-a-more')){state.shown+=12;render();return;}
      if(target.hasAttribute('data-a-copy')){
        var item=state.filtered[Number(target.dataset.aCopy)];
        if(!item)return;
        clipboard(label(item.original)+' | '+formatDate(item)+' | '+item.original)
          .then(function(){feedback('Actividad copiada.');})
          .catch(function(){feedback('Tu navegador no permitió copiar.');});
        return;
      }
      if(target.hasAttribute('data-a-csv')||target.hasAttribute('data-a-json')){
        var data=state.filtered.map(function(item){
          return {fecha:formatDate(item),fecha_iso:item.at,actividad:label(item.original),accion_original:item.original,herramienta:type(item),origen:'Registro local V105'};
        });
        var isCSV=target.hasAttribute('data-a-csv');
        var success=isCSV?
          download('Auditoria_local_Liga_'+dateKey(Date.now())+'.csv','text/csv;charset=utf-8',
            '\ufeff'+['Fecha','Fecha ISO','Actividad','Acción original','Herramienta','Origen'].map(csvCell).join(',')+'\r\n'+
            data.map(function(r){return [r.fecha,r.fecha_iso,r.actividad,r.accion_original,r.herramienta,r.origen].map(csvCell).join(',');}).join('\r\n')):
          download('Auditoria_local_Liga_'+dateKey(Date.now())+'.json','application/json;charset=utf-8',
            JSON.stringify({version:1,exportado_en:new Date().toISOString(),fuente:'Registro local V105, sin certificación de servidor',total:data.length,eventos:data},null,2));
        feedback(success?'Archivo preparado para descargar.':'No fue posible generar la descarga.');
      }
    },true);
    var storageHandler=function(e){if(e.key===KEY&&modal.isConnected)reload();};
    window.addEventListener('storage',storageHandler);
    var dispose=new MutationObserver(function(){
      if(!modal.isConnected){window.removeEventListener('storage',storageHandler);dispose.disconnect();}
    });
    dispose.observe(document.body,{childList:true});
    reload();
  }
  function scan(){
    document.querySelectorAll('body > .v105-modal').forEach(enhance);
  }
  function start(){
    scan();
    new MutationObserver(function(records){
      records.forEach(function(record){
        record.addedNodes.forEach(function(node){
          if(node.nodeType!==1)return;
          if(node.matches&&node.matches('.v105-modal'))enhance(node);
          else if(node.querySelectorAll)node.querySelectorAll('.v105-modal').forEach(enhance);
        });
      });
    }).observe(document.body,{childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();