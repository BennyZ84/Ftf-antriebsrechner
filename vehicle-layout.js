// Schematische FTF-Draufsicht. Keine konstruktive Radlast-, Achs- oder Kippnachweisberechnung.
export const layoutDefaults=Object.freeze({casterCount:2,wheelSideInset:100,loadOffsetX:0,loadOffsetY:0});
export function calculateLayout(input){
 const drives=Number(input.drives),casters=Number(input.casterCount??2);
 const width=Number(input.ftfWidth??1600),length=Number(input.ftfLength??1200);
 const wheelSideInset=Number(input.wheelSideInset??100);
 if(!Number.isInteger(drives)||drives<1||drives>12||!Number.isInteger(casters)||casters<0||casters>12||
    !Number.isFinite(width)||width<=0||!Number.isFinite(length)||length<=0||
    !Number.isFinite(wheelSideInset)||wheelSideInset<0||wheelSideInset>width/2)
   return {error:"Bitte 1–12 Antriebe, 0–12 Laufräder, positive Gestellmaße und einen seitlichen Radmitten-Abstand von 0 bis zur halben Gestellbreite eingeben."};
 // Freie Räder vorn, Antriebsräder hinten; gleichmäßige schematische Teilung.
 // Koordinaten sind relativ zum Rechteck (x und y in [0,1]).
 const row=(n,kind,y)=>Array.from({length:n},(_,i)=>({
  type:kind,index:i+1,x:n===1?0.5:(wheelSideInset+(width-2*wheelSideInset)*i/(n-1))/width,y
 }));
 return {drives,casters,width,length,wheelSideInset,total:drives+casters,
  wheels:[...row(casters,"caster",0.12),...row(drives,"drive",0.88)],
  note:"Schematische Anordnung: Laufräder vorn, Antriebsräder hinten. Der Seitenabstand bezeichnet die Radmitte zur Gestellaußenkante (bei nur einem Rad mittig). Radabmessungen, Einbauraum und Radlasten sind separat zu prüfen."};
}

/** FTF/Last in mm; x positiv rechts, y positiv in Fahrtrichtung (vorne). */
export function calculateLoadLayout(input){
 const width=Number(input.ftfWidth),length=Number(input.ftfLength);
 const loadWidth=Number(input.loadWidth),loadLength=Number(input.loadLength);
 const offsetX=Number(input.loadOffsetX??0),offsetY=Number(input.loadOffsetY??0);
 if(![width,length,loadWidth,loadLength,offsetX,offsetY].every(Number.isFinite)||
    [width,length,loadWidth,loadLength].some(n=>n<=0))
  return {error:'Gestell- und Lastabmessungen müssen positiv und alle Versätze gültige Zahlen sein.'};
 const left=offsetX-loadWidth/2,right=offsetX+loadWidth/2;
 const front=offsetY+loadLength/2,rear=offsetY-loadLength/2;
 const overhangX=Math.max(0,-width/2-left,right-width/2);
 const overhangY=Math.max(0,front-length/2,-length/2-rear);
 return {width,length,loadWidth,loadLength,offsetX,offsetY,overhangX,overhangY,
  overhang:overhangX>0||overhangY>0};
}
