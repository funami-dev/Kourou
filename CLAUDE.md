# Kourou – Hinweise für die Entwicklung

Kourou ist ein Aufbau- und Management-Spiel (Tycoon) rund um einen Weltraumbahnhof.
Es läuft im Desktop-Browser und nutzt echte Daten (z. B. Wetter und Tageszeit am Standort).

## Grundsatz

Code wird für Menschen geschrieben. Lesbarkeit geht vor Kürze und Cleverness.

## Code-Richtlinien

- **Sprechende Namen**: Variablen, Funktionen und Typen sagen, was sie sind oder tun
  (`launchWindowOpensAt` statt `lwo`). Bezeichner und Code-Kommentare auf Englisch.
- **Kleine Einheiten**: Eine Funktion, eine Aufgabe. Komponenten bleiben schlank; Spiellogik
  gehört in Services oder den Store, nicht ins Template oder die Komponente.
- **Kommentare erklären das Warum**, nicht das Was. Spielregeln und Formeln bekommen einen
  kurzen Kommentar mit Begründung oder Quelle.
- **Keine magischen Zahlen**: Balancing-Werte als benannte Konstanten an einer zentralen Stelle.
- **Strikte Typen**: kein `any`; Modelle als `interface`/`type`, Zustände als Union-Typen.
- **Moderne Angular-Patterns**: Standalone-Komponenten, `inject()`, Signals, neue
  Control-Flow-Syntax (`@if`, `@for`), `OnPush`-fähig denken.
- **State**: Spielzustand im NGXS-Store, Änderungen nur über Actions.
- **Externe Daten** (Wetter-APIs usw.) laufen über eigene Services mit klaren Modellen und
  Fehlerbehandlung; das Spiel muss auch ohne Netz sinnvoll reagieren.
- **Tests** für Spiellogik und Berechnungen (Vitest).
- **Formatierung und Linting**: Prettier (`.prettierrc`) und ESLint (`npm run lint`) müssen
  sauber durchlaufen.
- **Commits** nach Conventional Commits (`feat:`, `fix:`, `refactor:` …).
