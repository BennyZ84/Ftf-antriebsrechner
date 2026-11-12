// Excel "Trägheitsmoment" und "Energieauslegung BAT": separat prüfbare Vorauslegungsmodelle.
// Keine Bestätigung von Kippsicherheit, Zellchemie, Ladefreigabe oder Wirkungsgraden.
export const auxiliaryDefaults=Object.freeze({
 ftfWidth:1600,ftfLength:620,loadWidth:500,loadLength:500,ftfAxisOffset:150,loadAxisOffset:250,
 systemVoltage:48,batteryVoltage:24,batteryAh:21,batteryCount:4,usableCapacity:80,
 routeLength:100,routeSpeed:0.5,loadedFraction:0.5,tripsPerDay:10,
 controlPower:200,routeOperatingHours:8,routeStops:1,
 conveyorPower:0,conveyorSecondsPerTrip:0,chargingEfficiency:0.9
});
function finitePositive(v,allowZero=false){return Number.isFinite(v)&&(allowZero?v>=0:v>0);}
export function calculateInertia(c){
 const required=['unloaded','payload','ftfWidth','ftfLength','loadWidth','loadLength','ftfAxisOffset','loadAxisOffset'];
 if(required.some(k=>!finitePositive(c[k],['payload','ftfAxisOffset','loadAxisOffset'].includes(k))))
  return {error:'Ungültige Abmessungen, Masse oder Achsversätze'};
 const rectangle=(m,b,l)=>m*((b/1000)**2+(l/1000)**2)/12;
 const ftfCenter=rectangle(c.unloaded,c.ftfWidth,c.ftfLength);
 const loadCenter=rectangle(c.payload,c.loadWidth,c.loadLength);
 const ftfAxis=ftfCenter+c.unloaded*(c.ftfAxisOffset/1000)**2;
 const loadAxis=loadCenter+c.payload*(c.loadAxisOffset/1000)**2;
 return {ftfCenter,loadCenter,ftfAxis,loadAxis,total:ftfAxis+loadAxis,
 source:'Rechteckannahme + Satz von Steiner. Achsversatz als radialer Abstand.'};
}
export function calculateBattery(c){
 const required=['unloaded','payload','systemVoltage','batteryVoltage','batteryAh','batteryCount','usableCapacity','routeLength','routeSpeed','loadedFraction','tripsPerDay','controlPower','routeOperatingHours','routeStops','conveyorPower','conveyorSecondsPerTrip','chargingEfficiency','roll','eta','slope'];
 if(required.some(k=>!Number.isFinite(c[k])))return {error:'Ungültige Batterie- oder Fahrkurswerte'};
 if(c.systemVoltage<=0||c.batteryVoltage<=0||c.batteryAh<=0||!Number.isInteger(c.batteryCount)||c.batteryCount<1||c.usableCapacity<=0||c.usableCapacity>100||c.routeLength<0||c.routeSpeed<=0||c.loadedFraction<0||c.loadedFraction>1||!Number.isInteger(c.tripsPerDay)||c.tripsPerDay<0||c.tripsPerDay>100000||c.controlPower<0||c.routeOperatingHours<0||c.routeOperatingHours>24||!Number.isInteger(c.routeStops)||c.routeStops<0||c.conveyorPower<0||c.conveyorSecondsPerTrip<0||c.chargingEfficiency<=0||c.chargingEfficiency>1||c.roll<0||c.eta<=0||c.eta>1||Math.abs(c.slope)>100)
  return {error:'Batterie- oder Fahrkurswerte außerhalb zulässiger Bereiche'};
 const series=c.systemVoltage/c.batteryVoltage;
 const parallel=c.batteryCount/series;
 if(Math.abs(series-Math.round(series))>1e-8||Math.abs(parallel-Math.round(parallel))>1e-8)
  return {error:'Anzahl und Nennspannungen passen nicht zu einer ganzzahligen Reihen-/Parallelschaltung'};
 const totalAh=parallel*c.batteryAh;
 const nominalWh=c.batteryCount*c.batteryVoltage*c.batteryAh;
 const usableWh=nominalWh*c.usableCapacity/100;
 const mLoaded=c.unloaded+c.payload,mEmpty=c.unloaded;
 const angle=Math.atan(c.slope/100);
 const grade=(m)=>m*9.81*(c.roll*Math.cos(angle)+Math.sin(angle));
 // Elektrische Antriebsenergie für eine Streckenfahrt; Rückspeisung wird nicht angerechnet.
 const steadyLoaded=Math.max(0,grade(mLoaded)*c.routeLength/c.eta/3600);
 const steadyEmpty=Math.max(0,grade(mEmpty)*c.routeLength/c.eta/3600);
 const accelerationLoaded=0.5*mLoaded*c.routeSpeed*c.routeSpeed/c.eta/3600*c.routeStops;
 const accelerationEmpty=0.5*mEmpty*c.routeSpeed*c.routeSpeed/c.eta/3600*c.routeStops;
 const drivePerTrip=c.loadedFraction*(steadyLoaded+accelerationLoaded)+(1-c.loadedFraction)*(steadyEmpty+accelerationEmpty);
 const tripTime=c.routeLength/c.routeSpeed+c.conveyorSecondsPerTrip;
 const occupiedHours=tripTime*c.tripsPerDay/3600;
 const conveyorWh=c.conveyorPower*c.conveyorSecondsPerTrip*c.tripsPerDay/3600;
 const driveWh=drivePerTrip*c.tripsPerDay;
 const controlWh=c.controlPower*c.routeOperatingHours;
 const dailyWh=driveWh+conveyorWh+controlWh;
 const totalChargeWh=dailyWh/c.chargingEfficiency;
 const warnings=[];
 if(occupiedHours>c.routeOperatingHours+1e-8)warnings.push('Fahrkursdauer überschreitet die eingestellten Betriebsstunden pro Tag.');
 if(dailyWh>usableWh)warnings.push('Tagesenergiebedarf überschreitet die nutzbare Batterieenergie ohne Zwischenladung.');
 if(c.slope<0)warnings.push('Bergabfahrt: Modell rechnet keine Rekuperation an und setzt negative Zugenergie auf null.');
 if(c.routeStops>0)warnings.push('Anfahrenergie pro Stopp pauschal über kinetische Energie; Rotation, Beschleunigungsprofil und Stromspitzen separat prüfen.');
 return {series,parallel,totalAh,nominalWh,usableWh,steadyLoaded,steadyEmpty,drivePerTrip,driveWh,conveyorWh,controlWh,dailyWh,totalChargeWh,occupiedHours,warnings,
 source:'Vereinfachte Fahrkursauslegung mit Energieverbrauchern, ohne Rekuperation.'};
}
