import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
test('All directly referenced interface elements exist',()=>{
 const referenced=[...js.matchAll(/\$\('([^']+)'\)/g)].map(x=>x[1]);
 const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]));
 for(const id of referenced)assert.ok(ids.has(id)||id.startsWith('field-'),id+' missing');
});
test('Both modes have distinct labels and motor-only hides gearbox',()=>{
 assert.match(html,/id="modeMotor"[^>]*>Motordaten<\/button>/);
 assert.match(html,/id="modeFTF"[^>]*>FTF-Berechnung<\/button>/);
 assert.match(html,/id="motorPanelTitle"/);
 assert.match(js,/\$\('gearSection'\)\.hidden=motorOnly/);
 assert.match(js,/\$\('motorPanelTitle'\)\.textContent=motorOnly\?'Motordaten':'Motor & Getriebe'/);
});
test('Technical notes are collapsible and duplicate motor note removed',()=>{
 assert.ok(!html.includes('id="motorNote"'));
 assert.ok(!html.includes('id="modeDescription"'));
 assert.ok(html.includes('<details class="spec-details">'));
 assert.ok(html.includes('id="motorSpecSource"'));
});
test('App version assets and offline cache agree',()=>{
 const match=sw.match(/const CACHE='ftf-rechner-(v[0-9]+\.[0-9]+)'/);
 assert.ok(match,'cache version missing');
 const version=match[1];
 assert.ok(html.includes('app.js?v='+version.slice(1)));
 assert.ok(html.includes('styles.css?v='+version.slice(1)));
 assert.ok(sw.includes('app.js?v='+version.slice(1)));
 assert.ok(sw.includes('styles.css?v='+version.slice(1)));

});

test('Warnings are reserved for real threshold violations; generic notes collapse',()=>{
 assert.ok(html.includes('id="calculationNotes"'));
 assert.ok(html.includes('id="calculationNoteList"'));
 assert.ok(js.includes("const critical=/überschritten"));
 assert.ok(js.includes("warningsBox.hidden=warningsBox.childElementCount===0"));
});

test('Migration backup provides separate source ZIP and browser project JSON',()=>{
 assert.ok(html.includes('Alle Projekte als JSON sichern'));
 assert.ok(html.includes('Ftf-antriebsrechner/archive/refs/heads/main.zip'));
 assert.ok(html.includes('MIGRATION_BACKUP.md'));
 assert.ok(!html.includes('Excel-'));
});

test('Pending manufacturer families are visible but kept out of numeric drive model',()=>{
 assert.ok(html.includes('pendingCatalogFamilies'));
 assert.ok(html.includes('catalogPendingSection'));
 assert.ok(js.includes('renderPendingCatalog'));
 assert.ok(sw.includes('catalog-pending.js'));
});

test('FTF layout has its own navigable page and real project-linked controls',()=>{
 assert.ok(html.includes('data-tab="ansicht"'));
 assert.ok(html.includes('id="view-ansicht"'));
 assert.ok(html.includes('id="vehicleSvg"'));
 assert.ok(html.includes('id="vehicleLayoutStats"'));
 assert.ok(html.includes('id="layoutBack"'));
 assert.ok(html.includes('id="layoutSave"'));
 assert.ok(js.includes('renderVehicleLayout();'));
 assert.ok(js.includes("['eingaben','ansicht','ergebnisse','projekte']"));
 assert.ok(js.includes('casterCount'));
 assert.ok(js.includes('calculateLayout(config)'));
 assert.ok(sw.includes('vehicle-layout.js'));
});

test('Second plan view exposes load dimensions and signed midpoint offsets',()=>{
 for(const id of ['layoutLoadWidth','layoutLoadLength','layoutLoadOffsetX','layoutLoadOffsetY','loadSvg','loadLayoutNote'])
  assert.ok(html.includes('id="'+id+'"'),id+' missing');
 assert.ok(js.includes('calculateLoadLayout(config)'));
 assert.ok(js.includes('renderLoadLayout();'));
});

test('Motor recommendation UI has functional controls and attached module',()=>{
 for(const id of ['recommendRun','recommendVoltage','recommendReserve','recommendResults'])
  assert.ok(html.includes('id="'+id+'"'));
 assert.ok(js.includes('recommendMotors(motors'));
 assert.ok(sw.includes('drive-recommender.js'));
});

test('Drive selection separates recommendation and manual selection',()=>{
 assert.ok(html.includes('class="drive-workflow"'));
 assert.ok(html.includes('class="drive-manual"'));
 assert.ok(html.includes('id="recommendRpm"'));
 assert.ok(html.includes('id="recommendTorque"'));
 assert.ok(html.includes('id="recommendPeak"'));
 assert.ok(html.includes('id="driveModeDirect"'));
 assert.ok(html.includes('id="driveModeSuggest"'));
 assert.ok(js.includes('setDriveSelectionMode('));
 assert.ok(js.includes('recommend-metrics'));
});
