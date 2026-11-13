import type { CrewRole, CrewTrait } from '../../game/staff/staff.model';

/** Player-facing texts for staff. Each `Record` makes sure every value has a text. */

const ROLE_LABELS: Record<CrewRole, string> = {
  flightDirector: $localize`:@@staff.role.flightDirector:Flugleitung`,
  propulsion: $localize`:@@staff.role.propulsion:Antrieb`,
  guidance: $localize`:@@staff.role.guidance:Lenkung`,
  range: $localize`:@@staff.role.range:Sperrgebiet`,
  weather: $localize`:@@staff.role.weather:Wetter`,
  flightDynamics: $localize`:@@staff.role.flightDynamics:Flugdynamik`
};

const TRAIT_LABELS: Record<CrewTrait, string> = {
  calm: $localize`:@@staff.trait.calm:Ruhig`,
  meticulous: $localize`:@@staff.trait.meticulous:Gründlich`,
  quickLearner: $localize`:@@staff.trait.quickLearner:Lernt schnell`
};

const TRAIT_DESCRIPTIONS: Record<CrewTrait, string> = {
  calm: $localize`:@@staff.trait.calm.description:Holds an der eigenen Station dauern kürzer.`,
  meticulous: $localize`:@@staff.trait.meticulous.description:Weitermachen trotz Problem ist an der eigenen Station weniger riskant.`,
  quickLearner: $localize`:@@staff.trait.quickLearner.description:Sammelt doppelt so viel Erfahrung.`
};

export function roleLabel(role: CrewRole): string {
  return ROLE_LABELS[role];
}

export function traitLabel(trait: CrewTrait): string {
  return TRAIT_LABELS[trait];
}

export function traitDescription(trait: CrewTrait): string {
  return TRAIT_DESCRIPTIONS[trait];
}
