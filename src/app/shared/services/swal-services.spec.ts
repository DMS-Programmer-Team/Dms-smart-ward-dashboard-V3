import { TestBed } from '@angular/core/testing';

import { SwalServices } from './swal-services';

describe('SwalServices', () => {
  let service: SwalServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwalServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
