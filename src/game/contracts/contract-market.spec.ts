import type { ContractOffer } from './contract.model';
import {
  NEW_GAME_CONTRACT_MARKET,
  acceptOffer,
  canAcceptMoreContracts,
  generateOffer,
  overdueContractIds,
  remainingPaymentFor,
  settleContract,
  startNewDay
} from './contract-market';
import type { ContractMarket } from './contract-market';
import {
  ADVANCE_PAYMENT_SHARE,
  MAX_CONTRACTS_IN_PROGRESS,
  MAX_OPEN_OFFERS,
  MIN_DAYS_UNTIL_DEADLINE,
  OFFER_VALIDITY_DAYS,
  PAYMENT_ROUNDING_STEP,
  PAYLOAD_PROFILES,
  STARTER_OFFERS
} from './contracts.constants';

const alwaysLowest = (): number => 0;

const offer = (overrides: Partial<ContractOffer> = {}): ContractOffer => ({ ...STARTER_OFFERS[0]!, ...overrides });

describe('generateOffer', () => {
  it('creates an offer that matches the customer and its payload profile', () => {
    const generated = generateOffer(7, 10, alwaysLowest);
    const profile = PAYLOAD_PROFILES[generated.payload.type];

    expect(generated.id).toBe(7);
    expect(generated.payload.targetOrbit).toBe(profile.targetOrbit);
    expect(generated.payload.massKg).toBe(profile.minMassKg);
    expect(generated.payload.name).toMatch(/-1$/);
  });

  it('sets the deadline and offer expiry relative to the current day', () => {
    const generated = generateOffer(7, 10, alwaysLowest);

    expect(generated.deadlineDay).toBe(10 + MIN_DAYS_UNTIL_DEADLINE);
    expect(generated.offerExpiresOnDay).toBe(10 + OFFER_VALIDITY_DAYS - 1);
  });

  it('rounds the payment to whole payment steps', () => {
    for (const random of [0, 0.3, 0.6, 0.99]) {
      expect(generateOffer(1, 1, () => random).payment % PAYMENT_ROUNDING_STEP).toBe(0);
    }
  });
});

describe('startNewDay', () => {
  it('removes offers that can no longer be accepted', () => {
    const market: ContractMarket = { ...NEW_GAME_CONTRACT_MARKET, offers: [offer({ id: 1, offerExpiresOnDay: 4 })] };

    const nextDay = startNewDay(market, 5, alwaysLowest);

    expect(nextDay.offers.map(({ id }) => id)).not.toContain(1);
  });

  it('marks contracts in progress as missed once their deadline has passed', () => {
    const accepted = acceptOffer(NEW_GAME_CONTRACT_MARKET, 1, 1)!.market;
    const deadlineDay = accepted.contracts[0]!.deadlineDay;

    expect(startNewDay(accepted, deadlineDay, alwaysLowest).contracts[0]!.status).toBe('inProgress');
    expect(startNewDay(accepted, deadlineDay + 1, alwaysLowest).contracts[0]!.status).toBe('missedDeadline');
  });

  it('adds a new offer each day until the maximum is reached', () => {
    let market: ContractMarket = { ...NEW_GAME_CONTRACT_MARKET, offers: [] };

    for (let day = 2; day < 2 + MAX_OPEN_OFFERS + 2; day++) {
      market = startNewDay(market, day, alwaysLowest);
    }

    expect(market.offers).toHaveLength(MAX_OPEN_OFFERS);
    expect(new Set(market.offers.map(({ id }) => id)).size).toBe(MAX_OPEN_OFFERS);
  });
});

describe('acceptOffer', () => {
  it('turns the offer into a contract in progress with an advance payment', () => {
    const result = acceptOffer(NEW_GAME_CONTRACT_MARKET, 3, 2)!;
    const acceptedOffer = STARTER_OFFERS[2]!;

    expect(result.market.offers.map(({ id }) => id)).not.toContain(3);
    expect(result.contract).toEqual({
      id: 3,
      customer: acceptedOffer.customer,
      payload: acceptedOffer.payload,
      payment: acceptedOffer.payment,
      deadlineDay: acceptedOffer.deadlineDay,
      acceptedOnDay: 2,
      advancePayment: acceptedOffer.payment * ADVANCE_PAYMENT_SHARE,
      status: 'inProgress'
    });
    expect(result.market.contracts).toEqual([result.contract]);
  });

  it('refuses an offer that does not exist', () => {
    expect(acceptOffer(NEW_GAME_CONTRACT_MARKET, 999, 1)).toBeNull();
  });

  it('refuses more contracts than the player can work on at once', () => {
    const offers = Array.from({ length: MAX_CONTRACTS_IN_PROGRESS + 1 }, (_, index) => offer({ id: index + 1 }));
    let market: ContractMarket = { ...NEW_GAME_CONTRACT_MARKET, offers };

    for (let id = 1; id <= MAX_CONTRACTS_IN_PROGRESS; id++) {
      market = acceptOffer(market, id, 1)!.market;
    }

    expect(canAcceptMoreContracts(market.contracts)).toBe(false);
    expect(acceptOffer(market, MAX_CONTRACTS_IN_PROGRESS + 1, 1)).toBeNull();
  });
});

describe('after the launch', () => {
  const { market, contract } = acceptOffer(NEW_GAME_CONTRACT_MARKET, 2, 1)!;

  it('completes the contract after a successful launch', () => {
    expect(settleContract(market, 2, true).contracts[0]?.status).toBe('completed');
  });

  it('marks the contract as failed after a failed launch', () => {
    expect(settleContract(market, 2, false).contracts[0]?.status).toBe('failed');
  });

  it('pays the rest of the payment after a successful launch', () => {
    expect(contract.advancePayment + remainingPaymentFor(contract)).toBe(contract.payment);
  });

  it('finds contracts whose deadline has passed', () => {
    expect(overdueContractIds(market.contracts, contract.deadlineDay)).toEqual([]);
    expect(overdueContractIds(market.contracts, contract.deadlineDay + 1)).toEqual([2]);
  });
});
