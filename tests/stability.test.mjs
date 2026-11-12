import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateStability,stabilityDefaults} from '../stability.js';
import {defaults} from '../calculator.js';
const base={...defaults,...stabilityDefaults,
 unloaded:200,payload:550,
 radAx:2000,radAy:0,radBx:0,radBy:2000,radCx:2000,radCy:2000,
 ftfCogX:500,ftfCogY:500,ftfCogZ:500,
 loadCogX:500,loadCogY:500,loadCogZ:500,
 lateralSlopeDegrees:0,externalForceN:0,externalForceHeight:0,
 curveSpeed:0,stabilityRadius:1500};
test('Three-point support: static tipping distance 500mm',()=>{
 const x=calculateStability({...base,supportCount:3});
 assert.ok(!x.error);
 assert.equal(x.points.length,3);
 assert.ok(Math.abs(x.staticMargin-500)<1e-8);
 assert.ok(Math.abs(x.reserve-500)<1e-8);
});
test('Four-point rectangular support: same minimum distance',()=>{
 const x=calculateStability({...base,supportCount:4});
 assert.ok(!x.error);
 assert.equal(x.points.length,4);
 assert.ok(Math.abs(x.staticMargin-500)<1e-8);
});
test('Tilting, cornering and external forces conservatively reduce margin',()=>{
 const x=calculateStability({...base,lateralSlopeDegrees:2,curveSpeed:.5,externalForceN:100,externalForceHeight:1000});
 assert.ok(!x.error);
 assert.ok(x.gradeShift>0 && x.curveShift>0 && x.externalShift>0);
 assert.ok(x.reserve<x.staticMargin);
});
test('Out-of-support CG yields warning instead of false stability claim',()=>{
 const x=calculateStability({...base,ftfCogX:2400,loadCogX:2400});
 assert.ok(x.reserve<0);
 assert.equal(x.stableUnderModel,false);
 assert.ok(x.warnings.some(s=>s.includes('außerhalb')));
});
test('Unusable or coincident supports are rejected',()=>{
 assert.ok(calculateStability({...base,supportCount:2}).error);
 assert.ok(calculateStability({...base,radAx:0,radAy:0}).error);
});
