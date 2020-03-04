import { Component, OnInit } from '@angular/core';
import { CrewState, CrewModel, CrewMemberModel, CrewMember, RemoveCrewMember } from '../store/';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @Select(CrewState.getCrew)
  public crew$: Observable<CrewMemberModel[]>;
  public crew: CrewMemberModel[];

  constructor(private store: Store) {}

  ngOnInit() {
    this.crew$.subscribe(c => {
      this.crew = c;
    });
  }

  RemoveCrewMember(id) {
    console.log('remove id ', id);
    this.store.dispatch(
      new RemoveCrewMember({
        id
      })
    );
  }
}
