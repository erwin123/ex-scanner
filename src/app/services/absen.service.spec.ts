import { TestBed, inject } from '@angular/core/testing';

import { AbsenService } from './absen.service';

describe('AbsenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbsenService]
    });
  });

  it('should be created', inject([AbsenService], (service: AbsenService) => {
    expect(service).toBeTruthy();
  }));
});
