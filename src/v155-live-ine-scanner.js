/* V155 — Escáner INE/CURP en vivo.
   Usa la cámara del dispositivo y reutiliza el OCR local existente.
   No envía la imagen a GitHub ni a un servicio externo. */
(function(){
'use strict';
if(window.__LJR_V155_LIVE_INE__)return;
window.__LJR_V155_LIVE_INE__=true;

let stream=null,timer=null,busy=false,mounted=false;

function route(){return location.hash.replace(/^#\//,'').split('?')[0]||'home'}
function q(s,r=document){return r.querySelector(s)}
function stopCamera(message='Escáner detenido'){
  if(timer){clearTimeout(timer);timer=null}
  busy=false;
  if(stream){for(const t of stream.getTracks())try{t.stop()}catch(_){};stream=null}
  const video=q('[data-v155-video]');
  if(video){try{video.srcObject=null}catch(_){}}
  const panel=q('[data-v155-live-panel]');
  if(panel)panel.classList.remove('is-live');
  const start=q('[data-v155-live-start]');
  if(start)start.textContent='Escanear INE en vivo';
  const status=q('[data-v155-live-status]');
  if(status&&message)status.textContent=message;
}
function validCurpValue(){
  const v=String(q('[data-v64-cred-curp]')?.value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(v)?v:'';
}
async function frameFile(){
  const video=q('[data-v155-video]');
  if(!video||!video.videoWidth||!video.videoHeight)return null;
  const maxW=2200,scale=Math.min(1,maxW/video.videoWidth);
  const w=Math.max(1,Math.round(video.videoWidth*scale)),h=Math.max(1,Math.round(video.videoHeight*scale));
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d',{alpha:false});
  x.drawImage(video,0,0,w,h);
  const blob=await new Promise(resolve=>c.toBlob(resolve,'image/jpeg',.96));
  return blob?new File([blob],'ine-live-'+Date.now()+'.jpg',{type:'image/jpeg',lastModified:Date.now()}):null;
}
async function analyzeFrame(){
  if(route()!=='credentialBuilder'||!stream||busy)return;
  const detect=q('[data-v64-ocr]'),input=q('[data-v64-doc]'),status=q('[data-v155-live-status]');
  if(!detect||!input)return;
  if(detect.disabled){schedule(1200);return}
  busy=true;
  if(status)status.textContent='Analizando cuadro de la cámara…';
  try{
    const file=await frameFile();
    if(file){
      const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;
      input.dispatchEvent(new Event('change',{bubbles:true}));
      detect.click();
      const started=Date.now();
      const wait=setInterval(()=>{
        if(!detect.disabled||Date.now()-started>50000){
          clearInterval(wait);
          busy=false;
          const curp=validCurpValue();
          const name=String(q('[data-v64-cred-name]')?.value||'').trim();
          if(curp&&name.split(/\s+/).length>=2){
            if(status)status.textContent='CURP validada y nombre detectado. Escáner detenido.';
            stopCamera('');
          }else{
            if(status)status.textContent='Mantén la INE quieta, completa y con buena luz. Volveré a analizar.';
            schedule(4200);
          }
        }
      },450);
    }else{busy=false;schedule(2200)}
  }catch(e){
    busy=false;
    if(status)status.textContent='No pude capturar este cuadro. Intentaré de nuevo.';
    schedule(3000);
  }
}
function schedule(ms=4200){
  if(timer)clearTimeout(timer);
  timer=setTimeout(analyzeFrame,ms);
}
async function startCamera(){
  if(stream){stopCamera();return}
  const status=q('[data-v155-live-status]'),panel=q('[data-v155-live-panel]'),video=q('[data-v155-video]'),start=q('[data-v155-live-start]');
  if(!navigator.mediaDevices?.getUserMedia){
    if(status)status.textContent='Este navegador no permite cámara en vivo. Usa “Seleccionar archivo” y “Detectar texto”.';
    return;
  }
  try{
    if(status)status.textContent='Abriendo cámara trasera…';
    stream=await navigator.mediaDevices.getUserMedia({
      video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},
      audio:false
    });
    video.srcObject=stream;video.setAttribute('playsinline','');video.muted=true;
    await video.play();
    panel.classList.add('is-live');
    if(start)start.textContent='Detener escáner';
    if(status)status.textContent='Coloca la INE completa dentro del cuadro y mantenla quieta.';
    schedule(900);
  }catch(e){
    stream=null;
    if(status)status.textContent='No se pudo abrir la cámara. Revisa el permiso de cámara del navegador.';
  }
}
function mount(){
  if(route()!=='credentialBuilder'){stopCamera('');return}
  const detect=q('[data-v64-ocr]');
  if(!detect)return;
  if(q('[data-v155-live-start]'))return;
  const actions=detect.closest('.v60-actions')||detect.parentElement;
  if(!actions)return;
  const start=document.createElement('button');
  start.type='button';start.className='v60-btn outline v155-live-start';
  start.dataset.v155LiveStart='1';start.textContent='Escanear INE en vivo';
  start.addEventListener('click',startCamera);
  actions.appendChild(start);

  const panel=document.createElement('section');
  panel.className='v155-live-panel';
  panel.dataset.v155LivePanel='1';
  panel.innerHTML='<div class="v155-live-head"><b>Escáner INE/CURP en vivo</b><small>Tipo Lens · cámara + OCR local</small></div>'+
    '<div class="v155-camera-frame"><video data-v155-video playsinline muted></video><span class="v155-guide"></span></div>'+
    '<p data-v155-live-status>Activa la cámara para leer nombre, fecha y CURP mientras encuadras la credencial.</p>'+
    '<div class="v155-live-actions"><button type="button" data-v155-live-now>Analizar ahora</button><button type="button" data-v155-live-stop>Detener</button></div>';
  actions.insertAdjacentElement('afterend',panel);
  q('[data-v155-live-now]',panel).addEventListener('click',()=>{if(stream)analyzeFrame();else startCamera()});
  q('[data-v155-live-stop]',panel).addEventListener('click',()=>stopCamera());
}
let mt=0;
function scheduleMount(){clearTimeout(mt);mt=setTimeout(mount,120)}
window.addEventListener('hashchange',scheduleMount);
window.addEventListener('pagehide',()=>stopCamera(''));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCamera('')});
const screen=q('#screen');if(screen)new MutationObserver(scheduleMount).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleMount,{once:true});else scheduleMount();
setTimeout(scheduleMount,1200);
})();