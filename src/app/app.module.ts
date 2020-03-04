import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { CrewState } from '../store';

import { AreaModule } from './area/area.module';
import { RocketModule } from './rocket/rocket.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, NgxsModule.forRoot([CrewState]), RocketModule, AreaModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
