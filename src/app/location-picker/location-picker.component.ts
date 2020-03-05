import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { GuiState, SetCurrentLocation } from '../../store/';
@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Select(GuiState.getCurrentLocation)
  public currentLocation$: Observable<string>;
  public currentLocation: string;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.currentLocation$.subscribe(data => {
      this.currentLocation = data;
    });
  }

  SetCurrentLocation(id) {
    this.store.dispatch(new SetCurrentLocation(id));
  }
}
