# FTF Antriebsrechner (PWA)

Installierbare FTF-Fahrantriebs-Berechnung für iPhone, iPad und Windows.

## Veröffentlichung

Die Dateien und der GitHub-Actions-Workflow sind bereits im Repository. **Einmalig** unter **Settings → Pages → Build and deployment → Source: GitHub Actions** aktivieren. Danach kann der Workflow `Publish FTF Antriebsrechner` per **Actions → Run workflow** erneut gestartet werden; spätere Änderungen auf `main` veröffentlichen sich automatisch.

Vorgesehene Adresse: https://bennyz84.github.io/Ftf-antriebsrechner/

iPhone: Safari öffnen → Teilen → Zum Home-Bildschirm → Als Web-App öffnen → Hinzufügen. Nach dem ersten erfolgreichen Online-Aufruf werden wichtige App-Dateien offline gespeichert.

## Eingaben

Referenzkonfiguration: **200 kg Leergewicht, 550 kg Zuladung, 750 kg Gesamtmasse**, 2 Antriebe, 160 mm Rad, Übersetzung 16:1, Auslegungswirkungsgrad 80 %, 1,40 m/s, 0,50 m/s² Beschleunigung und 0,70 m/s² Bremsverzögerung. Alle Werte lassen sich verändern.

Motoren: BG95x40 mit 48-V-Standardreferenz (40-V-Projektmotor 88595.01992 nicht individuell bestätigt); BG75x25 ist nur ein **Platzhalter ohne Herstellerwerte**. Getriebe: NG500, 16:1, Dauer- und Beschleunigungsmoment. Eine vollständige Dunkermotoren-Datenbank ist noch nicht vorhanden.

Die App berechnet Motordrehzahlen, Geschwindigkeit, Roll- und Steigungswiderstände, Rad- und Motormomente, Beschleunigungs- und Bremswege sowie Reserven. Rotorträgheit wird motorseitig berücksichtigt. Die Auslegung ist **keine Sicherheitsfreigabe**.

## Datenspeicherung

Projekte werden lokal im Browser gespeichert. JSON-Import/Export für Backups und Gerätewechsel. Keine Anmeldung, keine Übertragung der Projekte an GitHub. **Das Repository und alle dort hinterlegten Referenzwerte sind öffentlich.** Browserdaten nicht löschen, bevor ein JSON-Backup gesichert ist.

## Prüfen

`npm test` führt automatisierte Referenz- und Eingabeprüfungen aus. `node --check app.js` und `node --check calculator.js` prüfen die JavaScript-Syntax. Diese Prüfungen laufen auch vor jeder automatischen Veröffentlichung.

### Grenzen

Das Modell basiert auf dem Projekt-Rechenblatt „Berechnung mit Formeln FTF BG95x40“ (12.11.2026). Haftung, Fahrzeugstabilität, Lastkollektiv, Bremsenergiepfad, thermische Last und Rücktrieb müssen separat geprüft werden. Bremswege enthalten keine Reaktionszeit, Verzögerungsaufbauzeit oder Sicherheitszuschläge.
