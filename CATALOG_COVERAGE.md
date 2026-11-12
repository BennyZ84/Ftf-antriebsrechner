# Dunkermotoren-Katalogabdeckung – Stand 12.11.2026 (App v3.2)

## Erfasster Datenbestand (einschließlich ausdrücklich vorläufiger Referenzwerte)

**135 Motor-Spannungs-/Steuerungsvarianten (davon 11 vorläufig)** und **346 Getriebeübersetzungen aus 32 Getriebebaureihen**. Diese Anzahl ist **keine Zahl verfügbarer Artikelnummern** und keine Vollständigkeitsbestätigung des Dunkermotoren-Portfolios.

Erfasste Motorserien: BG32/42/45/62/65/66/75/95 dCore (Auswahl), BG45/65/66/75 dMove und BG45/66/75/95 dPro (Auswahl an CO/IO bzw. PN/EC/EI Varianten). Neu: BG42 dGo (5 Spannungsausführungen, vorläufig) und BGA22 dGo (6 Wicklungs-/Spannungsvarianten, vorläufig).

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

**Katalog nicht vollständig** bleibt deshalb eine korrekte Kennzeichnung. Die Herstellerdatenbanken und der Online-Konfigurator umfassen zusätzlich zahlreiche individuelle Artikel- und Motor-Getriebe-Anbauten. Eine vollständige Erfassung sämtlicher lieferbarer Artikel ist mit den verifizierten öffentlich zugänglichen Tabellen nicht nachgewiesen. Die 17 PLG-Familien sind baureihenseitig abgedeckt, aber nicht alle Artikelkonfigurationen und zulässigen Lastkollektive.

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

## Katalognachtrag v3.1

- **SG 65:** 10,25:1, Auslegungswirkungsgrad 0,8, Dauerdrehmoment 4 Nm, Spitzenmoment 7 Nm. Direkt aus dem [Herstellerdatenblatt SG65](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/products/new/gearboxes/angular/sg/sg-65.pdf?la=pt-br&revision=9b31937b-f467-4705-bcc1-64d18f94152c).
- **NG 1000 WO:** 20:1, Wirkungsgrad 85 %, Dauer 80 Nm, Beschleunigung 160 Nm laut ausdrücklich **vorläufigem** [Datenblatt](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/products/006_gearboxes/029_ng-1000_wo.pdf?hash=6614E47D07D52F584FA2D1AE71E4C139&la=en&revision=dbcf2e52-35eb-482b-be92-64f9e130e00a). Im Rechner als vorläufig markiert und nicht als bestätigte Baukasten-/Artikelkombination ausgewiesen; separate Freigabe erforderlich.
- **WG52/63/75:** Neuere offiziell gelistete Kombinationsgetriebe. Mangels eindeutiger, verifizierbarer Einzelübersetzungs-/Grenzwerttabellen nicht mit interpolierten Werten ergänzt. [Offizielle Baureihenseite](https://www.dunkermotoren.com/de-de/products/gearboxes/angular-gears/combination-gearboxes).
- **dGo/BGA22 und weitere dMove/dPro:** Einige aktuelle Herstellerunterlagen bezeichnen die Kennwerte als vorläufig. Diese Motoren sind weiterhin nicht als **bestätigte** Berechnungsdatensätze aufgenommen. [BG42 dGo Datenblatt](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/products/new/motors/bg/dgo/bg-42-dgo.pdf?la=pt-br&revision=6d0ce8b1-fc74-42a3-b71b-63a19d6b6125).

**Status: 135 Motordatensätze (davon 11 vorläufig); 346 Getriebeübersetzungsdatensätze (davon 1 vorläufig). Vollständigkeit des Gesamtportfolios nicht bestätigt.**

## Nachtrag v3.2 – dGo und externe Sicherung

- BG42 dGo: 5 Varianten mit Nenndrehzahl, Drehmoment, Leerlaufdrehzahl und Rotorträgheit aus dem [BG42-dGo-Herstellerdatenblatt](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/products/new/motors/bg/dgo/bg-42-dgo.pdf?la=pt-br&revision=6d0ce8b1-fc74-42a3-b71b-63a19d6b6125). **Sämtliche Werte als vorläufig gekennzeichnet; Motor/Getriebe-Verbindungen nicht als freigegeben eingestuft.**
- BGA22x22 dGo: 6 Wicklungen (6/12/24 V) aus dem [Produktdatenblatt](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/products/new/motors/bg/dgo/bga-22-dgo.pdf?la=pt-br&revision=3f536c48-3639-4db1-a408-d7ecabd80e0a); die Funktionsbeschreibung bezeichnet technische Daten als vorläufig. Der Hersteller nennt ein **Anhaltemoment**, kein freigegebenes Spitzenmoment. Deshalb bleibt `peak=0` (nicht angegeben), während `stallTorque` separat gespeichert ist.
- Noch nicht einzeln belastbar belegte neue WG52/63/75-Getriebewerte werden **nicht erfunden**. Die Hersteller-Produktseite nennt eine WG-Übersetzung bis 320:1, aber keine vollständige Zuordnung von Übersetzung, Wirkungsgrad, Dauer- und Beschleunigungsmoment je Baugröße. [WG-Baureihenseite](https://www.dunkermotoren.com/de-de/products/gearboxes/angular-gears/combination-gearboxes).
- Vorhandene App-/Projekt-Sicherungs- und Migrationsanleitung: [MIGRATION_BACKUP.md](MIGRATION_BACKUP.md). GitHub ist Versionsverwaltung, aber **kein unabhängiges Offline-Backup**; Quellcode-ZIP und Browserprojekt-JSON müssen getrennt gesichert werden.

**Gesamtkatalog vollständig? Nein.** Es gibt weiter offene Baukasten- und Artikelnummern-Zuordnungen, neuere Baureihen und einen nicht abgeschlossenen Hersteller-Nachweis auf Einzelartikelniveau.
