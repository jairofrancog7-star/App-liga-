/* V1240 · Asistente local de Calendarios oficiales
 * Sin red, sin APIs externas ni escritura de resultados. Análisis por reglas.
 * IA generativa local: opcional y sólo por clic cuando el navegador la ofrece.
 */
(function(){
  'use strict';
  if(window.__LJR_CALENDARIO_ASISTENTE_V1240__)return;
  window.__LJR_CALENDARIO_ASISTENTE_V1240__=true;

  const MODAL='.v105-modal.v1130-calendar-pro';
  const qs=(s,r)=>r.querySelector(s);
  const all=(s,r)=>Array.from(r.querySelectorAll(s));
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  const text=(s,r)=>String(qs(s,r)?.textContent||'').trim();
  const isKnownField=s=>!!s&&!/^(?:-+|campo por confirmar|por confirmar|sin campo|pendiente|no asignado)/i.test(s);
  let active=null,outputObserver=null,summary='';

  function parseWhen(raw){
    const m=String(raw).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if(!m)return null;
    const day=Number(m[1]),month=Number(m[2]),year=Number(m[3]);
    const hour=m[4]===undefined?0:Number(m[4]),min=m[5]===undefined?0:Number(m[5]);
    const dt=new Date(year,month-1,day,hour,min);
    if(dt.getFullYear()!==year||dt.getMonth()!==month-1||dt.getDate()!==day||hour>23||min>59)return null;
    const hasTime=m[4]!==undefined&&!(hour===0&&min===0);
    return {date:dt,day:new Date(year,month-1,day),hasTime};
  }
  function rows(modal){
    return all('.v1107-fixture.v1130-fixture',modal).map(card=>{
      const teams=all('.v1130-team b',card).map(el=>el.textContent.trim());
      const home=teams[0]||'',away=teams[1]||'';
      const when=text('.v1107-fixture-top span',card);
      const parsed=parseWhen(when);
      const venue=text('.v1107-fixture-field',card);
      const state=text('.v1130-state',card);
      const score=text('.v1107-fixture-teams em',card);
      return {home,away,when,parsed,venue,state,score,round:text('.v1107-fixture-top strong',card)};
    });
  }
  function analyze(modal){
    const games=rows(modal);
    const now=new Date(),startOfToday=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const weekEnd=new Date(startOfToday.getTime()+7*86400000);
    const upcoming=games.filter(g=>g.parsed&&g.parsed.day>=startOfToday&&g.parsed.day<weekEnd);
    const noTime=games.filter(g=>!g.parsed?.hasTime);
    const noField=games.filter(g=>!isKnownField(g.venue));
    const pending=games.filter(g=>!/^\d+\s*[-–]\s*\d+$/.test(g.score));
    const future=games.filter(g=>g.parsed?.hasTime&&g.parsed.date>=now)
      .sort((a,b)=>a.parsed.date-b.parsed.date);
    const collisions=[], seen=new Set();
    // Sólo comprobar los partidos visibles de esta categoría y filtros.
    for(let i=0;i<games.length;i++){
      const a=games[i];if(!a.parsed?.hasTime)continue;
      for(let j=i+1;j<games.length;j++){
        const b=games[j];if(!b.parsed?.hasTime)continue;
        const minutes=Math.abs(a.parsed.date-b.parsed.date)/60000;
        if(minutes>=120)continue;
        const sameField=isKnownField(a.venue)&&norm(a.venue)===norm(b.venue);
        const ta=[norm(a.home),norm(a.away)].filter(Boolean),tb=[norm(b.home),norm(b.away)].filter(Boolean);
        const sameTeam=ta.some(t=>tb.includes(t));
        if(!sameField&&!sameTeam)continue;
        const pair=[a.home,a.away,b.home,b.away].join('|');
        const key=[pair,a.when,b.when].join('|');
        if(seen.has(key))continue;
        seen.add(key);
        collisions.push((sameField?'Posible cruce de cancha':'Posible doble programación de equipo')+
          ': '+a.home+' vs '+a.away+' / '+b.home+' vs '+b.away+' ('+a.when+').');
        if(collisions.length>=4)break;
      }
      if(collisions.length>=4)break;
    }
    const cat=qs('[data-cat]',modal);
    const category=cat?.selectedOptions?.[0]?.textContent?.trim()||'Categoría';
    const next=future[0];
    const tips=[];
    if(collisions.length)tips.push(...collisions);
    if(noTime.length)tips.push(noTime.length+' partido(s) sin horario confirmado; no los agregues al calendario hasta verificar.');
    if(noField.length)tips.push(noField.length+' partido(s) con cancha pendiente o sin confirmar.');
    if(!tips.length)tips.push('Sin coincidencias sospechosas en los partidos visibles. Comprueba los datos con la Liga.');
    return {
      games,category,upcoming:upcoming.length,pending:pending.length,noTime:noTime.length,
      checks:tips,next,
      summary:[
        'Liga Juventino Rosas · Calendarios oficiales · '+category,
        'Partidos visibles: '+games.length+'. Próximos 7 días: '+upcoming.length+'. Sin marcador confirmado: '+pending.length+'.',
        'Sin horario: '+noTime.length+'. Sin campo confirmado: '+noField.length+'.',
        next?'Próximo con horario: '+next.home+' vs '+next.away+' · '+next.when+' · '+next.venue+'.':'No hay próximos con horario confirmado en esta selección.',
        ...tips,
        'Análisis preventivo local. No es un aviso ni una modificación oficial.'
      ].join('\n')
    };
  }
  function render(modal){
    if(!modal?.isConnected)return;
    const panel=qs('[data-v1240-local]',modal);
    if(!panel)return;
    const report=analyze(modal);
    summary=report.summary;
    qs('[data-v1240-count]',panel).textContent=String(report.games.length);
    qs('[data-v1240-next7]',panel).textContent=String(report.upcoming);
    qs('[data-v1240-pending]',panel).textContent=String(report.pending);
    const next=qs('[data-v1240-next-match]',panel);
    next.textContent=report.next
      ?'Siguiente encuentro: '+report.next.home+' vs '+report.next.away+' · '+report.next.when+
        (isKnownField(report.next.venue)?' · '+report.next.venue:' · cancha por confirmar')
      :'No hay próximos partidos con horario confirmado entre los visibles.';
    const warnings=qs('[data-v1240-warnings]',panel);
    warnings.replaceChildren();
    for(const message of report.checks.slice(0,4)){
      const p=document.createElement('p');p.textContent=message;warnings.appendChild(p);
    }
  }
  async function copySummary(panel){
    const notice=qs('[data-v1240-notice]',panel);
    try{
      if(!summary)throw Error('Sin información');
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(summary);
      else {
        const field=document.createElement('textarea');
        field.value=summary;field.setAttribute('readonly','');field.style.position='fixed';
        field.style.left='-9999px';document.body.appendChild(field);
        field.select();const ok=document.execCommand('copy');field.remove();
        if(!ok)throw Error('Copia no disponible');
      }
      notice.textContent='Resumen copiado. Verifica la información antes de compartir.';
    }catch(_){notice.textContent='Tu navegador no permitió copiar. Puedes seleccionar los datos visibles.'}
  }
  async function onDeviceAI(panel){
    const button=qs('[data-v1240-genai]',panel);
    const notice=qs('[data-v1240-notice]',panel);
    if(!window.LanguageModel||typeof window.LanguageModel.availability!=='function'){
      notice.textContent='IA generativa local no disponible. El análisis automático por reglas sigue funcionando.';return;
    }
    button.disabled=true;button.textContent='Preparando…';
    try{
      const availability=await window.LanguageModel.availability();
      if(availability!=='available')throw Error('Modelo local no instalado o no compatible');
      const session=await window.LanguageModel.create();
      try{
        const result=await session.prompt('Redacta una recomendación breve en español para el administrador de una liga amateur, utilizando exclusivamente estos datos. No inventes resultados, cambios ni eventos, no prometas notificaciones. Datos:\n'+summary.slice(0,4200));
        qs('[data-v1240-ai-output]',panel).textContent=String(result||'').slice(0,1500);
        notice.textContent='Sugerencia generada en el dispositivo. Revisa antes de compartir.';
      }finally{try{session.destroy?.()}catch(_){}}
    }catch(_){
      notice.textContent='La IA generativa no está disponible en este equipo. Se conserva el resumen local automático.';
    }finally{button.disabled=false;button.textContent='Redactar con IA del dispositivo'}
  }
  function unmount(){
    if(outputObserver){outputObserver.disconnect();outputObserver=null}
    active=null;summary='';
  }
  function mount(modal){
    if(active===modal)return;
    unmount();
    if(qs('[data-v1240-local]',modal))return;
    const anchor=qs('.v1130-source',modal),output=qs('.v105-output[data-out]',modal);
    if(!anchor||!output)return;
    const panel=document.createElement('section');
    panel.className='v1240-local';panel.dataset.v1240Local='';
    panel.setAttribute('aria-label','Análisis inteligente local de calendario');
    panel.innerHTML=
      '<div class="v1240-head"><div><small>ANÁLISIS AUTOMÁTICO EN EL DISPOSITIVO</small>'+
      '<h4>Asistente del calendario</h4></div><span>Sin enviar datos a IA externa</span></div>'+
      '<div class="v1240-kpis">'+
      '<div><b data-v1240-count>0</b><small>visibles</small></div>'+
      '<div><b data-v1240-next7>0</b><small>próximos 7 días</small></div>'+
      '<div><b data-v1240-pending>0</b><small>sin marcador</small></div></div>'+
      '<p class="v1240-next" data-v1240-next-match></p>'+
      '<div class="v1240-warnings" data-v1240-warnings></div>'+
      '<div class="v1240-buttons">'+
      '<button type="button" data-v1240-refresh>Analizar de nuevo</button>'+
      '<button type="button" data-v1240-upcoming>Ver próximos</button>'+
      '<button type="button" data-v1240-copy>Copiar resumen</button>'+
      '<button type="button" data-v1240-genai hidden>Redactar con IA del dispositivo</button></div>'+
      '<p class="v1240-ai-result" data-v1240-ai-output></p>'+
      '<p class="v1240-notice" data-v1240-notice role="status" aria-live="polite">'+
      'Se actualiza al cambiar los filtros. Sólo detecta posibles problemas entre los partidos visibles; no publica avisos oficiales.</p>';
    anchor.insertAdjacentElement('afterend',panel);
    if(window.LanguageModel&&typeof window.LanguageModel.availability==='function')
      qs('[data-v1240-genai]',panel).hidden=false;
    qs('[data-v1240-refresh]',panel).addEventListener('click',()=>render(modal));
    qs('[data-v1240-upcoming]',panel).addEventListener('click',()=>{
      const btn=qs('[data-view="upcoming"]',modal);
      if(btn)btn.click();
    });
    qs('[data-v1240-copy]',panel).addEventListener('click',()=>copySummary(panel));
    qs('[data-v1240-genai]',panel).addEventListener('click',()=>onDeviceAI(panel));
    active=modal;
    outputObserver=new MutationObserver(()=>render(modal));
    outputObserver.observe(output,{childList:true});
    render(modal);
  }
  function check(node){
    if(!(node instanceof Element))return;
    if(node.matches(MODAL))mount(node);
    else {const found=node.querySelector(MODAL);if(found)mount(found)}
  }
  function init(){
    if(!document.body)return;
    const observer=new MutationObserver(records=>{
      if(active&&!active.isConnected)unmount();
      for(const entry of records)for(const node of entry.addedNodes)check(node);
    });
    observer.observe(document.body,{childList:true});
    const existing=document.querySelector(MODAL);
    if(existing)mount(existing);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
