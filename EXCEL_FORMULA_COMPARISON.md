# Excel-Abgleich – A_25461 Berechnung Energie Antrieb Bremsweg.xlsx
Stand 12.11.2026 · App v2.5

## Quelle und Umfang
Ausgewertet wurden die Tabellenblätter **Projektdaten**, **Antriebsdaten**, **Standfestigkeit**, **Energieauslegung BAT**, **Flächenpressung Rollen**, **Trägheitsmoment**, **Auswahldaten** und die vorhandene Historie. Die Excel-Datei selbst wird nicht im öffentlichen Repository gespeichert.

## Gemeinsame Rechengrundlagen
- Radumfang / Motor-Nenndrehzahl: `n = v * i * 60 / (π * d)` in Excel (Antriebsdaten, Zeile 21), entsprechend `n = v * 60 * i / (2πr)` in der App.
- Rollreibung `m*g*μ`, Hangabtriebskraft `m*g*sin(atan(steigung/100))`. Die App berücksichtigt beim Rollen zusätzlich `cos(α)`; bei kleinen Steigungen ergeben sich geringe Differenzen.
- Antriebsbeschleunigung Excel: `F_Bes=m*a*Anfahrfaktor` (Zeile 31), aktuell 1,3. In der App wurde dieser *separat* ausgegebene Vergleichs-Lastfall ergänzt; die bisherige physikalische Grundmomentformel inkl. Rotorträgheit bleibt erhalten.
- Leistungsbedarf `P=F*v/η` in Excel (Antriebsdaten Zeilen 37–41); in der App als beladener/unbeladener Modellwert hinzugefügt. Excel-Referenz verwendet `η=0,77`, die App im bestehenden FTF-Referenzprojekt `η=0,80`. Für identische Resultate muss derselbe Wirkungsgrad eingestellt sein.

## Excel-Gegenproben mit gleicher Eingabe
- Gesamtmasse 18.000 kg; 0,5 % Steigung; Rollbeiwert 0,015; `a=0,1 m/s²`, Anfahrfaktor 1,3; `v=0,3 m/s`; `η=0,77`.
- Excel (Antriebsdaten): F_Roll=2648,7 N, F_Beschleunigung=2340 N, F_Hang=882,888964 N, F_gesamt=5871,588964 N, P_beschleunigt_mit_Steigung=2287,632064 W.
- Die App unterscheidet sich um etwa 0,033 N bei der Rollkraft, weil `cos(atan(0,005))` berücksichtigt wird. Automatisierter Vergleichstest mit Toleranzen aufgenommen.
- Bremsweg-Gegenprobe Excel (Antriebsdaten Zeilen 43 ff / Projektdaten): `v=0,30 m/s`, Geschwindigkeitstoleranz `0,05 m/s`, Reaktionszeit `0,4 s`, Verzögerung `0,8 m/s²`, Sicherheitsfaktor `1,2`. Ergebnis **259,875 mm**.
- Mit Scanner-Toleranz 65 mm, Bodenfreiheitszuschlag 150 mm und Reflexionszuschlag 350 mm: **824,875 mm**. Beide Zahlen sind als automatisierte Tests erfasst.

## Neue App-Felder in „Erweiterte Fahr- und Prüfparameter“
- Anfahrfaktor, standardmäßig 1,3 (Excel-Vergleich)
- Systemreaktionszeit 0,4 s
- Geschwindigkeitstoleranz 0,05 m/s
- Bremswegfaktor 1,2
- Scanner-Toleranz TR 65 mm
- Bodenfreiheitszuschlag ZF 150 mm
- Reflexions-Zuschlag ZR 350 mm
Diese Werte sind *Beispielwerte der hochgeladenen Tabelle*, keine allgemeinen Sicherheitsnormwerte. Für eine reale Scannerkonfiguration müssen Normen, Sensorreaktionen, Bremsmessungen und das Gesamtsystem bewertet werden.

## Wichtige Unterschiede / noch nicht umgesetzt
1. Excel berechnet beladene und unbeladene Lastfälle parallel, mehrere Leistungs- und Momentreserve-Fälle, Differenzialantrieb mit Winkelbeschleunigung und Trägheitsmoment. Die App berechnet bisher ein FTF-Projekt mit gewählter Beladung plus zusätzliche beladene/unbeladene Leistungswerte. Differentialregelung ist noch nicht in der Momentformel berücksichtigt.
2. Excel „Standfestigkeit“ prüft Kippmomente für Auflagepunkte und Schwerpunktkoordinaten, bei Fahrzeugen mit drei/vier Auflagepunkten. In der App noch nicht implementiert.
3. Excel „Flächenpressung Rollen“ verwendet die dort definierten Kontakt- und E-Modul-Formeln. In der App noch nicht implementiert; die Excel-Tabelle merkt ausdrücklich an, dass Änderungen nur geänderte Ergebnisse ergeben, ohne automatisch die Materialannahmen zu validieren.
4. Excel „Trägheitsmoment“ berechnet Hauptachsen-Trägheit und verwendet den Steiner-Anteil für versetzte Drehachsen. Die App berücksichtigt bisher nur Rotorträgheit in der Motorformel.
5. Excel „Energieauslegung BAT“ modelliert Fahrtabschnitte, Beschleunigung, Schleichfahrt, Fördertechnik, Steuerungsverbrauch, Batterien, Ladezyklen und Ladeleistung. In der App noch nicht implementiert.
6. **Plausibilitätswarnung im hochgeladenen Excel-Beispiel:** „Gesamtfahrkurs“ enthält eine Gesamtdauer von etwa **376,30 min** je Kurs und gleichzeitig **30 Zyklen pro Tag**. Daraus resultieren rechnerisch **188,15 Betriebsstunden pro Tag** und **43.274 h pro Jahr**, was physikalisch nicht durchführbar ist. Diese Werte nicht unverändert als universelle Batterieauslegungsreferenz übernehmen.
7. Die Excel-Feder-/Bremsschemata und Sensorzuschläge ersetzen weder den Bremsversuch noch einen Sicherheitsnachweis.

## Änderungsphilosophie
Alle ursprünglichen Referenzwerte des Nutzers (200 kg leer + 550 kg Last, 160 mm Rad, 2 Antriebe, BG95x40/NG500) bleiben bestehen. Die Excel-spezifischen Werte ergänzen die App als auswählbare/änderbare Auslegungsparameter. Die bereits vorhandene reine Bremswegformel **ohne Reaktionszeit** bleibt erhalten; die Excel-nahe Sicherheits-/Reaktionsformel wird zusätzlich angezeigt, statt die physikalische Größe stillschweigend zu ersetzen.

## Prüfung
Die GitHub Actions führen bei jeder Änderung syntax- und kalkulationsbezogene Tests aus. Keine funktionale oder sicherheitstechnische Freigabe.
