/* V100 — Funciones aditivas desde “Apps falta”.
   Regla: no sustituye, mueve ni rediseña pantallas existentes. Solo agrega bloques al final.
   Datos privados capturados en estas herramientas se guardan únicamente en localStorage. */
(function(){
'use strict';

if(window.__LJR_V100_ADDITIVE__) return;
window.__LJR_V100_ADDITIVE__=true;

const BUILD='20260920-apps-falta1';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>location.hash.replace(/^#\//,'').split('?')[0]||'home';
const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

function toast(msg){
  let t=$('.v100-toast'); if(t)t.remove();
  t=document.createElement('div');t.className='v100-toast';t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>t.remove(),2200);
}
function go(r){location.hash='#/'+r}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},600)}
function canvasBlob(canvas){return new Promise(resolve=>canvas.toBlob(resolve,'image/png',1))}
function fileShare(blob,name,title){
  const f=new File([blob],name,{type:'image/png'});
  if(navigator.canShare?.({files:[f]}))return navigator.share({title,files:[f]});
  download(blob,name); return Promise.resolve();
}
function button(icon,title,sub,action,routeName){
  return '<button type="button" class="v100-tool" '+(routeName?'data-v100-route="'+esc(routeName)+'"':'data-v100-action="'+esc(action)+'"')+'><span class="v100-tool-icon">'+icon+'</span><span><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span><i>›</i></button>';
}
function sectionTitle(kicker,title,desc){return '<header class="v100-head"><small>'+esc(kicker)+'</small><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></header>'}

function officialTeams(){
  try{
    const list=window.V66_OFFICIAL_DIRECTORY?.teamList?.();
    if(Array.isArray(list)&&list.length)return list.map(x=>({name:x.name,category:x.category||'',cat:String(x.cat||'')}));
  }catch(e){}
  const out=[]; const db=window.LJR_OFFICIAL_DATA||{};
  Object.entries(db.categories||{}).forEach(([id,c])=>{
    const names=new Set();
    (c.standings||[]).forEach(group=>(group.rows||[]).forEach(r=>r?.[1]&&names.add(String(r[1]).trim())));
    Object.keys(c.rosters||{}).forEach(n=>names.add(n));
    names.forEach(name=>out.push({name,category:c.name||'',cat:String(id)}));
  });
  const seen=new Set();return out.filter(x=>{const k=norm(x.name)+'|'+x.cat;if(seen.has(k))return false;seen.add(k);return true});
}
function teamLogo(name){
  try{return window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||''}catch(e){return ''}
}
function openOfficialTeam(name){
  localStorage.setItem('v62-team-name',name);
  localStorage.setItem('v42-team-tab','summary');
  try{if(window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(name);return}}catch(e){}
  go('teamDetail');
}

/* ---------- HOME: Mi equipo + pulso + accesos ---------- */
function homeExtra(){
  const teams=officialTeams(); const fav=read('v100-favorite-team',{}); const cats=[...new Set(teams.map(t=>t.category).filter(Boolean))];
  const chosenCat=fav.category||cats[0]||'';
  const filtered=teams.filter(t=>!chosenCat||t.category===chosenCat);
  const chosen=teams.find(t=>t.name===fav.name)||filtered[0]||teams[0];
  const pulse=read('v100-fan-pulse',{fire:0,goal:0,clap:0,heart:0});
  const captured=window.LJR_OFFICIAL_DATA?.captured_at_utc;
  const logo=chosen?teamLogo(chosen.name):'';
  return '<section class="section v100-block" id="v100-home-extra" data-v100-team-count="'+teams.length+'">'+
    sectionTitle('PERSONALIZA TU LIGA','Mi equipo','Guarda un equipo favorito para tener acceso rápido. Se guarda solo en este dispositivo.')+
    '<div class="v100-fav-card">'+
      '<div class="v100-fav-summary"><span class="v100-fav-logo">'+(logo?'<img src="'+esc(logo)+'" alt="">':'⚽')+'</span><span><small>FAVORITO</small><b data-v100-fav-label>'+esc(chosen?.name||'Elige un equipo')+'</b><em>'+esc(chosen?.category||'Categoría')+'</em></span></div>'+
      '<label><span>Categoría</span><select data-v100-fav-cat>'+cats.map(c=>'<option '+(c===chosenCat?'selected':'')+'>'+esc(c)+'</option>').join('')+'</select></label>'+
      '<label><span>Equipo</span><select data-v100-fav-team>'+filtered.map(t=>'<option '+(t.name===chosen?.name?'selected':'')+'>'+esc(t.name)+'</option>').join('')+'</select></label>'+
      '<div class="v100-actions"><button class="v100-primary" data-v100-save-fav>Guardar favorito</button><button class="v100-secondary" data-v100-open-fav '+(!chosen?'disabled':'')+'>Ver equipo</button></div>'+
    '</div>'+
    '<div class="v100-quick-grid">'+
      '<button data-v100-route="following"><b>Seguir equipo</b><small>Favoritos y avisos</small></button>'+
      '<button data-v100-route="predictor"><b>Pronóstico</b><small>Crear pronóstico</small></button>'+
      '<button data-v100-route="leagueTools"><b>Herramientas</b><small>Operación de la Liga</small></button>'+
      '<button data-v100-action="delegates"><b>Delegados</b><small>Directorio local</small></button>'+
    '</div>'+
    '<div class="v100-pulse"><div><small>FAN ZONE</small><b>Pulso de la afición</b><span>Reacciones guardadas localmente</span></div><div class="v100-reactions">'+
      '<button data-v100-react="fire">🔥 <b>'+Number(pulse.fire||0)+'</b></button><button data-v100-react="goal">⚽ <b>'+Number(pulse.goal||0)+'</b></button><button data-v100-react="clap">👏 <b>'+Number(pulse.clap||0)+'</b></button><button data-v100-react="heart">💙 <b>'+Number(pulse.heart||0)+'</b></button></div></div>'+
    '<div class="v100-status"><span>Estado de la Liga</span><b>'+(captured?'Datos oficiales sincronizados':'Esperando datos oficiales')+'</b>'+(captured?'<small>Última fuente: '+esc(new Date(captured).toLocaleString('es-MX'))+'</small>':'')+'</div>'+
  '</section>';
}
function bindHome(root){
  const cat=$('[data-v100-fav-cat]',root),teamSel=$('[data-v100-fav-team]',root);
  const rebuild=()=>{const list=officialTeams().filter(t=>!cat.value||t.category===cat.value);teamSel.innerHTML=list.map(t=>'<option>'+esc(t.name)+'</option>').join('')};
  cat?.addEventListener('change',rebuild);
  $('[data-v100-save-fav]',root)?.addEventListener('click',()=>{const all=officialTeams(),t=all.find(x=>x.name===teamSel.value);if(!t)return toast('Selecciona un equipo');write('v100-favorite-team',t);toast('Equipo favorito guardado');root.remove();schedule()});
  $('[data-v100-open-fav]',root)?.addEventListener('click',()=>{const t=read('v100-favorite-team',{});const name=t.name||teamSel?.value;if(name)openOfficialTeam(name)});
  $$('[data-v100-react]',root).forEach(b=>b.onclick=()=>{const p=read('v100-fan-pulse',{fire:0,goal:0,clap:0,heart:0}),k=b.dataset.v100React;p[k]=(p[k]||0)+1;write('v100-fan-pulse',p);b.querySelector('b').textContent=p[k]});
}

