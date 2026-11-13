import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { GAME_TIME_PER_REAL_TIME, MS_PER_DAY, MS_PER_MINUTE } from '../../game/clock/clock.constants';
import { STARTER_OFFERS } from '../../game/contracts/contracts.constants';
import { STARTER_RESEARCH_OFFERS } from '../../game/research/research-contracts.constants';
import { PAD_FEE_PER_DAY, SCRUB_COSTS } from '../../game/launch/launch.constants';
import { LAUNCH_SITES } from '../../game/launch-sites/launch-sites.constants';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { RandomSource } from '../../game/random';
import { REPUTATION_CHANGE_BY_OUTCOME, STARTING_REPUTATION } from '../../game/reputation/reputation';
import { typicalWeather } from '../../game/weather/typical-weather';
import { BuildingsState } from '../buildings';
import { AdvanceClock, ClockState } from '../clock';
import { AcceptContractOffer, ContractsState } from '../contracts';
import { FinanceState } from '../finance';
import { GuiState } from '../gui';
import { ReputationState } from '../reputation';
import { ResearchState } from '../research';
import { AcceptResearchOffer, ResearchContractsState } from '../research-contracts';
import { DismissCrewMember, StaffState } from '../staff';
import { OrderRocket, RocketsState } from '../rockets';
import {
  AdvanceCountdown,
  CloseCountdown,
  DecideOnCountdownIssue,
  MoveRocketToPad,
  RemoveRocketFromPad,
  StartCountdown
} from './launch.actions';
import { LaunchState } from './launch.state';

/** 10:00 local time in Kourou (UTC−3): the launch window for low Earth orbit is open. */
const MORNING_IN_KOUROU = Date.UTC(2026, 8, 15, 13, 0);
const SCIENCE_SATELLITE_OFFER = STARTER_OFFERS[0]!; // Lumen-1, 900 kg to LEO
const ENOUGH_TIME_FOR_COUNTDOWN_AND_FLIGHT = 30 * MS_PER_MINUTE;

