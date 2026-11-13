import type { ContractStatus, OrbitType, PayloadType } from '../../game/contracts/contract.model';

/** Player-facing names for contract terms. A `Record` makes sure every value has a label. */
const ORBIT_LABELS: Record<OrbitType, string> = {
  leo: $localize`:@@contracts.orbit.leo:Niedriger Erdorbit (LEO)`,
  sso: $localize`:@@contracts.orbit.sso:Sonnensynchroner Orbit (SSO)`,
  gto: $localize`:@@contracts.orbit.gto:Geostationärer Transferorbit (GTO)`
};

const PAYLOAD_TYPE_LABELS: Record<PayloadType, string> = {
  communication: $localize`:@@contracts.payloadType.communication:Kommunikationssatellit`,
  earthObservation: $localize`:@@contracts.payloadType.earthObservation:Erdbeobachtungssatellit`,
  weather: $localize`:@@contracts.payloadType.weather:Wettersatellit`,
  science: $localize`:@@contracts.payloadType.science:Forschungssatellit`,
  technologyDemo: $localize`:@@contracts.payloadType.technologyDemo:Technologie-Demonstrator`
};

const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  inProgress: $localize`:@@contracts.status.inProgress:In Arbeit`,
  missedDeadline: $localize`:@@contracts.status.missedDeadline:Frist verpasst`
};

export function orbitLabel(orbit: OrbitType): string {
  return ORBIT_LABELS[orbit];
}

export function payloadTypeLabel(payloadType: PayloadType): string {
  return PAYLOAD_TYPE_LABELS[payloadType];
}

export function contractStatusLabel(status: ContractStatus): string {
  return CONTRACT_STATUS_LABELS[status];
}
