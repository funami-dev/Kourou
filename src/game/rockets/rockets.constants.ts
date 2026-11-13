import type { RocketModel, RocketModelId } from './rocket.model';

// Balancing values. These are first estimates and will be tuned once launches exist.

/**
 * Rockets that can be bought ready-made.
 * Both are named after birds of French Guiana; the scarlet ibis is a well-known sight near Kourou.
 */
export const ROCKET_MODELS: Record<RocketModelId, RocketModel & { id: RocketModelId }> = {
  ibis: {
    id: 'ibis',
    name: 'Ibis',
    manufacturer: 'Orbitalwerk',
    serialPrefix: 'IB',
    // A small launcher: enough for small satellites in low orbits, not powerful enough for GTO.
    payloadCapacityKg: { leo: 1_800, sso: 1_300, gto: 0 },
    price: 7_000_000,
    assemblyDays: 3,
    reliability: 0.94,
    // Light rockets are pushed around more easily by gusts on the pad and during the first seconds of flight.
    maxWindGustsMetersPerSecond: 14
  },
  albatros: {
    id: 'albatros',
    name: 'Albatros',
    manufacturer: 'Orbitalwerk',
    serialPrefix: 'AL',
    // A heavy launcher that can carry large communication satellites to GTO.
    payloadCapacityKg: { leo: 12_000, sso: 8_000, gto: 5_500 },
    price: 65_000_000,
    assemblyDays: 7,
    reliability: 0.97,
    maxWindGustsMetersPerSecond: 17
  }
};

/**
 * Days the ship needs to bring a rocket's parts to Kourou.
 * Rocket parts for Kourou really do travel by ship from Europe, which takes roughly one and a half weeks.
 */
export const SHIP_DELIVERY_DAYS = 10;
