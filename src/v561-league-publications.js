import {normalizeCompetition,norm} from './competition-data.js';
const labels={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'},order=['3','5','4','2','1'];
const categoryLogos={'3':'branding/primera-fuerza-hd.png','5':'categories/intermedia.webp','4':'categories/segunda-fuerza.webp','2':'categories/veteranos-35-user.png','1':'categories/veteranos-50.webp'};
const LEAGUE_LOGO='./assets/liga-logo.webp';
const qIcon=type=>({
 play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
 history:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2"/><path d="M4.8 6.4A8 8 0 1 1 4 12"/><path d="M4 5v4h4"/></svg>',
 ranking:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V11h4v8M10 19V6h4v13M15 19V9h4v10"/></svg>',
 trophy:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M8 20h8M9 17h6"/></svg>',
 clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>',
 calendar:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16"/></svg>',
 pin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg>',
 save:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h12l2 2v14H5z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/></svg>',
 download:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M8 11l4 4 4-4M5 20h14"/></svg>'
}[type]||'');
const titles={standings:'Tabla de clasificación',scorers:'Tabla de goleo',calendar:'Calendario de jornada',results:'Resultados de jornada',sanctions:'Jugadores sancionados',notice:'Aviso de la liga',transfer:'Transferencia de jugador',cedula:'Cédula de partido',quiniela:'Mi quiniela'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=(s,r=document)=>r.querySelector(s);let dataPromise,db,catId=localStorage.getItem('v561-category')||'3',kind=localStorage.getItem('v561-publication-kind')||'standings';if(!titles[kind]||kind==='quiniela')kind='standings';
const imageCache=new Map();
async function getDb(){
 const live=window.LJR_V508_OFFICIAL?.getData?.()||window.LJR_OFFICIAL_API?.getData?.();
 const newer=(a,b)=>!a?.categories?b:!b?.categories?a:Date.parse(b.captured_at_utc||0)>=Date.parse(a.captured_at_utc||0)?b:a;
 db=newer(db,live);
 if(!dataPromise)dataPromise=fetch('./data/official-live.json?quiniela=20261008-v964-historical-sync',{cache:'no-store'}).then(r=>{
   if(!r.ok)throw Error('No se pudieron cargar los datos oficiales');
   return r.json();
 }).then(value=>db=newer(db,value)).catch(e=>{dataPromise=null;if(!db?.categories)throw e;return db});
 await dataPromise;
 return db;
}
// Quiniela autónoma: utiliza únicamente el archivo del repositorio azul y la caché local.
const Q_LOCAL_CACHE='ljr-blue:quiniela:fixture-snapshot:v1';
let qDb=null,qPromise=null,qDataMode='repo';
async function getQuinielaDb(force=false){
  if(qDb&&!force){db=qDb;return qDb}
  if(!qPromise||force){
    qPromise=fetch('./data/official-live.json?quiniela=20261008-v969-standalone',{cache:'no-store'})
      .then(async response=>{
        if(!response.ok)throw Error('Archivo de jornadas no disponible');
        const snapshot=await response.json();
        if(!snapshot?.categories?.['2'])throw Error('Archivo local de liga inválido');
        qDb=snapshot;qDataMode='repo';
        try{localStorage.setItem(Q_LOCAL_CACHE,JSON.stringify(snapshot))}catch(_){}
        return snapshot;
      }).catch(error=>{
        let cached=null;
        try{cached=JSON.parse(localStorage.getItem(Q_LOCAL_CACHE)||'null')}catch(_){}
        if(!cached?.categories)throw Error('No se puede cargar la quiniela propia: '+error.message);
        qDb=cached;qDataMode='cache';return cached;
      });
  }
  db=await qPromise;return db;
}
function quinielaLocalLogo(name){
  const entries=Object.entries(qDb?.team_logos||{});
  const value=entries.find(([key])=>norm(key)===norm(name))?.[1];
  const path=typeof value==='string'?value:(value?.local||value?.app||'');
  return typeof path==='string'&&/^\.\/assets\/[a-zA-Z0-9_./-]+$/.test(path)?path:'';
}
function category(id){return normalizeCompetition(db).find(c=>c.id===String(id))}
const day=id=>['1','2'].includes(String(id))?'Veteranos · sábados por la tarde':'Dominical · categoría libre';
function logo(team){const value=window.LJR_TEAM_LOGOS?.get?.(team)||window.LJR_OFFICIAL_API?.getLogo?.(team)||Object.entries(db?.team_logos||{}).find(([k])=>norm(k)===norm(team))?.[1];return typeof value==='string'?value:value?.local||value?.source||''}
function image(src){if(!src)return Promise.resolve(null);if(!imageCache.has(src))imageCache.set(src,new Promise(resolve=>{const i=new Image();i.crossOrigin='anonymous';const t=setTimeout(()=>resolve(null),4500);i.onload=()=>{clearTimeout(t);resolve(i)};i.onerror=()=>{clearTimeout(t);resolve(null)};i.src=src}));return imageCache.get(src)}
function drawImage(ctx,im,x,y,w,h=w){if(!im)return;const scale=Math.min(w/im.width,h/im.height);ctx.drawImage(im,x+(w-im.width*scale)/2,y+(h-im.height*scale)/2,im.width*scale,im.height*scale)}
function wrap(ctx,text,width,font='600 26px Arial'){ctx.font=font;const lines=[];let line='';for(const word of String(text??'—').split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line);return lines.length?lines:['—']}
function textLines(ctx,lines,x,y,size=34){for(const line of lines){ctx.fillText(line,x,y);y+=size}}
function blob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('No se pudo generar PNG')),'image/png'))}
function notice(msg){let el=$('[data-v561-status]');if(!el){el=document.createElement('div');el.className='v561-toast';document.body.append(el);setTimeout(()=>el.remove(),3500)}el.textContent=msg}
export async function brandPng(source,id){if(source._ligaBranded)return source;await getDb();const src=URL.createObjectURL(source);try{const im=await image(src);if(!im)return source;const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height+150;const x=cv.getContext('2d');x.fillStyle='#06166c';x.fillRect(0,0,cv.width,150);const icons=await Promise.all([image('./assets/league-credential-hd.png'),image('./assets/'+categoryLogos[id])]);drawImage(x,icons[0],25,20,100);drawImage(x,icons[1],cv.width-125,20,100);x.fillStyle='#fff';textLines(x,wrap(x,labels[id]||'Liga Juventino',cv.width-300,'800 30px Arial'),155,53);x.font='600 22px Arial';x.fillStyle='#29e4ed';x.fillText(day(id),155,113);x.drawImage(im,0,150);const result=await blob(cv);result._ligaBranded=true;return result}finally{URL.revokeObjectURL(src)}}
export async function reportCanvas(id,type,options={}){
 if(type==='quiniela')await getQuinielaDb();else await getDb();const c=category(id);if(!c)throw Error('Categoría no publicada');let rows=[],heads=[],widths=[];const authoring=['notice','transfer','cedula','quiniela'].includes(type);
 if(type==='standings'){heads=['#','Equipo','PJ','PG','PE','PP','GF','GC','DG','PTS'];widths=[45,450,65,65,65,65,65,65,65,70];rows=c.standings.map(t=>({team:t.name,cells:[t.pos,t.name,t.pj,t.g,t.e,t.p,t.gf,t.gc,t.dg,t.pts]}))}
 if(type==='scorers'){heads=['#','Jugador / Equipo','Goles'];widths=[50,890,100];rows=c.scorers.map(t=>({team:t.team,cells:[t.pos,t.player+'\n'+t.team,t.goals]}))}
 if(type==='calendar'||type==='results'){heads=['Partido','Fecha / Sede',type==='results'?'Marcador':'Hora'];widths=[500,400,150];rows=c.matches.filter(m=>(!options.round||m.round===String(options.round))&&(type==='calendar'?!m.complete:m.complete)).map(m=>({team:m.home,team2:m.away,cells:[m.home+'\nvs '+m.away,m.date+'\n'+(m.venue||'Sede por confirmar'),type==='results'?m.homeScore+' – '+m.awayScore:m.time||'Por confirmar']}))}
 if(type==='sanctions'){heads=['Jugador / Equipo','Sanción','Pendientes'];widths=[650,250,150];rows=(db.categories[id].suspensions||[]).flatMap(t=>t.rows||[]).filter(r=>r.length>=4).map(r=>({team:r[1],cells:[r[0]+'\n'+r[1],r[2],r[3]]}))}
 if(type==='notice'){heads=['Comunicado · borrador'];widths=[1050];if(!options.note?.trim())throw Error('Escribe el motivo y detalle del aviso');rows=[{team:options.team,team2:options.team2,cells:[(options.noticeType||'Aviso informativo')+'\n'+(options.match||'Toda la categoría')+'\n'+(options.date||'Fecha por confirmar')+'\n'+options.note]}]}
 if(type==='transfer'){heads=['Transferencia · borrador para revisión'];widths=[1050];if(!options.player?.trim()||!options.team||!options.team2)throw Error('Completa jugador, equipo de origen y destino');if(options.team===options.team2)throw Error('El origen y el destino deben ser distintos');rows=[{team:options.team,team2:options.team2,cells:[options.player+'\nOrigen: '+options.team+'\nDestino: '+options.team2+'\n'+(options.date||'Fecha por confirmar')+'\n'+(options.note||'Pendiente de autorización de la liga.')]}]}
 if(type==='cedula'){const m=c.matches.find(m=>m.id===options.match);if(!m)throw Error('Elige un partido para la cédula');heads=['Cédula de partido · borrador'];widths=[1050];rows=[{team:m.home,team2:m.away,cells:[m.home+' vs '+m.away+'\n'+m.date+' · '+(m.venue||'Sede por confirmar')+'\nJornada '+m.round+'\nMarcador: '+(m.complete?m.homeScore+' – '+m.awayScore:'Sin resultado completo publicado')+'\n'+(options.note||'Árbitro / incidencias / firmas: pendientes de completar.')]}]}
 if(type==='quiniela'){heads=['Partido','Pronóstico','Puntos'];widths=[650,250,150];const predictions=readPredictions();rows=c.matches.filter(m=>(!options.round||m.round===options.round)&&predictionFor(predictions,m)).map(m=>{const p=predictionFor(predictions,m);return {team:m.home,team2:m.away,cells:[m.home+'\nvs '+m.away,p.home+' – '+p.away,m.complete?predictionPoints(p,m):'Pendiente']}})}
 if(!rows.length){if(['sanctions','scorers'].includes(type))rows=[{cells:['Sin '+(type==='sanctions'?'sanciones publicadas':'goleadores publicados')+' para esta categoría.']}];else throw Error('No hay datos publicados para esta selección')}
 const logoColumn=['standings','scorers'].includes(type)?1:0;
 const prepared=rows.map(r=>{const cells=r.cells.map((s,i)=>String(s??'—').split('\n').flatMap(line=>wrap(document.createElement('canvas').getContext('2d'),line,widths[i]-30-(i===logoColumn&&r.team?(r.team2?142:82):0))));return {...r,lines:cells,height:Math.max(92,Math.max(...cells.map(a=>a.length))*34+34)}});
 const cv=document.createElement('canvas');cv.width=1200;cv.height=340+prepared.reduce((s,r)=>s+r.height,0)+95;const x=cv.getContext('2d'),bg=x.createLinearGradient(0,0,1200,cv.height);bg.addColorStop(0,'#091b82');bg.addColorStop(1,'#030638');x.fillStyle=bg;x.fillRect(0,0,1200,cv.height);
 const icons=await Promise.all([image('./assets/league-credential-hd.png'),image('./assets/'+categoryLogos[id])]);drawImage(x,icons[0],35,25,125);drawImage(x,icons[1],1040,25,125);x.fillStyle='#29e4ed';x.font='800 21px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS',185,53);x.fillStyle='#fff';textLines(x,wrap(x,titles[type],790,'900 38px Arial'),185,104,45);x.font='700 26px Arial';x.fillText(c.name+(options.round?' · Jornada '+options.round:''),185,188);x.fillStyle='#32deec';x.font='600 22px Arial';x.fillText(day(id),185,225);
 x.fillStyle='#142778';x.fillRect(30,260,1140,56);x.font='800 21px Arial';x.fillStyle='#c1d8ef';let left=45;heads.forEach((h,i)=>{x.fillText(h,left,296);left+=widths[i]});let y=335;
 const ownLogo=type==='quiniela'?quinielaLocalLogo:logo;const logos=await Promise.all(prepared.map(async r=>[await image(ownLogo(r.team)),await image(ownLogo(r.team2))]));
 prepared.forEach((r,i)=>{x.fillStyle=i%2?'#0c165d':'#101d6e';x.fillRect(30,y,1140,r.height-5);x.fillStyle='#fff';x.font='600 26px Arial';let left=45;r.lines.forEach((lines,j)=>{let offset=0;if(r.team&&j===logoColumn){drawImage(x,logos[i][0],left+2,y+12,65);if(r.team2)drawImage(x,logos[i][1],left+69,y+12,65);offset=r.team2?142:82}textLines(x,lines,left+offset,y+35,34);left+=widths[j]});y+=r.height});x.fillStyle='#acbfdc';x.font='500 19px Arial';x.fillText((authoring?'Borrador generado en la app':'Datos oficiales disponibles · '+String(db.captured_at_utc||'').slice(0,10))+' · '+new Date().toLocaleDateString('es-MX'),40,cv.height-45);return cv;
}
export function predictionPoints(prediction,match){if(!match.complete||!prediction||!Number.isInteger(prediction.home)||!Number.isInteger(prediction.away))return null;if(prediction.home===match.homeScore&&prediction.away===match.awayScore)return 2;return Math.sign(prediction.home-prediction.away)===Math.sign(match.homeScore-match.awayScore)?1:0}
function fixtureKey(m){return [m.category,db?.categories?.[String(m.category)]?.season_id||'',m.round,norm(m.home),norm(m.away)].join('|')}
function predictionFor(predictions,m){const key=fixtureKey(m),p=predictions[key]||predictions[m.id];return p&&p.fixtureKey===key?p:null}
function matchStarted(m){if(m.complete)return true;if(!m.iso||!m.time)return false;const time=Date.parse(m.iso+'T'+m.time+':00-06:00');return Number.isFinite(time)&&Date.now()>=time}
function readPredictions(){try{return JSON.parse(localStorage.getItem('v561-quiniela')||'{}')}catch{return {}}}
function downloadFile(file){const a=document.createElement('a'),url=URL.createObjectURL(file);a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000)}
function filename(type,id){return titles[type].replace(/\s+/g,'_')+'_'+labels[id].replace(/\s+/g,'_')+'.png'}
async function shareFile(file,text){if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'Liga Juventino Rosas',text})}else{downloadFile(file);notice('PNG descargado. Abre el chat y adjunta la imagen.')}}
function optionsHtml(){return order.filter(id=>db.categories[id]).map(id=>'<option value="'+id+'" '+(catId===id?'selected':'')+'>'+esc(labels[id])+'</option>').join('')}

