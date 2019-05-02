import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../../..//core/services/weather.service';
import { Weatherdata } from '../../../../interfaces/WeatherData';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  public weatherData: Weatherdata[] = [];

  constructor(private weatherService: WeatherService) {}
  getWeatherData(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.weatherData = data;
    });
  }

  ngOnInit() {
    this.getWeatherData();
  }
}
