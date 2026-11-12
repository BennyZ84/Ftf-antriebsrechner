import test from 'node:test';
import assert from 'node:assert/strict';
import {motors, gears} from '../calculator.js';
import {combinationStatus, motorFamily, gearFamily, catalogScope} from '../compatibility.js';

const motor = (p) => motors.find(m => m.name.startsWith(p));
const gear = (p) => gears.find(g => g.name.startsWith(p+' ·'));

test('Katalogabdeckung wird korrekt als unvollständig gekennzeichnet', () => {
  assert.equal(motors.length,75);
  assert.equal(gears.length,81);
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
test('Alle 75 mal 81 Motor/Getriebe-Kombinationen haben einen expliziten Status', () => {
  let listed=0,unverified=0;
  for (const m of motors) for (const g of gears) {
    const s=combinationStatus(m,g);
    assert.ok(['family-listed','unverified','unknown'].includes(s.level));
    if(s.level==='family-listed')listed++;
    if(s.level==='unverified')unverified++;
  }
  assert.ok(listed>0);
  assert.ok(unverified>0);
  assert.equal(listed+unverified,75*81);
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
 assert.equal(combinationStatus(pro,gears.find(g=>g.name.startsWith('PLG 75 EP'))).level,'unverified');
 assert.equal(combinationStatus(move,gears.find(g=>g.name.startsWith('PLG 75 EP'))).level,'unverified');
});
test('alle 14 dPro/dMove BG75-Varianten haben vollständig bezifferte Kerndaten',()=>{
 const found=motors.filter(m=>['dPro','dMove'].includes(m.series));
 assert.equal(found.length,14);
 for(const m of found)for(const k of ['rpm','idle','nom','peak','J','voltage'])assert.ok(m[k]>0,m.id+': '+k);
});
