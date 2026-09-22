/* V156 — Un solo botón para INE/CURP.
   El botón principal abre la cámara si no hay archivo; con archivo ejecuta OCR.
   La cámara analiza automáticamente y no muestra controles extra. */
(function(){
'use strict';
if(window.__LJR_V156_ONE_SCAN__)return;
window.__LJR_V156_ONE_SCAN__=true;

let stream=null,timer=null,busy=false;
function route(){return location.hash.replace(/^#\//,'').split('?')[0]||'home'}
function q(s,r=document){return r.querySelector(s)}
function button(){return q('[data-v64-ocr]')}
function active(){return !!stream}
function setButton(label,disabled=false){const b=button();if(b){b.textContent=label;b.disabled=disabled}}
function stop(message=''){
  if(timer){clearTimeout(timer);timer=null}
  busy=false;
  if(stream){for(const t of stream.getTracks())try{t.stop()}catch(_){};stream=null}
  const v=q('[data-v156-video]');if(v)try{v.srcObject=null}catch(_){}
  const panel=q('[data-v156-live-panel]');if(panel)panel.classList.remove('is-live');
  const status=q('[data-v156-status]');if(status&&message)status.textContent=message;
  setButton('Detectar INE / CURP',false);
}
async function frameFile(){
  const v=q('[data-v156-video]');if(!v||!v.videoWidth||!v.videoHeight)return null;
  const maxW=2200,scale=Math.min(1,maxW/v.videoWidth);
  const w=Math.max(1,Math.round(v.videoWidth*scale)),h=Math.max(1,Math.round(v.videoHeight*scale));
  const c=document.createElement('canvas');c.width=w;c.height=h;
  c.getContext('2d',{alpha:false}).drawImage(v,0,0,w,h);
  const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.96));
  return blob?new File([blob],'ine-live-'+Date.now()+'.jpg',{type:'image/jpeg',lastModified:Date.now()}):null;
}
function validCurp(){
  const v=String(q('[data-v64-cred-curp]')?.value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(v)?v:'';
}
function schedule(ms=4200){if(timer)clearTimeout(timer);timer=setTimeout(analyze,ms)}
async function analyze(){
  if(route()!=='credentialBuilder'||!stream||busy)return;
  const detect=button(),input=q('[data-v64-doc]'),status=q('[data-v156-status]');
  if(!detect||!input)return;
  busy=true;setButton('Analizando INE…',true);
  if(status)status.textContent='Leyendo nombre, fecha y CURP…';
  try{
    const file=await frameFile();
    if(!file){busy=false;setButton('Detener escaneo',false);schedule(2200);return}
    const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;
    input.dispatchEvent(new Event('change',{bubbles:true}));
    window.__LJR_V155_INTERNAL_OCR__=true;
    detect.disabled=false;
    detect.click();
    window.__LJR_V155_INTERNAL_OCR__=false;
    const started=Date.now();
    const wait=setInterval(()=>{
      if(!detect.disabled||Date.now()-started>50000){
        clearInterval(wait);busy=false;
        const name=String(q('[data-v64-cred-name]')?.value||'').trim();
        if(validCurp()&&name.split(/\s+/).length>=2){
          if(status)status.textContent='Nombre y CURP detectados correctamente.';
          stop('');
        }else{
          if(status)status.textContent='Mantén la INE completa, quieta y sin reflejos.';
          setButton('Detener escaneo',false);
          schedule(4200);
        }
      }
    },450);
  }catch(e){
    window.__LJR_V155_INTERNAL_OCR__=false;
    busy=false;setButton('Detener escaneo',false);
    if(status)status.textContent='No pude leer este cuadro. Intentaré otra vez.';
    schedule(3000);
  }
}
async function start(){
  if(stream){stop();return}
  if(!navigator.mediaDevices?.getUserMedia){
    const status=q('[data-v156-status]');if(status)status.textContent='Este navegador no permite usar la cámara.';
    return;
  }
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});
    const panel=q('[data-v156-live-panel]'),video=q('[data-v156-video]'),status=q('[data-v156-status]');
    video.srcObject=stream;video.setAttribute('playsinline','');video.muted=true;await video.play();
    panel?.classList.add('is-live');
    if(status)status.textContent='Coloca la INE completa dentro del marco.';
    setButton('Detener escaneo',false);
    schedule(900);
  }catch(e){
    stream=null;setButton('Detectar INE / CURP',false);
    const status=q('[data-v156-status]');if(status)status.textContent='No se pudo abrir la cámara. Revisa el permiso de cámara.';
  }
}
function mount(){
  if(route()!=='credentialBuilder'){stop('');return}
  const detect=button();if(!detect)return;
  if(q('[data-v156-live-panel]'))return;
  detect.textContent='Detectar INE / CURP';
  const actions=detect.closest('.v60-actions')||detect.parentElement;if(!actions)return;
  const panel=document.createElement('section');
  panel.className='v156-live-panel';panel.dataset.v156LivePanel='1';
  panel.innerHTML='<div class="v156-camera-frame"><video data-v156-video playsinline muted></video><span class="v156-guide"></span></div><p data-v156-status>Sube una INE/CURP o usa este mismo botón para abrir la cámara.</p>';
  actions.insertAdjacentElement('afterend',panel);
}
let mt=0;function scheduleMount(){clearTimeout(mt);mt=setTimeout(mount,120)}
window.addEventListener('hashchange',scheduleMount);
window.addEventListener('pagehide',()=>stop(''));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('')});
const screen=q('#screen');if(screen)new MutationObserver(scheduleMount).observe(screen,{childList:true,subtree:false});
window.LJR_V155_LIVE_INE={start,stop,active};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleMount,{once:true});else scheduleMount();
setTimeout(scheduleMount,1200);
})();