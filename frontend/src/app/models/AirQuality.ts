
import { MeteoData } from "./MeteoData";

export class AirQuality {
	constructor(
		public date: Date,
		public zipcode: string,
		public peopleNumber: number,
		public meteoData: MeteoData
	) { }
}
