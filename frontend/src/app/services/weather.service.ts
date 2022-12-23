import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WeatherService {

	constructor(private http: HttpClient) { }

	LoadWeatherAPI(startDate: string, endDate = startDate): Observable<any> {
		return this.http.get("https://api.open-meteo.com/v1/forecast?latitude=51.44&longitude=5.48&hourly=temperature_2m&daily=windspeed_10m_max,winddirection_10m_dominant,shortwave_radiation_sum&timezone=Europe%2FBerlin&start_date=" + startDate + "&end_date=" + endDate);
	}
}
