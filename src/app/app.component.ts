import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { Weatherdata } from '../interfaces/WeatherData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
