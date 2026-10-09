/* Medidas fisicas exactas de credenciales en milimetros (INe 85.60 x 53.98). */
export const PT_PER_MM=72/25.4;
export const MM_CARD_W=85.60;
export const MM_CARD_H=53.98;
export const mmToPt=mm=>mm*PT_PER_MM;
export function credentialPlacement(mode,index){
 if(!Number.isInteger(index)||index<0)throw Error('Indice de credencial no valido');
 if(mode==='individual')return {
   pageIndex:index,slot:0,pageWidth:mmToPt(MM_CARD_W),pageHeight:mmToPt(MM_CARD_H),
   x:0,y:0,width:mmToPt(MM_CARD_W),height:mmToPt(MM_CARD_H)
 };
 if(mode!=='a4')throw Error('Formato de impresion no valido');
 const sheetW=mmToPt(210),sheetH=mmToPt(297),
  cardW=mmToPt(MM_CARD_W),cardH=mmToPt(MM_CARD_H),gap=mmToPt(3);
 const x0=(sheetW-(cardW*2+gap))/2;
 const yTop=(sheetH-(cardH*4+gap*3))/2;
 const slot=index%8,col=slot%2,row=Math.floor(slot/2);
 return {
  pageIndex:Math.floor(index/8),slot,pageWidth:sheetW,pageHeight:sheetH,
  x:x0+col*(cardW+gap),
  y:sheetH-yTop-cardH-row*(cardH+gap),
  width:cardW,height:cardH
 };
}
