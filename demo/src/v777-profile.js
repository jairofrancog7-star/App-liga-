(()=>{
const esc=s=>window.LJR_CMS?.esc(s)||String(s||''),media=()=>window.LJR_MEDIA;
const names=['Perro','Gato','Lobo','Zorro','León','Águila','Astronauta','Portero','Robot'];
const current=()=>window.LJR_V569_AUTH?.currentAccount ? window.LJR_V569_AUTH.currentAccount() : window.LJR_MAIN_ROUTE?.state?.user;

function shirtViewer(){
 const model='https://sketchfab.com/models/6c311a326ee44a97acbde1ecc82edc26/embed?autostart=1&preload=1&ui_theme=dark&ui_infos=0&ui_hint=0&ui_watermark=1&dnt=1';
 return '<div class="ljr-shirt-preview v802-shirt-preview" data-shirt-stage aria-label="Camiseta 3D HD interactiva">'+
   '<div class="v802-shirt-hd-badge">MODELO 3D · HD</div>'+
   '<div class="v802-sketchfab-wrap">'+
     '<iframe data-shirt-model title="Soccer T-shirt 3D" src="'+model+'" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen webkitallowfullscreen mozallowfullscreen frameborder="0"></iframe>'+
     '<div class="v802-shirt-personalization" aria-label="Vista de nombre y número">'+
       '<b data-shirt-name></b><strong data-shirt-number></strong>'+
     '</div>'+
   '</div>'+
   '<div class="v802-shirt-toolbar">'+
     '<button type="button" data-shirt-personalize class="is-active">Nombre y número</button>'+
     '<button type="button" data-shirt-reset>Recentrar modelo</button>'+
   '</div>'+
   '<div class="v802-shirt-hint"><span>Arrastra dentro de la camiseta para girarla libremente en 3D.</span><b>360° / giro continuo</b></div>'+
   '<div class="v802-shirt-source">Modelo 3D: <a href="https://sketchfab.com/3d-models/soccer-t-shirt-6c311a326ee44a97acbde1ecc82edc26" target="_blank" rel="noopener noreferrer">Soccer T-shirt · DanielCobo · Sketchfab</a></div>'+
 '</div>';
}

function bindShirtViewer(n){
 const stage=n.querySelector('[data-shirt-stage]');
 const frame=n.querySelector('[data-shirt-model]');
 const overlay=n.querySelector('.v802-shirt-personalization');
 const personalize=n.querySelector('[data-shirt-personalize]');
 const reset=n.querySelector('[data-shirt-reset]');
 if(!stage||!frame)return;
 const base=frame.src;
 personalize?.addEventListener('click',()=>{
   const hidden=overlay?.classList.toggle('is-hidden');
   personalize.classList.toggle('is-active',!hidden);
   personalize.textContent=hidden?'Mostrar nombre y número':'Nombre y número';
 });
 reset?.addEventListener('click',()=>{
   frame.src='about:blank';
   requestAnimationFrame(()=>{frame.src=base});
 });
 frame.addEventListener('load',()=>stage.classList.add('is-ready'));
}

function open(){
 const a=current();if(!a){window.LJR_MAIN_ROUTE.go('accountLogin');return}
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
     shirtViewer()+
     '<button type="submit" class="ljr-save-profile">Guardar mi perfil</button>'+
   '</form>');
 const form=n.querySelector('form');let preset=/^gamer:[0-8]$/.test(a.avatarPreset||'')?a.avatarPreset:'',photo=a.avatar||'';
 const preview=()=>{
   const data={...a,avatar:photo,avatarPreset:preset};
   n.querySelector('[data-avatar-preview]').innerHTML=window.LJR_CHROME.avatar(data);
   const shirtName=String(form.elements.shirtName.value||'').trim().toUpperCase();
   const shirtNumber=String(form.elements.shirtNumber.value||'').trim();
   n.querySelector('[data-shirt-name]').textContent=shirtName;
   n.querySelector('[data-shirt-number]').textContent=shirtNumber;
   n.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===preset&&!photo)));
 };
 form.oninput=preview;preview();bindShirtViewer(n);
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
   const update={...a,avatar:photo,avatarPreset:preset,shirtName:form.elements.shirtName.value.trim(),shirtNumber:String(number)};
   try{
     const auth=JSON.parse(localStorage.getItem('ljr-auth-v569')||'{}');const i=auth.accounts?.findIndex(x=>x.id===a.id);
     if(i>=0){auth.accounts[i]=update;localStorage.setItem('ljr-auth-v569',JSON.stringify(auth))}
     const st=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');st.user={...(st.user||{}),...update};
     localStorage.setItem('lj-store-v3',JSON.stringify(st));if(window.LJR_MAIN_ROUTE?.state)window.LJR_MAIN_ROUTE.state.user=st.user;
     dispatchEvent(new Event('storage'));n.querySelector('[data-status]').textContent='Perfil guardado.';
     n.querySelector('[data-avatar-preview]').classList.add('ljr-avatar-reveal');
   }catch{n.querySelector('[data-status]').textContent='No se pudo guardar: elige una foto más pequeña.'}
 };
}

function profileRoute(){
 return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'');
}
function mountProfileEntry(){
 if(profileRoute()!=='profile')return;
 const a=current();
 if(!a)return;
 const root=document.querySelector('#screen');if(!root)return;
 let btn=[...root.querySelectorAll('button')].find(b=>String(b.textContent||'').trim()==='Mi avatar y mi camiseta');
 if(!btn){
   btn=document.createElement('button');
   btn.type='button';
   btn.textContent='Mi avatar y mi camiseta';
 }
 btn.dataset.v801ProfileShirt='';
 btn.classList.add('v801-profile-shirt-entry');
 btn.onclick=e=>{e.preventDefault();e.stopPropagation();open()};
 const settings=root.querySelector('[data-ljr-account-settings]');
 if(settings){
   if(btn.previousElementSibling!==settings)settings.insertAdjacentElement('afterend',btn);
 }else if(!btn.isConnected){
   root.append(btn);
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

window.LJR_PROFILE={open};
})();