import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing/settings-routing.module';
import { GameComponent } from './sections/game/game.component';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, SettingsRoutingModule]
})
export class SettingsModule {}
