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
async function getDb(){if(window.LJR_OFFICIAL_API?.getData?.())return db=window.LJR_OFFICIAL_API.getData();if(db)return db;if(!dataPromise)dataPromise=fetch('./data/official-live.json').then(r=>{if(!r.ok)throw Error('No se pudieron cargar datos oficiales');return r.json()}).then(x=>db=x).catch(e=>{dataPromise=null;throw e});return dataPromise}
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
 await getDb();const c=category(id);if(!c)throw Error('Categoría no publicada');let rows=[],heads=[],widths=[];const authoring=['notice','transfer','cedula','quiniela'].includes(type);
 if(type==='standings'){heads=['#','Equipo','PJ','PG','PE','PP','GF','GC','DG','PTS'];widths=[45,450,65,65,65,65,65,65,65,70];rows=c.standings.map(t=>({team:t.name,cells:[t.pos,t.name,t.pj,t.g,t.e,t.p,t.gf,t.gc,t.dg,t.pts]}))}
 if(type==='scorers'){heads=['#','Jugador / Equipo','Goles'];widths=[50,890,100];rows=c.scorers.map(t=>({team:t.team,cells:[t.pos,t.player+'\n'+t.team,t.goals]}))}
 if(type==='calendar'||type==='results'){heads=['Partido','Fecha / Sede',type==='results'?'Marcador':'Hora'];widths=[500,400,150];rows=c.matches.filter(m=>(!options.round||m.round===String(options.round))&&(type==='calendar'?!m.complete:m.complete)).map(m=>({team:m.home,team2:m.away,cells:[m.home+'\nvs '+m.away,m.date+'\n'+(m.venue||'Sede por confirmar'),type==='results'?m.homeScore+' – '+m.awayScore:m.time||'Por confirmar']}))}
 if(type==='sanctions'){heads=['Jugador / Equipo','Sanción','Pendientes'];widths=[650,250,150];rows=(db.categories[id].suspensions||[]).flatMap(t=>t.rows||[]).filter(r=>r.length>=4).map(r=>({team:r[1],cells:[r[0]+'\n'+r[1],r[2],r[3]]}))}
 if(type==='notice'){heads=['Comunicado · borrador'];widths=[1050];if(!options.note?.trim())throw Error('Escribe el motivo y detalle del aviso');rows=[{team:options.team,team2:options.team2,cells:[(options.noticeType||'Aviso informativo')+'\n'+(options.match||'Toda la categoría')+'\n'+(options.date||'Fecha por confirmar')+'\n'+options.note]}]}
 if(type==='transfer'){heads=['Transferencia · borrador para revisión'];widths=[1050];if(!options.player?.trim()||!options.team||!options.team2)throw Error('Completa jugador, equipo de origen y destino');if(options.team===options.team2)throw Error('El origen y el destino deben ser distintos');rows=[{team:options.team,team2:options.team2,cells:[options.player+'\nOrigen: '+options.team+'\nDestino: '+options.team2+'\n'+(options.date||'Fecha por confirmar')+'\n'+(options.note||'Pendiente de autorización de la liga.')]}]}
 if(type==='cedula'){const m=c.matches.find(m=>m.id===options.match);if(!m)throw Error('Elige un partido para la cédula');heads=['Cédula de partido · borrador'];widths=[1050];rows=[{team:m.home,team2:m.away,cells:[m.home+' vs '+m.away+'\n'+m.date+' · '+(m.venue||'Sede por confirmar')+'\nJornada '+m.round+'\nMarcador: '+(m.complete?m.homeScore+' – '+m.awayScore:'Sin resultado completo publicado')+'\n'+(options.note||'Árbitro / incidencias / firmas: pendientes de completar.')]}]}
 if(type==='quiniela'){heads=['Partido','Pronóstico','Puntos'];widths=[650,250,150];const predictions=readPredictions();rows=c.matches.filter(m=>(!options.round||m.round===options.round)&&predictions[m.id]).map(m=>({team:m.home,team2:m.away,cells:[m.home+'\nvs '+m.away,predictions[m.id].home+' – '+predictions[m.id].away,m.complete?predictionPoints(predictions[m.id],m):'Pendiente']}))}
 if(!rows.length){if(['sanctions','scorers'].includes(type))rows=[{cells:['Sin '+(type==='sanctions'?'sanciones publicadas':'goleadores publicados')+' para esta categoría.']}];else throw Error('No hay datos publicados para esta selección')}
 const logoColumn=['standings','scorers'].includes(type)?1:0;
 const prepared=rows.map(r=>{const cells=r.cells.map((s,i)=>String(s??'—').split('\n').flatMap(line=>wrap(document.createElement('canvas').getContext('2d'),line,widths[i]-30-(i===logoColumn&&r.team?(r.team2?142:82):0))));return {...r,lines:cells,height:Math.max(92,Math.max(...cells.map(a=>a.length))*34+34)}});
 const cv=document.createElement('canvas');cv.width=1200;cv.height=340+prepared.reduce((s,r)=>s+r.height,0)+95;const x=cv.getContext('2d'),bg=x.createLinearGradient(0,0,1200,cv.height);bg.addColorStop(0,'#091b82');bg.addColorStop(1,'#030638');x.fillStyle=bg;x.fillRect(0,0,1200,cv.height);
 const icons=await Promise.all([image('./assets/league-credential-hd.png'),image('./assets/'+categoryLogos[id])]);drawImage(x,icons[0],35,25,125);drawImage(x,icons[1],1040,25,125);x.fillStyle='#29e4ed';x.font='800 21px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS',185,53);x.fillStyle='#fff';textLines(x,wrap(x,titles[type],790,'900 38px Arial'),185,104,45);x.font='700 26px Arial';x.fillText(c.name+(options.round?' · Jornada '+options.round:''),185,188);x.fillStyle='#32deec';x.font='600 22px Arial';x.fillText(day(id),185,225);
 x.fillStyle='#142778';x.fillRect(30,260,1140,56);x.font='800 21px Arial';x.fillStyle='#c1d8ef';let left=45;heads.forEach((h,i)=>{x.fillText(h,left,296);left+=widths[i]});let y=335;
 const logos=await Promise.all(prepared.map(async r=>[await image(logo(r.team)),await image(logo(r.team2))]));
 prepared.forEach((r,i)=>{x.fillStyle=i%2?'#0c165d':'#101d6e';x.fillRect(30,y,1140,r.height-5);x.fillStyle='#fff';x.font='600 26px Arial';let left=45;r.lines.forEach((lines,j)=>{let offset=0;if(r.team&&j===logoColumn){drawImage(x,logos[i][0],left+2,y+12,65);if(r.team2)drawImage(x,logos[i][1],left+69,y+12,65);offset=r.team2?142:82}textLines(x,lines,left+offset,y+35,34);left+=widths[j]});y+=r.height});x.fillStyle='#acbfdc';x.font='500 19px Arial';x.fillText((authoring?'Borrador generado en la app':'Datos oficiales disponibles · '+String(db.captured_at_utc||'').slice(0,10))+' · '+new Date().toLocaleDateString('es-MX'),40,cv.height-45);return cv;
}
export function predictionPoints(prediction,match){if(!match.complete)return null;if(prediction.home===match.homeScore&&prediction.away===match.awayScore)return 2;return Math.sign(prediction.home-prediction.away)===Math.sign(match.homeScore-match.awayScore)?1:0}
function readPredictions(){try{return JSON.parse(localStorage.getItem('v561-quiniela')||'{}')}catch{return {}}}
function downloadFile(file){const a=document.createElement('a'),url=URL.createObjectURL(file);a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000)}
function filename(type,id){return titles[type].replace(/\s+/g,'_')+'_'+labels[id].replace(/\s+/g,'_')+'.png'}
async function shareFile(file,text){if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'Liga Juventino Rosas',text})}else{downloadFile(file);notice('PNG descargado. Abre el chat y adjunta la imagen.')}}
function optionsHtml(){return order.filter(id=>db.categories[id]).map(id=>'<option value="'+id+'" '+(catId===id?'selected':'')+'>'+esc(labels[id])+'</option>').join('')}
async function mountPublications(root){await getDb();const requested=localStorage.getItem('v561-publication-kind');if(requested&&titles[requested]&&requested!=='quiniela')kind=requested;const c=category(catId);if(!c)return;root.innerHTML='<section class="v561-league v642-publications-card"><header class="v642-pub-head"><span class="v642-pub-badge" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM7 9h10M7 13h6M7 17h8"/></svg></span><div><small>PUBLICACIONES · PNG HD</small><h2>Centro de publicaciones</h2><p>Tablas, documentos y comunicados por categoría.</p></div></header><div class="v561-form"><label>Categoría<select data-pub-cat>'+optionsHtml()+'</select></label><label>Documento<select data-pub-type>'+Object.entries(titles).filter(([k])=>k!=='quiniela').map(([k,v])=>'<option value="'+k+'" '+(kind===k?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>Jornada<select data-pub-round><option value="">Todas las jornadas</option>'+c.rounds.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.id)+'</option>').join('')+'</select></label><p class="v561-day">'+day(catId)+'</p><div data-authoring><label>Tipo de aviso<select data-pub-notice>'+['Suspensión de jornada','Cancelación de jornada','Cambio de cancha','Cambio de horario','Aviso informativo'].map(t=>'<option>'+t+'</option>').join('')+'</select></label><label>Partido<select data-pub-match><option value="">Toda la categoría</option>'+c.matches.map(m=>'<option value="'+esc(m.id)+'">J'+esc(m.round)+' · '+esc(m.home+' vs '+m.away)+'</option>').join('')+'</select></label><label>Jugador<input data-pub-player maxlength="150"></label><label>Equipo / origen<select data-pub-team><option value="">Toda la categoría</option>'+c.standings.map(t=>'<option>'+esc(t.name)+'</option>').join('')+'</select></label><label>Rival / destino<select data-pub-team2><option value="">Sin segundo equipo</option>'+c.standings.map(t=>'<option>'+esc(t.name)+'</option>').join('')+'</select></label><label>Fecha<input data-pub-date type="date"></label><label>Detalle del comunicado / incidencias<textarea data-pub-note rows="4" maxlength="4000"></textarea></label></div></div><div class="v561-actions v642-pub-actions"><button class="v642-pub-generate" data-pub-generate><span class="v642-action-icon" aria-hidden="true">✦</span><span><b>Generar vista previa</b><small>Crear el diseño PNG HD</small></span><i>›</i></button><button class="v642-pub-download" data-pub-download disabled><span class="v642-action-icon" aria-hidden="true">↓</span><span><b>Descargar PNG</b><small>Guardar imagen en el teléfono</small></span><i>›</i></button><button class="v642-pub-share" data-pub-share disabled><span class="v642-action-icon" aria-hidden="true">↗</span><span><b>Compartir imagen</b><small>Enviar el PNG generado</small></span><i>›</i></button><a class="v642-pub-whatsapp" data-pub-whatsapp target="_blank" rel="noopener" href="https://wa.me/524121715599"><span class="v642-action-icon" aria-hidden="true">◉</span><span><b>Enviar por WhatsApp</b><small>Presidente · 4121715599</small></span><i>›</i></a></div><p data-v561-status aria-live="polite"></p><section class="v642-preview-card"><header><span class="v642-preview-icon" aria-hidden="true">▧</span><span><small>VISTA PREVIA</small><b>PNG listo para publicar</b></span></header><div class="v642-preview-stage" data-pub-preview></div></section><p class="v561-hint">Genera la vista previa, revisa el diseño y después descarga o comparte el PNG.</p></section>';
 let file;const author=$('[data-authoring]',root),setVisibility=()=>{author.hidden=!['notice','transfer','cedula'].includes(kind)};setVisibility();
 $('[data-pub-cat]',root).onchange=e=>{catId=e.target.value;localStorage.setItem('v561-category',catId);mountPublications(root)};$('[data-pub-type]',root).onchange=e=>{kind=e.target.value;localStorage.setItem('v561-publication-kind',kind);file=null;setVisibility();$('[data-pub-download]',root).disabled=true;$('[data-pub-share]',root).disabled=true};
 const invalidate=()=>{file=null;$('[data-pub-download]',root).disabled=true;$('[data-pub-share]',root).disabled=true;$('[data-pub-preview]',root).replaceChildren()};root.querySelectorAll('input,textarea,select').forEach(el=>el.addEventListener('input',invalidate));
 $('[data-pub-generate]',root).onclick=async e=>{e.target.disabled=true;try{const value=key=>$('[data-pub-'+key+']',root)?.value||'',m=c.matches.find(m=>m.id===value('match'));const o={round:value('round'),match:kind==='cedula'?value('match'):m?m.home+' vs '+m.away:'',team:value('team')||m?.home,team2:value('team2')||m?.away,noticeType:value('notice'),date:value('date'),note:value('note'),player:value('player')};const cv=await reportCanvas(catId,kind,o);file=new File([await blob(cv)],filename(kind,catId),{type:'image/png'});$('[data-pub-preview]',root).replaceChildren(cv);$('[data-pub-download]',root).disabled=false;$('[data-pub-share]',root).disabled=false;$('[data-pub-whatsapp]',root).href='https://wa.me/524121715599?text='+encodeURIComponent(titles[kind]+' · '+labels[catId]+' · Liga Juventino Rosas. Adjunto PNG para revisión.');notice('PNG listo · '+cv.width+' × '+cv.height+' px')}catch(e){notice(e.message)}finally{e.target.disabled=false}};
 $('[data-pub-download]',root).onclick=()=>file&&downloadFile(file);$('[data-pub-share]',root).onclick=()=>file&&shareFile(file,titles[kind]+' · '+labels[catId]+' · Presidente: 4121715599').catch(e=>{if(e.name!=='AbortError')notice(e.message)});
}
async function mountQuiniela(root){
 await getDb();
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
 const suggested=[...rounds].reverse().find(r=>(upcomingByRound.get(r)||[]).some(m=>!m.complete))||rounds.at(-1)||'';
 const selected=localStorage.getItem('v561-quiniela-round:'+catId)||suggested;
 if(!rounds.includes(String(selected))&&suggested)localStorage.setItem('v561-quiniela-round:'+catId,suggested);
 const round=rounds.includes(String(selected))?String(selected):String(suggested);
 const matches=(c.matches||[]).filter(m=>String(m.round)===round);
 let total=0,exact=0,outcome=0,scored=0,savedCount=0;
 for(const m of c.matches||[]){
   if(p[m.id])savedCount++;
   if(p[m.id]&&m.complete){
     const pts=predictionPoints(p[m.id],m);total+=pts;scored++;
     if(pts===2)exact++;else if(pts===1)outcome++;
   }
 }
 const teamCard=(m,side)=>{
   const name=side==='home'?m.home:m.away,src=logo(name);
   return '<div class="v618-q-team '+side+'">'+(src?'<img src="'+esc(src)+'" alt="'+esc(name)+'">':'<span class="v618-q-fallback">'+esc(String(name||'?').slice(0,2).toUpperCase())+'</span>')+'<b>'+esc(name)+'</b></div>';
 };
 const scoreInputs=m=>{
   const saved=p[m.id],disabled=m.complete?'disabled':'';
   return '<div class="v618-q-score">'+
     '<input type="number" inputmode="numeric" min="0" max="99" data-q-home aria-label="Goles de '+esc(m.home)+'" value="'+(saved?.home??'')+'" '+disabled+'>'+
     '<span>:</span>'+
     '<input type="number" inputmode="numeric" min="0" max="99" data-q-away aria-label="Goles de '+esc(m.away)+'" value="'+(saved?.away??'')+'" '+disabled+'>'+
   '</div>';
 };
 const card=m=>{
   const saved=p[m.id],pts=saved&&m.complete?predictionPoints(saved,m):null;
   const status=m.complete
     ?'<span class="v618-q-status done">Final · '+esc(m.homeScore)+'–'+esc(m.awayScore)+(saved?' · '+pts+' pt'+(pts===1?'':'s'):'')+'</span>'
     :(saved?'<span class="v618-q-status saved">✓ '+saved.home+'–'+saved.away+' guardado</span>':'<span class="v618-q-status open">Pronostica antes del inicio</span>');
   return '<article class="v618-q-card" data-q-match="'+esc(m.id)+'">'+
     '<div class="v618-q-card-top"><small>Jornada '+esc(m.round)+'</small><time>'+esc(m.date||'Fecha por confirmar')+(m.time?' · '+esc(m.time):'')+'</time></div>'+
     '<div class="v618-q-card-main">'+teamCard(m,'home')+
       '<div class="v618-q-center">'+scoreInputs(m)+
         (!m.complete?'<button type="button" class="v618-q-save-one" data-q-save-one="'+esc(m.id)+'">Guardar pronóstico</button>':'')+
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
 '</div>';
 const rules='<section class="v618-q-rules"><b><span class="v953-q-rule-icon">'+qIcon('trophy')+'</span>Pronostica el marcador exacto de cada partido</b><p><span>2 pts</span> si aciertas el marcador exacto · <span>1 pt</span> si aciertas ganador o empate.</p><small><span class="v953-q-clock">'+qIcon('clock')+'</span>Solo puedes editar antes de que el partido quede registrado como finalizado.</small></section>';
 let body='';
 if(view==='ranking'){
   body='<section class="v618-q-ranking">'+
     '<div class="v618-q-rank-hero"><small>MI RANKING EN ESTA APP</small><strong>'+total+' pts</strong><span>'+savedCount+' pronósticos guardados</span></div>'+
     '<div class="v618-q-stats"><div><b>'+exact+'</b><small>Exactos · 2 pts</small></div><div><b>'+outcome+'</b><small>Ganador/empate · 1 pt</small></div><div><b>'+scored+'</b><small>Evaluados</small></div></div>'+
     '<p class="v618-q-local-note">Tus puntos se calculan con tus pronósticos guardados en Liga Juventino Rosas.</p>'+
   '</section>';
 }else if(view==='history'){
   const finished=(c.matches||[]).filter(m=>m.complete).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
   const grouped=new Map();
   for(const m of finished){const r=String(m.round||'—');if(!grouped.has(r))grouped.set(r,[]);grouped.get(r).push(m)}
   body='<section class="v618-q-history">'+
     (grouped.size?[...grouped.entries()].map(([r,rows])=>'<div class="v618-q-history-round"><header><b>Jornada '+esc(r)+'</b><span>'+rows.filter(m=>p[m.id]).length+' pronosticados</span></header>'+rows.map(card).join('')+'</div>').join(''):'<div class="v618-q-empty">Todavía no hay partidos finalizados en esta categoría.</div>')+
   '</section>';
 }else{
   body='<div class="v618-q-round"><span>'+esc(c.name)+'</span><label>Jornada <select data-q-round>'+rounds.map(r=>'<option value="'+esc(r)+'" '+(r===round?'selected':'')+'>'+esc(r)+'</option>').join('')+'</select></label></div>'+
     '<h3 class="v618-q-section-title">En juego — pronostica ahora</h3>'+
     '<div class="v561-q-matches v618-q-matches">'+(matches.length?matches.map(card).join(''):'<div class="v618-q-empty">No hay partidos publicados en esta jornada.</div>')+'</div>'+
     '<div class="v561-actions v618-q-actions"><button data-q-save>Guardar todos</button><button data-q-export>Descargar quiniela PNG</button></div>';
 }
 root.innerHTML='<section class="v561-league v618-quiniela v619-quiniela-modern">'+
   '<header class="v618-q-head v619-q-hero">'+
     '<div class="v619-q-hero-top"><span class="v619-q-kicker"><i>✓</i> QUINIELA LJR</span><span class="v619-q-live">JORNADA ACTIVA</span></div>'+
     '<div class="v619-q-title-row"><span class="v619-q-mark v953-q-league-mark"><img src="'+LEAGUE_LOGO+'" alt="Liga Juventino Rosas"></span><div><h2>Quiniela</h2><p>Pronostica · suma puntos · sube en el ranking</p></div></div>'+
     '<div class="v619-q-mini-stats"><span><b>'+savedCount+'</b><small>Guardados</small></span><span><b>'+total+'</b><small>Puntos</small></span><span><b>'+exact+'</b><small>Exactos</small></span></div>'+
   '</header>'+
   nav+rules+
   '<div class="v618-q-cats">'+cats+'</div>'+
   '<select data-q-cat hidden>'+optionsHtml()+'</select>'+
   body+
   '<p data-v561-status aria-live="polite"></p>'+
 '</section>';

 root.querySelectorAll('[data-q-view]').forEach(btn=>btn.onclick=()=>{localStorage.setItem('v561-quiniela-view',btn.dataset.qView);mountQuiniela(root)});
 root.querySelectorAll('[data-q-cat-button]').forEach(btn=>btn.onclick=()=>{catId=btn.dataset.qCatButton;localStorage.setItem('v561-category',catId);mountQuiniela(root)});
 const hiddenCat=$('[data-q-cat]',root);if(hiddenCat)hiddenCat.onchange=e=>{catId=e.target.value;localStorage.setItem('v561-category',catId);mountQuiniela(root)};
 const roundSelect=$('[data-q-round]',root);if(roundSelect)roundSelect.onchange=e=>{localStorage.setItem('v561-quiniela-round:'+catId,e.target.value);mountQuiniela(root)};

 const saveRow=row=>{
   const next=readPredictions(),m=(c.matches||[]).find(x=>x.id===row.dataset.qMatch);
   if(!m||m.complete)return false;
   const h=$('[data-q-home]',row),a=$('[data-q-away]',row);
   if(h.value===''&&a.value===''){delete next[m.id];localStorage.setItem('v561-quiniela',JSON.stringify(next));return true}
   if(!h.checkValidity()||!a.checkValidity()||h.value===''||a.value===''){notice('Completa ambos marcadores con enteros entre 0 y 99');return false}
   next[m.id]={home:Number(h.value),away:Number(a.value),savedAt:new Date().toISOString()};
   localStorage.setItem('v561-quiniela',JSON.stringify(next));return true;
 };
 root.querySelectorAll('[data-q-save-one]').forEach(btn=>btn.onclick=()=>{
   const row=btn.closest('[data-q-match]');if(saveRow(row)){notice('Pronóstico guardado en Liga Juventino');mountQuiniela(root)}
 });
 const saveAll=$('[data-q-save]',root);
 if(saveAll)saveAll.onclick=()=>{
   let count=0;for(const row of root.querySelectorAll('[data-q-match]'))if(saveRow(row))count++;
   notice(count+' pronósticos guardados en Liga Juventino');mountQuiniela(root);
 };
 const exportBtn=$('[data-q-export]',root);
 if(exportBtn)exportBtn.onclick=async()=>{try{const cv=await reportCanvas(catId,'quiniela',{round});downloadFile(new File([await blob(cv)],filename('quiniela',catId),{type:'image/png'}))}catch(e){notice(e.message)}};
}

function addEntry(root,route,title){if(root.querySelector('[data-v561-route="'+route+'"]'))return;const b=document.createElement('button');b.type='button';b.className='v561-tool-entry';b.dataset.v561Route=route;b.textContent=title+' ›';b.onclick=()=>location.hash='#/'+route;root.append(b)}
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
async function mount(){const route=location.hash.replace(/^#\/?/,'').split('?')[0]||'home',screen=$('#screen');if(!screen)return;brandExistingExports();addSuspensionPng(screen);const pub=$('[data-v561-publications-mount]',screen),q=$('[data-v561-quiniela-mount]',screen);if(pub&&!pub.childElementCount)await mountPublications(pub);if(q&&!q.childElementCount)await mountQuiniela(q);
 if(['more','leagueTools','publications','notices','suspensionTool','scheduleChanges','discipline','scorers','tableExport','cedulaBuilder','transfers','competition'].includes(route))addEntry(screen,'publicationCenter','Generar PNG por categoría · Tablas y avisos');if(['more','leagueTools'].includes(route))addEntry(screen,'quiniela','Quiniela de la liga');
}
window.LJR_PUBLICATIONS={reportCanvas,brandPng,shareFile};
let timer;function schedule(){clearTimeout(timer);timer=setTimeout(()=>mount().catch(e=>notice(e.message)),100)}window.addEventListener('hashchange',schedule);window.addEventListener('ljr:official-data',()=>{db=null;dataPromise=null;schedule()});new MutationObserver(schedule).observe($('#screen'),{childList:true});schedule();
