import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/v1132-sponsors-pro.js',import.meta.url),'utf8');
const styles=fs.readFileSync(new URL('../src/v1132-sponsors-pro.css',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const line=name=>{
 const found=source.split('\n').find(s=>s.startsWith('const '+name+'='));
 assert.ok(found,'Missing helper '+name);return found;
};
const normalizeSource=source.split('\n').find(s=>s.startsWith('function normalize('));
const helpers=new Function('const MAX_LOGO=260000;\n'+
 ['num','clean','newId','today','daysLeft','addDay','safeUrl','safePhone'].map(line).join('\n')+
 '\n'+normalizeSource+'\nreturn {today,daysLeft,addDay,normalize,safeUrl,safePhone}')();
test('sponsors code parses and is linked exactly once',()=>{
 assert.doesNotThrow(()=>new Function(source));
 assert.equal((index.match(/src\/v1132-sponsors-pro\.js\?/g)||[]).length,1);
 assert.equal((index.match(/src\/v1132-sponsors-pro\.css\?/g)||[]).length,1);
 assert.match(styles,/\.sp-alerts/);
 assert.match(styles,/\.sp-log-row/);
});
test('all sponsor controls have an action handler',()=>{
 const actions=new Set([...source.matchAll(/data-sp-action="([\w-]+)"/g)].map(m=>m[1]));
 assert.ok(actions.size>=20,'Expected new sponsor controls');
 for(const name of actions)assert.ok(source.includes("case '"+name+"'"),'Missing action '+name);
});
test('days left is based on whole local calendar days',()=>{
 const t=helpers.today(),date=new Date(t+'T12:00:00');
 const dateAt=offset=>{const d=new Date(date);d.setDate(d.getDate()+offset);
 return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
 assert.equal(helpers.daysLeft(t),0);
 assert.equal(helpers.daysLeft(dateAt(1)),1);
 assert.equal(helpers.daysLeft(dateAt(-1)),-1);
 assert.equal(helpers.daysLeft('2026-02-31'),null);
 assert.equal(helpers.addDay('2026-12-31'),'20270101');
});
test('legacy sponsors and new ledger survive normalization',()=>{
 const old={id:'sponsor-77',brand:'Patrocinador',notes:'Acuerdo',paid:250,spaces:['Publicaciones']};
 const x=helpers.normalize({...old,payments:[{id:'p1',amount:50}],deliverables:[{id:'d1',text:'Lona'}]});
 assert.equal(x.id,old.id);assert.equal(x.notes,'Acuerdo');assert.equal(x.paid,250);
 assert.equal(x.payments.length,1);assert.equal(x.deliverables.length,1);
 assert.equal(helpers.normalize({...old,logo:'data:image/svg+xml,<svg onload=alert(1) />'}).logo,'');
 assert.equal(helpers.safeUrl('javascript:alert(1)'),'');
 assert.equal(helpers.safePhone('412 123 4567'),'524121234567');
});
