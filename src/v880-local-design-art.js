/* Original vector artwork rendered on-device. Published reference posters are never reused. */
(()=>{'use strict';
const star=(c,x,y,r,n=5)=>{c.beginPath();for(let i=0;i<n*2;i++){const a=-Math.PI/2+i*Math.PI/n,rr=i%2?r*.43:r;i?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath()};
function metal(c,x,y,w){const g=c.createLinearGradient(x,y,x+w,y+w*.2);[['#8b581e',0],['#f9db88',.22],['#fff4c9',.48],['#c18631',.68],['#ffe8a8',1]].forEach(([color,stop])=>g.addColorStop(stop,color));return g}
function cup(c,x,y,size,color='#efc96c'){
 c.save();c.translate(x,y);c.scale(size/240,size/240);c.shadowColor=color;c.shadowBlur=20;c.fillStyle=metal(c,-120,-120,240);c.strokeStyle=color;c.lineWidth=12;
 c.beginPath();c.moveTo(-83,-105);c.lineTo(83,-105);c.quadraticCurveTo(77,4,17,25);c.lineTo(17,76);c.lineTo(61,95);c.lineTo(61,112);c.lineTo(-61,112);c.lineTo(-61,95);c.lineTo(-17,76);c.lineTo(-17,25);c.quadraticCurveTo(-77,4,-83,-105);c.closePath();c.fill();
 c.beginPath();c.moveTo(-82,-79);c.bezierCurveTo(-177,-103,-156,8,-65,-2);c.moveTo(82,-79);c.bezierCurveTo(177,-103,156,8,65,-2);c.stroke();
 c.shadowBlur=0;c.strokeStyle='#fff8ce99';c.lineWidth=3;c.beginPath();c.moveTo(-60,-85);c.quadraticCurveTo(-52,-10,-25,0);c.stroke();c.restore();
}
function decorate(c,w,h,v){
 if(v.style==='light')return;
 c.save();const gold=v.style==='gold',color=gold?'#f4cf73':v.accent;
 const glow=c.createRadialGradient(w/2,h*.52,2,w/2,h*.52,w*.6);glow.addColorStop(0,gold?'#98691b45':'#246cdb50');glow.addColorStop(1,'#00000000');c.fillStyle=glow;c.fillRect(0,0,w,h);
 // Perspective stadium roof, illuminated stands and a field horizon.
 for(const side of [0,1]){
  c.strokeStyle=color;c.lineWidth=2;c.globalAlpha=.13;
  for(let row=0;row<7;row++){c.beginPath();c.moveTo(side?w:0,h*(.23+row*.038));c.quadraticCurveTo(w/2,h*(.35+row*.024),side?0:w,h*(.23+row*.038));c.stroke()}
  for(let i=0;i<13;i++){const xx=side?w-w*.014-i*w*.018:w*.014+i*w*.018,yy=h*.17+i*h*.012;
   c.globalAlpha=.75;c.fillStyle='#fff7df';c.shadowColor=color;c.shadowBlur=16;c.fillRect(xx,yy,Math.max(3,w*.009),Math.max(3,h*.008));c.shadowBlur=0;
  }
 }
 c.globalAlpha=.08;c.strokeStyle=color;c.lineWidth=2;
 for(let i=0;i<15;i++){c.beginPath();c.moveTo(w/2,h*.69);c.lineTo(i*w/14,h);c.stroke()}
 c.globalAlpha=1;
 // Deterministic decorative particles: output is stable when downloading again.
 for(let i=0;i<90;i++){const x=((i*7919+137)%1009)/1009*w,y=((i*3571+83)%997)/997*h;c.globalAlpha=.08+(i%5)*.035;c.fillStyle=color;c.beginPath();c.arc(x,y,1+(i%3),0,Math.PI*2);c.fill()}
 c.restore();
}
function centered(c,s,x,y,max,size,color='#fff',italic=false){
 c.save();c.textAlign='center';while(size>12){c.font=(italic?'italic ':'')+'900 '+size+'px Arial';if(c.measureText(String(s)).width<=max)break;size--}c.fillStyle=color;c.fillText(String(s||''),x,y,max);c.restore();
}
function ball(c,x,y,r){c.save();c.fillStyle='#f1f3f7';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.fillStyle='#27292e';star(c,x,y,r*.5);c.fill();c.strokeStyle='#27292e';c.lineWidth=2;for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;c.beginPath();c.moveTo(x+r*.5*Math.cos(a),y+r*.5*Math.sin(a));c.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));c.stroke()}c.restore()}
function shield(c,shape){c.beginPath();if(shape==='circle')c.arc(540,500,420,0,Math.PI*2);else if(shape==='hexagon'){for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI/3;i?c.lineTo(540+420*Math.cos(a),520+470*Math.sin(a)):c.moveTo(540+420*Math.cos(a),520+470*Math.sin(a))}c.closePath()}else{c.moveTo(540,60);c.lineTo(930,200);c.lineTo(855,670);c.quadraticCurveTo(830,870,540,1010);c.quadraticCurveTo(250,870,225,670);c.lineTo(150,200);c.closePath()}}
function crest(v,canvas,c){
 if(!v.home.trim())throw Error('Escribe el nombre del equipo para generar su escudo.');canvas.width=canvas.height=1080;c.clearRect(0,0,1080,1080);
 c.fillStyle=metal(c,100,100,850);shield(c,v.logoShape);c.fill();c.save();c.translate(540,520);c.scale(.92,.92);c.translate(-540,-520);c.fillStyle=v.accent;shield(c,v.logoShape);c.fill();c.restore();
 c.save();c.translate(540,520);c.scale(.86,.86);c.translate(-540,-520);c.fillStyle='#0b1731';shield(c,v.logoShape);c.fill();c.restore();
 c.save();c.strokeStyle=v.accent;c.globalAlpha=.12;c.lineWidth=18;shield(c,v.logoShape);c.clip();for(let i=-500;i<1400;i+=70){c.beginPath();c.moveTo(i,0);c.lineTo(i+550,1080);c.stroke()}c.restore();
 const symbol=v.logoSymbol||'ball';c.fillStyle=v.accent;
 if(symbol==='star'){star(c,540,410,155);c.fill()}else if(symbol==='crown'){c.beginPath();c.moveTo(370,480);c.lineTo(335,305);c.lineTo(447,380);c.lineTo(540,245);c.lineTo(633,380);c.lineTo(745,305);c.lineTo(710,480);c.closePath();c.fill();c.fillRect(370,505,340,24)}else if(symbol==='ball'){
  c.beginPath();c.arc(540,410,145,0,Math.PI*2);c.fill();c.fillStyle='#0b1731';star(c,540,410,72,5);c.fill();
  c.strokeStyle='#0b1731';c.lineWidth=10;for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;c.beginPath();c.moveTo(540+72*Math.cos(a),410+72*Math.sin(a));c.lineTo(540+144*Math.cos(a),410+144*Math.sin(a));c.stroke()}
 }
 const initials=v.home.trim().split(/\s+/).map(s=>s[0]).join('').slice(0,4).toUpperCase();
 centered(c,initials,540,symbol==='monogram'?470:650,600,symbol==='monogram'?180:100);
 centered(c,v.home.toUpperCase(),540,750,590,44);centered(c,'CLUB DE FÚTBOL',540,810,500,25,v.accent);
 for(let i=0;i<3;i++){c.fillStyle=metal(c,420,835,250);star(c,475+i*65,864,18);c.fill()}
}
async function draw(v,canvas,c,background,custom,helpers){
 const {img,logo,badgeImage,text,fitCopy,roundRect,cats,data}=helpers;
 const type=v.type,notification=/Notificación/.test(type),recruit=/Reclutamiento|Convocatoria|Registro de nuevos/.test(type),champion=/Campeón|Ganadores/.test(type),multi=/Cuartos|Semifinal/.test(type)&&String(v.participants||'').trim(),match=/^(Gran final|Campeón de campeones|Semifinal|Cuartos de final|Partido de jornada)$/.test(type);
 if(type==='Logo del equipo'){crest(v,canvas,c);return true}
 if(!notification&&!recruit&&!champion&&!multi&&!match&&type!=='Bracket completo')return false;
 const [w,h]=({portrait:[1080,1350],square:[1080,1080],story:[1080,1920],landscape:[1200,630]})[v.format];canvas.width=w;canvas.height=h;
 const short=h<800,light=v.style==='light',gold=v.style==='gold',accent=v.accent||'#23ddef';
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,light?'#f6faff':gold?'#282014':v.style==='yellow'?'#20221f':v.style==='red'?'#45121c':v.style==='clean'?'#171c27':'#121f52');g.addColorStop(1,light?'#cddfff':'#03060d');c.fillStyle=g;c.fillRect(0,0,w,h);
 if(background){const s=Math.max(w/background.naturalWidth,h/background.naturalHeight);c.drawImage(background,(w-background.naturalWidth*s)/2,(h-background.naturalHeight*s)/2,background.naturalWidth*s,background.naturalHeight*s);c.fillStyle='#02050abb';c.fillRect(0,0,w,h)}
 decorate(c,w,h,v);
 const league=await img('./assets/reference/predictor-v36/liga-crest-white.webp');if(league)badgeImage(c,league,w-140,30,80);
 text(c,'LIGA JUVENTINO ROSAS',55,65,w-220,23,accent,800);
 if(notification){
  c.fillStyle='#27292e';roundRect(c,40,110,w-80,h-165,42);if(league)badgeImage(c,league,75,135,60);
  text(c,'Liga Juventino Rosas · ahora',155,175,w-260,26,'#ccd0d6',600);
  const isMatch=type==='Notificación de partido';
  if(isMatch){
   const left=custom.home||await img(logo(v.home)),right=custom.away||await img(logo(v.away)),cy=short?330:450,sz=short?75:135;
   if(left)badgeImage(c,left,w*.22-sz/2,cy-sz/2,sz);if(right)badgeImage(c,right,w*.78-sz/2,cy-sz/2,sz);
   centered(c,(v.scoreHome||'0')+' – '+(v.scoreAway||'0'),w/2,cy+18,w*.32,short?55:86);
   centered(c,v.home||'Equipo local',w*.22,cy+sz/2+45,w*.33,27);centered(c,v.away||'Equipo visitante',w*.78,cy+sz/2+45,w*.33,27);
   centered(c,v.title||'RESULTADO DIRECTO',w/2,short?235:260,w-160,short?30:42);
   centered(c,v.minute?String(v.minute)+"′ · EN VIVO":'MARCADOR DEL PARTIDO',w/2,short?270:325,w-160,24,accent);
   let y=cy+sz/2+115;const events=String(v.events||'').split('\n').map(s=>s.trim()).filter(Boolean);
   for(const event of events.slice(0,short?1:5)){c.fillStyle='#ffffff10';roundRect(c,75,y-35,w-150,70,18);ball(c,110,y,17);text(c,event,145,y+8,w-255,27);y+=88}
   if(!short&&v.body)fitCopy(c,v.body,85,y+40,w-170,h-y-185,30,'#c5c8d0');
   if(custom.person&&!short){const im=custom.person;c.save();c.beginPath();c.arc(w-135,h-175,58,0,Math.PI*2);c.clip();const s=Math.max(116/im.naturalWidth,116/im.naturalHeight);c.drawImage(im,w-135-im.naturalWidth*s/2,h-175-im.naturalHeight*s/2,im.naturalWidth*s,im.naturalHeight*s);c.restore()}
  }else{
   const title=v.title||'NOTICIAS DE LA LIGA';text(c,title,85,short?245:285,w-170,short?36:54,'#fff',900);
   fitCopy(c,v.body||v.details,85,short?330:405,w-170,short?155:h*.22,short?27:34,'#d1d3d9');
   if(custom.person||background){const photo=custom.person||background,x=85,y=h*.58,pw=w-170,ph=h*.28;c.save();c.beginPath();c.roundRect(x,y,pw,ph,28);c.clip();const s=Math.max(pw/photo.naturalWidth,ph/photo.naturalHeight);c.drawImage(photo,x+(pw-photo.naturalWidth*s)/2,y+(ph-photo.naturalHeight*s)/2,photo.naturalWidth*s,photo.naturalHeight*s);c.restore()}
  }return true;
 }
 const title=(v.title||type).toUpperCase();centered(c,title,w/2,short?147:175,w-110,short?52:84,gold?metal(c,100,100,w-200):v.style==='yellow'?accent:'#fff',true);
 centered(c,cats[v.category],w/2,short?193:228,w-140,short?20:26,gold?'#f7d87e':'#b7d9ff');
 if(type==='Bracket completo'){
  let teams=String(v.participants||'').split('\n').map(s=>s.trim()).filter(Boolean);if(teams.length<2||teams.length>16)throw Error('Escribe de 2 a 16 equipos en Participantes y táctica.');
  const size=2**Math.ceil(Math.log2(teams.length));while(teams.length<size)teams.push('Por confirmar');const stages=Math.log2(size),gap=18,cw=(w-110-(stages-1)*gap)/stages,top=short?250:320,area=h-top-150;
  for(let stage=0;stage<stages;stage++){
   const count=size/2**(stage+1),x=55+stage*(cw+gap);centered(c,['FINAL','SEMIFINAL','CUARTOS','OCTAVOS'][stages-stage-1],x+cw/2,top-30,cw,22,accent);
   for(let i=0;i<count;i++){const cy=top+(i+.5)*area/count,box=Math.min(86,area/count-9);c.fillStyle='#0c2443';roundRect(c,x,cy-box/2,cw,box,10);c.strokeStyle=accent;c.lineWidth=1;c.strokeRect(x+1,cy-box/2+1,cw-2,box-2);
    for(let side=0;side<2;side++){const name=stage?('Ganador '+(i*2+side+1)):teams[i*2+side],yy=cy-box/2+(side+.5)*box/2,im=stage?null:await img(logo(name));if(im)badgeImage(c,im,x+7,yy-12,24);text(c,name,x+(im?39:10),yy+6,cw-(im?49:20),Math.min(19,cw/10),'#fff',700)}
    if(stage<stages-1){const target=top+(Math.floor(i/2)+.5)*area/(count/2);c.beginPath();c.moveTo(x+cw,cy);c.lineTo(x+cw+gap/2,cy);c.lineTo(x+cw+gap/2,target);c.lineTo(x+cw+gap,target);c.stroke()}
   }
  }cup(c,w/2,h-72,100,accent);return true;
 }
 if(multi){
  const teams=v.participants.split('\n').map(s=>s.trim()).filter(Boolean);if(teams.length<2||teams.length>16||teams.length%2)throw Error('Escribe parejas completas de equipos: local y visitante, uno por línea (hasta 16).');
  const rows=teams.length/2,top=short?235:290,step=(h-top-190)/rows;
  if(step<45)throw Error('Elige Publicación o Historia para mostrar todos los encuentros.');
  for(let i=0;i<rows;i++){const y=top+i*step,sz=Math.min(125,step-35);c.fillStyle='#ffffff08';roundRect(c,55,y,w-110,step-10,12);const left=await img(logo(teams[i*2])),right=await img(logo(teams[i*2+1]));if(left)badgeImage(c,left,w*.37-sz/2,y+(step-sz)/2,sz);if(right)badgeImage(c,right,w*.63-sz/2,y+(step-sz)/2,sz);centered(c,teams[i*2],w*.18,y+step*.55,w*.24,24);centered(c,teams[i*2+1],w*.82,y+step*.55,w*.24,24);centered(c,'VS',w/2,y+step*.55,80,26,accent)}
 }else if(champion){
  const im=custom.home||await img(logo(v.home));const cy=short?300:h*.43,sz=short?125:270;
  if(im)badgeImage(c,im,w/2-sz/2,cy-sz/2,sz);cup(c,w*.17,cy,short?110:210,accent);cup(c,w*.83,cy,short?110:210,accent);
  if(custom.person&&!short){const photo=custom.person,pw=w*.73,ph=h*.22,s=Math.min(pw/photo.naturalWidth,ph/photo.naturalHeight);c.drawImage(photo,w/2-photo.naturalWidth*s/2,h*.64-photo.naturalHeight*s/2,photo.naturalWidth*s,photo.naturalHeight*s)}
  centered(c,v.home||v.person||'EQUIPO CAMPEÓN',w/2,short?405:h*.78,w-120,short?36:58,gold?metal(c,100,0,w-200):'#fff');
  fitCopy(c,v.body||v.details,60,short?460:h*.84,w-120,short?65:h*.08,short?23:27,'#f4ddae');
 }else if(recruit){
  const photo=custom.person;if(photo){const px=w*.5,py=short?220:300,pw=w*.5,ph=h-py-155,s=Math.min(pw/photo.naturalWidth,ph/photo.naturalHeight);c.drawImage(photo,px+(pw-photo.naturalWidth*s)/2,py+(ph-photo.naturalHeight*s)/2,photo.naturalWidth*s,photo.naturalHeight*s)}
  const im=custom.home||await img(logo(v.home));if(im)badgeImage(c,im,65,short?220:300,short?75:135);
  const tx=photo?w*.44:w-120;text(c,v.home||'ÚNETE A LA LIGA',60,short?335:520,tx,short?30:43,light?'#0b2851':'#fff',900);
  fitCopy(c,v.body||'Escribe los requisitos, lugar de registro y contacto de la convocatoria.',60,short?395:615,tx,h-(short?395:615)-180,short?24:32,light?'#173b66':'#d5e2fa');
 }else if(match){
  const cy=short?300:h*.45,sz=short?112:Math.min(310,h*.24),left=custom.home||await img(logo(v.home)),right=custom.away||await img(logo(v.away));
  for(const [x,im]of [[w*.23,left],[w*.77,right]]){c.save();c.shadowColor=accent;c.shadowBlur=35;c.strokeStyle=accent;c.lineWidth=2;c.beginPath();c.arc(x,cy,sz*.59,0,Math.PI*2);c.stroke();c.restore();if(im)badgeImage(c,im,x-sz/2,cy-sz/2,sz)}
  if(gold)cup(c,w/2,cy,short?95:210,accent);else centered(c,'VS',w/2,cy+18,w*.22,short?42:85,accent,true);
  centered(c,v.home||'EQUIPO LOCAL',w*.23,cy+sz*.7,w*.4,short?23:33);centered(c,v.away||'EQUIPO VISITANTE',w*.77,cy+sz*.7,w*.4,short?23:33);
  const yy=cy+sz*.7+(short?48:90);c.fillStyle='#ffffff0c';roundRect(c,60,yy-35,w-120,70,12);centered(c,v.details||'Completa fecha, hora y campo',w/2,yy+8,w-160,short?24:32,accent);
  if(v.body)fitCopy(c,v.body,60,yy+(short?75:110),w-120,h-yy-(short?195:230),short?22:28,'#d6e2f8');
 }
 if(!champion){centered(c,v.transmission?('TRANSMITIDO POR · '+v.transmission):match?'':v.details,w/2,h-107,w-120,20,'#cce7ff');if(v.sponsor)centered(c,'PATROCINADO POR · '+v.sponsor,w/2,h-72,w-120,19,'#bacded')}
 c.fillStyle=accent;c.fillRect(55,h-43,w-110,2);centered(c,'LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS, GTO.',w/2,h-18,w-100,16,light?'#214c7f':'#a6bcdb');return true;
}
window.LJR_LOCAL_DESIGN_ART={draw,decorate};
})();
