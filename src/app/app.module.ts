import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxsStoragePluginModule, STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

import { LocalstorageStorageEngine } from './storage';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { CrewState, GuiState } from '../store';
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
    HttpClientModule,
    NgxsStoragePluginModule.forRoot(),
    NgxsModule.forRoot([CrewState, GuiState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AppRoutingModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatDialogModule,
    BrowserAnimationsModule,
    InlineSVGModule.forRoot()
  ],
  providers: [
    {
      provide: STORAGE_ENGINE,
      useClass: LocalstorageStorageEngine
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

