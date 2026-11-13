import test from 'node:test';
import assert from 'node:assert/strict';
import {manufacturerNumberInfo} from '../order-catalog.js';
import {motors,gears} from '../calculator.js';

test('Official dCore family codes map by exact series, not by arbitrary substring',()=>{
 const m=motors.find(m=>m.name.startsWith('BG95x40 dCore')&&m.voltage===48);
 assert.ok(m);
 const info=manufacturerNumberInfo('motor',m);
 assert.equal(info.pattern,'88595.XXXXX');
 assert.ok(info.source.includes('001_bg_xxdcore.pdf'));
 assert.equal(manufacturerNumberInfo('motor',{name:'BG95x40 dMove · 48 V'}),null);
});
test('NG gearbox has only a shared manufacturer range, never a guessed ordering code',()=>{
 const g=gears.find(g=>g.name.includes('NG 500')&&g.ratio===16);
 assert.ok(g);
 const info=manufacturerNumberInfo('gear',g);
 assert.equal(info.pattern,'88852.0XXXX');
 assert.ok(info.source.includes('getriebe.pdf'));
 assert.equal(manufacturerNumberInfo('gear',{name:'PLG 95 HT · 16:1'}),null);
});
test('BG95 dPro ranges differ by length',()=>{
 assert.equal(manufacturerNumberInfo('motor',{name:'BG95x40 dPro PN · 48 V'}).pattern,'88595.05XXX');
 assert.equal(manufacturerNumberInfo('motor',{name:'BG95x80 dPro CO · 48 V'}).pattern,'88595.06XXX');
 assert.equal(manufacturerNumberInfo('motor',{name:'BG95x120 dPro EI · 48 V'}).pattern,'88595.07XXX');
});
