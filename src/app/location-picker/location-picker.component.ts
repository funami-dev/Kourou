import { Component } from '@angular/core';
import { dispatch, select } from '@ngxs/store';

import { GuiState, SetCurrentLocation } from '../../store';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrl: './location-picker.component.scss'
})
export class LocationPickerComponent {
  readonly currentLocation = select(GuiState.getCurrentLocation);

  private readonly setCurrentLocation = dispatch(SetCurrentLocation);

  selectLocation(id: string): void {
    this.setCurrentLocation(id);
  }
}
