import { ROCKET_MODELS } from './rockets.constants';
import { NEW_DESIGN_RELIABILITY_PENALTY, RELIABILITY_GAIN_PER_SUCCESS } from './rocket-parts.constants';
import {
  designBlueprint,
  designPerformance,
  normalizeDesignName,
  reliabilityGain,
  rocketBlueprints
} from './rocket-design';
import type { RocketDesign } from './rocket-design.model';

const SMALL: RocketDesign = {
  id: 1,
  name: 'Kolibri',
  coreStage: 'coreLight',
  boosterCount: 0,
  upperStage: 'upperBasic',
  fairing: 'fairingSmall'
};
const HEAVY: RocketDesign = {
  id: 2,
  name: 'Harpyie',
  coreStage: 'coreHeavy',
  boosterCount: 4,
  upperStage: 'upperCryogenic',
  fairing: 'fairingLarge'
};

describe('designPerformance', () => {
  it('adds up the lift of all stages', () => {
    expect(designPerformance(SMALL).payloadCapacityKg).toEqual({ leo: 1_600, sso: 1_200, gto: 0 });
  });

  it('reaches GTO only with a cryogenic upper stage', () => {
    expect(designPerformance(HEAVY).payloadCapacityKg.gto).toBeGreaterThan(0);
  });

  it('limits the payload to what fits under the fairing', () => {
    const heavyWithSmallFairing = designPerformance({ ...HEAVY, fairing: 'fairingSmall' });
    expect(heavyWithSmallFairing.payloadCapacityKg.leo).toBe(2_500);
  });

  it('is cheaper than a catalogue rocket of similar size, but less reliable at first', () => {
    const small = designPerformance(SMALL);

    expect(small.price).toBeLessThan(ROCKET_MODELS.ibis.price);
    expect(small.reliability).toBeLessThan(ROCKET_MODELS.ibis.reliability);
  });

  it('becomes more stable in gusts with boosters', () => {
    expect(designPerformance({ ...SMALL, boosterCount: 2 }).maxWindGustsMetersPerSecond).toBeGreaterThan(
      designPerformance(SMALL).maxWindGustsMetersPerSecond
    );
  });
});

describe('designBlueprint', () => {
  it('can be ordered like a catalogue model', () => {
    expect(designBlueprint(SMALL)).toMatchObject({
      id: 'design-1',
      name: 'Kolibri',
      serialPrefix: 'E1',
      manufacturer: null
    });
  });
});

describe('launch experience', () => {
  it('makes own designs much more reliable over time', () => {
    const blueprint = designBlueprint(SMALL);

    expect(reliabilityGain(blueprint, 3)).toBeCloseTo(3 * RELIABILITY_GAIN_PER_SUCCESS);
    expect(reliabilityGain(blueprint, 100)).toBeCloseTo(NEW_DESIGN_RELIABILITY_PENALTY);
  });

  it('improves proven catalogue models only a little', () => {
    expect(reliabilityGain(ROCKET_MODELS.ibis, 100)).toBeLessThan(NEW_DESIGN_RELIABILITY_PENALTY);
  });

  it('lists catalogue models and designs with their current reliability', () => {
    const blueprints = rocketBlueprints([SMALL], { 'design-1': 2 });

    expect(Object.keys(blueprints)).toEqual(['ibis', 'albatros', 'design-1']);
    expect(blueprints['design-1']?.reliability).toBeCloseTo(
      designPerformance(SMALL).reliability + 2 * RELIABILITY_GAIN_PER_SUCCESS
    );
  });
});

describe('normalizeDesignName', () => {
  it('trims the name and rejects empty names', () => {
    expect(normalizeDesignName('  Kolibri ')).toBe('Kolibri');
    expect(normalizeDesignName('   ')).toBeNull();
  });
});
