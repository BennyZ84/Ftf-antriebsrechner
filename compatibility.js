// Hersteller-Baukastenlisten: BG65 dCore S. 82, BG75 dCore S. 86, BG95 dCore S. 88 (Gesamtkatalog 2025/26).
// Der Eintrag einer Getriebebaureihe bestätigt NICHT jede konkrete Übersetzung / Flansch- / Wellenkombination.
// NG 250/500 sind für diese dCore-Reihen hier NICHT belegt. Das bedeutet "ungeprüft", nicht "unmöglich".
export const combinationSource="https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/catalogues/de-and-en/1_gesamtkatalog_web.pdf?la=en&revision=be4584e4-0293-497c-bbba-99c687c6da7d";
export const listedFamilies=Object.freeze({
  bg65:["PLG 63 EP","PLG 75 EP"],
  bg75:["PLG 63 EP","PLG 75 EP"],
  bg95:["PLG 75 EP"]
});
export const catalogScope=Object.freeze({
 motorFamilies:"BG65, BG75 und BG95 dCore (Auswahl bestätigter Spannungsvarianten)",
 gearFamilies:"NG 250, NG 500, PLG 63 EP und PLG 75 EP",
 missingMotorExamples:"Weitere BG-/BGA-Reihen, dMove, dPro, dGo, GR/G, KD/DR",
 missingGearExamples:"Weitere PLG-, STG-, KG-, SG- und WG-Baureihen",
 coverageComplete:false
});
export function motorFamily(motor){
  const s=(motor?.name||"").replace(/\s/g,"").toLowerCase();
  const match=s.match(/^bg(65|75|95)x/);
  return match?"bg"+match[1]:null;
}
export function gearFamily(gear){
  if(!gear)return null;
  for(const name of ["PLG 63 EP","PLG 75 EP","NG 250","NG 500"])
    if(gear.name?.startsWith(name+" ·"))return name;
  return null;
}
export function combinationStatus(motor,gear){
  const m=motorFamily(motor),g=gearFamily(gear);
  if(!m||!g)return {level:"unknown",label:"Keine belastbare Zuordnung",reason:"Motor oder Getriebe im erfassten Katalog nicht eindeutig gefunden."};
  if((listedFamilies[m]||[]).includes(g)){
    return {level:"family-listed",label:"Baureihe im Hersteller-Baukasten aufgeführt",
      reason:"Baukastenliste nennt "+g+" für "+m.toUpperCase()+" dCore. Die konkrete Übersetzung, Flanschausführung, Welle, Drehzahl- und Belastungsgrenzen sowie Lieferbarkeit sind damit noch NICHT bestätigt."};
  }
  return {level:"unverified",label:"Keine bestätigte Baukasten-Kombination",
    reason:g+" ist in der ausgewerteten Hersteller-Baukastenliste für "+m.toUpperCase()+" dCore nicht genannt. Daraus folgt keine technische Unmöglichkeit; diese Kombination muss beim Hersteller bzw. im Konfigurator geprüft werden."};
}
