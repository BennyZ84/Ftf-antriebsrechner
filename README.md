# FTF Antriebsrechner (PWA)

Installierbare FTF-Fahrantriebs-Berechnung für iPhone, iPad und Windows.

## Veröffentlichung

Die Dateien und der GitHub-Actions-Workflow sind bereits im Repository. **Einmalig** unter **Settings → Pages → Build and deployment → Source: GitHub Actions** aktivieren. Danach kann der Workflow `Publish FTF Antriebsrechner` per **Actions → Run workflow** erneut gestartet werden; spätere Änderungen auf `main` veröffentlichen sich automatisch.

Vorgesehene Adresse: https://bennyz84.github.io/Ftf-antriebsrechner/

iPhone: Safari öffnen → Teilen → Zum Home-Bildschirm → Als Web-App öffnen → Hinzufügen. Nach dem ersten erfolgreichen Online-Aufruf werden wichtige App-Dateien offline gespeichert.

## Eingaben

Referenzkonfiguration: **200 kg Leergewicht, 550 kg Zuladung, 750 kg Gesamtmasse**, 2 Antriebe, 160 mm Rad, Übersetzung 16:1, Auslegungswirkungsgrad 80 %, 1,40 m/s, 0,50 m/s² Beschleunigung und 0,70 m/s² Bremsverzögerung. Alle Werte lassen sich verändern.

**Katalogstand v3.0 (12.11.2026): 124 Motor-Spannungs-/Steuerungsvarianten und 344 Getriebeübersetzungen aus 30 Getriebebaureihen.** Die 17 Planetengetriebefamilien (PLG) der ausgewerteten Hersteller-Lieferübersicht sind als Baureihen vertreten. Motoren und Getriebe sind als technische Vorauslegungsdaten erfasst, nicht als vollständiges Sortiment aller Artikelnummern. Wo Herstellerdaten für Beschleunigungsgrenzen fehlen, wird **kein** fiktiver Peak-Wert ergänzt.

Motoren: ausgewählte BG32/BG42/BG45/BG62/BG65/BG66/BG75/BG95 dCore, BG45/65/66/75 dMove und BG45/66/75/95 dPro. Noch nicht vollständig erfasst: dGo, BGA, GR/PM, weitere Schnittstellen- und Spannungsvarianten.

Getriebe: 17 PLG-Familien, NG250/NG500, SG45/62/80/80K/85/120/120K, KG80/120/150 und STG65. Weiterhin offen: insbesondere SG65, WG52/63/75, NG1000 WO (teils vorläufige Daten) und konkrete Herstellervarianten.

**Auslegungsgrenzen:** Kombinierbarkeit auf Hersteller-Baureihenebene ist keine Freigabe einzelner Artikel. Flansch, Welle, Übersetzung, Wirkungsgrad, Anbauten, thermische Lasten und dynamische Lastkollektive müssen vor Freigabe geprüft werden. S1- und S8-Momentangaben sind teilweise betriebspunktabhängig.

**Vollständigkeit:** Die 124/344 Datensätze bezeichnen nicht alle lieferbaren Motoren, Getriebe und Baukastenkombinationen. Aktueller Stand und Quellen: [Katalog-Abdeckungsbericht](CATALOG_COVERAGE.md).

Quellen: [Gesamtkatalog 2025/26](https://www.dunkermotoren.com/de-de/downloads/catalogues), [BLDC-Motoren](https://www.dunkermotoren.com/de-de/products/brushless-dc-motors/for-external-controllers), [Getriebe](https://www.dunkermotoren.com/de-de/products/gearboxes). Alle neuen Einträge enthalten eigene Datenblatt-Links im Quellcode.

Die App berechnet Motordrehzahlen, Geschwindigkeit, Roll- und Steigungswiderstände, Rad- und Motormomente, Beschleunigungs- und Bremswege sowie Reserven. Rotorträgheit wird motorseitig berücksichtigt. Die Auslegung ist **keine Sicherheitsfreigabe**.

## Datenspeicherung

Projekte werden lokal im Browser gespeichert. JSON-Import/Export für Backups und Gerätewechsel. Keine Anmeldung, keine Übertragung der Projekte an GitHub. **Das Repository und alle dort hinterlegten Referenzwerte sind öffentlich.** Browserdaten nicht löschen, bevor ein JSON-Backup gesichert ist.

## Prüfen

`npm test` führt automatisierte Referenz- und Eingabeprüfungen aus. `node --check app.js` und `node --check calculator.js` prüfen die JavaScript-Syntax. Diese Prüfungen laufen auch vor jeder automatischen Veröffentlichung.

### Grenzen

Das Modell basiert auf dem Projekt-Rechenblatt „Berechnung mit Formeln FTF BG95x40“ (12.11.2026). Haftung, Fahrzeugstabilität, Lastkollektiv, Bremsenergiepfad, thermische Last und Rücktrieb müssen separat geprüft werden. Bremswege enthalten keine Reaktionszeit, Verzögerungsaufbauzeit oder Sicherheitszuschläge.
