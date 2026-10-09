/* V635 — Generador de permisos y autorizaciones de Liga.
   Documentos imprimibles/exportables para jugadores, delegados y otros casos autorizados. */
(function(){
'use strict';
if(window.__LJR_V635_PERMISSION_BUILDER__)return;
window.__LJR_V635_PERMISSION_BUILDER__=true;

const DATA_URL='./data/official-live.json?v=20261003-v635-permissions';
const LEAGUE_LOGO='./assets/liga-logo.webp';
const CAT_LOGOS={
  'Primera Fuerza':'./assets/branding/primera-fuerza-hd.png',
  'Intermedia':'./assets/categories/intermedia.webp',
  'Segunda Fuerza':'./assets/categories/segunda-fuerza.webp',
  'Veteranos 35+':'./assets/categories/veteranos-35-user.png',
  'Veteranos 50+':'./assets/categories/veteranos-50.webp'
};
const CATEGORIES=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const PERMISSION_TYPES=[
  'Jugar sin credencial',
  'Jugar con credencial en trámite',
  'Participación provisional',
  'Alta / registro pendiente',
  'Permiso de delegado',
  'Acceso a cancha o banca',
  'Cambio de equipo / situación especial',
  'Otro permiso'
];
const TARGET_TYPES=['Jugador','Delegado','Equipo','Árbitro','Otro'];
/* Autoridades publicadas en la portada del Reglamento 2026–2027.
   Su presencia en el selector no equivale a aprobación ni firma del permiso. */
const SIGNER_ROLES=['Presidente de la Liga','Vicepresidente','Secretario','Tesorero','Administrador de la Liga','Otro cargo'];
const AUTHORITIES=[
  {name:'Florencio Franco Lerma',role:'Presidente de la Liga'},
  {name:'Martín Jaramillo Celedón',role:'Vicepresidente'},
  {name:'Javier Gonzalez Lopez',role:'Secretario'},
  {name:'Octavio Alberto García',role:'Tesorero'}
];
const PERMISSION_FIELDS=[
  'Campo 1 · Unidad Deportiva Sur',
  'Campo 2 · Unidad Deportiva Sur',
  'Campo 3 · Unidad Deportiva Sur',
  'Campo 4 · Emiliano Zapata',
  'Campo Fraccionamiento Comontuoso',
  'Campo San Antonio de Romerillo',
  'Campo San Julián Tierra Blanca',
  'Campo de Tavera',
  'Unidad Deportiva Santiago de Cuenda'
];

let db=null;
let signatureData='';
let lastPayload=null;
let busy=false;

/* V1058: la URL tiene prioridad sobre un data-app-route todavía sin sincronizar. */
const route=()=>String(location.hash.replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const same=(a,b)=>norm(a)===norm(b);
const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];

/* Abrir la herramienta aunque la petición oficial tarde o no haya conexión.
   Reutiliza únicamente los datos oficiales que ya están cargados en la app. */
async function loadDb(){
  if(db?.categories&&Object.keys(db.categories).length)return db;
  try{
    const ready=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
    if(ready?.categories&&Object.keys(ready.categories).length){db=ready;return db}
  }catch(_){}
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),4500);
  try{
    const response=await fetch(DATA_URL,{cache:'no-store',signal:controller.signal});
    if(response.ok){
      const fresh=await response.json();
      if(fresh?.categories)db=fresh;
    }
  }catch(_){}
  finally{clearTimeout(timeout)}
  return db||{};
}
function categoriesFromDb(){
  const cats=Object.values(db?.categories||{}).map(c=>String(c?.name||'').trim()).filter(Boolean);
  return CATEGORIES.filter(c=>cats.some(x=>same(x,c))||!cats.length);
}
function teamsForCategory(catName){
  const out=[];
  const add=n=>{n=String(n||'').trim();if(n&&!out.some(x=>same(x,n)))out.push(n)};
  for(const c of Object.values(db?.categories||{})){
    if(catName&&catName!=='Todas'&&!same(c?.name,catName))continue;
    Object.keys(c?.rosters||{}).forEach(add);
    ((c?.standings||[])[0]?.rows||[]).forEach(r=>add(r?.[1]));
    ((c?.fixtures||[])[0]?.rows||[]).forEach(r=>{add(r?.[2]);add(r?.[6])});
  }
  return out.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
/* V1054 — Escudos reales del equipo dentro de los selectores, sin cambiar las rutas. */
function teamLogo(name){
  if(!name)return '';
  let source='';
  try{source=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||''}catch(_){}
  if(!source)try{source=window.LJR_OFFICIAL_API?.getLogo?.(name)||''}catch(_){}
  if(!source)try{source=window.LJR_TEAM_LOGOS?.get?.(name)||''}catch(_){}
  if(!source){
    for(const data of [window.LJR_OFFICIAL_DATA,db]){
      const hit=Object.entries(data?.team_logos||{}).find(([key])=>same(key,name));
      if(hit){source=hit[1];break}
    }
  }
  if(source&&typeof source==='object')source=source.local||source.source||source.url||source.src||'';
  const value=String(source||'').trim();
  if(!value||/^(?:javascript|file):/i.test(value))return '';
  if(/^(?:https:\/\/|data:image\/(?:png|jpeg|webp);base64,|\.\/|\/|assets\/)/i.test(value))return value;
  return '';
}
function teamCrest(name,extra=''){
  const logo=teamLogo(name);
  const label=String(name||'').trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'EQ';
  return '<span class="v635-team-crest '+esc(extra)+'" aria-hidden="true">'+
    '<span class="v635-team-crest-fallback">'+esc(label)+'</span>'+
    (logo?'<img src="'+esc(logo)+'" alt="" loading="lazy" decoding="async">':'')+
    '</span>';
}
function activateTeamCrests(root){
  if(!root)return;
  root.querySelectorAll('.v635-team-crest img:not([data-v635-crest-init])').forEach(img=>{
    img.dataset.v635CrestInit='1';
    img.addEventListener('load',()=>img.parentElement?.classList.add('v635-logo-loaded'),{once:true});
    img.addEventListener('error',()=>img.remove(),{once:true});
    if(img.complete&&img.naturalWidth>0)img.parentElement?.classList.add('v635-logo-loaded');
    else if(img.complete&&!img.naturalWidth)img.remove();
  });
}
function refreshSelectedTeamCrest(team){
  const button=q('[data-v635-team-open]');
  if(!button)return;
  button.querySelector('.v635-team-crest')?.remove();
  if(team){
    button.insertAdjacentHTML('afterbegin',teamCrest(team,'v635-selected-crest'));
    activateTeamCrests(button);
  }
}
function playerName(x){
  if(typeof x==='string')return x.trim();
  if(!x||typeof x!=='object')return '';
  return String(x.name||x.player||x.jugador||x.full_name||x.nombre||'').trim();
}
function playersFor(catName,teamName){
  const out=[];
  const add=n=>{n=playerName(n)||String(n||'').trim();if(n&&n!=='[object Object]'&&!out.some(x=>same(x,n)))out.push(n)};
  for(const c of Object.values(db?.categories||{})){
    if(catName&&catName!=='Todas'&&!same(c?.name,catName))continue;
    for(const [team,raw] of Object.entries(c?.rosters||{})){
      if(teamName&&!same(team,teamName))continue;
      const rows=Array.isArray(raw)?raw:(raw?.players||raw?.rows||[]);
      (Array.isArray(rows)?rows:[]).forEach(add);
    }
    for(const [team,profiles] of Object.entries(c?.player_profiles||{})){
      if(teamName&&!same(team,teamName))continue;
      (Array.isArray(profiles)?profiles:[]).forEach(add);
    }
  }
  return out.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
/* V1052 — Retratos del selector de permisos: coincidencia exacta de persona y equipo.
   Se leen de fichas oficiales y del registro local privado, sin publicar fotos. */
function safePickerPhoto(value){
  const url=String(value||'').trim();
  if(/^https:\/\/[a-z0-9.-]+(?:\/[^\s<>"']*)?$/i.test(url))return url;
  if(/^(?:\.\/|\/)?assets\/[a-z0-9/_%.+@-]+$/i.test(url))return url;
  if(/^data:image\/(?:jpeg|png|webp|gif);base64,[a-z0-9+/=]+$/i.test(url))return url;
  return '';
}
function registeredPlayerPhoto(name,team){
  try{
    const photos=window.LJR_PLAYER_PHOTOS;
    const key=norm(name)+'|'+norm(team);
    if(!name||!team||!photos)return '';
    return safePickerPhoto(photos instanceof Map?photos.get(key):photos[key]);
  }catch(_){return ''}
}
function officialPickerPhoto(name,cat,team){
  if(!name||!team||!cat)return registeredPlayerPhoto(name,team);
  const sources=[];
  try{sources.push(window.LJR_OFFICIAL_API?.getData?.())}catch(_){}
  sources.push(window.LJR_OFFICIAL_DATA,db);
  for(const source of sources){
    if(!source?.categories)continue;
    const photos=new Set();
    for(const category of Object.values(source.categories)){
      if(!same(category?.name,cat))continue;
      for(const [club,records] of Object.entries(category?.player_profiles||{})){
        if(!same(club,team))continue;
        for(const person of Array.isArray(records)?records:[]){
          if(same(playerName(person),name)){
            const url=safePickerPhoto(person?.photo);
            if(url)photos.add(url);
          }
        }
      }
    }
    if(photos.size===1)return [...photos][0];
    if(photos.size>1)return ''; // Coincidencia ambigua: no mostrar otra cara.
  }
  try{
    const p=window.LJR_V971_PLAYER_INTEGRATION?.find?.(name,team);
    if(p?.photo&&same(p.category,cat))return safePickerPhoto(p.photo);
  }catch(_){}
  return registeredPlayerPhoto(name,team);
}
function localPickerRecord(name,cat,team){
  if(!name||!team)return null;
  try{
    const saved=JSON.parse(localStorage.getItem('v124-player-registry')||'{}');
    const season=localStorage.getItem('v124-player-season')||'';
    const rows=saved?.seasons?.[season]||[];
    if(!Array.isArray(rows))return null;
    const matches=rows.filter(p=>same(p.name,name)&&same(p.team,team)&&
      (!p.category||!cat||same(p.category,cat)));
    return matches.length===1?matches[0]:null;
  }catch(_){return null}
}
function capturedPhotoDatabase(){
  return new Promise(resolve=>{
    if(!('indexedDB' in window)){resolve(null);return}
    const req=indexedDB.open('ljr-registration-media',1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('players'))req.result.createObjectStore('players')};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>resolve(null);
  });
}
function readCapturedPhoto(database,key){
  return new Promise(resolve=>{
    if(!database||!key||!database.objectStoreNames.contains('players')){resolve(null);return}
    try{
      const request=database.transaction('players','readonly').objectStore('players').get(key);
      request.onsuccess=()=>{
        const blob=request.result?.photo;
        resolve(blob instanceof Blob&&blob.type.startsWith('image/')?blob:null);
      };
      request.onerror=()=>resolve(null);
    }catch(_){resolve(null)}
  });
}
function paintPickerPhoto(avatar,url,name,objectUrl=false){
  const safe=objectUrl?String(url||''):safePickerPhoto(url);
  if(!avatar||!safe)return;
  const img=document.createElement('img');
  img.src=safe;
  img.alt='Foto de '+name;
  img.loading='lazy';
  img.decoding='async';
  img.referrerPolicy='no-referrer';
  if(objectUrl){
    const release=()=>URL.revokeObjectURL(safe);
    img.addEventListener('load',release,{once:true});
    img.addEventListener('error',release,{once:true});
  }
  img.addEventListener('error',()=>{
    if(!avatar.contains(img))return;
    avatar.textContent=String(name||'').trim().slice(0,1).toUpperCase()||'•';
    avatar.classList.remove('v1052-has-photo');
  },{once:true});
  avatar.replaceChildren(img);
  avatar.classList.add('v1052-has-photo');
}
function hydratePickerPhotos(host,cat,team){
  if(!host)return;
  const buttons=[...host.querySelectorAll('.v635-player-option[data-v635-player-choice]')];
  for(const button of buttons){
    const name=button.dataset.v635PlayerChoice||'';
    const avatar=button.querySelector('.v635-player-avatar');
    if(!avatar)continue;
    const src=officialPickerPhoto(name,cat,team);
    if(src)paintPickerPhoto(avatar,src,name);
  }
  // Registro más reciente (Blob privado) y fotos de temporadas anteriores (JPEG local).
  (async()=>{
    const local=buttons.map(button=>({
      button,record:localPickerRecord(button.dataset.v635PlayerChoice||'',cat,team)
    })).filter(entry=>entry.record);
    if(!local.length)return;
    let database=null;
    try{
      database=await capturedPhotoDatabase();
      const api=window.LJR_V563_PHOTOS;
      for(const {button,record} of local){
        if(!host.contains(button))continue;
        const name=button.dataset.v635PlayerChoice||'';
        const avatar=button.querySelector('.v635-player-avatar');
        if(!avatar||!same(record.name,name)||!same(record.team,team))continue;
        const photo=await readCapturedPhoto(database,record.assetKey||record.id);
        if(!host.contains(button))continue;
        if(photo){
          const url=URL.createObjectURL(photo);
          paintPickerPhoto(avatar,url,name,true);
          continue;
        }
        if(typeof api?.get==='function'){
          let previous=null;
          try{previous=await api.get(record.id)}catch(_){}
          if(host.contains(button)&&previous&&same(previous.name,name)&&same(previous.team,team))
            paintPickerPhoto(avatar,previous.dataUrl,name);
        }
      }
    }catch(_){}
    finally{try{database?.close()}catch(_){}}
  })();
}
function today(){
  const d=new Date(),p=n=>String(n).padStart(2,'0');
  return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
}
function folio(){
  const d=new Date(),p=n=>String(n).padStart(2,'0');
  return 'LJR-P-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())+p(d.getSeconds());
}
function fmtDate(v){
  if(!v)return 'No especificada';
  const [y,m,d]=String(v).split('-');
  return d&&m&&y?d+'/'+m+'/'+y:String(v);
}
function options(list,selected){
  return list.map(v=>'<option '+(same(v,selected)?'selected':'')+'>'+esc(v)+'</option>').join('');
}
function roundOptions(){
  // Son números disponibles para elegir, no resultados/jornadas ya disputadas.
  return '<option value="">Selecciona jornada</option>'+
    Array.from({length:40},(_,i)=>'<option value="'+(i+1)+'">Jornada '+(i+1)+'</option>').join('');
}
function fieldOptions(){
  // Reutilizar el catálogo local oficial compartido por Campos / Agenda.
  const fields=Array.isArray(window.LJR_FIELDS?.catalog)&&window.LJR_FIELDS.catalog.length
    ?window.LJR_FIELDS.catalog.map(f=>f.name)
    :PERMISSION_FIELDS;
  const seen=new Set();
  return '<option value="">Selecciona campo / sede (opcional)</option>'+
    fields.filter(v=>{const key=norm(v);if(!key||seen.has(key))return false;seen.add(key);return true})
      .map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join('')+
    '<option value="__other__">Otra cancha / sede…</option>';
}
function authorityOptions(){
  return AUTHORITIES.map((a,i)=>
    '<option value="'+esc(a.name)+'"'+(!i?' selected':'')+'>'+esc(a.name)+'</option>').join('')+
    '<option value="__manual__">Otra autoridad / administrador…</option>';
}
function syncAuthority(fromRole=false){
  const authority=q('[data-v635-authority]');
  const role=q('[data-v635-role]');
  const manual=q('[data-v635-signer]');
  if(!authority||!role||!manual)return;
  if(fromRole){
    // No sustituir el nombre introducido para una autoridad personalizada.
    if(authority.value!=='__manual__'){
      const official=AUTHORITIES.find(a=>same(a.role,role.value));
      authority.value=official?official.name:'__manual__';
    }
  }else if(authority.value==='__manual__'&&AUTHORITIES.some(a=>same(a.role,role.value))){
    // Una autoridad nueva no debe heredar automáticamente el título de otra persona.
    role.value='Otro cargo';
  }
  const selected=AUTHORITIES.find(a=>same(a.name,authority.value));
  if(selected){
    role.value=selected.role;
    manual.value='';
    manual.hidden=true;
  }else{
    manual.hidden=authority.value!=='__manual__';
    if(manual.hidden)manual.value='';
  }
}
function syncField(){
  const field=q('[data-v635-field]');
  const manual=q('[data-v635-field-other]');
  if(!field||!manual)return;
  manual.hidden=field.value!=='__other__';
  if(manual.hidden)manual.value='';
}
function toast(msg){
  let n=document.createElement('div');
  n.className='v635-toast';
  n.textContent=msg;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),1900);
}
function icon(){
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5h14a1.5 1.5 0 0 1 1.5 1.5v14A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5Zm2.2 4.2h9.6M7.2 11h9.6M7.2 14.3h5.4M7.3 17.2h3.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
}
function view(){
  const cats=categoriesFromDb();
  const defaultCat=cats[0]||'Primera Fuerza';
  return '<section class="v635-page" data-v635-page>'+
    '<header class="v635-head">'+
      '<div class="v635-head-icon">'+icon()+'</div>'+
      '<div><small>DOCUMENTOS · LIGA JUVENTINO ROSAS</small><h1>Permisos y autorizaciones</h1><p>Genera permisos para jugadores, delegados y situaciones especiales. Puedes imprimir, guardar PDF o exportar como imagen.</p></div>'+
    '</header>'+
    '<div class="v635-layout">'+
      '<form class="v635-form" data-v635-form>'+
        '<div class="v635-form-title"><b>Datos del permiso</b><span>Solo una autoridad autorizada debe firmarlo.</span></div>'+
        '<label><span>Tipo de permiso</span><select data-v635-type>'+options(PERMISSION_TYPES,'Jugar sin credencial')+'</select></label>'+
        '<div class="v635-two">'+
          '<label><span>Dirigido a</span><select data-v635-target>'+options(TARGET_TYPES,'Jugador')+'</select></label>'+
          '<label><span>Categoría</span><select data-v635-cat>'+options(cats,defaultCat)+'</select></label>'+
        '</div>'+
        '<label class="v635-team-field"><span>Equipo</span><input type="hidden" data-v635-team><button type="button" class="v635-team-select" data-v635-team-open aria-haspopup="dialog"><span data-v635-team-label>Selecciona un equipo</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 6 5-6"/></svg></button><small data-v635-team-hint>Equipos filtrados por '+esc(defaultCat)+'</small></label>'+
        '<div class="v635-two">'+
          '<label class="v635-player-field"><span>Jugador / persona</span><input type="hidden" data-v635-person><button type="button" class="v635-team-select v635-player-select" data-v635-player-open aria-haspopup="dialog"><span data-v635-player-label>Selecciona un jugador</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 6 5-6"/></svg></button><small data-v635-player-hint>Primero selecciona un equipo</small></label>'+
          '<label><span>Delegado responsable</span><input type="text" data-v635-delegate placeholder="Nombre del delegado"></label>'+
        '</div>'+
        '<div class="v635-three">'+
          '<label><span>Fecha</span><input type="date" value="'+today()+'" data-v635-date></label>'+
          '<label><span>Vigencia hasta</span><input type="date" data-v635-until></label>'+
          '<label><span>Jornada</span><select data-v635-round>'+roundOptions()+'</select></label>'+
        '</div>'+
        '<label><span>Campo / sede</span><select data-v635-field>'+fieldOptions()+'</select><input type="text" data-v635-field-other placeholder="Escribe el nombre de la cancha" aria-label="Otra cancha o sede" hidden></label>'+
        '<label><span>Motivo y condiciones</span><textarea data-v635-reason rows="4" placeholder="Ej. Se autoriza únicamente para este partido mientras se entrega la credencial oficial."></textarea></label>'+
        '<div class="v635-ai-box"><div><b>Asistente de texto con IA</b><span>Redacta automáticamente un permiso formal usando los datos capturados, sin inventar información.</span></div><button type="button" data-v635-ai>✦ Generar texto con IA</button></div>'+
        '<div class="v635-form-title authority"><b>Autoridad que autoriza</b><span>El documento mostrará este nombre y cargo.</span></div>'+
        '<div class="v635-two">'+
          '<label><span>Nombre</span><select data-v635-authority title="Directiva del Reglamento 2026–2027; la selección no sustituye la firma">'+authorityOptions()+'</select><input type="text" data-v635-signer placeholder="Nombre completo de la autoridad" aria-label="Nombre de otra autoridad" hidden></label>'+
          '<label><span>Cargo</span><select data-v635-role>'+options(SIGNER_ROLES,'Presidente de la Liga')+'</select></label>'+
        '</div>'+
        '<label><span>Firma (opcional)</span><input type="file" accept="image/png,image/jpeg,image/webp" data-v635-signature><small>Si no subes una firma, quedará una línea para firmar en físico.</small></label>'+
        '<div class="v635-actions">'+
          '<button type="button" class="primary" data-v635-generate>Generar permiso</button>'+
          '<button type="button" data-v635-clear>Limpiar</button>'+
        '</div>'+
      '</form>'+
      '<div class="v635-preview-column">'+
        '<div class="v635-preview-tools" data-v635-preview-tools hidden>'+
          '<button type="button" data-v635-print>Imprimir / PDF</button>'+
          '<button type="button" data-v635-png>PNG</button>'+
          '<button type="button" data-v635-jpg>JPG</button>'+
          '<button type="button" data-v635-svg>SVG</button>'+
          '<button type="button" data-v635-share>Compartir</button>'+
        '</div>'+
        '<div class="v635-preview-empty" data-v635-empty>'+icon()+'<b>Vista previa del permiso</b><span>Completa los datos y toca “Generar permiso”.</span></div>'+
        '<div data-v635-preview></div>'+
      '</div>'+
    '</div>'+
    '<div class="v635-team-sheet" data-v635-team-sheet hidden>'+
      '<button type="button" class="v635-team-backdrop" data-v635-team-close aria-label="Cerrar selector de equipo"></button>'+
      '<section class="v635-team-dialog" role="dialog" aria-modal="true" aria-label="Seleccionar equipo">'+
        '<div class="v635-team-dialog-head"><div><small>FILTRO POR CATEGORÍA</small><b>Seleccionar equipo</b></div><button type="button" data-v635-team-close aria-label="Cerrar">×</button></div>'+
        '<label><span>Categoría</span><select data-v635-team-cat>'+options(cats,defaultCat)+'</select></label>'+
        '<label><span>Buscar equipo</span><input type="search" data-v635-team-search placeholder="Escribe el nombre del equipo" autocomplete="off"></label>'+
        '<div class="v635-team-options" data-v635-team-options></div>'+
      '</section>'+
    '</div>'+
    '<div class="v635-team-sheet v635-player-sheet" data-v635-player-sheet hidden>'+
      '<button type="button" class="v635-team-backdrop" data-v635-player-close aria-label="Cerrar selector de jugador"></button>'+
      '<section class="v635-team-dialog" role="dialog" aria-modal="true" aria-label="Seleccionar jugador">'+
        '<div class="v635-team-dialog-head"><div><small>JUGADORES DEL EQUIPO</small><b>Seleccionar jugador</b></div><button type="button" data-v635-player-close aria-label="Cerrar">×</button></div>'+
        '<div class="v635-player-context"><span data-v635-player-context-crest></span><small data-v635-player-cat-label>'+esc(defaultCat)+'</small><b data-v635-player-team-label>Selecciona primero un equipo</b></div>'+
        '<label><span>Buscar jugador</span><input type="search" data-v635-player-search placeholder="Escribe el nombre del jugador" autocomplete="off"></label>'+
        '<div class="v635-team-options" data-v635-player-options></div>'+
      '</section>'+
    '</div>'+
  '</section>';
}
function payload(){
  const val=s=>q(s)?.value?.trim?.()||'';
  return {
    folio:folio(),
    type:val('[data-v635-type]'),
    target:val('[data-v635-target]'),
    category:val('[data-v635-cat]'),
    team:val('[data-v635-team]'),
    person:val('[data-v635-person]'),
    delegate:val('[data-v635-delegate]'),
    date:val('[data-v635-date]'),
    until:val('[data-v635-until]'),
    round:val('[data-v635-round]'),
    field:val('[data-v635-field]')==='__other__'?val('[data-v635-field-other]'):val('[data-v635-field]'),
    reason:val('[data-v635-reason]'),
    signer:val('[data-v635-authority]')==='__manual__'?val('[data-v635-signer]'):val('[data-v635-authority]'),
    role:val('[data-v635-role]'),
    signature:signatureData
  };
}
function defaultReason(type){
  const map={
    'Jugar sin credencial':'Se autoriza la participación de la persona indicada sin presentar credencial física, exclusivamente bajo las condiciones y vigencia señaladas en este documento.',
    'Jugar con credencial en trámite':'Se autoriza la participación provisional mientras concluye el trámite de la credencial oficial de la Liga.',
    'Participación provisional':'Se autoriza la participación provisional únicamente durante la vigencia indicada.',
    'Alta / registro pendiente':'Se autoriza de manera provisional mientras se concluye la revisión o alta administrativa correspondiente.',
    'Permiso de delegado':'Se autoriza al delegado indicado para realizar las funciones expresamente descritas en este documento.',
    'Acceso a cancha o banca':'Se autoriza el acceso a cancha o banca de la persona indicada, únicamente para el partido o periodo señalado.',
    'Cambio de equipo / situación especial':'Se autoriza la situación especial descrita, sujeta a las condiciones indicadas.',
    'Otro permiso':'Se autoriza lo expresamente descrito en este documento.'
  };
  return map[type]||map['Otro permiso'];
}
function permissionHtml(p){
  const valid=p.until?('Del '+fmtDate(p.date)+' al '+fmtDate(p.until)):('Fecha: '+fmtDate(p.date));
  const details=[
    ['Folio',p.folio],
    ['Tipo de permiso',p.type],
    ['Dirigido a',p.target],
    ['Categoría',p.category||'No especificada'],
    ['Equipo',p.team||'No especificado'],
    ['Nombre',p.person||'No especificado'],
    ['Delegado',p.delegate||'No especificado'],
    ['Vigencia',valid],
    ['Jornada',p.round?('J'+String(p.round).replace(/^j/i,'')):'No especificada'],
    ['Campo / sede',p.field||'No especificado']
  ];
  const sign=p.signature
    ?'<img class="v635-sign-img" src="'+p.signature+'" alt="Firma">'
    :'<div class="v635-sign-line"></div>';
  return '<article class="v635-document" data-v635-document>'+
    '<header class="v635-doc-head">'+
      '<img src="'+LEAGUE_LOGO+'" alt="Liga Juventino Rosas">'+
      '<div><small>LIGA MUNICIPAL DE FÚTBOL</small><h2>Juventino Rosas A.C.</h2><p>PERMISO / AUTORIZACIÓN</p></div>'+
      '<img src="'+esc(CAT_LOGOS[p.category]||LEAGUE_LOGO)+'" alt="'+esc(p.category||'Liga')+'">'+
    '</header>'+
    '<div class="v635-rule"></div>'+
    '<h3>'+esc(p.type||'Permiso')+'</h3>'+
    '<p class="v635-intro">Por medio del presente se hace constar la siguiente autorización emitida dentro de la Liga Municipal de Fútbol Juventino Rosas.</p>'+
    '<div class="v635-doc-grid">'+details.map(([k,v])=>'<div><small>'+esc(k)+'</small><b>'+esc(v)+'</b></div>').join('')+'</div>'+
    '<section class="v635-reason"><small>MOTIVO Y CONDICIONES</small><p>'+esc(p.reason||defaultReason(p.type))+'</p></section>'+
    '<p class="v635-validity">Este permiso es válido únicamente para la persona, equipo, jornada y periodo indicados. Cualquier uso distinto requiere nueva autorización de la Liga.</p>'+
    '<div class="v635-signature">'+sign+'<b>'+esc(p.signer||'Nombre de la autoridad')+'</b><span>'+esc(p.role||'Autoridad de la Liga')+'</span><small>Firma de autorización</small></div>'+ 
    (window.LJR_PERMISSION_WORKFLOW?.qrHtml?.(p)||'')+
    '<footer><span>'+esc(p.folio)+'</span><span>Liga Municipal de Fútbol Juventino Rosas A.C.</span></footer>'+
  '</article>';
}
function refreshLists(){
  const cat=q('[data-v635-cat]')?.value||'';
  const teams=teamsForCategory(cat);
  const teamInput=q('[data-v635-team]');
  let team=teamInput?.value||'';
  if(team&&!teams.some(n=>same(n,team))){
    team='';
    if(teamInput)teamInput.value='';
  }
  const teamLabel=q('[data-v635-team-label]');
  if(teamLabel)teamLabel.textContent=team||'Selecciona un equipo';
  refreshSelectedTeamCrest(team);
  const hint=q('[data-v635-team-hint]');
  if(hint)hint.textContent='Equipos filtrados por '+(cat||'categoría');
  const person=q('[data-v635-person]')?.value||'';
  const players=playersFor(cat,team);
  if(person&&!players.some(n=>same(n,person))){
    const p=q('[data-v635-person]');if(p)p.value='';
  }
  const playerLabel=q('[data-v635-player-label]');
  if(playerLabel)playerLabel.textContent=q('[data-v635-person]')?.value||'Selecciona un jugador';
  const playerHint=q('[data-v635-player-hint]');
  if(playerHint)playerHint.textContent=team
    ?(players.length+' jugadores de '+team)
    :'Primero selecciona un equipo';
}
function setPlayer(name){
  const input=q('[data-v635-person]');
  if(input)input.value=String(name||'').trim();
  const label=q('[data-v635-player-label]');
  if(label)label.textContent=input?.value||'Selecciona un jugador';
}
function setTeam(name){
  const input=q('[data-v635-team]');
  const next=String(name||'').trim();
  const changed=!same(input?.value||'',next);
  if(input)input.value=next;
  if(changed)setPlayer('');
  const label=q('[data-v635-team-label]');
  if(label)label.textContent=input?.value||'Selecciona un equipo';
  refreshLists();
  window.LJR_PERMISSION_WORKFLOW?.onTeamChange?.();
}
function renderTeamPicker(){
  const host=q('[data-v635-team-options]');
  if(!host)return;
  const cat=q('[data-v635-team-cat]')?.value||q('[data-v635-cat]')?.value||'';
  const term=norm(q('[data-v635-team-search]')?.value||'');
  const list=teamsForCategory(cat).filter(n=>!term||norm(n).includes(term));
  host.innerHTML=list.length
    ?list.map(n=>'<button type="button" class="v635-team-option v635-team-logo-option" data-v635-team-choice="'+esc(n)+'">'+teamCrest(n)+'<b>'+esc(n)+'</b><small>'+esc(cat)+'</small></button>').join('')
    :'<div class="v635-team-empty">No hay equipos que coincidan en esta categoría.</div>';
  activateTeamCrests(host);
}
function openTeamPicker(){
  const sheet=q('[data-v635-team-sheet]');
  if(!sheet)return;
  const mainCat=q('[data-v635-cat]')?.value||'';
  const pickerCat=q('[data-v635-team-cat]');
  if(pickerCat&&mainCat)pickerCat.value=mainCat;
  const search=q('[data-v635-team-search]');
  if(search)search.value='';
  renderTeamPicker();
  sheet.hidden=false;
  document.body.classList.add('v635-team-picker-open');
  setTimeout(()=>search?.focus(),80);
}
function closeTeamPicker(){
  const sheet=q('[data-v635-team-sheet]');
  if(sheet)sheet.hidden=true;
  document.body.classList.remove('v635-team-picker-open');
}
function renderPlayerPicker(){
  const host=q('[data-v635-player-options]');
  if(!host)return;
  const cat=q('[data-v635-cat]')?.value||'';
  const team=q('[data-v635-team]')?.value||'';
  const term=norm(q('[data-v635-player-search]')?.value||'');
  const catLabel=q('[data-v635-player-cat-label]');
  const teamLabel=q('[data-v635-player-team-label]');
  if(catLabel)catLabel.textContent=cat||'Categoría';
  if(teamLabel)teamLabel.textContent=team||'Selecciona primero un equipo';
  const contextCrest=q('[data-v635-player-context-crest]');
  if(contextCrest){contextCrest.innerHTML=team?teamCrest(team,'v635-context-crest'):'';activateTeamCrests(contextCrest)}
  if(!team){
    host.innerHTML='<div class="v635-team-empty">Selecciona un equipo antes de elegir al jugador.</div>';
    return;
  }
  const list=playersFor(cat,team).filter(n=>!term||norm(n).includes(term));
  host.innerHTML=list.length
    ?list.map(n=>'<button type="button" class="v635-team-option v635-player-option" data-v635-player-choice="'+esc(n)+'"><span class="v635-player-avatar">'+esc(String(n).trim().slice(0,1).toUpperCase()||'•')+'</span><b>'+esc(n)+'</b>'+teamCrest(team,'v635-player-team-crest')+'</button>').join('')
    :'<div class="v635-team-empty">No hay jugadores que coincidan para '+esc(team)+'.</div>';
  if(list.length){activateTeamCrests(host);hydratePickerPhotos(host,cat,team)}
}
function openPlayerPicker(e){
  e?.preventDefault?.();
  e?.stopPropagation?.();
  const team=q('[data-v635-team]')?.value||'';
  if(!team){
    toast('Primero selecciona un equipo');
    openTeamPicker();
    return;
  }
  const sheet=q('[data-v635-player-sheet]');
  if(!sheet)return;
  const search=q('[data-v635-player-search]');
  if(search)search.value='';
  renderPlayerPicker();
  sheet.hidden=false;
  document.body.classList.add('v635-team-picker-open');
  setTimeout(()=>search?.focus(),80);
}
function closePlayerPicker(e){
  e?.preventDefault?.();
  e?.stopPropagation?.();
  const sheet=q('[data-v635-player-sheet]');
  if(sheet)sheet.hidden=true;
  document.body.classList.remove('v635-team-picker-open');
}
function localAiReason(p){
  const person=p.person||((p.target==='Equipo'&&p.team)?p.team:'la persona indicada');
  const team=p.team?(' del equipo '+p.team):'';
  const category=p.category?(' de la categoría '+p.category):'';
  const where=p.field?(' en '+p.field):'';
  const round=p.round?(' durante la jornada '+String(p.round).replace(/^j/i,'')):'';
  const validity=p.until?(' con vigencia del '+fmtDate(p.date)+' al '+fmtDate(p.until)):(' con fecha '+fmtDate(p.date));
  const context=team+category+round+where+validity;
  const map={
    'Jugar sin credencial':'Se autoriza de manera excepcional a '+person+context+' a participar sin presentar la credencial física. La autorización es personal, temporal y válida únicamente para la actividad señalada; deberá verificarse su registro antes del encuentro y quedará sin efecto fuera de la vigencia indicada.',
    'Jugar con credencial en trámite':'Se autoriza provisionalmente a '+person+context+' a participar mientras concluye el trámite de su credencial oficial. La identidad y el registro deberán verificarse previamente y este permiso no sustituye la entrega definitiva de la credencial.',
    'Participación provisional':'Se autoriza la participación provisional de '+person+context+'. La autorización se limita al periodo y condiciones señalados y podrá ser revisada por la Liga antes del inicio del encuentro.',
    'Alta / registro pendiente':'Se autoriza provisionalmente a '+person+context+' mientras concluye la revisión administrativa de su alta o registro. La participación queda condicionada a la validación de los datos y documentación correspondientes.',
    'Permiso de delegado':'Se autoriza a '+person+context+' para desempeñar las funciones de delegado expresamente relacionadas con el equipo y actividad indicados. El permiso es temporal y no amplía atribuciones distintas a las aquí señaladas.',
    'Acceso a cancha o banca':'Se autoriza a '+person+context+' el acceso a cancha o banca exclusivamente para la actividad indicada. Deberá respetar las disposiciones de la Liga, del cuerpo arbitral y del responsable de la sede.',
    'Cambio de equipo / situación especial':'Se autoriza la situación especial correspondiente a '+person+context+', sujeta a revisión administrativa y a las condiciones asentadas en este documento. Cualquier modificación posterior requerirá una nueva autorización.',
    'Otro permiso':'Se autoriza a '+person+context+' únicamente para la situación descrita en este documento. La autorización es temporal, personal y queda sujeta a las disposiciones vigentes de la Liga.'
  };
  return map[p.type]||map['Otro permiso'];
}
async function browserAiReason(p){
  let session=null;
  try{
    const api=globalThis.LanguageModel||globalThis.ai?.languageModel;
    if(!api?.create)return '';
    session=await api.create({temperature:.2,topK:20});
    const prompt='Redacta en español de México un texto oficial, claro y profesional de máximo 90 palabras para el campo "Motivo y condiciones" de un permiso de una liga de fútbol. No inventes nombres, fechas, reglas ni sanciones. Usa solamente estos datos: '+JSON.stringify({
      tipo:p.type,dirigido_a:p.target,categoria:p.category,equipo:p.team,persona:p.person,delegado:p.delegate,
      fecha:fmtDate(p.date),vigencia_hasta:p.until?fmtDate(p.until):'',jornada:p.round,campo:p.field
    })+'. Devuelve únicamente el texto final, sin título ni viñetas.';
    const out=await session.prompt(prompt);
    return typeof out==='string'?out.trim():'';
  }catch(_){
    return '';
  }finally{
    try{session?.destroy?.()}catch(_){}
  }
}
async function generateAiReason(){
  const area=q('[data-v635-reason]');
  const btn=q('[data-v635-ai]');
  if(!area||!btn)return;
  const old=btn.textContent;
  btn.disabled=true;
  btn.textContent='Generando…';
  try{
    const p=payload();
    let text=await browserAiReason(p);
    if(!text)text=localAiReason(p);
    area.value=text;
    area.dispatchEvent(new Event('input',{bubbles:true}));
    toast('Texto automático generado');
  }catch(_){
    toast('No se pudo generar el texto');
  }finally{
    btn.disabled=false;
    btn.textContent=old;
  }
}
async function readFile(file){
  if(!file)return '';
  return await new Promise((resolve,reject)=>{
    const r=new FileReader();
    r.onload=()=>resolve(String(r.result||''));
    r.onerror=reject;
    r.readAsDataURL(file);
  });
}
function generate(){
  const p=payload();
  if(!p.person&&!p.team){toast('Escribe el jugador, delegado o equipo del permiso');return}
  if(!p.signer){toast('Selecciona o escribe quién autoriza el permiso');return}
  if(p.until&&p.date&&p.until<p.date){toast('La vigencia debe ser igual o posterior a la fecha');return}
  if(q('[data-v635-field]')?.value==='__other__'&&!p.field){toast('Escribe la cancha seleccionada');return}
  if(!p.reason)p.reason=defaultReason(p.type);
  lastPayload=p;
  const host=q('[data-v635-preview]');
  if(host)host.innerHTML=permissionHtml(p);
  const empty=q('[data-v635-empty]');
  if(empty)empty.hidden=true;
  const tools=q('[data-v635-preview-tools]');
  if(tools)tools.hidden=false;
  window.LJR_PERMISSION_WORKFLOW?.onGenerated?.(p);
  setTimeout(()=>q('[data-v635-document]')?.scrollIntoView({behavior:'smooth',block:'start'}),60);
}
function clearForm(){
  const form=q('[data-v635-form]');
  form?.reset();
  const date=q('[data-v635-date]');if(date)date.value=today();
  signatureData='';
  lastPayload=null;
  const host=q('[data-v635-preview]');if(host)host.innerHTML='';
  const empty=q('[data-v635-empty]');if(empty)empty.hidden=false;
  const tools=q('[data-v635-preview-tools]');if(tools)tools.hidden=true;
  refreshLists();
  syncAuthority();
  syncField();
}
function download(blob,name){
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
async function dataUri(url){
  if(!url)return '';
  if(/^data:/i.test(url))return url;
  try{
    const r=await fetch(url);
    const b=await r.blob();
    return await new Promise((resolve,reject)=>{
      const fr=new FileReader();fr.onload=()=>resolve(String(fr.result||''));fr.onerror=reject;fr.readAsDataURL(b);
    });
  }catch(_){return ''}
}
function wrap(text,max){
  const words=String(text||'').split(/\s+/).filter(Boolean),lines=[];let line='';
  words.forEach(w=>{
    const next=(line+' '+w).trim();
    if(next.length>max&&line){lines.push(line);line=w}else line=next;
  });
  if(line)lines.push(line);
  return lines.length?lines:[''];
}
function svgText(lines,x,y,size,weight='400',fill='#0a164f',gap=1.25){
  return '<text x="'+x+'" y="'+y+'" font-family="Arial,Helvetica,sans-serif" font-size="'+size+'" font-weight="'+weight+'" fill="'+fill+'">'+
    lines.map((line,i)=>'<tspan x="'+x+'" dy="'+(i===0?0:size*gap)+'">'+esc(line)+'</tspan>').join('')+
  '</text>';
}
async function svgString(p){
  const league=await dataUri(LEAGUE_LOGO);
  const cat=await dataUri(CAT_LOGOS[p.category]||LEAGUE_LOGO);
  const sig=p.signature||'';
  const W=816,H=1056;
  let y=225;
  const rows=[
    ['Folio',p.folio],['Tipo de permiso',p.type],['Dirigido a',p.target],['Categoría',p.category||'No especificada'],
    ['Equipo',p.team||'No especificado'],['Nombre',p.person||'No especificado'],['Delegado',p.delegate||'No especificado'],
    ['Vigencia',p.until?('Del '+fmtDate(p.date)+' al '+fmtDate(p.until)):fmtDate(p.date)],
    ['Jornada',p.round?('J'+String(p.round).replace(/^j/i,'')):'No especificada'],['Campo / sede',p.field||'No especificado']
  ];
  let body='';
  for(let i=0;i<rows.length;i+=2){
    const a=rows[i],b=rows[i+1];
    body+=svgText([a[0].toUpperCase()],58,y,10,'700','#68709a')+svgText(wrap(a[1],34),58,y+20,14,'700','#07105d');
    if(b)body+=svgText([b[0].toUpperCase()],430,y,10,'700','#68709a')+svgText(wrap(b[1],32),430,y+20,14,'700','#07105d');
    y+=62;
  }
  const reasonLines=wrap(p.reason||defaultReason(p.type),88).slice(0,7);
  const validity='Este permiso es válido únicamente para la persona, equipo, jornada y periodo indicados. Cualquier uso distinto requiere nueva autorización de la Liga.';
  let signature='';
  if(sig){
    signature='<image href="'+sig+'" x="313" y="826" width="190" height="70" preserveAspectRatio="xMidYMid meet"/>';
  }else{
    signature='<line x1="300" y1="886" x2="516" y2="886" stroke="#07105d" stroke-width="1.5"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'+
    '<rect width="816" height="1056" fill="#fff"/>'+
    '<rect x="32" y="32" width="752" height="992" rx="18" fill="#fff" stroke="#c8ccea" stroke-width="2"/>'+
    (league?'<image href="'+league+'" x="56" y="62" width="88" height="88" preserveAspectRatio="xMidYMid meet"/>':'')+
    (cat?'<image href="'+cat+'" x="672" y="68" width="76" height="76" preserveAspectRatio="xMidYMid meet"/>':'')+
    svgText(['LIGA MUNICIPAL DE FÚTBOL'],170,78,12,'700','#5d6694')+
    svgText(['JUVENTINO ROSAS A.C.'],170,112,25,'800','#07105d')+
    svgText(['PERMISO / AUTORIZACIÓN'],170,142,14,'800','#0bcbd9')+
    '<line x1="56" y1="170" x2="760" y2="170" stroke="#12dce9" stroke-width="4"/>'+
    svgText([p.type||'PERMISO'],56,207,20,'800','#07105d')+
    body+
    '<rect x="56" y="'+(y-6)+'" width="704" height="'+(reasonLines.length*20+62)+'" rx="12" fill="#f6f8ff" stroke="#d9ddf4"/>'+
    svgText(['MOTIVO Y CONDICIONES'],76,y+18,10,'800','#5f6694')+
    svgText(reasonLines,76,y+44,13,'500','#111a47',1.45)+
    svgText(wrap(validity,95).slice(0,3),56,780,11,'600','#555d80',1.35)+
    signature+
    (window.LJR_PERMISSION_WORKFLOW?.qrSvg?.(p)||'')+
    svgText([p.signer||'Nombre de la autoridad'],408,918,14,'800','#07105d')+
    svgText([p.role||'Autoridad de la Liga'],408,940,11,'700','#5f6694')+
    svgText(['Firma de autorización'],408,958,10,'600','#7c82a4')+
    '<line x1="56" y1="986" x2="760" y2="986" stroke="#d7daee"/>'+
    svgText([p.folio],56,1008,9,'700','#6c7398')+
    '<text x="760" y="1008" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="9" font-weight="700" fill="#6c7398">Liga Municipal de Fútbol Juventino Rosas A.C.</text>'+
  '</svg>';
}
async function exportSvg(){
  if(!lastPayload){toast('Primero genera el permiso');return}
  const svg=await svgString(lastPayload);
  download(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}),'Permiso_'+lastPayload.folio+'.svg');
}
async function raster(type){
  if(!lastPayload){toast('Primero genera el permiso');return null}
  const svg=await svgString(lastPayload);
  return await new Promise((resolve,reject)=>{
    const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob),img=new Image();
    img.onload=()=>{
      try{
        const canvas=document.createElement('canvas');
        canvas.width=1632;canvas.height=2112;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(b=>b?resolve(b):reject(new Error('blob')),type,type==='image/jpeg'?.94:1);
      }catch(e){URL.revokeObjectURL(url);reject(e)}
    };
    img.onerror=e=>{URL.revokeObjectURL(url);reject(e)};
    img.src=url;
  });
}
async function exportRaster(type){
  try{
    const b=await raster(type);if(!b)return;
    const ext=type==='image/jpeg'?'jpg':'png';
    download(b,'Permiso_'+lastPayload.folio+'.'+ext);
  }catch(_){toast('No se pudo generar la imagen')}
}
async function share(){
  try{
    const b=await raster('image/png');if(!b)return;
    const file=new File([b],'Permiso_'+lastPayload.folio+'.png',{type:'image/png'});
    if(navigator.canShare?.({files:[file]})){
      await navigator.share({title:'Permiso Liga Juventino Rosas',text:lastPayload.type,files:[file]});
    }else{
      download(b,file.name);
      toast('Imagen descargada para compartir');
    }
  }catch(_){}
}
function printDoc(){
  const doc=q('[data-v635-document]');
  if(!doc){toast('Primero genera el permiso');return}
  const root=document.createElement('div');
  root.id='v635-print-root';
  root.innerHTML=doc.outerHTML;
  document.body.appendChild(root);
  document.body.classList.add('v635-printing');
  const clean=()=>{document.body.classList.remove('v635-printing');document.getElementById('v635-print-root')?.remove()};
  window.addEventListener('afterprint',clean,{once:true});
  setTimeout(()=>window.print(),80);
  setTimeout(clean,12000);
}
window.LJR_PERMISSION_BUILDER_API={
  openTeamPicker,
  closeTeamPicker,
  chooseTeam(name){setTeam(name||'');closeTeamPicker();},
  openPlayerPicker,
  closePlayerPicker,
  choosePlayer(name){setPlayer(name||'');closePlayerPicker();},
  refresh(){refreshLists();renderTeamPicker();renderPlayerPicker();},
  setSignature(data){
    if(typeof data!=='string'||!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(data)||data.length>4*1024*1024)return false;
    signatureData=data;
    return true;
  },
  showStored(saved){
    if(!saved||typeof saved.folio!=='string'||!saved.folio.startsWith('LJR-P-'))return false;
    // No guardar ni restaurar una firma desde el historial del navegador.
    const fields=['folio','type','target','category','team','person','delegate','date','until','round','field','reason','signer','role'];
    const p=Object.fromEntries(fields.map(k=>[k,String(saved[k]||'').slice(0,k==='reason'?900:160)]));
    p.signature='';
    lastPayload=p;
    const target=q('[data-v635-preview]');
    if(!target)return false;
    target.innerHTML=permissionHtml(p);
    const empty=q('[data-v635-empty]');if(empty)empty.hidden=true;
    const buttons=q('[data-v635-preview-tools]');if(buttons)buttons.hidden=false;
    target.scrollIntoView?.({behavior:'smooth',block:'nearest'});
    return true;
  }
};

function bind(){
  q('[data-v635-authority]')?.addEventListener('change',()=>syncAuthority());
  q('[data-v635-role]')?.addEventListener('change',()=>syncAuthority(true));
  q('[data-v635-field]')?.addEventListener('change',syncField);
  syncAuthority();
  syncField();
  q('[data-v635-cat]')?.addEventListener('change',e=>{
    setTeam('');
    const picker=q('[data-v635-team-cat]');
    if(picker)picker.value=e.target.value;
    renderTeamPicker();
    renderPlayerPicker();
  });
  q('[data-v635-team-open]')?.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();openTeamPicker();
  });
  qa('[data-v635-team-close]').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();closeTeamPicker();
  }));
  q('[data-v635-team-sheet]')?.addEventListener('click',e=>e.stopPropagation());
  q('[data-v635-team-cat]')?.addEventListener('change',e=>{
    e.stopPropagation();
    const main=q('[data-v635-cat]');
    if(main)main.value=e.target.value;
    setTeam('');
    renderTeamPicker();
    renderPlayerPicker();
  });
  q('[data-v635-team-search]')?.addEventListener('click',e=>e.stopPropagation());
  q('[data-v635-team-search]')?.addEventListener('input',e=>{e.stopPropagation();renderTeamPicker()});
  q('[data-v635-team-options]')?.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    const btn=e.target.closest('[data-v635-team-choice]');
    if(!btn)return;
    setTeam(btn.dataset.v635TeamChoice||'');
    closeTeamPicker();
  });
  q('[data-v635-player-open]')?.addEventListener('click',openPlayerPicker);
  qa('[data-v635-player-close]').forEach(btn=>btn.addEventListener('click',closePlayerPicker));
  q('[data-v635-player-sheet]')?.addEventListener('click',e=>e.stopPropagation());
  q('[data-v635-player-search]')?.addEventListener('click',e=>e.stopPropagation());
  q('[data-v635-player-search]')?.addEventListener('input',e=>{e.stopPropagation();renderPlayerPicker()});
  q('[data-v635-player-options]')?.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    const btn=e.target.closest('[data-v635-player-choice]');
    if(!btn)return;
    setPlayer(btn.dataset.v635PlayerChoice||'');
    closePlayerPicker(e);
  });
  q('[data-v635-ai]')?.addEventListener('click',generateAiReason);
  q('[data-v635-signature]')?.addEventListener('change',async e=>{
    const file=e.target.files?.[0];
    signatureData='';
    if(!file)return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>3*1024*1024){
      e.target.value='';
      toast('La firma debe ser PNG, JPG o WEBP, máximo 3 MB');
      return;
    }
    try{signatureData=await readFile(file);toast('Firma cargada')}catch(_){toast('No se pudo leer la firma')}
  });
  q('[data-v635-generate]')?.addEventListener('click',generate);
  q('[data-v635-clear]')?.addEventListener('click',clearForm);
  q('[data-v635-print]')?.addEventListener('click',printDoc);
  q('[data-v635-png]')?.addEventListener('click',()=>exportRaster('image/png'));
  q('[data-v635-jpg]')?.addEventListener('click',()=>exportRaster('image/jpeg'));
  q('[data-v635-svg]')?.addEventListener('click',exportSvg);
  q('[data-v635-share]')?.addEventListener('click',share);
}
async function mount(){
  if(busy||route()!=='permissionBuilder')return;
  const host=q('[data-v635-permission-mount]');
  if(!host||host.dataset.v635Mounted==='1')return;
  busy=true;
  try{
    await loadDb();
    if(route()!=='permissionBuilder'||!host.isConnected)return;
    host.innerHTML=view();
    bind();
    refreshLists();
    host.dataset.v635Mounted='1';
  }catch(error){
    delete host.dataset.v635Mounted;
    console.warn('[LJR Permisos] Error al abrir',error);
    host.innerHTML='<section class="v635-page v635-retry-screen"><h2>No se pudo abrir Permisos</h2><p>Intenta cargar nuevamente la herramienta.</p><button type="button" data-v635-retry>Abrir nuevamente</button></section>';
    host.querySelector('[data-v635-retry]')?.addEventListener('click',()=>{host.innerHTML='';schedule()},{once:true});
  }finally{busy=false}
}
let pendingMount=false;
function schedule(){
  if(pendingMount)return;
  pendingMount=true;
  requestAnimationFrame(()=>{pendingMount=false;setTimeout(mount,20)});
}
window.addEventListener('ljr:official-data',()=>{
  try{
    const fresh=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
    if(fresh?.categories){
      db=fresh;
      if(route()==='permissionBuilder'&&q('[data-v635-page]')){
        refreshLists();
        if(!q('[data-v635-team-sheet]')?.hidden)renderTeamPicker();
        if(!q('[data-v635-player-sheet]')?.hidden)renderPlayerPicker();
      }
    }
  }catch(_){}
});
window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();
})();
