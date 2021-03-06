import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { NgxsStoragePluginModule, STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { InlineSVGModule } from 'ng-inline-svg';

import { MaterialModule } from './material/material.module';

import { CrewState, GuiState } from '../store';
//import { LocalstorageStorageEngine } from './storage';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { SkyComponent } from './components/sky/sky.component';
import { FullscreenComponent } from './layouts/fullscreen/fullscreen.component';
import { CardComponent } from './layouts/card/card.component';
import { ScenicBackgroundComponent } from './layouts/scenic-background/scenic-background.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    LocationPickerComponent,
    SkyComponent,
    FullscreenComponent,
    CardComponent,
    ScenicBackgroundComponent,
    ToolbarComponent,
    MainMenuComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    //NgxsStoragePluginModule.forRoot(),
    NgxsModule.forRoot([CrewState, GuiState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    InlineSVGModule.forRoot(),
  ],
  //providers: [
  //  {
  //    provide: STORAGE_ENGINE,
  //    useClass: LocalstorageStorageEngine
  //  }
  //],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

