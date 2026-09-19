const V31_HOSPITALITY_LOGO = 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';

function v31HospitalityMarkup(){
  return `
  <section class="v31-hospitality-page" aria-label="Hospitalidad">
    <button type="button" class="v31-back" data-v31-back aria-label="Volver">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
    </button>

    <h1>Introduce tus datos</h1>

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

    <p class="v31-code-note">El código ha sido enviado por correo electrónico.</p>
    <span class="v31-side-accent" aria-hidden="true"></span>

    <button type="button" class="v31-continue" data-v31-continue>Continuar</button>
    <div class="v31-feedback" data-v31-feedback role="status" aria-live="polite"></div>
  </section>`;
}

function v31ShowFeedback(message){
  const el = document.querySelector('[data-v31-feedback]');
  if(!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(v31ShowFeedback.timer);
  v31ShowFeedback.timer = setTimeout(()=>el.classList.remove('show'), 1600);
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
  if(cont) cont.addEventListener('click', ()=>{
    const code = (input?.value || '').trim();
    if(!code){
      input?.focus();
      v31ShowFeedback('Introduce tu código de invitado');
      return;
    }
    localStorage.setItem('lj-hospitality-code', code);
    v31ShowFeedback('Código guardado');
  });
}

function v31ApplyHospitality(){
  const isHospitality = location.hash.replace('#/','') === 'hospitality';
  document.documentElement.classList.toggle('v31-hospitality-active', isHospitality);
  if(!isHospitality) return;

  const screen = document.querySelector('#screen');
  if(!screen) return;
  if(!screen.querySelector('.v31-hospitality-page')){
    screen.innerHTML = v31HospitalityMarkup();
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
