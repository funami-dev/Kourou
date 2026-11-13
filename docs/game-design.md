# Kourou – Game Design

> Lebendes Dokument. Entscheidungen werden hier festgehalten, offene Punkte stehen am Ende.

## Vision

Kourou ist ein **Weltraumbahnhof-Tycoon** für den Desktop-Browser. Du baust einen Startplatz auf,
nimmst Aufträge an und bringst Nutzlasten ins All – unter **echten Bedingungen**: Der Start selbst
findet beim aktuellen Wetter und zur aktuellen Tageszeit am Standort statt.

Es gibt **kein Spielende**. Motivation entsteht durch Wachstum, freigeschaltete Möglichkeiten,
eigene Rekorde und die Spannung jedes einzelnen Starts.

## Getroffene Entscheidungen

| Thema | Entscheidung |
|---|---|
| Genre | Aufbau / Management (Tycoon) |
| Plattform | Nur Desktop-Browser |
| Daten | Echt: Live-Wetter und Ortszeit am Startplatz |
| Zeitmodell | Hybrid: Betrieb in beschleunigter Spielzeit, der Start nutzt Live-Bedingungen |
| Raketen | Beides: fertige Modelle kaufen **und** eigene aus Bauteilen zusammenstellen |
| Ziel | Offene Sandbox ohne Endziel |
| Inhalte | Fiktive Kunden, Firmen und Raketenmodelle; reale Orte und Naturdaten |
| Spieltempo | 1 Spieltag = 60 Minuten Echtzeit (1 Spielstunde = 2,5 Minuten) |
| Countdown | Eigene Ansicht; die Spielzeit pausiert währenddessen |
| Bankrott | Nicht möglich: Der Staat springt ein und bewilligt neue Mittel, ohne negative Folgen |
| Weltstimmung | Alle lieben die Weltraumforschung – ein optimistischer, wohlwollender Grundton |
| Countdown-Dauer | ca. 10 Minuten Echtzeit, mit allen Checks und Spannungsbogen |
| Startfenster | Vereinfacht modelliert |

## Kernschleife

```
Auftrag annehmen
  → Rakete beschaffen (kaufen oder selbst bauen)
  → Bauteile/Rakete per Schiff anliefern und montieren
  → zur Startrampe bringen und betanken
  → Countdown unter Live-Bedingungen
  → Start → Bezahlung + Ruf
  → Basis ausbauen, Personal einstellen, Neues freischalten
  → größere und lukrativere Aufträge
```

## Zeitmodell (Hybrid)

Zwei Zeitebenen laufen nebeneinander:

**Betriebszeit (beschleunigt)**
- Bau, Lieferungen, Montage, Gehälter und laufende Kosten laufen in Spielzeit:
  **1 Spieltag = 60 Minuten Echtzeit** (1 Spielstunde = 2,5 Minuten).
- Die Spielzeit läuft nur, solange das Spiel geöffnet ist. Pausieren und Tempo ändern sind möglich.

**Startzeit (live)**
- Sobald eine Rakete startbereit auf der Rampe steht, kann der Countdown beginnen.
- Der Countdown hat eine **eigene Ansicht**. Währenddessen **pausiert die Spielzeit**.
- Der Countdown läuft unter den **aktuellen echten Bedingungen** in Kourou:
  Wind, Böen, Niederschlag, Gewitter, Bewölkung und Tag/Nacht.
- Ist das Wetter schlecht, entscheidest du: **jetzt riskieren, warten oder abbrechen (Scrub)**.
  Wartende Raketen kosten Rampengebühren in Spielzeit.
- Die Ortszeit (UTC−3) bestimmt außerdem die Optik der Basis (Tag/Nacht).

So bleibt der Betrieb flüssig spielbar, und trotzdem fühlt sich jeder Start echt an.
Ein Start bei Sonnenuntergang und echtem Gewitter am Horizont ist ein Moment, den man nicht vergisst.

## Echte Daten

