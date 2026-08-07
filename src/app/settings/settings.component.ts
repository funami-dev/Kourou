import { Component } from '@angular/core';
import { dispatch } from '@ngxs/store';

import { SetCurrentLocation } from '../../store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private readonly setCurrentLocation = dispatch(SetCurrentLocation);

  resetLocation(): void {
    this.setCurrentLocation(null);
  }
}
