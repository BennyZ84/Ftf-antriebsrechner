# FTF Antriebsrechner – GitHub Pages PWA

Installierbare Web-App (PWA) für iPhone/iPad und Windows ohne Server-Backend, Framework oder Developer-Account.

## Live stellen auf GitHub Pages

1. GitHub öffnen und **New repository** wählen, z. B. `ftf-antriebsrechner`. Ein **öffentliches** Repository anlegen (Free-Plan für Pages). Nicht in ein bestehendes anderes Projekt hochladen.
2. Dieses ZIP entpacken und **alle Dateien und Ordner des ZIP-Inhalts** ins Stammverzeichnis des neuen Repositories hochladen (GitHub: **Add file → Upload files → Commit changes**). Wichtig: `index.html` muss direkt im Repo-Stamm liegen.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → /(root) → Save**.
4. Nach erfolgreichem Deployment ist die App erreichbar über `https://BENUTZERNAME.github.io/ftf-antriebsrechner/` (bei anders benanntem Repository den Pfad entsprechend anpassen).
5. Link auf dem iPhone in **Safari** öffnen → **Teilen** → **Zum Home-Bildschirm** → **Als Web-App öffnen** aktivieren → **Hinzufügen**.
6. App einmal online öffnen, damit die Dateien offline zwischengespeichert werden. Für Updates neu laden (online).

**Datenschutz:** GitHub Pages veröffentlicht Quellcode/Referenzdaten öffentlich. Projekte werden ausschließlich lokal im jeweiligen Browser gespeichert, nicht an GitHub übertragen. Für Projekte und Sicherungen `Projekte & Export` → JSON exportieren. Kein vertrauliches Projektwissen in öffentliche Quellcodedateien eintragen.

## Funktionen

- Referenzwerte: **200 kg Leergewicht + 550 kg Zuladung = 750 kg Gesamtgewicht**, zwei Antriebe, Ø160 mm, i=16, η=0,80.
- Motor- und Getriebeauswahl, freie Bearbeitung der Motordaten und Antriebsparameter.
- Live-Berechnung der Geschwindigkeit, Motordrehzahl, Fahrwiderstände, Beschleunigungsmomente, Getriebegrenzen, Reserven und Bremswege.
- Steigung, Kurvenradius und Haftkraft als optionale Erweiterungen.
- Lokales Speichern mehrerer Projekte, Import/Export als JSON, Browser-Druck als PDF.
- Offline-Modus via Service Worker, Startbildschirm-Icon und iOS-Stand-alone-Ansicht.

## Herstellerdaten und fachliche Grenzen

Die Datenbank umfasst **noch nicht alle Dunkermotoren**. Der BG95x40 basiert auf der **48-V-Standardreferenz** aus dem Rechenblatt; die abweichende 40-V-Projektartikelnummer **88595.01992** ist nicht einzeln bestätigt. Der BG75x25 ist ausdrücklich ein leerer Platzhalter. Das NG500 i=16 basiert auf den im Rechenblatt dokumentierten Grenzen 21 Nm Dauer / 42 Nm Beschleunigung.

Eingetragene projektbezogene Werte dürfen frei verändert werden, gelten dadurch aber **nicht** als vom Hersteller verifizierte Daten. Berechnungen ersetzen keine thermische Auslegung, Haftungs-/Kippprüfung, Rücktriebsfreigabe oder Sicherheitsbetrachtung. Bremsweg ohne Reaktionszeit/Verzögerungsaufbau.

Quellen des Rechenmodells: `Berechnung_mit_Formeln_FTF_BG95x40.docx` (Stand 12.11.2026); Originalquellen darin: BG95 dCore-Datenblatt, NG500-Datenblatt und Dunkermotoren-Bremsenkatalog.

## Lokal testen (Windows)

- Im Projektordner `python -m http.server 8080` und anschließend `http://localhost:8080` öffnen (Service Worker nur localhost oder HTTPS).
- Berechnungstests: `npm test` oder `node --test tests/calculator.test.mjs` (Node.js nötig).
- Für einen iPhone-Test ist die Veröffentlichung unter HTTPS erforderlich.

## Aufbau

- `index.html` und `styles.css`: responsive Oberfläche
- `app.js`: Eingaben, Projekte, lokale Speicherung, Backup
- `calculator.js`: testbare Rechenlogik und Referenzdaten
- `sw.js`, `manifest.webmanifest`, `icons/`: Offline/PWA
- `tests/`: Referenzrechnungen und Eingabevalidierung