| Daten | Quelle (Kandidat) | Verwendung |
|---|---|---|
| Aktuelles Wetter + Kurzfristprognose | Open-Meteo (kostenlos, ohne API-Key) | Startbedingungen, Countdown-Ereignisse |
| Sonnenauf-/-untergang | Open-Meteo | Tag/Nacht, Startfenster |
| Standort-Geodaten | fest im Spiel hinterlegt | Äquatorbonus, Startrichtungen |

**Ohne Netz** fällt das Spiel auf plausible, saisonal passende Werte zurück und weist darauf hin.

Die Wetterdaten von Open-Meteo stehen unter CC BY 4.0 und werden im Spiel (Wetter-Seite) genannt.
Aktualisiert wird alle 15 Minuten – so oft, wie Open-Meteo neue aktuelle Werte liefert.

### Ortsbezogene Realismus-Details für Kourou
- **Äquatornähe (~5° N)**: mehr Nutzlast, vor allem für den geostationären Orbit.
- **Jahreszeiten**: Regenzeit ca. Dezember–Juli, Trockenzeit ca. August–November.
  Diese Jahreszeiten entstehen von selbst, weil der Start das Live-Wetter nutzt.
- **Startrichtung über den Atlantik**: Sperrzonen auf See; Ereignisse wie Boote in der Sperrzone.
- **Logistik per Schiff**: Bauteile kommen über den Hafen, mit Lieferzeiten.

## Systeme

### Basis & Gebäude
Isometrische Ansicht rund um das Hauptquartier. Gebäude werden auf einer eigenen Seite gebaut und
ausgebaut; Bau kostet eigenes Geld und dauert Tage, gebaute Stufen kosten Unterhalt. Während eines
Ausbaus arbeitet das Gebäude auf der bisherigen Stufe weiter.

| Gebäude | Start | Stufen | Wirkung |
|---|---|---|---|
| Hauptquartier | vorhanden | – | Aufträge, Finanzen, Verwaltung |
| Montagehalle | Stufe 1 | bis 3 | Jede Stufe = eine Montagebucht, also eine Rakete mehr gleichzeitig in Montage |
| Hafen | Stufe 1 | bis 3 | Ab Stufe 2 je Stufe 2 Tage schnellere Lieferung |
| Kontrollzentrum | Stufe 1 | bis 3 | Training: ab Stufe 2 zählt das Personal im Countdown je Stufe eine Erfahrungsstufe höher |
| Labor | – | bis 3 | Laborplätze für Forschung und Studien |
| Wetterstation | – | bis 2 | Je Stufe 20 % kürzere Wetter-Holds (zusätzlich zum Wetterradar) |
| Unterkünfte | – | bis 3 | Je Stufe 4 Plätze mehr im Team |

Später denkbar: weitere Startrampen, Tanklager.

### Raketen
**Fertige Modelle** (fiktiv, Hersteller „Orbitalwerk“): **Ibis** (klein, kein GTO) und **Albatros**
(schwer, auch GTO) – teuer, aber erprobt und zuverlässig.

**Eigene Konstruktionen** aus Bauteilen:
| Bauteil | Auswahl | Wirkung |
|---|---|---|
| Kernstufe | K1 leicht, K2 mittel, K3 schwer | Grundlast in den LEO, Wind-Grenzwert |
| Booster | 0, 2 oder 4 Feststoff-Booster | mehr Nutzlast, je Paar etwas stabiler im Wind |
| Oberstufe | O1 einfach, O2 kryogen | O1 erreicht keinen GTO; O2 bringt 35 % der LEO-Nutzlast in den GTO |
| Verkleidung | klein (bis 2,5 t), groß (bis 15 t) | begrenzt die Nutzlast |

- SSO-Nutzlast = 75 % der LEO-Nutzlast (polare Bahn, keine Hilfe durch die Erdrotation).
- Preis und Montagedauer ergeben sich aus den Teilen; Zuverlässigkeit = Produkt der Teile minus
  8 Prozentpunkte für eine unerprobte Konstruktion.
