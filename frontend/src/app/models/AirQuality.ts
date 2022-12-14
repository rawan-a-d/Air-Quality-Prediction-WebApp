export class AirQuality {
	constructor(
		public date: Date,
		public zipcode: string,
		public peopleNumber: number,
		public windSpeed: number,
		public windDirection: number,
		public sunRadiation: number,
		public boundaryLayerHeight: number,
	) { }

}
