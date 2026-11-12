import test from 'node:test';import assert from 'node:assert/strict';import {defaults,calc} from '../calculator.js';
test('Referenz 750 kg und zwei Antriebe',()=>{const r=calc({...defaults});assert.equal(r.metrics.mass,750);assert.ok(Math.abs(r.metrics.rpm-2673.8)<1);assert.ok(Math.abs(r.metrics.wheel-20.886)<0.02);assert.ok(Math.abs(r.metrics.motor-1.64)<0.01);assert.ok(Math.abs(r.metrics.brakeDist-1.4)<0.001);});
test('Radgröße beeinflusst Drehzahl und Moment',()=>{const a=calc({...defaults});const b=calc({...defaults,wheel:200});assert.ok(b.metrics.rpm<a.metrics.rpm);assert.ok(b.metrics.wheel>a.metrics.wheel);});
test('Antriebsanzahl reduziert Moment je Antrieb',()=>{const a=calc({...defaults});const b=calc({...defaults,drives:4});assert.ok(b.metrics.wheel<a.metrics.wheel);});
test('Ungültige Eingaben werden abgewiesen',()=>{assert.ok(calc({...defaults,drives:0}).error);assert.ok(calc({...defaults,wheel:0}).error);});

test('Excel Bremsweg Antriebsdaten: 0,30 m/s plus 0,05 Toleranz, 0,4 s Reaktion, 0,8 m/s² und Faktor 1,2',()=>{
 const r=calc({...defaults,speed:.3,brake:.8,reactionTime:.4,speedTolerance:.05,brakeSafetyFactor:1.2,scannerTolerance:65,clearanceAllowance:150,reflectionAllowance:350});
 assert.ok(!r.error);
 assert.ok(Math.abs(r.metrics.brakeReaction-.259875)<1e-9);
 assert.ok(Math.abs(r.metrics.fieldLength-.824875)<1e-9);
});
test('Excel Startfaktor verändert zusätzliche Anfahrkraft, nicht physikalische Basis-Beschleunigungsformel',()=>{
 const a=calc({...defaults,startFactor:1});
 const b=calc({...defaults,startFactor:1.3});
 assert.ok(!a.error&&!b.error);
 const value=(out,key)=>out.results.find(x=>x[0]===key)[1];
 assert.ok(value(b,'Anfahrkraft mit Faktor')>value(a,'Anfahrkraft mit Faktor'));
 assert.equal(a.metrics.motor,b.metrics.motor);
});
test('Leistung beladen und unbeladen getrennt und neue Eingaben validiert',()=>{
 const r=calc({...defaults});
 const loaded=r.results.find(x=>x[0]==='Fahrleistung beladen (Modell)')[1];
 const empty=r.results.find(x=>x[0]==='Fahrleistung unbeladen (Modell)')[1];
 assert.ok(loaded>empty&&empty>0);
 assert.ok(calc({...defaults,reactionTime:-1}).error);
 assert.ok(calc({...defaults,brakeSafetyFactor:0}).error);
});

test('Excel Antriebsdaten: beladen 18000 kg bei 0,3 m/s, 0,1 m/s², Steigung 0,5 Prozent',()=>{
 const x=calc({...defaults,unloaded:3000,payload:15000,speed:.3,accel:.1,roll:.015,slope:.5,eta:.77,wheel:360,ratio:120,drives:2,startFactor:1.3});
 assert.ok(!x.error);
 const get=(name)=>x.results.find(row=>row[0]===name)[1];
 // Excel nennt F_Roll=2648,7 N ohne cos(alpha); App berücksichtigt cos(alpha) explizit.
 assert.ok(Math.abs(get('Rollwiderstand')-2648.7)<0.04);
 assert.ok(Math.abs(get('Anfahrkraft mit Faktor')-5871.5889639569)<0.04);
 assert.ok(Math.abs(get('Fahrleistung beladen (Modell)')-2287.6320638793)<0.02);
});
