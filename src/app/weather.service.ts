import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}
  WEATHER_API_URL = environment.WEATHER_API_URL;

  public getWeatherData() {
    const { prefix, base, cityId, key } = this.WEATHER_API_URL;
    return this.http.get(`${prefix}${base}?id=${cityId}&appid=${key}`);
  }
}
