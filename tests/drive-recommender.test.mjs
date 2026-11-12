import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendDrives,recommendMotors} from '../drive-recommender.js';
import {motors,gears,defaults} from '../calculator.js';
import {combinationStatus} from '../compatibility.js';

test('Only documented and fully quantified pairs are proposed',()=>{
 const result=recommendDrives({...defaults,unloaded:100,payload:50,speed:.2,accel:.1,startFactor:1},motors,gears,{voltage:48,reserve:20});
 assert.ok(!result.error);
 for(const c of result.candidates){
  const m=motors.find(m=>m.id===c.motorId),g=gears.find(g=>g.id===c.gearId);
  assert.equal(m.voltage,48);
  assert.equal(combinationStatus(m,g).level,'family-listed');
  assert.ok(c.requiredMotor*1.2<=m.nom+1e-10);
  assert.ok(c.requiredRpm<=m.rpm+1e-10);
  assert.ok(c.wheelAccel*1.2<=g.peak+1e-10);
 }
});
test('No imaginary match for impossible speed, bad voltage, or unknown torque limit',()=>{
 const impossible=recommendDrives({...defaults,speed:500},motors,gears,{voltage:48,reserve:20});
 assert.equal(impossible.total,0);
 assert.ok(recommendDrives(defaults,motors,gears,{voltage:999}).error);
 assert.ok(recommendDrives(defaults,motors,gears,{voltage:48,reserve:-5}).error);
 const fakeMotor={id:'motor',name:'BG75x25 dCore · 48 V',voltage:48,nom:100,peak:100,rpm:100000,J:0};
 const fakeGear={id:'gear',name:'PLG 63 EP · 10:1',ratio:10,eta:.9,cont:0,peak:10000};
 assert.equal(recommendDrives(defaults,[fakeMotor],[fakeGear],{voltage:48}).total,0);
});

test('Motor criteria search filters rated values without relying on FTF settings',()=>{
 const r=recommendMotors(motors,{voltage:48,rpm:2000,torque:.4,peak:1,reserve:20});
 assert.ok(!r.error);
 for(const c of r.candidates){
  assert.equal(c.voltage,48);
  assert.ok(c.rpm>=2000);
  assert.ok(c.nom>=.48-1e-10);
  assert.ok(c.peak>=1.2-1e-10);
 }
 assert.ok(recommendMotors(motors,{voltage:48,rpm:0,torque:1}).error);
 assert.equal(recommendMotors(motors,{voltage:48,rpm:999999,torque:1}).total,0);
});
