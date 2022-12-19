import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirQualityPredictionCardComponent } from './air-quality-prediction-card.component';

describe('AirQualityPredictionCardComponent', () => {
  let component: AirQualityPredictionCardComponent;
  let fixture: ComponentFixture<AirQualityPredictionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirQualityPredictionCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirQualityPredictionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
