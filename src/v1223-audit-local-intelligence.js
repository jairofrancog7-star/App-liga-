/* V1223 · Centro de auditoría inteligente local: reglas explicables y automatización en el navegador.
 * No instala modelos, no hace peticiones de red, no altera los permisos ni el registro V105.
 * OWASP: priorizar acciones administrativas/importaciones/exportaciones, revisión y no crear
 * falsas conclusiones de seguridad con datos locales no verificables.
 */
(function(){
  'use strict';
  const KEY='v105-activity';
  const SETTINGS='ljr-v1223-audit-auto';
  const DAY=86400000;
  const formatDay=new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short'});
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const plain=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const dateString=ts=>formatDay.format(new Date(ts));
  const dayKey=ts=>{const d=new Date(ts);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
  function entries(){
    try{
      const raw=JSON.parse(localStorage.getItem(KEY)||'[]');
      if(!Array.isArray(raw))return [];
      return raw.filter(v=>v&&typeof v==='object')
        .map(v=>({action:String(v.action||'').slice(0,320),time:Date.parse(v.at||''),at:v.at||''}))
        .filter(v=>Number.isFinite(v.time)&&v.time>0&&v.time<Date.now()+DAY)
        .sort((a,b)=>a.time-b.time);
    }catch(_){return [];}
  }
  function cat(v){
    const a=plain(v.action);
    if(/auditor/.test(a))return 'Auditoría';
    if(/respaldo|backup/.test(a))return 'Respaldos';
    if(/csv|importacion|importar/.test(a))return 'Importaciones';
    if(/sancion|expuls/.test(a))return 'Sanciones';
    if(/registro de avisos|register-alerts|notific|alert/.test(a))return 'Avisos';
    if(/reunion|junta|meeting/.test(a))return 'Juntas';
    if(/calendario|partido|match/.test(a))return 'Partidos y calendarios';
    if(/equipo|jugador|delegad|arbitr/.test(a))return 'Gestión deportiva';
    return 'Otras herramientas';
  }
  function analyze(items){
    const now=Date.now(),recent=items.filter(v=>v.time>=now-7*DAY);
    const meaningful=recent.filter(v=>cat(v)!=='Auditoría');
    const counts=new Map();
    meaningful.forEach(v=>{const k=cat(v);counts.set(k,(counts.get(k)||0)+1);});
    const top=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'es')).slice(0,3);
    const daily=[];
    for(let offset=6;offset>=0;offset--){
      const start=new Date();start.setHours(0,0,0,0);start.setDate(start.getDate()-offset);
      const from=start.getTime(),to=new Date(start).setDate(start.getDate()+1);
      daily.push({date:dateString(from),count:items.filter(v=>v.time>=from&&v.time<to).length});
    }
    const notes=[];
    if(items.length>=45)notes.push({level:'warning',text:'El historial local está cerca de su límite de 50 entradas. Conviene exportar los movimientos antes de que los más antiguos dejen de aparecer.'});
    const lastBackup=items.filter(v=>/exportar respaldo local/i.test(v.action)).at(-1);
    if(items.length>=5&&!lastBackup){
      notes.push({level:'tip',text:'No se encontró un respaldo local en las entradas conservadas. Comprueba si ya descargaste una copia desde Respaldo local.'});
    } else if(lastBackup&&now-lastBackup.time>=14*DAY){
      notes.push({level:'tip',text:'El último respaldo visible en este historial tiene más de 14 días. Considera descargar uno nuevo.'});
    }
    const nonAudit=items.filter(v=>cat(v)!=='Auditoría');
    // Repetición dentro de una ventana de 2 minutos, sin afirmar que sea un ataque.
    let concentrated=null;
    for(let i=0;i<nonAudit.length;i++){
      let j=i+1;
      while(j<nonAudit.length&&nonAudit[j].time-nonAudit[i].time<=120000)j++;
      if(j-i>=6&&(!concentrated||j-i>concentrated))concentrated=j-i;
    }
    if(concentrated)notes.push({level:'tip',text:'Se observó una concentración de '+concentrated+' actividades en dos minutos. Comprueba que las operaciones fueron las esperadas; esto no demuestra un problema de seguridad.'});
    const duplicates=new Map();
    meaningful.forEach(v=>{const k=plain(v.action).trim();if(k)duplicates.set(k,(duplicates.get(k)||0)+1);});
    const popular=[...duplicates].sort((a,b)=>b[1]-a[1])[0];
    if(popular&&popular[1]>=5){
      notes.push({level:'info',text:'Una misma acción se repitió '+popular[1]+' veces durante la última semana. Puede ser normal cuando se abre una herramienta varias veces.'});
    }
    if(!items.length)notes.push({level:'info',text:'Sin movimientos recientes disponibles para revisar. Las sugerencias aparecerán cuando la liga registre actividades.'});
    if(items.length&&notes.length===0)notes.push({level:'info',text:'No se detectaron los patrones de revisión configurados en las entradas disponibles.'});
    const leader=top.length?top[0][0]:'Sin datos suficientes';
    const summary=items.length?
      'En los últimos 7 días aparecen '+recent.length+' movimientos en este navegador. La categoría más usada, sin contar la propia auditoría, fue '+leader+'. Se identificaron '+notes.filter(n=>n.level!=='info').length+' recomendaciones de revisión.':
      'Todavía no existen actividades con fecha válida en el historial local de este navegador.';
    return {recent,top,daily,notes,summary,total:items.length,lastBackup};
  }
  function copy(text){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
    return new Promise((resolve,reject)=>{
      const el=document.createElement('textarea');el.value=text;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();
      try{document.execCommand('copy')?resolve():reject(new Error('Copiado no disponible'));}
      catch(e){reject(e);}finally{el.remove();}
    });
  }
  function setup(root){
    if(root.dataset.v1223Ready==='1')return;
    root.dataset.v1223Ready='1';
    const panel=document.createElement('section');
    panel.className='v1223-insight';
    panel.setAttribute('aria-label','Análisis inteligente local de auditoría');
    panel.innerHTML=
      '<div class="v1223-title"><span class="v1223-glyph" aria-hidden="true">✦</span><div><b>Asistente inteligente local</b><small>Reglas automáticas, sin subir datos ni descargar modelos</small></div></div>'+
      '<div class="v1223-toolbar"><label class="v1223-toggle"><input type="checkbox" data-smart-auto checked><span>Revisar automáticamente al abrir</span></label>'+
      '<button type="button" data-smart-run>Analizar ahora</button></div>'+
      '<div class="v1223-overview" data-smart-summary role="status" aria-live="polite"></div>'+
      '<p class="v1223-run-status" data-smart-status role="status" aria-live="polite"></p>'+
      '<div class="v1223-chart" data-smart-chart aria-label="Actividad diaria de los últimos siete días"></div>'+
      '<div class="v1223-tags" data-smart-top></div>'+
      '<div class="v1223-notices" data-smart-notes></div>'+
      '<div class="v1223-footer"><button type="button" data-smart-copy>Copiar resumen semanal</button>'+
      '<small>Interpretación orientativa: este registro local no verifica identidades, resultados ni permisos.</small></div>';
    const metrics=root.querySelector('.v1212-metrics');
    if(metrics)metrics.insertAdjacentElement('afterend',panel);else root.prepend(panel);
    const input=panel.querySelector('[data-smart-auto]');
    try{input.checked=localStorage.getItem(SETTINGS)!=='false';}catch(_){input.checked=true;}
    let cached=null;
    function run(force){
      if(!root.isConnected||(!force&&!input.checked))return;
      const info=panel.querySelector('[data-smart-status]');
      const button=panel.querySelector('[data-smart-run]');
      info.textContent='Revisando movimientos guardados en este dispositivo…';
      try{cached=analyze(entries());}catch(error){
        info.textContent='No fue posible actualizar el análisis local. Inténtalo de nuevo.';
        return;
      }
      panel.querySelector('[data-smart-summary]').textContent=cached.summary;
      const max=Math.max(1,...cached.daily.map(d=>d.count));
      panel.querySelector('[data-smart-chart]').innerHTML=cached.daily.map(d=>
        '<div class="v1223-bar" role="img" aria-label="'+esc(d.date+': '+d.count+' movimientos')+'">'+
        '<b>'+d.count+'</b><span class="v1223-bar-area"><i style="height:'+Math.max(d.count?9:3,Math.round(d.count/max*100))+'%"></i></span>'+
        '<small>'+esc(d.date)+'</small></div>').join('');
      panel.querySelector('[data-smart-top]').innerHTML=cached.top.length?
        '<strong>Herramientas más utilizadas esta semana</strong>'+cached.top.map(([name,count])=>
          '<span>'+esc(name)+' <b>'+count+'</b></span>').join(''):
        '<span>Aún no hay categorías recientes para comparar.</span>';
      panel.querySelector('[data-smart-notes]').innerHTML=cached.notes.map(n=>
        '<div class="v1223-notice" data-tone="'+n.level+'"><span aria-hidden="true">'+(n.level==='warning'?'!':'i')+'</span><p>'+esc(n.text)+'</p></div>').join('');
      button.textContent='Actualizar análisis';
      info.textContent='✓ Análisis actualizado a las '+new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+'. '+cached.total+' movimientos revisados.';
    }
    const button=panel.querySelector('[data-smart-run]');
    button.addEventListener('click',()=>run(true));
    input.addEventListener('change',()=>{
      try{localStorage.setItem(SETTINGS,String(input.checked));}catch(_){}
      panel.querySelector('[data-smart-run]').textContent='Analizar ahora';
      if(input.checked)run(true);
      else panel.querySelector('[data-smart-status]').textContent='Análisis automático pausado. El botón «Analizar ahora» sigue disponible.';
    });
    const copyButton=panel.querySelector('[data-smart-copy]');
    copyButton.addEventListener('click',()=>{
      if(!cached)run(true);
      if(!cached)return;
      const msg=['Liga Juventino Rosas · resumen local de auditoría',
        'Generado: '+new Date().toLocaleString('es-MX'),cached.summary,
        ...cached.top.map(([name,count])=>name+': '+count),
        ...cached.notes.map(n=>'Revisión: '+n.text),
        'Origen: datos locales de este navegador, no auditoría administrativa certificada.'].join('\n');
      copy(msg).then(()=>{copyButton.textContent='Resumen copiado';})
        .catch(()=>{copyButton.textContent='No se pudo copiar';});
    });
    const listener=e=>{if(e.key===KEY&&root.isConnected)run(false);};
    const visibility=()=>{if(!document.hidden&&root.isConnected)run(false);};
    window.addEventListener('storage',listener);
    document.addEventListener('visibilitychange',visibility);
    // Libera listeners al cerrar el cuadro. Sin temporizadores ni trabajo en segundo plano.
    const cleanup=new MutationObserver(()=>{
      if(!root.isConnected){window.removeEventListener('storage',listener);document.removeEventListener('visibilitychange',visibility);cleanup.disconnect();}
    });
    cleanup.observe(document.body,{childList:true});
    if(input.checked)run(true);
    else {
      panel.querySelector('[data-smart-summary]').textContent='Análisis automático pausado. Pulsa «Analizar ahora» cuando lo necesites.';
      panel.querySelector('[data-smart-status]').textContent='Pulsa el botón para revisar los movimientos guardados.';
    }
  }
  function scan(){
    document.querySelectorAll('body > .v105-modal.v1212-audit-modal .v1212-audit').forEach(setup);
  }
  function init(){
    scan();
    const observer=new MutationObserver(records=>{
      if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&
        (n.matches?.('.v105-modal')||n.querySelector?.('.v1212-audit'))))){
        // Dejar que V1212 termine su propia mejora de la ventana antes de instalar el asistente.
        queueMicrotask(scan);
      }
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