/* ---------- MÁS / HERRAMIENTAS: únicamente anexado al final ---------- */
function toolsExtra(id='v100-more-extra'){
  return '<section class="v100-block v100-tools-block" id="'+id+'">'+sectionTitle('FUNCIONES ADICIONALES','Más herramientas','Se agregan debajo de lo que ya existe; no sustituyen ninguna sección.')+
    '<div class="v100-tools-grid">'+
      button('🪪','Credencial con OCR','Lectura tipo Lens, captura local y PNG','', 'credentialBuilder')+
      button('📷','Importar desde WhatsApp','Lee una imagen guardada con OCR','whatsapp-ocr')+
      button('🗓️','JR Matchday+','Checklist y operación de jornada','', 'matchday')+
      button('🧠','Simulador de jornada','Escenario local; no cambia resultados','journey-sim')+
      button('🧩','Pizarra táctica avanzada','2D/3D, arrastrar, JSON y PNG','', 'tactics')+
      button('🎯','Shot Map','Mapa de tiros guardado localmente','shotmap')+
      button('📣','Fan Zone','Reacciones rápidas de la afición','fanzone')+
      button('📇','Directorio de delegados','Contactos guardados solo en tu equipo','delegates')+
      button('📲','Instalar app','Instalar la PWA en este dispositivo','install-app')+
      button('🖼️','Boletín PNG','Crear imagen lista para compartir','', 'publications')+
    '</div>'+
    '<p class="v100-note">El OCR funciona en el navegador con Tesseract.js. No es la API de Google Lens y las imágenes no se suben a GitHub.</p>'+
  '</section>';
}