- **Erfahrung**: Jeder erfolgreiche Start erhöht die Zuverlässigkeit um 1 Prozentpunkt – bei eigenen
  Konstruktionen bis die 8 Punkte aufgeholt sind, bei Katalogmodellen um höchstens 2 Punkte.

**Für alle Raketen**
- Bezahlt wird bei Bestellung – nur mit eigenem Geld.
- Lieferung per Schiff (10 Tage, schneller mit Hafen-Ausbau und Hafenlogistik), danach Montage in der
  Montagehalle (eine Rakete je Montagebucht gleichzeitig).
- Kennwerte: Nutzlast pro Orbit, Zuverlässigkeit, Preis, Montagedauer, Böen-Grenzwert.

### Aufträge
- Fiktive Kunden bieten Nutzlasten an: Ziel-Orbit, Masse, Frist und Bezahlung.
- Angebote gelten nur einige Tage; täglich kommen neue hinzu.
- Bei Annahme gibt es eine **Anzahlung**, der Rest wird nach erfolgreichem Start bezahlt.
- Wird die Frist verpasst, verfällt der Auftrag: Der Rest wird nicht bezahlt, die Anzahlung darf
  man behalten, aber es kostet Ruf. Eine Rakete, die dafür auf der Rampe stand, kommt zurück in die Flotte.
- Startfenster ergeben sich **vereinfacht** aus dem Ziel-Orbit, z. B. als feste Tageszeit-Spanne
  je Orbit-Typ statt einer echten Bahnberechnung.
- Mit steigendem **Ruf** werden größere und lukrativere Aufträge angeboten.

### Forschung
Zwei Wege, die sich ergänzen und über **Forschungspunkte (FP)** verbunden sind.

**Labor (erstes Gebäude)**
- Wird auf dem Gelände gebaut und in Stufen ausgebaut (Stufe 1–3). Jede Stufe bringt einen
  **Laborplatz**; Bau und Ausbau kosten Geld und dauern einige Tage, das Labor kostet Unterhalt pro Tag.
- Freie Laborplätze erzeugen jeden Tag Forschungspunkte. Studien für Kunden belegen einen Platz –
  so entsteht die Abwägung: **Geld durch Aufträge oder Punkte für die eigene Forschung**.

**Eigene Forschung (Technologiebaum)**
- Technologien bauen aufeinander auf. Eine Technologie kostet FP und Geld (beim Start bezahlt) und
  braucht einige Tage; es läuft immer ein Forschungsprojekt gleichzeitig. Voraussetzung: ein Labor.
- Jede Technologie hat eine konkrete Wirkung im Spiel, z. B. kürzere Wetter-Holds, keine Boote mehr
  in der Sperrzone, höhere Zuverlässigkeit, schnellere Montage, geringere Betriebskosten.

**Forschungsaufträge (Auftragsforschung)**
- Fiktive Institute und Firmen bieten zwei Arten an:
  - **Studien am Boden**: belegen einen Laborplatz für einige Tage, dann gibt es Geld und FP.
  - **Experimente im All**: kleine Nutzlasten, die als **Mitfluglast** bei einem Start mitfliegen,
    wenn die Rakete noch Kapazität frei hat. Erfolgreicher Start → Geld und FP; Fehlstart → Experiment
    verloren; Frist verpasst → Auftrag verfällt.
- Mitfluglasten machen auch Starts mit kleiner Hauptnutzlast lohnender.

**Technologiebaum (erste Version)**
| Zweig | Stufe 1 | Stufe 2 |
|---|---|---|
| Startbetrieb | Wetterradar: Wetter-Holds halb so lang | Sperrzonen-Überwachung: keine Boote mehr in der Sperrzone |
| Zuverlässigkeit | Qualitätssicherung: +2 Prozentpunkte Erfolgschance | Redundante Sensoren: keine Sensoranomalien mehr |
| Infrastruktur | Modulare Montage: 30 % schneller montiert | Hafenlogistik: Lieferung 3 Tage schneller |

