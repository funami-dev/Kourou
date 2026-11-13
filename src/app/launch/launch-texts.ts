import type {
  CountdownIssue,
  CountdownLogEntry,
  FlightPhase,
  LaunchOutcome,
  Milestone,
  Station
} from '../../game/launch/launch.model';
import type { WeatherConstraint } from '../../game/launch/launch-weather';
import type { StationCrew } from '../../game/staff/staff.model';

/** Player-facing texts for launches. Each `Record` makes sure every value has a text. */

const STATION_LABELS: Record<Station, string> = {
  propulsion: $localize`:@@launch.station.propulsion:Antrieb`,
  guidance: $localize`:@@launch.station.guidance:Lenkung`,
  range: $localize`:@@launch.station.range:Sperrgebiet`,
  weather: $localize`:@@launch.station.weather:Wetter`,
  flightDynamics: $localize`:@@launch.station.flightDynamics:Flugdynamik`
};

const MILESTONE_TEXTS: Record<Milestone, string> = {
  countdownStarted: $localize`:@@launch.milestone.countdownStarted:Countdown gestartet. Alle Stationen sind besetzt.`,
  propellantLoadingStarted: $localize`:@@launch.milestone.propellantLoadingStarted:Betankung der Rakete beginnt.`,
  propellantLoadingCompleted: $localize`:@@launch.milestone.propellantLoadingCompleted:Betankung abgeschlossen, Tanks unter Druck.`,
  weatherBriefing: $localize`:@@launch.milestone.weatherBriefing:Wetterbriefing: Die aktuellen Bedingungen in Kourou werden geprüft.`,
  goNoGoPoll: $localize`:@@launch.milestone.goNoGoPoll:Go/No-Go-Abfrage aller Stationen.`,
  terminalCount: $localize`:@@launch.milestone.terminalCount:Die automatische Startsequenz übernimmt.`,
  liftoff: $localize`:@@launch.milestone.liftoff:Zündung – und Abheben!`
};

const ISSUE_TITLES: Record<CountdownIssue, string> = {
  boatInRangeZone: $localize`:@@launch.issue.boatInRangeZone:Boot in der Sperrzone`,
  sensorAnomaly: $localize`:@@launch.issue.sensorAnomaly:Sensoranomalie`,
  upperLevelWinds: $localize`:@@launch.issue.upperLevelWinds:Starke Höhenwinde`,
  weatherNoGo: $localize`:@@launch.issue.weatherNoGo:Wetter: No Go`,
  launchWindowClosed: $localize`:@@launch.issue.launchWindowClosed:Startfenster geschlossen`
};

const ISSUE_DESCRIPTIONS: Record<CountdownIssue, string> = {
  boatInRangeZone: $localize`:@@launch.issue.boatInRangeZone.description:Ein Fischerboot ist in die Sperrzone vor der Küste gefahren. Die Küstenwache ist unterwegs. Solange das Boot dort ist, darf nicht gestartet werden.`,
  sensorAnomaly: $localize`:@@launch.issue.sensorAnomaly.description:Ein Drucksensor der Oberstufe liefert unplausible Werte. Vermutlich ein Messfehler – sicher ist das aber nicht.`,
  upperLevelWinds: $localize`:@@launch.issue.upperLevelWinds.description:Wetterballone melden starke Winde in großer Höhe. Sie belasten die Rakete kurz nach dem Start.`,
  weatherNoGo: $localize`:@@launch.issue.weatherNoGo.description:Das aktuelle Wetter in Kourou liegt außerhalb der Startgrenzen der Rakete.`,
  launchWindowClosed: $localize`:@@launch.issue.launchWindowClosed.description:Zum geplanten Startzeitpunkt ist das Startfenster für diesen Orbit geschlossen. Heute ist kein Start mehr möglich.`
};

