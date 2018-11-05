import { Component, OnInit } from '@angular/core';
import { KourouStoreService } from '../../../core/ngxs/services/store.service';

@Component({
  selector: 'app-right-dashboard',
  templateUrl: './right-dashboard.component.html',
  styleUrls: ['./right-dashboard.component.scss']
})
export class RightDashboardComponent implements OnInit {
  globalState = {};

  constructor(public store: KourouStoreService) {}

  ngOnInit() {
    this.globalState = this.store.getGlobalStore();
  }

  addCrewMember(member) {
    this.store.addCrewMember(member);
  }

  removeCrewMember(id) {
    console.log(id);
    this.store.removeCrewMember(id);
  }
}
