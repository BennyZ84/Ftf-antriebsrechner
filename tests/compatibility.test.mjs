import test from 'node:test';
import assert from 'node:assert/strict';
import {motors, gears} from '../calculator.js';
import {combinationStatus, motorFamily, gearFamily, catalogScope} from '../compatibility.js';

const motor = (p) => motors.find(m => m.name.startsWith(p));
const gear = (p) => gears.find(g => g.name.startsWith(p+' ·'));

test('Katalogabdeckung wird korrekt als unvollständig gekennzeichnet', () => {
  assert.equal(motors.length,124);
  assert.equal(gears.length,346);
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
test('Alle 87 mal 346 Motor/Getriebe-Kombinationen haben einen expliziten Status', () => {
  let listed=0,unverified=0;
  for (const m of motors) for (const g of gears) {
    const s=combinationStatus(m,g);
    assert.ok(['family-listed','unverified','unknown'].includes(s.level));
    if(s.level==='family-listed')listed++;
    if(s.level==='unverified')unverified++;
  }
  assert.ok(listed>0);
  assert.ok(unverified>0);
  assert.equal(listed+unverified,87*344);
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
 const found=motors.filter(m=>m.name.startsWith('BG75')&&['dPro','dMove'].includes(m.series));
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

test('Weitere Hersteller-Planetengetriebe mit genau dokumentierten Tabellenwerten',()=>{
 const expected={'PLG 40 LB':19,'PLG 52 EB':18,'PLG 52 HT':10,'PLG 63 HT':12,'PLG 75 SL':8};
 for(const [family,number] of Object.entries(expected)){
  const found=gears.filter(g=>g.name.startsWith(family+' ·'));assert.equal(found.length,number,family);
  for(const g of found){
   assert.ok(g.ratio>0 && g.eta>0 && g.eta<=1 && g.cont>0 && g.peak>0,g.name);
   assert.ok(g.source?.startsWith('https://www.dunkermotoren.com/'),g.name);
  }
 }
});

test('BG66 dMove and BG66 dPro Ethernet variants are distinct and carry thermally isolated limits',()=>{
 const a=motors.filter(m=>m.name.startsWith('BG66')&&m.series==='dMove');
 const b=motors.filter(m=>m.name.startsWith('BG66')&&m.series==='dPro');
 assert.equal(a.length,6);assert.equal(b.length,6);
 for(const m of [...a,...b]){
  for(const k of ['voltage','rpm','idle','nom','peak','J','nomThermallyConnected','rpmThermallyConnected'])assert.ok(m[k]>0,m.id+': '+k);
  assert.ok(m.nomThermallyConnected>=m.nom);
 }
 const drive=motors.find(m=>m.name.startsWith('BG66x25 dMove')&&m.voltage===48);
 assert.equal(drive.nom,0.38);assert.equal(drive.nomThermallyConnected,0.57);
 assert.equal(combinationStatus(drive,gears.find(g=>g.name.startsWith('PLG 63 HT ·'))).level,'family-listed');
 const pro=motors.find(m=>m.name.startsWith('BG66x25 dPro')&&m.voltage===48);
 assert.equal(pro.nom,0.42);assert.equal(pro.nomThermallyConnected,0.62);
 assert.equal(combinationStatus(pro,gears.find(g=>g.name.startsWith('PLG 80 LB ·'))).level,'family-listed');
});

test('All 17 PLG catalog families represented without fabricated peak torque',()=>{
 const expected={'PLG 22 HT':17,'PLG 30':14,'PLG 32':18,'PLG 42 K':16,'PLG 42 S':16};
 for(const [family,count] of Object.entries(expected)){
  const items=gears.filter(g=>g.name.startsWith(family+' ·'));
  assert.equal(items.length,count,family);
  for(const g of items){
   assert.equal(gearFamily(g),family);
   assert.ok(Number.isFinite(g.ratio)&&g.ratio>0);
   assert.ok(Number.isFinite(g.eta)&&g.eta>0&&g.eta<=1);
   assert.ok(Number.isFinite(g.cont)&&g.cont>0);
   assert.equal(g.peak,0,'Not-specified peak torque must not be invented: '+g.id);
   assert.equal(g.peakSpecified,false);
   assert.match(g.source,/dunkermotoren\.com/);
  }
 }
 assert.equal(new Set(gears.map(g=>g.id)).size,gears.length);
});

test('BG65 dMove: seven source-derived electrical variants and correct gearbox families',()=>{
 const list=motors.filter(m=>m.name.startsWith('BG65')&&m.series==='dMove');
 assert.equal(list.length,7);
 for(const m of list){
  assert.ok(m.rpm>0&&m.idle>0&&m.nom>0&&m.peak>0&&m.J>0);
  assert.ok(m.nomThermallyConnected>=m.nom);
  assert.ok(combinationStatus(m,gear('PLG 63 EP')).level==='family-listed');
 }
 assert.equal(combinationStatus(list[0],gear('PLG 42 K')).level,'unverified');
});
test('BG95 dPro PN/EC/EI: nine documented variants, source-linked families only',()=>{
 const list=motors.filter(m=>m.name.startsWith('BG95')&&m.series==='dPro');
 assert.equal(list.length,9);
 const byV=voltage=>list.find(m=>m.name.startsWith('BG95x40 ')&&m.voltage===voltage);
 assert.equal(byV(48).nom,2.14);
 assert.equal(byV(48).peak,8.13);
 for(const m of list){
  assert.ok(m.source.includes('dunkermotoren.com'));
  for(const g of ['NG 500','PLG 95 HT','PLG 75 EP'])
   assert.equal(combinationStatus(m,gear(g)).level,'family-listed',m.id+' '+g);
  assert.equal(combinationStatus(m,gear('PLG 30')).level,'unverified');
 }
});

test('BG45 dMove CO/IO variants and documented PLG family',()=>{
 const found=motors.filter(m=>m.name.startsWith('BG45')&&m.series==='dMove');
 assert.equal(found.length,6);
 for(const m of found){
  assert.equal(combinationStatus(m,gear('PLG 42 S')).level,'family-listed');
  assert.equal(combinationStatus(m,gear('PLG 75 HT')).level,'unverified');
  assert.ok(m.voltage>0&&m.rpm>0&&m.nom>0&&m.peak>0&&m.J>0);
 }
});
test('BG95 dPro CO/IO vs PN/EC/EI kept separate',()=>{
 const co=motors.filter(m=>m.name.startsWith('BG95')&&m.series==='dPro'&&m.name.includes('CO/IO'));
 const pn=motors.filter(m=>m.name.startsWith('BG95')&&m.series==='dPro'&&m.name.includes('PN/EC/EI'));
 assert.equal(co.length,9);assert.equal(pn.length,9);
 const co120=co.find(m=>m.name.startsWith('BG95x120')&&m.voltage===48);
 const pn120=pn.find(m=>m.name.startsWith('BG95x120')&&m.voltage===48);
 assert.equal(co120.nom,3.55);
 assert.equal(pn120.nom,3.8);
 assert.notEqual(co120.id,pn120.id);
 assert.equal(combinationStatus(co120,gear('NG 500')).level,'family-listed');
});

test('BG45 dPro CO/IO nominal and thermal ratings are separate',()=>{
 const found=motors.filter(m=>m.name.startsWith('BG45')&&m.series==='dPro');
 assert.equal(found.length,6);
 for(const m of found){
  assert.ok(m.nomThermallyConnected>=m.nom);
  assert.equal(combinationStatus(m,gear('PLG 42 S')).level,'family-listed');
  assert.equal(combinationStatus(m,gear('PLG 63 HT')).level,'unverified');
 }
 const model=found.find(m=>m.name.startsWith('BG45x30 ')&&m.voltage===48);
 assert.equal(model.nom,.24);assert.equal(model.nomThermallyConnected,.36);
});

test('Neue SG-, KG-Getriebe und bewusst fehlende Grenzmomente',()=>{
 const fam={'SG 45':8,'SG 62':6,'SG 80':7,'SG 80 K':4,'SG 85':1,'KG 80':10,'KG 150':7};
 for(const [name,n] of Object.entries(fam)){
  const found=gears.filter(g=>g.name.startsWith(name+' ·'));
  assert.equal(found.length,n,name);
  for(const g of found){
   assert.equal(gearFamily(g),name);
   assert.ok(g.ratio>0&&g.eta>0&&g.eta<=1&&g.cont>0&&g.source);
  }
 }
 const sg85=gears.find(g=>g.name.startsWith('SG 85 ·'));
 assert.equal(sg85.peak,0);
 assert.equal(sg85.peakSpecified,false);
 const kg150=gears.find(g=>g.name.startsWith('KG 150 ·'));
 assert.equal(kg150.eta,.96);
});

test('SG65 confirmed and NG1000 WO preliminary remain explicitly distinct',()=>{
 const sg=gears.find(g=>g.id==='sg65-10_25');
 const ng=gears.find(g=>g.id==='ng1000wo-20-preliminary');
 assert.ok(sg&&ng);
 assert.equal(sg.ratio,10.25);assert.equal(sg.cont,4);assert.equal(sg.peak,7);
 assert.equal(ng.preliminary,true);
 assert.equal(combinationStatus(motor('BG95x40'),ng).level,'unverified');
});

test('SG65 exakt dokumentierte Einzelvariante aus Herstellerdatenblatt',()=>{
 const sg=gears.find(g=>g.id==='sg65-10_25');
 assert.ok(sg);
 assert.equal(gearFamily(sg),'SG 65');
 assert.equal(sg.ratio,10.25);
 assert.equal(sg.eta,0.8);
 assert.equal(sg.cont,4);
 assert.equal(sg.peak,7);
 assert.match(sg.source,/sg-65\.pdf/);
});
test('NG1000 WO nur als vorläufige Herstellerangabe, niemals pauschal bestätigt',()=>{
 const ng=gears.find(g=>g.id==='ng1000wo-20-preliminary');
 assert.ok(ng);
 assert.equal(gearFamily(ng),'NG 1000 WO');
 assert.equal(ng.preliminary,true);
 assert.deepEqual([ng.ratio,ng.eta,ng.cont,ng.peak],[20,.85,80,160]);
 const motor=motors.find(m=>m.name.startsWith('BG95x80 dPro'));
 assert.ok(motor);
 assert.equal(combinationStatus(motor,ng).level,'unverified');
});
