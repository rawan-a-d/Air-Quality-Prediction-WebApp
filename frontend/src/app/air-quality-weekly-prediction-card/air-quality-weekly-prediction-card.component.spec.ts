import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirQualityWeeklyPredictionCardComponent } from './air-quality-weekly-prediction-card.component';

describe('AirQualityWeeklyPredictionCardComponent', () => {
  let component: AirQualityWeeklyPredictionCardComponent;
  let fixture: ComponentFixture<AirQualityWeeklyPredictionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirQualityWeeklyPredictionCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirQualityWeeklyPredictionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
