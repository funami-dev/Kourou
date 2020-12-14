import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullscreenComponent } from './layouts/fullscreen/fullscreen.component';
import { ScenicBackgroundComponent } from './layouts/scenic-background/scenic-background.component';
import { CardComponent } from './layouts/card/card.component';
import { AreaComponent } from './layouts/area/area.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

// Pages
import { CrewRoutingModule, routes as CrewRoutes } from './pages/crew/crew-routing/crew-routing.module';
import { AreaRoutingModule } from './layouts/area/area-routing.module';
import { SettingsRoutingModule } from './pages/settings/settings-routing/settings-routing.module';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainMenuComponent },
  { path: 'crew', component: CardComponent, loadChildren: () => CrewRoutingModule, data: { sections: CrewRoutes} },
  { path: 'area', component: FullscreenComponent, loadChildren: () => AreaRoutingModule },
  { path: 'settings', component: ScenicBackgroundComponent, loadChildren: () => SettingsRoutingModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}

export const routingComponents = [];
