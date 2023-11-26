import { TestBed } from '@angular/core/testing';

import { SalesUserService } from './sales-user.service';

describe('SalesUserService', () => {
  let service: SalesUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
