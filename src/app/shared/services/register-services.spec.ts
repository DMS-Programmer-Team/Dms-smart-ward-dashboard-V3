import { TestBed } from '@angular/core/testing';

import { RegisterServices } from './register-services';

describe('RegisterServices', () => {
  let service: RegisterServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
