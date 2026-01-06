import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inpatientcomponent } from './inpatientcomponent';

describe('Inpatientcomponent', () => {
  let component: Inpatientcomponent;
  let fixture: ComponentFixture<Inpatientcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inpatientcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inpatientcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
