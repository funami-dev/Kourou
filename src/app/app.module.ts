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
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatSliderModule,
  MatChipsModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { CrewState } from '../store/crew.state';
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
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatGridListModule,
    MatMenuModule,
    MatSliderModule,
    MatSidenavModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    // RocketModule,
    NgxsModule.forRoot([CrewState])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
