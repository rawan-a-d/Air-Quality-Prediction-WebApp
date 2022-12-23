import { MeteoData } from "./../models/MeteoData";
import { Component, Injectable } from "@angular/core";
import { ZipCode } from "../models/ZipCode";
import {
	MatDateRangeSelectionStrategy,
	DateRange,
	MAT_DATE_RANGE_SELECTION_STRATEGY,
} from "@angular/material/datepicker";
import { AirQuality } from "../models/AirQuality";
import { MatDialog } from "@angular/material/dialog";
import { AppService } from "../services/app.service";
import { DatePipe } from "@angular/common";
import { WeatherService } from "../services/weather.service";
import { AirQualityPredictionDialog } from "../air-quality-prediction-dialog/air-quality-prediction-dialog.component";
import { AirQualityPrediction } from "../models/AirQualityPrediction";
import { NgForm } from "@angular/forms";

export interface DialogData {
	airQualityLevel: "Good" | "Moderate" | "Unhealthy for Sensitive Groups" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
	airQualityLevelNumerical: 0,
	zipcode: "";
	date: "";
}

@Injectable()
export class FiveDayRangeSelectionStrategy implements MatDateRangeSelectionStrategy<string> {
	constructor() { }

	selectionFinished(date: string | null): DateRange<string> {
		return this._createFiveDayRange(date);
	}

	createPreview(activeDate: string | null): DateRange<string> {
		return this._createFiveDayRange(activeDate);
	}

	private _createFiveDayRange(date: string | null): DateRange<any> {
		if (date) {
			const d = new Date(date)
			const day = d.getDay();
			const diff = d.getDate() - day + (day == 0 ? -6 : 1);
			const start = new Date(d.setDate(diff));
			const end = new Date(d.setDate(diff + 6));
			return new DateRange<any>(start, end);
		}

		return new DateRange<string>(null, null);
	}
}

@Component({
	selector: "app-air-quality-weekly-prediction-card",
	templateUrl: "./air-quality-weekly-prediction-card.component.html",
	styleUrls: ["./air-quality-weekly-prediction-card.component.css"],
	providers: [
		{
			provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
			useClass: FiveDayRangeSelectionStrategy,
		},
	],
})

export class AirQualityWeeklyPredictionCardComponent {
	showSpinner = false;

	zipcodes: ZipCode[] = [
		{ value: "5611", viewValue: "5611" },
		{ value: "5612", viewValue: "5612" },
		{ value: "5613", viewValue: "5613" },
		{ value: "5614", viewValue: "5614" },
		{ value: "5615", viewValue: "5615" },
		{ value: "5616", viewValue: "5616" },
		{ value: "5617", viewValue: "5617" },
		{ value: "5621", viewValue: "5621" },
		{ value: "5622", viewValue: "5622" },
		{ value: "5623", viewValue: "5623" },
		{ value: "5624", viewValue: "5624" },
		{ value: "5625", viewValue: "5625" },
		{ value: "5626", viewValue: "5626" },
		{ value: "5627", viewValue: "5627" },
		{ value: "5628", viewValue: "5628" },
		{ value: "5629", viewValue: "5629" },
		{ value: "5631", viewValue: "5631" },
		{ value: "5632", viewValue: "5632" },
		{ value: "5633", viewValue: "5633" },
		{ value: "5641", viewValue: "5641" },
		{ value: "5642", viewValue: "5642" },
		{ value: "5643", viewValue: "5643" },
		{ value: "5644", viewValue: "5644" },
		{ value: "5645", viewValue: "5645" },
		{ value: "5646", viewValue: "5646" },
		{ value: "5651", viewValue: "5651" },
		{ value: "5652", viewValue: "5652" },
		{ value: "5653", viewValue: "5653" },
		{ value: "5654", viewValue: "5654" },
		{ value: "5655", viewValue: "5655" },
		{ value: "5656", viewValue: "5656" },
		{ value: "5657", viewValue: "5657" },
		{ value: "5658", viewValue: "5658" },
	];

	peopleNumber: number = 216; //hard coded
	boundaryLayerHeight: number = 629.35; //hard coded
	model = new AirQuality(new Date(), "5611", this.peopleNumber, new MeteoData(0, 0, 0, this.boundaryLayerHeight));

	constructor(public dialog: MatDialog,
		private appService: AppService,
		private datePipe: DatePipe,
		private weatherService: WeatherService) { }

	ngOnInit(): void {
		// initialize fields with weather data using current date
		this.loadWeeklyWeatherData();
	}

	// load weekly weather data based on start and end date range
	loadWeeklyWeatherData(startDate?, endDate?) {
		var start: string;
		var end: string;

		// if dates are selected
		if (startDate && endDate) {
			start = this.datePipe.transform(startDate.value, "yyyy-MM-dd");
			end = this.datePipe.transform(endDate.value, "yyyy-MM-dd");
		}
		// use current data
		else {
			var fiveDayRangeSelectionStrategy = new FiveDayRangeSelectionStrategy();

			var currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
			var dateRange = fiveDayRangeSelectionStrategy.createPreview(currentDate);

			start = this.datePipe.transform(dateRange.start, "yyyy-MM-dd");
			end = this.datePipe.transform(dateRange.end, "yyyy-MM-dd");
		}

		// get weather data
		this.weatherService.LoadWeatherAPI(start, end).subscribe(
			res => {
				const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

				var meteoData = new MeteoData(average(res.daily.windspeed_10m_max),
					average(res.daily.winddirection_10m_dominant),
					average(res.daily.shortwave_radiation_sum),
					this.boundaryLayerHeight);
				this.model.meteoData = meteoData;
			})

	}

	openDialog(airQualityLevel: string, airQualityLevelNumerical: number) {
		// get dialog class name
		var className = airQualityLevel.split(" ").join("-").toLowerCase();

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
		var formattedDate: string | null = this.datePipe.transform(this.model.date, "yyyy-MM-dd");

		// show spinner
		this.showSpinner = true;

		// get prediction
		this.appService.getPrediction(this.model, formattedDate, "weekly")
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

					console.log("Completed");
				}
			})
	}
}
