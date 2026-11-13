import { MS_PER_DAY } from '../clock/clock.constants';
import {
  NEW_GAME_ROCKET_FLEET,
  endOfCurrentStepMs,
  orderRocket,
  progressOfCurrentStep,
  rocketStatus
} from './rocket-fleet';
import { ROCKET_MODELS, SHIP_DELIVERY_DAYS } from './rockets.constants';

const ORDERED_AT = 5 * MS_PER_DAY;
const ARRIVES_AT = ORDERED_AT + SHIP_DELIVERY_DAYS * MS_PER_DAY;
const IBIS_ASSEMBLY = ROCKET_MODELS.ibis.assemblyDays * MS_PER_DAY;

describe('orderRocket', () => {
  it('plans shipping and assembly', () => {
    const { rocket } = orderRocket(NEW_GAME_ROCKET_FLEET, 'ibis', ORDERED_AT);

    expect(rocket).toEqual({
      id: 1,
      modelId: 'ibis',
      serialName: 'IB-01',
      orderedAtMs: ORDERED_AT,
      arrivesAtMs: ARRIVES_AT,
      assemblyStartsAtMs: ARRIVES_AT,
      readyAtMs: ARRIVES_AT + IBIS_ASSEMBLY
    });
  });

  it('numbers rockets per model', () => {
    let fleet = orderRocket(NEW_GAME_ROCKET_FLEET, 'ibis', ORDERED_AT).fleet;
    fleet = orderRocket(fleet, 'albatros', ORDERED_AT).fleet;
    fleet = orderRocket(fleet, 'ibis', ORDERED_AT).fleet;

    expect(fleet.rockets.map((rocket) => rocket.serialName)).toEqual(['IB-01', 'AL-01', 'IB-02']);
  });

  it('is delivered and assembled faster with technology bonuses', () => {
    const { rocket } = orderRocket(NEW_GAME_ROCKET_FLEET, 'ibis', ORDERED_AT, {
      assemblyDurationFactor: 0.5,
      shippingDaysSaved: 3,
      assemblySlots: 1
    });
    const arrivesAt = ORDERED_AT + (SHIP_DELIVERY_DAYS - 3) * MS_PER_DAY;

    expect(rocket.arrivesAtMs).toBe(arrivesAt);
    expect(rocket.readyAtMs).toBe(arrivesAt + IBIS_ASSEMBLY / 2);
  });

  it('assembles several rockets at the same time in a larger assembly hall', () => {
    const bonuses = { assemblyDurationFactor: 1, shippingDaysSaved: 0, assemblySlots: 2 };
    const first = orderRocket(NEW_GAME_ROCKET_FLEET, 'ibis', ORDERED_AT, bonuses);
    const second = orderRocket(first.fleet, 'ibis', ORDERED_AT, bonuses);
    const third = orderRocket(second.fleet, 'ibis', ORDERED_AT, bonuses);

    expect(second.rocket.assemblyStartsAtMs).toBe(ARRIVES_AT);
    expect(third.rocket.assemblyStartsAtMs).toBe(first.rocket.readyAtMs);
  });

  it('waits with assembly until the assembly hall is free', () => {
    const first = orderRocket(NEW_GAME_ROCKET_FLEET, 'ibis', ORDERED_AT);
    const { rocket: second } = orderRocket(first.fleet, 'ibis', ORDERED_AT);

    expect(second.arrivesAtMs).toBe(ARRIVES_AT);
    expect(second.assemblyStartsAtMs).toBe(first.rocket.readyAtMs);
    expect(second.readyAtMs).toBe(first.rocket.readyAtMs + IBIS_ASSEMBLY);
  });
});

describe('rocketStatus and progress', () => {
  const first = orderRocket(NEW_GAME_ROCKET_FLEET, 'ibis', ORDERED_AT);
  const { rocket: waitingRocket } = orderRocket(first.fleet, 'ibis', ORDERED_AT);
  const rocket = first.rocket;

  it('is in transit until the ship arrives', () => {
    const halfway = ORDERED_AT + (ARRIVES_AT - ORDERED_AT) / 2;

    expect(rocketStatus(rocket, halfway)).toBe('inTransit');
    expect(progressOfCurrentStep(rocket, halfway)).toBe(0.5);
    expect(endOfCurrentStepMs(rocket, halfway)).toBe(ARRIVES_AT);
  });

  it('waits for the assembly hall if another rocket is being assembled', () => {
    expect(rocketStatus(waitingRocket, ARRIVES_AT)).toBe('waitingForAssembly');
    expect(endOfCurrentStepMs(waitingRocket, ARRIVES_AT)).toBe(waitingRocket.assemblyStartsAtMs);
  });

  it('is assembled after arrival', () => {
    expect(rocketStatus(rocket, ARRIVES_AT)).toBe('inAssembly');
    expect(progressOfCurrentStep(rocket, ARRIVES_AT)).toBe(0);
  });

  it('is ready once assembly is complete', () => {
    expect(rocketStatus(rocket, rocket.readyAtMs)).toBe('ready');
    expect(progressOfCurrentStep(rocket, rocket.readyAtMs + MS_PER_DAY)).toBe(1);
    expect(endOfCurrentStepMs(rocket, rocket.readyAtMs)).toBeNull();
  });
});