/* V1004: Centro único de Publicaciones y Diseños. */
function v1004PubIcon(name){
 const icons={
  edit:'<path d="m15 5 4 4M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z"/>',
  notice:'<rect x="5" y="5" width="14" height="14" rx="3"/><circle cx="12" cy="12" r="3"/>',
  ai:'<path d="M12 3 9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5L12 3Z"/>',
  results:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M8 14h2m4 0h2"/>',
  bulletins:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>'
 };
 return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+(icons[name]||icons.edit)+'</svg>';
}
function v1004PubHub(){
 const cards=[
  ['notice','Notificación moderna'],
  ['ai','Canva IA'],
  ['results','Resultados PNG'],
  ['bulletins','Boletines y avisos']
 ];
 return '<div class="v1004-pub-hub" aria-label="Herramientas de publicaciones">'+
  '<button type="button" class="v1004-pub-primary" data-v1004-pub-action="design"><span class="v1004-pub-primary-icon">'+v1004PubIcon('edit')+'</span><span><b>Crear diseño nuevo</b><small>Editor de carteles · PNG HD</small></span><i aria-hidden="true">›</i></button>'+
  '<div class="v1004-pub-grid">'+cards.map(item=>'<button type="button" class="v1004-pub-mini" data-v1004-pub-action="'+item[0]+'"><span class="v1004-pub-mini-icon">'+v1004PubIcon(item[0])+'</span><span>'+item[1]+'</span><i aria-hidden="true">›</i></button>').join('')+'</div>'+
 '</div>';
}
async function mountPublications(root){await getDb();const requested=localStorage.getItem('v561-publication-kind');if(requested&&titles[requested]&&requested!=='quiniela')kind=requested;const c=category(catId);if(!c)return;const v1004Expanded=sessionStorage.getItem('v1004-pub-editor-open')==='1';root.innerHTML='<section class="v561-league v642-publications-card"><header class="v642-pub-head"><span class="v642-pub-badge" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM7 9h10M7 13h6M7 17h8"/></svg></span><div><small>PUBLICACIONES · ESTUDIO HD</small><h2>Centro de publicaciones</h2><p>Diseños, tablas y comunicados, todo en un solo lugar.</p></div></header>'+v1004PubHub()+'<details class="v1004-pub-editor" data-v1004-pub-editor '+(v1004Expanded?'open':'')+'><summary><span class="v1004-pub-editor-icon">▦</span><span><b>Generar PNG por categoría</b><small>Elegir categoría, documento y jornada</small></span><i aria-hidden="true">⌄</i></summary><div class="v561-form"><label>Categoría<select data-pub-cat>'+optionsHtml()+'</select></label><label>Documento<select data-pub-type>'+Object.entries(titles).filter(([k])=>k!=='quiniela').map(([k,v])=>'<option value="'+k+'" '+(kind===k?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>Jornada<select data-pub-round><option value="">Todas las jornadas</option>'+c.rounds.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.id)+'</option>').join('')+'</select></label><p class="v561-day">'+day(catId)+'</p><div data-authoring><label>Tipo de aviso<select data-pub-notice>'+['Suspensión de jornada','Cancelación de jornada','Cambio de cancha','Cambio de horario','Aviso informativo'].map(t=>'<option>'+t+'</option>').join('')+'</select></label><label>Partido<select data-pub-match><option value="">Toda la categoría</option>'+c.matches.map(m=>'<option value="'+esc(m.id)+'">J'+esc(m.round)+' · '+esc(m.home+' vs '+m.away)+'</option>').join('')+'</select></label><label>Jugador<input data-pub-player maxlength="150"></label><label>Equipo / origen<select data-pub-team><option value="">Toda la categoría</option>'+c.standings.map(t=>'<option>'+esc(t.name)+'</option>').join('')+'</select></label><label>Rival / destino<select data-pub-team2><option value="">Sin segundo equipo</option>'+c.standings.map(t=>'<option>'+esc(t.name)+'</option>').join('')+'</select></label><label>Fecha<input data-pub-date type="date"></label><label>Detalle del comunicado / incidencias<textarea data-pub-note rows="4" maxlength="4000"></textarea></label></div></div><div class="v561-actions v642-pub-actions"><button class="v642-pub-generate" data-pub-generate><span class="v642-action-icon" aria-hidden="true">✦</span><span><b>Generar vista previa</b><small>Crear el diseño PNG HD</small></span><i>›</i></button><button class="v642-pub-download" data-pub-download disabled><span class="v642-action-icon" aria-hidden="true">↓</span><span><b>Descargar PNG</b><small>Guardar imagen en el teléfono</small></span><i>›</i></button><button class="v642-pub-share" data-pub-share disabled><span class="v642-action-icon" aria-hidden="true">↗</span><span><b>Compartir imagen</b><small>Enviar el PNG generado</small></span><i>›</i></button><a class="v642-pub-whatsapp" data-pub-whatsapp target="_blank" rel="noopener" href="https://wa.me/524121715599"><span class="v642-action-icon" aria-hidden="true">◉</span><span><b>Enviar por WhatsApp</b><small>Presidente · 4121715599</small></span><i>›</i></a></div><p data-v561-status aria-live="polite"></p><section class="v642-preview-card"><header><span class="v642-preview-icon" aria-hidden="true">▧</span><span><small>VISTA PREVIA</small><b>PNG listo para publicar</b></span></header><div class="v642-preview-stage" data-pub-preview></div></section><p class="v561-hint">Genera la vista previa, revisa el diseño y después descarga o comparte el PNG.</p></details></section>';
 let file;const author=$('[data-authoring]',root),setVisibility=()=>{author.hidden=!['notice','transfer','cedula'].includes(kind)};setVisibility();

 const v1004Editor=$('[data-v1004-pub-editor]',root);
 v1004Editor?.addEventListener('toggle',()=>sessionStorage.setItem('v1004-pub-editor-open',v1004Editor.open?'1':'0'));
 root.querySelectorAll('[data-v1004-pub-action]').forEach(button=>button.addEventListener('click',()=>{
  const action=button.dataset.v1004PubAction;
  if(action==='design'||action==='ai'){
   if(window.LJR_DESIGN_STUDIO?.open)window.LJR_DESIGN_STUDIO.open(action==='ai'?'Comunicado':undefined);
   else notice('El editor de diseños todavía está cargando. Inténtalo de nuevo.');
  }else if(action==='notice'){
   if(window.LJR_V852_RICH_NOTIFICATIONS?.openAdmin)window.LJR_V852_RICH_NOTIFICATIONS.openAdmin();
   else notice('El generador de notificaciones todavía está cargando.');
  }else if(action==='results'){
   v1004Editor.open=true;
   sessionStorage.setItem('v1004-pub-editor-open','1');
   const select=$('[data-pub-type]',root);
   if(select&&select.value!=='results'){select.value='results';select.dispatchEvent(new Event('change',{bubbles:true}));}
   v1004Editor.scrollIntoView({block:'nearest',behavior:'smooth'});
  }else if(action==='bulletins'){
   if(window.LJR_MAIN_ROUTE?.go)window.LJR_MAIN_ROUTE.go('publications');else location.hash='#/publications';
  }
 }));
 $('[data-pub-cat]',root).onchange=e=>{catId=e.target.value;localStorage.setItem('v561-category',catId);mountPublications(root)};$('[data-pub-type]',root).onchange=e=>{kind=e.target.value;localStorage.setItem('v561-publication-kind',kind);file=null;setVisibility();$('[data-pub-download]',root).disabled=true;$('[data-pub-share]',root).disabled=true};
 const invalidate=()=>{file=null;$('[data-pub-download]',root).disabled=true;$('[data-pub-share]',root).disabled=true;$('[data-pub-preview]',root).replaceChildren()};root.querySelectorAll('input,textarea,select').forEach(el=>el.addEventListener('input',invalidate));
 $('[data-pub-generate]',root).onclick=async e=>{e.target.disabled=true;try{const value=key=>$('[data-pub-'+key+']',root)?.value||'',m=c.matches.find(m=>m.id===value('match'));const o={round:value('round'),match:kind==='cedula'?value('match'):m?m.home+' vs '+m.away:'',team:value('team')||m?.home,team2:value('team2')||m?.away,noticeType:value('notice'),date:value('date'),note:value('note'),player:value('player')};const cv=await reportCanvas(catId,kind,o);file=new File([await blob(cv)],filename(kind,catId),{type:'image/png'});$('[data-pub-preview]',root).replaceChildren(cv);$('[data-pub-download]',root).disabled=false;$('[data-pub-share]',root).disabled=false;$('[data-pub-whatsapp]',root).href='https://wa.me/524121715599?text='+encodeURIComponent(titles[kind]+' · '+labels[catId]+' · Liga Juventino Rosas. Adjunto PNG para revisión.');notice('PNG listo · '+cv.width+' × '+cv.height+' px')}catch(e){notice(e.message)}finally{e.target.disabled=false}};
 $('[data-pub-download]',root).onclick=()=>file&&downloadFile(file);$('[data-pub-share]',root).onclick=()=>file&&shareFile(file,titles[kind]+' · '+labels[catId]+' · Presidente: 4121715599').catch(e=>{if(e.name!=='AbortError')notice(e.message)});
}
async function mountQuiniela(root){
 await getQuinielaDb();
 const logo=quinielaLocalLogo;
 const c=category(catId),p=readPredictions();
 if(!c)return;
 const view=localStorage.getItem('v561-quiniela-view')||'play';
 const rawRounds=[...(c.rounds||[]).map(r=>String(r.id)),...(c.matches||[]).map(m=>String(m.round||'')).filter(Boolean)];
 const uniqueRounds=[...new Set(rawRounds)];
 const numericRounds=uniqueRounds.map(Number).filter(Number.isFinite);
 const maxRound=numericRounds.length?Math.max(...numericRounds):0;
 const rounds=maxRound
   ?Array.from({length:maxRound},(_,i)=>String(i+1))
   :uniqueRounds.sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));
 const upcomingByRound=new Map();
 for(const m of c.matches||[]){
   if(!upcomingByRound.has(String(m.round)))upcomingByRound.set(String(m.round),[]);
   upcomingByRound.get(String(m.round)).push(m);
 }
 // Elegir la próxima jornada oficial por fecha, no la última registrada en el calendario.
 const nextOfficial=(c.matches||[]).filter(m=>!m.complete&&m.iso&&m.time)
   .map(m=>({m,when:Date.parse(m.iso+'T'+m.time+':00-06:00')}))
   .filter(x=>Number.isFinite(x.when)&&x.when>=Date.now())
   .sort((a,b)=>a.when-b.when)[0]?.m;
 const suggested=String(nextOfficial?.round||rounds.find(r=>(upcomingByRound.get(r)||[]).some(m=>!m.complete))||rounds.at(-1)||'');
 const stored=localStorage.getItem('v561-quiniela-round:'+catId);
 const selected=(localStorage.getItem('v964-q-round-manual:'+catId)==='1'&&rounds.includes(stored))?stored:suggested;
 const round=rounds.includes(String(selected))?String(selected):String(suggested);
 const matches=(c.matches||[]).filter(m=>String(m.round)===round);
 let total=0,exact=0,outcome=0,scored=0,savedCount=0;
 for(const m of c.matches||[]){
   const saved=predictionFor(p,m);
   if(saved)savedCount++;
   if(saved&&m.complete){
     const pts=predictionPoints(saved,m);if(pts===null)continue;
     total+=pts;scored++;
     if(pts===2)exact++;else if(pts===1)outcome++;
   }
 }
 const teamCard=(m,side)=>{
   const name=side==='home'?m.home:m.away,src=logo(name);
   return '<div class="v618-q-team '+side+'">'+(src?'<img src="'+esc(src)+'" alt="'+esc(name)+'">':'<span class="v618-q-fallback">'+esc(String(name||'?').slice(0,2).toUpperCase())+'</span>')+'<b>'+esc(name)+'</b></div>';
 };
 const scoreInputs=m=>{
   const saved=predictionFor(p,m)||(!m.complete&&!p[fixtureKey(m)]?p[m.id]:null),disabled=matchStarted(m)?'disabled':'';
   return '<div class="v618-q-score">'+
     '<input type="number" inputmode="numeric" min="0" max="99" data-q-home aria-label="Goles de '+esc(m.home)+'" value="'+(saved?.home??'')+'" '+disabled+'>'+
     '<span>:</span>'+
     '<input type="number" inputmode="numeric" min="0" max="99" data-q-away aria-label="Goles de '+esc(m.away)+'" value="'+(saved?.away??'')+'" '+disabled+'>'+
   '</div>';
 };
 const card=m=>{
   const saved=predictionFor(p,m),legacy=!saved&&p[m.id],pts=saved&&m.complete?predictionPoints(saved,m):null;
   const status=m.complete
     ?'<span class="v618-q-status done">Final · '+esc(m.homeScore)+'–'+esc(m.awayScore)+(pts!==null?' · '+pts+' pt'+(pts===1?'':'s'):'')+'</span>'
     :(matchStarted(m)?'<span class="v618-q-status done">Partido iniciado · pronóstico cerrado</span>':saved?'<span class="v618-q-status saved">✓ '+saved.home+'–'+saved.away+' guardado</span>':legacy?'<span class="v618-q-status open">Revisa y guarda nuevamente este pronóstico anterior</span>':'<span class="v618-q-status open">Pronostica antes del inicio</span>');
   return '<article class="v618-q-card" data-q-match="'+esc(m.id)+'">'+
     '<div class="v618-q-card-top"><small>Jornada '+esc(m.round)+'</small><time>'+esc(m.date||'Fecha por confirmar')+(m.time?' · '+esc(m.time):'')+'</time></div>'+
     '<div class="v618-q-card-main">'+teamCard(m,'home')+
       '<div class="v618-q-center">'+scoreInputs(m)+
         (!matchStarted(m)?'<button type="button" class="v618-q-save-one" data-q-save-one="'+esc(m.id)+'">Guardar pronóstico</button>':'')+
         status+
       '</div>'+teamCard(m,'away')+
     '</div>'+
     '<div class="v618-q-venue">'+esc(m.venue||'Sede por confirmar')+'</div>'+
   '</article>';
 };
 const cats=order.filter(id=>db.categories[id]).map(id=>'<button type="button" class="v618-q-cat '+(catId===id?'active':'')+'" data-q-cat-button="'+id+'"><span class="v958-q-cat-logo"><img src="./assets/'+esc(categoryLogos[id])+'" alt="'+esc(labels[id])+'"></span><span>'+esc(labels[id])+'</span></button>').join('');
 const nav='<div class="v618-q-nav">'+
   '<button type="button" class="'+(view==='play'?'active':'')+'" data-q-view="play"><span class="v953-q-nav-icon">'+qIcon('play')+'</span><b>Pronosticar</b></button>'+
   '<button type="button" class="'+(view==='history'?'active':'')+'" data-q-view="history"><span class="v953-q-nav-icon">'+qIcon('history')+'</span><b>Histórico</b></button>'+
   '<button type="button" class="'+(view==='ranking'?'active':'')+'" data-q-view="ranking"><span class="v953-q-nav-icon">'+qIcon('ranking')+'</span><b>Ranking</b></button>'+ 
   '<button type="button" class="'+(view==='tables'?'active':'')+'" data-q-view="tables"><span class="v953-q-nav-icon">'+qIcon('ranking')+'</span><b>Tablas y goleo</b></button>'+
 '</div>';
 const rules='<section class="v618-q-rules"><b><span class="v953-q-rule-icon">'+qIcon('trophy')+'</span>Pronostica el marcador exacto de cada partido</b><p><span>2 pts</span> si aciertas el marcador exacto · <span>1 pt</span> si aciertas ganador o empate.</p><small><span class="v953-q-clock">'+qIcon('clock')+'</span>Los pronósticos cierran al llegar la hora de inicio publicada. Los marcadores pendientes no suman puntos.</small></section>';
 let body='';
 if(view==='ranking'){
   body='<section class="v618-q-ranking">'+
     '<div class="v618-q-rank-hero"><small>MI RANKING EN ESTA APP</small><strong>'+total+' pts</strong><span>'+savedCount+' pronósticos guardados</span></div>'+
     '<div class="v618-q-stats"><div><b>'+exact+'</b><small>Exactos · 2 pts</small></div><div><b>'+outcome+'</b><small>Ganador/empate · 1 pt</small></div><div><b>'+scored+'</b><small>Evaluados</small></div></div>'+
     '<p class="v618-q-local-note">Tus puntos se calculan y se guardan en esta app. Para trasladarlos a otro dispositivo, descarga e importa tu respaldo.</p>'+
     '<section class="v969-q-backup"><h3>Mis pronósticos · respaldo local</h3><p>No necesitas ninguna cuenta externa.</p><div class="v969-q-backup-actions"><button type="button" data-q-backup-export>'+qIcon('download')+' Descargar respaldo</button><button type="button" data-q-backup-import>'+qIcon('save')+' Importar respaldo</button></div><input type="file" data-q-backup-file accept="application/json,.json" hidden aria-label="Selecciona tu respaldo de quiniela"></section>'+
   '</section>';
 }else if(view==='tables'){
   const paneKey='v968-q-table-pane:'+catId;
   const requestedPane=localStorage.getItem(paneKey)||'standings';
   const pane=['standings','scorers','results'].includes(requestedPane)?requestedPane:'standings';
   const paneButton=(key,label)=>'<button type="button" class="v968-q-pane-button'+(pane===key?' active':'')+'" data-q-table-pane="'+key+'" aria-pressed="'+(pane===key?'true':'false')+'">'+label+'</button>';
   const stamp=String(db.captured_at_utc||'').slice(0,16).replace('T',' ');
   const tableHead='<div class="v960-q-cols"><span>#</span><span>Equipo</span><span>PJ</span><span>GF</span><span>GC</span><span>PTS</span></div>';
   const standings=c.standings.map(t=>'<div class="v960-q-cols"><span>'+esc(t.pos??'—')+'</span><span class="v960-q-team">'+(logo(t.name)?'<img src="'+esc(logo(t.name))+'" alt="">':'')+'<b>'+esc(t.name)+'</b></span><span>'+esc(t.pj??'—')+'</span><span>'+esc(t.gf??'—')+'</span><span>'+esc(t.gc??'—')+'</span><strong>'+esc(t.pts??'—')+'</strong></div>').join('');
   const scorers=c.scorers.map(t=>'<div class="v960-q-scorer"><span>'+esc(t.pos??'—')+'</span><span><b>'+esc(t.player)+'</b><small>'+esc(t.team)+'</small></span><strong>'+esc(t.goals)+'</strong></div>').join('');
   const recent=c.matches.filter(m=>m.complete).sort((a,b)=>(b.iso||'').localeCompare(a.iso||'')).slice(0,12).map(m=>'<div class="v960-q-result"><span>J'+esc(m.round)+'</span><b>'+esc(m.home)+'</b><strong>'+esc(m.homeScore)+'–'+esc(m.awayScore)+'</strong><b>'+esc(m.away)+'</b></div>').join('');
   body='<section class="v960-q-tables">'+
     '<p class="v960-q-source">Archivo de resultados de la app azul · corte: '+esc(stamp||'no disponible')+' UTC. No son el ranking de participantes de la Quiniela.</p>'+
     '<div class="v960-q-links v968-q-tabs" role="group" aria-label="Ver tablas dentro de Liga Juventino">'+paneButton('standings','Clasificación')+paneButton('scorers','Goleo')+paneButton('results','Resultados')+'</div>'+
     '<div class="v968-q-data-meta"><span>Datos oficiales · '+esc(c.name)+'</span><button type="button" data-q-refresh>↻ Actualizar</button></div>'+
     '<section class="v960-q-block" data-q-pane-panel="standings"'+(pane==='standings'?'':' hidden')+'><h3>Tabla de posiciones · '+esc(c.name)+'</h3>'+ (standings?tableHead+standings:'<p>No hay tabla de posiciones publicada para esta temporada.</p>')+'</section>'+
     '<section class="v960-q-block" data-q-pane-panel="scorers"'+(pane==='scorers'?'':' hidden')+'><h3>Máximos goleadores</h3>'+(scorers?'<div class="v960-q-scorer-head"><span>#</span><span>Jugador / Equipo</span><span>Goles</span></div>'+scorers:'<p>No hay goles individuales publicados para esta temporada.</p>')+'</section>'+
     '<section class="v960-q-block" data-q-pane-panel="results"'+(pane==='results'?'':' hidden')+'><h3>Resultados con marcador completo</h3>'+(recent||'<p>Sin resultados completos publicados.</p>')+'</section></section>';
 }else if(view==='history'){
  // Histórico integrado con diseño azul; los resultados se obtienen del corte oficial.
  // Los pronósticos de AdminFut son privados: sólo se muestran los guardados en este dispositivo.
  const completed=(c.matches||[]).filter(m=>m.complete)
    .sort((a,b)=>(b.iso||'').localeCompare(a.iso||'')||String(b.time||'').localeCompare(String(a.time||''))||Number(b.round)-Number(a.round));
  const allRounds=[...new Set(completed.map(m=>String(m.round||'—')))]
    .sort((a,b)=>Number(b)-Number(a));
  const storedRound=localStorage.getItem('v965-q-history-round:'+catId)||'all';
  const chosenRound=storedRound==='all'||allRounds.includes(storedRound)?storedRound:'all';
  const onlyMine=localStorage.getItem('v967-q-history-mine:'+catId)==='1';
  const mine=completed.filter(m=>predictionFor(p,m));
  const exactMine=mine.filter(m=>predictionPoints(predictionFor(p,m),m)===2).length;
  const minePoints=mine.reduce((sum,m)=>sum+(predictionPoints(predictionFor(p,m),m)||0),0);
  const shown=completed.filter(m=>(chosenRound==='all'||String(m.round||'—')===chosenRound)&&(!onlyMine||!!predictionFor(p,m)));
  const grouped=new Map();
  for(const m of shown){const key=String(m.round||'—');if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(m)}
  const historyTeam=name=>{
    const src=logo(name);
    return '<div class="v967-history-team">'+(src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async">':'<span class="v967-history-fallback">'+esc(String(name||'?').slice(0,2).toUpperCase())+'</span>')+
      '<b>'+esc(name)+'</b></div>';
  };
  const historyCard=m=>{
    const saved=predictionFor(p,m);
    const points=saved?predictionPoints(saved,m):null;
    const mineStatus=saved?
      '<div class="v967-history-pick yes"><span class="v967-pick-icon" aria-hidden="true">✓</span><span>Tu pronóstico <strong>'+esc(saved.home)+' : '+esc(saved.away)+'</strong></span><b class="v967-pick-pts">'+(points===null?'Pendiente':points+' '+(points===1?'punto':'puntos'))+'</b></div>':
      '<div class="v967-history-pick no"><span class="v967-pick-icon" aria-hidden="true">×</span><span>No pronosticaste en este dispositivo</span></div>';
    return '<article class="v967-history-match">'+
      '<div class="v967-match-body">'+historyTeam(m.home)+
      '<div class="v967-history-center"><strong class="v967-match-score">'+esc(m.homeScore)+' : '+esc(m.awayScore)+'</strong><span class="v967-final-label">'+(m.decision?'Decisión oficial':'Finalizado')+'</span></div>'+
      historyTeam(m.away)+'</div>'+
      mineStatus+
      '<div class="v967-match-meta"><span>'+qIcon('calendar')+' '+esc(m.date||'Fecha no publicada')+'</span><span>'+qIcon('pin')+' '+esc(m.venue||'Sede pendiente')+'</span></div>'+
    '</article>';
  };
  const options='<option value="all">Todas las jornadas</option>'+allRounds.map(r=>
     '<option value="'+esc(r)+'" '+(r===chosenRound?'selected':'')+'>Jornada '+esc(r)+'</option>').join('');
  const cards=grouped.size?[...grouped.entries()].map(([r,rows])=>
     '<section class="v967-history-round"><header><span>'+qIcon('calendar')+' Jornada '+esc(r)+'</span><small>'+rows.length+' partido'+(rows.length===1?'':'s')+'</small></header>'+
       '<div class="v967-history-games">'+rows.map(historyCard).join('')+'</div></section>').join(''):
     '<div class="v967-history-empty"><span class="v967-empty-icon">'+qIcon('history')+'</span><b>'+
      (onlyMine?'Todavía no tienes pronósticos guardados en esta selección':'Todavía no hay resultados completos publicados')+'</b><p>'+
      (onlyMine?'Desactiva el filtro para ver todos los marcadores registrados.':'Puedes revisar la próxima jornada y pronosticar antes de que comience.')+'</p>'+
      '<button type="button" data-q-jump-play>'+qIcon('play')+' Ir a Pronosticar</button></div>';
  const stamp=String(db.captured_at_utc||'').replace('T',' ').replace('Z','').slice(0,16);
  body='<section class="v967-history-screen" aria-label="Histórico de quiniela en la app azul">'+
    '<header class="v967-history-hero"><span class="v967-history-eyebrow">'+qIcon('history')+' HISTÓRICO · LIGA JUVENTINO</span>'+
      '<h2>Mis jornadas y resultados</h2><p>'+esc(c.name)+' · Archivo de marcadores</p>'+
      '<div class="v967-history-stats"><span><b>'+completed.length+'</b><small>Resultados oficiales</small></span><span><b>'+mine.length+'</b><small>Pronosticados aquí</small></span><span><b>'+minePoints+'</b><small>Mis puntos</small></span></div></header>'+
    '<div class="v967-history-controls">'+
      '<label for="v967-history-round">'+qIcon('calendar')+' Jornada</label><select id="v967-history-round" data-q-history-round>'+options+'</select>'+
      '<button type="button" class="v967-history-mine '+(onlyMine?'active':'')+'" data-q-history-mine aria-pressed="'+(onlyMine?'true':'false')+'">'+qIcon('ranking')+' '+(onlyMine?'Mostrando mis pronósticos':'Ver solo mis pronósticos')+'</button>'+
      '<div class="v967-history-actions"><button type="button" data-q-refresh>'+qIcon('history')+' Actualizar</button><button type="button" data-q-view-shortcut="play">'+qIcon('play')+' Pronosticar</button><button type="button" data-q-view-shortcut="ranking">'+qIcon('ranking')+' Mi ranking</button></div>'+
    '</div>'+
    '<p class="v967-history-source">Resultados publicados por la Liga · Corte: '+esc(stamp||'no disponible')+' UTC. Los pronósticos corresponden únicamente a este dispositivo.</p>'+
    cards+'</section>';
 }else{
   body='<div class="v618-q-round"><span>'+esc(c.name)+'</span><label>Jornada <select data-q-round>'+rounds.map(r=>'<option value="'+esc(r)+'" '+(r===round?'selected':'')+'>'+esc(r)+'</option>').join('')+'</select></label></div>'+
     '<h3 class="v618-q-section-title">En juego — pronostica ahora</h3>'+
     '<div class="v561-q-matches v618-q-matches">'+(matches.length?matches.map(card).join(''):'<div class="v618-q-empty">No hay partidos publicados en esta jornada.</div>')+'</div>'+
     '<div class="v561-actions v618-q-actions"><button data-q-save>Guardar todos</button><button data-q-export>Descargar quiniela PNG</button></div>';
 }
 root.innerHTML='<section class="v561-league v618-quiniela v619-quiniela-modern">'+
   '<header class="v618-q-head v619-q-hero">'+
     '<div class="v619-q-hero-top"><span class="v619-q-kicker"><i>✓</i> QUINIELA LJR</span><span class="v619-q-live">'+(view==='history'?'HISTÓRICO':view==='ranking'?'MI RANKING':view==='tables'?'DATOS OFICIALES':'JORNADA ACTIVA')+'</span></div>'+
     '<div class="v619-q-title-row"><span class="v619-q-mark v953-q-league-mark"><img src="'+LEAGUE_LOGO+'" alt="Liga Juventino Rosas"></span><div><h2>Quiniela</h2><p>Pronostica · suma puntos · sube en el ranking</p></div></div>'+
     '<div class="v619-q-mini-stats"><span><b>'+savedCount+'</b><small>Guardados</small></span><span><b>'+total+'</b><small>Puntos</small></span><span><b>'+exact+'</b><small>Exactos</small></span></div>'+
   '</header>'+
   nav+(view==='play'?rules:'')+
   '<div class="v618-q-cats">'+cats+'</div>'+
   '<select data-q-cat hidden>'+optionsHtml()+'</select>'+
   body+
   '<p data-v561-status aria-live="polite"></p>'+
 '</section>';

 root.querySelectorAll('[data-q-view]').forEach(btn=>btn.onclick=()=>{localStorage.setItem('v561-quiniela-view',btn.dataset.qView);mountQuiniela(root)});
 root.querySelectorAll('[data-q-cat-button]').forEach(btn=>btn.onclick=()=>{catId=btn.dataset.qCatButton;localStorage.setItem('v561-category',catId);mountQuiniela(root)});
 const hiddenCat=$('[data-q-cat]',root);if(hiddenCat)hiddenCat.onchange=e=>{catId=e.target.value;localStorage.setItem('v561-category',catId);mountQuiniela(root)};
 const mineBtn=$('[data-q-history-mine]',root);
 if(mineBtn)mineBtn.onclick=()=>{const k='v967-q-history-mine:'+catId;localStorage.setItem(k,localStorage.getItem(k)==='1'?'0':'1');mountQuiniela(root)};
 root.querySelectorAll('[data-q-view-shortcut]').forEach(btn=>btn.onclick=()=>{localStorage.setItem('v561-quiniela-view',btn.dataset.qViewShortcut);mountQuiniela(root)});
 const jumpPlay=$('[data-q-jump-play]',root);
 if(jumpPlay)jumpPlay.onclick=()=>{localStorage.setItem('v561-quiniela-view','play');mountQuiniela(root)};
 const historySelect=$('[data-q-history-round]',root);
 if(historySelect)historySelect.onchange=e=>{localStorage.setItem('v965-q-history-round:'+catId,e.target.value);mountQuiniela(root)};
 const roundSelect=$('[data-q-round]',root);if(roundSelect)roundSelect.onchange=e=>{localStorage.setItem('v561-quiniela-round:'+catId,e.target.value);localStorage.setItem('v964-q-round-manual:'+catId,'1');mountQuiniela(root)};

 const saveRow=row=>{
   const next=readPredictions(),m=(c.matches||[]).find(x=>x.id===row.dataset.qMatch);
   if(!m||matchStarted(m))return false;
   const h=$('[data-q-home]',row),a=$('[data-q-away]',row);
   if(h.value===''&&a.value===''){delete next[fixtureKey(m)];delete next[m.id];localStorage.setItem('v561-quiniela',JSON.stringify(next));return true}
   if(!h.checkValidity()||!a.checkValidity()||h.value===''||a.value===''){notice('Completa ambos marcadores con enteros entre 0 y 99');return false}
   next[fixtureKey(m)]={home:Number(h.value),away:Number(a.value),fixtureKey:fixtureKey(m),savedAt:new Date().toISOString()};
   delete next[m.id];localStorage.setItem('v561-quiniela',JSON.stringify(next));return true;
 };
 root.querySelectorAll('[data-q-save-one]').forEach(btn=>btn.onclick=()=>{
   const row=btn.closest('[data-q-match]');if(saveRow(row)){notice('Pronóstico guardado en Liga Juventino');mountQuiniela(root)}
 });
 const saveAll=$('[data-q-save]',root);
 if(saveAll)saveAll.onclick=()=>{
   let count=0;for(const row of root.querySelectorAll('[data-q-match]'))if(saveRow(row))count++;
   notice(count+' pronósticos guardados en Liga Juventino');mountQuiniela(root);
 };
 root.querySelectorAll('[data-q-table-pane]').forEach(btn=>btn.onclick=()=>{
   const pane=btn.dataset.qTablePane;
   localStorage.setItem('v968-q-table-pane:'+catId,pane);
   root.querySelectorAll('[data-q-table-pane]').forEach(tab=>{
     const active=tab.dataset.qTablePane===pane;
     tab.classList.toggle('active',active);
     tab.setAttribute('aria-pressed',String(active));
   });
   root.querySelectorAll('[data-q-pane-panel]').forEach(panel=>{panel.hidden=panel.dataset.qPanePanel!==pane});
 });
 const refreshBtn=$('[data-q-refresh]',root);if(refreshBtn)refreshBtn.onclick=async()=>{refreshBtn.disabled=true;try{await getQuinielaDb(true);await mountQuiniela(root);notice(qDataMode==='cache'?'Mostrando datos locales guardados; sin conexión.':'Archivo de partidos de la app azul actualizado')}catch(e){notice(e.message);refreshBtn.disabled=false}};
 const backupExport=$('[data-q-backup-export]',root);
 if(backupExport)backupExport.onclick=()=>{
   try{
     const matchesAll=normalizeCompetition(qDb).flatMap(group=>group.matches||[]);
     const permitted=new Set(matchesAll.map(fixtureKey));
     const own=Object.fromEntries(Object.entries(readPredictions()).filter(([key,value])=>permitted.has(key)&&value?.fixtureKey===key&&Number.isInteger(value.home)&&Number.isInteger(value.away)));
     const data={format:'ljr-blue-quiniela',version:1,createdAt:new Date().toISOString(),predictions:own};
     const file=new File([JSON.stringify(data,null,2)],'mis-pronosticos-liga-juventino.json',{type:'application/json'});
     downloadFile(file);notice('Respaldo guardado en el teléfono: '+Object.keys(own).length+' pronósticos');
   }catch(error){notice('No se pudo descargar el respaldo: '+error.message)}
 };
 const backupImport=$('[data-q-backup-import]',root),backupFile=$('[data-q-backup-file]',root);
 if(backupImport&&backupFile)backupImport.onclick=()=>backupFile.click();
 if(backupFile)backupFile.onchange=async()=>{
   const file=backupFile.files?.[0];
   if(!file)return;
   try{
     if(file.size>2097152)throw Error('El archivo supera el tamaño permitido (2 MB)');
     const backup=JSON.parse(await file.text());
     if(backup?.format!=='ljr-blue-quiniela'||backup?.version!==1||!backup.predictions||typeof backup.predictions!=='object'||Array.isArray(backup.predictions))throw Error('Respaldo no compatible con la quiniela azul');
     const permitted=new Set(normalizeCompetition(qDb).flatMap(group=>group.matches||[]).map(fixtureKey));
     const imported={};
     for(const [key,guess] of Object.entries(backup.predictions)){
       if(!permitted.has(key)||guess?.fixtureKey!==key||![guess.home,guess.away].every(n=>Number.isInteger(n)&&n>=0&&n<=99))continue;
       imported[key]={home:guess.home,away:guess.away,fixtureKey:key,savedAt:typeof guess.savedAt==='string'?guess.savedAt:new Date().toISOString()};
     }
     if(!Object.keys(imported).length)throw Error('No se encontraron pronósticos válidos para los partidos actuales');
     const current=readPredictions();
     const merged={...current,...imported};
     localStorage.setItem('v561-quiniela',JSON.stringify(merged));
     notice(Object.keys(imported).length+' pronósticos importados a la app azul');
     await mountQuiniela(root);
   }catch(error){notice('Importación cancelada: '+error.message)}
   finally{backupFile.value=''}
 };
 const exportBtn=$('[data-q-export]',root);
 if(exportBtn)exportBtn.onclick=async()=>{try{const cv=await reportCanvas(catId,'quiniela',{round});downloadFile(new File([await blob(cv)],filename('quiniela',catId),{type:'image/png'}))}catch(e){notice(e.message)}};
}

function addEntry(root,route,title){if(root.querySelector('[data-v561-route="'+route+'"],[data-route="'+route+'"],[data-v668-route="'+route+'"]'))return;const b=document.createElement('button');b.type='button';b.className='v561-tool-entry';b.dataset.v561Route=route;b.textContent=title+' ›';b.onclick=()=>location.hash='#/'+route;root.append(b)}
function brandExistingExports(){
 const exports=window.CompetitionExports;if(!exports)return;
 for(const key of ['standings','results','calendar','single','stats','team','scorers','bracket']){const original=exports[key];if(typeof original!=='function'||original._v561Branded)continue;const wrapped=async context=>brandPng(await original(context),String(context.category));wrapped._v561Branded=true;exports[key]=wrapped}
}
function addSuspensionPng(screen){
 const form=screen.querySelector('[data-v64-susp-cat]');if(!form||screen.querySelector('[data-v561-susp-png]'))return;
 const actions=document.createElement('div');actions.className='v561-actions';actions.innerHTML='<button data-v561-susp-png>Vista previa PNG del aviso</button><button data-v561-susp-download disabled>Descargar PNG</button><button data-v561-susp-share disabled>Compartir imagen</button><a href="https://wa.me/524121715599" target="_blank" rel="noopener">WhatsApp · Presidente</a><div data-v561-susp-preview></div>';
 screen.querySelector('[data-v64-susp-save]')?.parentElement.after(actions);let file;
 const invalidate=()=>{file=null;actions.querySelectorAll('button:not([data-v561-susp-png])').forEach(b=>b.disabled=true);$('[data-v561-susp-preview]',actions).replaceChildren()};screen.querySelectorAll('[data-v64-susp-cat],[data-v64-susp-round],[data-v64-susp-type],[data-v64-susp-scope],[data-v64-susp-match],[data-v64-susp-venue],[data-v64-susp-reason],[data-v64-susp-date],[data-v64-susp-time],[data-v64-susp-priority],[data-v64-susp-message]').forEach(e=>e.addEventListener('input',invalidate));
 $('[data-v561-susp-png]',actions).onclick=async e=>{e.target.disabled=true;try{await getDb();const value=key=>$('[data-v64-susp-'+key+']',screen)?.value||'';const c=normalizeCompetition(db).find(c=>norm(c.name)===norm(value('cat'))||norm(labels[c.id])===norm(value('cat')));if(!c)throw Error('Selecciona una categoría oficial');const match=value('match'),m=c.matches.find(m=>norm(m.home+' vs '+m.away)===norm(match)||match.includes(m.home)&&match.includes(m.away));const note=['Alcance: '+value('scope'),'Sede: '+value('venue'),'Motivo: '+value('reason'),'Prioridad: '+value('priority'),value('message')].filter(Boolean).join('\n');const cv=await reportCanvas(c.id,'notice',{round:value('round'),match:m?m.home+' vs '+m.away:match,team:m?.home,team2:m?.away,noticeType:value('type'),date:value('date')+' · '+value('time'),note});file=new File([await blob(cv)],filename('notice',c.id),{type:'image/png'});$('[data-v561-susp-preview]',actions).replaceChildren(cv);actions.querySelectorAll('button:not([data-v561-susp-png])').forEach(b=>b.disabled=false);notice('Aviso listo con logos · PNG HD')}catch(e){notice(e.message)}finally{e.target.disabled=false}};
 $('[data-v561-susp-download]',actions).onclick=()=>file&&downloadFile(file);$('[data-v561-susp-share]',actions).onclick=()=>file&&shareFile(file,'Aviso de Liga Juventino Rosas · Presidente 4121715599').catch(e=>{if(e.name!=='AbortError')notice(e.message)});
}
async function mount(){const route=location.hash.replace(/^#\/?/,'').split('?')[0]||'home',screen=$('#screen');if(!screen)return;brandExistingExports();addSuspensionPng(screen);const pub=$('[data-v561-publications-mount]',screen),q=$('[data-v561-quiniela-mount]',screen);if(pub&&!pub.childElementCount)await mountPublications(pub);if(q){await getQuinielaDb();const stamp=String(qDb?.captured_at_utc||'');if(!q.childElementCount||q.dataset.v960Captured!==stamp){await mountQuiniela(q);q.dataset.v960Captured=stamp}}
 if(['more','leagueTools','publications','notices','suspensionTool','scheduleChanges','discipline','scorers','tableExport','cedulaBuilder','transfers','competition'].includes(route))addEntry(screen,'publicationCenter','Generar PNG por categoría · Tablas y avisos');if(['more','leagueTools'].includes(route))addEntry(screen,'quiniela','Quiniela de la liga');
}
window.LJR_PUBLICATIONS={reportCanvas,brandPng,shareFile};
let timer;function schedule(){clearTimeout(timer);timer=setTimeout(()=>mount().catch(e=>notice(e.message)),100)}window.addEventListener('hashchange',schedule);window.addEventListener('ljr:official-data',()=>{db=null;dataPromise=null;schedule()});new MutationObserver(schedule).observe($('#screen'),{childList:true});schedule();
