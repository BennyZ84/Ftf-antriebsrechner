// Geometrische Kipp-Vorausprüfung anhand der Eingaben des Excel-Blatts "Standfestigkeit".
// ACHTUNG: Nicht die komplette Excel-Feder- und Kippachsenrechnung; keine Sicherheitsfreigabe.
export const stabilityDefaults=Object.freeze({
 supportCount:3,radAx:1790,radAy:188,radBx:2000,radBy:1490,radCx:1000,radCy:1200,
 ftfCogX:980,ftfCogY:500,ftfCogZ:500,loadCogX:500,loadCogY:500,loadCogZ:800,
 lateralSlopeDegrees:2,externalForceN:0,externalForceHeight:1000,stabilityRadius:1500
});
const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
function hull(points){
 const ordered=[...points].sort((a,b)=>a.x-b.x||a.y-b.y);
 const lower=[],upper=[];
 for(const p of ordered){while(lower.length>=2 && cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();lower.push(p);}
 for(const p of [...ordered].reverse()){while(upper.length>=2 && cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();upper.push(p);}
 lower.pop();upper.pop();return lower.concat(upper);
}
export function calculateStability(c){
 const keys=['unloaded','payload','radAx','radAy','radBx','radBy','radCx','radCy','ftfCogX','ftfCogY','ftfCogZ','loadCogX','loadCogY','loadCogZ','lateralSlopeDegrees','externalForceN','externalForceHeight','stabilityRadius','curveSpeed'];
 if(keys.some(k=>!Number.isFinite(c[k])))return {error:'Ungültige Standfestigkeits-Eingabe'};
 if(c.unloaded<=0||c.payload<0||![3,4].includes(c.supportCount)||c.ftfCogZ<0||c.loadCogZ<0||Math.abs(c.lateralSlopeDegrees)>=45||c.externalForceN<0||c.externalForceHeight<0||c.stabilityRadius<0||c.curveSpeed<0)return {error:'Unzulässige Massen, Auflagepunkte oder Stabilitätsparameter'};
 const masses=c.unloaded+c.payload;
 const cg={
  x:(c.unloaded*c.ftfCogX+c.payload*c.loadCogX)/masses,
  y:(c.unloaded*c.ftfCogY+c.payload*c.loadCogY)/masses,
  z:(c.unloaded*c.ftfCogZ+c.payload*c.loadCogZ)/masses
 };
 const support=[{x:0,y:0},{x:c.radAx,y:c.radAy},{x:c.radBx,y:c.radBy}];
 if(c.supportCount===4)support.push({x:c.radCx,y:c.radCy});
 const poly=hull(support);
 if(poly.length!==c.supportCount)return {error:'Auflagepunkte liegen auf einer Geraden oder sind nicht alle Eckpunkte der Stützfläche'};
 const margins=poly.map((a,i)=>{
  const b=poly[(i+1)%poly.length],edge=Math.hypot(b.x-a.x,b.y-a.y);
  return {edge:(i+1),distance:cross(a,b,cg)/edge};
 });
 const staticMargin=Math.min(...margins.map(x=>x.distance));
 // Konservativer Worst-Case in beliebiger horizontaler Richtung; Werte in mm.
 const gradeShift=cg.z*Math.tan(Math.abs(c.lateralSlopeDegrees)*Math.PI/180);
 const aCurve=c.stabilityRadius>0?c.curveSpeed*c.curveSpeed/(c.stabilityRadius/1000):0;
 const curveShift=cg.z*aCurve/9.81;
 const externalShift=c.externalForceN*c.externalForceHeight/(masses*9.81);
 const reserve=staticMargin-gradeShift-curveShift-externalShift;
 const warnings=[];
 if(staticMargin<=0)warnings.push('Schwerpunktprojektion liegt außerhalb der Stützfläche.');
 if(reserve<=0)warnings.push('Unter Worst-Case-Zuschlägen ergibt sich kein positiver geometrischer Kippabstand.');
 warnings.push('Gefederte Antriebe, dynamische Achslasten, Bremsmomente und tatsächliche Kippachsen sind nicht vollständig modelliert.');
 return {cg,points:poly,margins,staticMargin,gradeShift,curveShift,externalShift,reserve,stableUnderModel:reserve>0,warnings,
 source:'Excel Standfestigkeit: Radkoordinaten, SP-Koordinaten, Seitenneigung, externe Kraft und Kurvengeschwindigkeit; eigene geometrische Vorausprüfung, kein Excel-Formelgleichheitsnachweis.'};
}