const FLIGHT_PHASE_TEXTS: Record<FlightPhase, string> = {
  towerCleared: $localize`:@@launch.flightPhase.towerCleared:Startturm passiert.`,
  maxQ: $localize`:@@launch.flightPhase.maxQ:Max-Q – maximale aerodynamische Belastung überstanden.`,
  stageSeparation: $localize`:@@launch.flightPhase.stageSeparation:Stufentrennung bestätigt.`,
  fairingSeparation: $localize`:@@launch.flightPhase.fairingSeparation:Nutzlastverkleidung abgetrennt.`,
  orbitInsertion: $localize`:@@launch.flightPhase.orbitInsertion:Orbit erreicht, Nutzlast ausgesetzt.`
};

const FLIGHT_PHASE_NAMES: Record<FlightPhase, string> = {
  towerCleared: $localize`:@@launch.flightPhase.towerCleared.name:Verlassen des Startturms`,
  maxQ: $localize`:@@launch.flightPhase.maxQ.name:Max-Q`,
  stageSeparation: $localize`:@@launch.flightPhase.stageSeparation.name:Stufentrennung`,
  fairingSeparation: $localize`:@@launch.flightPhase.fairingSeparation.name:Abtrennung der Verkleidung`,
  orbitInsertion: $localize`:@@launch.flightPhase.orbitInsertion.name:Einschuss in den Orbit`
};

const OUTCOME_TEXTS: Record<LaunchOutcome, string> = {
  success: $localize`:@@launch.outcome.success:Mission erfolgreich!`,
  failure: $localize`:@@launch.outcome.failure:Fehlstart.`,
  scrubbed: $localize`:@@launch.outcome.scrubbed:Start abgebrochen.`
};

const WEATHER_CONSTRAINT_TEXTS: Record<WeatherConstraint, string> = {
  thunderstorm: $localize`:@@launch.weatherConstraint.thunderstorm:Gewitter – Blitzschlaggefahr`,
  windGusts: $localize`:@@launch.weatherConstraint.windGusts:Windböen über dem Grenzwert der Rakete`
};

export function stationLabel(station: Station): string {
  return STATION_LABELS[station];
}

export function issueTitle(issue: CountdownIssue): string {
  return ISSUE_TITLES[issue];
}

export function issueDescription(issue: CountdownIssue): string {
  return ISSUE_DESCRIPTIONS[issue];
}

export function outcomeText(outcome: LaunchOutcome): string {
  return OUTCOME_TEXTS[outcome];
}

export function weatherConstraintText(constraint: WeatherConstraint): string {
  return WEATHER_CONSTRAINT_TEXTS[constraint];
}

/** The text of a line in the mission control log. Station reports name the person at the station. */
export function countdownLogText(entry: CountdownLogEntry, crew: StationCrew): string {
  switch (entry.kind) {
    case 'milestone':
      return MILESTONE_TEXTS[entry.milestone];
    case 'poll': {
      const station = STATION_LABELS[entry.station];
      const name = crew[entry.station].name;
      return entry.verdict === 'go'
        ? $localize`:@@launch.log.pollGo:${station}:station: (${name}:name:): Go`
        : $localize`:@@launch.log.pollNoGo:${station}:station: (${name}:name:): No Go`;
    }
    case 'issue':
      return $localize`:@@launch.log.issue:Problem: ${ISSUE_TITLES[entry.issue]}:issue:`;
    case 'decision':
      return {
        hold: $localize`:@@launch.log.decision.hold:Entscheidung: Countdown wird angehalten (Hold).`,
        continue: $localize`:@@launch.log.decision.continue:Entscheidung: Weiter trotz Risiko.`,
        scrub: $localize`:@@launch.log.decision.scrub:Entscheidung: Start wird abgebrochen.`
      }[entry.decision];
    case 'issueResolved':
      return $localize`:@@launch.log.issueResolved:Erledigt: ${ISSUE_TITLES[entry.issue]}:issue:. Countdown läuft weiter.`;
    case 'flightPhase':
      return FLIGHT_PHASE_TEXTS[entry.phase];
    case 'anomaly':
      return $localize`:@@launch.log.anomaly:Anomalie bei ${FLIGHT_PHASE_NAMES[entry.phase]}:phase:! Telemetrie verloren.`;
    case 'outcome':
      return OUTCOME_TEXTS[entry.outcome];
  }
}
