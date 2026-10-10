/* V1212 — Crear aviso oficial: selectores reales, rol asistido y herramientas locales.
   Extiende el formulario existente sin cambiar sus permisos ni el backend. */
(()=>{
 'use strict';
 if(window.__LJR_NOTICE_SELECTORS_V1212__)return;
 window.__LJR_NOTICE_SELECTORS_V1212__=true;
 const $=(s,r=document)=>r.querySelector(s);
 const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const FALLBACK_FIELDS=[
  'Campo 1 · Unidad Deportiva Sur','Campo 2 · Unidad Deportiva Sur','Campo 3 · Unidad Deportiva Sur',
  'Campo 4 · Emiliano Zapata','Campo Cerrito de Gasca','Campo de Tavera','Campo San Juan de la Cruz',
  'Unidad Deportiva Santiago de Cuenda','Campo San Antonio de Romerillo','Campo Fraccionamiento Comontuoso',
  'Campo de Fútbol de Pozos','Campo Rincón de Centeno','Campo San José de la Montaña','Campo San Julián Tierra Blanca'
 ];
 const fieldCache={names:FALLBACK_FIELDS.slice()};
 let officialPromise=null,fieldsPromise=null;
 function option(v,t){const o=document.createElement('option');o.value=String(v);o.textContent=String(t);return o}
 const unique=values=>[...new Map(values.map(x=>String(x||'').trim()).filter(Boolean).map(x=>[norm(x),x])).values()].sort((a,b)=>a.localeCompare(b,'es'));
 function readOfficial(){
  if(!officialPromise)officialPromise=(async()=>{
   let db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
   if(db?.categories)return db;
   try{const r=await fetch('./data/official-live.json',{cache:'no-cache'});if(r.ok){db=await r.json();return db}}catch(_){}
   return db||{};
  })();
  return officialPromise;
 }
 function readFields(){
  if(!fieldsPromise)fieldsPromise=(async()=>{
   try{const r=await fetch('./data/fields-v38-22.json',{cache:'no-cache'});
    if(r.ok){const db=await r.json();fieldCache.names=unique([...(db.fields||[]).map(x=>x?.name),...FALLBACK_FIELDS]);}
   }catch(_){}
   return fieldCache.names;
  })();
  return fieldsPromise;
 }
 function dayAndTime(raw){
  const m=String(raw||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return {date:'',time:''};
  const d=+m[1],month=+m[2],year=+m[3],date=new Date(Date.UTC(year,month-1,d));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==d)return {date:'',time:''};
  const pad=v=>String(v).padStart(2,'0');
  return {date:year+'-'+pad(month)+'-'+pad(d),time:m[4]&&+m[4]<24?pad(m[4])+':'+m[5]:''};
 }
 function roundOf(raw){
  const text=String(raw||'').trim();
  const m=text.match(/jornada\s*#?\s*(\d{1,2})/i);
  return m?+m[1]:/^\d{1,2}$/.test(text)?+text:null;
 }
 function buildCatalog(db){
  const teams=new Map(),fixtures=[];
  for(const [cat,section] of Object.entries(db?.categories||{})){
   const names=[];
   (section.teams||[]).forEach(x=>names.push(typeof x==='string'?x:x?.name));
   Object.keys(section.rosters||{}).forEach(x=>names.push(x));
   (section.standings||[]).forEach(block=>(block.rows||[]).forEach(row=>names.push(row?.[1])));
   (section.fixtures||[]).forEach((block,bi)=>(block.rows||[]).forEach((row,ri)=>{
    if(!Array.isArray(row))return;
    names.push(row[2],row[6]);
    if(!String(row[2]||'').trim()||!String(row[6]||'').trim())return;
    const when=dayAndTime(row[8]);
    fixtures.push({id:String(cat)+'-'+bi+'-'+ri,cat:String(cat),round:roundOf(row[1]),
     home:String(row[2]).trim(),away:String(row[6]).trim(),
     field:String(row[7]||'').trim(),date:when.date,time:when.time});
   }));
   teams.set(String(cat),unique(names));
  }
  return {teams,fixtures};
 }
 function enhance(dialog){
  if(dialog.dataset.v1212Ready)return;
  const form=$('[data-editor-form]',dialog);
  if(!form||!form.elements.category||!form.elements.field||!form.elements.team||!form.elements.round)return;
  // Respetar los selectores oficiales que ya se incorporaron a la versión principal.
  if(form.elements.round.tagName!=='SELECT'||form.elements.field.tagName!=='SELECT'||form.elements.team.tagName!=='SELECT')return;
  dialog.dataset.v1212Ready='1';dialog.classList.add('ljr-notice-1212');
  const raw={round:form.elements.round,field:form.elements.field,team:form.elements.team};
  const notices=$('[data-status]',form);
  const speak=text=>{if(notices)notices.textContent=text};
  let catalog={teams:new Map(),fixtures:[]};
  const fixtureLabel=document.createElement('label');
  fixtureLabel.className='ljr-notice-fixture-label';
  fixtureLabel.append(document.createTextNode('Elegir partido del rol (opcional)'));
  const fixtureSelect=document.createElement('select');
  fixtureSelect.setAttribute('aria-label','Partido oficial para completar automáticamente');
  fixtureLabel.append(fixtureSelect);
  const hint=document.createElement('small');
  hint.textContent='Selecciona un partido para completar equipo, cancha y horario. Los datos requieren revisión.';
  fixtureLabel.append(hint);
  const grid=$('.ljr-editor-two',form);if(grid)grid.append(fixtureLabel);
  function ensureValue(select,value){
   if(!value)return;
   if(![...select.options].some(o=>o.value===String(value)))select.append(option(value,value));
   select.value=String(value);
   select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function renderFixtures(){
   const cat=form.elements.category.value,round=Number(raw.round.value)||null,old=fixtureSelect.value;
   fixtureSelect.replaceChildren(option('',cat==='all'?'Selecciona primero una categoría':'Selecciona un partido del rol'));
   if(cat==='all')return;
   catalog.fixtures.filter(f=>f.cat===cat&&(!round||f.round===round)).slice(0,150).forEach(f=>{
    fixtureSelect.append(option(f.id,(f.round?'J'+f.round+' · ':'')+f.home+' vs '+f.away+(f.date?' · '+f.date:'')));
   });
   fixtureSelect.value=[...fixtureSelect.options].some(o=>o.value===old)?old:'';
  }
  fixtureSelect.addEventListener('change',()=>{
   const match=catalog.fixtures.find(f=>f.id===fixtureSelect.value);if(!match)return;
   if(match.round)ensureValue(raw.round,match.round);
   if(match.field)ensureValue(raw.field,match.field);
   ensureValue(raw.team,match.home);
   if(match.date)form.elements.date.value=match.date;
   if(match.time)form.elements.time.value=match.time;
   raw.team.dispatchEvent(new Event('input',{bubbles:true}));
   form.elements.date.dispatchEvent(new Event('change',{bubbles:true}));
   speak('Partido consultado: '+match.home+' vs '+match.away+'. Verifica fecha, cancha y hora antes de publicar.');
  });
  form.elements.category.addEventListener('change',renderFixtures);
  raw.round.addEventListener('change',renderFixtures);
  renderFixtures();
  readOfficial().then(db=>{
   if(!dialog.isConnected)return;
   catalog=buildCatalog(db);
   renderFixtures();
   if(!catalog.fixtures.length)hint.textContent='No se pudo consultar el rol. Puedes capturar el aviso con los selectores actuales.';
  }).catch(()=>{hint.textContent='No se pudo consultar el rol. Los selectores existentes siguen disponibles.';});
  const tools=$('.ljr-editor-smart-tools',form);
  const title=form.elements.title,body=form.elements.body;
  if(tools){
   const share=document.createElement('button');
   share.type='button';share.textContent='↗ Compartir';share.dataset.v1212Share='1';
   share.addEventListener('click',async()=>{
    if(!body.value.trim())return speak('Escribe un comunicado antes de compartir.');
    if(typeof navigator.share!=='function')return speak('Compartir no está disponible; usa Copiar aviso para enviarlo manualmente.');
    try{await navigator.share({title:title.value.trim()||'Aviso de Liga Juventino Rosas',text:(title.value.trim()+'\n\n'+body.value.trim()).trim()});}
    catch(err){if(err?.name!=='AbortError')speak('No se pudo compartir. Puedes usar Copiar aviso.')}
   });
   tools.append(share);
   const png=document.createElement('button');
   png.type='button';png.textContent='↓ Descargar PNG';png.dataset.v1212Png='1';
   png.addEventListener('click',()=>{
    if(!body.value.trim())return speak('Escribe primero un mensaje para exportar.');
    const cv=document.createElement('canvas'),ctx=cv.getContext('2d');if(!ctx)return speak('Este navegador no permite exportar imágenes.');
    const W=1080,P=80,maxW=W-2*P,lines=[];
    const addParagraph=(text,size,weight)=>{
     ctx.font=weight+' '+size+'px system-ui,Arial,sans-serif';
     for(const paragraph of String(text||'').split('\n')){
      let line='';
      for(const word of paragraph.split(/\s+/).filter(Boolean)){
       const next=line?line+' '+word:word;
       if(line&&ctx.measureText(next).width>maxW){lines.push({text:line,size,weight});line=word;}else line=next;
      }
      if(line)lines.push({text:line,size,weight});
     }
    };
    addParagraph(title.value.trim()||'Comunicado oficial',48,'800');
    const titleLines=lines.splice(0);
    addParagraph(body.value.trim(),30,'500');
    const bodyLines=lines.splice(0,45);
    const H=Math.min(3600,360+titleLines.length*66+bodyLines.length*47+120);
    cv.width=W;cv.height=H;
    const grad=ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,'#0055A5');grad.addColorStop(.35,'#0D47A1');grad.addColorStop(1,'#0A235C');
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#FFFFFF';ctx.font='800 35px system-ui,Arial,sans-serif';
    ctx.fillText('LIGA JUVENTINO ROSAS',P,95);
    ctx.fillStyle='#C8E5FF';ctx.font='700 23px system-ui,Arial,sans-serif';ctx.fillText('COMUNICADO OFICIAL · VISTA PARA COMPARTIR',P,140);
    ctx.strokeStyle='#7FB8FF';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(P,169);ctx.lineTo(W-P,169);ctx.stroke();
    let y=235;
    const draw=(list,gap,color)=>{ctx.fillStyle=color;for(const line of list){ctx.font=line.weight+' '+line.size+'px system-ui,Arial,sans-serif';ctx.fillText(line.text,P,y);y+=gap;}};
    draw(titleLines,66,'#FFFFFF');y+=40;draw(bodyLines,47,'#F2F7FF');
    const a=document.createElement('a');a.download='aviso-liga-juventino-rosas.png';
    try{a.href=cv.toDataURL('image/png');document.body.append(a);a.click();a.remove();speak('Imagen PNG descargada. Revisa el contenido antes de compartir.');}
    catch(_){speak('No fue posible descargar la imagen en este dispositivo.')}
   });
   tools.append(png);
  }
  // El programador oficial ya existe: ahora recibe los datos escritos en esta ventana.
  const schedule=$('[data-editor-schedule]',form);
  if(schedule)schedule.addEventListener('click',event=>{
   if(typeof window.LJR_GLOBAL_NOTICES?.open!=='function')return;
   event.preventDefault();event.stopImmediatePropagation();
   const cat={'all':'Todas','3':'Primera','5':'Intermedia','4':'Segunda','2':'Veteranos 35+','1':'Veteranos 50+'}[form.elements.category.value]||'Todas';
   const prepared={title:title.value.trim().slice(0,120),body:body.value.trim().slice(0,700),
    category:cat,type:form.elements.type.value,field:raw.field.value.trim(),team:raw.team.value.trim()};
   if(window.LJR_GLOBAL_NOTICES.open(prepared))speak('Datos enviados al programador. Elige fecha, canales y confirma. Nada se ha enviado todavía.');
  },true);
  // El asistente siempre da una ayuda local aunque Chrome Android no incorpore modelo generativo.
  const ai=$('[data-editor-local-ai]',form);
  if(ai)ai.addEventListener('click',event=>{
   if(window.LanguageModel?.create)return;
   event.preventDefault();event.stopImmediatePropagation();
   if(!form.elements.details.value.trim())return speak('Escribe primero los hechos oficiales confirmados.');
   $('[data-generate="formal"]',form)?.click();
   $('[data-editor-check]',form)?.click();
   speak('Asistente local sin conexión: comunicado armado con reglas, sin modelo generativo. Verifica los hechos antes de publicar.');
  },true);
 }
 let waiting=false;
 function scan(){
  document.querySelectorAll('.liga-media-modal>section.ljr-editor-compose').forEach(enhance);
 }
 function enqueue(){
  if(waiting)return;waiting=true;
  queueMicrotask(()=>{waiting=false;scan()});
 }
 function start(){new MutationObserver(enqueue).observe(document.body,{childList:true,subtree:true});scan()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();