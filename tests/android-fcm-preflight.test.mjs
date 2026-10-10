import test from 'node:test';
import assert from 'node:assert/strict';
import {ANDROID_APP_ID,validateAndroidFirebaseConfig,reportReadiness} from '../scripts/android-fcm-preflight.mjs';

const fakeConfig=()=>({
  project_info:{project_number:'123456789012',project_id:'liga-jr-pruebas'},
  client:[{
    client_info:{mobilesdk_app_id:'1:123456789012:android:abcdef0123456789',
      android_client_info:{package_name:ANDROID_APP_ID}},
    api_key:[{current_key:'synthetic-key-for-validation-only-1234'}]
  }]
});
test('Firebase preflight: acepta solo el paquete Android de la Liga',()=>{
  const result=validateAndroidFirebaseConfig(fakeConfig());
  assert.deepEqual(result,{valid:true,appId:ANDROID_APP_ID,projectId:'liga-jr-pruebas'});
});
test('Firebase preflight: rechaza configuración de otra app',()=>{
  const other=fakeConfig();other.client[0].client_info.android_client_info.package_name='mx.otra.app';
  assert.throws(()=>validateAndroidFirebaseConfig(other),/mx\.ligajuventino\.app/);
});
test('Firebase preflight: rechaza duplicados y archivo incompleto',()=>{
  const duplicate=fakeConfig();duplicate.client.push(structuredClone(duplicate.client[0]));
  assert.throws(()=>validateAndroidFirebaseConfig(duplicate),/exactamente una/);
  assert.throws(()=>validateAndroidFirebaseConfig({client:[]}),/project_id/);
  const missing=fakeConfig();delete missing.client[0].api_key;
  assert.throws(()=>validateAndroidFirebaseConfig(missing),/api_key/);
});
test('El informe nunca confunde APK compilada con Push remoto recibido',()=>{
  assert.match(reportReadiness(),/pendiente/);
  assert.match(reportReadiness({configured:true}),/requiere integración FCM/);
  assert.match(reportReadiness({configured:true,receiver:true,sender:true}),/falta confirmar recepción física/);
  assert.doesNotMatch(reportReadiness(),/Push remoto confirmado/i);
});
