import { HttpClient, HttpHeaders } from '@angular/common/http';
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

		//const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

		//return this.http.post(
		//	'http://localhost:8080/order/addtocart',
		//	{ dealerId: 13, createdBy: "-1", productId, quantity },
		//	{ headers, responseType: 'text' }
		//).pipe(catchError(this.errorHandlerService.handleError));

		//return this.httpClient.get(`${this.url}?date=${formattedDate}&zipcode=${airQuality.zipcode}&peopleNumber=${airQuality.peopleNumber}&windSpeed=${airQuality.windSpeed}&windDirection=${airQuality.windDirection}&sunRadiation=${airQuality.sunRadiation}&boundaryLayerHeight=${airQuality.boundaryLayerHeight}`,
		//	{ headers, responseType: 'text' })
		//	.pipe(
		//		map(
		//			response => response
		//		)
		//	)

		//this.http.get(Path).map(res => res.text()).subscribe(res => this.localVar = res);

	}
}
