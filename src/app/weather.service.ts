import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Weatherdata } from '../interfaces/WeatherData';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}
  WEATHER_API_URL = environment.WEATHER_API_URL;

  public getWeatherData(): Observable<any[]> {
    // const { prefix, base, cityId, key } = this.WEATHER_API_URL;
    // const _url = `${prefix}${base}?id=${cityId}&appid=${key}`;
    const _url = `http://localhost:3000/weather`;
    return this.http.get<Weatherdata[]>(_url);
  }
}
