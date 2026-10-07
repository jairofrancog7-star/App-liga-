import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

test('Android camera and video capture remain discoverable after repeated configuration',()=>{
  const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'liga-capture-'));
  try{
    fs.cpSync(new URL('../native/android/',import.meta.url),path.join(fixture,'native/android'),{recursive:true});
    const app=path.join(fixture,'android/app');fs.mkdirSync(path.join(app,'src/main'),{recursive:true});
    fs.writeFileSync(path.join(app,'src/main/AndroidManifest.xml'),'<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application><activity android:name=".MainActivity" /></application></manifest>');
    fs.writeFileSync(path.join(app,'build.gradle'),'dependencies {\n}\n');
    for(let i=0;i<2;i++)execFileSync(process.execPath,['native/android/configure.mjs'],{cwd:fixture});
    const xml=fs.readFileSync(path.join(app,'src/main/AndroidManifest.xml'),'utf8');
    for(const action of ['android.media.action.VIDEO_CAPTURE','android.media.action.IMAGE_CAPTURE'])assert.equal(xml.split(action).length-1,1);
    for(const permission of ['CAMERA','RECORD_AUDIO','READ_CALENDAR','WRITE_CALENDAR'])assert.equal(xml.split('android.permission.'+permission).length-1,1);
    assert.equal(xml.split('<queries>').length-1,1);
    assert.match(xml,/<queries>[\s\S]*VIDEO_CAPTURE[\s\S]*<\/queries>/);
    assert.equal(xml.split('vnd.android.cursor.item/event').length-1,1);
    assert.match(xml,/<action android:name="android.intent.action.INSERT" \/><data android:mimeType="vnd.android.cursor.item\/event"/);
    assert.equal(xml.split('<package android:name="com.google.android.calendar"').length-1,1);
    const calendarPlugin=path.join(app,'src/main/java/mx/ligajuventino/app/LigaCalendarPlugin.java');
    assert.ok(fs.existsSync(calendarPlugin));
    const java=fs.readFileSync(calendarPlugin,'utf8');
    assert.match(java,/new Intent\(Intent\.ACTION_INSERT\)/);
    assert.match(java,/CalendarContract\.Events\.CONTENT_URI/);
    assert.match(java,/CalendarContract\.Events\.TITLE/);
    assert.match(java,/CalendarContract\.EXTRA_EVENT_BEGIN_TIME/);
    assert.match(java,/CalendarContract\.EXTRA_EVENT_END_TIME/);
    assert.doesNotMatch(java,/resolver\.insert\(/);
    assert.doesNotMatch(java,/findWritableGoogleCalendar/);
  }finally{fs.rmSync(fixture,{recursive:true,force:true});}
});
