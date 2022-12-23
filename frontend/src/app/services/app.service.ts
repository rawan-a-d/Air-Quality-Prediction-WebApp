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

	getPrediction(airQuality: AirQuality, formattedDate: string | null, type: string) {
		return this.httpClient.get(`${this.url}?type=${type}&date=${formattedDate}&zipcode=${airQuality.zipcode}&peopleNumber=${airQuality.peopleNumber}&windSpeed=${airQuality.meteoData.windSpeed}&windDirection=${airQuality.meteoData.windDirection}&sunRadiation=${airQuality.meteoData.sunRadiation}&boundaryLayerHeight=${airQuality.meteoData.boundaryLayerHeight}`)
			.pipe(
				map(
					response => response
				)
			)
	}

	getMap(formattedDate: string) {
		return this.httpClient.get(`${this.url}/map?date=${formattedDate}`)
			.pipe(
				map(
					response => response
				)
			)
	}
}
