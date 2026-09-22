/* V100 — Funciones aditivas desde “Apps falta”.
   Regla: no sustituye, mueve ni rediseña pantallas existentes. Solo agrega bloques al final.
   Datos privados capturados en estas herramientas se guardan únicamente en localStorage. */
(function(){
'use strict';

if(window.__LJR_V100_ADDITIVE__) return;
window.__LJR_V100_ADDITIVE__=true;

const BUILD='20260922-fanzone-touch-fix-v158';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>location.hash.replace(/^#\//,'').split('?')[0]||'home';
const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const FAN_STORE='lj-fanzone-one-vote-v157';
const FAN_KEYS=['fire','goal','clap','heart'];
function fanHash(v){
  let h=2166136261;
  for(const ch of String(v||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return (h>>>0).toString(36);
}
function fanVisitorId(){
  let id=localStorage.getItem('lj-fanzone-visitor-id-v157');
  if(!id){
    id=(window.crypto&&crypto.randomUUID?crypto.randomUUID():('v-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)));
    localStorage.setItem('lj-fanzone-visitor-id-v157',id);
  }
  return 'visitor:'+id;
}
function fanProfileKey(){
  const user=read('lj-store-v3',{})?.user;
  if(!user)return '';
  const raw=user.uid||user.id||user.email||user.name||'';
  return raw?'profile:'+fanHash(String(raw).trim().toLowerCase()):'';
}
function fanLoad(){
  let z=read(FAN_STORE,null);
  if(!z||typeof z!=='object'||!z.counts||!z.votes){
    const a=read('v100-fan-pulse',{fire:0,goal:0,clap:0,heart:0});
    const b=read('v105-fanzone',{gol:0,liga:0,aplauso:0,fuego:0});
    z={version:157,counts:{
      fire:Math.max(Number(a.fire||0),Number(b.fuego||0)),
      goal:Math.max(Number(a.goal||0),Number(b.gol||0)),
      clap:Math.max(Number(a.clap||0),Number(b.aplauso||0)),
      heart:Math.max(Number(a.heart||0),Number(b.liga||0))
    },votes:{}};
    write(FAN_STORE,z);
  }
  FAN_KEYS.forEach(k=>z.counts[k]=Math.max(0,Number(z.counts[k]||0)));
  return z;
}
function fanMirror(z){
  write(FAN_STORE,z);
  write('v100-fan-pulse',{fire:z.counts.fire,goal:z.counts.goal,clap:z.counts.clap,heart:z.counts.heart});
  write('v105-fanzone',{gol:z.counts.goal,liga:z.counts.heart,aplauso:z.counts.clap,fuego:z.counts.fire});
}
function fanIdentity(z){
  const visitor=fanVisitorId(),profile=fanProfileKey();
  if(profile&&z&&z.votes&&z.votes[visitor]&&!z.votes[profile]){
    z.votes[profile]=z.votes[visitor];
    delete z.votes[visitor];
    fanMirror(z);
  }
  return profile||visitor;
}
function fanSnapshot(){
  const z=fanLoad(),id=fanIdentity(z);
  return {counts:Object.assign({},z.counts),choice:z.votes[id]||'',identity:id,profile:id.indexOf('profile:')===0};
}
function fanVote(next){
  if(!FAN_KEYS.includes(next))return {ok:false};
  const z=fanLoad(),id=fanIdentity(z),prev=z.votes[id]||'';
  if(prev===next){
    const same=fanSnapshot();
    return Object.assign({ok:true,same:true,previous:prev},same);
  }
  if(prev&&FAN_KEYS.includes(prev))z.counts[prev]=Math.max(0,Number(z.counts[prev]||0)-1);
  z.counts[next]=Number(z.counts[next]||0)+1;
  z.votes[id]=next;
  fanMirror(z);
  const snap=fanSnapshot();
  return Object.assign({ok:true,same:false,previous:prev},snap);
}
function fanRenderButtons(root,selector,attr){
  const snap=fanSnapshot();
  Array.from((root||document).querySelectorAll(selector)).forEach(b=>{
    const k=b.dataset[attr];
    const n=b.querySelector('b');if(n)n.textContent=Number(snap.counts[k]||0);
    b.classList.toggle('is-selected',snap.choice===k);
    b.setAttribute('aria-pressed',snap.choice===k?'true':'false');
  });
  const status=$('[data-fan-status]',root);
  if(status)status.textContent=snap.choice
    ?'Tu reacción ya está registrada. Puedes cambiarla sin sumar otro voto.'
    :(snap.profile?'Perfil registrado: puedes elegir una sola reacción.':'Visitante: puedes elegir una sola reacción en este dispositivo.');
  return snap;
}
window.LJR_FAN_ZONE_ONE_VOTE={snapshot:fanSnapshot,vote:fanVote,render:fanRenderButtons};
function fanDelegatedTap(e){
  const b=e.target.closest?.('[data-v100-react]');
  if(!b)return;
  const root=b.closest('#v100-home-extra')||document;
  if(b.dataset.fanHandled==='1')return;
  const k=b.dataset.v100React;
  if(!FAN_KEYS.includes(k))return;
  const r=fanVote(k);
  fanRenderButtons(root,'[data-v100-react]','v100React');
  toast(r.same?'Ya registraste esa reacción':(r.previous?'Reacción cambiada · sigue contando como un solo voto':'Reacción registrada · 1 por visitante/perfil'));
}
if(!window.__LJR_FAN_DELEGATED_V158__){
  window.__LJR_FAN_DELEGATED_V158__=true;
  document.addEventListener('click',fanDelegatedTap);
}



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

const V100_FALLBACK_TEAMS={
  '1':{category:'Veteranos 50+',teams:['La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Boavista','Manchester']},
  '2':{category:'Veteranos 35+',teams:['C. de Gasca','Juventus','Cuenda','Pozos FC','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán']},
  '3':{category:'Primera Fuerza',teams:['Hermanos','San José FC','Linces','Juventus','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas']},
  '4':{category:'Segunda Fuerza',teams:['Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata']},
  '5':{category:'Intermedia',teams:['La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta']}
};
function officialTeams(){
  const out=[];
  try{
    const list=window.V66_OFFICIAL_DIRECTORY?.teamList?.();
    if(Array.isArray(list)&&list.length)list.forEach(x=>out.push({name:x.name,category:x.category||'',cat:String(x.cat||'')}));
  }catch(e){}
  const db=window.LJR_OFFICIAL_DATA||{};
  Object.entries(db.categories||{}).forEach(([id,c])=>{
    const names=new Set();
    (c.standings||[]).forEach(group=>(group.rows||[]).forEach(r=>r?.[1]&&names.add(String(r[1]).trim())));
    Object.keys(c.rosters||{}).forEach(n=>names.add(n));
    (c.fixtures||[]).forEach(group=>(group.rows||[]).forEach(r=>{if(r?.[2])names.add(String(r[2]).trim());if(r?.[6])names.add(String(r[6]).trim())}));
    names.forEach(name=>out.push({name,category:c.name||V100_FALLBACK_TEAMS[id]?.category||'',cat:String(id)}));
  });
  for(const [id,g] of Object.entries(V100_FALLBACK_TEAMS))for(const name of g.teams)out.push({name,category:g.category,cat:id});
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
  const fan=fanSnapshot(); const pulse=fan.counts;
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
    '<div class="v100-pulse"><div><small>FAN ZONE</small><b>Pulso de la afición</b><span>Una reacción por visitante o perfil registrado.</span><em class="v100-fan-rule" data-fan-status></em></div><div class="v100-reactions">'+
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
  Array.from(root.querySelectorAll('[data-v100-react]')).forEach(b=>{b.dataset.fanHandled='1';b.onclick=()=>{const k=b.dataset.v100React,r=fanVote(k);fanRenderButtons(root,'[data-v100-react]','v100React');toast(r.same?'Ya registraste esa reacción':(r.previous?'Reacción cambiada · sigue contando como un solo voto':'Reacción registrada · 1 por visitante/perfil'))}});fanRenderButtons(root,'[data-v100-react]','v100React');
}

/* ---------- MÁS / HERRAMIENTAS: únicamente anexado al final ---------- */
function toolsExtra(id='v100-more-extra'){
  return '<section class="v100-block v100-tools-block" id="'+id+'">'+sectionTitle('FUNCIONES ADICIONALES','Más herramientas','Se agregan debajo de lo que ya existe; no sustituyen ninguna sección.')+
    '<div class="v100-tools-grid">'+
      button('🪪','Registro de jugadores','OCR, temporada, revisión y credencial','', 'credentialBuilder')+
      button('📷','Importar desde WhatsApp','Lee una imagen guardada con OCR','whatsapp-ocr')+
      button('🗓️','JR Matchday+','Checklist y operación de jornada','', 'matchday')+
      button('🧠','Simulador de jornada','Escenario local; no cambia resultados','journey-sim')+
      button('🧩','Pizarra táctica avanzada','2D/3D, arrastrar, JSON y PNG','', 'tactics')+
      button('🎯','Shot Map','Mapa de tiros guardado localmente','shotmap')+
      button('📣','Fan Zone','Reacciones rápidas de la afición','fanzone')+
      button('📇','Directorio de delegados','Contactos guardados solo en tu equipo','delegates')+
      button('📲','Instalar app','Instalar la PWA en este dispositivo','install-app')+
      button('📁','Historia','Temporadas, campeones y archivo','', 'history')+
      button('📊','Match Center','Partido oficial, marcador y cronología','', 'v4-matchcenter')+
      button('🖼️','Boletín PNG','Crear imagen lista para compartir','', 'publications')+
    '</div>'+
    '<p class="v100-note">El OCR funciona en el navegador con Tesseract.js. No es la API de Google Lens y las imágenes no se suben a GitHub.</p>'+
  '</section>';
}

function inlineTool(icon,title,sub,action,routeName){
  return '<button type="button" class="v60-tool-card v100-inline-tool" data-v100-inline-tool="1" '+(routeName?'data-v100-route="'+esc(routeName)+'"':'data-v100-action="'+esc(action)+'"')+'><span class="v100-inline-emoji" aria-hidden="true">'+icon+'</span><span><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span></button>';
}
function toolsInline(){
  return '<div class="v100-inline-tools-title"><small>FUNCIONES ADICIONALES</small><strong>Más herramientas</strong><span>Funciones de la app verde adaptadas al diseño azul y colocadas aquí, no en “Más”.</span></div>'+
  [
    inlineTool('🌦️','Clima inteligente del partido','Pronóstico, terreno y decisión oficial','', 'weatherFields'),
    inlineTool('⏱️','Centro de jornada','Tiempo cronológico y operación del día','', 'matchday'),
    inlineTool('🧩','Pizarra táctica 3D','Tablero táctil 2D/3D, JSON y PNG','', 'tactics'),
    inlineTool('📺','Modo TV','Partido, tabla y datos oficiales','tv-mode'),
    inlineTool('📁','Historia','Temporadas, palmarés y archivo','', 'history'),
    inlineTool('📊','Match Center','Partido oficial, marcador y cronología','', 'v4-matchcenter'),
    inlineTool('🔔','Registrarse y recibir avisos','Categoría y equipo favorito','register-alerts'),
    inlineTool('🗓️','Programar partido','Borrador local de fecha, hora y cancha','schedule-match'),
    inlineTool('🟥','Nueva sanción','Borrador disciplinario local','new-sanction'),
    inlineTool('🪪','Registro de jugadores','OCR, temporada y credencial','', 'credentialBuilder'),
    inlineTool('📷','Importar desde WhatsApp','Leer imagen guardada','whatsapp-ocr'),
    inlineTool('🧠','Simulador de jornada','Escenario local','journey-sim'),
    inlineTool('🎯','Shot Map','Mapa de tiros local','shotmap'),
    inlineTool('📣','Fan Zone','Reacciones de afición','fanzone'),
    inlineTool('📇','Directorio de delegados','Contactos locales','delegates'),
    inlineTool('📲','Instalar app','PWA en este dispositivo','install-app'),
    inlineTool('🖼️','Boletín PNG','Imagen para compartir','', 'publications')
  ].join('');
}

/* ---------- CREDENCIAL OCR: campos extra y exportación ---------- */
function curpDob(curp){
  const c=String(curp||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  const m=c.match(/^[A-Z]{4}(\d{2})(\d{2})(\d{2})/);if(!m)return '';
  const yy=Number(m[1]),mm=Number(m[2]),dd=Number(m[3]);
  if(mm<1||mm>12||dd<1||dd>31)return '';
  const now=new Date(),currentYear=now.getFullYear();
  let year=(/[A-Z]/.test(c.charAt(16))?2000:1900)+yy;
  if(year>currentYear)year-=100;
  if(currentYear-year>120)year+=100;
  const test=new Date(year,mm-1,dd);
  if(test.getFullYear()!==year||test.getMonth()!==mm-1||test.getDate()!==dd||test>now)return '';
  return String(year).padStart(4,'0')+'-'+String(mm).padStart(2,'0')+'-'+String(dd).padStart(2,'0');
}
function ageFromDob(v){if(!v)return '';const d=new Date(v+'T12:00:00'),n=new Date();if(Number.isNaN(d.getTime()))return '';let a=n.getFullYear()-d.getFullYear();const md=n.getMonth()-d.getMonth();if(md<0||(md===0&&n.getDate()<d.getDate()))a--;return a>=0&&a<120?String(a):''}
function ocrValueAfter(lines,re){
  for(let i=0;i<lines.length;i++){
    if(!re.test(lines[i]))continue;
    const same=lines[i].replace(re,'').replace(/^\s*[:\-]\s*/,'').trim();
    if(same&&same.length>2)return same;
    const next=lines[i+1]||'';
    if(next&&!/^(NOMBRE|APELLIDO|DOMICILIO|CURP|CLAVE|FECHA|SEXO|MUNICIPIO|LOCALIDAD|CIUDAD|COMUNIDAD|ENTIDAD|SECCION|VIGENCIA)\b/i.test(next))return next;
  }
  return '';
}
function ocrExplicitDob(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  const i=lines.findIndex(x=>/FECHA\s+(DE\s+)?NACIMIENTO|NACIMIENTO/i.test(x));
  const sample=i>=0?[lines[i],lines[i+1]||''].join(' '):String(text||'');
  const m=sample.match(/\b(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})\b/);if(!m)return '';
  let y=Number(m[3]);const mo=Number(m[2]),d=Number(m[1]);
  if(y<100)y=(y<=Number(String(new Date().getFullYear()).slice(-2))?2000:1900)+y;
  const test=new Date(y,mo-1,d);
  if(test.getFullYear()!==y||test.getMonth()!==mo-1||test.getDate()!==d)return '';
  return String(y).padStart(4,'0')+'-'+String(mo).padStart(2,'0')+'-'+String(d).padStart(2,'0');
}
function v100KnownPlaceFromText(text){
  const normalized=String(text||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/0/g,'O');
  const compact=normalized.replace(/[^A-ZÑ]/g,'');
  const known=[
    ['SANTACRUZDEJUVENTINOROSAS','Santa Cruz de Juventino Rosas'],
    ['JUVENTINOROSAS','Juventino Rosas'],
    ['CELAYA','Celaya'],['COMONFORT','Comonfort'],['CORTAZAR','Cortázar'],['VILLAGRAN','Villagrán'],['SALAMANCA','Salamanca'],
    ['RINCONDECENTENO','Rincón de Centeno'],['CERRITODEGASCA','Cerrito de Gasca'],
    ['FRANCOTAVERA','Franco Tavera'],['TAVERA','Tavera'],['SANJUANDELACRUZ','San Juan de la Cruz'],
    ['SANTIAGODECUENDA','Santiago de Cuenda'],['SANANTONIODEROMERILLO','San Antonio de Romerillo'],
    ['ROMERILLO','San Antonio de Romerillo'],['FRACCIONAMIENTOCOMONTUOSO','Fraccionamiento Comontuoso'],['COMONTUOSO','Comontuoso'],
    ['POZOS','Pozos'],['SANJOSEDELAMONTANA','San José de la Montaña'],['SANJULIANTIERRABLANCA','San Julián Tierra Blanca'],
    ['RINCONDEPARRA','Rincón de Parra'],['VALENCIADEFUERA','Valencia de Fuera']
  ];
  const hit=known.find(([k])=>compact.includes(k));if(hit)return hit[1];
  const nearGto=normalized.match(/([A-ZÑ ]{4,45})\s*,?\s*GTO\b/);
  if(nearGto){
    const place=nearGto[1].replace(/\b(CALLE|COLONIA|COL|MUNICIPIO|LOCALIDAD|DOMICILIO|CP|C P)\b/g,' ').replace(/\s+/g,' ').trim();
    if(place.length>=4&&place.length<=45)return place.toLowerCase().replace(/(^|\s)\p{L}/gu,m=>m.toUpperCase());
  }
  return '';
}
function v100LooksLikeIne(text){
  const t=String(text||'');
  const curpOnly=/CLAVE\s+U[NÚ]NICA\s+DE\s+REGISTRO\s+DE\s+POBLACI[ÓO]N|CONSTANCIA\s+DE\s+LA\s+CURP|REGISTRO\s+NACIONAL\s+DE\s+POBLACI[ÓO]N/i.test(t);
  const ine=/INSTITUTO\s+NACIONAL\s+ELECTORAL|CREDENCIAL\s+PARA\s+VOTAR|CLAVE\s+DE\s+ELECTOR|DOMICILIO|SECCI[ÓO]N|VIGENCIA|A[NÑ]O\s+DE\s+REGISTRO/i.test(t);
  const addressish=/\bGTO\.?\b|GUANAJUATO|C\.P\.?\s*\d{4,5}|\bCP\s*\d{4,5}/i.test(t);
  return !curpOnly&&(ine||addressish||!!v100KnownPlaceFromText(t));
}
function parseOcrText(text){
  const raw=String(text||''),up=raw.toUpperCase();
  const lines=raw.split(/\r?\n/).map(x=>x.replace(/[|]/g,'I').replace(/\s+/g,' ').trim()).filter(Boolean);
  const isIne=v100LooksLikeIne(raw);

  let curp='';
  const cm=up.match(/\b[A-Z]{4}\s*\d{6}\s*[HM]\s*[A-Z]{5}\s*[A-Z0-9]\s*\d\b/);
  if(cm)curp=cm[0].replace(/[^A-Z0-9]/g,'');
  if(!curp){
    for(const token of up.replace(/[^A-Z0-9]+/g,' ').split(/\s+/)){
      if(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(token)){curp=token;break}
    }
  }

  let name='';
  const given=ocrValueAfter(lines,/^NOMBRE(?:S)?\b/i);
  const first=ocrValueAfter(lines,/^(?:PRIMER\s+APELLIDO|APELLIDO\s+PATERNO)\b/i);
  const second=ocrValueAfter(lines,/^(?:SEGUNDO\s+APELLIDO|APELLIDO\s+MATERNO)\b/i);
  if((first||second)&&given)name=[given,first,second].filter(Boolean).join(' ');
  if(!name){
    for(let i=0;i<lines.length;i++){
      if(!/^NOMBRE(?:S)?\b/i.test(lines[i]))continue;
      const firstLine=lines[i].replace(/^NOMBRE(?:S)?\s*[:\-]?\s*/i,'').trim(),parts=[];
      if(firstLine)parts.push(firstLine);
      for(let j=i+1;j<Math.min(lines.length,i+4);j++){
        if(/^(DOMICILIO|CLAVE|CURP|FECHA|SEXO|ESTADO|MUNICIPIO|LOCALIDAD|CIUDAD|COMUNIDAD|ENTIDAD|SECCION|VIGENCIA|APELLIDO)\b/i.test(lines[j]))break;
        if(!/\d/.test(lines[j]))parts.push(lines[j]);
      }
      name=parts.join(' ');break;
    }
  }
  name=String(name||'').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]/g,' ').replace(/\s+/g,' ').trim();
  if(name.length<3||name.length>90)name='';

  let city='';
  if(isIne){
    for(const re of [
      /^(?:CIUDAD|MUNICIPIO|LOCALIDAD|COMUNIDAD|POBLACION|POBLACIÓN)\b/i
    ]){city=ocrValueAfter(lines,re);if(city)break}
    if(!city)city=v100KnownPlaceFromText(raw);
    if(!city){
      const gtoLine=lines.find(x=>/\bGTO\.?\b|GUANAJUATO/i.test(x)&&/[A-ZÁÉÍÓÚÜÑ]{4,}/i.test(x));
      if(gtoLine){
        const cleaned=gtoLine
          .replace(/\bC\.?P\.?\s*\d{4,5}\b/ig,' ')
          .replace(/\b\d{4,6}\b/g,' ')
          .replace(/\bGTO\.?\b|GUANAJUATO/ig,' ')
          .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]/g,' ')
          .replace(/\s+/g,' ').trim();
        const guess=v100KnownPlaceFromText(gtoLine)||cleaned;
        if(guess&&guess.length>=4)city=guess;
      }
    }
    if(!city){
      const d=lines.findIndex(x=>/^DOMICILIO\b/i.test(x));
      if(d>=0){
        const addr=[];
        for(let j=d+1;j<Math.min(lines.length,d+5);j++){
          if(/^(CLAVE|CURP|FECHA|SEXO|SECCION|VIGENCIA)\b/i.test(lines[j]))break;
          addr.push(lines[j]);
        }
        const place=addr.slice().reverse().find(x=>/GTO\.?|GUANAJUATO|MUNICIPIO|LOCALIDAD|C\.P\.|\bCP\b/i.test(x));
        if(place)city=place;
      }
    }
    city=String(city||'').replace(/^\s*[:\-]\s*/,'').replace(/\s+/g,' ').trim().slice(0,100);
  }

  const dob=curpDob(curp)||ocrExplicitDob(raw);
  return {curp,name,dob,city};
}
function credentialExtra(){
  const saved=read('v100-credential-extra',{});
  return '<section class="v100-subblock" id="v100-credential-extra">'+sectionTitle('DATOS COMPLEMENTARIOS','Registro de credencial','La fecha de nacimiento ayuda a validar la CURP. Los demás datos se mantienen simples para agilizar el registro.')+
    '<div class="v100-form-grid">'+
      '<label><span>Fecha de nacimiento</span><input type="date" data-v100-dob value="'+esc(saved.dob||'')+'"></label>'+
      '<label><span>Edad</span><input type="text" data-v100-age readonly value="'+esc(saved.age||'')+'"></label>'+
      '<label><span>Posición</span><select data-v100-position>'+['Portero','Defensa','Mediocampista','Delantero','Sin definir'].map(x=>'<option '+(saved.position===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
      '<label><span>Temporada</span><input type="text" data-v100-season value="'+esc(saved.season||'2026–2027')+'"></label>'+
      '<label><span>Estatus del registro</span><select data-v100-status>'+['Pendiente de validación','Revisado','Habilitado'].map(x=>'<option '+(saved.status===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
    '</div>'+
    '<div class="v100-actions"><button class="v100-primary" data-v100-credential-png>Descargar imagen PNG</button><button class="v100-secondary" data-v100-credential-pdf>Descargar PDF · 1 hoja</button><button class="v100-secondary" data-v100-credential-share>Compartir imagen</button></div>'+
    '<p class="v100-note">Si la CURP se detecta y valida, la fecha de nacimiento se sincroniza automáticamente.</p>'+
  '</section>';
}
function syncCredentialExtra(){
  const curp=$('[data-v64-cred-curp]')?.value||'',dob=$('[data-v100-dob]'),age=$('[data-v100-age]');
  const fromCurp=curpDob(curp);
  if(dob&&fromCurp)dob.value=fromCurp;
  if(age)age.value=ageFromDob(dob?.value||'');
  const d={
    dob:dob?.value||'',age:age?.value||'',
    position:$('[data-v100-position]')?.value||'',
    season:$('[data-v100-season]')?.value||'',status:$('[data-v100-status]')?.value||''
  };
  write('v100-credential-extra',d);
}
async function v100LoadImage(src){
  if(!src)return null;
  return new Promise(resolve=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src});
}
function v100CredentialTheme(ctx,category,w,h){
  const key=norm(category);
  let colors=['#07135c','#1547a6','#07104d'],accent='#5de9f3',label='PRIMERA FUERZA';
  if(key.includes('intermedia')){colors=['#210b35','#9d3f3f','#e58055'];accent='#ffd39c';label='INTERMEDIA'}
  else if(key.includes('segunda')){colors=['#1a1110','#86451d','#d57b38'];accent='#ffd6a0';label='SEGUNDA FUERZA'}
  else if(key.includes('veteranos 35')){colors=['#0b3828','#2d7a4e','#87b56b'];accent='#d8ffd1';label='VETERANOS 35+'}
  else if(key.includes('veteranos 50')){colors=['#10291d','#4b6c35','#9e8f47'];accent='#fff0ae';label='VETERANOS 50+'}
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,colors[0]);g.addColorStop(.52,colors[1]);g.addColorStop(1,colors[2]);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const glow=ctx.createRadialGradient(w*.78,h*.28,20,w*.78,h*.28,w*.55);glow.addColorStop(0,'rgba(255,255,255,.18)');glow.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  const fx=68,fy=150,fw=690,fh=345;
  ctx.save();ctx.globalAlpha=.15;ctx.strokeStyle='#fff';ctx.lineWidth=4;
  if(key.includes('intermedia')){
    ctx.fillStyle='rgba(12,8,35,.30)';ctx.fillRect(fx,fy,fw,fh);
    for(let i=0;i<18;i++){const px=fx+i*fw/17;ctx.beginPath();ctx.moveTo(px,fy+fh);ctx.lineTo(px+(i%2?20:-18),fy+fh-105);ctx.stroke()}
  }else{
    ctx.strokeRect(fx,fy,fw,fh);
    ctx.beginPath();ctx.moveTo(fx+fw/2,fy);ctx.lineTo(fx+fw/2,fy+fh);ctx.stroke();
    ctx.beginPath();ctx.arc(fx+fw/2,fy+fh/2,88,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle=accent;ctx.globalAlpha=.92;ctx.font='800 28px Arial';ctx.fillText(label,78,530);ctx.globalAlpha=1;
  return {accent,label};
}
function v100PlayerPhotoFile(){
  const photoInput=$('[data-v64-photo]'),docInput=$('[data-v64-doc]');
  const file=photoInput?.files?.[0]||null,doc=docInput?.files?.[0]||null;
  if(!file)return null;
  const name=String(file.name||'').toLowerCase();
  const obviousDocument=/(^|[^a-z])(ine|curp|credencial|documento|identificacion|identificación)([^a-z]|$)/i.test(name);
  const sameAsDocument=!!doc&&file.name===doc.name&&file.size===doc.size&&file.lastModified===doc.lastModified;
  return (obviousDocument||sameAsDocument)?null:file;
}
function v100DrawContainedImage(ctx,img,x,y,w,h){
  const iw=img?.naturalWidth||img?.width||0,ih=img?.naturalHeight||img?.height||0;
  if(!iw||!ih)return false;
  const scale=Math.min(w/iw,h/ih),dw=Math.max(1,iw*scale),dh=Math.max(1,ih*scale);
  const dx=x+(w-dw)/2,dy=y+(h-dh)/2;
  ctx.drawImage(img,dx,dy,dw,dh);
  return true;
}

async function credentialCanvas(){
  syncCredentialExtra();
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=760;const x=canvas.getContext('2d');
  const name=$('[data-v64-cred-name]')?.value||'Jugador';
  const team=$('[data-v64-cred-team]')?.value||'Equipo';
  const cat=$('[data-v64-cred-team]')?.selectedOptions?.[0]?.dataset?.category||$('[data-v64-cred-cat]')?.value||'Categoría';
  const curp=$('[data-v64-cred-curp]')?.value||'',e=read('v100-credential-extra',{});
  const theme=v100CredentialTheme(x,cat,canvas.width,canvas.height);

  x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,0,1200,760);
  x.strokeStyle='rgba(255,255,255,.34)';x.lineWidth=3;x.strokeRect(22,22,1156,716);

  x.fillStyle='#fff';x.font='800 34px Arial';x.fillText('Liga Municipal de Futbol',62,72);
  x.font='800 29px Arial';x.fillText('Juventino Rosas, A.C.',62,108);

  const playerFile=v100PlayerPhotoFile(),px=815,py=92,pw=320,ph=320;
  let photo=null,photoUrl='';
  if(playerFile){
    try{
      photoUrl=URL.createObjectURL(playerFile);
      photo=await v100LoadImage(photoUrl);
    }catch(err){photo=null}
    finally{if(photoUrl)URL.revokeObjectURL(photoUrl)}
  }
  x.fillStyle='rgba(4,6,35,.34)';x.fillRect(px,py,pw,ph);
  if(photo){
    try{
      x.save();
      if(x.roundRect){x.beginPath();x.roundRect(px,py,pw,ph,22);x.clip()}
      v100DrawContainedImage(x,photo,px,py,pw,ph);
      x.restore();
      x.strokeStyle='rgba(255,255,255,.42)';x.lineWidth=3;x.strokeRect(px,py,pw,ph);
    }catch(err){}
  }else{
    x.fillStyle='rgba(255,255,255,.58)';x.font='800 30px Arial';x.fillText('FOTO',924,258);
    x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.strokeRect(px,py,pw,ph);
  }

  x.fillStyle='rgba(255,255,255,.66)';x.font='800 15px Arial';x.fillText('EQUIPO',815,448);
  x.fillStyle='#fff';x.font='800 28px Arial';x.fillText(team.slice(0,28),815,482);

  x.fillStyle='rgba(1,8,45,.66)';x.fillRect(0,560,1200,180);

  const league=await v100LoadImage('./assets/liga-logo.webp');
  if(league){x.save();x.globalAlpha=.96;x.drawImage(league,66,588,100,100);x.restore()}

  x.font='900 43px Arial';x.fillStyle=theme.accent;x.fillText(name.slice(0,32),245,625);

  const info=[
    {label:'EDAD',value:e.age?e.age+' años':'Edad —',x:245},
    {label:'POSICIÓN',value:e.position||'Sin definir',x:420},
    {label:'TEMPORADA',value:e.season||'2026–2027',x:620},
    {label:'CURP',value:curp?'•••• '+curp.slice(-4):'No capturada',x:835}
  ];
  info.forEach(item=>{
    x.fillStyle='rgba(93,233,243,.84)';x.font='800 12px Arial';x.fillText(item.label,item.x,661);
    x.fillStyle='rgba(255,255,255,.94)';x.font='700 18px Arial';x.fillText(String(item.value).slice(0,24),item.x,686);
  });

  if(e.city){x.fillStyle='rgba(255,255,255,.75)';x.font='600 15px Arial';x.fillText(String(e.city).slice(0,56),245,711)}
  return canvasBlob(canvas);
}
async function downloadCredentialPng(){
  const blob=await credentialCanvas();
  if(blob)download(blob,'Credencial_Liga_Juventino.png');
}
async function v100LoadJsPDF(){
  if(window.jspdf?.jsPDF)return window.jspdf.jsPDF;
  return new Promise((resolve,reject)=>{
    let s=document.querySelector('script[data-v100-jspdf]');
    if(!s){s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';s.async=true;s.dataset.v100Jspdf='1';document.head.appendChild(s)}
    const done=()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error('jsPDF no disponible'));
    s.addEventListener('load',done,{once:true});s.addEventListener('error',reject,{once:true});
    if(window.jspdf?.jsPDF)resolve(window.jspdf.jsPDF);
  });
}
async function downloadCredentialPdf(){
  const blob=await credentialCanvas();if(!blob)return;
  try{
    const JS=await v100LoadJsPDF(),url=URL.createObjectURL(blob),img=await v100LoadImage(url);
    const pdf=new JS({orientation:'landscape',unit:'px',format:[1200,760],hotfixes:['px_scaling']});
    if(img)pdf.addImage(img,'PNG',0,0,1200,760,undefined,'FAST');
    pdf.save('Credencial_Liga_Juventino_1_hoja.pdf');
    URL.revokeObjectURL(url);
  }catch(e){
    toast('No se pudo crear el PDF; se descargó la imagen en su lugar');
    download(blob,'Credencial_Liga_Juventino.png');
  }
}

function bindCredential(root){
  const curp=$('[data-v64-cred-curp]'),dob=$('[data-v100-dob]',root),name=$('[data-v64-cred-name]');
  curp?.addEventListener('input',()=>{
    curp.value=String(curp.value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18);
    const fromCurp=curpDob(curp.value);if(dob&&fromCurp)dob.value=fromCurp;
    syncCredentialExtra();
  });
  $$('input,select,textarea',root).forEach(el=>{el.addEventListener('input',syncCredentialExtra);el.addEventListener('change',syncCredentialExtra)});syncCredentialExtra();

  const imported=read('v100-ocr-import',null);
  if(imported){
    const out=$('[data-v64-ocr-text]');
    if(out&&!out.value)out.value=imported.text||'';
    if(curp&&imported.curp)curp.value=imported.curp;
    if(name&&imported.name)name.value=imported.name;
    if(dob&&imported.dob)dob.value=imported.dob;
    localStorage.removeItem('v100-ocr-import');syncCredentialExtra();toast('Lectura importada; revisa y corrige los datos');
  }

  $('[data-v64-ocr]')?.addEventListener('click',()=>{
    /* El OCR principal de main.js es la única fuente que rellena nombre/CURP/lugar.
       Este módulo solo espera a que termine y recalcula fecha + edad para no
       sobrescribir una lectura buena con una segunda interpretación peor. */
    const poll=setInterval(()=>{
      const b=$('[data-v64-ocr]');
      if(!b||!b.disabled){
        clearInterval(poll);
        const detectedCurp=$('[data-v64-cred-curp]')?.value||'';
        const fromCurp=curpDob(detectedCurp);
        if(dob&&fromCurp)dob.value=fromCurp;
        syncCredentialExtra();
      }
    },350);
    setTimeout(()=>clearInterval(poll),45000);
  });
  $('[data-v100-credential-png]',root)?.addEventListener('click',async()=>{const b=await credentialCanvas();if(b)download(b,'Credencial_Liga_Juventino.png')});
  $('[data-v100-credential-pdf]',root)?.addEventListener('click',downloadCredentialPdf);
  $('[data-v100-credential-share]',root)?.addEventListener('click',async()=>{const b=await credentialCanvas();if(b)try{await fileShare(b,'Credencial_Liga_Juventino.png','Credencial Liga Juventino')}catch(e){}});
}

/* ---------- PIZARRA TÁCTICA AVANZADA/* ---------- PIZARRA TÁCTICA AVANZADA ---------- */
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
  'campo 1 unidad deportiva sur':[20.63753,-100.99297],
  'campo 2 unidad deportiva sur':[20.63753,-100.99297],
  'campo 3 unidad deportiva sur':[20.63753,-100.99297],
  'campo 4 emiliano zapata':[20.64337,-100.99286],
  'cerrito de gasca':[20.617778,-101.0625],
  'tavera':[20.60839,-100.93238],
  'san juan de la cruz':[20.63379,-100.911569],
  'santiago de cuenda':[20.59793,-100.99663],
  'san antonio de romerillo':[20.60784,-100.94854],
  'fraccionamiento comontuoso':[20.59793,-100.99663],
  'pozos':[20.61767,-100.90033],
  'rincon de centeno':[20.660153,-100.886766],
  'san jose de la montana':[20.60102,-101.07242],
  'san julian tierra blanca':[20.591403,-101.040358]
};
const FIELD_LABELS={
  'campo 1 unidad deportiva sur':'Campo 1 · Unidad Deportiva Sur',
  'campo 2 unidad deportiva sur':'Campo 2 · Unidad Deportiva Sur',
  'campo 3 unidad deportiva sur':'Campo 3 · Unidad Deportiva Sur',
  'campo 4 emiliano zapata':'Campo 4 · Emiliano Zapata',
  'cerrito de gasca':'Campo Cerrito de Gasca',
  'tavera':'Campo de Tavera',
  'san juan de la cruz':'Campo San Juan de la Cruz',
  'santiago de cuenda':'Unidad Deportiva Santiago de Cuenda',
  'san antonio de romerillo':'Campo San Antonio de Romerillo',
  'fraccionamiento comontuoso':'Campo Fraccionamiento Comontuoso',
  'pozos':'Campo de Fútbol de Pozos',
  'rincon de centeno':'Campo Rincón de Centeno',
  'san jose de la montana':'Campo San José de la Montaña',
  'san julian tierra blanca':'Campo San Julián Tierra Blanca'
};
function weatherFieldOptions(){
 const fromCards=$('.v60-field-card').map(card=>{const name=$('.v60-field-top h3',card)?.textContent?.trim()||'';const community=$('.v60-field-top span',card)?.textContent?.trim()||'';const key=Object.keys(FIELD_COORDS).find(k=>norm(name+' '+community).includes(norm(k)));return key?{name,coord:FIELD_COORDS[key]}:null}).filter(Boolean);
 if(fromCards.length)return fromCards;
 return Object.entries(FIELD_COORDS).map(([key,coord])=>({name:FIELD_LABELS[key]||key,coord}));
}
function weatherExtra(){const opts=weatherFieldOptions();const next=new Date(Date.now()+24*3600e3);next.setMinutes(0,0,0);const local=new Date(next.getTime()-next.getTimezoneOffset()*60000).toISOString().slice(0,16);return '<section class="v100-subblock v171-weather-inline" id="v100-weather-extra">'+sectionTitle('CENTRAL OPERATIVA V38','Clima inteligente del partido','Selecciona una cancha y la hora. El análisis se muestra aquí mismo sin salir de Clima.')+
  '<div class="v100-form-grid"><label><span>Campo</span><select data-v100-weather-field>'+opts.map((o,i)=>'<option value="'+i+'">'+esc(o.name)+'</option>').join('')+'</select></label><label><span>Hora del partido</span><input type="datetime-local" data-v100-weather-time value="'+local+'"></label></div>'+
  '<div class="v100-actions"><button class="v100-primary" data-v100-weather-run>Analizar campo</button><button class="v100-secondary" data-v100-weather-fields>Revisar campos</button><button class="v100-secondary" data-v100-weather-fixtures>Ver jornada</button></div>'+
  '<div class="v100-weather-inline-panel" data-v100-weather-inline-panel hidden></div>'+
  '<div class="v100-weather-result" data-v100-weather-result><p>Selecciona campo y hora para consultar el pronóstico.</p></div>'+
  '<div class="v100-weather-ops"><button data-v100-weather-map>📍 Mapa</button><button data-v100-weather-directions>🧭 Cómo llegar</button><button data-v100-weather-google>☁️ Google clima</button><button data-v100-weather-pin>📌 Ajustar campo</button><button data-v100-weather-share disabled>Compartir aviso</button><button data-v100-weather-copy disabled>Copiar aviso</button></div>'+
  '</section>'}
async function runWeather(root){const opts=weatherFieldOptions();const idx=Number($('[data-v100-weather-field]',root)?.value||0),f=opts[idx],time=$('[data-v100-weather-time]',root)?.value,out=$('[data-v100-weather-result]',root),share=$('[data-v100-weather-share]',root);if(!f||!time)return toast('Selecciona un campo y la hora del partido');out.innerHTML='<p>Consultando pronóstico…</p>';share.disabled=true;try{const [lat,lon]=f.coord;const u='https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&hourly=precipitation_probability,precipitation,temperature_2m,wind_gusts_10m&forecast_days=3&timezone=America/Mexico_City';const j=await fetch(u).then(r=>{if(!r.ok)throw new Error('weather');return r.json()});const h=j.hourly||{},times=h.time||[],target=new Date(time).getTime();let ni=0,best=Infinity;times.forEach((t,i)=>{const d=Math.abs(new Date(t).getTime()-target);if(d<best){best=d;ni=i}});const now=Date.now();const next24=times.map((t,i)=>[new Date(t).getTime(),Number(h.precipitation?.[i]||0)]).filter(([t])=>t>=now&&t<=now+24*3600e3).reduce((a,x)=>a+x[1],0);const next48=times.map((t,i)=>[new Date(t).getTime(),Number(h.precipitation?.[i]||0)]).filter(([t])=>t>=now&&t<=now+48*3600e3).reduce((a,x)=>a+x[1],0);const prob=Number(h.precipitation_probability?.[ni]||0),rain=Number(h.precipitation?.[ni]||0),temp=Number(h.temperature_2m?.[ni]||0),gust=Number(h.wind_gusts_10m?.[ni]||0);let label='ALTA PROBABILIDAD DE JUGAR',level='good',reason='El pronóstico horario no muestra señales meteorológicas fuertes en los indicadores consultados.';if(prob>=60||rain>=3||gust>=60){label='RIESGO METEOROLÓGICO ALTO';level='bad';reason='Hay lluvia, probabilidad o rachas elevadas; conviene revisar terreno y comunicado oficial.'}else if(prob>=35||rain>=1||gust>=45){label='CONDICIONES A VIGILAR';level='watch';reason='Hay indicadores moderados; revisa el campo más cerca de la hora del partido.'}const text=f.name+' · '+label+' · 24 h '+next24.toFixed(1)+' mm · 48 h '+next48.toFixed(1)+' mm · '+prob+'% a la hora · '+rain.toFixed(1)+' mm/h · '+Math.round(temp)+' °C · rachas '+Math.round(gust)+' km/h. Pronóstico informativo; la decisión oficial corresponde a la Liga.';root.dataset.weatherShare=text;out.innerHTML='<div class="v100-weather-badge '+level+'">'+label+'</div><div class="v100-weather-grid"><span><b>'+next24.toFixed(1)+' mm</b><small>Lluvia 24 h</small></span><span><b>'+next48.toFixed(1)+' mm</b><small>Lluvia 48 h</small></span><span><b>'+Math.round(prob)+'%</b><small>Prob. a la hora</small></span><span><b>'+rain.toFixed(1)+' mm/h</b><small>Intensidad</small></span><span><b>'+Math.round(temp)+' °C</b><small>Temperatura</small></span><span><b>'+Math.round(gust)+' km/h</b><small>Racha</small></span></div><p>'+esc(reason)+'</p><small>Pronóstico meteorológico ≠ estado del terreno ≠ decisión oficial.</small>';share.disabled=false;const copy=$('[data-v100-weather-copy]',root);if(copy)copy.disabled=false}catch(e){out.innerHTML='<p>No se pudo consultar el pronóstico en este momento.</p>'}}
function weatherFixtureRows(){
 const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{},rows=[];
 Object.entries(db.categories||{}).forEach(([id,cat])=>(cat.fixtures||[]).forEach(g=>(g.rows||[]).forEach(r=>{
  if(r?.[2]&&r?.[6])rows.push({cat:cat.name||('Categoría '+id),round:r?.[1]||'',home:r[2],away:r[6],venue:r?.[7]||'Campo por confirmar',date:r?.[8]||'Fecha por confirmar'});
 })));
 return rows.slice(0,8);
}
function showWeatherInline(root,mode){
 const panel=$('[data-v100-weather-inline-panel]',root);
 if(!panel)return;
 if(mode==='fixtures'){
  const rows=weatherFixtureRows();
  panel.innerHTML='<b>Jornada dentro de Clima</b><small>Consulta rápida sin salir de esta pantalla.</small>'+
   (rows.length?rows.map(x=>'<article><strong>'+esc(x.home)+' vs '+esc(x.away)+'</strong><span>'+esc(x.cat)+(x.round?' · Jornada '+esc(x.round):'')+'</span><em>'+esc(x.date)+' · '+esc(x.venue)+'</em></article>').join(''):'<p>No hay partidos publicados para mostrar.</p>');
  panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'nearest'});return;
 }
 const sel=$('[data-v100-weather-field]',root);
 panel.innerHTML='<b>Campos disponibles</b><small>Usa el selector de arriba para escoger una cancha y pulsa “Analizar campo”.</small>';
 panel.hidden=false;
 sel?.focus();
 root.scrollIntoView({behavior:'smooth',block:'start'});
}
function bindWeather(root){
 const current=()=>{const opts=weatherFieldOptions(),idx=Number($('[data-v100-weather-field]',root)?.value||0);return opts[idx]||opts[0]||null};
 const openUrl=u=>{if(u)window.open(u,'_blank','noopener,noreferrer')};
 const inline=route()==='v38Weather';
 $('[data-v100-weather-run]',root)?.addEventListener('click',()=>runWeather(root));
 $('[data-v100-weather-fields]',root)?.addEventListener('click',()=>inline?showWeatherInline(root,'fields'):go('venues'));
 $('[data-v100-weather-fixtures]',root)?.addEventListener('click',()=>inline?showWeatherInline(root,'fixtures'):go('competition'));
 $('[data-v100-weather-map]',root)?.addEventListener('click',()=>{const f=current();if(!f)return toast('Selecciona un campo');openUrl('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(f.coord[0]+','+f.coord[1]))});
 $('[data-v100-weather-directions]',root)?.addEventListener('click',()=>{const f=current();if(!f)return toast('Selecciona un campo');openUrl('https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(f.coord[0]+','+f.coord[1]))});
 $('[data-v100-weather-google]',root)?.addEventListener('click',()=>{const f=current();if(!f)return toast('Selecciona un campo');openUrl('https://www.google.com/search?q='+encodeURIComponent('clima '+f.name+' Guanajuato'))});
 $('[data-v100-weather-pin]',root)?.addEventListener('click',()=>inline?showWeatherInline(root,'fields'):go('venues'));
 $('[data-v100-weather-share]',root)?.addEventListener('click',async()=>{const text=root.dataset.weatherShare||'';if(!text)return;try{if(navigator.share)await navigator.share({title:'Clima · Liga Juventino',text});else{await navigator.clipboard.writeText(text);toast('Aviso copiado')}}catch(e){}});
 $('[data-v100-weather-copy]',root)?.addEventListener('click',async()=>{const text=root.dataset.weatherShare||'';if(!text)return;try{await navigator.clipboard.writeText(text);toast('Aviso copiado')}catch(e){toast('No se pudo copiar')}});
 if(inline){
  $('[data-v163-weather-inline]').forEach(b=>{if(b.dataset.v171Bound)return;b.dataset.v171Bound='1';b.addEventListener('click',()=>showWeatherInline(root,b.dataset.v163WeatherInline==='fixtures'?'fixtures':'fields'))});
 }
}

/* ---------- PUBLICACIONES: boletín PNG ---------- */
function publicationExtra(){return '<section class="v100-subblock" id="v100-publication-extra">'+sectionTitle('IMÁGENES','Boletín de jornada','Convierte el texto que ya tienes en una imagen PNG sin alterar publicaciones existentes.')+'<div class="v100-actions"><button class="v100-primary" data-v100-bulletin-png>Descargar imagen PNG</button><button class="v100-secondary" data-v100-bulletin-share>Compartir PNG</button></div></section>'}
function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines=28){let lines=0;for(const para of String(text).split('\n')){const words=para.split(/\s+/);let line='';for(const w of words){const test=line?line+' '+w:w;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;lines++;line=w;if(lines>=maxLines)return y}else line=test}if(line){ctx.fillText(line,x,y);y+=lineHeight;lines++}y+=8;if(lines>=maxLines)return y}return y}
async function bulletinBlob(){const text=$('[data-v60-share-text]')?.textContent?.trim()||'Liga Municipal de Fútbol Juventino Rosas';const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#02095c');g.addColorStop(.55,'#073aa9');g.addColorStop(1,'#02064d');x.fillStyle=g;x.fillRect(0,0,1080,1350);x.strokeStyle='#18ddea';x.lineWidth=5;x.strokeRect(50,50,980,1250);x.fillStyle='#5cecf3';x.font='800 24px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS',90,125);x.fillStyle='#fff';x.font='900 62px Arial';x.fillText('JORNADA',90,215);x.font='700 31px Arial';wrapText(x,text,90,305,900,48,19);x.fillStyle='rgba(255,255,255,.7)';x.font='22px Arial';x.fillText('Información generada desde la app de la Liga',90,1260);return canvasBlob(c)}
function bindPublication(root){$('[data-v100-bulletin-png]',root).onclick=async()=>{const b=await bulletinBlob();download(b,'Jornada_Liga_Juventino.png')};$('[data-v100-bulletin-share]',root).onclick=async()=>{const b=await bulletinBlob();try{await fileShare(b,'Jornada_Liga_Juventino.png','Jornada Liga Juventino')}catch(e){}}}


/* ---------- MATCHDAY: tiempo cronológico + barra de jornada ---------- */
function v100FixtureStamp(v){const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime():NaN}
function v100MatchdayRows(){
 const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{},rows=[];
 Object.entries(db.categories||{}).forEach(([id,cat])=>(cat.fixtures||[]).forEach(g=>(g.rows||[]).forEach(r=>{const t=v100FixtureStamp(r?.[8]);if(Number.isFinite(t)&&r?.[2]&&r?.[6])rows.push({id,cat:cat.name||'',r,t})})));
 return rows.sort((a,b)=>a.t-b.t);
}
function v100MatchState(x,now=Date.now()){
 const e=(now-x.t)/60000;
 const hg=String(x?.r?.[3]??'').trim(),ag=String(x?.r?.[5]??'').trim();
 const hasScore=/^\d+$/.test(hg)&&/^\d+$/.test(ag);
 if(e<0)return {kind:'next',label:'Próximo',detail:''};
 if(hasScore)return {kind:'final',label:'FINAL',detail:hg+'–'+ag+' FINAL'};
 if(e<45)return {kind:'live',label:'EN VIVO',detail:'1T · '+Math.max(1,Math.floor(e)+1)+"'"};
 if(e<60)return {kind:'live',label:'EN VIVO',detail:'Descanso'};
 if(e<105)return {kind:'live',label:'EN VIVO',detail:'2T · '+Math.min(90,45+Math.floor(e-60)+1)+"'"};
 if(e<120)return {kind:'live',label:'EN VIVO',detail:"2T · 90+'"};
 return {kind:'pending',label:'Pendiente',detail:'Pendiente'};
}
function v100Countdown(ms){
 if(!Number.isFinite(ms)||ms<=0)return '00:00:00';
 const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60;
 return [h,m,ss].map(x=>String(x).padStart(2,'0')).join(':');
}
function v100FixtureTimeLabel(v){
 const m=String(v||'').match(/\s(\d{1,2}:\d{2})/);
 return m?m[1]:'Por confirmar';
}
function matchdayExtra(){
 const rows=v100MatchdayRows(),now=Date.now();
 const live=rows.find(x=>v100MatchState(x,now).kind==='live');
 const next=rows.find(x=>x.t>now);
 const main=live||next||rows[rows.length-1];
 const future=rows.filter(x=>x.t>=now).filter(x=>!main||x.t<=(main.t+24*3600e3));
 const bar=live?[live,...future.filter(x=>x!==live).slice(0,2)]:future.slice(0,3);
 const mainState=main?v100MatchState(main,now):{kind:'next',label:'Próximo',detail:''};
 const kicker=mainState.kind==='live'?'PARTIDO EN CURSO':mainState.kind==='pending'?'PENDIENTE DE RESULTADO':'PRÓXIMO GRAN PARTIDO';
 const category=String(main?.cat||'').trim();
 const round=String(main?.r?.[1]||'').trim();
 const meta=[category,round?'Jornada '+round:'',main?.r?.[7]||'Campo por confirmar',main?.r?.[8]||'Fecha por confirmar'].filter(Boolean).join(' · ');
 return '<section class="v100-subblock v160-matchday-extra" id="v160-matchday-extra">'+
  '<div class="v160-matchday-hero" data-v160-main-time="'+esc(main?.t||'')+'">'+
    '<small data-v160-kicker>'+esc(kicker)+'</small>'+
    '<h3>'+esc(main?.r?.[2]||'Próximo partido')+' vs '+esc(main?.r?.[6]||'Por confirmar')+'</h3>'+
    '<strong data-v160-countdown>'+esc(mainState.kind==='live'?mainState.detail:(mainState.kind==='final'?mainState.detail:v100Countdown((main?.t||now)-now)))+'</strong>'+
    '<p>'+esc(meta||'Esperando programación oficial')+'</p>'+
    '<button class="v100-primary" data-v100-route="v4-matchcenter">Abrir Match Center</button>'+
  '</div>'+
  '<div class="v160-matchday-bar"><h3>Barra de jornada</h3>'+
    (bar.length?bar.map(x=>{const s=v100MatchState(x,now),time=v100FixtureTimeLabel(x.r?.[8]);return '<div><span>'+esc(time)+' · '+esc(x.r?.[2]||'')+' vs '+esc(x.r?.[6]||'')+'</span><b class="'+esc(s.kind)+'">'+esc(s.kind==='live'?s.detail:(s.kind==='final'?s.detail:s.label))+'</b></div>'}).join(''):'<div><span>Esperando próximos partidos oficiales</span><b class="next">Próximo</b></div>')+
    '<button class="v100-secondary" data-v100-route="competition">Consultar partidos por categoría</button>'+
  '</div>'+
 '</section>';
}
let v160MatchdayTimer=0;
function bindMatchday(root){
 bindGeneric(root);
 const tick=()=>{
   const host=$('.v160-matchday-hero',root),out=$('[data-v160-countdown]',root),kick=$('[data-v160-kicker]',root);
   if(!host||!out)return;
   const t=Number(host.dataset.v160MainTime||0),x=v100MatchdayRows().find(z=>z.t===t),s=x?v100MatchState(x):null;
   if(s?.kind==='live'){
     out.textContent=s.detail;
     if(kick)kick.textContent='PARTIDO EN CURSO';
   }else if(s?.kind==='final'){
     out.textContent=s.detail;
     if(kick)kick.textContent='RESULTADO OFICIAL';
   }else if(s?.kind==='pending'){
     out.textContent='PENDIENTE';
     if(kick)kick.textContent='PENDIENTE DE RESULTADO';
   }else{
     out.textContent=v100Countdown(t-Date.now());
     if(kick)kick.textContent='PRÓXIMO GRAN PARTIDO';
   }
 };
 tick();
 clearInterval(v160MatchdayTimer);
 v160MatchdayTimer=setInterval(()=>{
   if(route()!=='matchday'){clearInterval(v160MatchdayTimer);v160MatchdayTimer=0;return}
   tick();
 },1000);
}

/* ---------- PARTIDO: recordatorio local y cédula ---------- */
function matchExtra(){const h=$('.screen-title')?.textContent?.trim().replace(/\s+/g,' ')||'Partido de la Liga';const meta=$('.match-detail .muted.tiny')?.textContent?.trim()||'';return '<section class="v100-subblock" id="v100-match-extra">'+sectionTitle('PARTIDO','Acciones rápidas','Se agregan al final de Ver detalles.')+'<div class="v100-form-grid"><label><span>Fecha y hora para recordar</span><input type="datetime-local" data-v100-reminder-time></label><label><span>Partido / sede</span><input type="text" data-v100-reminder-title value="'+esc(h)+'" data-meta="'+esc(meta)+'"></label></div><div class="v100-actions"><button class="v100-primary" data-v100-ics>Recordar · calendario</button><button class="v100-secondary" data-v100-route="cedulas">Cédula oficial</button><button class="v100-secondary" data-v100-route="weatherFields">Clima y campo</button></div></section>'}
function icsDate(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
function bindMatch(root){$('[data-v100-ics]',root).onclick=()=>{const v=$('[data-v100-reminder-time]',root).value;if(!v)return toast('Selecciona fecha y hora');const start=new Date(v),end=new Date(start.getTime()+120*60000),title=$('[data-v100-reminder-title]',root).value||'Partido Liga Juventino';const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino//App//ES','BEGIN:VEVENT','UID:'+Date.now()+'@ligajuventino','DTSTAMP:'+icsDate(new Date()),'DTSTART:'+icsDate(start),'DTEND:'+icsDate(end),'SUMMARY:'+title.replace(/[,;]/g,' '),'DESCRIPTION:Recordatorio creado desde la app Liga Juventino Rosas','END:VEVENT','END:VCALENDAR'].join('\r\n');download(new Blob([ics],{type:'text/calendar;charset=utf-8'}),'Partido_Liga_Juventino.ics')}}

/* ---------- MODALES / herramientas locales ---------- */
let installPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});
function modal(html,cls=''){let m=$('.v100-modal');if(m)m.remove();m=document.createElement('div');m.className='v100-modal '+cls;m.innerHTML='<div class="v100-modal-card"><button class="v100-modal-close" aria-label="Cerrar">×</button>'+html+'</div>';document.body.appendChild(m);$('.v100-modal-close',m).onclick=()=>m.remove();m.addEventListener('click',e=>{if(e.target===m)m.remove()});return m}
function loadTesseract(){if(window.Tesseract)return Promise.resolve(window.Tesseract);return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=()=>resolve(window.Tesseract);s.onerror=reject;document.head.appendChild(s)})}
function whatsappOcr(){const m=modal(sectionTitle('OCR LOCAL','Importar imagen de WhatsApp','Selecciona una foto que ya guardaste desde WhatsApp. La lectura ocurre en este dispositivo.')+'<label class="v100-file"><span>Imagen</span><input type="file" accept="image/*" data-v100-wa-file></label><div class="v100-actions"><button class="v100-primary" data-v100-wa-read>Leer imagen</button></div><div class="v100-modal-result" data-v100-wa-result></div>');$('[data-v100-wa-read]',m).onclick=async e=>{const f=$('[data-v100-wa-file]',m).files?.[0],out=$('[data-v100-wa-result]',m);if(!f)return toast('Selecciona una imagen');e.currentTarget.disabled=true;out.textContent='Leyendo imagen…';try{const T=await loadTesseract(),r=await T.recognize(f,'spa'),text=r?.data?.text||'',p=parseOcrText(text);write('v100-ocr-import',{text,...p});out.innerHTML='<b>Lectura terminada</b><p>'+esc(text.slice(0,600))+'</p><button class="v100-primary" data-v100-open-credential>Continuar a credencial</button>';$('[data-v100-open-credential]',m).onclick=()=>{m.remove();go('credentialBuilder')}}catch(err){out.textContent='No se pudo leer la imagen. Puedes capturar los datos manualmente.'}finally{e.currentTarget.disabled=false}}}
function delegates(){
  const list=read('v100-delegates',[]);
  const teams=officialTeams()
    .filter(t=>t&&t.name)
    .map(t=>({name:String(t.name).trim(),category:String(t.category||t.cat||'Sin categoría').trim()}))
    .filter((t,i,a)=>a.findIndex(x=>x.name===t.name&&x.category===t.category)===i)
    .sort((a,b)=>a.category.localeCompare(b.category,'es')||a.name.localeCompare(b.name,'es'));
  const categories=[...new Set(teams.map(t=>t.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));

  const categoryOptions='<option value="">Selecciona una categoría</option>'+
    categories.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('');

  const teamOptions=(category,selected='')=>{
    const filtered=teams.filter(t=>!category||t.category===category);
    return '<option value="">Selecciona un equipo</option>'+
      filtered.map(t=>{
        const key=t.category+'|||'+t.name;
        return '<option value="'+esc(key)+'" '+(key===selected?'selected':'')+'>'+esc(t.name)+'</option>';
      }).join('');
  };

  const render=()=>{
    const host=$('[data-v100-delegate-list]',m);
    host.innerHTML=list.length?list.map((d,i)=>{
      const meta=[d.category,d.team].filter(Boolean).join(' · ');
      return '<article><span><b>'+esc(d.name)+'</b><small>'+esc(meta||d.team||'Sin equipo')+'</small></span><div>'+
        '<a href="tel:'+esc(d.phone)+'">Llamar</a>'+
        '<a target="_blank" rel="noopener" href="https://wa.me/'+esc(String(d.phone).replace(/\D/g,''))+'">WhatsApp</a>'+
        '<button data-del="'+i+'">×</button></div></article>';
    }).join(''):'<p>No hay contactos guardados en este dispositivo.</p>';
    $$('[data-del]',host).forEach(b=>b.onclick=()=>{
      list.splice(Number(b.dataset.del),1);
      write('v100-delegates',list);
      render();
    });
  };

  const m=modal(
    sectionTitle('SOLO EN ESTE DISPOSITIVO','Directorio de delegados','Elige categoría y equipo de las opciones oficiales de la Liga. Los teléfonos se guardan solo en este dispositivo y no se publican en GitHub.')+
    '<div class="v100-form-grid">'+
      '<label><span>Nombre</span><input data-v100-del-name placeholder="Nombre del delegado"></label>'+
      '<label><span>Categoría</span><select data-v100-del-category>'+categoryOptions+'</select></label>'+
      '<label><span>Equipo</span><select data-v100-del-team>'+teamOptions('')+'</select></label>'+
      '<label><span>Teléfono</span><input data-v100-del-phone inputmode="tel" autocomplete="tel" placeholder="Número de teléfono"></label>'+
    '</div>'+
    '<div class="v100-actions"><button class="v100-primary" data-v100-del-add>Agregar</button></div>'+
    '<div class="v100-delegate-list" data-v100-delegate-list></div>'
  );

  const catSel=$('[data-v100-del-category]',m);
  const teamSel=$('[data-v100-del-team]',m);

  catSel.onchange=()=>{
    teamSel.innerHTML=teamOptions(catSel.value);
  };

  teamSel.onchange=()=>{
    if(catSel.value||!teamSel.value)return;
    const [category]=teamSel.value.split('|||');
    if(!category)return;
    const selected=teamSel.value;
    catSel.value=category;
    teamSel.innerHTML=teamOptions(category,selected);
  };

  render();

  $('[data-v100-del-add]',m).onclick=()=>{
    const name=$('[data-v100-del-name]',m).value.trim();
    const phone=$('[data-v100-del-phone]',m).value.trim();
    const selected=teamSel.value;
    const parts=selected.split('|||');
    const category=catSel.value||parts[0]||'';
    const team=parts.length>1?parts.slice(1).join('|||'):'';
    if(!name||!category||!team||!phone)return toast('Completa nombre, categoría, equipo y teléfono');
    list.push({name,category,team,phone});
    write('v100-delegates',list);
    $('[data-v100-del-name]',m).value='';
    $('[data-v100-del-phone]',m).value='';
    render();
  };
}
function fanzone(){
  const fan=fanSnapshot(),p=fan.counts;
  const m=modal(
    sectionTitle('FAN ZONE','Pulso de la afición','Una reacción por visitante o perfil registrado. Si cambias de opción, tu voto se mueve y no se duplica.')+
    '<p class="v100-fan-rule" data-fan-status></p>'+
    '<div class="v100-big-reactions">'+
      '<button data-r="fire">🔥 <b>'+p.fire+'</b></button>'+
      '<button data-r="goal">⚽ <b>'+p.goal+'</b></button>'+
      '<button data-r="clap">👏 <b>'+p.clap+'</b></button>'+
      '<button data-r="heart">💙 <b>'+p.heart+'</b></button>'+
    '</div>'
  );
  $$('[data-r]',m).forEach(b=>b.onclick=()=>{
    const r=fanVote(b.dataset.r);
    fanRenderButtons(m,'[data-r]','r');
    toast(r.same?'Ya registraste esa reacción':(r.previous?'Reacción cambiada · sigue contando como un solo voto':'Reacción registrada · 1 por visitante/perfil'));
  });
  fanRenderButtons(m,'[data-r]','r');
}
function journeySim(){const teams=officialTeams();const opts=teams.map(t=>'<option>'+esc(t.name)+'</option>').join('');const m=modal(sectionTitle('ESCENARIO LOCAL','Simulador de jornada','Prueba un marcador hipotético. No modifica resultados ni tablas oficiales.')+'<div class="v100-form-grid"><label><span>Local</span><select data-js-home>'+opts+'</select></label><label><span>Visitante</span><select data-js-away>'+opts+'</select></label><label><span>Goles local</span><input type="number" min="0" max="30" value="0" data-js-hg></label><label><span>Goles visitante</span><input type="number" min="0" max="30" value="0" data-js-ag></label></div><div class="v100-actions"><button class="v100-primary" data-js-save>Guardar escenario</button></div><div data-js-list></div>');const render=()=>{const list=read('v100-journey-sim',[]),h=$('[data-js-list]',m);h.innerHTML=list.length?'<div class="v100-sim-list">'+list.map((x,i)=>'<article><span><b>'+esc(x.home)+' '+x.hg+'–'+x.ag+' '+esc(x.away)+'</b><small>Escenario hipotético</small></span><button data-js-del="'+i+'">Quitar</button></article>').join('')+'</div>':'<p class="v100-note">Sin escenarios guardados.</p>';$$('[data-js-del]',h).forEach(b=>b.onclick=()=>{list.splice(Number(b.dataset.jsDel),1);write('v100-journey-sim',list);render()})};render();$('[data-js-save]',m).onclick=()=>{const x={home:$('[data-js-home]',m).value,away:$('[data-js-away]',m).value,hg:Number($('[data-js-hg]',m).value||0),ag:Number($('[data-js-ag]',m).value||0)};if(x.home===x.away)return toast('Elige dos equipos distintos');const list=read('v100-journey-sim',[]);list.push(x);write('v100-journey-sim',list);render()}}
function shotmap(){const shots=read('v100-shotmap',[]);const m=modal(sectionTitle('ANÁLISIS LOCAL','Shot Map','Toca la cancha para registrar tiros. Se guarda solo en este dispositivo.')+'<div class="v100-shot-pitch" data-shot-pitch></div><div class="v100-actions"><button class="v100-secondary" data-shot-undo>Deshacer</button><button class="v100-secondary" data-shot-clear>Limpiar</button><button class="v100-primary" data-shot-png>PNG</button><button class="v100-secondary" data-shot-json>JSON</button></div>','v100-shot-modal');const pitch=$('[data-shot-pitch]',m);const render=()=>{pitch.innerHTML=shots.map((s,i)=>'<i style="left:'+s.x+'%;top:'+s.y+'%" title="Tiro '+(i+1)+'"></i>').join('')};render();pitch.onclick=e=>{const r=pitch.getBoundingClientRect();shots.push({x:+(((e.clientX-r.left)/r.width)*100).toFixed(1),y:+(((e.clientY-r.top)/r.height)*100).toFixed(1),at:new Date().toISOString()});write('v100-shotmap',shots);render()};$('[data-shot-undo]',m).onclick=()=>{shots.pop();write('v100-shotmap',shots);render()};$('[data-shot-clear]',m).onclick=()=>{shots.splice(0);write('v100-shotmap',shots);render()};$('[data-shot-json]',m).onclick=()=>download(new Blob([JSON.stringify(shots,null,2)],{type:'application/json'}),'Shot_Map_Liga.json');$('[data-shot-png]',m).onclick=async()=>{const c=document.createElement('canvas');c.width=900;c.height=1300;const x=c.getContext('2d');x.fillStyle='#07582e';x.fillRect(0,0,900,1300);x.strokeStyle='#fff';x.lineWidth=6;x.strokeRect(35,35,830,1230);x.beginPath();x.moveTo(35,650);x.lineTo(865,650);x.stroke();shots.forEach((s,i)=>{x.fillStyle='#ffe369';x.beginPath();x.arc(35+s.x/100*830,35+s.y/100*1230,18,0,Math.PI*2);x.fill();x.fillStyle='#07104d';x.font='700 16px Arial';x.textAlign='center';x.fillText(String(i+1),35+s.x/100*830,41+s.y/100*1230)});const b=await canvasBlob(c);download(b,'Shot_Map_Liga.png')}}
async function installApp(){if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return}modal(sectionTitle('INSTALAR APP','Liga Juventino','Si el navegador permite instalación, usa el menú de Chrome → “Instalar aplicación” o “Agregar a pantalla de inicio”.')+'<p class="v100-note">No se muestra un botón de “APK real” porque este repositorio no contiene actualmente un archivo .apk publicado. Así evitamos ofrecer una descarga falsa.</p>')}

function handleAction(action){if(action==='whatsapp-ocr')whatsappOcr();else if(action==='delegates')delegates();else if(action==='fanzone')fanzone();else if(action==='journey-sim')journeySim();else if(action==='shotmap')shotmap();else if(action==='install-app')installApp();else if(action==='tv-mode')window.LJR_V105?.openTv?.();else if(action==='register-alerts')window.LJR_V105?.registerAlerts?.();else if(action==='schedule-match')window.LJR_V105?.scheduleMatch?.();else if(action==='new-sanction')window.LJR_V105?.newSanction?.()}
function bindGeneric(root){$$('[data-v100-route]',root).forEach(b=>b.onclick=()=>go(b.dataset.v100Route));$$('[data-v100-action]',root).forEach(b=>b.onclick=()=>handleAction(b.dataset.v100Action))}

function mount(){
  const screen=$('#screen');if(!screen)return;const r=route();
  if(r==='home'){const old=$('#v100-home-extra',screen);if(old&&Number(old.dataset.v100TeamCount||0)===0&&officialTeams().length)old.remove();if(!$('#v100-home-extra',screen)){screen.insertAdjacentHTML('beforeend',homeExtra());const n=$('#v100-home-extra',screen);bindGeneric(n);bindHome(n)}}
  if(r==='more') $('#v100-more-extra',screen)?.remove();
  if(r==='leagueTools'){
    $('#v100-league-tools-extra',screen)?.remove();
    const grid=$('.v60-tool-grid',screen);
    if(grid&&!$('[data-v100-inline-tool]',grid)){
      grid.insertAdjacentHTML('beforeend',toolsInline());
      bindGeneric(grid);
    }
  }
  if(r==='credentialBuilder'&&!$('#v100-credential-extra',screen)){screen.insertAdjacentHTML('beforeend',credentialExtra());const n=$('#v100-credential-extra',screen);bindGeneric(n);bindCredential(n)}
  if(r==='tactics'&&!$('#v100-tactics-extra',screen)){screen.insertAdjacentHTML('beforeend',tacticsExtra());const n=$('#v100-tactics-extra',screen);bindGeneric(n);bindTactics(n)}
  if(r==='weatherFields'&&!$('#v100-weather-extra',screen)){screen.insertAdjacentHTML('beforeend',weatherExtra());const n=$('#v100-weather-extra',screen);bindGeneric(n);bindWeather(n)}
  if(r==='v38Weather'&&!$('#v100-weather-extra',screen)){
    const page=$('.v163-weather-page',screen);
    if(page){page.insertAdjacentHTML('afterend',weatherExtra());const n=$('#v100-weather-extra',screen);bindGeneric(n);bindWeather(n)}
  }
  if(r==='matchday'&&!$('#v160-matchday-extra',screen)){const page=$('.v60-tool-page',screen)||screen;page.insertAdjacentHTML('afterbegin',matchdayExtra());const n=$('#v160-matchday-extra',screen);bindMatchday(n)}
  if(r==='publications'&&!$('#v100-publication-extra',screen)){screen.insertAdjacentHTML('beforeend',publicationExtra());const n=$('#v100-publication-extra',screen);bindGeneric(n);bindPublication(n)}
  if(r==='match'&&!$('#v100-match-extra',screen)){screen.insertAdjacentHTML('beforeend',matchExtra());const n=$('#v100-match-extra',screen);bindGeneric(n);bindMatch(n)}
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(mount,80)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
window.addEventListener('load',schedule);schedule();setTimeout(schedule,1500);setTimeout(schedule,4000);
window.LJR_V100={build:BUILD,mount,officialTeams,credentialCanvas,downloadCredentialPng,downloadCredentialPdf};
})();
