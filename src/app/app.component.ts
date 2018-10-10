import { Component } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private weatherService: WeatherService) {}

  weatherData = {};

  getWeatherData(): void {
    this.weatherService.getWeatherData().subscribe(data => (this.weatherData = { ...data }));
  }

  ngOnInit() {
    this.getWeatherData();
  }
}
