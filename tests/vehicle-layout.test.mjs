import test from 'node:test';
import assert from 'node:assert/strict';
import {layoutDefaults,calculateLayout} from '../vehicle-layout.js';
test('FTF default: two drive wheels at rear, two free wheels at front',()=>{
 const x=calculateLayout({drives:2,...layoutDefaults,ftfWidth:1600,ftfLength:620});
 assert.ok(!x.error);
 assert.equal(x.total,4);
 assert.deepEqual(x.wheels.map(w=>w.type),['caster','caster','drive','drive']);
 assert.deepEqual(x.wheels.filter(w=>w.type==='drive').map(w=>w.x),[1/3,2/3]);
 assert.ok(x.wheels.filter(w=>w.type==='caster').every(w=>w.y<0.5));
 assert.ok(x.wheels.filter(w=>w.type==='drive').every(w=>w.y>0.5));
});
test('Different counts dynamically change the wheel positions',()=>{
 const x=calculateLayout({drives:4,casterCount:3,ftfWidth:1100,ftfLength:1400});
 assert.equal(x.total,7);
 assert.equal(x.wheels.filter(w=>w.type==='drive').length,4);
 assert.equal(x.wheels.filter(w=>w.type==='caster').length,3);
 assert.deepEqual(x.wheels.filter(w=>w.type==='caster').map(w=>w.x),[.25,.5,.75]);
});
test('Zero additional wheels allowed; invalid data rejected',()=>{
 assert.equal(calculateLayout({drives:1,casterCount:0,ftfWidth:1600,ftfLength:620}).total,1);
 for(const patch of [{drives:0},{drives:13},{drives:1.5},{casterCount:-1},{casterCount:13},{ftfWidth:0},{ftfLength:0}]){
  assert.ok(calculateLayout({drives:2,casterCount:2,ftfWidth:1600,ftfLength:620,...patch}).error);
 }
});
test('Existing projects without caster field retain two free wheels',()=>{
 const x=calculateLayout({drives:2,ftfWidth:1600,ftfLength:620});
 assert.equal(x.casters,2);
});
