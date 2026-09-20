const V15_TEAM_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const V15_STORIES=[
  {label:'Atlético Galeana 📸',route:'teams',logo:'assets/official-logos/galeana.png'},
  {label:'Promesas FC 📸',route:'teams',logo:'assets/official-logos/promesas-fc.png'},
  {label:'Momentos<br>de la Liga ✨',route:'moments',logo:'assets/liga-logo.webp',type:'moments'},
  {label:'La Huerta 📸',route:'teams',logo:'assets/official-logos/la-huerta.png'},
  {label:'Franco FC 📸',route:'teams',logo:'assets/official-logos/franco-fc.png'}
];

function v15Route(){return location.hash.replace('#/','')||'home'}


function v15TransparentizeLogo(img){
  if(!img||img.dataset.v15TransparentReady==='1') return;
  img.dataset.v15TransparentReady='1';
  const run=()=>{
    try{
      const w=img.naturalWidth||0,h=img.naturalHeight||0;
      if(!w||!h) return;
      const canvas=document.createElement('canvas');
      canvas.width=w; canvas.height=h;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      if(!ctx) throw new Error('canvas');
      ctx.drawImage(img,0,0,w,h);
      const data=ctx.getImageData(0,0,w,h);
      const p=data.data;
      const seen=new Uint8Array(w*h);
      const queue=new Int32Array(w*h);
      let head=0,tail=0;
      const isDarkBg=(idx)=>{
        const o=idx*4,r=p[o],g=p[o+1],b=p[o+2],a=p[o+3];
        if(a<8) return true;
        const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
        return mx<92 && (mx-mn)<55;
      };
      const push=(idx)=>{
        if(idx<0||idx>=w*h||seen[idx]||!isDarkBg(idx)) return;
        seen[idx]=1; queue[tail++]=idx;
      };
      for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
      for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
      while(head<tail){
        const idx=queue[head++],x=idx%w,y=(idx/w)|0,o=idx*4;
        p[o+3]=0;
        if(x>0)push(idx-1);
        if(x<w-1)push(idx+1);
        if(y>0)push(idx-w);
        if(y<h-1)push(idx+w);
      }
      ctx.putImageData(data,0,0);
      img.removeAttribute('crossorigin');
      img.src=canvas.toDataURL('image/png');
      img.classList.add('v15-home-logo-transparent');
    }catch(e){
      img.classList.add('v15-home-logo-blend-fallback');
    }
  };
  if(img.complete&&img.naturalWidth) run();
  else img.addEventListener('load',run,{once:true});
}

function v15EnsureProfessionalHomeLogo(){
  const badge=document.querySelector('.topbar .v15-home-clean-logo');
  if(badge) badge.remove();
}

function v15PatchHome(){
  if(v15Route()!=='home') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;

  v15EnsureProfessionalHomeLogo();

  const stories=[...screen.querySelectorAll(':scope > .stories .story')];
  stories.forEach((story,i)=>{
    const item=V15_STORIES[i];
    if(!item||story.dataset.v15Story==='1') return;
    story.dataset.v15Story='1';
    story.dataset.route=item.route;
    const ring=story.querySelector('.story-ring');
    const label=story.querySelector('small');
    if(ring){
      ring.innerHTML='<span class="story-inner v15-story-inner"><img src="'+V15_TEAM_BASE+item.logo+'" alt="'+item.label.replace(/<br>|📸|✨/g,'').trim()+'"></span>';
    }
    if(label) label.innerHTML=item.label;
  });


  // V100: conservar la tarjeta principal nativa de Inicio.
  // No sustituirla por una imagen alta: evita portada gigante/desacomodada en móvil.

}

function v15PatchVideo(){
  if(v15Route()!=='video') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  const hero=screen.querySelector(':scope > .hero.video-hero');
  if(hero&&hero.dataset.v15VideoFeature!=='1'){
    hero.dataset.v15VideoFeature='1';
    hero.innerHTML='<img class="v15-video-reference-image" src="./video-hero-reference.webp?v=parts14" alt="Repetición del partido - Liga Juventino TV"><button class="v15-video-hit v15-video-hit-primary" type="button" aria-label="Ver ahora"></button><button class="v15-video-hit v15-video-hit-secondary" type="button" aria-label="Partido de la semana"></button>';
  }
}

function v15Toast(text){
  let el=document.querySelector('.v15-toast');
  if(!el){el=document.createElement('div');el.className='v15-toast';document.body.appendChild(el)}
  el.textContent=text;el.classList.add('show');clearTimeout(v15Toast.t);v15Toast.t=setTimeout(()=>el.classList.remove('show'),1500);
}

function v15Patch(){
  v15PatchHome();
  v15PatchVideo();
}

document.addEventListener('click',e=>{
  if(e.target.closest('.v15-home-feature-hit')){
    const videoNav=document.querySelector('.bottom-nav [data-route="video"]');
    if(videoNav){videoNav.click();return}
  }
  if(e.target.closest('.v15-video-hit-primary')){v15Toast('Repetición del partido');return}
  if(e.target.closest('.v15-video-hit-secondary')){v15Toast('Partido de la semana');return}
},true);

window.addEventListener('hashchange',()=>requestAnimationFrame(v15Patch));
const v15Screen=document.querySelector('#screen');
if(v15Screen)new MutationObserver(()=>requestAnimationFrame(v15Patch)).observe(v15Screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(v15Patch),{once:true});
else requestAnimationFrame(v15Patch);
