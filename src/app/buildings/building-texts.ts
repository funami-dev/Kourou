import type { BuildingType } from '../../game/buildings/building.model';
import { buildingEffectAtLevel } from '../../game/buildings/buildings';

/** Player-facing texts for buildings. Each `Record` makes sure every building has a text. */

const BUILDING_NAMES: Record<BuildingType, string> = {
  assemblyHall: $localize`:@@buildings.name.assemblyHall:Montagehalle`,
  port: $localize`:@@buildings.name.port:Hafen`,
  controlCenter: $localize`:@@buildings.name.controlCenter:Kontrollzentrum`,
  laboratory: $localize`:@@buildings.name.laboratory:Labor`,
  weatherStation: $localize`:@@buildings.name.weatherStation:Wetterstation`,
  accommodation: $localize`:@@buildings.name.accommodation:Unterkünfte`
};

const BUILDING_DESCRIPTIONS: Record<BuildingType, string> = {
  assemblyHall: $localize`:@@buildings.description.assemblyHall:Hier werden angelieferte Raketen zusammengebaut. Jede Stufe bringt eine weitere Montagebucht.`,
  port: $localize`:@@buildings.description.port:Raketenteile kommen per Schiff aus Europa. Ein größerer Kai und eigene Kräne beschleunigen die Lieferung.`,
  controlCenter: $localize`:@@buildings.description.controlCenter:Von hier aus wird gestartet. Simulatoren und Trainingsräume machen das Personal im Countdown besser.`,
  laboratory: $localize`:@@buildings.description.laboratory:Laborplätze erzeugen Forschungspunkte oder werden für Studien von Kunden genutzt.`,
  weatherStation: $localize`:@@buildings.description.weatherStation:Eigene Messungen vor Ort: Bei schlechtem Wetter weiß das Team schneller, ob Warten sich lohnt.`,
  accommodation: $localize`:@@buildings.description.accommodation:Wohnungen für das Personal. Mehr Unterkünfte erlauben ein größeres Team.`
};

export function buildingName(type: BuildingType): string {
  return BUILDING_NAMES[type];
}

export function buildingDescription(type: BuildingType): string {
  return BUILDING_DESCRIPTIONS[type];
}

/** What the building does at the given level, e.g. "2 Raketen gleichzeitig in Montage". */
export function buildingEffectText(type: BuildingType, level: number): string {
  const effect = buildingEffectAtLevel(type, level);
  switch (type) {
    case 'assemblyHall':
      return $localize`:@@buildings.effect.assemblyHall:Raketen gleichzeitig in Montage: ${effect}:count:`;
    case 'port':
      return effect === 0
        ? $localize`:@@buildings.effect.port.standard:Normale Lieferzeit`
        : $localize`:@@buildings.effect.port:Lieferung ${effect}:days: Tage schneller`;
    case 'controlCenter':
      return effect === 0
        ? $localize`:@@buildings.effect.controlCenter.standard:Kein Trainingsbonus`
        : $localize`:@@buildings.effect.controlCenter:Trainingsbonus im Countdown: +${effect}:levels: Erfahrungsstufe`;
    case 'laboratory':
      return $localize`:@@buildings.effect.laboratory:Laborplätze: ${effect}:count:`;
    case 'weatherStation':
      return $localize`:@@buildings.effect.weatherStation:Wetter-Holds ${Math.round(effect * 100)}:percent: % kürzer`;
    case 'accommodation':
      return $localize`:@@buildings.effect.accommodation:+${effect}:count: Plätze im Team`;
  }
}
