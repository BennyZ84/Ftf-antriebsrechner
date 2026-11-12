import test from 'node:test';
import assert from 'node:assert/strict';
import {rollerDefaults,calculateRollerPressure} from '../roller.js';
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol,`${a} ≠ ${b}`);
test('Rollenbeispiel: 1200kg, 250x100mm, PA/PU auf C30',()=>{
 const r=calculateRollerPressure({...rollerDefaults});
 assert.ok(!r.error);
 close(r.force,11772);
 close(r.combinedPA,5834.254143646409);
 close(r.combinedPU,1562.1301775147929);
 close(r.pressurePA,31.568161892447943);
 close(r.pressurePU,16.334853152236676);
});
test('Breitere Rollen reduzieren rechnerische Kontaktpressung',()=>{
 const a=calculateRollerPressure({...rollerDefaults});
 const b=calculateRollerPressure({...rollerDefaults,rollerWidth:200});
 assert.ok(b.pressurePA<a.pressurePA);
 assert.ok(b.pressurePU<a.pressurePU);
 close(b.pressurePA/a.pressurePA,1/Math.sqrt(2),1e-12);
});
test('Ungültige Material- und Geometriedaten werden abgewiesen',()=>{
 for(const patch of [{rollerWidth:0},{rollerDiameter:-10},{paModulus:0},{rollerPoisson:.5},{rollerLoadKg:0}]){
  assert.ok(calculateRollerPressure({...rollerDefaults,...patch}).error);
 }
});
