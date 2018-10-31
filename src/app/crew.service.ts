import { Injectable } from '@angular/core';
import { Store, State, Action, StateContext, Selector } from '@ngxs/store';

import { AddCrewMember } from './crew.actions';


@Injectable({
  providedIn: 'root'
})
export class CrewService {
  constructor(private store: Store) {}

  @Action(AddCrewMember)
  addCrewMember({ getState, setState }: StateContext<string[]>, { payload }: AddCrewMember) {
    setState([...getState(), payload]);
  }

  // addCrewMember({ getState, setState }: StateContext<string[]>, name: string) {
  //   this.store.dispatch(new AddCrewMember(name)).subscribe(() => {
  //     console.log(state);
  //   });
    // this.store.dispatch(new AddAnimal(name)).subscribe(() => this.form.reset());

    // addTodo(, { payload }: AddTodo) {
    //   setState([...getState(), payload]);
    // }
  }
}
