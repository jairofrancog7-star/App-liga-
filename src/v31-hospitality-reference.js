const V31_HOSPITALITY_LOGO = './assets/reference/predictor-v36/liga-crest-white.webp?v=20260927-restore-three';

function v31HospitalityMarkup(){
  return `
  <section class="v31-hospitality-page" aria-label="Hospitalidad">
    <!-- Sólo decoración: mantiene el diseño original y no captura pulsaciones. -->
    <svg class="v31-hospitality-lienzos" viewBox="0 0 690 415" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="v31-lienzo-azul" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#6bd9ff" stop-opacity=".07"/>
          <stop offset="42%" stop-color="#3999fc" stop-opacity=".72"/>
          <stop offset="100%" stop-color="#3048a4" stop-opacity=".10"/>
        </linearGradient>
        <linearGradient id="v31-lienzo-cian" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#00b8e7" stop-opacity=".16"/>
          <stop offset="48%" stop-color="#5bceff" stop-opacity=".60"/>
          <stop offset="100%" stop-color="#2b73bc" stop-opacity=".09"/>
        </linearGradient>
        <linearGradient id="v31-lienzo-oro" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2676D8" stop-opacity=".03"/>
          <stop offset="52%" stop-color="#55A8FF" stop-opacity=".35"/>
          <stop offset="100%" stop-color="#2059C8" stop-opacity=".03"/>
        </linearGradient>
      </defs>
      <g fill="none" stroke-linecap="round">
        <path d="M-100 230 C55 141 171 24 333-55" stroke="url(#v31-lienzo-cian)" stroke-width="3"/>
        <path d="M-56 337 C92 225 202 154 411 9 S619 -37 747 50" stroke="url(#v31-lienzo-azul)" stroke-width="2.1"/>
        <path d="M-44 57 C122 -40 259 2 365 53 S601 154 746 107" stroke="url(#v31-lienzo-azul)" stroke-width="1.4" opacity=".8"/>
        <path d="M-65 345 C91 402 250 374 425 296 S630 252 761 329" stroke="url(#v31-lienzo-oro)" stroke-width="2.5"/>
        <path d="M-55 388 C125 307 267 296 400 334 S629 380 730 292" stroke="url(#v31-lienzo-cian)" stroke-width="2" opacity=".7"/>
        <path d="M73 220 C92 137 204 117 338 140 S608 192 612 275 S443 391 253 345 S55 286 73 220Z" stroke="url(#v31-lienzo-azul)" stroke-width="3.6" opacity=".58"/>
        <path d="M78 230 C97 151 221 130 351 156 S583 203 586 267" stroke="url(#v31-lienzo-oro)" stroke-width="1.25" opacity=".5"/>
      </g>
    </svg>
    <header class="v774-hospitality-head"><button type="button" class="v31-back" data-v31-back aria-label="Volver">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
    </button>

    <h1>Introduce tus datos</h1></header>

    <div class="v31-access-switch" role="group" aria-label="Tipo de acceso">
      <button type="button" class="v31-access-option is-selected" data-v31-access="liga" aria-pressed="true">
        <span class="v31-selected-content">
          <span class="v31-check" aria-hidden="true"></span>
          <img class="v31-league-logo" src="${V31_HOSPITALITY_LOGO}" alt="Liga Municipal de Fútbol Juventino Rosas">
          <span class="v31-league-name">Liga Municipal<br>de Fútbol<br>Juventino Rosas</span>
        </span>
      </button>
      <button type="button" class="v31-access-option" data-v31-access="vip" aria-pressed="false">
        <span class="v31-vip">VIP</span>
      </button>
    </div>

    <label class="v31-code-wrap">
      <svg class="v31-qr" viewBox="0 0 44 44" aria-hidden="true">
        <path d="M2 2h14v14H2V2Zm4 4v6h6V6H6Zm22-4h14v14H28V2Zm4 4v6h6V6h-6ZM2 28h14v14H2V28Zm4 4v6h6v-6H6Zm14-30h4v4h-4V2Zm0 8h4v8h-4v-8Zm0 12h4v4h-4v-4Zm8-2h4v4h-4v-4Zm6 0h8v4h-8v-4Zm-14 8h4v4h-4v-4Zm8-2h4v8h-4v-8Zm8 2h6v4h-6v-4Zm-14 8h4v6h-4v-6Zm8 0h4v4h-4v-4Zm8-2h4v8h-4v-8Z"/>
      </svg>
      <input class="v31-code-input" data-v31-code type="text" inputmode="text" autocomplete="one-time-code" aria-label="Código de invitado" placeholder="Código de invitado">
    </label>

    <p class="v31-code-note">Solicita tu código de invitado a la administración de la Liga.</p>


    <div class="ljr-hospitality-actions"><button type="button" class="v31-continue" data-v31-continue>Continuar</button>
    <button type="button" class="v774-invites" data-v774-invites>Administrar invitaciones</button></div><div class="v31-feedback" data-v31-feedback role="status" aria-live="polite"></div>
  </section>`;
}

