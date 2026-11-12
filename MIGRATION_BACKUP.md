# Sicherung und Plattformumzug

Stand: 12.11.2026 · FTF-Antriebsrechner v3.2

## Was ist wo gespeichert?

1. **App-Quellcode:** GitHub-Repository [BennyZ84/Ftf-antriebsrechner](https://github.com/BennyZ84/Ftf-antriebsrechner). Enthält HTML, CSS, JavaScript, Berechnungsmodelle, Motordatenbank, Getriebedatenbank, Tests, Web-App-Manifest und Icons. GitHub verwaltet zusätzlich die Versionshistorie (Git).
2. **Öffentliche App:** Statisch auf GitHub Pages unter https://bennyz84.github.io/Ftf-antriebsrechner/. Das ist der veröffentlichte Stand der Dateien, **kein unabhängiges Backup**.
3. **Benutzerprojekte:** Nur in `localStorage` des jeweiligen Browsers/Geräts unter `ftf-antriebsrechner-projects-v1`. Projekte werden **nicht** automatisch auf GitHub hochgeladen oder im Repository gesichert.

## Tragfähiges Offline-Backup

- [**Aktuellen Quellcode als ZIP herunterladen**](https://github.com/BennyZ84/Ftf-antriebsrechner/archive/refs/heads/main.zip) und auf mindestens einem eigenen Datenträger oder NAS sichern.
- In der App unter **Projekte & Export → Alle Projekte als JSON sichern** die persönliche `ftf-projekte-YYYY-MM-DD.json` herunterladen. Bei mehreren Geräten muss dieser Export **pro Gerät** erfolgen.
- Für vollständige Git-Historie (statt nur aktuellem ZIP) lokal ausführen:
  ```bash
  git clone --mirror https://github.com/BennyZ84/Ftf-antriebsrechner.git Ftf-antriebsrechner.git
  ```
  Verzeichnis `Ftf-antriebsrechner.git` auf externe Platte/NAS sichern. Diesen Git-Mirror getrennt vom GitHub-Konto aufbewahren.
- **Wichtig:** Der ZIP-Download allein sichert *keine* lokal gespeicherten Projekte, und die JSON-Datei allein sichert *keine* App.

## Umzug auf einen anderen Hoster

Die App ist eine reine statische HTML-/CSS-/JavaScript-PWA; kein GitHub-spezifisches Backend oder Datenbanksystem ist für die Berechnung nötig.

1. Quellcode-ZIP entpacken (oder Repository klonen).
2. Inhalt des Projektordners vollständig zu einem Hoster mit HTTPS hochladen, der statische Dateien ausliefert. `index.html`, `calculator.js`, `compatibility.js`, `app.js`, `auxiliary.js`, `stability.js`, `roller.js`, `styles.css`, `manifest.webmanifest`, `sw.js` und `icons/` zusammen behalten.
3. Auf der neuen HTTPS-Adresse öffnen; die Browser-PWA kann auf der neuen Domain neu installiert werden. Die Service-Worker-Cacheversion vor dem nächsten Release ändern, damit die neue Version aktualisiert wird.
4. In der App **Projekte & Export → JSON-Sicherung importieren** auswählen. Achtung: Das JSON importiert Projekte in den Browser auf der neuen Domain; sie erscheinen nicht automatisch durch Domainwechsel.
5. Motorwahl, Getriebewahl, eine Beispielberechnung, Offline-Funktion und das Importieren eines Testprojekts auf der neuen Adresse prüfen.
6. Für künftige Änderungen die Tests ausführen: `npm test` und `node --check app.js`.

## Risiken und Hinweise

- `localStorage`-Daten gehen möglicherweise verloren, wenn Browserdaten gelöscht werden, das Gerät gewechselt wird oder die Domain verändert wird. Vor jedem Umzug JSON exportieren.
- Aus dem öffentlichen GitHub-Repository darf man nicht schließen, dass die privaten Projektdaten dort liegen.
- Das Repo-Archiv ist **portable**, aber solange es nur bei GitHub liegt, keine plattformunabhängige Zweitsicherung. Das ZIP/Git-Mirror muss lokal oder bei einem unabhängigen Speicheranbieter abgelegt werden.
- Der Motorkatalog ist derzeit nicht vollständig. Vorläufige Daten sind als solche zu behandeln; Herstellerfreigabe bleibt erforderlich.
