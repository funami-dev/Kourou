import type { Euros } from '../economy/economy.constants';
import { pickRandom, randomIntegerBetween } from '../random';
import type { RandomNumberGenerator } from '../random';
import type {
  ResearchContract,
  ResearchContractAssignment,
  ResearchContractMarket,
  ResearchOffer,
  ResearchOfferAssignment
} from './research-contract.model';
import {
  MAX_DAYS_UNTIL_EXPERIMENT_DEADLINE,
  MAX_FLIGHT_EXPERIMENTS_IN_PROGRESS,
  MAX_OPEN_RESEARCH_OFFERS,
  MIN_DAYS_UNTIL_EXPERIMENT_DEADLINE,
  NEW_RESEARCH_OFFERS_PER_DAY,
  RESEARCH_CLIENTS,
  RESEARCH_OFFER_VALIDITY_DAYS,
  RESEARCH_PAYMENT_ROUNDING_STEP,
  RESEARCH_TOPIC_PROFILES,
  STARTER_RESEARCH_OFFERS
} from './research-contracts.constants';

export const NEW_GAME_RESEARCH_CONTRACT_MARKET: ResearchContractMarket = {
  offers: [...STARTER_RESEARCH_OFFERS],
  contracts: [],
  nextId: STARTER_RESEARCH_OFFERS.length + 1
};

/** Creates a random offer from one of the fictional research clients. */
export function generateResearchOffer(id: number, day: number, random: RandomNumberGenerator): ResearchOffer {
  const client = pickRandom(random, RESEARCH_CLIENTS);
  const topic = pickRandom(random, client.topics);
  const profile = RESEARCH_TOPIC_PROFILES[topic];

  const assignment: ResearchOfferAssignment =
    profile.kind === 'groundStudy'
      ? { kind: 'groundStudy', studyDays: randomIntegerBetween(random, profile.studyDays.min, profile.studyDays.max) }
      : {
          kind: 'flightExperiment',
          massKg: randomIntegerBetween(random, profile.massKg.min, profile.massKg.max),
          deadlineDay:
            day + randomIntegerBetween(random, MIN_DAYS_UNTIL_EXPERIMENT_DEADLINE, MAX_DAYS_UNTIL_EXPERIMENT_DEADLINE)
        };

  return {
    id,
    terms: {
      client: client.name,
      topic,
      payment: roundToPaymentStep(randomIntegerBetween(random, profile.payment.min, profile.payment.max)),
      researchPoints: randomIntegerBetween(random, profile.researchPoints.min, profile.researchPoints.max)
    },
    assignment,
    offerExpiresOnDay: day + RESEARCH_OFFER_VALIDITY_DAYS - 1
  };
}

function roundToPaymentStep(amount: Euros): Euros {
  return Math.round(amount / RESEARCH_PAYMENT_ROUNDING_STEP) * RESEARCH_PAYMENT_ROUNDING_STEP;
}

/** Studies that occupy a lab slot on the given day. */
export function studiesInLabOn(contracts: readonly ResearchContract[], day: number): number {
  return contracts.filter(
    ({ assignment, acceptedOnDay }) =>
      assignment.kind === 'groundStudy' && acceptedOnDay <= day && day < assignment.completesOnDay
  ).length;
}

export function flightExperimentsWaiting(contracts: readonly ResearchContract[]): ResearchContract[] {
  return contracts.filter(
    (contract) => contract.assignment.kind === 'flightExperiment' && contract.status === 'inProgress'
  );
}

/**
 * Whether the offer can be accepted now: a study needs a free lab slot,
 * an experiment needs room among the experiments waiting for a launch.
 */
export function canAcceptResearchOffer(
  market: ResearchContractMarket,
  offer: ResearchOffer,
  labSlots: number,
  day: number
): boolean {
  return offer.assignment.kind === 'groundStudy'
    ? studiesInLabOn(market.contracts, day) < labSlots
    : flightExperimentsWaiting(market.contracts).length < MAX_FLIGHT_EXPERIMENTS_IN_PROGRESS;
}

