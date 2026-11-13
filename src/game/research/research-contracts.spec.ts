import {
  MAX_FLIGHT_EXPERIMENTS_IN_PROGRESS,
  RESEARCH_PAYMENT_ROUNDING_STEP,
  RESEARCH_TOPIC_PROFILES,
  STARTER_RESEARCH_OFFERS
} from './research-contracts.constants';
import {
  NEW_GAME_RESEARCH_CONTRACT_MARKET,
  acceptResearchOffer,
  generateResearchOffer,
  selectRideshareExperiments,
  settleRideshareExperiments,
  startResearchContractDay,
  studiesInLabOn
} from './research-contracts';
import type { ResearchContract, ResearchContractMarket, ResearchOffer } from './research-contract.model';

const STUDY_OFFER = STARTER_RESEARCH_OFFERS[0]!;
const EXPERIMENT_OFFER = STARTER_RESEARCH_OFFERS[1]!;
const lowestRandom = (): number => 0;

const experiment = (id: number, massKg: number, deadlineDay: number): ResearchContract => ({
  id,
  terms: EXPERIMENT_OFFER.terms,
  assignment: { kind: 'flightExperiment', massKg, deadlineDay },
  acceptedOnDay: 1,
  status: 'inProgress'
});

describe('generateResearchOffer', () => {
  it('creates offers that match the topic profile', () => {
    for (const random of [0, 0.4, 0.8, 0.99]) {
      const offer: ResearchOffer = generateResearchOffer(5, 10, () => random);
      const profile = RESEARCH_TOPIC_PROFILES[offer.terms.topic];

      expect(offer.assignment.kind).toBe(profile.kind);
      expect(offer.terms.payment % RESEARCH_PAYMENT_ROUNDING_STEP).toBe(0);
      expect(offer.terms.researchPoints).toBeGreaterThanOrEqual(profile.researchPoints.min);
    }
  });
});

describe('ground studies', () => {
  it('need a free lab slot', () => {
    expect(acceptResearchOffer(NEW_GAME_RESEARCH_CONTRACT_MARKET, STUDY_OFFER.id, 0, 3)).toBeNull();
    expect(acceptResearchOffer(NEW_GAME_RESEARCH_CONTRACT_MARKET, STUDY_OFFER.id, 1, 3)).not.toBeNull();
  });

  it('occupy the lab slot until they are done and are then completed', () => {
    const market = acceptResearchOffer(NEW_GAME_RESEARCH_CONTRACT_MARKET, STUDY_OFFER.id, 1, 3)!;
    const doneOn = 3 + (STUDY_OFFER.assignment.kind === 'groundStudy' ? STUDY_OFFER.assignment.studyDays : 0);

    expect(studiesInLabOn(market.contracts, doneOn - 1)).toBe(1);
    expect(studiesInLabOn(market.contracts, doneOn)).toBe(0);

    const { completedContracts } = startResearchContractDay(market, doneOn, lowestRandom);
    expect(completedContracts.map(({ id }) => id)).toEqual([STUDY_OFFER.id]);
  });
});

describe('flight experiments', () => {
  it('can be accepted without a lab, up to a limit', () => {
    const waiting = Array.from({ length: MAX_FLIGHT_EXPERIMENTS_IN_PROGRESS }, (_, index) =>
      experiment(100 + index, 10, 50)
    );
    const full = { ...NEW_GAME_RESEARCH_CONTRACT_MARKET, contracts: waiting };

    expect(acceptResearchOffer(NEW_GAME_RESEARCH_CONTRACT_MARKET, EXPERIMENT_OFFER.id, 0, 3)).not.toBeNull();
    expect(acceptResearchOffer(full, EXPERIMENT_OFFER.id, 0, 3)).toBeNull();
  });

  it('miss their deadline if no launch takes them along in time', () => {
    const market = { ...NEW_GAME_RESEARCH_CONTRACT_MARKET, contracts: [experiment(7, 20, 30)] };

    expect(startResearchContractDay(market, 30, lowestRandom).market.contracts[0]?.status).toBe('inProgress');
    expect(startResearchContractDay(market, 31, lowestRandom).market.contracts[0]?.status).toBe('missedDeadline');
  });

  it('ride along by earliest deadline as long as they fit', () => {
    const contracts = [experiment(1, 40, 50), experiment(2, 30, 20), experiment(3, 20, 30)];

    expect(selectRideshareExperiments(contracts, 55).map(({ id }) => id)).toEqual([2, 3]);
    expect(selectRideshareExperiments(contracts, 10)).toEqual([]);
  });

  it('are completed after a successful launch and lost after a failure', () => {
    const market = { ...NEW_GAME_RESEARCH_CONTRACT_MARKET, contracts: [experiment(1, 10, 50), experiment(2, 10, 50)] };

    const success = settleRideshareExperiments(market, [1], true);
    expect(success.market.contracts.map(({ status }) => status)).toEqual(['completed', 'inProgress']);
    expect(success.completedContracts.map(({ id }) => id)).toEqual([1]);

    const failure = settleRideshareExperiments(market, [1], false);
    expect(failure.market.contracts[0]?.status).toBe('lost');
    expect(failure.completedContracts).toEqual([]);
  });
});

describe('new offers', () => {
  it('come in every day until the maximum is reached', () => {
    let market: ResearchContractMarket = { ...NEW_GAME_RESEARCH_CONTRACT_MARKET, offers: [] };
    for (let day = 2; day < 10; day++) {
      market = startResearchContractDay(market, day, lowestRandom).market;
    }

    expect(market.offers.length).toBeGreaterThan(0);
    expect(market.offers.length).toBeLessThanOrEqual(3);
  });
});
