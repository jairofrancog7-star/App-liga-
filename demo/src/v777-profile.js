(()=>{
const esc=s=>window.LJR_CMS?.esc(s)||String(s||''),media=()=>window.LJR_MEDIA;
const names=['Perro','Gato','Lobo','Zorro','León','Águila','Astronauta','Portero','Robot'];
const current=()=>window.LJR_V569_AUTH?.currentAccount ? window.LJR_V569_AUTH.currentAccount() : window.LJR_MAIN_ROUTE?.state?.user;
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const TEAM_51=[
 "San José FC",
 "Juventus",
 "Linces",
 "Napoli",
 "Hermanos",
 "Franco FC",
 "Herreras FC",
 "Abejas",
 "Terrícolas",
 "Lobos CDG",
 "Galácticos",
 "La Canchita Deportes",
 "Galeana",
 "Aldama FC",
 "Malvinas",
 "Capibaras",
 "La Cuadrilla",
 "Mazacotes FC",
 "Dep. Maravillas",
 "Osasuna",
 "San Antonio Jrs",
 "Populares",
 "Promesas FC",
 "La Huerta",
 "Tavera FC",
 "Pachangas FC",
 "San Juan FC",
 "Tapatío",
 "Dep. La Luz",
 "San Julián",
 "Barza",
 "San José Jrs",
 "San Antonio FC",
 "Célticos FC",
 "Dep. Nopalero",
 "Dep. Zapata",
 "BOAVISTA",
 "FRANCO-TAVERA-JR",
 "HURACAN",
 "CUENDA",
 "AMERICA",
 "AGUILARES",
 "LEYENDAS FC",
 "PSV",
 "LA TRINIDAD",
 "POZOS FC",
 "La Esperanza",
 "Dynamo",
 "Boca Jrs",
 "Toros de Cuenda",
 "Manchester"
];
const SHIRT_CATEGORIES=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const CAT_BY_ID={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const SHIRT_CATEGORY_ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const SHIRT_CATEGORY_LOGOS={
 // V914 — usar los archivos transparentes originales que el usuario ya había
 // entregado y que están guardados en season-2026. No usar las copias antiguas
 // de Liga_Futbol porque esas sí traen fondos sólidos.
 'primerafuerza':'./assets/season-2026/primera.webp',
 'intermedia':'./assets/season-2026/intermedia.webp',
 'segundafuerza':'./assets/season-2026/segunda.webp',
 'veteranos35':'./assets/season-2026/veteranos-35.webp',
 'veteranos50':'./assets/season-2026/veteranos-50.webp'
};
const SHIRT_TEAM_CATEGORY_FALLBACK={
 'Primera Fuerza':['Hermanos','San José FC','Linces','Juventus','Napoli','Lobos CDG','Terrícolas','Galácticos de Pozos','Galácticos','Franco FC','Herreras FC','Abejas'],
 'Intermedia':['La Canchita Deportes','Galeana','Atl. Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta'],
 'Segunda Fuerza':['Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Celticos','Dep. Nopalero','Dep. Zapata'],
 'Veteranos 35+':['Boavista','Franco-Tavera-JR','Huracán','Cuenda','América','Aguilares','Juventus','Leyendas FC','PSV','La Trinidad','Pozos FC'],
 'Veteranos 50+':['La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Boavista','Manchester']
};
function categoryLogo(name){
 // Las rutas ya apuntan a los assets transparentes locales exactos.
 return SHIRT_CATEGORY_LOGOS[norm(name)]||'';
}
function categoriesForTeam(name){
 const key=norm(name);if(!key)return [];
 try{
  const current=window.LJR_V812_TEAM_CATEGORIES?.(name);
  if(Array.isArray(current)&&current.length)return [...new Set(current)];
 }catch(_){}
 const matches=[];
 for(const [category,names] of Object.entries(SHIRT_TEAM_CATEGORY_FALLBACK)){
  if(names.some(team=>norm(team)===key))matches.push(category);
 }
 return matches;
}
function categoryForTeam(name){
 const target=norm(name);if(!target)return '';
 const memberships=categoriesForTeam(name);
 if(memberships.length)return memberships[0];
 // Prefer the app's official normalized team registry when available.
 try{
   const hit=(window.LJR_V100?.officialTeams?.()||[]).find(x=>norm(x?.name)===target&&x?.category);
   if(hit?.category)return String(hit.category).trim();
 }catch(_){}
 // Then inspect the live official category payload.
 const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
 for(const [id,cat] of Object.entries(db.categories||{})){
   const names=[];
   (cat?.teams||[]).forEach(t=>names.push(typeof t==='string'?t:t?.name));
   Object.keys(cat?.rosters||{}).forEach(t=>names.push(t));
   if(names.some(t=>norm(t)===target))return String(cat?.name||cat?.label||CAT_BY_ID[id]||'').trim();
 }
 // Stable fallback used while the official payload is still loading.
 for(const [cat,names] of Object.entries(SHIRT_TEAM_CATEGORY_FALLBACK)){
   if(names.some(t=>norm(t)===target))return cat;
 }
 return '';
}
function leagueTeams(){
 const seen=new Set(),out=[];
 const add=name=>{name=String(name||'').trim();const k=norm(name);if(!name||seen.has(k))return;seen.add(k);out.push(name)};
 TEAM_51.forEach(add);
 const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
 Object.keys(db.team_logos||{}).forEach(add);
 for(const cat of Object.values(db.categories||{})){
   (cat?.teams||[]).forEach(t=>add(typeof t==='string'?t:t?.name));
   Object.keys(cat?.rosters||{}).forEach(add);
 }
 return out;
}
function teamLogo(name){
 if(!name)return '';
 const key=norm(name);
 let v='';

 // V913 — Lobos CDG: usar exactamente el archivo transparente que el usuario
 // ya había entregado y que está guardado en season-2026 (original d24c81...).
 if(key==='loboscdg'||key==='lobosjrs'||key==='lobosjrscerritodegasca'){
   return './assets/season-2026/lobos-cdg.webp';
 }

 // Primero usar los escudos de temporada generados a partir de los archivos
 // transparentes originales del usuario. No pasar por recortadores de fondo.
 try{v=window.LJR_SEASON_LOGOS?.get?.(name)||''}catch(_){}

 // Respaldo: registro estable de la Liga.
 if(!v)try{
   const reg=window.LJR_TEAM_LOGOS;
   const hit=Object.entries(reg?.map||{}).find(([k])=>norm(k)===key)?.[1];
   if(hit){
     const raw=String(hit);
     v=/^(https?:|data:|blob:)/i.test(raw)?raw:String(reg?.base||SHIRT_CATEGORY_ROOT)+raw.replace(/^\.\//,'');
   }
 }catch(_){}
 if(!v)try{v=window.LJR_TEAM_LOGOS?.get?.(name)||''}catch(_){}
 if(!v)try{v=window.LJR_OFFICIAL_API?.getLogo?.(name)||''}catch(_){}
 if(!v){
   const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
   const hit=Object.entries(db.team_logos||{}).find(([k])=>norm(k)===key);
   const raw=hit?.[1];
   if(typeof raw==='string'){
     v=/^(https?:|data:|blob:)/i.test(raw)?raw:SHIRT_CATEGORY_ROOT+raw.replace(/^\.\//,'');
   }else if(raw){
     const local=raw.local||raw.app||raw.source||raw.logo||raw.url||'';
     v=local&&/^(https?:|data:|blob:)/i.test(String(local))?String(local):(local?SHIRT_CATEGORY_ROOT+String(local).replace(/^\.\//,''):'');
   }
 }
 if(!v&&key==='galacticosdepozos')v=SHIRT_CATEGORY_ROOT+'assets/teams/galacticos-pozos.webp';
 return String(v||'');
}
function cleanColor(value){
 const v=String(value||'').trim();
 return /^#[0-9a-f]{6}$/i.test(v)?v:'#0b4bd8';
}

const PROFILE_LEAGUE_LOGO='./assets/branding/escudo-liga-azul-sin-fondo-v1007.png?v=v1010-perfil-camiseta-3d';
function shirtViewer(){
 return '<div class="ljr-shirt-preview v803-shirt-preview" data-shirt-stage aria-label="Camiseta de fútbol 3D editable">'+
   '<div class="v803-shirt-badge">CAMISETA CORTA · 3D</div>'+
   '<div class="v803-shirt-stage" data-football-shirt-3d></div>'+
   '<div class="v803-shirt-controls" aria-label="Controles de camiseta 3D">'+
     '<button type="button" data-shirt-front><span class="v803-control-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4 4 6 2 10l4 2v8h12v-8l4-2-2-4-4-2c-.6 1.5-1.9 2.3-4 2.3S8.6 5.5 8 4Z"/></svg></span><span class="v803-control-label">Frente</span></button>'+
     '<button type="button" data-shirt-back><span class="v803-control-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4 4 6 2 10l4 2v8h12v-8l4-2-2-4-4-2"/><path d="M9 8h6"/></svg></span><span class="v803-control-label">Espalda</span></button>'+
     '<button type="button" data-shirt-spin aria-pressed="false"><span class="v803-control-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2 5"/></svg></span><span class="v803-control-label" data-shirt-spin-label>Girar</span></button>'+
     '<button type="button" data-shirt-shot><span class="v803-control-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h3l1.5-2h5L16 8h3v11H5Z"/><circle cx="12" cy="13" r="3"/></svg></span><span class="v803-control-label">PNG</span></button>'+
   '</div>'+
   '<div class="v803-shirt-foot"><span>Arrastra con el dedo para mover la camiseta libremente.</span><b>Liga + equipo al frente · categoría en espalda</b></div>'+
   '<div class="v803-shirt-open-source">Camiseta corta 3D: logo de la Liga y escudo del equipo al frente; escudo de categoría grande en la espalda. Los tres van integrados en la tela y sin fondo.</div>'+
 '</div>';
}

function bindShirtViewer(n){
 const host=n.querySelector('[data-football-shirt-3d]');
 if(!host)return;
 let tries=0;
 const boot=()=>{
   const engine=window.LJR_FOOTBALL_SHIRT_3D;
   if(!engine?.mount){if(tries++<80)setTimeout(boot,50);return}
   const form=n.querySelector('form');
   const name=String(form?.elements?.shirtName?.value||'JAIRO').trim().toUpperCase();
   const number=String(form?.elements?.shirtNumber?.value||'7').trim();
   const color=cleanColor(form?.elements?.shirtColor?.value);
   const team=String(form?.elements?.shirtTeam?.value||'').trim();
   const category=String(form?.elements?.shirtCategory?.value||categoryForTeam(team)||'').trim();
   const logo=teamLogo(team);
   const categoryCrest=categoryLogo(category);
   const viewer=engine.mount(host,{name,number,color,team,logo,category,categoryLogo:categoryCrest,leagueLogo:PROFILE_LEAGUE_LOGO});
   n.querySelector('[data-shirt-front]')?.addEventListener('click',()=>viewer?.front?.());
   n.querySelector('[data-shirt-back]')?.addEventListener('click',()=>viewer?.back?.());
   n.querySelector('[data-shirt-spin]')?.addEventListener('click',e=>{
     const active=viewer?.toggleSpin?.();
     e.currentTarget.classList.toggle('active',!!active);
     e.currentTarget.setAttribute('aria-pressed',String(!!active));
     const label=e.currentTarget.querySelector('[data-shirt-spin-label]');
     if(label)label.textContent=active?'Detener':'Girar';
   });
   n.querySelector('[data-shirt-shot]')?.addEventListener('click',()=>viewer?.snapshot?.());
 };
 boot();
}

function open(){
 const a=current();if(!a){window.LJR_MAIN_ROUTE.go('accountLogin');return}
 const teams=leagueTeams();
 const selectedTeam=String(a.shirtTeam||a.team||'').trim();
 const selectedColor=cleanColor(a.shirtColor||'#0b4bd8');
 const savedCategory=String(a.shirtCategory||a.category||'').trim();
 const memberships=categoriesForTeam(selectedTeam);
 const selectedCategory=memberships.some(c=>norm(c)===norm(savedCategory))
  ?savedCategory:String(categoryForTeam(selectedTeam)||savedCategory).trim();
 const teamOptions='<option value="">Sin escudo</option>'+teams.map(team=>'<option value="'+esc(team)+'" '+(norm(team)===norm(selectedTeam)?'selected':'')+'>'+esc(team)+'</option>').join('');
 const categoryOptions='<option value="">Selecciona categoría</option>'+SHIRT_CATEGORIES.map(cat=>'<option value="'+esc(cat)+'" '+(norm(cat)===norm(selectedCategory)?'selected':'')+'>'+esc(cat)+'</option>').join('');
 const n=media().modal('Mi avatar y mi camiseta',
   '<form class="cms-form ljr-profile-form">'+
     '<div class="ljr-profile-preview" aria-label="Vista previa de tu avatar"><div data-avatar-preview></div><span>Así se verá tu perfil</span></div>'+
     '<label class="ljr-photo-upload">Seleccionar foto de perfil<input data-photo type="file" accept="image/jpeg,image/png,image/webp"></label>'+
     '<p>Elige un avatar</p>'+
     '<div class="ljr-avatar-gallery">'+names.map((name,i)=>'<button type="button" data-preset="gamer:'+i+'" aria-label="'+name+'" aria-pressed="false"><span class="ljr-gamer-avatar" style="--avatar-x:'+((i%3)*50)+'%;--avatar-y:'+(Math.floor(i/3)*50)+'%"></span><small>'+name+'</small></button>').join('')+
       '<button type="button" data-preset="" aria-label="Inicial">'+esc((a.name||'L').slice(0,1))+'<small>Inicial</small></button>'+
     '</div>'+
     '<div class="v800-shirt-fields">'+
       '<label>Tu nombre en la espalda<input name="shirtName" maxlength="18" value="'+esc(a.shirtName||a.name?.split(' ')[0]||'')+'"></label>'+
       '<label>Número<input name="shirtNumber" type="number" min="0" max="99" value="'+esc(a.shirtNumber??'10')+'"></label>'+
     '</div>'+
     '<div class="v893-shirt-customize">'+
       '<label class="v893-shirt-color">Color de la camiseta<span class="v893-color-control"><input name="shirtColor" type="color" value="'+esc(selectedColor)+'" aria-label="Color de la camiseta"><b data-shirt-color-text>'+esc(selectedColor.toUpperCase())+'</b></span></label>'+
       '<label class="v893-shirt-team">Equipo · '+teams.length+' clubes (53 participaciones)<select name="shirtTeam">'+teamOptions+'</select><span class="v893-team-preview" data-shirt-team-preview aria-live="polite"></span></label>'+
       '<label class="v902-shirt-category">Categoría del equipo<select name="shirtCategory">'+categoryOptions+'</select><small>Si el club participa en dos categorías, elige la correcta para mostrar su escudo.</small><span class="v906-category-preview" data-shirt-category-preview aria-live="polite"></span></label>'+
     '</div>'+
     shirtViewer()+
     '<button type="submit" class="ljr-save-profile">Guardar mi perfil</button>'+
   '</form>');
 const form=n.querySelector('form');let preset=/^gamer:[0-8]$/.test(a.avatarPreset||'')?a.avatarPreset:'',photo=a.avatar||'';
 const preview=()=>{
   const data={...a,avatar:photo,avatarPreset:preset};
   n.querySelector('[data-avatar-preview]').innerHTML=window.LJR_CHROME.avatar(data);
   const shirtName=String(form.elements.shirtName.value||'').trim().toUpperCase();
   const shirtNumber=String(form.elements.shirtNumber.value||'').trim();
   const shirtColor=cleanColor(form.elements.shirtColor.value);
   const shirtTeam=String(form.elements.shirtTeam.value||'').trim();
   const shirtCategory=String(form.elements.shirtCategory.value||categoryForTeam(shirtTeam)||'').trim();
   const logo=teamLogo(shirtTeam);
   const categoryCrest=categoryLogo(shirtCategory);
   const shirtHost=n.querySelector('[data-football-shirt-3d]');
   window.LJR_FOOTBALL_SHIRT_3D?.update?.(shirtHost,{name:shirtName,number:shirtNumber,color:shirtColor,team:shirtTeam,logo,category:shirtCategory,categoryLogo:categoryCrest,leagueLogo:PROFILE_LEAGUE_LOGO});
   const colorText=n.querySelector('[data-shirt-color-text]');if(colorText)colorText.textContent=shirtColor.toUpperCase();
   const badge=n.querySelector('[data-shirt-team-preview]');
   if(badge)badge.innerHTML=shirtTeam?(logo?'<img src="'+esc(logo)+'" alt=""><span><b>'+esc(shirtTeam)+'</b><small>Escudo del equipo · frente</small></span>':'<span><b>'+esc(shirtTeam)+'</b><small>Escudo del equipo pendiente</small></span>'):'<span><b>Sin equipo</b><small>Selecciona uno de los 51 clubes</small></span>';
   const catBadge=n.querySelector('[data-shirt-category-preview]');
   if(catBadge)catBadge.innerHTML=shirtCategory?(categoryCrest?'<img src="'+esc(categoryCrest)+'" alt=""><span><b>'+esc(shirtCategory)+'</b><small>Escudo de categoría · espalda</small></span>':'<span><b>'+esc(shirtCategory)+'</b><small>Escudo de categoría pendiente</small></span>'):'<span><b>Sin categoría</b><small>Se asigna al elegir equipo</small></span>';
   n.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===preset&&!photo)));
 };
 form.oninput=preview;
 const syncCategoryFromTeam=()=>{
   const picker=form.elements.shirtCategory;
   const team=String(form.elements.shirtTeam.value||'').trim();
   const eligible=categoriesForTeam(team);
   for(const option of picker.options){
    if(option.value)option.disabled=eligible.length>0&&!eligible.some(cat=>norm(cat)===norm(option.value));
   }
   if(eligible.length&&!eligible.some(cat=>norm(cat)===norm(picker.value)))picker.value=eligible[0];
   if(!eligible.length){
    const auto=categoryForTeam(team);
    if(auto&&norm(picker.value)!==norm(auto))picker.value=auto;
   }
 };
 form.elements.shirtTeam?.addEventListener('change',()=>{syncCategoryFromTeam();preview()});
 syncCategoryFromTeam();preview();bindShirtViewer(n);
 n.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{preset=b.dataset.preset;photo='';preview()});
 n.querySelector('[data-photo]').onchange=async e=>{
   const f=e.target.files?.[0];if(!f)return;
   if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>2*1024*1024){n.querySelector('[data-status]').textContent='Elige una imagen JPG, PNG o WebP de hasta 2 MB.';return}
   photo=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f)});
   preset='';preview();
 };
 form.onsubmit=e=>{
   e.preventDefault();
   const number=Number(form.elements.shirtNumber.value);if(!Number.isInteger(number)||number<0||number>99)return;
   const update={...a,avatar:photo,avatarPreset:preset,shirtName:form.elements.shirtName.value.trim(),shirtNumber:String(number),shirtColor:cleanColor(form.elements.shirtColor.value),shirtTeam:String(form.elements.shirtTeam.value||'').trim(),shirtCategory:String(form.elements.shirtCategory.value||'').trim()};
   const allowed=categoriesForTeam(update.shirtTeam);
   if(allowed.length&&!allowed.some(c=>norm(c)===norm(update.shirtCategory))){
     n.querySelector('[data-status]').textContent='Selecciona una categoría en la que participe ese equipo.';
     return;
   }
   try{
     const auth=JSON.parse(localStorage.getItem('ljr-auth-v569')||'{}');const i=auth.accounts?.findIndex(x=>x.id===a.id);
     if(i>=0){auth.accounts[i]=update;localStorage.setItem('ljr-auth-v569',JSON.stringify(auth))}
     const st=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');st.user={...(st.user||{}),...update};
     localStorage.setItem('lj-store-v3',JSON.stringify(st));if(window.LJR_MAIN_ROUTE?.state)window.LJR_MAIN_ROUTE.state.user=st.user;
     dispatchEvent(new Event('storage'));
     try{dispatchEvent(new CustomEvent('ljr:profile-updated',{detail:{accountId:a.id}}))}catch(_){}
     n.querySelector('[data-status]').textContent='Perfil guardado.';
     n.querySelector('[data-avatar-preview]').classList.add('ljr-avatar-reveal');
   }catch{n.querySelector('[data-status]').textContent='No se pudo guardar: elige una foto más pequeña.'}
 };
}

