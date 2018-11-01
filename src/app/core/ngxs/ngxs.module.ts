import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { GlobalState } from './store/global.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forRoot([GlobalState])],
  declarations: []
})
export class KourouStoreModule {}
