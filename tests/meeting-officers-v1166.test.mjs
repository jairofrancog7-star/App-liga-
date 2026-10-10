import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('Sede Deportiva Sur es predeterminada sin perder otra sede editable',()=>{
 const code=get('src/v875-review-corrections.js');
 assert.match(code,/STANDARD_VENUE='Unidad Deportiva Sur, Juventino Rosas, Gto.'/);
 assert.match(code,/data-meeting-field="place"/);
 assert.match(code,/dataset\.v1166Venue/);
 assert.match(code,/Otra sede · escribir abajo/);
 assert.match(code,/venue\.dispatchEvent\(new Event\('input'/);
});
test('Mesa directiva usa nombres del reglamento y selectores editables',()=>{
 const options=get('src/v875-review-corrections.js');
 assert.match(options,/president:'Florencio Franco Lerma'/);
 assert.match(options,/secretary:'Javier Gonzalez Lopez'/);
 assert.match(options,/select\.dataset\.meetingField=role/);
 assert.match(options,/Otro nombre…/);
 assert.match(options,/data-v1166-custom-option/);
 assert.doesNotMatch(options,/4121715599/);
 const reg=get('src/v102-rulebook-preview-fix.js');
 assert.match(reg,/FLORENCIO FRANCO LERMA/);
 assert.match(reg,/JAVIER GONZALEZ LOPEZ/);
});
test('Actas y resumen reflejan nombres sin inventar aprobación ni firma',()=>{
 const hub=get('src/v1130-meeting-hub.js'),pdf=get('src/v875-review-corrections.js'),
 png=get('src/v926-meeting-media.js'),summary=get('src/v1140-meeting-suite.js');
 assert.match(hub,/president:field\('president'\),secretary:field\('secretary'\)/);
 assert.match(hub,/president','secretary','deadline/);
 assert.match(hub,/r\.sign\.approved/);
 assert.match(pdf,/data\.president\|\|'Por confirmar'/);
 assert.match(pdf,/data\.secretary\|\|'Por confirmar'/);
 assert.match(png,/\['PRESIDENTE',d\.president/);
 assert.match(png,/\['SECRETARIO',d\.secretary/);
 assert.match(summary,/Presidente de la Liga \(registrado\)/);
});
test('App y demo comparten archivos y estilo azul',()=>{
 for(const file of ['v875-review-corrections.js','v1130-meeting-hub.js','v926-meeting-media.js','v1140-meeting-suite.js']){
  assert.equal(get('demo/src/'+file),get('src/'+file),file);
  new Function(get('src/'+file));
 }
 for(const html of ['index.html','demo/index.html'])assert.match(get(html),/v1166-meeting-officers\.css/);
 assert.match(get('src/v1166-meeting-officers.css'),/\.v1166-meeting-roles/);
});
