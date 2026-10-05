(()=>{
const esc=s=>window.LJR_CMS?.esc(s)||String(s||''),media=()=>window.LJR_MEDIA;
const names=['Perro','Gato','Lobo','Zorro','León','Águila','Astronauta','Portero','Robot'];
const current=()=>window.LJR_V569_AUTH?.currentAccount ? window.LJR_V569_AUTH.currentAccount() : window.LJR_MAIN_ROUTE?.state?.user;

function shirtViewer(){
 return '<div class="ljr-shirt-preview v800-shirt-preview" data-shirt-stage aria-label="Camiseta 3D interactiva">'+
   '<div class="v800-shirt-scene">'+
     '<div class="v800-shirt-card" data-shirt-card style="--shirt-rot:180deg">'+
       '<div class="v800-shirt-face v800-shirt-front" aria-label="Frente de la camiseta">'+
         '<img src="./assets/fantasy-jersey-real-3d.png" alt="Camiseta realista en 3D vista de frente" draggable="false">'+
         '<span class="v800-shirt-chest-mark" aria-hidden="true">LJR</span>'+
       '</div>'+
       '<div class="v800-shirt-face v800-shirt-back" aria-label="Espalda de la camiseta">'+
         '<img src="./profile/jersey-back.webp" alt="Camiseta realista en 3D vista por detrás" draggable="false">'+
         '<div class="ljr-shirt-print v800-shirt-print"><b data-shirt-name></b><strong data-shirt-number></strong></div>'+
       '</div>'+
     '</div>'+
   '</div>'+
   '<div class="v800-shirt-controls" aria-label="Controles de la camiseta">'+
     '<button type="button" data-shirt-side="front">Frente</button>'+
     '<button type="button" data-shirt-side="back" class="is-active">Espalda</button>'+
     '<button type="button" data-shirt-spin>Girar 360°</button>'+
   '</div>'+
   '<div class="v800-shirt-hint"><span>Arrastra la camiseta para girarla libremente</span><b data-shirt-angle>Espalda · 180°</b></div>'+
 '</div>';
}

function bindShirtViewer(n){
 const stage=n.querySelector('[data-shirt-stage]');
 const card=n.querySelector('[data-shirt-card]');
 const angle=n.querySelector('[data-shirt-angle]');
 if(!stage||!card)return;
 let rotation=180,startX=0,startRotation=180,pointerId=null,dragging=false,animationTimer=0;
 const normal=v=>((v%360)+360)%360;
 const sideFor=v=>{const a=normal(v);return a>90&&a<270?'Espalda':'Frente'};
 const buttons=()=>n.querySelectorAll('[data-shirt-side]');
 const updateUi=()=>{
   const side=sideFor(rotation);
   if(angle)angle.textContent=side+' · '+Math.round(rotation)+'°';
   buttons().forEach(b=>b.classList.toggle('is-active',b.dataset.shirtSide===(side==='Frente'?'front':'back')));
 };
 const setRotation=(value,animate=false)=>{
   rotation=Math.max(-960,Math.min(960,Number(value)||0));
   clearTimeout(animationTimer);
   card.classList.toggle('is-animating',animate);
   card.style.setProperty('--shirt-rot',rotation+'deg');
   if(animate)animationTimer=setTimeout(()=>card.classList.remove('is-animating'),620);
   updateUi();
 };
 const endDrag=e=>{
   if(!dragging)return;
   dragging=false;
   card.classList.remove('is-dragging');
   stage.classList.remove('is-dragging');
   try{if(pointerId!==null)stage.releasePointerCapture(pointerId)}catch(_){}
   pointerId=null;
 };
 stage.addEventListener('pointerdown',e=>{
   if(e.target.closest('button'))return;
   dragging=true;pointerId=e.pointerId;startX=e.clientX;startRotation=rotation;
   card.classList.add('is-dragging');stage.classList.add('is-dragging');
   try{stage.setPointerCapture(e.pointerId)}catch(_){}
   e.preventDefault();
 });
 stage.addEventListener('pointermove',e=>{
   if(!dragging||e.pointerId!==pointerId)return;
   const dx=e.clientX-startX;
   setRotation(startRotation+dx*1.35,false);
   e.preventDefault();
 });
 stage.addEventListener('pointerup',endDrag);
 stage.addEventListener('pointercancel',endDrag);
 n.querySelector('[data-shirt-side="front"]')?.addEventListener('click',()=>setRotation(0,true));
 n.querySelector('[data-shirt-side="back"]')?.addEventListener('click',()=>setRotation(180,true));
 n.querySelector('[data-shirt-spin]')?.addEventListener('click',()=>{
   let next=rotation+360;
   if(next>960)next=rotation-360;
   setRotation(next,true);
 });
 card.querySelectorAll('img').forEach(img=>{
   img.addEventListener('error',()=>{
     if(img.closest('.v800-shirt-front')&&!img.dataset.fallback){
       img.dataset.fallback='1';
       img.src='./assets/fantasy-jersey-clean-v774.webp';
     }
   },{once:false});
 });
 setRotation(180,false);
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
window.LJR_PROFILE={open};
})();