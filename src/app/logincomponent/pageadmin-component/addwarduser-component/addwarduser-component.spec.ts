import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddwarduserComponent } from './addwarduser-component';

describe('AddwarduserComponent', () => {
  let component: AddwarduserComponent;
  let fixture: ComponentFixture<AddwarduserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddwarduserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddwarduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
