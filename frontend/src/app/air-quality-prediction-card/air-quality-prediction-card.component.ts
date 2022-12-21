import { DatePipe } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { AirQualityPredictionDialog } from '../air-quality-prediction-dialog/air-quality-prediction-dialog.component';
import { AirQuality } from '../models/AirQuality';
import { AirQualityPrediction } from '../models/AirQualityPrediction';
import { MeteoData } from '../models/MeteoData';
import { AppService } from '../services/app.service';
import { WeatherService } from '../services/weather.service';

export interface DialogData {
	airQualityLevel: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
	airQualityLevelNumerical: 0,
	zipcode: '';
	date: '';
}

// import {DateAdapter} from '@angular/material/core';
// import {
//   MatDateRangeSelectionStrategy,
//   DateRange,
//   MAT_DATE_RANGE_SELECTION_STRATEGY,
// } from '@angular/material/datepicker';

//should be moved to interface folder later
interface ZipCode {
	value: string;
	viewValue: string;
}

//@Injectable()
// Could be removed to a class folder
// export class FiveDayRangeSelectionStrategy implements MatDateRangeSelectionStrategy<string> {
//   constructor(private _dateAdapter: DateAdapter<string>) {}

//   selectionFinished(date: string | null): DateRange<string> {
//     return this._createFiveDayRange(date);
//   }

//   createPreview(activeDate: string | null): DateRange<string> {
//     return this._createFiveDayRange(activeDate);
//   }

//   private _createFiveDayRange(date: string | null): DateRange<any> {
//     if (date) {
//       const d = new Date(date)
//       const day = d.getDay();
//       const diff = d.getDate() - day + (day == 0 ? -6 : 1);
//       const start = new Date(d.setDate(diff));
//       const end = new Date(d.setDate(diff + 6));
//       return new DateRange<any>(start, end);
//     }

//     return new DateRange<string>(null, null);
//   }
// }

@Component({
	selector: 'app-air-quality-prediction-card',
	templateUrl: './air-quality-prediction-card.component.html',
	styleUrls: ['./air-quality-prediction-card.component.css']
})
export class AirQualityPredictionCardComponent {
	showSpinner = false;

	zipcodes: ZipCode[] = [
		{ value: '5611', viewValue: '5611' },
		{ value: '5612', viewValue: '5612' },
		{ value: '5613', viewValue: '5613' },
		{ value: '5614', viewValue: '5614' },
		{ value: '5615', viewValue: '5615' },
		{ value: '5616', viewValue: '5616' },
		{ value: '5617', viewValue: '5617' },
		{ value: '5621', viewValue: '5621' },
		{ value: '5622', viewValue: '5622' },
		{ value: '5623', viewValue: '5623' },
		{ value: '5624', viewValue: '5624' },
		{ value: '5625', viewValue: '5625' },
		{ value: '5626', viewValue: '5626' },
		{ value: '5627', viewValue: '5627' },
		{ value: '5628', viewValue: '5628' },
		{ value: '5629', viewValue: '5629' },
		{ value: '5631', viewValue: '5631' },
		{ value: '5632', viewValue: '5632' },
		{ value: '5633', viewValue: '5633' },
		{ value: '5641', viewValue: '5641' },
		{ value: '5642', viewValue: '5642' },
		{ value: '5643', viewValue: '5643' },
		{ value: '5644', viewValue: '5644' },
		{ value: '5645', viewValue: '5645' },
		{ value: '5646', viewValue: '5646' },
		{ value: '5651', viewValue: '5651' },
		{ value: '5652', viewValue: '5652' },
		{ value: '5653', viewValue: '5653' },
		{ value: '5654', viewValue: '5654' },
		{ value: '5655', viewValue: '5655' },
		{ value: '5656', viewValue: '5656' },
		{ value: '5657', viewValue: '5657' },
		{ value: '5658', viewValue: '5658' },
	];

	model = new AirQuality(new Date(), '', 0, 0, 0, 0, 0);
	peopleNumber: number = 216; //hard coded
	boundaryLayerHeight: number = 629.35; //hard coded
	meteoData = new MeteoData(0, 0, 0);

	constructor(public dialog: MatDialog,
		private appService: AppService,
		private datePipe: DatePipe,
		private weatherService: WeatherService) { }

	ngOnInit(): void {
	}

	loadWeatherData(event) {
		var formattedDate: string | null = this.datePipe.transform(event.value, 'yyyy-MM-dd')
		this.weatherService.LoadWeatherAPI(formattedDate).subscribe(
			res => {
				this.meteoData = new MeteoData(res.daily.windspeed_10m_max, res.daily.winddirection_10m_dominant, res.daily.shortwave_radiation_sum);
			})
	}

	openDialog(airQualityLevel: string, airQualityLevelNumerical: number) {
		// get dialog class name
		var className = airQualityLevel.split(' ').join('-').toLowerCase();

		this.dialog.open(AirQualityPredictionDialog, {
			data: {
				airQualityLevel: airQualityLevel,
				airQualityLevelNumerical: airQualityLevelNumerical,
				zipcode: this.model.zipcode,
				date: this.model.date,
			},
			panelClass: className,
		});
	}

	getPrediction(form: NgForm) {
		//airQualityLevel: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
		//var airQualityLevel = 'Good';
		//var airQualityLevelNumerical = 7.9;
		var formattedDate: string | null = this.datePipe.transform(this.model.date, 'yyyy-MM-dd');

		// show spinner
		this.showSpinner = true;

		//this.openDialog(airQualityLevel, airQualityLevelNumerical);

		// get prediction
		this.appService.getPrediction(this.model, formattedDate)
			.subscribe({
				next: (data: AirQualityPrediction) => {
					console.log(data);
					// open dialog
					this.openDialog(data.airQualityLevel, data.airQualityLevelNumerical);
				},
				error: (e) => {
					console.log(e);
				},
				complete: () => {
					// hide spinner
					this.showSpinner = false;

					// reset form
					form.reset();

					console.log('Completed');
				}
			})
	}
}
