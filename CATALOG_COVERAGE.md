# Dunkermotoren-Katalogabdeckung – Stand 12.11.2026 (App v2.4)

## Verifizierter, rechenbarer Datenbestand

**87 Motor-Spannungs-/Steuerungsvarianten** und **220 Getriebeübersetzungen aus 18 Getriebebaureihen**.
Die Einträge enthalten die für die Vorauslegung benötigten Nenn-/Maximalmoment-, Drehzahl- und Trägheitswerte beziehungsweise Übersetzung, Wirkungsgrad und Momente. Jedes Datenobjekt besitzt eine Herstellerquelle.

Motorkategorien: BG32, BG42, BG45, BG62, BG65, BG66, BG75, BG95 dCore; BG66/BG75 dMove; BG66/BG75 dPro (nur durch Herstellerunterlagen dokumentierte Schnittstellenvarianten).

Getriebebaureihen:

- NG 250 (6), NG 500 (6)
- PLG 40 LB (19), PLG 52 EB (18), PLG 52 HT (10)
- PLG 60 LN (11), PLG 60 LB (19), PLG 63 EP (23), PLG 63 HT (12)
- PLG 75 EP (13), PLG 75 HT (21), PLG 75 SL (8)
- PLG 80 LB (19), PLG 95 HT (12)
- STG 65 (3), SG 120 (11), SG 120 K (2), KG 120 (7)

## Abgleich mit offiziellen Herstellerunterlagen 2025/26

Hauptquelle: [Dunkermotoren Gesamtkatalog 2025/26](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/catalogues/de-and-en/1_gesamtkatalog_web.pdf?la=en&revision=be4584e4-0293-497c-bbba-99c687c6da7d) und [Lieferübersicht](https://www.dunkermotoren.com/-/media/project/oneweb/oneweb/dunkermotoren/downloads/pdf/downloads/catalogues/de-and-en/4_lieferbersicht_web.pdf?la=en&revision=8da553d3-645f-4757-ad36-341ab63e1a7b).

Zu den **17 in der Lieferübersicht aufgeführten PLG-Getriebebaureihen** liegen jetzt in der Berechnungsdatenbank 12 Baureihen mit mindestens einigen belegten Einzelübersetzungen vor. Fehlende/noch nicht vollständig erfasste PLG-Familien: PLG22 HT, PLG30, PLG32, PLG42 K und PLG42 S. PLG63 HT enthält bewusst nur 12 tabellarisch belegte Ausführungen; unklare Tabellenzellen wurden nicht interpoliert.

Weitere noch nicht vollständig erfasste Gruppen: SG45/62/65/80/85, KG80/150, WG52/63/75, NG1000 WO (vorläufige Herstellerwerte), bürstenbehaftete GR-/PM-Reihen, weitere BG/BGA-Varianten, weitere dGo-/dMove-/dPro-Schnittstellenvarianten sowie AC-Motoren. Die *Anzahl lieferbarer Einzelartikel* ist nicht aus dem Katalog ableitbar: Dunkermotoren weist auf einen separat gepflegten Online-Konfigurator und anwendungsspezifische Kombinationen hin.

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
