# FTF Antriebsrechner (PWA)

Installierbare FTF-Fahrantriebs-Berechnung für iPhone, iPad und Windows.

## Veröffentlichung

Die Dateien und der GitHub-Actions-Workflow sind bereits im Repository. **Einmalig** unter **Settings → Pages → Build and deployment → Source: GitHub Actions** aktivieren. Danach kann der Workflow `Publish FTF Antriebsrechner` per **Actions → Run workflow** erneut gestartet werden; spätere Änderungen auf `main` veröffentlichen sich automatisch.

Vorgesehene Adresse: https://bennyz84.github.io/Ftf-antriebsrechner/

iPhone: Safari öffnen → Teilen → Zum Home-Bildschirm → Als Web-App öffnen → Hinzufügen. Nach dem ersten erfolgreichen Online-Aufruf werden wichtige App-Dateien offline gespeichert.

## Eingaben

Referenzkonfiguration: **200 kg Leergewicht, 550 kg Zuladung, 750 kg Gesamtmasse**, 2 Antriebe, 160 mm Rad, Übersetzung 16:1, Auslegungswirkungsgrad 80 %, 1,40 m/s, 0,50 m/s² Beschleunigung und 0,70 m/s² Bremsverzögerung. Alle Werte lassen sich verändern.

Katalogstand **v1.6 (12.11.2026)**: 61 einzeln dokumentierte Motor-Spannungsvarianten aus **BG32, BG42, BG45, BG62, BG65, BG66, BG75 und BG95 dCore** sowie 81 Getriebeübersetzungen aus **NG250, NG500, PLG63 EP, PLG75 EP/HT und PLG95 HT**. BG45-Nennwerte sind thermisch angebundene Werte; ohne ausreichende Kühlung ist die Nennbelastbarkeit geringer. BG42x45 24 V wurde wegen vorläufig markierter Daten nicht übernommen.

**Kompatibilität:** Die Auswahlliste zeigt standardmäßig ausschließlich vom Hersteller auf **Baureihenebene** genannte Motor/Getriebe-Kombinationen. Auch dort sind Übersetzung, Flansch, Welle, Drehzahl, zulässige Last und Artikelnummer nicht automatisch bestätigt. Nicht belegte Verbindungen lassen sich nur über die zusätzliche Vergleichsoption einblenden. Die vorhandene BG95x40/NG500-Referenz bleibt als **nicht baureihenbestätigt** markiert.

**Nicht vollständig:** Der Dunkermotoren-Gesamtkatalog 2025/26 enthält weitere Motoren (darunter dGo/dMove/dPro, GR/G und andere BG/BGA-Reihen) und weitere Planeten-, Winkel-, Schnecken- und Nabengetriebe, deren konkreten Einzelvarianten hier **noch nicht vollständig erfasst** sind. Fehlende Werte werden nicht erfunden. Für eine freigegebene Produktkombination bitte immer den Herstellerkonfigurator oder eine individuelle Herstellerbestätigung verwenden.

Quellen: [Gesamtkatalog 2025/26](https://www.dunkermotoren.com/de-de/downloads/catalogues), [BLDC-Motoren](https://www.dunkermotoren.com/de-de/products/brushless-dc-motors/for-external-controllers), [Getriebe](https://www.dunkermotoren.com/de-de/products/gearboxes). Alle neuen Einträge enthalten eigene Datenblatt-Links im Quellcode.

Die App berechnet Motordrehzahlen, Geschwindigkeit, Roll- und Steigungswiderstände, Rad- und Motormomente, Beschleunigungs- und Bremswege sowie Reserven. Rotorträgheit wird motorseitig berücksichtigt. Die Auslegung ist **keine Sicherheitsfreigabe**.

## Datenspeicherung

Projekte werden lokal im Browser gespeichert. JSON-Import/Export für Backups und Gerätewechsel. Keine Anmeldung, keine Übertragung der Projekte an GitHub. **Das Repository und alle dort hinterlegten Referenzwerte sind öffentlich.** Browserdaten nicht löschen, bevor ein JSON-Backup gesichert ist.

## Prüfen

`npm test` führt automatisierte Referenz- und Eingabeprüfungen aus. `node --check app.js` und `node --check calculator.js` prüfen die JavaScript-Syntax. Diese Prüfungen laufen auch vor jeder automatischen Veröffentlichung.

### Grenzen

Das Modell basiert auf dem Projekt-Rechenblatt „Berechnung mit Formeln FTF BG95x40“ (12.11.2026). Haftung, Fahrzeugstabilität, Lastkollektiv, Bremsenergiepfad, thermische Last und Rücktrieb müssen separat geprüft werden. Bremswege enthalten keine Reaktionszeit, Verzögerungsaufbauzeit oder Sicherheitszuschläge.