/* ---------- CREDENCIAL OCR: campos extra y exportación ---------- */
function curpDob(curp){
  const m=String(curp||'').toUpperCase().match(/^[A-Z]{4}(\d{2})(\d{2})(\d{2})/);if(!m)return '';
  const yy=Number(m[1]),mm=Number(m[2]),dd=Number(m[3]),now=new Date();
  let year=yy<=Number(String(now.getFullYear()).slice(-2))?2000+yy:1900+yy;
  if(mm<1||mm>12||dd<1||dd>31)return '';
  return String(year).padStart(4,'0')+'-'+String(mm).padStart(2,'0')+'-'+String(dd).padStart(2,'0');
}
function ageFromDob(v){if(!v)return '';const d=new Date(v+'T12:00:00'),n=new Date();if(Number.isNaN(d.getTime()))return '';let a=n.getFullYear()-d.getFullYear();const md=n.getMonth()-d.getMonth();if(md<0||(md===0&&n.getDate()<d.getDate()))a--;return a>=0&&a<120?String(a):''}
function parseOcrText(text){
  const up=String(text||'').toUpperCase();
  const curp=(up.match(/\b[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d\b/)||[])[0]||'';
  const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  let name='';
  for(let i=0;i<lines.length;i++){
    if(/^NOMBRE(S)?\b/i.test(lines[i])){name=lines[i].replace(/^NOMBRE(S)?\s*[:\-]?\s*/i,'').trim()||lines[i+1]||'';break}
  }
  return {curp,name,dob:curpDob(curp)};
}
function credentialExtra(){
  const saved=read('v100-credential-extra',{});
  return '<section class="v100-subblock" id="v100-credential-extra">'+sectionTitle('DATOS COMPLEMENTARIOS','Registro de credencial','Campos agregados debajo del generador existente. Revisa siempre los datos detectados antes de usarlos.')+
    '<div class="v100-form-grid">'+
      '<label><span>Fecha de nacimiento</span><input type="date" data-v100-dob value="'+esc(saved.dob||'')+'"></label>'+
      '<label><span>Edad</span><input type="text" data-v100-age readonly value="'+esc(saved.age||'')+'"></label>'+
      '<label><span>Ciudad / municipio</span><input type="text" data-v100-city placeholder="Municipio" value="'+esc(saved.city||'')+'"></label>'+
      '<label><span>Posición</span><select data-v100-position>'+['Portero','Defensa','Mediocampista','Delantero','Sin definir'].map(x=>'<option '+(saved.position===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
      '<label><span>Temporada</span><input type="text" data-v100-season value="'+esc(saved.season||'2026–2027')+'"></label>'+
      '<label><span>Estado</span><select data-v100-status>'+['Pendiente de validación','Revisado','Habilitado'].map(x=>'<option '+(saved.status===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
    '</div>'+
    '<div class="v100-actions"><button class="v100-primary" data-v100-credential-png>Descargar credencial PNG</button><button class="v100-secondary" data-v100-credential-share>Compartir credencial</button></div>'+
    '<p class="v100-note">La lectura OCR ayuda a capturar texto, pero no valida identidad, edad deportiva ni habilitación. La validación sigue siendo responsabilidad de la Liga.</p>'+
  '</section>';
}
function syncCredentialExtra(){
  const curp=$('[data-v64-cred-curp]')?.value||'',dob=$('[data-v100-dob]'),age=$('[data-v100-age]');
  if(dob&&!dob.value&&curpDob(curp))dob.value=curpDob(curp);if(age)age.value=ageFromDob(dob?.value||'');
  const d={dob:dob?.value||'',age:age?.value||'',city:$('[data-v100-city]')?.value||'',position:$('[data-v100-position]')?.value||'',season:$('[data-v100-season]')?.value||'',status:$('[data-v100-status]')?.value||''};write('v100-credential-extra',d);
}
async function credentialCanvas(){
  syncCredentialExtra();
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=760;const x=canvas.getContext('2d');
  const g=x.createLinearGradient(0,0,1200,760);g.addColorStop(0,'#04145f');g.addColorStop(.55,'#0a2e9c');g.addColorStop(1,'#07104d');x.fillStyle=g;x.fillRect(0,0,1200,760);
  x.strokeStyle='#19dbe9';x.lineWidth=5;x.strokeRect(28,28,1144,704);
  x.fillStyle='#fff';x.font='800 31px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS',70,90);x.fillStyle='#21e2f1';x.font='700 19px Arial';x.fillText('CREDENCIAL DE JUGADOR · 2026–2027',70,128);
  const img=$('[data-v64-photo-preview] img');if(img?.src){try{x.drawImage(img,72,180,310,390)}catch(e){}}
  x.strokeStyle='rgba(255,255,255,.35)';x.strokeRect(72,180,310,390);
  const name=$('[data-v64-cred-name]')?.value||'Jugador';const team=$('[data-v64-cred-team]')?.value||'Equipo';const cat=$('[data-v64-cred-cat]')?.value||'Categoría';const num=$('[data-v64-cred-number]')?.value||'0';const curp=$('[data-v64-cred-curp]')?.value||'';const e=read('v100-credential-extra',{});
  x.fillStyle='#fff';x.font='800 48px Arial';x.fillText(name.slice(0,30),430,235);x.fillStyle='#bceaf2';x.font='700 27px Arial';x.fillText((team+' · '+cat).slice(0,42),430,285);
  const rows=[['Número','#'+num],['Nacimiento',e.dob||'—'],['Edad',e.age?e.age+' años':'—'],['Municipio',e.city||'—'],['Posición',e.position||'—'],['Estado',e.status||'Pendiente de validación'],['CURP',curp?'•••• '+curp.slice(-4):'No capturada']];
  let y=355;rows.forEach(([k,v])=>{x.fillStyle='#6debf5';x.font='700 18px Arial';x.fillText(k.toUpperCase(),430,y);x.fillStyle='#fff';x.font='700 26px Arial';x.fillText(String(v).slice(0,42),430,y+32);y+=76});
  x.fillStyle='rgba(255,255,255,.7)';x.font='16px Arial';x.fillText('Generada localmente · Verificar contra documentos oficiales antes de validar.',72,690);
  return canvasBlob(canvas);
}
function bindCredential(root){
  const curp=$('[data-v64-cred-curp]');const dob=$('[data-v100-dob]',root);curp?.addEventListener('input',()=>{if(dob&&curpDob(curp.value))dob.value=curpDob(curp.value);syncCredentialExtra()});
  $$('input,select,textarea',root).forEach(el=>{el.addEventListener('input',syncCredentialExtra);el.addEventListener('change',syncCredentialExtra)});syncCredentialExtra();
  const imported=read('v100-ocr-import',null);if(imported){const out=$('[data-v64-ocr-text]'),name=$('[data-v64-cred-name]');if(out&&!out.value)out.value=imported.text||'';if(curp&&!curp.value)curp.value=imported.curp||'';if(name&&!name.value&&imported.name)name.value=imported.name;if(dob&&!dob.value&&imported.dob)dob.value=imported.dob;localStorage.removeItem('v100-ocr-import');syncCredentialExtra();toast('Lectura importada; revisa y corrige los datos')}
  $('[data-v64-ocr]')?.addEventListener('click',()=>{const poll=setInterval(()=>{const b=$('[data-v64-ocr]');if(!b||!b.disabled){clearInterval(poll);const txt=$('[data-v64-ocr-text]')?.value||'';const p=parseOcrText(txt);if(curp&&!curp.value&&p.curp)curp.value=p.curp;if(dob&&!dob.value&&p.dob)dob.value=p.dob;syncCredentialExtra()}},350);setTimeout(()=>clearInterval(poll),30000)});
  $('[data-v100-credential-png]',root)?.addEventListener('click',async()=>{const b=await credentialCanvas();if(b)download(b,'Credencial_Liga_Juventino.png')});
  $('[data-v100-credential-share]',root)?.addEventListener('click',async()=>{const b=await credentialCanvas();if(b)try{await fileShare(b,'Credencial_Liga_Juventino.png','Credencial Liga Juventino')}catch(e){}});
}

/* ---------- PIZARRA TÁCTICA AVANZADA ---------- */
const TACTIC_PRESETS={
  '4-4-2':[[50,91],[16,75],[38,76],[62,76],[84,75],[16,49],[38,50],[62,50],[84,49],[36,22],[64,22]],
  '4-3-3':[[50,91],[16,75],[38,76],[62,76],[84,75],[24,49],[50,52],[76,49],[20,21],[50,17],[80,21]],
  '3-5-2':[[50,91],[24,72],[50,76],[76,72],[11,48],[32,50],[50,43],[68,50],[89,48],[36,20],[64,20]]
};
function tacticsExtra(){const s=read('v100-tactics',{preset:'4-4-2',view:'2d',category:'Primera Fuerza',positions:TACTIC_PRESETS['4-4-2']});return '<section class="v100-subblock" id="v100-tactics-extra">'+sectionTitle('PIZARRA AVANZADA','Tablero táctico 2D / 3D','Arrastra jugadores con mouse o dedo. Todo se guarda localmente y no cambia alineaciones oficiales.')+
  '<div class="v100-tactic-controls"><select data-v100-tactic-category>'+['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'].map(x=>'<option '+(s.category===x?'selected':'')+'>'+x+'</option>').join('')+'</select>'+Object.keys(TACTIC_PRESETS).map(p=>'<button class="'+(s.preset===p?'active':'')+'" data-v100-preset="'+p+'">'+p+'</button>').join('')+'<button data-v100-view3d>'+(s.view==='3d'?'Vista 2D':'Vista 3D')+'</button></div>'+
  '<div class="v100-pitch '+(s.view==='3d'?'is-3d':'')+'" data-v100-pitch>'+Array.from({length:11},(_,i)=>{const pos=(s.positions||TACTIC_PRESETS[s.preset]||TACTIC_PRESETS['4-4-2'])[i]||[50,50];return '<button class="v100-player" style="left:'+pos[0]+'%;top:'+pos[1]+'%" data-v100-player="'+i+'">'+(i+1)+'</button>'}).join('')+'</div>'+
  '<div class="v100-actions"><button class="v100-primary" data-v100-save-tactic>Guardar</button><button class="v100-secondary" data-v100-tactic-png>Descargar PNG</button><button class="v100-secondary" data-v100-tactic-json>Descargar JSON</button></div></section>'}
function tacticState(root){return {preset:root.dataset.preset||read('v100-tactics',{}).preset||'4-4-2',view:$('[data-v100-pitch]',root)?.classList.contains('is-3d')?'3d':'2d',category:$('[data-v100-tactic-category]',root)?.value||'Primera Fuerza',positions:$$('[data-v100-player]',root).map(p=>[parseFloat(p.style.left),parseFloat(p.style.top)])}}
function bindTactics(root){
  root.dataset.preset=read('v100-tactics',{preset:'4-4-2'}).preset||'4-4-2';const pitch=$('[data-v100-pitch]',root);
  $$('[data-v100-preset]',root).forEach(b=>b.onclick=()=>{root.dataset.preset=b.dataset.v100Preset;$$('[data-v100-preset]',root).forEach(x=>x.classList.toggle('active',x===b));const ps=TACTIC_PRESETS[b.dataset.v100Preset];$$('[data-v100-player]',root).forEach((p,i)=>{p.style.left=ps[i][0]+'%';p.style.top=ps[i][1]+'%'});write('v100-tactics',tacticState(root))});
  $('[data-v100-view3d]',root).onclick=e=>{pitch.classList.toggle('is-3d');e.currentTarget.textContent=pitch.classList.contains('is-3d')?'Vista 2D':'Vista 3D';write('v100-tactics',tacticState(root))};
  $$('[data-v100-player]',root).forEach(p=>{p.addEventListener('pointerdown',e=>{e.preventDefault();p.setPointerCapture(e.pointerId);const move=ev=>{const r=pitch.getBoundingClientRect();let x=(ev.clientX-r.left)/r.width*100,y=(ev.clientY-r.top)/r.height*100;x=Math.max(4,Math.min(96,x));y=Math.max(4,Math.min(96,y));p.style.left=x+'%';p.style.top=y+'%'};const up=()=>{p.removeEventListener('pointermove',move);write('v100-tactics',tacticState(root))};p.addEventListener('pointermove',move);p.addEventListener('pointerup',up,{once:true});p.addEventListener('pointercancel',up,{once:true})})});
  $('[data-v100-save-tactic]',root).onclick=()=>{write('v100-tactics',tacticState(root));toast('Táctica guardada en este dispositivo')};
  $('[data-v100-tactic-json]',root).onclick=()=>download(new Blob([JSON.stringify(tacticState(root),null,2)],{type:'application/json'}),'Tactica_Liga_Juventino.json');
  $('[data-v100-tactic-png]',root).onclick=async()=>{const c=document.createElement('canvas');c.width=900;c.height=1300;const x=c.getContext('2d');x.fillStyle='#07582e';x.fillRect(0,0,c.width,c.height);x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=6;x.strokeRect(35,35,830,1230);x.beginPath();x.moveTo(35,650);x.lineTo(865,650);x.stroke();x.beginPath();x.arc(450,650,105,0,Math.PI*2);x.stroke();tacticState(root).positions.forEach((p,i)=>{const px=35+(p[0]/100)*830,py=35+(p[1]/100)*1230;x.fillStyle='#10277d';x.beginPath();x.arc(px,py,30,0,Math.PI*2);x.fill();x.strokeStyle='#fff';x.lineWidth=3;x.stroke();x.fillStyle='#fff';x.font='700 24px Arial';x.textAlign='center';x.fillText(String(i+1),px,py+8)});x.textAlign='left';x.fillStyle='#fff';x.font='800 34px Arial';x.fillText('LIGA JUVENTINO · '+tacticState(root).preset,45,1290);const b=await canvasBlob(c);download(b,'Tactica_Liga_Juventino.png')};
}

/* ---------- CLIMA: asistente informativo 24/48h ---------- */
const FIELD_COORDS={
  'cerrito de gasca':[20.60839,-100.93238],
  'san juan de la cruz':[20.63379,-100.911569],
  'santiago de cuenda':[20.59793,-100.99663],
  'san antonio de romerillo':[20.60784,-100.94854],
  'pozos':[20.61767,-100.90033],
  'rincon de centeno':[20.660153,-100.886766],
  'san jose de la montana':[20.60102,-101.07242],
  'san julian tierra blanca':[20.591403,-101.040358]
};
function weatherFieldOptions(){return $$('.v60-field-card').map(card=>{const name=$('.v60-field-top h3',card)?.textContent?.trim()||'';const community=$('.v60-field-top span',card)?.textContent?.trim()||'';const key=Object.keys(FIELD_COORDS).find(k=>norm(name+' '+community).includes(norm(k)));return key?{name,coord:FIELD_COORDS[key]}:null}).filter(Boolean)}
function weatherExtra(){const opts=weatherFieldOptions();const next=new Date(Date.now()+24*3600e3);next.setMinutes(0,0,0);const local=new Date(next.getTime()-next.getTimezoneOffset()*60000).toISOString().slice(0,16);return '<section class="v100-subblock" id="v100-weather-extra">'+sectionTitle('ASISTENTE DE CAMPO','Clima para la jornada','Analiza lluvia, probabilidad, temperatura y rachas. Es informativo: nunca cambia el estado oficial de un partido.')+
  '<div class="v100-form-grid"><label><span>Campo</span><select data-v100-weather-field>'+opts.map((o,i)=>'<option value="'+i+'">'+esc(o.name)+'</option>').join('')+'</select></label><label><span>Hora del partido</span><input type="datetime-local" data-v100-weather-time value="'+local+'"></label></div>'+
  '<div class="v100-actions"><button class="v100-primary" data-v100-weather-run>Analizar pronóstico</button><button class="v100-secondary" data-v100-weather-share disabled>Compartir aviso</button></div><div class="v100-weather-result" data-v100-weather-result><p>Selecciona campo y hora para consultar el pronóstico.</p></div></section>'}
async function runWeather(root){const opts=weatherFieldOptions();const idx=Number($('[data-v100-weather-field]',root)?.value||0),f=opts[idx],time=$('[data-v100-weather-time]',root)?.value,out=$('[data-v100-weather-result]',root),share=$('[data-v100-weather-share]',root);if(!f||!time)return toast('Selecciona un campo y la hora del partido');out.innerHTML='<p>Consultando pronóstico…</p>';share.disabled=true;try{const [lat,lon]=f.coord;const u='https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&hourly=precipitation_probability,precipitation,temperature_2m,wind_gusts_10m&forecast_days=3&timezone=America/Mexico_City';const j=await fetch(u).then(r=>{if(!r.ok)throw new Error('weather');return r.json()});const h=j.hourly||{},times=h.time||[],target=new Date(time).getTime();let ni=0,best=Infinity;times.forEach((t,i)=>{const d=Math.abs(new Date(t).getTime()-target);if(d<best){best=d;ni=i}});const now=Date.now();const next24=times.map((t,i)=>[new Date(t).getTime(),Number(h.precipitation?.[i]||0)]).filter(([t])=>t>=now&&t<=now+24*3600e3).reduce((a,x)=>a+x[1],0);const next48=times.map((t,i)=>[new Date(t).getTime(),Number(h.precipitation?.[i]||0)]).filter(([t])=>t>=now&&t<=now+48*3600e3).reduce((a,x)=>a+x[1],0);const prob=Number(h.precipitation_probability?.[ni]||0),rain=Number(h.precipitation?.[ni]||0),temp=Number(h.temperature_2m?.[ni]||0),gust=Number(h.wind_gusts_10m?.[ni]||0);let label='ALTA PROBABILIDAD DE JUGAR',level='good',reason='El pronóstico horario no muestra señales meteorológicas fuertes en los indicadores consultados.';if(prob>=60||rain>=3||gust>=60){label='RIESGO METEOROLÓGICO ALTO';level='bad';reason='Hay lluvia, probabilidad o rachas elevadas; conviene revisar terreno y comunicado oficial.'}else if(prob>=35||rain>=1||gust>=45){label='CONDICIONES A VIGILAR';level='watch';reason='Hay indicadores moderados; revisa el campo más cerca de la hora del partido.'}const text=f.name+' · '+label+' · 24 h '+next24.toFixed(1)+' mm · 48 h '+next48.toFixed(1)+' mm · '+prob+'% a la hora · '+rain.toFixed(1)+' mm/h · '+Math.round(temp)+' °C · rachas '+Math.round(gust)+' km/h. Pronóstico informativo; la decisión oficial corresponde a la Liga.';root.dataset.weatherShare=text;out.innerHTML='<div class="v100-weather-badge '+level+'">'+label+'</div><div class="v100-weather-grid"><span><b>'+next24.toFixed(1)+' mm</b><small>Lluvia 24 h</small></span><span><b>'+next48.toFixed(1)+' mm</b><small>Lluvia 48 h</small></span><span><b>'+Math.round(prob)+'%</b><small>Prob. a la hora</small></span><span><b>'+rain.toFixed(1)+' mm/h</b><small>Intensidad</small></span><span><b>'+Math.round(temp)+' °C</b><small>Temperatura</small></span><span><b>'+Math.round(gust)+' km/h</b><small>Racha</small></span></div><p>'+esc(reason)+'</p><small>Pronóstico meteorológico ≠ estado del terreno ≠ decisión oficial.</small>';share.disabled=false}catch(e){out.innerHTML='<p>No se pudo consultar el pronóstico en este momento.</p>'}}
function bindWeather(root){$('[data-v100-weather-run]',root)?.addEventListener('click',()=>runWeather(root));$('[data-v100-weather-share]',root)?.addEventListener('click',async()=>{const text=root.dataset.weatherShare||'';if(!text)return;try{if(navigator.share)await navigator.share({title:'Clima · Liga Juventino',text});else{await navigator.clipboard.writeText(text);toast('Aviso copiado')}}catch(e){}})}

/* ---------- PUBLICACIONES: boletín PNG ---------- */
function publicationExtra(){return '<section class="v100-subblock" id="v100-publication-extra">'+sectionTitle('IMÁGENES','Boletín de jornada','Convierte el texto que ya tienes en una imagen PNG sin alterar publicaciones existentes.')+'<div class="v100-actions"><button class="v100-primary" data-v100-bulletin-png>Descargar imagen PNG</button><button class="v100-secondary" data-v100-bulletin-share>Compartir PNG</button></div></section>'}
function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines=28){let lines=0;for(const para of String(text).split('\n')){const words=para.split(/\s+/);let line='';for(const w of words){const test=line?line+' '+w:w;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;lines++;line=w;if(lines>=maxLines)return y}else line=test}if(line){ctx.fillText(line,x,y);y+=lineHeight;lines++}y+=8;if(lines>=maxLines)return y}return y}
async function bulletinBlob(){const text=$('[data-v60-share-text]')?.textContent?.trim()||'Liga Municipal de Fútbol Juventino Rosas';const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#02095c');g.addColorStop(.55,'#073aa9');g.addColorStop(1,'#02064d');x.fillStyle=g;x.fillRect(0,0,1080,1350);x.strokeStyle='#18ddea';x.lineWidth=5;x.strokeRect(50,50,980,1250);x.fillStyle='#5cecf3';x.font='800 24px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS',90,125);x.fillStyle='#fff';x.font='900 62px Arial';x.fillText('JORNADA',90,215);x.font='700 31px Arial';wrapText(x,text,90,305,900,48,19);x.fillStyle='rgba(255,255,255,.7)';x.font='22px Arial';x.fillText('Información generada desde la app de la Liga',90,1260);return canvasBlob(c)}
function bindPublication(root){$('[data-v100-bulletin-png]',root).onclick=async()=>{const b=await bulletinBlob();download(b,'Jornada_Liga_Juventino.png')};$('[data-v100-bulletin-share]',root).onclick=async()=>{const b=await bulletinBlob();try{await fileShare(b,'Jornada_Liga_Juventino.png','Jornada Liga Juventino')}catch(e){}}}

/* ---------- PARTIDO: recordatorio local y cédula ---------- */
function matchExtra(){const h=$('.screen-title')?.textContent?.trim().replace(/\s+/g,' ')||'Partido de la Liga';const meta=$('.match-detail .muted.tiny')?.textContent?.trim()||'';return '<section class="v100-subblock" id="v100-match-extra">'+sectionTitle('PARTIDO','Acciones rápidas','Se agregan al final de Ver detalles.')+'<div class="v100-form-grid"><label><span>Fecha y hora para recordar</span><input type="datetime-local" data-v100-reminder-time></label><label><span>Partido / sede</span><input type="text" data-v100-reminder-title value="'+esc(h)+'" data-meta="'+esc(meta)+'"></label></div><div class="v100-actions"><button class="v100-primary" data-v100-ics>Recordar · calendario</button><button class="v100-secondary" data-v100-route="cedulas">Cédula oficial</button><button class="v100-secondary" data-v100-route="weatherFields">Clima y campo</button></div></section>'}
function icsDate(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
function bindMatch(root){$('[data-v100-ics]',root).onclick=()=>{const v=$('[data-v100-reminder-time]',root).value;if(!v)return toast('Selecciona fecha y hora');const start=new Date(v),end=new Date(start.getTime()+120*60000),title=$('[data-v100-reminder-title]',root).value||'Partido Liga Juventino';const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino//App//ES','BEGIN:VEVENT','UID:'+Date.now()+'@ligajuventino','DTSTAMP:'+icsDate(new Date()),'DTSTART:'+icsDate(start),'DTEND:'+icsDate(end),'SUMMARY:'+title.replace(/[,;]/g,' '),'DESCRIPTION:Recordatorio creado desde la app Liga Juventino Rosas','END:VEVENT','END:VCALENDAR'].join('\r\n');download(new Blob([ics],{type:'text/calendar;charset=utf-8'}),'Partido_Liga_Juventino.ics')}}

/* ---------- MODALES / herramientas locales ---------- */
let installPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});
function modal(html,cls=''){let m=$('.v100-modal');if(m)m.remove();m=document.createElement('div');m.className='v100-modal '+cls;m.innerHTML='<div class="v100-modal-card"><button class="v100-modal-close" aria-label="Cerrar">×</button>'+html+'</div>';document.body.appendChild(m);$('.v100-modal-close',m).onclick=()=>m.remove();m.addEventListener('click',e=>{if(e.target===m)m.remove()});return m}
function loadTesseract(){if(window.Tesseract)return Promise.resolve(window.Tesseract);return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=()=>resolve(window.Tesseract);s.onerror=reject;document.head.appendChild(s)})}
function whatsappOcr(){const m=modal(sectionTitle('OCR LOCAL','Importar imagen de WhatsApp','Selecciona una foto que ya guardaste desde WhatsApp. La lectura ocurre en este dispositivo.')+'<label class="v100-file"><span>Imagen</span><input type="file" accept="image/*" data-v100-wa-file></label><div class="v100-actions"><button class="v100-primary" data-v100-wa-read>Leer imagen</button></div><div class="v100-modal-result" data-v100-wa-result></div>');$('[data-v100-wa-read]',m).onclick=async e=>{const f=$('[data-v100-wa-file]',m).files?.[0],out=$('[data-v100-wa-result]',m);if(!f)return toast('Selecciona una imagen');e.currentTarget.disabled=true;out.textContent='Leyendo imagen…';try{const T=await loadTesseract(),r=await T.recognize(f,'spa'),text=r?.data?.text||'',p=parseOcrText(text);write('v100-ocr-import',{text,...p});out.innerHTML='<b>Lectura terminada</b><p>'+esc(text.slice(0,600))+'</p><button class="v100-primary" data-v100-open-credential>Continuar a credencial</button>';$('[data-v100-open-credential]',m).onclick=()=>{m.remove();go('credentialBuilder')}}catch(err){out.textContent='No se pudo leer la imagen. Puedes capturar los datos manualmente.'}finally{e.currentTarget.disabled=false}}}
function delegates(){const list=read('v100-delegates',[]);const render=()=>{const host=$('[data-v100-delegate-list]',m);host.innerHTML=list.length?list.map((d,i)=>'<article><span><b>'+esc(d.name)+'</b><small>'+esc(d.team)+'</small></span><div><a href="tel:'+esc(d.phone)+'">Llamar</a><a target="_blank" rel="noopener" href="https://wa.me/'+esc(String(d.phone).replace(/\D/g,''))+'">WhatsApp</a><button data-del="'+i+'">×</button></div></article>').join(''):'<p>No hay contactos guardados en este dispositivo.</p>';$$('[data-del]',host).forEach(b=>b.onclick=()=>{list.splice(Number(b.dataset.del),1);write('v100-delegates',list);render()})};const m=modal(sectionTitle('SOLO EN ESTE DISPOSITIVO','Directorio de delegados','Los teléfonos que agregues aquí no se publican ni se guardan en GitHub.')+'<div class="v100-form-grid"><label><span>Nombre</span><input data-v100-del-name></label><label><span>Equipo</span><input data-v100-del-team></label><label><span>Teléfono</span><input data-v100-del-phone inputmode="tel"></label></div><div class="v100-actions"><button class="v100-primary" data-v100-del-add>Agregar</button></div><div class="v100-delegate-list" data-v100-delegate-list></div>');render();$('[data-v100-del-add]',m).onclick=()=>{const name=$('[data-v100-del-name]',m).value.trim(),team=$('[data-v100-del-team]',m).value.trim(),phone=$('[data-v100-del-phone]',m).value.trim();if(!name||!phone)return toast('Agrega nombre y teléfono');list.push({name,team,phone});write('v100-delegates',list);render()}}
function fanzone(){const p=read('v100-fan-pulse',{fire:0,goal:0,clap:0,heart:0});const m=modal(sectionTitle('FAN ZONE','Pulso de la afición','Reacciones locales; no representan una encuesta oficial.')+'<div class="v100-big-reactions"><button data-r="fire">🔥 <b>'+p.fire+'</b></button><button data-r="goal">⚽ <b>'+p.goal+'</b></button><button data-r="clap">👏 <b>'+p.clap+'</b></button><button data-r="heart">💙 <b>'+p.heart+'</b></button></div>');$$('[data-r]',m).forEach(b=>b.onclick=()=>{p[b.dataset.r]=(p[b.dataset.r]||0)+1;write('v100-fan-pulse',p);b.querySelector('b').textContent=p[b.dataset.r]})}
function journeySim(){const teams=officialTeams();const opts=teams.map(t=>'<option>'+esc(t.name)+'</option>').join('');const m=modal(sectionTitle('ESCENARIO LOCAL','Simulador de jornada','Prueba un marcador hipotético. No modifica resultados ni tablas oficiales.')+'<div class="v100-form-grid"><label><span>Local</span><select data-js-home>'+opts+'</select></label><label><span>Visitante</span><select data-js-away>'+opts+'</select></label><label><span>Goles local</span><input type="number" min="0" max="30" value="0" data-js-hg></label><label><span>Goles visitante</span><input type="number" min="0" max="30" value="0" data-js-ag></label></div><div class="v100-actions"><button class="v100-primary" data-js-save>Guardar escenario</button></div><div data-js-list></div>');const render=()=>{const list=read('v100-journey-sim',[]),h=$('[data-js-list]',m);h.innerHTML=list.length?'<div class="v100-sim-list">'+list.map((x,i)=>'<article><span><b>'+esc(x.home)+' '+x.hg+'–'+x.ag+' '+esc(x.away)+'</b><small>Escenario hipotético</small></span><button data-js-del="'+i+'">Quitar</button></article>').join('')+'</div>':'<p class="v100-note">Sin escenarios guardados.</p>';$$('[data-js-del]',h).forEach(b=>b.onclick=()=>{list.splice(Number(b.dataset.jsDel),1);write('v100-journey-sim',list);render()})};render();$('[data-js-save]',m).onclick=()=>{const x={home:$('[data-js-home]',m).value,away:$('[data-js-away]',m).value,hg:Number($('[data-js-hg]',m).value||0),ag:Number($('[data-js-ag]',m).value||0)};if(x.home===x.away)return toast('Elige dos equipos distintos');const list=read('v100-journey-sim',[]);list.push(x);write('v100-journey-sim',list);render()}}
function shotmap(){const shots=read('v100-shotmap',[]);const m=modal(sectionTitle('ANÁLISIS LOCAL','Shot Map','Toca la cancha para registrar tiros. Se guarda solo en este dispositivo.')+'<div class="v100-shot-pitch" data-shot-pitch></div><div class="v100-actions"><button class="v100-secondary" data-shot-undo>Deshacer</button><button class="v100-secondary" data-shot-clear>Limpiar</button><button class="v100-primary" data-shot-png>PNG</button><button class="v100-secondary" data-shot-json>JSON</button></div>','v100-shot-modal');const pitch=$('[data-shot-pitch]',m);const render=()=>{pitch.innerHTML=shots.map((s,i)=>'<i style="left:'+s.x+'%;top:'+s.y+'%" title="Tiro '+(i+1)+'"></i>').join('')};render();pitch.onclick=e=>{const r=pitch.getBoundingClientRect();shots.push({x:+(((e.clientX-r.left)/r.width)*100).toFixed(1),y:+(((e.clientY-r.top)/r.height)*100).toFixed(1),at:new Date().toISOString()});write('v100-shotmap',shots);render()};$('[data-shot-undo]',m).onclick=()=>{shots.pop();write('v100-shotmap',shots);render()};$('[data-shot-clear]',m).onclick=()=>{shots.splice(0);write('v100-shotmap',shots);render()};$('[data-shot-json]',m).onclick=()=>download(new Blob([JSON.stringify(shots,null,2)],{type:'application/json'}),'Shot_Map_Liga.json');$('[data-shot-png]',m).onclick=async()=>{const c=document.createElement('canvas');c.width=900;c.height=1300;const x=c.getContext('2d');x.fillStyle='#07582e';x.fillRect(0,0,900,1300);x.strokeStyle='#fff';x.lineWidth=6;x.strokeRect(35,35,830,1230);x.beginPath();x.moveTo(35,650);x.lineTo(865,650);x.stroke();shots.forEach((s,i)=>{x.fillStyle='#ffe369';x.beginPath();x.arc(35+s.x/100*830,35+s.y/100*1230,18,0,Math.PI*2);x.fill();x.fillStyle='#07104d';x.font='700 16px Arial';x.textAlign='center';x.fillText(String(i+1),35+s.x/100*830,41+s.y/100*1230)});const b=await canvasBlob(c);download(b,'Shot_Map_Liga.png')}}
async function installApp(){if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return}modal(sectionTitle('INSTALAR APP','Liga Juventino','Si el navegador permite instalación, usa el menú de Chrome → “Instalar aplicación” o “Agregar a pantalla de inicio”.')+'<p class="v100-note">No se muestra un botón de “APK real” porque este repositorio no contiene actualmente un archivo .apk publicado. Así evitamos ofrecer una descarga falsa.</p>')}

function handleAction(action){if(action==='whatsapp-ocr')whatsappOcr();else if(action==='delegates')delegates();else if(action==='fanzone')fanzone();else if(action==='journey-sim')journeySim();else if(action==='shotmap')shotmap();else if(action==='install-app')installApp()}
function bindGeneric(root){$$('[data-v100-route]',root).forEach(b=>b.onclick=()=>go(b.dataset.v100Route));$$('[data-v100-action]',root).forEach(b=>b.onclick=()=>handleAction(b.dataset.v100Action))}

function mount(){
  const screen=$('#screen');if(!screen)return;const r=route();
  if(r==='home'){const old=$('#v100-home-extra',screen);if(old&&Number(old.dataset.v100TeamCount||0)===0&&officialTeams().length)old.remove();if(!$('#v100-home-extra',screen)){screen.insertAdjacentHTML('beforeend',homeExtra());const n=$('#v100-home-extra',screen);bindGeneric(n);bindHome(n)}}
  if(r==='more'&&!$('#v100-more-extra',screen)){screen.insertAdjacentHTML('beforeend',toolsExtra('v100-more-extra'));bindGeneric($('#v100-more-extra',screen))}
  if(r==='leagueTools'&&!$('#v100-league-tools-extra',screen)){screen.insertAdjacentHTML('beforeend',toolsExtra('v100-league-tools-extra'));bindGeneric($('#v100-league-tools-extra',screen))}
  if(r==='credentialBuilder'&&!$('#v100-credential-extra',screen)){screen.insertAdjacentHTML('beforeend',credentialExtra());const n=$('#v100-credential-extra',screen);bindGeneric(n);bindCredential(n)}
  if(r==='tactics'&&!$('#v100-tactics-extra',screen)){screen.insertAdjacentHTML('beforeend',tacticsExtra());const n=$('#v100-tactics-extra',screen);bindGeneric(n);bindTactics(n)}
  if(r==='weatherFields'&&!$('#v100-weather-extra',screen)){screen.insertAdjacentHTML('beforeend',weatherExtra());const n=$('#v100-weather-extra',screen);bindGeneric(n);bindWeather(n)}
  if(r==='publications'&&!$('#v100-publication-extra',screen)){screen.insertAdjacentHTML('beforeend',publicationExtra());const n=$('#v100-publication-extra',screen);bindGeneric(n);bindPublication(n)}
  if(r==='match'&&!$('#v100-match-extra',screen)){screen.insertAdjacentHTML('beforeend',matchExtra());const n=$('#v100-match-extra',screen);bindGeneric(n);bindMatch(n)}
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(mount,80)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
window.addEventListener('load',schedule);schedule();setTimeout(schedule,1500);setTimeout(schedule,4000);
window.LJR_V100={build:BUILD,mount,officialTeams};
})();
