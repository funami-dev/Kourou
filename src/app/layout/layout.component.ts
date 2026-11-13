import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { select } from '@ngxs/store';

import { FinanceState, GuiState } from '../../store';
import { LocationPickerComponent } from '../location-picker/location-picker.component';
import { SkyComponent } from '../components/sky/sky.component';
import { GameClockComponent } from '../components/game-clock/game-clock.component';
import { LiveConditionsIndicatorComponent } from '../live-conditions/live-conditions-indicator.component';
import { EurosPipe } from '../shared/euros.pipe';

@Component({
  selector: 'app-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    LocationPickerComponent,
    SkyComponent,
    GameClockComponent,
    EurosPipe,
    LiveConditionsIndicatorComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  host: {
    '[class.noPadding]': 'currentLocation()'
  }
})
export class LayoutComponent {
  readonly currentLocation = select(GuiState.getCurrentLocation);
  protected readonly balance = select(FinanceState.balance);
}
