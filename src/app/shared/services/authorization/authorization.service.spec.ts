import { TestBed } from '@angular/core/testing';

import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('checkIfAuthorized should make isAuthorized$ emit false ', () => {
    const spy = spyOn(service.isAuthorized$, 'next');
    service.checkIfAuthorized();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('checkIfAuthorized should make isAuthorized$ emit true ', () => {
    const spy = spyOn(service.isAuthorized$, 'next');
    localStorage.setItem('authorized', 'true');
    service.checkIfAuthorized();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('authorize method should make isAuthorized$ emit true ', () => {
    const spy = spyOn(service.isAuthorized$, 'next');
    service.authorize('test-token');
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('removeAuthorization method should make isAuthorized$ emit false ', () => {
    const spy = spyOn(service.isAuthorized$, 'next');
    service.removeAuthorization();
    expect(spy).toHaveBeenCalledWith(false);
  });

});
