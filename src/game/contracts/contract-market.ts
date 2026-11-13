import type { Euros } from '../economy/economy.constants';
import { pickRandom, randomIntegerBetween } from '../random';
import type { RandomNumberGenerator } from '../random';
import type { Contract, ContractOffer } from './contract.model';
import {
  ADVANCE_PAYMENT_SHARE,
  CUSTOMERS,
  MAX_CONTRACTS_IN_PROGRESS,
  MAX_DAYS_UNTIL_DEADLINE,
  MAX_OPEN_OFFERS,
  MAX_SATELLITE_SERIAL_NUMBER,
  MIN_DAYS_UNTIL_DEADLINE,
  NEW_OFFERS_PER_DAY,
  OFFER_VALIDITY_DAYS,
  PAYLOAD_PROFILES,
  PAYMENT_ROUNDING_STEP,
  PRICE_PER_KG,
  STARTER_OFFERS
} from './contracts.constants';

/** Everything about contracts: open offers and accepted contracts. */
export interface ContractMarket {
  offers: ContractOffer[];
  contracts: Contract[];
  nextId: number;
}

export const NEW_GAME_CONTRACT_MARKET: ContractMarket = {
  offers: [...STARTER_OFFERS],
  contracts: [],
  nextId: STARTER_OFFERS.length + 1
};

/**
 * Applies the daily rules at the start of a game day:
 * expired offers disappear, contracts past their deadline are missed, and new offers come in.
 */
export function startNewDay(market: ContractMarket, day: number, random: RandomNumberGenerator): ContractMarket {
  return addNewOffers(missOverdueContracts(removeExpiredOffers(market, day), day), day, random);
}

function removeExpiredOffers(market: ContractMarket, day: number): ContractMarket {
  return { ...market, offers: market.offers.filter((offer) => offer.offerExpiresOnDay >= day) };
}

function missOverdueContracts(market: ContractMarket, day: number): ContractMarket {
  const overdueIds = overdueContractIds(market.contracts, day);
  return {
    ...market,
    contracts: market.contracts.map((contract) =>
      overdueIds.includes(contract.id) ? { ...contract, status: 'missedDeadline' } : contract
    )
  };
}

/** Contracts still in progress whose launch deadline has passed by the given day. */
export function overdueContractIds(contracts: readonly Contract[], day: number): number[] {
  return contracts
    .filter((contract) => contract.status === 'inProgress' && contract.deadlineDay < day)
    .map((contract) => contract.id);
}

function addNewOffers(market: ContractMarket, day: number, random: RandomNumberGenerator): ContractMarket {
  const numberOfNewOffers = Math.min(NEW_OFFERS_PER_DAY, MAX_OPEN_OFFERS - market.offers.length);
  let updatedMarket = market;

  for (let index = 0; index < numberOfNewOffers; index++) {
    const offer = generateOffer(updatedMarket.nextId, day, random);
    updatedMarket = { ...updatedMarket, offers: [...updatedMarket.offers, offer], nextId: updatedMarket.nextId + 1 };
  }

  return updatedMarket;
}

/** Creates a random offer from one of the fictional customers. */
export function generateOffer(id: number, day: number, random: RandomNumberGenerator): ContractOffer {
  const customer = pickRandom(random, CUSTOMERS);
  const profile = PAYLOAD_PROFILES[customer.payloadType];
  const massKg = randomIntegerBetween(random, profile.minMassKg, profile.maxMassKg);
  const serialNumber = randomIntegerBetween(random, 1, MAX_SATELLITE_SERIAL_NUMBER);

  return {
    id,
    customer: customer.name,
    payload: {
      type: customer.payloadType,
      name: `${customer.satelliteSeries}-${serialNumber}`,
      massKg,
      targetOrbit: profile.targetOrbit
    },
    payment: roundToPaymentStep(massKg * PRICE_PER_KG[profile.targetOrbit]),
    deadlineDay: day + randomIntegerBetween(random, MIN_DAYS_UNTIL_DEADLINE, MAX_DAYS_UNTIL_DEADLINE),
    offerExpiresOnDay: day + OFFER_VALIDITY_DAYS - 1
  };
}

function roundToPaymentStep(amount: Euros): Euros {
  return Math.max(PAYMENT_ROUNDING_STEP, Math.round(amount / PAYMENT_ROUNDING_STEP) * PAYMENT_ROUNDING_STEP);
}

/**
 * Closes a contract after its launch. On a failed launch the customer's insurance covers the lost payload,
 * so the spaceport keeps the advance payment but receives nothing more.
 */
export function settleContract(market: ContractMarket, contractId: number, launchSucceeded: boolean): ContractMarket {
  return {
    ...market,
    contracts: market.contracts.map((contract) =>
      contract.id === contractId ? { ...contract, status: launchSucceeded ? 'completed' : 'failed' } : contract
    )
  };
}

/** What the customer still pays after a successful launch. */
export function remainingPaymentFor(contract: Contract): Euros {
  return contract.payment - contract.advancePayment;
}

/** The part of the payment that is paid when the contract is accepted. */
export function advancePaymentFor(payment: Euros): Euros {
  return Math.round(payment * ADVANCE_PAYMENT_SHARE);
}

export function countContractsInProgress(contracts: readonly Contract[]): number {
  return contracts.filter((contract) => contract.status === 'inProgress').length;
}

export function canAcceptMoreContracts(contracts: readonly Contract[]): boolean {
  return countContractsInProgress(contracts) < MAX_CONTRACTS_IN_PROGRESS;
}

/**
 * Turns an offer into a contract in progress.
 * Returns `null` if the offer no longer exists or the player already has as many contracts as allowed.
 */
export function acceptOffer(
  market: ContractMarket,
  offerId: number,
  day: number
): { market: ContractMarket; contract: Contract } | null {
  const offer = market.offers.find((candidate) => candidate.id === offerId);
  if (!offer || !canAcceptMoreContracts(market.contracts)) {
    return null;
  }

  const contract: Contract = {
    id: offer.id,
    customer: offer.customer,
    payload: offer.payload,
    payment: offer.payment,
    deadlineDay: offer.deadlineDay,
    acceptedOnDay: day,
    advancePayment: advancePaymentFor(offer.payment),
    status: 'inProgress'
  };

  return {
    market: {
      ...market,
      offers: market.offers.filter((candidate) => candidate.id !== offerId),
      contracts: [...market.contracts, contract]
    },
    contract
  };
}
