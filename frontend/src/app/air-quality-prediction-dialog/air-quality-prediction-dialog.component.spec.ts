import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirQualityPredictionDialogComponent } from './air-quality-prediction-dialog.component';

describe('AirQualityPredictionDialogComponent', () => {
  let component: AirQualityPredictionDialogComponent;
  let fixture: ComponentFixture<AirQualityPredictionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirQualityPredictionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirQualityPredictionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
