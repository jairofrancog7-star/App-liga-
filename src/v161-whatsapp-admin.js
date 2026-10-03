/* V666 — Centro global de archivos + WhatsApp del presidente.
   Unifica accesos a generadores PNG/PDF/CSV, captura el último archivo
   descargado en la SPA, permite reexportar imágenes a 2K/4K y conserva
   el envío por Web Share + chat directo al número oficial configurado. */
(function(){
  'use strict';
  if(window.__LJR_V666_GLOBAL_FILE_CENTER__)return;
  window.__LJR_V666_GLOBAL_FILE_CENTER__=true;

  const ADMIN_LOCAL='4121715599';
  const ADMIN_E164='524121715599';
  const ADMIN_LABEL='Presidente de la Liga';
  const MAX_FILES=12;
  /* V667 — auditoría global de generadores reales.
     Cada acceso abre el generador correcto y, cuando aplica, deja seleccionado
     el tipo exacto de bracket/documento para evitar mandar a una pantalla genérica. */
  const GENERATORS=[
    {icon:'▦',title:'Tabla de posiciones',sub:'PNG HD · CSV · por categoría',route:'tableExport',kind:'standings'},
    {icon:'⚽',title:'Tabla de goleo PNG',sub:'Publicación HD por categoría',route:'publicationCenter',prep:'pub:scorers',kind:'scorers'},
    {icon:'📅',title:'Calendario / jornada PNG',sub:'Partidos próximos · categoría y jornada',route:'publicationCenter',prep:'pub:calendar',kind:'calendar'},
    {icon:'🏁',title:'Resultados PNG',sub:'Marcadores oficiales por categoría',route:'publicationCenter',prep:'pub:results',kind:'results'},

    {icon:'🏆',title:'Bracket 1 · Round of 16',sub:'Diseño exacto · PNG HD / PDF',route:'bracketBuilder',prep:'bracket:round',kind:'bracket'},
    {icon:'🏆',title:'Bracket 2 · Full Bracket',sub:'Diseño completo · PNG HD / PDF',route:'bracketBuilder',prep:'bracket:full',kind:'bracket'},
    {icon:'🏆',title:'Bracket 3 · Cuartos exacto',sub:'Cuartos de final · PNG HD / PDF',route:'bracketBuilder',prep:'bracket:quarters',kind:'bracket'},
    {icon:'🗓',title:'Agenda de jornada',sub:'Horarios, campos y cruces · PNG',route:'agendaBuilder',kind:'calendar'},

    {icon:'🟥',title:'Jugadores sancionados PNG',sub:'Castigados oficiales · por categoría',route:'publicationCenter',prep:'pub:sanctions',kind:'sanctions'},
    {icon:'⚠',title:'Castigados / disciplina',sub:'Tarjetas, expulsados y pendientes · PNG',route:'discipline',prep:'discipline:suspensions',kind:'sanctions'},
    {icon:'⛔',title:'Aviso de suspensión',sub:'Suspensión de jornada · PNG / compartir',route:'suspensionTool',kind:'general'},
    {icon:'↔',title:'Cambio de jornada',sub:'Cancha, horario o partido · PNG',route:'scheduleChanges',kind:'general'},

    {icon:'📄',title:'Cédula arbitral PDF',sub:'Hoja oficial completa · logos y plantillas',route:'cedulaBuilder',kind:'cedula'},
    {icon:'🖼',title:'Cédula de partido PNG',sub:'Publicación HD por categoría y partido',route:'publicationCenter',prep:'pub:cedula',kind:'cedula'},
    {icon:'📚',title:'Cédulas oficiales',sub:'Consultar y abrir cédulas publicadas',route:'cedulas',kind:'cedula'},
    {icon:'🪪',title:'Credencial de jugador',sub:'PNG / PDF con foto y escudo',route:'credentialBuilder',kind:'png'},
    {icon:'✓',title:'Permisos y autorizaciones',sub:'PDF · PNG · JPG · SVG',route:'permissionBuilder',kind:'general'},

    {icon:'📰',title:'Centro de publicaciones',sub:'Tablas, goleo, jornadas, sanciones, cédulas y avisos',route:'publicationCenter',kind:'png'},
    {icon:'📊',title:'Estadísticas',sub:'Datos, rendimiento y tablas',route:'v38Stats',kind:'standings'},
    {icon:'⚙',title:'Simulador',sub:'Escenarios y exportación PNG',route:'simulator',kind:'png'},
    {icon:'✎',title:'Tácticas',sub:'Pizarra · PNG / JSON',route:'tactics',kind:'png'},
    {icon:'✦',title:'Boletines y avisos',sub:'Textos y material para publicar',route:'publications',kind:'png'}
  ];

  let selectedFiles=[];
  let previewUrl='';
  let capturedName='';

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
    setTimeout(()=>n.remove(),2100);
  }
  function defaultText(kind='general'){
    const map={
      standings:'📊 Tabla de posiciones · Liga Juventino Rosas\nAdjunto la tabla actualizada.',
      scorers:'⚽ Tabla de goleo · Liga Juventino Rosas\nAdjunto la tabla de goleadores actualizada.',
      calendar:'📅 Calendario / jornada · Liga Juventino Rosas\nAdjunto el calendario de partidos.',
      results:'🏁 Resultados · Liga Juventino Rosas\nAdjunto los resultados de la jornada.',
      cedula:'📄 Cédula de partido · Liga Juventino Rosas\nAdjunto la cédula correspondiente.',
      bracket:'🏆 Liguilla / bracket · Liga Juventino Rosas\nAdjunto el cuadro actualizado.',
      sanctions:'🟥 Jugadores sancionados · Liga Juventino Rosas\nAdjunto la lista oficial de castigados / sancionados.',
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
      '<span class="v60-tool-icon v161-wa-icon" aria-hidden="true">HD</span>'+
      '<span class="v60-tool-copy"><b>Centro global de archivos</b><small>PNG HD, tablas, bracket, cédulas, permisos y WhatsApp</small></span>'+
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
  function generatorMarkup(){
    return GENERATORS.map(g=>
      '<button type="button" class="v161-generator-card" data-v161-go="'+esc(g.route)+'" data-v161-prep="'+esc(g.prep||'')+'" data-v161-kind-preset="'+esc(g.kind||'general')+'">'+
        '<span class="v161-generator-icon" aria-hidden="true">'+g.icon+'</span>'+
        '<span><b>'+esc(g.title)+'</b><small>'+esc(g.sub)+'</small></span>'+
        '<i>›</i>'+
      '</button>'
    ).join('');
  }
  function panelMarkup(){
    return '<section class="v161-wa-admin v161-global-center" data-v161-global-center data-v161-wa-admin>'+
      '<div class="v161-global-head">'+
        '<div><small>CENTRO GLOBAL</small><h2>Archivos y publicaciones</h2><p>Todo lo que genera la Liga en un solo lugar.</p></div>'+
        '<span class="v161-hd-pill">PNG · HD</span>'+
      '</div>'+
      '<div class="v161-generators-title"><b>Generadores</b><small>Abre el formato que necesitas</small></div>'+
      '<div class="v161-generator-grid">'+generatorMarkup()+'</div>'+
      '<div class="v161-center-divider"></div>'+
      '<div class="v161-wa-head">'+
        '<span class="v161-wa-badge">WA</span>'+
        '<div><small>ENVÍO OFICIAL</small><h3>Presidente de la Liga</h3><p>'+esc(ADMIN_LOCAL)+' · chat directo</p></div>'+
      '</div>'+
      '<p class="v161-wa-help">Selecciona o reutiliza un archivo generado por la app. Puedes descargar la imagen en resolución 2K/4K y después compartirla por WhatsApp.</p>'+
      '<div class="v161-wa-kinds" aria-label="Tipo de envío">'+
        '<button type="button" data-v161-kind="standings">Tabla</button>'+
        '<button type="button" data-v161-kind="scorers">Goleo</button>'+
        '<button type="button" data-v161-kind="calendar">Jornada</button>'+
        '<button type="button" data-v161-kind="results">Resultados</button>'+
        '<button type="button" data-v161-kind="bracket">Bracket</button>'+
        '<button type="button" data-v161-kind="sanctions">Sancionados</button>'+
        '<button type="button" data-v161-kind="cedula">Cédula</button>'+
        '<button type="button" data-v161-kind="png">PNG</button>'+
      '</div>'+
      '<label class="v161-file-picker">'+
        '<input type="file" data-v161-files multiple accept="image/png,image/jpeg,image/webp,application/pdf,text/csv,.csv,.png,.jpg,.jpeg,.webp,.pdf">'+
        '<span>＋ Seleccionar archivos</span><small>PNG · JPG · WEBP · PDF · CSV · hasta '+MAX_FILES+'</small>'+
      '</label>'+
      '<div class="v161-last-file" data-v161-last-file hidden></div>'+
      '<div class="v161-file-preview" data-v161-preview hidden><img alt="Vista previa del archivo seleccionado"></div>'+
      '<div class="v161-file-list" data-v161-file-list><span>Ningún archivo seleccionado</span></div>'+
      '<div class="v161-hd-actions">'+
        '<button type="button" data-v161-download-original>Descargar original</button>'+
        '<button type="button" data-v161-hd="2560">Descargar HD 2K</button>'+
        '<button type="button" data-v161-hd="3840">Descargar HD 4K</button>'+
      '</div>'+
      '<label class="v161-message"><span>Mensaje</span><textarea data-v161-message rows="4">'+esc(defaultText())+'</textarea></label>'+
      '<div class="v161-wa-actions">'+
        '<button type="button" class="primary" data-v161-share-files>Compartir archivo</button>'+
        '<button type="button" class="whatsapp" data-v161-open-chat>WhatsApp presidente · 412 171 5599</button>'+
        '<button type="button" data-v161-copy-number>Copiar número</button>'+
      '</div>'+
      '<p class="v161-wa-note">El botón de WhatsApp abre directamente el chat del presidente. Para adjuntar un archivo, Android exige usar el menú de compartir del teléfono; la web no puede insertar un archivo en un chat específico sin confirmación del usuario.</p>'+
    '</section>';
  }
  function createPanel(){
    const wrap=document.createElement('div');
    wrap.innerHTML=panelMarkup().trim();
    return wrap.firstElementChild;
  }
  function mountPublications(){
    const r=route();
    if(r!=='publications'&&r!=='publicationCenter')return;
    const host=r==='publications'
      ? document.querySelector('body[data-app-route="publications"] .v60-tool-page')
      : document.querySelector('body[data-app-route="publicationCenter"] [data-v561-publications-mount]');
    if(!host||host.querySelector('[data-v161-global-center]'))return;
    const panel=createPanel();
    if(r==='publications'){
      const ai=host.querySelector('.v95-ai-bulletins');
      const out=host.querySelector('.v95-bulletin-output,.v95-bulletin-preview');
      if(ai)ai.insertAdjacentElement('afterend',panel);
      else if(out)out.insertAdjacentElement('beforebegin',panel);
      else host.appendChild(panel);
    }else{
      host.appendChild(panel);
    }
    bindPanel(panel);
    fileSummary(panel);
  }
  function fileSummary(panel=document.querySelector('[data-v161-global-center]')){
    if(!panel)return;
    const box=panel.querySelector('[data-v161-file-list]');
    if(box){
      if(!selectedFiles.length)box.innerHTML='<span>Ningún archivo seleccionado</span>';
      else box.innerHTML=selectedFiles.map(f=>
        '<div><span><b>'+esc(f.name)+'</b><em>'+esc((f.type||'archivo').replace('image/','').toUpperCase())+'</em></span><small>'+Math.max(1,Math.round(f.size/1024))+' KB</small></div>'
      ).join('');
    }
    const last=panel.querySelector('[data-v161-last-file]');
    if(last){
      if(capturedName){
        last.hidden=false;
        last.innerHTML='<span>Último generado en la app</span><b>'+esc(capturedName)+'</b>';
      }else last.hidden=true;
    }
    updatePreview(panel);
  }
  function updatePreview(panel){
    const box=panel?.querySelector('[data-v161-preview]');
    const img=box?.querySelector('img');
    if(!box||!img)return;
    if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=''}
    const f=selectedFiles.find(x=>/^image\//i.test(x.type||''));
    if(!f){box.hidden=true;img.removeAttribute('src');return}
    previewUrl=URL.createObjectURL(f);
    img.src=previewUrl;
    box.hidden=false;
  }
  function normalizeFile(value,name){
    if(value instanceof File)return value;
    if(value instanceof Blob)return new File([value],name||'archivo-liga.png',{type:value.type||'application/octet-stream'});
    return null;
  }
  function registerAsset(value,name){
    const file=normalizeFile(value,name);
    if(!file)return null;
    selectedFiles=[file,...selectedFiles.filter(f=>f!==file&&f.name!==file.name)].slice(0,MAX_FILES);
    capturedName=file.name;
    document.querySelectorAll('[data-v161-global-center]').forEach(fileSummary);
    return file;
  }
  function currentMessage(panel=document.querySelector('[data-v161-global-center]')){
    return panel?.querySelector('[data-v161-message]')?.value?.trim() || defaultText();
  }
  function downloadFile(file){
    const u=URL.createObjectURL(file);
    const a=document.createElement('a');
    a.href=u;a.download=file.name||'archivo-liga';a.rel='noopener';a.style.display='none';
    document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},3500);
  }
  async function imageSource(file){
    if(window.createImageBitmap){
      try{return await createImageBitmap(file)}catch(_){}
    }
    return await new Promise((resolve,reject)=>{
      const u=URL.createObjectURL(file),im=new Image();
      im.onload=()=>{URL.revokeObjectURL(u);resolve(im)};
      im.onerror=()=>{URL.revokeObjectURL(u);reject(Error('No se pudo leer la imagen'))};
      im.src=u;
    });
  }
  async function makeHd(file,target){
    const src=await imageSource(file);
    const iw=src.width||src.naturalWidth||0,ih=src.height||src.naturalHeight||0;
    if(!iw||!ih)throw Error('Imagen inválida');
    const long=Math.max(iw,ih);
    const scale=Math.max(1,target/long);
    const w=Math.max(1,Math.round(iw*scale)),h=Math.max(1,Math.round(ih*scale));
    const c=document.createElement('canvas');c.width=w;c.height=h;
    const x=c.getContext('2d',{alpha:true});
    x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
    x.drawImage(src,0,0,w,h);
    if(typeof src.close==='function')try{src.close()}catch(_){}
    const blob=await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('No se pudo crear el PNG HD')),'image/png'));
    const base=(file.name||'imagen-liga').replace(/\.[^.]+$/,'');
    return new File([blob],base+'_HD_'+target+'.png',{type:'image/png'});
  }
  async function downloadHd(target){
    const images=selectedFiles.filter(f=>/^image\//i.test(f.type||''));
    if(!images.length){toast('Selecciona primero una imagen PNG, JPG o WEBP');return}
    toast('Preparando imagen HD…');
    for(const file of images){
      try{
        const hd=await makeHd(file,target);
        registerAsset(hd,hd.name);
        downloadFile(hd);
        await new Promise(r=>setTimeout(r,150));
      }catch(_){toast('No se pudo convertir '+file.name)}
    }
    toast(target>=3840?'Descarga 4K lista':'Descarga 2K lista');
  }
  async function shareFiles(panel){
    if(!selectedFiles.length){
      toast('Selecciona por lo menos un archivo');
      panel?.querySelector('[data-v161-files]')?.click();
      return;
    }
    const payload={title:'Liga Juventino Rosas',text:currentMessage(panel),files:selectedFiles};
    try{
      if(navigator.canShare?.({files:selectedFiles}) && navigator.share){
        await navigator.share(payload);
        return;
      }
      selectedFiles.forEach(downloadFile);
      try{await navigator.clipboard?.writeText(currentMessage(panel))}catch(_){}
      toast('Archivo descargado y mensaje copiado');
    }catch(e){
      if(e?.name!=='AbortError')toast('No se pudo abrir el menú para compartir');
    }
  }
  function openChat(panel){
    const text=currentMessage(panel);
    const url='https://wa.me/'+ADMIN_E164+'?text='+encodeURIComponent(text);
    const w=window.open(url,'_blank','noopener,noreferrer');
    if(!w)location.href=url;
  }
  function presetKind(panel,kind){
    panel.querySelectorAll('[data-v161-kind]').forEach(x=>x.classList.toggle('active',x.dataset.v161Kind===kind));
    const ta=panel.querySelector('[data-v161-message]');
    if(ta)ta.value=defaultText(kind);
  }
  function goGenerator(panel,b){
    const r=b.dataset.v161Go||'';
    const prep=b.dataset.v161Prep||'';
    const kind=b.dataset.v161KindPreset||'general';
    presetKind(panel,kind);
    try{
      if(prep==='results'){
        localStorage.setItem('competitionTab','results');
        localStorage.setItem('v40-competition-tab','results');
      }
      if(prep.startsWith('bracket:')){
        const design=prep.split(':')[1]||'round';
        localStorage.setItem('v651-bracket-design',design);
        localStorage.setItem('v651-bracket-stage',design==='quarters'?'qf':'auto');
      }
      if(prep==='discipline:suspensions'){
        localStorage.setItem('v655-discipline-type','suspensions');
        localStorage.setItem('v563-discipline-view','suspensions');
        localStorage.setItem('v655-discipline-cat','all');
      }
      if(prep.startsWith('pub:')){
        const pubKind=prep.split(':')[1]||'standings';
        localStorage.setItem('v561-publication-kind',pubKind);
        if(route()==='publicationCenter'){
          const sel=document.querySelector('[data-pub-type]');
          if(sel){
            sel.value=pubKind;
            sel.dispatchEvent(new Event('change',{bubbles:true}));
            sel.closest('.v561-league,.v642-publications-card')?.scrollIntoView({behavior:'smooth',block:'start'});
            return;
          }
        }
      }
    }catch(_){}
    if(r==='publications'){
      panel.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    const gate=window.LJR_ADMIN_ROUTE;
    if(gate?.routes?.has?.(r) && typeof gate.open==='function'){gate.open(r);return}
    location.hash='#/'+r;
  }
  function bindPanel(panel){
    if(!panel||panel.dataset.v161Bound==='1')return;
    panel.dataset.v161Bound='1';

    panel.querySelector('[data-v161-files]')?.addEventListener('change',e=>{
      selectedFiles=[...(e.target.files||[])].slice(0,MAX_FILES);
      if(selectedFiles[0])capturedName=selectedFiles[0].name;
      fileSummary(panel);
    });
    panel.querySelectorAll('[data-v161-kind]').forEach(b=>b.addEventListener('click',()=>presetKind(panel,b.dataset.v161Kind)));
    panel.querySelectorAll('[data-v161-go]').forEach(b=>b.addEventListener('click',()=>goGenerator(panel,b)));
    panel.querySelector('[data-v161-share-files]')?.addEventListener('click',()=>shareFiles(panel));
    panel.querySelector('[data-v161-open-chat]')?.addEventListener('click',()=>openChat(panel));
    panel.querySelector('[data-v161-copy-number]')?.addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(ADMIN_LOCAL);toast('Número copiado')}catch(_){toast(ADMIN_LOCAL)}
    });
    panel.querySelector('[data-v161-download-original]')?.addEventListener('click',()=>{
      if(!selectedFiles.length){toast('Selecciona primero un archivo');return}
      selectedFiles.forEach(downloadFile);
    });
    panel.querySelectorAll('[data-v161-hd]').forEach(b=>b.addEventListener('click',()=>downloadHd(Number(b.dataset.v161Hd)||2560)));
  }

  function captureGeneratedDownload(a){
    if(!a||a.dataset.v161Capture==='1')return;
    const href=a.href||a.getAttribute('href')||'';
    const name=a.download||'archivo-liga';
    if(!/^(blob:|data:)/i.test(href))return;
    a.dataset.v161Capture='1';
    Promise.resolve().then(async()=>{
      try{
        const r=await fetch(href);
        if(!r.ok&&r.status!==0)return;
        const blob=await r.blob();
        if(!blob?.size)return;
        registerAsset(blob,name);
      }catch(_){}
    });
  }

  window.LJR_FILE_CENTER={
    number:ADMIN_LOCAL,
    e164:ADMIN_E164,
    registerAsset,
    open(){
      if(route()==='publications'){
        mountPublications();
        setTimeout(()=>document.querySelector('[data-v161-global-center]')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
        return;
      }
      location.hash='#/publications';
      setTimeout(()=>document.querySelector('[data-v161-global-center]')?.scrollIntoView({behavior:'smooth',block:'start'}),260);
    },
    async hd(file,target=2560){
      const f=normalizeFile(file);
      if(!f)throw Error('Archivo inválido');
      return await makeHd(f,target);
    }
  };
  window.LJR_WHATSAPP_ADMIN={
    async shareAsset(value,text){
      const file=registerAsset(value,value?.name||'archivo-liga.png');
      if(!file)return;
      const payload={title:'Liga Juventino Rosas',text:text||defaultText('png'),files:[file]};
      try{
        if(navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share(payload);return}
      }catch(e){if(e?.name==='AbortError')return}
      downloadFile(file);
      try{await navigator.clipboard?.writeText(payload.text)}catch(_){}
      const url='https://wa.me/'+ADMIN_E164+'?text='+encodeURIComponent(payload.text);
      const w=window.open(url,'_blank','noopener,noreferrer');if(!w)location.href=url;
    },
    openChat(text){
      const url='https://wa.me/'+ADMIN_E164+'?text='+encodeURIComponent(text||defaultText());
      const w=window.open(url,'_blank','noopener,noreferrer');if(!w)location.href=url;
    }
  };

  function mount(){
    const r=route();
    if(r==='leagueTools')mountTools();
    if(r==='publications'||r==='publicationCenter')mountPublications();
  }

  document.addEventListener('click',e=>{
    const down=e.target.closest('a[download]');
    if(down)captureGeneratedDownload(down);
    if(e.target.closest('[data-v161-open-whatsapp]')){
      e.preventDefault();
      window.LJR_FILE_CENTER.open();
    }
  },true);

  window.addEventListener('hashchange',()=>requestAnimationFrame(mount));
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>requestAnimationFrame(mount)).observe(screen,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(mount),{once:true});
  else requestAnimationFrame(mount);
})();