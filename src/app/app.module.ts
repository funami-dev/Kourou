import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxsStoragePluginModule, STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { LocalstorageStorageEngine } from './storage';
import { MatCardModule, MatMenuModule, MatIconModule } from '@angular/material';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { CrewState, GuiState } from '../store';
import { SkyComponent } from './components/sky/sky.component';

@NgModule({
  declarations: [AppComponent, routingComponents, LayoutComponent, LocationPickerComponent, SkyComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxsStoragePluginModule.forRoot(),
    NgxsModule.forRoot([CrewState, GuiState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AppRoutingModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    BrowserAnimationsModule,
    InlineSVGModule.forRoot()
  ],
  providers: [
    {
      provide: STORAGE_ENGINE,
      useClass: LocalstorageStorageEngine
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
