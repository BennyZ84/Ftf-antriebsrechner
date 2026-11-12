// Quelle: Dunkermotoren Gesamtkatalog 2025/26 und spezifische BG-/PLG-Datenblätter.
// 'family-listed' bestätigt eine Kombination auf Baureihenebene, nicht eine konkrete Artikelnummer.
// Die vollständige Konfiguration muss im Dunkermotoren-Konfigurator / durch Hersteller geprüft werden.
export const combinationSource="https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/catalogues/de-and-en/1_gesamtkatalog_web.pdf?la=en&revision=be4584e4-0293-497c-bbba-99c687c6da7d";
export const listedFamilies=Object.freeze({
  bg32:[],
  bg42:[],
  bg45:[],
  bg62:["PLG 63 EP","PLG 75 EP","PLG 75 HT"],
  bg65:["PLG 63 EP","PLG 75 EP"],
  bg66:["PLG 63 EP","PLG 63 HT","PLG 75 HT"],
  bg75:["PLG 63 EP","PLG 75 EP","PLG 75 HT","PLG 80 LB"],
  bg95:["PLG 75 EP","PLG 75 HT","PLG 95 HT","PLG 80 LB"]
});
export const catalogScope=Object.freeze({
 motorFamilies:"BG32/BG42/BG45/BG62/BG65/BG66/BG75/BG95 dCore; BG66/BG75 dMove CO/IO, BG75 dPro CO/IO und BG66 dPro PN/EC/EI",
 gearFamilies:"NG250/NG500; PLG40 LB, PLG52 EB/HT, PLG60 LN/LB, PLG63 EP/HT, PLG75 EP/HT/SL, PLG80 LB, PLG95 HT; STG65, SG120/K, KG120",
 missingMotorExamples:"dGo und weitere dMove-/dPro-Baureihen, BGA22, GR/G, KD/DR",
 missingGearExamples:"PLG22/30/32/42, weitere SG- und KG-Familien sowie WG, NG1000 WO; teils noch nicht vollständig katalogisiert",
 coverageComplete:false
});
export function motorFamily(motor){
 const s=(motor?.name||"").replace(/\s/g,"").toLowerCase();
 const match=s.match(/^bg(32|42|45|62|65|66|75|95)x/);
 return match?"bg"+match[1]:null;
}
export function gearFamily(gear){
 if(!gear)return null;
 for(const name of ["PLG 40 LB","PLG 52 EB","PLG 52 HT","PLG 60 LN","PLG 60 LB","PLG 63 EP","PLG 63 HT","PLG 75 EP","PLG 75 HT","PLG 75 SL","PLG 80 LB","PLG 95 HT","STG 65","SG 120 K","SG 120","KG 120","NG 250","NG 500"])
  if(gear.name?.startsWith(name+" ·"))return name;
 return null;
}
export function combinationStatus(motor,gear){
 const m=motorFamily(motor),g=gearFamily(gear);
 // BG66 dMove: explicit modular-system table in BG66 dMove CO/IO datasheet.
 if(m==="bg66" && motor?.series==="dMove"){
  const confirmed=["PLG 52 EB","PLG 52 HT","PLG 60 LN","PLG 60 LB","PLG 63 EP","PLG 63 HT","PLG 75 EP","PLG 75 HT","PLG 80 LB","NG 250","STG 65","SG 120"];
  if(confirmed.includes(g))return {
   level:"family-listed",label:"BG66 dMove · Getriebebaureihe im Herstellerkatalog",
   reason:"Hersteller-Baukasten BG66 dMove führt die Getriebebaureihe "+g+" auf. Die konkrete Bauform, Unterübersetzung, mechanische Schnittstelle und das Lastkollektiv sind getrennt zu bestätigen.",
   source:motor.source||combinationSource
  };
  return {level:"unverified",label:"Für BG66 dMove nicht nachgewiesen",
   reason:"Die gewählte Getriebevariante steht nicht in der ausgewerteten BG66-dMove-Baukastenliste."};
 }
 // BG66 dPro PN/EC/EI: manufacturer's variant-specific modular-system table.
 if(m==="bg66" && motor?.series==="dPro"){
  const verified=["PLG 60 LN","PLG 60 LB","PLG 63 EP","PLG 63 HT","PLG 75 EP","PLG 75 HT","PLG 80 LB","STG 65","SG 120"];
  if(verified.includes(g))return {
   level:"family-listed",label:"BG66 dPro · Getriebebaureihe dokumentiert",
   reason:"Das BG66-dPro-PN/EC/EI-Datenblatt führt die Familie "+g+" auf. Die konkrete Getriebeuntervariante und Einzelfreigabe bleiben separat zu prüfen.",
   source:motor.source||combinationSource
  };
  return {level:"unverified",label:"Keine bestätigte BG66-dPro-Kombination",
   reason:"Diese Getriebebaureihe ist im verwendeten BG66-dPro-PN/EC/EI-Baukastenauszug nicht dokumentiert."};
 }
 // dMove/dPro BG75: Hersteller nennt PLG63, PLG75, NG250 und NG500 ausdrücklich
 // im modularen Baukastensystem. Die Untervariante EP/HT ist dort nicht spezifiziert.
 if((motor?.series==="dMove"||motor?.series==="dPro") && m==="bg75"){
  const documented=["PLG 60 LN","PLG 63 EP","PLG 75 EP","PLG 80 LB","NG 250","NG 500","STG 65","SG 120","KG 120"];
  if(documented.includes(g))return {
   level:"family-listed",
   label:"BG75 "+motor.series+" · Getriebebaureihe im Herstellerkatalog",
   reason:"Dunkermotoren nennt "+g.replace(" EP","")+" für die BG75-"+motor.series+"-Baureihe. Die konkrete Getriebeuntervariante, Übersetzung, Flanschausführung und Freigabe für das Lastkollektiv sind damit nicht bestätigt.",
   source:g==="PLG 80 LB"?gear.source:combinationSource
  };
  return {
   level:"unverified",label:"Getriebekombination nicht belegt",
   reason:"Die konkrete Getriebebaureihe "+g+" ist für BG75 "+motor.series+" in der ausgewerteten Hersteller-Baukastenliste nicht nachgewiesen."
  };
 }
 if(motor?.series&&motor.series!=="dCore")return {
  level:"unverified",label:"Getriebekombination nicht bestätigt",
  reason:"Für die gewählte "+motor.series+"-Motorbaureihe fehlt ein konkreter Baukastennachweis."
 };
 if(!m||!g)return {level:"unknown",label:"Baureihe nicht eindeutig zugeordnet",reason:"Motor oder Getriebe wurde nicht eindeutig erkannt."};
 if(m==="bg95" && motor.name?.startsWith("BG95x40 ") && g==="NG 500")return {
  level:"family-listed",
  label:"BG95x40 dCore + NG500 vom Hersteller dokumentiert",
  reason:"Dunkermotoren zeigt diese Kombination ausdrücklich im NG500-Datenblatt mit Maßzeichnung und 160-mm-Rad. Die Übersetzung "+gear.ratio+":1 ist als NG500-Getriebevariante aufgeführt. Konkrete Artikelnummer, Spannung, Anbauten und Einsatzlast bleiben separat zu bestätigen.",
  source:"https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/products/new/gearboxes/hub-wheel/ng-500.pdf?la=pt-br&revision=07b3f891-b877-41c3-9b90-c700039b8899"
 };
 if((listedFamilies[m]||[]).includes(g))return {
  level:"family-listed",
  label:"Baureihen-Kombination im Hersteller-Baukasten genannt",
  reason:"Für "+m.toUpperCase()+" dCore ist "+g+" als Getriebebaureihe aufgeführt. Konkrete Übersetzung, Welle, Flansch, Bauform, Motoranschluss, Drehzahl- und Lastkollektiv sind noch einzeln zu verifizieren."
 };
 return {
  level:"unverified",
  label:"Keine bestätigte Baukasten-Kombination",
  reason:g+" ist für "+m.toUpperCase()+" dCore in den ausgewerteten Baukastenlisten nicht bestätigt. Dies bedeutet nicht automatisch technisch unmöglich."
 };
}
