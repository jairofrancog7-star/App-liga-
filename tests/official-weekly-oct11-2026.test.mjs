import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const season=JSON.parse(readFileSync(new URL('../public/data/temporada-actual-2026.json',import.meta.url),'utf8'));
const official=JSON.parse(readFileSync(new URL('../public/data/official-live.json',import.meta.url),'utf8'));
const weekly=main.slice(main.indexOf('function v38WeeklyView(){'),main.indexOf('  const titles={primera:',main.indexOf('function v38WeeklyView(){')));

const expected=[
 ['PACHANGAS FC','TAPATIO','08:00','Campo 2'],
 ['TAVERA FC','SAN JULIAN','10:00','San Julian'],
 ['DEP. NOPALERO','SAN ANTONIO FC','10:00','Campo 2'],
 ['SAN JOSE JRS','SAN JUAN FC','10:00','San Jose de la Montaña'],
 ['BARZA','DEP. ZAPATA','12:00','Campo 2'],
 ['CELTICOS','DEP. LA LUZ','12:00','Campo 1 (Empastado)']
];

test('Segunda J7: seis cruces del 11/10, sin partidos obsoletos del 04/10',()=>{
 const second=season.categories['Segunda Fuerza'];
 assert.match(second.current_phase,/J7 · 11\/10\/2026/);
 const list=second.rounds.J7;
 assert.equal(list.length,6);
 for(const [home,away,time,field] of expected){
  assert.equal(list.filter(x=>x.date==='2026-10-11'&&x.home===home&&x.away===away&&x.time===time&&x.field===field).length,1);
  assert.ok(weekly.includes("['11/10/2026','"+time+"','"+home+"','"+away+"','"+field+"','Jornada 7']"));
 }
 assert.ok(list.every(x=>x.date==='2026-10-11'));
 assert.doesNotMatch(weekly,/04\/10\/2026/);
});
test('J7 y J8: el respaldo coincide con la fuente oficial sin inventar goles',()=>{
 const rows=official.categories['4'].fixtures.flatMap(group=>group.rows);
 const j7=rows.filter(x=>x[1]==='7');
 assert.equal(j7.length,6);
 for(const item of season.categories['Segunda Fuerza'].rounds.J7){
  assert.ok(j7.some(x=>x[2]===item.home&&x[6]===item.away&&x[8]===item.date.split('-').reverse().join('/')+' '+item.time));
 }
 assert.ok(j7.every(x=>x[3]==='-'&&x[5]==='-'));
});
test('reporte y PDF muestran campo, número de jornada y fechas correctas',()=>{
 assert.match(main,/Semana del 05\/10\/2026 al 11\/10\/2026/);
 assert.match(main,/value="2026-10-05"/);
 assert.match(main,/value="2026-10-11"/);
 assert.match(main,/<th>Visitante<\/th><th>Campo<\/th><th>Jornada<\/th>/);
 assert.match(main,/<td>'\+r\[4\]\+'<\/td><td>'\+r\[5\]\+'<\/td>/);
 assert.match(main,/<td>'\+t\[5\]\+'<\/td><td>'\+t\[6\]\+'<\/td>/);
 assert.ok(weekly.includes("['10/10/2026','15:30','BOAVISTA','BOCA JRS','Campo 3','Jornada 8']"));
});
