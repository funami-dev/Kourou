import type { RocketStatus } from '../../game/rockets/rocket.model';

const ROCKET_STATUS_LABELS: Record<RocketStatus, string> = {
  inTransit: $localize`:@@rockets.status.inTransit:Unterwegs per Schiff`,
  waitingForAssembly: $localize`:@@rockets.status.waitingForAssembly:Wartet auf Montagehalle`,
  inAssembly: $localize`:@@rockets.status.inAssembly:In Montage`,
  ready: $localize`:@@rockets.status.ready:Startbereit`
};

export function rocketStatusLabel(status: RocketStatus): string {
  return ROCKET_STATUS_LABELS[status];
}
