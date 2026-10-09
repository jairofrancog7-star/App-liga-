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
const SIGNER_ROLES=['Presidente de la Liga','Tesorero','Administrador de la Liga','Secretario','Otro cargo'];

let db=null;
let signatureData='';
let lastPayload=null;
let busy=false;

const route=()=>String(document.body?.dataset?.appRoute||location.hash.replace(/^#\/?/,'').split('?')[0]||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const same=(a,b)=>norm(a)===norm(b);
const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];

async function loadDb(){
  if(db)return db;
  try{
    const r=await fetch(DATA_URL,{cache:'no-store'});
    if(r.ok)db=await r.json();
  }catch(_){}
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
function localPickerRecordId(name,cat,team){
  if(!name||!team)return '';
  try{
    const saved=JSON.parse(localStorage.getItem('v124-player-registry')||'{}');
    const season=localStorage.getItem('v124-player-season')||'';
    const rows=saved?.seasons?.[season]||[];
    if(!Array.isArray(rows))return '';
    const matches=rows.filter(p=>same(p.name,name)&&same(p.team,team)&&
      (!p.category||!cat||same(p.category,cat)));
    return matches.length===1?String(matches[0].id||''):'';
  }catch(_){return ''}
}
function paintPickerPhoto(avatar,url,name){
  const safe=safePickerPhoto(url);
  if(!avatar||!safe)return;
  const img=document.createElement('img');
  img.src=safe;
  img.alt='Foto de '+name;
  img.loading='lazy';
  img.decoding='async';
  img.referrerPolicy='no-referrer';
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
  // Fotos privadas del teléfono: busca solo IDs del jugador/equipo/temporada.
  const api=window.LJR_V563_PHOTOS;
  if(typeof api?.get!=='function')return;
  (async()=>{
    for(const button of buttons){
      const name=button.dataset.v635PlayerChoice||'';
      const avatar=button.querySelector('.v635-player-avatar');
      if(!avatar||avatar.classList.contains('v1052-has-photo')||!host.contains(button))continue;
      const id=localPickerRecordId(name,cat,team);
      if(!id)continue;
      let record=null;
      try{record=await api.get(id)}catch(_){}
      if(!host.contains(button)||!record||!same(record.name,name)||!same(record.team,team))continue;
      if(!avatar.classList.contains('v1052-has-photo'))paintPickerPhoto(avatar,record.dataUrl,name);
    }
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
          '<label><span>Jornada</span><input type="text" data-v635-round placeholder="Ej. 4"></label>'+
        '</div>'+
        '<label><span>Campo / sede</span><input type="text" data-v635-field placeholder="Opcional"></label>'+
        '<label><span>Motivo y condiciones</span><textarea data-v635-reason rows="4" placeholder="Ej. Se autoriza únicamente para este partido mientras se entrega la credencial oficial."></textarea></label>'+
        '<div class="v635-ai-box"><div><b>Asistente de texto con IA</b><span>Redacta automáticamente un permiso formal usando los datos capturados, sin inventar información.</span></div><button type="button" data-v635-ai>✦ Generar texto con IA</button></div>'+
        '<div class="v635-form-title authority"><b>Autoridad que autoriza</b><span>El documento mostrará este nombre y cargo.</span></div>'+
        '<div class="v635-two">'+
          '<label><span>Nombre</span><input type="text" data-v635-signer placeholder="Nombre del presidente / administrador"></label>'+
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
        '<div class="v635-player-context"><small data-v635-player-cat-label>'+esc(defaultCat)+'</small><b data-v635-player-team-label>Selecciona primero un equipo</b></div>'+
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
    field:val('[data-v635-field]'),
    reason:val('[data-v635-reason]'),
    signer:val('[data-v635-signer]'),
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
}
function renderTeamPicker(){
  const host=q('[data-v635-team-options]');
  if(!host)return;
  const cat=q('[data-v635-team-cat]')?.value||q('[data-v635-cat]')?.value||'';
  const term=norm(q('[data-v635-team-search]')?.value||'');
  const list=teamsForCategory(cat).filter(n=>!term||norm(n).includes(term));
  host.innerHTML=list.length
    ?list.map(n=>'<button type="button" class="v635-team-option" data-v635-team-choice="'+esc(n)+'"><span>'+esc(String(n).trim().slice(0,1).toUpperCase()||'•')+'</span><b>'+esc(n)+'</b><small>'+esc(cat)+'</small></button>').join('')
    :'<div class="v635-team-empty">No hay equipos que coincidan en esta categoría.</div>';
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
  if(!team){
    host.innerHTML='<div class="v635-team-empty">Selecciona un equipo antes de elegir al jugador.</div>';
    return;
  }
  const list=playersFor(cat,team).filter(n=>!term||norm(n).includes(term));
  host.innerHTML=list.length
    ?list.map(n=>'<button type="button" class="v635-team-option v635-player-option" data-v635-player-choice="'+esc(n)+'"><span class="v635-player-avatar">'+esc(String(n).trim().slice(0,1).toUpperCase()||'•')+'</span><b>'+esc(n)+'</b><small>'+esc(team)+'</small></button>').join('')
    :'<div class="v635-team-empty">No hay jugadores que coincidan para '+esc(team)+'.</div>';
  if(list.length)hydratePickerPhotos(host,cat,team);
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
  if(!p.signer){toast('Escribe quién autoriza el permiso');return}
  if(!p.reason)p.reason=defaultReason(p.type);
  lastPayload=p;
  const host=q('[data-v635-preview]');
  if(host)host.innerHTML=permissionHtml(p);
  const empty=q('[data-v635-empty]');
  if(empty)empty.hidden=true;
  const tools=q('[data-v635-preview-tools]');
  if(tools)tools.hidden=false;
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
  refresh(){refreshLists();renderTeamPicker();renderPlayerPicker();}
};

function bind(){
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
    if(!file){signatureData='';return}
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
    if(route()!=='permissionBuilder')return;
    host.dataset.v635Mounted='1';
    host.innerHTML=view();
    bind();
    refreshLists();
  }finally{busy=false}
}
function schedule(){requestAnimationFrame(()=>setTimeout(mount,20))}
window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();
})();
