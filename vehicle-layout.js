// Schematische FTF-Draufsicht. Keine konstruktive Radlast-, Achs- oder Kippnachweisberechnung.
export const layoutDefaults=Object.freeze({casterCount:2});
export function calculateLayout(input){
 const drives=Number(input.drives),casters=Number(input.casterCount??2);
 const width=Number(input.ftfWidth??1600),length=Number(input.ftfLength??1200);
 if(!Number.isInteger(drives)||drives<1||drives>12||!Number.isInteger(casters)||casters<0||casters>12||
    !Number.isFinite(width)||width<=0||!Number.isFinite(length)||length<=0)
   return {error:"Für die Ansicht sind 1–12 Antriebe, 0–12 Laufräder und positive Gestellabmessungen zulässig."};
 // Freie Räder vorn, Antriebsräder hinten; gleichmäßige schematische Teilung.
 // Koordinaten sind relativ zum Rechteck (x und y in [0,1]).
 const row=(n,kind,y)=>Array.from({length:n},(_,i)=>({
  type:kind,index:i+1,x:(i+1)/(n+1),y
 }));
 return {drives,casters,width,length,total:drives+casters,
  wheels:[...row(casters,"caster",0.12),...row(drives,"drive",0.88)],
  note:"Schematische Anordnung: Laufräder vorn, Antriebsräder hinten. Die tatsächlichen Einbaupositionen und Radlasten sind separat auszulegen."};
}
