import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../air-quality-prediction-card/air-quality-prediction-card.component";

@Component({
	selector: "app-air-quality-prediction-dialog",
	templateUrl: "./air-quality-prediction-dialog.component.html",
	styleUrls: ["./air-quality-prediction-dialog.component.css"],
	encapsulation: ViewEncapsulation.None
})
export class AirQualityPredictionDialog implements OnInit {

	image: string = "";

	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
		this.getImageName();
	}

	ngOnInit(): void {
	}

	// get image name based on the air quality level
	getImageName() {
		this.image = "assets/images/";
		if (this.data.airQualityLevel == "Good") {
			this.image += "Good.png";
		}
		else if (this.data.airQualityLevel == "Moderate") {
			this.image += "Moderate.png";
		}
		else if (this.data.airQualityLevel == "Unhealthy for Sensitive Groups") {
			this.image += "Unhealthy1.png";
		}
		else if (this.data.airQualityLevel == "Unhealthy") {
			this.image += "Unhealthy2.png";
		}
		else if (this.data.airQualityLevel == "Very Unhealthy") {
			this.image += "VeryUnhealthy.png";
		}
		else if (this.data.airQualityLevel == "Hazardous") {
			this.image += "Hazardous.png";
		}
	}
}
