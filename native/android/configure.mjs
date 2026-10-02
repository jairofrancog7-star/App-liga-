import fs from 'node:fs';
import path from 'node:path';
const destination='android/app/src/main/java/mx/ligajuventino/app';
fs.mkdirSync(destination,{recursive:true});
for(const name of ['MainActivity.java','LigaPiPPlugin.java']) fs.copyFileSync(path.join('native/android',name),path.join(destination,name));
const manifest='android/app/src/main/AndroidManifest.xml';
let xml=fs.readFileSync(manifest,'utf8');
xml=xml.replace(/<activity\b[^>]*android:name="\.MainActivity"[^>]*>/,tag=>tag.includes('android:supportsPictureInPicture')?tag:tag.replace('<activity','<activity android:supportsPictureInPicture="true" android:resizeableActivity="true"'));
fs.writeFileSync(manifest,xml);
