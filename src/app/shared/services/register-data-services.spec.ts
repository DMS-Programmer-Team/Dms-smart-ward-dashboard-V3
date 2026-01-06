import { TestBed } from '@angular/core/testing';

import { RegisterDataServices } from './register-data-services';

describe('RegisterDataServices', () => {
  let service: RegisterDataServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterDataServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
