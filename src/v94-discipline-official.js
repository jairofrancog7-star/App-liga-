/* V94 — Disciplina con datos oficiales actuales.
   Elimina filas ficticias/inexistentes y usa únicamente jugadores/equipos
   que aparecen en official-live.json y en las plantillas vigentes. */
(function(){
  'use strict';
  if(window.__LJR_V94_DISCIPLINE__)return;
  window.__LJR_V94_DISCIPLINE__=true;

  const BUILD='20261001-v493-official-all-categories';
  const DATA_URLS=['./data/official-live.json','https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json'];

  function route(){
    return (location.hash.replace(/^#\/?/,'')||'home').split('?')[0];
  }
  function isDiscipline(){
    const r=route();
    if(/^(v4-discipline|discipline|disciplina|disciplineTool)$/i.test(r)||/discip/i.test(r))return true;
    // Never read innerText across another page on every DOM mutation: it forces layout.
    return false;
  }
  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase().replace(/\s+/g,' ');
  }
  function esc(v){
    return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function teamLogo(data,team){
    const logos=data.team_logos||{};
    const key=Object.keys(logos).find(k=>norm(k)===norm(team));
    const rec=key?logos[key]:null;
    const local=rec?.local||'';
    const rawLocal=local
      ? 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+local.replace(/^\.\//,'')
      : '';
    const src=rawLocal||rec?.source||'';
    if(src){
      const fallback=rec?.source&&rec.source!==src?rec.source:(rawLocal&&rawLocal!==src?rawLocal:'');
      return '<img class="v94-discipline-logo" src="'+esc(src)+'"'+
        (fallback?' data-v94-logo-fallback="'+esc(fallback)+'"':'')+
        ' alt="'+esc(team)+'" loading="eager" decoding="async">';
    }
    return '<span class="v94-discipline-logo-fallback">⚽</span>';
  }
  function playerPhoto(data,item){
    try{
      const media=window.LJR_PLAYER_MEDIA;
      const exact=media?.photo?.(item?.player,item?.team,item?.catId);
      if(exact)return String(exact);
      /* V650: los registros de expulsados pueden traer "Expulsado de la liga"
         en la columna Equipo. Si el nombre es único, recupera la foto por jugador
         y categoría para no dejar solo iniciales cuando sí existe fotografía. */
      const byName=media?.photo?.(item?.player,'',item?.catId);
      if(byName)return String(byName);
      const pub=window.LJR_PLAYER_PHOTOS;
      if(pub&&typeof pub.get==='function'){
        const y=pub.get(item?.player,item?.team,item?.catId);
        if(y)return String(y);
        const z=pub.get(item?.player,'',item?.catId);
        if(z)return String(z);
      }
    }catch(_){}
    const cat=data?.categories?.[String(item?.catId||'')];
    const entries=Object.entries(cat?.player_profiles||{});
    const entry=entries.find(([team])=>norm(team)===norm(item?.team));
    const exact=(Array.isArray(entry?.[1])?entry[1]:[]).find(x=>norm(x?.name)===norm(item?.player));
    if(exact?.photo)return String(exact.photo);
    const byName=[];
    for(const [,list] of entries){
      for(const p of (Array.isArray(list)?list:[])){
        if(norm(p?.name)===norm(item?.player)&&p?.photo)byName.push(String(p.photo));
      }
    }
    return byName[0]||'';
  }
  function disciplineAvatar(data,item){
    const src=playerPhoto(data,item);
    const ini=String(item?.player||'J').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
    return '<span class="v576-discipline-photo">'+
      (src?'<span class="v576-player-avatar v576-has-photo"><img src="'+esc(src)+'" alt="'+esc(item.player)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>':'<span class="v576-player-avatar v576-photo-fallback">'+esc(ini)+'</span>')+
      '<span class="v576-discipline-team">'+teamLogo(data,item.team)+'</span>'+
    '</span>';
  }
  function rosterHas(cat,team,player){
    const rosters=cat.rosters||{};
    const key=Object.keys(rosters).find(k=>norm(k)===norm(team));
    if(!key)return false;
    return (rosters[key]||[]).some(n=>norm(n)===norm(player));
  }
  function validTeams(cat){
    const rows=cat.standings?.[0]?.rows||[];
    const out=new Set(rows.map(r=>norm(r?.[1])).filter(Boolean));
    Object.keys(cat.rosters||{}).forEach(t=>out.add(norm(t)));
    return out;
  }
  function extract(data){
    const map=new Map();

    for(const [catId,cat] of Object.entries(data.categories||{})){
      const teams=validTeams(cat);

      for(const block of (cat.cards||[])){
        const headers=(block.headers||[]).map(norm);
        const rows=block.rows||[];
        const iType=headers.indexOf('TIPO');
        const iPlayer=headers.indexOf('JUGADOR');
        const iTeam=headers.indexOf('EQUIPO');
        const iTotal=headers.indexOf('TOTAL');
        if(iPlayer<0||iTeam<0)continue;

        for(const row of rows){
          const player=row[iPlayer]||'';
          const team=row[iTeam]||'';
          if(!player||!team)continue;
          const key=catId+'|'+norm(team)+'|'+norm(player);
          const cur=map.get(key)||{
            catId,category:cat.name||('Categoría '+catId),player,team,
            cards:[],suspension:null
          };
          cur.cards.push({
            type:iType>=0?(row[iType]||'Tarjeta'):'Tarjeta',
            total:iTotal>=0?(row[iTotal]||''):''
          });
          map.set(key,cur);
        }
      }

      for(const block of (cat.suspensions||[])){
        const headers=(block.headers||[]).map(norm);
        const rows=block.rows||[];
        const iPlayer=headers.indexOf('JUGADOR');
        const iTeam=headers.indexOf('EQUIPO');
        const iPun=headers.indexOf('CASTIGO');
        const iPend=headers.indexOf('PENDIENTES');
        if(iPlayer<0||iTeam<0)continue;

        for(const row of rows){
          const player=row[iPlayer]||'';
          const team=row[iTeam]||'';
          if(!player||!team)continue;
          const key=catId+'|'+norm(team)+'|'+norm(player);
          const cur=map.get(key)||{
            catId,category:cat.name||('Categoría '+catId),player,team,
            cards:[],suspension:null
          };
          cur.suspension={
            punishment:iPun>=0?(row[iPun]||''):'',
            pending:iPend>=0?(row[iPend]||''):''
          };
          map.set(key,cur);
        }
      }
    }

    return [...map.values()].sort((a,b)=>{
      const ap=Number(a.suspension?.pending||0),bp=Number(b.suspension?.pending||0);
      const ac=a.cards.reduce((n,x)=>n+(Number(x.total)||0),0);
      const bc=b.cards.reduce((n,x)=>n+(Number(x.total)||0),0);
      return bp-ap||bc-ac||a.player.localeCompare(b.player,'es');
    });
  }
  const V655_TYPES=[
    ['all','Todo'],
    ['cards','Tarjetas'],
    ['suspensions','Castigados']
  ];
  const V655_CATS=[
    ['all','Todas'],
    ['3','Primera Fuerza'],
    ['5','Intermedia'],
    ['4','Segunda Fuerza'],
    ['2','Veteranos 35+'],
    ['1','Veteranos 50+']
  ];
  function filterState(){
    const type=localStorage.getItem('v655-discipline-type')||'all';
    const cat=localStorage.getItem('v655-discipline-cat')||'all';
    return {
      type:V655_TYPES.some(x=>x[0]===type)?type:'all',
      cat:V655_CATS.some(x=>x[0]===cat)?cat:'all'
    };
  }
  function setDisciplineType(type,page){
    const next=V655_TYPES.some(x=>x[0]===type)?type:'all';
    localStorage.setItem('v655-discipline-type',next);
    // Keep the older discipline controller in sync so it cannot restore another tab.
    localStorage.setItem('v563-discipline-view',next);
    applyDisciplineFilters(page||document.querySelector('.v94-discipline-page'));
  }
  function applyDisciplineFilters(page){
    if(!page)return;
    const state=filterState();
    page.querySelectorAll('[data-v655-type]').forEach(b=>{
      const active=b.dataset.v655Type===state.type;
      b.classList.toggle('active',active);
      b.setAttribute('aria-selected',active?'true':'false');
      b.setAttribute('aria-pressed',active?'true':'false');
    });
    page.querySelectorAll('[data-v655-cat]').forEach(b=>{
      const active=b.dataset.v655Cat===state.cat;
      b.classList.toggle('active',active);
      b.setAttribute('aria-selected',active?'true':'false');
      b.setAttribute('aria-pressed',active?'true':'false');
    });

    let shown=0;
    page.querySelectorAll('.v94-discipline-row').forEach(row=>{
      const hasCards=row.dataset.v94HasCards==='1';
      const hasSusp=row.dataset.v94HasSusp==='1';
      const typeOk=state.type==='all'||(state.type==='cards'&&hasCards)||(state.type==='suspensions'&&hasSusp);
      const catOk=state.cat==='all'||String(row.dataset.v94Cat||'')===String(state.cat);
      const show=typeOk&&catOk;

      // In each tab show only the information that belongs to that tab.
      row.querySelectorAll('.v94-yellow,.v94-red').forEach(tag=>{
        tag.hidden=state.type==='suspensions';
        tag.style.setProperty('display',state.type==='suspensions'?'none':'inline-flex','important');
      });
      row.querySelectorAll('.v94-sanction').forEach(tag=>{
        tag.hidden=state.type==='cards';
        tag.style.setProperty('display',state.type==='cards'?'none':'inline-flex','important');
      });
      const totalB=row.querySelector('.v94-total b');
      const totalSmall=row.querySelector('.v94-total small');
      if(totalB&&totalSmall){
        const cardTotal=Number(row.dataset.v94CardTotal||0);
        const pending=String(row.dataset.v94Pending||'').trim();
        if(state.type==='cards'){
          totalB.textContent=cardTotal||'—';
          totalSmall.textContent='tarj.';
        }else if(state.type==='suspensions'){
          totalB.textContent=pending||'—';
          totalSmall.textContent='pend.';
        }else if(hasSusp&&pending){
          totalB.textContent=pending;
          totalSmall.textContent='pend.';
        }else{
          totalB.textContent=cardTotal||'—';
          totalSmall.textContent='tarj.';
        }
      }

      row.hidden=!show;
      row.style.setProperty('display',show?'grid':'none','important');
      if(show)shown++;
    });

    let empty=page.querySelector('.v655-filter-empty');
    if(!shown){
      if(!empty){
        empty=document.createElement('div');
        empty.className='v94-empty v655-filter-empty';
        empty.innerHTML='<b>Sin registros para este filtro</b><span>Prueba otra categoría o cambia entre Todo, Tarjetas y Castigados.</span>';
        const list=page.querySelector('.v94-discipline-list');
        list?.insertAdjacentElement('afterend',empty);
      }
      empty.hidden=false;
      empty.style.setProperty('display','block','important');
    }else if(empty){
      empty.hidden=true;
      empty.style.setProperty('display','none','important');
    }

    const h=page.querySelector('h1'),lead=page.querySelector('.v94-lead');
    const catName=V655_CATS.find(x=>x[0]===state.cat)?.[1]||'Todas';
    if(state.type==='cards'){
      if(h)h.textContent='Tarjetas';
      if(lead)lead.textContent='Tarjetas amarillas y rojas · '+catName+'.';
    }else if(state.type==='suspensions'){
      if(h)h.textContent='Castigados';
      if(lead)lead.textContent='Sanciones y partidos pendientes · '+catName+'.';
    }else{
      if(h)h.textContent='Disciplina';
      if(lead)lead.textContent='Tarjetas y castigos oficiales · '+catName+'.';
    }
  }
  function bindDisciplineFilters(page){
    if(!page||page.dataset.v655FiltersBound==='1')return;
    page.dataset.v655FiltersBound='1';
    // Capture phase makes the buttons reliable even if another legacy handler
    // stops bubbling later in the page.
    page.addEventListener('click',e=>{
      const type=e.target.closest('[data-v655-type]');
      if(type&&page.contains(type)){
        e.preventDefault();e.stopPropagation();
        setDisciplineType(type.dataset.v655Type||'all',page);
        return;
      }
      const cat=e.target.closest('[data-v655-cat]');
      if(cat&&page.contains(cat)){
        e.preventDefault();e.stopPropagation();
        localStorage.setItem('v655-discipline-cat',cat.dataset.v655Cat||'all');
        localStorage.setItem('v563-discipline-category',cat.dataset.v655Cat||'all');
        applyDisciplineFilters(page);
      }
    },true);
    applyDisciplineFilters(page);
  }
  function filterControlsHtml(){
    return '<div class="v655-discipline-controls">'+
      '<div class="v563-discipline-tabs v655-discipline-types" role="tablist" aria-label="Tipo de disciplina">'+
        V655_TYPES.map(([id,label])=>'<button type="button" data-v655-type="'+id+'" role="tab">'+label+'</button>').join('')+
      '</div>'+
      '<div class="v652-discipline-cats v655-discipline-cats">'+
        '<div class="v652-cat-head"><b>Ver por categoría</b><small>Selecciona una categoría</small></div>'+
        '<div class="v652-cat-rail" role="tablist" aria-label="Categoría">'+
          V655_CATS.map(([id,label])=>{
            // Usar las imágenes oficiales existentes, sin tratar la transparencia.
            const logos={
              'all':'./assets/liga-logo.webp',
              '3':'./assets/branding/primera-fuerza-hd.png',
              '5':'./assets/categories/intermedia.webp',
              '4':'./assets/categories/segunda-fuerza.webp',
              '2':'./assets/categories/veteranos-35-user.png',
              '1':'./assets/categories/veteranos-50.webp'
            };
            return '<button type="button" data-v655-cat="'+id+'" role="tab">'+
              '<img class="v940-discipline-cat-logo" src="'+logos[id]+'" alt="" aria-hidden="true" loading="eager" decoding="async">'+
              '<span class="v940-discipline-cat-label">'+label+'</span></button>';
          }).join('')+
        '</div>'+
      '</div>'+
    '</div>';
  }

  function rowHtml(data,item,index){
    const reds=item.cards.filter(x=>/ROJ/i.test(norm(x.type))).reduce((n,x)=>n+(Number(x.total)||0),0);
    const yellows=item.cards.filter(x=>/AMAR/i.test(norm(x.type))).reduce((n,x)=>n+(Number(x.total)||0),0);
    const total=reds+yellows;
    const tags=[];
    if(yellows)tags.push('<span class="v94-card-tag v94-yellow">Amarillas '+yellows+'</span>');
    if(reds)tags.push('<span class="v94-card-tag v94-red">Rojas '+reds+'</span>');
    if(item.suspension?.punishment)tags.push('<span class="v94-card-tag v94-sanction">'+esc(item.suspension.punishment)+'</span>');

    return '<article class="v94-discipline-row" data-v94-cat="'+esc(item.catId)+'" data-v94-category="'+esc(item.category)+'" data-v94-has-cards="'+(item.cards.length?'1':'0')+'" data-v94-has-susp="'+(item.suspension?'1':'0')+'" data-v94-card-total="'+esc(total)+'" data-v94-pending="'+esc(item.suspension?.pending||'')+'">'+
      '<span class="v94-rank">'+(index+1)+'</span>'+
      '<span class="v94-logo-wrap v576-player-main">'+disciplineAvatar(data,item)+'</span>'+
      '<span class="v94-person"><b>'+esc(item.player)+'</b><small>'+esc(item.team)+' · '+esc(item.category)+'</small><span class="v94-tags">'+tags.join('')+'</span></span>'+
      '<span class="v94-total">'+
        (item.suspension?.pending?'<b>'+esc(item.suspension.pending)+'</b><small>pend.</small>':'<b>'+esc(total||'—')+'</b><small>tarj.</small>')+
      '</span>'+
    '</article>';
  }
  function roundRectPath(ctx,x,y,w,h,r){
    const rr=Math.max(0,Math.min(r,w/2,h/2));
    ctx.beginPath();
    ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);
    ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
  }
  function wrapCanvas(ctx,text,maxWidth,maxLines=2){
    const words=String(text||'—').trim().split(/\s+/).filter(Boolean),out=[];let line='';
    for(const word of words){
      const next=line?line+' '+word:word;
      if(line&&ctx.measureText(next).width>maxWidth){out.push(line);line=word;if(out.length>=maxLines-1)break}
      else line=next;
    }
    if(line&&out.length<maxLines)out.push(line);
    if(words.length&&out.length===maxLines){
      let last=out[maxLines-1]||'';
      while(last&&ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);
      out[maxLines-1]=last+(last!==out[maxLines-1]?'…':'');
    }
    return out.length?out:['—'];
  }
  function loadCanvasImage(src){
    return new Promise(resolve=>{
      if(!src)return resolve(null);
      const im=new Image();let done=false;
      const finish=v=>{if(done)return;done=true;clearTimeout(timer);resolve(v)};
      const timer=setTimeout(()=>finish(null),6500);
      im.crossOrigin='anonymous';im.referrerPolicy='no-referrer';
      im.onload=()=>finish(im);im.onerror=()=>finish(null);im.src=src;
    });
  }
  function drawCoverCircle(ctx,im,cx,cy,r,focalY=.32){
    ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();
    if(im&&im.naturalWidth&&im.naturalHeight){
      const iw=im.naturalWidth,ih=im.naturalHeight,d=r*2,scale=Math.max(d/iw,d/ih);
      const sw=d/scale,sh=d/scale;
      const sx=Math.max(0,Math.min(iw-sw,(iw-sw)/2));
      const sy=Math.max(0,Math.min(ih-sh,ih*focalY-sh*.34));
      ctx.drawImage(im,sx,sy,sw,sh,cx-r,cy-r,d,d);
    }
    ctx.restore();
  }
  function downloadPng(blob,name){
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;
    document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},700);
  }
  async function disciplinePng(data,items){
    const W=1080,rowH=154,top=250,bottom=120,H=Math.max(720,top+items.length*rowH+bottom);
    const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
    const ctx=canvas.getContext('2d',{alpha:false});ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#0b1ca4');bg.addColorStop(.5,'#071077');bg.addColorStop(1,'#04065a');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    const glow=ctx.createRadialGradient(120,0,10,120,0,520);glow.addColorStop(0,'rgba(45,224,255,.28)');glow.addColorStop(1,'rgba(45,224,255,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,W,460);
    ctx.fillStyle='#67eef4';ctx.font='900 24px Arial';ctx.fillText('LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS',54,58);
    ctx.fillStyle='#fff';ctx.font='900 58px Arial';ctx.fillText('DISCIPLINA OFICIAL',54,132);
    ctx.fillStyle='#bdc8eb';ctx.font='600 25px Arial';ctx.fillText('Tarjetas, castigos y suspensiones publicadas · Todas las categorías',54,178);
    ctx.fillStyle='rgba(103,238,244,.16)';roundRectPath(ctx,54,199,310,38,19);ctx.fill();
    ctx.fillStyle='#67eef4';ctx.font='800 20px Arial';ctx.fillText(items.length+' registros oficiales',76,225);

    const photos=await Promise.all(items.map(it=>loadCanvasImage(playerPhoto(data,it))));
    let y=top;
    for(let i=0;i<items.length;i++,y+=rowH){
      const it=items[i],rowY=y+8,rowHeight=rowH-14;
      ctx.fillStyle=i%2?'rgba(14,28,132,.94)':'rgba(19,38,154,.92)';
      roundRectPath(ctx,38,rowY,W-76,rowHeight,24);ctx.fill();
      ctx.strokeStyle='rgba(112,165,255,.22)';ctx.lineWidth=2;ctx.stroke();

      ctx.fillStyle='#fff';ctx.font='900 27px Arial';ctx.textAlign='center';ctx.fillText(String(i+1),78,rowY+75);

      const cx=158,cy=rowY+rowHeight/2,r=50;
      ctx.fillStyle='#193bb7';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
      const im=photos[i];
      if(im)drawCoverCircle(ctx,im,cx,cy,r,.31);
      else{
        const ini=String(it.player||'J').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
        ctx.fillStyle='#fff';ctx.font='900 34px Arial';ctx.fillText(ini,cx,cy+12);
      }
      ctx.strokeStyle='rgba(95,224,255,.42)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();

      ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='900 31px Arial';
      const nameLines=wrapCanvas(ctx,it.player,535,2);nameLines.forEach((line,j)=>ctx.fillText(line,232,rowY+48+j*34));
      const metaY=rowY+48+nameLines.length*34+4;
      ctx.fillStyle='#bcc7e8';ctx.font='650 22px Arial';
      const meta=(it.team||'Equipo')+' · '+(it.category||'Categoría');ctx.fillText(meta.length>48?meta.slice(0,47)+'…':meta,232,metaY);

      const pun=String(it.suspension?.punishment||'').trim();
      if(pun){
        ctx.font='800 18px Arial';const label=pun.length>34?pun.slice(0,33)+'…':pun;
        const tw=Math.min(430,ctx.measureText(label).width+34);
        ctx.fillStyle='rgba(37,105,229,.58)';roundRectPath(ctx,232,metaY+16,tw,34,17);ctx.fill();
        ctx.strokeStyle='rgba(92,222,255,.42)';ctx.lineWidth=1.5;ctx.stroke();
        ctx.fillStyle='#eaf5ff';ctx.fillText(label,249,metaY+39);
      }

      const pending=String(it.suspension?.pending||'').trim();
      const cardTotal=it.cards.reduce((n,x)=>n+(Number(x.total)||0),0);
      ctx.textAlign='center';ctx.fillStyle='#64edf4';ctx.font='900 34px Arial';
      ctx.fillText(pending||String(cardTotal||'—'),956,rowY+64);
      ctx.fillStyle='#aeb9d9';ctx.font='600 18px Arial';
      ctx.fillText(pending?'pend.':'tarj.',956,rowY+91);
    }
    ctx.textAlign='left';ctx.fillStyle='#9eacd4';ctx.font='600 19px Arial';
    ctx.fillText('Datos oficiales · '+new Date().toLocaleDateString('es-MX')+' · Liga Juventino Rosas',54,H-52);
    return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('No se pudo crear el PNG')),'image/png',1));
  }
  function bindPng(data,items,screen){
    const btn=screen.querySelector('[data-v94-png]');if(!btn)return;
    btn.addEventListener('click',async()=>{
      if(btn.disabled)return;
      const label=btn.querySelector('b'),small=btn.querySelector('small');
      const oldLabel=label?.textContent||'Generar imagen PNG',oldSmall=small?.textContent||'';
      btn.disabled=true;btn.classList.add('is-busy');if(label)label.textContent='Generando PNG…';if(small)small.textContent='Preparando lista completa en alta resolución';
      try{
        const blob=await disciplinePng(data,items);
        downloadPng(blob,'Disciplina_Oficial_Liga_Juventino_Rosas.png');
        if(label)label.textContent='PNG generado';if(small)small.textContent='Descarga lista';
        setTimeout(()=>{if(label)label.textContent=oldLabel;if(small)small.textContent=oldSmall},1600);
      }catch(err){
        if(label)label.textContent='No se pudo generar';if(small)small.textContent=err?.message||'Intenta de nuevo';
        setTimeout(()=>{if(label)label.textContent=oldLabel;if(small)small.textContent=oldSmall},2200);
      }finally{btn.disabled=false;btn.classList.remove('is-busy')}
    },{once:true});
  }

  function compactDisciplineTail(){
    if(!isDiscipline())return;
    const screen=document.querySelector('#screen');
    const page=screen?.querySelector('.v94-discipline-page');
    const after=page?.querySelector('.v650-discipline-export');
    if(!screen||!page||!after)return;

    const normText=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
    const targets=[...screen.querySelectorAll('button,a,[role="button"],article')].filter(el=>{
      if(page.contains(el))return false;
      const t=normText(el.textContent);
      return t.includes('generar png por categoria')||t.includes('tablas y avisos');
    });
    if(!targets.length)return;

    let holder=page.querySelector('.v651-discipline-tail');
    if(!holder){
      holder=document.createElement('div');
      holder.className='v651-discipline-tail';
      after.insertAdjacentElement('afterend',holder);
    }

    targets.forEach(card=>{
      if(holder.contains(card))return;
      const oldParent=card.parentElement;
      card.classList.add('v651-tail-card');
      card.style.setProperty('margin','0','important');
      card.style.setProperty('margin-top','0','important');
      card.style.setProperty('margin-bottom','0','important');
      card.style.setProperty('position','relative','important');
      card.style.setProperty('top','auto','important');
      card.style.setProperty('bottom','auto','important');
      card.style.setProperty('transform','none','important');
      holder.appendChild(card);

      if(oldParent&&oldParent!==screen&&oldParent!==page&&!page.contains(oldParent)){
        const meaningful=[...oldParent.children].filter(x=>x!==holder&&!x.hidden&&getComputedStyle(x).display!=='none');
        oldParent.style.setProperty('min-height','0','important');
        oldParent.style.setProperty('height','auto','important');
        oldParent.style.setProperty('margin-top','0','important');
        oldParent.style.setProperty('margin-bottom','0','important');
        oldParent.style.setProperty('padding-top','0','important');
        oldParent.style.setProperty('padding-bottom','0','important');
        if(!meaningful.length){
          oldParent.style.setProperty('display','none','important');
          oldParent.setAttribute('aria-hidden','true');
        }
      }
    });
  }

  function render(data){
    if(!isDiscipline())return;
    const screen=document.querySelector('#screen');
    if(!screen)return;

    const items=extract(data);
    const sig=(data.captured_at_utc||'')+'|'+items.map(x=>[x.player,x.team,x.category].join('~')).join('|');
    if(screen.dataset.v94DisciplineSig===sig&&screen.querySelector('.v94-discipline-page'))return;
    screen.dataset.v94DisciplineSig=sig;

    const currentTeams=new Set();
    Object.values(data.categories||{}).forEach(cat=>{
      (cat.standings?.[0]?.rows||[]).forEach(r=>{if(r?.[1])currentTeams.add(norm(r[1]))});
    });

    screen.innerHTML=
      '<section class="v94-discipline-page">'+
        '<div class="v94-kicker">COMPETICIÓN</div>'+
        '<h1>Disciplina</h1>'+
        '<p class="v94-lead">Tarjetas amarillas, tarjetas rojas y castigos publicados oficialmente para todas las categorías.</p>'+
        filterControlsHtml()+
        '<div class="v94-source"><span>Datos oficiales</span><small>Actualizado '+esc((data.captured_at_utc||'').replace('T',' ').replace('Z',' UTC'))+'</small></div>'+
        (items.length
          ? '<div class="v94-discipline-list">'+items.map((x,i)=>rowHtml(data,x,i)).join('')+'</div>'+
            '<div class="v650-discipline-export"><button type="button" data-v94-png>'+
              '<span class="v650-export-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 18v2h14v-2"/></svg></span>'+
              '<span class="v650-export-copy"><b>Generar imagen PNG</b><small>Lista completa · alta resolución</small></span>'+
              '<span class="v650-export-arrow" aria-hidden="true">›</span>'+
            '</button></div>'
          : '<div class="v94-empty"><b>Sin tarjetas o castigos oficiales publicados</b><span>No se muestran nombres, equipos ni cifras ficticias.</span></div>')+
      '</section>';

    document.body.classList.add('v94-discipline-official');
    const page=screen.querySelector('.v94-discipline-page');
    bindDisciplineFilters(page);
    bindPng(data,items,screen);
    compactDisciplineTail();
    requestAnimationFrame(()=>compactDisciplineTail());
    setTimeout(compactDisciplineTail,120);
    setTimeout(compactDisciplineTail,650);
    screen.querySelectorAll('img[data-v94-logo-fallback]').forEach(img=>{
      img.addEventListener('error',()=>{
        const fallback=img.dataset.v94LogoFallback||'';
        if(fallback&&img.src!==fallback){
          img.removeAttribute('data-v94-logo-fallback');
          img.src=fallback;
        }
      },{once:true});
    });
  }

  let dataPromise=null;
  function fetchOfficial(){
    if(window.LJR_OFFICIAL_DATA)return Promise.resolve(window.LJR_OFFICIAL_DATA);
    return (async()=>{
      let lastError=null;
      for(const url of DATA_URLS){
        try{
          const r=await fetch(url+'?v='+BUILD+'&ts='+Date.now(),{cache:'no-store'});
          if(!r.ok)throw new Error('official-live '+r.status);
          const data=await r.json();
          if(data&&data.categories)return data;
        }catch(err){lastError=err}
      }
      throw lastError||new Error('No se pudo cargar official-live');
    })();
  }
  function load(){
    if(!isDiscipline()){
      document.body.classList.remove('v94-discipline-official');
      return;
    }
    if(window.LJR_OFFICIAL_DATA){
      render(window.LJR_OFFICIAL_DATA);
      return;
    }
    if(!dataPromise)dataPromise=fetchOfficial();
    dataPromise.then(data=>{window.LJR_OFFICIAL_DATA=window.LJR_OFFICIAL_DATA||data;render(data)}).catch(()=>{});
  }

  function forceLoad(){
    if(!isDiscipline()){
      document.body.classList.remove('v94-discipline-official');
      return;
    }
    const screen=document.querySelector('#screen');
    if(screen&&!screen.querySelector('.v94-discipline-page'))screen.dataset.v94DisciplineSig='';
    load();
  }
  window.addEventListener('hashchange',()=>{setTimeout(forceLoad,20);setTimeout(forceLoad,180);setTimeout(forceLoad,650)});
  window.addEventListener('popstate',()=>setTimeout(forceLoad,20));
  document.addEventListener('click',()=>setTimeout(forceLoad,90),true);
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>{
    if(!isDiscipline())return;
    if(!screen.querySelector('.v94-discipline-page')){
      screen.dataset.v94DisciplineSig='';
      setTimeout(forceLoad,20);
      return;
    }
    requestAnimationFrame(compactDisciplineTail);
  }).observe(screen,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',forceLoad,{once:true});
  else forceLoad();
  [120,350,800,1500,2600].forEach(ms=>setTimeout(forceLoad,ms));
})();