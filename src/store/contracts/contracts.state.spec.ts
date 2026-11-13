import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { GAME_TIME_PER_REAL_TIME, MS_PER_DAY } from '../../game/clock/clock.constants';
import { STARTER_OFFERS } from '../../game/contracts/contracts.constants';
import { STARTING_BALANCE } from '../../game/economy/economy.constants';
import { RandomSource } from '../../game/random';
import { AdvanceClock, ClockState } from '../clock';
import { FinanceState } from '../finance';
import { StartNewGame } from '../game.actions';
import { GuiState } from '../gui';
import { AcceptContractOffer } from './contracts.actions';
import { ContractsState } from './contracts.state';

describe('ContractsState', () => {
  let store: Store;

  const offerIds = (): number[] => store.selectSnapshot(ContractsState.offers).map(({ id }) => id);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideStore([ClockState, ContractsState, FinanceState, GuiState]),
        { provide: RandomSource, useValue: { next: () => 0 } }
      ]
    });
    store = TestBed.inject(Store);
  });

  it('starts a new game with the starter offers', () => {
    expect(store.selectSnapshot(ContractsState.offers)).toEqual(STARTER_OFFERS);
  });

  it('accepts an offer and books the advance payment', () => {
    const offer = STARTER_OFFERS[1]!;

    store.dispatch(new AcceptContractOffer(offer.id));

    const [contract] = store.selectSnapshot(ContractsState.contracts);
    expect(contract?.id).toBe(offer.id);
    expect(offerIds()).not.toContain(offer.id);
    expect(store.selectSnapshot(FinanceState.balance)).toBe(STARTING_BALANCE + contract!.advancePayment);
    expect(store.selectSnapshot(FinanceState.transactions).at(-1)).toMatchObject({
      category: 'contractAdvance',
      reference: `${offer.customer} · ${offer.payload.name}`
    });
  });

  it('brings in a new offer at the start of each day', () => {
    store.dispatch(new AdvanceClock(MS_PER_DAY / GAME_TIME_PER_REAL_TIME));

    expect(store.selectSnapshot(ContractsState.offers)).toHaveLength(STARTER_OFFERS.length + 1);
  });

  it('restores the starter offers when a new game starts', () => {
    store.dispatch(new AcceptContractOffer(STARTER_OFFERS[0]!.id));
    store.dispatch(new StartNewGame());

    expect(store.selectSnapshot(ContractsState.offers)).toEqual(STARTER_OFFERS);
    expect(store.selectSnapshot(ContractsState.contracts)).toEqual([]);
  });
});
