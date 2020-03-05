import { Component, OnInit, HostBinding } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GuiState, SetCurrentLocation } from '../../store';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @Select(GuiState.getCurrentLocation)
  public currentLocation$: Observable<string>;
  public currentLocation: string;

  @HostBinding('class.noPadding') noPadding = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.currentLocation$.subscribe(data => {
      this.currentLocation = data;
      this.noPadding = Boolean(this.currentLocation);
    });
  }
  SetCurrentLocation(id) {
    this.store.dispatch(new SetCurrentLocation(id));
  }
}
