import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatauserComponent } from './datauser-component';

describe('DatauserComponent', () => {
  let component: DatauserComponent;
  let fixture: ComponentFixture<DatauserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatauserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatauserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
