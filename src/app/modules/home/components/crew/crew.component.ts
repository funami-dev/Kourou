import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KourouStoreService } from '../../../../core/ngxs/services/store.service';

@Component({
  selector: 'app-crew',
  templateUrl: './crew.component.html',
  styleUrls: ['./crew.component.scss']
})
export class CrewComponent implements OnInit {
  globalState = {};

  constructor(public store: KourouStoreService) {}

  ngOnInit() {
    this.globalState = this.store.getGlobalStore();
  }

  addCrewMember(member) {
    this.store.addCrewMember(member);
  }

  removeCrewMember(id) {
    this.store.removeCrewMember(id);
  }
}
