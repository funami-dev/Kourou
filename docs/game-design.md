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
Isometrische Ansicht rund um das Hauptquartier. Gebäude werden gebaut und ausgebaut.

| Gebäude | Wirkung |
|---|---|
| Hauptquartier | Aufträge, Finanzen, Verwaltung |
| Hafen | Anlieferung von Raketen und Bauteilen; Ausbau = schnellere/größere Lieferungen |
| Montagehalle | Montage; Ausbau = mehr Raketen gleichzeitig, schnellere Montage |
| Startrampe | Startet Raketen; Ausbau = größere Raketen; mehrere Rampen möglich |
| Tanklager | Treibstoffvorrat, Betankungsdauer |
| Wetterstation | Bessere und frühere Prognosen im Countdown |
| Kontrollzentrum | Crew-Plätze im Countdown, schnellere Reaktion auf Störungen |
| Unterkünfte | Maximale Personalgröße |

### Raketen
- Erste fertige Modelle (fiktiv, Hersteller „Orbitalwerk“): **Ibis** (klein, kein GTO) und
  **Albatros** (schwer, auch GTO). Bezahlt wird bei Bestellung – nur mit eigenem Geld, die
  staatliche Förderung deckt keine Raketenkäufe.
- Lieferung per Schiff (10 Tage), danach Montage; die Montagehalle baut eine Rakete nach der anderen.
- **Fertige Modelle** (fiktiv) werden gekauft und angeliefert: einfach, zuverlässig und teuer.
- **Eigene Raketen** werden aus Bauteilen zusammengestellt: Stufen, Triebwerke, Tanks,
  Nutzlastverkleidung. Das ist günstiger und flexibler, aber mit eigener Zuverlässigkeit und eigenem Risiko.
- Kennwerte: Nutzlast pro Orbit, Zuverlässigkeit, Kosten, Montagedauer, Wetter-Grenzwerte
  (z. B. maximaler Bodenwind).
- Zuverlässigkeit steigt mit Erfahrung, also mit erfolgreichen Starts eines Modells oder Designs.

### Aufträge
- Fiktive Kunden bieten Nutzlasten an: Ziel-Orbit, Masse, Frist und Bezahlung.
- Angebote gelten nur einige Tage; täglich kommen neue hinzu.
- Bei Annahme gibt es eine **Anzahlung**, der Rest wird nach erfolgreichem Start bezahlt.
- Wird die Frist verpasst, verfällt der Auftrag: Der Rest wird nicht bezahlt, die Anzahlung darf
  man behalten. Später kostet ein verpasster Auftrag zusätzlich Ruf.
- Startfenster ergeben sich **vereinfacht** aus dem Ziel-Orbit, z. B. als feste Tageszeit-Spanne
  je Orbit-Typ statt einer echten Bahnberechnung.
- Mit steigendem **Ruf** werden größere und lukrativere Aufträge angeboten.

### Forschung
Zwei Wege, die sich ergänzen:
- **Forschungsaufträge (Auftragsforschung)**: Institute, Behörden und Firmen beauftragen
  Forschung – etwa Experimente, Studien oder Technologie-Erprobungen. Sie bringen Geld und Ruf.
- **Eigene Forschung**: Du entwickelst selbst neue Technologien (z. B. bessere Triebwerke,
  Wettervorhersage, Wiederverwendbarkeit) und schaltest damit Neues frei.

Details folgen in einem eigenen Schritt (offene Fragen siehe unten).

### Personal
- Einstellbare Mitarbeiter mit Rolle (z. B. Flight Director, Wetter, Antrieb, Range Safety)
  und Eigenschaften (erfahren, vorsichtig, risikofreudig …).
- Personal besetzt die Stationen im Countdown. Erfahrung beeinflusst, wie gut Störungen erkannt
  und gelöst werden.
- Bestehender Ansatz im Code: `crew`-State.

### Countdown & Start
- Eigene Ansicht, Spielzeit pausiert, Dauer **ca. 10 Minuten Echtzeit**.
- Spannungsbogen: Checklisten und Statusabfragen, Betankung, Go/No-Go-Polls, letzte Minuten
  mit automatischer Sequenz, Zündung.
- Echtzeit-Phase mit Funkprotokoll-Optik („T-minus 4:00 – Range: Go“).
- Go/No-Go-Abfrage der Stationen; Live-Wetter gegen die Grenzwerte der Rakete.
- Zufällige, ortsbezogene Störungen: Sensoranomalie, Boot in der Sperrzone, Ventil, Höhenwind.
- Entscheidungen: Hold, Weitermachen, Scrub.
- Danach folgen die Flugphasen (Max-Q, Stufentrennung, Orbit) als Telemetrie, ohne Physiksimulation.
- Ausgänge: **Erfolg**, **Scrub** oder **Fehlstart** (mit Schaden an der Rampe und am Ruf).

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
6. **Countdown** mit Go/No-Go gegen die Wetter-Grenzwerte und 1–2 Zufallsereignissen.
7. **Ergebnis**: Erfolg, Scrub oder Fehlstart → Geld und Ruf.

Erst danach folgen Forschung (Auftrags- und eigene Forschung), Gebäudebau, Personal-Management,
eigene Raketen und weitere Standorte.

## Offene Fragen

- **Forschung**: Wie läuft ein Forschungsauftrag ab – braucht er einen Start (Experiment im Orbit),
  Personal, Gebäude (Labor) oder nur Zeit? Wie ist die eigene Forschung aufgebaut (Technologiebaum,
  Forschungspunkte, Kosten)? Wie hängen beide zusammen (bringen Aufträge Fortschritt für die eigene
  Forschung)?
