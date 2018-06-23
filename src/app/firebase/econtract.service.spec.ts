import { TestBed, inject } from '@angular/core/testing';

import { EcontractService } from './econtract.service';

describe('EcontractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcontractService]
    });
  });

  it('should be created', inject([EcontractService], (service: EcontractService) => {
    expect(service).toBeTruthy();
  }));
});
