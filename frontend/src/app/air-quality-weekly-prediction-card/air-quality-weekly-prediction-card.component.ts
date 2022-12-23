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
import { ZipCodes } from "../models/ZipCodes";

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

	zipcodes: ZipCode[] = ZipCodes.zipCodes;

	peopleNumber: number = 216; //hard coded
	boundaryLayerHeight: number = 629.35; //hard coded
	model = new AirQuality(new Date(), "5611", this.peopleNumber, new MeteoData(0, 0, 0, this.boundaryLayerHeight));

	// start and end dates
	start: string;
	end: string;

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
		// if dates are selected
		if (startDate && endDate) {
			this.start = startDate.value;
			this.end = endDate.value;
		}
		// use current date
		else {
			var fiveDayRangeSelectionStrategy = new FiveDayRangeSelectionStrategy();

			startDate = new Date();
			var startDateFormatted = this.datePipe.transform(startDate, "yyyy-MM-dd");
			var dateRange = fiveDayRangeSelectionStrategy.createPreview(startDateFormatted);

			this.start = dateRange.start;
			this.end = dateRange.end;
		}

		var startFormatted = this.datePipe.transform(this.start, "yyyy-MM-dd");
		var endFormatted = this.datePipe.transform(this.end, "yyyy-MM-dd");

		// update model
		this.model.date = startDate.value || startDate;

		this.getWeeklyWeatherData(startFormatted, endFormatted);
	}

	getWeeklyWeatherData(startFormatted, endFormatted) {
		// get weather data
		this.weatherService.LoadWeatherAPI(startFormatted, endFormatted).subscribe(
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

		var formattedStartDate: string | null = this.datePipe.transform(this.start, "mediumDate")
		var formattedEndDate: string | null = this.datePipe.transform(this.end, "mediumDate")

		this.dialog.open(AirQualityPredictionDialog, {
			data: {
				airQualityLevel: airQualityLevel,
				airQualityLevelNumerical: airQualityLevelNumerical,
				zipcode: this.model.zipcode,
				period: `between ${formattedStartDate} and ${formattedEndDate}`
			},
			panelClass: className,
		});
	}

	getPrediction(form: NgForm) {
		// format date
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
