import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import type { Contract, ContractOffer } from '../../game/contracts/contract.model';
import {
  NEW_GAME_CONTRACT_MARKET,
  acceptOffer,
  canAcceptMoreContracts,
  startNewDay
} from '../../game/contracts/contract-market';
import type { ContractMarket } from '../../game/contracts/contract-market';
import { RandomSource } from '../../game/random';
import { ClockState, GameDayStarted } from '../clock';
import { BookTransaction } from '../finance';
import { StartNewGame } from '../game.actions';
import { AcceptContractOffer } from './contracts.actions';

@State<ContractMarket>({
  name: 'contracts',
  defaults: NEW_GAME_CONTRACT_MARKET
})
@Injectable()
export class ContractsState {
  private readonly store = inject(Store);
  private readonly randomSource = inject(RandomSource);

  @Selector()
  static offers(state: ContractMarket): ContractOffer[] {
    return state.offers;
  }

  @Selector()
  static contracts(state: ContractMarket): Contract[] {
    return state.contracts;
  }

  @Selector()
  static canAcceptMoreContracts(state: ContractMarket): boolean {
    return canAcceptMoreContracts(state.contracts);
  }

  @Action(AcceptContractOffer)
  accept(ctx: StateContext<ContractMarket>, { offerId }: AcceptContractOffer): void {
    const today = this.store.selectSnapshot(ClockState.currentDay);
    const result = acceptOffer(ctx.getState(), offerId, today);
    if (!result) {
      return;
    }

    const { market, contract } = result;
    ctx.setState(market);
    ctx.dispatch(
      new BookTransaction(contract.advancePayment, 'contractAdvance', `${contract.customer} · ${contract.payload.name}`)
    );
  }

  @Action(GameDayStarted)
  startNewDay(ctx: StateContext<ContractMarket>, { day }: GameDayStarted): void {
    ctx.setState(startNewDay(ctx.getState(), day, this.randomSource.next));
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<ContractMarket>): void {
    ctx.setState(NEW_GAME_CONTRACT_MARKET);
  }
}
