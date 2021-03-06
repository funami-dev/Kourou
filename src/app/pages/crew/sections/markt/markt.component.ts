import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PersonModel, CrewState, AddCrewMember, RemoveCrewMember } from 'src/store';

@Component({
  selector: 'app-markt',
  templateUrl: './markt.component.html',
  styleUrls: ['./markt.component.css']
})
export class MarktComponent implements OnInit {
  @Select(CrewState.getTalents) team$: Observable<PersonModel[]>;
  talents: PersonModel[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.team$.subscribe(el => this.talents = el );
  }

  addCrewMember(item: PersonModel) {
    this.store.dispatch(new AddCrewMember(item));
  }
  removeCrewMember(item: PersonModel) {
    this.store.dispatch(new RemoveCrewMember(item));
  }

}
