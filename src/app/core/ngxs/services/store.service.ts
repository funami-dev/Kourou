import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  RemoveCrewMember,
  AddCrewMember,
  SetLoadingStatus,
  GlobalStateModel,
  ToggleComplete
} from '../store/global.state';

@Injectable({
  providedIn: 'root'
})
export class KourouStoreService {
  globalStore$: Observable<GlobalStateModel>;

  constructor(private store: Store) {
    this.globalStore$ = this.store.select(data => {
      console.log(data.globalState);
      return data.globalState;
    });
  }

  setLoadingStatus(payload) {
    this.store.dispatch(new SetLoadingStatus(payload));
  }

  toggleAuto() {
    this.store.dispatch(new ToggleComplete());
  }

  getGlobalStore(): Observable<GlobalStateModel> {
    return this.globalStore$;
  }

  addCrewMember(member) {
    this.store.dispatch(new AddCrewMember(member));
  }

  removeCrewMember(id) {
    console.log(id);
    this.store.dispatch(new RemoveCrewMember(id));
  }
}
