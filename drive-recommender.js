import {combinationStatus} from './compatibility.js';
/** Überschlägige Vorauswahl mit Hersteller-Baukastennachweis, keine technische Freigabe. */
export function recommendDrives(input,motors,gears,{voltage=48,reserve=20}={}){
 const n=key=>Number(input[key]),mass=n('unloaded')+n('payload'),r=n('wheel')/2000,z=n('drives');
 const speed=n('speed'),accel=n('accel'),roll=n('roll'),slope=n('slope');
 const start=Number(input.startFactor??1),reverseEta=Number(input.reverseEta??.8);
 if(![mass,r,z,speed,accel,roll,slope,start,reverseEta,voltage,reserve].every(Number.isFinite)||
 mass<=0||r<=0||!Number.isInteger(z)||z<1||speed<=0||accel<=0||roll<0||start<1||Math.abs(slope)>100||reverseEta<=0||reverseEta>1||
 ![12,24,48,60,110,325].includes(Number(voltage))||reserve<0||reserve>200)
 return {error:'Fahrdaten, Betriebsspannung oder Reserve ungültig. Positive Geschwindigkeit/Beschleunigung und Reserve 0–200 % erforderlich.'};
 const theta=Math.atan(slope/100),resist=mass*9.81*(Math.cos(theta)*roll+Math.sin(theta));
 const force=Math.max(0,mass*accel*start+resist);
 const wheelAccel=force*r/z;
 const wheelContinuous=Math.max(0,resist*r/z);
 const factor=1+reserve/100,candidates=[];
 let documented=0,fullySpecified=0;
 for(const motor of motors){
  if(Number(motor.voltage)!==Number(voltage)||motor.preliminary)continue;
  const nominal=Number(motor.nom),peak=Number(motor.peak),rpm=Number(motor.rpm),J=Number(motor.J);
  if(![nominal,peak,rpm,J].every(Number.isFinite)||[nominal,peak,rpm].some(v=>v<=0)||J<0)continue;
  for(const gear of gears){
   const status=combinationStatus(motor,gear);
   if(status.level!=='family-listed'||gear.preliminary)continue;
   documented++;
   const ratio=Number(gear.ratio),eta=Number(gear.eta),cont=Number(gear.cont),gearPeak=Number(gear.peak);
   if(![ratio,eta,cont,gearPeak].every(Number.isFinite)||ratio<=0||eta<=0||eta>1||cont<=0||gearPeak<=0)continue;
   fullySpecified++;
   const requiredRpm=speed*60*ratio/(2*Math.PI*r);
   const rotorMoment=J*1e-7*(accel/r)*ratio;
   const requiredMotor=wheelAccel/(ratio*eta)+rotorMoment;
   const requiredContinuous=wheelContinuous/(ratio*eta);
   if(requiredRpm>rpm||requiredMotor*factor>nominal||requiredMotor*factor>peak||
      requiredContinuous*factor>nominal||wheelAccel*factor>gearPeak||wheelContinuous*factor>cont)continue;
   const margin=Math.min(nominal/(requiredMotor||1e-12),gearPeak/(wheelAccel||1e-12),cont/(wheelContinuous||1e-12));
   candidates.push({motorId:motor.id,gearId:gear.id,motorName:motor.name,gearName:gear.name,
    requiredRpm,requiredMotor,requiredContinuous,wheelAccel,wheelContinuous,
    nominal,rpm,gearPeak,cont,margin,status:status.label,source:status.source||motor.source||gear.source});
  }
 }
 candidates.sort((a,b)=>a.nominal-b.nominal||a.margin-b.margin||a.requiredRpm-b.requiredRpm||a.motorName.localeCompare(b.motorName));
 return {candidates:candidates.slice(0,12),total:candidates.length,documented,fullySpecified,
  note:'Motor-Nennmoment wird konservativ gegen den Anfahrbedarf inkl. Reserve verglichen; Getriebe-Dauermoment gegen stationäre Steigungs-/Rollbelastung. Kein Nachweis für thermisches Lastkollektiv, Bremsen, Radhaftung, Flansch, Spannung unter Last oder Herstellerfreigabe.'};
}
