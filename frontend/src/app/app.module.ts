import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AirQualityPredictionDialog } from './air-quality-prediction-dialog/air-quality-prediction-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MapComponent } from './map/map.component';

//import { FusionChartsModule } from 'angular-fusioncharts';

//// Import FusionCharts library and chart modules
//import * as FusionCharts from 'fusioncharts';
//import * as charts from "fusioncharts/fusioncharts.charts";

//import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

//import { Charts } from 'fusioncharts/fusioncharts';

// Import angular2-fusioncharts
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';

// Pass the fusioncharts library and chart modules
//FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);
//FusionChartsModule.forRoot(FusionCharts, charts, FusionTheme);

//import * as PlotlyJS from 'plotly.js/dist/plotly.js';
//import { PlotlyModule } from 'angular-plotly.js';
//// We have to supply the plotly.js module to the Angular
//// library.
//PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
	declarations: [
		AppComponent,
		AirQualityPredictionDialog,
		MapComponent
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
		//FusionChartsModule.forRoot(FusionCharts, Charts, Widgets),
		//AgmCoreModule.forRoot({
		//	// please get your own API key here:
		//	// https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
		//	apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw'
		//})
		//PlotlyModule
		//FusionChartsModule.forRoot(FusionCharts, charts, FusionTheme)
	],
	providers: [DatePipe],
	bootstrap: [AppComponent]
})
export class AppModule { }

