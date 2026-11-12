# Dunkermotoren-Katalogabdeckung – Stand 12.11.2026 (App v3.0)

## Verifizierter Datenbestand

**124 Motor-Spannungs-/Steuerungsvarianten** und **346 Getriebeübersetzungen aus 32 Getriebebaureihen**. Diese Anzahl ist **keine Zahl verfügbarer Artikelnummern** und keine Vollständigkeitsbestätigung des Dunkermotoren-Portfolios.

Erfasste Motorserien: BG32/42/45/62/65/66/75/95 dCore (Auswahl), BG45/65/66/75 dMove und BG45/66/75/95 dPro (Auswahl an CO/IO bzw. PN/EC/EI Varianten).

**17/17 in der ausgewerteten PLG-Hersteller-Lieferübersicht enthaltene Baureihen haben Datenbankeinträge:**
- PLG 22 HT (17), PLG 30 (14), PLG 32 (18)
- PLG 40 LB (19), PLG 42 K (16), PLG 42 S (16)
- PLG 52 EB (18), PLG 52 HT (10)
- PLG 60 LN (11), PLG 60 LB (19)
- PLG 63 EP (23), PLG 63 HT (12)
- PLG 75 EP (13), PLG 75 HT (21), PLG 75 SL (8)
- PLG 80 LB (19), PLG 95 HT (12)

Andere erfasste Familien: NG 250 (6), NG 500 (6), STG 65 (3), SG 45 (8), SG 62 (6), SG 65 (1), SG 80 (7), SG 80 K (4), SG 85 (1), SG 120 (11), SG 120 K (2), KG 80 (10), KG 120 (7), KG 150 (7), NG 1000 WO (1, ausdrücklich vorläufig).

**Grenzwerte:** Bei den fünf zuletzt ergänzten kleinen Planetengetrieben (PLG 22 HT, 30, 32, 42 K/S) sind die Dauermomente und Wirkungsgrade nach Herstellerangaben eingetragen. Wo kein eindeutiger Beschleunigungsgrenzwert je Übersetzung belegt ist, wird `peak:0` als **nicht angegeben** gespeichert; daraus darf kein sicheres Spitzenmoment abgeleitet werden. Die App kennzeichnet solche Grenzwerte als unvollständig. Bei PLG42 S wurde die niedrigere Dauermoment-Angabe für Kunststoffplaneten berücksichtigt, nicht der höhere Wert für Stahlplaneten.

## Herstellerquellen und Vollständigkeitsgrenzen

Hauptquelle: [Dunkermotoren Gesamtkatalog 2025/26](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/catalogues/de-and-en/1_gesamtkatalog_web.pdf?la=en&revision=be4584e4-0293-497c-bbba-99c687c6da7d), [Getriebe-Lieferübersicht](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/catalogues/de-and-en/4_lieferbersicht_web.pdf?la=en&revision=8da553d3-645f-4757-ad36-341ab63e1a7b) und die einzelnen verlinkten Herstellerdatenblätter direkt an jedem Getriebe- und Motordatensatz.

**Weiterhin nicht vollständig erfasst:** WG 52/63/75 und einzelne Übersetzungen/Lastgrenzen weiterer Familien; NG1000 WO bisher nur mit vorläufigen Herstellerwerten; weitere BG/BGA-dGo, dMove und dPro Motoren, GR/G/PM/KD, Varianten mit anderen Elektronikschnittstellen sowie vollständige Hersteller-Artikelnummern, Wellen-/Flanschkombinationen und aktuelle lieferbare Konfigurationen. Bei den BG42 dGo/dMove sind in den derzeit verfügbaren Dokumenten teilweise ausdrücklich vorläufige Angaben markiert; diese werden nicht als bestätigte Auslegungswerte ausgegeben.

**Katalog nicht vollständig** bleibt deshalb eine korrekte Kennzeichnung. Die 17 PLG-Familien sind baureihenseitig abgedeckt, aber nicht alle Artikelkonfigurationen und zulässigen Lastkollektive.

## Kompatibilität und Einschränkungen

- **family-listed**: Hersteller nennt die Motor-/Getriebebaureihen als Baukasten-Kombination, die mechanische Einzelkonfiguration ist aber noch nicht freigegeben.
- **unverified**: Kein nachgewiesener Baukastenbeleg; technische Kombinierbarkeit wird nicht behauptet.
- BG95x40 dCore + NG500 besitzt einen ausdrücklichen Herstellerbeleg.
- BG66 dMove und dPro PN/EC/EI verwenden eigene Baukastenlisten, nicht die dCore-Liste.
- BG75 dMove/dPro haben eigenständige Baukastenbelege.
- Bei LB-Planetengetrieben gilt für die hinterlegten S8-Dauermomente die im Herstellerdatenblatt genannte Eingangsdrehzahl. S1-Angaben sind teilweise separat gespeichert; die Lebensdauerfreigabe fehlt.
- Einige Herstellerangaben nennen nur den Verzahnungswirkungsgrad, nicht die vollständigen Verluste.
- BG66-Nennmomente sind für thermisch **isolierte** Montage im Basiswert hinterlegt; bei thermischer Anbindung sind höhere Katalogwerte als getrennte Eigenschaften gespeichert.
- Einzelartikel, Preise, aktuelle Lieferbarkeit, Motorflansch, Getriebewelle, thermischer Einsatzbereich und betriebsspezifische Freigaben sind **nicht vollständig geprüft**.

## Qualitätsprüfung

- GitHub Actions führt JavaScript-Syntaxchecks und Referenz-/Katalog-/Kompatibilitätstests aus.
- Mit **coverageComplete: false** wird ausdrücklich kein vollständiger und herstellerfreigegebener Katalog behauptet.
- Eine erfolgreiche Veröffentlichung beweist die Funktion der Web-App, nicht die technische Zulassung sämtlicher Antriebskombinationen.
