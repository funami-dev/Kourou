import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { WeatherService } from './weather.service';
import { Weatherdata } from '../interfaces/WeatherData';
import { CrewStateModel } from 'src/store/crew.state';
import { AddCrewMember, RemoveCrewMember } from 'src/store/crew.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public weatherData: Weatherdata[] = [];
  @Select()
  crew$: Observable<CrewStateModel[]>;

  constructor(private weatherService: WeatherService, private store: Store) {}

  getWeatherData(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.weatherData = data;
    });
  }

  addCrewMember(member) {
    this.store.dispatch(new AddCrewMember(member));
  }

  removeCrewMember(id) {
    this.store.dispatch(new RemoveCrewMember(id));
  }

  ngOnInit() {
    this.getWeatherData();
  }
}