/** Accepts an offer. Returns `null` if the offer is gone or there is no room for it. */
export function acceptResearchOffer(
  market: ResearchContractMarket,
  offerId: number,
  labSlots: number,
  day: number
): ResearchContractMarket | null {
  const offer = market.offers.find(({ id }) => id === offerId);
  if (!offer || !canAcceptResearchOffer(market, offer, labSlots, day)) {
    return null;
  }

  const assignment: ResearchContractAssignment =
    offer.assignment.kind === 'groundStudy'
      ? { kind: 'groundStudy', completesOnDay: day + offer.assignment.studyDays }
      : offer.assignment;
  const contract: ResearchContract = {
    id: offer.id,
    terms: offer.terms,
    assignment,
    acceptedOnDay: day,
    status: 'inProgress'
  };

  return {
    ...market,
    offers: market.offers.filter(({ id }) => id !== offerId),
    contracts: [...market.contracts, contract]
  };
}

/**
 * Applies the daily rules: finished studies are completed, experiments past their deadline are missed,
 * expired offers disappear and new ones come in.
 * Returns the contracts completed today, so they can be paid.
 */
export function startResearchContractDay(
  market: ResearchContractMarket,
  day: number,
  random: RandomNumberGenerator
): { market: ResearchContractMarket; completedContracts: ResearchContract[] } {
  const completedContracts: ResearchContract[] = [];

  const contracts = market.contracts.map((contract): ResearchContract => {
    if (contract.status !== 'inProgress') {
      return contract;
    }
    const { assignment } = contract;
    if (assignment.kind === 'groundStudy' && assignment.completesOnDay <= day) {
      const completed: ResearchContract = { ...contract, status: 'completed' };
      completedContracts.push(completed);
      return completed;
    }
    if (assignment.kind === 'flightExperiment' && assignment.deadlineDay < day) {
      return { ...contract, status: 'missedDeadline' };
    }
    return contract;
  });

  let updatedMarket: ResearchContractMarket = {
    ...market,
    contracts,
    offers: market.offers.filter((offer) => offer.offerExpiresOnDay >= day)
  };
  const numberOfNewOffers = Math.min(
    NEW_RESEARCH_OFFERS_PER_DAY,
    MAX_OPEN_RESEARCH_OFFERS - updatedMarket.offers.length
  );
  for (let index = 0; index < numberOfNewOffers; index++) {
    const offer = generateResearchOffer(updatedMarket.nextId, day, random);
    updatedMarket = { ...updatedMarket, offers: [...updatedMarket.offers, offer], nextId: updatedMarket.nextId + 1 };
  }

  return { market: updatedMarket, completedContracts };
}

/**
 * Picks the experiments that ride along on a launch: those with the earliest deadline first,
 * as long as they fit into the rocket's spare capacity.
 */
export function selectRideshareExperiments(
  contracts: readonly ResearchContract[],
  spareCapacityKg: number
): ResearchContract[] {
  const byDeadline = [...flightExperimentsWaiting(contracts)].sort(
    (first, second) => deadlineOf(first) - deadlineOf(second)
  );

  let remainingCapacityKg = spareCapacityKg;
  return byDeadline.filter((contract) => {
    const massKg = contract.assignment.kind === 'flightExperiment' ? contract.assignment.massKg : 0;
    if (massKg > remainingCapacityKg) {
      return false;
    }
    remainingCapacityKg -= massKg;
    return true;
  });
}

function deadlineOf(contract: ResearchContract): number {
  return contract.assignment.kind === 'flightExperiment' ? contract.assignment.deadlineDay : Infinity;
}

/**
 * Settles the experiments that were on board: completed after a successful launch, lost after a failure.
 * Returns the completed contracts, so they can be paid.
 */
export function settleRideshareExperiments(
  market: ResearchContractMarket,
  contractIds: readonly number[],
  launchSucceeded: boolean
): { market: ResearchContractMarket; completedContracts: ResearchContract[] } {
  const settledStatus = launchSucceeded ? 'completed' : 'lost';
  const contracts = market.contracts.map(
    (contract): ResearchContract =>
      contractIds.includes(contract.id) && contract.status === 'inProgress'
        ? { ...contract, status: settledStatus }
        : contract
  );

  return {
    market: { ...market, contracts },
    completedContracts: launchSucceeded ? contracts.filter(({ id }) => contractIds.includes(id)) : []
  };
}
