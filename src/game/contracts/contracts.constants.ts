import type { Euros } from '../economy/economy.constants';
import type { ContractOffer, OrbitType, PayloadType } from './contract.model';

// Balancing values. These are first estimates and will be tuned once rockets and launches exist.

/**
 * Price per kilogram of payload, by target orbit.
 * Roughly the order of magnitude of commercial launch prices: higher orbits need more energy and cost more.
 */
export const PRICE_PER_KG: Record<OrbitType, Euros> = {
  leo: 10_000,
  sso: 12_000,
  gto: 25_000
};

/** Payments are rounded to this step, so offers read like real-world prices. */
export const PAYMENT_ROUNDING_STEP: Euros = 100_000;

/** Share of the payment paid when a contract is accepted. The rest follows after a successful launch. */
export const ADVANCE_PAYMENT_SHARE = 0.1;

/** Typical orbit and mass of each kind of payload. */
export const PAYLOAD_PROFILES: Record<PayloadType, { targetOrbit: OrbitType; minMassKg: number; maxMassKg: number }> = {
  communication: { targetOrbit: 'gto', minMassKg: 2_000, maxMassKg: 5_000 },
  earthObservation: { targetOrbit: 'sso', minMassKg: 300, maxMassKg: 2_500 },
  weather: { targetOrbit: 'sso', minMassKg: 800, maxMassKg: 3_000 },
  science: { targetOrbit: 'leo', minMassKg: 200, maxMassKg: 2_000 },
  technologyDemo: { targetOrbit: 'leo', minMassKg: 50, maxMassKg: 500 }
};

/** Fictional customers. Each one orders one kind of payload and names its satellites after a series. */
export const CUSTOMERS: readonly { name: string; payloadType: PayloadType; satelliteSeries: string }[] = [
  { name: 'Kalypso Telekom', payloadType: 'communication', satelliteSeries: 'Kalypso' },
  { name: 'Nimbra Connect', payloadType: 'communication', satelliteSeries: 'Nimbra' },
  { name: 'Vireo Geodaten', payloadType: 'earthObservation', satelliteSeries: 'Vireo' },
  { name: 'Brisa Wetterdienst', payloadType: 'weather', satelliteSeries: 'Brisa' },
  { name: 'Institut Lumen', payloadType: 'science', satelliteSeries: 'Lumen' },
  { name: 'Fennek Raumfahrttechnik', payloadType: 'technologyDemo', satelliteSeries: 'Fennek-TD' }
];

/** Highest serial number in a satellite name, e.g. "Kalypso-9". */
export const MAX_SATELLITE_SERIAL_NUMBER = 9;

/** How many days an offer can be accepted, including the day it appears. */
export const OFFER_VALIDITY_DAYS = 5;

/** Days between the day an offer appears and the launch deadline. */
export const MIN_DAYS_UNTIL_DEADLINE = 20;
export const MAX_DAYS_UNTIL_DEADLINE = 40;

/** At most this many offers are open at the same time. */
export const MAX_OPEN_OFFERS = 4;

/** New offers that appear each morning, as long as there is room. */
export const NEW_OFFERS_PER_DAY = 1;

/** The player can work on at most this many contracts at the same time. */
export const MAX_CONTRACTS_IN_PROGRESS = 3;

/**
 * Handpicked offers for a new game: one small, one medium and one big contract,
 * so the player has a meaningful choice from the very first minute.
 */
export const STARTER_OFFERS: readonly ContractOffer[] = [
  {
    id: 1,
    customer: 'Institut Lumen',
    payload: { type: 'science', name: 'Lumen-1', massKg: 900, targetOrbit: 'leo' },
    payment: 9_000_000,
    deadlineDay: 30,
    offerExpiresOnDay: 5
  },
  {
    id: 2,
    customer: 'Vireo Geodaten',
    payload: { type: 'earthObservation', name: 'Vireo-1', massKg: 1_200, targetOrbit: 'sso' },
    payment: 14_400_000,
    deadlineDay: 35,
    offerExpiresOnDay: 5
  },
  {
    id: 3,
    customer: 'Kalypso Telekom',
    payload: { type: 'communication', name: 'Kalypso-1', massKg: 3_500, targetOrbit: 'gto' },
    payment: 87_500_000,
    deadlineDay: 40,
    offerExpiresOnDay: 5
  }
];
