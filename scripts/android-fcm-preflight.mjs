import fs from 'node:fs';
import {pathToFileURL} from 'node:url';

// Never commit, print, or expose the Firebase Android config or FCM device tokens.
// This preflight checks project identity; it does NOT enable FCM delivery.
export const ANDROID_APP_ID='mx.ligajuventino.app';
export function validateAndroidFirebaseConfig(config, appId=ANDROID_APP_ID){
  if(!config||typeof config!=='object'||Array.isArray(config))throw Error('Configuración Firebase Android inválida.');
  if(!/^[a-z][a-z0-9-]{2,80}$/.test(String(config.project_info?.project_id||'')))throw Error('Firebase project_id inválido.');
  if(!/^\d{4,25}$/.test(String(config.project_info?.project_number||'')))throw Error('Firebase project_number inválido.');
  if(!Array.isArray(config.client))throw Error('Firebase client ausente.');
  const matches=config.client.filter(item=>item?.client_info?.android_client_info?.package_name===appId);
  if(matches.length!==1)throw Error('Firebase debe contener exactamente una app Android con paquete '+appId+'.');
  const client=matches[0];
  if(!/^1:\d+:android:[a-fA-F0-9]+$/.test(String(client.client_info?.mobilesdk_app_id||'')))throw Error('Firebase mobilesdk_app_id inválido.');
  if(!Array.isArray(client.api_key)||!client.api_key.some(x=>String(x?.current_key||'').length>=20))throw Error('Firebase Android api_key ausente.');
  return {valid:true,appId,projectId:String(config.project_info.project_id)};
}
export function reportReadiness({configured=false,receiver=false,sender=false}={}){
  return configured&&receiver&&sender
    ? 'Configuración e integración FCM detectadas; falta confirmar recepción física con APK cerrada'
    : configured?'Configuración Android Firebase válida; Push remoto APK aún requiere integración FCM y prueba física'
    : 'Push remoto APK con app cerrada pendiente de Firebase/FCM; avisos locales siguen disponibles';
}
function main(){
  const encoded=String(process.env.FIREBASE_ANDROID_CONFIG_B64||'').trim();
  let configured=false;
  if(encoded){
    if(!/^[A-Za-z0-9+/=\s]+$/.test(encoded)||encoded.length>655360)throw Error('El secreto Firebase Android no tiene formato base64 válido.');
    let parsed;try{parsed=JSON.parse(Buffer.from(encoded,'base64').toString('utf8'))}catch{throw Error('El secreto Firebase Android no es JSON válido.');}
    const result=validateAndroidFirebaseConfig(parsed);
    configured=true;
    console.log('Firebase Android: configuración validada para '+result.appId+'; no se muestran claves ni identificadores del proyecto.');
  }else{
    console.log('Firebase Android: aún no se configuró FIREBASE_ANDROID_CONFIG_B64 en GitHub Actions.');
  }
  const receiver=fs.existsSync('native/android/LigaFirebaseMessagingService.java');
  const sender=fs.existsSync('server/notifications/fcm-delivery.mjs');
  const status=reportReadiness({configured,receiver,sender});
  console.log('Estado real APK: '+status);
  // Only simple public status is propagated to release notes; never any Firebase values.
  if(process.env.GITHUB_ENV)fs.appendFileSync(process.env.GITHUB_ENV,'LJR_APK_FCM_STATUS='+status+'\n');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main();
