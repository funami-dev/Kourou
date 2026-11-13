import type { CoreStageId, FairingId, UpperStageId } from '../../game/rockets/rocket-design.model';

/** Player-facing names of rocket parts. Each `Record` makes sure every part has a name. */

const CORE_STAGE_NAMES: Record<CoreStageId, string> = {
  coreLight: $localize`:@@rockets.part.coreLight:Kernstufe K1 (leicht)`,
  coreMedium: $localize`:@@rockets.part.coreMedium:Kernstufe K2 (mittel)`,
  coreHeavy: $localize`:@@rockets.part.coreHeavy:Kernstufe K3 (schwer)`
};

const UPPER_STAGE_NAMES: Record<UpperStageId, string> = {
  upperBasic: $localize`:@@rockets.part.upperBasic:Oberstufe O1 (einfach, kein GTO)`,
  upperCryogenic: $localize`:@@rockets.part.upperCryogenic:Oberstufe O2 (kryogen, GTO-fähig)`
};

const FAIRING_NAMES: Record<FairingId, string> = {
  fairingSmall: $localize`:@@rockets.part.fairingSmall:Verkleidung klein (bis 2,5 t)`,
  fairingLarge: $localize`:@@rockets.part.fairingLarge:Verkleidung groß (bis 15 t)`
};

export function coreStageName(id: CoreStageId): string {
  return CORE_STAGE_NAMES[id];
}

export function upperStageName(id: UpperStageId): string {
  return UPPER_STAGE_NAMES[id];
}

export function fairingName(id: FairingId): string {
  return FAIRING_NAMES[id];
}

export function boosterCountLabel(count: number): string {
  return count === 0
    ? $localize`:@@rockets.part.noBoosters:Keine Booster`
    : $localize`:@@rockets.part.boosters:${count}:count: Feststoff-Booster`;
}
