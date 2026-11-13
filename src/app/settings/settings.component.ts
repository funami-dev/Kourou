import { Component } from '@angular/core';
import { dispatch } from '@ngxs/store';

import { StartNewGame } from '../../store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private readonly dispatchStartNewGame = dispatch(StartNewGame);

  startNewGame(): void {
    const isConfirmed = confirm(
      $localize`:@@settings.newGame.confirm:Neues Spiel starten? Der aktuelle Spielstand geht dabei verloren.`
    );

    if (isConfirmed) {
      this.dispatchStartNewGame();
    }
  }
}
