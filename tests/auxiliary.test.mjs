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