Stufe 1 kostet 30 FP, 2 Mio. € und 4 Tage; Stufe 2 kostet 60 FP, 4 Mio. € und 6 Tage.

### Personal
- **Positionen im Kontrollzentrum**: Flugleitung plus je eine Fachkraft für Antrieb, Lenkung,
  Sperrgebiet, Wetter und Flugdynamik. Ohne vollständige Besetzung startet kein Countdown.
  Ein neues Spiel beginnt mit einem kompletten, aber unerfahrenen Team.
- An jeder Position sitzt automatisch die **erfahrenste Person** ihres Fachs; weitere sind Vertretung.
- **Erfahrung** (Stufe 1–5) wächst mit jedem Countdown. Sie verkürzt Holds an der eigenen Station,
  senkt das Risiko beim Weitermachen trotz Problem und erhöht – bei der Flugleitung – die Erfolgschance.
- **Eigenschaften**: *Ruhig* (kürzere Holds), *Gründlich* (geringeres Risiko), *Lernt schnell*
  (doppelte Erfahrung).
- **Bewerbungen** kommen täglich herein und bleiben eine Woche offen. Einstellen kostet einmalig
  Einstellungskosten; jede Person kostet täglich Gehalt (steigt mit der Erfahrung).
- Die Teamgröße ist begrenzt; **Unterkünfte** erweitern sie.

### Startrampe & Countdown
**Vorbereitung (Startrampe)**
- Eine montierte Rakete, die die Nutzlast tragen kann, wird für einen angenommenen Auftrag auf die
  Rampe gebracht. Es gibt vorerst **eine** Rampe. Solange eine Rakete darauf steht, fällt eine
  **Rampengebühr** pro Spieltag an.
- **Startfenster (vereinfacht)** als feste Ortszeit-Spanne je Orbit: LEO 06–22 Uhr, SSO 18–06 Uhr,
  GTO 16–24 Uhr. Der Countdown kann nur starten, wenn das Fenster beim Abheben (10 Minuten später)
  offen ist.
- Die Rampe zeigt Startfenster und Live-Wetter samt Go/No-Go-Einschätzung schon vor dem Start.

**Countdown (eigene Ansicht, ca. 10 Minuten Echtzeit, Spielzeit steht still)**
- Fester Ablauf im Funkprotokoll: Start des Countdowns, Betankung, Wetterbriefing, Go/No-Go-Abfrage
  bei T−4:00 (Antrieb, Lenkung, Sperrgebiet, Wetter, Flugdynamik), automatische Sequenz ab T−1:00, Zündung.
- **Wetter-Go/No-Go** mit Live-Daten: kein Start bei Gewitter oder bei Böen über dem Grenzwert der
  Rakete (Ibis 14 m/s, Albatros 17 m/s). Regen allein ist erlaubt.
- **1–2 zufällige Störungen** pro Countdown: Boot in der Sperrzone, Sensoranomalie, starke Höhenwinde.
- **Entscheidungen**: *Halten* (Hold; danach ist das Problem gelöst bzw. das Wetter wird neu
  geprüft), *Trotzdem weiter* (senkt die Erfolgschance) oder *Abbrechen* (Scrub). Ein Boot in der
  Sperrzone und ein geschlossenes Startfenster lassen sich nicht ignorieren.
- Holds verschieben das Abheben – schließt sich dadurch das Startfenster, bleibt nur der Scrub.

**Flug**
- Flugphasen als Telemetrie (Startturm, Max-Q, Stufentrennung, Verkleidung, Orbit), ohne
  Physiksimulation, etwa sechsmal schneller als Echtzeit (ca. 1,5 Minuten).
- Beim Abheben entscheidet die Erfolgschance (Zuverlässigkeit der Rakete minus eingegangene Risiken),
  ob und in welcher Phase ein Fehler auftritt.

