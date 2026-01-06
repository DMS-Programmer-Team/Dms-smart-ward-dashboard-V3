import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dischargecomponent } from './dischargecomponent';

describe('Dischargecomponent', () => {
  let component: Dischargecomponent;
  let fixture: ComponentFixture<Dischargecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dischargecomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dischargecomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
