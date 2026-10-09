/* V1062 — Aviso de suspensión. Asistente de redacción opcional y seguro.
   Prompt API local si el navegador YA tiene modelo disponible; si no,
   borrador determinista local. Nunca envía datos a servicios externos. */
(()=>{
  'use strict';
  if(window.__LJR_V1062_NOTICE_WRITER__)return;
  window.__LJR_V1062_NOTICE_WRITER__=true;

  const $=(s,root=document)=>root.querySelector(s);
  const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
  const active=()=>route()==='suspensionTool';
  const safe=v=>String(v||'').trim().replace(/\s+/g,' ').slice(0,320);
  const named=(selector,root)=>safe($(selector,root)?.value);
  const isAll=(s,all)=>!s||s===all;
  const snapshot=page=>{
    const get=k=>named('[data-v64-susp-'+k+']',page);
    return {category:get('cat'),jornada:get('round'),type:get('type'),
      scope:get('scope'),match:get('match'),venue:get('venue'),reason:get('reason'),
      priority:get('priority'),date:get('date'),time:get('time'),channel:get('channel')};
  };
  const note=(writer,text)=>{
    const status=$('[data-v1062-status]',writer);
    if(status)status.textContent=text;
  };
  function localDraft(s,tone,variant=0){
    const where=['jornada '+(s.jornada||'por confirmar'),s.category].filter(Boolean).join(' de ');
    const type=(s.type||'aviso informativo').toLowerCase();
    const match=isAll(s.match,'Todos los partidos')?'':('Partido considerado: '+s.match+'. ');
    const field=isAll(s.venue,'Todos los campos')?'':('Sede seleccionada: '+s.venue+'. ');
    const why=s.reason?('Motivo indicado: '+s.reason+'. '):'';
    const date=s.date?('Fecha indicada en el formulario: '+s.date+(s.time?' a las '+s.time:'')+'. '):'';
    const scope=s.scope?('Alcance: '+s.scope+'. '):'';
    const caution=variant%2?'Se trata de una propuesta para revisar antes de compartir; la Liga confirmará cualquier novedad por sus medios oficiales.':'Este aviso es un borrador sujeto a revisión de la Liga; cualquier cambio se confirmará por sus canales oficiales.';
    if(tone==='breve')return (variant%2?'Atención: '+where+'. Aviso en preparación sobre '+type+'. '+why+field+match+caution:'Aviso sobre '+type+' para '+where+'. '+scope+match+field+why+caution).trim();
    if(tone==='urgente')return (variant%2?'IMPORTANTE: para '+where+' se prepara un aviso de '+type+'. '+why+scope+field+match+date+'Consulten la información oficial antes de asistir. '+caution:'ATENCIÓN, EQUIPOS Y DELEGADOS: se prepara un aviso de '+type+' para '+where+'. '+scope+match+field+why+date+'Antes de trasladarse al campo, consulten los canales oficiales. '+caution).trim();
    return ('A los equipos, delegados y participantes de la Liga Municipal de Fútbol Juventino Rosas A. C.:\n\n'+
      'Se prepara un aviso referente a '+type+' para '+where+'. '+scope+match+field+why+date+
      '\n\n'+caution).trim();
  }
  const timeout=(promise,ms)=>new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('AI_TIMEOUT')),ms);
    Promise.resolve(promise).then(v=>{clearTimeout(timer);resolve(v)},e=>{clearTimeout(timer);reject(e)});
  });
  async function onDeviceDraft(s,tone){
    const API=globalThis.LanguageModel;
    if(!API||typeof API.availability!=='function'||typeof API.create!=='function')return null;
    try{
      // No iniciar descargas de modelos en teléfonos, especialmente con datos móviles.
      const availability=await timeout(API.availability(),1800);
      if(availability!=='available')return null;
      const session=await timeout(API.create(),5000);
      try{
        const prompt='Eres redactor de avisos de una liga municipal mexicana de fútbol. '+
          'Redacta SOLO el mensaje adicional (máximo 95 palabras) con tono '+tone+'. '+
          'Datos exactamente como fueron seleccionados: '+JSON.stringify(s)+'. '+
          'No inventes partidos, cambios de fecha, decisiones, suspensiones confirmadas, árbitros ni firmas. '+
          'Aclara que es un borrador sujeto a revisión, nunca una publicación automática. '+
          'No incluyas datos distintos a los del formulario; responde en español sin markdown.';
        const answer=await timeout(session.prompt(prompt),11000);
        const output=String(answer||'').trim().replace(/\n{3,}/g,'\n\n').slice(0,1300);
        if(output.length<30)return null;
        return output;
      }finally{try{session.destroy?.()}catch(_){}}
    }catch(e){return null}
  }
  function insert(page){
    const textarea=$('[data-v64-susp-message]',page);
    if(!textarea)return;
    const label=textarea.closest('label');
    if(!label||label.nextElementSibling?.matches('[data-v1062-writer]'))return;
    const writer=document.createElement('section');
    writer.className='v1062-writer';
    writer.dataset.v1062Writer='';
    writer.setAttribute('aria-label','Asistente para redactar el aviso');
    writer.innerHTML=
      '<div class="v1062-heading"><span class="v1062-spark" aria-hidden="true">✦</span>'+
        '<div><b>Redacción inteligente</b><small>Escribe el aviso con tus datos, sin publicarlo.</small></div></div>'+
      '<div class="v1062-row">'+
        '<label class="v1062-tone-wrap" for="v1062-tone">Estilo'+
          '<select id="v1062-tone" data-v1062-tone><option value="formal">Formal</option><option value="breve">Breve</option><option value="urgente">Urgente</option></select></label>'+
        '<button type="button" class="v1062-generate" data-v1062-generate>✦ Generar con IA</button>'+
      '</div>'+
      '<p class="v1062-status" data-v1062-status role="status" aria-live="polite">IA local si está disponible; si no, borrador automático sin conexión.</p>'+
      '<div class="v1062-result" data-v1062-result hidden>'+
        '<b>Texto sugerido</b><p data-v1062-output></p>'+
        '<div class="v1062-result-actions">'+
          '<button type="button" data-v1062-apply>Usar este texto</button>'+
          '<button type="button" data-v1062-refresh>Otra versión</button>'+
        '</div>'+
      '</div>';
    label.insertAdjacentElement('afterend',writer);
  }
  let running=false;
  let version=0;
  async function generate(page){
    const writer=$('[data-v1062-writer]',page);
    if(!writer||running)return;
    running=true;
    const button=$('[data-v1062-generate]',writer);
    if(button){button.disabled=true;button.textContent='Generando…'}
    note(writer,'Preparando una propuesta a partir del formulario…');
    const s=snapshot(page);
    const tone=named('[data-v1062-tone]',writer)||'formal';
    let result=null;
    try{result=await onDeviceDraft(s,tone)}catch(_){}
    if(!page.isConnected||!writer.isConnected){running=false;return}
    const generatedWithAI=!!result;
    result=result||localDraft(s,tone,version++);
    const output=$('[data-v1062-output]',writer);
    if(output)output.textContent=result;
    const box=$('[data-v1062-result]',writer);
    if(box)box.hidden=false;
    note(writer,generatedWithAI?
      'Texto redactado con IA del navegador. Revísalo antes de usarlo.':
      'Modelo de IA no disponible: propuesta automática creada localmente. Revísala antes de usarla.');
    if(button){button.disabled=false;button.textContent='✦ Generar con IA'}
    running=false;
  }
  function boot(){
    const screen=$('#screen');
    if(!screen)return;
    let queued=false;
    const update=()=>{
      queued=false;
      if(!active())return;
      const page=$('.v425-suspension',screen);
      if(page)insert(page);
    };
    const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(update)};
    // Se observa solo screen, sin modificar ni reemplazar controles existentes.
    new MutationObserver(queue).observe(screen,{childList:true,subtree:true});
    window.addEventListener('hashchange',queue);
    window.addEventListener('pageshow',queue);
    screen.addEventListener('click',event=>{
      if(!active())return;
      const page=$('.v425-suspension',screen);
      if(!page)return;
      const target=event.target.closest('button');
      if(!target||!page.contains(target))return;
      if(target.matches('[data-v1062-generate],[data-v1062-refresh]')){
        event.preventDefault();
        generate(page);
      }else if(target.matches('[data-v1062-apply]')){
        event.preventDefault();
        const message=$('[data-v64-susp-message]',page);
        const result=$('[data-v1062-output]',page)?.textContent.trim();
        if(!message||!result)return;
        message.value=result;
        message.dispatchEvent(new Event('input',{bubbles:true}));
        message.dispatchEvent(new Event('change',{bubbles:true}));
        const writer=$('[data-v1062-writer]',page);
        if(writer)note(writer,'Texto colocado en Mensaje adicional. Puedes editarlo y guardarlo como borrador.');
        message.focus({preventScroll:true});
      }
    });
    screen.addEventListener('change',event=>{
      if(!active()||!event.target.matches('[data-v64-susp-cat],[data-v64-susp-round],[data-v64-susp-type],[data-v64-susp-scope],[data-v64-susp-match],[data-v64-susp-venue],[data-v64-susp-reason],[data-v64-susp-date],[data-v64-susp-time],[data-v64-susp-priority]'))return;
      const writer=$('[data-v1062-writer]',screen);
      const result=$('[data-v1062-result]',writer||screen);
      if(result&&!result.hidden){result.hidden=true;note(writer,'Se modificaron los datos. Genera una propuesta actualizada.')}
    });
    queue();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
