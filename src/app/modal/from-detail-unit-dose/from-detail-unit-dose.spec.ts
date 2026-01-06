import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromDetailUnitDose } from './from-detail-unit-dose';

describe('FromDetailUnitDose', () => {
  let component: FromDetailUnitDose;
  let fixture: ComponentFixture<FromDetailUnitDose>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromDetailUnitDose]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromDetailUnitDose);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
