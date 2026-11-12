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
  bg66:["PLG 63 EP","PLG 75 HT"],
  bg75:["PLG 63 EP","PLG 75 EP","PLG 75 HT"],
  bg95:["PLG 75 EP","PLG 75 HT","PLG 95 HT"]
});
export const catalogScope=Object.freeze({
 motorFamilies:"BG32/BG42/BG45/BG62/BG65/BG66/BG75/BG95 dCore; BG75 dMove CO/IO und dPro CO/IO",
 gearFamilies:"NG250/NG500; PLG63 EP, PLG75 EP/HT, PLG95 HT",
 missingMotorExamples:"dGo und weitere dMove-/dPro-Baureihen, BGA22, GR/G, KD/DR",
 missingGearExamples:"PLG22/30/32/40/42/52/60/63HT/75SL/80LB, STG-, KG-, SG-, WG-Familien",
 coverageComplete:false
});
export function motorFamily(motor){
 const s=(motor?.name||"").replace(/\s/g,"").toLowerCase();
 const match=s.match(/^bg(32|42|45|62|65|66|75|95)x/);
 return match?"bg"+match[1]:null;
}
export function gearFamily(gear){
 if(!gear)return null;
 for(const name of ["PLG 63 EP","PLG 75 EP","PLG 75 HT","PLG 95 HT","NG 250","NG 500"])
  if(gear.name?.startsWith(name+" ·"))return name;
 return null;
}
export function combinationStatus(motor,gear){
 const m=motorFamily(motor),g=gearFamily(gear);
 if(motor?.series&&motor.series!=="dCore")return {
  level:"unverified",
  label:"Getriebeanbau für "+motor.series+" noch nicht einzeln bestätigt",
  reason:"Die vorhandenen Baukasten-Nachweise beziehen sich auf dCore oder spezifische Referenzen. Für "+motor.series+" wird keine dCore-Freigabe übernommen; mechanische Schnittstellen und konkrete Getriebeausführung gesondert prüfen."
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
