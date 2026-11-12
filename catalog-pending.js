// Katalogisierte Herstellerbaureihen ohne verifizierte Einzel-Auslegungsdatensätze.
// Diese Einträge sind nur eine Bestandsübersicht, ausdrücklich keine Rechendaten.
export const pendingCatalogFamilies=Object.freeze([
 {id:"wg52",type:"gear",name:"WG 52",status:"Einzelkennwerte fehlen",ratioRangeMax:320,
  details:"Kombinationsgetriebe aus Schnecken- und Planetenstufe; die Angabe bis 320:1 gilt für die WG-Serie insgesamt, nicht nachweislich für jede Baugröße.",
  missing:"Übersetzungen pro Ausführung, Wirkungsgrade, Dauer-/Beschleunigungsmomente und konkrete Motoranbauten.",
  source:"https://www.dunkermotoren.com/de-de/products/gearboxes/angular-gears/combination-gearboxes"},
 {id:"wg63",type:"gear",name:"WG 63",status:"Einzelkennwerte fehlen",ratioRangeMax:320,
  details:"Kombinationsgetriebe aus Schnecken- und Planetenstufe; S1/S8 und bis 3000 min⁻¹ werden nur abhängig von der Ausführung genannt.",
  missing:"Übersetzungen pro Ausführung, Wirkungsgrade, Dauer-/Beschleunigungsmomente und konkrete Motoranbauten.",
  source:"https://www.dunkermotoren.com/de-de/products/gearboxes/angular-gears/combination-gearboxes"},
 {id:"wg75",type:"gear",name:"WG 75",status:"Einzelkennwerte fehlen",ratioRangeMax:320,
  details:"Kombinationsgetriebe aus Schnecken- und Planetenstufe; S1/S8 und bis 3000 min⁻¹ werden nur abhängig von der Ausführung genannt.",
  missing:"Übersetzungen pro Ausführung, Wirkungsgrade, Dauer-/Beschleunigungsmomente und konkrete Motoranbauten.",
  source:"https://www.dunkermotoren.com/de-de/products/gearboxes/angular-gears/combination-gearboxes"},
 {id:"bg45dgo",type:"motor",name:"BG 45 dGo",status:"Einzelkennwerte noch nicht bestätigt",
  details:"Offiziell aufgeführte Motorfamilie mit integrierter Kommutierungselektronik.",
  missing:"Verifizierte, eindeutig zugeordnete Spannungs- und Wicklungsvarianten einschließlich Nenn-/Maximalmoment, Drehzahlen und Rotorträgheit.",
  source:"https://www.dunkermotoren.com/de-de/products/brushless-dc-motors/with-integrated-controller"}
]);
export function pendingFamilyStatus(family){
 if(!family||!pendingCatalogFamilies.some(x=>x.id===family.id))return null;
 return {calculable:false,missing:family.missing};
}
