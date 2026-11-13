import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { STARTING_BALANCE } from '../../game/economy/economy.constants';
import { ROCKET_MODELS } from '../../game/rockets/rockets.constants';
import { ClockState } from '../clock';
import { FinanceState } from '../finance';
import { StartNewGame } from '../game.actions';
import { GuiState } from '../gui';
import { OrderRocket } from './rockets.actions';
import { RocketsState } from './rockets.state';

describe('RocketsState', () => {
  let store: Store;

  const balance = (): number => store.selectSnapshot(FinanceState.balance);
  const rockets = () => store.selectSnapshot(RocketsState.rockets);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideStore([ClockState, FinanceState, GuiState, RocketsState])]
    });
    store = TestBed.inject(Store);
  });

  it('orders a rocket and pays its price', () => {
    store.dispatch(new OrderRocket('ibis'));

    expect(rockets()).toHaveLength(1);
    expect(rockets()[0]?.orderedAtMs).toBe(store.selectSnapshot(ClockState.gameTimeMs));
    expect(balance()).toBe(STARTING_BALANCE - ROCKET_MODELS.ibis.price);
    expect(store.selectSnapshot(FinanceState.transactions).at(-1)).toMatchObject({
      category: 'rocketPurchase',
      reference: 'Ibis IB-01'
    });
  });

  it('refuses to order a rocket the player cannot afford', () => {
    store.dispatch(new OrderRocket('albatros'));

    // The starting balance covers one Albatros, but not a second one.
    store.dispatch(new OrderRocket('albatros'));

    expect(rockets()).toHaveLength(1);
    expect(balance()).toBe(STARTING_BALANCE - ROCKET_MODELS.albatros.price);
  });

  it('removes all rockets when a new game starts', () => {
    store.dispatch(new OrderRocket('ibis'));
    store.dispatch(new StartNewGame());

    expect(rockets()).toEqual([]);
  });
});
