import { TestBed, inject } from '@angular/core/testing';

import { SilkQueryService } from './silk-query.service';

describe('SilkQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SilkQueryService]
    });
  });

  it('should be created', inject([SilkQueryService], (service: SilkQueryService) => {
    expect(service).toBeTruthy();
  }));
});
