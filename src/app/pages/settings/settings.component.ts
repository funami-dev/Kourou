import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';

import { SetCurrentLocation } from '../../../store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(private store: Store, private router: Router) {}

  public resetLocation() {
    this.store.dispatch(new SetCurrentLocation(null));
  }

  ngOnInit() {}
}
