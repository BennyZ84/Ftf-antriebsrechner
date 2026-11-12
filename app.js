import {motors,gears,defaults,calc} from './calculator.js';
import {combinationStatus,combinationSource} from './compatibility.js';
import {auxiliaryDefaults,calculateInertia,calculateBattery} from './auxiliary.js';
import {stabilityDefaults,calculateStability} from './stability.js';
import {rollerDefaults,calculateRollerPressure} from './roller.js';
import {pendingCatalogFamilies} from './catalog-pending.js';
import {layoutDefaults,calculateLayout} from './vehicle-layout.js';
const $=id=>document.getElementById(id),clone=x=>JSON.parse(JSON.stringify(x));
const projectDefaults={...defaults,...auxiliaryDefaults,...stabilityDefaults,...rollerDefaults,...layoutDefaults};
let config=clone(projectDefaults);
const fields={
"vehicle-fields":[["unloaded","Leergewicht","kg",1],["payload","Zuladung","kg",1],["drives","Antriebe","Stück",1],["casterCount","Zusätzliche Laufräder (ohne Antrieb)","Stück",1],["wheel","Raddurchmesser","mm",1],["speed","Zielgeschwindigkeit","m/s",.01],["accel","Beschleunigung","m/s²",.01],["brake","Bremsverzögerung","m/s²",.01],["roll","Rollwiderstandsbeiwert","",.001]],
"drive-fields":[["ratio","Getriebeübersetzung i","",.01],["eta","Auslegungswirkungsgrad","",.01],["rpm","Motor-Nenndrehzahl","min⁻¹",1],["idle","Motor-Leerlaufdrehzahl","min⁻¹",1],["nom","Motor-Nennmoment","Nm",.001],["peak","Motor-Spitzenmoment","Nm",.001],["J","Rotorträgheit","g·cm²",1],["cont","Getriebe-Dauermoment","Nm",.01],["gearPeak","Getriebe-Beschleunigungsmoment","Nm",.01]],
"extended-fields":[["slope","Steigung (bergauf)","%",.1],["curveSpeed","Kurvengeschwindigkeit","m/s",.01],["positionSpeed","Positioniergeschwindigkeit","m/s",.01],["curveRadius","Kurvenradius (0=aus)","m",.01],["adhesion","Haftbeiwert (0=aus)","",.01],["drivenFraction","Anteil angetriebene Gewichtskraft","",.01],["reverseEta","Rücktriebswirkungsgrad (Annahme)","",.01],["startFactor","Anfahrfaktor","",.05],["reactionTime","Systemreaktionszeit","s",.05],["speedTolerance","Geschwindigkeitstoleranz","m/s",.01],["brakeSafetyFactor","Bremswegfaktor","",.05],["scannerTolerance","Scanner-Toleranz TR","mm",1],["clearanceAllowance","Bodenfreiheit-Zuschlag ZF","mm",1],["reflectionAllowance","Reflexions-Zuschlag ZR","mm",1]],
"inertia-fields":[["ftfWidth","Breite FTF","mm",1],["ftfLength","Länge FTF","mm",1],["loadWidth","Breite Zuladung","mm",1],["loadLength","Länge Zuladung","mm",1],["ftfAxisOffset","Abstand FTF-SP zur Drehachse","mm",1],["loadAxisOffset","Abstand Last-SP zur Drehachse","mm",1]],
"stability-fields":[["supportCount","Anzahl Auflagepunkte (3 oder 4)","",1],["radAx","Rad A – x","mm",1],["radAy","Rad A – y","mm",1],["radBx","Rad B – x","mm",1],["radBy","Rad B – y","mm",1],["radCx","Rad C – x","mm",1],["radCy","Rad C – y","mm",1],["ftfCogX","FTF-Schwerpunkt x","mm",1],["ftfCogY","FTF-Schwerpunkt y","mm",1],["ftfCogZ","FTF-Schwerpunkt z","mm",1],["loadCogX","Last-Schwerpunkt x","mm",1],["loadCogY","Last-Schwerpunkt y","mm",1],["loadCogZ","Last-Schwerpunkt z","mm",1],["lateralSlopeDegrees","Seitliche Bodenneigung","°",.1],["externalForceN","Externe Horizontalkraft","N",1],["externalForceHeight","Angriffshöhe externe Kraft","mm",1],["stabilityRadius","Kurvenradius Stabilität","mm",1]],
"roller-fields":[["rollerLoadKg","Last je Rolle","kg",1],["rollerDiameter","Rollendurchmesser","mm",1],["rollerWidth","Rollenbreite","mm",1],["concreteModulus","E-Modul Beton","N/mm²",1],["paModulus","E-Modul PA6","N/mm²",1],["puModulus","E-Modul PU","N/mm²",1],["rollerPoisson","Querkontraktionszahl","",.01],["gravity","Erdbeschleunigung","m/s²",.01]],
"battery-fields":[["systemVoltage","Systemspannung","V",1],["batteryVoltage","Batterie-Nennspannung","V",1],["batteryAh","Kapazität je Batterie","Ah",.1],["batteryCount","Batterieanzahl","Stück",1],["usableCapacity","Nutzbare Kapazität","%",1],["routeLength","Weglänge je Fahrkurs","m",1],["routeSpeed","Fahrgeschwindigkeit im Kurs","m/s",.01],["loadedFraction","Beladenanteil (0–1)","",.05],["tripsPerDay","Fahrkurse pro Tag","Stück",1],["routeOperatingHours","Betriebszeit pro Tag","h",.5],["routeStops","Anfahrvorgänge pro Fahrkurs","Stück",1],["controlPower","Steuerungsverbrauch","W",1],["conveyorPower","Fördertechnik-Verbrauch","W",1],["conveyorSecondsPerTrip","Fördertechnik je Fahrkurs","s",1],["chargingEfficiency","Ladewirkungsgrad (0–1)","",.01]]
};
const key='ftf-antriebsrechner-projects-v1';
let projects=[];
try {projects=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(projects))projects=[];}catch{}
const fmt=(n,d=2)=>n==null||!Number.isFinite(n)?'–':n.toLocaleString('de-DE',{maximumFractionDigits:d,minimumFractionDigits:d});
function toast(msg){$('toast').textContent=msg;$('toast').hidden=false;setTimeout(()=>$('toast').hidden=true,2800);}
function store(){try{localStorage.setItem(key,JSON.stringify(projects));}catch{toast('Speicher voll oder Browserdaten nicht verfügbar');}}
function setupFields(){
for(const [id,list] of Object.entries(fields)){
$(id).innerHTML='';
for(const [k,name,unit,step] of list){
const label=document.createElement('label');label.className='field';label.htmlFor='field-'+k;
const span=document.createElement('span');span.textContent=name;
const wrap=document.createElement('span');wrap.className='value';
const input=document.createElement('input');input.id='field-'+k;input.type='number';input.step=String(step);input.inputMode='decimal';input.value=String(config[k]);input.addEventListener('input',()=>{
if(input.value==='')return;config[k]=Number(input.value);refresh();});
wrap.append(input);if(unit){const u=document.createElement('small');u.textContent=unit;wrap.append(u);}
label.append(span,wrap);$(id).append(label);
}}}
function syncFields(){for(const k of Object.keys(config)){const input=$('field-'+k);if(input&&document.activeElement!==input)input.value=String(config[k]);}$('projectName').value=config.projectName;$('motorSelect').value=config.motorId;$('gearboxSelect').value=config.gearId;setNotes();}
function renderMotorSpecs(){
 const motor=motors.find(x=>x.id===config.motorId);
 const grid=$('motorSpecGrid');grid.replaceChildren();
 if(!motor){$('motorSpecVariant').textContent='Kein Motor gewählt';$('motorSpecNote').textContent='';$('motorSpecSource').hidden=true;return;}
 $('motorSpecVariant').textContent=motor.name+(motor.preliminary?' · Daten vorläufig':'');
 const isThermal=Number.isFinite(motor.nomThermallyConnected);
 const specs=[
  ['Nennspannung',motor.voltage,'V',0],
  [isThermal?'Nenndrehzahl (isoliert)':'Nenndrehzahl',motor.rpm,'min⁻¹',0],
  ['Leerlaufdrehzahl',motor.idle,'min⁻¹',0],
  [isThermal?'Nennmoment (isoliert)':'Nenndrehmoment',motor.nom,'Nm',3],
  ['Max. Drehmoment',motor.peak>0?motor.peak:null,'Nm',3],
  ['Rotorträgheit',motor.J,'g·cm²',1]
 ];
 if(Number.isFinite(motor.stallTorque))specs.push(['Anhaltemoment (nicht Spitzenmoment)',motor.stallTorque,'Nm',4]);
 if(isThermal){
  specs.push(['Nennmoment (thermisch angebunden)',motor.nomThermallyConnected,'Nm',3]);
  specs.push(['Nenndrehzahl (thermisch angebunden)',motor.rpmThermallyConnected,'min⁻¹',0]);
 }
 for(const [label,value,unit,digits] of specs){
  const card=document.createElement('div');card.className='motor-spec';
  const title=document.createElement('span');title.textContent=label;
  const data=document.createElement('strong');data.textContent=value==null?'Nicht angegeben':fmt(value,digits)+' '+unit;
  card.append(title,data);grid.append(card);
 }
 $('motorSpecNote').textContent=motor.note||'Katalogwerte: Verwendungsgrenzen und Herstellerangaben prüfen.';
 const link=$('motorSpecSource');link.hidden=!motor.source;
 if(motor.source)link.href=motor.source;else link.removeAttribute('href');
}
function updateMode(){
 const motorOnly=config.mode==='motor';
 document.body.classList.toggle('motor-only',motorOnly);
 $('modeMotor').className=motorOnly?'primary':'neutral';
 $('modeFTF').className=motorOnly?'neutral':'primary';
 $('modeMotor').setAttribute('aria-pressed',String(motorOnly));
 $('modeFTF').setAttribute('aria-pressed',String(!motorOnly));
 $('vehiclePanel').hidden=motorOnly;
 $('gearSection').hidden=motorOnly;
 $('drive-fields').hidden=motorOnly;
 $('extendedPanel').hidden=motorOnly;
 $('inertiaPanel').hidden=motorOnly;
 $('batteryPanel').hidden=motorOnly;
 $('stabilityPanel').hidden=motorOnly;
 $('rollerPanel').hidden=motorOnly;
 $('resultActions').hidden=motorOnly;
 $('motorPanelTitle').textContent=motorOnly?'Motordaten':'Motor & Getriebe';
 $('motorSpecs').hidden=!motorOnly;
 const layoutTab=document.querySelector('[data-tab="ansicht"]');
 layoutTab.hidden=motorOnly;
 const resultTab=document.querySelector('[data-tab="ergebnisse"]');
 resultTab.hidden=motorOnly;
 if(motorOnly && (resultTab.classList.contains('active')||layoutTab.classList.contains('active')))tab('eingaben');
}
function setNotes(){
 const m=motors.find(x=>x.id===config.motorId),g=gears.find(x=>x.id===config.gearId);
 $('gearboxNote').textContent=g?.note||'Keine Getriebedaten vorhanden.';
 const s=combinationStatus(m,g);
 const el=$('combinationStatus');
 el.className='compatibility '+s.level;
 el.textContent=s.label;
 const link=$('combinationSource');
 link.href=s.source||combinationSource;
}
function render(){
const data=calc(config);$('error').hidden=!data.error;
$('error').textContent=data.error||'';
if(data.error){$('kpis').replaceChildren();$('results').replaceChildren();$('warnings').replaceChildren();$('warnings').hidden=true;$('calculationNoteList').replaceChildren();$('calculationNotes').hidden=true;return;}
$('kpis').innerHTML=[['Gesamtgewicht',fmt(data.metrics.mass,0)+' kg'],['Motordrehzahl',fmt(data.metrics.rpm,0)+' min⁻¹'],['Radmoment',fmt(data.metrics.wheel)+' Nm'],['Motormoment',fmt(data.metrics.motor,3)+' Nm'],['Bremsweg',fmt(data.metrics.brakeDist)+' m']].map(x=>'<article class="kpi"><span>'+x[0]+'</span><strong>'+x[1]+'</strong></article>').join('');
// Only actionable limit violations are shown directly; general assumptions are collapsible.
const warningsBox=$('warnings'), notesBox=$('calculationNoteList'), notes=$('calculationNotes');
warningsBox.replaceChildren();notesBox.replaceChildren();
const selectedMotor=motors.find(x=>x.id===config.motorId);
const selectedGear=gears.find(x=>x.id===config.gearId);
const comp=combinationStatus(selectedMotor,selectedGear);
const info=[];
if(selectedMotor?.preliminary){
 const alert=document.createElement('p');
 alert.textContent='⚠ Vorläufige Motordaten – keine belastbare Auslegungsfreigabe. Herstellerbestätigung erforderlich.';
 warningsBox.append(alert);
}

if(selectedGear?.preliminary){
 const alert=document.createElement('p');
 alert.textContent='⚠ Vorläufige Getriebedaten – keine belastbare Auslegungsfreigabe. Herstellerbestätigung erforderlich.';
 warningsBox.append(alert);
}
if(comp.level!=='family-listed')info.push('Kombination nicht bestätigt: '+comp.reason);
else info.push(comp.source?'Herstellerkombination dokumentiert; Betriebsbedingungen separat prüfen.':'Getriebebaureihe im Herstellerbaukasten aufgeführt; konkrete Ausführung separat prüfen.');
const critical=/überschritten|nicht erreichen|reicht im Modell nicht|über Motornennwert|Negatives geregeltes Bremsmoment|Unvollständig/i;
for(const warning of data.warnings){
 if(critical.test(warning)){
  const p=document.createElement('p');p.textContent='⚠ '+warning;warningsBox.append(p);
 }else info.push(warning);
}
warningsBox.hidden=warningsBox.childElementCount===0;
for(const message of [...new Set(info)]){
 const p=document.createElement('p');p.textContent=message;notesBox.append(p);
}
notes.hidden=notesBox.childElementCount===0;
$('results').replaceChildren();
renderAdditionalResults();
for(const [name,val,unit,formula] of data.results){const article=document.createElement('article');article.className='result';const info=document.createElement('div');const heading=document.createElement('strong');heading.textContent=name;const f=document.createElement('small');f.textContent=formula;info.append(heading,f);const value=document.createElement('b');value.textContent=fmt(val,unit==='min⁻¹'||unit==='kg'?0:unit==='%'?1:unit==='Nm'?3:2)+' '+unit;article.append(info,value);$('results').append(article);}
}
function renderRouteSegments(){
 const box=$('routeSegments');if(!box)return;
 box.replaceChildren();
 const values=Array.isArray(config.routeSegments)?config.routeSegments:[];
 $('routeModeNote').textContent=values.length
  ? values.length+' Fahrkursabschnitt(e) aktiv – die pauschalen Strecken-, Geschwindigkeits- und Stoppwerte werden für die Energiebilanz ersetzt.'
  : 'Ohne Abschnitte gelten die pauschalen Kurswerte oben.';
 const props=[
  ['distance','Strecke','m',1],['speed','Tempo','m/s',.01],
  ['loadFactor','Lastanteil (0–1)','',.05],['stops','Stopps','',1],
  ['dwellSeconds','Warten','s',1],['conveyorSeconds','Fördertechnik','s',1]
 ];
 values.forEach((segment,index)=>{
  const card=document.createElement('div');card.className='route-segment';
  const head=document.createElement('div');head.className='route-segment-head';
  const heading=document.createElement('strong');heading.textContent='Abschnitt '+(index+1);
  const del=document.createElement('button');del.className='neutral';del.type='button';del.textContent='Entfernen';
  del.addEventListener('click',()=>{config.routeSegments.splice(index,1);renderRouteSegments();renderAdditionalResults();});
  head.append(heading,del);card.append(head);
  const fields=document.createElement('div');fields.className='form-grid';
  for(const [prop,label,unit,step] of props){
   const wrap=document.createElement('label');wrap.className='field';
   const title=document.createElement('span');title.textContent=label;
   const sub=document.createElement('span');sub.className='value';
   const input=document.createElement('input');input.type='number';input.inputMode='decimal';input.step=String(step);input.value=String(segment[prop]??0);
   input.addEventListener('input',()=>{
    if(input.value==='')return;
    config.routeSegments[index][prop]=Number(input.value);
    renderAdditionalResults();
   });
   sub.append(input);if(unit){const suffix=document.createElement('small');suffix.textContent=unit;sub.append(suffix);}
   wrap.append(title,sub);fields.append(wrap);
  }
  card.append(fields);box.append(card);
 });
}
function renderAdditionalResults(){
 const inertia=calculateInertia(config),battery=calculateBattery(config),stability=calculateStability(config),roller=calculateRollerPressure(config);
 const inertiaBox=$('inertiaResults'),batteryBox=$('batteryResults'),stabilityBox=$('stabilityResults'),rollerBox=$('rollerResults');
 inertiaBox.replaceChildren();batteryBox.replaceChildren();stabilityBox.replaceChildren();rollerBox.replaceChildren();
 const add=(box,label,value,unit,digits=2)=>{
  const line=document.createElement('div');line.className='aux-result';
  const title=document.createElement('span');title.textContent=label;
  const number=document.createElement('strong');number.textContent=fmt(value,digits)+' '+unit;
  line.append(title,number);box.append(line);
 };
 if(inertia.error)inertiaBox.textContent=inertia.error;
 else{
  add(inertiaBox,'Trägheitsmoment FTF (Schwerpunkt)',inertia.ftfCenter,'kg·m²');
  add(inertiaBox,'Trägheitsmoment Last (Schwerpunkt)',inertia.loadCenter,'kg·m²');
  add(inertiaBox,'Trägheitsmoment FTF (Drehachse)',inertia.ftfAxis,'kg·m²');
  add(inertiaBox,'Trägheitsmoment Last (Drehachse)',inertia.loadAxis,'kg·m²');
  add(inertiaBox,'Gesamt um Drehachse',inertia.total,'kg·m²');
 }
 if(roller.error)rollerBox.textContent=roller.error;
 else{
  add(rollerBox,'Rollenlast',roller.force,'N',1);
  add(rollerBox,'Kombinierter E-Modul PA/Beton',roller.combinedPA,'N/mm²',1);
  add(rollerBox,'Kombinierter E-Modul PU/Beton',roller.combinedPU,'N/mm²',1);
  add(rollerBox,'Kontaktpressung PA6',roller.pressurePA,'N/mm²',2);
  add(rollerBox,'Kontaktpressung PU',roller.pressurePU,'N/mm²',2);
  for(const msg of roller.warnings){const el=document.createElement('p');el.className='aux-warning';el.textContent='Hinweis: '+msg;rollerBox.append(el);}
 }
 if(stability.error)stabilityBox.textContent=stability.error;
 else{
  add(stabilityBox,'Schwerpunktprojektion x',stability.cg.x,'mm',1);
  add(stabilityBox,'Schwerpunktprojektion y',stability.cg.y,'mm',1);
  add(stabilityBox,'Schwerpunkthöhe',stability.cg.z,'mm',1);
  add(stabilityBox,'Statischer Mindest-Kippabstand',stability.staticMargin,'mm',1);
  add(stabilityBox,'Zuschlag Seitenneigung',stability.gradeShift,'mm',1);
  add(stabilityBox,'Zuschlag Kurvenfahrt',stability.curveShift,'mm',1);
  add(stabilityBox,'Zuschlag externe Kraft',stability.externalShift,'mm',1);
  add(stabilityBox,'Verbleibender geometrischer Abstand',stability.reserve,'mm',1);
  for(const msg of stability.warnings){const warn=document.createElement('p');warn.className='aux-warning';warn.textContent='⚠ '+msg;stabilityBox.append(warn);}
 }
 if(battery.error)batteryBox.textContent=battery.error;
 else{
  add(batteryBox,'Reihen-/Parallelzweige',battery.series,'S',0);
  add(batteryBox,'Parallelzweige',battery.parallel,'P',0);
  add(batteryBox,'Batteriesystem',battery.totalAh,'Ah',1);
  add(batteryBox,'Nominale Batterieenergie',battery.nominalWh,'Wh',1);
  add(batteryBox,'Nutzbare Batterieenergie',battery.usableWh,'Wh',1);
  add(batteryBox,'Fahrenergie pro Tag',battery.driveWh,'Wh',1);
  add(batteryBox,'Steuerungsenergie pro Tag',battery.controlWh,'Wh',1);
  add(batteryBox,'Fördertechnikenergie pro Tag',battery.conveyorWh,'Wh',1);
  add(batteryBox,'Gesamter Tagesenergiebedarf',battery.dailyWh,'Wh',1);
  add(batteryBox,'Netzenergie inkl. Ladeverlust',battery.totalChargeWh,'Wh',1);
  add(batteryBox,'Fahrkurs-Belegungszeit',battery.occupiedHours,'h',2);
  for(const msg of battery.warnings){
   const warn=document.createElement('p');warn.className='aux-warning';warn.textContent='⚠ '+msg;batteryBox.append(warn);
  }
 }
}
function renderVehicleLayout(){
 const model=calculateLayout(config);
 const svg=$('vehicleSvg'),stats=$('vehicleLayoutStats'),note=$('vehicleLayoutNote');
 svg.replaceChildren();stats.replaceChildren();
 note.textContent=model.error||model.note;
 if(model.error)return;
 const NS='http://www.w3.org/2000/svg';
 const el=(tag,attrs={},parent=svg)=>{
  const node=document.createElementNS(NS,tag);
  for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));
  parent.append(node);return node;
 };
 const txt=(value,x,y,attrs={})=>{
  const t=el('text',{x,y,'text-anchor':'middle',fill:'#28425b','font-family':'system-ui, sans-serif','font-size':13,...attrs});
  t.textContent=value;return t;
 };
 // Innere Fläche 96..504 x 78..418, unabhängig vom Maßstabsverhältnis:
 // Gestell wird maßstabsgetreu mit Breite/Länge maximal in die Fläche eingepasst.
 const span=400;
 const k=Math.min(span/model.width,310/model.length);
 const w=model.width*k,h=model.length*k;
 const x=300-w/2,y=250-h/2;
 svg.setAttribute('viewBox','0 0 600 510');
 svg.setAttribute('role','img');
 svg.setAttribute('aria-label',`FTF-Draufsicht mit ${model.drives} Antriebsrädern hinten und ${model.casters} Laufrädern vorn`);
 el('rect',{x:0,y:0,width:600,height:510,rx:22,fill:'#f4f8fc'});
 // Fahrtrichtung (von oben nach unten ist hinten).
 el('path',{d:'M 300 46 L 300 16 M 291 27 L 300 16 L 309 27',fill:'none',stroke:'#267fa0','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'});
 txt('VORNE · FAHRTRICHTUNG',300,64,{'font-size':12,'font-weight':650,fill:'#236d88'});
 el('rect',{x,y,width:w,height:h,rx:12,fill:'#e4edf5',stroke:'#3a5972','stroke-width':3});
 el('rect',{x:x+12,y:y+12,width:Math.max(0,w-24),height:Math.max(0,h-24),rx:7,fill:'none',stroke:'#8ba6b7','stroke-width':1.5,'stroke-dasharray':'6 5'});
 // Typkennzeichnung durch Farbe/Form: Antrieb und freie Räder sind getrennt.
 const tyreWidth=Math.min(31,Math.max(12,w/(model.drives+model.casters+3)));
 const tyreHeight=48;
 for(const wheel of model.wheels){
  const cx=x+w*wheel.x,cy=y+h*wheel.y;
  const isDrive=wheel.type==='drive',fill=isDrive?'#247c9c':'#9eacba';
  const group=el('g');
  el('rect',{x:cx-tyreWidth/2,y:cy-tyreHeight/2,width:tyreWidth,height:tyreHeight,rx:6,
    fill,stroke:isDrive?'#15526d':'#687b8a','stroke-width':2},group);
  el('path',{d:`M ${cx-tyreWidth/2+4} ${cy-11} H ${cx+tyreWidth/2-4} M ${cx-tyreWidth/2+4} ${cy+11} H ${cx+tyreWidth/2-4}`,
    stroke:'#ffffff','stroke-opacity':.6,'stroke-width':2},group);
  if(isDrive)el('circle',{cx,cy,r:5,fill:'#e7fcff',stroke:'#1b5a79','stroke-width':1.3},group);
 }
 // Bemaßung auf der Symbolansicht. Kein Einbaunachweis.
 el('path',{d:`M ${x} ${y+h+20} H ${x+w} M ${x} ${y+h+15} V ${y+h+25} M ${x+w} ${y+h+15} V ${y+h+25}`,stroke:'#6a8596','stroke-width':1.5,fill:'none'});
 txt(`${Math.round(model.width)} mm`,300,Math.min(486,y+h+42),{'font-size':12});
 el('path',{d:`M ${x+w+20} ${y} V ${y+h} M ${x+w+15} ${y} H ${x+w+25} M ${x+w+15} ${y+h} H ${x+w+25}`,stroke:'#6a8596','stroke-width':1.5,fill:'none'});
 const len=txt(`${Math.round(model.length)} mm`,Math.min(554,x+w+43),250,{'font-size':12});
 len.setAttribute('transform',`rotate(90 ${Math.min(554,x+w+43)} 250)`);
 const details=[
  [`Antriebsräder: ${model.drives}`,'drive'],[`Laufräder: ${model.casters}`,'caster'],
  [`Räder insgesamt: ${model.total}`,'total']
 ];
 for(const [label,type] of details){
  const chip=document.createElement('span');chip.className='layout-stat '+type;chip.textContent=label;stats.append(chip);
 }
}
function refresh(){
 if(config.mode!=='motor')config.mode='ftf';
 const selected=motors.find(m=>m.id===config.motorId);
 if(selected){$('seriesSelect').value=seriesOf(selected)||'dCore';renderMotorOptions();}
 renderGearOptions();syncFields();renderMotorSpecs();updateMode();renderRouteSegments();renderVehicleLayout();render();
}
function tab(id){if((id==='ergebnisse'||id==='ansicht') && config.mode==='motor')id='eingaben';for(const b of document.querySelectorAll('[data-tab]'))b.classList.toggle('active',b.dataset.tab===id);for(const key of ['eingaben','ansicht','ergebnisse','projekte'])$('view-'+key).hidden=key!==id;if(id==='projekte')showProjects();if(id==='ergebnisse')render();}
function save(){config.projectName=$('projectName').value.trim()||'Unbenanntes FTF';const existing=projects.findIndex(x=>x.projectName===config.projectName);const item=clone(config);if(existing<0)projects.push(item);else projects[existing]=item;store();showProjects();toast('Projekt lokal gespeichert');}
function showProjects(){
const box=$('projectList');box.replaceChildren();
if(!projects.length){box.textContent='Noch keine Projekte gespeichert.';return;}
for(const p of projects){const line=document.createElement('div');line.className='project-entry';const title=document.createElement('strong');title.textContent=p.projectName+' · '+fmt(Number(p.unloaded)+Number(p.payload),0)+' kg';const load=document.createElement('button');load.className='neutral';load.textContent='Öffnen';load.addEventListener('click',()=>{config={...clone(projectDefaults),...clone(p)};refresh();tab('eingaben');toast('Projekt geladen');});const del=document.createElement('button');del.className='danger';del.textContent='Löschen';del.addEventListener('click',()=>{if(!confirm('Projekt „'+p.projectName+'“ wirklich löschen?'))return;projects=projects.filter(x=>x!==p);store();showProjects();});line.append(title,load,del);box.append(line);}}
function exportJSON(){const data=JSON.stringify({version:1,created:new Date().toISOString(),projects},null,2);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download='ftf-projekte-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
async function importJSON(file){try{const obj=JSON.parse(await file.text());if(!Array.isArray(obj.projects))throw Error('Keine Projektliste vorhanden');let imported=0;for(const p of obj.projects){if(!p||typeof p.projectName!=='string')continue;const name=p.projectName.trim();if(!name)continue;let proposed=name;let n=2;while(projects.some(x=>x.projectName===proposed))proposed=name+' (Import '+n+++')';projects.push({...clone(projectDefaults),...p,projectName:proposed});imported++;}store();showProjects();toast(imported+' Projekte importiert');}catch(e){toast('Import fehlgeschlagen: '+e.message);}}
const seriesOf=m=>m?.series||(/\bdCore\b/.test(m?.name||'')?'dCore':null);
function renderMotorOptions(){
 const box=$('motorSelect'),series=$('seriesSelect').value,selected=config.motorId;
 box.replaceChildren();
 for(const m of motors.filter(x=>seriesOf(x)===series)){
  const o=document.createElement('option');o.value=m.id;o.textContent=m.name;box.append(o);
 }
 if(motors.some(x=>x.id===selected&&seriesOf(x)===series))box.value=selected;
}
function selectMotor(id){
 const m=motors.find(x=>x.id===id);if(!m)return;
 Object.assign(config,{motorId:m.id,rpm:m.rpm,idle:m.idle,nom:m.nom,peak:m.peak,J:m.J});
 refresh();
}
function renderGearOptions(){
 const select=$('gearboxSelect');
 const m=motors.find(x=>x.id===config.motorId);
 const selected=config.gearId;
 select.replaceChildren();
 const groups=[
  {label:'Im Baukasten aufgeführt',level:'family-listed'},
  {label:'Nicht bestätigt – Vergleichsrechnung',level:'other'}
 ];
 for(const item of groups){
  const grp=document.createElement('optgroup');grp.label=item.label;
  for(const g of gears){
   const status=combinationStatus(m,g);
   if((status.level==='family-listed')!==(item.level==='family-listed'))continue;
   if(item.level==='other' && !$('showUnverified').checked && g.id!==selected)continue;
   const o=document.createElement('option');o.value=g.id;
   o.textContent=g.name+(g.preliminary?' · vorläufig':status.level==='family-listed'?' · gelistet':' · ungeprüft');
   grp.append(o);
  }
  if(grp.children.length)select.append(grp);
 }
 select.value=selected;
 // Always keep current project's choice visible; if missing, display first available documented option.
 if(select.selectedIndex<0 && select.options.length){
  const initial=select.options[0];
  select.value=initial.value;
  const gear=gears.find(x=>x.id===initial.value);
  if(gear)Object.assign(config,{gearId:gear.id,ratio:gear.ratio,eta:gear.eta,cont:gear.cont,gearPeak:gear.peak});
 }
}
function renderPendingCatalog(){
 const box=$('pendingCatalogFamilies');
 if(!box)return;
 box.replaceChildren();
 for(const family of pendingCatalogFamilies){
  const item=document.createElement('div');
  item.className='catalog-pending-item';
  const title=document.createElement('strong');
  title.textContent=family.name+' · '+family.status;
  const description=document.createElement('p');
  description.textContent=family.details+' Fehlende Auslegungsdaten: '+family.missing;
  const link=document.createElement('a');
  link.textContent='Herstellerseite';
  link.href=family.source;link.target='_blank';link.rel='noopener noreferrer';
  item.append(title,description,link);box.append(item);
 }
}
function updateCatalogSummary(){
 const out=$('catalogSummary');
 if(out)out.textContent='v3.5 · '+motors.length+' Motorvarianten · '+gears.length+' Getriebeübersetzungen · Katalog nicht vollständig';
}
function init(){
setupFields();updateCatalogSummary();renderPendingCatalog();
$('addRouteSegment').addEventListener('click',()=>{
 if(!Array.isArray(config.routeSegments))config.routeSegments=[];
 if(config.routeSegments.length>=100){toast('Maximal 100 Abschnitte');return;}
 config.routeSegments.push({distance:100,speed:0.5,loadFactor:1,stops:1,dwellSeconds:0,conveyorSeconds:0});
 renderRouteSegments();renderAdditionalResults();
});

const seriesValues=['dCore','KI','dGo','dMove','dPro'];
for(const series of seriesValues){
 const count=motors.filter(x=>seriesOf(x)===series).length;
 if(!count)continue;
 const o=document.createElement('option');o.value=series;o.textContent=series+' ('+count+' Varianten)';$('seriesSelect').append(o);
}
$('seriesSelect').value=seriesOf(motors.find(x=>x.id===config.motorId))||'dCore';
renderMotorOptions();
$('gearboxSelect').replaceChildren();renderGearOptions();
$('modeMotor').addEventListener('click',()=>{config.mode='motor';refresh();tab('eingaben');});
$('modeFTF').addEventListener('click',()=>{config.mode='ftf';refresh();});
$('seriesSelect').addEventListener('change',()=>{
 const series=$('seriesSelect').value;
 const first=motors.find(m=>seriesOf(m)===series);
 if(first)selectMotor(first.id);
});
$('motorSelect').addEventListener('change',()=>selectMotor($('motorSelect').value));
$('showUnverified').addEventListener('change',()=>{renderGearOptions();setNotes();});
$('gearboxSelect').addEventListener('change',()=>{const g=gears.find(x=>x.id===$('gearboxSelect').value);if(!g)return;Object.assign(config,{gearId:g.id,ratio:g.ratio,eta:g.eta,cont:g.cont,gearPeak:g.peak});refresh();});
$('projectName').addEventListener('input',e=>config.projectName=e.target.value);
for(const b of document.querySelectorAll('[data-tab]'))b.addEventListener('click',()=>tab(b.dataset.tab));
$('showResults').addEventListener('click',()=>tab('ergebnisse'));
$('layoutBack').addEventListener('click',()=>tab('eingaben'));
$('layoutSave').addEventListener('click',save);
$('save').addEventListener('click',save);
$('new').addEventListener('click',()=>{if(!confirm('Eingaben zurücksetzen? Gespeicherte Projekte bleiben erhalten.'))return;config=clone(projectDefaults);refresh();tab('eingaben');});
$('print').addEventListener('click',()=>window.print());
$('export').addEventListener('click',exportJSON);
$('import').addEventListener('change',async e=>{if(e.target.files?.[0])await importJSON(e.target.files[0]);e.target.value='';});
const install=$('install');let prompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;install.hidden=false;});
install.addEventListener('click',async()=>{if(prompt){await prompt.prompt();prompt=null;install.hidden=true;}else alert('Auf dem iPhone Safari öffnen → Teilen → Zum Home-Bildschirm → Als Web-App öffnen.');});
refresh();showProjects();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
init();
