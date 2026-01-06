import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromDetailComponent } from './from-detail-component';

describe('FromDetailComponent', () => {
  let component: FromDetailComponent;
  let fixture: ComponentFixture<FromDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
