# FTF Antriebsrechner (PWA)

Installierbare FTF-Fahrantriebs-Berechnung für iPhone, iPad und Windows.

## Veröffentlichung

Die Dateien und der GitHub-Actions-Workflow sind bereits im Repository. **Einmalig** unter **Settings → Pages → Build and deployment → Source: GitHub Actions** aktivieren. Danach kann der Workflow `Publish FTF Antriebsrechner` per **Actions → Run workflow** erneut gestartet werden; spätere Änderungen auf `main` veröffentlichen sich automatisch.

Vorgesehene Adresse: https://bennyz84.github.io/Ftf-antriebsrechner/

iPhone: Safari öffnen → Teilen → Zum Home-Bildschirm → Als Web-App öffnen → Hinzufügen. Nach dem ersten erfolgreichen Online-Aufruf werden wichtige App-Dateien offline gespeichert.

## Eingaben

Referenzkonfiguration: **200 kg Leergewicht, 550 kg Zuladung, 750 kg Gesamtmasse**, 2 Antriebe, 160 mm Rad, Übersetzung 16:1, Auslegungswirkungsgrad 80 %, 1,40 m/s, 0,50 m/s² Beschleunigung und 0,70 m/s² Bremsverzögerung. Alle Werte lassen sich verändern.

**Katalogstand v2.4 (12.11.2026): 87 Motorvarianten, 220 Getriebeübersetzungen aus 18 Getriebebaureihen.**

Motoren: BG32/BG42/BG45/BG62/BG65/BG66/BG75/BG95 dCore, zusätzlich BG75 dMove CO/IO und BG75 dPro CO/IO. dGo, andere dMove/dPro-Baugrößen, bürstenbehaftete GR/PM, AC-Motoren und BGA-Baureihen sind **noch nicht** vollständig erfasst.

Getriebe mit dokumentierten Auslegungsdaten: NG250/NG500, PLG40 LB, PLG52 EB/HT, PLG60 LN/LB, PLG63 EP/HT, PLG75 EP/HT/SL, PLG80 LB, PLG95 HT, STG65, SG120/SG120K und KG120.

**Spezifische Grenzen der Herstellerwerte:** Bei PLG40/60/80 LB ist das dargestellte Dauermoment der S8-Wert, bei 3000 min⁻¹ Eingangsdrehzahl; S1-Werte bei 100 min⁻¹ Abtriebsdrehzahl sind separat als Metadaten gespeichert. Die S1-Lebensdauer ist zu prüfen. Bei KG120 und PLG40 LB ist der angegebene Wirkungsgrad ein *Verzahnungswirkungsgrad* und nicht zwingend der gesamte Systemwirkungsgrad. Bei SG120 und STG65 gelten weitere Vorgaben zum Lastkollektiv und gegebenenfalls zur Selbsthemmung. Die voreingestellte Auslegungswirkungsgradannahme kann angepasst werden.

**Motor-Getriebe-Kombinationen:** Die App listet nur nachweisbare Hersteller-Baukastenfamilien als solche; mechanische Einzelausführungen werden dadurch **nicht automatisch freigegeben**. BG95x40 dCore + NG500 ist mit Herstellerzeichnung dokumentiert. BG75 dMove/dPro können mit den nachgewiesenen Getriebebaureihen ausgewählt werden; die konkrete EP-/HT-Variante, Motoranschlüsse und Artikelnummern erfordern gesonderte Prüfung.

**Noch offene Familien im offiziellen Herstellerkatalog:** PLG22 HT, PLG30, PLG32, PLG42 K/S, weitere SG/KG/WG-Angulargetriebe, NG1000 WO und die noch nicht erfassten Motorreihen. Unvollständige oder als vorläufig gekennzeichnete Daten werden nicht für die Auslegung interpoliert oder als bestätigt eingetragen. Der Umfang des Portfolios kann sich außerdem ändern.

Siehe [Katalog-Abdeckungsbericht](CATALOG_COVERAGE.md) für Status, Quellen und offene Punkte.

Quellen: [Gesamtkatalog 2025/26](https://www.dunkermotoren.com/de-de/downloads/catalogues), [BLDC-Motoren](https://www.dunkermotoren.com/de-de/products/brushless-dc-motors/for-external-controllers), [Getriebe](https://www.dunkermotoren.com/de-de/products/gearboxes). Alle neuen Einträge enthalten eigene Datenblatt-Links im Quellcode.

Die App berechnet Motordrehzahlen, Geschwindigkeit, Roll- und Steigungswiderstände, Rad- und Motormomente, Beschleunigungs- und Bremswege sowie Reserven. Rotorträgheit wird motorseitig berücksichtigt. Die Auslegung ist **keine Sicherheitsfreigabe**.

## Datenspeicherung

Projekte werden lokal im Browser gespeichert. JSON-Import/Export für Backups und Gerätewechsel. Keine Anmeldung, keine Übertragung der Projekte an GitHub. **Das Repository und alle dort hinterlegten Referenzwerte sind öffentlich.** Browserdaten nicht löschen, bevor ein JSON-Backup gesichert ist.

## Prüfen

`npm test` führt automatisierte Referenz- und Eingabeprüfungen aus. `node --check app.js` und `node --check calculator.js` prüfen die JavaScript-Syntax. Diese Prüfungen laufen auch vor jeder automatischen Veröffentlichung.

### Grenzen

Das Modell basiert auf dem Projekt-Rechenblatt „Berechnung mit Formeln FTF BG95x40“ (12.11.2026). Haftung, Fahrzeugstabilität, Lastkollektiv, Bremsenergiepfad, thermische Last und Rücktrieb müssen separat geprüft werden. Bremswege enthalten keine Reaktionszeit, Verzögerungsaufbauzeit oder Sicherheitszuschläge.
