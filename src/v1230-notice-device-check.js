/* V1230 — Diagnóstico real del dispositivo en Crear aviso oficial.
   Solo lectura: NO registra Push, NO solicita permisos ni envía mensajes. */
(()=>{
 'use strict';
 if(window.__LJR_NOTICE_DEVICE_CHECK_V1230__)return;
 window.__LJR_NOTICE_DEVICE_CHECK_V1230__=true;
 const $=(q,root=document)=>root.querySelector(q);
 const msg=(key,detail,pass=null)=>({key,detail,pass});
 function checkHost(dialog){
  const form=$('[data-editor-form]',dialog),tools=$('.ljr-editor-smart-tools',form||dialog);
  if(!form||!tools||form.querySelector('[data-v1230-check]'))return;
  const button=document.createElement('button');button.type='button';button.dataset.v1230Check='1';
  button.textContent='◉ Revisar este dispositivo';button.title='Comprobar diseño, Push, IA local y servidor sin publicar';
  const results=document.createElement('section');
  results.className='ljr-device-diagnostic';results.hidden=true;results.dataset.v1230Results='1';
  results.setAttribute('aria-label','Resultado de la revisión del dispositivo');
  results.setAttribute('aria-live','polite');
  const preview=$('.ljr-editor-preview',form);
  if(preview)preview.before(results);else form.append(results);
  tools.append(button);
  let busy=false;
  function draw(items){
   results.replaceChildren();
   const heading=document.createElement('h3');heading.textContent='Comprobación de este navegador';
   results.append(heading);
   const list=document.createElement('div');list.className='ljr-device-diagnostic-list';
   for(const item of items){
    const row=document.createElement('div');row.className='ljr-device-diagnostic-item';
    row.dataset.status=item.pass===true?'ok':item.pass===false?'warning':'neutral';
    const title=document.createElement('strong');
    title.textContent=(item.pass===true?'✓ ':item.pass===false?'○ ':'• ')+item.key;
    const detail=document.createElement('small');detail.textContent=item.detail;
    row.append(title,detail);list.append(row);
   }
   results.append(list);
   const note=document.createElement('p');
   note.textContent='Esta revisión no envía avisos ni activa permisos. Para probar una notificación real, activa Push en Notificaciones desde tu teléfono y realiza una prueba autorizada.';
   results.append(note);
  }
  async function inspect(){
   if(busy)return;busy=true;button.disabled=true;results.hidden=false;
   draw([msg('Comprobando…','Revisando opciones locales y disponibilidad de la API.')]);
   const items=[];
   try{
    const mobile=Boolean(navigator.userAgentData?.mobile)||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent||'');
    items.push(msg('Pantalla móvil',mobile?'Navegador móvil detectado.':'Navegador de escritorio: la prueba no sustituye una realizada en tu Android.',mobile));
    const viewportWidth=Math.round(window.visualViewport?.width||window.innerWidth);
    const width=dialog.getBoundingClientRect().width;
    const overflowing=[...form.querySelectorAll('label,select,input,textarea,button')].filter(el=>{
     if(el.hidden||getComputedStyle(el).display==='none')return false;
     const box=el.getBoundingClientRect(),parent=el.closest('label')||form;
     return box.width>parent.getBoundingClientRect().width+4;
    });
    items.push(msg('Diseño adaptable',overflowing.length?
     overflowing.length+' controles sobresalen de su contenedor.':
     'Controles dentro de sus cuadros a '+viewportWidth+' px de pantalla; ventana de '+Math.round(width)+' px.',!overflowing.length));
    const secure=window.isSecureContext===true;
    const hasPush=secure&&'Notification' in window&&'serviceWorker' in navigator&&'PushManager' in window;
    items.push(msg('Compatibilidad Web Push',hasPush?'El navegador admite Push en contexto seguro.':'Falta HTTPS, Service Worker o compatibilidad Push.',hasPush));
    if(hasPush){
     const permission=Notification.permission;
     items.push(msg('Permiso de avisos',permission==='granted'?'Concedido':permission==='denied'?'Bloqueado en el navegador':'Aún no solicitado; actívalo desde Notificaciones.',permission==='granted'));
     try{
      const registration=await navigator.serviceWorker.getRegistration('./');
      const subscription=registration?.pushManager?await registration.pushManager.getSubscription():null;
      items.push(msg('Suscripción del teléfono',subscription?'Existe una suscripción Push en este navegador.':'No se encontró una suscripción Push. Actívala desde la sección Notificaciones.',Boolean(subscription)));
     }catch(_){items.push(msg('Suscripción del teléfono','No se pudo leer la suscripción del navegador.',false));}
    }
    const native=window.LanguageModel;
    if(typeof native?.create!=='function'){
     items.push(msg('IA local','Modelo generativo integrado no disponible; el asistente por reglas sigue funcionando sin conexión.',null));
    }else{
     try{
      const state=typeof native.availability==='function'?await native.availability():'available';
      items.push(msg('IA local',state==='unavailable'?'El navegador no dispone del modelo.':'API local presente: '+state+'. La generación requiere revisar el texto antes de publicar.',state!=='unavailable'));
     }catch(_){items.push(msg('IA local','No fue posible comprobar el modelo. El asistente por reglas sigue disponible.',null));}
    }
    // La API solo informa estados públicos; no se envían cookies, teléfonos ni tokens.
    let host='';
    try{
     const config=await fetch('./data/notifications-client.json',{cache:'no-store',credentials:'omit'});
     if(config.ok){
      const body=await config.json(),u=new URL(body?.apiBaseUrl||'',location.href);
      if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash)host=u.origin;
     }
    }catch(_){}
    if(!host)items.push(msg('API de avisos','URL HTTPS no disponible en este dispositivo.',false));
    else{
     const ctrl=new AbortController(),timeout=setTimeout(()=>ctrl.abort(),6500);
     try{
      const response=await fetch(host+'/health/ready',{cache:'no-store',credentials:'omit',mode:'cors',signal:ctrl.signal});
      const health=response.ok?await response.json():null;
      items.push(msg('Servidor y PostgreSQL',health?.ready&&health?.database==='connected'?'API y base de datos responden correctamente.':'No se pudo confirmar la disponibilidad.',Boolean(health?.ready&&health?.database==='connected')));
      if(health){
       items.push(msg('Avisos programados',health.schedulerEnabled?'Programador interno habilitado; falta probar una entrega autorizada.':'Programador interno desactivado.',Boolean(health.schedulerEnabled)));
       items.push(msg('Envío Web Push',health.pushEnabled?'Servidor Push configurado; la entrega depende de la suscripción del teléfono.':'Claves de envío Push todavía no disponibles.',Boolean(health.pushEnabled)));
       items.push(msg('SMS / WhatsApp',health.smsEnabled||health.whatsappEnabled?
        'Hay canales de mensajería configurados; su uso exige consentimiento y autorización.':
        'No configurados para envío automático. Compartir manualmente sigue disponible.',null));
      }
     }catch(_){items.push(msg('Conexión con Railway','No fue posible consultar la API (red, CORS o tiempo de espera).',false));}
     finally{clearTimeout(timeout);}
    }
   }catch(_){items.push(msg('Diagnóstico incompleto','El navegador no permitió consultar todas las capacidades.',false));}
   draw(items);button.disabled=false;busy=false;
  }
  button.addEventListener('click',inspect);
 }
 let queued=false;
 function scan(){document.querySelectorAll('.liga-media-modal > section.ljr-editor-compose').forEach(checkHost);}
 function trigger(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;scan()});}
 function boot(){new MutationObserver(trigger).observe(document.body,{childList:true,subtree:true});scan();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();