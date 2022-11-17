import { TestBed } from '@angular/core/testing';

import { AuthGuardAllUserService } from './auth-guard-all-user.service';

describe('AuthGuardAllUserService', () => {
  let service: AuthGuardAllUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardAllUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
