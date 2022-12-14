import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AirQualityPredictionDialog } from './air-quality-prediction-dialog/air-quality-prediction-dialog.component';

export interface DialogData {
  airQualityLevel: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
}

// import {DateAdapter} from '@angular/material/core';
// import {
//   MatDateRangeSelectionStrategy,
//   DateRange,
//   MAT_DATE_RANGE_SELECTION_STRATEGY,
// } from '@angular/material/datepicker';

//should be moved to interface folder later
interface ZipCode {
  value: string;
  viewValue: string;
}

@Injectable()
// Could be removed to a class folder
// export class FiveDayRangeSelectionStrategy implements MatDateRangeSelectionStrategy<string> {
//   constructor(private _dateAdapter: DateAdapter<string>) {}

//   selectionFinished(date: string | null): DateRange<string> {
//     return this._createFiveDayRange(date);
//   }

//   createPreview(activeDate: string | null): DateRange<string> {
//     return this._createFiveDayRange(activeDate);
//   }

//   private _createFiveDayRange(date: string | null): DateRange<any> {
//     if (date) {
//       const d = new Date(date)
//       const day = d.getDay();
//       const diff = d.getDate() - day + (day == 0 ? -6 : 1);
//       const start = new Date(d.setDate(diff));
//       const end = new Date(d.setDate(diff + 6));
//       return new DateRange<any>(start, end);
//     }

//     return new DateRange<string>(null, null);
//   }
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [
    // {
    //   provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    //   useClass: FiveDayRangeSelectionStrategy,
    // },
  ],
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  zipcodes: ZipCode[] = [
    {value: '5611', viewValue: '5611'},
    {value: '5612', viewValue: '5612'},
    {value: '5613', viewValue: '5613'},
    {value: '5614', viewValue: '5614'},
    {value: '5615', viewValue: '5615'},
    {value: '5616', viewValue: '5616'},
    {value: '5617', viewValue: '5617'},
    {value: '5621', viewValue: '5621'},
    {value: '5622', viewValue: '5622'},
    {value: '5623', viewValue: '5623'},
    {value: '5624', viewValue: '5624'},
    {value: '5625', viewValue: '5625'},
    {value: '5626', viewValue: '5626'},
    {value: '5627', viewValue: '5627'},
    {value: '5628', viewValue: '5628'},
    {value: '5629', viewValue: '5629'},
    {value: '5631', viewValue: '5631'},
    {value: '5632', viewValue: '5632'},
    {value: '5633', viewValue: '5633'},
    {value: '5641', viewValue: '5641'},
    {value: '5642', viewValue: '5642'},
    {value: '5643', viewValue: '5643'},
    {value: '5644', viewValue: '5644'},
    {value: '5645', viewValue: '5645'},
    {value: '5646', viewValue: '5646'},
    {value: '5651', viewValue: '5651'},
    {value: '5652', viewValue: '5652'},
    {value: '5653', viewValue: '5653'},
    {value: '5654', viewValue: '5654'},
    {value: '5655', viewValue: '5655'},
    {value: '5656', viewValue: '5656'},
    {value: '5657', viewValue: '5657'},
    {value: '5658', viewValue: '5658'},
  ];

  className: string = '';
  airQualityLevel: string = 'Unhealthy for Sensitive Groups';

  constructor(public dialog: MatDialog) {}
  
  ngOnInit(): void {
    // get the air quality levels
    this.className = this.airQualityLevel.split(' ').join('-').toLowerCase();
    console.log('Class Name:' + this.className)
  }

  openDialog() {
    this.dialog.open(AirQualityPredictionDialog, {
      data: {
        airQualityLevel: this.airQualityLevel,
      },
     panelClass: this.className,
    });
  }
}
