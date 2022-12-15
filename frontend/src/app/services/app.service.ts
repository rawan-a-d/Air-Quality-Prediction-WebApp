import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AirQuality } from '../models/AirQuality';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	url: string = "http://127.0.0.1:5000"
	constructor(private httpClient: HttpClient) { }

	getPrediction(airQuality: AirQuality, formattedDate: string | null) {
		return this.httpClient.get(`${this.url}?date=${formattedDate}&zipcode=${airQuality.zipcode}&peopleNumber=${airQuality.peopleNumber}&windSpeed=${airQuality.windSpeed}&windDirection=${airQuality.windDirection}&sunRadiation=${airQuality.sunRadiation}&boundaryLayerHeight=${airQuality.boundaryLayerHeight}`)
			.pipe(
				map(
					response => response
				)
			)
	}
}
