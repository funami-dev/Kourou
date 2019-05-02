import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CrewStateModel } from 'src/store/crew.state';
import { AddCrewMember, RemoveCrewMember } from 'src/store/crew.actions';

@Component({
  selector: 'app-crew',
  templateUrl: './crew.component.html',
  styleUrls: ['./crew.component.scss']
})
export class CrewComponent implements OnInit {
  @Select()
  crew$: Observable<CrewStateModel[]>;

  constructor(private store: Store) {}

  ngOnInit() {}

  addCrewMember(member) {
    this.store.dispatch(new AddCrewMember(member));
  }

  removeCrewMember(id) {
    this.store.dispatch(new RemoveCrewMember(id));
  }
}
