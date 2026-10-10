/* V1126 — Estudio MVP local. No altera cédulas, votos oficiales ni resultados. */
(function(){
'use strict';
if(window.LJR_MOTM_STUDIO)return;
const STORE='v1126-motm-records',VOTES='v1126-motm-votes';
const $=(s,r=document)=>r.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const read=(key,def)=>{try{const val=JSON.parse(localStorage.getItem(key));return val??def}catch(_){return def}};
const save=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));return true}catch(_){return false}};
const db=()=>window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
const cats=()=>Object.entries(db().categories||{}).map(([id,c])=>({id,name:c?.name||'Categoría '+id,category:c}));
const safeFile=x=>String(x||'mvp').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'');
const txt=x=>String(x||'').trim();
const alertText=(root,msg)=>{const node=$('[data-mvp-status]',root);if(node){node.textContent=msg;node.hidden=!msg}};
const matchRows=()=>{
 const matches=[];
 for(const [catId,cat] of Object.entries(db().categories||{})){
  for(const r of (cat?.fixtures||[]).flatMap(b=>Array.isArray(b?.rows)?b.rows:[])){
   if(!r?.[2]||!r?.[6])continue;
   matches.push({key:String(catId)+':'+String(r?.[0]||matches.length),catId:String(catId),category:cat?.name||'Categoría',r,home:String(r[2]),away:String(r[6]),round:String(r[1]??''),date:String(r[8]||''),field:String(r[7]||'')});
  }
 }
 return matches;
};
function officialPlayers(){
 try{const p=window.V66_OFFICIAL_DIRECTORY?.playerList?.();if(Array.isArray(p)&&p.length)return p}catch(_){}
 const out=[];
 Object.entries(db().categories||{}).forEach(([catId,cat])=>Object.entries(cat?.rosters||{}).forEach(([team,players])=>{
  (Array.isArray(players)?players:[]).forEach(x=>{const name=typeof x==='string'?x:x?.name;if(name)out.push({name,team,cat:catId})});
 }));
 return out;
}
const CATEGORY_LOGOS={
 '3':'./assets/branding/primera-fuerza-hd.png',
 '5':'./assets/categories/intermedia.webp',
 '4':'./assets/categories/segunda-fuerza.webp',
 '2':'./assets/categories/veteranos-35-user.png',
 '1':'./assets/categories/veteranos-50.webp'
};
const categoryCrest=id=>CATEGORY_LOGOS[String(id)]||'./assets/liga-logo.webp';
function imageSource(value){
 const raw=String(value||'').trim();
 if(!raw)return '';
 if(/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(raw))return raw;
 if(/^https?:\/\//i.test(raw))return raw;
 if(/^(?:\.\/|\/|assets\/|data\/)/i.test(raw)){
  try{return new URL(raw,document.baseURI).href}catch(_){return ''}
 }
 return '';
}
function avatar(p){
 let photo=p?.photo||'';
 if(!photo)try{photo=window.LJR_PLAYER_MEDIA?.photo?.(p?.name,p?.team,p?.cat)||''}catch(_){}
 if(!photo)try{photo=window.LJR_PLAYER_PHOTOS?.get?.(p?.name,p?.team,p?.cat)||''}catch(_){}
 return imageSource(photo);
}
function crest(team){
 if(!team)return '';
 // Exactamente el registro visual que consumen Equipos y Siguiendo; no usar escudos antiguos.
 for(const get of [
  ()=>window.LJR_TEAM_LOGOS?.get?.(team),
  ()=>window.V66_OFFICIAL_DIRECTORY?.logoFor?.(team),
  ()=>window.LJR_OFFICIAL_API?.getLogo?.(team),
  ()=>window.LJR_SEASON_LOGOS?.get?.(team)
 ]){
  try{const src=imageSource(get());if(src)return src}catch(_){}
 }
 const item=Object.entries(db().team_logos||{}).find(([name])=>norm(name)===norm(team))?.[1];
 const raw=typeof item==='string'?item:(item?.app||item?.local||item?.source||'');
 if(!raw)return '';
 const local=imageSource(raw);
 return local||imageSource('https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(raw).replace(/^\.\//,''));
}
function allRecords(){
 let list=read(STORE,[]);if(!Array.isArray(list))list=[];
 const old=read('v105-motm',null);
 if(old?.player&&!list.some(x=>x.key==='legacy-v105')){
  list=[...list,{key:'legacy-v105',catId:'',matchKey:'',team:old.team||'',player:old.player,at:old.at||'',reason:'Registro anterior',legacy:true}];
  save(STORE,list);
 }
 return list.filter(x=>x&&typeof x==='object');
}
function recordFor(matchKey){return allRecords().find(r=>r.key===matchKey)||null}
function playerData(state){
 const players=officialPlayers().filter(p=>String(p.cat)===String(state.catId)&&(!state.team||norm(p.team)===norm(state.team)));
 return [...new Map(players.map(p=>[norm(p.name),p])).values()].sort((a,b)=>String(a.name).localeCompare(String(b.name),'es'));
}
function dataUriDownload(blob,name){
 const url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
// Las tres imágenes se comparten entre el formulario, la vista previa y el PNG.
const loadImage=src=>new Promise(resolve=>{
 if(!src)return resolve(null);
 const img=new Image();
 if(!src.startsWith('data:'))img.crossOrigin='anonymous';
 img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;
});
function contain(ctx,img,x,y,w,h){
 if(!img)return;
 const k=Math.min(w/img.naturalWidth,h/img.naturalHeight);
 const iw=img.naturalWidth*k,ih=img.naturalHeight*k;
 ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);
}
function photoCircle(ctx,img,x,y,r){
 ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
 if(img){
  const scale=Math.max(r*2/img.naturalWidth,r*2/img.naturalHeight);
  const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  ctx.drawImage(img,x-w/2,y-h*.37,w,h);
 }else{
  ctx.fillStyle='#102b79';ctx.fillRect(x-r,y-r,r*2,r*2);
  ctx.fillStyle='#b8edff';ctx.font='bold 120px sans-serif';ctx.textAlign='center';ctx.fillText('★',x,y+43);
 }
 ctx.restore();
 ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle='#4bdbea';ctx.lineWidth=9;ctx.stroke();
}
async function buildCanvas(r){
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
 const c=canvas.getContext('2d');
 const [catImg,teamImg,playerImg]=await Promise.all([
  loadImage(categoryCrest(r.catId)),loadImage(crest(r.team)),loadImage(r.photo||avatar({name:r.player,team:r.team,cat:r.catId}))
 ]);
 const g=c.createLinearGradient(0,0,700,1350);
 g.addColorStop(0,'#0c3d9e');g.addColorStop(.44,'#081d70');g.addColorStop(1,'#030a35');
 c.fillStyle=g;c.fillRect(0,0,1080,1350);
 c.fillStyle='rgba(43,153,234,.12)';c.beginPath();c.arc(540,570,410,0,Math.PI*2);c.fill();
 c.strokeStyle='#36d9ee';c.lineWidth=7;c.strokeRect(26,26,1028,1298);
 c.strokeStyle='rgba(157,217,255,.27)';c.lineWidth=2;c.strokeRect(41,41,998,1268);
 contain(c,catImg,65,70,165,155);contain(c,teamImg,860,70,155,155);
 c.textAlign='center';c.fillStyle='#b6d7fc';c.font='bold 32px sans-serif';c.fillText('LIGA JUVENTINO ROSAS',540,115);
 c.fillStyle='#55e5f6';c.font='bold 26px sans-serif';c.fillText('RECONOCIMIENTO DESTACADO',540,162);
 c.fillStyle='#ffffff';c.font='bold 74px sans-serif';c.fillText('JUGADOR DEL',540,290);c.fillText('PARTIDO',540,375);
 c.strokeStyle='#46d5ed';c.lineWidth=4;c.beginPath();c.moveTo(185,414);c.lineTo(895,414);c.stroke();
 photoCircle(c,playerImg,540,637,178);
 contain(c,teamImg,740,681,145,145);
 c.fillStyle='#ffffff';
 const words=txt(r.player||'Jugador destacado').split(/\s+/);
 const lines=[];let line='';
 c.font='bold 58px sans-serif';
 for(const word of words){
  const next=(line+' '+word).trim();
  if(c.measureText(next).width>900&&line){lines.push(line);line=word}else line=next;
 }
 if(line)lines.push(line);
 const display=lines.slice(0,3);
 const beginY=display.length===1?948:display.length===2?909:874;
 display.forEach((txt,i)=>{c.font='bold 56px sans-serif';c.fillText(txt,540,beginY+i*67)});
 c.fillStyle='#53e7f1';c.font='bold 39px sans-serif';
 const teamName=txt(r.team||'');
 for(let size=39;size>=24;size-=3){c.font='bold '+size+'px sans-serif';if(c.measureText(teamName).width<=920)break}
 c.fillText(teamName,540,1090);
 c.fillStyle='#dceaff';c.font='bold 32px sans-serif';
 c.fillText((r.category||'Liga Juventino Rosas')+(r.round?' · Jornada '+r.round:''),540,1153);
 const matchup=r.home&&r.away?r.home+'  VS  '+r.away:'';
 if(matchup){c.font='27px sans-serif';for(let size=27;size>=18;size-=2){c.font=size+'px sans-serif';if(c.measureText(matchup).width<900)break}c.fillText(matchup,540,1214)}
 c.fillStyle='#a8d6f9';c.font='26px sans-serif';c.fillText(r.reason||'Rendimiento destacado',540,1265);
 return canvas;
}
const png=async r=>new Promise(async(resolve,reject)=>{
 try{const canvas=await buildCanvas(r);canvas.toBlob(blob=>blob?resolve(blob):reject(Error('No se pudo generar el PNG')),'image/png')}
 catch(err){reject(err)}
});
const reasons=['Rendimiento destacado','Goles','Asistencias','Defensa','Portero','Liderazgo','Juego en equipo','Otro'];
function open(options={}){
 const matches=matchRows(),categories=cats(),all=officialPlayers();
 let current=$('.v1126-motm-modal');if(current)current.remove();
 let match=matches.find(m=>m.key===options.matchKey)||null;
 const state={
  catId:match?.catId||String(options.catId||categories[0]?.id||all[0]?.cat||''),
  matchKey:match?.key||'',team:'',player:'',filter:'',reason:reasons[0],
  view:'',editKey:'',voted:read(VOTES,{}),notice:''
 };
 const teamNames=catId=>[...new Set(all.filter(p=>String(p.cat)===String(catId)).map(p=>p.team).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
 const matchChoices=()=>matches.filter(m=>m.catId===state.catId);
 function resolve(){
  match=matches.find(m=>m.key===state.matchKey)||null;
  const saved=recordFor(match?.key||'');
  const teams=match?[match.home,match.away]:teamNames(state.catId);
  if(!teams.some(t=>norm(t)===norm(state.team)))state.team=teams[0]||'';
  const players=playerData(state).filter(p=>norm(p.name+' '+(p.dorsal||'')).includes(norm(state.filter)));
  if(!players.some(p=>p.name===state.player))state.player=saved&&norm(saved.team)===norm(state.team)&&players.some(p=>p.name===saved.player)?saved.player:(players[0]?.name||'');
 }
 if(!match)state.matchKey=matchChoices()[0]?.key||'';
 resolve();
 const modal=document.createElement('div');modal.className='v105-modal v1126-motm-modal';
 modal.innerHTML='<section class="v105-dialog v1126-motm-dialog" role="dialog" aria-modal="true" aria-label="Jugador del partido">'+
  '<header class="v1126-head"><span class="v1126-trophy" aria-hidden="true">★</span><div><small>RECONOCIMIENTO · LIGA JUVENTINO ROSAS</small><h3>Jugador del partido</h3><p>Elige a un jugador registrado para crear su reconocimiento con foto y escudos.</p></div><button class="v1126-x" type="button" data-mvp-close aria-label="Cerrar">×</button></header>'+
  '<div class="v1126-content" data-mvp-content></div>'+
  '<p class="v1126-status" data-mvp-status role="status" aria-live="polite" hidden></p></section>';
 document.body.appendChild(modal);
 function selected(){return playerData(state).find(p=>p.name===state.player)||null}
 function draft(){
  const p=selected();
  return {key:match?.key||('sin-partido:'+state.catId+':'+norm(state.team)),matchKey:match?.key||'',catId:state.catId,category:categories.find(x=>x.id===state.catId)?.name||'',round:match?.round||'',date:match?.date||'',home:match?.home||'',away:match?.away||'',team:state.team,player:p?.name||'',reason:state.reason,at:new Date().toISOString(),photo:p?avatar(p):'',teamLogo:crest(state.team),categoryLogo:categoryCrest(state.catId)};
 }
 function iconImage(url,alt,cls){
  return url?'<img class="'+cls+'" src="'+esc(url)+'" alt="'+esc(alt)+'" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true">':'';
 }
 function render(){
  resolve();
  const saved=recordFor(draft().key);
  const teams=match?[match.home,match.away]:teamNames(state.catId);
  const players=playerData(state);
  const filtered=players.filter(p=>norm(p.name+' '+(p.dorsal||'')) .includes(norm(state.filter)));
  const person=selected(),photo=person?avatar(person):'';
  const key=draft().key,votes=state.voted||{},selectedVote=votes[key]||null;
  let html='<div class="v1126-selectors"><label>Categoría<select data-mvp-cat>'+categories.map(x=>'<option value="'+esc(x.id)+'"'+(state.catId===x.id?' selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></label>'+
   '<label>Jornada / partido<select data-mvp-fixture>'+
    (!matchChoices().length?'<option value="">Sin encuentros publicados</option>':'<option value="">Sin partido · borrador local</option>')+
    matchChoices().map(m=>'<option value="'+esc(m.key)+'"'+(state.matchKey===m.key?' selected':'')+'>J'+esc(m.round||'—')+' · '+esc(m.home)+' vs '+esc(m.away)+'</option>').join('')+
   '</select></label></div>';
  html+='<div class="v1126-match"><small>'+iconImage(categoryCrest(state.catId),'Logo de categoría','v1126-match-category')+'<span>'+(match?'PARTIDO PUBLICADO · '+esc(match.date||'Fecha por confirmar'):'BORRADOR SIN PARTIDO')+'</span></small><div>'+
   '<span>'+iconImage(crest(match?.home||state.team),'Escudo local','v1126-crest')+esc(match?.home||state.team||'Sin equipo')+'</span><strong>'+(match?'VS':'★')+'</strong>'+
   '<span>'+iconImage(crest(match?.away||''),'Escudo visitante','v1126-crest')+esc(match?.away||'Selección local')+'</span></div></div>';
  html+='<label class="v1126-label">Equipo</label><div class="v1126-team-rail">'+teams.map((team,i)=>'<button type="button" class="'+(norm(state.team)===norm(team)?'active':'')+'" data-mvp-team="'+esc(team)+'">'+iconImage(crest(team),team,'v1126-team-pick-logo')+'<span>'+esc(team)+'</span></button>').join('')+'</div>';
  html+='<label class="v1126-label">Buscar jugador</label><input type="search" data-mvp-search placeholder="Nombre o dorsal" value="'+esc(state.filter)+'" autocomplete="off">'+
    '<label class="v1126-label">Jugador registrado ('+filtered.length+')</label><select data-mvp-player>'+
    (filtered.length?filtered.map(p=>'<option value="'+esc(p.name)+'"'+(state.player===p.name?' selected':'')+'>'+esc(p.name)+(p.dorsal?' · #'+esc(p.dorsal):'')+'</option>').join(''):'<option value="">Sin coincidencias</option>')+
    '</select>';
  html+='<div class="v1126-profile"><div class="v1126-avatar">'+iconImage(photo,state.player,'v1126-player-photo')+'<span>★</span></div><div><strong>'+esc(person?.name||'Selecciona un jugador')+'</strong><small>'+esc(state.team||'Sin equipo')+(person?.dorsal?' · #'+esc(person.dorsal):'')+(person?.position?' · '+esc(person.position):'')+'</small></div><span class="v1126-profile-brand">'+iconImage(crest(state.team),state.team,'v1126-team-logo')+iconImage(categoryCrest(state.catId),'Categoría','v1126-category-logo')+'</span></div>';
  html+='<label class="v1126-label">Motivo del reconocimiento</label><select data-mvp-reason>'+reasons.map(x=>'<option'+(x===state.reason?' selected':'')+'>'+esc(x)+'</option>').join('')+'</select>';
  html+='<div class="v1126-primary-actions"><button type="button" class="primary" data-mvp-save '+(!person?'disabled':'')+'>★ '+(saved?'Actualizar selección':'Guardar MVP')+'</button>'+
    '<button type="button" data-mvp-preview '+(!person?'disabled':'')+'>Vista previa</button></div>';
  if(saved)html+='<p class="v1126-saved">✓ Selección guardada: '+esc(saved.player)+' · '+esc(saved.team)+' <button type="button" data-mvp-edit="'+esc(saved.key)+'">Editar</button></p>';
  html+='<div class="v1126-actions"><button type="button" data-mvp-png '+(!person?'disabled':'')+'>↓ PNG</button><button type="button" data-mvp-share '+(!person?'disabled':'')+'>↗ Compartir</button>'+
   '<button type="button" data-mvp-view="history">Historial</button><button type="button" data-mvp-view="ranking">Ranking</button><button type="button" data-mvp-view="votes">Voto local</button></div>';
  if(state.view==='preview'){
   const d=draft();html+='<section class="v1126-detail"><h4>Vista previa del reconocimiento</h4><div class="v1126-preview">'+
    '<div class="v1126-preview-top">'+iconImage(categoryCrest(d.catId),d.category,'v1126-preview-category')+'<span>LIGA JUVENTINO ROSAS<small>RECONOCIMIENTO DESTACADO</small></span>'+iconImage(crest(d.team),d.team,'v1126-preview-team')+'</div>'+
    '<b>★ JUGADOR DEL PARTIDO</b><div class="v1126-preview-face">'+iconImage(d.photo,d.player,'v1126-preview-photo')+'<span>★</span></div>'+
    '<strong>'+esc(d.player)+'</strong><span>'+esc(d.team)+' · '+esc(d.category)+'</span><small>'+esc(d.reason)+'</small></div></section>';
  }else if(state.view==='history'){
   const rows=allRecords().slice().sort((a,b)=>String(b.at).localeCompare(String(a.at)));
   html+='<section class="v1126-detail"><h4>Historial local ('+rows.length+')</h4>'+(rows.length?rows.slice(0,60).map(r=>'<article><div><b>'+esc(r.player)+'</b><small>'+esc(r.team)+' · '+esc(r.category||'Anterior')+(r.round?' · J'+esc(r.round):'')+'</small></div><button data-mvp-edit="'+esc(r.key)+'">Editar</button><button data-mvp-delete="'+esc(r.key)+'">Quitar</button></article>').join(''):'<p>Aún no hay selecciones guardadas.</p>')+'</section>';
  }else if(state.view==='ranking'){
   const stats=new Map();for(const r of allRecords()){if(!r.player)continue;const k=norm(r.player)+'|'+norm(r.team),prev=stats.get(k)||{name:r.player,team:r.team,n:0};prev.n++;stats.set(k,prev)}
   const arr=[...stats.values()].sort((a,b)=>b.n-a.n||a.name.localeCompare(b.name,'es'));
   html+='<section class="v1126-detail"><h4>Reconocimientos en este dispositivo</h4>'+(arr.length?arr.slice(0,30).map((r,i)=>'<article><b>'+String(i+1)+'. '+esc(r.name)+'</b><small>'+esc(r.team)+'</small><strong>'+r.n+' MVP</strong></article>').join(''):'<p>El ranking se llena al guardar selecciones locales.</p>')+'</section>';
  }else if(state.view==='votes'){
   html+='<section class="v1126-detail"><h4>Mi voto de la afición</h4><p>No es votación pública: se guarda un solo voto por partido en este dispositivo. Para sumar votos de todas las personas hace falta un servidor.</p>'+
    (selectedVote?'<p class="v1126-saved">✓ Ya votaste por '+esc(selectedVote.player)+' · '+esc(selectedVote.team)+'</p>':'<button type="button" class="primary" data-mvp-vote '+(!person||!match?'disabled':'')+'>Votar por '+esc(person?.name||'jugador')+'</button>')+'</section>';
  }
  $('[data-mvp-content]',modal).innerHTML=html;
  alertText(modal,state.notice);
 }
 function setNotice(text){state.notice=text;alertText(modal,text)}
 function recordSave(){
  const r=draft();if(!r.player||!r.team){setNotice('Selecciona un equipo y un jugador registrado.');return}
  const existing=allRecords().filter(x=>x.key!==r.key);
  if(!save(STORE,[...existing,r])){setNotice('No se pudo guardar: almacenamiento bloqueado o sin espacio.');return}
  if(r.matchKey)save('v92-mvp-local:'+r.matchKey,{player:r.player,team:r.team,at:r.at});
  // The old value is read only as a legacy record; writing it again would double-count MVPs.
  state.view='';state.notice='MVP guardado en este dispositivo. Los resultados y las actas no se modifican.';render();
 }
 async function share(){
  const r=draft();if(!r.player)return;
  const message='★ Jugador del partido · Liga Juventino Rosas\n'+r.player+' · '+r.team+'\n'+(r.category||'')+(r.round?' · Jornada '+r.round:'')+'\nReconocimiento de la Liga Juventino Rosas';
  try{
   const blob=await png(r);
   if(navigator.share&&typeof File!=='undefined'){
    const file=new File([blob],'MVP-'+safeFile(r.player)+'.png',{type:'image/png'});
    if(navigator.canShare?.({files:[file]})){await navigator.share({title:'Jugador del partido',text:message,files:[file]});return}
   }
   if(navigator.share){await navigator.share({title:'Jugador del partido',text:message});return}
   if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(message);setNotice('Texto copiado para compartir.');return}
   dataUriDownload(new Blob([message],{type:'text/plain'}),'MVP-'+safeFile(r.player)+'.txt');
  }catch(e){if(e?.name!=='AbortError')setNotice('No fue posible compartir. Usa Descargar PNG.')}
 }
 modal.addEventListener('click',async e=>{
  if(e.target===modal||e.target.closest('[data-mvp-close]')){modal.remove();return}
  const btn=e.target.closest('button');if(!btn)return;
  if(btn.hasAttribute('data-mvp-team')){state.team=btn.dataset.mvpTeam;state.player='';state.filter='';state.notice='';render()}
  else if(btn.hasAttribute('data-mvp-save'))recordSave();
  else if(btn.hasAttribute('data-mvp-preview')){state.view=state.view==='preview'?'':'preview';state.notice='';render()}
  else if(btn.hasAttribute('data-mvp-view')){state.view=state.view===btn.dataset.mvpView?'':btn.dataset.mvpView;state.notice='';render()}
  else if(btn.hasAttribute('data-mvp-png')){try{dataUriDownload(await png(draft()),'MVP-'+safeFile(state.player)+'.png');setNotice('Imagen PNG descargada.')}catch(_){setNotice('No se pudo descargar la imagen.')}}
  else if(btn.hasAttribute('data-mvp-share'))await share();
  else if(btn.hasAttribute('data-mvp-delete')){
   const key=btn.dataset.mvpDelete;if(!confirm('¿Quitar esta selección local del historial?'))return;
   if(save(STORE,allRecords().filter(r=>r.key!==key))){
    if(key.startsWith('legacy'))save('v105-motm',null);
    else if(key.includes(':'))try{localStorage.removeItem('v92-mvp-local:'+key)}catch(_){}
    state.notice='Selección eliminada del historial local.';render();
   }
  }else if(btn.hasAttribute('data-mvp-edit')){
   const r=allRecords().find(x=>x.key===btn.dataset.mvpEdit);if(!r)return;
   state.catId=String(r.catId||state.catId);state.matchKey=r.matchKey||'';
   state.team=r.team;state.player=r.player;state.reason=reasons.includes(r.reason)?r.reason:reasons[0];state.filter='';
   state.view='';state.notice='Selección cargada para editar. Pulsa Guardar para confirmar.';render();
  }else if(btn.hasAttribute('data-mvp-vote')){
   const r=draft();if(!match||!r.player||state.voted[r.key])return;
   state.voted[r.key]={player:r.player,team:r.team,at:new Date().toISOString()};
   if(!save(VOTES,state.voted)){delete state.voted[r.key];setNotice('No se pudo guardar tu voto.');return}
   state.notice='Voto local guardado. No es un conteo público.';render();
  }
 });
 modal.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('[data-mvp-cat]')){state.catId=t.value;state.matchKey=matches.find(m=>m.catId===state.catId)?.key||'';state.team='';state.player='';state.filter='';state.notice='';render()}
  else if(t.matches('[data-mvp-fixture]')){state.matchKey=t.value;state.team='';state.player='';state.filter='';state.notice='';render()}
  else if(t.matches('[data-mvp-player]')){state.player=t.value;state.notice='';render()}
  else if(t.matches('[data-mvp-reason]')){state.reason=t.value;state.notice='';render()}
 });
 modal.addEventListener('input',e=>{
  if(!e.target.matches('[data-mvp-search]'))return;
  // Update the results without replacing the focused search input: Android keyboard stays open.
  state.filter=e.target.value;
  const list=playerData(state).filter(p=>norm(p.name+' '+(p.dorsal||'')).includes(norm(state.filter)));
  if(!list.some(p=>p.name===state.player))state.player=list[0]?.name||'';
  const picker=$('[data-mvp-player]',modal);
  if(picker){
   picker.innerHTML=list.length?list.map(p=>'<option value="'+esc(p.name)+'">'+esc(p.name)+(p.dorsal?' · #'+esc(p.dorsal):'')+'</option>').join(''):'<option value="">Sin coincidencias</option>';
   picker.value=state.player;
  }
  const counter=[...modal.querySelectorAll('.v1126-label')].find(x=>x.textContent.startsWith('Jugador registrado'));
  if(counter)counter.textContent='Jugador registrado ('+list.length+')';
  const person=list.find(p=>p.name===state.player)||null;
  const profile=$('.v1126-profile',modal);
  if(profile){
   const title=profile.querySelector('strong'),detail=profile.querySelector('small'),avatarBox=profile.querySelector('.v1126-avatar');
   if(title)title.textContent=person?.name||'Selecciona un jugador';
   if(detail)detail.textContent=(state.team||'Sin equipo')+(person?.dorsal?' · #'+person.dorsal:'')+(person?.position?' · '+person.position:'');
   if(avatarBox)avatarBox.innerHTML=iconImage(person?avatar(person):'',state.player,'v1126-player-photo')+'<span>★</span>';
  }
  modal.querySelectorAll('[data-mvp-save],[data-mvp-preview],[data-mvp-png],[data-mvp-share]').forEach(btn=>btn.disabled=!person);
  const voteBtn=$('[data-mvp-vote]',modal);
  if(voteBtn){voteBtn.disabled=!person||!match;voteBtn.textContent='Votar por '+(person?.name||'jugador')}
 });
 modal.addEventListener('keydown',e=>{if(e.key==='Escape')modal.remove()});
 render();$('.v1126-x',modal)?.focus();return modal;
}
window.LJR_MOTM_STUDIO={open,records:allRecords,fixtureKey:m=>m?.key||''};
})();