function v31ShowFeedback(message){
  const el = document.querySelector('[data-v31-feedback]');
  if(!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(v31ShowFeedback.timer);
  // Keep the admission receipt visible until the user leaves this page.
}

function v31BindHospitality(){
  const page = document.querySelector('.v31-hospitality-page');
  if(!page || page.dataset.bound === '1') return;
  page.dataset.bound = '1';

  const back = page.querySelector('[data-v31-back]');
  if(back) back.addEventListener('click', ()=>{ location.hash = '#/more'; });

  page.querySelectorAll('[data-v31-access]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      page.querySelectorAll('[data-v31-access]').forEach(x=>{
        const selected = x === btn;
        x.classList.toggle('is-selected', selected);
        x.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    });
  });

  const input = page.querySelector('[data-v31-code]');
  const saved = localStorage.getItem('lj-hospitality-code') || '';
  if(input && saved) input.value = saved;

  const cont = page.querySelector('[data-v31-continue]');
  page.querySelector('[data-v774-invites]').onclick=()=>window.LJR_MEDIA?.invitations();
  if(cont) cont.addEventListener('click', async ()=>{
    const code = (input?.value || '').trim();
    if(!code){
      input?.focus();
      v31ShowFeedback('Introduce tu código de invitado');
      return;
    }
    cont.disabled=true;cont.textContent='Validando…';
    try{
      const receipt=await window.LJR_MEDIA.api('hospitality/redeem',{method:'POST',body:{code,access:page.querySelector('[data-v31-access].is-selected')?.dataset.v31Access||'liga'}});
      localStorage.setItem('lj-hospitality-receipt',JSON.stringify(receipt));localStorage.removeItem('lj-hospitality-code');
      input.value='';v31ShowFeedback('Bienvenido, '+receipt.name+'. Acceso '+receipt.access.toUpperCase()+' confirmado.');
    }catch(err){v31ShowFeedback(err.message||'No se pudo validar el código. Vuelve a intentarlo.')}
    finally{cont.disabled=false;cont.textContent='Continuar'}
  });
}

// Only Hospitalidad's original background and Android/PWA upper system bar.
// Neither the header nor the invitation controls are repositioned.
const V31_HOSPITALITY_BG='linear-gradient(180deg, #0A369F 0%, #081F7A 40%, #050B4E 100%)';
let v31OriginalThemeColor=null;
function v31SyncHospitalityTheme(active){
  const theme=document.querySelector('meta[name="theme-color"]');
  if(!theme)return;
  if(active){
    if(v31OriginalThemeColor===null)v31OriginalThemeColor=theme.getAttribute('content')||'#000144';
    if(theme.content!=='#0A369F')theme.setAttribute('content','#0A369F');
  }else if(v31OriginalThemeColor!==null){
    theme.setAttribute('content',v31OriginalThemeColor);
    v31OriginalThemeColor=null;
  }
}

function v31ApplyHospitality(){
  const isHospitality = location.hash.replace('#/','').split('?')[0] === 'hospitality';
  document.documentElement.classList.toggle('v31-hospitality-active', isHospitality);
  v31SyncHospitalityTheme(isHospitality);
  if(!isHospitality) return;

  const screen = document.querySelector('#screen');
  const mount = screen?.querySelector('[data-v31-hospitality-mount]');
  if(!screen || !mount) return;
  if(!mount.querySelector('.v31-hospitality-page')){
    mount.innerHTML = v31HospitalityMarkup();
  }
  // Apply only the two-blue background to the existing hospitalidad page.
  // Inline !important wins over legacy stylesheets, even if loaded later.
  const hospitalityPage=mount.querySelector('.v31-hospitality-page');
  if(hospitalityPage){
    hospitalityPage.style.setProperty('background',V31_HOSPITALITY_BG,'important');
  }
  v31BindHospitality();
}

window.addEventListener('hashchange', ()=>setTimeout(v31ApplyHospitality, 0));

const v31Screen = document.querySelector('#screen');
if(v31Screen){
  const observer = new MutationObserver(()=>v31ApplyHospitality());
  observer.observe(v31Screen, {childList:true});
}

setTimeout(v31ApplyHospitality, 0);
