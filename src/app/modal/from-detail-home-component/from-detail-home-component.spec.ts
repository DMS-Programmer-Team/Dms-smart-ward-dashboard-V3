import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromDetailHomeComponent } from './from-detail-home-component';

describe('FromDetailHomeComponent', () => {
  let component: FromDetailHomeComponent;
  let fixture: ComponentFixture<FromDetailHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromDetailHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromDetailHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
