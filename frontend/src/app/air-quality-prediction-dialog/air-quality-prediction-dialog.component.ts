import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../app.component';


@Component({
  selector: 'app-air-quality-prediction-dialog',
  templateUrl: './air-quality-prediction-dialog.component.html',
  styleUrls: ['./air-quality-prediction-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AirQualityPredictionDialog implements OnInit {
  
  image: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.getImageName();
  }
  
  ngOnInit(): void {
  }

  // get image name based on the air quality level
  getImageName(){
    if(this.data.airQualityLevel == 'Good'){
      this.image = 'assets/images/Good.png';
    }
    else if(this.data.airQualityLevel == 'Moderate'){
      this.image = 'assets/images/Moderate.png';
    }
    else if(this.data.airQualityLevel == 'Unhealthy for Sensitive Groups'){
      this.image = 'assets/images/Unhealthy1.png';
    }
    else if(this.data.airQualityLevel == 'Unhealthy'){
      this.image = 'assets/images/Unhealthy2.png';
    }
    else if(this.data.airQualityLevel == 'Very Unhealthy'){
      this.image = 'assets/images/VeryUnhealthy.png';
    }
    else if(this.data.airQualityLevel == 'Hazardous'){
      this.image = 'assets/images/Hazardous.png';
    }
  }


}