describe('LaunchState', () => {
  let store: Store;
  let balanceBeforeLaunch: number;

  const launch = () => store.selectSnapshot((state) => state.launch);
  const balance = (): number => store.selectSnapshot(FinanceState.balance);

  /** Accepts the science satellite contract and puts an assembled Ibis rocket on the pad. */
  function prepareLaunch(): void {
    store.dispatch(new AcceptContractOffer(SCIENCE_SATELLITE_OFFER.id));
    store.dispatch(new OrderRocket('ibis'));
    const rocket = store.selectSnapshot(RocketsState.rockets)[0]!;
    store.reset({ ...store.snapshot(), clock: { ...store.snapshot().clock, gameTimeMs: rocket.readyAtMs } });
    store.dispatch(new MoveRocketToPad(SCIENCE_SATELLITE_OFFER.id, rocket.id));
    balanceBeforeLaunch = balance();
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(MORNING_IN_KOUROU);

    const kourou = LAUNCH_SITES.kourou;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideStore([
          BuildingsState,
          ClockState,
          ContractsState,
          FinanceState,
          GuiState,
          LaunchState,
          ReputationState,
          ResearchContractsState,
          ResearchState,
          RocketsState,
          StaffState
        ]),
        // Lowest random numbers: one issue (a boat in the range zone) and a successful flight.
        { provide: RandomSource, useValue: { next: () => 0 } },
        {
          provide: LiveConditionsService,
          useValue: { site: signal(kourou), weather: signal(typicalWeather(kourou, MORNING_IN_KOUROU)) }
        }
      ]
    });
    store = TestBed.inject(Store);
  });

  afterEach(() => vi.useRealTimers());

  it('puts an assembled rocket on the launch pad', () => {
    prepareLaunch();

    expect(store.selectSnapshot(LaunchState.campaign)).toEqual({ contractId: SCIENCE_SATELLITE_OFFER.id, rocketId: 1 });
  });

  it('does not put a rocket on the pad that is still being delivered', () => {
    store.dispatch(new AcceptContractOffer(SCIENCE_SATELLITE_OFFER.id));
    store.dispatch(new OrderRocket('ibis'));
    store.dispatch(new MoveRocketToPad(SCIENCE_SATELLITE_OFFER.id, 1));

    expect(store.selectSnapshot(LaunchState.campaign)).toBeNull();
  });

  it('launches successfully and settles the contract', () => {
    prepareLaunch();
    store.dispatch(new StartCountdown());
    store.dispatch(new AdvanceCountdown(ENOUGH_TIME_FOR_COUNTDOWN_AND_FLIGHT));

    // The boat in the range zone stops the countdown until the team decides.
    expect(launch().countdown?.status).toMatchObject({ kind: 'awaitingDecision', issue: 'boatInRangeZone' });
    store.dispatch(new DecideOnCountdownIssue('hold'));
    store.dispatch(new AdvanceCountdown(ENOUGH_TIME_FOR_COUNTDOWN_AND_FLIGHT));

    const contract = store.selectSnapshot(ContractsState.contracts)[0]!;
    const remainingPayment = contract.payment - contract.advancePayment;
    expect(launch().lastResult).toMatchObject({ outcome: 'success', income: remainingPayment, costs: 0 });
    expect(balance()).toBe(balanceBeforeLaunch + remainingPayment);
    expect(contract.status).toBe('completed');
    expect(store.selectSnapshot(RocketsState.rockets)).toEqual([]);
    expect(store.selectSnapshot(RocketsState.launchExperience)).toEqual({ ibis: 1 });
    expect(store.selectSnapshot(ReputationState.points)).toBe(
      STARTING_REPUTATION + REPUTATION_CHANGE_BY_OUTCOME.success
    );
    expect(store.selectSnapshot(LaunchState.campaign)).toBeNull();
    // Everyone in mission control gained experience.
    expect(store.selectSnapshot(StaffState.members).every((member) => member.experiencePoints > 0)).toBe(true);
  });

  it('cannot start a countdown while a position in mission control is empty', () => {
    prepareLaunch();
    store.dispatch(new DismissCrewMember(1));
    store.dispatch(new StartCountdown());

    expect(launch().countdown).toBeNull();
  });

  it('keeps the countdown screen open until the player closes it', () => {
    prepareLaunch();
    store.dispatch(new StartCountdown());
    store.dispatch(new DecideOnCountdownIssue('scrub')); // not possible yet: nothing to decide
    store.dispatch(new AdvanceCountdown(ENOUGH_TIME_FOR_COUNTDOWN_AND_FLIGHT));
    store.dispatch(new DecideOnCountdownIssue('scrub'));

    expect(store.selectSnapshot(LaunchState.isCountdownOpen)).toBe(true);
    store.dispatch(new CloseCountdown());
    expect(store.selectSnapshot(LaunchState.isCountdownOpen)).toBe(false);
  });

  it('keeps the rocket on the pad after a scrub and charges the scrub costs', () => {
    prepareLaunch();
    store.dispatch(new StartCountdown());
    store.dispatch(new AdvanceCountdown(ENOUGH_TIME_FOR_COUNTDOWN_AND_FLIGHT));
    store.dispatch(new DecideOnCountdownIssue('scrub'));

    expect(launch().lastResult).toMatchObject({ outcome: 'scrubbed', costs: SCRUB_COSTS });
    expect(balance()).toBe(balanceBeforeLaunch - SCRUB_COSTS);
    expect(store.selectSnapshot(LaunchState.campaign)).not.toBeNull();
    expect(store.selectSnapshot(ContractsState.contracts)[0]?.status).toBe('inProgress');
    expect(store.selectSnapshot(ReputationState.points)).toBe(STARTING_REPUTATION);
  });

  it('cannot take the rocket off the pad during a countdown', () => {
    prepareLaunch();
    store.dispatch(new StartCountdown());
    store.dispatch(new RemoveRocketFromPad());

    expect(store.selectSnapshot(LaunchState.campaign)).not.toBeNull();
  });

  it('charges a fee for each day a rocket occupies the pad', () => {
    prepareLaunch();
    const gameTimeUntilMidnight = MS_PER_DAY - (store.selectSnapshot(ClockState.gameTimeMs) % MS_PER_DAY);
    const transactionsBefore = store.selectSnapshot(FinanceState.transactions).length;

    store.dispatch(new AdvanceClock(gameTimeUntilMidnight / GAME_TIME_PER_REAL_TIME));

    const newTransactions = store.selectSnapshot(FinanceState.transactions).slice(transactionsBefore);
    expect(newTransactions).toContainEqual(expect.objectContaining({ category: 'padFees', amount: -PAD_FEE_PER_DAY }));
  });

  it('takes a research experiment along and delivers it with a successful launch', () => {
    const experimentOffer = STARTER_RESEARCH_OFFERS[1]!; // 30 kg, fits next to Lumen-1 into an Ibis
    store.dispatch(new AcceptResearchOffer(experimentOffer.id));
    prepareLaunch();

    store.dispatch(new StartCountdown());
    expect(launch().countdown?.mission.rideshareContractIds).toEqual([experimentOffer.id]);

    store.dispatch(new AdvanceCountdown(ENOUGH_TIME_FOR_COUNTDOWN_AND_FLIGHT));
    store.dispatch(new DecideOnCountdownIssue('hold'));
    store.dispatch(new AdvanceCountdown(ENOUGH_TIME_FOR_COUNTDOWN_AND_FLIGHT));

    expect(launch().lastResult).toMatchObject({ outcome: 'success', rideshareExperiments: 1 });
    expect(store.selectSnapshot(ResearchContractsState.contracts)[0]?.status).toBe('completed');
    expect(store.selectSnapshot(ResearchState.researchPoints)).toBe(experimentOffer.terms.researchPoints);
    expect(store.selectSnapshot(FinanceState.transactions)).toContainEqual(
      expect.objectContaining({ category: 'researchContractPayment', amount: experimentOffer.terms.payment })
    );
  });
});
