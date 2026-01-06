import { TestBed } from '@angular/core/testing';

import { DashboarServices } from './dashboar-services';

describe('DashboarServices', () => {
  let service: DashboarServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboarServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
