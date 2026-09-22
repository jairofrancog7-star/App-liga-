/* V168 — Cuenta/registro de avisos: referencia verde adaptada al azul.
   Añade el formulario al final de Perfil y un acceso coherente en Clima,
   conservando login, preferencias, favoritos y funciones existentes. */
(function(){
'use strict';
if(window.__LJR_V168_ACCOUNT_BLUE__)return;
window.__LJR_V168_ACCOUNT_BLUE__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9ñ]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const FALLBACK={
 '3':{name:'Primera Fuerza',teams:['Hermanos','San José FC','Linces','Juventus','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas']},
 '5':{name:'Intermedia',teams:['La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta']},
 '4':{name:'Segunda Fuerza',teams:['Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata']},
 '2':{name:'Veteranos 35+',teams:['C. de Gasca','Juventus','Cuenda','Pozos FC','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán']},
 '1':{name:'Veteranos 50+',teams:['La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Boavista','Manchester']}
};
function categories(){
  const out=[],db=window.LJR_OFFICIAL_DATA||{};
  for(const [id,c] of Object.entries(db.categories||{}))out.push({id:String(id),name:c.name||FALLBACK[id]?.name||('Categoría '+id)});
  for(const [id,c] of Object.entries(FALLBACK))if(!out.some(x=>x.id===id))out.push({id,name:c.name});
  const order=['3','5','4','2','1'];
  return out.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
}
function teams(cat){
  const set=new Set(),db=window.LJR_OFFICIAL_DATA||{},c=db.categories?.[cat];
  if(c){
    Object.keys(c.rosters||{}).forEach(n=>set.add(String(n).trim()));
    (c.standings||[]).forEach(g=>(g.rows||[]).forEach(r=>r?.[1]&&set.add(String(r[1]).trim())));
    (c.fixtures||[]).forEach(g=>(g.rows||[]).forEach(r=>{if(r?.[2])set.add(String(r[2]).trim());if(r?.[6])set.add(String(r[6]).trim())}));
  }
  try{
    (window.LJR_V100?.officialTeams?.()||[]).filter(x=>String(x.cat||'')===String(cat)||(!x.cat&&x.category===FALLBACK[cat]?.name)).forEach(x=>x?.name&&set.add(String(x.name).trim()));
  }catch(_){}
  (FALLBACK[cat]?.teams||[]).forEach(n=>set.add(n));
  return [...set].filter(Boolean).sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
function toast(msg){
  let t=$('.v168-toast');if(t)t.remove();
  t=document.createElement('div');t.className='v168-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2100);
}
function profileMarkup(){
  const cats=categories(),old=read('v160-alert-profile',{name:'',email:'',cat:cats[0]?.id||'3',team:'',enabled:false});
  const cat=String(old.cat||cats[0]?.id||'3');
  return '<section class="v168-account-card" data-v168-account>'+
    '<div class="v168-account-badge">CUENTA DE LA LIGA</div>'+
    '<div class="v168-account-head"><span class="v168-account-icon">◉</span><div><h2>Regístrate y recibe avisos</h2><p>Guarda tu nombre, categoría y equipo favorito para personalizar la aplicación.</p></div></div>'+
    '<div class="v168-form">'+
      '<label><span>NOMBRE</span><input data-v168-name value="'+esc(old.name||'')+'" placeholder="Tu nombre" autocomplete="name"></label>'+
      '<label><span>CORREO (OPCIONAL)</span><input type="email" data-v168-email value="'+esc(old.email||'')+'" placeholder="correo@ejemplo.com" autocomplete="email"></label>'+
      '<label><span>CATEGORÍA FAVORITA</span><select data-v168-cat>'+cats.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===cat?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></label>'+
      '<label><span>EQUIPO FAVORITO</span><select data-v168-team></select></label>'+
    '</div>'+
    '<div class="v168-account-status" data-v168-status></div>'+
    '<div class="v168-account-actions">'+
      '<button type="button" class="primary" data-v168-save>Guardar y activar avisos</button>'+
      '<button type="button" data-v168-notifications>Preferencias de notificación</button>'+
    '</div>'+
    '<div class="v168-pref-panel" data-v168-pref-panel hidden></div>'+
    '<p class="v168-account-note">La configuración se conserva en este dispositivo. No se elimina ni reemplaza tu Perfil, Fantasy, Quiniela, Favoritos o equipos seguidos.</p>'+
  '</section>';
}
function bindProfile(root){
  const host=$('[data-v168-account]',root);if(!host||host.dataset.bound)return;host.dataset.bound='1';
  const cat=$('[data-v168-cat]',host),team=$('[data-v168-team]',host),status=$('[data-v168-status]',host);
  const old=read('v160-alert-profile',{name:'',email:'',cat:cat.value,team:'',enabled:false});
  const fill=(keep=true)=>{
    const list=teams(cat.value),wanted=keep?old.team:'';
    team.innerHTML=list.length?list.map(n=>'<option '+(norm(n)===norm(wanted)?'selected':'')+'>'+esc(n)+'</option>').join(''):'<option>Sin equipos publicados</option>';
    const db=window.LJR_OFFICIAL_DATA||{},c=db.categories?.[cat.value],players=c?Object.values(c.rosters||{}).reduce((a,v)=>a+(Array.isArray(v)?v.length:0),0):0;
    status.innerHTML='<b>'+list.length+' equipos</b><span>'+(players?players+' jugadores registrados · ':'')+'elige tu favorito para recibir avisos.</span>';
  };
  fill(true);cat.onchange=()=>{old.team='';fill(false)};
  $('[data-v168-save]',host).onclick=()=>{
    const v={name:$('[data-v168-name]',host).value.trim(),email:$('[data-v168-email]',host).value.trim(),cat:cat.value,team:team.value,enabled:true,updatedAt:new Date().toISOString()};
    write('v160-alert-profile',v);status.innerHTML='<b>✓ Avisos activados</b><span>'+esc(team.value)+' · '+esc(cat.selectedOptions?.[0]?.textContent||'')+'</span>';toast('Cuenta local de avisos guardada');
  };
  const prefPanel=$('[data-v168-pref-panel]',host);
  const readPrefs=()=>{try{const s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');return Object.assign({goal:true,kickoff:true,halftime:false,final:true,news:true,video:true,fantasy:true,predictor:true,scheduleChanges:true,venueChanges:true},s.notifications||{})}catch(_){return {goal:true,kickoff:true,halftime:false,final:true,news:true,video:true,fantasy:true,predictor:true,scheduleChanges:true,venueChanges:true}}};
  const writePref=(key,value)=>{let s={};try{s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}')}catch(_){}s.notifications=Object.assign({},s.notifications||{},{[key]:value});localStorage.setItem('lj-store-v3',JSON.stringify(s))};
  const renderPrefs=()=>{
    const p=readPrefs(),rows=[
      ['goal','Goles','Cambios en el marcador'],
      ['kickoff','Inicio de partido','Aviso al comenzar'],
      ['halftime','Medio tiempo','Aviso al descanso'],
      ['final','Final del partido','Resultado final'],
      ['scheduleChanges','Cambios de horario','Reprogramaciones'],
      ['venueChanges','Cambios de sede','Campo o cancha'],
      ['news','Noticias','Comunicados de la Liga'],
      ['video','Nuevos videos','Momentos de la Liga'],
      ['fantasy','Fantasy','Novedades Fantasy'],
      ['predictor','Quiniela','Recordatorios']
    ];
    prefPanel.innerHTML='<div class="v168-pref-title"><b>Avisos dentro de la página</b><span>Activa o desactiva sin salir de Cuenta.</span></div>'+
      rows.map(r=>'<label class="v168-pref-row"><span><b>'+esc(r[1])+'</b><small>'+esc(r[2])+'</small></span><input type="checkbox" data-v168-pref="'+r[0]+'" '+(p[r[0]]?'checked':'')+'><i></i></label>').join('');
    $('[data-v168-pref]',prefPanel).forEach(x=>x.onchange=()=>{writePref(x.dataset.v168Pref,x.checked);toast('Preferencia guardada')});
  };
  $('[data-v168-notifications]',host).onclick=()=>{
    if(prefPanel.hidden){renderPrefs();prefPanel.hidden=false;$('[data-v168-notifications]',host).textContent='Ocultar preferencias';prefPanel.scrollIntoView({behavior:'smooth',block:'nearest'})}
    else{prefPanel.hidden=true;$('[data-v168-notifications]',host).textContent='Preferencias de notificación'}
  };
}
function weatherMarkup(){
  const old=read('v160-alert-profile',{});
  const enabled=!!old.enabled;
  return '<section class="v168-weather-account" data-v168-weather-account>'+
    '<span class="v168-weather-account-icon">◉</span><span class="v168-weather-account-copy"><small>MI CUENTA</small><b>'+(enabled?'Avisos personalizados activos':'Regístrate para recibir avisos')+'</b><em>'+(enabled?(esc(old.team||'Equipo favorito')+' · cambios de horario, cancha y jornada'):'Categoría, equipo favorito y preferencias de notificación')+'</em></span>'+
    '<button type="button" data-v168-open-account>'+(enabled?'Editar':'Registrar')+'</button>'+
  '</section>';
}
function mount(){
  const r=route(),screen=$('#screen');if(!screen)return;
  if(r==='profile'){
    /* V170: Cuenta ya no aparece como tarjeta grande separada al final.
       El registro se abre únicamente desde "Crear una cuenta". */
    $('#v168-profile-account',screen)?.remove();
  }else $('#v168-profile-account',screen)?.remove();
  /* V171: Clima queda como herramienta meteorológica completa.
     La tarjeta "Mi cuenta / Regístrate" no pertenece a esta pantalla. */
  $('#v168-weather-account',screen)?.remove();
}
let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(mount,90)};
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,700);
})();