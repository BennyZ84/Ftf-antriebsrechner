import test from 'node:test';
import assert from 'node:assert/strict';
import {auxiliaryDefaults,calculateInertia,calculateBattery} from '../auxiliary.js';
import {defaults} from '../calculator.js';
const close=(a,b,tol=1e-6)=>assert.ok(Math.abs(a-b)<tol,`expected ${a} ≈ ${b}`);
test('Excel Trägheitsmoment F21:F27 including Steiner: 2366.1 kgm²',()=>{
 const cfg={...defaults,...auxiliaryDefaults,unloaded:3000,payload:15000};
 const r=calculateInertia(cfg);assert.ok(!r.error);
 close(r.ftfCenter,736.1);
 close(r.loadCenter,625);
 close(r.ftfAxis,803.6);
 close(r.loadAxis,1562.5);
 close(r.total,2366.1);
});
test('Inertia changes with turn axis offsets, preserving center inertia',()=>{
 const base=calculateInertia({...defaults,...auxiliaryDefaults});
 const rotated=calculateInertia({...defaults,...auxiliaryDefaults,ftfAxisOffset:500});
 close(base.ftfCenter,rotated.ftfCenter);
 assert.ok(rotated.total>base.total);
});
test('Battery 4x24V 21Ah in 48V pack: 2S2P, 42Ah, 2016Wh',()=>{
 const r=calculateBattery({...defaults,...auxiliaryDefaults});
 assert.equal(r.series,2);
 assert.equal(r.parallel,2);
 assert.equal(r.totalAh,42);
 assert.equal(r.nominalWh,2016);
 assert.equal(r.usableWh,1612.8);
 assert.ok(r.dailyWh>r.controlWh && r.driveWh>0);
});
test('Battery rejects non-integer series or parallel configuration',()=>{
 assert.ok(calculateBattery({...defaults,...auxiliaryDefaults,systemVoltage:40}).error);
 assert.ok(calculateBattery({...defaults,...auxiliaryDefaults,batteryCount:3}).error);
});
test('Unrealistic route scheduling is reported instead of silently accepted',()=>{
 const r=calculateBattery({...defaults,...auxiliaryDefaults,routeLength:100000,tripsPerDay:30});
 assert.ok(r.warnings.some(s=>s.includes('überschreitet')));
});
test('Motorless saved project fields are not required; formula inputs are validated',()=>{
 assert.ok(calculateInertia({...defaults,...auxiliaryDefaults,ftfLength:0}).error);
 assert.ok(calculateBattery({...defaults,...auxiliaryDefaults,usableCapacity:120}).error);
});

test('Mehrere Fahrkursabschnitte überschreiben die pauschale Streckenannahme',()=>{
 const cfg={...defaults,...auxiliaryDefaults,routeSegments:[
  {distance:100,speed:1,loadFactor:1,stops:1,dwellSeconds:20,conveyorSeconds:10},
  {distance:100,speed:0.5,loadFactor:0,stops:1,dwellSeconds:30,conveyorSeconds:0}
 ]};
 const r=calculateBattery(cfg);
 assert.ok(!r.error);
 assert.equal(r.segmentDetails.length,2);
 const expectedTimePerTrip=100/1+20+10+100/0.5+30;
 assert.ok(Math.abs(r.occupiedHours-expectedTimePerTrip*cfg.tripsPerDay/3600)<1e-12);
 const force=(m)=>m*9.81*(cfg.roll*Math.cos(Math.atan(cfg.slope/100))+Math.sin(Math.atan(cfg.slope/100)));
 const loaded=(force(cfg.unloaded+cfg.payload)*100+0.5*(cfg.unloaded+cfg.payload)*1**2)/(cfg.eta*3600);
 const empty=(force(cfg.unloaded)*100+0.5*cfg.unloaded*.5**2)/(cfg.eta*3600);
 assert.ok(Math.abs(r.drivePerTrip-(loaded+empty))<1e-10);
 assert.equal(r.conveyorWh,cfg.conveyorPower*10*cfg.tripsPerDay/3600);
});
test('Fahrkurs prüft unzulässige Abschnittswerte und unrealistische Zeiten',()=>{
 const segment={distance:500,speed:0.5,loadFactor:1,stops:1,dwellSeconds:2000,conveyorSeconds:100};
 const r=calculateBattery({...defaults,...auxiliaryDefaults,routeSegments:[segment],tripsPerDay:30});
 assert.ok(!r.error);
 assert.ok(r.warnings.some(x=>x.includes('überschreitet')));
 assert.ok(calculateBattery({...defaults,...auxiliaryDefaults,routeSegments:[{...segment,speed:0}]}).error);
 assert.ok(calculateBattery({...defaults,...auxiliaryDefaults,routeSegments:[{...segment,loadFactor:2}]}).error);
});
