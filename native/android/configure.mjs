import fs from 'node:fs';
import path from 'node:path';
const destination='android/app/src/main/java/mx/ligajuventino/app';
fs.mkdirSync(destination,{recursive:true});
for(const name of ['MainActivity.java','LigaPiPPlugin.java','LigaBiometricPlugin.java','LigaSpeechPlugin.java','LigaNotificationsPlugin.java','LigaCalendarPlugin.java']) fs.copyFileSync(path.join('native/android',name),path.join(destination,name));
const manifest='android/app/src/main/AndroidManifest.xml';
let xml=fs.readFileSync(manifest,'utf8');
xml=xml.replace(/<activity\b[^>]*android:name="\.MainActivity"[^>]*>/,tag=>tag.includes('android:supportsPictureInPicture')?tag:tag.replace('<activity','<activity android:supportsPictureInPicture="true" android:resizeableActivity="true"'));
for(const permission of ['CAMERA','RECORD_AUDIO','MODIFY_AUDIO_SETTINGS','USE_BIOMETRIC','USE_FINGERPRINT','POST_NOTIFICATIONS']){
 if(!xml.includes('android.permission.'+permission))xml=xml.replace('</manifest>','    <uses-permission android:name="android.permission.'+permission+'" />\n</manifest>');
}
if(!xml.includes('android.speech.RecognitionService'))xml=xml.replace('</manifest>','<queries><intent><action android:name="android.speech.RecognitionService" /></intent></queries></manifest>');
if(!xml.includes('android.intent.action.TTS_SERVICE'))xml=xml.replace('</queries>','<intent><action android:name="android.intent.action.TTS_SERVICE" /></intent></queries>');
// Capacitor checks resolveActivity before launching the capture intent. Android
// package visibility must allow those checks as well as the camera permission.
for(const action of ['android.media.action.VIDEO_CAPTURE','android.media.action.IMAGE_CAPTURE']){
  if(!xml.includes(action))xml=xml.replace('</queries>','<intent><action android:name="'+action+'" /></intent></queries>');
}
if(!xml.includes('vnd.android.cursor.item/event'))xml=xml.replace('</queries>','<intent><action android:name="android.intent.action.INSERT" /><data android:mimeType="vnd.android.cursor.item/event" /></intent></queries>');
fs.writeFileSync(manifest,xml);

const gradle='android/app/build.gradle';
let gradleText=fs.readFileSync(gradle,'utf8');
if(!gradleText.includes('androidx.biometric:biometric')){
  gradleText=gradleText.replace(/dependencies\s*\{/,match=>match+'\n    implementation "androidx.biometric:biometric:1.1.0"');
  fs.writeFileSync(gradle,gradleText);
}
