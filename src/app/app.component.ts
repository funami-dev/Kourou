import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select, State, Action, StateContext, Selector } from '@ngxs/store';

import { WeatherService } from './weather.service';
import { CrewService } from './crew.service';
import { Weatherdata } from '../interfaces/WeatherData';
import { AddCrewMember } from './crew.actions';
import { CrewState } from './app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public weatherData: Weatherdata[] = [];
  // @Select(CrewState)
  crew$: Observable<string[]>;

  constructor(private weatherService: WeatherService, private crewService: CrewService, private store: Store) {
    this.crew$ = this.store.select(state => {
      return state.crew;
    });
  }

  getWeatherData(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.weatherData = data;
    });
  }

  // addCrewMember(payload: string) {
  //   console.log('(1)', payload);
  //   this.store.dispatch(new AddCrewMember(payload)).subscribe(setState([...getState(), payload]);
  // }

  @Action(AddCrewMember)
  addCrewMember({ getState, setState }: StateContext<string[]>, { payload }) {
    console.log({ payload });
    setState([...getState(), payload]);
  }

  // addCrewMember(payload) {
  // addCrewMember(payload: string) {
  //   console.log('(component) Add', payload);
  //   this.store.dispatch(new AddCrewMember(payload));
  // }
  // this.crewService.addCrewMember(payload);
  // }

  ngOnInit() {
    this.getWeatherData();
  }
}
