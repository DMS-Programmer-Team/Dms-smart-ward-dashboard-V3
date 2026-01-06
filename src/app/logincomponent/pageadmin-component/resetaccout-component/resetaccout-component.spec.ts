import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetaccoutComponent } from './resetaccout-component';

describe('ResetaccoutComponent', () => {
  let component: ResetaccoutComponent;
  let fixture: ComponentFixture<ResetaccoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetaccoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetaccoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
