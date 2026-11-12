// Hertzähnliche Linienkontakt-Vorausrechnung für Rollen auf Beton.
// Parameterwerte sind Beispielwerte und müssen projektbezogen geprüft werden.
export const rollerDefaults=Object.freeze({
 rollerLoadKg:1200,rollerDiameter:250,rollerWidth:100,
 concreteModulus:33000,paModulus:3200,puModulus:800,
 rollerPoisson:0.35,gravity:9.81
});
export function calculateRollerPressure(c){
 const keys=['rollerLoadKg','rollerDiameter','rollerWidth','concreteModulus','paModulus','puModulus','rollerPoisson','gravity'];
 if(keys.some(k=>!Number.isFinite(c[k])))return {error:'Ungültige Rollenkontakt-Eingabe'};
 if(c.rollerLoadKg<=0||c.rollerDiameter<=0||c.rollerWidth<=0||c.concreteModulus<=0||c.paModulus<=0||c.puModulus<=0||c.gravity<=0||c.rollerPoisson<0||c.rollerPoisson>=0.5)
  return {error:'Rollenlast, Geometrie, Elastizitätsmodul und Querkontraktionszahl prüfen'};
 const force=c.rollerLoadKg*c.gravity;
 const pairedE=(e)=>2*c.concreteModulus*e/(c.concreteModulus+e);
 const combinedPA=pairedE(c.paModulus),combinedPU=pairedE(c.puModulus);
 const pressure=(E)=>Math.sqrt(force*E/(2*Math.PI*(c.rollerDiameter/2)*c.rollerWidth*(1-c.rollerPoisson**2)));
 return {force,combinedPA,combinedPU,pressurePA:pressure(combinedPA),pressurePU:pressure(combinedPU),
 warnings:['Vereinfachte Kontaktpressung für zylindrische Rolle und ebene Gegenfläche; keine Freigabe des Materials, der Lagerung oder des Bodens.',
 'Die Querkontraktionszahl wird für die Modellmaterialien gleich angenommen. Tatsächliche Materialpaarung, dynamische Lasten und Kontaktlänge prüfen.']};
}
