// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

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
