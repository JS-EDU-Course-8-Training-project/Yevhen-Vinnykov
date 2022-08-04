import { of } from 'rxjs';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { TestBed } from '@angular/core/testing';

const userMock: IExistingUser = {
  id: '1',
  email: 'test-user@example.com',
  password: 'test-password',
  image: '',
  username: 'test-username',
  token: 'test-token',
};

import { AuthorizationService } from './authorization.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

describe('AUTHORIZATION SERVICE', () => {
  let service: AuthorizationService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    service = new AuthorizationService(httpClientSpy, routerSpy);
    localStorage.clear();
  });

  it('checkIfAuthorized() should make isAuthorized$ emit false ', () => {
    const spy = spyOn(service.isAuthorized$, 'next');

    service.checkIfAuthorized();

    expect(spy).toHaveBeenCalledWith(false);
  });

  it('checkIfAuthorized() should make isAuthorized$ emit true ', () => {
    const spy = spyOn(service.isAuthorized$, 'next');

    localStorage.setItem('authorized', 'true');
    service.checkIfAuthorized();

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('authorize() should make isAuthorized$ emit true ', () => {
    const spy = spyOn(service.isAuthorized$, 'next');

    service.authorize(userMock);

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('removeAuthorization() should make isAuthorized$ emit false ', () => {
    const spy = spyOn(service.isAuthorized$, 'next');

    service.removeAuthorization();

    expect(spy).toHaveBeenCalledWith(false);
  });

  it('signIn() should authorize the user', async () => {
    const spy = spyOn(service, 'authorize').and.callThrough();
    httpClientSpy.post.and.returnValue(of({ user: userMock }));

    const user = await service.signIn({
      email: 'user@example.com',
      password: 'Password1',
    });

    expect(user).toEqual(userMock);
    expect(spy).toHaveBeenCalledWith(user);
  });

  it('fetchAuthUser() should authorize the user', () => {
    const spy = spyOn(service, 'authorize');
    httpClientSpy.get.and.returnValue(of({ user: userMock }));

    service.fetchAuthUser().subscribe((user) => {
      expect(user).toEqual(userMock);
      expect(spy).toHaveBeenCalledWith(user);
    });
  });

  it('signOut() should remove authorization', () => {
    const spy = spyOn(service, 'removeAuthorization');

    service.signOut();

    expect(spy).toHaveBeenCalled();
  });
});
