import { TestBed, inject } from '@angular/core/testing';

import { SendNotifyService } from './send-notify.service';

describe('SendNotifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SendNotifyService]
    });
  });

  it('should be created', inject([SendNotifyService], (service: SendNotifyService) => {
    expect(service).toBeTruthy();
  }));
});
