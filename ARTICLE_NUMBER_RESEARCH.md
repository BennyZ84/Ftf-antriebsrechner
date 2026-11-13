# Artikelnummern-Recherche – Stand 13.11.2026

## Grundsatz
Katalogvarianten, elektrische Kennwerte und eine Getriebeübersetzung identifizieren nicht zwangsläufig eine bestellfähige Artikelnummer. Hersteller-Artikelnummernkreise mit `X` sind nur Orientierung, niemals als vollständige Nummer ins Bestellfeld kopieren.

## Offizielle Herstellerunterlagen und daraus belegte Nummernkreise

1. **BG XX dCore**, offizielles Funktions- und Anschlussdokument, Titelseite:
   https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/manuals/brushless-dc-motors/001_bg_xxdcore.pdf?la=pt-br&revision=691d9823-9a5e-412a-a052-573836dc3440

   BGA22 dCore: `88522.XXXXX`; BG32 dCore: `88532.XXXXX`; BG42 dCore: `88542.XXXXX`; BG45 dCore: `88545.XXXXX`; BG62 dCore: `88562.XXXXX`; BG65 dCore: `88565.XXXXX`; BG66 dCore: `88566.XXXXX`; BG75 dCore: `88575.XXXXX`; BG95 dCore: `88595.XXXXX`. Der Code ist nur Baureihen-Code, nicht auf Spannung, Rotor, Schnittstelle oder Motorzusatzoptionen aufgelöst.

2. **BG95 dPro CO/IO/PN/EC/EI**, offizielles Dokument, Titelseite:
   https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/manuals/brushless-dc-motors/031_bg_95dpro.pdf?la=pt-br&revision=a58d460e-a5ac-46a5-9399-b61b9d040b06

   BG95x40 dPro `88595.05XXX`, BG95x80 dPro `88595.06XXX`, BG95x120 dPro `88595.07XXX`. Hersteller-PDF verwendet Leerzeichen statt Punkt (z.B. `88595 05XXX`); hier ist die Schreibweise für UI normalisiert.

3. **Nabengetriebe (NG)**, offizielles Funktions-/Schnittstellendokument, Titelseite:
   https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/manuals/gearboxes/001_funktions-_und_schnittstellenbeschreibung_getriebe.pdf?la=pt-br&revision=3e964ef5-dd70-48e8-a1d4-1c3cb910a262

   Nabengetriebe einschließlich NG 500: `88852.0XXXX`. Das ist ein gemeinsamer Nummernkreis, keine Zuordnung einer bestimmten Übersetzung.

## Aktuell ausgewählte Beispielkombination
- Motor: BG95x40 dCore 48 V – Nummernkreis `88595.XXXXX`; vollständige Bestellnummer noch nicht belegt.
- Getriebe: NG 500 16:1 – Nummernkreis `88852.0XXXX`; vollständige Bestellnummer noch nicht belegt.
- Komplettantrieb: derzeit **keine eindeutig belegte bestellfähige Nummer**. Der Hersteller zeigt die Kombination im Katalog geometrisch, aber ohne eindeutige Bestellnummer. Dokument BG95/NG500: https://www.dunkermotoren.de/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/catalogues/de-and-en/dunkermotoren_product_catalog.pdf?la=pt-br&revision=224224c7-2c0a-482e-8a45-ed275ab36fad

## Exakte, aber anders konfigurierte Artikel als Referenz – nicht der Auswahl zuordnen
Ein älteres SIMATIC-MICRO-DRIVE-Dokument (Herstellertext von Dunkermotoren, extern gehostet) nennt:
- `96595.02699`: BG95x40, 48 V **mit IQ-Encoder**, ohne Getriebe
- `96595.02799`: BG95x40, 48 V mit IQ-Encoder und **Bremse E600**, ohne Getriebe
- `96595.02631`: BG95x40, 48 V mit IQ-Encoder und **PLG95 16,8:1** (nicht NG 500)
- `96595.02731`: BG95x40, 48 V mit IQ-Encoder, Bremse E600 und **PLG95 16,8:1**
Quelle: https://wobit.com.pl/download/simatic_micro_drive_web.pdf

Diese Referenzen belegen gerade, dass Option und Getriebe die konkrete Artikelnummer verändern. Sie dürfen **nicht** automatisch einem lediglich als BG95x40 dCore/NG500 bezeichneten Projekt zugeordnet werden.

## Weiteres Vorgehen
- Exakte Bestellnummer erst übernehmen, wenn vollständige Zuordnung zu Motorvariante, Wicklung/Spannung, integrierter Elektronik, Geber, Bremse, Getriebeübersetzung und Einbau-/Flanschausführung belegt ist.
- Fehlende Nummern beim Hersteller Product Finder oder in Herstellerangebot/Zeichnung/Produktkonfiguration ermitteln. Einstiegsseite: https://www.dunkermotoren.de/de-de/konfigurator (dynamischer Product Finder, über vorhandene Such-Tools nicht direkt vollständig auslesbar).
- Fund mit Quelle, Datum, Konfigurationsdetails und Zustand (bestätigt/vorläufig/unbestätigt) dokumentieren.
- Die App-Funktion `order-catalog.js` liefert nur dokumentierte Nummernkreise; persönliche Artikelnummern bleiben getrennt und unbestätigt.
