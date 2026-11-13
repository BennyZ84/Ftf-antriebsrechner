// Herstellerdokumentierte Artikelnummernkreise. X ist ein Platzhalter, keine bestellfähige Nummer.
// Dcore: Offizielle BG XX dCore Funktions- und Anschlussbeschreibung, Titelseite.
// dPro BG95: Offizielle BG95 dPro CO/IO/PN/EC/EI Funktions- und Anschlussbeschreibung.
// NG: Offizielle Funktions- und Schnittstellenbeschreibung Getriebe, Titelseite.
const dcoreSource='https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/manuals/brushless-dc-motors/001_bg_xxdcore.pdf?la=pt-br&revision=691d9823-9a5e-412a-a052-573836dc3440';
const gearboxSource='https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/manuals/gearboxes/001_funktions-_und_schnittstellenbeschreibung_getriebe.pdf?la=pt-br&revision=3e964ef5-dd70-48e8-a1d4-1c3cb910a262';
const dproSource='https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/manuals/brushless-dc-motors/019_bg95_dpro_co_io_pn_ec_ei.pdf';
const dcorePrefixes=Object.freeze({
 'BGA22':'88522.XXXXX','BG32':'88532.XXXXX','BG42':'88542.XXXXX',
 'BG45':'88545.XXXXX','BG62':'88562.XXXXX','BG65':'88565.XXXXX',
 'BG66':'88566.XXXXX','BG75':'88575.XXXXX','BG95':'88595.XXXXX'
});
export function manufacturerNumberInfo(kind,item){
 if(!item||typeof item.name!=='string')return null;
 const compact=item.name.replace(/\s+/g,'');
 if(kind==='motor'){
  const dc=compact.match(/^(BGA22|BG32|BG42|BG45|BG62|BG65|BG66|BG75|BG95)x\d+dCore/i);
  if(dc){
   const key=dc[1].toUpperCase();
   const pattern=dcorePrefixes[key];
   if(pattern)return {pattern,source:dcoreSource,description:'Hersteller-Nummernkreis (dCore-Baureihe); nicht für Spannung und Zusatzausstattung aufgelöst'};
  }
  const dp=compact.match(/^BG95x(40|80|120)dPro/i);
  if(dp){
   const pattern={'40':'88595.05XXX','80':'88595.06XXX','120':'88595.07XXX'}[dp[1]];
   return {pattern,source:dproSource,description:'Hersteller-Nummernkreis (BG95 dPro); keine vollständige Bestellnummer'};
  }
 }
 if(kind==='gear' && /^NG\s*(250|500|1000\s*WO)\b/i.test(item.name))
  return {pattern:'88852.0XXXX',source:gearboxSource,description:'Gemeinsamer Hersteller-Nummernkreis für Nabengetriebe (NG); keine eindeutige Übersetzungs-/Einzelartikelnummer'};
 return null;
}
