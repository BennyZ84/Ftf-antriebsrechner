import test from 'node:test';
import assert from 'node:assert/strict';
import {motors, gears} from '../calculator.js';
import {combinationStatus, motorFamily, gearFamily, catalogScope} from '../compatibility.js';

const motor = (p) => motors.find(m => m.name.startsWith(p));
const gear = (p) => gears.find(g => g.name.startsWith(p+' ·'));

test('Katalogabdeckung wird korrekt als unvollständig gekennzeichnet', () => {
  assert.equal(motors.length,75);
  assert.equal(gears.length,153);
  assert.equal(catalogScope.coverageComplete,false);
});
test('BG65 dCore und PLG63 EP als gelistete Baukastenfamilie', () => {
  assert.equal(motorFamily(motor('BG65x25')), 'bg65');
  assert.equal(gearFamily(gear('PLG 63 EP')), 'PLG 63 EP');
  assert.equal(combinationStatus(motor('BG65x25'),gear('PLG 63 EP')).level,'family-listed');
});
test('BG75 dCore und PLG75 EP als gelistete Baukastenfamilie', () => {
  assert.equal(combinationStatus(motor('BG75x25'),gear('PLG 75 EP')).level,'family-listed');
});
test('BG95 dCore und PLG75 EP als gelistete Baukastenfamilie', () => {
  assert.equal(combinationStatus(motor('BG95x40'),gear('PLG 75 EP')).level,'family-listed');
});
test('BG95 mit PLG63 EP ist nicht belegt und wird nicht als passend bezeichnet', () => {
  assert.equal(combinationStatus(motor('BG95x40'),gear('PLG 63 EP')).level,'unverified');
});
test('Referenz BG95x40 dCore + NG500 ist laut NG500 Herstellerzeichnung dokumentiert', () => {
  const s=combinationStatus(motor('BG95x40'),gears.find(g=>g.id==='ng500'));
  assert.equal(s.level,'family-listed');
  assert.match(s.label,/Hersteller dokumentiert|Hersteller dokumentiert|vom Hersteller dokumentiert/);
  assert.match(s.source,/ng-500\.pdf/);
});
test('Alle 75 mal 153 Motor/Getriebe-Kombinationen haben einen expliziten Status', () => {
  let listed=0,unverified=0;
  for (const m of motors) for (const g of gears) {
    const s=combinationStatus(m,g);
    assert.ok(['family-listed','unverified','unknown'].includes(s.level));
    if(s.level==='family-listed')listed++;
    if(s.level==='unverified')unverified++;
  }
  assert.ok(listed>0);
  assert.ok(unverified>0);
  assert.equal(listed+unverified,75*153);
});
test('BG62 und PLG75 HT sind gelistete Baukastenfamilie',()=>{assert.equal(combinationStatus(motor('BG62x30'),gear('PLG 75 HT')).level,'family-listed');});
test('BG66 und PLG75 HT sind gelistete Baukastenfamilie',()=>{assert.equal(combinationStatus(motor('BG66x25'),gear('PLG 75 HT')).level,'family-listed');});
test('BG95 und PLG95 HT sind gelistete Baukastenfamilie',()=>{assert.equal(combinationStatus(motor('BG95x40'),gear('PLG 95 HT')).level,'family-listed');});

test('BG32/BG42/BG45 sind dokumentiert, aber ohne bestätigte Partner aus der derzeitigen Getriebeauswahl',()=>{for(const p of ['BG32x10','BG42x15','BG45x15']){const m=motor(p);assert.ok(m);assert.equal(combinationStatus(m,gear('PLG 75 HT')).level,'unverified');}});
test('Unbestätigter vorläufiger BG42x45 24V ist nicht zur Auslegung hinterlegt',()=>{assert.ok(!motors.some(m=>m.id==='bg42x45-24v'));});

test('dCore dPro dMove BG75x25 bleiben getrennte Typen',()=>{
 const get=(s,v)=>motors.find(m=>m.name.startsWith('BG75x25 '+s+' ')&&m.voltage===v);
 const core=get('dCore',40),pro=get('dPro',48),move=get('dMove',48);
 assert.ok(core && pro && move);
 assert.equal(core.voltage,40);
 assert.equal(pro.rpm,3950);assert.equal(pro.nom,0.735);assert.equal(pro.J,240);
 assert.equal(move.nom,0.62);assert.equal(move.J,240);
 assert.equal(combinationStatus(pro,gears.find(g=>g.name.startsWith('PLG 75 EP'))).level,'family-listed');
 assert.equal(combinationStatus(move,gears.find(g=>g.name.startsWith('PLG 75 EP'))).level,'family-listed');
});
test('alle 14 dPro/dMove BG75-Varianten haben vollständig bezifferte Kerndaten',()=>{
 const found=motors.filter(m=>['dPro','dMove'].includes(m.series));
 assert.equal(found.length,14);
 for(const m of found)for(const k of ['rpm','idle','nom','peak','J','voltage'])assert.ok(m[k]>0,m.id+': '+k);
});

test('BG75 dMove/dPro: Katalog-Baukasten NG250, NG500, PLG63, PLG75',()=>{
 for(const series of ['dMove','dPro']){
  const m=motors.find(x=>x.name.startsWith('BG75x25 '+series+' ') && x.voltage===48);
  assert.ok(m);
  for(const gname of ['NG 250','NG 500','PLG 63 EP','PLG 75 EP']){
   const g=gears.find(x=>x.name.startsWith(gname+' ·'));
   assert.ok(g);
   const status=combinationStatus(m,g);
   assert.equal(status.level,'family-listed',series+' '+gname);
   assert.match(status.reason,/nicht bestätigt/);
  }
  const ht=gears.find(x=>x.name.startsWith('PLG 75 HT ·'));
  assert.equal(combinationStatus(m,ht).level,'unverified');
 }
});

test('Missing gearbox families are available with numeric manufacturer records',()=>{
 const families={'PLG 60 LN':11,'PLG 60 LB':19,'PLG 80 LB':19,'STG 65':3,'SG 120':11,'SG 120 K':2,'KG 120':7};
 for(const [family,count] of Object.entries(families)){
  const found=gears.filter(g=>g.name.startsWith(family+' ·'));
  assert.equal(found.length,count,family);
  for(const g of found)for(const prop of ['ratio','eta','cont','peak']){
   assert.ok(Number.isFinite(g[prop])&&g[prop]>0,family+' '+g.ratio+' '+prop);
  }
 }
});
test('PLG 80 LB 4:1 uses S8 torque not alternate S1 torque',()=>{
 const g=gears.find(x=>x.id==='plg-80-lb-4');
 assert.ok(g);assert.equal(g.eta,.97);assert.equal(g.cont,54);assert.equal(g.peak,110);
 assert.equal(g.continuousS1,115);
});
test('BG75 dMove and dPro allow listed families but not blanket HT subtypes',()=>{
 for(const series of ['dMove','dPro']){
  const m=motors.find(x=>x.name.startsWith('BG75x25 '+series));
  for(const family of ['PLG 60 LN','PLG 80 LB','STG 65','SG 120','KG 120'])
   assert.equal(combinationStatus(m,gears.find(g=>g.name.startsWith(family+' ·'))).level,'family-listed',series+' '+family);
  assert.equal(combinationStatus(m,gears.find(g=>g.name.startsWith('PLG 75 HT ·'))).level,'unverified');
 }
});
