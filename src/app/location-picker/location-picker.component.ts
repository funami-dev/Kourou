import { Component } from '@angular/core';
import { dispatch, select } from '@ngxs/store';

import type { LaunchSiteId } from '../../game/launch-sites/launch-site.model';
import { GuiState, SetCurrentLocation } from '../../store';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrl: './location-picker.component.scss'
})
export class LocationPickerComponent {
  readonly currentLocation = select(GuiState.getCurrentLocation);

  private readonly setCurrentLocation = dispatch(SetCurrentLocation);

  selectLocation(id: LaunchSiteId): void {
    this.setCurrentLocation(id);
  }
}
