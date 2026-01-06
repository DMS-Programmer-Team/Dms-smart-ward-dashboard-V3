import { TestBed } from '@angular/core/testing';

import { WardServices } from './ward-services';

describe('WardServices', () => {
  let service: WardServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WardServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
