import { MS_PER_DAY } from '../clock/clock.constants';
import type { Contract } from '../contracts/contract.model';
import { STARTER_OFFERS } from '../contracts/contracts.constants';
import { NEW_GAME_ROCKET_FLEET, orderRocket } from '../rockets/rocket-fleet';
import { ROCKET_MODELS } from '../rockets/rockets.constants';
import { canCarry, rocketsAvailableFor } from './launch-campaign';

const contractFor = (offerIndex: number): Contract => ({
  ...STARTER_OFFERS[offerIndex]!,
  acceptedOnDay: 1,
  advancePayment: 0,
  status: 'inProgress'
});

describe('canCarry', () => {
  it('compares the payload mass with the capacity for the target orbit', () => {
    const scienceSatellite = contractFor(0).payload; // 900 kg to LEO
    const communicationSatellite = contractFor(2).payload; // 3,500 kg to GTO

    expect(canCarry(ROCKET_MODELS.ibis, scienceSatellite)).toBe(true);
    expect(canCarry(ROCKET_MODELS.ibis, communicationSatellite)).toBe(false);
    expect(canCarry(ROCKET_MODELS.albatros, communicationSatellite)).toBe(true);
  });
});

describe('rocketsAvailableFor', () => {
  let fleet = orderRocket(NEW_GAME_ROCKET_FLEET, 'ibis', 0).fleet;
  fleet = orderRocket(fleet, 'albatros', 0).fleet;
  const muchLater = 100 * MS_PER_DAY;

  it('offers only assembled rockets', () => {
    expect(rocketsAvailableFor(contractFor(0), fleet.rockets, null, 0)).toEqual([]);
    expect(rocketsAvailableFor(contractFor(0), fleet.rockets, null, muchLater)).toHaveLength(2);
  });

  it('offers only rockets that can carry the payload', () => {
    const available = rocketsAvailableFor(contractFor(2), fleet.rockets, null, muchLater);

    expect(available.map((rocket) => rocket.modelId)).toEqual(['albatros']);
  });

  it('does not offer the rocket that is already on the launch pad', () => {
    const available = rocketsAvailableFor(contractFor(0), fleet.rockets, { contractId: 9, rocketId: 1 }, muchLater);

    expect(available.map((rocket) => rocket.id)).toEqual([2]);
  });
});
