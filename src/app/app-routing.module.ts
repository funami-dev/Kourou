import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Layouts
import { FullscreenComponent } from './layouts/fullscreen/fullscreen.component';
import { ScenicBackgroundComponent } from './layouts/scenic-background/scenic-background.component';
import { CardComponent } from './layouts/card/card.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

// Pages
import { CrewRoutingModule, routes as CrewRoutes } from './pages/crew/crew-routing/crew-routing.module';
import { AreaRoutingModule } from './layouts/area/area-routing.module';
import { SettingsRoutingModule } from './pages/settings/settings-routing/settings-routing.module';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainMenuComponent, data: { animation: 'GoodNight' } },
  { path: 'crew', component: CardComponent, loadChildren: () => CrewRoutingModule, data: { sections: CrewRoutes, animation: 'GoodNight' } },
  { path: 'area', component: FullscreenComponent, loadChildren: () => AreaRoutingModule, data: { animation: 'GoodNight' } },
  { path: 'settings', component: ScenicBackgroundComponent, loadChildren: () => SettingsRoutingModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true }), BrowserAnimationsModule],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }

export const routingComponents = [];
