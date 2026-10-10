/* V1131 — Centro de cédulas: herramientas de consulta del ROL OFICIAL.
   No representa partidos como cédulas aprobadas ni publica datos arbitrales. */
(function(){
  'use strict';
  if(window.__LJR_V1131_CEDULAS__)return;
  window.__LJR_V1131_CEDULAS__=true;

  var state={search:'',round:'all',field:'all',year:'all',from:'',to:'',sort:'original'};
  var currentRoot=null;
  var observedScreen=null;
  var observer=null;
  var scheduled=false;
  var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var norm=function(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()};
  var text=function(row,key){return String(row.getAttribute('data-v66-cedula-'+key)||'').trim()};
  var q=function(selector,root){return (root||document).querySelector(selector)};
  var qa=function(selector,root){return Array.from((root||document).querySelectorAll(selector))};
  var route=function(){return location.hash.replace(/^#\/?/,'').split('?')[0]==='cedulas'};
  var stableKey=function(row){return [text(row,'cat'),text(row,'home'),text(row,'away'),text(row,'date')].join('|')};
  var rowsOf=function(root){return qa('.v638-cedula-list > [data-v66-cedula-home]',root)};
  function parseDate(raw){
    var s=String(raw||'').trim(),m,yy,mm,dd,hh,minute;
    if(m=s.match(/(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2}))?/)){
      yy=+m[1];mm=+m[2];dd=+m[3];hh=m[4]===undefined?null:+m[4];minute=m[5]===undefined?null:+m[5];
    }else if(m=s.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})(?:[\s,]+(\d{1,2}):(\d{2}))?/)){
      dd=+m[1];mm=+m[2];yy=+m[3];hh=m[4]===undefined?null:+m[4];minute=m[5]===undefined?null:+m[5];
    }else return null;
    if(mm<1||mm>12||dd<1||dd>31||(hh!==null&&(hh>23||minute>59)))return null;
    var d=new Date(yy,mm-1,dd);
    if(d.getFullYear()!==yy||d.getMonth()!==mm-1||d.getDate()!==dd)return null;
    var pad=function(n){return String(n).padStart(2,'0')};
    return {date:yy+'-'+pad(mm)+'-'+pad(dd),year:String(yy),stamp:Date.UTC(yy,mm-1,dd,hh||0,minute||0),ics:''+yy+pad(mm)+pad(dd)+(hh===null?'':'T'+pad(hh)+pad(minute)+'00'),hasTime:hh!==null};
  }
  function fixtures(root){
    return rowsOf(root).map(function(el,index){return {el:el,index:el.dataset.v1131OriginalIndex!==undefined?Number(el.dataset.v1131OriginalIndex):index,home:text(el,'home'),away:text(el,'away'),cat:text(el,'cat'),field:text(el,'field'),round:text(el,'round'),date:text(el,'date'),when:parseDate(text(el,'date'))}});
  }
  function options(data,key){
    var values=[];
    data.forEach(function(item){var v=key==='year'?(item.when?item.when.year:''):(item[key]||'');if(v&&v!=='Por confirmar'&&!values.includes(v))values.push(v)});
    values.sort(function(a,b){return key==='year'?b.localeCompare(a,'es',{numeric:true}):a.localeCompare(b,'es',{numeric:true,sensitivity:'base'})});
    return values;
  }
  function optionMarkup(values,label,selected){
    var out='<option value="all">'+esc(label)+'</option>';
    values.forEach(function(v){out+='<option value="'+esc(v)+'"'+(v===selected?' selected':'')+'>'+esc(v)+'</option>'});
    return out;
  }
  function toolbarMarkup(data){
    return '<section class="v1131-tools" aria-label="Buscar y compartir partidos del rol">'+
      '<div class="v1131-intro"><strong>Buscar en el rol oficial</strong><span>Selecciona un partido para abrir su cédula.</span></div>'+
      '<label class="v1131-search-label" for="v1131-query"><span>Buscar partido, equipo o cancha</span><span class="v1131-search-wrap"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/></svg><input id="v1131-query" type="search" data-v1131-search autocomplete="off" placeholder="Equipo, rival, jornada, cancha..." value="'+esc(state.search)+'"></span></label>'+
      '<div class="v1131-select-grid">'+
        '<label><span>JORNADA</span><select data-v1131-round aria-label="Filtrar jornada">'+optionMarkup(options(data,'round'),'Todas las jornadas',state.round)+'</select></label>'+
        '<label><span>CANCHA</span><select data-v1131-field aria-label="Filtrar cancha">'+optionMarkup(options(data,'field'),'Todos los campos',state.field)+'</select></label>'+
        '<label><span>TEMPORADA</span><select data-v1131-year aria-label="Filtrar temporada">'+optionMarkup(options(data,'year'),'Todos los años',state.year)+'</select></label>'+
      '</div>'+
      '<div class="v1131-dates"><label><span>DESDE</span><input type="date" aria-label="Fecha desde" data-v1131-from value="'+esc(state.from)+'"></label><label><span>HASTA</span><input type="date" aria-label="Fecha hasta" data-v1131-to value="'+esc(state.to)+'"></label><label><span>ORDENAR</span><select data-v1131-sort aria-label="Ordenar partidos"><option value="original"'+(state.sort==='original'?' selected':'')+'>Orden oficial</option><option value="recent"'+(state.sort==='recent'?' selected':'')+'>Más recientes</option><option value="oldest"'+(state.sort==='oldest'?' selected':'')+'>Más antiguos</option><option value="team"'+(state.sort==='team'?' selected':'')+'>Equipo A–Z</option></select></label></div>'+
      '<div class="v1131-toolbar"><button type="button" data-v1131-reset class="v1131-reset">Limpiar filtros</button><span data-v1131-count aria-live="polite">Calculando…</span></div>'+
      '<div class="v1131-actions"><button type="button" data-v1131-ics title="Exportar encuentros con fecha válida a calendario"><span aria-hidden="true">▦</span> Calendario</button><button type="button" data-v1131-csv title="Descargar el rol filtrado en CSV"><span aria-hidden="true">⇩</span> CSV</button><button type="button" data-v1131-share title="Compartir encuentros seleccionados"><span aria-hidden="true">↗</span> Compartir</button></div>'+
      '<small class="v1131-disclaimer">Esta lista contiene <b>partidos del rol</b>. No confirma que exista una cédula firmada, entregada o aprobada. Las descargas son una copia de consulta, no cambian resultados oficiales.</small>'+
      '<output class="v1131-feedback" data-v1131-feedback aria-live="polite"></output>'+
    '</section>';
  }
  function enhanceLogos(item){
    var middle=item.el.children[1];
    if(!middle||q('.v1131-logos',middle))return;
    var directory=window.V66_OFFICIAL_DIRECTORY;
    var logoFor=directory&&directory.logoFor;
    if(typeof logoFor!=='function')return;
    var h='',a='';
    try{h=logoFor(item.home)||'';a=logoFor(item.away)||''}catch(_){return}
    if(!h&&!a)return;
    var wrap=document.createElement('span');wrap.className='v1131-logos';wrap.setAttribute('aria-hidden','true');
    [h,a].forEach(function(src,i){
      var node=document.createElement('span');node.className='v1131-logo';
      if(src){
        var img=document.createElement('img');img.src=src;img.alt='';img.loading='lazy';img.decoding='async';node.appendChild(img);
      }else node.textContent=(i?item.away:item.home).trim().slice(0,2).toUpperCase();
      wrap.appendChild(node);
    });
    middle.insertBefore(wrap,middle.firstChild);
  }
  function resetUnavailableOptions(root,items){
    [['round','round'],['field','field'],['year','year']].forEach(function(pair){
      var key=pair[0],values=options(items,pair[1]);
      if(state[key]!=='all'&&!values.includes(state[key]))state[key]='all';
      var select=q('[data-v1131-'+key+']',root);
      if(select){select.innerHTML=optionMarkup(values,key==='round'?'Todas las jornadas':key==='field'?'Todos los campos':'Todos los años',state[key]);select.value=state[key]}
    });
  }
  function matches(item){
    var hay=norm([item.home,item.away,item.cat,item.round,item.field,item.date].join(' '));
    if(state.search&&!hay.includes(norm(state.search)))return false;
    if(state.round!=='all'&&item.round!==state.round)return false;
    if(state.field!=='all'&&item.field!==state.field)return false;
    if(state.year!=='all'&&(!item.when||item.when.year!==state.year))return false;
    if(state.from&&(!item.when||item.when.date<state.from))return false;
    if(state.to&&(!item.when||item.when.date>state.to))return false;
    return true;
  }
  function reorder(items,root){
    var list=q('.v638-cedula-list',root);
    if(!list||!items.length)return;
    var sorted=items.slice();
    if(state.sort==='recent'||state.sort==='oldest'){
      sorted.sort(function(a,b){
        var x=a.when?a.when.stamp:-Infinity,y=b.when?b.when.stamp:-Infinity;
        if(x===-Infinity&&y===-Infinity)return a.index-b.index;
        if(x===-Infinity)return 1;if(y===-Infinity)return -1;
        return state.sort==='recent'?y-x:x-y;
      });
    }else if(state.sort==='team')sorted.sort(function(a,b){return a.home.localeCompare(b.home,'es',{sensitivity:'base'})||a.index-b.index});
    else sorted.sort(function(a,b){return a.index-b.index});
    sorted.forEach(function(item){list.appendChild(item.el)});
  }
  function apply(root){
    if(!root||!route())return;
    var items=fixtures(root);
    items.forEach(function(item){item.el.classList.toggle('v1131-hidden',!matches(item))});
    reorder(items,root);
    var visible=items.filter(matches);
    var count=q('[data-v1131-count]',root);if(count)count.textContent=visible.length+' partidos visibles';
    var head=q('.v638-results-head small',root);if(head)head.textContent=visible.length+' partidos del rol';
    var badge=q('.v66-cedula-headline > em',root);
    if(badge){
      var original=Number(root.dataset.v1131Total||0);
      badge.textContent=visible.length+' / '+(original||items.length);
      badge.title='Partidos visibles / partidos del rol oficial';
    }
    var empty=q('[data-v1131-empty]',root);
    if(!empty){
      empty=document.createElement('div');empty.className='v1131-empty';empty.setAttribute('data-v1131-empty','');
      empty.textContent='No hay partidos con esos filtros. Prueba con otra jornada, fecha o equipo.';
      q('.v638-cedula-list',root)?.after(empty);
    }
    empty.hidden=visible.length>0||items.length===0;
    return visible;
  }
  function say(root,msg){var el=q('[data-v1131-feedback]',root);if(el)el.textContent=msg}
  function download(filename,content,type){
    var blob=new Blob([content],{type:type});var url=URL.createObjectURL(blob);
    var a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url)},1500);
  }
  function csvCell(v){
    var s=String(v==null?'':v);
    if(/^[\s]*[=+\-@]/.test(s))s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  function exportCSV(root){
    var data=apply(root)||[];
    if(!data.length){say(root,'No hay partidos que exportar.');return}
    var lines=[['Categoría','Jornada','Equipo local','Equipo visitante','Fecha','Cancha'].map(csvCell).join(',')];
    data.forEach(function(x){lines.push([x.cat,x.round,x.home,x.away,x.date,x.field].map(csvCell).join(','))});
    download('liga-juventino-rol-filtrado.csv','\uFEFF'+lines.join('\r\n')+'\r\n','text/csv;charset=utf-8');
    say(root,'Rol filtrado descargado en CSV.');
  }
  function icsEsc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')}
  function exportICS(root){
    var data=(apply(root)||[]).filter(function(x){return x.when});
    if(!data.length){say(root,'Ningún partido filtrado tiene fecha válida para el calendario.');return}
    var now=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino Rosas//Rol consultivo//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Liga Juventino Rosas - Rol'];
    data.forEach(function(x,i){
      var id=stableKey(x.el).split('').reduce(function(acc,c){return ((acc<<5)-acc+c.charCodeAt(0))|0},0);
      lines.push('BEGIN:VEVENT','UID:ljr-'+Math.abs(id)+'-'+i+'@juventinorosasliga.com','DTSTAMP:'+now,
        'DTSTART'+(x.when.hasTime?':'+x.when.ics+'':' ;VALUE=DATE:'+x.when.ics).replace(' ;',';'),
        'SUMMARY:'+icsEsc(x.home+' vs '+x.away),
        'DESCRIPTION:'+icsEsc(x.cat+' · Jornada '+(x.round||'sin confirmar')+' · Horario y cancha sujetos a confirmación oficial'),
        'LOCATION:'+icsEsc(x.field==='Por confirmar'?'':x.field),'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    download('liga-juventino-rol.ics',lines.join('\r\n')+'\r\n','text/calendar;charset=utf-8');
    say(root,'Calendario descargado: '+data.length+' encuentros. Verifica fechas antes de compartirlo.');
  }
  async function share(root){
    var data=apply(root)||[];
    if(!data.length){say(root,'No hay partidos que compartir.');return}
    var message='Liga Juventino Rosas · Partidos del rol (consulta, sujetos a cambios)\n';
    data.slice(0,12).forEach(function(x){message+='\n'+x.home+' vs '+x.away+' · '+x.cat+' · J'+x.round+' · '+x.date+' · '+x.field});
    if(data.length>12)message+='\n... y '+(data.length-12)+' encuentros más. Aplica filtros para compartir un grupo más pequeño.';
    message+='\nConsulta el rol oficial antes de asistir.';
    if(navigator.share){try{await navigator.share({title:'Rol de Liga Juventino Rosas',text:message});say(root,'Opciones de compartir abiertas.');return}catch(err){if(err&&err.name==='AbortError')return}}
    var url='https://api.whatsapp.com/send?text='+encodeURIComponent(message);
    var win=window.open(url,'_blank');
    if(win)win.opener=null;
    if(!win){try{await navigator.clipboard.writeText(message);say(root,'Resumen copiado. Pégalo en WhatsApp.')}catch(_){say(root,'No se pudo abrir WhatsApp. Comprueba si tu navegador bloquea ventanas emergentes.')}}
  }
  function bind(root){
    function input(attr,key){q('[data-v1131-'+attr+']',root)?.addEventListener(attr==='search'?'input':'change',function(e){state[key]=e.target.value;apply(root)})}
    [['search','search'],['round','round'],['field','field'],['year','year'],['from','from'],['to','to'],['sort','sort']].forEach(function(p){input(p[0],p[1])});
    q('[data-v1131-reset]',root)?.addEventListener('click',function(){
      state={search:'',round:'all',field:'all',year:'all',from:'',to:'',sort:'original'};
      ['search','from','to'].forEach(function(k){var el=q('[data-v1131-'+k+']',root);if(el)el.value=''});
      resetUnavailableOptions(root,fixtures(root));
      var sort=q('[data-v1131-sort]',root);if(sort)sort.value='original';
      var nativeCat=q('[data-v66-cedula-cat-filter]',root);
      var nativeTeam=q('[data-v66-cedula-team-filter]',root);
      if(nativeCat&&nativeCat.value!=='all'){
        nativeCat.value='all';nativeCat.dispatchEvent(new Event('change',{bubbles:true}));return;
      }
      if(nativeTeam&&nativeTeam.value!=='all'){
        nativeTeam.value='all';nativeTeam.dispatchEvent(new Event('change',{bubbles:true}));return;
      }
      apply(root);
    });
    q('[data-v1131-csv]',root)?.addEventListener('click',function(){exportCSV(root)});
    q('[data-v1131-ics]',root)?.addEventListener('click',function(){exportICS(root)});
    q('[data-v1131-share]',root)?.addEventListener('click',function(){share(root)});
  }
  function mount(){
    if(!route())return;
    var root=q('[data-v66-directory="cedulas"].v638-cedulas-modern');
    if(!root||root===currentRoot)return;
    currentRoot=root;
    var list=q('.v638-cedula-list',root),top=q('.v638-cedula-top',root);
    if(!list||!top)return;
    var data=fixtures(root);
    var badge=q('.v66-cedula-headline > em',root);
    var total=badge?String(badge.textContent).match(/\/\s*(\d+)/):null;
    root.dataset.v1131Total=total?total[1]:String(data.length);
    var tool=document.createElement('div');
    tool.innerHTML=toolbarMarkup(data);
    top.after(tool.firstElementChild);
    data.forEach(function(item){item.el.dataset.v1131OriginalIndex=String(item.index);enhanceLogos(item)});
    resetUnavailableOptions(root,data);
    bind(root);
    apply(root);
  }
  function schedule(){
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(function(){scheduled=false;mount()});
  }
  function start(){
    if(observedScreen)return;
    observedScreen=q('#screen');
    if(!observedScreen){setTimeout(start,120);return}
    observer=new MutationObserver(schedule);
    observer.observe(observedScreen,{childList:true,subtree:false});
    window.addEventListener('hashchange',schedule);
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();
