/* V161 — Centro WhatsApp del administrador/presidente.
   Se integra dentro de Más > Todas las herramientas y reutiliza Publicaciones.
   Archivos: Web Share API en Android; texto: chat directo por wa.me. */
(function(){
  'use strict';
  if(window.__LJR_V161_WHATSAPP_ADMIN__)return;
  window.__LJR_V161_WHATSAPP_ADMIN__=true;

  const ADMIN_LOCAL='4121715599';
  const ADMIN_E164='524121715599';
  const ADMIN_LABEL='Admin / Presidente de la Liga';
  let selectedFiles=[];

  function route(){
    return document.body?.dataset?.appRoute || location.hash.replace(/^#\/?/,'').split('?')[0] || 'home';
  }
  function esc(v){
    return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function toast(msg){
    document.querySelector('.v161-toast')?.remove();
    const n=document.createElement('div');
    n.className='v161-toast';
    n.textContent=msg;
    document.body.appendChild(n);
    setTimeout(()=>n.remove(),1900);
  }
  function defaultText(kind='general'){
    const map={
      standings:'📊 Tabla de posiciones · Liga Juventino Rosas\nAdjunto la tabla actualizada.',
      scorers:'⚽ Tabla de goleo · Liga Juventino Rosas\nAdjunto la tabla de goleadores actualizada.',
      calendar:'📅 Calendario / jornada · Liga Juventino Rosas\nAdjunto el calendario de partidos.',
      results:'🏁 Resultados · Liga Juventino Rosas\nAdjunto los resultados de la jornada.',
      cedula:'📄 Cédula de partido · Liga Juventino Rosas\nAdjunto la cédula correspondiente.',
      png:'🖼️ Archivo PNG · Liga Juventino Rosas\nAdjunto la imagen lista para publicar.',
      general:'📲 Liga Juventino Rosas\nEnvío archivo para revisión/publicación.'
    };
    return map[kind]||map.general;
  }
  function toolButton(){
    const b=document.createElement('button');
    b.type='button';
    b.className='v60-tool-card v161-wa-tool';
    b.dataset.v161OpenWhatsapp='1';
    b.innerHTML=
      '<span class="v60-tool-icon v161-wa-icon" aria-hidden="true">WA</span>'+
      '<span class="v60-tool-copy"><b>WhatsApp Admin</b><small>Enviar PNG, tablas, calendario, cédulas, goleo y resultados</small></span>'+
      '<i>›</i>';
    return b;
  }
  function mountTools(){
    const grid=document.querySelector('body[data-app-route="leagueTools"] .v60-tool-grid');
    if(!grid||grid.querySelector('[data-v161-open-whatsapp]'))return;
    const b=toolButton();
    const publication=[...grid.children].find(x=>/Publicaciones/i.test(x.textContent||''));
    if(publication)publication.insertAdjacentElement('afterend',b);
    else grid.appendChild(b);
  }
  function panelMarkup(){
    return '<section class="v161-wa-admin" data-v161-wa-admin>'+
      '<div class="v161-wa-head">'+
        '<span class="v161-wa-badge">WA</span>'+
        '<div><small>ENVÍO OFICIAL</small><h2>WhatsApp de la Liga</h2><p>'+esc(ADMIN_LABEL)+' · '+esc(ADMIN_LOCAL)+'</p></div>'+
      '</div>'+
      '<p class="v161-wa-help">Aquí puedes adjuntar archivos generados por la app: PNG de tablas, tabla de goleo, calendario, resultados, cédulas, PDF, JPG o CSV.</p>'+
      '<div class="v161-wa-kinds" aria-label="Tipo de envío">'+
        '<button type="button" data-v161-kind="standings">Tabla</button>'+
        '<button type="button" data-v161-kind="scorers">Goleo</button>'+
        '<button type="button" data-v161-kind="calendar">Calendario</button>'+
        '<button type="button" data-v161-kind="results">Resultados</button>'+
        '<button type="button" data-v161-kind="cedula">Cédula</button>'+
        '<button type="button" data-v161-kind="png">PNG</button>'+
      '</div>'+
      '<label class="v161-file-picker">'+
        '<input type="file" data-v161-files multiple accept="image/png,image/jpeg,image/webp,application/pdf,text/csv,.csv,.png,.jpg,.jpeg,.webp,.pdf">'+
        '<span>＋ Seleccionar archivos</span><small>PNG · JPG · WEBP · PDF · CSV</small>'+
      '</label>'+
      '<div class="v161-file-list" data-v161-file-list><span>Ningún archivo seleccionado</span></div>'+
      '<label class="v161-message"><span>Mensaje</span><textarea data-v161-message rows="4">'+esc(defaultText())+'</textarea></label>'+
      '<div class="v161-wa-actions">'+
        '<button type="button" class="primary" data-v161-share-files>Compartir archivos por WhatsApp</button>'+
        '<button type="button" data-v161-open-chat>Abrir chat del presidente</button>'+
        '<button type="button" data-v161-copy-number>Copiar número</button>'+
      '</div>'+
      '<div class="v161-generators">'+
        '<b>Crear antes de enviar</b>'+
        '<button type="button" data-v161-go="tableExport">Tabla PNG / CSV</button>'+
        '<button type="button" data-v161-go="scorers">Tabla de goleo</button>'+
        '<button type="button" data-v161-go="competition">Calendario / resultados</button>'+
        '<button type="button" data-v161-go="cedulaBuilder">Cédula PDF</button>'+
      '</div>'+
      '<p class="v161-wa-note">En Android, “Compartir archivos” abre el menú del teléfono: elige WhatsApp y después el chat del presidente. “Abrir chat” sí abre directamente el número configurado.</p>'+
    '</section>';
  }
  function mountPublications(){
    const page=document.querySelector('body[data-app-route="publications"] .v60-tool-page');
    if(!page||page.querySelector('[data-v161-wa-admin]'))return;
    page.insertAdjacentHTML('beforeend',panelMarkup());
    bindPanel(page.querySelector('[data-v161-wa-admin]'));
  }
  function fileSummary(){
    const box=document.querySelector('[data-v161-file-list]');
    if(!box)return;
    if(!selectedFiles.length){
      box.innerHTML='<span>Ningún archivo seleccionado</span>';
      return;
    }
    box.innerHTML=selectedFiles.map(f=>'<div><b>'+esc(f.name)+'</b><small>'+Math.max(1,Math.round(f.size/1024))+' KB</small></div>').join('');
  }
  function currentMessage(){
    return document.querySelector('[data-v161-message]')?.value?.trim() || defaultText();
  }
  async function shareFiles(){
    if(!selectedFiles.length){
      toast('Selecciona por lo menos un PNG, PDF, imagen o CSV');
      document.querySelector('[data-v161-files]')?.click();
      return;
    }
    const payload={title:'Liga Juventino Rosas',text:currentMessage(),files:selectedFiles};
    try{
      if(navigator.canShare?.({files:selectedFiles}) && navigator.share){
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard?.writeText(currentMessage());
      toast('Tu navegador no comparte archivos directo; mensaje copiado');
      openChat();
    }catch(e){
      if(e?.name!=='AbortError')toast('No se pudo abrir el menú para compartir');
    }
  }
  function openChat(){
    const text=currentMessage();
    const url='https://wa.me/'+ADMIN_E164+'?text='+encodeURIComponent(text);
    const w=window.open(url,'_blank','noopener,noreferrer');
    if(!w)location.href=url;
  }
  function bindPanel(panel){
    if(!panel||panel.dataset.v161Bound==='1')return;
    panel.dataset.v161Bound='1';

    panel.querySelector('[data-v161-files]')?.addEventListener('change',e=>{
      selectedFiles=[...(e.target.files||[])].slice(0,10);
      fileSummary();
    });
    panel.querySelectorAll('[data-v161-kind]').forEach(b=>b.addEventListener('click',()=>{
      panel.querySelectorAll('[data-v161-kind]').forEach(x=>x.classList.toggle('active',x===b));
      const ta=panel.querySelector('[data-v161-message]');
      if(ta)ta.value=defaultText(b.dataset.v161Kind);
    }));
    panel.querySelector('[data-v161-share-files]')?.addEventListener('click',shareFiles);
    panel.querySelector('[data-v161-open-chat]')?.addEventListener('click',openChat);
    panel.querySelector('[data-v161-copy-number]')?.addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(ADMIN_LOCAL);toast('Número copiado')}catch(e){toast(ADMIN_LOCAL)}
    });
    panel.querySelectorAll('[data-v161-go]').forEach(b=>b.addEventListener('click',()=>{location.hash='#/'+b.dataset.v161Go}));
  }
  function mount(){
    const r=route();
    if(r==='leagueTools')mountTools();
    if(r==='publications')mountPublications();
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-v161-open-whatsapp]')){
      e.preventDefault();
      location.hash='#/publications';
      setTimeout(()=>document.querySelector('[data-v161-wa-admin]')?.scrollIntoView({behavior:'smooth',block:'start'}),220);
    }
  },true);

  window.addEventListener('hashchange',()=>requestAnimationFrame(mount));
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>requestAnimationFrame(mount)).observe(screen,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(mount),{once:true});
  else requestAnimationFrame(mount);
})();