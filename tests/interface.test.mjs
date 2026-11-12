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
 assert.match(html,/app\.js\?v=2\.3/);
 assert.match(html,/styles\.css\?v=2\.3/);
 assert.match(sw,/ftf-rechner-v2\.3/);
});

test('Warnings are reserved for real threshold violations; generic notes collapse',()=>{
 assert.ok(html.includes('id="calculationNotes"'));
 assert.ok(html.includes('id="calculationNoteList"'));
 assert.ok(js.includes("const critical=/überschritten"));
 assert.ok(js.includes("warningsBox.hidden=warningsBox.childElementCount===0"));
});
