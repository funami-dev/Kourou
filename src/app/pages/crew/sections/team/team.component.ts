import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PersonModel, CrewState, AddCrewMember, RemoveCrewMember } from 'src/store';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  @Select(CrewState.getCrew) team$: Observable<PersonModel[]>;
  members: PersonModel[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.team$.subscribe(el => this.members = el);
  }

  addCrewMember(item) {
    this.store.dispatch(new AddCrewMember(item));
  }
  removeCrewMember(item) {
    this.store.dispatch(new RemoveCrewMember(item));
  }

}