function profileRoute(){
 return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'');
}
function mountProfileEntry(){
 if(profileRoute()!=='profile')return;
 const a=current();if(!a)return;
 const root=document.querySelector('#screen');if(!root)return;

 const candidates=[...root.querySelectorAll('button,a,[role="button"],.v12-profile-menu>*')]
   .filter(el=>String(el.textContent||'').replace(/\s+/g,' ').trim()==='Mi avatar y mi camiseta');
 const generated=[...root.querySelectorAll('.v801-profile-shirt-entry')];

 let btn=candidates.find(el=>!el.classList.contains('v801-profile-shirt-entry'))||candidates[0]||null;
 generated.forEach(el=>{if(el!==btn)el.remove()});

 if(!btn){
   btn=document.createElement('button');
   btn.type='button';
 }
 btn.type='button';
 const rowClass='v12-profile-row ljr-profile-action-row ljr-profile-shirt-row v801-profile-shirt-entry';
 if(btn.className!==rowClass)btn.className=rowClass;
 btn.removeAttribute('style');
 if(btn.dataset.v901Markup!=='1'){
   btn.innerHTML='<span class="v12-profile-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m8 4 2-1h4l2 1 4 3-2.2 4-1.8-1v10H8V10l-1.8 1L4 7l4-3Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/><path d="M10 3c.2 1.3.9 2 2 2s1.8-.7 2-2" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/></svg></span><span class="v12-profile-row-label">Mi avatar y mi camiseta</span><span class="v12-profile-row-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
   btn.dataset.v901Markup='1';
 }
 btn.dataset.v803ProfileShirt='1';

 const menu=root.querySelector('.v12-profile-menu');
 const settings=root.querySelector('[data-ljr-account-settings]');
 if(menu){
   const logout=menu.querySelector('[data-v569-logout]');
   if(settings&&settings.parentElement===menu){
     if(btn.parentElement!==menu||btn.previousElementSibling!==settings)settings.insertAdjacentElement('afterend',btn);
   }else if(logout){
     if(btn.parentElement!==menu||btn.nextElementSibling!==logout)menu.insertBefore(btn,logout);
   }else if(btn.parentElement!==menu)menu.append(btn);
 }

 if(btn.dataset.v803ProfileBound!=='1'){
   btn.dataset.v803ProfileBound='1';
   btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open()});
 }
}
function scheduleProfileEntry(){
 requestAnimationFrame(()=>setTimeout(mountProfileEntry,0));
}
window.addEventListener('hashchange',scheduleProfileEntry);
window.addEventListener('storage',scheduleProfileEntry);
document.addEventListener('DOMContentLoaded',scheduleProfileEntry,{once:true});
if(document.readyState!=='loading')scheduleProfileEntry();
new MutationObserver(()=>{if(profileRoute()==='profile')mountProfileEntry()}).observe(document.documentElement,{childList:true,subtree:true});

window.LJR_PROFILE={open,categoriesForTeam,categoryForTeam};
})();