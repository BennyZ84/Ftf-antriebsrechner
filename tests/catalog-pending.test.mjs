import test from 'node:test';
import assert from 'node:assert/strict';
import {pendingCatalogFamilies,pendingFamilyStatus} from '../catalog-pending.js';
import {motors,gears} from '../calculator.js';
test('WG 52/63/75 are manufacturer-recorded families, never fabricated usable ratios',()=>{
 const wgs=pendingCatalogFamilies.filter(x=>x.type==='gear');
 assert.deepEqual(wgs.map(x=>x.name),['WG 52','WG 63','WG 75']);
 for(const wg of wgs){
  assert.equal(wg.ratioRangeMax,320);
  assert.match(wg.source,/dunkermotoren/);
  assert.equal(pendingFamilyStatus(wg).calculable,false);
  assert.ok(!gears.some(g=>g.name.startsWith(wg.name+' ·')));
 }
});
test('BG45 dGo is listed for research without invented motor performance',()=>{
 const family=pendingCatalogFamilies.find(x=>x.id==='bg45dgo');
 assert.ok(family);
 assert.equal(pendingFamilyStatus(family).calculable,false);
 assert.ok(!motors.some(x=>x.series==='dGo'&&x.name.startsWith('BG45')));
});
