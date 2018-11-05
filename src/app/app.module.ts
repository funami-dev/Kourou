import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatSidenavModule,
  MatGridListModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
  MatToolbarModule,
  MatSliderModule,
  MatTabsModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatChipsModule,
  MatProgressSpinnerModule
} from '@angular/material';

// import { CrewState } from '../store/crew.state'; // old store
// import { KourouStoreService } from './core/ngxs/services/store.service'; // new Store

import { KourouStoreService } from './core/ngxs/services/store.service';
import { KourouStoreModule } from './core/ngxs/ngxs.module';

// import { RocketModule } from './rocket/rocket.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { RightDashboardComponent } from './shared/components/right-dashboard/right-dashboard.component';
import { RocketComponent } from './modules/home/components/rocket/rocket.component';
import { CrewComponent } from './modules/home/components/crew/crew.component';
import { CommandsComponent } from './modules/home/components/commands/commands.component';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    RightDashboardComponent,
    RocketComponent,
    CrewComponent,
    CommandsComponent
  ],
  imports: [
    MatToolbarModule,
    MatSlideToggleModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatChipsModule,
    MatGridListModule,
    MatMenuModule,
    MatSliderModule,
    MatSidenavModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatRadioModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    KourouStoreModule
    // RocketModule,
    // NgxsModule.forRoot([CrewState]) // old store
    // NgxsModule.forRoot([KourouStoreService]) // new Store
  ],
  providers: [],
  // providers: [KourouStoreService],
  bootstrap: [AppComponent]
})
export class AppModule {}
