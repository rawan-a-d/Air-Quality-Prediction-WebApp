import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirQualityPredictionDialog } from './air-quality-prediction-dialog.component';

describe('AirQualityPredictionDialogComponent', () => {
	let component: AirQualityPredictionDialog;
	let fixture: ComponentFixture<AirQualityPredictionDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AirQualityPredictionDialog]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AirQualityPredictionDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
