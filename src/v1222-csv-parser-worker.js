/* Parsing CSV en segundo plano: evita bloquear la interfaz móvil.
   Worker local de Vite; sin acceso a red ni modificación de datos oficiales. */
import {parseDelimited,detectDelimiter} from './v1212-csv-import-pro.js';
self.onmessage=event=>{
 try{
  const {text,delimiter}=event.data||{};
  const chosen=delimiter==='auto'?detectDelimiter(text):delimiter==='tab'?'\t':delimiter;
  const parsed=parseDelimited(text,chosen);
  self.postMessage({ok:true,parsed,delimiter:chosen});
 }catch(error){
  self.postMessage({ok:false,error:String(error?.message||error)});
 }
};
