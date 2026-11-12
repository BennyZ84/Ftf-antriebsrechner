import test from 'node:test';import assert from 'node:assert/strict';import {defaults,calc} from '../calculator.js';
test('Referenz 750 kg und zwei Antriebe',()=>{const r=calc({...defaults});assert.equal(r.metrics.mass,750);assert.ok(Math.abs(r.metrics.rpm-2673.8)<1);assert.ok(Math.abs(r.metrics.wheel-20.886)<0.02);assert.ok(Math.abs(r.metrics.motor-1.64)<0.01);assert.ok(Math.abs(r.metrics.brakeDist-1.4)<0.001);});
test('Radgröße beeinflusst Drehzahl und Moment',()=>{const a=calc({...defaults});const b=calc({...defaults,wheel:200});assert.ok(b.metrics.rpm<a.metrics.rpm);assert.ok(b.metrics.wheel>a.metrics.wheel);});
test('Antriebsanzahl reduziert Moment je Antrieb',()=>{const a=calc({...defaults});const b=calc({...defaults,drives:4});assert.ok(b.metrics.wheel<a.metrics.wheel);});
test('Ungültige Eingaben werden abgewiesen',()=>{assert.ok(calc({...defaults,drives:0}).error);assert.ok(calc({...defaults,wheel:0}).error);});
