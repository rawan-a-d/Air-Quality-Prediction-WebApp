import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AirQualityPredictionDialog } from "./air-quality-prediction-dialog/air-quality-prediction-dialog.component";
import { HttpClientModule } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { MapComponent } from "./map/map.component";
import { IgxDataChartInteractivityModule } from "igniteui-angular-charts";
import { IgxGeographicMapModule } from "igniteui-angular-maps";
import { AirQualityPredictionCardComponent } from './air-quality-prediction-card/air-quality-prediction-card.component';

@NgModule({
	declarations: [
		AppComponent,
		AirQualityPredictionDialog,
		MapComponent,
		AirQualityPredictionCardComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		MatCardModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		MatSnackBarModule,
		IgxDataChartInteractivityModule,
		IgxGeographicMapModule
	],
	providers: [DatePipe],
	bootstrap: [AppComponent]
})
export class AppModule {
}
