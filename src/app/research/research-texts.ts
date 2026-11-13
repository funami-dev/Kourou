import type { TechnologyBranch, TechnologyId } from '../../game/research/technology.model';

/** Player-facing texts for research. Each `Record` makes sure every value has a text. */

const TECHNOLOGY_NAMES: Record<TechnologyId, string> = {
  weatherRadar: $localize`:@@research.technology.weatherRadar:Wetterradar`,
  rangeSurveillance: $localize`:@@research.technology.rangeSurveillance:Sperrzonen-Überwachung`,
  qualityAssurance: $localize`:@@research.technology.qualityAssurance:Qualitätssicherung`,
  redundantSensors: $localize`:@@research.technology.redundantSensors:Redundante Sensoren`,
  modularAssembly: $localize`:@@research.technology.modularAssembly:Modulare Montage`,
  portLogistics: $localize`:@@research.technology.portLogistics:Hafenlogistik`
};

const TECHNOLOGY_DESCRIPTIONS: Record<TechnologyId, string> = {
  weatherRadar: $localize`:@@research.technology.weatherRadar.description:Bessere Kurzfristprognosen: Wetter-Holds im Countdown dauern nur noch halb so lang.`,
  rangeSurveillance: $localize`:@@research.technology.rangeSurveillance.description:Das Radar überwacht auch das Meer: Boote in der Sperrzone stoppen keinen Countdown mehr.`,
  qualityAssurance: $localize`:@@research.technology.qualityAssurance.description:Strengere Prüfungen bei der Montage: +2 Prozentpunkte Erfolgschance bei jedem Start.`,
  redundantSensors: $localize`:@@research.technology.redundantSensors.description:Jede Messung doppelt: Sensoranomalien stoppen keinen Countdown mehr.`,
  modularAssembly: $localize`:@@research.technology.modularAssembly.description:Vormontierte Baugruppen: Raketen werden 30 % schneller montiert.`,
  portLogistics: $localize`:@@research.technology.portLogistics.description:Eigener Liegeplatz und Kräne am Hafen: Lieferungen per Schiff kommen 3 Tage früher an.`
};

const BRANCH_NAMES: Record<TechnologyBranch, string> = {
  launchOperations: $localize`:@@research.branch.launchOperations:Startbetrieb`,
  reliability: $localize`:@@research.branch.reliability:Zuverlässigkeit`,
  infrastructure: $localize`:@@research.branch.infrastructure:Infrastruktur`
};

export function technologyName(technologyId: TechnologyId): string {
  return TECHNOLOGY_NAMES[technologyId];
}

export function technologyDescription(technologyId: TechnologyId): string {
  return TECHNOLOGY_DESCRIPTIONS[technologyId];
}

export function branchName(branch: TechnologyBranch): string {
  return BRANCH_NAMES[branch];
}
