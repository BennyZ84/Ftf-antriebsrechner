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
 motorFamilies:"BGA22 dCore, BG32/BG42/BG45/BG62/BG65/BG66/BG75/BG95 dCore; BG32/BG42 KI; BG45/BG65/BG66/BG75 dMove; BG45/BG66/BG75/BG95 dPro (ausgewählte Schnittstellen)",
 gearFamilies:"NG250/NG500; alle 17 PLG-Katalogfamilien; SG45/62/65/80/80K/85/120/120K, STG65, KG80/120/150; NG1000 WO nur vorläufig",
 missingMotorExamples:"BG45 dGo, weitere dMove-/dPro-Baureihen, GR/G, KD/DR; BG42/BGA22 dGo nur als vorläufige Referenzen",
 missingGearExamples:"WG52/63/75 als Baureihen aufgenommen, jedoch ohne nachweisbare einzelne Übersetzungs-/Grenzmomentdatensätze; NG1000 WO nur vorläufig; konkrete Motor/Getriebe-Kombinationen nicht vollständig bestätigt",
 coverageComplete:false
});
export function motorFamily(motor){
 const s=(motor?.name||"").replace(/\s/g,"").toLowerCase();
 const match=s.match(/^bg(32|42|45|62|65|66|75|95)x/);
 return match?"bg"+match[1]:null;
}
export function gearFamily(gear){
 if(!gear)return null;
 for(const name of ["PLG 22 HT","PLG 30","PLG 32","PLG 40 LB","PLG 42 K","PLG 42 S","PLG 52 EB","PLG 52 HT","PLG 60 LN","PLG 60 LB","PLG 63 EP","PLG 63 HT","PLG 75 EP","PLG 75 HT","PLG 75 SL","PLG 80 LB","PLG 95 HT","STG 65","SG 45","SG 62","SG 65","SG 80 K","SG 80","SG 85","SG 120 K","SG 120","KG 80","KG 120","KG 150","NG 1000 WO","NG 250","NG 500"])
  if(gear.name?.startsWith(name+" ·"))return name;
 return null;
}
export function combinationStatus(motor,gear){
 const m=motorFamily(motor),g=gearFamily(gear);
 // Hersteller-Baukasten aus den BGA22-dCore- und BG32-KI-Datenblättern.
 if(motor?.name?.startsWith("BGA22x22 dCore")){
  const documented=["PLG 22 HT","PLG 32"];
  return documented.includes(g)
   ?{level:"family-listed",label:"BGA22 dCore · Herstellerbaukasten",reason:"PLG 22 HT bzw. PLG 32 sind im BGA22-dCore-Datenblatt als Getriebefamilien genannt. Konkreter Flansch und Grenzdaten sind einzeln zu prüfen.",source:motor.source}
   :{level:"unverified",label:"BGA22 dCore · Kombination nicht belegt",reason:"Diese Getriebefamilie wird für BGA22 dCore im ausgewerteten Herstellerdatenblatt nicht genannt."};
 }
 if(motor?.series==="KI" && m==="bg42"){
  const documented=["PLG 42 S","PLG 52 EB","PLG 52 HT","PLG 40 LB","SG 45","SG 62"];
  if(motor.preliminary)return {level:"unverified",label:"Vorläufige BG42-KI-Variante",reason:"Der Hersteller kennzeichnet diese Variante als vorläufig. Einzelkombination nicht freigegeben.",source:motor.source};
  return documented.includes(g)
   ?{level:"family-listed",label:"BG42 KI · Herstellerbaukasten",reason:"Das Herstellerdatenblatt nennt diese Getriebebaureihe als mögliche BG42-KI-Baukastenfamilie. Die konkrete Wellen-/Flanschvariante und fehlende Spitzenmomentgrenze sind gesondert zu prüfen.",source:motor.source}
   :{level:"unverified",label:"BG42 KI · Kombination nicht belegt",reason:"Die gewählte Getriebefamilie ist im BG42-KI-Baukasten nicht aufgeführt."};
 }
 if(motor?.series==="KI" && m==="bg32"){
  const documented=["PLG 32","PLG 42 K","PLG 42 S"];
  return documented.includes(g)
   ?{level:"family-listed",label:"BG32 KI · Herstellerbaukasten",reason:"Die Getriebefamilie ist im BG32-KI-Datenblatt aufgeführt. Die zulässige Motor-Beschleunigungsmomentgrenze ist dort nicht gesondert ausgewiesen.",source:motor.source}
   :{level:"unverified",label:"BG32 KI · Kombination nicht belegt",reason:"Die Getriebebaureihe ist im ausgewerteten BG32-KI-Baukasten nicht genannt."};
 }

 if(motor?.preliminary)return {level:"unverified",label:"Vorläufige Motordaten – keine Freigabe",
  reason:"Die Motordaten sind vorläufig bzw. die zulässigen Beschleunigungsmomente sind nicht vollständig angegeben. Herstellerfreigabe vor Auslegung erforderlich.",
  source:motor.source||combinationSource};

 // Vorläufige Daten dürfen nicht als bestätigte Auslegungswerte geführt werden.
 if(gear?.preliminary)return {
  level:"unverified",label:"Vorläufige Herstellerdaten – keine Auslegungsfreigabe",
  reason:"Die NG1000-WO-Daten sind als vorläufig bezeichnet. Auch die dokumentierte BG95x80-dPro-Referenz ersetzt keine technische Freigabe.",source:gear.source
 };

 // BG45 dPro CO/IO: PLG42S, PLG52 EB/HT and PLG40 LB on manufacturer modular list.
 if(m==="bg45" && motor?.series==="dPro"){
  const listed=["PLG 40 LB","PLG 42 S","PLG 52 EB","PLG 52 HT","SG 45","SG 62","SG 80"];
  if(listed.includes(g))return {level:"family-listed",label:"BG45 dPro · Baukastenfamilie",
   reason:"Hersteller führt "+g+" für BG45 dPro auf Baureihenebene. Einzelne Artikelkombinationen und Anbauten prüfen.",
   source:motor.source||combinationSource};
  return {level:"unverified",label:"BG45-dPro-Kombination nicht bestätigt",
   reason:"Im ausgewerteten Baukasten für BG45 dPro nicht als Getriebebaureihe genannt."};
 }
 // BG45 dMove CO/IO: official BG45 modular-system listing.
 if(m==="bg45" && motor?.series==="dMove"){
  const listed=["PLG 40 LB","PLG 42 S","PLG 52 EB","PLG 52 HT"];
  if(listed.includes(g))return {level:"family-listed",label:"BG45 dMove · Baukastenfamilie",
   reason:"BG45 dMove und "+g+" sind als Baureihen im Hersteller-Baukasten aufgeführt. Die konkrete Ausführung bleibt zu bestätigen.",
   source:motor.source||combinationSource};
  return {level:"unverified",label:"BG45-dMove-Kombination nicht belegt",
   reason:"In den verwendeten Baukastenunterlagen für BG45 dMove nicht aufgeführt."};
 }
 // BG65 dMove: per BG65 dMove CO/IO datasheet.
 if(m==="bg65" && motor?.series==="dMove"){
  const listed=["PLG 52 EB","PLG 52 HT","PLG 60 LN","PLG 60 LB","PLG 63 EP","PLG 63 HT","PLG 75 EP","PLG 75 HT","SG 80","SG 120","STG 65","KG 80"];
  if(listed.includes(g))return {level:"family-listed",label:"BG65 dMove · Getriebebaureihe im Herstellerbaukasten",
   reason:"BG65 dMove und "+g+" sind als Baureihen aufgeführt. Konkrete Flansch-, Wellen- und Übersetzungsvariante sowie Belastbarkeit separat bestätigen.",
   source:motor.source||combinationSource};
  return {level:"unverified",label:"Keine bestätigte BG65-dMove-Kombination",
   reason:"Diese Getriebefamilie ist im ausgewerteten BG65-dMove-Baukasten nicht aufgeführt."};
 }
 // BG95 dPro: variant-specific modular-system listing; only family-level match.
 if(m==="bg95" && motor?.series==="dPro"){
  const listed=["PLG 75 EP","PLG 75 HT","PLG 80 LB","PLG 95 HT","SG 120","STG 65","KG 120","NG 500"];
  if(listed.includes(g) || (g==="KG 150"&&motor.name?.includes("PN/EC/EI")))return {level:"family-listed",label:"BG95 dPro · Getriebebaureihe dokumentiert",
   reason:"Hersteller nennt "+g+" als Baukastenfamilie für BG95 dPro. Konkrete Artikel-/Flanschausführung nicht freigegeben.",
   source:motor.source||combinationSource};
  return {level:"unverified",label:"Nicht belegte BG95-dPro-Kombination",
   reason:"Keine bestätigte Baukastenfamilie für diesen Motor in den ausgewerteten Herstellerunterlagen."};
 }
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