**Ergebnis**
| Ausgang | Geld | Ruf | Rakete | Auftrag |
|---|---|---|---|---|
| Erfolg | Restzahlung des Kunden | +5 | verbraucht | erfüllt |
| Fehlstart | Reparatur der Rampe | −10 | verloren | gescheitert (Anzahlung bleibt, Versicherung des Kunden) |
| Scrub | Kosten des Abbruchs | ±0 | bleibt auf der Rampe | läuft weiter |

### Ruf
- Skala 0–100, Start bei 50; sichtbar in der Toolbar.
- Erfolg +5, Fehlstart −10, verpasste Frist −5.
- Später: Der Ruf entscheidet, welche Aufträge Kunden anbieten.

### Wirtschaft
- Einnahmen: Auftragszahlungen.
- Ausgaben: Raketen und Bauteile, Bau und Ausbau, Gehälter, Treibstoff, Rampengebühren, Scrubs.
- Alle Balancing-Werte liegen zentral als benannte Konstanten vor.
- **Kein Bankrott**: Fällt der Kontostand unter null, springt der Staat ein und bewilligt neue Mittel –
  **ohne negative Folgen**. In dieser Welt lieben alle die Weltraumforschung; Scheitern gehört
  zum Fortschritt dazu. Der Druck im Spiel entsteht durch Ehrgeiz und Spannung, nicht durch Existenzangst.

### Langzeitmotivation (Sandbox)
- Freischaltungen über Ruf: neue Gebäudestufen, Bauteile, Auftragsklassen.
- **Weitere Startplätze** auf der Weltkarte mit echten Vor- und Nachteilen
  (Breitengrad, Klima, Kosten). Jeder Standort nutzt sein eigenes Live-Wetter.
- Statistiken und persönliche Rekorde: Starts, Erfolgsquote, Nutzlast gesamt, längste Serie.

## Technische Leitplanken

- Angular (Standalone, Signals) + NGXS für den Spielzustand.
- **Spielstand im Browser** (`@ngxs/storage-plugin` / localStorage); ein Backend ist vorerst nicht nötig.
- **Spiel-Uhr** als eigener Service bzw. State: Tick, Tempo, Pause. Die gesamte Simulation hängt daran.
- **Wetter-Service** als einzige Stelle für externe Wetterdaten, mit Caching und Fallback.
- Spiellogik als reine, testbare Funktionen, getrennt von der Darstellung.
- Code-Richtlinien: siehe [`CLAUDE.md`](../CLAUDE.md).

## MVP – erste spielbare Version

Ziel: **ein kompletter Durchlauf der Kernschleife** in Kourou.

1. ✅ **Spiel-Uhr** mit Pause und Tempo; Spielstand wird gespeichert.
2. ✅ **Geld** und einfache Finanzen (Kontostand, Einnahmen, Ausgaben).
3. ✅ **Aufträge**: eine kleine Liste generierter Aufträge, einen annehmen.
4. ✅ **Fertige Rakete kaufen** (1–2 Modelle) → Lieferung und Montage über Zeit.
5. ✅ **Live-Wetter Kourou** (Open-Meteo) inkl. Tag/Nacht der Basis nach echter Ortszeit.
6. ✅ **Countdown** mit Go/No-Go gegen die Wetter-Grenzwerte und 1–2 Zufallsereignissen.
7. ✅ **Ergebnis**: Erfolg, Scrub oder Fehlstart → Geld und Ruf.

Danach umgesetzt: ✅ Forschung mit Labor, Technologiebaum und Forschungsaufträgen.

Ebenfalls umgesetzt: ✅ Personal, ✅ weitere Gebäude, ✅ eigene Raketen aus Bauteilen.

Als Nächstes: weitere Startplätze auf der Weltkarte.

## Offene Fragen

- Derzeit keine. Neue Fragen werden hier gesammelt.