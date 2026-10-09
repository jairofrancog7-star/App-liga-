/* V100 — Funciones aditivas desde “Apps falta”.
   Regla: no sustituye, mueve ni rediseña pantallas existentes. Solo agrega bloques al final.
   Datos privados capturados en estas herramientas se guardan únicamente en localStorage. */
(function(){
'use strict';

if(window.__LJR_V100_ADDITIVE__) return;
window.__LJR_V100_ADDITIVE__=true;

const BUILD='20261003-v656-journey-sim-category-png';
const NOPALERO_CREDENTIAL_LOGO='data:image/webp;base64,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';
window.LJR_CREDENTIAL_NOPALERO_LOGO=NOPALERO_CREDENTIAL_LOGO;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>location.hash.replace(/^#\//,'').split('?')[0]||'home';
const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const FAN_STORE='lj-fanzone-one-vote-v157';
const FAN_KEYS=['fire','goal','clap','heart'];
const V190_RECRUIT_KEY='v189-recruitment';
const V190_RECRUIT_CAMPAIGN_KEY='v190-recruit-campaign';
const V198_LEAGUE_LOGO='data:image/png;base64,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';
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
function go(r){
  const gate=window.LJR_ADMIN_ROUTE;
  if(gate?.routes?.has?.(r)){gate.open(r);return}
  if(window.LJR_MAIN_ROUTE?.go){window.LJR_MAIN_ROUTE.go(r);return}
  location.hash='#/'+r
}
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
  '2':{category:'Veteranos 35+',teams:['Boavista','Franco-Tavera-JR','Huracán','Cuenda','América','Aguilares','Juventus','Leyendas FC','PSV','La Trinidad']},
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
  const invalidTeamName=name=>{
    const n=norm(name);
    if(!n)return true;
    if(/^\d+\s+goles?\s+en\s+temporada$/.test(n))return true;
    if(/^\d+\s+goles?$/.test(n))return true;
    if(/^(goles?|goleadores?|goleo|pts|puntos|pj|pg|pe|pp|gf|gc|dif)(\b|\s)/.test(n))return true;
    return false;
  };
  const seen=new Set();return out.filter(x=>{
    if(invalidTeamName(x?.name))return false;
    const k=norm(x.name)+'|'+x.cat;
    if(seen.has(k))return false;
    seen.add(k);return true;
  });
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
      button('📲','Instalar app','PWA · APK Android · acceso directo iPhone/iPad','install-app')+
      button('📁','Historia','Temporadas, campeones, finales y archivo histórico','', 'history')+
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
    inlineTool('📁','Historia','Temporadas, campeones, finales y archivo histórico','', 'history'),
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
    inlineTool('📲','Instalar app','PWA · APK Android · acceso directo iOS','install-app'),
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
  try{
    if(localStorage.getItem('v476-red-credential-default')!=='1'){
      saved.credentialStyle='red';
      write('v100-credential-extra',saved);
      localStorage.setItem('v476-red-credential-default','1');
    }
  }catch(_){saved.credentialStyle=saved.credentialStyle||'red'}
  return '<section class="v100-subblock" id="v100-credential-extra">'+sectionTitle('DATOS COMPLEMENTARIOS','Registro de credencial','La fecha de nacimiento ayuda a validar la CURP. Los demás datos se mantienen simples para agilizar el registro.')+
    '<div class="v100-form-grid">'+
      '<label><span>Fecha de nacimiento</span><input type="date" data-v100-dob value="'+esc(saved.dob||'')+'"></label>'+
      '<label><span>Edad</span><input type="text" data-v100-age readonly value="'+esc(saved.age||'')+'"></label>'+
      '<label><span>Posición</span><select data-v100-position>'+['Portero','Defensa','Mediocampista','Delantero','Sin definir'].map(x=>'<option '+(saved.position===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
      '<label><span>Temporada</span><input type="text" data-v100-season value="'+esc(saved.season||'2026–2027')+'"></label>'+
      '<label><span>Estatus del registro</span><select data-v100-status>'+['Pendiente de validación','Revisado','Habilitado'].map(x=>'<option '+(saved.status===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
      '<label><span>Diseño de credencial</span><select data-v100-credential-style disabled aria-label="Diseño oficial de credencial">'+
        '<option value="red" selected>Roja clásica · credencial oficial</option>'+
      '</select></label>'+
    '</div>'+
    '<div class="v196-classic-preview" data-v196-classic-preview>'+
      '<div class="v196-preview-head"><span><small>DISEÑO DE CREDENCIAL FÍSICA</small><b>Vista previa exacta del formato clásico</b></span><em>85.60 × 53.98 mm · tamaño INE</em></div>'+
      '<div class="v196-preview-frame"><canvas width="1011" height="638" data-v196-preview-canvas aria-label="Vista previa de credencial"></canvas></div>'+

    '</div>'+
    '<div class="v100-actions"><button class="v100-primary" data-v100-credential-png>Descargar imagen PNG</button><button class="v100-secondary" data-v100-credential-pdf>Descargar PDF · tamaño INE</button><button class="v100-secondary" data-v100-credential-share>Compartir imagen</button><button class="v100-secondary" data-v198-league-logo-png>Descargar logo Liga PNG</button></div>'+

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
    season:$('[data-v100-season]')?.value||'',status:$('[data-v100-status]')?.value||'',
    credentialStyle:'red'
  };
  write('v100-credential-extra',d);
}
async function v100LoadImage(src){
  if(!src)return null;
  return new Promise(resolve=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src});
}
const v476TeamLogoCache=new Map();
async function v476TransparentTeamLogo(src){
  if(!src)return null;
  if(v476TeamLogoCache.has(src))return v476TeamLogoCache.get(src);
  const img=await v100LoadImage(src);
  if(!img){v476TeamLogoCache.set(src,null);return null}
  if(/^data:image\/webp;base64,/i.test(String(src))){
    /* V512 — Deportivo Nopalero:
       quitar ÚNICAMENTE el fondo negro exterior.
       NO usar flood-fill por negro porque el contorno negro del escudo está
       conectado visualmente con detalles internos y terminaba borrando
       balón, nopales, letras, banderas y la parte central.
       Estrategia:
       1) detectar todos los píxeles visibles que NO son fondo negro neutro;
       2) conservar cualquier negro que quede dentro del cuerpo real del logo
          (encerrado por contenido en su misma fila y columna);
       3) conservar además un borde negro de hasta 4 px junto al contenido;
       4) volver transparente solamente el negro exterior restante. */
    const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
    const max=520,sc=Math.min(1,max/Math.max(iw,ih)),w=Math.max(1,Math.round(iw*sc)),h=Math.max(1,Math.round(ih*sc));
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;
    const q=cv.getContext('2d',{willReadFrequently:true});
    q.clearRect(0,0,w,h);q.drawImage(img,0,0,w,h);

    let data;try{data=q.getImageData(0,0,w,h)}catch(_){v476TeamLogoCache.set(src,img);return img}
    const d=data.data,n=w*h;
    const seed=new Uint8Array(n),near=new Uint8Array(n);
    const rowMin=new Int32Array(h),rowMax=new Int32Array(h),colMin=new Int32Array(w),colMax=new Int32Array(w);
    rowMin.fill(w);rowMax.fill(-1);colMin.fill(h);colMax.fill(-1);

    const isOuterBlack=p=>{
      const k=p*4;
      if(d[k+3]===0)return true;
      const r=d[k],g=d[k+1],b=d[k+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
      return hi<=62 && (hi-lo)<=24;
    };

    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const p=y*w+x,k=p*4;
      if(d[k+3]===0||isOuterBlack(p))continue;
      seed[p]=1;near[p]=1;
      if(x<rowMin[y])rowMin[y]=x;if(x>rowMax[y])rowMax[y]=x;
      if(y<colMin[x])colMin[x]=y;if(y>colMax[x])colMax[x]=y;
    }

    /* Expande SOLO cuatro píxeles alrededor del contenido para conservar
       el contorno negro original sin fabricar un rectángulo/halo negro. */
    for(let pass=0;pass<4;pass++){
      const prev=new Uint8Array(near);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const p=y*w+x;if(prev[p])continue;
        let hit=false;
        for(let oy=-1;oy<=1&&!hit;oy++)for(let ox=-1;ox<=1;ox++){
          if(!ox&&!oy)continue;
          const nx=x+ox,ny=y+oy;
          if(nx>=0&&nx<w&&ny>=0&&ny<h&&prev[ny*w+nx]){hit=true;break}
        }
        if(hit)near[p]=1;
      }
    }

    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const p=y*w+x;
      if(!isOuterBlack(p))continue;
      const insideRow=rowMax[y]>=0&&x>=rowMin[y]&&x<=rowMax[y];
      const insideCol=colMax[x]>=0&&y>=colMin[x]&&y<=colMax[x];
      const belongsToLogo=near[p]||(insideRow&&insideCol);
      if(!belongsToLogo)d[p*4+3]=0;
    }

    q.putImageData(data,0,0);
    v476TeamLogoCache.set(src,cv);
    return cv;
  }
  const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
  const max=420,scale=Math.min(1,max/Math.max(iw,ih)),w=Math.max(1,Math.round(iw*scale)),h=Math.max(1,Math.round(ih*scale));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const q=cv.getContext('2d',{willReadFrequently:true});
  q.clearRect(0,0,w,h);q.drawImage(img,0,0,w,h);

  let data;try{data=q.getImageData(0,0,w,h)}catch(_){v476TeamLogoCache.set(src,img);return img}
  const d=data.data,n=w*h,samples=[];
  const take=(xx,yy)=>{const k=(yy*w+xx)*4;if(d[k+3]>20)samples.push([d[k],d[k+1],d[k+2]])};
  const step=Math.max(1,Math.floor(Math.min(w,h)/90));
  for(let xx=0;xx<w;xx+=step){take(xx,0);take(xx,h-1)}
  for(let yy=0;yy<h;yy+=step){take(0,yy);take(w-1,yy)}
  if(!samples.length){v476TeamLogoCache.set(src,cv);return cv}

  const median=arr=>{const a=arr.slice().sort((x,y)=>x-y);return a[(a.length/2)|0]};
  const br=median(samples.map(p=>p[0])),bg=median(samples.map(p=>p[1])),bb=median(samples.map(p=>p[2]));
  const spread=Math.sqrt(samples.reduce((sum,p)=>{
    const dr=p[0]-br,dg=p[1]-bg,db=p[2]-bb;return sum+dr*dr+dg*dg+db*db;
  },0)/samples.length);
  const special=/nopalero/i.test(String(src));
  const tol=Math.max(special?118:72,Math.min(special?150:118,58+spread*3.25)),tol2=tol*tol;
  const lumBg=.2126*br+.7152*bg+.0722*bb;

  const seen=new Uint8Array(n),queue=new Int32Array(n);let head=0,tail=0;
  const near=i=>{
    const k=i*4;if(d[k+3]===0)return true;
    const r=d[k],g=d[k+1],b=d[k+2],dr=r-br,dg=g-bg,db=b-bb;
    const lum=.2126*r+.7152*g+.0722*b;
    return dr*dr+dg*dg+db*db<=tol2 && lum<=Math.max(178,lumBg+108);
  };
  const push=i=>{if(i<0||i>=n||seen[i]||!near(i))return;seen[i]=1;queue[tail++]=i};
  for(let xx=0;xx<w;xx++){push(xx);push((h-1)*w+xx)}
  for(let yy=0;yy<h;yy++){push(yy*w);push(yy*w+w-1)}
  while(head<tail){
    const i=queue[head++],xx=i%w,yy=(i/w)|0;
    if(xx>0)push(i-1);if(xx<w-1)push(i+1);if(yy>0)push(i-w);if(yy<h-1)push(i+w);
    if(xx>0&&yy>0)push(i-w-1);if(xx<w-1&&yy>0)push(i-w+1);
    if(xx>0&&yy<h-1)push(i+w-1);if(xx<w-1&&yy<h-1)push(i+w+1);
  }
  for(let i=0;i<n;i++)if(seen[i])d[i*4+3]=0;

  const copy=new Uint8Array(seen),fringeTol=tol*1.20,fringeTol2=fringeTol*fringeTol;
  for(let i=0;i<n;i++){
    if(copy[i])continue;
    const xx=i%w,yy=(i/w)|0;let touches=false;
    for(let oy=-1;oy<=1&&!touches;oy++)for(let ox=-1;ox<=1;ox++){
      if(!ox&&!oy)continue;const nx=xx+ox,ny=yy+oy;
      if(nx>=0&&nx<w&&ny>=0&&ny<h&&copy[ny*w+nx]){touches=true;break}
    }
    if(!touches)continue;
    const k=i*4,dr=d[k]-br,dg=d[k+1]-bg,db=d[k+2]-bb,dist=dr*dr+dg*dg+db*db;
    if(dist<=fringeTol2)d[k+3]=Math.min(d[k+3],dist<=tol2?18:92);
  }

  q.putImageData(data,0,0);
  v476TeamLogoCache.set(src,cv);
  return cv;
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

function v196RoundRectPath(ctx,x,y,w,h,r){
  const rr=Math.max(0,Math.min(r,Math.min(w,h)/2));
  ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
}
function v196DrawCoverImage(ctx,img,x,y,w,h){
  const iw=img?.naturalWidth||img?.width||0,ih=img?.naturalHeight||img?.height||0;if(!iw||!ih)return false;
  const scale=Math.max(w/iw,h/ih),dw=iw*scale,dh=ih*scale;
  ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return true;
}
function v196OutlinedText(ctx,text,x,y,fill='#fff',stroke='#111',width=6){
  ctx.save();ctx.lineJoin='round';ctx.miterLimit=2;ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.strokeText(text,x,y);ctx.fillStyle=fill;ctx.fillText(text,x,y);ctx.restore();
}
function v196FitFont(ctx,text,maxWidth,start,min=22,weight=900){
  let s=start;for(;s>min;s-=2){ctx.font=weight+' '+s+'px Arial,Helvetica,sans-serif';if(ctx.measureText(text).width<=maxWidth)break}return s;
}
function v196WrapName(ctx,name,maxWidth,maxLines=2){
  const words=String(name||'JUGADOR').toUpperCase().trim().split(/\s+/).filter(Boolean),lines=[];let line='';
  for(const w of words){
    const test=line?line+' '+w:w;
    if(ctx.measureText(test).width<=maxWidth||!line)line=test;
    else{lines.push(line);line=w;if(lines.length===maxLines-1)break}
  }
  if(line&&lines.length<maxLines)lines.push(line);
  const used=lines.join(' ').split(/\s+/).length;
  if(used<words.length&&lines.length)lines[lines.length-1]=lines[lines.length-1].replace(/\s*…?$/,'')+'…';
  return lines;
}
async function v196PlayerPhoto(){
  const file=v100PlayerPhotoFile();if(!file)return null;
  let url='';try{url=URL.createObjectURL(file);return await v100LoadImage(url)}catch(_){return null}finally{if(url)URL.revokeObjectURL(url)}
}
function v196CredentialTeamLogo(team){
  const wanted=norm(team);if(!wanted)return '';
  if(wanted==='dep nopalero'||wanted==='deportivo nopalero')return NOPALERO_CREDENTIAL_LOGO;
  try{
    const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
    const hit=Object.entries(db.team_logos||{}).find(([name])=>norm(name)===wanted);
    if(hit){
      const v=hit[1];
      const p=typeof v==='string'?v:(v?.local||v?.source||'');
      if(p)return /^https?:/i.test(p)?p:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(p).replace(/^\.\//,'');
    }
  }catch(_){}
  try{
    const t=officialTeams().find(x=>norm(x.name)===wanted);
    if(t?.logo)return t.logo;
  }catch(_){}
  const direct=teamLogo(team);
  return direct||'';
}
let v200LeagueLogoCache=null;
let v200LeagueLogoPromise=null;
async function v200LeagueLogoTransparent(){
  if(v200LeagueLogoCache)return v200LeagueLogoCache;
  if(v200LeagueLogoPromise)return v200LeagueLogoPromise;
  v200LeagueLogoPromise=v100LoadImage(V198_LEAGUE_LOGO).then(img=>{
    v200LeagueLogoCache=img||null;
    return v200LeagueLogoCache;
  }).catch(()=>{
    v200LeagueLogoPromise=null;
    return null;
  });
  return v200LeagueLogoPromise;
}
function v200DrawVideoCredentialBackground(x,W,H){
  const bg=x.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#03157c');bg.addColorStop(.48,'#0736b5');bg.addColorStop(1,'#020a4f');x.fillStyle=bg;x.fillRect(0,0,W,H);
  const halo=x.createRadialGradient(W*.50,H*.47,40,W*.50,H*.47,H*.55);
  halo.addColorStop(0,'rgba(0,224,255,.25)');halo.addColorStop(.45,'rgba(21,104,255,.20)');halo.addColorStop(1,'rgba(1,8,62,0)');
  x.fillStyle=halo;x.fillRect(0,0,W,H);
  const cx=W*.50,cy=H*.49,r=H*.43;
  x.save();x.shadowBlur=22;x.shadowColor='#19dcff';x.lineWidth=5;x.strokeStyle='rgba(68,226,255,.90)';x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.stroke();x.restore();
  const arcs=[
    [-2.87,-2.35,'#1de9ff'],[-2.35,-1.95,'#54ff9f'],[-1.95,-1.43,'#ff36d8'],[-1.43,-.74,'#30a4ff'],[-.74,-.14,'#12efff']
  ];
  x.save();x.lineWidth=6;x.shadowBlur=14;
  arcs.forEach(([a,b,col])=>{x.strokeStyle=col;x.shadowColor=col;x.beginPath();x.arc(cx,cy,r,a,b);x.stroke()});x.restore();
  const seams=[
    [[230,265],[345,210],[470,240],[575,185]],
    [[345,210],[395,330],[520,350],[645,280]],
    [[470,240],[520,350],[710,365],[815,290]],
    [[300,410],[395,330],[520,350],[595,475]],
    [[595,475],[710,365],[825,438]],
    [[245,510],[360,445],[300,410]],
    [[825,438],[915,525]]
  ];
  const cols=['#22eaff','#5cff9b','#ff35d7','#5c9dff'];
  x.save();x.lineCap='round';x.lineJoin='round';x.lineWidth=4;x.shadowBlur=10;
  seams.forEach((pts,i)=>{const col=cols[i%cols.length];x.strokeStyle=col;x.shadowColor=col;x.beginPath();pts.forEach((p,j)=>j?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke()});x.restore();
  [[210,332],[790,355],[505,152],[914,480],[96,470]].forEach(([sx,sy])=>{
    x.save();x.strokeStyle='rgba(220,255,255,.96)';x.shadowColor='#7ff6ff';x.shadowBlur=15;x.lineWidth=2;
    x.beginPath();x.moveTo(sx-20,sy);x.lineTo(sx+20,sy);x.moveTo(sx,sy-20);x.lineTo(sx,sy+20);x.stroke();
    x.fillStyle='#fff';x.beginPath();x.arc(sx,sy,4,0,Math.PI*2);x.fill();x.restore();
  });
  x.save();x.lineWidth=3;x.shadowBlur=10;x.shadowColor='#21cfff';
  [H*.79,H*.84,H*.89].forEach((yy,i)=>{x.strokeStyle='rgba(45,188,255,'+(0.72-i*.18)+')';x.beginPath();x.ellipse(cx,yy,W*.64,H*.20,0,Math.PI,Math.PI*2);x.stroke()});
  x.restore();
  for(let xx=38;xx<W;xx+=40){const yy=H*.87+12*Math.sin(xx/72);x.fillStyle='rgba(195,247,255,.88)';x.fillRect(xx,yy,3,3)}
  const floor=x.createLinearGradient(0,H*.84,0,H);floor.addColorStop(0,'rgba(0,88,255,.14)');floor.addColorStop(1,'rgba(0,10,75,.62)');x.fillStyle=floor;x.fillRect(0,H*.82,W,H*.18);
  x.save();x.fillStyle='rgba(2,10,68,.22)';v196RoundRectPath(x,250,86,460,510,38);x.fill();x.strokeStyle='rgba(83,177,255,.18)';x.lineWidth=2;x.stroke();x.restore();
}
async function v197DrawBlueCredential(canvas){
  if(!canvas)return null;
  canvas.width=1011;canvas.height=638;
  const x=canvas.getContext('2d'),W=1011,H=638;
  const name=($('[data-v64-cred-name]')?.value||'Jugador').trim();
  const team=($('[data-v64-cred-team]')?.value||'Equipo').trim();
  const cat=$('[data-v64-cred-team]')?.selectedOptions?.[0]?.dataset?.category||$('[data-v64-cred-cat]')?.value||'Categoría';
  const curp=($('[data-v64-cred-curp]')?.value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18);

  x.clearRect(0,0,W,H);
  x.save();v196RoundRectPath(x,5,5,W-10,H-10,34);x.clip();

  /* V200: fondo neón basado en el video de referencia. */
  v200DrawVideoCredentialBackground(x,W,H);

  let trophy=await v100LoadImage('./assets/reference/final-trophy-drive.png');
  if(!trophy)trophy=await v100LoadImage('./final-trophy-drive.png');
  if(trophy){
    x.save();x.globalAlpha=.98;x.shadowColor='rgba(5,4,54,.88)';x.shadowBlur=26;x.shadowOffsetY=10;
    v100DrawContainedImage(x,trophy,275,88,420,505);
    x.restore();
  }else{
    x.save();x.globalAlpha=.28;x.fillStyle='#b9d5ff';x.font='900 82px Arial';x.textAlign='center';x.fillText('TROFEO',485,355);x.restore();x.textAlign='left';
  }
  const blueShade=x.createLinearGradient(0,0,0,H);blueShade.addColorStop(0,'rgba(1,11,65,.02)');blueShade.addColorStop(1,'rgba(1,7,48,.24)');x.fillStyle=blueShade;x.fillRect(0,0,W,H);

  x.strokeStyle='rgba(206,222,255,.34)';x.lineWidth=4;v196RoundRectPath(x,8,8,W-16,H-16,31);x.stroke();

  x.fillStyle='#fff';x.textAlign='left';x.textBaseline='alphabetic';
  x.shadowColor='rgba(0,0,0,.42)';x.shadowBlur=5;
  x.font='900 39px Arial,Helvetica,sans-serif';x.fillText('Liga Municipal De Fútbol',42,70);
  x.font='900 37px Arial,Helvetica,sans-serif';x.fillText('“Juventino Rosas, A.C.”',42,119);
  x.shadowBlur=0;

  const catShort=String(cat||'Categoría').replace(/\s*Fuerza/ig,'').replace(/Veteranos\s*/ig,'Vet. ').trim();
  x.fillStyle='rgba(255,255,255,.70)';x.font='800 31px Arial,Helvetica,sans-serif';x.fillText(catShort,95,356);

  const player=await v196PlayerPhoto(),px=715,py=92,pw=250,ph=302;
  x.save();v196RoundRectPath(x,px,py,pw,ph,8);x.clip();x.fillStyle='#d5d8e4';x.fillRect(px,py,pw,ph);
  if(player)v196DrawCoverImage(x,player,px,py,pw,ph);
  else{x.fillStyle='#8392b2';x.fillRect(px,py,pw,ph);x.fillStyle='#fff';x.font='900 30px Arial';x.textAlign='center';x.fillText('FOTO',px+pw/2,py+ph/2+10);x.textAlign='left'}
  x.restore();x.strokeStyle='rgba(6,17,56,.55)';x.lineWidth=3;v196RoundRectPath(x,px,py,pw,ph,8);x.stroke();

  const league=await v200LeagueLogoTransparent();
  if(league){
    /* Logo de la Liga al costado del nombre, como en la credencial de referencia. */
    x.save();x.shadowColor='rgba(0,0,0,.38)';x.shadowBlur=7;
    v100DrawContainedImage(x,league,24,447,168,168);
    x.restore();
  }

  /* La credencial azul original NO lleva escudo del equipo: sólo el nombre debajo de la foto. */
  x.font='900 37px Arial,Helvetica,sans-serif';x.textAlign='center';
  const teamLabel=team.toUpperCase(),teamFont=v196FitFont(x,teamLabel,255,37,22,900);x.font='900 '+teamFont+'px Arial,Helvetica,sans-serif';
  v196OutlinedText(x,teamLabel,840,447,'#f4d553','#3655a3',5);
  x.textAlign='left';

  const nameUpper=name.toUpperCase();
  const nameSize=v196FitFont(x,nameUpper,690,39,25,900);x.font='900 '+nameSize+'px Arial,Helvetica,sans-serif';
  v196OutlinedText(x,nameUpper,210,586,'#f56a55','#6b2738',6);

  x.font='800 18px Arial,Helvetica,sans-serif';x.fillStyle='rgba(255,255,255,.78)';
  x.fillText(curp?'CURP '+curp:'CURP POR CAPTURAR',690,610);

  x.restore();
  return canvas;
}
async function v196DrawClassicCredential(canvas){
  const style='red';
  if(!canvas)return null;
  canvas.width=1011;canvas.height=638;
  const x=canvas.getContext('2d'),W=1011,H=638;
  const name=($('[data-v64-cred-name]')?.value||'Jugador').trim();
  const team=($('[data-v64-cred-team]')?.value||'Equipo').trim();
  const cat=$('[data-v64-cred-team]')?.selectedOptions?.[0]?.dataset?.category||$('[data-v64-cred-cat]')?.value||'Categoría';
  const curp=($('[data-v64-cred-curp]')?.value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18);

  x.clearRect(0,0,W,H);
  x.save();v196RoundRectPath(x,5,5,W-10,H-10,34);x.clip();

  /* Credencial física roja de referencia: cuerpo magenta y franja verde. */
  /* Fondo físico limpio: sin rayas blancas ni adornos diagonales. */
  x.fillStyle='#d83f60';x.fillRect(0,0,W,H);
  x.fillStyle='#0a8049';x.fillRect(0,0,W,126);

  /* Borde doble oscuro/rojizo del plástico. */
  x.strokeStyle='#17191d';x.lineWidth=5;v196RoundRectPath(x,8,8,W-16,H-16,31);x.stroke();
  x.strokeStyle='#8f2340';x.lineWidth=3;v196RoundRectPath(x,17,17,W-34,H-34,26);x.stroke();

  /* Logo de la Liga: transparente, sin cuadro. */
  const league=await v200LeagueLogoTransparent();
  if(league){
    x.save();x.shadowColor='rgba(0,0,0,.28)';x.shadowBlur=5;
    v100DrawContainedImage(x,league,22,14,170,150);
    x.restore();
  }

  /* Encabezado centrado. */
  x.textAlign='center';x.textBaseline='alphabetic';x.fillStyle='#fff';
  x.shadowColor='rgba(0,0,0,.42)';x.shadowBlur=3;
  x.font='900 31px Arial,Helvetica,sans-serif';x.fillText('LIGA MUNICIPAL DE FUTBOL JUVENTINO',575,50);
  x.font='900 31px Arial,Helvetica,sans-serif';x.fillText('ROSAS',575,87);
  x.shadowBlur=0;x.textAlign='left';

  /* Escudo del equipo PNG SIN fondo y sin recuadro blanco. */
  const teamSrc=v196CredentialTeamLogo(team),teamImg=await v476TransparentTeamLogo(teamSrc);
  if(teamImg){
    v100DrawContainedImage(x,teamImg,826,116,165,165);
  }else{
    x.save();x.fillStyle='rgba(255,255,255,.18)';v196RoundRectPath(x,846,142,118,118,10);x.fill();
    x.fillStyle='#fff';x.font='900 20px Arial';x.textAlign='center';x.fillText('EQUIPO',905,210);x.restore();x.textAlign='left';
  }

  /* Foto circular en la misma zona de la referencia. */
  const photo=await v196PlayerPhoto(),cx=205,cy=365,r=131;
  x.save();x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.clip();
  x.fillStyle='#9fb0ba';x.fillRect(cx-r,cy-r,r*2,r*2);
  if(photo)v196DrawCoverImage(x,photo,cx-r,cy-r,r*2,r*2);
  else{x.fillStyle='#899aa5';x.fillRect(cx-r,cy-r,r*2,r*2);x.fillStyle='#fff';x.textAlign='center';x.font='900 28px Arial';x.fillText('FOTO',cx,cy+10)}
  x.restore();x.textAlign='left';
  x.beginPath();x.arc(cx,cy,r+5,0,Math.PI*2);x.strokeStyle='#075b38';x.lineWidth=9;x.stroke();
  x.beginPath();x.arc(cx,cy,r+11,0,Math.PI*2);x.strokeStyle='rgba(25,28,28,.72)';x.lineWidth=3;x.stroke();

  /* Nombre del jugador y datos. */
  const textX=392,textW=430;
  x.font='900 39px Arial,Helvetica,sans-serif';
  const fitted=v196FitFont(x,name.toUpperCase(),textW,39,24,900);x.font='900 '+fitted+'px Arial,Helvetica,sans-serif';
  const lines=v196WrapName(x,name,textW,2),baseY=292,lineH=fitted+7;
  lines.forEach((line,i)=>v196OutlinedText(x,line,textX,baseY+i*lineH,'#fff','#111',7));

  x.font='900 31px Arial,Helvetica,sans-serif';
  v196OutlinedText(x,'Categoría: '+String(cat).replace(/^Categoria:?\s*/i,''),textX,405,'#111','#f2f2f2',5);
  x.font='900 29px Arial,Helvetica,sans-serif';
  v196OutlinedText(x,'CURP: '+(curp||'POR CAPTURAR'),textX,466,'#111','#f1f1f1',5);

  /* Nombre del equipo abajo a la izquierda, como la credencial roja física. */
  x.font='900 45px Arial,Helvetica,sans-serif';
  const teamSize=v196FitFont(x,team.toUpperCase(),330,45,25,900);x.font='900 '+teamSize+'px Arial,Helvetica,sans-serif';
  v196OutlinedText(x,team.toUpperCase(),45,592,'#fff','#111',7);

  x.restore();
  return canvas;
}

let v196PreviewSeq=0;
async function v196RenderCredentialPreview(){
  if((location.hash||'').replace(/^#\/?/,'').split('?')[0]!=='credentialBuilder')return;
  /* V496: V480 es el único dueño de la vista previa. Antes este renderer
     antiguo podía pintar "FOTO" encima después de que V480 ya había cargado
     la imagen real del jugador. */
  /* V1008: la credencial roja V480 ya programa una sola vista previa.
     Evitar múltiples renderizados asíncronos por cada tecla y cambio. */
  if(window.LJR_V480?.schedulePreview){window.LJR_V480.schedulePreview(180);return}
  if(window.LJR_V480?.render){window.LJR_V480.render();return}
  const canvas=$('[data-v196-preview-canvas]');if(!canvas)return;
  const seq=++v196PreviewSeq;
  /* Renderiza fuera de pantalla para evitar que dos actualizaciones asíncronas
     dibujen texto una encima de otra mientras cargan foto/logos/trofeo. */
  const off=document.createElement('canvas');
  await v196DrawClassicCredential(off);
  if(seq!==v196PreviewSeq)return;
  canvas.width=off.width;canvas.height=off.height;
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(off,0,0);
  const head=$('[data-v196-classic-preview] .v196-preview-head b');
  if(head)head.textContent='Vista previa · credencial oficial roja de la Liga';
}
async function v198LeagueLogoPng(){
  const img=await v200LeagueLogoTransparent();if(!img)return null;
  const side=700,canvas=document.createElement('canvas');canvas.width=side;canvas.height=side;
  const x=canvas.getContext('2d');x.clearRect(0,0,side,side);
  /* PNG transparente real: sin fondo negro/blanco, sin SVG. */
  v100DrawContainedImage(x,img,25,25,side-50,side-50);
  return canvasBlob(canvas);
}
async function credentialCanvas(){
  syncCredentialExtra();
  const canvas=document.createElement('canvas');
  await v196DrawClassicCredential(canvas);
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
    const pdf=new JS({orientation:'landscape',unit:'mm',format:[85.60,53.98]});
    if(img)pdf.addImage(img,'PNG',0,0,85.60,53.98,undefined,'FAST');
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
  $$('input,select,textarea',root).forEach(el=>{el.addEventListener('input',()=>{syncCredentialExtra();v196RenderCredentialPreview()});el.addEventListener('change',()=>{syncCredentialExtra();v196RenderCredentialPreview()})});
  ['[data-v64-cred-name]','[data-v64-cred-curp]','[data-v64-cred-team]','[data-v64-cred-cat]'].forEach(sel=>{
    const el=$(sel);if(!el||el.dataset.v196PreviewBound)return;el.dataset.v196PreviewBound='1';
    el.addEventListener('input',v196RenderCredentialPreview);el.addEventListener('change',()=>setTimeout(v196RenderCredentialPreview,20));
  });
  const photoInput=$('[data-v64-photo]');
  if(photoInput&&!photoInput.dataset.v196PreviewBound){photoInput.dataset.v196PreviewBound='1';photoInput.addEventListener('change',()=>setTimeout(v196RenderCredentialPreview,40))}
  syncCredentialExtra();setTimeout(v196RenderCredentialPreview,60);

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
  $('[data-v198-league-logo-png]',root)?.addEventListener('click',async()=>{const b=await v198LeagueLogoPng();if(b)download(b,'Logo_Liga_Municipal_Juventino_Rosas.png')});
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
const FIELD_META={
  'campo 1 unidad deportiva sur':{precision:'complex',label:'Complejo deportivo'},
  'campo 2 unidad deportiva sur':{precision:'complex',label:'Complejo deportivo'},
  'campo 3 unidad deportiva sur':{precision:'complex',label:'Complejo deportivo'},
  'campo 4 emiliano zapata':{precision:'near-field',label:'Referencia del campo'},
  'cerrito de gasca':{precision:'exact',label:'Ubicación verificada'},
  'tavera':{precision:'exact',label:'Ubicación verificada'},
  'san juan de la cruz':{precision:'exact',label:'Ubicación verificada'},
  'santiago de cuenda':{precision:'locality',label:'Referencia de localidad'},
  'san antonio de romerillo':{precision:'exact',label:'Ubicación verificada'},
  'fraccionamiento comontuoso':{precision:'locality',label:'Referencia de localidad'},
  'pozos':{precision:'exact',label:'Ubicación verificada'},
  'rincon de centeno':{precision:'locality',label:'Referencia de localidad'},
  'san jose de la montana':{precision:'exact',label:'Ubicación verificada'},
  'san julian tierra blanca':{precision:'exact',label:'Ubicación verificada'}
};
function weatherFieldOptions(){
 const build=(key,name,coord)=>{const meta=FIELD_META[key]||{precision:'regional',label:'Referencia meteorológica'};return {key,name,coord,precision:meta.precision,precisionLabel:meta.label}};
 const fromCards=$$('.v60-field-card').map(card=>{const name=$('.v60-field-top h3',card)?.textContent?.trim()||'';const community=$('.v60-field-top span',card)?.textContent?.trim()||'';const key=Object.keys(FIELD_COORDS).find(k=>norm(name+' '+community).includes(norm(k)));return key?build(key,name,FIELD_COORDS[key]):null}).filter(Boolean);
 if(fromCards.length)return fromCards;
 return Object.entries(FIELD_COORDS).map(([key,coord])=>build(key,FIELD_LABELS[key]||key,coord));
}
function weatherExtra(){const opts=weatherFieldOptions();const next=new Date(Date.now()+24*3600e3);next.setMinutes(0,0,0);const local=new Date(next.getTime()-next.getTimezoneOffset()*60000).toISOString().slice(0,16);return '<section class="v100-subblock v171-weather-inline" id="v100-weather-extra">'+sectionTitle('CENTRAL OPERATIVA V38','Clima inteligente del partido','Selecciona una cancha y la hora. El análisis se muestra aquí mismo sin salir de Clima.')+
  '<div class="v100-form-grid"><label><span>Campo</span><select data-v100-weather-field>'+opts.map((o,i)=>'<option value="'+i+'">'+esc(o.name)+'</option>').join('')+'</select></label><label><span>Hora del partido</span><input type="datetime-local" data-v100-weather-time value="'+local+'"></label></div>'+
  '<div class="v100-actions"><button class="v100-primary" data-v100-weather-run>Analizar campo</button><button class="v100-secondary" data-v100-weather-fields>Revisar campos</button><button class="v100-secondary" data-v100-weather-fixtures>Ver jornada</button></div>'+
  '<div class="v100-weather-inline-panel" data-v100-weather-inline-panel hidden></div>'+
  '<div class="v173-weather-output">'+
    '<div class="v100-weather-result" data-v100-weather-result><div class="v173-weather-empty">Selecciona campo y hora para consultar el pronóstico.</div></div>'+
    '<div class="v100-weather-ops"><button data-v100-weather-map>📍 Mapa</button><button data-v100-weather-directions>🧭 Cómo llegar</button><button data-v100-weather-google>☁️ Google clima</button><button data-v100-weather-pin>📌 Ajustar pin</button><button data-v100-weather-share disabled>Compartir aviso</button><button data-v100-weather-copy disabled>Copiar aviso</button></div>'+
    '<div class="v173-weather-official"><b>Automático ≠ oficial.</b> “SÍ/NO probable” es una recomendación meteorológica. El estado oficial Programado / Por confirmar / Retrasado / Suspendido sigue siendo decisión de la Liga tras revisar el terreno.</div>'+
  '</div>'+
  '</section>'}

function v173Clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function v173Num(v,d=0){return Number.isFinite(Number(v))?Number(v):d}
function v173Terrain(p24,p48){
 const a=v173Num(p24?.precipTotal),b=v173Num(p48?.precipTotal);
 if(a>=18||b>=30)return {level:'very-wet',label:'Muy saturado probable',detail:'La lluvia acumulada de las 24–48 h previas puede dejar zonas pesadas o encharcadas.'};
 if(a>=10||b>=18)return {level:'wet',label:'Pesado/húmedo probable',detail:'Hay acumulado suficiente para que el drenaje y la revisión física del campo sean importantes.'};
 if(a>=4||b>=8)return {level:'damp',label:'Humedad moderada probable',detail:'Hubo o se prevé lluvia previa; conviene revisar zonas blandas antes de autorizar.'};
 return {level:'dry',label:'Bajo impacto de lluvia previa',detail:'El acumulado de las 24–48 h previas es bajo según la referencia meteorológica.'};
}
function v173Verdict(probability){
 const p=v173Clamp(Math.round(v173Num(probability)),0,100);
 if(p>=80)return {key:'yes',label:'ALTA PROBABILIDAD DE JUGAR',short:'SÍ · MUY PROBABLE',tone:'good'};
 if(p>=65)return {key:'likely',label:'PROBABLEMENTE SE JUEGA',short:'SÍ · PROBABLE',tone:'good'};
 if(p>=45)return {key:'review',label:'REVISAR CAMPO · POR CONFIRMAR',short:'REVISAR',tone:'watch'};
 return {key:'risk',label:'ALTO RIESGO DE NO JUGAR',short:'NO · ALTO RIESGO',tone:'high'};
}
function v173Confidence(precision,hours){
 let x=92,p=String(precision||'regional');
 if(p==='exact'||p==='admin-pin')x=96;
 else if(p==='complex'||p==='near-field')x=88;
 else if(p==='locality')x=78;
 else if(p==='regional')x=64;
 else if(p==='pending')x=55;
 if(v173Num(hours?.hours)<3)x-=15;
 return v173Clamp(Math.round(x),35,98);
}
function v173Score(input){
 const m=input?.match||null,p24=input?.prior24||{},p48=input?.prior48||{},precision=input?.precision||'regional';
 if(!m)return {probability:null,confidence:v173Confidence(precision,p48),verdict:{key:'na',label:'SIN DATOS SUFICIENTES',short:'SIN DATOS',tone:'na'},terrain:v173Terrain(p24,p48),reasons:['No hay datos meteorológicos suficientes para el horario seleccionado.']};
 let score=96;const reasons=[];
 const code=v173Num(m.code),gust=v173Num(m.gustMax),rainMax=v173Num(m.rainMax),precipMax=v173Num(m.precipMax),prob=v173Num(m.probMax),p24sum=v173Num(p24.precipTotal),p48sum=v173Num(p48.precipTotal);
 if(code>=95){score-=42;reasons.push('Tormenta eléctrica prevista cerca del horario.')}else if(code>=80){score-=10;reasons.push('Tiempo inestable cerca del horario.')}
 if(rainMax>=8){score-=35;reasons.push('Lluvia horaria fuerte prevista durante la ventana del partido.')}else if(rainMax>=2.5){score-=25;reasons.push('Lluvia moderada prevista durante la ventana del partido.')}else if(rainMax>=1){score-=13;reasons.push('Lluvia ligera prevista durante la ventana del partido.')}
 if(prob>=85){score-=16;reasons.push('Probabilidad de precipitación muy alta a la hora del partido.')}else if(prob>=65){score-=10;reasons.push('Probabilidad de precipitación elevada a la hora del partido.')}else if(prob>=45){score-=5;reasons.push('Existe posibilidad de precipitación a la hora del partido.')}
 if(gust>=70){score-=24;reasons.push('Rachas de viento fuertes.')}else if(gust>=50){score-=10;reasons.push('Rachas de viento a vigilar.')}
 if(p48sum>=30){score-=31;reasons.push('Acumulado muy alto en las 48 h previas: posible saturación del terreno.')}else if(p48sum>=18){score-=23;reasons.push('Acumulado alto en las 48 h previas.')}else if(p48sum>=8){score-=13;reasons.push('Lluvia relevante en las 48 h previas.')}else if(p48sum>=3){score-=6;reasons.push('Algo de lluvia en las 48 h previas.')}
 if(p24sum>=18){score-=18;reasons.push('Mucha lluvia en las 24 h inmediatamente previas.')}else if(p24sum>=10){score-=12;reasons.push('Lluvia importante en las 24 h previas.')}else if(p24sum>=4){score-=6;reasons.push('Lluvia moderada en las 24 h previas.')}
 if(precipMax>=5&&rainMax<2.5){score-=6;reasons.push('Precipitación total relevante cerca del horario.')}
 score=v173Clamp(Math.round(score),5,98);
 if(!reasons.length)reasons.push('No se detectan señales meteorológicas fuertes ni acumulados importantes en las 48 h previas.');
 return {probability:score,confidence:v173Confidence(precision,p48),verdict:v173Verdict(score),terrain:v173Terrain(p24,p48),reasons};
}
function v173Summary(h,times,start,end){
 const ids=[];times.forEach((t,i)=>{const ms=new Date(t).getTime();if(ms>=start&&ms<=end)ids.push(i)});
 if(!ids.length)return null;
 const nums=(key)=>ids.map(i=>Number(h[key]?.[i])).filter(Number.isFinite);
 const sum=arr=>arr.reduce((a,b)=>a+b,0),max=arr=>arr.length?Math.max(...arr):null,avg=arr=>arr.length?sum(arr)/arr.length:null;
 const precip=nums('precipitation'),rain=nums('rain'),prob=nums('precipitation_probability'),temp=nums('temperature_2m'),gust=nums('wind_gusts_10m'),code=nums('weather_code');
 return {hours:ids.length,precipTotal:sum(precip),probMax:max(prob),rainMax:max(rain.length?rain:precip),precipMax:max(precip),temp:avg(temp),gustMax:max(gust),code:max(code)};
}
function v173Metric(label,value,sub=''){return '<div class="v173-weather-metric"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>'}
async function runWeather(root){
 const opts=weatherFieldOptions(),idx=Number($('[data-v100-weather-field]',root)?.value||0),f=opts[idx],time=$('[data-v100-weather-time]',root)?.value,out=$('[data-v100-weather-result]',root),share=$('[data-v100-weather-share]',root),copy=$('[data-v100-weather-copy]',root);
 if(!f||!time)return toast('Selecciona un campo y la hora del partido');
 out.innerHTML='<div class="v173-weather-loading">Consultando el campo seleccionado…</div>';
 share.disabled=true;if(copy)copy.disabled=true;
 try{
  const [lat,lon]=f.coord;
  const u='https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&hourly=precipitation_probability,precipitation,rain,weather_code,temperature_2m,wind_gusts_10m&past_days=2&forecast_days=16&timezone=America/Mexico_City';
  const j=await fetch(u).then(r=>{if(!r.ok)throw new Error('weather');return r.json()});
  const h=j.hourly||{},times=h.time||[],target=new Date(time).getTime();
  if(!times.length||!Number.isFinite(target))throw new Error('weather-data');
  const around=v173Summary(h,times,target-60*60e3,target+2*60*60e3);
  const p24=v173Summary(h,times,target-24*60*60e3,target-1);
  const p48=v173Summary(h,times,target-48*60*60e3,target-1);
  const result=v173Score({match:around,prior24:p24,prior48:p48,precision:f.precision});
  const verdict=result.verdict,score=result.probability==null?'—':result.probability+'%';
  const r24=p24?p24.precipTotal.toFixed(1)+' mm':'—',r48=p48?p48.precipTotal.toFixed(1)+' mm':'—';
  const wxProb=around?.probMax==null?'—':Math.round(around.probMax)+'%';
  const wxRain=around?.rainMax==null?'—':around.rainMax.toFixed(1)+' mm/h';
  const temp=around?.temp==null?'—':around.temp.toFixed(1)+' °C';
  const gust=around?.gustMax==null?'—':Math.round(around.gustMax)+' km/h';
  const when=new Intl.DateTimeFormat('es-MX',{hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date(target));
  const fieldLine=f.name+(f.precisionLabel?' · '+f.precisionLabel:'');
  const reasons=result.reasons.map(x=>'<li>'+esc(x)+'</li>').join('');
  const text=f.name+' · '+verdict.label+' · '+score+' · 24 h previas '+r24+' · 48 h previas '+r48+' · '+wxProb+' a la hora · '+wxRain+' · '+temp+' · rachas '+gust+'. La decisión oficial corresponde a la Liga.';
  root.dataset.weatherShare=text;
  out.innerHTML='<article class="v173-weather-analysis '+esc(verdict.tone)+'">'+
    '<div class="v173-weather-result-head"><div class="v173-weather-result-copy">'+
      '<span class="v173-weather-kicker">CONSULTA DIRECTA DE CAMPO</span>'+
      '<h3>'+esc(f.name)+'</h3>'+
      '<p>Condición meteorológica alrededor de '+esc(when)+'</p>'+
      '<p class="v173-weather-fieldline">'+esc(fieldLine)+'</p>'+
    '</div>'+
    '<div class="v173-weather-score '+esc(verdict.tone)+'"><span>Probabilidad orientativa</span><strong>'+esc(score)+'</strong><b>'+esc(verdict.short)+'</b><small>confianza '+esc(result.confidence)+'%</small></div></div>'+
    '<div class="v173-weather-verdict '+esc(verdict.tone)+'"><span>ASISTENTE INTELIGENTE</span><strong>'+esc(verdict.label)+'</strong><p>'+esc(result.terrain.label)+'. '+esc(result.terrain.detail)+'</p></div>'+
    '<div class="v173-weather-metrics">'+
      v173Metric('Lluvia 24 h previas',r24,'horas pasadas/modeladas')+
      v173Metric('Lluvia 48 h previas',r48,'horas pasadas/modeladas')+
      v173Metric('Prob. a la hora',wxProb,'ventana -1 h / +2 h')+
      v173Metric('Lluvia a la hora',wxRain,'máximo horario')+
      v173Metric('Temperatura',temp)+
      v173Metric('Racha máxima',gust)+
    '</div>'+
    '<details class="v173-weather-why"><summary>¿Por qué da esta probabilidad?</summary><ul>'+reasons+'</ul><p>El motor combina lluvia de las 24/48 h previas, lluvia/tormenta/viento cerca del horario y la precisión del pin. Es una estimación automática explicable, no una inspección física.</p></details>'+
  '</article>';
  share.disabled=false;if(copy)copy.disabled=false;
 }catch(e){
  out.innerHTML='<div class="v173-weather-error"><b>No se pudo actualizar el clima.</b><span>Intenta de nuevo en unos segundos.</span></div>';
 }
}
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
 if(mode==='forecast'){
  panel.hidden=true;
  root.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  setTimeout(()=>$('[data-v100-weather-field]',root)?.focus(),220);
  return;
 }
 if(mode==='fixtures'){
  const rows=weatherFixtureRows();
  panel.innerHTML='<b>Jornada dentro de Clima</b><small>Consulta rápida sin salir de esta pantalla.</small>'+
   (rows.length?rows.map(x=>'<article><strong>'+esc(x.home)+' vs '+esc(x.away)+'</strong><span>'+esc(x.cat)+(x.round?' · Jornada '+esc(x.round):'')+'</span><em>'+esc(x.date)+' · '+esc(x.venue)+'</em></article>').join(''):'<p>No hay partidos publicados para mostrar.</p>');
  panel.hidden=false;
  panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
  return;
 }
 const opts=weatherFieldOptions(),sel=$('[data-v100-weather-field]',root);
 panel.innerHTML='<b>Revisar campos</b><small>Elige una cancha. Se seleccionará arriba y se analizará aquí mismo, sin salir de Clima.</small>'+
   '<div class="v171-weather-field-list">'+opts.map((f,i)=>
     '<button type="button" class="v171-weather-field-pick" data-v171-weather-pick="'+i+'"><span>🏟️</span><b>'+esc(f.name)+'</b><i>›</i></button>'
   ).join('')+'</div>';
 panel.hidden=false;
 $$('[data-v171-weather-pick]',panel).forEach(b=>b.addEventListener('click',()=>{
   const i=Number(b.dataset.v171WeatherPick||0),f=opts[i];
   if(sel)sel.value=String(i);
   if(f)toast('Campo seleccionado: '+f.name);
   runWeather(root);
 }));
 panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
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
  $$('[data-v163-weather-inline]').forEach(b=>{
   if(b.dataset.v171Bound)return;
   b.dataset.v171Bound='1';
   b.addEventListener('click',()=>{
    const mode=b.dataset.v163WeatherInline||'forecast';
    showWeatherInline(root,mode==='fixtures'?'fixtures':mode==='fields'?'fields':'forecast');
   });
  });
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
function v936MatchIcon(kind){
  const shapes={
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M12 13v6M9 16h6"/>',
    card:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5.5 16c1-2 6-2 7 0M15 10h4M15 14h4"/>',
    weather:'<path d="M11 2v2M4.5 5.5l1.4 1.4M18 5l-1.4 1.4"/><circle cx="11" cy="10" r="4"/><path d="M6 21a4 4 0 0 1 1-7.6 5 5 0 0 1 9.1 1.1A3.5 3.5 0 1 1 17.5 21H6z"/>'
  };
  return '<span class="v936-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false">'+(shapes[kind]||shapes.calendar)+'</svg></span>';
}
function v936MatchAction(kind,title,desc,attributes,primary){
  return '<button type="button" class="'+(primary?'v100-primary':'v100-secondary')+'" '+attributes+'>'+
    v936MatchIcon(kind)+'<span class="v936-action-copy"><b>'+title+'</b><small>'+desc+'</small></span>'+
    '<span class="v936-arrow" aria-hidden="true">›</span></button>';
}
function matchExtra(){
  const h=$('.screen-title')?.textContent?.trim().replace(/\s+/g,' ')||'Partido de la Liga';
  const meta=$('.match-detail .muted.tiny')?.textContent?.trim()||'';
  return '<section class="v100-subblock" id="v100-match-extra">'+
    sectionTitle('PARTIDO','Acciones rápidas','Recordatorios y herramientas para este encuentro.')+
    '<div class="v100-form-grid">'+
      '<label><span>Fecha y hora del partido</span><input type="datetime-local" data-v100-reminder-time aria-label="Fecha y hora para recordar el partido"></label>'+
      '<label><span>Partido / sede</span><input type="text" data-v100-reminder-title value="'+esc(h)+'" data-meta="'+esc(meta)+'"></label>'+
    '</div>'+
    '<div class="v100-actions">'+
      v936MatchAction('calendar','Recordar partido','Agregar al calendario','data-v100-ics',true)+
      v936MatchAction('card','Cédula oficial','Consultar o crear','data-v100-route="cedulas"',false)+
      v936MatchAction('weather','Clima y campo','Consultar condiciones y sede','data-v100-route="weatherFields"',false)+
    '</div>'+
  '</section>';
}
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
function journeySim(){
  const allTeams=officialTeams();
  const CAT_ORDER=['3','5','4','2','1'];
  const CAT_META={
    '3':{name:'Primera Fuerza',logo:'./assets/branding/primera-fuerza-hd.png'},
    '5':{name:'Intermedia',logo:'./assets/categories/intermedia.webp'},
    '4':{name:'Segunda Fuerza',logo:'./assets/categories/segunda-fuerza.webp'},
    '2':{name:'Veteranos 35+',logo:'./assets/categories/veteranos-35-user.png'},
    '1':{name:'Veteranos 50+',logo:'./assets/categories/veteranos-50.webp'}
  };
  const uniq=(rows)=>{
    const seen=new Set();
    return rows.filter(t=>{
      const k=norm(t?.name);
      if(!k||seen.has(k))return false;
      seen.add(k);return true;
    });
  };
  const teamsFor=(cat)=>{
    const meta=CAT_META[String(cat)]||{};
    return uniq(allTeams.filter(t=>String(t?.cat||'')===String(cat)||(!t?.cat&&norm(t?.category)===norm(meta.name))));
  };
  const cats=CAT_ORDER.filter(id=>teamsFor(id).length).map(id=>({id,...CAT_META[id]}));
  if(!cats.length){
    const names=[...new Set(allTeams.map(t=>String(t?.category||'').trim()).filter(Boolean))];
    names.forEach((name,i)=>cats.push({id:'name-'+i,name,logo:'./assets/liga-logo.webp'}));
  }
  const byCat=(cat)=>{
    if(String(cat).startsWith('name-')){
      const c=cats.find(x=>x.id===cat);
      return uniq(allTeams.filter(t=>norm(t?.category)===norm(c?.name)));
    }
    return teamsFor(cat);
  };
  const categoryOptions=cats.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('');
  const m=modal(
    sectionTitle('ESCENARIO LOCAL','Simulador de jornada','Prueba un marcador hipotético. No modifica resultados ni tablas oficiales.')+
    '<div class="v100-js-category">'+
      '<label><span>Categoría</span><select data-js-category>'+categoryOptions+'</select></label>'+
      '<div class="v100-js-category-preview"><span class="v100-js-cat-logo"><img data-js-cat-logo alt=""></span><span><small>FILTRO ACTIVO</small><b data-js-cat-name></b></span></div>'+
    '</div>'+
    '<div class="v100-form-grid v100-js-grid">'+
      '<label><span>Local</span><select data-js-home></select></label>'+
      '<label><span>Visitante</span><select data-js-away></select></label>'+
      '<label><span>Goles local</span><input type="number" min="0" max="30" value="0" data-js-hg></label>'+
      '<label><span>Goles visitante</span><input type="number" min="0" max="30" value="0" data-js-ag></label>'+
    '</div>'+
    '<div class="v100-js-match-preview">'+
      '<div class="v100-js-team-card"><span><img data-js-home-logo alt=""></span><b data-js-home-name>Local</b></div>'+
      '<strong data-js-score>0 – 0</strong>'+
      '<div class="v100-js-team-card"><span><img data-js-away-logo alt=""></span><b data-js-away-name>Visitante</b></div>'+
    '</div>'+
    '<div class="v100-actions v100-js-actions"><button class="v100-primary" data-js-save>Guardar escenario</button><button class="v100-secondary v100-js-png" data-js-png>Guardar PNG</button></div>'+
    '<div data-js-list></div>',
    'v100-journey-modal'
  );

  const catSel=$('[data-js-category]',m),homeSel=$('[data-js-home]',m),awaySel=$('[data-js-away]',m),hg=$('[data-js-hg]',m),ag=$('[data-js-ag]',m);
  const currentCat=()=>cats.find(c=>c.id===catSel.value)||cats[0]||{id:'',name:'Liga Municipal',logo:'./assets/liga-logo.webp'};
  const logoSrc=(name)=>teamLogo(name)||'./assets/liga-logo.webp';
  const fillTeamOptions=(sel,list,selected,blocked)=>{
    sel.innerHTML=list.map(t=>'<option value="'+esc(t.name)+'" '+(t.name===selected?'selected':'')+' '+(t.name===blocked?'disabled':'')+'>'+esc(t.name)+'</option>').join('');
  };
  const chooseDifferent=(list,name)=>list.find(t=>t.name!==name)?.name||'';
  const syncPreview=()=>{
    const cat=currentCat(),home=homeSel.value,away=awaySel.value,homeLogo=logoSrc(home),awayLogo=logoSrc(away);
    const catImg=$('[data-js-cat-logo]',m),catName=$('[data-js-cat-name]',m),homeImg=$('[data-js-home-logo]',m),awayImg=$('[data-js-away-logo]',m);
    if(catImg)catImg.src=cat.logo||'./assets/liga-logo.webp';
    if(catName)catName.textContent=cat.name||'Liga Municipal';
    if(homeImg)homeImg.src=homeLogo;
    if(awayImg)awayImg.src=awayLogo;
    $('[data-js-home-name]',m).textContent=home||'Local';
    $('[data-js-away-name]',m).textContent=away||'Visitante';
    $('[data-js-score]',m).textContent=String(Math.max(0,Number(hg.value)||0))+' – '+String(Math.max(0,Number(ag.value)||0));
  };
  const syncDisabled=()=>{
    Array.from(homeSel.options).forEach(o=>o.disabled=o.value===awaySel.value);
    Array.from(awaySel.options).forEach(o=>o.disabled=o.value===homeSel.value);
  };
  const applyCategory=(keepHome='',keepAway='')=>{
    const list=byCat(catSel.value);
    if(!list.length){
      homeSel.innerHTML='<option>Sin equipos</option>';awaySel.innerHTML='<option>Sin equipos</option>';syncPreview();return;
    }
    const home=list.some(t=>t.name===keepHome)?keepHome:list[0].name;
    let away=list.some(t=>t.name===keepAway)&&keepAway!==home?keepAway:chooseDifferent(list,home);
    if(!away&&list[1])away=list[1].name;
    fillTeamOptions(homeSel,list,home,away);
    fillTeamOptions(awaySel,list,away,home);
    homeSel.value=home;
    awaySel.value=away||'';
    syncDisabled();syncPreview();
  };
  const enforceDifferent=(changed)=>{
    const list=byCat(catSel.value);
    if(homeSel.value===awaySel.value){
      if(changed==='home')awaySel.value=chooseDifferent(list,homeSel.value);
      else homeSel.value=chooseDifferent(list,awaySel.value);
    }
    syncDisabled();syncPreview();
  };

  catSel.onchange=()=>applyCategory();
  homeSel.onchange=()=>enforceDifferent('home');
  awaySel.onchange=()=>enforceDifferent('away');
  hg.oninput=syncPreview;
  ag.oninput=syncPreview;
  applyCategory();

  const render=()=>{
    const list=read('v100-journey-sim',[]),h=$('[data-js-list]',m);
    h.innerHTML=list.length?'<div class="v100-sim-list v100-js-saved-list">'+list.map((x,i)=>{
      const hl=logoSrc(x.home),al=logoSrc(x.away);
      return '<article class="v100-js-saved"><div class="v100-js-saved-match"><span class="v100-js-saved-team">'+(hl?'<img src="'+esc(hl)+'" alt="">':'')+'<b>'+esc(x.home)+'</b></span><strong>'+Number(x.hg||0)+'–'+Number(x.ag||0)+'</strong><span class="v100-js-saved-team">'+(al?'<img src="'+esc(al)+'" alt="">':'')+'<b>'+esc(x.away)+'</b></span></div><small>'+esc(x.category||'Escenario hipotético')+'</small><button data-js-del="'+i+'">Quitar</button></article>';
    }).join('')+'</div>':'<p class="v100-note">Sin escenarios guardados.</p>';
    $$('[data-js-del]',h).forEach(b=>b.onclick=()=>{list.splice(Number(b.dataset.jsDel),1);write('v100-journey-sim',list);render()});
  };
  render();

  $('[data-js-save]',m).onclick=()=>{
    const cat=currentCat();
    const x={category:cat.name,cat:cat.id,home:homeSel.value,away:awaySel.value,hg:Number(hg.value||0),ag:Number(ag.value||0)};
    if(!x.home||!x.away)return toast('Selecciona dos equipos');
    if(x.home===x.away)return toast('No puedes seleccionar el mismo equipo');
    const list=read('v100-journey-sim',[]);list.push(x);write('v100-journey-sim',list);render();toast('Escenario guardado');
  };

  const loadImage=(src)=>new Promise(resolve=>{
    if(!src)return resolve(null);
    const im=new Image();im.crossOrigin='anonymous';
    im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;
  });
  const drawContain=(ctx,img,x,y,w,h)=>{
    if(!img)return;
    const s=Math.min(w/img.width,h/img.height),dw=img.width*s,dh=img.height*s;
    ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
  };
  const roundRect=(ctx,x,y,w,h,r)=>{
    r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  };
  const fitText=(ctx,text,maxWidth,startSize,minSize=24)=>{
    let size=startSize;while(size>minSize){ctx.font='900 '+size+'px Arial';if(ctx.measureText(text).width<=maxWidth)break;size-=2}return size;
  };

  $('[data-js-png]',m).onclick=async e=>{
    const cat=currentCat(),home=homeSel.value,away=awaySel.value;
    if(!home||!away||home===away)return toast('Selecciona dos equipos distintos');
    e.currentTarget.disabled=true;
    try{
      const [catImg,homeImg,awayImg]=await Promise.all([loadImage(cat.logo),loadImage(logoSrc(home)),loadImage(logoSrc(away))]);
      const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');
      const bg=x.createLinearGradient(0,0,0,c.height);bg.addColorStop(0,'#0b1d8e');bg.addColorStop(.48,'#070b66');bg.addColorStop(1,'#02043c');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);
      const glow=x.createRadialGradient(540,250,10,540,250,520);glow.addColorStop(0,'rgba(35,101,255,.32)');glow.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=glow;x.fillRect(0,0,c.width,800);
      x.strokeStyle='#55e6f2';x.lineWidth=4;x.strokeRect(28,28,1024,1294);

      x.textAlign='center';x.fillStyle='#55e6f2';x.font='900 30px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL',540,86);
      x.fillStyle='#fff';x.font='900 44px Arial';x.fillText('JUVENTINO ROSAS',540,135);

      roundRect(x,410,170,260,150,34);x.fillStyle='rgba(7,16,95,.86)';x.fill();x.strokeStyle='rgba(85,230,242,.55)';x.lineWidth=3;x.stroke();
      drawContain(x,catImg,455,184,170,95);
      x.fillStyle='#55e6f2';x.font='900 19px Arial';x.fillText(cat.name.toUpperCase(),540,302);

      x.fillStyle='#fff';x.font='900 54px Arial';x.fillText('SIMULADOR DE JORNADA',540,390);
      x.fillStyle='#b9c8ef';x.font='700 24px Arial';x.fillText('ESCENARIO HIPOTÉTICO · NO OFICIAL',540,430);

      const cardY=510,cardW=390,cardH=470;
      [85,605].forEach(px=>{roundRect(x,px,cardY,cardW,cardH,38);x.fillStyle='rgba(9,19,105,.96)';x.fill();x.strokeStyle='rgba(80,102,230,.7)';x.lineWidth=3;x.stroke()});
      roundRect(x,155,570,250,250,36);x.fillStyle='rgba(255,255,255,.98)';x.fill();
      roundRect(x,675,570,250,250,36);x.fillStyle='rgba(255,255,255,.98)';x.fill();
      drawContain(x,homeImg,175,590,210,210);drawContain(x,awayImg,695,590,210,210);

      x.fillStyle='#55e6f2';x.font='900 18px Arial';x.fillText('LOCAL',280,858);x.fillText('VISITANTE',800,858);
      x.fillStyle='#fff';
      let sz=fitText(x,home,320,38,24);x.font='900 '+sz+'px Arial';x.fillText(home,280,912);
      sz=fitText(x,away,320,38,24);x.font='900 '+sz+'px Arial';x.fillText(away,800,912);

      x.fillStyle='#55e6f2';x.font='900 110px Arial';x.fillText(String(Math.max(0,Number(hg.value)||0)),445,760);x.fillText(String(Math.max(0,Number(ag.value)||0)),635,760);
      x.fillStyle='#fff';x.font='900 70px Arial';x.fillText('–',540,755);
      x.fillStyle='#c2cff3';x.font='700 24px Arial';x.fillText('MARCADOR SIMULADO',540,1035);

      roundRect(x,120,1090,840,130,28);x.fillStyle='rgba(3,9,75,.8)';x.fill();x.strokeStyle='rgba(85,230,242,.35)';x.lineWidth=2;x.stroke();
      x.fillStyle='#fff';x.font='900 26px Arial';x.fillText(cat.name.toUpperCase(),540,1145);
      x.fillStyle='#b9c8ef';x.font='700 21px Arial';x.fillText('No modifica resultados ni tablas oficiales',540,1190);
      x.fillStyle='#55e6f2';x.font='900 18px Arial';x.fillText('LIGA JUVENTINO ROSAS',540,1285);

      const blob=await canvasBlob(c);
      download(blob,'Simulador_'+cat.name.replace(/[^a-z0-9]+/gi,'_')+'_'+home.replace(/[^a-z0-9]+/gi,'_')+'_vs_'+away.replace(/[^a-z0-9]+/gi,'_')+'.png');
      toast('PNG guardado con logos y categoría');
    }catch(_){toast('No se pudo generar el PNG');}
    finally{e.currentTarget.disabled=false;}
  };
}
function shotmap(){
  const shots=read('v100-shotmap',[]);
  const arrows=read('v100-shotmap-arrows',[]);
  let shotMode='shot';
  let selected=null;
  let active=null;
  let draftArrow=null;

  const clamp=(v,min=1,max=99)=>Math.max(min,Math.min(max,Number(v)||0));
  const pointFromEvent=e=>{
    const r=pitch.getBoundingClientRect();
    return {
      x:+clamp(((e.clientX-r.left)/r.width)*100).toFixed(2),
      y:+clamp(((e.clientY-r.top)/r.height)*100).toFixed(2)
    };
  };
  const dist=(a,b)=>Math.hypot((a.x-b.x),(a.y-b.y));

  const pitchLines=
    '<div class="v100-shot-lines" aria-hidden="true">'+
      '<span class="v100-shot-goal top"></span><span class="v100-shot-goal bottom"></span>'+
      '<span class="v100-shot-box big top"></span><span class="v100-shot-box big bottom"></span>'+
      '<span class="v100-shot-box small top"></span><span class="v100-shot-box small bottom"></span>'+
      '<span class="v100-shot-penalty top"></span><span class="v100-shot-penalty bottom"></span>'+
      '<span class="v100-shot-arc top"></span><span class="v100-shot-arc bottom"></span>'+
      '<span class="v100-shot-half"></span><span class="v100-shot-center-circle"></span><span class="v100-shot-center-dot"></span>'+
      '<span class="v100-shot-corner tl"></span><span class="v100-shot-corner tr"></span>'+
      '<span class="v100-shot-corner bl"></span><span class="v100-shot-corner br"></span>'+
      '<span class="v100-shot-direction top">ATAQUE</span><span class="v100-shot-direction bottom">DEFENSA</span>'+
    '</div>';

  const tacticsSvg=
    '<svg class="v100-tactics-layer" data-tactics-layer viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Flechas tácticas">'+
      '<defs>'+
        '<marker id="v100-arrowhead" markerWidth="5" markerHeight="5" refX="4.2" refY="2.5" orient="auto" markerUnits="strokeWidth">'+
          '<path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor"></path>'+
        '</marker>'+
      '</defs>'+
      '<g data-arrow-group></g>'+
    '</svg>';

  const board=
    '<div class="v100-shot-board">'+
      '<div class="v100-shot-summary">'+
        '<span><small>TIROS</small><b data-shot-total>0</b></span>'+
        '<span><small>A PUERTA</small><b data-shot-target>0</b></span>'+
        '<span><small>GOLES</small><b data-shot-goals>0</b></span>'+
      '</div>'+
      '<div class="v100-shot-mode" role="group" aria-label="Herramienta del tablero">'+
        '<button type="button" class="active shot-mode" data-shot-mode="shot"><i></i>Tiro</button>'+
        '<button type="button" class="target-mode" data-shot-mode="target"><i></i>A puerta</button>'+
        '<button type="button" class="goal-mode" data-shot-mode="goal"><i></i>Gol</button>'+
        '<button type="button" class="player-mode" data-shot-mode="player"><i></i>Jugador</button>'+
        '<button type="button" class="ball-mode" data-shot-mode="ball"><i></i>Balón</button>'+
        '<button type="button" class="arrow-mode" data-shot-mode="arrow"><i></i>Flecha</button>'+
      '</div>'+
      '<div class="v100-shot-pitch" data-shot-pitch>'+pitchLines+tacticsSvg+'<div class="v100-shot-layer" data-shot-layer></div></div>'+
      '<div class="v100-shot-legend">'+
        '<span><i class="shot"></i>Tiro</span><span><i class="target"></i>A puerta</span><span><i class="goal"></i>Gol</span>'+
        '<span><i class="player"></i>Jugador</span><span><i class="ball"></i>Balón</span><span><i class="arrow"></i>Flecha</span>'+
      '</div>'+
      '<div class="v100-shot-edit">'+
        '<span data-shot-help>Arrastra cualquier círculo para moverlo.</span>'+
        '<button type="button" data-shot-delete disabled>Borrar seleccionado</button>'+
      '</div>'+
    '</div>';

  const m=modal(
    sectionTitle('ANÁLISIS LOCAL','Shot Map','Mueve los círculos con el dedo y usa Flecha para dibujar movimientos tácticos.')+
    board+
    '<div class="v100-actions v100-shot-actions">'+
      '<button class="v100-secondary" data-shot-undo>Deshacer</button>'+
      '<button class="v100-secondary" data-shot-clear>Limpiar</button>'+
      '<button class="v100-primary" data-shot-png>PNG</button>'+
      '<button class="v100-secondary" data-shot-json>JSON</button>'+
    '</div>',
    'v100-shot-modal'
  );

  const pitch=$('[data-shot-pitch]',m);
  const layer=$('[data-shot-layer]',m);
  const arrowGroup=$('[data-arrow-group]',m);
  const deleteBtn=$('[data-shot-delete]',m);
  const help=$('[data-shot-help]',m);

  const save=()=>{
    write('v100-shotmap',shots);
    write('v100-shotmap-arrows',arrows);
  };

  const renderArrows=()=>{
    const all=arrows.map((a,i)=>({a,i,draft:false}));
    if(draftArrow)all.push({a:draftArrow,i:-1,draft:true});
    arrowGroup.innerHTML=all.map(({a,i,draft})=>{
      const isSel=!draft&&selected?.kind==='arrow'&&selected.index===i;
      const x1=clamp(a.x1),y1=clamp(a.y1),x2=clamp(a.x2),y2=clamp(a.y2);
      const cls='v100-tactic-arrow'+(isSel?' selected':'')+(draft?' draft':'');
      const attrs=draft?'':' data-arrow="'+i+'"';
      return '<line class="v100-tactic-hit" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"'+attrs+'></line>'+
        '<line class="'+cls+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" marker-end="url(#v100-arrowhead)"'+attrs+'></line>'+
        (isSel?
          '<circle class="v100-arrow-handle start" cx="'+x1+'" cy="'+y1+'" r="2.25" data-arrow-handle="start" data-arrow="'+i+'"></circle>'+
          '<circle class="v100-arrow-handle end" cx="'+x2+'" cy="'+y2+'" r="2.25" data-arrow-handle="end" data-arrow="'+i+'"></circle>'
        :'');
    }).join('');
  };

  const render=()=>{
    layer.innerHTML=shots.map((s,i)=>{
      const type=s.type==='goal'?'goal':s.type==='target'?'target':s.type==='player'?'player':s.type==='ball'?'ball':'shot';
      const sx=clamp(s.x),sy=clamp(s.y);
      const isSel=selected?.kind==='shot'&&selected.index===i;
      return '<button type="button" class="v100-shot-marker '+type+(isSel?' selected':'')+'" data-shot-marker="'+i+'" style="--shot-x:'+sx+'%;--shot-y:'+sy+'%" title="Tiro '+(i+1)+'">'+
        '<span aria-hidden="true"></span><b>'+(i+1)+'</b>'+
      '</button>';
    }).join('');
    renderArrows();

    const shotEvents=shots.filter(s=>!['player','ball'].includes(s.type));
    const total=shotEvents.length;
    const target=shotEvents.filter(s=>s.type==='target'||s.type==='goal').length;
    const goals=shotEvents.filter(s=>s.type==='goal').length;
    const t=$('[data-shot-total]',m),a=$('[data-shot-target]',m),g=$('[data-shot-goals]',m);
    if(t)t.textContent=total;if(a)a.textContent=target;if(g)g.textContent=goals;

    deleteBtn.disabled=!selected;
    deleteBtn.classList.toggle('active',!!selected);
    if(help){
      help.textContent=selected?.kind==='shot'
        ? 'Círculo seleccionado: arrástralo o bórralo.'
        : selected?.kind==='arrow'
          ? 'Flecha seleccionada: arrastra la línea o sus extremos.'
          : shotMode==='arrow'
            ? 'Arrastra sobre la cancha para dibujar una flecha.'
            : shotMode==='player'
              ? 'Toca la cancha para colocar un jugador y arrástralo para moverlo.'
              : shotMode==='ball'
                ? 'Toca la cancha para colocar un balón y arrástralo para moverlo.'
                : 'Toca para registrar el evento y arrástralo para moverlo.';
    }
  };

  const select=(kind,index)=>{
    selected={kind,index};
    render();
  };

  const clearSelection=()=>{
    selected=null;
    render();
  };

  $$('[data-shot-mode]',m).forEach(b=>b.onclick=()=>{
    shotMode=b.dataset.shotMode||'shot';
    $$('[data-shot-mode]',m).forEach(x=>x.classList.toggle('active',x===b));
    selected=null;
    render();
  });

  pitch.addEventListener('pointerdown',e=>{
    const marker=e.target.closest('[data-shot-marker]');
    const handle=e.target.closest('[data-arrow-handle]');
    const arrow=e.target.closest('[data-arrow]');
    const p=pointFromEvent(e);

    if(marker){
      const index=Number(marker.dataset.shotMarker);
      selected={kind:'shot',index};
      active={kind:'shot',index,pointerId:e.pointerId,start:p,moved:false};
      pitch.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      render();
      return;
    }

    if(handle){
      const index=Number(handle.dataset.arrow);
      selected={kind:'arrow',index};
      active={kind:'arrow-handle',index,which:handle.dataset.arrowHandle,pointerId:e.pointerId,start:p,moved:false};
      pitch.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      render();
      return;
    }

    if(arrow){
      const index=Number(arrow.dataset.arrow);
      const a=arrows[index];
      if(!a)return;
      selected={kind:'arrow',index};
      active={kind:'arrow-move',index,pointerId:e.pointerId,start:p,orig:{...a},moved:false};
      pitch.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      render();
      return;
    }

    selected=null;
    if(shotMode==='arrow'){
      draftArrow={x1:p.x,y1:p.y,x2:p.x,y2:p.y};
      active={kind:'arrow-create',pointerId:e.pointerId,start:p,moved:false};
      pitch.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      render();
      return;
    }

    active={kind:'place-shot',pointerId:e.pointerId,start:p,moved:false};
    pitch.setPointerCapture?.(e.pointerId);
  });

  pitch.addEventListener('pointermove',e=>{
    if(!active||active.pointerId!==e.pointerId)return;
    const p=pointFromEvent(e);
    if(dist(active.start,p)>.7)active.moved=true;

    if(active.kind==='shot'){
      const s=shots[active.index];
      if(!s)return;
      s.x=p.x;s.y=p.y;
      const el=layer.querySelector('[data-shot-marker="'+active.index+'"]');
      if(el){el.style.setProperty('--shot-x',p.x+'%');el.style.setProperty('--shot-y',p.y+'%')}
      e.preventDefault();
      return;
    }

    if(active.kind==='arrow-create'&&draftArrow){
      draftArrow.x2=p.x;draftArrow.y2=p.y;
      renderArrows();
      e.preventDefault();
      return;
    }

    if(active.kind==='arrow-handle'){
      const a=arrows[active.index];
      if(!a)return;
      if(active.which==='start'){a.x1=p.x;a.y1=p.y}else{a.x2=p.x;a.y2=p.y}
      renderArrows();
      e.preventDefault();
      return;
    }

    if(active.kind==='arrow-move'){
      const a=arrows[active.index];
      if(!a)return;
      const dx=p.x-active.start.x,dy=p.y-active.start.y;
      const ox1=active.orig.x1,oy1=active.orig.y1,ox2=active.orig.x2,oy2=active.orig.y2;
      let ndx=dx,ndy=dy;
      ndx=Math.max(1-Math.min(ox1,ox2),Math.min(99-Math.max(ox1,ox2),ndx));
      ndy=Math.max(1-Math.min(oy1,oy2),Math.min(99-Math.max(oy1,oy2),ndy));
      a.x1=ox1+ndx;a.y1=oy1+ndy;a.x2=ox2+ndx;a.y2=oy2+ndy;
      renderArrows();
      e.preventDefault();
    }
  },{passive:false});

  const finishPointer=e=>{
    if(!active||active.pointerId!==e.pointerId)return;
    const p=pointFromEvent(e);

    if(active.kind==='place-shot'){
      if(!active.moved){
        shots.push({x:p.x,y:p.y,type:shotMode,at:new Date().toISOString()});
        selected={kind:'shot',index:shots.length-1};
        save();
      }
    }else if(active.kind==='shot'){
      save();
    }else if(active.kind==='arrow-create'){
      if(draftArrow&&dist({x:draftArrow.x1,y:draftArrow.y1},{x:draftArrow.x2,y:draftArrow.y2})>3){
        arrows.push({...draftArrow,at:new Date().toISOString()});
        selected={kind:'arrow',index:arrows.length-1};
        save();
      }
      draftArrow=null;
    }else if(active.kind==='arrow-handle'||active.kind==='arrow-move'){
      save();
    }

    try{pitch.releasePointerCapture?.(e.pointerId)}catch(_){}
    active=null;
    render();
  };
  pitch.addEventListener('pointerup',finishPointer);
  pitch.addEventListener('pointercancel',e=>{draftArrow=null;active=null;render()});

  deleteBtn.onclick=()=>{
    if(!selected)return;
    if(selected.kind==='shot'&&shots[selected.index]){
      shots.splice(selected.index,1);
    }else if(selected.kind==='arrow'&&arrows[selected.index]){
      arrows.splice(selected.index,1);
    }
    selected=null;
    save();
    render();
  };

  $('[data-shot-undo]',m).onclick=()=>{
    if(selected?.kind==='arrow'&&arrows.length)arrows.pop();
    else if(shotMode==='arrow'&&arrows.length)arrows.pop();
    else if(shots.length)shots.pop();
    selected=null;save();render();
  };

  $('[data-shot-clear]',m).onclick=()=>{
    shots.splice(0);arrows.splice(0);selected=null;save();render();
  };

  $('[data-shot-json]',m).onclick=()=>download(
    new Blob([JSON.stringify({shots,arrows},null,2)],{type:'application/json'}),
    'Shot_Map_Liga.json'
  );

  $('[data-shot-png]',m).onclick=async()=>{
    const c=document.createElement('canvas');c.width=900;c.height=1300;
    const x=c.getContext('2d'),L=45,T=45,W=810,H=1210;
    const stripeH=H/10;
    for(let i=0;i<10;i++){x.fillStyle=i%2?'#0a6a3b':'#075d34';x.fillRect(L,T+i*stripeH,W,stripeH)}
    x.strokeStyle='rgba(255,255,255,.96)';x.fillStyle='rgba(255,255,255,.96)';x.lineWidth=6;
    x.strokeRect(L,T,W,H);
    x.beginPath();x.moveTo(L,T+H/2);x.lineTo(L+W,T+H/2);x.stroke();
    x.beginPath();x.arc(L+W/2,T+H/2,96,0,Math.PI*2);x.stroke();
    x.beginPath();x.arc(L+W/2,T+H/2,7,0,Math.PI*2);x.fill();
    const drawBox=(top)=>{
      const y=top?T:T+H-205;
      x.strokeRect(L+W*.22,y,W*.56,205);
      const sy=top?T:T+H-82;
      x.strokeRect(L+W*.36,sy,W*.28,82);
      const py=top?T+145:T+H-145;
      x.beginPath();x.arc(L+W/2,py,7,0,Math.PI*2);x.fill();
      x.beginPath();x.arc(L+W/2,py,95,top?0:Math.PI,top?Math.PI:Math.PI*2);x.stroke();
      const gy=top?T-18:T+H;
      x.strokeRect(L+W*.42,gy,W*.16,18);
    };
    drawBox(true);drawBox(false);

    const drawCanvasArrow=a=>{
      const x1=L+clamp(a.x1)/100*W,y1=T+clamp(a.y1)/100*H;
      const x2=L+clamp(a.x2)/100*W,y2=T+clamp(a.y2)/100*H;
      const ang=Math.atan2(y2-y1,x2-x1),head=24;
      x.strokeStyle='#32e2f2';x.fillStyle='#32e2f2';x.lineWidth=8;x.lineCap='round';
      x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke();
      x.beginPath();
      x.moveTo(x2,y2);
      x.lineTo(x2-head*Math.cos(ang-Math.PI/6),y2-head*Math.sin(ang-Math.PI/6));
      x.lineTo(x2-head*Math.cos(ang+Math.PI/6),y2-head*Math.sin(ang+Math.PI/6));
      x.closePath();x.fill();
    };
    arrows.forEach(drawCanvasArrow);

    shots.forEach((s,i)=>{
      const px=L+clamp(s.x)/100*W,py=T+clamp(s.y)/100*H;
      const type=s.type==='goal'?'goal':s.type==='target'?'target':s.type==='player'?'player':s.type==='ball'?'ball':'shot';
      if(type==='player'){
        x.fillStyle='#2159da';x.strokeStyle='#06104d';x.lineWidth=5;
        x.beginPath();x.arc(px,py,22,0,Math.PI*2);x.fill();x.stroke();
        x.fillStyle='#fff';
        x.beginPath();x.arc(px,py-7,6,0,Math.PI*2);x.fill();
        x.beginPath();x.arc(px,py+12,11,Math.PI,Math.PI*2);x.lineTo(px+11,py+16);x.lineTo(px-11,py+16);x.closePath();x.fill();
      }else{
        const fill=type==='goal'?'#29e67d':type==='target'?'#38dff1':type==='ball'?'#ffffff':'#ffd75f';
        x.fillStyle=fill;x.strokeStyle='#07104d';x.lineWidth=5;
        x.beginPath();x.arc(px,py,19,0,Math.PI*2);x.fill();x.stroke();
        x.fillStyle='#07104d';
        x.beginPath();
        for(let k=0;k<5;k++){const a=-Math.PI/2+k*Math.PI*2/5,rr=7;x.lineTo(px+Math.cos(a)*rr,py+Math.sin(a)*rr)}
        x.closePath();x.fill();
      }
      x.fillStyle='#fff';x.font='700 15px Arial';x.textAlign='center';x.fillText(String(i+1),px,py+38);
    });

    x.fillStyle='rgba(4,13,91,.92)';x.fillRect(0,0,900,36);x.fillRect(0,1264,900,36);
    x.fillStyle='#fff';x.font='700 18px Arial';x.textAlign='left';x.fillText('SHOT MAP · LIGA JUVENTINO ROSAS',35,25);
    const shotEvents=shots.filter(s=>!['player','ball'].includes(s.type));
    x.textAlign='right';x.fillText('Tiros '+shotEvents.length+' · A puerta '+shotEvents.filter(s=>s.type==='target'||s.type==='goal').length+' · Goles '+shotEvents.filter(s=>s.type==='goal').length+' · Jugadores '+shots.filter(s=>s.type==='player').length+' · Balones '+shots.filter(s=>s.type==='ball').length+' · Flechas '+arrows.length,865,1288);
    const b=await canvasBlob(c);download(b,'Shot_Map_Liga.png');
  };

  render();
}
window.LJR_V100_SHOTMAP_OPEN=shotmap;
const V100_ANDROID_APK='https://github.com/jairofrancog7-star/App-liga-/releases/download/android-latest/Liga-Juventino.apk';
const V100_ANDROID_BUILDS='https://github.com/jairofrancog7-star/App-liga-/actions/workflows/android-debug.yml';
function v100IsIos(){return /iphone|ipad|ipod/i.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function v100IsStandalone(){return !!(window.matchMedia?.('(display-mode: standalone)')?.matches||navigator.standalone)}
async function v100PromptInstall(){
 if(v100IsStandalone()){toast('La app ya está abierta como aplicación');return}
 if(installPrompt){
   const p=installPrompt;installPrompt=null;
   try{await p.prompt();await p.userChoice}catch(_){}
   return;
 }
 if(v100IsIos())return v100IosShortcut();
 toast('Abre el menú del navegador para instalar la aplicación');
}
function v100IosHomeUrl(){
 return location.origin+location.pathname+'?source=ios-home#/home';
}
async function v100IosShortcut(){
 const url=v100IosHomeUrl();
 if(v100IsStandalone()){location.hash='#/home';toast('Liga Juventino ya está en modo aplicación');return}
 try{
   if(navigator.share){
     await navigator.share({title:'Liga Juventino',text:'Liga Juventino',url});
     return;
   }
 }catch(err){
   if(err?.name==='AbortError')return;
 }
 try{await navigator.clipboard.writeText(url);toast('Enlace de Liga Juventino copiado')}catch(_){
   location.href=url;
 }
}
function v100DownloadApk(){
 const a=document.createElement('a');a.href=V100_ANDROID_APK;a.rel='noopener';a.download='Liga-Juventino.apk';document.body.appendChild(a);a.click();a.remove();
 toast('Descargando Liga-Juventino.apk');
}
function v100ShortcutHelp(kind){
 const ios=kind==='ios';
 const title=ios?'iPhone / iPad':'Android';
 const desc=ios?'Cómo dejar Liga Juventino como acceso directo en la pantalla de inicio.':'Cómo dejar Liga Juventino como acceso directo o PWA en Android.';
 const steps=ios?[
   ['1','Abre Liga Juventino en Safari.'],
   ['2','Toca el botón Compartir del navegador.'],
   ['3','Busca “Añadir a pantalla de inicio”.'],
   ['4','Toca Añadir. El icono de Liga Juventino quedará en tu pantalla de inicio.']
 ]:[
   ['1','Abre Liga Juventino en Chrome.'],
   ['2','Toca el menú de tres puntos del navegador.'],
   ['3','Elige “Instalar aplicación” o “Agregar a pantalla de inicio”.'],
   ['4','Confirma Instalar / Agregar. Liga Juventino quedará como acceso directo.']
 ];
 const m=modal(
   sectionTitle('AYUDA DE ACCESO DIRECTO',title,desc)+
   '<div class="v100-shortcut-help">'+steps.map(x=>'<div><b>'+x[0]+'</b><span>'+esc(x[1])+'</span></div>').join('')+'</div>'+
   '<div class="v100-actions">'+
     '<button type="button" class="v100-primary" data-v100-help-action>'+(ios?'Abrir acceso para iPhone':'Intentar instalar ahora')+'</button>'+
     '<button type="button" class="v100-secondary" data-v100-help-close>Cerrar</button>'+
   '</div>',
   'v100-install-modal'
 );
 $('[data-v100-help-action]',m)?.addEventListener('click',()=>{if(ios)v100IosShortcut();else v100PromptInstall()});
 $('[data-v100-help-close]',m)?.addEventListener('click',()=>m.remove());
}
async function installApp(){
 const ios=v100IsIos(),standalone=v100IsStandalone();
 const m=modal(
  sectionTitle('INSTALAR APP','Liga Juventino','La app móvil de Liga Juventino está disponible como PWA, APK Android y acceso directo para iPhone/iPad.')+
  '<div class="v100-install-status '+(standalone?'is-installed':'')+'"><span>'+(standalone?'✓':'●')+'</span><div><b>'+(standalone?'Ya está instalada / abierta como app':'Lista para dispositivos móviles')+'</b><small>Compatible con Android, iPhone y iPad.</small></div></div>'+
  '<div class="v100-install-options">'+
    '<article class="v100-install-option">'+
      '<span class="v100-install-icon">📱</span><div class="v100-install-copy"><small>ANDROID / PWA</small><b>Instalar aplicación</b><p>Versión web instalable de Liga Juventino para abrirla como aplicación.</p></div>'+
      '<button type="button" class="v100-primary" data-v100-install-pwa>'+(standalone?'Abrir como app':'Instalar PWA')+'</button>'+
    '</article>'+
    '<article class="v100-install-option">'+
      '<span class="v100-install-icon">⬇️</span><div class="v100-install-copy"><small>ANDROID · APK</small><b>Descargar .APK</b><p>Archivo Android directo de Liga Juventino.</p></div>'+
      '<a class="v100-primary v100-install-link" href="'+esc(V100_ANDROID_APK)+'" download="Liga-Juventino.apk" data-v100-install-apk>Descargar APK directo</a>'+
      '<button type="button" class="v100-secondary" data-v100-install-builds>Ver compilación</button>'+
    '</article>'+
    '<article class="v100-install-option '+(ios?'is-device':'')+'">'+
      '<span class="v100-install-icon">🍎</span><div class="v100-install-copy"><small>IPHONE / IPAD</small><b>Acceso directo en iOS</b><p>Acceso móvil de Liga Juventino con icono y apertura en modo app.</p></div>'+
      '<a class="v100-primary v100-install-link" href="'+esc(v100IosHomeUrl())+'" data-v100-install-ios>Agregar en iPhone</a>'+
      '<button type="button" class="v100-secondary" data-v100-ios-help>¿No sabes cómo? Ver guía</button>'+
    '</article>'+
  '</div>'+
  '<div class="v100-shortcut-assist">'+
    '<div><span>❓</span><p><b>¿No sabes cómo poner el acceso directo?</b><small>Te mostramos cómo hacerlo en Android o iPhone paso a paso.</small></p></div>'+
    '<div class="v100-shortcut-assist-actions"><button type="button" class="v100-secondary" data-v100-android-help>Cómo hacerlo en Android</button><button type="button" class="v100-secondary" data-v100-ios-help-bottom>Cómo hacerlo en iPhone</button></div>'+
  '</div>'+
  '<p class="v100-install-footnote">APK Android y acceso móvil de Liga Juventino.</p>',
  'v100-install-modal'
 );
 $('[data-v100-install-pwa]',m)?.addEventListener('click',()=>{if(standalone){location.hash='#/home';m.remove();return}v100PromptInstall()});
 $('[data-v100-install-apk]',m)?.addEventListener('click',()=>toast('Descargando Liga-Juventino.apk'));
 $('[data-v100-install-builds]',m)?.addEventListener('click',()=>window.open(V100_ANDROID_BUILDS,'_blank','noopener,noreferrer'));
 $('[data-v100-install-ios]',m)?.addEventListener('click',e=>{e.preventDefault();v100IosShortcut()});
 $('[data-v100-ios-help]',m)?.addEventListener('click',()=>v100ShortcutHelp('ios'));
 $('[data-v100-ios-help-bottom]',m)?.addEventListener('click',()=>v100ShortcutHelp('ios'));
 $('[data-v100-android-help]',m)?.addEventListener('click',()=>v100ShortcutHelp('android'));
}

/* ---------- V190: RECLUTAMIENTO EN MÁS HERRAMIENTAS ---------- */
let v190RecruitPngFile=null;
let v190RecruitPreviewUrl='';
function v190RecruitData(){
  const x=read(V190_RECRUIT_KEY,{teams:[],players:[]})||{};
  return {teams:Array.isArray(x.teams)?x.teams:[],players:Array.isArray(x.players)?x.players:[]};
}
function v190RecruitSave(x){write(V190_RECRUIT_KEY,x)}
function v190RecruitUid(){return 'rec-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)}
function v190RecruitCategories(){
  const out=[...new Set(officialTeams().map(t=>String(t.category||'').trim()).filter(Boolean))];
  ['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'].forEach(x=>{if(!out.includes(x))out.push(x)});
  return out;
}
function v190RecruitCategoryOptions(selected=''){
  return '<option value="">Categoría por definir</option>'+
    v190RecruitCategories().map(c=>'<option value="'+esc(c)+'" '+(selected===c?'selected':'')+'>'+esc(c)+'</option>').join('');
}
function v190RecruitTeamOptions(selected=''){
  const groups=new Map();
  officialTeams().forEach(t=>{
    const name=String(t?.name||'').trim();if(!name)return;
    const cat=String(t.category||'Sin categoría').trim()||'Sin categoría';
    if(!groups.has(cat))groups.set(cat,[]);
    if(!groups.get(cat).some(x=>norm(x.name)===norm(name)))groups.get(cat).push({name,category:cat});
  });
  let html='<option value="">Sin equipo destino todavía</option>';
  for(const [cat,items] of groups){
    html+='<optgroup label="'+esc(cat)+'">'+items.sort((a,b)=>a.name.localeCompare(b.name,'es')).map(t=>
      '<option value="'+esc(t.name)+'" '+(selected===t.name?'selected':'')+'>'+esc(t.name)+'</option>'
    ).join('')+'</optgroup>';
  }
  return html;
}
function v190RecruitCommunityOptions(selected=''){
  const places=[
    'Santa Cruz de Juventino Rosas',
    'Cerrito de Gasca',
    'Franco Tavera',
    'Tavera',
    'San Juan de la Cruz',
    'Santiago de Cuenda',
    'San Antonio de Romerillo',
    'Fraccionamiento Comontuoso',
    'Comontuoso',
    'Pozos',
    'San José de la Montaña',
    'San Julián Tierra Blanca',
    'Emiliano Zapata',
    'La Huerta de Cuenda',
    'Celaya',
    'Villagrán',
    'Comonfort',
    'Cortazar',
    'Salamanca'
  ];
  return '<option value="">Selecciona comunidad o ciudad</option>'+
    places.map(x=>'<option value="'+esc(x)+'" '+(selected===x?'selected':'')+'>'+esc(x)+'</option>').join('');
}
function v190RecruitPositionOptions(selected=''){
  const positions=[
    'Portero',
    'Defensa central',
    'Lateral derecho',
    'Lateral izquierdo',
    'Medio defensivo / contención',
    'Mediocampista',
    'Medio ofensivo',
    'Extremo derecho',
    'Extremo izquierdo',
    'Delantero centro',
    'Segundo delantero',
    'Polivalente / varias posiciones'
  ];
  return '<option value="">Selecciona posición</option>'+
    positions.map(x=>'<option value="'+esc(x)+'" '+(selected===x?'selected':'')+'>'+esc(x)+'</option>').join('');
}
function v190RecruitCampaign(){
  const x=read(V190_RECRUIT_CAMPAIGN_KEY,{})||{};
  const oldDefault='Abrimos espacio para equipos nuevos y jugadores que quieran integrarse a la Liga Municipal de Fútbol Juventino Rosas A.C.';
  const freshDefault='¿Tienes un equipo o buscas dónde jugar? La Liga Municipal de Fútbol Juventino Rosas A.C. abre espacio para nuevos equipos y jugadores. Acude a las juntas de la Liga los martes en la Unidad Deportiva Sur para conocer requisitos, registro y proceso de ingreso.';
  return {
    kind:x.kind||'both',
    title:(!x.title||x.title==='Reclutamiento Liga Juventino Rosas')?'¡Únete a la Liga!':x.title,
    message:(!x.message||x.message===oldDefault)?freshDefault:x.message,
    tone:x.tone||'persuasive',
    focus:x.focus||''
  };
}
function v190RecruitKindLabel(kind){
  if(kind==='teams')return 'NUEVOS EQUIPOS';
  if(kind==='players')return 'NUEVOS JUGADORES';
  return 'NUEVOS EQUIPOS · NUEVOS JUGADORES';
}
function v190RecruitAiPrompt(kind){
  if(kind==='teams')return 'INSCRIBE TU EQUIPO';
  if(kind==='players')return 'ENCUENTRA EQUIPO Y COMPITE';
  return 'SÚMATE Y COMPITE';
}
function v190RecruitAiCopy(kind,tone='persuasive',focus=''){
  const base={
    teams:{
      title:'¡INSCRIBE TU EQUIPO!',
      hook:'¿Tu equipo está listo para dar el siguiente paso?',
      body:'La Liga Municipal de Fútbol Juventino Rosas A.C. abre espacio para nuevos equipos que quieran competir, crecer y formar parte de una liga organizada.',
      action:'Acudan a las juntas de la Liga los martes en la Unidad Deportiva Sur para conocer categorías, requisitos, registro y proceso de ingreso.'
    },
    players:{
      title:'¡ENCUENTRA TU EQUIPO!',
      hook:'¿Buscas un equipo para competir esta temporada?',
      body:'La Liga Municipal de Fútbol Juventino Rosas A.C. recibe jugadores que quieran integrarse a un equipo y participar de acuerdo con su categoría y posición.',
      action:'Acude a las juntas de la Liga los martes en la Unidad Deportiva Sur para conocer opciones de integración, requisitos y registro.'
    },
    both:{
      title:'¡ÚNETE A LA LIGA!',
      hook:'¿Tienes un equipo o buscas dónde jugar?',
      body:'La Liga Municipal de Fútbol Juventino Rosas A.C. abre espacio para nuevos equipos y jugadores que quieran competir, crecer y formar parte de la comunidad futbolera.',
      action:'Acude a las juntas de la Liga los martes en la Unidad Deportiva Sur para conocer categorías, requisitos, registro y proceso de ingreso.'
    }
  }[kind]||null;
  const toneLine={
    persuasive:'Da el siguiente paso y vive una temporada con competencia, organización y seguimiento oficial.',
    direct:'Registro abierto para la temporada 2026–2027.',
    institutional:'Convocatoria oficial de incorporación para la temporada 2026–2027.',
    energetic:'¡Es momento de entrar a la cancha, competir y representar tus colores!'
  }[tone]||'';
  const extra=String(focus||'').trim();
  return {
    title:base.title,
    message:[base.hook,base.body,toneLine,extra?('Queremos destacar: '+extra+'.'):'',base.action].filter(Boolean).join(' ')
  };
}
function v190RecruitAiImprove(root){
  const kind=$('[data-v190-campaign-kind]',root)?.value||'both';
  const tone=$('[data-v190-ai-tone]',root)?.value||'persuasive';
  const focus=$('[data-v190-ai-focus]',root)?.value.trim()||'';
  const titleEl=$('[data-v190-campaign-title]',root),messageEl=$('[data-v190-campaign-message]',root);
  const generated=v190RecruitAiCopy(kind,tone,focus);
  let current=String(messageEl?.value||'').replace(/\s+/g,' ').trim();
  if(!current)return v190RecruitAiGenerate(root);
  const hook=kind==='teams'?'¿Tu equipo está listo para competir?':kind==='players'?'¿Buscas un equipo para jugar y competir?':'¿Tienes un equipo o buscas dónde jugar?';
  const action=kind==='players'
    ?'Acude a las juntas de la Liga los martes en la Unidad Deportiva Sur para conocer opciones de integración y registro.'
    :'Acude a las juntas de la Liga los martes en la Unidad Deportiva Sur para conocer requisitos, categorías y proceso de ingreso.';
  if(!/^[¿¡]/.test(current))current=hook+' '+current;
  if(focus&&!current.toLowerCase().includes(focus.toLowerCase()))current+=' Queremos destacar: '+focus+'.';
  if(!/martes|unidad deportiva sur/i.test(current))current+=' '+action;
  if(titleEl&&!titleEl.value.trim())titleEl.value=generated.title;
  if(messageEl)messageEl.value=current;
  v190RecruitCampaignFromUi(root);
  toast('Texto mejorado automáticamente');
}
function v190RecruitAiGenerate(root){
  const kind=$('[data-v190-campaign-kind]',root)?.value||'both';
  const tone=$('[data-v190-ai-tone]',root)?.value||'persuasive';
  const focus=$('[data-v190-ai-focus]',root)?.value.trim()||'';
  const generated=v190RecruitAiCopy(kind,tone,focus);
  const titleEl=$('[data-v190-campaign-title]',root),messageEl=$('[data-v190-campaign-message]',root);
  if(titleEl)titleEl.value=generated.title;
  if(messageEl)messageEl.value=generated.message;
  v190RecruitCampaignFromUi(root);
  toast('Texto automático generado');
}
function v190CanvasLines(ctx,text,maxWidth){
  const out=[];
  String(text||'').split(/\n/).forEach((para,pi)=>{
    const words=para.trim().split(/\s+/).filter(Boolean);
    if(!words.length){out.push('');return}
    let line='';
    words.forEach(word=>{
      const test=line?line+' '+word:word;
      if(line&&ctx.measureText(test).width>maxWidth){out.push(line);line=word}
      else line=test;
    });
    if(line)out.push(line);
    if(pi<String(text||'').split(/\n/).length-1)out.push('');
  });
  return out;
}
function v190DrawFittedText(ctx,text,opt){
  const o=Object.assign({x:0,y:0,width:100,height:100,maxSize:28,minSize:15,weight:700,color:'#fff',lineFactor:1.28},opt||{});
  let size=o.maxSize,lines=[],lineHeight=0,total=0;
  for(;size>=o.minSize;size--){
    ctx.font=o.weight+' '+size+'px Arial';
    lines=v190CanvasLines(ctx,text,o.width);
    lineHeight=Math.max(size+3,Math.round(size*o.lineFactor));
    total=lines.length*lineHeight;
    if(total<=o.height)break;
  }
  if(size<o.minSize){
    size=o.minSize;
    ctx.font=o.weight+' '+size+'px Arial';
    lines=v190CanvasLines(ctx,text,o.width);
    lineHeight=Math.max(size+2,Math.floor(o.height/Math.max(1,lines.length)));
    total=lines.length*lineHeight;
  }
  ctx.fillStyle=o.color;
  ctx.textBaseline='alphabetic';
  let yy=o.y+size;
  lines.forEach(line=>{if(line)ctx.fillText(line,o.x,yy);yy+=lineHeight});
  return {fontSize:size,lines:lines.length,bottom:o.y+total};
}
function v190RecruitRows(){
  const data=v190RecruitData();
  const teams=data.teams.slice().sort((a,b)=>Date.parse(b.createdAt||0)-Date.parse(a.createdAt||0)).map(x=>
    '<article class="v190-recruit-row"><span class="v190-recruit-badge">EQUIPO</span><span><b>'+esc(x.name)+'</b><small>'+esc(x.category||'Categoría por definir')+(x.community?' · '+esc(x.community):'')+'</small><em>'+esc(x.contact||'Sin referencia de contacto')+'</em></span><button type="button" data-v190-delete="team:'+esc(x.id)+'">Quitar</button></article>'
  ).join('');
  const players=data.players.slice().sort((a,b)=>Date.parse(b.createdAt||0)-Date.parse(a.createdAt||0)).map(x=>
    '<article class="v190-recruit-row player"><span class="v190-recruit-badge">JUGADOR</span><span><b>'+esc(x.name)+'</b><small>'+esc(x.category||'Categoría por definir')+(x.position?' · '+esc(x.position):'')+'</small><em>'+(x.targetTeam?'Destino: '+esc(x.targetTeam):'Sin equipo destino')+(x.contact?' · '+esc(x.contact):'')+'</em></span><div><button type="button" data-v190-promote="'+esc(x.id)+'">Pasar a registro</button><button type="button" class="danger" data-v190-delete="player:'+esc(x.id)+'">Quitar</button></div></article>'
  ).join('');
  if(!teams&&!players)return '<div class="v190-recruit-empty">Todavía no hay equipos ni jugadores prospecto guardados.</div>';
  return '<div class="v190-recruit-list">'+teams+players+'</div>';
}
function v190RecruitPage(){
  const data=v190RecruitData(),campaign=v190RecruitCampaign();
  return '<section class="v100-block v190-recruit-page" id="v190-recruitment-page">'+
    sectionTitle('RECLUTAMIENTO','Equipos nuevos y jugadores nuevos','Registra interesados y genera una convocatoria profesional en PNG para descargar o compartir en redes.')+
    '<div class="v190-recruit-summary"><span><b>'+data.teams.length+'</b><small>Equipos interesados</small></span><span><b>'+data.players.length+'</b><small>Jugadores interesados</small></span></div>'+
    '<div class="v190-recruit-forms">'+
      '<form class="v190-recruit-card" data-v190-team-form>'+
        '<header><span>＋</span><div><b>Nuevo equipo</b><small>Equipo interesado en entrar a la Liga</small></div></header>'+
        '<label><span>Nombre del equipo</span><input required data-v190-team-name placeholder="Nombre del equipo" autocomplete="off"></label>'+
        '<label><span>Categoría</span><select data-v190-team-category>'+v190RecruitCategoryOptions()+'</select></label>'+
        '<label><span>Comunidad / localidad</span><select data-v190-team-community>'+v190RecruitCommunityOptions()+'</select></label>'+
        '<label><span>Contacto / referencia</span><input data-v190-team-contact placeholder="Opcional · se guarda en este dispositivo" autocomplete="off"></label>'+
        '<button type="submit">Guardar equipo nuevo</button>'+
      '</form>'+
      '<form class="v190-recruit-card" data-v190-player-form>'+
        '<header><span>⚽</span><div><b>Nuevo jugador</b><small>Jugador que busca integrarse a un equipo</small></div></header>'+
        '<label><span>Nombre completo</span><input required data-v190-player-name placeholder="Nombre del jugador" autocomplete="off"></label>'+
        '<label><span>Categoría</span><select data-v190-player-category>'+v190RecruitCategoryOptions()+'</select></label>'+
        '<label><span>Equipo destino</span><select data-v190-player-team>'+v190RecruitTeamOptions()+'</select></label>'+
        '<label><span>Posición</span><select data-v190-player-position>'+v190RecruitPositionOptions()+'</select></label>'+
        '<label><span>Contacto / referencia</span><input data-v190-player-contact placeholder="Opcional · se guarda en este dispositivo" autocomplete="off"></label>'+
        '<button type="submit">Guardar jugador nuevo</button>'+
      '</form>'+
    '</div>'+
    '<section class="v190-publish-card">'+
      '<header><small>CONVOCATORIA</small><h3>PNG para reclutamiento</h3><p>Genera una imagen vertical para redes o sube tu propio PNG. El PNG no se publica automáticamente en GitHub.</p></header>'+
      '<div class="v190-publish-grid">'+
        '<label><span>Convocatoria para</span><select data-v190-campaign-kind>'+
          '<option value="both" '+(campaign.kind==='both'?'selected':'')+'>Equipos y jugadores</option>'+
          '<option value="teams" '+(campaign.kind==='teams'?'selected':'')+'>Nuevo equipo quiere unirse a la Liga</option>'+
          '<option value="players" '+(campaign.kind==='players'?'selected':'')+'>Jugador busca unirse a un equipo</option>'+
        '</select></label>'+
        '<label><span>Título</span><input data-v190-campaign-title value="'+esc(campaign.title)+'"></label>'+
      '</div>'+
      '<label class="v190-message"><span>Mensaje</span><textarea data-v190-campaign-message rows="4">'+esc(campaign.message)+'</textarea></label>'+
      '<section class="v190-ai-assist">'+
        '<header><span>✦</span><div><b>Modo IA</b><small>Ayuda automática para escribir una convocatoria más clara y convincente.</small></div></header>'+
        '<div class="v190-ai-grid">'+
          '<label><span>Estilo del texto</span><select data-v190-ai-tone>'+
            '<option value="persuasive" '+(campaign.tone==='persuasive'?'selected':'')+'>Convincente</option>'+
            '<option value="direct" '+(campaign.tone==='direct'?'selected':'')+'>Directo</option>'+
            '<option value="institutional" '+(campaign.tone==='institutional'?'selected':'')+'>Institucional</option>'+
            '<option value="energetic" '+(campaign.tone==='energetic'?'selected':'')+'>Energético</option>'+
          '</select></label>'+
          '<label><span>Qué quieres destacar</span><input data-v190-ai-focus value="'+esc(campaign.focus)+'" placeholder="Ej. organización, nivel competitivo, comunidad"></label>'+
        '</div>'+
        '<div class="v190-ai-actions">'+
          '<button type="button" class="primary" data-v190-ai-generate>✦ Generar texto automático</button>'+
          '<button type="button" data-v190-ai-improve>Mejorar lo que escribí</button>'+
        '</div>'+
        '<p>Puedes editar el título y mensaje después. El asistente conserva tu objetivo: nuevo equipo, jugador que busca equipo o ambos.</p>'+
      '</section>'+
      '<label class="v190-png-upload"><span>Subir PNG propio</span><input type="file" accept="image/png,.png" data-v190-png-file><small>Si eliges un PNG, los botones de descargar/compartir usarán esa imagen. Si no, la app genera una convocatoria automáticamente.</small></label>'+
      '<div class="v190-png-preview '+(v190RecruitPreviewUrl?'has-image':'')+'" data-v190-preview>'+(v190RecruitPreviewUrl?'<img src="'+esc(v190RecruitPreviewUrl)+'" alt="Vista previa de convocatoria">':'<span>Vista previa del PNG</span>')+'</div>'+
      '<div class="v190-share-actions">'+
        '<button type="button" class="primary" data-v190-preview-png>Vista previa PNG</button>'+
        '<button type="button" data-v190-download-png>Descargar PNG</button>'+
        '<button type="button" data-v190-share-png>Compartir PNG</button>'+
        '<button type="button" class="facebook" data-v190-facebook>Facebook</button>'+
      '</div>'+
      '<p class="v190-share-note">La convocatoria no muestra números telefónicos. Para informes indica las juntas de los martes en la Unidad Deportiva Sur y la página oficial juventinorosasliga.com.</p>'+
    '</section>'+
    '<section class="v190-saved"><header><small>PROSPECTOS GUARDADOS</small><h3>Seguimiento de reclutamiento</h3></header>'+v190RecruitRows()+'</section>'+
    '<p class="v100-note">Los nombres, contactos y prospectos se guardan sólo en este dispositivo. No se suben al repositorio público.</p>'+
  '</section>';
}
function v190RecruitCampaignFromUi(root){
  const data={
    kind:$('[data-v190-campaign-kind]',root)?.value||'both',
    title:$('[data-v190-campaign-title]',root)?.value.trim()||'Reclutamiento Liga Juventino Rosas',
    message:$('[data-v190-campaign-message]',root)?.value.trim()||'',
    tone:$('[data-v190-ai-tone]',root)?.value||'persuasive',
    focus:$('[data-v190-ai-focus]',root)?.value.trim()||''
  };
  write(V190_RECRUIT_CAMPAIGN_KEY,data);
  return data;
}
function v190RecruitShareText(root){
  const c=v190RecruitCampaignFromUi(root);
  return c.title+'\n'+v190RecruitKindLabel(c.kind)+'\n\n'+c.message+'\n\nJuntas de la Liga: martes · Unidad Deportiva Sur\nInformación oficial: https://www.juventinorosasliga.com/\nLiga Municipal de Fútbol Juventino Rosas A.C.';
}
async function v190RecruitGeneratedBlob(root){
  const cdata=v190RecruitCampaignFromUi(root);
  const c=document.createElement('canvas');c.width=1080;c.height=1350;
  const x=c.getContext('2d');

  // Fondo institucional.
  const g=x.createLinearGradient(0,0,1080,1350);
  g.addColorStop(0,'#02075a');g.addColorStop(.42,'#0b2494');g.addColorStop(1,'#030744');
  x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
  const glow=x.createRadialGradient(930,130,20,930,130,520);
  glow.addColorStop(0,'rgba(26,194,255,.28)');glow.addColorStop(1,'rgba(26,194,255,0)');
  x.fillStyle=glow;x.fillRect(0,0,c.width,c.height);
  x.strokeStyle='#3be7f2';x.lineWidth=5;x.strokeRect(42,42,996,1266);

  // Logo sin deformación: conserva siempre su proporción original.
  const league=await v200LeagueLogoTransparent();
  if(league){
    const boxX=72,boxY=70,boxW=132,boxH=132;
    const nw=league.naturalWidth||league.width||boxW;
    const nh=league.naturalHeight||league.height||boxH;
    const scale=Math.min(boxW/nw,boxH/nh);
    const dw=Math.max(1,nw*scale),dh=Math.max(1,nh*scale);
    const dx=boxX+(boxW-dw)/2,dy=boxY+(boxH-dh)/2;
    x.save();x.globalAlpha=1;x.drawImage(league,dx,dy,dw,dh);x.restore();
  }

  // Encabezado oficial.
  x.fillStyle='#66f1f5';x.font='900 25px Arial';
  x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS A.C.',232,106);
  x.fillStyle='rgba(255,255,255,.78)';x.font='800 20px Arial';
  x.fillText('CONVOCATORIA OFICIAL · TEMPORADA 2026–2027',232,145);

  // Titular editable: usa exactamente el título escrito por el usuario y ajusta el tamaño sin recortarlo.
  v190DrawFittedText(x,cdata.title,{x:72,y:218,width:936,height:105,maxSize:66,minSize:30,weight:900,color:'#fff',lineFactor:1.02});
  x.fillStyle='#61eef4';x.font='900 31px Arial';
  x.fillText(v190RecruitKindLabel(cdata.kind),74,354);

  // Invitación: el texto se autoajusta para que no se tape ni quede cortado en la descarga.
  const inviteY=388,inviteH=330;
  x.fillStyle='rgba(255,255,255,.075)';x.fillRect(72,inviteY,936,inviteH);
  x.strokeStyle='rgba(97,238,244,.48)';x.lineWidth=2;x.strokeRect(72,inviteY,936,inviteH);
  x.fillStyle='#61eef4';x.font='900 23px Arial';
  x.fillText(v190RecruitAiPrompt(cdata.kind),108,432);
  v190DrawFittedText(x,cdata.message,{x:108,y:462,width:846,height:228,maxSize:29,minSize:15,weight:700,color:'rgba(244,247,255,.96)',lineFactor:1.25});

  // Categorías: también se ajustan si el nombre de las categorías ocupa más líneas.
  x.fillStyle='#61eef4';x.font='900 24px Arial';x.fillText('CATEGORÍAS ABIERTAS',76,770);
  v190DrawFittedText(x,v190RecruitCategories().join('  ·  '),{x:76,y:790,width:920,height:78,maxSize:28,minSize:20,weight:800,color:'#fff',lineFactor:1.18});

  // Información presencial: cuadro más alto para que la última línea nunca quede tapada.
  const infoY=890,infoH=255;
  x.fillStyle='rgba(0,0,0,.27)';x.fillRect(72,infoY,936,infoH);
  x.strokeStyle='rgba(97,238,244,.32)';x.strokeRect(72,infoY,936,infoH);
  x.fillStyle='#61eef4';x.font='900 24px Arial';x.fillText('INFORMACIÓN Y REGISTRO',108,940);
  x.fillStyle='#fff';x.font='900 34px Arial';x.fillText('JUNTAS DE LA LIGA · TODOS LOS MARTES',108,992);
  x.fillStyle='rgba(244,247,255,.94)';x.font='800 28px Arial';x.fillText('Unidad Deportiva Sur · Juventino Rosas, Gto.',108,1038);
  v190DrawFittedText(x,'Acude personalmente para conocer requisitos, registro, categorías y proceso de ingreso.',{x:108,y:1060,width:850,height:62,maxSize:22,minSize:17,weight:700,color:'rgba(226,234,255,.90)',lineFactor:1.18});

  // Página oficial.
  x.fillStyle='#61eef4';x.font='900 22px Arial';x.fillText('PÁGINA OFICIAL',78,1190);
  x.fillStyle='#fff';x.font='900 32px Arial';x.fillText('www.juventinorosasliga.com',78,1236);
  x.fillStyle='rgba(255,255,255,.68)';x.font='20px Arial';
  x.fillText('Consulta categorías, jornadas, resultados y avisos oficiales.',78,1276);

  return canvasBlob(c);
}
async function v190RecruitShareBlob(root){
  return v190RecruitPngFile||await v190RecruitGeneratedBlob(root);
}
function v190RecruitSetPreview(blob,root){
  if(v190RecruitPreviewUrl)try{URL.revokeObjectURL(v190RecruitPreviewUrl)}catch(e){}
  v190RecruitPreviewUrl=URL.createObjectURL(blob);
  const host=$('[data-v190-preview]',root);
  if(host){host.classList.add('has-image');host.innerHTML='<img src="'+esc(v190RecruitPreviewUrl)+'" alt="Vista previa de convocatoria">'}
}
function v190RefreshRecruitPage(){
  const old=$('#v190-recruitment-page');if(!old)return;
  old.outerHTML=v190RecruitPage();
  const root=$('#v190-recruitment-page');if(root){bindGeneric(root);v190BindRecruitment(root)}
}
function v190BindRecruitment(root){
  $('[data-v190-team-form]',root)?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('[data-v190-team-name]',root)?.value.trim()||'';
    if(!name)return toast('Escribe el nombre del equipo');
    const data=v190RecruitData(),now=new Date().toISOString();
    data.teams.unshift({id:v190RecruitUid(),name,category:$('[data-v190-team-category]',root)?.value||'',community:$('[data-v190-team-community]',root)?.value.trim()||'',contact:$('[data-v190-team-contact]',root)?.value.trim()||'',createdAt:now});
    v190RecruitSave(data);toast('Equipo agregado a reclutamiento');v190RefreshRecruitPage();
  });
  $('[data-v190-player-form]',root)?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('[data-v190-player-name]',root)?.value.trim()||'';
    if(!name)return toast('Escribe el nombre del jugador');
    const data=v190RecruitData(),now=new Date().toISOString(),targetTeam=$('[data-v190-player-team]',root)?.value||'';
    const hit=officialTeams().find(t=>norm(t.name)===norm(targetTeam));
    data.players.unshift({id:v190RecruitUid(),name,category:hit?.category||$('[data-v190-player-category]',root)?.value||'',targetTeam,position:$('[data-v190-player-position]',root)?.value.trim()||'',contact:$('[data-v190-player-contact]',root)?.value.trim()||'',createdAt:now});
    v190RecruitSave(data);toast('Jugador agregado a reclutamiento');v190RefreshRecruitPage();
  });
  $$('[data-v190-delete]',root).forEach(b=>b.addEventListener('click',()=>{
    const value=String(b.dataset.v190Delete||''),p=value.indexOf(':');
    if(p<0)return;
    const kind=value.slice(0,p),id=value.slice(p+1),data=v190RecruitData(),key=kind==='team'?'teams':'players';
    data[key]=data[key].filter(x=>x.id!==id);v190RecruitSave(data);v190RefreshRecruitPage();
  }));
  $$('[data-v190-promote]',root).forEach(b=>b.addEventListener('click',()=>{
    const data=v190RecruitData(),p=data.players.find(x=>x.id===b.dataset.v190Promote);if(!p)return;
    write('v190-recruit-prefill',p);
    go('credentialBuilder');
  }));
  $('[data-v190-png-file]',root)?.addEventListener('change',e=>{
    const file=e.target.files?.[0]||null;
    if(file&&file.type!=='image/png'&&!/\.png$/i.test(file.name||'')){e.target.value='';v190RecruitPngFile=null;return toast('Selecciona una imagen PNG')}
    v190RecruitPngFile=file;
    if(file){v190RecruitSetPreview(file,root);toast('PNG cargado para compartir')}
  });
  ['[data-v190-campaign-kind]','[data-v190-campaign-title]','[data-v190-campaign-message]','[data-v190-ai-tone]','[data-v190-ai-focus]'].forEach(sel=>{
    const el=$(sel,root);if(!el)return;
    el.addEventListener('change',()=>v190RecruitCampaignFromUi(root));
    el.addEventListener('input',()=>v190RecruitCampaignFromUi(root));
  });
  $('[data-v190-ai-generate]',root)?.addEventListener('click',()=>v190RecruitAiGenerate(root));
  $('[data-v190-ai-improve]',root)?.addEventListener('click',()=>v190RecruitAiImprove(root));
  $('[data-v190-preview-png]',root)?.addEventListener('click',async()=>{
    const b=await v190RecruitShareBlob(root);if(b)v190RecruitSetPreview(b,root);
  });
  $('[data-v190-download-png]',root)?.addEventListener('click',async()=>{
    const b=await v190RecruitShareBlob(root);if(b)download(b,'Reclutamiento_Liga_Juventino.png');
  });
  $('[data-v190-share-png]',root)?.addEventListener('click',async()=>{
    const b=await v190RecruitShareBlob(root);if(!b)return;
    try{await fileShare(b,'Reclutamiento_Liga_Juventino.png','Reclutamiento Liga Juventino')}catch(e){}
  });
  $('[data-v190-facebook]',root)?.addEventListener('click',async()=>{
    const text=v190RecruitShareText(root),b=await v190RecruitShareBlob(root);
    try{
      const f=new File([b],'Reclutamiento_Liga_Juventino.png',{type:'image/png'});
      if(navigator.canShare?.({files:[f]})){
        toast('Selecciona Facebook para publicar el PNG');
        await navigator.share({title:'Reclutamiento Liga Juventino',text,files:[f]});
        return;
      }
    }catch(e){}
    try{await navigator.clipboard.writeText(text);toast('Texto copiado; adjunta el PNG en Facebook')}catch(e){}
    window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.origin+location.pathname+'#/recruitment'),'_blank','noopener,noreferrer');
  });
}

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
  if(r==='recruitment'){
    const mountNode=$('[data-v190-recruitment-mount]',screen);
    if(mountNode){
      mountNode.outerHTML=v190RecruitPage();
      const n=$('#v190-recruitment-page',screen);if(n){bindGeneric(n);v190BindRecruitment(n)}
    }
  }
  if(r==='credentialBuilder'&&!$('#v100-credential-extra',screen)){screen.insertAdjacentHTML('beforeend',credentialExtra());const n=$('#v100-credential-extra',screen);bindGeneric(n);bindCredential(n)}
  if(r==='tactics'&&!$('#v100-tactics-extra',screen)){screen.insertAdjacentHTML('beforeend',tacticsExtra());const n=$('#v100-tactics-extra',screen);bindGeneric(n);bindTactics(n)}
  if(r==='weatherFields'&&!$('#v100-weather-extra',screen)){screen.insertAdjacentHTML('beforeend',weatherExtra());const n=$('#v100-weather-extra',screen);bindGeneric(n);bindWeather(n)}
  /* V172: #/v38Weather usa el motor inteligente por partido/campo.
     No inyectar aquí el bloque legado de campo+hora porque duplica controles
     y deja "Revisar campos" dependiendo de un nodo auxiliar. */
  if(r==='v38Weather'){
    $('#v100-weather-extra',screen)?.remove();
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
window.LJR_V100={build:BUILD,mount,officialTeams,credentialCanvas,downloadCredentialPng,downloadCredentialPdf,renderCredentialPreview:v196RenderCredentialPreview,installApp,installIosShortcut:v100IosShortcut,downloadApk:v100DownloadApk};
})();
