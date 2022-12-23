import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AirQualityPredictionDialog } from "../air-quality-prediction-dialog/air-quality-prediction-dialog.component";
import { AirQuality } from "../models/AirQuality";
import { AirQualityPrediction } from "../models/AirQualityPrediction";
import { MeteoData } from "../models/MeteoData";
import { ZipCode } from "../models/ZipCode";
import { ZipCodes } from "../models/ZipCodes";
import { AppService } from "../services/app.service";
import { WeatherService } from "../services/weather.service";

@Component({
	selector: "app-air-quality-prediction-card",
	templateUrl: "./air-quality-prediction-card.component.html",
	styleUrls: ["./air-quality-prediction-card.component.css"]
})
export class AirQualityPredictionCardComponent {
	showSpinner = false;

	zipcodes: ZipCode[] = ZipCodes.zipCodes;

	peopleNumber: number = 216; //hard coded
	boundaryLayerHeight: number = 629.35; //hard coded
	model = new AirQuality(new Date(), "5611", this.peopleNumber, new MeteoData(0, 0, 0, this.boundaryLayerHeight));

	constructor(public dialog: MatDialog,
		private appService: AppService,
		private datePipe: DatePipe,
		private weatherService: WeatherService) { }

	ngOnInit(): void {
		// initialize fields with weather data using current date
		this.loadWeatherData();
	}

	loadWeatherData(event?) {
		var date = new Date();
		if (event) {
			date = event.value;
		}

		var formattedDate: string | null = this.datePipe.transform(date, "yyyy-MM-dd")
		this.weatherService.LoadWeatherAPI(formattedDate).subscribe(
			res => {
				console.log(res.daily)
				var meteoData = new MeteoData(res.daily.windspeed_10m_max[0], res.daily.winddirection_10m_dominant[0], res.daily.shortwave_radiation_sum[0], this.boundaryLayerHeight);
				this.model.meteoData = meteoData;
			})
	}

	openDialog(airQualityLevel: string, airQualityLevelNumerical: number) {
		// get dialog class name
		var className = airQualityLevel.split(" ").join("-").toLowerCase();

		var formattedDate: string | null = this.datePipe.transform(this.model.date, "longDate")

		this.dialog.open(AirQualityPredictionDialog, {
			data: {
				airQualityLevel: airQualityLevel,
				airQualityLevelNumerical: airQualityLevelNumerical,
				zipcode: this.model.zipcode,
				period: `on ${formattedDate}`
			},
			panelClass: className,
		});
	}

	getPrediction(form: NgForm) {
		var formattedDate: string | null = this.datePipe.transform(this.model.date, "yyyy-MM-dd");

		// show spinner
		this.showSpinner = true;

		// get prediction
		this.appService.getPrediction(this.model, formattedDate, "daily")
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
					//form.reset();
					this.loadWeatherData();
					this.model.date = new Date();

					console.log("Completed");
				}
			})
	}
}
