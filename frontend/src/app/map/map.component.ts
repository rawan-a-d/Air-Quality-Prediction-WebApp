import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../services/app.service';
import { ColorsService } from '../services/colors.service';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
	@ViewChild("map")
	public map: IgxGeographicMapComponent;

	@ViewChild("cityTooltipTemplate")
	public cityTooltip: TemplateRef<object>;

	@ViewChild('canvas')
	public canvas: ElementRef<HTMLCanvasElement>;

	@ViewChild("legend", { static: true })
	private legend: IgxDataLegendComponent

	constructor(private colorsService: ColorsService) {
	}

	ngAfterViewInit(): void {
		// set zoom level
		this.map.zoomToGeographic({
			left: WorldLocations.getAll()[0].lon - 0.08,
			top: WorldLocations.getAll()[0].lat - 0.04,
			width: 0.1,
			height: 0.1
		});

		// get min and max pollution in the data
		var min = Math.min(...WorldLocations.getAll().map(item => item.pollution));
		var max = Math.max(...WorldLocations.getAll().map(item => item.pollution));

		// loop over zipcodes and display them
		WorldLocations.getAll().forEach(element => {
			// set color
			var colorPercentage = this.normalizeDataBetweenRange(min, max, element.pollution, 1);
			var colors = this.colorService.evaluate_cmap(colorPercentage, 'brg', true)
			var colorRgb = 'rgb(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ')';

			// set size (between 0 and 10)
			var size = this.normalizeDataBetweenRange(min, max, element.pollution, 10);

			// add element to map
			this.addSeriesWith([element], colorRgb, size);
		});

		let ctx = this.canvas.nativeElement.getContext("2d");
		for (let x = 0; x <= 256; x++) {
			let color = this.colorsService.evaluate_cmap(x / 256, "brg", false);
			let r = color[0];
			let g = color[1];
			let b = color[2];
			ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
			//ctx.fillRect(x * this.canvas.nativeElement.width / 256, 0, this.canvas.nativeElement.width / 256, this.canvas.nativeElement.height);
			ctx.fillRect(0, x * this.canvas.nativeElement.height / 256, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
		}

	}

	addSeriesWith(locations: any[], brush: string, size: number) {
		var symbolSeries = new IgxGeographicSymbolSeriesComponent();
		symbolSeries.dataSource = locations;
		symbolSeries.markerType = MarkerType.Circle;
		symbolSeries.latitudeMemberPath = "lat";
		symbolSeries.longitudeMemberPath = "lon";
		symbolSeries.markerBrush = brush;
		symbolSeries.markerOutline = brush;
		//symbolSeries.markerFillMode = MarkerFillMode.MatchMarkerOutline;
		//symbolSeries.thickness = size;
		symbolSeries.markerThickness = size;
		symbolSeries.tooltipTemplate = this.cityTooltip;
		this.map.series.add(symbolSeries);
	}

	normalizeDataBetweenRange(min: number, max: number, value: number, maxNumber: number) {
		return (value - min) / (max - min) * maxNumber;
	}
}
