import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../services/app.service';
import { ColorsService } from '../services/colors.service';
import { MapItem } from '../models/MapItem';
import { IgxGeographicMapComponent, IgxGeographicSymbolSeriesComponent } from 'igniteui-angular-maps';
import { MarkerType } from 'igniteui-angular-charts';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {
	@ViewChild("map")
	public map: IgxGeographicMapComponent;

	@ViewChild("cityTooltipTemplate")
	public cityTooltip: TemplateRef<object>;

	@ViewChild('canvas')
	public canvas: ElementRef<HTMLCanvasElement>;

	mapItems: MapItem[] = [];

	constructor(private colorsService: ColorsService,
		private appSerivce: AppService) {
	}

	ngOnInit(): void {
		// get map items
		this.appSerivce.getMap("2021-09-25")
			.subscribe(data => {
				this.mapItems = <MapItem[]>data;

				this.setUpMap();
			})
	}

	ngAfterViewInit(): void {

	}

	// setup map
	setUpMap() {
		// set zoom level
		this.map.zoomToGeographic({
			left: this.mapItems[0].long - 0.08,
			top: this.mapItems[0].lat - 0.04,
			width: 0.1,
			height: 0.1
		});

		// get min and max pollution in the data
		var min = Math.min(...this.mapItems.map(item => item.pollution));
		var max = Math.max(...this.mapItems.map(item => item.pollution));

		// loop over zipcodes and display them
		this.mapItems.forEach(element => {
			// set color
			var colorPercentage = this.normalizeDataBetweenRange(min, max, element.pollution, 1);
			var colors = this.colorsService.evaluate_cmap(colorPercentage, 'plasma', true)
			var colorRgb = 'rgb(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ')';

			// set size (between 0 and 10)
			var size = this.normalizeDataBetweenRange(min, max, element.pollution, 10);

			// add element to map
			this.addSeriesWith([element], colorRgb, size);
		});

		let ctx = this.canvas.nativeElement.getContext("2d");
		for (let x = 0; x <= 256; x++) {
			let color = this.colorsService.evaluate_cmap(x / 256, "plasma", false);
			let r = color[0];
			let g = color[1];
			let b = color[2];
			ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
			//ctx.fillRect(x * this.canvas.nativeElement.width / 256, 0, this.canvas.nativeElement.width / 256, this.canvas.nativeElement.height);
			ctx.fillRect(0, x * this.canvas.nativeElement.height / 256, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
		}
	}

	// add items to map
	addSeriesWith(locations: any[], brush: string, size: number) {
		var symbolSeries = new IgxGeographicSymbolSeriesComponent();
		symbolSeries.dataSource = locations;
		symbolSeries.markerType = MarkerType.Circle;
		symbolSeries.latitudeMemberPath = "lat";
		symbolSeries.longitudeMemberPath = "long";
		symbolSeries.markerBrush = brush;
		symbolSeries.markerOutline = brush;
		//symbolSeries.markerFillMode = MarkerFillMode.MatchMarkerOutline;
		//symbolSeries.thickness = size;
		symbolSeries.markerThickness = size;
		symbolSeries.tooltipTemplate = this.cityTooltip;
		this.map.series.add(symbolSeries);
	}

	// normalize data between two numbers (0 and maxNumber)
	normalizeDataBetweenRange(min: number, max: number, value: number, maxNumber: number) {
		return (value - min) / (max - min) * maxNumber;
	}
}
